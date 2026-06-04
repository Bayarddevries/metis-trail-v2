# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 18. Deeper event/encounter text with rich narrative scenarios
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Event text needs to be 2-4+ sentences with vivid historical detail, terrain-specific flavor, and primary source citations. Currently too thin/brief.

### 19. Post-dice-roll outcome text + hide original choices during roll
- Opened: 2026-06-04
- Labels: enhancement
- Summary: (1) Choice buttons should hide once dice roll begins. (2) After dice settles, show narrative outcome text describing what actually happens based on success/failure — not just "Rolled X vs DC Y".

### 20. Gossip mechanic needs tangible benefit
- Opened: 2026-06-04
- Labels: enhancement
- Summary: Gossip action at settlements is currently empty. Should give mechanical advantage: trail condition preview, dice bonus, shortcut discovery, trade price intel, or morale boost. Needs narrative flavor text too.

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
