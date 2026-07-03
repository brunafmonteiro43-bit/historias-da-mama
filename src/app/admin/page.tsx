import { KeyRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirectAdminToDashboard } from '@/lib/admin-auth';
import { getSupabaseConfig } from '@/lib/supabase/env';
import { AdminLoginForm } from './login-form';

export const metadata = { title: 'Login do administrador' };

export default async function AdminLoginPage() {
  await redirectAdminToDashboard();
  const isSupabaseConfigured = getSupabaseConfig().isConfigured;

  return (
    <main className="min-h-[calc(100vh-180px)] bg-[linear-gradient(135deg,#fff8ed_0%,#eef8ff_45%,#fff4fa_100%)] px-5 py-12">
      <section className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-soft backdrop-blur md:p-12">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[5rem] bg-sun/70" />
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-white">
            <ShieldCheck className="h-4 w-4" />
            Acesso privado
          </p>
          <h1 className="mt-6 text-4xl font-black leading-tight text-ink md:text-6xl">
            Administração das Histórias da Mamá
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            Esta entrada é exclusiva para a pessoa administradora cadastrar, editar, publicar e remover histórias.
            Leitores não precisam de conta para aproveitar a biblioteca pública.
          </p>

          {!isSupabaseConfigured ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-900">
              Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para ativar o login real.
            </div>
          ) : null}
        </div>

        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-soft md:p-8" aria-label="Login do administrador">
          <KeyRound className="h-9 w-9 text-violet-700" />
          <h2 className="mt-4 text-2xl font-black text-ink">Entrar com Supabase Auth</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use o e-mail cadastrado em Authentication e autorizado na tabela admins.
          </p>

          <AdminLoginForm disabled={!isSupabaseConfigured} />

          <Link className="mt-5 block text-center text-sm font-black text-violet-700" href="/admin/auth/reset-password">
            Recuperar senha
          </Link>
        </section>
      </section>
    </main>
  );
}
