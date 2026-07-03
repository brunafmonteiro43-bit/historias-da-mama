import { BookOpen, Clock, Share2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Story } from '@/types';

type StoryCardProps = {
  story: Story;
};

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="book-card group flex h-full min-w-[270px] flex-col overflow-hidden rounded-[1.6rem] bg-white shadow-soft ring-1 ring-slate-100 transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_70px_rgba(67,56,120,.22)]">
      <div className="relative h-60 overflow-hidden p-5" style={{ background: story.color }}>
        <div className="absolute inset-y-0 left-0 w-7 bg-black/10" />
        <div className="absolute inset-0 opacity-80">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 320 240">
            <path d="M0 170C60 120 110 210 170 154C225 103 270 112 320 78V240H0Z" fill="#fff" opacity="0.38" />
            <path d="M32 46C74 18 120 25 145 70C168 110 211 99 252 48C272 23 301 28 320 43V0H0v67C9 62 19 54 32 46Z" fill="#fff" opacity="0.28" />
          </svg>
        </div>
        <div className="relative flex h-full flex-col justify-between rounded-[1.2rem] border border-white/60 bg-white/45 p-5 backdrop-blur-[1px]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black text-ink">{story.category}</span>
            <Sparkles className="h-5 w-5 text-white drop-shadow" />
          </div>
          <div>
            <BookOpen className="mb-3 h-8 w-8 text-ink/70" />
            <h3 className="max-w-[13rem] text-2xl font-black leading-tight text-ink">{story.title}</h3>
          </div>
        </div>
        <div className="absolute inset-0 rounded-[1.6rem] opacity-0 ring-4 ring-white/50 transition group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{story.ageRange}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
            <Clock className="h-3.5 w-3.5" />
            {story.readingTime}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{story.description}</p>

        <div className="mt-auto flex items-center gap-2">
          <Link
            className="inline-flex flex-1 items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            href={`/historias/${story.slug}`}
          >
            Ler agora
          </Link>
          <button
            aria-label={`Compartilhar ${story.title}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-ink transition hover:bg-sun"
            type="button"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
