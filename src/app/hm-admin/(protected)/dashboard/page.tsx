import { BookOpen, FileText, FolderKanban, PlusCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { requireAdmin } from '@/lib/hm-admin-auth';
import { getAdminCategories, getAdminStories } from '@/lib/hm-admin-queries';

export const metadata = { title: 'Dashboard administrativo' };

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  const [stories, categories] = await Promise.all([getAdminStories(supabase), getAdminCategories(supabase)]);
  const published = stories.filter((story) => story.status === 'published').length;
  const drafts = stories.filter((story) => story.status === 'draft').length;

  const stats = [
    { icon: BookOpen, label: 'Total de Histórias', value: stories.length },
    { icon: Sparkles, label: 'Publicadas', value: published },
    { icon: FileText, label: 'Rascunhos', value: drafts },
    { icon: FolderKanban, label: 'Categorias', value: categories.length },
  ];

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-lilac/20 md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">VisÃ£o geral</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="font-display text-4xl font-black text-plum">Dashboard</h1>
            <p className="mt-2 max-w-2xl leading-7 text-slate-600">
              Acompanhe o conteÃºdo publicado e acesse rapidamente o cadastro de novas Histórias.
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-2 rounded-[1.4rem] bg-plum px-6 py-4 font-black text-white shadow-soft transition hover:-translate-y-1 hover:bg-coral"
            href="/hm-admin/stories/new"
          >
            <PlusCircle className="h-5 w-5" />
            Cadastrar nova história
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <article className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-lilac/20" key={label}>
            <Icon className="h-7 w-7 text-plum" />
            <p className="mt-5 text-4xl font-black text-plum">{value}</p>
            <h2 className="mt-1 font-bold text-slate-600">{label}</h2>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-lilac/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-plum">Histórias recentes</h2>
          <Link className="rounded-full bg-cream px-4 py-2 font-black text-plum" href="/hm-admin/stories">
            Ver todas
          </Link>
        </div>
        <div className="mt-5 grid gap-3">
          {stories.slice(0, 5).map((story) => (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lilac/20 p-4" key={story.id}>
              <div>
                <strong className="text-plum">{story.title}</strong>
                <p className="mt-1 text-sm text-slate-500">
                  {story.category} Â· {story.ageRange} Â· {story.readingTime}
                </p>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-plum">
                {story.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
          ))}
          {stories.length === 0 ? (
            <p className="rounded-2xl bg-cream p-5 font-bold text-slate-600">
              Nenhuma história cadastrada no Supabase ainda.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
