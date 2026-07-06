'use client';

import { Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type AdminLoginFormProps = {
  disabled?: boolean;
};

export function AdminLoginForm({ disabled = false }: AdminLoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (disabled) {
      setError('Configure o Supabase antes de tentar entrar.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    setError('');
    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError('E-mail ou senha inválidos.');
        return;
      }

      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

      if (adminError || isAdmin !== true) {
        await supabase.auth.signOut();
        setError('Este usuário existe, mas não está autorizado como administrador.');
        return;
      }

      router.replace('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Não foi possível conectar ao Supabase. Confira as variáveis de ambiente.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-black text-ink">
        E-mail
        <input
          autoComplete="email"
          className="rounded-2xl border border-lilac/35 bg-cream/35 px-4 py-3 font-medium outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
          disabled={disabled || isLoading}
          name="email"
          placeholder="admin@historiasdamama.com"
          required
          type="email"
        />
      </label>

      <label className="grid gap-2 text-sm font-black text-ink">
        Senha
        <input
          autoComplete="current-password"
          className="rounded-2xl border border-lilac/35 bg-cream/35 px-4 py-3 font-medium outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
          disabled={disabled || isLoading}
          name="password"
          placeholder="Sua senha"
          required
          type="password"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose/35 px-4 py-3 text-sm font-bold text-rose-900" role="alert">
          {error}
        </p>
      ) : null}

      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-coral disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled || isLoading}
        type="submit"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
        Acessar painel
      </button>
    </form>
  );
}
