'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { KeyboardEvent } from 'react';
import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

const BOOKS_PER_ROW = 4;
const MAX_BOOKS = 12;

function selectBookshelfStories(stories: Story[]) {
  const published = stories.filter((story) => story.status === 'published');

  const featured = published.filter(
    (story) => story.popular || story.storyOfWeek,
  );

  const recent = published
    .filter(
      (story) =>
        !featured.some(
          (featuredStory) => featuredStory.slug === story.slug,
        ),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

  return [...featured, ...recent].slice(0, MAX_BOOKS);
}

function openWithSpace(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function getCategoryPalette(story: Story) {
  const category =
    `${story.category} ${story.categorySlug}`.toLowerCase();

  if (category.includes('amizade')) {
    return ['#ffe7a3', '#f36f91', '#7c4cb0'];
  }

  if (category.includes('natureza')) {
    return ['#bfeaf5', '#a9d9bd', '#3b246b'];
  }

  if (
    category.includes('sonho') ||
    category.includes('imagina') ||
    category.includes('fantasia')
  ) {
    return ['#b79bef', '#ffd6e8', '#3b246b'];
  }

  if (
    category.includes('coragem') ||
    category.includes('aventura')
  ) {
    return ['#ffcf86', '#f36f91', '#3b246b'];
  }

  return [
    story.color || '#bfeaf5',
    '#fff8ea',
    story.accentColor || '#3b246b',
  ];
}

export function MagicBookshelf({
  stories,
}: MagicBookshelfProps) {
  const reducedMotion = useReducedMotion();
  const bookshelfStories = selectBookshelfStories(stories);

  const rows = Array.from({ length: 3 }, (_, rowIndex) =>
    bookshelfStories.slice(
      rowIndex * BOOKS_PER_ROW,
      rowIndex * BOOKS_PER_ROW + BOOKS_PER_ROW,
    ),
  );

  if (bookshelfStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[440px] w-full max-w-[620px] place-items-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#fff8ea] via-[#fff2f7] to-[#eee5ff] px-8 text-center shadow-[0_28px_80px_rgba(59,36,107,.14)]">
        <div>
          <p className="font-display text-3xl font-black text-plum">
            A estante está esperando histórias.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Novas aventuras aparecerão aqui em breve.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      aria-label="Estante mágica de histórias"
      className="relative mx-auto w-full max-w-[650px] md:justify-self-end"
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 24 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,231,163,.48),rgba(249,196,210,.30)_38%,rgba(183,155,239,.25)_64%,transparent_78%)] blur-xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-8 left-[12%] h-20 w-[76%] rounded-full bg-plum/20 blur-2xl"
      />

      <BookshelfLights reducedMotion={Boolean(reducedMotion)} />

      {/* ESTANTE DESKTOP */}
      <div className="relative hidden min-h-[665px] overflow-visible px-6 pb-8 pt-8 md:block">
        {/* Moldura externa de madeira */}
        <div className="absolute inset-x-1 bottom-0 top-0 overflow-hidden rounded-t-[48%] rounded-b-[2.8rem] bg-[linear-gradient(110deg,#8b4d2d_0%,#d09558_14%,#7b3e24_31%,#b9723f_50%,#71371f_68%,#c5844b_86%,#794126_100%)] p-[15px] shadow-[0_35px_85px_rgba(59,36,107,.24),inset_0_0_0_3px_rgba(255,231,163,.24)]">
          {/* Fundo interno */}
          <div className="relative h-full overflow-hidden rounded-t-[47%] rounded-b-[2rem] bg-[radial-gradient(circle_at_50%_16%,#5b301d_0%,#3b2119_42%,#251510_100%)] shadow-[inset_0_0_55px_rgba(0,0,0,.55)]">
            {/* Brilho superior */}
            <div className="absolute inset-x-[12%] top-[3%] h-32 rounded-full bg-amber-200/15 blur-3xl" />

            {/* Veios da madeira */}
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(94deg,transparent_0,transparent_24px,rgba(255,255,255,.13)_25px,transparent_27px)]" />

            {/* Livros e prateleiras */}
            <div className="relative z-20 flex h-full flex-col justify-end px-7 pb-7 pt-28">
              {rows.map((rowStories, rowIndex) => (
                <div
                  className="relative flex flex-1 flex-col justify-end"
                  key={rowIndex}
                >
                  <div className="flex min-h-[145px] items-end justify-center gap-4 px-2 lg:gap-5">
                    {rowStories.map((story, index) => (
                      <MagicBook
                        index={rowIndex * BOOKS_PER_ROW + index}
                        key={story.slug}
                        reducedMotion={Boolean(reducedMotion)}
                        story={story}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 mt-2 h-5 rounded-[999px] bg-[linear-gradient(180deg,#e0a76c_0%,#9a5934_34%,#5e321f_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,.35),0_8px_16px_rgba(0,0,0,.42)]">
                    <div className="absolute inset-x-4 top-1 h-[3px] rounded-full bg-white/25" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BookshelfFlowers reducedMotion={Boolean(reducedMotion)} />
      </div>

      {/* ESTANTE MOBILE */}
      <div className="relative -mx-4 overflow-x-auto px-4 pb-7 pt-10 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        <div className="relative min-w-max rounded-[2rem] border-[10px] border-[#9b5a35] bg-[linear-gradient(180deg,#4d2b1e,#27150f)] px-5 pb-4 pt-8 shadow-[0_24px_50px_rgba(59,36,107,.20)]">
          <div className="flex items-end gap-5">
            {bookshelfStories.slice(0, 8).map((story, index) => (
              <MagicBook
                index={index}
                key={story.slug}
                reducedMotion={Boolean(reducedMotion)}
                story={story}
              />
            ))}
          </div>

          <div className="mt-3 h-5 min-w-[720px] rounded-full bg-[linear-gradient(180deg,#dca369,#8e5030_58%,#5c311e)] shadow-[0_8px_18px_rgba(0,0,0,.35)]" />
        </div>
      </div>
    </motion.section>
  );
}

function MagicBook({
  index,
  reducedMotion,
  story,
}: {
  index: number;
  reducedMotion: boolean;
  story: Story;
}) {
  const rotations = [
    '-rotate-1',
    'rotate-1',
    'rotate-0',
    'rotate-1',
    'rotate-0',
    '-rotate-1',
    'rotate-1',
    'rotate-0',
    '-rotate-1',
    'rotate-1',
    'rotate-0',
    '-rotate-1',
  ];

  const heights = [
    'h-[132px]',
    'h-[142px]',
    'h-[136px]',
    'h-[146px]',
    'h-[138px]',
    'h-[145px]',
    'h-[134px]',
    'h-[142px]',
    'h-[146px]',
    'h-[136px]',
    'h-[143px]',
    'h-[139px]',
  ];

  return (
    <motion.div
      className="group relative shrink-0"
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, y: 16 }
      }
      animate={
        reducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: [0, -4, 0],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: {
                delay: 0.08 + index * 0.045,
                duration: 0.35,
              },
              y: {
                delay: index * 0.12,
                duration: 5.2 + (index % 4) * 0.45,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -12,
              scale: 1.08,
              zIndex: 50,
            }
      }
      whileFocus={
        reducedMotion
          ? undefined
          : {
              y: -12,
              scale: 1.08,
              zIndex: 50,
            }
      }
    >
      <Link
        aria-label={`Abrir história ${story.title}, ${story.ageRange}`}
        className={`relative block w-[84px] ${heights[index % heights.length]} ${rotations[index % rotations.length]} overflow-hidden rounded-md bg-white shadow-[0_12px_20px_rgba(0,0,0,.42)] outline-none ring-1 ring-white/40 transition focus-visible:ring-4 focus-visible:ring-coral/60 lg:w-[91px]`}
        href={`/historias/${story.slug}`}
        onKeyDown={openWithSpace}
      >
        {/* Lombada */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-30 w-[7px] bg-gradient-to-r from-black/28 via-white/18 to-transparent"
        />

        {story.coverUrl ? (
          <Image
            alt={`Capa de ${story.title}`}
            className="h-full w-full object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 91px, 84px"
            src={story.coverUrl}
          />
        ) : (
          <BookPlaceholder story={story} />
        )}

        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-black/20 via-transparent to-white/15"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 z-40 opacity-0 shadow-[inset_0_0_28px_rgba(255,231,163,.90),0_0_22px_rgba(255,212,116,.60)] transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </Link>

      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-[78px] left-1/2 z-[60] w-52 -translate-x-1/2 translate-y-2 rounded-2xl bg-white/95 px-4 py-3 text-center opacity-0 shadow-[0_18px_40px_rgba(25,15,55,.24)] ring-1 ring-lilac/25 backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="line-clamp-2 text-sm font-black leading-5 text-plum">
          {story.title}
        </p>

        <p className="mt-1 text-xs font-bold text-coral">
          {story.ageRange}
        </p>
      </div>
    </motion.div>
  );
}

function BookPlaceholder({ story }: { story: Story }) {
  const [from, to, accent] = getCategoryPalette(story);

  return (
    <span
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${from}, ${to})`,
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 90 180"
      >
        <path
          d="M0 130c18-20 34-9 50-25 16-17 26-10 40-2v77H0Z"
          fill="#fff8ea"
          opacity=".42"
        />

        <path
          d="M12 42 23 20l11 22 21 11-21 11-11 22-11-22-22-11Z"
          fill="#ffe7a3"
          opacity=".9"
        />

        <path
          d="M58 97c14-24 31-17 26 2-3 14-18 13-26-2Z"
          fill="#f36f91"
          opacity=".75"
        />

        <path
          d="M21 126c10-20 26-20 37 0"
          fill="none"
          opacity=".78"
          stroke={accent}
          strokeLinecap="round"
          strokeWidth="7"
        />
      </svg>

      <span className="absolute inset-x-2 bottom-4 rounded-xl bg-white/80 px-2 py-2 text-center text-[10px] font-black leading-3 text-plum shadow-sm">
        {story.category}
      </span>
    </span>
  );
}

function BookshelfLights({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const lights = [
    ['left-[16%]', 'top-[9%]', 0],
    ['left-[27%]', 'top-[6%]', 0.5],
    ['left-[40%]', 'top-[8%]', 1],
    ['left-[53%]', 'top-[5%]', 1.5],
    ['right-[30%]', 'top-[8%]', 0.8],
    ['right-[18%]', 'top-[11%]', 1.3],
    ['left-[11%]', 'top-[31%]', 0.4],
    ['right-[9%]', 'top-[38%]', 1.7],
    ['left-[8%]', 'bottom-[27%]', 1.1],
    ['right-[12%]', 'bottom-[22%]', 0.7],
  ] as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-40"
    >
      {lights.map(([x, y, delay], index) => (
        <motion.span
          animate={
            reducedMotion
              ? { opacity: 0.6 }
              : {
                  opacity: [0.25, 1, 0.35],
                  scale: [0.85, 1.4, 0.9],
                }
          }
          className={`absolute ${x} ${y} h-2 w-2 rounded-full bg-[#ffe39a] shadow-[0_0_8px_#ffe39a,0_0_18px_#ffca62]`}
          key={index}
          transition={{
            delay,
            duration: 2.4 + index * 0.18,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function BookshelfFlowers({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50"
    >
      {/* Folhagens superiores */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                rotate: [-1, 1.5, -1],
              }
        }
        className="absolute left-[8%] top-0 h-12 w-[84%]"
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-[4%] top-4 h-4 w-10 rotate-[-25deg] rounded-[100%_0] bg-[#8ebd78]" />
        <span className="absolute left-[15%] top-1 h-4 w-9 rotate-[18deg] rounded-[100%_0] bg-[#a8ce83]" />
        <span className="absolute left-[27%] top-4 h-4 w-9 rotate-[-18deg] rounded-[100%_0] bg-[#79ae6b]" />
        <span className="absolute right-[28%] top-2 h-4 w-9 rotate-[15deg] rounded-[100%_0] bg-[#9ac87d]" />
        <span className="absolute right-[15%] top-4 h-4 w-10 rotate-[-15deg] rounded-[100%_0] bg-[#78aa68]" />
        <span className="absolute right-[3%] top-1 h-4 w-9 rotate-[22deg] rounded-[100%_0] bg-[#a6ca78]" />
      </motion.div>

      {/* Flores */}
      <span className="absolute left-[20%] top-[2%] h-3 w-3 rounded-full bg-coral shadow-[8px_1px_0_#ff9bb6,-6px_4px_0_#ffd0de,1px_8px_0_#f36f91]" />
      <span className="absolute right-[22%] top-[3%] h-3 w-3 rounded-full bg-[#ffd69a] shadow-[8px_2px_0_#f6a8bd,-6px_4px_0_#f9c4d2,1px_8px_0_#ffe7a3]" />

      {/* Folhas inferiores */}
      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -5, 0],
                rotate: [-7, 4, -7],
              }
        }
        className="absolute bottom-[2%] left-[3%] h-7 w-14 rounded-[100%_0] bg-[#83b87b]/80"
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -4, 0],
                rotate: [7, -4, 7],
              }
        }
        className="absolute bottom-[1%] right-[3%] h-7 w-14 rounded-[0_100%] bg-[#9cc88a]/80"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Borboleta */}
      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 10, 0],
                y: [0, -10, 0],
                rotate: [-5, 8, -5],
              }
        }
        className="absolute right-[9%] top-[11%] h-10 w-11"
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-0 top-2 h-7 w-5 rotate-[-14deg] rounded-full rounded-br-sm bg-coral/75" />
        <span className="absolute right-0 top-0 h-8 w-5 rotate-[14deg] rounded-full rounded-bl-sm bg-rose/90" />
        <span className="absolute left-[20px] top-2 h-8 w-1 rounded-full bg-plum/60" />
      </motion.span>
    </div>
  );
}
