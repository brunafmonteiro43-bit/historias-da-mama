import { getPublicStories } from '@/lib/public-data';
import { siteUrl } from '@/lib/utils';

export default async function sitemap() {
  const lastModified = new Date();
  const stories = await getPublicStories();

  return [
    { lastModified, url: siteUrl },
    { lastModified, url: `${siteUrl}/biblioteca` },
    { lastModified, url: `${siteUrl}/enviar-historia` },
    ...stories.flatMap((story) => [
      { lastModified, url: `${siteUrl}/historias/${story.slug}` },
      { lastModified, url: `${siteUrl}/historias/${story.slug}/ler` },
    ]),
  ];
}
