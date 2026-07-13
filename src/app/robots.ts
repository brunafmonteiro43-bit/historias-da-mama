import { siteUrl } from '@/lib/utils';

export default function robots() {
  return {
    rules: {
      allow: '/',
      disallow: ['/admin', '/hm-admin'],
      userAgent: '*',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
