'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/hm-admin-auth';
import { slugify } from '@/lib/utils';

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function createDescription(storyText: string) {
  const normalized = storyText.replace(/\s+/g, ' ').trim();

  return normalized.length > 180
    ? `${normalized.slice(0, 177).trim()}...`
    : normalized;
}

function calculateReadingMinutes(storyText: string) {
  const words = storyText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
}

async function getOrCreateAuthor(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  name: string,
) {
  const { data: existing } = await supabase
    .from('authors')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from('authors')
    .insert({ name })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Não foi possível cadastrar a autoria.');
  }

  return data.id;
}

async function getOrCreateCategory(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  name: string,
) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      description: 'Categoria criada a partir de uma história enviada.',
      name,
      slug: slugify(name),
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error('Não foi possível cadastrar a categoria.');
  }

  return data.id;
}

export async function approveSubmissionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  if (!id) {
    return;
  }

  const { data: submission, error: submissionError } = await supabase
    .from('story_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (submissionError || !submission) {
    throw new Error('Não foi possível localizar o envio.');
  }

  if (submission.created_story_id) {
    await supabase
      .from('story_submissions')
      .update({
        reviewed_at: new Date().toISOString(),
        status: 'approved',
      })
      .eq('id', id);

    revalidatePath('/hm-admin/submissions');
    return;
  }

  if (submission.submission_type === 'pdf') {
    await supabase
      .from('story_submissions')
      .update({
        reviewed_at: new Date().toISOString(),
        status: 'approved',
      })
      .eq('id', id);

    revalidatePath('/hm-admin/submissions');
    revalidatePath('/hm-admin/dashboard');
    return;
  }

  if (!submission.story_text || submission.story_text.trim().length < 80) {
    throw new Error('Este envio não possui texto suficiente para criar um rascunho.');
  }

  const authorId = await getOrCreateAuthor(supabase, submission.author_name);
  const categoryId = await getOrCreateCategory(supabase, submission.category);
  const storySlug = `${slugify(submission.title) || 'historia'}-${submission.id.slice(0, 8)}`;
  const now = new Date().toISOString();

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert({
      age_range: 'Livre',
      author_id: authorId,
      category_id: categoryId,
      description: createDescription(submission.story_text),
      full_description: submission.story_text,
      has_coloring_version: false,
      is_featured: false,
      is_story_of_week: false,
      published_at: null,
      reading_time_minutes: calculateReadingMinutes(submission.story_text),
      slug: storySlug,
      status: 'draft',
      theme: submission.category.toLowerCase(),
      title: submission.title,
      updated_at: now,
    })
    .select('id')
    .single();

  if (storyError || !story) {
    throw new Error('Não foi possível criar o rascunho da história.');
  }

  const { error: pageError } = await supabase.from('story_pages').insert({
    content: submission.story_text,
    image_url: null,
    page_number: 1,
    story_id: story.id,
  });

  if (pageError) {
    await supabase.from('stories').delete().eq('id', story.id);
    throw new Error('Não foi possível criar a primeira página da história.');
  }

  const { error: updateError } = await supabase
    .from('story_submissions')
    .update({
      created_story_id: story.id,
      reviewed_at: now,
      status: 'approved',
    })
    .eq('id', id);

  if (updateError) {
    throw new Error('O rascunho foi criado, mas o envio não pôde ser atualizado.');
  }

  revalidatePath('/hm-admin/submissions');
  revalidatePath('/hm-admin/stories');
  revalidatePath('/hm-admin/dashboard');
}

export async function rejectSubmissionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  if (!id) {
    return;
  }

  await supabase
    .from('story_submissions')
    .update({
      reviewed_at: new Date().toISOString(),
      status: 'rejected',
    })
    .eq('id', id);

  revalidatePath('/hm-admin/submissions');
}

export async function resetSubmissionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  if (!id) {
    return;
  }

  await supabase
    .from('story_submissions')
    .update({
      reviewed_at: null,
      status: 'pending_review',
    })
    .eq('id', id);

  revalidatePath('/hm-admin/submissions');
}

export async function deleteSubmissionAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = getString(formData, 'id');

  if (!id) {
    return;
  }

  const { data: submission } = await supabase
    .from('story_submissions')
    .select('pdf_storage_path')
    .eq('id', id)
    .maybeSingle();

  if (submission?.pdf_storage_path) {
    await supabase.storage.from('story-submissions').remove([submission.pdf_storage_path]);
  }

  await supabase.from('story_submissions').delete().eq('id', id);
  revalidatePath('/hm-admin/submissions');
}
