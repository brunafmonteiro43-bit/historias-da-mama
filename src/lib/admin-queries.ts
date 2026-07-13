import type { SupabaseClient } from '@supabase/supabase-js';
import { categories as demoCategories } from '@/data/stories';
import type { StoryStatus } from '@/types';

export type AdminStorySummary = {
  id: string;
  title: string;
  slug: string;
  status: StoryStatus;
  category: string;
  ageRange: string;
  readingTime: string;
  updatedAt: string | null;
  publishedAt: string | null;
};

export type AdminCategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type EditableStory = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  author: string;
  category: string;
  ageRange: string;
  readingMinutes: number;
  theme: string;
  hasColoringVersion: boolean;
  isFeatured: boolean;
  isStoryOfWeek: boolean;
  coverUrl: string | null;
  pdfUrl: string | null;
  status: StoryStatus;
  pages: string[];
  pageImages: Array<string | null>;
};

type Relation = { name?: string } | Array<{ name?: string }> | null;

function relationName(relation: Relation, fallback: string) {
  if (Array.isArray(relation)) {
    return relation[0]?.name ?? fallback;
  }

  return relation?.name ?? fallback;
}

export async function getAdminStories(supabase: SupabaseClient): Promise<AdminStorySummary[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('id,title,slug,status,age_range,reading_time_minutes,updated_at,published_at,categories(name)')
    .order('updated_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((story) => ({
    id: story.id,
    title: story.title,
    slug: story.slug,
    status: story.status,
    category: relationName(story.categories as Relation, 'Sem categoria'),
    ageRange: story.age_range,
    readingTime: `${story.reading_time_minutes ?? 5} min`,
    updatedAt: story.updated_at,
    publishedAt: story.published_at,
  }));
}

export async function getAdminCategories(supabase: SupabaseClient): Promise<AdminCategorySummary[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id,name,slug,description')
    .order('name', { ascending: true });

  if (error || !data || data.length === 0) {
    return demoCategories.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      description: category.description,
    }));
  }

  return data.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
  }));
}

export async function getEditableStory(supabase: SupabaseClient, id: string): Promise<EditableStory | null> {
  const { data: story, error } = await supabase
    .from('stories')
    .select('id,title,description,full_description,age_range,reading_time_minutes,theme,has_coloring_version,is_featured,is_story_of_week,cover_url,pdf_url,status,categories(name),authors(name)')
    .eq('id', id)
    .maybeSingle();

  if (error || !story) {
    return null;
  }

  const { data: pages } = await supabase
    .from('story_pages')
    .select('content,image_url,page_number')
    .eq('story_id', id)
    .order('page_number', { ascending: true });

  return {
    id: story.id,
    title: story.title,
    description: story.description,
    fullDescription: story.full_description ?? story.description,
    author: relationName(story.authors as Relation, 'Histórias da Mamá'),
    category: relationName(story.categories as Relation, demoCategories[0].name),
    ageRange: story.age_range,
    readingMinutes: story.reading_time_minutes ?? 5,
    theme: story.theme ?? 'imaginação',
    hasColoringVersion: Boolean(story.has_coloring_version),
    isFeatured: Boolean(story.is_featured),
    isStoryOfWeek: Boolean(story.is_story_of_week),
    coverUrl: story.cover_url ?? null,
    pdfUrl: story.pdf_url ?? null,
    status: story.status,
    pages: pages?.map((page) => page.content ?? `Página ${page.page_number}`) ?? [''],
    pageImages: pages?.map((page) => page.image_url ?? null) ?? [],
  };
}
