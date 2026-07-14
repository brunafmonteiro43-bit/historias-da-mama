'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Story } from '@/types';

type MagicBookshelfProps = {
  stories: Story[];
};

type FloatingCardLayout = {
  className: string;
  imageSizes: string;
  motion: {
    y: number[];
    rotate: number[];
  };
};

const lateralLayouts: Record<'previous' | 'next', FloatingCardLayout> = {
  previous: {
    className:
      'left-[9%] top-[155px] h-[176px] w-[118px] -rotate-[7deg] sm:left-[12%] sm:top-[150px] sm:h-[188px] sm:w-[124px] md:left-[1%] md:top-[210px] md:h-[170px] md:w-[112px] xl:left-[5%] xl:top-[205px] xl:h-[188px] xl:w-[124px]',
    imageSizes: '(min-width: 1024px) 124px, (min-width: 768px) 118px, 28vw',
    motion: { rotate: [-7, -5.8, -7], y: [0, -6, 0] },
  },
  next: {
    className:
      'right-[9%] top-[155px] h-[176px] w-[118px] rotate-[7deg] sm:right-[12%] sm:top-[150px] sm:h-[188px] sm:w-[124px] md:right-[1%] md:top-[210px] md:h-[170px] md:w-[112px] xl:right-[5%] xl:top-[205px] xl:h-[188px] xl:w-[124px]',
    imageSizes: '(min-width: 1024px) 124px, (min-width: 768px) 118px, 28vw',
    motion: { rotate: [7, 5.8, 7], y: [0, -5, 0] },
  },
};

function selectPortalStories(stories: Story[]) {
  const published = stories.filter((story) => story.status === 'published');
  const storyOfWeek = published.filter((story) => story.storyOfWeek);
  const featured = published.filter(
    (story) => story.popular && !storyOfWeek.some((weekStory) => weekStory.slug === story.slug),
  );
  const recent = published
    .filter(
      (story) =>
        !storyOfWeek.some((weekStory) => weekStory.slug === story.slug) &&
        !featured.some((featuredStory) => featuredStory.slug === story.slug),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return [...storyOfWeek, ...featured, ...recent].slice(0, 8);
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const portalStories = useMemo(() => selectPortalStories(stories), [stories]);

  useEffect(() => {
    setActiveIndex(0);
  }, [portalStories.length]);

  useEffect(() => {
    const handleVisibility = () => setTabVisible(!document.hidden);

    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || !tabVisible || portalStories.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % portalStories.length);
    }, 5600);

    return () => window.clearInterval(interval);
  }, [isPaused, portalStories.length, reducedMotion, tabVisible]);

  if (portalStories.length === 0) {
    return (
      <div className="relative mx-auto grid min-h-[360px] w-full max-w-[610px] place-items-center rounded-[2rem] bg-white/42 text-center shadow-[0_24px_70px_rgba(59,36,107,.10)] ring-1 ring-white/70">
        <div>
          <p className="font-display text-3xl font-black text-plum">A estante esta esperando historias.</p>
          <p className="mt-2 text-sm font-bold text-slate-600">Publique a primeira aventura no painel administrativo.</p>
        </div>
      </div>
    );
  }

  const activeStory = portalStories[activeIndex];
  const previousStory = portalStories.length > 1 ? portalStories[(activeIndex - 1 + portalStories.length) % portalStories.length] : undefined;
  const nextStory = portalStories.length > 1 ? portalStories[(activeIndex + 1) % portalStories.length] : undefined;

  return (
    <motion.div
      aria-label="Portal magico de historias"
      className="relative mx-auto h-[570px] w-full max-w-[720px] overflow-visible sm:h-[610px] md:h-[620px] md:justify-self-end xl:h-[655px]"
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-7 top-0 z-0 rounded-full bg-[radial-gradient(circle_at_52%_48%,rgba(255,231,163,.30),rgba(249,196,210,.18)_38%,rgba(183,155,239,.18)_65%,transparent_80%)] blur-sm" aria-hidden="true" />
      <MagicParticles reducedMotion={Boolean(reducedMotion)} />

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[98px] z-20 mx-auto h-[205px] w-[min(94vw,650px)] sm:h-[235px] md:bottom-[114px] md:h-[236px] md:w-[min(50vw,500px)] xl:bottom-[110px] xl:h-[292px] xl:w-[min(48vw,650px)]"
        animate={reducedMotion ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <OpenMagicBook />
      </motion.div>

      <MagicLight reducedMotion={Boolean(reducedMotion)} />

      {previousStory ? (
        <StoryCoverButton
          kind="previous"
          layout={lateralLayouts.previous}
          reducedMotion={Boolean(reducedMotion)}
          story={previousStory}
          onSelect={() => setActiveIndex((activeIndex - 1 + portalStories.length) % portalStories.length)}
        />
      ) : null}

      {nextStory && nextStory.slug !== previousStory?.slug ? (
        <StoryCoverButton
          kind="next"
          layout={lateralLayouts.next}
          reducedMotion={Boolean(reducedMotion)}
          story={nextStory}
          onSelect={() => setActiveIndex((activeIndex + 1) % portalStories.length)}
        />
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          className="absolute left-1/2 top-[34px] z-50 -ml-[90px] h-[278px] w-[180px] sm:top-[26px] sm:-ml-[96px] sm:h-[296px] sm:w-[192px] md:top-[96px] md:-ml-[92px] md:h-[286px] md:w-[184px] xl:top-[84px] xl:-ml-[99px] xl:h-[306px] xl:w-[198px]"
          key={activeStory.slug}
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.96 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: [0, -6, 0], rotate: [0, 0.45, 0] }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
          transition={
            reducedMotion
              ? { duration: 0.2 }
              : {
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.25 },
                  y: { duration: 6.2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 6.2, repeat: Infinity, ease: 'easeInOut' },
                }
          }
        >
          <Link
            aria-label={`Ler historia ${activeStory.title}`}
            className="group relative block h-full w-full overflow-hidden rounded-[1.25rem] bg-white p-3 shadow-[0_28px_55px_rgba(59,36,107,.25)] outline-none ring-1 ring-white/90 transition focus-visible:ring-4 focus-visible:ring-coral/55"
            href={`/historias/${activeStory.slug}`}
            onKeyDown={openWithSpace}
          >
            <span className="relative block h-full w-full overflow-hidden rounded-[0.95rem] bg-cream">
              <StoryCoverImage priority sizes="(min-width: 768px) 198px, 180px" story={activeStory} />
            </span>
            <span className="pointer-events-none absolute inset-3 rounded-[0.95rem] bg-gradient-to-t from-plum/18 via-transparent to-white/20 opacity-70 transition group-hover:opacity-45" aria-hidden="true" />
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-[22px] z-[60] flex flex-col items-center gap-4 sm:bottom-[24px] md:bottom-[28px]">
        <Link
          aria-label={`Ler esta historia: ${activeStory.title}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-plum px-7 py-3 text-base font-black text-white shadow-[0_18px_42px_rgba(59,36,107,.24)] outline-none transition duration-300 hover:-translate-y-1 hover:bg-coral hover:shadow-[0_24px_52px_rgba(243,111,145,.28)] focus-visible:ring-4 focus-visible:ring-coral/45"
          href={`/historias/${activeStory.slug}`}
          onKeyDown={openWithSpace}
        >
          <BookOpen className="h-5 w-5" />
          Ler esta historia
        </Link>

        <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Escolher historia em destaque">
          {portalStories.map((story, index) => {
            const active = index === activeIndex;

            return (
              <button
                aria-label={`Mostrar historia ${story.title}`}
                aria-selected={active}
                className={`h-7 rounded-full px-1.5 outline-none transition focus-visible:ring-4 focus-visible:ring-coral/45 ${active ? 'w-10' : 'w-7'}`}
                key={story.slug}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => activateWithKeyboard(event, () => setActiveIndex(index))}
                role="tab"
                type="button"
              >
                <span
                  className={`mx-auto block h-3 rounded-full transition-all ${active ? 'w-8 bg-plum shadow-[0_7px_16px_rgba(59,36,107,.22)]' : 'w-3 bg-plum/28 hover:bg-plum/45'}`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function StoryCoverButton({
  kind,
  layout,
  onSelect,
  reducedMotion,
  story,
}: {
  kind: 'previous' | 'next';
  layout: FloatingCardLayout;
  onSelect: () => void;
  reducedMotion: boolean;
  story: Story;
}) {
  return (
    <motion.button
      aria-label={`${kind === 'previous' ? 'Ver historia anterior' : 'Ver proxima historia'}: ${story.title}`}
      className={`absolute z-40 overflow-hidden rounded-[1.05rem] bg-white p-2 shadow-[0_22px_38px_rgba(59,36,107,.20)] outline-none ring-1 ring-white/85 transition focus-visible:ring-4 focus-visible:ring-coral/50 ${layout.className}`}
      animate={reducedMotion ? undefined : { y: layout.motion.y, rotate: layout.motion.rotate }}
      onClick={onSelect}
      onKeyDown={(event) => activateWithKeyboard(event, onSelect)}
      transition={{ duration: kind === 'previous' ? 5.8 : 6.5, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
      type="button"
      whileHover={reducedMotion ? undefined : { scale: 1.05, y: -8 }}
    >
      <span className="relative block h-full w-full overflow-hidden rounded-[0.78rem] bg-cream">
        <StoryCoverImage sizes={layout.imageSizes} story={story} />
      </span>
      <span className="pointer-events-none absolute inset-2 rounded-[0.78rem] bg-gradient-to-t from-plum/20 via-transparent to-white/18" aria-hidden="true" />
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

function MagicLight({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[184px] z-30 mx-auto h-[270px] w-[min(92vw,560px)] sm:bottom-[205px] md:bottom-[218px] md:h-[248px] md:w-[min(48vw,460px)] xl:bottom-[228px] xl:h-[270px] xl:w-[min(92vw,560px)]"
      animate={reducedMotion ? { opacity: 0.88 } : { opacity: [0.72, 1, 0.78] }}
      transition={{ duration: 4.6, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute left-1/2 top-[72%] h-24 w-24 -translate-x-1/2 rounded-full bg-white/85 blur-xl" />
      <div className="absolute left-1/2 top-[12%] h-60 w-52 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.86)_0%,rgba(255,231,163,.56)_28%,rgba(255,207,134,.18)_58%,transparent_72%)] blur-sm" />
      <div className="absolute left-1/2 top-[12%] h-[270px] w-28 -translate-x-1/2 origin-bottom bg-[linear-gradient(0deg,rgba(255,231,163,.72)_0%,rgba(255,255,255,.62)_44%,transparent_100%)] blur-md [clip-path:polygon(42%_100%,58%_100%,100%_0,0_0)]" />
      <div className="absolute left-[32%] top-[28%] h-56 w-20 -rotate-[18deg] origin-bottom bg-[linear-gradient(0deg,rgba(255,207,134,.42),transparent_86%)] blur-md [clip-path:polygon(45%_100%,62%_100%,100%_0,0_0)]" />
      <div className="absolute right-[32%] top-[28%] h-56 w-20 rotate-[18deg] origin-bottom bg-[linear-gradient(0deg,rgba(255,207,134,.42),transparent_86%)] blur-md [clip-path:polygon(38%_100%,55%_100%,100%_0,0_0)]" />
      <div className="absolute left-1/2 top-[6%] h-48 w-48 -translate-x-1/2 rounded-full bg-sun/28 blur-2xl" />
    </motion.div>
  );
}

function OpenMagicBook() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-full">
      <div className="absolute inset-x-[6%] bottom-3 h-14 rounded-[50%] bg-plum/18 blur-xl" />
      <div className="absolute inset-x-[5%] bottom-3 h-[34%] rounded-b-[2rem] bg-[linear-gradient(180deg,#7c4cb0_0%,#4f2a82_68%,#3b246b_100%)] shadow-[0_18px_26px_rgba(59,36,107,.25)]" />
      <div className="absolute left-[4%] right-1/2 bottom-[18%] h-[48%] origin-bottom-right -skew-y-[8deg] rounded-bl-[1.7rem] rounded-tl-[4.2rem] bg-[linear-gradient(160deg,#fffdf6_0%,#fff2c7_62%,#d59a63_100%)] shadow-[inset_-15px_-20px_32px_rgba(196,125,68,.20),0_16px_18px_rgba(59,36,107,.12)]" />
      <div className="absolute left-1/2 right-[4%] bottom-[18%] h-[48%] origin-bottom-left skew-y-[8deg] rounded-br-[1.7rem] rounded-tr-[4.2rem] bg-[linear-gradient(200deg,#fffdf6_0%,#fff2c7_62%,#d59a63_100%)] shadow-[inset_15px_-20px_32px_rgba(196,125,68,.20),0_16px_18px_rgba(59,36,107,.12)]" />
      <div className="absolute left-[8%] right-1/2 bottom-[36%] h-[23%] origin-bottom-right -skew-y-[11deg] rounded-tl-[3.5rem] bg-[#fffaf0] shadow-[0_10px_0_rgba(227,174,105,.42),0_20px_0_rgba(255,246,224,.95),0_30px_0_rgba(205,142,83,.36)]" />
      <div className="absolute left-1/2 right-[8%] bottom-[36%] h-[23%] origin-bottom-left skew-y-[11deg] rounded-tr-[3.5rem] bg-[#fffaf0] shadow-[0_10px_0_rgba(227,174,105,.42),0_20px_0_rgba(255,246,224,.95),0_30px_0_rgba(205,142,83,.36)]" />
      <div className="absolute left-[11%] right-1/2 bottom-[54%] h-3 origin-bottom-right -skew-y-[10deg] rounded-full bg-white/82" />
      <div className="absolute left-1/2 right-[11%] bottom-[54%] h-3 origin-bottom-left skew-y-[10deg] rounded-full bg-white/82" />
      <div className="absolute left-1/2 bottom-[13%] h-[39%] w-[76px] -translate-x-1/2 rounded-t-[999px] bg-[linear-gradient(180deg,#ffe7a3_0%,#f6b44f_42%,#4f2a82_43%,#3b246b_100%)] shadow-[inset_0_5px_0_rgba(255,255,255,.35)]" />
      <div className="absolute left-[9%] right-[9%] bottom-[20%] h-[1px] bg-amber-900/12 shadow-[0_13px_0_rgba(146,86,47,.14),0_26px_0_rgba(146,86,47,.12)]" />
    </div>
  );
}

function MagicParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const particles: Array<{ className: string; delay: number }> = [
    { className: 'left-[11%] top-[18%] h-2 w-2 bg-white', delay: 0 },
    { className: 'left-[21%] top-[33%] h-2.5 w-2.5 bg-sun', delay: 0.7 },
    { className: 'left-[32%] top-[12%] h-1.5 w-1.5 bg-white', delay: 1.1 },
    { className: 'right-[22%] top-[14%] h-2.5 w-2.5 bg-sun', delay: 0.4 },
    { className: 'right-[11%] top-[35%] h-1.5 w-1.5 bg-white', delay: 1.5 },
    { className: 'right-[26%] bottom-[34%] h-2 w-2 bg-white', delay: 0.9 },
    { className: 'left-[16%] bottom-[31%] h-2 w-2 bg-sun', delay: 1.8 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {particles.map((particle, index) => (
        <motion.span
          animate={reducedMotion ? { opacity: 0.55 } : { opacity: [0.25, 0.95, 0.3], scale: [0.9, 1.35, 0.92] }}
          className={`absolute rounded-full shadow-[0_0_18px_rgba(255,231,163,.95)] ${particle.className}`}
          key={index}
          transition={{ delay: particle.delay, duration: 2.8 + index * 0.25, repeat: reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
        />
      ))}

      <DecorativeLeaf className="left-[6%] bottom-[20%] bg-aqua/55" delay={0.2} reducedMotion={reducedMotion} rotate={-16} />
      <DecorativeLeaf className="right-[5%] bottom-[18%] bg-[#a9d9bd]/70" delay={0.8} reducedMotion={reducedMotion} rotate={18} />
      <DecorativeLeaf className="left-[25%] top-[24%] bg-[#a9d9bd]/48" delay={1.2} reducedMotion={reducedMotion} rotate={-28} />
      <DecorativePetal className="right-[14%] top-[28%]" delay={0.5} reducedMotion={reducedMotion} rotate={16} />
      <DecorativePetal className="left-[12%] top-[39%]" delay={1.1} reducedMotion={reducedMotion} rotate={-20} />
      <DecorativePetal className="left-[23%] bottom-[7%]" delay={0.9} reducedMotion={reducedMotion} rotate={74} />

      <span className="absolute right-[17%] top-[19%] text-4xl text-sun/90">✦</span>
      <span className="absolute left-[38%] top-[39%] text-2xl text-sun/80">✦</span>
      <span className="absolute right-[34%] top-[33%] text-xl text-white">✦</span>
      <span className="absolute left-[45%] bottom-[30%] text-lg text-sun">✦</span>
    </div>
  );
}

function DecorativeLeaf({
  className,
  delay,
  reducedMotion,
  rotate,
}: {
  className: string;
  delay: number;
  reducedMotion: boolean;
  rotate: number;
}) {
  return (
    <motion.span
      className={`absolute h-5 w-10 rounded-[100%_0] ${className}`}
      style={{ rotate }}
      animate={reducedMotion ? undefined : { y: [0, -7, 0], rotate: [rotate, rotate + 8, rotate] }}
      transition={{ delay, duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function DecorativePetal({
  className,
  delay,
  reducedMotion,
  rotate,
}: {
  className: string;
  delay: number;
  reducedMotion: boolean;
  rotate: number;
}) {
  return (
    <motion.span
      className={`absolute h-8 w-5 rounded-full rounded-br-sm bg-rose/80 ${className}`}
      style={{ rotate }}
      animate={reducedMotion ? undefined : { x: [0, 6, 0], y: [0, -9, 0], rotate: [rotate, rotate - 10, rotate] }}
      transition={{ delay, duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
