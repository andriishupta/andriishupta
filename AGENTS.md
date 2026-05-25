# AGENTS.md

## Project Overview

This repository contains the source for the personal website at `andriishupta.dev`.
The project was migrated from Next.js to Astro, so current work should follow the
Astro structure and ignore the deleted Next.js app files.

## Tech Stack

- Astro
- TypeScript-enabled configuration
- Node.js `>=22.12.0`

## Common Commands

- `npm run dev` - start the local Astro development server.
- `npm run build` - create a production build.
- `npm run preview` - preview the production build locally.
- `npm run astro -- <command>` - run Astro CLI commands.

## Repository Structure

- `src/pages/` - Astro routes. `src/pages/index.astro` is the home page.
- `src/layouts/` - shared page layouts.
- `src/components/` - reusable Astro components.
- `src/assets/` - source assets imported by Astro components.
- `public/` - static files served from the site root, including favicons.
- `astro.config.mjs` - Astro configuration.

## Working Notes

- Prefer Astro components and layouts for new website work.
- Keep the site static unless a feature clearly needs client-side JavaScript.
- Run `npm run build` before handing off changes that affect rendering,
  routing, configuration, or dependencies.
- The repository may contain git changes from the Next.js-to-Astro migration;
  do not restore deleted Next.js, shadcn, Tailwind, or React files unless asked.
