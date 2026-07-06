'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { slugify } from '@/lib/utils';

export async function submitStorySuggestion(formData: FormData) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return;

  const title = String(formData.get('titulo-da-história') ?? '').trim();
  const description = String(formData.get('descricao') ?? '').trim();
  const name = String(formData.get('nome') ?? '').trim() || 'Visitante';
  if (!title || !description) return;

  const cookieStore = cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set() {},
      remove() {},
    },
  });

  await supabase.from('stories').insert({
    title,
    slug: `${slugify(title)}-${Date.now()}`,
    description: `${description}\n\nSugestão enviada por: ${name}`,
    age_range: 'A revisar',
    reading_time_minutes: 5,
    has_coloring_version: false,
    status: 'pending_review',
  });
}
