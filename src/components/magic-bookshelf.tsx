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
const ROTATION_INTERVAL = 5500;

function selectHeroStories(stories: Story[]) {
  const publishedStories = stories.filter(
    (story) => story.status === 'published',
  );

  const priorityStories = publishedStories.filter(
    (story) => story.storyOfWeek || story.popular,
  );

  const recentStories = publishedStories
    .filter(
      (story) =>
        !priorityStories.some(
          (priorityStory) => priorityStory.slug === story.slug,
        ),
    )
    .sort(
      (firstStory, secondStory) =>
        new Date(secondStory.createdAt).getTime() -
        new Date(firstStory.createdAt).getTime(),
    );

  return [...priorityStories, ...recentStories].slice(0, MAX_STORIES);
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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || isPaused || heroStories.length <= 1) {
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
  }, [heroStories.length, isPaused, reducedMotion]);

  useEffect(() => {
    if (activeIndex >= heroStories.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, heroStories.length]);

  if (heroStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[480px] w-full max-w-[720px] place-items-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#fff8ef] via-[#fff4f8] to-[#eee7ff] px-10 text-center shadow-[0_30px_90px_rgba(59,36,107,.14)]">
        <div className="relative z-10 max-w-sm">
          <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-white/80 text-5xl shadow-[0_18px_40px_rgba(59,36,107,.12)]">
            📖
          </div>

          <p className="font-display text-3xl font-black text-[#3b246b]">
            Novas histórias estão chegando.
          </p>

          <p className="mt-3 text-sm font-semibold text-slate-600">
            Em breve, uma nova aventura surgirá deste livro mágico.
          </p>
        </div>
      </div>
    );
  }

  const previousIndex =
    (activeIndex - 1 + heroStories.length) % heroStories.length;
  const nextIndex = (activeIndex + 1) % heroStories.length;

  const previousStory = heroStories[previousIndex];
  const activeStory = heroStories[activeIndex];
  const nextStory = heroStories[nextIndex];

  return (
    <motion.section
      aria-label="Portal mágico de histórias"
      className="relative mx-auto w-full max-w-[740px] md:justify-self-end"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-12 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,231,163,.55),rgba(249,196,210,.34)_38%,rgba(183,155,239,.26)_64%,transparent_78%)] blur-xl"
      />

      <div className="relative min-h-[585px] overflow-visible px-2 pb-8 pt-4 sm:px-5 md:min-h-[660px]">
        <MagicParticles reducedMotion={Boolean(reducedMotion)} />

        <div className="relative mx-auto min-h-[565px] max-w-[700px] md:min-h-[640px]">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[43%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.96)_0%,rgba(255,246,210,.82)_30%,rgba(249,196,210,.40)_58%,rgba(183,155,239,.19)_74%,transparent_77%)] blur-sm sm:h-[560px] sm:w-[560px]"
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[40px] left-[42%] z-10 w-[96vw] max-w-[760px] -translate-x-1/2 sm:left-[34%]"
            animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
            transition={{
              duration: 7,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
          >
            <Image
              alt=""
              className="h-auto w-full object-contain"
              height={1024}
              priority
              sizes="(min-width: 640px) 820px, 96vw"
              src="/illustrations/magic-book.png"
              width={1536}
            />
          </motion.div>



          {heroStories.length > 1 ? (
            <FloatingSideCover
              reducedMotion={Boolean(reducedMotion)}
              side="left"
              story={previousStory}
              onSelect={() => setActiveIndex(previousIndex)}
            />
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.slug}
              className="absolute left-1/2 top-[86px] z-40 -translate-x-1/2 sm:top-[72px]"
              initial={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 18, scale: 0.94 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12, scale: 0.96 }
              }
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <FeaturedStoryCover
                reducedMotion={Boolean(reducedMotion)}
                story={activeStory}
              />
            </motion.div>
          </AnimatePresence>

          {heroStories.length > 1 ? (
            <FloatingSideCover
              reducedMotion={Boolean(reducedMotion)}
              side="right"
              story={nextStory}
              onSelect={() => setActiveIndex(nextIndex)}
            />
          ) : null}

          <div className="absolute bottom-[42px] left-1/2 z-50 -translate-x-1/2">
            <Link
              className="inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-[#3b246b] px-7 py-3.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(59,36,107,.25)] transition hover:-translate-y-1 hover:bg-[#f36f91] hover:shadow-[0_20px_38px_rgba(59,36,107,.30)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f36f91]/40"
              href={`/historias/${activeStory.slug}`}
              onKeyDown={openWithSpace}
            >
              <span aria-hidden="true">📖</span>
              Ler esta história
            </Link>
          </div>

          <StoryDots
            activeIndex={activeIndex}
            stories={heroStories}
            onSelect={setActiveIndex}
          />
        </div>
      </div>
    </motion.section>
  );
}

function FeaturedStoryCover({
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
              y: [0, -5, 0],
              rotate: [-0.35, 0.35, -0.35],
            }
      }
      transition={{
        duration: 6.2,
        repeat: reducedMotion ? 0 : Infinity,
        ease: 'easeInOut',
      }}
    >
      <Link
        aria-label={`Abrir história ${story.title}`}
        className="group relative block h-[244px] w-[160px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_30px_60px_rgba(59,36,107,.30)] ring-[11px] ring-white transition duration-300 hover:-translate-y-2 hover:scale-[1.035] focus-visible:outline-none focus-visible:ring-[11px] focus-visible:ring-white sm:h-[286px] sm:w-[188px]"
        href={`/historias/${story.slug}`}
        onKeyDown={openWithSpace}
      >
        {story.coverUrl ? (
          <Image
            alt={`Capa de ${story.title}`}
            className="object-cover"
            fill
            priority
            sizes="(min-width: 640px) 188px, 160px"
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
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#3b246b]/26 via-transparent to-white/14"
        />

        <span className="absolute inset-x-3 bottom-3 z-30 rounded-2xl bg-white/94 px-3 py-2 text-center opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="line-clamp-2 block text-sm font-black leading-5 text-[#3b246b]">
            {story.title}
          </span>

          <span className="mt-1 block text-xs font-bold text-[#f36f91]">
            {story.ageRange}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function FloatingSideCover({
  onSelect,
  reducedMotion,
  side,
  story,
}: {
  onSelect: () => void;
  reducedMotion: boolean;
  side: 'left' | 'right';
  story: Story;
}) {
  const position =
    side === 'left'
      ? 'left-1/2 top-[238px] -translate-x-[205px] sm:top-[225px] sm:-translate-x-[292px]'
      : 'left-1/2 top-[238px] translate-x-[108px] sm:top-[225px] sm:translate-x-[174px]';

  const rotation: number[] =
    side === 'left' ? [-7, -5.5, -7] : [7, 5.5, 7];

  const floatingY: number[] =
    side === 'left' ? [0, -5, 0] : [0, 5, 0];

  return (
    <motion.button
      aria-label={`Destacar história ${story.title}`}
      className={`absolute ${position} z-30 h-[140px] w-[92px] overflow-hidden rounded-[1.15rem] bg-white p-0 shadow-[0_20px_42px_rgba(59,36,107,.22)] ring-[7px] ring-white transition focus-visible:outline-none focus-visible:ring-[#f36f91]/55 sm:h-[176px] sm:w-[114px]`}
      onClick={onSelect}
      type="button"
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, scale: 0.9, y: 12 }
      }
      animate={
        reducedMotion
          ? {
              opacity: 1,
              rotate: side === 'left' ? -7 : 7,
            }
          : {
              opacity: 1,
              scale: 1,
              y: floatingY,
              rotate: rotation,
            }
      }
      transition={{
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
        y: {
          duration: 6,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        },
        rotate: {
          duration: 6.5,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        },
      }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -9,
              scale: 1.05,
              zIndex: 45,
            }
      }
    >
      {story.coverUrl ? (
        <Image
          alt={`Capa de ${story.title}`}
          className="object-cover"
          fill
          loading="lazy"
          sizes="(min-width: 640px) 114px, 92px"
          src={story.coverUrl}
        />
      ) : (
        <BookPlaceholder story={story} />
      )}

      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#3b246b]/22 via-transparent to-white/12"
      />
    </motion.button>
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
    <div className="absolute bottom-[4px] left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2">
      {stories.map((story, index) => (
        <button
          aria-label={`Mostrar ${story.title}`}
          aria-current={
            index === activeIndex ? 'true' : undefined
          }
          className={`h-2.5 rounded-full transition-all ${
            index === activeIndex
              ? 'w-8 bg-[#3b246b]'
              : 'w-2.5 bg-[#3b246b]/25 hover:bg-[#3b246b]/45'
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
      <span className="text-xs font-black leading-4 text-[#3b246b]">
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
  const particles: Array<{
    className: string;
    delay: number;
  }> = [
    {
      className: 'left-[12%] top-[18%] text-[#ffe39a]',
      delay: 0,
    },
    {
      className: 'right-[14%] top-[16%] text-white',
      delay: 0.7,
    },
    {
      className: 'left-[8%] bottom-[28%] text-[#f36f91]',
      delay: 1.4,
    },
    {
      className: 'right-[9%] bottom-[24%] text-[#8dc6ae]',
      delay: 0.4,
    },
    {
      className: 'left-[30%] top-[10%] text-white',
      delay: 1.1,
    },
    {
      className: 'right-[31%] top-[8%] text-[#ffe39a]',
      delay: 1.8,
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
    >
      {particles.map((particle, index) => (
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
          className={`absolute ${particle.className} text-xl drop-shadow-[0_0_12px_currentColor]`}
          key={index}
          transition={{
            delay: particle.delay,
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
        className="absolute right-[8%] top-[19%] h-12 w-12"
        transition={{
          duration: 7,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className="absolute left-0 top-2 h-8 w-6 rotate-[-14deg] rounded-full rounded-br-sm bg-[#f36f91]/80" />
        <span className="absolute right-0 top-0 h-9 w-6 rotate-[14deg] rounded-full rounded-bl-sm bg-[#f9c4d2]/95" />
        <span className="absolute left-[23px] top-2 h-9 w-1 rounded-full bg-[#3b246b]/65" />
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
        className="absolute bottom-[13%] left-[7%] h-9 w-20 rounded-[100%_0] bg-[#8dc6ae]/55"
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
        className="absolute bottom-[10%] right-[7%] h-8 w-16 rounded-[0_100%] bg-[#9bc983]/60"
        transition={{
          duration: 8.4,
          repeat: reducedMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
