import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { blogTopicSlugs } from "./lib/blog-topics";

const distributionSchema = z
  .object({
    hashnode: z.string().url().optional(),
    devto: z.string().url().optional(),
    medium: z.string().url().optional(),
  })
  .default({});

const languageSchema = z.enum(["en", "uk"]);

const blog = defineCollection({
  loader: glob({
    base: "./src/content",
    pattern: "**/*.{md,mdx}",
    generateId: ({ entry }) =>
      entry.replace(/\.(md|mdx)$/i, "").replaceAll("/", "-"),
  }),
  schema: z.object({
    draft: z.boolean(),
    featured: z.boolean(),
    lang: languageSchema,
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    subtitle: z.string().min(1).max(200),
    ogImage: z.string().startsWith("/"),
    topics: z.array(z.enum(blogTopicSlugs)),
    tags: z.array(z.string()),
    distribution: distributionSchema,
  }),
});

export const collections = { blog };
