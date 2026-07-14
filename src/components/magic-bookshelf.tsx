'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

type SideCoverKind = 'previous' | 'next';

type SideCoverLayout = {
  baseRotate: number;
  className: string;
  hoverRotate: number;
  imageSizes: string;
  rotate: number[];
  y: number[];
};

const BOOK_ILLUSTRATION_SRC = '/illustrations/livro-magico-aberto.webp';
const AUTO_ROTATION_MS = 5500;

const activeFloatY: number[] = [0, -5, 0];
const activeFloatRotate: number[] = [0, 0.4, 0];

const sideLayouts: Record<SideCoverKind, SideCoverLayout> = {
  previous: {
    baseRotate: -7,
    className:
      'left-[6%] top-[172px] h-[164px] w-[106px] sm:left-[13%] sm:top-[160px] sm:h-[178px] sm:w-[115px] md:left-[14%] md:top-[180px] xl:left-[12%] xl:top-[208px]',
    hoverRotate: -6,
    imageSizes: '(min-width: 1280px) 115px, (min-width: 640px) 115px, 28vw',
    rotate: [-7, -6.4, -7],
    y: [0, -5, 0],
  },
  next: {
    baseRotate: 7,
    className:
      'right-[6%] top-[172px] h-[164px] w-[106px] sm:right-[13%] sm:top-[160px] sm:h-[178px] sm:w-[115px] md:right-[14%] md:top-[180px] xl:right-[12%] xl:top-[208px]',
    hoverRotate: 6,
    imageSizes: '(min-width: 1280px) 115px, (min-width: 640px) 115px, 28vw',
    rotate: [7, 6.4, 7],
    y: [0, -5, 0],
  },
};

function selectCarouselStories(stories: Story[]) {
  const published = stories.filter((story) => story.status === 'published');
  const storyOfWeek = published.filter((story) => story.storyOfWeek);
  const popular = published.filter(
    (story) => story.popular && !storyOfWeek.some((weekStory) => weekStory.slug === story.slug),
  );
  const recent = published
    .filter(
      (story) =>
        !storyOfWeek.some((weekStory) => weekStory.slug === story.slug) &&
        !popular.some((popularStory) => popularStory.slug === story.slug),
    )
    .sort((firstStory, secondStory) => new Date(secondStory.createdAt).getTime() - new Date(firstStory.createdAt).getTime());

  return [...storyOfWeek, ...popular, ...recent].slice(0, 8);
}

function getCategoryPalette(story: Story) {
  const category = `${story.category} ${story.categorySlug}`.toLowerCase();

  if (category.includes('amizade')) {
    return ['#ffe7a3', '#f36f91', '#7c4cb0'];
  }

  if (category.includes('natureza')) {
    return ['#bfeaf5', '#a9d9bd', '#3b246b'];
  }

  if (category.includes('sonho') || category.includes('imagina')) {
    return ['#b79bef', '#ffd6e8', '#3b246b'];
  }

  if (category.includes('coragem') || category.includes('aventura')) {
    return ['#ffcf86', '#f36f91', '#3b246b'];
  }

  return [story.color || '#bfeaf5', '#fff8ea', story.accentColor || '#3b246b'];
}

function openWithSpace(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function activateWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, action: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
}

export function MagicBookshelf({ stories }: MagicBookshelfProps) {
  const reducedMotion = useReducedMotion();
  const carouselStories = useMemo(() => selectCarouselStories(stories), [stories]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [carouselStories.length]);

  useEffect(() => {
    if (reducedMotion || isPaused || carouselStories.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % carouselStories.length);
    }, AUTO_ROTATION_MS);

    return () => window.clearInterval(interval);
  }, [carouselStories.length, isPaused, reducedMotion]);

  if (carouselStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[360px] w-full max-w-[610px] place-items-center rounded-[2rem] bg-white/42 text-center shadow-[0_24px_70px_rgba(59,36,107,.10)] ring-1 ring-white/70">
        <div>
          <p className="font-display text-3xl font-black text-plum">A biblioteca está esperando histórias.</p>
          <p className="mt-2 text-sm font-bold text-slate-600">Publique a primeira aventura no painel administrativo.</p>
        </div>
      </div>
    );
  }

  const previousIndex = (activeIndex - 1 + carouselStories.length) % carouselStories.length;
  const nextIndex = (activeIndex + 1) % carouselStories.length;
  const previousStory = carouselStories[previousIndex];
  const activeStory = carouselStories[activeIndex];
  const nextStory = carouselStories[nextIndex];

  return (
    <motion.div
      aria-label="Portal mágico de histórias"
      className="relative mx-auto h-[570px] w-full max-w-[720px] overflow-visible sm:h-[620px] xl:h-[655px]"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-10 top-0 z-0 rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(255,231,163,.32),rgba(249,196,210,.18)_38%,rgba(183,155,239,.20)_66%,transparent_82%)] blur-sm"
        aria-hidden="true"
      />

      <BookBaseImage />

      {carouselStories.length > 1 ? (
        <>
          <SideStoryCover
            kind="previous"
            layout={sideLayouts.previous}
            reducedMotion={Boolean(reducedMotion)}
            story={previousStory}
            onSelect={() => setActiveIndex(previousIndex)}
          />
          <SideStoryCover
            kind="next"
            layout={sideLayouts.next}
            reducedMotion={Boolean(reducedMotion)}
            story={nextStory}
            onSelect={() => setActiveIndex(nextIndex)}
          />
        </>
      ) : null}

      <motion.div
        className="absolute left-1/2 top-[74px] z-40 -ml-[82px] h-[250px] w-[164px] sm:top-[76px] sm:-ml-[95px] sm:h-[290px] sm:w-[190px] xl:top-[82px]"
        key={activeStory.slug}
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: activeFloatY, rotate: activeFloatRotate, scale: 1 }}
        transition={
          reducedMotion
            ? { duration: 0.2 }
            : {
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        <Link
          aria-label={`Abrir história ${activeStory.title}`}
          className="group relative block h-full w-full overflow-hidden rounded-[1.4rem] bg-white p-2.5 shadow-[0_28px_60px_rgba(59,36,107,.26)] outline-none ring-1 ring-white/90 transition focus-visible:ring-4 focus-visible:ring-coral/55 sm:rounded-[1.55rem] sm:p-3"
          href={`/historias/${activeStory.slug}`}
          onKeyDown={openWithSpace}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-[1rem] bg-cream sm:rounded-[1.12rem]">
            <StoryCoverImage priority sizes="(min-width: 640px) 190px, 164px" story={activeStory} />
          </span>
          <span className="pointer-events-none absolute inset-3 rounded-[1rem] bg-gradient-to-t from-plum/18 via-transparent to-white/22 opacity-70 transition group-hover:opacity-45" aria-hidden="true" />
        </Link>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[102px] z-50 flex items-center justify-center gap-2 sm:bottom-[104px]">
        {carouselStories.map((story, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-label={`Selecionar história ${story.title}`}
              aria-current={isActive ? 'true' : undefined}
              className="grid h-7 w-7 place-items-center rounded-full outline-none transition focus-visible:ring-4 focus-visible:ring-coral/45"
              key={story.slug}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => activateWithKeyboard(event, () => setActiveIndex(index))}
              type="button"
            >
              <span
                className={`block h-2.5 rounded-full transition-all ${isActive ? 'w-8 bg-plum shadow-[0_7px_16px_rgba(59,36,107,.22)]' : 'w-2.5 bg-plum/25 hover:bg-plum/45'}`}
              />
            </button>
          );
        })}
      </div>

      <Link
        aria-label={`Ler esta história: ${activeStory.title}`}
        className="absolute bottom-[34px] left-1/2 z-50 inline-flex min-h-12 -translate-x-1/2 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-plum px-7 py-3 text-base font-black text-white shadow-[0_18px_42px_rgba(59,36,107,.24)] outline-none transition duration-300 hover:-translate-y-1 hover:bg-coral hover:shadow-[0_24px_52px_rgba(243,111,145,.28)] focus-visible:ring-4 focus-visible:ring-coral/45"
        href={`/historias/${activeStory.slug}`}
        onKeyDown={openWithSpace}
      >
        <BookOpen className="h-5 w-5" />
        Ler esta história
      </Link>
    </motion.div>
  );
}

function BookBaseImage() {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return <BookBaseFallback />;
  }

  return (
    <div className="pointer-events-none absolute bottom-[86px] left-1/2 z-10 h-[330px] w-[min(95vw,620px)] -translate-x-1/2 sm:bottom-[86px] sm:h-[360px] xl:bottom-[82px]" aria-hidden="true">
      <Image
        alt=""
        className="object-contain"
        fill
        onError={() => setImageFailed(true)}
        priority
        sizes="(min-width: 1280px) 620px, 95vw"
        src={BOOK_ILLUSTRATION_SRC}
      />
    </div>
  );
}

function BookBaseFallback() {
  return (
    <div className="pointer-events-none absolute bottom-[96px] left-1/2 z-10 h-[300px] w-[min(95vw,620px)] -translate-x-1/2 sm:h-[340px]" aria-hidden="true">
      <div className="absolute inset-x-[6%] bottom-8 h-20 rounded-[50%] bg-plum/18 blur-2xl" />
      <div className="absolute left-1/2 top-[9%] h-[72%] w-[46%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.78)_0%,rgba(255,231,163,.52)_32%,rgba(255,207,134,.20)_58%,transparent_76%)] blur-md" />
      <div className="absolute inset-x-[4%] bottom-14 h-[34%] rounded-[46%_46%_18%_18%] bg-[linear-gradient(180deg,#fffaf0_0%,#ffe7a3_68%,#6a3a76_69%,#3b246b_100%)] shadow-[0_24px_42px_rgba(59,36,107,.18)]" />
    </div>
  );
}

function SideStoryCover({
  kind,
  layout,
  onSelect,
  reducedMotion,
  story,
}: {
  kind: SideCoverKind;
  layout: SideCoverLayout;
  onSelect: () => void;
  reducedMotion: boolean;
  story: Story;
}) {
  return (
    <motion.button
      aria-label={`${kind === 'previous' ? 'Mostrar história anterior' : 'Mostrar próxima história'}: ${story.title}`}
      className={`absolute z-30 overflow-hidden rounded-[1.2rem] bg-white p-2 shadow-[0_22px_42px_rgba(59,36,107,.20)] outline-none ring-1 ring-white/85 transition focus-visible:ring-4 focus-visible:ring-coral/50 ${layout.className}`}
      animate={reducedMotion ? { rotate: layout.baseRotate } : { y: layout.y, rotate: layout.rotate }}
      onClick={onSelect}
      onKeyDown={(event) => activateWithKeyboard(event, onSelect)}
      transition={{ duration: kind === 'previous' ? 5.8 : 6.2, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
      type="button"
      whileHover={reducedMotion ? undefined : { scale: 1.05, rotate: layout.hoverRotate }}
    >
      <span className="relative block h-full w-full overflow-hidden rounded-[0.85rem] bg-cream">
        <StoryCoverImage sizes={layout.imageSizes} story={story} />
      </span>
      <span className="pointer-events-none absolute inset-2 rounded-[0.85rem] bg-gradient-to-t from-plum/20 via-transparent to-white/18" aria-hidden="true" />
    </motion.button>
  );
}

function StoryCoverImage({ priority = false, sizes, story }: { priority?: boolean; sizes: string; story: Story }) {
  if (story.coverUrl) {
    return <Image alt={`Capa de ${story.title}`} className="object-cover" fill priority={priority} sizes={sizes} src={story.coverUrl} />;
  }

  return <BookPlaceholder story={story} />;
}

function BookPlaceholder({ story }: { story: Story }) {
  const [from, to, accent] = getCategoryPalette(story);

  return (
    <span className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 90 180" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 130c18-20 34-9 50-25 16-17 26-10 40-2v77H0Z" fill="#fff8ea" opacity=".42" />
        <path d="M12 42 23 20l11 22 21 11-21 11-11 22-11-22-22-11Z" fill="#ffe7a3" opacity=".9" />
        <path d="M58 97c14-24 31-17 26 2-3 14-18 13-26-2Z" fill="#f36f91" opacity=".75" />
        <path d="M21 126c10-20 26-20 37 0" fill="none" stroke={accent} strokeLinecap="round" strokeWidth="7" opacity=".78" />
        <path d="M18 150h54" stroke={accent} strokeLinecap="round" strokeWidth="5" opacity=".55" />
      </svg>
      <span className="absolute inset-x-2 bottom-4 rounded-xl bg-white/76 px-2 py-2 text-center text-[10px] font-black leading-3 text-plum shadow-sm">
        {story.category}
      </span>
    </span>
  );
}
