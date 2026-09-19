// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { remarkLocalImages } from "./src/lib/remark-local-images.mjs";

import mdx from "@astrojs/mdx";

const isDevelopment = process.argv.includes("dev");

// https://astro.build/config
export default defineConfig({
  site: "https://andriishupta.dev",

  build: {
    format: "file",
  },

  integrations: [mdx()],
  markdown: {
    remarkPlugins: isDevelopment ? [remarkLocalImages] : [],
    shikiConfig: {
      theme: "github-dark-high-contrast",
    },
  },
  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
