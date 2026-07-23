import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
const contentDirectory = path.join(repositoryRoot, "src/content/blog");
const imageRoot = path.join(repositoryRoot, "public/images/blog");
const sourceOrigin = "https://blog.andriishupta.dev";
const force = process.argv.includes("--force");
const requestedSlugs = process.argv
  .slice(2)
  .filter((argument) => argument !== "--force" && argument !== "--");

const articles = [
  "connect-polkadot-to-a-nextjs-website-with-polkadotextension-dapp",
  "simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen",
  "create-lens-subgraph-on-the-graph-protocol",
  "generate-dummy-data-in-strapi",
  "setup-supabase-with-nestjs",
  "cross-origin-iframe-communication-with-window-post-message",
  "starting-my-web3-journey",
];

const imageAltOverrides = {
  "connect-polkadot-to-a-nextjs-website-with-polkadotextension-dapp": [
    "Next.js dynamic import disabling server-side rendering for the Connect component",
    "TypeScript imports from @polkadot/extension-dapp",
    "Calling web3Enable and handling a missing wallet extension",
    "Loading the first account with web3Accounts",
    "Connect wallet button in the example app",
    "SubWallet connection approval dialog",
    "Connected wallet greeting with account address",
    "Missing wallet extension error message",
    "Browser console output from the Polkadot extension",
  ],
  "simplify-usage-of-lens-api-with-use-lens-and-graphql-codegen": [
    "React example showing Lens global protocol statistics",
    "React example showing Lens recommended profiles",
  ],
  "create-lens-subgraph-on-the-graph-protocol": [
    "Lens subgraph manifest in subgraph.yaml",
    "LensHub proxy address and startBlock configuration",
    "GraphQL schema for Profile and Post entities",
    "ProfileCreated event handler for the Lens subgraph",
    "PostCreated event handler for the Lens subgraph",
    "Graph Explorer query results for Lens profiles and posts",
  ],
  "generate-dummy-data-in-strapi": [
    "Strapi bootstrap function that runs the data seed",
    "Creating multiple Strapi todo entries with Promise.all",
    "Generating a todo with Faker",
    "Seeding the Todo List single type and relations",
    "Helper that uploads media through Strapi",
    "Attaching uploaded media to a seeded todo",
    "Generated todo entries in the Strapi admin panel",
    "Generated Todo List page in the Strapi admin panel",
  ],
  "setup-supabase-with-nestjs": [
    "Enabling row-level security when creating a Supabase table",
    "Configuring a user_id column with auth.uid() in Supabase",
    "Passport JWT strategy configured with the Supabase JWT secret",
    "NestJS Supabase authentication guard",
    "Request-scoped NestJS service that creates an authenticated Supabase client",
    "Injecting the request-scoped Supabase service into another NestJS service",
    "Postman request rejected with a 401 response",
    "Postman request authenticated with a Supabase access token",
    "Supabase magic-link callback URL containing the access token",
  ],
  "cross-origin-iframe-communication-with-window-post-message": [
    "Iframe Communicator test application",
    "Parent React component rendering the child application in an iframe",
    "Parent application postMessage helper",
    "Parent application message event listener",
    "Child application sending a message through window.parent",
    "Child application message event listener",
  ],
};

const selectedArticles =
  requestedSlugs.length > 0
    ? requestedSlugs.map((slug) => {
        if (!articles.includes(slug)) {
          throw new Error(`Unknown article slug: ${slug}`);
        }

        return slug;
      })
    : articles;

const fetchRequired = async (url) => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "andriishupta.dev blog migration",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Could not fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return response;
};

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

const removeSection = (markdown, sectionName) => {
  const lines = markdown.split("\n");
  const start = lines.findIndex(
    (line) =>
      /^##\s+/.test(line) &&
      line.toLowerCase().includes(sectionName.toLowerCase()),
  );

  if (start === -1) {
    return markdown;
  }

  const nextSection = lines.findIndex(
    (line, index) => index > start && /^##\s+/.test(line),
  );
  const end = nextSection === -1 ? lines.length : nextSection;
  lines.splice(start, end - start);

  return lines.join("\n");
};

const linkBareUrls = (markdown) => {
  let insideCodeFence = false;

  return markdown
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        insideCodeFence = !insideCodeFence;
        return line;
      }

      if (insideCodeFence) {
        return line;
      }

      return line.replace(
        /(^|[\s>:])(https?:\/\/[^\s<>\])]+)/g,
        (_match, prefix, matchedUrl) => {
          const trailingPunctuation = matchedUrl.match(/[.,;:]+$/)?.[0] ?? "";
          const url = trailingPunctuation
            ? matchedUrl.slice(0, -trailingPunctuation.length)
            : matchedUrl;

          return `${prefix}[${url}](${url})${trailingPunctuation}`;
        },
      );
    })
    .join("\n");
};

const cleanMarkdown = (source) => {
  const withoutTitle = source.replace(/\r\n/g, "\n").replace(/^#\s+.+\n+/, "");
  const withoutDistribution = removeSection(withoutTitle, "published on");

  return linkBareUrls(withoutDistribution)
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const imagePattern =
  /!\[([^\]]*)\]\((https:\/\/cdn\.hashnode\.com\/[^)\s]+)(?:\s+align="[^"]*")?\)/g;

const slugifyImageName = (value) => {
  const name = value
    .replace(/\.[a-z0-9]+$/i, "")
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);

  return name || "image";
};

const localizeImages = async (markdown, articleSlug) => {
  const matches = Array.from(markdown.matchAll(imagePattern));
  const uniqueImages = new Map();

  for (const match of matches) {
    const [, alt, sourceUrl] = match;

    if (!uniqueImages.has(sourceUrl)) {
      uniqueImages.set(sourceUrl, {
        alt,
        number: uniqueImages.size + 1,
      });
    }
  }

  if (uniqueImages.size === 0) {
    return { markdown, imageCount: 0 };
  }

  const articleImageDirectory = path.join(imageRoot, articleSlug);
  await mkdir(articleImageDirectory, { recursive: true });

  const replacements = new Map();

  await Promise.all(
    Array.from(uniqueImages.entries()).map(
      async ([sourceUrl, { alt, number }]) => {
        const sourcePath = new URL(sourceUrl).pathname;
        const extension = path.extname(sourcePath).toLowerCase() || ".png";
        const fileName = `${String(number).padStart(2, "0")}-${slugifyImageName(alt)}${extension}`;
        const destination = path.join(articleImageDirectory, fileName);
        const response = await fetchRequired(sourceUrl);
        const contentType = response.headers.get("content-type") ?? "";

        if (!contentType.startsWith("image/")) {
          throw new Error(
            `Expected an image from ${sourceUrl}, received ${contentType}`,
          );
        }

        await writeFile(destination, Buffer.from(await response.arrayBuffer()));
        replacements.set(sourceUrl, {
          alt: imageAltOverrides[articleSlug]?.[number - 1] ?? alt,
          path: `/images/blog/${articleSlug}/${fileName}`,
        });
      },
    ),
  );

  return {
    imageCount: uniqueImages.size,
    markdown: markdown.replace(imagePattern, (_match, _alt, sourceUrl) => {
      const replacement = replacements.get(sourceUrl);
      return `![${replacement.alt}](${replacement.path})`;
    }),
  };
};

const importArticle = async (slug) => {
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  const existing = await readFile(filePath, "utf8");
  const { frontmatter, body } = splitMdx(existing, filePath);

  if (body && !force) {
    throw new Error(
      `${slug} already has article content. Pass --force to replace its body from Hashnode.`,
    );
  }

  const sourceUrl = `${sourceOrigin}/${slug}.md`;
  const source = await (await fetchRequired(sourceUrl)).text();
  const cleaned = cleanMarkdown(source);
  const localized = await localizeImages(cleaned, slug);
  const updatedFrontmatter = frontmatter
    .replace(/^originalReadingMinutes:.*(?:\n|$)/m, "")
    .trim();
  const output = `---\n${updatedFrontmatter}\n---\n\n${localized.markdown}\n`;

  await writeFile(filePath, output);

  return {
    slug,
    sourceUrl,
    imageCount: localized.imageCount,
    bodyCharacters: localized.markdown.length,
  };
};

const results = [];

for (const slug of selectedArticles) {
  results.push(await importArticle(slug));
}

for (const result of results) {
  console.log(
    `${result.slug}: ${result.bodyCharacters} characters, ${result.imageCount} images`,
  );
}
