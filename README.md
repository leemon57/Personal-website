# Hany Jiang Personal Website

Next.js 15 personal site for `hanyjiang.com`.

## Editing Content

Read [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for a full map of where every piece of site information lives.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Gemini Agent

Create a Gemini API key in Google AI Studio, then copy `.env.example` to `.env.local` and set:

```text
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

The homepage portfolio assistant calls `/api/agent`, which uses Gemini on the server. If the key is missing or the API fails, it falls back to the local site index.

The agent treats user input, chat history, and site content as untrusted data. Gemini only receives source documents generated from this site: profile/about facts, contact links, project MDX, and work MDX. Linked GitHub, LinkedIn, and resume pages are treated as links only; their external contents are not indexed. Gemini answers are accepted only when they cite known site sources with exact evidence snippets; otherwise the API returns the deterministic local fallback. Direct attempts to reveal prompts, secrets, or environment variables are guarded before a Gemini request is made.

## Contact Form

The `/contact` page and homepage contact section post to `/api/contact`. The API route sends email through Resend's HTTPS email endpoint.

Set these environment variables locally and in Vercel:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=hanyjiang@gmail.com
CONTACT_FROM_EMAIL="Hany Jiang <onboarding@resend.dev>"
```

For production, replace `CONTACT_FROM_EMAIL` with an address on a verified sending domain, for example `Hany Jiang <contact@hanyjiang.com>`. The sender's email is used as `reply_to`, so replies in Gmail go back to the employer.

## Add a Case Study

Create a new MDX file at:

```text
content/projects/[slug].mdx
```

Use `content/projects/spike.mdx` as the frontmatter example. Formal work experience write-ups go in `content/work/[slug].mdx`.

## Update Profile Facts

Edit:

```text
lib/profile.ts
app/about/page.tsx
```

Use `lib/profile.ts` for facts that appear across the homepage, footer, about page, and agent.

## Resume

Replace `public/resume.pdf` with the final resume PDF before launch.

## Deploy

Deploy on Vercel and set:

```text
NEXT_PUBLIC_SITE_URL=https://hanyjiang.com
```

Every push to the connected production branch can deploy automatically.
