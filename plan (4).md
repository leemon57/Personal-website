# Personal Website — Build Plan

A complete specification for building hanyjiang.com: an editorial technical-blog portfolio designed for Summer 2026 SWE / Data / MLE co-op recruiting.

---

## 1. Project overview

**Owner:** Hany Jiang
**Domain:** hanyjiang.com (purchase via Cloudflare Registrar)
**Primary goal:** Land Summer 2026 co-op interviews for SWE, Data Engineering, or MLE roles.
**Secondary goal:** Build a long-lived personal website that can host writing and projects through the rest of university and beyond.

### Success criteria

- A recruiter scanning the homepage for 10 seconds understands what I do and what I'm looking for.
- A hiring manager clicking into one case study reads a real piece of engineering writing, not a bullet list.
- Lighthouse 100 on every page, every category.
- Site can be updated with a new blog post or project in under 30 minutes.

### Target audience

- **Primary:** University co-op recruiters and engineering hiring managers at mid-to-large tech companies.
- **Secondary:** Engineers who might link to or share my writing.
- **Tertiary:** Future me, who needs to keep adding to this without rebuilding from scratch.

### Reference sites

- simonwillison.net — content-first, dated, dense
- eugeneyan.com — technical blog with strong essay structure
- maggieappleton.com — visual identity without being noisy
- jsomers.net — long-form essay layout
- tonsky.me — distinctive serif body, monospace details

---

## 2. Positioning and messaging

### Voice

Direct, specific, slightly understated. Engineer's voice, not marketer's. Show, don't claim. Avoid "passionate," "aspiring," "I love," and "Hi 👋".

### Homepage headline

```
Hany Jiang
I build full-stack systems and data tools. Data Science @ Waterloo.
Open to Summer 2026 co-op — SWE, Data, ML.
```

### What this site is NOT

- A resume in HTML
- A logo grid of skills
- A SaaS landing page wearing a person costume
- A place for soft skills, motivational quotes, or "passionate about" copy

---

## 3. Information architecture

```
/                       Homepage
/work/spike             Case study: NASA bioscience research platform
/work/truecost          Case study: offline-first finance app
/work/christ-city       Case study: community data engineering
/work/[new-swe-project] Case study: TBD (build before launch)
/writing                Blog index (reverse chronological)
/writing/[slug]         Individual post
/now                    What I'm working on this month
/uses                   Tools, editor, hardware
/404                    Custom not-found page
/resume.pdf             Static asset, linked in nav and footer
```

No `/about` page. The homepage positioning line replaces it. No `/contact` page — email in the footer is enough.

### Navigation

Top bar (left-aligned, no logo, no center alignment):

```
Hany Jiang        work · writing · now · uses · resume
```

Footer (every page):

```
hanyjiang@gmail.com · github · linkedin · resume (pdf) · rss
```

---

## 4. Page specifications

### 4.1 Homepage (`/`)

**Purpose:** State who I am, what I do, what I'm looking for. Link to deeper content.

**Sections, top to bottom:**

1. **Header / nav** — name on the left, page links on the right
2. **Positioning block** — name (h1), one-line positioning, italicized "open to" intent line
3. **Selected work** — section header (small caps, mono), then 3-4 case study teasers stacked vertically. Each teaser: project title (h3), 2-3 sentence description that leads with what's *interesting*, tech stack as quiet mono line, "read the case study →" link
4. **Writing** — section header, then 3-5 most recent posts as ISO-dated rows
5. **Footer**

**No:** hero blob, avatar circle, skills grid, contact form, animated typing effect, "scroll for more" indicator.

### 4.2 Case study (`/work/[slug]`)

**Purpose:** Convince a hiring manager that I can think about engineering problems, not just list technologies.

**Required sections, in order:**

1. **Title** (h1) and one-line subtitle
2. **Metadata strip** — role, timeline, stack, status (shipped / archived / WIP), links to repo and live demo
3. **The problem** — 1-2 paragraphs. What was I trying to solve? Why was it interesting?
4. **System design** — diagram + explanation of architecture. For SPIKE: ETL flow. For TrueCost: data layer. For Christ City: pipeline + dashboard.
5. **Key technical decisions** — bulleted list of *named* decisions with rationale. E.g. "Drizzle over Prisma: needed sync queries for SQLite, smaller bundle on mobile."
6. **Results / screenshots** — actual images or a live demo embed. Charts if quantitative.
7. **What I'd do differently** — short, honest section. This is the single most senior-coded part of the page.
8. **Footer** with link to repo and to next/previous case study

### 4.3 Writing index (`/writing`)

Reverse-chronological list. Each row: ISO date · title · 1-line description. No pagination needed until 30+ posts.

### 4.4 Writing post (`/writing/[slug]`)

Standard long-form layout. Max width 680px. ISO date and reading time below title. Footnotes supported. Code blocks with syntax highlighting and copy button. RSS feed at `/feed.xml`.

### 4.5 /now

A `/now` page in the [nownownow.com](https://nownownow.com) tradition. Three short sections: working on, learning, reading. Updated monthly. Date of last update at the top.

### 4.6 /uses

Listing of tools, editor config, hardware, services. Organized into headings: Editor, Languages, Frontend, Data/ML, Hardware, Services. Link to dotfiles repo if maintained.

### 4.7 /404

A real 404, not a redirect. Something memorable but not corny. Suggestion: monospace ASCII layout that reads as a stack trace, with a line at the bottom saying "page not found. start over at home."

---

## 5. Design system

### Typography

- **Body / display:** [Newsreader](https://fonts.google.com/specimen/Newsreader) (Google Fonts). Variable font with optical sizing. Body uses 16-opsz, headings use 36-opsz.
- **Monospace:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono). Used for code, metadata, dates, tech stack lines.
- **No third font.** Two-font systems read more intentional than three.
- Self-host both via `next/font/google` for performance and no CLS.

**Type scale (rem, 1rem = 18px):**

| Use | Size | Weight | Line height |
|---|---|---|---|
| h1 | 2.5rem (45px) | 500 | 1.15 |
| h2 | 1.75rem (32px) | 500 | 1.2 |
| h3 | 1.25rem (23px) | 500 | 1.3 |
| Body | 1rem (18px) | 400 | 1.7 |
| Small / meta | 0.8125rem (15px) | 400 | 1.5 |
| Mono | 0.875rem (16px) | 400 | 1.5 |

Two weights only: 400 regular and 500 medium. No 600, no 700, no italic *body* (italic for emphasis is fine).

### Color palette

Warm paper with near-black ink, one accent. Light mode only at v1 (dark mode is a v2 enhancement).

```css
--color-paper: #FAFAF7;        /* page background */
--color-ink: #1A1A1A;          /* primary text */
--color-ink-muted: #6B6B6B;    /* secondary text, metadata */
--color-ink-faint: #A3A39E;    /* tertiary, dates, hints */
--color-rule: #E5E5E0;         /* borders, dividers */
--color-accent: #8B2635;       /* links, hover states (deep oxblood) */
--color-accent-hover: #6E1D2A;
--color-surface: #F2F1EB;      /* code block bg, subtle surfaces */
```

The accent appears only on interactive elements (links, hover states). Body text is never colored. The palette must read as serious-publication, not as portfolio.

### Spacing

4px base unit (Tailwind default). Vertical rhythm uses multiples of 0.25rem. Section spacing: 4rem between major sections, 2rem between sub-sections, 1.5rem between paragraphs.

### Layout

- Max content width: **680px** for prose (articles, case studies, homepage main column).
- Max layout width: **1024px** for nav and footer.
- Side padding: 1.5rem on mobile, 2rem on tablet, scales with breakpoint.
- Single-column on all sizes. No sidebars.

### Motion

- No entrance animations, no parallax, no scroll-triggered reveals, no typing effects.
- Allowed: 150ms ease color transitions on link hover, 200ms transitions on focus rings.
- `prefers-reduced-motion` respected globally.

### Imagery

- Diagrams: hand-authored SVG, monochromatic with at most one accent color. No screenshot-of-Figma exports.
- Screenshots: real product screenshots, slight rounded corner (8px) and 0.5px border, no drop shadows.
- Never use stock photos. Never use generated illustrations.
- All images must have descriptive `alt` text.

### Component spec

- **Link:** underline always visible (0.5px solid currentColor, underline-offset 3px). Color is `--color-accent`. Hover: `--color-accent-hover`. External links get a trailing `↗` glyph.
- **Code block:** `--color-surface` background, `--border-radius-md` (8px) corners, 1rem padding, monospace 0.875rem, syntax highlighting via shiki, copy button top-right.
- **Inline code:** same surface bg, 0.125rem 0.375rem padding, 0.85em font-size.
- **Horizontal rule:** 0.5px solid `--color-rule`, 4rem vertical margin.
- **Blockquote:** 2rem left padding, 2px left border in `--color-rule`, italic body.
- **Section header (small caps):** font-family mono, font-size 0.75rem, letter-spacing 0.1em, text-transform uppercase, color `--color-ink-muted`, margin-bottom 1.5rem.

---

## 6. Content inventory

> **Note on authorship.** All case studies and blog posts on this site must be written by Hany personally — not by an AI agent. Recruiters and engineers can identify AI-written technical content quickly, and it undermines the signal the site is meant to send. The agents in this plan handle design and implementation only. Content is the human's job.

### Where to write the content

Once the frontend agent has scaffolded the site, content lives in these directories as MDX files (markdown with JSX support). Open these files in any editor and write directly:

| Content type | File path | Notes |
|---|---|---|
| Case study: SPIKE | `content/work/spike.mdx` | Write yourself, follow section 4.2 structure |
| Case study: TrueCost | `content/work/truecost.mdx` | Write yourself, follow section 4.2 structure |
| Case study: Christ City | `content/work/christ-city.mdx` | Write yourself, follow section 4.2 structure |
| Case study: new SWE project | `content/work/[your-slug].mdx` | Write yourself, follow section 4.2 structure |
| Blog post: SPIKE ETL | `content/writing/spike-etl-pipeline.mdx` | Write yourself, 600-1200 words |
| Blog post: schema validation | `content/writing/schema-validation-debugging.mdx` | Write yourself, 600-1200 words |
| Blog post: offline-first | `content/writing/offline-first-truecost.mdx` | Write yourself, 600-1200 words |
| /now page | `app/now/page.tsx` or `content/now.mdx` | Write yourself, ~300 words, dated |
| /uses page | `app/uses/page.tsx` or `content/uses.mdx` | Write yourself, organized lists |
| 404 page copy | `app/not-found.tsx` | Write yourself, short and dry |

Each MDX file starts with a frontmatter block (schema in section 8) followed by the body in markdown. The frontend agent will ship one working example file per content type so the format is clear.

### Case studies needed at launch

1. **SPIKE** — flagship. Lead with ETL pipeline architecture.
2. **TrueCost** — second. Lead with offline-first data layer decision.
3. **Christ City** — third. Lead with dashboard data story.
4. **[New SWE project]** — TBD, must be built before launch. See section 9.

### Blog posts needed at launch (minimum 3)

Each 600-1200 words. Plain technical prose, no marketing voice.

1. *Designing SPIKE's ETL pipeline for unstructured publications* — schema validation, OpenAI structured outputs, error handling.
2. *Schema validation as a debugging tool, not a constraint* — general technique post extracted from SPIKE work.
3. *Why offline-first changed how I designed TrueCost's data layer* — ORM choice, sync strategy, latency.

### Writing process recommendation

For each case study, write in this order to avoid blank-page paralysis:

1. **System design section first.** Sketch the architecture on paper. Describe it in prose.
2. **Key technical decisions next.** List 4-6 named decisions; write one paragraph each on why.
3. **What I'd do differently.** Easiest section once 1 and 2 are done.
4. **The problem (intro) last.** It's easier to write the framing after you've written the body.
5. **Results / screenshots** dropped in at the end.

For blog posts: pick one technical decision from a case study and expand the rationale into a standalone piece. Don't start from a blank topic.

### Voice rules for your writing

- Lead with what's *interesting*, not what's impressive. "The interesting part is the ETL" beats "I architected a sophisticated platform."
- Use specific numbers and named technologies. "10 datasets, 15 municipalities" beats "many datasets across multiple regions."
- Name technical decisions and defend them. Admit tradeoffs honestly.
- No "passionate about," "I love," "cutting-edge," "robust," or "leveraging."
- Cut adjectives and adverbs ruthlessly.

---

## 7. Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Already used in SPIKE; industry standard; great static gen + ISR |
| Language | TypeScript 5.x strict | Type safety; signals technical seriousness |
| Styling | Tailwind CSS v4 | Standard; fast; new engine |
| Content | MDX via `@next/mdx` | Markdown + JSX components for case studies and posts |
| Syntax highlighting | shiki | Compile-time, no runtime cost, themeable |
| Fonts | `next/font/google` (self-hosted) | Zero CLS, no third-party request |
| Diagrams | Hand-authored SVG inline | No mermaid; designer-controlled |
| Analytics | Vercel Analytics or Plausible | Privacy-respecting, no cookie banner |
| RSS | Hand-rolled feed route | Full control over output |
| Hosting | Vercel (free tier) | Native Next.js; zero-config deploys |
| Domain registrar | Cloudflare Registrar | At-cost pricing, no upsell |

### Explicitly avoided

- shadcn/ui — too recognizable; everyone uses it
- Framer Motion — no animations needed
- Headless CMS — overkill; MDX in repo is enough
- Vercel Image Optimization — overkill for this volume; static imports are fine

---

## 8. Project structure

```
hanyjiang-site/
├── app/
│   ├── layout.tsx              Root layout with nav, footer, fonts
│   ├── page.tsx                Homepage
│   ├── opengraph-image.tsx     Default OG image
│   ├── icon.tsx                Favicon (dynamic)
│   ├── sitemap.ts              Sitemap generation
│   ├── robots.ts               Robots.txt
│   ├── feed.xml/
│   │   └── route.ts            RSS feed
│   ├── work/
│   │   ├── page.tsx            (Optional) work index
│   │   └── [slug]/
│   │       └── page.tsx        Case study page (loads MDX)
│   ├── writing/
│   │   ├── page.tsx            Blog index
│   │   └── [slug]/
│   │       └── page.tsx        Post page (loads MDX)
│   ├── now/
│   │   └── page.tsx            /now page
│   ├── uses/
│   │   └── page.tsx            /uses page
│   └── not-found.tsx           404 page
├── content/                    ← ALL case studies and blog posts written here by Hany
│   ├── work/
│   │   ├── spike.mdx           ← Author yourself
│   │   ├── truecost.mdx        ← Author yourself
│   │   ├── christ-city.mdx     ← Author yourself
│   │   └── [new-project].mdx   ← Author yourself
│   └── writing/
│       ├── spike-etl-pipeline.mdx              ← Author yourself
│       ├── schema-validation-debugging.mdx     ← Author yourself
│       └── offline-first-truecost.mdx          ← Author yourself
├── components/
│   ├── Nav.tsx                 Top navigation
│   ├── Footer.tsx              Site footer
│   ├── Prose.tsx               MDX wrapper applying typography
│   ├── CodeBlock.tsx           Custom code block with copy
│   ├── ProjectCard.tsx         Homepage case study teaser
│   ├── PostRow.tsx             Writing index row
│   ├── MetadataStrip.tsx       Case study metadata block
│   └── Figure.tsx              Image + caption wrapper
├── lib/
│   ├── content.ts              MDX loading + frontmatter parsing
│   ├── og.tsx                  Dynamic OG image generator
│   └── reading-time.ts         Reading time calculation
├── public/
│   ├── resume.pdf              Hany_Jiang_Resume.pdf, renamed
│   ├── images/
│   │   ├── spike/
│   │   ├── truecost/
│   │   └── christ-city/
│   └── favicon.svg
├── styles/
│   └── globals.css             Tailwind base + CSS variables + prose styles
├── tailwind.config.ts
├── next.config.mjs             MDX plugin config
├── tsconfig.json
├── package.json
└── README.md                   How to run, deploy, add content
```

### MDX frontmatter schema

**Case studies (`content/work/*.mdx`):**

```yaml
---
title: "SPIKE — AI research dashboard"
subtitle: "A full-stack platform for querying 600+ NASA bioscience publications"
slug: "spike"
date: "2025-10-15"
status: "shipped"
role: "Full-stack"
timeline: "Oct 2025 · 36 hours"
stack: ["React", "Next.js", "Flask", "OpenAI API"]
repo: "https://github.com/hany/spike"
demo: "https://spike.example.com"
featured: true
order: 1
---
```

**Blog posts (`content/writing/*.mdx`):**

```yaml
---
title: "Designing SPIKE's ETL pipeline for unstructured publications"
slug: "spike-etl-pipeline"
date: "2026-04-12"
description: "Schema validation, OpenAI structured outputs, and the tradeoffs of pipeline rigidity."
draft: false
---
```

---

## 9. Development milestones

### Pre-work (before any code)

- [ ] Buy `hanyjiang.com` via Cloudflare Registrar
- [ ] Decide on new SWE project to build (see section 9.1)
- [ ] Rename resume PDF to `Hany_Jiang_Resume.pdf`
- [ ] Create GitHub repo `hanyjiang-site`

### Week 1 — Foundation

- [ ] Scaffold Next.js 15 + TypeScript + Tailwind v4 + MDX
- [ ] Implement design system in `globals.css` and Tailwind config
- [ ] Build Nav, Footer, Prose, CodeBlock components
- [ ] Build homepage with placeholder content
- [ ] Deploy to Vercel under `hanyjiang.vercel.app`

### Week 2 — Case study template

- [ ] Build case study page template (`/work/[slug]`)
- [ ] Build MetadataStrip and Figure components
- [ ] Write and ship SPIKE case study end-to-end (gold-standard template) ← *content written by Hany in `content/work/spike.mdx`*
- [ ] Take real screenshots for SPIKE
- [ ] Author SPIKE system architecture SVG diagram

### Week 3 — Remaining case studies and writing

- [ ] Write TrueCost case study ← *Hany, `content/work/truecost.mdx`*
- [ ] Write Christ City case study ← *Hany, `content/work/christ-city.mdx`*
- [ ] Build writing index and post template
- [ ] Write and ship first blog post ← *Hany, `content/writing/spike-etl-pipeline.mdx`*
- [ ] Set up RSS feed

### Week 4 — Polish and launch

- [ ] Write two more blog posts ← *Hany, in `content/writing/`*
- [ ] Build /now and /uses pages, populate content ← *Hany*
- [ ] Build 404 page
- [ ] Implement dynamic OG image generation
- [ ] Configure sitemap and robots.txt
- [ ] Point `hanyjiang.com` DNS to Vercel
- [ ] Audit: Lighthouse, accessibility, broken links, OG previews
- [ ] Submit to Google Search Console

### 9.1 The new SWE project (parallel to weeks 1-3)

Build before launch. Time budget: 30-40 hours. Criteria:

- Demonstrates a skill not already shown by SPIKE/TrueCost/Christ City
- Has a *visible* output (not pure backend)
- Can be honestly described in 3 paragraphs

**Candidate ideas, in order of preference:**

1. **CLI tool in Rust or Go** that does something genuinely useful (e.g. git history visualizer, log analyzer, local-first todo with sync). Publishes to crates.io or as a Homebrew formula.
2. **Browser extension** for a real annoyance you have. Manifest v3, published to Chrome Web Store.
3. **Self-hosted service** with Docker Compose (personal RSS reader, bookmarking tool). Repo includes deployment docs.

---

## 10. Hosting and deployment

### Domain

- Registrar: **Cloudflare Registrar** (at-cost ~$10/year, no upsell).
- DNS: managed via Cloudflare. Use Vercel-recommended A and CNAME records.
- Email: set up `hello@hanyjiang.com` forwarding to personal email via Cloudflare Email Routing (free).

### Hosting

- **Vercel** free tier. Hobby plan is sufficient.
- Connect GitHub repo. Every push to `main` deploys to production. Every PR gets a preview URL.
- Set `NEXT_PUBLIC_SITE_URL` environment variable to `https://hanyjiang.com`.

### Pre-launch checklist

- [ ] All meta tags filled in
- [ ] OG images render correctly on Twitter, LinkedIn, iMessage previews
- [ ] RSS feed validates
- [ ] Sitemap submitted to Search Console
- [ ] No console errors on any page
- [ ] All images have alt text
- [ ] Resume PDF downloads with correct filename
- [ ] `mailto:` link works
- [ ] All external links open in same tab (no `target="_blank"` unless functionally needed)

---

## 11. SEO and metadata

### Per-page metadata (via Next.js `generateMetadata`)

- Title format: `Page title — Hany Jiang` (homepage: just `Hany Jiang — Data + ML + Systems`)
- Description: handcrafted per page, 140-160 characters
- OG image: dynamically generated via `opengraph-image.tsx` (Vercel OG)
- Twitter card: `summary_large_image`
- Canonical URL: always set

### Structured data

- JSON-LD `Person` schema on homepage
- JSON-LD `Article` schema on each blog post

### Sitemap and robots

- `app/sitemap.ts` generates sitemap from MDX content directory at build time
- `app/robots.ts` allows all, points to sitemap

---

## 12. Performance targets

- Lighthouse Performance: **100**
- Lighthouse Accessibility: **100**
- Lighthouse Best Practices: **100**
- Lighthouse SEO: **100**
- LCP: **< 1.2s** (Vercel edge cached)
- CLS: **0**
- INP: **< 100ms**
- Total page weight: **< 100KB** on homepage (excluding images)

### Performance non-negotiables

- No client-side rendering of static content
- No third-party scripts on first load (analytics deferred)
- Fonts self-hosted via `next/font` with `display: swap`
- Images use Next.js `Image` component with explicit width/height
- No CSS-in-JS runtime; Tailwind only

---

## 13. Accessibility requirements

- WCAG AA contrast minimum on all text (verified with axe)
- Semantic HTML: `<article>`, `<nav>`, `<main>`, `<section>` with appropriate labels
- Heading hierarchy: one h1 per page, no skipped levels
- Keyboard navigable: visible focus rings (2px solid accent, 2px offset)
- `prefers-reduced-motion: reduce` disables all transitions
- All interactive elements ≥ 24×24px hit target
- Alt text on every image; decorative images use `alt=""`
- Skip-to-content link at top of every page

---

## 14. Post-launch

### Maintenance rhythm

- **Monthly:** update `/now` page (single most important habit)
- **Quarterly:** new blog post minimum
- **Per project:** new case study when shipped

### What to add in v2 (not v1)

- Dark mode
- Search (Pagefind, static-only)
- Webmentions
- Guestbook
- Newsletter signup (Buttondown)

### What to never add

- Cookie banner
- Marketing pop-ups
- "Subscribe to my newsletter" interrupt modals
- Animated entrance effects
- A chatbot

---

---

# Agent Prompts

Two agents are involved in building this site: a designer and a frontend engineer. Content (case studies, blog posts, /now, /uses) is authored by Hany directly into the files listed in section 6 once the frontend has scaffolded the project.

Run the prompts in order: designer first to produce `design-spec.md`, then frontend implementation. The frontend agent will ship working example MDX files so the authoring format is clear before any writing begins.

---

## Prompt 1: Web designer agent

> **Role:** You are a senior web designer specializing in editorial and technical-publication aesthetics. Your references are Edward Tufte, Robin Rendle, the New Yorker website, Stripe Press, and Are.na — not Awwwards portfolio templates.
>
> **Task:** Produce a complete visual design specification for hanyjiang.com based on the plan.md document. The site is a personal portfolio for a CS/Data Science student targeting SWE/Data/MLE recruiting. The aesthetic direction is "editorial technical blog": warm paper, near-black ink, serif body, monospace for code and metadata, one muted accent color.
>
> **Deliverables:**
>
> 1. **Final design tokens** as a CSS variables file (`tokens.css`). Include color, type scale, spacing scale, border radii, transition timings. Use the values in section 5 of plan.md as the starting point; refine if you can justify the change.
>
> 2. **Component visual specs** as annotated descriptions for each of: Nav, Footer, ProjectCard (homepage teaser), PostRow (writing index row), MetadataStrip (case study), CodeBlock, Figure, Prose styles (h1-h6, paragraph, list, blockquote, hr, table, inline code). For each: default state, hover state, focus state, disabled state if applicable. Specify exact pixel values, not vague language like "small padding."
>
> 3. **Page layout sketches** as ASCII wireframes or low-fidelity HTML for: homepage, case study, writing index, writing post, /now, /uses, 404. Show vertical rhythm and spacing.
>
> 4. **Three signature details** that make the site memorable without being gimmicky. Examples of the right register: a custom 404 stack-trace layout, ISO-dated post rows with tabular numerals, a `console.log` easter egg in DevTools. Examples of the wrong register: cursor trails, mouse-following blobs, parallax scrolling.
>
> 5. **Responsive behavior spec.** Define breakpoints (mobile, tablet, desktop) and what changes at each. The site must work well at 375px wide.
>
> **Constraints:**
>
> - Light mode only at v1.
> - Two font families maximum (Newsreader + JetBrains Mono).
> - Two font weights maximum (400, 500).
> - No gradients, no drop shadows (except 2px focus rings), no glassmorphism, no neon, no animated backgrounds.
> - No imagery beyond user-supplied screenshots and hand-authored SVG diagrams.
> - The accent color (deep oxblood `#8B2635` in plan.md) is provisional — propose 2-3 alternatives if you have a better candidate, with rationale. Each alternative must be a desaturated single color, not a gradient.
>
> **Anti-patterns to actively avoid:** Inter font, generic Tailwind blue, purple-to-pink gradients, "Hi 👋 I'm Hany", logo grid skill section, hero blob, scroll-triggered fade-ins, dark mode at v1, animated typewriter effect, contact form, parallax, generative noise textures.
>
> **Output format:** A single markdown document called `design-spec.md` that the frontend implementation agent can read and execute against.

---

## Prompt 2: Frontend implementation agent

> **Role:** You are a senior frontend engineer building a Next.js 15 personal website from a design spec. You write idiomatic, typed, well-commented code. You read the spec carefully before writing any code, and you ask for clarification rather than guess.
>
> **Inputs you have:**
>
> - `plan.md` — the full project plan (this document)
> - `design-spec.md` — the visual design specification produced by the designer agent
> - The user's resume and project descriptions for reference
>
> **Task:** Scaffold and build the complete Next.js 15 site according to the project structure in section 8 of plan.md. Implement the design system from `design-spec.md`. Wire up MDX loading, RSS, sitemap, OG images, and Vercel deployment configuration.
>
> **Important — do not write site content:** Your job is the frontend, not the writing. Do not draft any case study, blog post, /now, or /uses content. For each content type, ship exactly one example MDX file with realistic frontmatter and a short placeholder body that points the owner to where to write. Example placeholder for `content/work/spike.mdx`:
>
> ```mdx
> ---
> title: "SPIKE — AI research dashboard"
> subtitle: "A full-stack platform for querying 600+ NASA bioscience publications"
> slug: "spike"
> date: "2025-10-15"
> status: "shipped"
> role: "Full-stack"
> timeline: "Oct 2025 · 36 hours"
> stack: ["React", "Next.js", "Flask", "OpenAI API"]
> repo: "https://github.com/hany/spike"
> featured: true
> order: 1
> ---
>
> {/*
>   Write the case study body here.
>
>   Follow the structure from section 4.2 of plan.md:
>     1. The problem  (1-2 paragraphs)
>     2. System design  (diagram + prose)
>     3. Key technical decisions  (bulleted, with rationale)
>     4. Results / screenshots
>     5. What I'd do differently
>
>   Voice rules from section 6: lead with what's interesting,
>   use specific numbers, no marketing words, cut adjectives.
> */}
> ```
>
> Do the same for `content/writing/example-post.mdx` with the writing-post frontmatter shape and a placeholder body comment.
>
> **Technical requirements:**
>
> - Next.js 15 with App Router, React 19, TypeScript 5.x in strict mode (`"strict": true` plus `"noUncheckedIndexedAccess": true`).
> - Tailwind CSS v4 with design tokens defined as CSS variables in `globals.css` and referenced via Tailwind's `@theme` directive.
> - MDX via `@next/mdx` with frontmatter parsing via `gray-matter`. Components passed in via `mdx-components.tsx`.
> - Syntax highlighting via `shiki` (compile-time, no runtime cost). Theme should match the site's accent color.
> - Fonts loaded via `next/font/google` (Newsreader and JetBrains Mono). `display: swap`, preload primary weights.
> - Static generation everywhere except OG image generation. No client-side data fetching.
> - No external state management library. No `use client` unless genuinely needed (only places it might be needed: code block copy button).
>
> **Code quality requirements:**
>
> - Every component file has a 2-4 line header comment explaining its purpose and where it's used.
> - Every non-trivial function has a JSDoc comment explaining what it returns and any non-obvious behavior.
> - Type all props explicitly via interfaces; no `any`, no `Function`, no `object`.
> - Use a `cn()` utility for class merging; do not write `${condition && 'class'}` inline.
> - All MDX content access goes through a single `lib/content.ts` module; no direct `fs` calls in page components.
> - Color values, font sizes, and spacing must reference design tokens. Never hardcode `#1A1A1A` in a component file.
> - File and folder names: kebab-case for directories, PascalCase for components, camelCase for utilities.
> - Lint with ESLint flat config + `@typescript-eslint`. Format with Prettier.
>
> **Comment style:**
>
> Top of each component file:
> ```tsx
> /**
>  * MetadataStrip
>  *
>  * Renders the role / timeline / stack / status / links row at the top of a
>  * case study page, immediately below the title and subtitle.
>  *
>  * Used by: app/work/[slug]/page.tsx
>  */
> ```
>
> Inline comments only where the code is non-obvious. Do not annotate self-explanatory lines. Examples of justified comments: explaining a regex, noting a Next.js quirk, marking a deliberate type assertion.
>
> **Implementation order:**
>
> 1. Scaffold the project, install dependencies, configure TypeScript / Tailwind / MDX.
> 2. Implement design tokens in `globals.css` and Tailwind config.
> 3. Build root layout (`app/layout.tsx`) with fonts, nav, footer.
> 4. Build the Prose component and verify with a test MDX file.
> 5. Build the homepage with hardcoded content (to be replaced by MDX-loaded content where appropriate).
> 6. Build the case study route and template, then the writing route and template. Ship one example MDX file per type with placeholder body and a code comment pointing to plan.md.
> 7. Build /now, /uses, 404 (page shells only — owner writes the prose).
> 8. Implement RSS feed, sitemap, robots.
> 9. Implement OG image generation.
> 10. Run Lighthouse against every page; fix anything below 100.
>
> **Deliverable:** A working, deployable Next.js repository. Final commit message: `Initial site build per plan.md and design-spec.md`. Include a `README.md` documenting:
> - How to run locally
> - How to add a new case study (path to write at: `content/work/[slug].mdx`)
> - How to add a new blog post (path: `content/writing/[slug].mdx`)
> - How to update `/now` and `/uses`
> - How to deploy

---

## Appendix A: Quick reference checklist for launch day

- [ ] Domain registered and pointing to Vercel
- [ ] Site deployed on production
- [ ] All four case studies published *(written by Hany in `content/work/`)*
- [ ] At least three blog posts published *(written by Hany in `content/writing/`)*
- [ ] /now page populated *(written by Hany)*
- [ ] /uses page populated *(written by Hany)*
- [ ] Resume PDF in place with correct filename
- [ ] OG images verified on Twitter, LinkedIn, iMessage
- [ ] RSS feed validates at validator.w3.org/feed
- [ ] Lighthouse 100 on every page
- [ ] axe accessibility scan clean
- [ ] No console errors
- [ ] Search Console verified, sitemap submitted
- [ ] LinkedIn and GitHub bios updated to link to the site
