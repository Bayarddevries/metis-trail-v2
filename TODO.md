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
- [x] Fix build script version drift (single-pass regex, no double-increment)
- [x] Remove dead CDN download() from build script
- [x] Add leaflet to package.json (was missing, broke CI)
- [ ] Standardize conventional commit messages across all contributors
- [ ] Add minimal doc comments to each exported function in `src/systems/engine.js`

## Phase 2 — Core Systems & Debugging
- [x] Expand `src/systems/events.js`/event data with primary-sourced events for each terrain
- [x] Add `src/data/sources/` entries for every narrative event (35 sources, 55 events)
- [x] Event text refactor — all events use `getSource('KEY')` pattern, 2-4 sentence vivid narrative + grounding quote
- [x] Source-quote mismatch audit — all 55 events verified, 7 mismatches fixed (v25)
- [x] Event source rendering — `#event-source` element in overlay displays quote + attribution (v24)
- [x] Overload guard fix — `getState()` returns `usedWeight` + `capacity`, cart auto-opens when over
- [x] Settlement close (✕) button clears `pendingSettlement` (v30)
- [x] Add missing trade/craft engine methods — getTradeEstimate, tradeItem, craftRecipe, getAvailableRecipes (v31)
- [x] Starting cart rebalance — 146.5 kg vs 100 kg capacity, forces unload decision
- [x] Gossip mechanic — trail intel, DC bonuses, trade hints, freshness indicators
- [x] Trade economy — multiplier by settlement type × item category × trail position
- [x] Crafting system — 3 recipes (Finished Hides, Travois Kit, Gunpowder Pack)
- [x] Item system wiring — all 12 items integrated into repair/rest/heal/events
- [x] itemBonus/consumesItem/requiresItem event choice fields
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
- [ ] Weather system — seasonal effects on travel and events
- [ ] Conditional endings — multiple ending paths
- [ ] Pre-departure cart packing — let players choose starting loadout

## Phase 4 — UI/UX Polish
- [x] Mobile top bar clipped in portrait (GitHub issue #27) — CSS fix applied, status bar wraps on mobile
- [ ] Add location/node markers on map (GitHub issue #26)
- [ ] Basic icons (GitHub issue #10)
- [x] Trim dead features/options (GitHub issue #28) — squeal system, factionPref, EventBus, createShell, Node class, dead constants, duplicate event removed

## Phase 5 — Content & Mechanics Expansion
- [x] Conditional endings (GitHub issue #14) — 6 ending types with narratives, source quotes, scoring (v36)
- [ ] Pre-departure cart packing (GitHub issue #15) — let players choose starting loadout
- [ ] Weather system (GitHub issue #13) — seasonal effects on travel and events
- [ ] Highscore/leaderboard (GitHub issue #12) — score tracking by outcome type
- [ ] Add second half of Carlton Trail nodes with citations
- [ ] Add scout/guide hire moral choices with history anchoring

## Phase 6 — Playtesting & Balance (CURRENT)
- [ ] **Headless playtesting harness** (GitHub issue #5) — automated simulations using the real engine
  - Write `tests/simulate-entry.js` + build script
  - Run 100+ simulations with randomized choices
  - Aggregate: win rate, avg score, death reasons, item usage
  - Report balance findings in ISSUES.md
- [ ] **Browser click-through QA** (GitHub issue #5) — visual end-to-end testing
  - Full flow: intro → travel → events → settlement → endings
  - Mobile layout verification
  - Document UI/UX bugs in ISSUES.md

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
- [ ] Cultural review of project and story elements (GitHub issue #25)
- [ ] Review content for AI writing trends (GitHub issue #6)
