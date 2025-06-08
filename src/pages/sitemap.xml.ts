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
  const blogPages = posts.flatMap((post) => {
    const id = post.id.toLowerCase();
    const slug = post.slug || id.replace(/\.(md|mdx)$/i, '');
    let date = post.data.updated || post.data.pubDate;
    const lastmod = getValidDate(date);

    // English if filename ends with .en.md or .en.mdx
    if (id.endsWith('.en.md') || id.endsWith('.en.mdx')) {
      return [
        {
          url: `https://www.mameleon.com/en/blog/${slug.replace(/\.en$/, '')}/`,
          lastmod,
        },
      ];
    } else {
      // Dutch (default)
      return [
        {
          url: `https://www.mameleon.com/blog/${slug}/`,
          lastmod,
        },
      ];
    }
  });

  const allPages = [...basePages, ...enPages, ...blogPages];

  // Remove duplicate URLs
  const seen = new Set();
  const uniquePages = allPages.filter((page) => {
    if (seen.has(page.url)) return false;
    seen.add(page.url);
    return true;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages
    .map(
      (page) => `<url>
  <loc>${page.url}</loc>
  <lastmod>${page.lastmod}</lastmod>
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
