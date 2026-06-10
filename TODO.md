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

### Phase 3 — Content & Mechanics Expansion
- [x] Wire all 12 inventory items into game systems (repair, rest, heal, events)
- [x] Add itemBonus/consumesItem/requiresItem event choice fields
- [ ] Add second half of Carlton Trail nodes with citations
- [ ] Add scout/guide hire moral choices with history anchoring
- [x] Weather system — seasonal effects on travel and events (v65)
- [x] Conditional endings — multiple ending paths (v36, 6 ending types)
- [x] Pre-departure cart packing — let players choose starting loadout (v80)

### Phase 4 — UI/UX Polish
- [x] Mobile bar, button hierarchy, camp grouping, settlement polish done
- [x] Location/node markers on map (#26) (v55)
- [ ] Basic icons (#10)
- [ ] Replace travel debug narrative with atmospheric fragments (done v64)

## Sprint 1: Fix & Stabilize ✅ COMPLETE
- [x] Kill audio module
- [x] Fix hunt/repair item check
- [x] Fix #71 decimal scores
- [x] Fix #72 end button sizes
- [x] Fix #73 HoF load
- [x] Fix lined paper CSS

## Sprint 2: Core Redesign ✅ COMPLETE
- [x] Build starting shop screen
- [x] Build narrative journal (basic — travel logging only)
- [x] Unify cart overlay
- [x] Redesign camp action cards with cost/risk/flavor text per action
- [x] Critical failures on roll 1 — extra consequences per action type
- [x] Journal logging for events, camp actions, settlements
- [x] Hunt gives trade goods (pelts/hides) not food

## Sprint 3: Settlements & Economy — IN PROGRESS
- [ ] Settlement Overlay Redesign — type-specific overlays with action cards
- [ ] HBC Fort Actions — trade goods→₥, buy supplies, rest, trail intel
- [ ] Métis Camp Actions — gossip, recruit, dance, share food, craft hides
- [ ] NWMP Post Actions — fines, permits, duty, ammo, rest
- [ ] Mission Actions — heal, free rest+blessing, blessing, limited trade
- [ ] Settlement Data — settlementType, name, description, priceMultiplier per node
- [ ] Hunting Events — terrain-specific (bison/beaver/elk/deer) with DCs
- [ ] Price Variation — settlement × category × distance multipliers
- [ ] Endgame Scoring Screen — breakdown, tiers, narrative endings
- [ ] Engine API — getSettlementActions, settlementAction, getTradeEstimate, getEndgameScore, getSettlementData

## Sprint 4: Visual Unification — PENDING
- [ ] Color Palette — CSS custom properties via theme.js
- [ ] Overlay Unification — shared .overlay-panel base class
- [ ] Status Bar Redesign — two clusters with brass separator
- [ ] Map Styling — sepia tiles, dotted trail, typed markers, cart SVG
- [ ] Button Polish — primary/secondary/ghost hierarchy, 44px targets
- [ ] Journal Polish — collapse chevrons, consistent dice/mechanical
- [ ] Dice Consistency — wooden block, settle animation, ink-stamp

## Sprint 5: Content & Historical Depth — FUTURE
- [ ] Audit all 55 events for source coverage gaps
- [ ] Add missing events: smallpox, HBC officers, buffalo hunt, river ferry
- [ ] Expand women/children presence (currently 4 events)
- [ ] French-language dialogue options
- [ ] Gossip trail mechanic at settlements
- [ ] Seasonal event variation (June vs October)
- [ ] Prairie-specific events for western trail
- [ ] Second half of Carlton Trail nodes with citations

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
- [ ] Cultural review of project and story elements (GitHub issue #25)
- [ ] Review content for AI writing trends (GitHub issue #6)
