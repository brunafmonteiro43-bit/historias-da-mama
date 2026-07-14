import {
  CheckCircle2,
  Clock3,
  FilePlus2,
  Inbox,
  Mail,
  RotateCcw,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { requireAdmin } from '@/lib/hm-admin-auth';

import {
  approveSubmissionAction,
  deleteSubmissionAction,
  rejectSubmissionAction,
  resetSubmissionAction,
} from './actions';

export const metadata = {
  title: 'Histórias recebidas',
};

type SubmissionStatus = 'approved' | 'pending_review' | 'rejected';

type StorySubmission = {
  author_name: string;
  category: string;
  created_at: string;
  created_story_id: string | null;
  email: string;
  id: string;
  reviewed_at: string | null;
  status: SubmissionStatus;
  story_text: string;
  title: string;
};

const statusContent: Record<
  SubmissionStatus,
  { className: string; label: string }
> = {
  approved: {
    className: 'bg-aqua/35 text-teal-800',
    label: 'Aprovada',
  },
  pending_review: {
    className: 'bg-sun/45 text-amber-900',
    label: 'Aguardando revisão',
  },
  rejected: {
    className: 'bg-rose/50 text-red-800',
    label: 'Recusada',
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function AdminSubmissionsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('story_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="rounded-[2rem] bg-white p-8 shadow-soft ring-1 ring-lilac/20">
        <h1 className="font-display text-4xl font-black text-plum">
          Histórias recebidas
        </h1>
        <p className="mt-4 font-bold text-red-700">
          Não foi possível consultar os envios. Confirme se o arquivo SQL foi
          executado no Supabase.
        </p>
      </section>
    );
  }

  const submissions = (data ?? []) as StorySubmission[];
  const pendingCount = submissions.filter(
    (submission) => submission.status === 'pending_review',
  ).length;
  const approvedCount = submissions.filter(
    (submission) => submission.status === 'approved',
  ).length;
  const rejectedCount = submissions.filter(
    (submission) => submission.status === 'rejected',
  ).length;

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-lilac/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">
              Revisão de conteúdo
            </p>
            <h1 className="mt-2 font-display text-4xl font-black text-plum">
              Histórias recebidas
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Os textos enviados pelo formulário público aparecem aqui. Aprovar
              cria automaticamente um rascunho editável no cadastro de histórias.
            </p>
          </div>

          <Inbox className="h-12 w-12 text-plum" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-sun/25 p-4">
            <p className="text-sm font-black text-amber-900">Pendentes</p>
            <p className="mt-1 text-3xl font-black text-plum">{pendingCount}</p>
          </div>
          <div className="rounded-2xl bg-aqua/25 p-4">
            <p className="text-sm font-black text-teal-800">Aprovadas</p>
            <p className="mt-1 text-3xl font-black text-plum">{approvedCount}</p>
          </div>
          <div className="rounded-2xl bg-rose/30 p-4">
            <p className="text-sm font-black text-red-800">Recusadas</p>
            <p className="mt-1 text-3xl font-black text-plum">{rejectedCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        {submissions.map((submission) => {
          const currentStatus = statusContent[submission.status];

          return (
            <article
              className="rounded-[2rem] bg-white p-6 shadow-soft ring-1 ring-lilac/20"
              key={submission.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-2xl font-black text-plum">
                      {submission.title}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${currentStatus.className}`}
                    >
                      {currentStatus.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-600">
                    <span>Autoria: {submission.author_name}</span>
                    <span>Categoria: {submission.category}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {formatDate(submission.created_at)}
                    </span>
                    <a
                      className="inline-flex items-center gap-1 text-plum underline"
                      href={`mailto:${submission.email}`}
                    >
                      <Mail className="h-4 w-4" />
                      {submission.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-5 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-cream/65 p-5 leading-7 text-slate-700">
                {submission.story_text}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {submission.status === 'pending_review' ? (
                  <>
                    <form action={approveSubmissionAction}>
                      <input name="id" type="hidden" value={submission.id} />
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 font-black text-white transition hover:bg-coral"
                        type="submit"
                      >
                        <FilePlus2 className="h-5 w-5" />
                        Aprovar e criar rascunho
                      </button>
                    </form>

                    <form action={rejectSubmissionAction}>
                      <input name="id" type="hidden" value={submission.id} />
                      <button
                        className="inline-flex items-center gap-2 rounded-full bg-rose/55 px-5 py-3 font-black text-red-900 transition hover:bg-rose/75"
                        type="submit"
                      >
                        <XCircle className="h-5 w-5" />
                        Recusar
                      </button>
                    </form>
                  </>
                ) : null}

                {submission.created_story_id ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-aqua/45 px-5 py-3 font-black text-plum"
                    href={`/hm-admin/stories/${submission.created_story_id}/edit`}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Editar rascunho criado
                  </Link>
                ) : null}

                {submission.status === 'rejected' ? (
                  <form action={resetSubmissionAction}>
                    <input name="id" type="hidden" value={submission.id} />
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-black text-plum"
                      type="submit"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Voltar para pendente
                    </button>
                  </form>
                ) : null}

                <form action={deleteSubmissionAction}>
                  <input name="id" type="hidden" value={submission.id} />
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 font-black text-slate-700 transition hover:bg-red-100 hover:text-red-800"
                    type="submit"
                  >
                    <Trash2 className="h-5 w-5" />
                    Excluir envio
                  </button>
                </form>
              </div>
            </article>
          );
        })}

        {submissions.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft ring-1 ring-lilac/20">
            <Inbox className="mx-auto h-12 w-12 text-lilac" />
            <p className="mt-4 font-black text-slate-600">
              Nenhuma história foi enviada até agora.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
