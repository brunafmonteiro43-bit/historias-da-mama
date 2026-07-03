import { FolderKanban, Trash2 } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-auth';
import { getAdminCategories } from '@/lib/admin-queries';
import { addCategoryAction, deleteCategoryAction } from '../actions';

export const metadata = { title: 'Categorias no admin' };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const categories = await getAdminCategories(supabase);

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">Organização</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Categorias</h1>
        <p className="mt-2 leading-7 text-slate-600">Crie categorias para organizar a biblioteca pública e colorir os cards.</p>
      </section>

      <form action={addCategoryAction} className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-soft md:grid-cols-[.7fr_1fr_auto]">
        <label className="grid gap-2 text-sm font-black text-ink">
          Nome
          <input className="rounded-2xl border border-slate-200 px-4 py-3" name="name" placeholder="Ex.: Fantasia" required />
        </label>
        <label className="grid gap-2 text-sm font-black text-ink">
          Descrição
          <input className="rounded-2xl border border-slate-200 px-4 py-3" name="description" placeholder="Magia, castelos e mundos encantados" />
        </label>
        <button className="self-end rounded-full bg-ink px-6 py-3 font-black text-white" type="submit">
          Salvar
        </button>
      </form>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <article className="rounded-3xl bg-white p-6 shadow-soft" key={category.id}>
            <FolderKanban className="h-7 w-7 text-violet-700" />
            <h2 className="mt-4 text-2xl font-black text-ink">{category.name}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{category.description || 'Sem descrição.'}</p>
            <form action={deleteCategoryAction} className="mt-5">
              <input name="id" type="hidden" value={category.id} />
              <button className="inline-flex items-center gap-2 rounded-full bg-rose/70 px-4 py-2 text-sm font-black text-ink" type="submit">
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
