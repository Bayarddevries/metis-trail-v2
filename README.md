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

## Current state

- Core engine scaffold exists with calendar, PRNG, node/item data, state machine, scoring, and overlay UI
- Build script has a known issue: CI `dist/` artifact fails to upload (`tar: dist: Cannot open`)
- GitHub Pages repo exists but has not published a confirmed live URL yet
- Source citations are included for nodes and items, awaiting expanded primary-source events

## How to work on this repo

1. Start by reading this file, then `TODO.md` and `ISSUES.md`
2. Make changes only in `src/`; keep `dist/` out of git
3. Run `npm run build` and confirm `dist/index.html` and `dist/app.js` exist before opening any URL
4. For offline testing, open `dist/index.html` directly in a browser
5. Update `TODO.md` and `CHANGELOG.md` after each meaningful change
6. Treat all historical content as requiring a primary source citation. If you cannot cite one, leave a clear `TODO` note instead of inventing material.

## Non-negotiables

- Offline-first final output must work without a server
- Conventional commits only
- Historical accuracy first. If something is not sourced, mark it as placeholder
- Never overwrite the v1 canonical story tone without explicit user direction
