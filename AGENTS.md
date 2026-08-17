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
- Keep the homepage header limited to in-page navigation, an icon-labelled Blog
  link, LinkedIn, X, GitHub, Upwork, and the theme control. Email remains a hero
  and footer action rather than header navigation. Reuse the shared social
  profile component in header and footer. Blog links always use `/blog`, never
  the legacy subdomain.
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
  `topics` filters. Topics use the shared AI, Web3, Software Design,
  Consulting, UI Development, API Development, and Mobile Development list;
  their lowercase hyphenated slugs are stable query values such as
  `?topic=software-design`. Articles may belong to multiple topics, including
  topics with no published entries yet.
- Keep blog chrome visually aligned with the homepage: reuse the same shared
  header/footer, Geologica widths and weights, icon sizing, monochrome theme
  control, rounded surfaces, and restrained hover treatment. Article metadata,
  table of contents, and navigation surfaces should remain readable in both
  themes without introducing blog-only chrome.
- Keep the consulting hero as one aligned composition with a left identity and
  right capability rail. Use the page surface as the default in both themes;
  reserve contrast for focused controls and do not repeat the person's name as
  a decorative brand label or add photo placeholders. Keep the capability rail
  and its rows visually open without card borders. Render the visible H1 as two
  explicit block parts: `Andrii Shupta —` and `Software Consultant and
  Developer`. The hero includes the header within a 100svh minimum height and
  vertically centers its body; the next section begins below the initial
  viewport.
- Keep the homepage theme switcher embedded in its header so it participates in
  the mobile layout instead of floating over scrolled content.
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
- Keep shared page chrome and main-page content within the 72rem content measure;
  full-bleed section surfaces may span the viewport, but their inner content
  must align to that measure. Keep article prose narrower for reading.
- Reuse the layout and typography primitives in `global.css`: `site-container`
  for the shared 72rem page chrome and content measure, `content-container` for
  nested 72rem content, and
  `heading-display` for the shared condensed heading treatment. Keep
  route-specific composition in its route stylesheet.
- Treat Tailwind v4's `@theme static` block in `global.css` as the source of truth for
  primitive type, spacing, containers, breakpoints, radii, black/white colors,
  and easing. Keep only theme-aware semantic aliases and component measures in
  `:root`; do not duplicate primitive values in route styles.
- Put reusable site-wide UI rules in `@layer components`. Keep page-specific
  layout in the relevant route stylesheet, and extract a component or shared
  class when the same authored pattern appears three or more times. Reuse
  `SectionHeading.astro`, `FeedbackMessage.astro`, and
  `SocialProfileLinks.astro` for their established patterns.
- Keep `SiteHeader.astro` and `SiteFooter.astro` as the shared page chrome for
  home, blog, and article routes. Align the header to the shared 72rem content
  width. The footer keeps About and Work to the left and a right-positioned,
  16rem-wide Connect column with left-aligned contents on wide screens, with
  copyright in a separate bottom row. Every footer exposes CV,
  LinkedIn, X, GitHub, and Upwork; DEV, Medium, and Hashnode stay in blog headers
  and article distribution metadata. Keep the Blog and RSS footer links paired
  with their established icons. External profile controls in both header and
  footer use the shared corner indicator, while CV opens in a new tab with the
  same corner treatment. External indicators are 12px with a 6px top and 4px
  right inset, and move 2px up-right on hover/focus with reduced-motion support;
  text-only corner links such as CV retain a 44px-high interaction area. The
  footer uses the inverse black/white surface for clear separation from page
  content.
- Keep header navigation links at their natural text height; do not use large
  minimum control heights for inline navigation. Keep equal-width desktop side
  columns around the centered primary navigation. Use the shared Services,
  Proof, Approach, Use cases, and Blog labels consistently between header and
  footer navigation. Homepage card actions use the same bottom-right alignment
  and shared action typography.
- Use the canonical 30rem compact, 48rem mobile, and 64rem tablet thresholds
  documented on `/design-system`. Tablet and smaller use the mobile navigation
  and stacked primary-layout model; desktop compositions start above 64rem.
  Add a route-local breakpoint only when the content measure demonstrably needs
  it, and document the reason beside that media query.
- Keep the shared heading scale authoritative. Do not add route-specific H3
  sizes or character-width limits to compensate for a component layout; let the
  component reflow around the shared type instead.
- Constrain full-width section heading compositions with the shared 48rem
  reading measure so long titles and subtitles stay readable. Do not add
  character-width limits or one-off `max-width` rules to text inside cards,
  service blocks, testimonials, or other already-bounded layouts. Apply reading
  measures to the shared composition container rather than its individual text
  nodes. Accessibility utilities such as `.sr-only` may retain the white-space
  behavior they require.
- Use the documented type and spacing tokens instead of one-off values. Type
  sizes follow a 12/14/16/18/20/24/28/32/36/48px progression, with 16px as the
  body default and 14px reserved for compact navigation/actions. Spacing uses
  the discrete rounded scale documented on `/design-system`; do not introduce
  arbitrary 13px-style values or near-duplicate rem values such as `0.76rem`.
- Compose the homepage as a vertical flex stack. Use `--section-space` between
  sibling sections and `--section-content-gap` between a section heading and
  its content instead of symmetric section padding or collapsed margins. Keep
  padding for actual component surfaces, controls, and mobile overflow safety.
- Keep approach step numbers and titles in one heading row, and keep the
  homepage approach as one centered vertical timeline whose connector stops at
  the final marker. Keep the experience title centered with its LinkedIn action
  in a right-aligned toolbar above a 32rem-wide experience list. The homepage
  renders the first three companies in one centered column without company card
  surfaces.
- Keep `/design-system` as the reference page for shared typography, surfaces,
  controls, tags, spacing, focus states, and theme behavior. It is an internal
  `noindex` test route: do not link it from public chrome or include it in
  sitemaps. Inspect this route when making visual changes, and prefer updating
  tokens and shared primitives there before adding route-specific exceptions.
- Keep the interface simple and system-driven, but let an element's treatment
  communicate its meaning. Social proof should resemble trustworthy source
  messages, article previews should behave like content cards, and ordinary
  informational sections should not become cards by default. Reuse shared
  composition and action patterns instead of duplicating route-specific UI.
- Keep the visual direction creative but restrained: minimal, personal,
  terminal/founder/developer energy, with strong typography and spacing.
- Keep both themes deliberately black and white in `global.css`: light mode
  uses white page surfaces with black text, dark mode uses black surfaces with
  white text. Use gray only for readable secondary text/rules, never as a main
  section background. Preserve the original luminance of author-supplied media;
  do not add theme-specific brightness filters.
- Keep `ThemeSwitcher.astro` compact: show only the selected mode icon, then
  disclose the named System, Light, and Dark choices in its native dropdown.
  Preserve its localStorage, system-theme, and metadata synchronization.
- Keep long-form article prose at the font's normal weight; reserve heavier
  Geologica weights for headings, metadata, and navigation hierarchy.
- Keep visible text links conventionally underlined and strengthen the underline
  on hover/focus. Reserve `text-decoration: none` for structural card links,
  branded home links, and icon-only controls with accessible labels.
- Use animation sparingly. Author client-side motion with GSAP, initialize it in
  the component that owns the animated UI, keep reveals subtle and short, and
  respect `prefers-reduced-motion`. Prefer fades, small directional movement,
  staggered timelines, and restrained hover response over heavy effects.
- Keep service cards fully visible; do not use disclosure controls for the core
  homepage service copy. Service blocks show one title and one description;
  keep their related-work action in normal content flow rather than pushing it
  to the bottom of an equal-height column.
- Present homepage use cases as borderless content blocks rather than cards.
  Keep each related-notes action in the normal flow directly after its
  description; reserve card surfaces for proof, articles, and public code.
- Blog cards may lift slightly on hover, but must stay within the active theme:
  use a subtle raised surface and stronger rule instead of inverting to solid
  black or white.
- Prefer Tailwind utilities for styling where they fit the existing codebase;
  use GSAP for authored client-side animation.
- Use Astro view transitions for internal navigation when they improve flow
  without adding unnecessary complexity.
- Keep the homepage narrative order: consulting hero, services, client proof,
  approach, teammate proof, use cases, public code, and experience. Keep full
  experience at the bottom; do not add a separate projects section unless asked.
- Use short verified client and teammate excerpts as source-labeled message cards;
  keep the proof easy to scan, link each source profile, and avoid a generic
  testimonial wall. Pair up to three public repositories with their first-party
  articles behind them.
- Keep all homepage content sections inside one page-level `main`; `Hero.astro`
  is a labelled `section`, not a second document landmark.
- Run `npm run build` before handing off changes that affect rendering,
  routing, configuration, or dependencies.
- See `docs/blog-authoring.md` for the blog frontmatter schema, publishing flow,
  image conventions, and redirect cutover checklist.
- The repository may contain git changes from the Next.js-to-Astro migration;
  do not restore deleted Next.js, shadcn, Tailwind, or React files unless asked.
- The homepage uses regular native scrolling; do not reintroduce custom
  section-by-section scrolling or CSS scroll snapping.
- Keep the mobile blog menu inside the viewport with a positive right inset on
  narrow phone widths; do not use a negative offset that pushes its fixed-width
  panel beyond the screen, and close it on pointer interaction outside the
  menu.
- Theme and blog details menus close on document clicks outside their own
  controls; Escape closes open disclosure menus, and theme summary toggling is
  explicit so repeated icon clicks are deterministic across browsers.
- For first-load hero animation states, set a pre-paint HTML data attribute in
  `Layout.astro` and style every animated hero panel's initial visual state in
  CSS; do not use layout-changing hiding such as `display: none` or zero height.
- update AGENTS.md when code/approaches changed
