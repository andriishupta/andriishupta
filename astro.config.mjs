// @ts-check

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, sessionDrivers } from "astro/config";

import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  session: {
    driver: sessionDrivers.lruCache(),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon()],
  adapter: cloudflare({
    imageService: "passthrough",
  }),
});
