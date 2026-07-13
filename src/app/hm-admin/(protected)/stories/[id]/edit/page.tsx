import { notFound } from 'next/navigation';
import { AdminStoryForm } from '@/components/hm-admin-story-form';
import { requireAdmin } from '@/lib/hm-admin-auth';
import { getAdminCategories, getEditableStory } from '@/lib/hm-admin-queries';

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
