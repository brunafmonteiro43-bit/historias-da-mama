import { BookOpenCheck, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import { SubmitStoryForm } from './submit-story-form';

export const metadata = {
  title: 'Enviar história',
  description: 'Envie uma história infantil para avaliação da biblioteca Histórias da Mamá.',
};

export default function EnviarHistoriaPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[1.35rem] bg-[linear-gradient(135deg,#fff8ea_0%,#fff2f8_48%,#eee7ff_100%)] p-6 shadow-[0_22px_70px_rgba(59,36,107,.10)] ring-1 ring-lilac/15 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-white text-plum shadow-sm">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight text-plum md:text-5xl">Envie sua história</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
              Compartilhe uma aventura infantil para ajudar nossa biblioteca a crescer e inspirar mais crianças.
            </p>
            <div className="mt-6 rounded-2xl bg-white/72 p-5 text-sm font-bold leading-6 text-slate-700 ring-1 ring-white/80">
              A história será revisada antes de aparecer na biblioteca. Capriche no título, informe a autoria e envie um texto completo.
            </div>
            <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-plum shadow-sm transition hover:text-coral" href="/biblioteca">
              <BookOpenCheck className="h-5 w-5" />
              Ver histórias publicadas
            </Link>
          </div>

          <section className="rounded-[1.35rem] bg-white/92 p-5 shadow-sm ring-1 ring-white/80 md:p-6" aria-label="Formulário de envio de história">
            <SubmitStoryForm />
          </section>
        </div>
      </section>
    </main>
  );
}
