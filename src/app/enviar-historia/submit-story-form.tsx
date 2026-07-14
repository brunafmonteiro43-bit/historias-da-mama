'use client';

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { createBrowserSupabaseClient } from '@/lib/supabase/client';

type FormState = {
  author: string;
  category: string;
  email: string;
  story: string;
  title: string;
  website: string;
};

const initialState: FormState = {
  author: '',
  category: '',
  email: '',
  story: '',
  title: '',
  website: '',
};

export function SubmitStoryForm() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [form, setForm] = useState<FormState>(initialState);
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isValid =
    form.author.trim().length > 1 &&
    form.email.includes('@') &&
    form.title.trim().length > 2 &&
    form.category.trim().length > 1 &&
    form.story.trim().length >= 80 &&
    permissionConfirmed &&
    status !== 'sending';

  function updateField(field: keyof FormState, value: string) {
    setStatus('idle');
    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    // Campo invisível para reduzir envios automáticos.
    if (form.website.trim()) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    const { error } = await supabase.from('story_submissions').insert({
      author_name: form.author.trim(),
      category: form.category.trim(),
      email: form.email.trim().toLowerCase(),
      status: 'pending_review',
      story_text: form.story.trim(),
      title: form.title.trim(),
    });

    if (error) {
      console.error('Erro ao enviar história:', error);
      setStatus('error');
      setErrorMessage(
        'Não foi possível enviar a história agora. Tente novamente em alguns minutos.',
      );
      return;
    }

    setStatus('success');
    setForm(initialState);
    setPermissionConfirmed(false);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input
            autoComplete="off"
            name="website"
            onChange={(event) => updateField('website', event.target.value)}
            tabIndex={-1}
            value={form.website}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-plum">
          Nome de autoria
          <input
            autoComplete="name"
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
            maxLength={120}
            onChange={(event) => updateField('author', event.target.value)}
            placeholder="Ex.: Turma 2M2"
            required
            value={form.author}
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-plum">
          E-mail para retorno
          <input
            autoComplete="email"
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
            maxLength={254}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            type="email"
            value={form.email}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
        <label className="grid gap-2 text-sm font-black text-plum">
          Título da história
          <input
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
            maxLength={180}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Ex.: A estrela que aprendeu a brilhar"
            required
            value={form.title}
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-plum">
          Categoria sugerida
          <select
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
            onChange={(event) => updateField('category', event.target.value)}
            required
            value={form.category}
          >
            <option value="">Escolha uma categoria</option>
            <option value="Aventura">Aventura</option>
            <option value="Fantasia">Fantasia</option>
            <option value="Amizade">Amizade</option>
            <option value="Natureza">Natureza</option>
            <option value="Inclusão">Inclusão</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black text-plum">
        Texto da história
        <textarea
          className="min-h-56 rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold leading-7 text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
          maxLength={50000}
          minLength={80}
          onChange={(event) => updateField('story', event.target.value)}
          placeholder="Cole aqui a história completa. Inclua começo, desenvolvimento e final."
          required
          value={form.story}
        />
      </label>

      <label className="flex items-start gap-3 rounded-2xl bg-cream/70 p-4 text-sm font-bold leading-6 text-slate-700">
        <input
          checked={permissionConfirmed}
          className="mt-1 h-4 w-4 accent-plum"
          onChange={(event) => {
            setStatus('idle');
            setPermissionConfirmed(event.target.checked);
          }}
          required
          type="checkbox"
        />
        <span>
          Confirmo que tenho autorização para enviar este conteúdo e concordo com os{' '}
          <Link className="font-black text-plum underline" href="/termos-de-uso">
            Termos de Uso
          </Link>{' '}
          e a{' '}
          <Link className="font-black text-plum underline" href="/politica-de-privacidade">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-600">
          Mínimo de 80 caracteres. O conteúdo ficará pendente até a revisão.
        </p>

        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!isValid}
          type="submit"
        >
          {status === 'sending' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {status === 'sending' ? 'Enviando...' : 'Enviar história'}
        </button>
      </div>

      {status === 'success' ? (
        <div
          className="inline-flex items-center gap-2 rounded-2xl bg-aqua/25 px-4 py-3 text-sm font-black text-teal-800"
          role="status"
        >
          <CheckCircle2 className="h-5 w-5" />
          História recebida! Ela está aguardando revisão no painel administrativo.
        </div>
      ) : null}

      {status === 'error' ? (
        <div
          className="inline-flex items-center gap-2 rounded-2xl bg-rose/45 px-4 py-3 text-sm font-black text-red-800"
          role="alert"
        >
          <AlertCircle className="h-5 w-5" />
          {errorMessage}
        </div>
      ) : null}
    </form>
  );
}
