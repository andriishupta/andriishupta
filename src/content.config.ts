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
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    lang: languageSchema.default("en"),
    translationKey: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    description: z.string().min(1).max(200),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    topics: z.array(z.enum(blogTopicSlugs)).default([]),
    cover: z.string().startsWith("/").optional(),
    coverAlt: z.string().optional(),
    ogImage: z.string().startsWith("/").optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    originalReadingMinutes: z.number().int().positive().optional(),
    distribution: distributionSchema,
  }),
});

export const collections = { blog };
