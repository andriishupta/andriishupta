import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

const projectRoot = process.cwd();
const contentDirectory = path.join(projectRoot, "src/content/blog");
const publicBlogDirectory = path.join(projectRoot, "public/blog");
const width = 1200;
const height = 630;

function escapeXml(value) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function wrapText(value, maxCharacters, maxLines) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxCharacters || line.length === 0) {
      line = candidate;
      continue;
    }

    lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }

  if (line && lines.length < maxLines) lines.push(line);

  const consumedWords = lines.join(" ").split(/\s+/).length;
  if (consumedWords < words.length) {
    lines[lines.length - 1] =
      `${lines[lines.length - 1].replace(/[.,;:]$/, "")}…`;
  }

  return lines;
}

function tspans(lines, x, y, lineHeight) {
  return lines
    .map(
      (line, index) =>
        `<tspan x="${x}" y="${y + index * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");
}

async function renderBlogOg(title, subtitle) {
  const titleLines = wrapText(title, 29, 4);
  const subtitleLines = subtitle ? wrapText(subtitle, 56, 2) : [];
  const titleSize =
    titleLines.length >= 4 ? 58 : titleLines.length === 3 ? 66 : 74;
  const titleLineHeight = Math.round(titleSize * 1.02);
  const subtitleY = 170 + titleLines.length * titleLineHeight + 28;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="1200" height="630" fill="#fafafa"/>
      <rect x="930" width="270" height="630" fill="#202124"/>
      <line x1="930" y1="0" x2="930" y2="630" stroke="#202124" stroke-width="1"/>
      <text x="64" y="78" fill="#202124" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700">Andrii Shupta</text>
      <line x1="64" y1="96" x2="210" y2="96" stroke="#202124" stroke-width="2"/>
      <text fill="#202124" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="750" letter-spacing="-2">${tspans(titleLines, 64, 170, titleLineHeight)}</text>
      <text fill="#62656b" font-family="Arial, Helvetica, sans-serif" font-size="27" font-weight="400">${tspans(subtitleLines, 64, subtitleY, 36)}</text>
      <text x="64" y="570" fill="#62656b" font-family="Arial, Helvetica, sans-serif" font-size="21">andriishupta.dev/blog</text>
      <circle cx="1065" cy="250" r="58" fill="#fafafa"/>
      <text x="1065" y="267" fill="#202124" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">AS</text>
      <text x="1065" y="355" fill="#fafafa" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="650">WRITING</text>
      <line x1="1005" y1="382" x2="1125" y2="382" stroke="#fafafa" stroke-opacity="0.45"/>
      <text x="1065" y="420" fill="#fafafa" fill-opacity="0.72" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17">SOFTWARE · SYSTEMS</text>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function writeIfChanged(filePath, contents) {
  try {
    const existing = await readFile(filePath);
    if (existing.equals(contents)) return "unchanged";
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents);
  return "updated";
}

const entries = await readdir(contentDirectory, { withFileTypes: true });
const articles = [];

for (const entry of entries) {
  if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;
  const source = await readFile(
    path.join(contentDirectory, entry.name),
    "utf8",
  );
  const { data } = matter(source);

  if (!data.title || !data.slug) {
    throw new Error(
      `${entry.name} must define title and slug before OG generation.`,
    );
  }

  articles.push({
    title: String(data.title),
    slug: String(data.slug),
    subtitle: data.subtitle
      ? String(data.subtitle)
      : String(data.description ?? ""),
  });
}

const outputs = [
  {
    path: path.join(publicBlogDirectory, "og.png"),
    image: await renderBlogOg(
      "Writing",
      "Notes on software, systems, and the work behind them.",
    ),
  },
  ...(await Promise.all(
    articles.map(async (article) => ({
      path: path.join(publicBlogDirectory, article.slug, "og.png"),
      image: await renderBlogOg(article.title, article.subtitle),
    })),
  )),
];

let updated = 0;
for (const output of outputs) {
  const result = await writeIfChanged(output.path, output.image);
  if (result === "updated") updated += 1;
}

console.log(
  `Blog OG images: ${updated} updated, ${outputs.length - updated} unchanged.`,
);
