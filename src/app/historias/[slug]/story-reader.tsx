'use client';

import { ChevronLeft, ChevronRight, Maximize, Minus, Plus, RotateCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ShareButton } from '@/components/share-button';
import { StoryCover } from '@/components/story-carousel';
import type { Story } from '@/types';

export function StoryReader({ nextStory, story }: { nextStory?: Story; story: Story }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const readerRef = useRef<HTMLElement>(null);
  const nextPage = story.pages[pageIndex + 1];
  const pageImage = story.pageImages?.[pageIndex];
  const nextPageImage = story.pageImages?.[pageIndex + 1];

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
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 sm:px-1 lg:grid-cols-[420px_1fr]">
          <div className="overflow-hidden rounded-[1.35rem] border border-white/70 bg-white shadow-[0_22px_70px_rgba(59,36,107,.16)]">
            <StoryCover story={story} />
            <div className="p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Capa da história</p>
              <h2 className="mt-2 font-display text-2xl font-black text-plum">{story.title}</h2>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="inline-flex rounded-full bg-white/85 px-4 py-2 font-black text-plum shadow-sm transition hover:bg-white" href="/biblioteca">
                Voltar para biblioteca
              </Link>
              <ShareButton
                className="h-auto w-auto bg-white/85 px-4 py-2 shadow-sm hover:bg-white"
                menuAlign="left"
                menuPlacement="bottom"
                showLabel
                storySlug={story.slug}
                storyTitle={story.title}
              />
            </div>
            <p className="mt-8 font-black text-plum/75">
              {story.category} · {story.ageRange} · {story.readingTime}
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl font-black leading-tight text-plum md:text-5xl">{story.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">{story.fullDescription ?? story.description}</p>
            <p className="mt-3 font-black text-plum">Autor: {story.author}</p>
            <button
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-plum px-7 py-3.5 font-black text-white shadow-[0_16px_34px_rgba(59,36,107,.18)] transition hover:-translate-y-1 hover:bg-coral focus:outline-none focus:ring-4 focus:ring-white/55"
              onClick={() => document.getElementById('leitor')?.scrollIntoView({ behavior: 'smooth' })}
              type="button"
            >
              <Sparkles className="h-5 w-5" />
              Começar leitura
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-10 sm:px-6 lg:px-8" id="leitor" ref={readerRef}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Leitor</p>
            <h2 className="font-display text-2xl font-black text-plum">
              Página {pageIndex + 1} de {story.pages.length}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25" onClick={() => setZoom((value) => Math.max(0.9, value - 0.1))} title="Diminuir zoom" type="button">
              <Minus className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25" onClick={() => setZoom(1)} title="Restaurar zoom" type="button">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25" onClick={() => setZoom((value) => Math.min(1.25, value + 0.1))} title="Aumentar zoom" type="button">
              <Plus className="h-5 w-5" />
            </button>
            <button className="rounded-full bg-plum p-3 text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/35" onClick={openFullscreen} title="Tela cheia" type="button">
              <Maximize className="h-5 w-5" />
            </button>
            <ShareButton
              className="bg-plum text-white shadow-sm hover:bg-coral focus:ring-lilac/40"
              storySlug={story.slug}
              storyTitle={story.title}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
          <aside className="flex gap-3 overflow-x-auto rounded-[1.35rem] bg-white p-3 shadow-[0_18px_55px_rgba(59,36,107,.09)] ring-1 ring-lilac/15 lg:grid lg:max-h-[620px] lg:overflow-y-auto">
            {story.pages.map((page, index) => (
              <button
                aria-current={index === pageIndex ? 'page' : undefined}
                className={`min-w-28 rounded-2xl border p-3 text-left text-sm font-bold transition ${
                  index === pageIndex ? 'border-lilac bg-lilac/35 text-plum' : 'border-slate-100 bg-cream/55 text-slate-600'
                }`}
                key={`${story.slug}-${index}`}
                onClick={() => goToPage(index)}
                type="button"
              >
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-coral">Página {index + 1}</span>
                <span className="line-clamp-2 mt-1 block">{page}</span>
              </button>
            ))}
          </aside>

          <section className="rounded-[1.35rem] bg-white p-4 shadow-[0_22px_70px_rgba(59,36,107,.10)] ring-1 ring-lilac/15 md:p-8">
            <div className="book-open mx-auto grid max-w-5xl overflow-hidden rounded-[1.2rem] border border-amber-100 bg-cream md:grid-cols-2">
              <article className="reader-page min-h-[360px] border-b border-amber-100 p-8 md:min-h-[430px] md:border-b-0 md:border-r md:p-12" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Página {pageIndex + 1}</p>
                <h3 className="mt-4 font-display text-3xl font-black text-plum">{story.title}</h3>
                {pageImage ? (
                  <Image alt={`Página ${pageIndex + 1} de ${story.title}`} className="mt-6 max-h-[520px] w-full rounded-2xl object-contain" height={900} src={pageImage} unoptimized width={680} />
                ) : (
                  <p className="mt-8 text-xl leading-10 text-slate-700">{story.pages[pageIndex]}</p>
                )}
              </article>
              <article className="reader-page min-h-[360px] p-8 md:min-h-[430px] md:p-12" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">
                  {nextPage ? `Página ${pageIndex + 2}` : 'Fim'}
                </p>
                {nextPageImage ? (
                  <Image alt={`Página ${pageIndex + 2} de ${story.title}`} className="mt-6 max-h-[520px] w-full rounded-2xl object-contain" height={900} src={nextPageImage} unoptimized width={680} />
                ) : nextPage ? (
                  <p className="mt-16 text-xl leading-10 text-slate-700">{nextPage}</p>
                ) : (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <h3 className="font-display text-3xl font-black text-plum">Fim da história</h3>
                      <p className="mt-3 text-slate-600">Escolha outra aventura na biblioteca.</p>
                    </div>
                  </div>
                )}
              </article>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-black text-plum disabled:opacity-40"
                disabled={pageIndex === 0}
                onClick={() => goToPage(pageIndex - 1)}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
                Página anterior
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 font-black text-white disabled:opacity-40"
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

        <div className="mt-8 flex flex-col gap-4 rounded-[1.35rem] bg-white p-6 shadow-sm ring-1 ring-lilac/15 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-plum">Continue lendo</h2>
            <p className="mt-1 text-slate-600">{nextStory ? `Próxima sugestão: ${nextStory.title}` : 'Explore a biblioteca para escolher outra aventura.'}</p>
          </div>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-plum px-6 py-3 font-black text-white transition hover:bg-coral"
            href={nextStory ? `/historias/${nextStory.slug}/ler` : '/biblioteca'}
          >
            {nextStory ? 'Ler próxima história' : 'Ver biblioteca'}
          </Link>
        </div>
      </section>
    </main>
  );
}
