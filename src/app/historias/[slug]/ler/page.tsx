import { notFound } from 'next/navigation';
import { getPublicStoryBySlug } from '@/lib/public-data';
import { StoryReader } from '../story-reader';

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { story } = await getPublicStoryBySlug(params.slug);

  return {
    title: story ? `Ler ${story.title}` : 'Leitor',
    description: story?.description,
  };
}

export default async function StoryReadPage({ params }: { params: { slug: string } }) {
  const { nextStory, story } = await getPublicStoryBySlug(params.slug);

  if (!story) {
    notFound();
  }

  return <StoryReader nextStory={nextStory?.slug === story.slug ? undefined : nextStory} story={story} />;
}
