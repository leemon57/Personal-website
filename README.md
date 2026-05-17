# Hany Jiang Personal Website

Next.js 15 personal site for `hanyjiang.com`, built from `plan (4).md`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add a Case Study

Create a new MDX file at:

```text
content/work/[slug].mdx
```

Use `content/work/spike.mdx` as the frontmatter example. Set `featured: true` to show it on the homepage.

## Add a Blog Post

Create a new MDX file at:

```text
content/writing/[slug].mdx
```

Use `content/writing/example-post.mdx` as the frontmatter example. Set `draft: true` to hide a post.

## Update Now and Uses

Edit:

```text
app/now/page.tsx
app/uses/page.tsx
```

These are page shells so Hany can write the prose directly.

## Resume

Replace `public/resume.pdf` with the final resume PDF before launch.

## Deploy

Deploy on Vercel and set:

```text
NEXT_PUBLIC_SITE_URL=https://hanyjiang.com
```

Every push to the connected production branch can deploy automatically.
