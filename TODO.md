# Metis Trail V2 — TODO

Legend: `pending` | `in_progress` | `blocked` | `done`

## Phase 1 — Foundation & Technical Debt
- [x] Fix build pipeline so `npm run build` reliably produces `dist/index.html` and `dist/app.js`
- [x] Get GitHub Pages deploy green and verified
- [x] Verify local offline build by opening `dist/index.html` in a browser
- [x] Bundle Leaflet locally instead of CDN (Tailscale/offline fix)
- [x] Fix map initialization during bootstrap (map ready when intro dismissed)
- [x] Dice roll click-to-dismiss with dramatic settle animation
- [x] Cart marker icon on map (replaced plain circleMarker)
- [ ] Standardize conventional commit messages across all contributors
- [ ] Add minimal doc comments to each exported function in `src/systems/engine.js`

## Phase 2 — Core Systems & Debugging
- [x] Expand `src/systems/events.js`/event data with primary-sourced events for each terrain
- [x] Add `src/data/sources/` entries for every narrative event (35 sources, 55 events)
- [x] Event text refactor — all events use `getSource('KEY')` pattern, 2-4 sentence vivid narrative + grounding quote
- [x] Source-quote mismatch audit — all 55 events verified, 7 mismatches fixed (v25)
- [x] Event source rendering — `#event-source` element in overlay displays quote + attribution (v24)
- [ ] Implement `mountDebugUI` conditionally with `?debug=1`
- [ ] Add minimal unit tests for calendar and PRNG
- [ ] Add save/load validation and migration-ready schema version

## Phase 3 — Content & Mechanics Expansion
- [x] Wire all 12 inventory items into game systems (repair, rest, heal, events)
- [x] Add itemBonus/consumesItem/requiresItem event choice fields
- [ ] Add second half of Carlton Trail nodes with citations
- [x] Add trade good recipes and economy arcs
- [ ] Add scout/guide hire moral choices with history anchoring
- [ ] Polish end-game scoring and local leaderboard

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
