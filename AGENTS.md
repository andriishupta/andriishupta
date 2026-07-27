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
- `astro.config.mjs` - Astro configuration.
- `wrangler.jsonc` - static Cloudflare Pages configuration without a Worker entry.

## Working Notes

- Prefer Astro components and layouts for new website work.
- Keep the site static unless a feature clearly needs client-side JavaScript.
- Treat SEO as a first-class concern: every page should have a clear title,
  description, canonical path when relevant, and share metadata.
- Blog canonicals always use `andriishupta.dev/blog/[slug]`. Cross-post URLs are
  distribution metadata and do not affect ordering or `updatedAt`.
- The first-party blog is public. Do not add a global visibility flag or
  `noindex` header for `/blog`; complete articles must remain discoverable
  through the homepage, RSS, root and blog sitemaps, and `llms.txt`.
- Keep shared header navigation in `copy.mainPage.header.outerLinks` and
  `innerLinks`. The homepage separates external profiles/resources from the
  internal Blog, CV, and Email group. Blog links always use `/blog`, never the
  legacy subdomain.
- Reuse `SiteLink.astro` for authored UI links that open external URLs; it owns
  safe new-tab behavior and the shared inline/corner external indicator. Reuse
  `LinkIcon.astro` for navigation link icons instead of duplicating icon maps,
  and use `isExternalHref` instead of repeating protocol checks.
- Keep the contact address in `copy.identity.email` and its `mailto:` URL in
  `urls.email`; reuse that shared entry in homepage and blog navigation instead
  of duplicating the address in components.
- Empty migration stubs stay `noindex` and out of RSS/sitemaps until body content
  is imported. Do not enable the blog-subdomain Bulk Redirect before the
  destination articles are complete.
- Recover the seven known Hashnode articles with `pnpm blog:import`. The importer
  preserves frontmatter, localizes article media under
  `public/images/blog/[slug]/`, and refuses to overwrite non-empty bodies unless
  a specific restore is run with `--force`. Run `pnpm blog:verify` after an
  import or material content edit. Run `pnpm blog:release-check` before a public
  merge or deployment.
- Keep blog slugs stable. Article order is derived from `publishedAt`, while
  `updatedAt` is reserved for material changes to first-party content.
- Keep article-specific `tags` separate from the blog index's controlled
  `topics` filters. Topics use the shared AI, Web3, Software Design, UI
  Development, API Development, and Mobile Development list; articles may
  belong to multiple topics.
- Keep blog chrome visually aligned with the homepage: reuse the same Geologica
  widths and weights, icon sizing, monochrome theme control, ruled links, and
  restrained hover treatment instead of blog-only avatar or card motifs.
- Keep hero profile links in two fluid, wrapping groups: external profiles and
  internal links share a row when possible, otherwise the entire internal group
  wraps. External profiles are icon-only with an external indicator, while Blog
  and CV retain visible labels; icon-only links need an accessible name and
  tooltip.
- At widths up to 64rem, the blog list and grid controls intentionally render
  the same single-column cards with their OG images; their layouts diverge only
  on larger desktop viewports.
- Keep blog navigation deliberately minimal: do not render breadcrumb UI or
  `BreadcrumbList` structured data. Article pages use one `Back to blog` link
  above the title; the blog index has no equivalent trail.
- Render valid DEV Community, Medium, and Hashnode distribution links inside
  the article metadata card below publication details, in that order. Hide
  missing links and legacy blog-subdomain URLs; keep the three author platform
  profiles available from the blog header.
- Reuse `PlatformLinks.astro` for the blog header and article distribution
  metadata so their platform order, wordmark treatment, and external indicator
  remain consistent.
- Blog OG images are author-supplied 1200×630 assets referenced by `ogImage`;
  the build must not overwrite them. `pnpm blog:verify` checks their dimensions.
- Keep Cloudflare deployment static on Pages. Do not add an Astro server adapter,
  Pages Functions, or a Wrangler `main` entry unless runtime behavior is requested.
- Keep Astro's static build format set to `file` so Cloudflare Pages serves the
  no-trailing-slash blog canonicals without a directory-index redirect.
- Domain-level redirects such as `blog.andriishupta.dev` use Cloudflare Bulk
  Redirects; `public/_redirects` remains for path redirects on the Pages domain.
  Keep the legacy hostname's DNS record proxied while its permanent redirect is
  required.
- Keep homepage meta descriptions within roughly 110–160 characters; update both
  `public/og-image.svg` and its 1200×630 PNG export when refreshing the share preview.
- Keep shared page chrome and main-page content within the 90rem content measure;
  the homepage hero may retain full-bleed split surfaces, but its inner content
  must align to that measure. Keep article prose narrower for reading.
- Reuse the layout and typography primitives in `global.css`: `site-container`
  for 90rem page chrome, `content-container` for 72rem page content, and
  `heading-display` for the shared condensed heading treatment. Keep
  route-specific composition in its route stylesheet.
- Keep the visual direction creative but restrained: minimal, personal,
  terminal/founder/developer energy, with strong typography and spacing.
- Keep both themes on the achromatic neutral scale in `global.css`: avoid pure
  white/black surfaces, use semantic theme tokens with contrast-forward muted
  text and light surfaces, and reduce bright blog media luminance in dark mode
  without modifying the author-supplied assets.
- Keep `ThemeSwitcher.astro` compact: show only the selected mode icon, then
  disclose the named System, Light, and Dark choices in its native dropdown.
  Preserve its localStorage, system-theme, and metadata synchronization.
- Keep long-form article prose at the font's normal weight; reserve heavier
  Geologica weights for headings, metadata, and navigation hierarchy.
- Keep visible text links conventionally underlined and strengthen the underline
  on hover/focus. Reserve `text-decoration: none` for structural card links,
  branded home links, and icon-only controls with accessible labels.
- Use animation sparingly. Prefer subtle fades, hover response, and small
  ambient motion over heavy parallax, particle systems, or large counters.
- Prefer Tailwind utilities for styling and Motion for client-side animation
  when animation needs JavaScript.
- Use Astro view transitions for internal navigation when they improve flow
  without adding unnecessary complexity.
- Favor one-page content sections for the main site: hero, now, uses, links,
  and blog preview. Do not add a projects section unless asked.
- Keep all homepage content sections inside one page-level `main`; `Hero.astro`
  is a labelled `section`, not a second document landmark.
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
  `Layout.astro` and style every animated hero panel's initial visual state in
  CSS; do not use layout-changing hiding such as `display: none` or zero height.
- update AGENTS.md when code/approaches changed
