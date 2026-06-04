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

### Fixed
- Dice roll overlay now waits for user to click Continue instead of auto-advancing
- Non-dice event choices also show Continue button for consistent UX
- Dice animation has dramatic settle pose with pass/fail color glow (green/red)
- Roll outcome (e.g. "Rolled 14 vs DC 12 — Success") shown inside overlay before Continue
- Outcome text still publishes to narrative log below after Continue is clicked
- Continue button has subtle brass glow pulse to draw attention
- Die face now shows actual result.roll instead of generating a new random number
- v1 site baseline: https://bayarddevries.github.io/metis-trail/
