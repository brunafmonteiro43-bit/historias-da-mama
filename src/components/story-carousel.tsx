'use client';

import { BookOpen, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { Story } from '@/types';

type StoryCarouselProps = {
  stories: Story[];
};

export function StoryCarousel({ stories }: StoryCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    rail.scrollBy({ left: direction * 330, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <button
        aria-label="Histórias anteriores"
        className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-plum shadow-[0_12px_35px_rgba(59,36,107,.16)] ring-1 ring-white/80 transition hover:-translate-y-[54%] hover:text-coral md:grid"
        onClick={() => scrollByCard(-1)}
        type="button"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div
        className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={railRef}
      >
        {stories.map((story) => (
          <Link
            className="group relative min-w-[255px] max-w-[255px] snap-start overflow-hidden rounded-[1.35rem] border border-white/90 bg-white shadow-[0_12px_34px_rgba(59,36,107,.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(59,36,107,.16)] sm:min-w-[300px] sm:max-w-[300px]"
            href={`/historias/${story.slug}/ler`}
            key={story.slug}
          >
            <span className="absolute bottom-0 left-0 top-0 z-10 w-2 bg-gradient-to-b from-white/70 via-plum/10 to-plum/20 opacity-80" aria-hidden="true" />
            <StoryCover story={story} />
            <div className="p-5">
              <span className="inline-flex rounded-full bg-cream px-3 py-1 text-xs font-black text-plum ring-1 ring-sun/35">{story.category}</span>
              <h3 className="mt-3 line-clamp-2 min-h-[3.35rem] text-lg font-black leading-6 text-plum">{story.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-skyPastel/28 px-2.5 py-1">
                  <Users className="h-3.5 w-3.5 text-plum" />
                  {story.ageRange}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose/35 px-2.5 py-1">
                  <Clock className="h-3.5 w-3.5 text-coral" />
                  {story.readingTime}
                </span>
              </div>
              <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-plum px-4 py-3 text-sm font-black text-white shadow-[0_14px_28px_rgba(59,36,107,.18)] transition group-hover:bg-coral">
                <BookOpen className="h-4 w-4" />
                Ler história
              </span>
            </div>
          </Link>
        ))}
      </div>
      <button
        aria-label="Próximas histórias"
        className="absolute -right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white text-plum shadow-[0_12px_35px_rgba(59,36,107,.16)] ring-1 ring-white/80 transition hover:-translate-y-[54%] hover:text-coral md:grid"
        onClick={() => scrollByCard(1)}
        type="button"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

export function StoryCover({ story }: { story: Story }) {
  const slug = story.slug;

  if (story.coverUrl) {
    return (
      <div className="relative h-52 overflow-hidden bg-cream sm:h-56">
        <Image
          alt={`Capa de ${story.title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          height={420}
          sizes="(min-width: 1024px) 300px, 85vw"
          src={story.coverUrl}
          unoptimized
          width={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum/16 via-transparent to-white/8 opacity-70" />
      </div>
    );
  }

  if (slug.includes('pintinho')) {
    return <ChickCover />;
  }

  if (slug.includes('tempo') && !slug.includes('toupeiras')) {
    return <TimeTravelCover />;
  }

  if (slug.includes('meninas-magicas')) {
    return <MagicGirlsCover />;
  }

  if (slug.includes('abelha')) {
    return <BeeCover />;
  }

  if (slug.includes('liberdade')) {
    return <FreedomCover />;
  }

  if (slug.includes('tres-garotas')) {
    return <FlowerCover />;
  }

  if (slug.includes('chapeu')) {
    return <HatCover />;
  }

  if (slug.includes('toupeiras')) {
    return <MoleCover />;
  }

  return <TimeTravelCover />;
}

function CoverFrame({ children, from, to }: { children: React.ReactNode; from: string; to: string }) {
  return (
    <div className="relative h-52 overflow-hidden sm:h-56" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 290 160">
        <path d="M0 118c47-24 74 4 119-23 49-29 87-16 115 5 19 14 35 18 56 7v53H0Z" fill="#fff8ea" opacity=".45" />
        <path d="M0 52c30-23 58-18 79-2 31 23 60 7 84-20 30-33 74-24 127 9V0H0Z" fill="#fff" opacity=".24" />
      </svg>
      <div className="absolute inset-0">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-plum/12 via-transparent to-white/8 opacity-70" />
      <div className="absolute inset-0 opacity-0 ring-4 ring-white/55 transition group-hover:opacity-100" />
    </div>
  );
}

function ChickCover() {
  return (
    <CoverFrame from="#bfeaf5" to="#ffe7a3">
      <Clouds />
      <svg className="absolute inset-x-0 bottom-0 h-28 w-full" viewBox="0 0 290 112">
        <path d="M0 84c42-25 86-14 124-30 58-24 98 9 166-8v66H0Z" fill="#93cf8d" />
        <path d="M0 98c54-18 98 8 152-13 43-16 82 4 138 0v27H0Z" fill="#70b978" />
        <circle cx="129" cy="54" r="30" fill="#ffd768" />
        <circle cx="122" cy="25" r="21" fill="#ffdf7e" />
        <circle cx="115" cy="21" r="3.5" fill="#3b246b" />
        <path d="m133 26 16 6-16 6Z" fill="#f28b3d" />
        <path d="M101 59c-19-8-25 10-22 23 13-6 22-12 28-23Z" fill="#ffc64e" />
        <path d="M144 58c19-7 26 11 21 24-12-7-20-13-27-24Z" fill="#ffc64e" />
        <path d="M119 83v16M140 82v17" stroke="#b86a2e" strokeLinecap="round" strokeWidth="4" />
        <Flowers x={35} y={70} />
        <Flowers x={222} y={64} />
        <Butterfly x={205} y={20} />
      </svg>
    </CoverFrame>
  );
}

function TimeTravelCover() {
  return (
    <CoverFrame from="#27315c" to="#7c4cb0">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <circle cx="145" cy="76" r="49" fill="none" stroke="#ffe7a3" strokeDasharray="9 8" strokeWidth="7" />
        <circle cx="145" cy="76" r="33" fill="#bfeaf5" opacity=".32" />
        <path d="M106 125c31-15 56-15 88 0v17h-88Z" fill="#8d58bf" />
        <path d="M109 73c29-15 54-14 78 0v50c-24-12-50-11-78 0Z" fill="#fff8ea" />
        <path d="M150 73c27-13 52-10 75 2v49c-24-11-48-13-75-1Z" fill="#ffe3bf" />
        <path d="M183 33a33 33 0 1 0 0 66 33 33 0 0 0 0-66Zm0 11v24l17 10" fill="none" stroke="#ffe7a3" strokeLinecap="round" strokeWidth="5" />
        <Stars />
      </svg>
    </CoverFrame>
  );
}

function MagicGirlsCover() {
  return (
    <CoverFrame from="#f9c4d2" to="#b79bef">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <path d="M50 132h184V73l-37-30-39 30-37-47-37 47-34-27Z" fill="#ff9ab8" />
        <path d="m78 76 29-47 28 47Zm78-2 38-48 38 48Z" fill="#7c4cb0" />
        <rect x="132" y="88" width="28" height="44" rx="14" fill="#5d347f" />
        <circle cx="91" cy="105" r="9" fill="#ffe7a3" />
        <circle cx="196" cy="105" r="9" fill="#ffe7a3" />
        <path d="M68 139c34-22 62-15 80 0 25-21 58-21 96 0" stroke="#8fd8cf" strokeLinecap="round" strokeWidth="13" />
        <path d="M217 34 230 9l14 25 26 13-26 14-14 25-13-25-26-14Z" fill="#ffe7a3" />
        <Stars />
      </svg>
    </CoverFrame>
  );
}

function BeeCover() {
  return (
    <CoverFrame from="#fff3bb" to="#8fd8cf">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <path d="M0 119c58-26 93 1 139-21 53-25 93-12 151 11v51H0Z" fill="#7fc983" />
        <ellipse cx="147" cy="72" rx="45" ry="30" fill="#ffd34f" />
        <path d="M126 47v50M148 42v60M170 48v49" stroke="#3b246b" strokeWidth="8" />
        <circle cx="191" cy="70" r="23" fill="#ffd34f" />
        <circle cx="198" cy="64" r="3.5" fill="#3b246b" />
        <path d="M108 57c-22-30-55-12-42 18 14 19 30 4 42-18ZM150 45c8-35 44-33 47-1-5 25-27 19-47 1Z" fill="#e6f8ff" opacity=".8" />
        <path d="M215 69h20" stroke="#3b246b" strokeLinecap="round" strokeWidth="4" />
        <Flowers x={49} y={101} />
        <Flowers x={225} y={99} />
      </svg>
    </CoverFrame>
  );
}

function FreedomCover() {
  return (
    <CoverFrame from="#bfeaf5" to="#fff8ea">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <path d="M0 126c56-31 107-5 151-27 45-23 74-17 139 11v50H0Z" fill="#b9d98f" />
        <path d="M77 67c58-49 91-36 132 1-50-14-77 16-132-1Z" fill="#8a5a2f" />
        <path d="M114 79c43-31 74-23 116 9-49-10-71 16-116-9Z" fill="#b87336" />
        <path d="M126 74c-31 2-51 18-70 44 35-13 64-20 97-16 28 4 57-2 83-23-41 11-72 4-110-5Z" fill="#d19045" />
        <path d="M123 72c21 8 42 10 63 1-20 28-45 37-73 30Z" fill="#fff8ea" />
        <circle cx="178" cy="71" r="5" fill="#3b246b" />
        <path d="m196 77 21 5-20 9" fill="#d68b3a" />
        <Clouds />
      </svg>
    </CoverFrame>
  );
}

function FlowerCover() {
  return (
    <CoverFrame from="#43306f" to="#f36f91">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <circle cx="145" cy="82" r="22" fill="#ffe7a3" />
        <g fill="#ffd6e8">
          <ellipse cx="145" cy="44" rx="16" ry="28" />
          <ellipse cx="145" cy="120" rx="16" ry="28" />
          <ellipse cx="107" cy="82" rx="28" ry="16" />
          <ellipse cx="183" cy="82" rx="28" ry="16" />
        </g>
        <g fill="#ff9ab8">
          <ellipse cx="118" cy="55" rx="14" ry="24" transform="rotate(-45 118 55)" />
          <ellipse cx="172" cy="55" rx="14" ry="24" transform="rotate(45 172 55)" />
          <ellipse cx="118" cy="109" rx="14" ry="24" transform="rotate(45 118 109)" />
          <ellipse cx="172" cy="109" rx="14" ry="24" transform="rotate(-45 172 109)" />
        </g>
        <path d="M145 104c-1 23-15 38-41 45M148 104c16 18 36 24 61 20" stroke="#8fd8cf" strokeLinecap="round" strokeWidth="6" />
        <Stars />
      </svg>
    </CoverFrame>
  );
}

function HatCover() {
  return (
    <CoverFrame from="#b79bef" to="#ffe7a3">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <path d="M77 112c46-18 91-19 137 0 11 5 11 20-1 23-44 13-91 13-137 0-12-3-11-18 1-23Z" fill="#4a2d77" />
        <path d="M105 113c5-52 19-83 45-93 28 14 43 47 47 93-31 11-62 11-92 0Z" fill="#6d3f98" />
        <path d="M110 102c30 12 58 12 84 0" stroke="#f36f91" strokeLinecap="round" strokeWidth="10" />
        <path d="M154 29c4 23-7 38-29 47 34 3 55-10 68-38-12 5-26 2-39-9Z" fill="#8d58bf" />
        <path d="M88 51 99 30l11 21 21 11-21 11-11 21-11-21-21-11Z" fill="#ffe7a3" />
        <path d="M211 26 219 12l8 14 14 8-14 8-8 14-8-14-14-8Z" fill="#fff8ea" />
        <Stars />
      </svg>
    </CoverFrame>
  );
}

function MoleCover() {
  return (
    <CoverFrame from="#8fd8cf" to="#ffe3bf">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
        <path d="M0 111c51-34 93-3 139-24 61-27 97 4 151 12v61H0Z" fill="#85c77e" />
        <ellipse cx="91" cy="113" rx="49" ry="20" fill="#6f4f38" opacity=".45" />
        <circle cx="92" cy="94" r="33" fill="#8a6748" />
        <circle cx="70" cy="77" r="12" fill="#a98463" />
        <circle cx="113" cy="77" r="12" fill="#a98463" />
        <circle cx="81" cy="92" r="3.5" fill="#3b246b" />
        <circle cx="104" cy="92" r="3.5" fill="#3b246b" />
        <ellipse cx="93" cy="103" rx="9" ry="6" fill="#ffd6e8" />
        <rect x="150" y="83" width="78" height="48" rx="8" fill="#9b673f" />
        <path d="M145 83h88v16h-88Z" fill="#c08a53" />
        <path d="M184 79h14v55h-14Z" fill="#ffe7a3" />
        <circle cx="191" cy="104" r="7" fill="#f36f91" />
        <Stars />
      </svg>
    </CoverFrame>
  );
}

function Clouds() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 290 160">
      <path d="M31 43c9-20 36-18 42 3 16-3 30 6 33 22H18c-7-15 1-27 13-25ZM219 36c7-16 29-14 34 2 14-2 25 5 27 18h-75c-5-12 2-21 14-20Z" fill="#fff8ea" opacity=".78" />
    </svg>
  );
}

function Stars() {
  return (
    <g fill="#ffe7a3">
      <path d="M42 27 48 15l7 12 12 7-12 6-7 13-6-13-13-6Z" />
      <path d="M236 116 241 106l5 10 10 5-10 5-5 11-5-11-11-5Z" />
      <circle cx="73" cy="114" r="3" />
      <circle cx="221" cy="35" r="3" />
    </g>
  );
}

function Flowers({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="0" cy="0" r="5" fill="#ffe7a3" />
      <circle cx="-8" cy="0" r="6" fill="#f36f91" />
      <circle cx="8" cy="0" r="6" fill="#f36f91" />
      <circle cx="0" cy="-8" r="6" fill="#ff9ab8" />
      <circle cx="0" cy="8" r="6" fill="#ff9ab8" />
    </g>
  );
}

function Butterfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M13 15C6 2-4 3-1 14c2 7 10 7 14 1Z" fill="#ff8caf" />
      <path d="M17 15C24 2 34 3 31 14c-2 7-10 7-14 1Z" fill="#f36f91" />
      <path d="M15 12v19" stroke="#7c4cb0" strokeLinecap="round" strokeWidth="3" />
    </g>
  );
}
