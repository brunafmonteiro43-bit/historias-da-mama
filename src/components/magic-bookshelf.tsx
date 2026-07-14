'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';

import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

const MAX_STORIES = 8;
const ROTATION_INTERVAL = 5200;

function selectHeroStories(stories: Story[]) {
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

  return [...featuredStories, ...recentStories].slice(0, MAX_STORIES);
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
  const heroStories = useMemo(
    () => selectHeroStories(stories),
    [stories],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || heroStories.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex + 1 >= heroStories.length
          ? 0
          : currentIndex + 1,
      );
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [heroStories.length, reducedMotion]);

  useEffect(() => {
    if (activeIndex >= heroStories.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, heroStories.length]);

  if (heroStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[430px] w-full max-w-[650px] place-items-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#fff8ef] via-[#fff4f8] to-[#eee7ff] px-10 text-center shadow-[0_30px_90px_rgba(59,36,107,.14)]">
        <div className="relative z-10 max-w-sm">
          <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-white/75 text-5xl shadow-[0_18px_40px_rgba(59,36,107,.12)]">
            📖
          </div>

          <p className="font-display text-3xl font-black text-plum">
            Novas histórias estão chegando.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Em breve, uma nova aventura vai surgir deste livro mágico.
          </p>
        </div>

        <MagicParticles reducedMotion={Boolean(reducedMotion)} />
      </div>
    );
  }

  const activeStory = heroStories[activeIndex];
  const floatingStories = heroStories
    .filter((_, index) => index !== activeIndex)
    .slice(0, 2);

  function selectStory(story: Story) {
    const nextIndex = heroStories.findIndex(
      (item) => item.slug === story.slug,
    );

    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <motion.section
      aria-label="Portal mágico de histórias"
      className="relative mx-auto w-full max-w-[720px] md:justify-self-end"
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
        className="absolute -inset-12 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,231,163,.48),rgba(249,196,210,.31)_38%,rgba(183,155,239,.25)_64%,transparent_78%)] blur-xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-10 left-[10%] h-24 w-[80%] rounded-full bg-plum/18 blur-3xl"
      />

      <div className="relative min-h-[600px] overflow-visible px-2 pb-4 pt-6 sm:px-6 md:min-h-[650px]">
        <MagicParticles reducedMotion={Boolean(reducedMotion)} />

        <div className="relative mx-auto flex min-h-[590px] max-w-[650px] items-center justify-center md:min-h-[630px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.94)_0%,rgba(255,244,209,.78)_34%,rgba(249,196,210,.42)_58%,rgba(183,155,239,.18)_74%,transparent_76%)] blur-sm sm:h-[500px] sm:w-[500px]"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[19%] h-48 w-[70%] -translate-x-1/2 rounded-[50%] bg-white/40 blur-3xl"
          />

          <MagicOpenBook reducedMotion={Boolean(reducedMotion)} />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[27%] left-1/2 z-20 h-[250px] w-[280px] -translate-x-1/2 overflow-hidden"
            animate={
              reducedMotion
                ? { opacity: 0.72 }
                : {
                    opacity: [0.48, 0.9, 0.58],
                    scaleY: [0.96, 1.05, 0.98],
                  }
            }
            transition={{
              duration: 3.8,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute bottom-0 left-1/2 h-full w-32 -translate-x-1/2 bg-[linear-gradient(to_top,rgba(255,216,112,.95),rgba(255,240,178,.62)_48%,transparent_100%)] blur-2xl" />
            <div className="absolute bottom-0 left-1/2 h-full w-3 -translate-x-1/2 bg-white/80 blur-md" />
            <div className="absolute bottom-2 left-[18%] h-[88%] w-10 -rotate-[17deg] bg-[linear-gradient(to_top,rgba(255,221,130,.65),transparent)] blur-lg" />
            <div className="absolute bottom-2 right-[18%] h-[88%] w-10 rotate-[17deg] bg-[linear-gradient(to_top,rgba(255,221,130,.65),transparent)] blur-lg" />
          </motion.div>


          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.slug}
              className="absolute left-1/2 top-[15%] z-30 -translate-x-1/2"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 18, scale: 0.92 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12, scale: 0.95 }
              }
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <FeaturedStoryCard
                reducedMotion={Boolean(reducedMotion)}
                story={activeStory}
              />
            </motion.div>
          </AnimatePresence>

          <FloatingStoryCards
            activeStory={activeStory}
            reducedMotion={Boolean(reducedMotion)}
            stories={floatingStories}
            onSelect={selectStory}
          />

          <StoryDots
            activeIndex={activeIndex}
            stories={heroStories}
            onSelect={setActiveIndex}
          />

          <div className="absolute bottom-[9%] left-1/2 z-30 -translate-x-1/2">
            <Link
              className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(59,36,107,.24)] transition hover:-translate-y-1 hover:shadow-[0_20px_38px_rgba(59,36,107,.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/45"
              href={`/historias/${activeStory.slug}`}
              onKeyDown={openWithSpace}
            >
              <span aria-hidden="true">📖</span>
              Ler esta história
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedStoryCard({
  reducedMotion,
  story,
}: {
  reducedMotion: boolean;
  story: Story;
}) {
  return (
    <motion.div
      animate={
        reducedMotion
          ? undefined
          : {
              y: [0, -8, 0],
              rotate: [-0.8, 0.8, -0.8],
            }
      }
      transition={{
        duration: 6,
        repeat: reducedMotion ? 0 : Infinity,
        ease: 'easeInOut',
      }}
      className="group relative"
    >
      <Link
        aria-label={`Abrir história ${story.title}`}
        className="relative block h-[230px] w-[150px] overflow-hidden rounded-[1.35rem] bg-white shadow-[0_28px_50px_rgba(59,36,107,.28)] ring-[12px] ring-white transition duration-300 hover:-translate-y-2 hover:scale-[1.035] hover:shadow-[0_34px_60px_rgba(59,36,107,.34)] focus-visible:outline-none focus-visible:ring-[12px] focus-visible:ring-white sm:h-[270px] sm:w-[176px]"
        href={`/historias/${story.slug}`}
        onKeyDown={openWithSpace}
      >
        {story.coverUrl ? (
          <Image
            alt={`Capa de ${story.title}`}
            className="h-full w-full object-cover"
            fill
            priority
            sizes="(min-width: 640px) 176px, 150px"
            src={story.coverUrl}
          />
        ) : (
          <BookPlaceholder story={story} />
        )}

        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 z-20 w-3 bg-gradient-to-r from-black/24 via-white/15 to-transparent"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 bg-gradient-to-t from-plum/30 via-transparent to-white/18"
        />

        <span className="absolute inset-x-3 bottom-3 z-30 rounded-2xl bg-white/92 px-3 py-2 text-center opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="line-clamp-2 block text-sm font-black leading-5 text-plum">
            {story.title}
          </span>
          <span className="mt-1 block text-xs font-bold text-coral">
            {story.ageRange}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function FloatingStoryCards({
  activeStory,
  onSelect,
  reducedMotion,
  stories,
}: {
  activeStory: Story;
  onSelect: (story: Story) => void;
  reducedMotion: boolean;
  stories: Story[];
}) {
  const positions = [
    'left-[7%] top-[29%] sm:left-[11%]',
    'right-[7%] top-[29%] sm:right-[11%]',
  ];

  return (
    <>
      {stories.map((story, index) => (
        <motion.button
          aria-label={`Destacar história ${story.title}`}
          className={`absolute z-20 ${positions[index]} group h-[148px] w-[96px] overflow-hidden rounded-[1rem] bg-white p-0 shadow-[0_18px_36px_rgba(59,36,107,.18)] ring-[6px] ring-white/65 transition focus-visible:outline-none focus-visible:ring-coral/50 sm:h-[172px] sm:w-[112px]`}
          key={`${activeStory.slug}-${story.slug}`}
          onClick={() => onSelect(story)}
          type="button"
          initial={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.86, y: 12 }
          }
          animate={
            reducedMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, index % 2 === 0 ? -6 : 6, 0],
                  rotate: [
                    index % 2 === 0 ? -2 : 2,
                    index % 2 === 0 ? 2 : -2,
                    index % 2 === 0 ? -2 : 2,
                  ],
                }
          }
          transition={{
            opacity: { duration: 0.35, delay: index * 0.08 },
            scale: { duration: 0.35, delay: index * 0.08 },
            y: {
              duration: 5.8 + index * 0.5,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 6.4 + index * 0.4,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            },
          }}
          whileHover={
            reducedMotion
              ? undefined
              : { y: -10, scale: 1.08, zIndex: 40 }
          }
        >
          {story.coverUrl ? (
            <Image
              alt={`Capa de ${story.title}`}
              className="h-full w-full object-cover"
              fill
              loading="lazy"
              sizes="(min-width: 640px) 112px, 96px"
              src={story.coverUrl}
            />
          ) : (
            <BookPlaceholder story={story} />
          )}

          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-plum/26 via-transparent to-white/14"
          />

          <span className="pointer-events-none absolute inset-x-1 bottom-1 translate-y-2 rounded-lg bg-white/94 px-1.5 py-1 text-[9px] font-black leading-3 text-plum opacity-0 shadow-sm transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            {story.title}
          </span>
        </motion.button>
      ))}
    </>
  );
}

function MagicOpenBook({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-[11%] left-1/2 z-10 h-[250px] w-[450px] -translate-x-1/2 sm:h-[305px] sm:w-[600px]"
      animate={
        reducedMotion
          ? undefined
          : {
              y: [0, -4, 0],
            }
      }
      transition={{
        duration: 6.8,
        repeat: reducedMotion ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="absolute bottom-2 left-1/2 h-16 w-[78%] -translate-x-1/2 rounded-[50%] bg-plum/18 blur-2xl" />

      <div className="absolute bottom-7 left-1/2 h-[198px] w-[47%] -translate-x-[95%] -rotate-[8deg] rounded-[44%_12%_18%_48%] bg-[linear-gradient(145deg,#fff9df_0%,#fff1c7_68%,#dfb879_100%)] shadow-[inset_-12px_-9px_18px_rgba(170,111,62,.16),0_18px_30px_rgba(59,36,107,.16)] sm:h-[242px]" />

      <div className="absolute bottom-7 left-1/2 h-[198px] w-[47%] -translate-x-[5%] rotate-[8deg] rounded-[12%_44%_48%_18%] bg-[linear-gradient(215deg,#fff9df_0%,#fff1c7_68%,#dfb879_100%)] shadow-[inset_12px_-9px_18px_rgba(170,111,62,.16),0_18px_30px_rgba(59,36,107,.16)] sm:h-[242px]" />

      <div className="absolute bottom-[30px] left-1/2 h-[192px] w-5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#f4b6c8,#8a4d84)] shadow-[0_0_10px_rgba(59,36,107,.22)] sm:h-[235px]" />

      <div className="absolute bottom-5 left-[8%] h-8 w-[84%] -rotate-[2deg] rounded-[0_0_50%_50%] bg-[linear-gradient(180deg,#9a5c3a,#6d3c28)] shadow-[0_12px_25px_rgba(59,36,107,.22)]" />

      <div className="absolute bottom-0 left-[21%] h-14 w-[58%] rounded-[50%] bg-[#6a356a] shadow-[0_10px_18px_rgba(59,36,107,.25)]" />

      <span className="absolute bottom-[48%] left-[20%] h-[2px] w-[23%] -rotate-[7deg] rounded-full bg-[#e6c58e]/70" />
      <span className="absolute bottom-[38%] left-[17%] h-[2px] w-[26%] -rotate-[7deg] rounded-full bg-[#e6c58e]/60" />
      <span className="absolute bottom-[48%] right-[20%] h-[2px] w-[23%] rotate-[7deg] rounded-full bg-[#e6c58e]/70" />
      <span className="absolute bottom-[38%] right-[17%] h-[2px] w-[26%] rotate-[7deg] rounded-full bg-[#e6c58e]/60" />
    </motion.div>
  );
}

function StoryDots({
  activeIndex,
  onSelect,
  stories,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  stories: Story[];
}) {
  return (
    <div className="absolute bottom-[1.5%] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
      {stories.map((story, index) => (
        <button
          aria-label={`Mostrar ${story.title}`}
          className={`h-2.5 rounded-full transition-all ${
            index === activeIndex
              ? 'w-8 bg-plum'
              : 'w-2.5 bg-plum/25 hover:bg-plum/45'
          }`}
          key={story.slug}
          onClick={() => onSelect(index)}
          type="button"
        />
      ))}
    </div>
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

function MagicParticles({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const particles = [
    ['left-[12%]', 'top-[18%]', 'text-sun', 0],
    ['right-[14%]', 'top-[16%]', 'text-white', 0.7],
    ['left-[8%]', 'bottom-[28%]', 'text-coral', 1.4],
    ['right-[9%]', 'bottom-[24%]', 'text-aqua', 0.4],
    ['left-[30%]', 'top-[10%]', 'text-white', 1.1],
    ['right-[31%]', 'top-[8%]', 'text-sun', 1.8],
  ] as const;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {particles.map(([x, y, color, delay], index) => (
        <motion.span
          animate={
            reducedMotion
              ? { opacity: 0.55 }
              : {
                  opacity: [0.2, 1, 0.3],
                  scale: [0.8, 1.35, 0.85],
                  y: [0, -8, 0],
                }
          }
          className={`absolute ${x} ${y} ${color} text-xl drop-shadow-[0_0_12px_currentColor]`}
          key={index}
          transition={{
            delay,
            duration: 3.1 + index * 0.35,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        >
          ✦
        </motion.span>
      ))}

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, 18, 0],
                y: [0, -16, 0],
                rotate: [-8, 10, -8],
              }
        }
        className="absolute right-[9%] top-[18%] h-12 w-12"
        transition={{
          duration: 7,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-0 top-2 h-8 w-6 rotate-[-14deg] rounded-full rounded-br-sm bg-coral/78" />
        <span className="absolute right-0 top-0 h-9 w-6 rotate-[14deg] rounded-full rounded-bl-sm bg-rose/95" />
        <span className="absolute left-[23px] top-2 h-9 w-1 rounded-full bg-plum/65" />
      </motion.span>

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -7, 0],
                rotate: [-7, 5, -7],
              }
        }
        className="absolute bottom-[12%] left-[8%] h-9 w-20 rounded-[100%_0] bg-[#8dc6ae]/55"
        transition={{
          duration: 7.8,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.span
        animate={
          reducedMotion
            ? undefined
            : {
                y: [0, -5, 0],
                rotate: [7, -5, 7],
              }
        }
        className="absolute bottom-[9%] right-[7%] h-8 w-16 rounded-[0_100%] bg-[#9bc983]/60"
        transition={{
          duration: 8.4,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
