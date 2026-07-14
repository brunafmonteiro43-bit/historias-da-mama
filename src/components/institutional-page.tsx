import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type InstitutionalPageProps = {
  children: ReactNode;
  intro: string;
  lastUpdated?: string;
  sections?: Array<{ id: string; title: string }>;
  title: string;
};

const shell = 'mx-auto w-full max-w-[1120px] px-5 sm:px-6 lg:px-8';

export function InstitutionalPage({ children, intro, lastUpdated, sections = [], title }: InstitutionalPageProps) {
  return (
    <main className="overflow-hidden bg-[linear-gradient(180deg,#fffaf2_0%,#fff6fb_48%,#f5f1ff_100%)]">
      <section className="relative isolate px-0 py-12 sm:py-16">
        <div className="pointer-events-none absolute left-[8%] top-10 h-44 w-44 rounded-full bg-sun/24 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute right-[8%] top-20 h-56 w-56 rounded-full bg-lilac/24 blur-3xl" aria-hidden="true" />

        <div className={`${shell} relative z-10`}>
          <div className="rounded-[1.75rem] bg-white/82 p-6 shadow-[0_24px_80px_rgba(59,36,107,.10)] ring-1 ring-white/85 backdrop-blur md:p-9">
            <p className="inline-flex items-center gap-2 rounded-full bg-rose/55 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-coral">
              <Sparkles className="h-4 w-4" />
              Histórias da Mamá
            </p>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight text-plum md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{intro}</p>
            {lastUpdated ? <p className="mt-4 text-sm font-black text-coral">{lastUpdated}</p> : null}
          </div>

          {sections.length > 0 ? (
            <nav
              aria-label="Índice da página"
              className="mt-6 rounded-[1.35rem] bg-white/78 p-5 shadow-[0_16px_48px_rgba(59,36,107,.08)] ring-1 ring-white/80"
            >
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-plum">Nesta página</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {sections.map((section) => (
                  <Link
                    className="rounded-full bg-cream/80 px-4 py-2 text-sm font-black text-plum outline-none transition hover:-translate-y-0.5 hover:bg-rose/70 hover:text-coral focus-visible:ring-4 focus-visible:ring-coral/35"
                    href={`#${section.id}`}
                    key={section.id}
                  >
                    {section.title}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}

          <article className="mt-6 rounded-[1.75rem] bg-white/90 p-6 shadow-[0_24px_85px_rgba(59,36,107,.09)] ring-1 ring-white/85 md:p-9">
            <div className="prose-institutional">{children}</div>
          </article>

          <Link
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 font-black text-white shadow-[0_18px_42px_rgba(59,36,107,.20)] outline-none transition hover:-translate-y-1 hover:bg-coral focus-visible:ring-4 focus-visible:ring-coral/40"
            href="/"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </main>
  );
}

export function InstitutionalSection({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section className="scroll-mt-28 border-t border-lilac/20 py-7 first:border-t-0 first:pt-0" id={id}>
      <h2 className="font-display text-2xl font-black text-plum md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">{children}</div>
    </section>
  );
}
