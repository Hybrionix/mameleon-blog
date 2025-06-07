import { getCollection } from 'astro:content';

function getValidDate(date: any): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  return new Date().toISOString().split('T')[0];
}

export async function GET() {
  const basePages = [
    { url: 'https://www.mameleon.com/', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/about', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/blog', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/contact', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/algemene-voorwaarden', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/privacy-verklaring', lastmod: '2025-06-03' },
  ];

  const enPages = [
    { url: 'https://www.mameleon.com/en/', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/about', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/blog', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/contact', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/terms-and-conditions', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/privacy-policy', lastmod: '2025-06-03' },
  ];

  const posts = await getCollection('blog');

  // Build a map of base slugs to their language versions
  const blogMap: Record<string, { nl?: any; en?: any }> = {};
  for (const post of posts) {
    const id = post.id.toLowerCase();
    const slug = post.slug || id.replace(/\.(md|mdx)$/i, '');
    const baseSlug = slug.replace(/\.en$/, '');
    const isEnglish = id.endsWith('.en.md') || id.endsWith('.en.mdx');
    if (!blogMap[baseSlug]) blogMap[baseSlug] = {};
    if (isEnglish) {
      blogMap[baseSlug].en = post;
    } else {
      blogMap[baseSlug].nl = post;
    }
  }

  // Generate blog URLs with hreflang alternates
  const blogPages = Object.entries(blogMap).flatMap(([baseSlug, langs]) => {
    const nlUrl = `https://www.mameleon.com/blog/${baseSlug}/`;
    const enUrl = `https://www.mameleon.com/en/blog/${baseSlug}/`;
    const nlLastmod = langs.nl ? getValidDate(langs.nl.data.updated || langs.nl.data.pubDate) : undefined;
    const enLastmod = langs.en ? getValidDate(langs.en.data.updated || langs.en.data.pubDate) : undefined;

    const alternates = [];
    if (langs.nl) {
      alternates.push({ lang: 'nl', url: nlUrl });
    }
    if (langs.en) {
      alternates.push({ lang: 'en', url: enUrl });
    }

    const urls = [];
    if (langs.nl) {
      urls.push({
        url: nlUrl,
        lastmod: nlLastmod,
        alternates,
      });
    }
    if (langs.en) {
      urls.push({
        url: enUrl,
        lastmod: enLastmod,
        alternates,
      });
    }
    return urls;
  });

  // Combine all pages
  const allPages = [
    ...basePages.map((p) => ({ ...p, alternates: [] })),
    ...enPages.map((p) => ({ ...p, alternates: [] })),
    ...blogPages,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages
  .map(
    (page) => `<url>
  <loc>${page.url}</loc>
  <lastmod>${page.lastmod}</lastmod>
  ${page.alternates
    .map(
      (alt) =>
        `<xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}"/>`
    )
    .join('\n  ')}
</url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
