# Blog authoring and migration

The canonical blog lives at `https://andriishupta.dev/blog`. Hashnode, DEV
Community, and Medium are distribution channels; their URLs never replace the
first-party canonical URL.

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

Empty stubs are intentionally `noindex` and excluded from RSS and sitemaps.
Adding article body content automatically makes a non-draft post indexable and
adds it to both feeds. This prevents a permanent redirect from replacing a
complete Hashnode page with a thin placeholder in search results.

## Images and sharing

- Put article images in `public/images/blog/` and reference them with absolute
  paths such as `/images/blog/example.png`.
- `cover` is optional and renders directly below the article heading.
- `ogImage` is optional. Without it, the build creates a unique 1200×630 PNG
  from the article title and subtitle at `/blog/[slug]/og.png`.
- Always provide `coverAlt` when a cover conveys information.

## Publishing order

1. Write or import the MDX file.
2. Run `npm run build` and preview the article.
3. Confirm its canonical, OG image, JSON-LD, RSS entry, and sitemap entry.
4. Deploy `andriishupta.dev`.
5. Publish or import copies on DEV Community, Hashnode, and Medium with the
   first-party URL as canonical.
6. Add the returned distribution URLs without changing `updatedAt`.

## Moving the old subdomain

The repository contains a small redirect-only Cloudflare Worker in
`workers/blog-redirect.ts`. It preserves the full path and query string:

```text
blog.andriishupta.dev/article
→ https://andriishupta.dev/blog/article
```

It also maps `/rss.xml` and `/sitemap.xml` to their `/blog/` equivalents. Deploy
it with `npm run deploy:blog-redirect` only after the article bodies have been
imported and the new URLs have passed preview checks. Deploying it earlier would
send search traffic from complete originals to `noindex` migration stubs.

The custom domain/DNS move is an external Cloudflare operation and cannot be
completed by the site build alone. After deployment, verify several redirects
with `curl -I` and submit `https://andriishupta.dev/sitemap.xml` in Search
Console.

Astro rebuilds the static route set during `astro build`; Cloudflare Static
Assets then uploads content-addressed changed assets. The content model does not
require SSR or a runtime database.
