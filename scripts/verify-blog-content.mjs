import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const contentDirectory = path.join(repositoryRoot, "src/content/blog");
const publicDirectory = path.join(repositoryRoot, "public");
const articleImageDirectory = path.join(publicDirectory, "images/blog");
const articles = [
  "connect-polkadot-to-a-nextjs-website-with-polkadotextension-dapp",
  "simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen",
  "create-lens-subgraph-on-the-graph-protocol",
  "generate-dummy-data-in-strapi",
  "setup-supabase-with-nestjs",
  "cross-origin-iframe-communication-with-window-post-message",
  "starting-my-web3-journey",
];

const failures = [];
const referencedImages = new Set();
let linkCount = 0;
let imageCount = 0;
let codeBlockCount = 0;
let totalBodyCharacters = 0;

const splitMdx = (source, filePath) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }

  return {
    frontmatter: match[1],
    body: source.slice(match[0].length).trim(),
  };
};

const validatePng = async (publicPath, slug, expectedDimensions) => {
  const absolutePath = path.join(
    publicDirectory,
    publicPath.replace(/^\//, ""),
  );
  let buffer;

  try {
    buffer = await readFile(absolutePath);
  } catch {
    failures.push(`${slug}: missing image ${publicPath}`);
    return;
  }

  const pngSignature = "89504e470d0a1a0a";

  if (
    buffer.length < 24 ||
    buffer.subarray(0, 8).toString("hex") !== pngSignature
  ) {
    failures.push(`${slug}: ${publicPath} is not a valid PNG`);
    return;
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  if (width === 0 || height === 0) {
    failures.push(`${slug}: ${publicPath} has invalid dimensions`);
  } else if (
    expectedDimensions &&
    (width !== expectedDimensions.width || height !== expectedDimensions.height)
  ) {
    failures.push(
      `${slug}: ${publicPath} must be ${expectedDimensions.width}×${expectedDimensions.height}, found ${width}×${height}`,
    );
  }
};

for (const slug of articles) {
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
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

  if (frontmatter.includes("originalReadingMinutes:")) {
    failures.push(`${slug}: still uses migration reading-time fallback`);
  }

  if (/^#\s+/m.test(body)) {
    failures.push(`${slug}: contains a duplicate level-one heading`);
  }

  if (body.includes("cdn.hashnode.com")) {
    failures.push(`${slug}: still references remote Hashnode media`);
  }

  const links = Array.from(body.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g));
  linkCount += links.length;

  if (links.length === 0) {
    failures.push(`${slug}: contains no preserved external links`);
  }

  const fences = Array.from(body.matchAll(/^```/gm)).length;

  if (fences % 2 !== 0) {
    failures.push(`${slug}: contains an unclosed fenced code block`);
  }

  codeBlockCount += fences / 2;

  const images = Array.from(
    body.matchAll(/!\[([^\]]*)\]\((\/images\/blog\/[^)\s]+)\)/g),
  );

  for (const image of images) {
    const [, alt, publicPath] = image;
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

await validatePng("/blog/og.png", "blog index", {
  width: 1200,
  height: 630,
});

const diskImages = new Set();

for (const slug of articles) {
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
    `${articles.length} articles verified: ${totalBodyCharacters.toLocaleString("en")} body characters, ${linkCount} links, ${codeBlockCount} code blocks, ${imageCount} local images`,
  );
}
