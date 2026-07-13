import { categories as demoCategories, publishedStories } from '@/data/stories';
import { getSupabaseConfig } from '@/lib/supabase/env';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Category, Story } from '@/types';

type Relation = { name?: string; slug?: string; color?: string; accent_color?: string } | Array<{ name?: string; slug?: string; color?: string; accent_color?: string }> | null;

type PublicStoryRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description: string | null;
  age_range: string;
  reading_time_minutes: number | null;
  theme: string | null;
  has_coloring_version: boolean | null;
  is_featured: boolean | null;
  is_story_of_week: boolean | null;
  cover_url: string | null;
  pdf_url: string | null;
  created_at: string | null;
  published_at: string | null;
  read_count: number | null;
  authors: { name?: string } | Array<{ name?: string }> | null;
  categories: Relation;
  story_pages?: Array<{ content: string | null; image_url: string | null; page_number: number | null }>;
};

function relationValue(relation: Relation, key: 'name' | 'slug' | 'color' | 'accent_color', fallback: string) {
  if (Array.isArray(relation)) {
    return relation[0]?.[key] ?? fallback;
  }

  return relation?.[key] ?? fallback;
}

function authorName(relation: PublicStoryRow['authors'], fallback: string) {
  if (Array.isArray(relation)) {
    return relation[0]?.name ?? fallback;
  }

  return relation?.name ?? fallback;
}

export async function getPublicCategories(): Promise<Category[]> {
  if (!getSupabaseConfig().isConfigured) {
    return demoCategories;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('name,slug,description,color,accent_color')
    .order('name', { ascending: true });

  if (error || !data || data.length === 0) {
    return demoCategories;
  }

  return data.map((category) => ({
    accentColor: category.accent_color ?? '#3B246B',
    color: category.color ?? '#BFEAF5',
    description: category.description ?? '',
    name: category.name,
    slug: category.slug,
  }));
}

export async function getPublicStories(): Promise<Story[]> {
  if (!getSupabaseConfig().isConfigured) {
    return publishedStories;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('stories')
    .select(
      'id,title,slug,description,full_description,age_range,reading_time_minutes,theme,has_coloring_version,is_featured,is_story_of_week,cover_url,pdf_url,created_at,published_at,read_count,authors(name),categories(name,slug,color,accent_color),story_pages(content,image_url,page_number)',
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error || !data) {
    return publishedStories;
  }

  return (data as PublicStoryRow[]).map((story) => {
    const pages = [...(story.story_pages ?? [])].sort((a, b) => (a.page_number ?? 0) - (b.page_number ?? 0));
    const readingMinutes = story.reading_time_minutes ?? 5;

    return {
      accentColor: relationValue(story.categories, 'accent_color', '#3B246B'),
      ageRange: story.age_range,
      author: authorName(story.authors, 'Histórias da Mamá'),
      category: relationValue(story.categories, 'name', 'Aventura'),
      categorySlug: relationValue(story.categories, 'slug', 'aventura'),
      color: relationValue(story.categories, 'color', '#BFEAF5'),
      coverUrl: story.cover_url,
      createdAt: story.published_at ?? story.created_at ?? new Date().toISOString(),
      description: story.description,
      fullDescription: story.full_description ?? story.description,
      hasColoringVersion: Boolean(story.has_coloring_version),
      id: story.id,
      pageImages: pages.map((page) => page.image_url),
      pages: pages.map((page, index) => page.content || `Página ${index + 1}`),
      pdfUrl: story.pdf_url,
      popular: Boolean(story.is_featured),
      readCount: story.read_count ?? 0,
      readingMinutes,
      readingTime: `${readingMinutes} min`,
      slug: story.slug,
      status: 'published',
      storyOfWeek: Boolean(story.is_story_of_week),
      theme: story.theme ?? 'imaginação',
      title: story.title,
    };
  });
}

export async function getPublicStoryBySlug(slug: string) {
  const stories = await getPublicStories();
  const storyIndex = stories.findIndex((story) => story.slug === slug);

  return {
    nextStory: storyIndex >= 0 ? stories[(storyIndex + 1) % stories.length] : undefined,
    story: storyIndex >= 0 ? stories[storyIndex] : undefined,
    stories,
  };
}
