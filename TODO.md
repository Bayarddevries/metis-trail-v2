# Metis Trail V2 — TODO

Legend: `pending` | `in_progress` | `blocked` | `done`

## Phase 1 — Foundation & Technical Debt
- [x] Fix build pipeline so `npm run build` reliably produces `dist/index.html` and `dist/app.js`
- [x] Get GitHub Pages deploy green and verified
- [x] Verify local offline build by opening `dist/index.html` in a browser
- [ ] Standardize conventional commit messages across all contributors
- [ ] Add minimal doc comments to each exported function in `src/systems/engine.js`

## Phase 2 — Core Systems & Debugging
- [ ] Expand `src/systems/events.js`/event data with primary-sourced events for each terrain
- [ ] Implement `mountDebugUI` conditionally with `?debug=1`
- [ ] Add `src/data/sources/` entries for every narrative event
- [ ] Add minimal unit tests for calendar and PRNG
- [ ] Add save/load validation and migration-ready schema version

## Phase 3 — Content & Mechanics Expansion
- [ ] Add second half of Carlton Trail nodes with citations
- [ ] Add trade good recipes and economy arcs
- [ ] Add scout/guide hire moral choices with history anchoring
- [ ] Polish end-game scoring and local leaderboard

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
