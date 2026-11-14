import { getCategories, getPosts, getProfile } from '../lib/content.js';

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const isoDay = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
};

export function GET() {
  const profile = getProfile();
  const site = (profile.site_url || '').replace(/\/+$/, '');
  const posts = getPosts();
  const categories = getCategories();
  const latest = posts[0] ? isoDay(posts[0].data.date) : isoDay(new Date());

  const urls = [
    { loc: `${site}/`, lastmod: latest, changefreq: 'monthly', priority: '1.0' },
    { loc: `${site}/blog`, lastmod: latest, changefreq: 'weekly', priority: '0.8' },
    ...categories.map((category) => ({
      loc: `${site}/blog/category/${category.slug}`,
      lastmod: category.latest ? isoDay(category.latest) : latest,
      changefreq: 'monthly',
      priority: '0.6',
    })),
    ...posts.map((post) => ({
      loc: `${site}/blog/${post.slug}`,
      lastmod: isoDay(post.data.date),
      changefreq: 'yearly',
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
