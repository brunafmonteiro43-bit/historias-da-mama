import { categories, publishedStories } from '@/data/stories';
import { LibraryClient } from './library-client';

export const metadata = { title: 'Biblioteca' };

export default function BibliotecaPage() {
  return <LibraryClient categories={categories} stories={publishedStories} />;
}
