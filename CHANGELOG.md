# Changelog

All notable changes are documented here. Format loosely follows Keep a Changelog.

## Unreleased

### Added
- Repo scaffold with `src/core`, `src/data`, `src/systems`, `src/ui`
- Core modules: `constants`, `calendar`, `seed` (PRNG + d20), `schema` types
- Data files: `nodes.js`, `items.js`, `sources/index.js`
- Systems scaffold: `engine.js`, `events.js`, `scoring.js`, `travel.js`
- UI scaffold: `shell.js`, `renderer.js`, `theme.js`, `debug.js`
- esbuild bundler in `scripts/build.mjs`
- GitHub Actions Pages deploy workflow
- Event classification labels and gritty paper texture in `.overlay-card`
- Ledger-style amount line for bonuses/penalties in event overlay (`#event-amount`)
- Dice roll UI with tumbling Spectral font die and pass/fail pill
- `dice-demo.html` with three roll treatments (Ledger Stamp / Slot Machine / Tumbling Die)
- `plan/dice-and-events.md` implementation plan
- Source artwork and wireframe-style style options (`style-options.html`)
- Debugging utilities: `rollHistory`, terrain guard, hook logging

### Fixed
- package-lock regenerated (dev dependency mismatch)
- Leaflet CSS/JS load order and self-booting bundle wiring
- Idempotent map mount and `initMap` / `updateMap` call chain
- `renderStatusBar` refresh after travel choices
- Event card `background` vs `background-image` conflict restoring cream fill under texture
- Travel choice handler now reliably boots renderer, map, and overlay rewrite on first move
- Day/month/season status bar updates now write to DOM during travel
- Cross-module map init trigger fix with `window._metisMapInited`

### Changed
- Palette switched to forest/brass/cream Document scheme
- Event card texture opacity increased for dirt effect

### Docs
- README.md
- TODO.md
- CHANGELOG.md
- ISSUES.md
- AGENTS.md
- docs/pitfalls.md
- style-options.html
- dice-demo.html
- plan/dice-and-events.md

## [v0.5-playable] - 2026-06-04

### Added
- First fully playable public release via GitHub Pages.
- Day/month/season UI now actually advances in the status bar during travel.
- Cross-module map initialization fix so route tiles render.
- Verified live travel loop: Travel 1 Day → settlement modal → Continue West → next segment.

### Changed
- Live at https://bayarddevries.github.io/metis-trail-v2/
- Git tag `v0.5-playable` pinned to commit `4977e31`.

### Docs
- Marked release baseline for continuing development.

## Notes
- v1 site baseline: https://bayarddevries.github.io/metis-trail/
