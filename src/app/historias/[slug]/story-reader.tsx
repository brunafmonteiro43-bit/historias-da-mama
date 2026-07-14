'use client';

import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { ShareButton } from '@/components/share-button';
import { StoryCover } from '@/components/story-carousel';
import type { Story } from '@/types';

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function StoryReader({ nextStory, story }: { nextStory?: Story; story: Story }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerRef = useRef<HTMLElement>(null);
  const pageViewportRef = useRef<HTMLDivElement>(null);
  const pageImage = story.pageImages?.[pageIndex];
  const pageText = story.pages[pageIndex];

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === readerRef.current);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    pageViewportRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }, [pageIndex]);

  function goToPage(index: number) {
    setPageIndex(Math.max(0, Math.min(index, story.pages.length - 1)));
    setZoom(1);
  }

  function decreaseZoom() {
    setZoom((value) => Math.max(MIN_ZOOM, Number((value - ZOOM_STEP).toFixed(2))));
  }

  function increaseZoom() {
    setZoom((value) => Math.min(MAX_ZOOM, Number((value + ZOOM_STEP).toFixed(2))));
  }

  function resetZoom() {
    setZoom(1);
    pageViewportRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  async function toggleFullscreen() {
    if (!readerRef.current) return;
    if (document.fullscreenElement === readerRef.current) {
      await document.exitFullscreen();
      return;
    }
    await readerRef.current.requestFullscreen();
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    if (event.deltaY < 0) increaseZoom();
    else decreaseZoom();
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
            <p className="mt-8 font-black text-plum/75">{story.category} · {story.ageRange} · {story.readingTime}</p>
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

      <section
        className={`mx-auto max-w-[1500px] px-5 py-10 sm:px-6 lg:px-8 ${isFullscreen ? 'h-screen max-w-none overflow-hidden bg-black px-6 py-6 text-white' : ''}`}
        id="leitor"
        ref={readerRef}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Leitor</p>
            <h2 className={`font-display text-2xl font-black ${isFullscreen ? 'text-white' : 'text-plum'}`}>
              Página {pageIndex + 1} de {story.pages.length}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button aria-label="Diminuir zoom" className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25 disabled:cursor-not-allowed disabled:opacity-40" disabled={zoom <= MIN_ZOOM} onClick={decreaseZoom} title="Diminuir zoom" type="button">
              <Minus className="h-5 w-5" />
            </button>
            <button aria-label="Restaurar zoom" className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25" onClick={resetZoom} title="Restaurar zoom" type="button">
              <RotateCcw className="h-5 w-5" />
            </button>
            <div className="min-w-[76px] rounded-full bg-white px-3 py-3 text-center text-sm font-black text-plum shadow-sm">
              {Math.round(zoom * 100)}%
            </div>
            <button aria-label="Aumentar zoom" className="rounded-full bg-white p-3 text-plum shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/25 disabled:cursor-not-allowed disabled:opacity-40" disabled={zoom >= MAX_ZOOM} onClick={increaseZoom} title="Aumentar zoom" type="button">
              <Plus className="h-5 w-5" />
            </button>
            <button aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'} className="rounded-full bg-plum p-3 text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-lilac/35" onClick={toggleFullscreen} title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'} type="button">
              <Maximize className="h-5 w-5" />
            </button>
            <ShareButton className="bg-plum text-white shadow-sm hover:bg-coral focus:ring-lilac/40" storySlug={story.slug} storyTitle={story.title} />
          </div>
        </div>

        <p className={`mb-4 text-sm font-semibold ${isFullscreen ? 'text-white/70' : 'text-slate-500'}`}>
          Use os botões + e − para ampliar até 300%. No computador, também é possível usar Ctrl + roda do mouse.
        </p>

        <div className={`grid gap-6 ${isFullscreen ? 'h-[calc(100vh-145px)] grid-cols-[140px_1fr]' : 'lg:grid-cols-[160px_1fr]'}`}>
          <aside className={`flex gap-3 overflow-x-auto rounded-[1.35rem] p-3 shadow-[0_18px_55px_rgba(59,36,107,.09)] ring-1 ring-lilac/15 lg:grid lg:overflow-y-auto ${isFullscreen ? 'max-h-full bg-white/10' : 'bg-white lg:max-h-[760px]'}`}>
            {story.pages.map((page, index) => (
              <button
                aria-current={index === pageIndex ? 'page' : undefined}
                className={`min-w-28 rounded-2xl border p-3 text-left text-sm font-bold transition ${index === pageIndex ? 'border-lilac bg-lilac/35 text-plum' : isFullscreen ? 'border-white/15 bg-white/10 text-white' : 'border-slate-100 bg-cream/55 text-slate-600'}`}
                key={`${story.slug}-${index}`}
                onClick={() => goToPage(index)}
                type="button"
              >
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-coral">Página {index + 1}</span>
                <span className="line-clamp-2 mt-1 block">{page}</span>
              </button>
            ))}
          </aside>

          <section className={`flex min-h-0 flex-col overflow-hidden rounded-[1.35rem] shadow-[0_22px_70px_rgba(59,36,107,.10)] ring-1 ring-lilac/15 ${isFullscreen ? 'bg-[#111] p-3' : 'bg-white p-3 md:p-5'}`}>
            <div
              className={`relative flex-1 overflow-auto rounded-[1rem] ${isFullscreen ? 'max-h-[calc(100vh-245px)] bg-black' : 'max-h-[78vh] bg-[#f6f3fb]'}`}
              onWheel={handleWheel}
              ref={pageViewportRef}
            >
              <div
                className="mx-auto min-h-full transition-[width] duration-200 ease-out"
                style={{ width: `${zoom * 100}%`, maxWidth: zoom <= 1 ? '1100px' : 'none' }}
              >
                <article className={`mx-auto min-h-full ${isFullscreen ? 'bg-black' : 'rounded-[1rem] bg-cream'}`}>
                  {pageImage ? (
                    <Image
                      alt={`Página ${pageIndex + 1} de ${story.title}`}
                      className="h-auto w-full object-contain"
                      height={1800}
                      priority
                      src={pageImage}
                      unoptimized
                      width={1400}
                    />
                  ) : (
                    <div className="mx-auto max-w-4xl p-10 md:p-16">
                      <p className="text-sm font-black uppercase tracking-[0.18em] text-coral">Página {pageIndex + 1}</p>
                      <h3 className="mt-4 font-display text-3xl font-black text-plum">{story.title}</h3>
                      <p className="mt-8 text-xl leading-10 text-slate-700">{pageText}</p>
                    </div>
                  )}
                </article>
              </div>
            </div>

            <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 ${isFullscreen ? 'px-2 pb-1' : ''}`}>
              <button className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-black text-plum disabled:opacity-40" disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)} type="button">
                <ChevronLeft className="h-5 w-5" />
                Página anterior
              </button>
              <button className="inline-flex items-center gap-2 rounded-full bg-plum px-5 py-3 font-black text-white disabled:opacity-40" disabled={pageIndex === story.pages.length - 1} onClick={() => goToPage(pageIndex + 1)} type="button">
                Próxima página
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        </div>

        {!isFullscreen ? (
          <div className="mt-8 flex flex-col gap-4 rounded-[1.35rem] bg-white p-6 shadow-sm ring-1 ring-lilac/15 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-plum">Continue lendo</h2>
              <p className="mt-1 text-slate-600">{nextStory ? `Próxima sugestão: ${nextStory.title}` : 'Explore a biblioteca para escolher outra aventura.'}</p>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-plum px-6 py-3 font-black text-white transition hover:bg-coral" href={nextStory ? `/historias/${nextStory.slug}/ler` : '/biblioteca'}>
              {nextStory ? 'Ler próxima história' : 'Ver biblioteca'}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
