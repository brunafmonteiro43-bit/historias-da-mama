import { Edit3, Eye, EyeOff, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/hm-admin-auth';
import { getAdminStories } from '@/lib/hm-admin-queries';
import { deleteStoryAction, toggleStoryStatusAction } from '../actions';

export const metadata = { title: 'Histórias no admin' };

export default async function AdminStoriesPage() {
  const { supabase } = await requireAdmin();
  const stories = await getAdminStories(supabase);

  return (
    <div className="grid gap-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-lilac/20">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Conteúdo</p>
          <h1 className="mt-2 font-display text-4xl font-black text-plum">Histórias</h1>
        </div>
        <Link className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white hover:bg-coral" href="/hm-admin/stories/new">
          <PlusCircle className="h-5 w-5" />
          Cadastrar nova história
        </Link>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-lilac/20">
        <div className="grid grid-cols-[1.3fr_.7fr_.7fr_1fr] gap-4 border-b border-lilac/20 px-5 py-4 text-sm font-black uppercase tracking-[0.15em] text-slate-500">
          <span>história</span>
          <span>Status</span>
          <span>Categoria</span>
          <span>Ações</span>
        </div>
        <div className="divide-y divide-lilac/20">
          {stories.map((story) => (
            <article className="grid items-center gap-4 px-5 py-4 md:grid-cols-[1.3fr_.7fr_.7fr_1fr]" key={story.id}>
              <div>
                <h2 className="font-black text-plum">{story.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {story.ageRange} · {story.readingTime}
                </p>
              </div>
              <span className="w-fit rounded-full bg-cream px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-plum">
                {story.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
              <span className="text-sm font-bold text-slate-600">{story.category}</span>
              <div className="flex flex-wrap gap-2">
                <Link
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-black text-plum"
                  href={`/hm-admin/stories/${story.id}/edit`}
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </Link>
                <form action={toggleStoryStatusAction}>
                  <input name="id" type="hidden" value={story.id} />
                  <input name="status" type="hidden" value={story.status === 'published' ? 'draft' : 'published'} />
                  <button className="inline-flex items-center gap-2 rounded-full bg-aqua/70 px-4 py-2 text-sm font-black text-plum" type="submit">
                    {story.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {story.status === 'published' ? 'Despublicar' : 'Publicar'}
                  </button>
                </form>
                <form action={deleteStoryAction}>
                  <input name="id" type="hidden" value={story.id} />
                  <button className="inline-flex items-center gap-2 rounded-full bg-rose/70 px-4 py-2 text-sm font-black text-plum" type="submit">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </form>
              </div>
            </article>
          ))}
          {stories.length === 0 ? (
            <p className="p-8 text-center font-bold text-slate-600">Nenhuma história cadastrada ainda.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
