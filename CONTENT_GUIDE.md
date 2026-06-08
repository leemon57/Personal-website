# Content Editing Guide

This site is a Next.js app. Most public-facing information lives in either MDX content files under `content/` or page/component files under `app/` and `components/`.

## Quick Map

| What you want to edit                      | File                             |
| ------------------------------------------ | -------------------------------- |
| Homepage intro and chatbot placement       | `app/page.tsx`                   |
| Chatbot answer logic and suggested prompts | `components/PortfolioAgent.tsx`  |
| Homepage selected work list                | `content/work/*.mdx` frontmatter |
| Work/case study body                       | `content/work/[slug].mdx`        |
| `/now` page                                | `app/now/page.tsx`               |
| `/uses` page                               | `app/uses/page.tsx`              |
| Top navigation                             | `components/Nav.tsx`             |
| Footer links/email/location                | `components/Footer.tsx`          |
| Resume PDF                                 | `public/resume.pdf`              |
| SEO defaults and site metadata             | `app/layout.tsx`                 |
| Per-page SEO metadata                      | Each `app/**/page.tsx` file      |
| Colors, spacing, typography, layout styles | `styles/globals.css`             |
| Sitemap generation                         | `app/sitemap.ts`                 |
| 404 page                                   | `app/not-found.tsx`              |

## Homepage

Edit `app/page.tsx`.

The top text is here:

```tsx
<h1 id="intro-title">Hany Jiang</h1>
<p className="lede">
  I build full-stack systems and data tools. Data Science <span className="muted">@ Waterloo</span>.
</p>
<p className="open">Ask the site about my projects, stack, resume, or Summer 2026 co-op fit.</p>
```

The chatbot component lives in:

```text
components/PortfolioAgent.tsx
```

Edit its `suggestedQuestions` array to change the visible prompt buttons. Edit `answerQuestion()` to add or refine local answers.

The homepage work and chatbot project data are not manually listed in `app/page.tsx`. They pull from `content/work/*.mdx`.

To show or hide a project on the homepage, edit the project frontmatter:

```yaml
featured: true
order: 1
```

`featured: true` shows it. `order` controls the display order.

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

Footer email, GitHub, LinkedIn, resume, and location:

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
- `.agent-card`
- `.proj`
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
/now
/uses
```

## Before Committing

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If all three pass, the content and routes are valid for deployment.
