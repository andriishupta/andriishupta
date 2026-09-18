# Blog authoring

The canonical blog lives at `https://andriishupta.dev/blog`. DEV Community,
Medium, and Hashnode are distribution channels, never canonical sources.

## Create an article

English articles live in `src/content/blog/`; Ukrainian translations live in
`src/content/blog-ua/`.

Name files `YYYY-MM-DD_slug.mdx`, for example:

```text
2026-07-22_migrating-blog-to-subpath.mdx
```

The prefix is the publication date at midnight UTC. It is not part of the route
and replaces `publishedAt` frontmatter.

```mdx
---
title: "How I migrated my blog"
slug: "migrating-blog-to-subpath"
lang: en
translationKey: "migrating-blog-to-subpath"
subtitle: "Optional line below the title"
description: "A concise search and share description under 200 characters."
updatedAt: 2026-07-22
tags:
  - astro
  - seo
topics:
  - UI Development
  - Software Design
cover: "/images/blog/migrating-blog-to-subpath/cover.png"
coverAlt: "A useful description of the cover"
ogImage: "/blog/migrating-blog-to-subpath/og.png"
featured: false
draft: true
distribution:
  devto: "https://dev.to/example/migrating-blog-to-subpath"
  medium: "https://medium.com/@example/migrating-blog-to-subpath"
  hashnode: "https://example.hashnode.dev/migrating-blog-to-subpath"
---

Article content starts here.
```

### Field rules

- `slug` matches the filename and remains stable.
- `lang` is `en` or `uk`.
- Translation pairs share `slug` and `translationKey`. Ukrainian routes use
  `/blog/ua/[slug]`.
- `updatedAt` changes only after a material first-party content edit.
- `featured: true` moves an article above regular posts on the index; each
  group remains ordered by filename date.
- `draft: true` makes the article visible in development only.
- `tags` are article-specific. `topics` come from
  `src/lib/blog-topics.ts`.
- Keep headings text-only except for `## 🔗 Links`.
- Put cross-post URLs in `distribution`, not in the article body.

English represents a translated pair on the blog index. Every published
language version appears in RSS, sitemaps, and `llms.txt`.

Reading time and word count are derived from prose at 220 words per minute.
Code, image syntax, and link destinations are excluded.

## Images

- Put inline media in `public/images/blog/[slug]/`.
- In MDX, use canonical URLs such as
  `https://andriishupta.dev/images/blog/[slug]/image.png`. Development rewrites
  these to local paths, so unpublished images still work locally.
- Use `PhoneScreenshot.astro` for portrait phone captures.
- Add useful alt text to informative images.
- Put the 1200×630 share image in `public/blog/[slug]/og.png` and reference it
  as `/blog/[slug]/og.png`.
- The blog index uses `ogImage` as its card image. Without one, the site falls
  back to `/blog/og.png`.

## Import legacy Hashnode posts

```sh
pnpm blog:import
```

The importer preserves frontmatter, removes duplicated source metadata,
localizes hosted media, and refuses to overwrite a populated body. Use
`pnpm blog:import -- --force [slug]` only for an intentional restore.

`originalReadingMinutes` is allowed only on an empty migration stub and should
be removed once its body is imported.

## Publish

1. Finish the MDX and set `draft: false`.
2. Add or verify the 1200×630 OG image.
3. Run `pnpm blog:verify`.
4. Run `pnpm blog:release-check`.
5. Preview the affected routes when layout changed.
6. Deploy `andriishupta.dev`.
7. Cross-post with the first-party URL as canonical, then save returned URLs in
   `distribution` without changing `updatedAt`.

Complete published articles are discoverable through the blog, RSS, root and
blog sitemaps, and `llms.txt`. Empty stubs remain `noindex` and excluded.

## Legacy blog redirect

`docs/cloudflare-blog-redirect.csv` defines the permanent Cloudflare Bulk
Redirect from `blog.andriishupta.dev` to `andriishupta.dev/blog`, preserving
paths and query strings.

Cloudflare setup:

1. Deploy and verify the destination blog routes.
2. Keep the legacy `blog` DNS record proxied.
3. Import the CSV into a Bulk Redirect list and enable it with a rule.
4. Test HTTP, HTTPS, an article path, and a query string.
5. Keep the redirect indefinitely where practical.

`public/_redirects` handles path redirects on the Pages domain; it cannot
replace the hostname-level Bulk Redirect. The static site does not need a
Worker, Pages Function, server adapter, or runtime database.
