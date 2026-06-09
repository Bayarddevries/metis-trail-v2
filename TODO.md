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
- [x] Standardize conventional commit messages across all contributors
- [x] Add minimal doc comments to each exported function in `src/systems/engine.js`
- [x] Sprint 1a-i: Extract hardcoded colors from template.html to src/ui/theme.js, apply via applyTheme() at bootstrap; fonts: Playfair Display (headings) + Crimson Text (body)

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
- [x] Implement `mountDebugUI` conditionally with `?debug=1`
- [x] Add minimal unit tests for calendar and PRNG
- [x] Add save/load validation and migration-ready schema version

## Phase 3 — Content & Mechanics Expansion
- [x] Wire all 12 inventory items into game systems (repair, rest, heal, events)
- [x] Add itemBonus/consumesItem/requiresItem event choice fields
- [ ] Add second half of Carlton Trail nodes with citations
- [ ] Add scout/guide hire moral choices with history anchoring
- [ ] Polish end-game scoring and local leaderboard
- [x] Weather system — seasonal effects on travel and events (v65)
- [x] Conditional endings — multiple ending paths (v36, 6 ending types)
- [ ] Pre-departure cart packing — let players choose starting loadout

### Phase 4 — UI/UX Polish
- [x] Mobile bar, button hierarchy, camp grouping, settlement polish done
- [x] Location/node markers on map (#26)
- [ ] Basic icons (#10)

### Audit P0 — Period-Accurate Sharp-Corner Aesthetic (2026-06-09 audit)
- [x] #50 — Strip all `border-radius` and `box-shadow` for sharp corners
- [x] #51 — Desaturate map tiles (`grayscale(1) contrast(1.1) brightness(0.9)`) and hide OSM attribution
- [x] #52 — Add paper texture with ruled lines and ledger margin to narrative panel
- [x] #55 — Add mobile breakpoints (768px, 420px, landscape) and 44px minimum touch targets

### Phase 9 — Leaderboard
- [x] Firebase leaderboard (#12) — v69
- [x] Player name input
- [x] My Scores with 8 sort options
- [x] Lane A interface enhancements: aged palette, button hierarchy, camp grouping, status urgency, travel narrative dedupe, close-buttons touch hardening
- [x] `docs/interface-enhancement-report.html` — interface audit with prioritized improvement options
- [x] Touch-target hardening: `.action-primary/.action-secondary/.action-ghost`, min 44px viewport height target
- [x] Settlements UI polish: explicit action labels/subtitles, primary/secondary/utility visual hierarchy, stronger buttons, clearer trade/craft disabled/empty states
- [x] Fix #27 duplicate texture buckets (dead `const`) removed
- [x] Fix #37 access-denied retry loop replaced by deterministic nav error handling
- [x] Fix #38 meshgroup auto-centering after async tree load
- [x] Fix #38 node-edge near-hit bug

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
  - [x] Run 300 simulations with realistic weighted player choices
  - [x] Aggregate: win rate, avg score, death reasons, item usage
  - [x] Realistic-choice run: 88.7% victory, 4.0% cart failure, 7.3% starvation
  - [x] User accepted balance outcomes as-is; no values changed
- [x] **Browser click-through QA** — visual end-to-end testing
  - [x] Full flow verified: intro → travel → events → settlement → endings
  - [x] Map rendering verified (Leaflet tiles + cart marker present)
  - [x] Ending overlay verified (title, narrative, score breakdown, source quote)
- [x] **Balance pass** — findings documented, baseline accepted
  - [x] Document realistic-choice balance outcomes
  - [x] Surrender/reduce mapping kept executable with env passed through
  - [x] User stated ship as-is after seeing results

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
- [x] HBC crafting reachable: 'craft' action confirmed present in HBC `availableSettlementActions()` (was already added in v41)
- [x] Settlement actions pruned: removed `recruit`/`forage`/`rumours` — all dominated by other actions (#31, v52)

## Phase 8 — Win Rate Normalization & Polish (CURRENT)
- [x] Post-balance baseline accepted: 300-run realistic-choice sim results shipped as current balance
- [ ] Win rate 66.5% post-balance, still above 25-40% target but accepted by user
- [ ] Options remain: weather system, higher food consumption, more aggressive event penalties, time pressure
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
