'use client';

import { AlertCircle, CheckCircle2, FileText, Loader2, Send, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { submitStoryAction } from './actions';

const MAX_PDF_SIZE = 10 * 1024 * 1024;

type SendMode = 'text' | 'pdf';

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

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

function validatePdfFile(file: File) {
  if (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Envie somente arquivos PDF.';
  }

  if (file.size > MAX_PDF_SIZE) {
    return 'O arquivo PDF deve ter no máximo 10 MB.';
  }

  return '';
}

export function SubmitStoryForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<FormState>(initialState);
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [sendMode, setSendMode] = useState<SendMode>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const hasBaseFields =
    form.author.trim().length > 1 &&
    form.email.includes('@') &&
    form.title.trim().length > 2 &&
    form.category.trim().length > 1 &&
    permissionConfirmed;

  const hasStoryContent = sendMode === 'text' ? form.story.trim().length >= 80 : Boolean(selectedFile);
  const isValid = hasBaseFields && hasStoryContent && status !== 'sending';

  function updateField(field: keyof FormState, value: string) {
    setStatus('idle');
    setErrorMessage('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateMode(mode: SendMode) {
    setStatus('idle');
    setErrorMessage('');
    setSendMode(mode);
  }

  function removeFile() {
    setSelectedFile(null);
    setStatus('idle');
    setErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function chooseFile(file: File | null) {
    setStatus('idle');
    setErrorMessage('');

    if (!file) {
      removeFile();
      return;
    }

    const validationError = validatePdfFile(file);

    if (validationError) {
      setSelectedFile(null);
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData();
    formData.set('author', form.author.trim());
    formData.set('category', form.category.trim());
    formData.set('email', form.email.trim());
    formData.set('sendMode', sendMode);
    formData.set('story', sendMode === 'text' ? form.story.trim() : '');
    formData.set('title', form.title.trim());
    formData.set('website', form.website.trim());

    if (permissionConfirmed) {
      formData.set('permissionConfirmed', 'on');
    }

    if (sendMode === 'pdf' && selectedFile) {
      formData.set('storyPdf', selectedFile);
    }

    const result = await submitStoryAction(formData);

    if (result.status === 'error') {
      setStatus('error');
      setErrorMessage(result.message);
      return;
    }

    setStatus('success');
    setForm(initialState);
    setPermissionConfirmed(false);
    setSendMode('text');
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <form className="grid gap-5" encType="multipart/form-data" onSubmit={handleSubmit}>
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

      <fieldset className="grid gap-3">
        <legend className="text-sm font-black text-plum">Como deseja enviar a história?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-lilac/30 bg-cream/45 px-4 py-3 text-sm font-black text-plum transition hover:border-plum">
            <input
              checked={sendMode === 'text'}
              className="h-4 w-4 accent-plum"
              name="sendMode"
              onChange={() => updateMode('text')}
              type="radio"
              value="text"
            />
            Digitar a história
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-lilac/30 bg-skyPastel/25 px-4 py-3 text-sm font-black text-plum transition hover:border-plum">
            <input
              checked={sendMode === 'pdf'}
              className="h-4 w-4 accent-plum"
              name="sendMode"
              onChange={() => updateMode('pdf')}
              type="radio"
              value="pdf"
            />
            Enviar arquivo PDF
          </label>
        </div>
      </fieldset>

      {sendMode === 'text' ? (
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
      ) : (
        <div className="grid gap-3">
          <input
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
            ref={fileInputRef}
            type="file"
          />

          <button
            className={`grid min-h-44 place-items-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
              isDragging ? 'border-plum bg-lilac/20' : 'border-lilac/35 bg-cream/45 hover:border-plum hover:bg-cream/70'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              chooseFile(event.dataTransfer.files?.[0] ?? null);
            }}
            type="button"
          >
            <span className="grid justify-items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-plum shadow-sm">
                <UploadCloud className="h-7 w-7" />
              </span>
              <span className="font-black text-plum">Clique para selecionar ou arraste o arquivo PDF aqui.</span>
            </span>
          </button>

          {selectedFile ? (
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 ring-1 ring-lilac/20 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-plum" />
                <span className="min-w-0">
                  <span className="block truncate text-plum">{selectedFile.name}</span>
                  <span className="block text-slate-500">{formatFileSize(selectedFile.size)}</span>
                </span>
              </span>
              <span className="flex flex-wrap gap-2">
                <button
                  className="rounded-full bg-cream px-4 py-2 font-black text-plum transition hover:text-coral"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Substituir
                </button>
                <button
                  className="inline-flex items-center gap-1 rounded-full bg-rose/45 px-4 py-2 font-black text-red-800 transition hover:bg-rose/65"
                  onClick={removeFile}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  Remover
                </button>
              </span>
            </div>
          ) : null}
        </div>
      )}

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
          {sendMode === 'text'
            ? 'Mínimo de 80 caracteres. O conteúdo ficará pendente até a revisão.'
            : 'Envie um arquivo PDF de até 10 MB. O conteúdo ficará pendente até a revisão.'}
        </p>

        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white transition hover:bg-coral disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!isValid}
          type="submit"
        >
          {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
