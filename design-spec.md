# Design Spec

## Tokens

The implemented token source is `styles/globals.css`.

```css
--color-paper: #fafaf7;
--color-ink: #1a1a1a;
--color-ink-muted: #6b6b6b;
--color-ink-faint: #a3a39e;
--color-rule: #e5e5e0;
--color-accent: #8b2635;
--color-accent-hover: #6e1d2a;
--color-surface: #f2f1eb;
--radius-sm: 4px;
--radius-md: 8px;
--transition-fast: 150ms ease;
--transition-focus: 200ms ease;
```

Fonts: Newsreader for prose and headings, JetBrains Mono for metadata and code.
The site uses only weights 400 and 500.

## Components

Nav: 1024px max container, 32px top/bottom padding, name first, then mono nav links. Links use always-visible underlines except the name mark.

Footer: 1024px max container, 32px padding, 0.5px top border, mono links in a single wrapping row.

ProjectCard: unframed stacked teaser with a bottom rule and 32px bottom padding. Title is 23px Newsreader medium, summary is body size, stack is 15px mono muted, CTA is 15px mono accent.

PostRow: 15px mono ISO date with tabular numerals, title and description in a two-column row from 640px upward. Mobile stacks date above title.

MetadataStrip: 0.5px top and bottom rules, 16px vertical padding, 15px mono labels and values. Two columns on tablet and desktop.

CodeBlock: 8px radius, surface background, rule border, 16px code padding, copy button at top right. Highlighting is rendered server-side.

Figure: rounded 8px screenshot or diagram frame with a 0.5px rule border and mono caption.

Prose: 680px max width, 18px body with 1.7 line-height, 45px h1, 32px h2, 23px h3, visible link underline, surface inline code, bordered blockquotes.

## Layouts

Homepage:

```text
nav

Hany Jiang
positioning line
open-to line

SELECTED WORK
project teaser
project teaser

WRITING
date title description

footer
```

Case study:

```text
nav
title
subtitle
metadata strip
prose MDX
footer
```

Writing index:

```text
nav
Writing
date / title / description rows
footer
```

Post:

```text
nav
title
date / reading time
prose MDX
footer
```

Now and Uses use the same single-column editorial layout with section-label headings.

404 uses a compact stack-trace block and a home link.

## Signature Details

1. ISO-dated writing rows use tabular numerals for fast scanning.
2. 404 is styled as a short stack trace, matching the technical-blog voice.
3. Case-study metadata reads like a build sheet: role, timeline, stack, status, links.

## Responsive Behavior

Mobile starts at 375px and keeps the full site in one column with 24px page padding.
Tablet and desktop use 32px page padding. Content remains 680px max; nav and footer use
1024px max. There are no sidebars or split hero layouts.
