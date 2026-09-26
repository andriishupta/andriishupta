# Portfolio authoring

The canonical portfolio lives at `https://andriishupta.dev/portfolio`. A
portfolio item is an MDX content entry with optional PDF media and a card preview
stored in `public/portfolio/`. When a PDF exists, the preview can be rendered
from its first page; for a content-only item, use a standalone cover image.

## Create an item

English items live in `src/content/portfolio/`; Ukrainian translations live in
`src/content/portfolio-ua/`. Use the same date-based filename convention as the
blog:

```text
YYYY-MM-DD_slug.mdx
```

The filename date is the publication date at midnight UTC. It is not part of
the route and must not be duplicated in frontmatter.

```mdx
---
draft: true
featured: false
lang: en
slug: "example-case-study"
title: "Example case study"
subtitle: "A concise summary used for cards and SEO metadata"
ogImage: "/portfolio/previews/example-case-study.png"
preview: "/portfolio/previews/example-case-study.png"
tags:
  - architecture
pdf: "/portfolio/Case Study: Example.pdf"
linkedArticle: "example-article-slug"
---

Start with what was built, why it was built, and what the reader gains from
opening the case study.

## Summary

End with the main improvement or outcome represented by the case study.
```

### Field rules

- Keep frontmatter in this order: `draft`, `featured`, `lang`, `slug`, `title`,
  `subtitle`, `ogImage`, `preview`, `tags`, optional `pdf`, then
  optional `linkedArticle`.
- Always write `draft` and `featured` explicitly. New items start with
  `draft: true`; only the site owner changes them to `draft: false`.
- `featured: true` moves an item above regular items on the portfolio index;
  each group remains ordered by filename date. Featured items show the same
  compact star indicator used by the blog.
- `slug` matches the filename and stays stable. English and Ukrainian
  translations share the same slug.
- `lang` is `en` or `uk`. Ukrainian routes use `/portfolio/ua/[slug]`.
- `ogImage` is required and should be the item-specific portfolio cover used
  for social sharing and structured metadata. The generated first-page preview
  is a suitable default.
- `preview` is the cover image used by portfolio cards. It can be a rendered
  first page when a PDF exists, or a standalone image for a content-only item.
- `pdf` points to the original PDF in `public/portfolio/`. Keep filenames
  stable; spaces are supported.
- `pdf` is optional. If it is omitted, the page renders only the MDX content;
  if it is present, the page can contain both the embedded PDF viewer and MDX
  content. PDF files are checked by `pnpm portfolio:verify`.
- `linkedArticle` is the English blog slug when the case study has a connected
  article. The article must point back with `linkedPortfolio`.
- Portfolio is first-party content only, so it has no `distribution` field.

## Verify and build

```sh
pnpm portfolio:verify
pnpm portfolio:build
```

The verify script checks frontmatter order, dates, language folders, stable
slugs, PDF and preview assets, content bodies, and both directions of blog ↔
portfolio links. The build script runs the verify step, builds the static site,
then checks canonical URLs, portfolio routes, sitemap entries, `llms.txt`, and
direct PDF URLs.
