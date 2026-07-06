import { Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Enviar história' };

export default function EnviarHistoriaPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-12">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff8ea_0%,#fff2f8_48%,#eee7ff_100%)] p-6 shadow-soft ring-1 ring-lilac/15 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_260px] md:items-center">
          <div>
            <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-white text-plum shadow-sm">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight text-plum md:text-5xl">Envie sua história</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
              Compartilhe uma aventura infantil para ajudar nossa biblioteca a crescer e inspirar mais crianças.
            </p>
          </div>
          <svg className="mx-auto h-56 w-64" viewBox="0 0 260 220" role="img" aria-label="Carta com estrelas e livro">
            <path d="M31 73h198v120H31Z" fill="#fff" stroke="#b79bef" strokeWidth="4" />
            <path d="m31 73 99 71 99-71" fill="#fff8ea" stroke="#b79bef" strokeWidth="4" />
            <path d="M58 43c48-22 95-22 144 0v86c-48-17-96-17-144 0Z" fill="#fff8ea" />
            <path d="M130 43v86" stroke="#efb99d" strokeWidth="4" />
            <path d="M79 66c23-7 37-6 52 2M153 66c21-7 37-5 51 3M78 91c23-6 38-5 52 2M153 91c21-6 36-5 50 3" stroke="#efb99d" strokeLinecap="round" strokeWidth="4" />
            <path d="M45 149 31 193h198l-16-44-83 43Z" fill="#ffd6e8" opacity=".7" />
            <path d="M42 29 51 12l9 17 17 9-17 9-9 17-9-17-17-9Z" fill="#ffe7a3" />
            <path d="M210 21 217 8l7 13 13 7-13 7-7 13-7-13-13-7Z" fill="#f36f91" />
          </svg>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-lilac/15 md:p-8">
        <h2 className="text-2xl font-black text-plum">Como enviar</h2>
        <p className="mt-3 leading-7 text-slate-600">
          Por enquanto, prepare o título, o texto da história e o nome de autoria. A equipe poderá revisar o conteúdo antes de publicar.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-plum px-6 py-4 font-black text-white shadow-sm transition hover:bg-coral"
            href="/biblioteca"
          >
            <Sparkles className="h-5 w-5" />
            Ver histórias publicadas
          </Link>
        </div>
      </section>
    </main>
  );
}
