import { publishedStories } from '@/data/stories';
import { siteUrl } from '@/lib/utils';

export default function sitemap() {
  const lastModified = new Date();

  return [
    { lastModified, url: siteUrl },
    { lastModified, url: `${siteUrl}/biblioteca` },
    ...publishedStories.map((story) => ({ lastModified, url: `${siteUrl}/historias/${story.slug}` })),
  ];
}
