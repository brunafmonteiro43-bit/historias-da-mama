'use client';

import { Loader2, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });

      if (resetError) {
        setError('Não foi possível enviar o e-mail de recuperação.');
        return;
      }

      setMessage('E-mail de recuperação enviado. Confira sua caixa de entrada.');
    } catch {
      setError('Configure o Supabase antes de recuperar a senha.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-black text-ink">
        E-mail do administrador
        <input
          autoComplete="email"
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          name="email"
          placeholder="admin@historiasdamama.com"
          required
          type="email"
        />
      </label>

      {message ? <p className="rounded-2xl bg-aqua/50 px-4 py-3 text-sm font-bold text-emerald-900">{message}</p> : null}
      {error ? <p className="rounded-2xl bg-rose/40 px-4 py-3 text-sm font-bold text-rose-900">{error}</p> : null}

      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-black text-white disabled:opacity-60"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
        Enviar recuperação
      </button>
    </form>
  );
}
