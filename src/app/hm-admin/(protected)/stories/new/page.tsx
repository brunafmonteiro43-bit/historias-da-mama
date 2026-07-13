import { AdminStoryForm } from '@/components/hm-admin-story-form';
import { requireAdmin } from '@/lib/hm-admin-auth';
import { getAdminCategories } from '@/lib/hm-admin-queries';

export const metadata = { title: 'Cadastrar história' };

export default async function NewStoryPage() {
  const { supabase } = await requireAdmin();
  const categories = await getAdminCategories(supabase);

  return <AdminStoryForm categories={categories} />;
}
