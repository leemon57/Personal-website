# Content Editing Guide

This site is a Next.js app. Most public-facing information lives under `content/`. Page and component files under `app/` and `components/` should mostly handle rendering and behavior.

## Quick Map

| What you want to edit                      | File                                                  |
| ------------------------------------------ | ----------------------------------------------------- |
| Homepage intro and contact panel copy      | `content/site.json`                                   |
| `/about` page copy, facts, and links       | `content/site.json`                                   |
| `/contact` page and contact form copy      | `content/site.json`                                   |
| Contact form email API                     | `app/api/contact/route.ts` and `.env.example`         |
| Chatbot suggested prompts and intro copy   | `content/site.json`                                   |
| Chatbot answer logic and source facts      | `lib/portfolio-agent.ts` and `app/api/agent/route.ts` |
| Shared profile facts and social links      | `content/site.json`                                   |
| Skillset groups                            | `content/skillset.json`                               |
| Certificates                               | `content/certificates.json`                           |
| Courses, grades, GPA strip, and notes      | `content/courses.json`                                |
| Personal project case studies              | `content/projects/[slug].mdx`                         |
| Work experience case studies               | `content/work/[slug].mdx`                             |
| Top navigation                             | `content/site.json`                                   |
| Footer links/email/location                | `content/site.json`                                   |
| Resume PDF                                 | `public/resume.pdf`                                   |
| SEO defaults and site metadata             | `app/layout.tsx`                                      |
| Per-page SEO metadata                      | `content/site.json`, project/work MDX frontmatter     |
| Colors, spacing, typography, layout styles | `styles/globals.css`                                  |
| Sitemap generation                         | `app/sitemap.ts`                                      |
| 404 page                                   | `app/not-found.tsx`                                   |

## Homepage

Edit homepage copy in:

```text
content/site.json
```

Useful keys:

- `profile`: name, email, social links, school/program, location, seeking term, site URL.
- `navigation`: top navigation links.
- `pages.home`: homepage intro and contact panel copy.
- `assistant`: chatbot visible copy and suggested prompt buttons.
- `contactForm`: reusable contact form labels and feedback messages.

Edit `lib/portfolio-agent.ts` only when you need to change deterministic local answers or intent matching. Edit `app/api/agent/route.ts` only when Gemini needs different grounding documents or safety behavior.

The chatbot project data is not manually listed in `app/page.tsx`. It pulls from `content/projects/*.mdx` and `content/work/*.mdx`.

To show or hide a project in featured lists, edit the project frontmatter:

```yaml
featured: true
order: 1
```

`featured: true` marks it as featured. `order` controls the display order.

## About

Edit about page copy, profile facts, footer links, and structured profile metadata in:

```text
content/site.json
```

Edit skill groups in:

```text
content/skillset.json
```

Edit certificate rows in:

```text
content/certificates.json
```

Certificate fields are `name`, `issuer`, `date`, optional `url`, and optional `credentialId`.

## Courses

Edit coursework in:

```text
content/courses.json
```

The Courses page, portfolio assistant grounding, and page metadata all read from that file through `lib/courses.ts`.

To add a planned course without a confirmed title, use a string:

```json
"courses": ["CS 479", "ENGL 379"]
```

To add a course with a title or grade, use an object:

```json
{
  "code": "CS 480",
  "title": "Introduction to Machine Learning",
  "grade": 91
}
```

For each term, `term` and `courses` are required. `id` is optional; the site derives it from the term name. Use `status: "completed"` for finished terms and `status: "planned"` for future terms. Add `average`, `gpa`, or `coop: true` only when they apply.

## Contact

Edit contact page and contact form display copy in:

```text
content/site.json
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

## Skills And Certificates

Skillset groups are plain JSON:

```json
[
  {
    "area": "Languages",
    "items": ["Python", "C++", "TypeScript"]
  }
]
```

Certificates are plain JSON:

```json
[
  {
    "name": "AWS Certified Cloud Practitioner",
    "issuer": "Amazon Web Services",
    "date": "2025",
    "url": "https://www.credly.com/...",
    "credentialId": "ABC123"
  }
]
```

Leave `content/certificates.json` as `[]` when there are no certificates to show.

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

Top navigation, footer links, email, location, and profile facts are driven by:

```text
content/site.json
```

The footer year is generated automatically from the build date.

## Resume

Replace this file:

```text
public/resume.pdf
```

Keep the same filename unless you also update links in:

```text
content/site.json
```

## Metadata And SEO

Global metadata and site URL fallback:

```text
content/site.json
```

Page metadata for home/about/contact/projects/work:

```text
content/site.json
```

Project and work detail metadata comes from each MDX file's frontmatter.

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
/courses
/contact
```

## Before Committing

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

If all three pass, the content and routes are valid for deployment.
