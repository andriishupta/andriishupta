// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, sessionDrivers } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://andriishupta.dev",

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
