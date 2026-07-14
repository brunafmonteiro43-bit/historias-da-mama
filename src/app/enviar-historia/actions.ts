'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

const MAX_PDF_SIZE = 10 * 1024 * 1024;

export type SubmitStoryResult =
  | { message?: string; status: 'idle' | 'success' }
  | { message: string; status: 'error' };

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function getPdfFile(formData: FormData) {
  const value = formData.get('storyPdf');
  return value instanceof File && value.size > 0 ? value : null;
}

function sanitizeFileName(fileName: string) {
  const baseName = fileName.replace(/\.pdf$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${baseName || 'historia'}.pdf`;
}

async function isPdf(file: File) {
  const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const signature = Array.from(header)
    .map((byte) => String.fromCharCode(byte))
    .join('');

  return signature === '%PDF-';
}

export async function submitStoryAction(formData: FormData): Promise<SubmitStoryResult> {
  const author = getString(formData, 'author');
  const category = getString(formData, 'category');
  const email = getString(formData, 'email').toLowerCase();
  const sendMode = getString(formData, 'sendMode') === 'pdf' ? 'pdf' : 'text';
  const storyText = getString(formData, 'story');
  const title = getString(formData, 'title');
  const website = getString(formData, 'website');
  const permissionConfirmed = formData.get('permissionConfirmed') === 'on';
  const pdfFile = getPdfFile(formData);

  if (website) {
    return { status: 'success' };
  }

  if (
    author.length < 2 ||
    !email.includes('@') ||
    title.length < 3 ||
    category.length < 2 ||
    !permissionConfirmed
  ) {
    return { message: 'Preencha todos os campos obrigatórios antes de enviar.', status: 'error' };
  }

  if (sendMode === 'text' && storyText.length < 80) {
    return { message: 'O texto da história precisa ter pelo menos 80 caracteres.', status: 'error' };
  }

  if (sendMode === 'pdf') {
    if (!pdfFile) {
      return { message: 'Selecione um arquivo PDF para enviar.', status: 'error' };
    }

    if (pdfFile.size > MAX_PDF_SIZE) {
      return { message: 'O arquivo PDF deve ter no máximo 10 MB.', status: 'error' };
    }

    if (pdfFile.type !== 'application/pdf' || !pdfFile.name.toLowerCase().endsWith('.pdf') || !(await isPdf(pdfFile))) {
      return { message: 'Envie somente arquivos PDF válidos.', status: 'error' };
    }
  }

  const supabase = createServerSupabaseClient();
  let pdfStoragePath: string | null = null;
  let pdfFileName: string | null = null;
  let pdfFileSize: number | null = null;

  if (sendMode === 'pdf' && pdfFile) {
    pdfFileName = sanitizeFileName(pdfFile.name);
    pdfFileSize = pdfFile.size;
    pdfStoragePath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${pdfFileName}`;

    const { error: uploadError } = await supabase.storage.from('story-submissions').upload(pdfStoragePath, pdfFile, {
      cacheControl: '3600',
      contentType: 'application/pdf',
      upsert: false,
    });

    if (uploadError) {
      console.error('Erro ao enviar PDF:', uploadError);
      return {
        message: 'Não foi possível enviar o PDF agora. Tente novamente em alguns minutos.',
        status: 'error',
      };
    }
  }

  const submissionPayload: Record<string, string | number | null> = {
    author_name: author,
    category,
    email,
    status: 'pending_review',
    story_text: sendMode === 'text' ? storyText : '',
    title,
  };

  if (sendMode === 'pdf') {
    submissionPayload.pdf_file_name = pdfFileName;
    submissionPayload.pdf_file_size = pdfFileSize;
    submissionPayload.pdf_storage_path = pdfStoragePath;
    submissionPayload.story_text = null;
    submissionPayload.submission_type = 'pdf';
  }

  const { error } = await supabase.from('story_submissions').insert(submissionPayload);

  if (error) {
    console.error('Erro ao enviar história:', error);

    if (pdfStoragePath) {
      await supabase.storage.from('story-submissions').remove([pdfStoragePath]);
    }

    return {
      message: 'Não foi possível enviar a história agora. Tente novamente em alguns minutos.',
      status: 'error',
    };
  }

  return { status: 'success' };
}
