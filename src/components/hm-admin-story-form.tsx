'use client';

/* eslint-disable @next/next/no-img-element */

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  FileText,
  GripVertical,
  ImagePlus,
  Layers3,
  Loader2,
  UploadCloud,
  WandSparkles,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { saveStoryAction } from '@/app/hm-admin/(protected)/actions';
import type { AdminCategorySummary, EditableStory } from '@/lib/admin-queries';

type AdminStoryFormProps = {
  categories: AdminCategorySummary[];
  story?: EditableStory;
};

type ImportedPage = {
  file: File | null;
  id: string;
  name: string;
  url: string;
};

type PdfJs = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (source: { data: Uint8Array }) => { promise: Promise<PdfDocument> };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => { height: number; width: number };
  render: (options: { canvasContext: CanvasRenderingContext2D; viewport: { height: number; width: number } }) => { promise: Promise<void> };
};

type ZipEntry = {
  compressedSize: number;
  compression: number;
  name: string;
  offset: number;
  uncompressedSize: number;
};

declare global {
  interface Window {
    pdfjsLib?: PdfJs;
  }
}

const steps = ['Importar', 'Dados básicos', 'Preview e páginas', 'Publicação'];

const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
const importTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  ...imageTypes,
];
const imageLimit = 8 * 1024 * 1024;
const pdfLimit = 80 * 1024 * 1024;
const archiveLimit = 120 * 1024 * 1024;
const pdfScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const pdfWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' });
}

function getExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

function getImageType(name: string) {
  const extension = getExtension(name);

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/png';
}

function fileToPage(file: File, index: number): ImportedPage {
  return {
    file,
    id: `${file.name}-${file.lastModified}-${file.size}-${index}`,
    name: file.name,
    url: URL.createObjectURL(file),
  };
}

function dataTransferFromFiles(files: File[]) {
  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  return transfer.files;
}

function readUInt16(view: DataView, offset: number) {
  return view.getUint16(offset, true);
}

function readUInt32(view: DataView, offset: number) {
  return view.getUint32(offset, true);
}

function decodeName(bytes: Uint8Array) {
  return new TextDecoder('utf-8').decode(bytes);
}

async function loadPdfJs() {
  const browserWindow = window as Window & { pdfjsLib?: PdfJs };

  if (browserWindow.pdfjsLib) {
    return browserWindow.pdfjsLib;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${pdfScriptUrl}"]`);

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Não foi possível carregar o leitor de PDF.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = pdfScriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Não foi possível carregar o leitor de PDF.'));
    document.head.appendChild(script);
  });

  const pdfjs = browserWindow.pdfjsLib as PdfJs | undefined;

  if (!pdfjs) {
    throw new Error('Não foi possível iniciar o leitor de PDF.');
  }

  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  return pdfjs;
}

async function canvasToFile(canvas: HTMLCanvasElement, name: string) {
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Não foi possível gerar a imagem da página.'))), 'image/png', 0.96);
  });

  return new File([blob], name, { type: 'image/png' });
}

async function extractPdfPages(file: File) {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: File[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Não foi possível preparar a miniatura da página.');
    }

    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    pages.push(await canvasToFile(canvas, `${file.name.replace(/\.pdf$/i, '')}-pagina-${String(pageNumber).padStart(2, '0')}.png`));
  }

  return pages;
}

function findZipEntries(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const entries: ZipEntry[] = [];

  for (let offset = 0; offset < bytes.length - 46; offset += 1) {
    if (readUInt32(view, offset) !== 0x02014b50) {
      continue;
    }

    const compression = readUInt16(view, offset + 10);
    const compressedSize = readUInt32(view, offset + 20);
    const uncompressedSize = readUInt32(view, offset + 24);
    const nameLength = readUInt16(view, offset + 28);
    const extraLength = readUInt16(view, offset + 30);
    const commentLength = readUInt16(view, offset + 32);
    const localHeaderOffset = readUInt32(view, offset + 42);
    const name = decodeName(bytes.slice(offset + 46, offset + 46 + nameLength));

    entries.push({
      compressedSize,
      compression,
      name,
      offset: localHeaderOffset,
      uncompressedSize,
    });

    offset += 45 + nameLength + extraLength + commentLength;
  }

  return entries;
}

async function inflateRaw(data: Uint8Array) {
  if (!('DecompressionStream' in window)) {
    throw new Error('Este navegador não consegue abrir arquivos ZIP automaticamente. Envie imagens separadas.');
  }

  const chunk = new ArrayBuffer(data.byteLength);
  new Uint8Array(chunk).set(data);
  const stream = new Blob([chunk]).stream().pipeThrough(new DecompressionStream('deflate-raw' as CompressionFormat));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function readZipEntry(buffer: ArrayBuffer, entry: ZipEntry) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const localOffset = entry.offset;

  if (readUInt32(view, localOffset) !== 0x04034b50) {
    throw new Error(`Não foi possível ler ${entry.name}.`);
  }

  const nameLength = readUInt16(view, localOffset + 26);
  const extraLength = readUInt16(view, localOffset + 28);
  const dataStart = localOffset + 30 + nameLength + extraLength;
  const compressed = bytes.slice(dataStart, dataStart + entry.compressedSize);

  if (entry.compression === 0) {
    return compressed;
  }

  if (entry.compression === 8) {
    return inflateRaw(compressed);
  }

  throw new Error(`O arquivo ${entry.name} usa uma compressão não suportada.`);
}

async function extractZipImages(file: File, docxOnly = false) {
  const buffer = await file.arrayBuffer();
  const entries = findZipEntries(buffer)
    .filter((entry) => {
      const normalized = entry.name.toLowerCase();
      const isImage = /\.(png|jpe?g|webp)$/.test(normalized);
      return isImage && (!docxOnly || normalized.startsWith('word/media/'));
    })
    .sort((a, b) => naturalCompare(a.name, b.name));

  if (entries.length === 0) {
    throw new Error(docxOnly ? 'Não encontrei imagens dentro do DOCX.' : 'Não encontrei imagens dentro do ZIP.');
  }

  const files: File[] = [];

  for (const [index, entry] of entries.entries()) {
    const content = await readZipEntry(buffer, entry);
    const type = getImageType(entry.name);
    const extension = getExtension(entry.name) || 'png';
    files.push(new File([content], `${String(index + 1).padStart(2, '0')}-${entry.name.split('/').pop() ?? `pagina.${extension}`}`, { type }));
  }

  return files;
}

function validateImportFile(file: File) {
  const extension = getExtension(file.name);
  const isDocx = extension === 'docx';
  const isZip = extension === 'zip';
  const isPdf = file.type === 'application/pdf' || extension === 'pdf';
  const isImage = imageTypes.includes(file.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(extension);

  if (!isDocx && !isZip && !isPdf && !isImage) {
    return `${file.name}: envie PDF, DOCX, ZIP ou imagens PNG/JPG/WEBP.`;
  }

  if (isImage && file.size > imageLimit) {
    return `${file.name}: imagem acima de ${formatSize(imageLimit)}.`;
  }

  if (isPdf && file.size > pdfLimit) {
    return `${file.name}: PDF acima de ${formatSize(pdfLimit)}.`;
  }

  if ((isDocx || isZip) && file.size > archiveLimit) {
    return `${file.name}: arquivo acima de ${formatSize(archiveLimit)}.`;
  }

  return '';
}

export function AdminStoryForm({ categories, story }: AdminStoryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState('');
  const [cover, setCover] = useState<ImportedPage | null>(
    story?.coverUrl ? { file: null, id: 'saved-cover', name: 'Capa atual', url: story.coverUrl } : null,
  );
  const [pages, setPages] = useState<ImportedPage[]>(
    story?.pageImages?.filter(Boolean).map((url, index) => ({
      file: null,
      id: `saved-page-${index}`,
      name: `Página atual ${index + 1}`,
      url: url as string,
    })) ?? [],
  );
  const [pageTexts, setPageTexts] = useState<string[]>(story?.pages?.length ? story.pages : []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const pagesInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const defaultCategory = story?.category ?? categories[0]?.name ?? 'Aventura';
  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;

  const stepSummary = useMemo(
    () => [
      'PDF, DOCX, ZIP ou imagens; capa e páginas são montadas automaticamente.',
      'Título, descrição, autoria, categoria e faixa etária.',
      'Confira miniaturas, troque a capa e reorganize por arrastar.',
      'Rascunho ou publicação imediata para visitantes.',
    ],
    [],
  );

  const importedPageFiles = pages.map((page) => page.file).filter((file): file is File => Boolean(file));

  useEffect(() => {
    return () => {
      if (cover?.file) {
        URL.revokeObjectURL(cover.url);
      }

      pages.forEach((page) => {
        if (page.file) {
          URL.revokeObjectURL(page.url);
        }
      });
    };
  }, [cover, pages]);

  useEffect(() => {
    if (coverInputRef.current) {
      coverInputRef.current.files = cover?.file ? dataTransferFromFiles([cover.file]) : dataTransferFromFiles([]);
    }

    if (pagesInputRef.current) {
      pagesInputRef.current.files = dataTransferFromFiles(importedPageFiles);
    }
  }, [cover, importedPageFiles]);

  function applyImportedFiles(files: File[], sourceLabel: string) {
    if (files.length === 0) {
      setErrors(['Não encontrei páginas para importar.']);
      return;
    }

    const [coverFile, ...pageFiles] = files;
    setCover(fileToPage(coverFile, 0));
    setPages(pageFiles.map((file, index) => fileToPage(file, index + 1)));
    setPageTexts((current) => {
      const nextLength = Math.max(pageFiles.length, current.length);
      return Array.from({ length: nextLength }, (_, index) => current[index] ?? '');
    });
    setImportSummary(`${sourceLabel}: 1 capa e ${pageFiles.length} página${pageFiles.length === 1 ? '' : 's'} prontas para revisar.`);
    setCurrentStep(2);
  }

  async function importFiles(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []).sort((a, b) => naturalCompare(a.name, b.name));

    if (selectedFiles.length === 0) {
      return;
    }

    const nextErrors = selectedFiles.map(validateImportFile).filter(Boolean);

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors([]);
    setIsImporting(true);
    setImportSummary('');

    try {
      const firstFile = selectedFiles[0];
      const extension = getExtension(firstFile.name);

      if (selectedFiles.length > 1 || imageTypes.includes(firstFile.type) || ['png', 'jpg', 'jpeg', 'webp'].includes(extension)) {
        applyImportedFiles(selectedFiles, 'Imagens importadas');
        return;
      }

      if (firstFile.type === 'application/pdf' || extension === 'pdf') {
        const pdfPages = await extractPdfPages(firstFile);
        applyImportedFiles(pdfPages, 'PDF importado');

        if (pdfInputRef.current) {
          pdfInputRef.current.files = dataTransferFromFiles([firstFile]);
        }

        return;
      }

      if (extension === 'docx') {
        applyImportedFiles(await extractZipImages(firstFile, true), 'DOCX importado');
        return;
      }

      if (extension === 'zip' || firstFile.type === 'application/zip' || firstFile.type === 'application/x-zip-compressed') {
        applyImportedFiles(await extractZipImages(firstFile), 'ZIP importado');
      }
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Não foi possível importar este arquivo.']);
    } finally {
      setIsImporting(false);
      if (importInputRef.current) {
        importInputRef.current.value = '';
      }
    }
  }

  function handleCover(files: FileList | null) {
    const file = files?.[0];

    if (!file) {
      return;
    }

    const error = validateImportFile(file);

    if (error || !imageTypes.includes(file.type)) {
      setErrors([error || 'A capa precisa ser PNG, JPG ou WEBP.']);
      return;
    }

    setErrors([]);
    setCover(fileToPage(file, 0));
  }

  function addPage() {
    setPageTexts((current) => [...current, '']);
  }

  function updatePage(index: number, value: string) {
    setPageTexts((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  function removePage(index: number) {
    setPages((current) => current.filter((_, pageIndex) => pageIndex !== index));
    setPageTexts((current) => current.filter((_, pageIndex) => pageIndex !== index));
  }

  function movePage(from: number, to: number) {
    if (to < 0) {
      return;
    }

    setPages((current) => {
      if (from >= current.length || to >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });

    setPageTexts((current) => {
      if (from >= current.length || to >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function makeCoverFromPage(index: number) {
    const page = pages[index];

    if (!page) {
      return;
    }

    setCover(page);
    setPages((current) => current.filter((_, pageIndex) => pageIndex !== index));
    setPageTexts((current) => current.filter((_, pageIndex) => pageIndex !== index));
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
      <input name="cover" ref={coverInputRef} type="file" className="hidden" />
      <input name="pageImages" ref={pagesInputRef} type="file" className="hidden" multiple />
      <input name="storyPdf" ref={pdfInputRef} type="file" className="hidden" />
      {cover && !cover.file ? <input name="existingCoverUrl" type="hidden" value={cover.url} /> : null}
      {pages.map((page) => (
        <input key={page.id} name="pageImageSource" type="hidden" value={page.file ? '__upload__' : page.url} />
      ))}

      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">
          {story ? 'Editar história' : 'Nova história'}
        </p>
        <h1 className="mt-2 text-4xl font-black text-ink">{story ? story.title : 'Cadastrar história em 1 minuto'}</h1>
        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          Importe um PDF, DOCX, ZIP ou imagens. O sistema monta capa, páginas, miniaturas e ordem para você revisar antes de publicar.
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

      {importSummary ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
          {importSummary}
        </div>
      ) : null}

      <section className={currentStep === 0 ? 'grid gap-5' : 'hidden'}>
        <label
          className="grid min-h-80 cursor-pointer place-items-center rounded-[2rem] border-2 border-dashed border-violet-200 bg-gradient-to-br from-cream via-white to-lilac/45 p-8 text-center transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-soft"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            importFiles(event.dataTransfer.files);
          }}
        >
          <span className="grid max-w-2xl place-items-center gap-4 text-ink">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-white shadow-soft">
              {isImporting ? <Loader2 className="h-10 w-10 animate-spin text-violet-700" /> : <WandSparkles className="h-10 w-10 text-violet-700" />}
            </span>
            <strong className="font-display text-3xl text-plum">Importar história pronta</strong>
            <span className="text-base leading-7 text-slate-600">
              Arraste um PDF, DOCX, ZIP de imagens ou selecione imagens soltas. A primeira página vira capa e as demais viram páginas da história.
            </span>
            <span className="rounded-full bg-plum px-6 py-3 text-sm font-black text-white shadow-soft">
              {isImporting ? 'Gerando miniaturas...' : 'Escolher arquivo'}
            </span>
          </span>
          <input
            accept=".pdf,.docx,.zip,image/png,image/jpeg,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
            className="sr-only"
            disabled={isImporting}
            multiple
            onChange={(event) => importFiles(event.target.files)}
            ref={importInputRef}
            type="file"
          />
        </label>

        <div className="grid gap-4 rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-700 md:grid-cols-3">
          <p><strong className="text-ink">PDF ou DOCX:</strong> páginas extraídas automaticamente, com capa na primeira página.</p>
          <p><strong className="text-ink">ZIP ou imagens:</strong> arquivos ordenados pelo nome, prontos para reorganizar.</p>
          <p><strong className="text-ink">Antes de salvar:</strong> revise a capa, arraste páginas e clique em Publicar.</p>
        </div>
      </section>

      <section className={currentStep === 1 ? 'grid gap-5' : 'hidden'}>
        <label className="grid gap-2 text-sm font-black text-ink">
          Título da história
          <input
            className="rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.title}
            name="title"
            placeholder="Ex.: O Chapéu do Leo"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          Descrição curta
          <textarea
            className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.description}
            name="description"
            placeholder="Resumo curto para famílias, professores e crianças"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          Descrição completa
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3"
            defaultValue={story?.fullDescription ?? story?.description}
            name="fullDescription"
            placeholder="Texto mais completo para a página da história"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-ink">
            Autor
            <input className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={story?.author ?? 'Histórias da Mamá'} name="author" required />
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
            <input className="rounded-2xl border border-slate-200 px-4 py-3" defaultValue={story?.theme ?? 'imaginação'} name="theme" required />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-2xl bg-aqua/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.hasColoringVersion} name="hasColoringVersion" type="checkbox" />
            Versão para colorir
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-sun/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.isFeatured} name="isFeatured" type="checkbox" />
            Destaque na Home
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-rose/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" defaultChecked={story?.isStoryOfWeek} name="isStoryOfWeek" type="checkbox" />
            História da semana
          </label>
        </div>
      </section>

      <section className={currentStep === 2 ? 'grid gap-5' : 'hidden'}>
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-ink">Capa</h2>
              <label className="cursor-pointer rounded-full bg-lilac/60 px-3 py-2 text-xs font-black text-plum">
                Trocar
                <input
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => handleCover(event.target.files)}
                  type="file"
                />
              </label>
            </div>
            <div className="mt-4 grid aspect-[3/4] place-items-center overflow-hidden rounded-3xl bg-lilac/25">
              {cover ? (
                <img alt="Prévia da capa" className="h-full w-full object-cover" src={cover.url} />
              ) : (
                <span className="grid place-items-center gap-2 p-6 text-center text-sm font-bold text-slate-500">
                  <ImagePlus className="h-9 w-9" />
                  Importe um arquivo para gerar a capa.
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-ink">Preview das páginas</h2>
                <p className="text-sm text-slate-600">Arraste as miniaturas para reorganizar. A ordem exibida será a ordem salva no leitor.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-ink">
                <Layers3 className="h-4 w-4" />
                Adicionar imagens
                <input
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []).sort((a, b) => naturalCompare(a.name, b.name));
                    setPages((current) => [...current, ...files.map((file, index) => fileToPage(file, current.length + index))]);
                    setPageTexts((current) => [...current, ...files.map(() => '')]);
                    event.target.value = '';
                  }}
                  type="file"
                />
              </label>
            </div>

            {pages.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pages.map((page, index) => (
                  <article
                    className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
                    draggable
                    key={page.id}
                    onDragEnd={() => setDraggedIndex(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDraggedIndex(index)}
                    onDrop={() => handleDrop(index)}
                  >
                    <div className="flex items-center justify-between gap-2 pb-3">
                      <strong className="inline-flex items-center gap-2 text-sm text-ink">
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        Página {index + 1}
                      </strong>
                      <div className="flex gap-1">
                        <button className="rounded-full bg-slate-100 p-2" onClick={() => movePage(index, index - 1)} title="Subir página" type="button">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button className="rounded-full bg-slate-100 p-2" onClick={() => movePage(index, index + 1)} title="Descer página" type="button">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <img alt={`Prévia da página ${index + 1}`} className="aspect-[3/4] w-full rounded-2xl object-cover" src={page.url} />
                    <p className="mt-2 truncate text-xs font-bold text-slate-500">{page.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-full bg-lilac/60 px-3 py-2 text-xs font-black text-plum" onClick={() => makeCoverFromPage(index)} type="button">
                        Usar como capa
                      </button>
                      <button className="rounded-full bg-rose/70 px-3 py-2 text-xs font-black text-ink" onClick={() => removePage(index)} type="button">
                        Remover
                      </button>
                    </div>
                    <textarea
                      className="mt-3 min-h-20 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                      name="pageText"
                      onChange={(event) => updatePage(index, event.target.value)}
                      placeholder="Texto opcional da página"
                      value={pageTexts[index] ?? ''}
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-bold text-slate-500">
                Nenhuma página importada ainda.
              </div>
            )}

            {pageTexts.slice(pages.length).map((page, extraIndex) => {
              const index = pages.length + extraIndex;
              return (
                <article className="rounded-3xl border border-slate-200 bg-white p-4" key={`text-page-${index}`}>
                  <strong className="text-ink">Página de texto {extraIndex + 1}</strong>
                  <textarea
                    className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    name="pageText"
                    onChange={(event) => updatePage(index, event.target.value)}
                    placeholder="Texto da página"
                    value={page}
                  />
                </article>
              );
            })}

            <button className="rounded-full bg-slate-100 px-4 py-2 font-black text-ink" onClick={addPage} type="button">
              Adicionar página de texto
            </button>
          </div>
        </div>
      </section>

      <section className={currentStep === 3 ? 'grid gap-5' : 'hidden'}>
        <div className="rounded-[2rem] bg-lilac/25 p-5">
          <h2 className="text-2xl font-black text-ink">Resumo antes de salvar</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Capa {cover ? 'pronta' : 'pendente'} · {pages.length} página{pages.length === 1 ? '' : 's'} com imagem · {pageTexts.filter(Boolean).length} texto{pageTexts.filter(Boolean).length === 1 ? '' : 's'} de página.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-3xl border border-slate-200 p-5">
            <span className="flex items-center gap-2 font-black text-ink">
              <FileText className="h-5 w-5" />
              Salvar rascunho
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-600">A história fica guardada no painel e não aparece para visitantes.</p>
            <input className="mt-4 h-5 w-5" defaultChecked={story?.status !== 'published'} name="status" type="radio" value="draft" />
          </label>
          <label className="rounded-3xl border border-slate-200 p-5">
            <span className="flex items-center gap-2 font-black text-ink">
              <CheckCircle2 className="h-5 w-5" />
              Publicar
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-600">A história aparece na biblioteca pública após salvar.</p>
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
              Próxima etapa
            </button>
          ) : (
            <button className="rounded-full bg-ink px-8 py-4 text-lg font-black text-white shadow-soft" type="submit">
              Publicar história
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
