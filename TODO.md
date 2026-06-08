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

## Phase 6 — Playtesting & Balance (COMPLETE)
- [x] **Headless playtesting harness** — automated simulations using the real engine
  - [x] Write `tests/simulate-entry.js` + `scripts/build-test.mjs`
  - [x] Run 200 simulations with randomized choices
  - [x] Aggregate: win rate, avg score, death reasons, item usage
  - [x] Report balance findings in ISSUES.md (see #5a, #5b)
- [x] **Browser click-through QA** — visual end-to-end testing
  - [x] Full flow: intro → travel → events → settlement → endings
  - [x] Map rendering verified (Leaflet tiles + cart marker present)
  - [x] Ending overlay verified (title, narrative, score breakdown, source quote)
  - [x] Found bugs: #29 (victory bypasses starvation), #30 (duplicate trade buttons)
- [x] **Balance pass** — apply findings from sim data
  - [x] Fix win rate (70.5% → target 25-40%)
  - [x] Reduce cart failure rate (24% of all games)
  - [x] Fix #29 starvation bypass bug
  - [x] Fix #30 duplicate trade buttons
  - [x] Lower triumphant threshold (1400 → 1200)
  - [x] Tighten food economy

## Phase 7 — Cart UX & Crafting Exposure (v41-v44) — COMPLETE
- [x] Starting cart weight reduced: Pemmican 20→15, Firewood 3→2 (~128 kg)
- [x] Category tooltips in cart overlay (`getCategoryHint()`)
- [x] MB display removed from cart rows and crafting panel
- [x] Crafting exposed at Métis and NWMP settlements (`availableSettlementActions` includes 'craft')
- [x] Pre-departure overlay built: briefing, category legend, weight tracking, +/- controls, Auto-Pack, Confirm Loadout
- [x] Engine API: `getPreDepartureItems()`, `setPreDepartureCount()`, `confirmPreDeparture()`
- [x] Main.js: `showPreDeparture()` with full UI logic
- [x] Overlay sequence fixed — intro now precedes pre-departure (#32)
- [x] Version drift sync — `src/template.html` matches `dist/index.html` (v44)
- [ ] Remove duplicate “Trade” action button from settlement UI when both trade panel toggle and trade action render
- [ ] HBC crafting: reassign `finished_hides` from `hbc` to a settlement type that already exposes `craft`

## Phase 8 — Win Rate Normalization & Polish (CURRENT)
- [ ] Win rate 66.5% post-balance, still above 25-40% target
- [ ] Options: weather system, higher food consumption, more aggressive event penalties, time pressure
- [ ] Cart unload buttons show item name for clarity
- [ ] Replace travel debug narrative with atmospheric fragments
- [ ] Basic icons / map markers (Issue #10, #26)

## Phase 0 — Camp Overhaul (IMPLEMENTED)
- [x] Add `campAction()` engine method with 7 activities (rest/forage/hunt/repair/scout/dance/deeprest)
- [x] Add `#camp-overlay` with action buttons, action panel vis resets on reopen and one-action-per-open flow
- [x] Fix camp freeze when loopback founder flow is fed back via restart loop
- [x] Wire Camp button to `showCamp()` and continue/close handlers
- [x] Camp bug #34 closed — action panel now rebuilds on every open
- [ ] Add camp activity failures/flavor branching based on crew state (future)
- [ ] Expand scoring to reward well-timed camps (Phase 3)

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
- [ ] Cultural review of project and story elements (GitHub issue #25)
- [ ] Review content for AI writing trends (GitHub issue #6)
