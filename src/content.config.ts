import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const distributionSchema = z
  .object({
    hashnode: z.string().url().optional(),
    devto: z.string().url().optional(),
    medium: z.string().url().optional(),
  })
  .default({});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    subtitle: z.string().optional(),
    description: z.string().min(1).max(200),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
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
