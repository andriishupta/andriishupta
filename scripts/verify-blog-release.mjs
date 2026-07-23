import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const contentDirectory = path.join(repositoryRoot, "src/content/blog");
const distDirectory = path.join(repositoryRoot, "dist");
const failures = [];

const requireText = (source, value, label) => {
  if (!source.includes(value)) {
    failures.push(`${label}: missing ${value}`);
  }
};

const rejectText = (source, value, label) => {
  if (source.includes(value)) {
    failures.push(`${label}: still contains ${value}`);
  }
};

const contentFiles = (await readdir(contentDirectory))
  .filter((file) => /\.(?:md|mdx)$/.test(file))
  .sort();
const posts = [];

for (const file of contentFiles) {
  const source = await readFile(path.join(contentDirectory, file), "utf8");
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!frontmatter) {
    failures.push(`${file}: missing frontmatter`);
    continue;
  }

  const slug = frontmatter[1].match(/^slug:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1];
  const draft = /^draft:\s*true\s*$/m.test(frontmatter[1]);
  const body = source.slice(frontmatter[0].length).trim();

  if (!slug) {
    failures.push(`${file}: missing slug`);
  } else if (!draft && body.length > 0) {
    posts.push(slug);
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
const redirects = await readFile(
  path.join(repositoryRoot, "public/_redirects"),
  "utf8",
);
const bulkRedirectCsv = (
  await readFile(
    path.join(repositoryRoot, "docs/cloudflare-blog-redirect.csv"),
    "utf8",
  )
).trim();

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

for (const slug of posts) {
  const canonicalUrl = `https://andriishupta.dev/blog/${slug}`;
  const articleHtml = await readFile(
    path.join(distDirectory, `blog/${slug}.html`),
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
  requireText(redirects, `/${slug} /blog/${slug} 301`, "Pages redirects");
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
rejectText(redirects, "blog.andriishupta.dev", "Pages redirects");

if (
  bulkRedirectCsv !==
  "blog.andriishupta.dev,https://andriishupta.dev/blog,301,true,false,true,true"
) {
  failures.push("Cloudflare Bulk Redirect CSV does not match the cutover map");
}

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
    `Public blog release verified: ${posts.length} articles, canonical metadata, RSS, sitemaps, llms.txt, and redirect maps`,
  );
}
