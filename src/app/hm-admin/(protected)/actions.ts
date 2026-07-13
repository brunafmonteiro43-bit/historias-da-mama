'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/hm-admin-auth';
import { slugify } from '@/lib/utils';

const storySchema = z.object({
  ageRange: z.string().min(1),
  author: z.string().min(2),
  category: z.string().min(1),
  description: z.string().min(10),
  fullDescription: z.string().optional(),
  hasColoringVersion: z.boolean(),
  isFeatured: z.boolean(),
  isStoryOfWeek: z.boolean(),
  readingMinutes: z.coerce.number().int().min(1).max(60),
  status: z.enum(['draft', 'published']),
  theme: z.string().min(2),
  title: z.string().min(3),
});

const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
const pdfTypes = ['application/pdf'];
const imageLimit = 8 * 1024 * 1024;
const pdfLimit = 50 * 1024 * 1024;

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function getBool(formData: FormData, key: string) {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function getFiles(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);
}

function validateFile(file: File, allowedTypes: string[], limit: number, label: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label} deve ser PNG, JPG, WEBP ou PDF.`);
  }

  if (file.size > limit) {
    throw new Error(`${label} ultrapassa o tamanho permitido.`);
  }
}

async function uploadFile(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  file: File,
  storyId: string,
  bucket: 'story-covers' | 'story-pages' | 'story-pdfs',
  folder: string,
) {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const path = `${storyId}/${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    throw new Error(`Falha ao enviar ${file.name}.`);
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function getOrCreateAuthor(supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'], name: string) {
  const { data: existing } = await supabase.from('authors').select('id').eq('name', name).maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase.from('authors').insert({ name }).select('id').single();

  if (error || !data) {
    throw new Error('NÃ£o foi possÃ­vel salvar o autor.');
  }

  return data.id;
}

async function getOrCreateCategory(supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'], name: string) {
  const { data: existing } = await supabase.from('categories').select('id').eq('name', name).maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({ description: '', name, slug: slugify(name) })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('NÃ£o foi possÃ­vel salvar a categoria.');
  }

  return data.id;
}

export async function saveStoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');
  const input = storySchema.parse({
    ageRange: getString(formData, 'ageRange'),
    author: getString(formData, 'author'),
    category: getString(formData, 'category'),
    description: getString(formData, 'description'),
    fullDescription: getString(formData, 'fullDescription'),
    hasColoringVersion: getBool(formData, 'hasColoringVersion'),
    isFeatured: getBool(formData, 'isFeatured'),
    isStoryOfWeek: getBool(formData, 'isStoryOfWeek'),
    readingMinutes: getString(formData, 'readingMinutes'),
    status: getString(formData, 'status') || 'draft',
    theme: getString(formData, 'theme'),
    title: getString(formData, 'title'),
  });

  const authorId = await getOrCreateAuthor(supabase, input.author);
  const categoryId = await getOrCreateCategory(supabase, input.category);
  const now = new Date().toISOString();
  const payload = {
    age_range: input.ageRange,
    author_id: authorId,
    category_id: categoryId,
    description: input.description,
    full_description: input.fullDescription || input.description,
    has_coloring_version: input.hasColoringVersion,
    is_featured: input.isFeatured,
    is_story_of_week: input.isStoryOfWeek,
    published_at: input.status === 'published' ? now : null,
    reading_time_minutes: input.readingMinutes,
    slug: slugify(input.title),
    status: input.status,
    theme: input.theme,
    title: input.title,
    updated_at: now,
  };

  const response = id
    ? await supabase.from('stories').update(payload).eq('id', id).select('id').single()
    : await supabase.from('stories').insert(payload).select('id').single();

  if (response.error || !response.data) {
    throw new Error('NÃ£o foi possÃ­vel salvar a história.');
  }

  const storyId = response.data.id;
  const cover = getFile(formData, 'cover');
  const pdf = getFile(formData, 'storyPdf');
  const pageFiles = getFiles(formData, 'pageImages');

  const fileUpdates: Record<string, string> = {};

  if (cover) {
    validateFile(cover, imageTypes, imageLimit, 'A capa');
    fileUpdates.cover_url = await uploadFile(supabase, cover, storyId, 'story-covers', 'cover');
  }

  if (pdf) {
    validateFile(pdf, pdfTypes, pdfLimit, 'O PDF');
    fileUpdates.pdf_url = await uploadFile(supabase, pdf, storyId, 'story-pdfs', 'pdf');
  }

  if (Object.keys(fileUpdates).length > 0) {
    await supabase.from('stories').update(fileUpdates).eq('id', storyId);
  }

  const pageTexts = formData
    .getAll('pageText')
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);

  if (pageTexts.length > 0 || pageFiles.length > 0) {
    const uploadedPages: Array<string | null> = [];

    for (const file of pageFiles) {
      validateFile(file, imageTypes, imageLimit, 'A pÃ¡gina');
      uploadedPages.push(await uploadFile(supabase, file, storyId, 'story-pages', 'pages'));
    }

    await supabase.from('story_pages').delete().eq('story_id', storyId);
    const pageCount = Math.max(pageTexts.length, uploadedPages.length);
    const pages = Array.from({ length: pageCount }, (_, index) => ({
      content: pageTexts[index] ?? '',
      image_url: uploadedPages[index] ?? null,
      page_number: index + 1,
      story_id: storyId,
    }));

    if (pages.length > 0) {
      const { error } = await supabase.from('story_pages').insert(pages);

      if (error) {
        throw new Error('NÃ£o foi possÃ­vel salvar as pÃ¡ginas da história.');
      }
    }
  }

  revalidatePath('/hm-admin/dashboard');
  revalidatePath('/hm-admin/stories');
  revalidatePath('/');
  revalidatePath('/biblioteca');
  revalidatePath(`/historias/${payload.slug}`);
  revalidatePath(`/historias/${payload.slug}/ler`);
  redirect('/hm-admin/stories');
}

export async function toggleStoryStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');
  const nextStatus = getString(formData, 'status') === 'published' ? 'published' : 'draft';

  await supabase
    .from('stories')
    .update({
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  revalidatePath('/hm-admin/dashboard');
  revalidatePath('/hm-admin/stories');
  revalidatePath('/');
  revalidatePath('/biblioteca');
}

export async function deleteStoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  await supabase.from('stories').delete().eq('id', id);
  revalidatePath('/hm-admin/dashboard');
  revalidatePath('/hm-admin/stories');
  revalidatePath('/');
  revalidatePath('/biblioteca');
}

export async function addCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = getString(formData, 'name');
  const description = getString(formData, 'description');

  if (!name) {
    return;
  }

  await supabase.from('categories').insert({ description, name, slug: slugify(name) });
  revalidatePath('/hm-admin/categories');
}

export async function deleteCategoryAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/hm-admin/categories');
}

