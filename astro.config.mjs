// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, sessionDrivers } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://andriishupta.dev",

  integrations: [mdx()],

  devToolbar: {
    enabled: false,
  },

  session: {
    driver: sessionDrivers.lruCache(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: "passthrough",
  }),
});
