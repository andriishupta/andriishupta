import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createAssertions,
  readMarkdownFiles,
  splitFrontmatter,
} from "./lib/content-utils.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const contentDirectory = path.join(repositoryRoot, "src/content/blog");
const ukrainianContentDirectory = path.join(
  repositoryRoot,
  "src/content/blog-ua",
);
const distDirectory = path.join(repositoryRoot, "dist");
const failures = [];

const { requireText, rejectText } = createAssertions(failures);

const posts = [];

for (const { directory, fallbackLang } of [
  { directory: contentDirectory, fallbackLang: "en" },
  { directory: ukrainianContentDirectory, fallbackLang: "uk" },
]) {
  const contentFiles = (await readMarkdownFiles(directory)).sort();

  for (const filePath of contentFiles) {
    const file = path.basename(filePath);
    const source = await readFile(filePath, "utf8");
    const parsed = splitFrontmatter(source);

    if (!parsed) {
      failures.push(`${file}: missing frontmatter`);
      continue;
    }

    const { frontmatter, body } = parsed;
    const slug = frontmatter.match(/^slug:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
    const filename = file.match(/^(\d{4}-\d{2}-\d{2})_(.+)\.(?:md|mdx)$/);
    const lang =
      frontmatter.match(/^lang:\s*([a-z]+)\s*$/m)?.[1] ?? fallbackLang;
    const draft = /^draft:\s*true\s*$/m.test(frontmatter);

    if (!slug) {
      failures.push(`${file}: missing slug`);
    }

    if (!filename) {
      failures.push(`${file}: expected YYYY-MM-DD_slug filename`);
    } else {
      const [, dateString, filenameSlug] = filename;
      const date = new Date(`${dateString}T00:00:00.000Z`);

      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== dateString
      ) {
        failures.push(`${file}: invalid UTC publication date ${dateString}`);
      }

      if (slug && filenameSlug !== slug) {
        failures.push(`${file}: filename slug must match ${slug}`);
      }
    }

    if (/^publishedAt:/m.test(frontmatter)) {
      failures.push(`${file}: obsolete publishedAt frontmatter`);
    }

    if (slug && !draft && body.length > 0) {
      posts.push({ slug, lang });
    }
  }
}

const blogIndex = await readFile(path.join(distDirectory, "blog.html"), "utf8");
const rootSitemap = await readFile(
  path.join(distDirectory, "sitemap.xml"),
  "utf8",
);
const blogSitemap = await readFile(
  path.join(distDirectory, "blog/sitemap.xml"),
  "utf8",
);
const rss = await readFile(path.join(distDirectory, "blog/rss.xml"), "utf8");
const llms = await readFile(path.join(distDirectory, "llms.txt"), "utf8");

requireText(
  blogIndex,
  '<link rel="canonical" href="https://andriishupta.dev/blog">',
  "blog index",
);
requireText(blogIndex, 'name="robots" content="index, follow', "blog index");
requireText(blogIndex, 'type="application/rss+xml"', "blog index");
requireText(
  rootSitemap,
  "<loc>https://andriishupta.dev/blog</loc>",
  "root sitemap",
);
requireText(
  blogSitemap,
  "<loc>https://andriishupta.dev/blog</loc>",
  "blog sitemap",
);
requireText(llms, "[Blog](https://andriishupta.dev/blog)", "llms.txt");
requireText(rss, 'xmlns:atom="http://www.w3.org/2005/Atom"', "RSS");
requireText(rss, 'href="https://andriishupta.dev/blog/rss.xml"', "RSS");

for (const post of posts) {
  const { slug, lang } = post;
  const routePath = lang === "uk" ? `/blog/ua/${slug}` : `/blog/${slug}`;
  const canonicalUrl = `https://andriishupta.dev${routePath}`;
  const distPath = routePath.replace(/^\//, "").concat(".html");
  const articleHtml = await readFile(
    path.join(distDirectory, distPath),
    "utf8",
  );

  requireText(
    articleHtml,
    `<link rel="canonical" href="${canonicalUrl}">`,
    slug,
  );
  requireText(articleHtml, 'name="robots" content="index, follow', slug);
  requireText(rootSitemap, `<loc>${canonicalUrl}</loc>`, "root sitemap");
  requireText(blogSitemap, `<loc>${canonicalUrl}</loc>`, "blog sitemap");
  requireText(rss, `<link>${canonicalUrl}</link>`, "RSS");
  requireText(llms, `](${canonicalUrl})`, "llms.txt");
  rejectText(articleHtml, "blog.andriishupta.dev", slug);
}

const rssItemCount = rss.match(/<item>/g)?.length ?? 0;

if (rssItemCount !== posts.length) {
  failures.push(`RSS: expected ${posts.length} items, found ${rssItemCount}`);
}

rejectText(rootSitemap, "blog.andriishupta.dev", "root sitemap");
rejectText(blogSitemap, "blog.andriishupta.dev", "blog sitemap");
rejectText(rss, "blog.andriishupta.dev", "RSS");
rejectText(llms, "blog.andriishupta.dev", "llms.txt");

try {
  await access(path.join(repositoryRoot, "public/_headers"));
  failures.push("public/_headers still exists with staged noindex rules");
} catch {
  // The public release must not ship the staged noindex header file.
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Public blog release verified: ${posts.length} articles, canonical metadata, RSS, sitemaps, and llms.txt`,
  );
}
