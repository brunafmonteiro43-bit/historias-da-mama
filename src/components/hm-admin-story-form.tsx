'use client';

/* eslint-disable @next/next/no-img-element */

import { ArrowDown, ArrowUp, CheckCircle2, FileText, GripVertical, ImagePlus, Layers3, UploadCloud } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { saveStoryAction } from '@/app/hm-admin/(protected)/actions';
import type { AdminCategorySummary, EditableStory } from '@/lib/admin-queries';

type AdminStoryFormProps = {
  categories: AdminCategorySummary[];
  story?: EditableStory;
};

const steps = [
  'InformaÃ§Ãµes bÃ¡sicas',
  'Capa e arquivos',
  'PÃ¡ginas da histÃ³ria',
  'PublicaÃ§Ã£o',
];

const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
const pdfTypes = ['application/pdf'];
const imageLimit = 8 * 1024 * 1024;
const pdfLimit = 50 * 1024 * 1024;

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function fileError(file: File, kind: 'image' | 'pdf') {
  const allowed = kind === 'image' ? imageTypes : pdfTypes;
  const limit = kind === 'image' ? imageLimit : pdfLimit;
  const label = kind === 'image' ? 'PNG, JPG ou WEBP' : 'PDF';

  if (!allowed.includes(file.type)) {
    return `${file.name}: use ${label}.`;
  }

  if (file.size > limit) {
    return `${file.name}: tamanho mÃ¡ximo ${formatSize(limit)}.`;
  }

  return '';
}

export function AdminStoryForm({ categories, story }: AdminStoryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState('');
  const [pagePreviews, setPagePreviews] = useState<string[]>([]);
  const [pageTexts, setPageTexts] = useState<string[]>(story?.pages?.length ? story.pages : ['']);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pagesInputRef = useRef<HTMLInputElement>(null);

  const defaultCategory = story?.category ?? categories[0]?.name ?? 'Aventura';
  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;

  const stepSummary = useMemo(
    () => [
      'TÃ­tulo, descriÃ§Ã£o, autoria, categoria e faixa etÃ¡ria.',
      'Capa vertical, PDF da histÃ³ria e imagens opcionais.',
      'Textos das pÃ¡ginas e ordem de leitura.',
      'Rascunho ou publicaÃ§Ã£o para visitantes.',
    ],
    [],
  );

  function validateFiles(files: File[], kind: 'image' | 'pdf') {
    const nextErrors = files.map((file) => fileError(file, kind)).filter(Boolean);
    setErrors(nextErrors);
    return nextErrors.length === 0;
  }

  function handleCover(files: FileList | null) {
    const file = files?.[0];

    if (!file || !validateFiles([file], 'image')) {
      setCoverPreview('');
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
  }

  function handlePdf(files: FileList | null) {
    const file = files?.[0];

    if (file) {
      validateFiles([file], 'pdf');
    }
  }

  function handlePageImages(files: FileList | null) {
    const nextFiles = Array.from(files ?? []);

    if (!validateFiles(nextFiles, 'image')) {
      setPagePreviews([]);
      return;
    }

    setPagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
  }

  function addPage() {
    setPageTexts((current) => [...current, '']);
  }

  function updatePage(index: number, value: string) {
    setPageTexts((current) => current.map((page, pageIndex) => (pageIndex === index ? value : page)));
  }

  function removePage(index: number) {
    setPageTexts((current) => current.filter((_, pageIndex) => pageIndex !== index));
  }

  function movePage(from: number, to: number) {
    setPageTexts((current) => {
      if (to < 0 || to >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function handleDrop(index: number) {
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    movePage(draggedIndex, index);
    setDraggedIndex(null);
  }

  return (
    <form action={saveStoryAction} className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
      {story?.id ? <input name="id" type="hidden" value={story.id} /> : null}

      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">
          {story ? 'Editar histÃ³ria' : 'Nova histÃ³ria'}
        </p>
        <h1 className="mt-2 text-4xl font-black text-ink">{story ? story.title : 'Cadastrar histÃ³ria'}</h1>
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">
          Preencha as etapas, revise a publicaÃ§Ã£o e salve. Visitantes sÃ³ verÃ£o histÃ³rias marcadas como publicadas.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <button
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              index === currentStep ? 'border-violet-300 bg-lilac/45 shadow-sm' : 'border-slate-200 bg-white'
            }`}
            key={step}
            onClick={() => setCurrentStep(index)}
            type="button"
          >
            <span className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Etapa {index + 1}</span>
            <strong className="mt-1 block text-ink">{step}</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{stepSummary[index]}</span>
          </button>
        ))}
      </div>

      {errors.length > 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose/35 p-4 text-sm font-bold text-rose-900" role="alert">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <section className={currentStep === 0 ? 'grid gap-5' : 'hidden'}>
        <label className="grid gap-2 text-sm font-black text-ink">
          TÃ­tulo da histÃ³ria
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.title}
            name="title"
            placeholder="Ex.: O ChapÃ©u do Leo"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          DescriÃ§Ã£o curta
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.description}
            name="description"
            placeholder="Resumo curto para famÃ­lias, professores e crianÃ§as"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          DescriÃ§Ã£o completa
          <textarea
            className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.fullDescription ?? story?.description}
            name="fullDescription"
            placeholder="Texto mais completo para a pÃ¡gina da histÃ³ria"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-ink">
            Autor
            <input className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={story?.author ?? 'HistÃ³rias da MamÃ¡'} name="author" required />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Categoria
            <select className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={defaultCategory} name="category">
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Idade indicada
            <select className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={story?.ageRange ?? '4 a 6 anos'} name="ageRange">
              <option>2 a 4 anos</option>
              <option>4 a 6 anos</option>
              <option>6 a 8 anos</option>
              <option>8 a 10 anos</option>
              <option>10+ anos</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Tempo de leitura em minutos
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3"
              defaultValue={story?.readingMinutes ?? 5}
              max={60}
              min={1}
              name="readingMinutes"
              required
              type="number"
            />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Tema principal
            <input className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={story?.theme ?? 'imaginaÃ§Ã£o'} name="theme" required />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-2xl bg-aqua/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.hasColoringVersion} name="hasColoringVersion" type="checkbox" />
            VersÃ£o para colorir
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-sun/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.isFeatured} name="isFeatured" type="checkbox" />
            Destaque na Home
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-rose/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.isStoryOfWeek} name="isStoryOfWeek" type="checkbox" />
            HistÃ³ria da semana
          </label>
        </div>
      </section>

      <section className={currentStep === 1 ? 'grid gap-5' : 'hidden'}>
        <div className="grid gap-5 md:grid-cols-2">
          <label
            className="grid min-h-72 cursor-pointer place-items-center rounded-[2rem] border-2 border-dashed border-violet-200 bg-lilac/25 p-6 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file && coverInputRef.current) {
                const transfer = new DataTransfer();
                transfer.items.add(file);
                coverInputRef.current.files = transfer.files;
                handleCover(transfer.files);
              }
            }}
          >
            {coverPreview ? (
              <img alt="PrÃ©via da capa" className="h-60 rounded-2xl object-cover shadow-soft" src={coverPreview} />
            ) : (
              <span className="grid place-items-center gap-3 text-ink">
                <ImagePlus className="h-10 w-10 text-violet-700" />
                <strong>Capa da histÃ³ria</strong>
                <small>Arraste ou selecione PNG, JPG ou WEBP atÃ© 8 MB.</small>
              </span>
            )}
            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              name="cover"
              onChange={(event) => handleCover(event.target.files)}
              ref={coverInputRef}
              type="file"
            />
          </label>

          <div className="grid gap-4">
            <label className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-6">
              <UploadCloud className="h-9 w-9 text-violet-700" />
              <strong className="mt-3 block text-ink">PDF da histÃ³ria</strong>
              <span className="mt-1 block text-sm text-slate-600">Use PDF atÃ© 50 MB.</span>
              <input accept="application/pdf" className="mt-4 block text-sm" name="storyPdf" onChange={(event) => handlePdf(event.target.files)} type="file" />
            </label>

            <label className="rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-6">
              <Layers3 className="h-9 w-9 text-violet-700" />
              <strong className="mt-3 block text-ink">Imagens das pÃ¡ginas</strong>
              <span className="mt-1 block text-sm text-slate-600">PNG, JPG ou WEBP atÃ© 8 MB cada.</span>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="mt-4 block text-sm"
                multiple
                name="pageImages"
                onChange={(event) => handlePageImages(event.target.files)}
                ref={pagesInputRef}
                type="file"
              />
            </label>
          </div>
        </div>

        {pagePreviews.length > 0 ? (
          <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-3">
            {pagePreviews.map((preview, index) => (
              <img alt={`PrÃ©via da pÃ¡gina ${index + 1}`} className="aspect-[3/4] rounded-2xl object-cover shadow-sm" key={preview} src={preview} />
            ))}
          </div>
        ) : null}
      </section>

      <section className={currentStep === 2 ? 'grid gap-4' : 'hidden'}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-ink">PÃ¡ginas da histÃ³ria</h2>
            <p className="text-sm text-slate-600">Arraste os blocos para reorganizar a leitura.</p>
          </div>
          <button className="rounded-full bg-slate-100 px-4 py-2 font-black text-ink" onClick={addPage} type="button">
            Adicionar pÃ¡gina
          </button>
        </div>

        {pageTexts.map((page, index) => (
          <article
            className="rounded-3xl border border-slate-200 bg-white p-4"
            draggable
            key={`${index}-${page.slice(0, 12)}`}
            onDragEnd={() => setDraggedIndex(null)}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={() => setDraggedIndex(index)}
            onDrop={() => handleDrop(index)}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <strong className="inline-flex items-center gap-2 text-ink">
                <GripVertical className="h-5 w-5 text-slate-400" />
                PÃ¡gina {index + 1}
              </strong>
              <div className="flex gap-2">
                <button className="rounded-full bg-slate-100 p-2" onClick={() => movePage(index, index - 1)} title="Subir pÃ¡gina" type="button">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-slate-100 p-2" onClick={() => movePage(index, index + 1)} title="Descer pÃ¡gina" type="button">
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button className="rounded-full bg-rose/70 px-3 py-2 text-sm font-black" onClick={() => removePage(index)} type="button">
                  Remover
                </button>
              </div>
            </div>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
              name="pageText"
              onChange={(event) => updatePage(index, event.target.value)}
              placeholder="Texto da pÃ¡gina"
              value={page}
            />
          </article>
        ))}
      </section>

      <section className={currentStep === 3 ? 'grid gap-5' : 'hidden'}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-3xl border border-slate-200 p-5">
            <span className="flex items-center gap-2 font-black text-ink">
              <FileText className="h-5 w-5" />
              Salvar rascunho
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-600">A histÃ³ria fica guardada no painel e nÃ£o aparece para visitantes.</p>
            <input className="mt-4 h-5 w-5" defaultChecked={story?.status !== 'published'} name="status" type="radio" value="draft" />
          </label>
          <label className="rounded-3xl border border-slate-200 p-5">
            <span className="flex items-center gap-2 font-black text-ink">
              <CheckCircle2 className="h-5 w-5" />
              Publicar
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-600">A histÃ³ria aparece na biblioteca pÃºblica apÃ³s salvar.</p>
            <input className="mt-4 h-5 w-5" defaultChecked={story?.status === 'published'} name="status" type="radio" value="published" />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button className="rounded-full bg-slate-100 px-5 py-3 font-black text-ink disabled:opacity-50" disabled={!canGoBack} onClick={() => setCurrentStep((step) => step - 1)} type="button">
          Voltar
        </button>
        <div className="flex flex-wrap gap-3">
          {canGoNext ? (
            <button className="rounded-full bg-ink px-6 py-3 font-black text-white" onClick={() => setCurrentStep((step) => step + 1)} type="button">
              PrÃ³xima etapa
            </button>
          ) : (
            <button className="rounded-full bg-ink px-8 py-4 text-lg font-black text-white shadow-soft" type="submit">
              Salvar / Publicar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
