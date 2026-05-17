# Content Editing Guide

This site is a Next.js app. Most public-facing information lives in either MDX content files under `content/` or page/component files under `app/` and `components/`.

## Quick Map

| What you want to edit | File |
| --- | --- |
| Homepage name, headline, open-to line | `app/page.tsx` |
| Homepage selected work list | `content/work/*.mdx` frontmatter |
| Homepage recent writing list | `content/writing/*.mdx` frontmatter |
| Work/case study body | `content/work/[slug].mdx` |
| Blog post body | `content/writing/[slug].mdx` |
| `/now` page | `app/now/page.tsx` |
| `/uses` page | `app/uses/page.tsx` |
| Top navigation | `components/Nav.tsx` |
| Footer links/email/location | `components/Footer.tsx` |
| Resume PDF | `public/resume.pdf` |
| SEO defaults and site metadata | `app/layout.tsx` |
| Per-page SEO metadata | Each `app/**/page.tsx` file |
| Colors, spacing, typography, layout styles | `styles/globals.css` |
| RSS feed output | `app/feed.xml/route.ts` |
| Sitemap generation | `app/sitemap.ts` |
| 404 page | `app/not-found.tsx` |

## Homepage

Edit `app/page.tsx`.

The top text is here:

```tsx
<h1 id="intro-title">Hany Jiang</h1>
<p className="lede">
  I build full-stack systems and data tools. Data Science <span className="muted">@ Waterloo</span>.
</p>
<p className="open">Open to Summer 2026 co-op - SWE, Data, ML.</p>
```

The homepage work section is not manually listed in `app/page.tsx`. It pulls from `content/work/*.mdx`.

To show or hide a project on the homepage, edit the project frontmatter:

```yaml
featured: true
order: 1
```

`featured: true` shows it. `order` controls the display order.

The homepage writing section pulls the newest published posts from `content/writing/*.mdx`.

## Work / Case Studies

Each case study lives in:

```text
content/work/[slug].mdx
```

Current files:

```text
content/work/spike.mdx
content/work/truecost.mdx
content/work/christ-city.mdx
content/work/logbook.mdx
```

Each file starts with frontmatter:

```yaml
---
title: "SPIKE - AI research dashboard"
subtitle: "Short homepage and page subtitle."
slug: "spike"
date: "2025-10-15"
status: "shipped"
role: "Full-stack"
timeline: "Oct 2025 / 36 hrs"
stack: ["React", "Next.js", "Flask", "Postgres", "OpenAI"]
repo: "https://github.com/HanyJiang/spike"
featured: true
order: 1
---
```

Important fields:

- `title`: shown on the work page and project cards.
- `subtitle`: shown under the title and on homepage/work teasers.
- `slug`: must match the filename. `spike.mdx` should use `slug: "spike"`.
- `date`: used for sitemap freshness and sorting fallback.
- `status`, `role`, `timeline`, `stack`, `repo`, `demo`: shown in the metadata strip.
- `featured`: whether it appears on the homepage.
- `order`: homepage/work display order.

To add a new case study:

1. Create `content/work/my-project.mdx`.
2. Set `slug: "my-project"`.
3. Add the frontmatter fields above.
4. Write the body below the frontmatter.
5. Visit `/work/my-project`.

## Writing / Blog Posts

Each writing post lives in:

```text
content/writing/[slug].mdx
```

Current files:

```text
content/writing/spike-etl-pipeline.mdx
content/writing/schema-validation-debugging.mdx
content/writing/offline-first-truecost.mdx
content/writing/rust-cli-distribution.mdx
```

Each file starts with frontmatter:

```yaml
---
title: "Designing SPIKE's ETL pipeline for unstructured publications"
slug: "spike-etl-pipeline"
date: "2026-04-12"
description: "Schema validation, OpenAI structured outputs, and the tradeoffs of pipeline rigidity."
draft: false
---
```

Important fields:

- `title`: shown on the post page and writing lists.
- `slug`: must match the filename.
- `date`: controls reverse-chronological sorting.
- `description`: shown in writing lists and RSS.
- `draft`: set to `true` to hide from indexes, RSS, and static params.

To add a post:

1. Create `content/writing/my-post.mdx`.
2. Set `slug: "my-post"`.
3. Set `draft: false` when ready to publish.
4. Visit `/writing/my-post`.

## Now Page

Edit:

```text
app/now/page.tsx
```

This page is currently hardcoded because it is short and should be updated monthly. Edit the date, location, and the three sections:

- Working on
- Learning
- Reading

## Uses Page

Edit:

```text
app/uses/page.tsx
```

The data is the `sections` array near the top of the file. Each section has a title and key/value rows.

Example:

```tsx
{ title: "Editor", items: [["Neovim", "LazyVim config"], ["VS Code", "MDX and notebooks"]] }
```

## Nav And Footer

Top navigation:

```text
components/Nav.tsx
```

Footer email, GitHub, LinkedIn, resume, RSS, and location:

```text
components/Footer.tsx
```

Replace placeholder URLs there if your GitHub, LinkedIn, or email changes.

## Resume

Replace this file:

```text
public/resume.pdf
```

Keep the same filename unless you also update links in:

```text
components/Nav.tsx
components/Footer.tsx
```

## Metadata And SEO

Global metadata:

```text
app/layout.tsx
```

Homepage metadata:

```text
app/page.tsx
```

Work page metadata:

```text
app/work/[slug]/page.tsx
```

Writing page metadata:

```text
app/writing/[slug]/page.tsx
```

The site URL comes from:

```text
NEXT_PUBLIC_SITE_URL=https://hanyjiang.com
```

Set that in Vercel before deploying production.

## Visual Design

Edit:

```text
styles/globals.css
```

The main tokens are at the top:

```css
--color-paper
--color-ink
--color-accent
--font-newsreader
--font-jetbrains
--width-prose
--width-layout
```

Most page-level styling is class-based in this same file, including:

- `.nav`
- `.footer`
- `.prose`
- `.proj`
- `.post-row`
- `.meta-strip`
- `.diagram`
- `.uses-group`
- `.fourohfour`

## Local Preview

Run:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Useful pages to check after editing:

```text
/
/work/spike
/writing
/writing/spike-etl-pipeline
/now
/uses
/feed.xml
```

## Before Committing

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If all three pass, the content and routes are valid for deployment.
