import { Clock } from 'lucide-react';
import Link from 'next/link';
import { ShareButton } from '@/components/share-button';
import { StoryCover } from '@/components/story-carousel';
import type { Story } from '@/types';

type StoryCardProps = {
  story: Story;
};

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="group flex h-full min-w-[270px] flex-col overflow-hidden rounded-[1.35rem] border border-lilac/15 bg-white shadow-[0_18px_48px_rgba(59,36,107,.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(59,36,107,.16)]">
      <StoryCover story={story} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <span className="inline-flex rounded-full bg-cream px-3 py-1 text-xs font-black text-plum">{story.category}</span>
          <h3 className="mt-3 line-clamp-2 min-h-[3.5rem] font-display text-2xl font-black leading-tight text-plum">{story.title}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-rose/35 px-3 py-1 text-xs font-black text-plum">{story.ageRange}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-skyPastel/55 px-3 py-1 text-xs font-black text-plum">
            <Clock className="h-3.5 w-3.5" />
            {story.readingTime}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{story.description}</p>

        <div className="mt-auto flex items-center gap-2">
          <Link
            className="inline-flex flex-1 items-center justify-center rounded-full bg-plum px-4 py-3 text-sm font-black text-white transition hover:bg-coral focus:outline-none focus:ring-4 focus:ring-lilac/35"
            href={`/historias/${story.slug}/ler`}
          >
            Ler agora
          </Link>
          <ShareButton storySlug={story.slug} storyTitle={story.title} />
        </div>
      </div>
    </article>
  );
}
