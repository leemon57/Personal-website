# Content Editing Guide

This site is a Next.js app. Most public-facing information lives in either MDX content files under `content/` or page/component files under `app/` and `components/`.

## Quick Map

| What you want to edit                      | File                                                  |
| ------------------------------------------ | ----------------------------------------------------- |
| Homepage intro and chatbot placement       | `app/page.tsx`                                        |
| `/about` page                              | `app/about/page.tsx`                                  |
| `/contact` page and contact form           | `app/contact/page.tsx` and `components/ContactForm.tsx` |
| Contact form email API                     | `app/api/contact/route.ts` and `.env.example`         |
| Chatbot suggested prompts                  | `components/PortfolioAgent.tsx`                       |
| Chatbot answer logic and source facts      | `lib/portfolio-agent.ts` and `app/api/agent/route.ts` |
| Shared profile facts                       | `lib/profile.ts`                                      |
| Personal project case studies              | `content/projects/[slug].mdx`                         |
| Work experience case studies               | `content/work/[slug].mdx`                             |
| Top navigation                             | `components/Nav.tsx`                                  |
| Footer links/email/location                | `components/Footer.tsx`                               |
| Resume PDF                                 | `public/resume.pdf`                                   |
| SEO defaults and site metadata             | `app/layout.tsx`                                      |
| Per-page SEO metadata                      | Each `app/**/page.tsx` file                           |
| Colors, spacing, typography, layout styles | `styles/globals.css`                                  |
| Sitemap generation                         | `app/sitemap.ts`                                      |
| 404 page                                   | `app/not-found.tsx`                                   |

## Homepage

Edit `app/page.tsx`.

The top text is here:

```tsx
<h1 id="intro-title">Hany Jiang</h1>
<p className="lede">
  I build full-stack systems and data tools. Data Science <span className="muted">@ Waterloo</span>.
</p>
<p className="open">Ask the site about my projects, stack, resume, or Winter 2027 co-op fit.</p>
```

The chatbot component lives in:

```text
components/PortfolioAgent.tsx
```

Edit its `suggestedQuestions` array to change the visible prompt buttons. Edit `lib/portfolio-agent.ts` to add or refine deterministic local answers, and update `app/api/agent/route.ts` when Gemini needs new source documents to cite.

The chatbot project data is not manually listed in `app/page.tsx`. It pulls from `content/projects/*.mdx` and `content/work/*.mdx`.

To show or hide a project in featured lists, edit the project frontmatter:

```yaml
featured: true
order: 1
```

`featured: true` marks it as featured. `order` controls the display order.

## About

Edit shared profile facts in:

```text
lib/profile.ts
```

The `/about` page lives in:

```text
app/about/page.tsx
```

## Contact

The contact page lives in:

```text
app/contact/page.tsx
```

The reusable form component lives in:

```text
components/ContactForm.tsx
```

The server route that sends email lives in:

```text
app/api/contact/route.ts
```

Email delivery uses Resend. Configure these variables in `.env.local` and Vercel:

```text
RESEND_API_KEY
CONTACT_TO_EMAIL
CONTACT_FROM_EMAIL
```

## Work / Case Studies

Personal project case studies live in:

```text
content/projects/[slug].mdx
```

Formal work-experience write-ups live in:

```text
content/work/[slug].mdx
```

Current files:

```text
content/projects/spike.mdx
content/projects/tickermate.mdx
content/projects/truecost.mdx
content/projects/starrail-script.mdx
```

Each file starts with frontmatter:

```yaml
---
title: "SPIKE - AI research dashboard"
subtitle: "Short homepage and page subtitle."
slug: "spike"
category: "personal project"
date: "2025-10-15"
status: "shipped"
role: "Full-stack"
timeline: "Oct 2025 / 36 hrs"
stack: ["React", "Next.js", "Flask", "Postgres", "OpenAI"]
repo: "https://github.com/leemon57/your-project-repo"
featured: true
order: 1
---
```

Important fields:

- `title`: shown on the work page and project cards.
- `subtitle`: shown under the title and on homepage/work teasers.
- `slug`: must match the filename. `spike.mdx` should use `slug: "spike"`.
- `category`: use `"personal project"` for `content/projects` and `"work experience"` for `content/work`.
- `date`: used for sitemap freshness and sorting fallback.
- `status`, `role`, `timeline`, `stack`, `repo`, `demo`: shown in the metadata strip.
- `featured`: whether it appears on the homepage.
- `order`: homepage/work display order.

To add a new case study:

1. Create `content/projects/my-project.mdx` for a personal project, or `content/work/my-role.mdx` for work experience.
2. Set `slug: "my-project"`.
3. Add the frontmatter fields above.
4. Write the body below the frontmatter.
5. Visit `/projects/my-project` for personal projects or `/work/my-role` for work experience.

## Nav And Footer

Top navigation:

```text
components/Nav.tsx
```

Footer email, GitHub, LinkedIn, resume, and location are driven by:

```text
lib/profile.ts
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
app/projects/[slug]/page.tsx
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
/projects/spike
/about
/projects
/work
```

## Before Committing

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If all three pass, the content and routes are valid for deployment.
