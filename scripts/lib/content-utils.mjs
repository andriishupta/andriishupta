import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export const splitFrontmatter = (source) => {
  const match = source.match(frontmatterPattern);

  if (!match) return undefined;

  return { frontmatter: match[1], body: source.slice(match[0].length).trim() };
};

export const extractFrontmatter = (source) =>
  splitFrontmatter(source)?.frontmatter ?? "";

export const getFrontmatterValue = (frontmatter, key) => {
  const line = frontmatter
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith(`${key}:`));
  return line
    ?.slice(key.length + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
};

export const getFrontmatterKeys = (frontmatter) =>
  Array.from(
    frontmatter.matchAll(/^([A-Za-z][A-Za-z0-9]*):/gm),
    ([, key]) => key,
  );

export const readMarkdownFiles = async (directory) => {
  try {
    return (await readdir(directory))
      .filter((entry) => /\.mdx?$/.test(entry))
      .map((entry) => path.join(directory, entry));
  } catch {
    return [];
  }
};

export const createPngValidator =
  ({ publicDirectory, failures }) =>
  async (publicPath, label, expectedDimensions) => {
    const absolutePath = path.join(
      publicDirectory,
      publicPath.replace(/^\//, ""),
    );
    let buffer;

    try {
      buffer = await readFile(absolutePath);
    } catch {
      failures.push(`${label}: missing image ${publicPath}`);
      return;
    }

    if (
      buffer.length < 24 ||
      buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
    ) {
      failures.push(`${label}: ${publicPath} is not a valid PNG`);
      return;
    }

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    if (width === 0 || height === 0) {
      failures.push(`${label}: ${publicPath} has invalid dimensions`);
      return;
    }

    if (
      expectedDimensions &&
      (width !== expectedDimensions.width ||
        height !== expectedDimensions.height)
    ) {
      failures.push(
        `${label}: ${publicPath} must be ${expectedDimensions.width}×${expectedDimensions.height}, found ${width}×${height}`,
      );
    }
  };

export const createAssertions = (failures) => ({
  requireText: (source, value, label) => {
    if (!source.includes(value)) failures.push(`${label}: missing ${value}`);
  },
  rejectText: (source, value, label) => {
    if (source.includes(value))
      failures.push(`${label}: still contains ${value}`);
  },
});
