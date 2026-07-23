# AGENTS.md

## Project Overview

This repository contains the source for the personal website at `andriishupta.dev`.

## Tech Stack

- Astro
- TypeScript-enabled configuration
- Node.js `>=22.12.0`
- pnpm (the lockfile and Git hooks use pnpm; do not run `npm install` here)

## Common Commands

- `npm run dev` - start the local Astro development server.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run astro -- <command>` - run Astro CLI commands.

## Repository Structure

- `src/pages/` - Astro routes. `src/pages/index.astro` is the home page.
- `src/layouts/` - shared page layouts.
- `src/components/` - reusable Astro components.
- `src/content/blog/` - typed Markdown/MDX blog entries.
- `src/lib/blog.ts` - shared blog ordering, URL, date, and reading-stat helpers.
- `public/` - static files served from the site root, including favicons.
- `workers/blog-redirect.ts` - redirect-only Worker for the retired blog subdomain.
- `astro.config.mjs` - Astro configuration.

## Working Notes

- Prefer Astro components and layouts for new website work.
- Keep the site static unless a feature clearly needs client-side JavaScript.
- Treat SEO as a first-class concern: every page should have a clear title,
  description, canonical path when relevant, and share metadata.
- Blog canonicals always use `andriishupta.dev/blog/[slug]`. Cross-post URLs are
  distribution metadata and do not affect ordering or `updatedAt`.
- Empty migration stubs stay `noindex` and out of RSS/sitemaps until body content
  is imported. Do not deploy the blog-subdomain redirect Worker before the
  destination articles are complete.
- Keep blog slugs stable. Article order is derived from `publishedAt`, while
  `updatedAt` is reserved for material changes to first-party content.
- Keep blog chrome visually aligned with the homepage: reuse the same Geologica
  widths and weights, icon sizing, monochrome theme control, ruled links, and
  restrained hover treatment instead of blog-only avatar or card motifs.
- Blog OG images are generated as 1200×630 PNG files at build time unless an
  entry supplies `ogImage`.
- Keep homepage meta descriptions within roughly 110–160 characters; update both
  `public/og-image.svg` and its 1200×630 PNG export when refreshing the share preview.
- Keep the visual direction creative but restrained: minimal, personal,
  terminal/founder/developer energy, with strong typography and spacing.
- Use animation sparingly. Prefer subtle fades, hover response, and small
  ambient motion over heavy parallax, particle systems, or large counters.
- Prefer Tailwind utilities for styling and Motion for client-side animation
  when animation needs JavaScript.
- Use Astro view transitions for internal navigation when they improve flow
  without adding unnecessary complexity.
- Favor one-page content sections for the main site: hero, now, uses, links,
  and blog preview. Do not add a projects section unless asked.
- Run `npm run build` before handing off changes that affect rendering,
  routing, configuration, or dependencies.
- See `docs/blog-authoring.md` for the blog frontmatter schema, publishing flow,
  image conventions, and redirect cutover checklist.
- The repository may contain git changes from the Next.js-to-Astro migration;
  do not restore deleted Next.js, shadcn, Tailwind, or React files unless asked.
- Keep custom section-by-section scrolling limited to fine-pointer desktop
  viewports at least 1024px wide. Tablets, phones, and narrower windows must use
  regular native scrolling without CSS scroll snapping.
- For first-load hero animation states, set a pre-paint HTML data attribute in
  `Layout.astro` and style the initial visual state in CSS; do not use
  layout-changing hiding such as `display: none` or zero height.
- update AGENTS.md when code/approaches changed
