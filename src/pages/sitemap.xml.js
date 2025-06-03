export async function get() {
  const pages = [
    { url: 'https://www.mameleon.com/', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/about', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/blog', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/contact', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/algemene-voorwaarden', lastmod: '2025-06-03' },
    { url: 'https://www.mameleon.com/privacy-verklaring', lastmod: '2025-06-03' },
    // Add more pages as needed
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `<url>
  <loc>${page.url}</loc>
  <lastmod>${page.lastmod}</lastmod>
</url>`
  )
  .join('\n')}
</urlset>`;
  return {
    body: sitemap,
    headers: {
      'Content-Type': 'application/xml',
    },
  };
}