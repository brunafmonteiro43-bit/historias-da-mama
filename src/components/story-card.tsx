import Link from 'next/link';
import { Clock, Share2 } from 'lucide-react';
import type { Story } from '@/types';

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="book-card group min-w-[270px] overflow-hidden rounded-[2rem] bg-white/85 shadow-soft ring-1 ring-white/70 transition hover:-translate-y-2 dark:bg-slate-900">
      <div className="relative h-44 p-5" style={{ background: story.color }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%)] opacity-70" />
        <div className="relative flex h-full items-center justify-center rounded-3xl bg-white/45 text-6xl">
          📖
        </div>
      </div>

      <div className="space-y-3 p-5">
        <h3 className="font-extrabold leading-tight">{story.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {story.ageRange} • {story.category}
        </p>
        <p className="line-clamp-2 text-sm">{story.description}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {story.readingTime}
          </span>
          <button aria-label={`Compartilhar ${story.title}`} className="rounded-full p-2 hover:bg-slate-100">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <Link
          className="block rounded-full bg-ink px-4 py-3 text-center font-bold text-white dark:bg-white dark:text-ink"
          href={`/historias/${story.slug}`}
        >
          Ler agora
        </Link>
      </div>
    </article>
  );
}
