'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Story } from '@/types';

type SurpriseStoryButtonProps = {
  stories: Story[];
};

const lastSurpriseKey = 'historias-da-mama:last-surprise-story';

export function SurpriseStoryButton({ stories }: SurpriseStoryButtonProps) {
  const router = useRouter();
  const publishedStories = stories.filter((story) => story.status === 'published');

  function openRandomStory() {
    if (publishedStories.length === 0) {
      router.push('/biblioteca');
      return;
    }

    const lastSlug = typeof window !== 'undefined' ? window.localStorage.getItem(lastSurpriseKey) : null;
    const candidates = publishedStories.length > 1 ? publishedStories.filter((story) => story.slug !== lastSlug) : publishedStories;
    const story = candidates[Math.floor(Math.random() * candidates.length)] ?? publishedStories[0];

    window.localStorage.setItem(lastSurpriseKey, story.slug);
    router.push(`/historias/${story.slug}`);
  }

  return (
    <button
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-coral/25 bg-white/82 px-7 py-3.5 text-base font-black text-plum shadow-[0_12px_30px_rgba(59,36,107,.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-coral hover:bg-white hover:text-coral focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/35"
      onClick={openRandomStory}
      type="button"
    >
      <Sparkles className="h-5 w-5 text-coral transition group-hover:scale-110" />
      Surpreenda-me
    </button>
  );
}
