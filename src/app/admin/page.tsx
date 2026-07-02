import { BookOpen, KeyRound, LayoutDashboard, Settings, Tags, UserRound, type LucideIcon } from 'lucide-react';
import { AdminStoryForm } from '@/components/admin-story-form';

export const metadata = { title: 'Painel administrativo' };

const adminSections: Array<{ icon: LucideIcon; title: string }> = [
  { icon: LayoutDashboard, title: 'Dashboard' },
  { icon: BookOpen, title: 'Histórias' },
  { icon: Tags, title: 'Categorias' },
  { icon: UserRound, title: 'Autores' },
  { icon: Settings, title: 'Configurações' },
];

export default function Admin() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12">
      <section className="grid gap-8 rounded-[2.5rem] bg-gradient-to-br from-lilac/70 to-skyPastel/70 p-6 shadow-soft md:grid-cols-[1fr_.8fr] md:p-10">
        <div>
          <p className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-violet-600">
            Acesso privado
          </p>
          <h1 className="mt-5 text-5xl font-black">Painel administrativo</h1>
          <p className="mt-4 max-w-2xl text-lg">
            Área exclusiva para a pessoa responsável cadastrar, editar, publicar e excluir histórias. Leitores e visitantes não precisam criar conta.
          </p>
        </div>

        <form className="rounded-[2rem] bg-white p-6 shadow-soft" aria-label="Login do administrador">
          <KeyRound className="h-8 w-8 text-violet-600" />
          <h2 className="mt-3 text-2xl font-black">Entrar como administrador</h2>
          <label className="mt-5 grid gap-2 font-bold">
            E-mail
            <input className="rounded-2xl border p-3" placeholder="admin@historiasdamama.com" type="email" />
          </label>
          <label className="mt-4 grid gap-2 font-bold">
            Senha
            <input className="rounded-2xl border p-3" placeholder="••••••••" type="password" />
          </label>
          <button className="mt-5 w-full rounded-full bg-ink px-6 py-3 font-bold text-white" type="button">
            Acessar painel
          </button>
          <a className="mt-3 block text-center text-sm font-bold text-violet-700" href="#recuperar-senha">
            Recuperar senha
          </a>
        </form>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-5">
        {adminSections.map(({ icon: Icon, title }) => (
          <button className="rounded-3xl bg-white p-6 text-left font-black shadow-soft" key={title} type="button">
            <Icon className="mb-3 h-7 w-7" />
            {title}
          </button>
        ))}
      </section>

      <section className="my-10 rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black">Regras do acesso</h2>
        <ul className="mt-3 grid gap-2 text-slate-700 md:grid-cols-3">
          <li>✅ Visitantes leem tudo livremente.</li>
          <li>✅ Apenas administradores fazem login.</li>
          <li>✅ Sem perfis, comentários ou favoritos de leitores.</li>
        </ul>
      </section>

      <AdminStoryForm />
    </main>
  );
}
