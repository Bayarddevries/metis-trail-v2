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
- Dice roll overlay now waits for user to click Continue instead of auto-advancing
- Non-dice event choices also show Continue button for consistent UX
- Dice animation has dramatic settle pose with pass/fail color glow (green/red)
- Roll outcome (e.g. "Rolled 14 vs DC 12 — Success") shown inside overlay before Continue
- Outcome text still publishes to narrative log below after Continue is clicked
- Continue button has subtle brass glow pulse to draw attention
- Die face now shows actual result.roll instead of generating a new random number
- Map now initializes during bootstrap so it's ready when intro overlay is dismissed
- Leaflet assets bundled locally (no CDN dependency) for Tailscale/offline use

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
- Cart marker icon (`art/cart_marker.png`, 1000x477 native) rendered at 100x48 on map via Leaflet `L.icon`
- esbuild image file loaders (`.png`, `.jpg`, `.svg`) — assets referenced in JS are copied to `dist/`

### Fixed
- User marker replaced from plain brown `circleMarker` to cart icon (`renderer.js`)
- Cart marker aspect ratio corrected (was 48x48 square, now 100x48 matching ~2.1:1 source ratio)
- Build output includes image assets alongside `app.js`

### Changed
- Live at https://bayarddevries.github.io/metis-trail-v2/
- Git tag `v0.5.1-marker-fix` pinned to commit `a15b619`.

### Docs
- Marked release baseline for continuing development.
