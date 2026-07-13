'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { KeyboardEvent } from 'react';

import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

const MAX_BOOKS = 12;
const BOOKS_PER_ROW = 4;

function selectBookshelfStories(stories: Story[]) {
  const publishedStories = stories.filter(
    (story) => story.status === 'published',
  );

  const featuredStories = publishedStories.filter(
    (story) => story.popular || story.storyOfWeek,
  );

  const recentStories = publishedStories
    .filter(
      (story) =>
        !featuredStories.some(
          (featuredStory) => featuredStory.slug === story.slug,
        ),
    )
    .sort(
      (firstStory, secondStory) =>
        new Date(secondStory.createdAt).getTime() -
        new Date(firstStory.createdAt).getTime(),
    );

  return [...featuredStories, ...recentStories].slice(0, MAX_BOOKS);
}

function openWithSpace(event: KeyboardEvent<HTMLAnchorElement>) {
  if (event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
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
      <div className="relative mx-auto grid min-h-[460px] w-full max-w-[650px] place-items-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#fff8ef] via-[#fff4f8] to-[#eee7ff] px-10 text-center shadow-[0_30px_90px_rgba(59,36,107,.16)]">
        <div>
          <p className="font-display text-3xl font-black text-plum">
            Novas histórias estão chegando.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Em breve esta estante estará cheia de aventuras.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      aria-label="Estante mágica de histórias"
      className="relative mx-auto w-full max-w-[700px] md:justify-self-end"
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
        className="absolute -inset-12 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,231,163,.46),rgba(249,196,210,.32)_38%,rgba(183,155,239,.24)_64%,transparent_78%)] blur-xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-10 left-[10%] h-24 w-[80%] rounded-full bg-plum/20 blur-3xl"
      />

      <BookshelfLights reducedMotion={Boolean(reducedMotion)} />

      {/* ESTANTE DESKTOP */}
      <div className="relative hidden min-h-[710px] px-3 pb-4 pt-2 md:block">
        <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-t-[47%] rounded-b-[3rem] bg-[linear-gradient(105deg,#5f321e_0%,#b76f3e_12%,#7a4024_25%,#d09155_40%,#7b4024_56%,#bf7944_73%,#5b2f1c_89%,#9b5b34_100%)] p-[21px] shadow-[0_35px_90px_rgba(59,36,107,.26),inset_0_0_0_3px_rgba(255,231,163,.28)]">
          <div className="relative h-full overflow-hidden rounded-t-[46%] rounded-b-[2.2rem] bg-[radial-gradient(circle_at_50%_12%,#633820_0%,#3b2118_42%,#23130f_100%)] shadow-[inset_0_0_70px_rgba(0,0,0,.65)]">
            <div className="absolute inset-x-[10%] top-[4%] h-36 rounded-full bg-[#ffe7a3]/15 blur-3xl" />

            <div className="pointer-events-none absolute inset-0 opacity-[.16] [background-image:repeating-linear-gradient(92deg,transparent_0,transparent_27px,rgba(255,255,255,.14)_28px,transparent_30px)]" />

            <div
              aria-hidden="true"
              className="absolute left-[12%] right-[12%] top-[10%] z-30 h-[2px] rotate-[-1deg] bg-[#a76b38]/80"
            />

            <div className="relative z-20 flex h-full flex-col justify-end px-7 pb-7 pt-36">
              {rows.map((rowStories, rowIndex) => (
                <div
                  className="relative flex flex-1 flex-col justify-end"
                  key={rowIndex}
                >
                  <div
                    className={`flex min-h-[154px] items-end justify-center px-2 ${
                      rowStories.length <= 2
                        ? 'gap-16'
                        : rowStories.length === 3
                          ? 'gap-8'
                          : 'gap-5 lg:gap-6'
                    }`}
                  >
                    {rowStories.map((story, index) => (
                      <MagicBook
                        index={rowIndex * BOOKS_PER_ROW + index}
                        key={story.slug}
                        reducedMotion={Boolean(reducedMotion)}
                        story={story}
                      />
                    ))}
                  </div>

                  <div className="relative z-10 mt-2 h-6 rounded-[999px] bg-[linear-gradient(180deg,#e2aa70_0%,#a6633b_34%,#63351f_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,.38),0_10px_20px_rgba(0,0,0,.48)]">
                    <div className="absolute inset-x-4 top-1 h-[3px] rounded-full bg-white/24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BookshelfFlowers reducedMotion={Boolean(reducedMotion)} />
      </div>

      {/* ESTANTE MOBILE */}
      <div className="relative -mx-4 overflow-x-auto px-4 pb-8 pt-9 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        <div className="relative min-w-max rounded-[2.2rem] border-[11px] border-[#995934] bg-[linear-gradient(180deg,#4d2b1e,#24130e)] px-5 pb-4 pt-8 shadow-[0_25px_55px_rgba(59,36,107,.22)]">
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

          <div className="mt-3 h-5 min-w-[760px] rounded-full bg-[linear-gradient(180deg,#dba168,#8f5030_58%,#5b301d)] shadow-[0_9px_20px_rgba(0,0,0,.38)]" />
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
    'h-[156px]',
    'h-[164px]',
    'h-[159px]',
    'h-[168px]',
    'h-[162px]',
    'h-[167px]',
    'h-[158px]',
    'h-[164px]',
    'h-[168px]',
    'h-[160px]',
    'h-[165px]',
    'h-[162px]',
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
                delay: index * 0.1,
                duration: 5.1 + (index % 4) * 0.4,
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
              scale: 1.07,
              rotate: index % 2 === 0 ? -1 : 1,
              zIndex: 50,
            }
      }
      whileFocus={
        reducedMotion
          ? undefined
          : {
              y: -12,
              scale: 1.07,
              zIndex: 50,
            }
      }
    >
      <Link
        aria-label={`Abrir história ${story.title}, ${story.ageRange}`}
        className={`relative block w-[98px] ${heights[index % heights.length]} ${rotations[index % rotations.length]} overflow-hidden rounded-md bg-white shadow-[0_14px_24px_rgba(0,0,0,.48)] outline-none ring-1 ring-white/40 transition focus-visible:ring-4 focus-visible:ring-coral/60 lg:w-[108px]`}
        href={`/historias/${story.slug}`}
        onKeyDown={openWithSpace}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-30 w-[7px] bg-gradient-to-r from-black/32 via-white/17 to-transparent"
        />

        {story.coverUrl ? (
          <Image
            alt={`Capa de ${story.title}`}
            className="h-full w-full object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 108px, 98px"
            src={story.coverUrl}
          />
        ) : (
          <BookPlaceholder story={story} />
        )}

        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-black/22 via-transparent to-white/18"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 z-40 opacity-0 shadow-[inset_0_0_30px_rgba(255,231,163,.95),0_0_26px_rgba(255,201,93,.68)] transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      </Link>

      <div className="pointer-events-none absolute -top-[82px] left-1/2 z-[60] w-52 -translate-x-1/2 translate-y-2 rounded-2xl bg-white/96 px-4 py-3 text-center opacity-0 shadow-[0_18px_42px_rgba(25,15,55,.26)] ring-1 ring-lilac/25 backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
  return (
    <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#d9c7ff] via-[#ffdce8] to-[#fff0bd] px-2 text-center">
      <span className="text-xs font-black leading-4 text-plum">
        {story.title}
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
    ['left-[39%]', 'top-[8%]', 1],
    ['left-[51%]', 'top-[5%]', 1.5],
    ['right-[31%]', 'top-[8%]', 0.8],
    ['right-[18%]', 'top-[11%]', 1.3],
    ['left-[10%]', 'top-[31%]', 0.4],
    ['right-[8%]', 'top-[38%]', 1.7],
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
                  scale: [0.85, 1.45, 0.9],
                }
          }
          className={`absolute ${x} ${y} h-2.5 w-2.5 rounded-full bg-[#ffe39a] shadow-[0_0_8px_#ffe39a,0_0_20px_#ffca62]`}
          key={index}
          transition={{
            delay,
            duration: 2.4 + index * 0.17,
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
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { rotate: [-1, 1.5, -1] }
        }
        className="absolute left-[1%] top-[-3%] h-24 w-[98%]"
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-[2%] top-7 h-5 w-12 rotate-[-26deg] rounded-[100%_0] bg-[#78aa68]" />
        <span className="absolute left-[13%] top-2 h-5 w-11 rotate-[20deg] rounded-[100%_0] bg-[#9bc67d]" />
        <span className="absolute left-[27%] top-8 h-5 w-11 rotate-[-20deg] rounded-[100%_0] bg-[#80b570]" />
        <span className="absolute right-[27%] top-5 h-5 w-11 rotate-[16deg] rounded-[100%_0] bg-[#9dc982]" />
        <span className="absolute right-[13%] top-8 h-5 w-12 rotate-[-16deg] rounded-[100%_0] bg-[#77aa67]" />
        <span className="absolute right-[1%] top-2 h-5 w-11 rotate-[22deg] rounded-[100%_0] bg-[#a8cb7e]" />
      </motion.div>

      <span className="absolute left-[16%] top-[1%] h-4 w-4 rounded-full bg-coral shadow-[10px_1px_0_#ff9bb6,-7px_5px_0_#ffd0de,1px_10px_0_#f36f91]" />

      <span className="absolute right-[18%] top-[2%] h-4 w-4 rounded-full bg-[#ffd69a] shadow-[10px_2px_0_#f6a8bd,-7px_5px_0_#f9c4d2,1px_10px_0_#ffe7a3]" />

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -5, 0],
                rotate: [-7, 4, -7],
              }
        }
        className="absolute bottom-[1%] left-[-1%] h-10 w-20 rounded-[100%_0] bg-[#78aa68]/90"
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
        className="absolute bottom-[1%] right-[-1%] h-10 w-20 rounded-[0_100%] bg-[#94c37f]/90"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 11, 0],
                y: [0, -11, 0],
                rotate: [-5, 8, -5],
              }
        }
        className="absolute right-[4%] top-[12%] h-12 w-12"
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-0 top-2 h-8 w-6 rotate-[-14deg] rounded-full rounded-br-sm bg-coral/80" />
        <span className="absolute right-0 top-0 h-9 w-6 rotate-[14deg] rounded-full rounded-bl-sm bg-rose/95" />
        <span className="absolute left-[23px] top-2 h-9 w-1 rounded-full bg-plum/65" />
      </motion.span>
    </div>
  );
}
