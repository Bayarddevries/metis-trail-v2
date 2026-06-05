# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 18. Deeper event/encounter text with rich narrative scenarios
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Event text needs to be 2-4+ sentences with vivid historical detail, terrain-specific flavor, and primary source citations. Currently too thin/brief.

### 20. Gossip mechanic needs tangible benefit
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Gossip action at settlements is currently empty. Should give mechanical advantage: trail condition preview, dice bonus, shortcut discovery, trade price intel, or morale boost. Needs narrative flavor text too.

### 16. Deepen and enhance economy and trade
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Trade should expand beyond basic food-for-hide exchanging. More items, varied prices, meaningful player choice.

### 15. Allow users to spend starting money to pack their original cart
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Pre-departure cart packing phase with budget/space constraints. Player-driven starting loadout.

### 14. Conditional endings
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Different ending narratives based on player stats (worn out vs. wealthy). Pairs with scoring.

### 13. Weather system addition
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Daily weather modifiers influencing events, outcomes, morale, and wear.

### 12. Add in concrete user scores and highscoring
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Score tracking and leaderboard by outcome type (money, speed, survival).

### 10. Build out basic icons
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Replace basic UI icons with themed artwork.

### 6. Review content for AI writing trends.
- Opened: 2026-06-04
- Labels: 
- Summary: Audit all written copy using hermes skills to surface AI-isms and improve voice authenticity.

### 5. Add in Testing (headless and browser)
- Opened: 2026-06-04
- Labels: 
- Summary: Headless sim testing for balance/bug discovery plus browser-based click-through QA.

### 3. Use research-archive for source citations
- Opened: 2026-06-03
- Labels: enhancement, p3
- Summary: Cross-walk research reports into src/data/sources/index.js or node notes.

## Resolved

### 25. Map bootstrap aborts with "Invalid LatLng: (NaN, NaN)"
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Guarded `state.segmentDay` default to `0` in `updateMap()`. `initMap()` calls `updateMap({node:0})` with no segmentDay, producing NaN in cart interpolation and crashing Leaflet.

### 26. Begin Journey button click does nothing despite bindings
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Two-part fix. (1) Exposed `window.__METIS_RENDER__ = render` because esbuild ESM bundling prevented `render()` from resolving inside `addEventListener` arrow functions. (2) Event delegation on `#game-root` instead of `#intro-overlay`/button because `render()` destroys child DOM on each call, taking bound listeners with it.

### 27. Build script strips cache-bust query string on rebuild
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Updated build script regex to match `app.js?v=N` query strings, and added auto-bump so a fresh version is written to `dist/index.html` on every build.

### 4. Ship art assets into public path
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Summary: Art assets available for use in built output.

### 7. Update User marker
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Summary: Pixel art cart marker replacing generic dot.

### 8. Users should move more slowly along the line
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Fix: Cart position interpolates between nodes based on segmentDay/dist. Map smoothly pans to follow cart.

### 9. Show full trail line at beginning of journey
- Opened: 2026-06-04
- Resolved: 2026-06-05
- Fix: Full trail drawn as faint dashed polyline in initMap(), visible from start behind intro overlay.

### 11. Dice rolls should be click to dismiss
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Summary: Dice animation ends with dramatic settle pose. Outcome text shown. Continue button dismisses.

### 19. Post-dice-roll outcome text + hide original choices during roll
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Summary: All choice buttons hide on click. Outcome flavor text from event data shown with green/red styling. Compact mechanical summary below flavor text. Non-dice events also show flavor + mechanical in overlay.

### 21. Intro screen flashes and disappears immediately
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Removed render() call from bootstrap. Sticky Begin Journey button.

### 22. Action buttons not visible without scrolling on mobile
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Controls bar sticky at bottom on mobile. 100dvh. Narrative compacted to 18vh max.

### 23. Map should start zoomed in closer to show cart progression
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: Initial zoom 9 centered on Fort Garry bounding box.

### 24. Map needs aged/historical appearance — not modern OSM tiles
- Opened: 2026-06-05
- Resolved: 2026-06-05
- Fix: CSS filter sepia(0.6) saturate(0.4) on .leaflet-tile-pane.

### 17. Map doesn't render — initMap only called on Begin Journey click
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Moved initMap() to bootstrap so map is ready when intro is dismissed.

### 10. Map blank — Leaflet CDN unreachable over Tailscale
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Bundled Leaflet CSS/JS locally in dist/.

### 3. Docs/ and dist/ need cleanup
- Opened: 2026-06-03
- Resolved: 2026-06-04

### 2. Import cart-trail engine modules from test/
- Opened: 2026-06-03
- Resolved: 2026-06-04

### 1. GitHub Pages deploy fails — missing dist/
- Opened: 2026-05-31
- Resolved: 2026-06-04
