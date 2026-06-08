# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 42. MCP Playwright click selector resolution fails in current session
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve in this session. This blocks browser verification of UI changes.
- Evidence: browser_navigate succeeded; browser_click failed for `button "Begin Journey"`, `@e61`, `button[name="Begin Journey"]` with selector parse/resolution errors.
- Workaround: Verify UI changes via source inspection and local server checks instead of automated clicks, until the MCP Playwright backend is restored.
- Impact: Cannot complete browser QA steps reliably from this session.

### 42. MCP Playwright click selector resolution fails in current session
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve in this session. This blocks browser verification of UI changes.
- Evidence: browser_navigate succeeded; browser_click failed for `button "Begin Journey"`, `@e61`, `button[name="Begin Journey"]` with selector parse/resolution errors.
- Workaround: Verify UI changes via source inspection and local server checks instead of automated clicks, until the MCP Playwright backend is restored.
- Impact: Cannot complete browser QA steps reliably from this session.
# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 42. MCP Playwright click selector resolution fails in current session
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve in this session. This blocks browser verification of UI changes.
- Evidence: browser_navigate succeeded; browser_click failed for `button "Begin Journey"`, `@e61`, `button[name="Begin Journey"]` with selector parse/resolution errors.
- Workaround: Verify UI changes via source inspection and local server checks instead of automated clicks, until the MCP Playwright backend is restored.
- Impact: Cannot complete browser QA steps reliably from this session.


### 32. Overlay sequence broken — pre-departure shows before intro
- Opened: 2026-06-07
- Labels: bug, ux
- Summary: `bootstrap()` in `src/main.js` immediately activates `#predeparture-overlay` and deactivates `#intro-overlay` because engine initial state has `preDeparture: true`. Player never sees the intro screen with "Begin Journey" button.
- Root cause: `src/systems/engine.js` line 50 sets `preDeparture: true` in initial state. `bootstrap()` lines 32-37 check this and swap overlays on load.
- Expected: Intro overlay → click "Begin Journey" → pre-departure overlay → confirm → game start.
- Actual: Pre-departure shows immediately; "Begin Journey" click hides intro but never activates pre-departure.
- Fix: In `bootstrap()`, always show intro first. On `#intro-start` click, hide intro AND activate pre-departure overlay. Then on `#pd-confirm`, hide pre-departure and start game.

### 33. HBC crafting recipe unreachable
- Opened: 2026-06-07
- Labels: bug, crafting
- Summary: Recipe `finished_hides` exists with `settlement: 'hbc'` in `getAvailableRecipes()` but HBC action list does NOT include `'craft'`. Player can never access it.
- Fix: Either add `'craft'` to HBC actions in `availableSettlementActions()` or reassign recipe to a settlement type that has it.

### 34. Camp overlay loses action panel on reopen
- Opened: 2026-06-07
- Labels: bug, ux
- Summary: After one camp action click, `showCamp()` hides the action buttons and shows a Continue button. On future Camp opens the action list is invisible, leaving only a blank Continue/result area.
- Root cause: `actionsEl.style.display = 'none'` set on click was never reset before rebuilding.
- Fix: Forced `actionsEl.style.display = 'grid'` and `actionsEl.style.visibility = 'visible'` in `showCamp()` before rebuilding buttons.
- Files: `src/main.js` `showCamp()` lines 869-933.

## Resolved
- Opened: 2026-06-05
- Labels: enhancement
- Summary: Visual markers on the map for settlements/nodes along the trail. Leaflet markers for each location.
- Notes: Manny Morr's 3 pixel art images (Fort Garry, Fort Edmonton, Fort Ellice) from Google Drive folder `18BIjiLG2cdiTLOuh3lBqMY3x-u7nAIW8` are arrival cards, not map pins — approach tabled pending decision.

### 25. Need full cultural review of the project and story elements
- Opened: 2026-06-05
- Summary: Peer review of all story elements for period accuracy and cultural accuracy. External dependency.

### 15. Allow users to spend starting money to pack their original cart
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Pre-departure cart packing phase with budget/space constraints. Player-driven starting loadout.
- Notes: v43 implements this as the pre-departure overlay with 100kg capacity, category legend, and Auto-Pack. BLOCKED by overlay sequence bug (#32).

### 13. Weather system addition
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Daily weather modifiers influencing events, outcomes, morale, and wear.

### 12. Add in concrete user scores and highscoring
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Highscores for different outcome types so players can compete.

### 10. Build out basic icons
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Replace basic UI icons with themed artwork.

### 6. Review content for AI writing trends
- Opened: 2026-06-04
- Summary: Audit all written copy using hermes skills to surface AI-isms and improve voice authenticity.

### 5. Add in Testing (headless and browser) — CURRENT PRIORITY
- Opened: 2026-06-04
- **STATUS: COMPLETE — Phase 6**
- Two tracks:
  1. **Headless**: ✅ COMPLETE — `tests/simulate-entry.js` + `scripts/build-test.mjs`, 200 sims × 2 runs
  2. **Browser click-through**: ✅ COMPLETE — full flow verified, map/overlays/endings all render
- Balance pass applied (v38): DAILY_FOOD 1.0→1.2, wear chances reduced, repair -2 wear, EVENT_CHANCE 0.35→0.45, triumphant threshold 1400→1200
- Post-balance results (200 sims): win rate 66.5%, starvation 11%, cart failure 19.5%, avg events 8.5/game
- Subsequent v41/v44 changes: cart weight reduction, category hints, MB removal, crafting exposure, pre-departure overlay — no balance changes, so win rate projection still valid.
- Remaining: win rate still above 25-40% target. Weather system or food economy further tuning needed.

### 31. Starting cart offload is too punishing for new players
- Opened: 2026-06-07
- Labels: balance, ux
- Summary: The initial 146.5 kg vs 100 kg overload forces players to discard items without enough information about their future utility. The offload threshold is too aggressive, removing most useful items before travel begins.
- Notes: v41 reduced starting Pemmican (20→15) and Firewood Bundle (3→2), dropping starting weight to ~128 kg. Added cart tooltip/hints (`getCategoryHint()`) so early offload is informed rather than blind. Pre-departure overlay (v43) lets players choose loadout before travel.
- Status: Resolved in v41/v43.

## Resolved

### 30. Trade panel shows duplicate buttons
- Opened: 2026-06-07
- Resolved: 2026-06-07 (v38)
- Fix: Trade buttons now labeled with item name (e.g., "Trade Bison Hide", "Trade Beaver Pelts") instead of generic "Trade"

### 29. Victory condition bypasses starvation check
- Opened: 2026-06-07
- Resolved: 2026-06-07 (v38)
- Fix: Added food/wear/morale checks before setting `S.won = true` in `travelOneDay()` arrival code. Starvation now properly detected before victory.

### 28. Trim dead features
- Opened: 2026-06-06
- Resolved: 2026-06-07 (v34)
- Fix: Removed factionPref (items), old squeal stat system, EventBus class, createShell(), Node class, dead constants (MAX_CART_KG, CREW_STATES), duplicate ferry_gabriel event, FALLBACK_EVENTS/EVENTS confusion. ~120 lines removed.

### 27. Build script strips cache-bust query string on rebuild
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Updated build script regex to match `app.js?v=N` query strings, and added auto-bump so a fresh version is written to `dist/index.html` on every build.

### 14. Conditional endings
- Opened: 2026-06-04
- Resolved: 2026-06-07 (v36)
- Fix: 6 ending types implemented — Triumphant (score ≥ 1400), Humble (score < 1400), Starvation (food ≤ 0), Cart Failure (wear ≥ 5), Winter's Grasp (overwinter), Crew Abandoned (morale ≤ 0). Each with narrative, source quote, scoring breakdown, and improvement tip.

### 20. Gossip mechanic needs tangible benefit
- Opened: 2026-06-04
- Resolved: 2026-06-06 (v26)
- Fix: Gossip generates trail intel (river_hint, nwmp_hint, heal_hint, trade_hint, morale_hint, fuel_hint, trail_hint) with freshness indicators (🟢🟡🔴), 50% chance of DC+2 bonus, trade_hint gives +3 food on next trade.

### 18. Deeper event/encounter text with rich narrative scenarios
- Opened: 2026-06-04
- Resolved: 2026-06-06 (v24)
- Fix: All 55 events expanded to 2-4+ sentences with vivid historical detail. Each uses `getSource('KEY')` pattern with thematic source quote. 35 source entries in archive.

### 16. Deepen and enhance economy and trade
- Opened: 2026-06-04
- Resolved: 2026-06-06 (v26)
- Fix: TradeMultiplier by settlement type × item category × trail position. 3 crafting recipes. Per-item yield estimates with ↑/↓ in trade UI.

### 3. Use research-archive for source citations
- Opened: 2026-06-03
- Resolved: 2026-06-06 (v24)
- Fix: All 55 events cross-walked to `src/data/sources/index.js` entries. 35 primary source entries created.

### 25. Map bootstrap aborts with "Invalid LatLng: (NaN, NaN)"
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Guarded `state.segmentDay` default to `0` in `updateMap()`.

### 26. Begin Journey button click does nothing despite bindings
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Exposed `window.__METIS_RENDER__ = render`. Event delegation on `#game-root` instead of direct button binding.

### 4. Ship art assets into public path
- Opened: 2026-06-04
- Resolved: 2026-06-05

### 7. Update User marker
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Summary: Pixel art cart marker replacing generic dot.

### 8. Users should move more slowly along the line
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Fix: Cart position interpolates between nodes based on segmentDay/dist.

### 9. Show full trail line at beginning of journey
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Fix: Full trail drawn as faint dashed polyline in initMap().

### 11. Dice rolls should be click to dismiss
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 19. Post-dice-roll outcome text + hide original choices during roll
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 21. Intro screen flashes and disappears immediately
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 22. Action buttons not visible without scrolling on mobile
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 23. Map should start zoomed in closer to show cart progression
- Opened: 2026-06-05
- Resolved: 2026-06-05

### 24. Map needs aged/historical appearance — not modern OSM tiles
- Opened: 2026-06-05
- Resolved: 2026-06-05

### 17. Map doesn't render — initMap only called on Begin Journey click
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 10. Map blank — Leaflet CDN unreachable over Tailscale
- Opened: 2026-06-04
- Resolved: 2026-06-04

### 3. Docs/ and dist/ need cleanup
- Opened: 2026-06-03
- Resolved: 2026-06-04

### 2. Import cart-trail engine modules from test/
- Opened: 2026-06-03
- Resolved: 2026-06-04

### 1. GitHub Pages deploy fails — missing dist/
- Opened: 2026-05-31
- Resolved: 2026-06-04
