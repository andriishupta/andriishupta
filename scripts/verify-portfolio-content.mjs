import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPngValidator,
  getFrontmatterKeys as getKeys,
  getFrontmatterValue as getValue,
  readMarkdownFiles,
  splitFrontmatter,
} from "./lib/content-utils.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const portfolioDirectories = [
  { path: path.join(repositoryRoot, "src/content/portfolio"), lang: "en" },
  { path: path.join(repositoryRoot, "src/content/portfolio-ua"), lang: "uk" },
];
const blogDirectories = [
  path.join(repositoryRoot, "src/content/blog"),
  path.join(repositoryRoot, "src/content/blog-ua"),
];
const publicDirectory = path.join(repositoryRoot, "public");
const canonicalFrontmatterOrder = [
  "draft",
  "featured",
  "lang",
  "slug",
  "title",
  "subtitle",
  "ogImage",
  "preview",
  "tags",
  "pdf",
  "linkedArticle",
];
const requiredFrontmatterKeys = canonicalFrontmatterOrder.filter(
  (key) => !["pdf", "linkedArticle"].includes(key),
);
const failures = [];
const portfolioEntries = [];
const blogSlugs = new Set();
const linkedBlogPortfolio = new Map();

const parseFrontmatter = (source, filePath) => {
  const parsed = splitFrontmatter(source);

  if (!parsed) failures.push(`${filePath}: missing frontmatter`);

  return parsed;
};

const validatePng = createPngValidator({ publicDirectory, failures });

for (const directory of blogDirectories) {
  for (const filePath of await readMarkdownFiles(directory)) {
    const parsed = parseFrontmatter(await readFile(filePath, "utf8"), filePath);
    if (!parsed) continue;

    const slug = getValue(parsed.frontmatter, "slug");
    if (slug) blogSlugs.add(slug);

    const linkedPortfolio = getValue(parsed.frontmatter, "linkedPortfolio");
    if (slug && linkedPortfolio) linkedBlogPortfolio.set(slug, linkedPortfolio);
  }
}

for (const { path: directory, lang: expectedLang } of portfolioDirectories) {
  for (const filePath of await readMarkdownFiles(directory)) {
    const source = await readFile(filePath, "utf8");
    const parsed = parseFrontmatter(source, filePath);
    if (!parsed) continue;

    const { frontmatter, body } = parsed;
    const keys = getKeys(frontmatter);
    const unknownKeys = keys.filter(
      (key) => !canonicalFrontmatterOrder.includes(key),
    );
    const missingKeys = requiredFrontmatterKeys.filter(
      (key) => !keys.includes(key),
    );
    const expectedOrder = canonicalFrontmatterOrder.filter((key) =>
      keys.includes(key),
    );
    const filename = path
      .basename(filePath)
      .match(/^(\d{4}-\d{2}-\d{2})_(.+)\.(?:md|mdx)$/);
    const slug = getValue(frontmatter, "slug");
    const lang = getValue(frontmatter, "lang");
    const pdf = getValue(frontmatter, "pdf");
    const preview = getValue(frontmatter, "preview");
    const ogImage = getValue(frontmatter, "ogImage");
    const linkedArticle = getValue(frontmatter, "linkedArticle");

    if (unknownKeys.length > 0) {
      failures.push(
        `${filePath}: unsupported frontmatter keys ${unknownKeys.join(", ")}`,
      );
    }
    if (missingKeys.length > 0) {
      failures.push(
        `${filePath}: missing frontmatter keys ${missingKeys.join(", ")}`,
      );
    }
    if (keys.join(",") !== expectedOrder.join(",")) {
      failures.push(
        `${filePath}: frontmatter keys must follow ${canonicalFrontmatterOrder.join(" → ")}`,
      );
    }
    if (!filename) {
      failures.push(`${filePath}: expected YYYY-MM-DD_slug filename`);
    } else {
      const [, dateString, filenameSlug] = filename;
      const date = new Date(`${dateString}T00:00:00.000Z`);
      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== dateString
      ) {
        failures.push(
          `${filePath}: invalid UTC publication date ${dateString}`,
        );
      }
      if (slug !== filenameSlug) {
        failures.push(
          `${filePath}: slug must match filename (${filenameSlug})`,
        );
      }
    }
    if (lang !== expectedLang) {
      failures.push(`${filePath}: lang must be ${expectedLang}`);
    }
    if (body.length < 200) {
      failures.push(`${filePath}: body is missing or unexpectedly short`);
    }
    if (/^#\s+/m.test(body)) {
      failures.push(`${filePath}: contains a duplicate level-one heading`);
    }

    for (const imagePath of [ogImage, preview]) {
      if (imagePath) await validatePng(imagePath, filePath);
    }

    if (pdf) {
      try {
        const pdfBuffer = await readFile(
          path.join(publicDirectory, pdf.replace(/^\//, "")),
        );
        if (pdfBuffer.subarray(0, 4).toString() !== "%PDF") {
          failures.push(`${filePath}: ${pdf} is not a valid PDF`);
        }
      } catch {
        failures.push(`${filePath}: missing PDF ${pdf}`);
      }
    }

    if (linkedArticle && !blogSlugs.has(linkedArticle)) {
      failures.push(`${filePath}: linkedArticle does not match a blog slug`);
    }
    if (linkedArticle && linkedBlogPortfolio.get(linkedArticle) !== slug) {
      failures.push(
        `${filePath}: linkedArticle is missing the reverse linkedPortfolio reference`,
      );
    }

    portfolioEntries.push({
      filePath,
      slug,
      lang,
      draft: /^draft:\s*true\s*$/m.test(frontmatter),
    });
  }
}

const groups = new Map();
for (const entry of portfolioEntries) {
  const items = groups.get(entry.slug) ?? [];
  items.push(entry);
  groups.set(entry.slug, items);
}
for (const [slug, entries] of groups) {
  const languages = new Set(entries.map(({ lang }) => lang));
  if (languages.size !== entries.length) {
    failures.push(`${slug}: duplicate portfolio item for the same language`);
  }
  if (
    languages.size > 1 &&
    (languages.size !== 2 || !languages.has("en") || !languages.has("uk"))
  ) {
    failures.push(
      `${slug}: translations must contain exactly one English and one Ukrainian item`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  const published = portfolioEntries.filter(({ draft }) => !draft).length;
  console.log(
    `Portfolio content verified: ${published} published items, frontmatter, assets, dates, and cross-links`,
  );
}
