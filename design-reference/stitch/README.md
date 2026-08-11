# Stitch Design Reference — "Serene Bento Portfolio"

Source: Stitch project **Modern Portfolio Redesign Variant 1** (ID `15406273804441169535`).
Pulled via the Stitch MCP API. These are **design mockups + a written spec** — Stitch did
**not** generate HTML/CSS for these screens (each screen's `htmlCode` was empty), so there is
no importable code. Use the images as visual reference and [DESIGN-PACKAGE.md](DESIGN-PACKAGE.md)
as the system spec.

## Design system (from the package brief)
- **Aesthetic:** high-fidelity minimalist, light mode, bento-grid layout, sidebar nav, subtle grain texture.
- **Typography:** Playfair Display (serif) for headlines; clean sans-serif for body.
- **Color:** Surface `#fbf9f9`, Primary/ink `#121212`, accents in muted sage / gray.
- **Recurring components:** left SideNav (ask / about / projects / work / courses / contact / resume + ⌘K search), sticky footer (`hanyjiang@gmail.com / github / linkedin / resume (pdf)` … `2026 / waterloo, ontario`), floating **Portfolio Assistant** chat panel.

## Screens (image → page)
| # | File | Page |
|---|------|------|
| 1 | [images/screen_1.jpg](images/screen_1.jpg) | **Home / Ask** — hero "Ask the site about my projects…", bento about/experience/education/seeking/projects cards, assistant panel |
| 2 | [images/screen_2.jpg](images/screen_2.jpg) | **Projects** — filter chips (All/Web/ML/Data Science), project cards, Skills Orbit widget |
| 3 | [images/screen_3.jpg](images/screen_3.jpg) | **About + Work** — "Living Bio" with sliders, Now Playing/Reading, interactive experience timeline |
| 4 | [images/screen_4.jpg](images/screen_4.jpg) | **Courses** — relevant courses bento (Data Science / SWE / academic projects / semester status) |
| 6 | [images/screen_6.jpg](images/screen_6.jpg) | **Project case study** — SmartHealth AI hero, challenge, tech stack, gallery carousel, key takeaways |
| 7 | [images/screen_7.jpg](images/screen_7.jpg) | **Photography & Life** — photo grid, reading list, Lo-Fi playlist, blog, "where I've been" map |

*(Screen 5 in the project list is the "Portfolio Design Package" text spec, saved as DESIGN-PACKAGE.md — not an image.)*

## How these were fetched
Stitch MCP tools failed to load in Claude Code (malformed tool schema: unresolved
`#/$defs/ScreenInstance`), so the endpoint was called directly over JSON-RPC:
`list_screens` → `get_screen` (arg: `name: projects/{project}/screens/{screen}`) → `curl -L`
the `screenshot.downloadUrl` (with `=s2048` for full 768×1376 res).
