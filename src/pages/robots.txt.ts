import { getProfile } from '../lib/content.js';

export function GET() {
  const profile = getProfile();
  const site = (profile.site_url || '').replace(/\/+$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /thanks',
    'Disallow: /404',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
