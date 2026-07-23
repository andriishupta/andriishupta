# Blog authoring and migration

The canonical blog lives at `https://andriishupta.dev/blog`. Hashnode, DEV
Community, and Medium are distribution channels; their URLs never replace the
first-party canonical URL.

## Public release invariants

The first-party blog is public and has no temporary visibility flag:

- Homepage, 404, blog chrome, canonicals, JSON-LD, RSS, sitemaps, and
  `llms.txt` use `https://andriishupta.dev/blog`.
- `/blog` and complete non-draft articles use the default
  `index, follow, max-image-preview:large` robots directive.
- Empty migration stubs remain directly previewable but use `noindex, follow`
  and stay out of RSS and sitemaps until their body exists.
- The root sitemap contains the main site, blog index, and complete articles.
  `/blog/sitemap.xml` remains available as a blog-only sitemap.
- RSS autodiscovery is present on the blog and every article. The header and
  footer link to `/blog/rss.xml`.
- Old apex article paths redirect one-to-one to their canonical `/blog/[slug]`
  path through `public/_redirects`.
- `blog.andriishupta.dev` is a legacy hostname used only as the source of the
  Cloudflare Bulk Redirect and temporary migration metadata.

## Add or finish an article

Create an `.md` or `.mdx` file in `src/content/blog/`. The filename and `slug`
should match. Keep the original slug when migrating an existing article.

```mdx
---
title: "How I migrated my blog"
slug: "migrating-blog-to-subpath"
subtitle: "Optional line shown below the title"
description: "A concise search and share description under 200 characters."
publishedAt: 2026-07-22
updatedAt: 2026-07-22
tags:
  - astro
  - seo
cover: "/images/blog/migrating-blog.png"
coverAlt: "A useful description of the cover image"
ogImage: "/blog/migrating-blog-to-subpath/og.png"
featured: false
draft: false
distribution:
  hashnode: "https://example.hashnode.dev/migrating-blog-to-subpath"
  devto: "https://dev.to/example/migrating-blog-to-subpath"
  medium: "https://medium.com/@example/migrating-blog-to-subpath"
---

Article content starts here.
```

`updatedAt` means the first-party article body changed materially. Adding or
changing a distribution URL does not count as an article update and must not
change `updatedAt`.

Reading time and word count are computed from the first-party body at build
time. `originalReadingMinutes` is only a temporary fallback for an empty
migration stub and should be removed after the content is imported.

The seven known Hashnode originals can be recovered with:

```sh
pnpm blog:import
```

The importer preserves each file's existing frontmatter, removes the duplicate
source H1 and old publication-profile block, downloads Hashnode-hosted images
to `public/images/blog/[slug]/`, and rewrites the Markdown to local paths. It
refuses to replace an article that already has body content; use
`pnpm blog:import -- --force [slug]` only when intentionally restoring a known
article from its source again.

Run `pnpm blog:verify` after importing or editing migrated posts. It checks that
all seven bodies remain populated, code fences are balanced, external links are
present, Hashnode CDN references are gone, and every inline image is a valid,
locally referenced PNG with useful alternative text.

Empty stubs are intentionally `noindex` and excluded from RSS and sitemaps.
Adding article body content makes a non-draft post indexable and adds it to
both sitemaps, RSS, and `llms.txt`.

## Images and sharing

- Put article images in `public/images/blog/[slug]/` and reference them with
  absolute paths such as `/images/blog/example/article-image.png`.
- `cover` is optional and renders directly below the article heading.
- Put each author-designed 1200×630 share image in `public/blog/[slug]/og.png`
  and set the same absolute path in `ogImage`.
- `ogImage` is optional only as a fallback: posts without it use the general
  `/blog/og.png` image. There is no generated-OG build step.
- The blog index uses `ogImage` as the article card thumbnail.
- Always provide `coverAlt` when a cover conveys information.

## Publishing order

1. Write or import every MDX file.
2. Run `pnpm blog:verify`.
3. Run `pnpm blog:release-check`. This rebuilds the static site and verifies
   article bodies, OG dimensions, canonical and robots metadata, RSS entries,
   root and blog sitemaps, `llms.txt`, and both redirect maps.
4. Preview the index and article routes at desktop and mobile widths.
5. Deploy `andriishupta.dev`.
6. Publish or import copies on DEV Community, Hashnode, and Medium with the
   first-party URL as canonical.
7. Add the returned distribution URLs without changing `updatedAt`.

## Moving the old subdomain without a Worker

The site is deployed as a fully static Cloudflare Pages project. Its
`wrangler.jsonc` uses `pages_build_output_dir` and deliberately has no Worker
`main` entry. Astro uses `build.format: "file"` so Cloudflare Pages serves the
no-trailing-slash canonicals directly instead of redirecting them to directory
URLs.

Cloudflare Pages `_redirects` supports path redirects but not domain-level
redirects. The repository includes
`docs/cloudflare-blog-redirect.csv`, which defines one Cloudflare **Bulk
Redirect**:

```text
Source: blog.andriishupta.dev
Target: https://andriishupta.dev/blog
Status: 301
Preserve query string: on
Subpath matching: on
Preserve path suffix: on
Include subdomains: off
```

The source deliberately omits the scheme so the rule matches both HTTP and
HTTPS. With subpath matching and path-suffix preservation:

```text
blog.andriishupta.dev
→ andriishupta.dev/blog

blog.andriishupta.dev/setup-supabase-with-nestjs?source=old
→ andriishupta.dev/blog/setup-supabase-with-nestjs?source=old
```

### Safe Cloudflare cutover order

1. Deploy the release and confirm that `/blog`, every article, RSS, and both
   sitemaps return `200` on `andriishupta.dev`.
2. Keep or create a `blog` DNS record with **Proxy status: Proxied**. A proxied
   CNAME to `andriishupta.dev` is sufficient. Bulk Redirects only run when the
   legacy hostname still reaches Cloudflare.
3. In Cloudflare, open **Bulk redirects**, create a list, and import
   `docs/cloudflare-blog-redirect.csv`. The CSV intentionally has no header.
4. Create a Bulk Redirect Rule for that list and choose **Save and Deploy**.
5. Test the legacy homepage, at least three article paths, HTTP and HTTPS, and a
   URL with a query string.
6. Remove obsolete Hashnode-specific DNS or verification records only after the
   redirect tests pass. Do **not** remove the proxied `blog` traffic record while
   the redirect must keep working.
7. Keep the permanent redirect for at least 180 days; keeping it indefinitely
   is safer for old bookmarks and backlinks.

The temporary `distribution.hashnode` values that still use
`blog.andriishupta.dev` are intentionally not rendered as cross-post links.
Replace them with direct Hashnode publication URLs after the subdomain move.

Cloudflare requires both the redirect list and a rule that enables that list.
The hostname must remain proxied. See Cloudflare's
[Bulk Redirect dashboard guide](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/create-dashboard/),
[redirect parameters](https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/parameters/),
and [Pages redirect limits](https://developers.cloudflare.com/pages/configuration/redirects/).

### Verification commands

```sh
curl -I https://andriishupta.dev/blog
curl -I https://andriishupta.dev/blog/setup-supabase-with-nestjs
curl -I https://andriishupta.dev/blog/rss.xml
curl -I https://andriishupta.dev/sitemap.xml
curl -I https://andriishupta.dev/blog/sitemap.xml
curl -I "https://blog.andriishupta.dev/setup-supabase-with-nestjs?source=old"
```

The first five must return `200`. The legacy URL must return one `301` whose
`Location` is the matching `/blog/...` URL with the query string preserved.

## Google Search Console re-indexing

Do this after the production deploy and Cloudflare redirect are both live:

1. Verify ownership of the `blog.andriishupta.dev` source property and the
   `andriishupta.dev` destination property with the same Google account. Keep
   the verification records in place during the move.
2. In the destination property, submit
   `https://andriishupta.dev/sitemap.xml`. It contains the blog index and every
   complete article; `/blog/sitemap.xml` is optional because those URLs are
   already present in the root sitemap.
3. Use **URL Inspection** on `/blog` and all seven article URLs. Run **Test live
   URL**, confirm indexing is allowed and the user-declared canonical matches,
   then choose **Request indexing**.
4. Open **Change of Address** in the verified
   `blog.andriishupta.dev` property and select
   `https://andriishupta.dev/blog/` as the destination. Google supports moving
   a domain or subdomain to a path, but only after the permanent redirects are
   live.
5. Monitor Page indexing, crawl errors, canonical selection, impressions, and
   clicks in both properties. Expect the old property to fall while the new
   `/blog` URLs rise.
6. Do not use the Removals tool for the old articles; permanent one-to-one
   redirects transfer signals and let Google replace them naturally.

Google recommends self-referencing canonicals, updated internal links, a new
sitemap, and server-side permanent redirects for URL-changing moves. See the
[site-move guide](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes),
[Change of Address documentation](https://support.google.com/webmasters/answer/9370220),
and [URL Inspection guide](https://support.google.com/webmasters/answer/12482179).

Astro rebuilds the static route set during `astro build`; Cloudflare Pages then
uploads the `dist` directory. The content model does not require SSR, Pages
Functions, a Worker entry point, or a runtime database.
