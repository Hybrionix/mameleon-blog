import { getCollection } from 'astro:content';

export async function GET() {
  const basePages = [
    { url: 'https://www.mameleon.com/', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/about', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/blog', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/contact', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/algemene-voorwaarden', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/privacy-verklaring', lastmod: '2025-06-03' },
  ];

  // Add English equivalents
  const enPages = [
    { url: 'https://www.mameleon.com/en/', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/about', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/blog', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/contact', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/terms-and-conditions', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/en/privacy-policy', lastmod: '2025-06-03' },
  ];

  // Get all blog posts from the content collection
  const posts = await getCollection('blog');
  const blogPages = posts.flatMap((post) => {
    const slug = post.slug || post.id.replace(/\.(md|mdx)$/i, '').toLowerCase();
    let date = post.data.updated || post.data.pubDate || '2025-06-03';

    // Convert Date objects to ISO 8601 string (YYYY-MM-DD)
    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    }

    // Output both Dutch and English blog URLs
    return [
      {
        url: `https://www.mameleon.com/blog/${slug}/`,
        lastmod: date,
      },
      {
        url: `https://www.mameleon.com/en/blog/${slug}/`,
        lastmod: date,
      },
    ];
  });

  const allPages = [...basePages, ...enPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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
