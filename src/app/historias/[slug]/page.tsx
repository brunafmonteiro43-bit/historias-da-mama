import { notFound } from 'next/navigation';
import { publishedStories } from '@/data/stories';
import { StoryReader } from './story-reader';

export function generateStaticParams() {
  return publishedStories.map((story) => ({ slug: story.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const story = publishedStories.find((item) => item.slug === params.slug);

  if (!story) {
    return { title: 'História não encontrada' };
  }

  return {
    title: story.title,
    description: story.description,
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const storyIndex = publishedStories.findIndex((item) => item.slug === params.slug);
  const story = publishedStories[storyIndex];

  if (!story) {
    notFound();
  }

  const nextStory = publishedStories[(storyIndex + 1) % publishedStories.length];

  return <StoryReader nextStory={nextStory.slug === story.slug ? undefined : nextStory} story={story} />;
}
