'use client';

import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ShareButton } from '@/components/share-button';
import type { Story } from '@/types';

export function StoryReader({ story }: { story: Story }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const readerRef = useRef<HTMLElement>(null);
  const nextPage = story.pages[pageIndex + 1];

  function goToPage(index: number) {
    setPageIndex(Math.max(0, Math.min(index, story.pages.length - 1)));
  }

  async function openFullscreen() {
    if (readerRef.current && document.fullscreenElement !== readerRef.current) {
      await readerRef.current.requestFullscreen();
    }
  }

  return (
    <main>
      <section className="px-5 py-12" style={{ background: story.color }}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link className="inline-flex rounded-full bg-white/80 px-4 py-2 font-black text-ink shadow-sm" href="/biblioteca">
              Voltar para biblioteca
            </Link>
            <ShareButton
              className="h-auto w-auto bg-white/80 px-4 py-2 shadow-sm hover:bg-white"
              menuAlign="left"
              menuPlacement="bottom"
              showLabel
              storySlug={story.slug}
              storyTitle={story.title}
            />
          </div>
          <p className="mt-8 font-black text-ink/75">
            {story.category} · {story.ageRange} · {story.readingTime}
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-tight text-ink">{story.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">{story.description}</p>
          <p className="mt-3 font-black text-ink">Autor: {story.author}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10" ref={readerRef}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">Leitor</p>
            <h2 className="text-2xl font-black text-ink">
              Página {pageIndex + 1} de {story.pages.length}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-white p-3 shadow-sm" onClick={() => setZoom((value) => Math.max(0.8, value - 0.1))} title="Diminuir zoom" type="button">
              <Minus className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-white p-3 shadow-sm" onClick={() => setZoom(1)} title="Restaurar zoom" type="button">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-white p-3 shadow-sm" onClick={() => setZoom((value) => Math.min(1.4, value + 0.1))} title="Aumentar zoom" type="button">
              <Plus className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-ink p-3 text-white shadow-sm" onClick={openFullscreen} title="Tela cheia" type="button">
              <Maximize className="h-5 w-5" />
            </button>
            <ShareButton
              className="bg-ink text-white shadow-sm hover:bg-slate-800 focus:ring-violet-200"
              storySlug={story.slug}
              storyTitle={story.title}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
          <aside className="flex gap-3 overflow-x-auto rounded-3xl bg-white p-3 shadow-soft lg:grid lg:max-h-[620px] lg:overflow-y-auto">
            {story.pages.map((page, index) => (
              <button
                className={`min-w-28 rounded-2xl border p-3 text-left text-sm font-bold transition ${
                  index === pageIndex ? 'border-violet-400 bg-lilac/45' : 'border-slate-100 bg-slate-50'
                }`}
                key={page}
                onClick={() => goToPage(index)}
                type="button"
              >
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-violet-700">Página {index + 1}</span>
                <span className="line-clamp-2 mt-1 block text-slate-600">{page}</span>
              </button>
            ))}
          </aside>

          <section className="rounded-[2rem] bg-white p-4 shadow-soft md:p-8">
            <div className="book-open mx-auto grid max-w-5xl overflow-hidden rounded-[1.5rem] border border-amber-100 bg-[#fffaf0] md:grid-cols-2">
              <article className="reader-page min-h-[430px] border-r border-amber-100 p-8 md:p-12" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">Página {pageIndex + 1}</p>
                <h3 className="mt-4 text-3xl font-black text-ink">{story.title}</h3>
                <p className="mt-8 text-xl leading-10 text-slate-700">{story.pages[pageIndex]}</p>
              </article>
              <article className="reader-page min-h-[430px] p-8 md:p-12" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
                  {nextPage ? `Página ${pageIndex + 2}` : 'Fim'}
                </p>
                {nextPage ? (
                  <p className="mt-16 text-xl leading-10 text-slate-700">{nextPage}</p>
                ) : (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <h3 className="text-3xl font-black text-ink">Fim da história</h3>
                      <p className="mt-3 text-slate-600">Escolha outra aventura na biblioteca.</p>
                    </div>
                  </div>
                )}
              </article>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 font-black text-ink disabled:opacity-40"
                disabled={pageIndex === 0}
                onClick={() => goToPage(pageIndex - 1)}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
                Página anterior
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-black text-white disabled:opacity-40"
                disabled={pageIndex === story.pages.length - 1}
                onClick={() => goToPage(pageIndex + 1)}
                type="button"
              >
                Próxima página
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
