import { notFound } from 'next/navigation';
import { publishedStories } from '@/data/stories';
import { StoryReader } from './story-reader';

export function generateStaticParams() {
  return publishedStories.map((story) => ({ slug: story.slug }));
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = publishedStories.find((item) => item.slug === params.slug);

  if (!story) {
    notFound();
  }

  return <StoryReader story={story} />;
}
