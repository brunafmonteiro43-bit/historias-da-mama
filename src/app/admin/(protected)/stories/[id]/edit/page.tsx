import { notFound } from 'next/navigation';
import { AdminStoryForm } from '@/components/admin-story-form';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminCategories, getEditableStory } from '@/lib/admin-queries';

export const metadata = { title: 'Editar história' };

export default async function EditStoryPage({ params }: { params: { id: string } }) {
  const { supabase } = await requireAdmin();
  const [categories, story] = await Promise.all([
    getAdminCategories(supabase),
    getEditableStory(supabase, params.id),
  ]);

  if (!story) {
    notFound();
  }

  return <AdminStoryForm categories={categories} story={story} />;
}
