import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const root = process.cwd();

export function getProfile() {
  const dir = path.join(root, 'content', 'site');
  if (!fs.existsSync(dir)) {
    const raw = fs.readFileSync(path.join(root, 'content', 'profile.json'), 'utf8');
    return JSON.parse(raw);
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .reduce((profile, file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      return { ...profile, ...JSON.parse(raw) };
    }, {});
}

function readCollection(dir) {
  const full = path.join(root, 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.md$/, ''), data, body: content };
    });
}

export function getPosts() {
  return readCollection('posts')
    .filter((post) => !post.data.draft)
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

export function getPost(slug) {
  return getPosts().find((post) => post.slug === slug);
}

export function categorySlug(value) {
  return (
    String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'uncategorized'
  );
}

export function getCategories() {
  const categories = new Map();
  for (const post of getPosts()) {
    const name = String(post.data.category || 'Uncategorized').trim() || 'Uncategorized';
    const slug = categorySlug(name);
    const date = new Date(post.data.date);
    const latest = Number.isNaN(date.getTime()) ? null : date;
    const existing = categories.get(slug);
    if (existing) {
      existing.count += 1;
      if (latest && (!existing.latest || latest > existing.latest)) existing.latest = latest;
    } else {
      categories.set(slug, { name, slug, count: 1, latest });
    }
  }
  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPostsByCategory(slug) {
  return getPosts().filter(
    (post) => categorySlug(post.data.category || 'Uncategorized') === slug,
  );
}

export function getProjects() {
  return readCollection('projects').sort(
    (a, b) => (Number(a.data.order) || 999) - (Number(b.data.order) || 999)
  );
}

export function mediaUrl(file) {
  if (!file) return null;
  if (/^https?:\/\//.test(file)) return file;
  if (file.startsWith('/')) return file;
  return `/uploads/${file}`;
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonth(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function renderMarkdown(markdown) {
  const html = marked.parse(markdown || '');
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'del']),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      code: ['class'],
      span: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
