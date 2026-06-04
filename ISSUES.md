# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

None currently.

## Resolved

### 11. Dice rolls should be click to dismiss
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Summary: Dice animation now ends with dramatic settle pose (scale bounce + pass/fail color glow). Outcome text shown inside overlay. Continue button appears — user clicks to dismiss. Non-dice events also get Continue button for consistency.

### 10. Map blank — Leaflet CDN unreachable over Tailscale
- Opened: 2026-06-04
- Resolved: 2026-06-04
- Fix: Bundled Leaflet CSS/JS locally in dist/, switched template to local references. Map initializes during bootstrap.

### 3. Docs/ and dist/ need cleanup
- Opened: 2026-06-03
- Resolved: 2026-06-04
- Summary: Cleaned stale build artifacts from dist/, added .gitignore entries.

### 2. Import cart-trail engine modules from test/
- Opened: 2026-06-03
- Resolved: 2026-06-04
- Summary: Engine modules consolidated into src/systems/.

### 1. GitHub Pages deploy fails — missing `dist/`
- Opened: 2026-05-31
- Resolved: 2026-06-04
- Fix: Build pipeline fixed; `npm run build` writes `dist/` correctly. CI deploy verified.
