# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 18. Deeper event/encounter text with rich narrative scenarios
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Event text needs to be 2-4+ sentences with vivid historical detail, terrain-specific flavor, and primary source citations. Currently too thin/brief.

### 19. Post-dice-roll outcome text + hide original choices during roll
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Labels: enhancement
- Summary: (1) All choice buttons hide when any choice is clicked. (2) After dice settles, flavor text from event data shown with green/red styling. (3) Compact mechanical summary (Food/Wear/Morale/Crew) shown below flavor text. Non-dice events also show flavor + mechanical in overlay.

### 20. Gossip mechanic needs tangible benefit
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Gossip action at settlements is currently empty. Should give mechanical advantage: trail condition preview, dice bonus, shortcut discovery, trade price intel, or morale boost. Needs narrative flavor text too.

### 21. Intro screen flashes and disappears immediately
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Removed render() call from bootstrap that was hiding intro overlay. Begin Journey button is now sticky at bottom of intro card.

### 22. Action buttons not visible without scrolling on mobile
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Controls bar is sticky at bottom on mobile. Used 100dvh for proper mobile viewport. Narrative compacted to 18vh max.

### 23. Map should start zoomed in closer to show cart progression
- Opened: 2026-06-05
- Labels: enhancement
- Summary: Map starts too zoomed out. Hard to see cart progression. Should start zoomed in enough that current position, next 2-3 nodes, and movement between nodes are clearly visible.

### 24. Map needs aged/historical appearance — not modern OSM tiles
- Opened: 2026-06-05
- Labels: enhancement
- Summary: Modern OSM tiles show highways, contemporary infrastructure. Need period-appropriate late-1800s look: no modern roads, aged/parchment style, terrain-focused (rivers, lakes, prairie). Must work offline.

## Resolved

### 17. Map doesn't render — initMap only called on Begin Journey click
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Moved initMap() to bootstrap so map is ready when intro is dismissed.

### 11. Dice rolls should be click to dismiss
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Summary: Dice animation ends with dramatic settle pose. Outcome text shown. Continue button dismisses.

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

### 1. GitHub Pages deploy fails — missing `dist/`
- Opened: 2026-05-31
- Resolved: 2026-06-04
