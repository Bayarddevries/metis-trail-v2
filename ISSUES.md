# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 26. Begin adding in location/node markers
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
- **STATUS: ACTIVE — Next agent priority (Phase 6)**
- Two tracks:
  1. **Headless**: Automated simulations using the real engine (`src/systems/engine.js`). Run 100+ games with random choices. Aggregate: win rate, avg score, death reasons, item usage. Goal = balance tuning + bug discovery.
  2. **Browser click-through**: Visual QA on live site (https://bayarddevries.github.io/metis-trail-v2/). Full flow: intro → travel → events → settlement → endings. Mobile verification.
- See HANDOFF.md Phase 6 for implementation notes (engine import path issue, esbuild bundling approach).

## Resolved

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
