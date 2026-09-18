# AGENTS.md

## Project

Personal website and first-party blog for `andriishupta.dev`.

- Astro, TypeScript, Node.js `>=22.12.0`
- pnpm lockfile and hooks; do not run `npm install`
- Static Cloudflare Pages deployment; no Worker or server adapter

## Commands

- `npm run dev` — local Astro server
- `npm run build` — production build
- `npm run check` — read-only Biome checks
- `pnpm blog:verify` — validate article content and images
- `pnpm blog:release-check` — complete pre-release blog check

Run `npm run build` after changes to rendering, routes, configuration, or
dependencies. Keep pre-commit checks read-only and fast.

## Structure

- `src/pages/` — routes
- `src/layouts/` — page layouts
- `src/components/` — reusable Astro components
- `src/content/blog/` — English articles
- `src/content/blog-ua/` — Ukrainian articles
- `src/lib/blog.ts` — blog dates, ordering, URLs, and reading stats
- `public/images/blog/[slug]/` — article media
- `public/blog/[slug]/og.png` — article share images
- `docs/blog-authoring.md` — content schema and publishing workflow

## Engineering principles

- Prefer small, explicit Astro components and pure helpers.
- Keep the site static and avoid client JavaScript unless interaction requires it.
- Reuse shared components and tokens before adding route-specific alternatives.
- Keep shared styles in `global.css` and route composition in route stylesheets.
- Use Tailwind v4 theme tokens; avoid one-off near-duplicate values.
- Preserve existing user changes and do not restore removed migration-era code.
- Update this file only when a durable project convention changes.

## Content and SEO

- Canonical blog URLs are `https://andriishupta.dev/blog/[slug]`.
- Source files use `YYYY-MM-DD_slug.mdx`; the prefix is the publication date
  at midnight UTC. Do not add duplicate `publishedAt` frontmatter.
- Slugs are stable and match filenames. Filename dates never affect routes.
- Drafts appear in development and stay out of production pages, feeds,
  sitemaps, and `llms.txt`.
- English represents a translation pair on the blog index. RSS, sitemaps, and
  `llms.txt` include every published language version.
- `featured: true` affects only blog-index ordering. Featured and regular groups
  are each sorted newest first.
- `updatedAt` means a material first-party content change, not a distribution
  URL update.
- Keep `tags` article-specific and `topics` limited to the shared allowlist.
- Keep new headings free of decorative emoji; use `## 🔗 Links` for links.
- Reading time uses prose at 220 words per minute and excludes code, images,
  and link destinations.
- Inline images use canonical `https://andriishupta.dev/images/blog/...` URLs.
  Development rewrites first-party URLs to local paths for unpublished assets.
- OG images are author-supplied 1200×630 files and must not be overwritten.
- Use `PhoneScreenshot.astro` for portrait phone captures.
- Mermaid diagrams render client-side with the `mermaid` package.

## Site behavior

- Keep SEO metadata, self-referencing canonicals, and share metadata complete.
- Reuse `SiteHeader.astro`, `SiteFooter.astro`, `SiteLink.astro`,
  `LinkIcon.astro`, `PlatformLinks.astro`, and shared identity data.
- The blog archive is always a responsive grid: three columns on desktop, two
  on tablet, and one on mobile. Do not restore a list/grid switcher.
- Featured cards use the compact icon-only star badge.
- Article pages have one `Back to blog` link and no breadcrumb UI or schema.
- Distribution links render in this order: DEV Community, Medium, Hashnode.
- Keep external links safe, visibly identifiable, and keyboard accessible.
- Menus close on outside interaction and Escape and remain inside the viewport.

## Design system

- The public visual direction is minimal, personal, monochrome, and typographic.
- Both themes use black and white as primary surfaces; gray is secondary only.
- Shared chrome and main content use the 72rem measure; prose stays narrower.
- Canonical breakpoints are 30rem, 48rem, and 64rem.
- Use the shared type and spacing scales documented on `/design-system`.
- Keep visible text links underlined; exempt structural cards and icon controls.
- Use restrained GSAP motion and respect `prefers-reduced-motion`.
- `/design-system` is an internal `noindex` route and is not public navigation.

## Homepage

- Keep the narrative order: hero, services, technology, client proof, approach,
  teammate proof, use cases, public code, experience.
- Keep one page-level `main`; the hero is a labelled section.
- Keep the header focused on site navigation, Blog, core social profiles, and
  theme control. Email belongs in the hero and footer.
- Use ordinary native scrolling.
- Treat cards as meaningful content surfaces, not the default container.

## Deployment and licensing

- Keep Astro output static with `build.format: "file"`.
- Use `public/_redirects` for Pages path redirects.
- Use the Cloudflare Bulk Redirect in
  `docs/cloudflare-blog-redirect.csv` for the legacy blog hostname and keep its
  DNS record proxied while the redirect is active.
- Original code and content are CC BY-NC-ND 4.0 unless stated otherwise.
  Preserve third-party licenses; `README.md`, `LICENSE`, and `CITATION.cff`
  define attribution.
