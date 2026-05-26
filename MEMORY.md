# Personal Website Memory

## Current State

- Project is now Astro-based after migrating away from the previous Next.js app.
- Tailwind CSS 4 is installed through `@tailwindcss/vite`.
- Motion is installed and used via `motion/mini` for small client-side animation.
- Astro `ClientRouter` is enabled for internal view transitions.
- Main page is still intentionally one-page and minimal.
- Hero copy:
  - Name: `Andrii Shupta`
  - Line: `Full-stack apps, front-end websites, back-end services, prototypes, MVPs, dashboards, internal tools, and landing pages.`
- Theme selector exists in the top-right:
  - Default is system.
  - Light/dark explicit selections persist in `localStorage`.
  - System clears stored preference.
  - UI is a compact icon dropdown using `astro-icon` with Font Awesome icons.
- Blog link should be external, currently `https://blog.andriishupta.dev`.
- Do not create a separate `/links` page for now.
- Email was removed from the hero.
- Do not mention VS Code as part of the user's workflow.
- Abstract interactive hero background is implemented with `AmbientField.astro`.
  - Uses CSS variables plus a tiny pointer script.
  - Respects `prefers-reduced-motion`.
  - Current direction is layered wave/pulse/grid plus randomized chaotic pendulum-like arcs.
  - Arc count, positions, rotations, opacity, sway, timing, and mouse response randomize on page load.
- Links are now an on-page centered modal in the hero, not a `/links` route.
  - Includes GitHub, LinkedIn, Now, Services, Focus, and Uses.
  - Uses a regular backdrop and Motion open/close animation.
  - In-page modal links close the modal and scroll to the section.
- External links open in a new tab/window with `target="_blank"` and `rel="noreferrer"`.
- `Now`, `Services`, `Workflow`, `Focus`, `Uses`, and `Latest from the blog` sections are implemented in `HomeSections.astro`.
- Latest blog preview fetches up to 3 posts at build time from:
  - `https://blog.andriishupta.dev/rss.xml`
  - Falls back to the known Supabase/NestJS post if the RSS request fails.

## Design Direction

- Keep the site one-page.
- Avoid generic developer-template/portfolio-card patterns.
- Keep the tone minimal, technical, founder/developer, and slightly terminal-like.
- Positioning can use the user's broader service language: full-stack apps,
  front-end websites, back-end services, prototypes, MVPs, dashboards,
  internal tools, and landing pages.
- Prefer strong typography, restrained spacing, and subtle interaction.
- Use Tailwind utilities for styling.
- Use Motion only for purposeful client-side animation.
- Use Astro view transitions where they make internal navigation feel better.
- SEO is first-class: pages should have useful title, description, canonical, and share metadata.

## Cleanup Already Started

- `AGENTS.md` has project guidance for Astro, Tailwind, Motion, SEO, animation restraint, and no projects section unless requested.
- Astro starter assets were removed.
- The starter `Welcome.astro` component was renamed to `Hero.astro` during cleanup.
- README was cleaned up with correct site link and common commands.
- Layout metadata was expanded with canonical URL and Open Graph URL/site name.
- Home content was updated from CV/service notes: services, AI-first workflow,
  focus skills, complementary tools, current focus, and latest writing.

## Preferred Next Features

1. Consider a small command palette later as a signature interaction.
2. If exact GitHub/LinkedIn brand logos are needed, add `@iconify-json/fa6-brands`.
3. Refine section copy and ordering after seeing the page visually.
4. Consider improving RSS parsing with a package if feed formats become more complex.

## Constraints / Preferences

- No projects section for now.
- Keep dynamic features subtle.
- Avoid heavy parallax, large animated counters, visitor counters, and generic GitHub stats cards.
- Prefer static rendering unless a feature clearly needs client-side JavaScript.
- User describes the workflow as AI-first / vibe engineering:
  - Code is core.
  - Low-code when useful.
  - No-code on demand.
  - Tools include Codex, Claude Code, OpenAI, Cursor, Bolt, Lovable, and v0.
