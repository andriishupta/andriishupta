import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createPngValidator,
  getFrontmatterKeys,
  splitFrontmatter,
} from "./lib/content-utils.mjs";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const contentDirectory = path.join(repositoryRoot, "src/content/blog");
const ukrainianContentDirectory = path.join(
  repositoryRoot,
  "src/content/blog-ua",
);
const portfolioContentDirectory = path.join(
  repositoryRoot,
  "src/content/portfolio",
);
const publicDirectory = path.join(repositoryRoot, "public");
const articleImageDirectory = path.join(publicDirectory, "images/blog");
const siteOrigin = "https://andriishupta.dev";
const toPublicPath = (imageUrl) => imageUrl.replace(siteOrigin, "");
const articles = [
  "connect-polkadot-to-a-nextjs-website-with-polkadotextension-dapp",
  "simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen",
  "create-lens-subgraph-on-the-graph-protocol",
  "generate-dummy-data-in-strapi",
  "setup-supabase-with-nestjs",
  "cross-origin-iframe-communication-with-window-post-message",
  "starting-my-web3-journey",
];
const miykoSlug =
  "miyko-turning-shared-grocery-shopping-into-a-durable-ai-workflow";
const findArticlePath = async (directory, slug) => {
  const file = (await readdir(directory)).find(
    (entry) => entry === `${slug}.mdx` || entry.endsWith(`_${slug}.mdx`),
  );

  if (!file) {
    throw new Error(`Missing article file for ${slug}`);
  }

  return path.join(directory, file);
};
const localizedArticles = [
  {
    filePath: await findArticlePath(contentDirectory, miykoSlug),
    lang: "en",
  },
  {
    filePath: await findArticlePath(ukrainianContentDirectory, miykoSlug),
    lang: "uk",
  },
];
const portfolioSlugs = new Set(
  (await readdir(portfolioContentDirectory))
    .filter((entry) => /\.mdx?$/.test(entry))
    .map((entry) =>
      entry.replace(/^\d{4}-\d{2}-\d{2}_/, "").replace(/\.mdx?$/, ""),
    ),
);

const failures = [];
const referencedImages = new Set();
let linkCount = 0;
let imageCount = 0;
let codeBlockCount = 0;
let totalBodyCharacters = 0;

const splitMdx = (source, filePath) => {
  const parsed = splitFrontmatter(source);

  if (!parsed) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  return parsed;
};

const canonicalFrontmatterOrder = [
  "draft",
  "featured",
  "lang",
  "slug",
  "title",
  "subtitle",
  "ogImage",
  "topics",
  "tags",
  "linkedPortfolio",
  "distribution",
];
const requiredFrontmatterKeys = canonicalFrontmatterOrder.filter(
  (key) => !["linkedPortfolio", "distribution"].includes(key),
);
const allArticleFiles = (
  await Promise.all(
    [contentDirectory, ukrainianContentDirectory].map(async (directory) =>
      (
        await readdir(directory)
      )
        .filter((entry) => /\.mdx?$/.test(entry))
        .map((entry) => path.join(directory, entry)),
    ),
  )
).flat();

for (const filePath of allArticleFiles) {
  const source = await readFile(filePath, "utf8");
  const { frontmatter } = splitMdx(source, filePath);
  const keys = getFrontmatterKeys(frontmatter);
  const unknownKeys = keys.filter(
    (key) => !canonicalFrontmatterOrder.includes(key),
  );
  const missingKeys = requiredFrontmatterKeys.filter(
    (key) => !keys.includes(key),
  );
  const expectedOrder = canonicalFrontmatterOrder.filter((key) =>
    keys.includes(key),
  );
  const slug = frontmatter.match(/^slug:\s*["']?([^"'\n]+)["']?$/m)?.[1];
  const lang = frontmatter.match(/^lang:\s*([a-z]+)$/m)?.[1];
  const linkedPortfolio = frontmatter.match(
    /^linkedPortfolio:\s*["']?([^"'\n]+)["']?$/m,
  )?.[1];
  const expectedLang = filePath.startsWith(ukrainianContentDirectory)
    ? "uk"
    : "en";
  const filenameSlug = path
    .basename(filePath)
    .replace(/^\d{4}-\d{2}-\d{2}_/, "")
    .replace(/\.mdx?$/, "");

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

  if (slug !== filenameSlug) {
    failures.push(
      `${filePath}: slug must match filename (${filenameSlug}), found ${slug ?? "missing"}`,
    );
  }

  if (lang !== expectedLang) {
    failures.push(
      `${filePath}: lang must be ${expectedLang}, found ${lang ?? "missing"}`,
    );
  }

  if (linkedPortfolio && !portfolioSlugs.has(linkedPortfolio)) {
    failures.push(
      `${filePath}: linkedPortfolio does not match a portfolio slug`,
    );
  }
}

const collectArticleImages = (body) => {
  const markdownImages = Array.from(
    body.matchAll(
      /!\[([^\]]*)\]\((https:\/\/andriishupta\.dev\/images\/blog\/[^)\s]+)\)/g,
    ),
  );
  const phoneScreenshots = Array.from(
    body.matchAll(
      /<PhoneScreenshot[\s\S]*?src="(https:\/\/andriishupta\.dev\/images\/blog\/[^"]+)"[\s\S]*?alt="([^"]+)"[\s\S]*?\/>/g,
    ),
    ([, imageUrl, alt]) => [undefined, alt, imageUrl],
  );
  const galleryScreenshots = Array.from(
    body.matchAll(
      /<ArticleScreenshotGallery\s+screenshots=\{\[([\s\S]*?)\]\}\s*\/>/g,
    ),
  ).flatMap(([, screenshots]) =>
    Array.from(
      screenshots.matchAll(
        /\{\s*src:\s*"(https:\/\/andriishupta\.dev\/images\/blog\/[^"]+)"\s*,\s*alt:\s*"([^"]+)"/g,
      ),
      ([, imageUrl, alt]) => [undefined, alt, imageUrl],
    ),
  );

  return [...markdownImages, ...phoneScreenshots, ...galleryScreenshots];
};

const validatePng = createPngValidator({ publicDirectory, failures });

for (const slug of articles) {
  const filePath = await findArticlePath(contentDirectory, slug);
  const source = await readFile(filePath, "utf8");
  const { frontmatter, body } = splitMdx(source, filePath);
  const ogImage = frontmatter.match(/^ogImage:\s*["']([^"']+)["']/m)?.[1];

  totalBodyCharacters += body.length;

  if (!ogImage) {
    failures.push(`${slug}: missing ogImage frontmatter`);
  } else {
    await validatePng(ogImage, slug, { width: 1200, height: 630 });
  }

  if (body.length < 500) {
    failures.push(`${slug}: article body is missing or unexpectedly short`);
  }

  if (/^#\s+/m.test(body)) {
    failures.push(`${slug}: contains a duplicate level-one heading`);
  }

  if (body.includes("cdn.hashnode.com")) {
    failures.push(`${slug}: still references remote Hashnode media`);
  }

  const links = Array.from(
    body.matchAll(/(?<!!)\[[^\]]+\]\((https?:\/\/[^)]+)\)/g),
  );
  linkCount += links.length;

  if (links.length === 0) {
    failures.push(`${slug}: contains no preserved external links`);
  }

  const fences = Array.from(body.matchAll(/^```/gm)).length;

  if (fences % 2 !== 0) {
    failures.push(`${slug}: contains an unclosed fenced code block`);
  }

  codeBlockCount += fences / 2;

  const images = collectArticleImages(body);

  for (const image of images) {
    const [, alt, imageUrl] = image;
    const publicPath = toPublicPath(imageUrl);
    imageCount += 1;
    referencedImages.add(publicPath);

    if (!alt.trim()) {
      failures.push(`${slug}: image ${publicPath} has empty alternative text`);
    }

    if (!publicPath.startsWith(`/images/blog/${slug}/`)) {
      failures.push(
        `${slug}: image is stored outside its article folder: ${publicPath}`,
      );
    }

    await validatePng(publicPath, slug);
  }
}

const translationGroups = new Map();

for (const article of localizedArticles) {
  let source;

  try {
    source = await readFile(article.filePath, "utf8");
  } catch {
    failures.push(`Missing localized article ${article.filePath}`);
    continue;
  }

  const { frontmatter, body } = splitMdx(source, article.filePath);
  const lang = frontmatter.match(/^lang:\s*([a-z]+)$/m)?.[1];
  const slug = frontmatter.match(/^slug:\s*["']?([^"'\n]+)["']?$/m)?.[1];

  if (lang !== article.lang) {
    failures.push(
      `${article.filePath}: lang must be ${article.lang}, found ${lang ?? "missing"}`,
    );
  }

  if (!slug) {
    failures.push(`${article.filePath}: missing slug`);
  } else {
    const group = translationGroups.get(slug) ?? [];
    group.push({ lang, filePath: article.filePath });
    translationGroups.set(slug, group);
  }

  if (/^defaultLang:/m.test(frontmatter)) {
    failures.push(`${article.filePath}: obsolete defaultLang frontmatter`);
  }

  if (body.length < 500) {
    failures.push(
      `${article.filePath}: article body is missing or unexpectedly short`,
    );
  }

  if (/^#\s+/m.test(body)) {
    failures.push(
      `${article.filePath}: contains a duplicate level-one heading`,
    );
  }

  const images = collectArticleImages(body);

  for (const image of images) {
    const [, alt, imageUrl] = image;
    const publicPath = toPublicPath(imageUrl);
    imageCount += 1;
    referencedImages.add(publicPath);

    if (!alt.trim()) {
      failures.push(
        `${article.filePath}: image ${publicPath} has empty alternative text`,
      );
    }

    if (!publicPath.startsWith(`/images/blog/${miykoSlug}/`)) {
      failures.push(
        `${article.filePath}: image is stored outside its article folder: ${publicPath}`,
      );
    }

    await validatePng(publicPath, miykoSlug);
  }
}

const miykoTranslations = translationGroups.get(miykoSlug) ?? [];
if (
  miykoTranslations.length !== 2 ||
  !miykoTranslations.some(({ lang }) => lang === "en") ||
  !miykoTranslations.some(({ lang }) => lang === "uk")
) {
  failures.push(
    `${miykoSlug}: expected one English and one Ukrainian translation`,
  );
}

await validatePng("/blog/og.png", "blog index", {
  width: 1200,
  height: 630,
});

const diskImages = new Set();

for (const slug of [...articles, miykoSlug]) {
  const directory = path.join(articleImageDirectory, slug);

  try {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        diskImages.add(`/images/blog/${slug}/${entry.name}`);
      }
    }
  } catch {
    // Articles without inline images intentionally have no media directory.
  }
}

for (const image of diskImages) {
  if (!referencedImages.has(image)) {
    failures.push(`Unreferenced imported image: ${image}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `${allArticleFiles.length} articles verified: ${totalBodyCharacters.toLocaleString("en")} body characters, ${linkCount} links, ${codeBlockCount} code blocks, ${imageCount} local images`,
  );
}
