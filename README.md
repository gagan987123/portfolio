# Portfolio — Gagandeep Singh

Personal portfolio and blog for a backend & cloud engineer. Static site built
with Astro, editable through a local Decap CMS admin, deployed as plain files
behind Caddy.

- **Site:** https://gagandeepsingh.is-a.dev (pending DNS)
- **Stack:** Astro · Decap CMS (local backend) · Caddy · Docker
- **No database, no app server** — the deployed output is static HTML/CSS.

## Quick start

```bash
make install     # install dependencies
make edit        # start Astro + Decap and open site and admin
```

- Site: http://localhost:4321
- Admin: http://localhost:4321/admin/index.html

`make edit` keeps the Dev server in the background and the CMS proxy in the
foreground. Press `Ctrl+C` to stop the CMS, then `make stop` to stop dev.

## Commands

| Command | What it does |
| --- | --- |
| `make edit` | Start site + CMS, open both in the browser |
| `make dev` | Start the site only (`:4321`) |
| `make cms` | Start the Decap proxy only (`:8081`) |
| `make open` | Reopen site + admin |
| `make build` | Build static site into `dist/` |
| `make preview` | Preview the production build |
| `make deploy` | Build + rsync `dist/` to the server |
| `make stop` | Stop dev server and CMS proxy |
| `make clean` | Remove build output |
| `make install` | Install dependencies |
| `make help` | List commands |

## Editing content

1. `make edit`
2. Open the admin, edit **Profile**, **Posts**, or **Projects**, and click **Save**.
3. Check the site at `localhost:4321`.
4. `make deploy` to publish.

Decap runs in **local mode**: saving writes directly to files on disk and does
**not** commit or push to Git. Git is only for history/backup.

### What you can edit (Profile)

- Hero: name, status line, both headline lines, intro paragraph, buttons, résumé
- Header stats, tech strip, portrait photo
- Section labels and titles (Experience, Work, About, Writing, Contact)
- Experience: add/remove roles, dates, location, bullets, tech tags
- About: statement, paragraphs, photo, skill groups
- Contact: title, intro, email, Web3Forms key, social links
- Footer badge and SEO metadata (title, description, share image)

### Adding posts / projects

- **Posts:** title, date, excerpt, cover, tags, draft toggle, Markdown body.
- **Projects:** title, description, tags, link, image, order, optional details.
- Uploads (images, résumé PDF) land in `public/uploads/` and are referenced as
  `/uploads/<file>`.

## Contact form (Web3Forms)

The form posts to [Web3Forms](https://web3forms.com). The access key is read from
the `WEB3FORMS_KEY` environment variable, falling back to the value in
**Profile → Contact**.

```bash
# .env (gitignored)
WEB3FORMS_KEY=your-web3forms-access-key
```

Get a free key at web3forms.com, then restrict **Allowed Domains** to your site
in the Web3Forms dashboard. The key ends up in the built HTML (normal for
client-side forms) but never in the repository.

## Deploy

Static files are built locally and copied to the server with `rsync` — no CI
required.

Add your server details to `.env`:

```bash
DEPLOY_HOST=203.0.113.10
DEPLOY_USER=ubuntu
DEPLOY_PATH=/opt/portfolio/site/
```

Then:

```bash
make deploy
```

On the server, serve `DEPLOY_PATH` with the included Caddy config:

```bash
# /opt/portfolio
docker compose up -d      # uses deploy/docker-compose.yml + deploy/Caddyfile
```

`deploy/.env` (on the server) provides the domain and ACME email:

```bash
DOMAIN=gagandeepsingh.is-a.dev
ACME_EMAIL=you@example.com
```

Caddy obtains and renews TLS automatically. Point the domain's `A` record at the
server IP.

## Project structure

```
content/                 Editable content
├─ profile.json          All page copy, experience, skills, links
├─ posts/*.md            Blog posts (Markdown + frontmatter)
└─ projects/*.md         Project cards

src/                     Site code
├─ Layout.astro          Head, nav, footer
├─ styles.css            Design (cream / ink / burnt orange)
├─ lib/content.js        Content loading + Markdown rendering
└─ pages/
   ├─ index.astro        Home
   ├─ blog/index.astro   Post list
   ├─ blog/[slug].astro  Single post
   ├─ thanks.astro       Contact form success page
   └─ 404.astro

public/
├─ admin/                Decap CMS (index.html + config.yml)
├─ uploads/              Images + résumé
└─ favicon.svg

deploy/                  Caddy + Docker Compose for the server
```

## Notes

- Requires Node.js 22+.
- `make deploy` builds from your local files, so publishing does not require a
  Git push.
- The GitHub Actions workflow was removed because the account's hosted runners
  are billing-locked; deployment is intentionally local.
