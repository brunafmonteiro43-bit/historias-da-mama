'use client';

import { CheckCircle2, Send } from 'lucide-react';
import { useState } from 'react';

type FormState = {
  author: string;
  category: string;
  email: string;
  story: string;
  title: string;
};

const initialState: FormState = {
  author: '',
  category: '',
  email: '',
  story: '',
  title: '',
};

export function SubmitStoryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const isValid = form.author.trim().length > 1 && form.email.includes('@') && form.story.trim().length >= 80 && form.title.trim().length > 2;

  function updateField(field: keyof FormState, value: string) {
    setSubmitted(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    setSubmitted(true);
    setForm(initialState);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black text-plum">
          Nome de autoria
          <input
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
            onChange={(event) => updateField('author', event.target.value)}
            placeholder="Ex.: Turma 2M2"
            required
            value={form.author}
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-plum">
          E-mail para retorno
          <input
            className="rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
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
            value={form.category}
          >
            <option value="">Escolha uma categoria</option>
            <option>Aventura</option>
            <option>Fantasia</option>
            <option>Amizade</option>
            <option>Natureza</option>
            <option>Inclusão</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm font-black text-plum">
        Texto da história
        <textarea
          className="min-h-56 rounded-2xl border border-lilac/30 bg-white px-4 py-3 font-bold leading-7 text-ink outline-none transition focus:border-plum focus:ring-4 focus:ring-lilac/25"
          minLength={80}
          onChange={(event) => updateField('story', event.target.value)}
          placeholder="Cole aqui a história completa. Inclua começo, desenvolvimento e final."
          required
          value={form.story}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-600">Mínimo de 80 caracteres para ajudar a revisão.</p>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!isValid}
          type="submit"
        >
          <Send className="h-5 w-5" />
          Enviar história
        </button>
      </div>

      {submitted ? (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-aqua/25 px-4 py-3 text-sm font-black text-teal-800">
          <CheckCircle2 className="h-5 w-5" />
          História recebida para revisão. Obrigado por compartilhar!
        </div>
      ) : null}
    </form>
  );
}
