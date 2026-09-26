import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createAssertions,
  extractFrontmatter,
  getFrontmatterValue as getValue,
  readMarkdownFiles,
} from "./lib/content-utils.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const distDirectory = path.join(repositoryRoot, "dist");
const contentDirectory = path.join(repositoryRoot, "src/content/portfolio");
const siteOrigin = "https://andriishupta.dev";
const failures = [];

const { requireText } = createAssertions(failures);

const contentFiles = (await readMarkdownFiles(contentDirectory)).sort();
const items = [];

for (const filePath of contentFiles) {
  const frontmatter = extractFrontmatter(await readFile(filePath, "utf8"));
  const draft = /^draft:\s*true\s*$/m.test(frontmatter);
  const slug = getValue(frontmatter, "slug");
  if (slug && !draft) items.push({ slug, pdf: getValue(frontmatter, "pdf") });
}

const portfolioIndex = await readFile(
  path.join(distDirectory, "portfolio.html"),
  "utf8",
);
const rootSitemap = await readFile(
  path.join(distDirectory, "sitemap.xml"),
  "utf8",
);
const llms = await readFile(path.join(distDirectory, "llms.txt"), "utf8");

requireText(
  portfolioIndex,
  '<link rel="canonical" href="https://andriishupta.dev/portfolio">',
  "portfolio index",
);
requireText(
  portfolioIndex,
  'name="robots" content="index, follow',
  "portfolio index",
);
requireText(
  rootSitemap,
  "<loc>https://andriishupta.dev/portfolio</loc>",
  "root sitemap",
);
requireText(
  llms,
  "[Portfolio](https://andriishupta.dev/portfolio)",
  "llms.txt",
);

for (const { slug, pdf } of items) {
  const canonicalUrl = `${siteOrigin}/portfolio/${slug}`;
  const articleHtml = await readFile(
    path.join(distDirectory, `portfolio/${slug}.html`),
    "utf8",
  );
  requireText(
    articleHtml,
    `<link rel="canonical" href="${canonicalUrl}">`,
    slug,
  );
  requireText(rootSitemap, `<loc>${canonicalUrl}</loc>`, "root sitemap");
  requireText(llms, `](${canonicalUrl})`, "llms.txt");
  if (pdf)
    requireText(
      rootSitemap,
      `<loc>${siteOrigin}${pdf.replaceAll(" ", "%20")}</loc>`,
      "root sitemap",
    );
}

const locs = [...rootSitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, loc]) => loc,
);
const duplicateLocs = [
  ...new Set(locs.filter((loc, index) => locs.indexOf(loc) !== index)),
];
if (duplicateLocs.length > 0)
  failures.push(`root sitemap: duplicate URLs ${duplicateLocs.join(", ")}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Public portfolio release verified: ${items.length} items, canonical metadata, sitemap, llms.txt, and PDF links`,
  );
}
