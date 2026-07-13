import { getPublicCategories, getPublicStories } from '@/lib/public-data';
import { LibraryClient } from './library-client';

export const metadata = { title: 'Biblioteca' };
export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const [categories, stories] = await Promise.all([getPublicCategories(), getPublicStories()]);

  return <LibraryClient categories={categories} stories={stories} />;
}
