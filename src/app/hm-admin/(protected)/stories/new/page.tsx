import { AdminStoryForm } from '@/components/admin-story-form';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminCategories } from '@/lib/admin-queries';

export const metadata = { title: 'Cadastrar história' };

export default async function NewStoryPage() {
  const { supabase } = await requireAdmin();
  const categories = await getAdminCategories(supabase);

  return <AdminStoryForm categories={categories} />;
}
