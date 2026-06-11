# Metis Trail V2

A modular, historically-grounded educational web game about the 1878 Métis Carlton Trail journey. Built with vanilla ESM, esbuild, and Vitest. Offline-first single-page output.

## Repo layout

- `src/main.js` — browser entry/bootstrap
- `src/systems/` — game logic (`engine.js`, `events.js`, `scoring.js`, `travel.js`)
- `src/ui/` — rendering, overlays, theme, persistence, debug
- `src/data/` — nodes, items, sources
- `src/core/` — constants, calendar math, PRNG, schema/types
- `scripts/build.mjs` — esbuild bundler → `dist/app.js` + `dist/index.html`
- `.github/workflows/deploy.yml` — GitHub Pages deploy
  - `dist/` is generated during deployment; do not commit built artifacts.

## Current state

- Playable release `v10` deployed to GitHub Pages.
- Live URL: https://bayarddevries.github.io/metis-trail-v2/
- Verified flows: travel advances day/month/season UI, map renders with cart marker icon, settlements open with action cards + dice roll result display, camp overlay with push-on auto-close, journal with day-grouped collapsible entries, end screen with score breakdown.
- All P0/P1 audit items implemented. 62/63 tests pass (1 pre-existing failure).
- Build: `bun scripts/build.mjs` produces `dist/app.js` + image assets. CI publishes from `dist/`.

## How to work on this repo

1. Start by reading this file, then `TODO.md` and `ISSUES.md`
2. Make changes in `src/`. Do not manually change `dist/`.
3. Run `npm run build`, confirm `dist/index.html` exists, then open it directly for offline verification
4. Update `TODO.md` and `CHANGELOG.md` after each meaningful change
5. Treat historical content as requiring a primary source citation. If you cannot cite one, leave a clear `TODO` note instead of inventing material.

## Non-negotiables

- Offline-first final output must work without a server
- Conventional commits only
- Historical accuracy first. If something is not sourced, mark it as placeholder
- Never overwrite the v1 canonical story tone without explicit user direction
