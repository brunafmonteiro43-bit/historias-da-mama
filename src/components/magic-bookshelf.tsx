'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { KeyboardEvent } from 'react';
import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

const shelfRows = [0, 1, 2];
const bookWidths = ['w-[58px]', 'w-[64px]', 'w-[52px]', 'w-[70px]', 'w-[60px]', 'w-[55px]', 'w-[66px]', 'w-[50px]', 'w-[62px]', 'w-[57px]', 'w-[69px]', 'w-[54px]'];
const bookHeights = ['h-[150px]', 'h-[166px]', 'h-[136px]', 'h-[176px]', 'h-[158px]', 'h-[145px]', 'h-[170px]', 'h-[132px]', 'h-[160px]', 'h-[148px]', 'h-[174px]', 'h-[140px]'];
const bookTilts = ['-rotate-2', 'rotate-1', 'rotate-0', 'rotate-2', '-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0', '-rotate-1', 'rotate-1', '-rotate-2'];

function selectBookshelfStories(stories: Story[]) {
  const published = stories.filter((story) => story.status === 'published');
  const featured = published.filter((story) => story.popular || story.storyOfWeek);
  const recent = published
    .filter((story) => !featured.some((featuredStory) => featuredStory.slug === story.slug))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return [...featured, ...recent].slice(0, 12);
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

export function MagicBookshelf({ stories }: MagicBookshelfProps) {
  const reducedMotion = useReducedMotion();
  const bookshelfStories = selectBookshelfStories(stories);

  if (bookshelfStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[360px] w-full max-w-[610px] place-items-center rounded-[2rem] bg-white/42 text-center shadow-[0_24px_70px_rgba(59,36,107,.10)] ring-1 ring-white/70">
        <div>
          <p className="font-display text-3xl font-black text-plum">A estante está esperando histórias.</p>
          <p className="mt-2 text-sm font-bold text-slate-600">Publique a primeira aventura no painel administrativo.</p>
        </div>
      </div>
    );
  }

  const rows = shelfRows.map((row) => bookshelfStories.slice(row * 4, row * 4 + 4));

  return (
    <motion.div
      aria-label="Estante mágica de histórias"
      className="relative mx-auto w-full max-w-[620px] md:justify-self-end"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle_at_50%_42%,rgba(255,231,163,.40),rgba(249,196,210,.24)_35%,rgba(183,155,239,.22)_62%,transparent_76%)] blur-sm" aria-hidden="true" />
      <div className="absolute -bottom-7 left-[12%] h-20 w-[76%] rounded-full bg-plum/12 blur-2xl" aria-hidden="true" />
      <BookshelfLights reducedMotion={Boolean(reducedMotion)} />
      <BookshelfDecor reducedMotion={Boolean(reducedMotion)} />

      <div className="relative hidden overflow-visible rounded-[2rem] px-5 pb-8 pt-10 md:block">
        <div className="absolute inset-x-5 bottom-7 top-8 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,250,242,.72),rgba(255,245,251,.54))] shadow-[inset_0_0_0_1px_rgba(255,255,255,.72),0_28px_70px_rgba(59,36,107,.14)] backdrop-blur" />
        {rows.map((rowStories, rowIndex) => (
          <div className={`relative z-10 mb-4 ${rowIndex === 2 ? 'hidden lg:block' : ''}`} key={rowIndex}>
            <div className="flex min-h-[188px] items-end justify-center gap-4 px-5 lg:gap-5">
              {rowStories.map((story, index) => {
                const itemIndex = rowIndex * 4 + index;
                return (
                  <MagicBook
                    index={itemIndex}
                    key={story.slug}
                    reducedMotion={Boolean(reducedMotion)}
                    story={story}
                  />
                );
              })}
            </div>
            <div className="relative z-0 h-6 rounded-[999px] bg-[linear-gradient(180deg,#c99b68_0%,#93623f_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,.35),0_12px_22px_rgba(59,36,107,.18)]">
              <div className="absolute inset-x-4 top-1 h-1 rounded-full bg-white/24" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative -mx-5 overflow-x-auto px-5 pb-5 pt-8 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-end gap-4 rounded-[1.5rem] bg-white/38 px-5 pb-5 pt-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,.65)]">
          {bookshelfStories.slice(0, 8).map((story, index) => (
            <MagicBook index={index} key={story.slug} reducedMotion={Boolean(reducedMotion)} story={story} />
          ))}
        </div>
        <div className="mx-4 h-5 min-w-[620px] rounded-full bg-[linear-gradient(180deg,#c99b68_0%,#93623f_100%)] shadow-[0_10px_22px_rgba(59,36,107,.16)]" />
      </div>
    </motion.div>
  );
}

function MagicBook({ index, reducedMotion, story }: { index: number; reducedMotion: boolean; story: Story }) {
  const width = bookWidths[index % bookWidths.length];
  const height = bookHeights[index % bookHeights.length];
  const tilt = bookTilts[index % bookTilts.length];

  return (
    <motion.div
      className="group relative shrink-0"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: [0, -5, 0] }}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: { delay: 0.1 + index * 0.055, duration: 0.35 },
              y: { delay: 0.2 + index * 0.04, duration: 4.8 + (index % 4) * 0.45, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      whileHover={reducedMotion ? undefined : { y: -8, scale: 1.045 }}
      whileFocus={reducedMotion ? undefined : { y: -8, scale: 1.045 }}
    >
      <Link
        aria-label={`Abrir história ${story.title}, ${story.ageRange}`}
        className={`book-card relative block ${width} ${height} ${tilt} overflow-hidden rounded-[0.95rem] shadow-[0_16px_28px_rgba(59,36,107,.18)] outline-none ring-1 ring-white/60 transition focus-visible:ring-4 focus-visible:ring-coral/55`}
        href={`/historias/${story.slug}`}
        onKeyDown={openWithSpace}
      >
        <span className="absolute inset-y-0 left-0 z-20 w-2 bg-white/35" aria-hidden="true" />
        {story.coverUrl ? (
          <Image
            alt={`Capa de ${story.title}`}
            className="h-full w-full object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 80px, 24vw"
            src={story.coverUrl}
          />
        ) : (
          <BookPlaceholder story={story} />
        )}
        <span className="absolute inset-0 z-20 bg-gradient-to-t from-plum/28 via-transparent to-white/20 opacity-70" aria-hidden="true" />
        <span className="absolute inset-0 z-30 opacity-0 shadow-[inset_0_0_22px_rgba(255,231,163,.72)] transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden="true" />
      </Link>
      <div className="pointer-events-none absolute -top-14 left-1/2 z-40 w-48 -translate-x-1/2 rounded-2xl bg-white/96 px-3 py-2 text-center opacity-0 shadow-[0_16px_35px_rgba(59,36,107,.16)] ring-1 ring-lilac/25 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="line-clamp-2 text-sm font-black leading-5 text-plum">{story.title}</p>
        <p className="mt-1 text-xs font-bold text-coral">{story.ageRange}</p>
      </div>
    </motion.div>
  );
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

function BookshelfLights({ reducedMotion }: { reducedMotion: boolean }) {
  const lights = [
    ['left-[8%]', 'top-[9%]', 'h-2 w-2', 0],
    ['left-[24%]', 'top-[2%]', 'h-1.5 w-1.5', 0.6],
    ['left-[43%]', 'top-[7%]', 'h-2.5 w-2.5', 1.2],
    ['right-[31%]', 'top-[3%]', 'h-1.5 w-1.5', 0.3],
    ['right-[11%]', 'top-[13%]', 'h-2 w-2', 1.6],
    ['left-[15%]', 'bottom-[18%]', 'h-1.5 w-1.5', 1],
    ['right-[17%]', 'bottom-[30%]', 'h-2 w-2', 0.8],
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      {lights.map(([x, y, size, delay], index) => (
        <motion.span
          animate={reducedMotion ? { opacity: 0.45 } : { opacity: [0.25, 0.95, 0.35], scale: [0.9, 1.25, 0.95] }}
          className={`absolute ${x} ${y} ${size} rounded-full bg-sun shadow-[0_0_18px_rgba(255,231,163,.95)]`}
          key={index}
          transition={{ delay, duration: 2.8 + index * 0.3, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function BookshelfDecor({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      <motion.span
        animate={reducedMotion ? undefined : { x: [0, 10, 0], y: [0, -12, 0], rotate: [-8, 8, -8] }}
        className="absolute right-[12%] top-[7%] h-9 w-10"
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="absolute left-0 top-2 h-6 w-5 rounded-full rounded-br-sm bg-coral/65" />
        <span className="absolute right-0 top-0 h-7 w-5 rounded-full rounded-bl-sm bg-rose/85" />
        <span className="absolute left-[18px] top-2 h-8 w-1 rounded-full bg-plum/45" />
      </motion.span>
      <motion.span
        animate={reducedMotion ? undefined : { y: [0, -7, 0], rotate: [6, -3, 6] }}
        className="absolute bottom-[13%] left-[5%] h-6 w-11 rounded-[100%_0] bg-aqua/50"
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        animate={reducedMotion ? undefined : { y: [0, -5, 0], rotate: [-8, 4, -8] }}
        className="absolute bottom-[7%] right-[7%] h-5 w-10 rounded-[100%_0] bg-[#a9d9bd]/65"
        transition={{ duration: 8.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="absolute left-[10%] top-[21%] text-lg text-sun">✦</span>
      <span className="absolute right-[6%] top-[34%] text-sm text-white">✦</span>
      <span className="absolute bottom-[23%] right-[24%] text-base text-sun/80">✦</span>
      <span className="absolute bottom-[5%] left-[17%] h-3 w-3 rounded-full bg-coral/65 shadow-[9px_-4px_0_#ff9ab8,18px_0_0_#ffe7a3]" />
    </div>
  );
}
