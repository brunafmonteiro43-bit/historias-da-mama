import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import { ResetPasswordForm } from './reset-password-form';

export const metadata = { title: 'Recuperar senha' };

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-180px)] max-w-3xl px-5 py-12">
      <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-soft md:p-10">
        <KeyRound className="h-9 w-9 text-violet-700" />
        <h1 className="mt-4 text-4xl font-black text-ink">Recuperar senha</h1>
        <p className="mt-3 leading-7 text-slate-700">
          Informe o e-mail da conta administradora. O Supabase enviará o link de recuperação configurado no projeto.
        </p>
        <ResetPasswordForm />
        <Link className="mt-6 inline-flex rounded-full bg-slate-100 px-5 py-3 font-black text-ink" href="/admin">
          Voltar ao login
        </Link>
      </section>
    </main>
  );
}
