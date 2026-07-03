import { BarChart3, BookOpen, FolderKanban, LayoutDashboard, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { Logo } from '@/components/logo';
import { requireAdmin } from '@/lib/admin-auth';

const adminNavigation = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/stories', icon: BookOpen, label: 'Histórias' },
  { href: '/admin/stories/new', icon: PlusCircle, label: 'Nova história' },
  { href: '/admin/categories', icon: FolderKanban, label: 'Categorias' },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f7f7fb]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-ink px-5 py-6 text-white">
          <Logo tone="light" />
          <nav className="mt-8 grid gap-2">
            {adminNavigation.map(({ href, icon: Icon, label }) => (
              <Link
                className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 font-black text-white/85 transition hover:bg-white/12 hover:text-white"
                href={href}
                key={href}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-white/80">
            <BarChart3 className="mb-3 h-5 w-5 text-sun" />
            Sessão protegida por Supabase Auth e tabela admins.
          </div>
        </aside>

        <section>
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">Painel administrativo</p>
                <p className="text-sm text-slate-600">{user.email}</p>
              </div>
              <AdminLogoutButton />
            </div>
          </header>
          <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
