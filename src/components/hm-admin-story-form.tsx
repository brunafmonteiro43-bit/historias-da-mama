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
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useForm, type FieldErrors, type FieldPath } from 'react-hook-form';
import { z } from 'zod';
import type { AdminCategorySummary, EditableStory } from '@/lib/admin-queries';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

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

type StoryFormValues = {
  ageRange: string;
  author: string;
  category: string;
  description: string;
  fullDescription: string;
  hasColoringVersion: boolean;
  isFeatured: boolean;
  isStoryOfWeek: boolean;
  readingMinutes: number;
  status: 'draft' | 'published';
  theme: string;
  title: string;
};

type UploadStage =
  | 'idle'
  | 'creating'
  | 'cover'
  | 'pdf'
  | 'pages'
  | 'saving'
  | 'publishing'
  | 'done'
  | 'error';

declare global {
  interface Window {
    pdfjsLib?: PdfJs;
  }
}

const steps = ['Importar', 'Dados básicos', 'Preview e páginas', 'Publicação'];

const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
const pdfTypes = ['application/pdf'];
const importTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  ...imageTypes,
];
const coverLimit = 5 * 1024 * 1024;
const imageLimit = 10 * 1024 * 1024;
const pdfLimit = 50 * 1024 * 1024;
const archiveLimit = 120 * 1024 * 1024;
const uploadTimeoutMs = 30_000;
const pdfScriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const pdfWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const storyFormSchema = z.object({
  ageRange: z.string().min(1, 'Escolha a faixa etária.'),
  author: z.string().trim().min(2, 'Informe o autor.'),
  category: z.string().min(1, 'Escolha uma categoria.'),
  description: z.string().trim().min(10, 'Escreva uma descrição curta com pelo menos 10 caracteres.'),
  fullDescription: z.string().default(''),
  hasColoringVersion: z.boolean(),
  isFeatured: z.boolean(),
  isStoryOfWeek: z.boolean(),
  readingMinutes: z.coerce.number().int('Informe um número inteiro.').min(1, 'O tempo mínimo é 1 minuto.').max(60, 'O tempo máximo é 60 minutos.'),
  status: z.enum(['draft', 'published']),
  theme: z.string().trim().min(2, 'Informe o tema principal.'),
  title: z.string().trim().min(3, 'Informe o título da história.'),
});

const fieldsByStep: Record<number, Array<FieldPath<StoryFormValues>>> = {
  1: ['title', 'description', 'author', 'category', 'ageRange'],
  2: [],
  3: ['title', 'description', 'author', 'category', 'ageRange', 'readingMinutes', 'theme', 'status'],
};

const zodStoryResolver = async (values: StoryFormValues) => {
  const result = storyFormSchema.safeParse(values);

  if (result.success) {
    return { errors: {}, values: result.data as StoryFormValues };
  }

  return {
    errors: result.error.issues.reduce<FieldErrors<StoryFormValues>>((accumulator, issue) => {
      const field = issue.path[0] as FieldPath<StoryFormValues> | undefined;

      if (field) {
        accumulator[field] = { message: issue.message, type: issue.code };
      }

      return accumulator;
    }, {}),
    values: {},
  };
};

function formatSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function normalizeFileName(name: string) {
  const extension = getExtension(name);
  const baseName = name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);

  return `${baseName || 'arquivo'}${extension ? `.${extension}` : ''}`;
}

function uniquePath(storyId: string, folder: string, fileName: string) {
  const unique = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  return `stories/${storyId}/${folder}/${unique}-${normalizeFileName(fileName)}`;
}

function withTimeout<T>(operation: PromiseLike<T>, message: string) {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), uploadTimeoutMs);
  });

  return Promise.race([operation, timeout]).finally(() => clearTimeout(timeoutId));
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

function validateUploadFiles(cover: ImportedPage | null, pdf: File | null, pages: ImportedPage[]) {
  const nextErrors: string[] = [];

  if (cover?.file) {
    if (!imageTypes.includes(cover.file.type)) {
      nextErrors.push('A capa deve ser PNG, JPG ou WEBP.');
    }

    if (cover.file.size > coverLimit) {
      nextErrors.push(`A capa deve ter no máximo ${formatSize(coverLimit)}.`);
    }
  }

  if (pdf) {
    if (!pdfTypes.includes(pdf.type)) {
      nextErrors.push('O arquivo original deve ser PDF.');
    }

    if (pdf.size > pdfLimit) {
      nextErrors.push(`O PDF deve ter no máximo ${formatSize(pdfLimit)}.`);
    }
  }

  pages.forEach((page, index) => {
    if (!page.file) {
      return;
    }

    if (!imageTypes.includes(page.file.type)) {
      nextErrors.push(`A página ${index + 1} deve ser PNG, JPG ou WEBP.`);
    }

    if (page.file.size > imageLimit) {
      nextErrors.push(`A página ${index + 1} deve ter no máximo ${formatSize(imageLimit)}.`);
    }
  });

  return nextErrors;
}

async function getOrCreateAuthorId(supabase: ReturnType<typeof createBrowserSupabaseClient>, name: string) {
  const { data: existing, error: readError } = await supabase.from('authors').select('id').eq('name', name).maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return existing.id as string;
  }

  const { data, error } = await supabase.from('authors').insert({ name }).select('id').single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Não foi possível salvar o autor.');
  }

  return data.id as string;
}

async function getOrCreateCategoryId(supabase: ReturnType<typeof createBrowserSupabaseClient>, name: string) {
  const { data: existing, error: readError } = await supabase.from('categories').select('id').eq('name', name).maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing?.id) {
    return existing.id as string;
  }

  const { data, error } = await supabase.from('categories').insert({ description: '', name, slug: slugify(name) }).select('id').single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Não foi possível salvar a categoria.');
  }

  return data.id as string;
}

export function AdminStoryForm({ categories, story }: AdminStoryFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [importSummary, setImportSummary] = useState('');
  const [originalPdf, setOriginalPdf] = useState<File | null>(null);
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
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const defaultCategory = story?.category ?? categories[0]?.name ?? 'Aventura';
  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;
  const defaultValues = useMemo<StoryFormValues>(
    () => ({
      ageRange: story?.ageRange ?? '4 a 6 anos',
      author: story?.author ?? 'Histórias da Mamá',
      category: defaultCategory,
      description: story?.description ?? '',
      fullDescription: story?.fullDescription ?? story?.description ?? '',
      hasColoringVersion: Boolean(story?.hasColoringVersion),
      isFeatured: Boolean(story?.isFeatured),
      isStoryOfWeek: Boolean(story?.isStoryOfWeek),
      readingMinutes: story?.readingMinutes ?? 5,
      status: story?.status === 'published' ? 'published' : 'draft',
      theme: story?.theme ?? 'imaginação',
      title: story?.title ?? '',
    }),
    [defaultCategory, story],
  );
  const {
    formState: { errors: formErrors },
    getValues,
    register,
    setFocus,
    trigger,
    watch,
  } = useForm<StoryFormValues>({
    defaultValues,
    mode: 'onTouched',
    resolver: zodStoryResolver,
    shouldFocusError: true,
    shouldUnregister: false,
  });
  const selectedStatus = watch('status');

  const stepSummary = useMemo(
    () => [
      'PDF, DOCX, ZIP ou imagens; capa e páginas são montadas automaticamente.',
      'Título, descrição, autoria, categoria e faixa etária.',
      'Confira miniaturas, troque a capa e reorganize por arrastar.',
      'Rascunho ou publicação imediata para visitantes.',
    ],
    [],
  );

  function collectCurrentErrors(fields?: Array<FieldPath<StoryFormValues>>) {
    const result = storyFormSchema.safeParse(getValues());
    const allowedFields = fields ? new Set(fields) : null;

    if (result.success) {
      return {};
    }

    return result.error.issues.reduce<FieldErrors<StoryFormValues>>((accumulator, issue) => {
      const field = issue.path[0] as FieldPath<StoryFormValues> | undefined;

      if (field && (!allowedFields || allowedFields.has(field))) {
        accumulator[field] = { message: issue.message, type: issue.code };
      }

      return accumulator;
    }, {});
  }

  function getFirstErrorStep(fieldErrors: FieldErrors<StoryFormValues>) {
    const errorNames = Object.keys(fieldErrors) as Array<FieldPath<StoryFormValues>>;

    if (errorNames.some((name) => fieldsByStep[1].includes(name))) {
      return 1;
    }

    return 3;
  }

  function focusFirstError(fieldErrors: FieldErrors<StoryFormValues>) {
    const firstError = (Object.keys(fieldErrors) as Array<FieldPath<StoryFormValues>>)[0];

    if (firstError) {
      setTimeout(() => setFocus(firstError), 50);
    }
  }

  async function validateStep(step: number) {
    const fields = fieldsByStep[step];
    const valid = fields.length > 0 ? await trigger(fields) : true;

    if (!valid) {
      const currentErrors = collectCurrentErrors(fields);
      toast({ title: 'Preencha os campos obrigatórios' });
      focusFirstError(currentErrors);
    }

    return valid;
  }

  async function goToNextStep() {
    const valid = await validateStep(currentStep);

    if (!valid) {
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function updateProgress(stage: UploadStage, message: string) {
    setUploadStage(stage);
    setUploadMessage(message);
    console.info(`[hm-admin] ${message}`);
  }

  async function uploadDirectFile(bucket: 'story-covers' | 'story-pages' | 'story-pdfs', path: string, file: File, label: string) {
    const supabase = createBrowserSupabaseClient();
    console.info(`[hm-admin] ${label} iniciado`, { bucket, path, size: file.size, type: file.type });

    const { error } = await withTimeout(
      supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      }),
      `${label} demorou mais de 30 segundos.`,
    );

    if (error) {
      throw new Error(`${label}: ${error.message}`);
    }

    console.info(`[hm-admin] ${label} concluído`, { bucket, path });
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function handlePublish() {
    const valid = await trigger();

    if (!valid) {
      const currentErrors = collectCurrentErrors();
      const firstErrorStep = getFirstErrorStep(currentErrors);
      setCurrentStep(firstErrorStep);
      toast({ title: 'Preencha os campos obrigatórios' });
      focusFirstError(currentErrors);
      return;
    }

    const fileErrors = validateUploadFiles(cover, originalPdf, pages);

    if (fileErrors.length > 0) {
      setErrors(fileErrors);
      setCurrentStep(2);
      toast({ title: 'Revise os arquivos', description: fileErrors[0] });
      return;
    }

    setIsPublishing(true);
    setErrors([]);
    setUploadStage('creating');

    try {
      const supabase = createBrowserSupabaseClient();
      const values = storyFormSchema.parse(getValues());
      const now = new Date().toISOString();
      const authorId = await getOrCreateAuthorId(supabase, values.author.trim());
      const categoryId = await getOrCreateCategoryId(supabase, values.category);
      const temporarySlug = slugify(values.title);
      const basePayload = {
        age_range: values.ageRange,
        author_id: authorId,
        category_id: categoryId,
        description: values.description,
        full_description: values.fullDescription || values.description,
        has_coloring_version: values.hasColoringVersion,
        is_featured: values.isFeatured,
        is_story_of_week: values.isStoryOfWeek,
        published_at: null,
        reading_time_minutes: values.readingMinutes,
        slug: temporarySlug,
        status: 'draft',
        theme: values.theme,
        title: values.title,
        updated_at: now,
      };

      updateProgress('creating', 'Criando história');
      const response = story?.id
        ? await withTimeout(
            supabase.from('stories').update(basePayload).eq('id', story.id).select('id').single(),
            'A criação do rascunho demorou mais de 30 segundos.',
          )
        : await withTimeout(
            supabase.from('stories').insert(basePayload).select('id').single(),
            'A criação do rascunho demorou mais de 30 segundos.',
          );

      if (response.error || !response.data) {
        throw new Error(response.error?.message ?? 'Não foi possível criar a história temporária.');
      }

      const storyId = response.data.id as string;
      console.info('[hm-admin] história temporária criada', { storyId });
      let coverUrl = cover && !cover.file ? cover.url : null;
      let pdfUrl = story?.pdfUrl ?? null;

      if (cover?.file) {
        updateProgress('cover', 'Enviando capa');
        coverUrl = await uploadDirectFile('story-covers', uniquePath(storyId, 'cover', cover.file.name), cover.file, 'Upload da capa');
      }

      if (originalPdf) {
        updateProgress('pdf', 'Enviando PDF');
        pdfUrl = await uploadDirectFile('story-pdfs', uniquePath(storyId, 'original', originalPdf.name), originalPdf, 'Upload do PDF');
      }

      updateProgress('pages', `Enviando páginas 0 de ${pages.length}`);
      const pageImageUrls: Array<string | null> = [];

      for (const [index, page] of pages.entries()) {
        if (!page.file) {
          pageImageUrls.push(page.url);
          continue;
        }

        updateProgress('pages', `Enviando página ${index + 1} de ${pages.length}`);
        const paddedPage = String(index + 1).padStart(3, '0');
        pageImageUrls.push(
          await uploadDirectFile('story-pages', `stories/${storyId}/pages/page-${paddedPage}-${normalizeFileName(page.file.name)}`, page.file, `Upload da página ${index + 1}`),
        );
      }

      updateProgress('saving', 'Salvando dados');
      await withTimeout(supabase.from('story_pages').delete().eq('story_id', storyId), 'A limpeza das páginas demorou mais de 30 segundos.');

      const pageCount = Math.max(pageImageUrls.length, pageTexts.length);
      const pageRows = Array.from({ length: pageCount }, (_, index) => ({
        content: pageTexts[index] ?? '',
        image_url: pageImageUrls[index] ?? null,
        page_number: index + 1,
        story_id: storyId,
      }));

      if (pageRows.length > 0) {
        const { error } = await withTimeout(
          supabase.from('story_pages').insert(pageRows),
          'O salvamento das páginas demorou mais de 30 segundos.',
        );

        if (error) {
          throw new Error(error.message);
        }
      }

      updateProgress('publishing', values.status === 'published' ? 'Publicando' : 'Salvando rascunho');
      const { error: updateError } = await withTimeout(
        supabase
          .from('stories')
          .update({
            cover_url: coverUrl,
            pdf_url: pdfUrl,
            published_at: values.status === 'published' ? new Date().toISOString() : null,
            status: values.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', storyId),
        'A publicação demorou mais de 30 segundos.',
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      console.info('[hm-admin] publicação concluída', { storyId, pages: pageRows.length, status: values.status });
      setUploadStage('done');
      toast({
        title: values.status === 'published' ? 'História publicada!' : 'Rascunho salvo!',
        description: 'Tudo foi salvo no Supabase com sucesso.',
      });
      router.push('/hm-admin/stories');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível publicar a história.';
      console.error('[hm-admin] falha ao publicar história', error);
      setUploadStage('error');
      setUploadMessage(message);
      setIsPublishing(false);
      toast({ title: 'Erro ao publicar', description: message });
    }
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function fieldClass(name: FieldPath<StoryFormValues>) {
    return `rounded-2xl border px-4 py-3 outline-none transition ${
      formErrors[name]
        ? 'border-rose-400 bg-rose/10 focus:border-rose-500 focus:ring-4 focus:ring-rose/25'
        : 'border-slate-200 focus:border-plum focus:ring-4 focus:ring-lilac/25'
    }`;
  }

  function FieldError({ name }: { name: FieldPath<StoryFormValues> }) {
    const message = formErrors[name]?.message;

    return message ? <span className="text-sm font-bold text-rose-700">{String(message)}</span> : null;
  }

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
        setOriginalPdf(null);
        applyImportedFiles(selectedFiles, 'Imagens importadas');
        return;
      }

      if (firstFile.type === 'application/pdf' || extension === 'pdf') {
        const pdfPages = await extractPdfPages(firstFile);
        setOriginalPdf(firstFile);
        applyImportedFiles(pdfPages, 'PDF importado');

        return;
      }

      if (extension === 'docx') {
        setOriginalPdf(null);
        applyImportedFiles(await extractZipImages(firstFile, true), 'DOCX importado');
        return;
      }

      if (extension === 'zip' || firstFile.type === 'application/zip' || firstFile.type === 'application/x-zip-compressed') {
        setOriginalPdf(null);
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
    <form className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-soft md:p-8" onSubmit={handleFormSubmit} ref={formRef} noValidate>
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

      {uploadStage !== 'idle' ? (
        <div className="rounded-2xl border border-lilac/30 bg-lilac/20 p-4 text-sm font-bold text-plum" role="status" aria-live="polite">
          <div className="flex items-center gap-3">
            {isPublishing && uploadStage !== 'error' && uploadStage !== 'done' ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            <span>{uploadMessage || 'Preparando publicação'}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-coral transition-all"
              style={{
                width:
                  uploadStage === 'creating'
                    ? '14%'
                    : uploadStage === 'cover'
                      ? '30%'
                      : uploadStage === 'pdf'
                        ? '44%'
                        : uploadStage === 'pages'
                          ? '62%'
                          : uploadStage === 'saving'
                            ? '78%'
                            : uploadStage === 'publishing'
                              ? '92%'
                              : uploadStage === 'done'
                                ? '100%'
                                : '100%',
              }}
            />
          </div>
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
            className={fieldClass('title')}
            placeholder="Ex.: O Chapéu do Leo"
            {...register('title')}
          />
          <FieldError name="title" />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          Descrição curta
          <textarea
            className={`min-h-24 ${fieldClass('description')}`}
            placeholder="Resumo curto para famílias, professores e crianças"
            {...register('description')}
          />
          <FieldError name="description" />
        </label>

        <label className="grid gap-2 text-sm font-black text-ink">
          Descrição completa
          <textarea
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="Texto mais completo para a página da história"
            {...register('fullDescription')}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-black text-ink">
            Autor
            <input className={fieldClass('author')} {...register('author')} />
            <FieldError name="author" />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Categoria
            <select className={fieldClass('category')} {...register('category')}>
              {categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
            <FieldError name="category" />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Idade indicada
            <select className={fieldClass('ageRange')} {...register('ageRange')}>
              <option>2 a 4 anos</option>
              <option>4 a 6 anos</option>
              <option>6 a 8 anos</option>
              <option>8 a 10 anos</option>
              <option>10+ anos</option>
            </select>
            <FieldError name="ageRange" />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Tempo de leitura em minutos
            <input
              className={fieldClass('readingMinutes')}
              max={60}
              min={1}
              type="number"
              {...register('readingMinutes', { valueAsNumber: true })}
            />
            <FieldError name="readingMinutes" />
          </label>
          <label className="grid gap-2 text-sm font-black text-ink">
            Tema principal
            <input className={fieldClass('theme')} {...register('theme')} />
            <FieldError name="theme" />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-2xl bg-aqua/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" type="checkbox" {...register('hasColoringVersion')} />
            Versão para colorir
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-sun/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" type="checkbox" {...register('isFeatured')} />
            Destaque na Home
          </label>
          <label className="flex items-center gap-3 rounded-2xl bg-rose/45 p-4 text-sm font-black text-ink">
            <input className="h-5 w-5" type="checkbox" {...register('isStoryOfWeek')} />
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
            <input className="mt-4 h-5 w-5" type="radio" value="draft" {...register('status')} />
          </label>
          <label className="rounded-3xl border border-slate-200 p-5">
            <span className="flex items-center gap-2 font-black text-ink">
              <CheckCircle2 className="h-5 w-5" />
              Publicar
            </span>
            <p className="mt-2 text-sm leading-6 text-slate-600">A história aparece na biblioteca pública após salvar.</p>
            <input className="mt-4 h-5 w-5" type="radio" value="published" {...register('status')} />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <button className="rounded-full bg-slate-100 px-5 py-3 font-black text-ink disabled:opacity-50" disabled={!canGoBack} onClick={() => setCurrentStep((step) => step - 1)} type="button">
          Voltar
        </button>
        <div className="flex flex-wrap gap-3">
          {canGoNext ? (
            <button className="rounded-full bg-ink px-6 py-3 font-black text-white" onClick={goToNextStep} type="button">
              Próxima etapa
            </button>
          ) : (
            <button className="rounded-full bg-ink px-8 py-4 text-lg font-black text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-60" disabled={isPublishing} onClick={handlePublish} type="button">
              {isPublishing ? (selectedStatus === 'draft' ? 'Salvando...' : 'Publicando...') : selectedStatus === 'draft' ? 'Salvar rascunho' : 'Publicar história'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
