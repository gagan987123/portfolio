import { getPosts, getProfile } from '../lib/content.js';

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export function GET() {
  const profile = getProfile();
  const site = (profile.site_url || '').replace(/\/+$/, '');
  const posts = getPosts();
  const description = 'Notes on backends, infrastructure, and running things in the cloud.';

  const items = posts
    .map((post) => {
      const url = `${site}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${toDate(post.data.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.data.excerpt)}</description>
${(post.data.tags || [])
  .map((tag) => `      <category>${escapeXml(tag)}</category>`)
  .join('\n')}
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Writing — ${profile.name}`)}</title>
    <link>${escapeXml(`${site}/blog`)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${(posts[0] ? toDate(posts[0].data.date) : new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${site}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
