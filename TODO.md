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

## Sprint 3: Settlements & Economy — DONE
- [x] Settlement Overlay Redesign — type-specific overlays with action cards
- [x] HBC Fort Actions — trade goods→₥, buy supplies, rest, trail intel
- [x] Métis Camp Actions — gossip, recruit, dance, share food, craft hides
- [x] NWMP Post Actions — fines, permits, duty, ammo, rest
- [x] Mission Actions — heal, free rest+blessing, blessing, limited trade
- [x] Settlement Data — settlementType, name, description, priceMultiplier per node
- [x] Price Variation — settlement × category × distance multipliers
- [x] Endgame Scoring Screen — breakdown, tiers, narrative endings
- [x] Engine API — getSettlementActions, settlementAction, getTradeEstimate, getEndgameScore, getSettlementData

## Sprint 4: Visual Unification — DONE
- [x] Color Palette — CSS custom properties via theme.js
- [x] Overlay Unification — shared .overlay-panel base class
- [x] Status Bar Redesign — two clusters with brass separator
- [x] Map Styling — sepia tiles, dotted trail, typed markers, cart SVG
- [x] Button Polish — primary/secondary/ghost hierarchy, 44px targets
- [x] Journal Polish — collapse chevrons, consistent dice/mechanical
- [x] Dice Consistency — wooden block, settle animation, ink-stamp

## Sprint 5: Consolidation & Overhaul — COMPLETE
- [x] Kill dead code (audio module, bus import)
- [x] Fix narrative rendering (remove dead renderNarrative/renderTravelLinesView)
- [x] Fix shop confirm (remove clearTradeGoods)
- [x] Consolidate settlement systems (remove duplicate getDefaultSettlementActions)
- [x] Fix end screen scoring (use engine getEndgameScore)
- [x] Contrast audit #2 (darken muted text, fix event source readability)
- [x] Journal first-person narrative (travel, events, camp, settlements)
- [x] Fix build script (stop injecting __METIS_ASSETS__ into template)
- [x] Clean up 66 duplicate script blocks in template

## Sprint 6: Gameplay Polish — COMPLETE
- [x] Fix settlement/camp outcome feedback (issue #79)
- [x] One action per camp/settlement visit (issue #81)
- [x] Blessing roll buff (issue #80)
- [x] Gossip flavor text (#90 — dynamic intel + settlement-specific gossip)
- [x] Camp art image (issue #78)
- [x] Scrolling consolidation (issue #83)
- [x] Journal day grouping (issue #89)
- [x] Settlement-specific events from sources (issue #82)
- [x] Audit all 55 events for source coverage gaps
- [x] Add missing events: smallpox, HBC officers, buffalo hunt, river ferry
- [x] Expand women/children presence (currently 4 events)
- [x] French-language dialogue options
- [x] Gossip trail mechanic at settlements
- [x] Seasonal event variation (June vs October)
- [x] Prairie-specific events for western trail
- [x] Second half of Carlton Trail nodes with citations

## Outstanding backlog (active GitHub issues)
- [ ] #91-#95 UI/accessibility bugs from June 12 build (camp/settlement/end/store scroll and contrast)
- [ ] #42 Reformat secondary sources to period voices
- [ ] #40 Party name instead of player name
- [ ] #25 Cultural review
- [ ] #6 AI-writing/content review

## Ongoing
- [ ] Review and approve all historical content before merge
- [ ] Keep this file updated after each work session
- [ ] Cultural review of project and story elements (GitHub issue #25)
- [ ] Review content for AI writing trends (GitHub issue #6)
