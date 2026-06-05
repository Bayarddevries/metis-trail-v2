# Changelog

All notable changes are documented here. Format loosely follows Keep a Changelog.

## Unreleased

### Fixed
- `updateMap({node:0})` passed no `segmentDay`, producing `NaN` in cart interpolation → Leaflet `Invalid LatLng` → bootstrap aborts → Begin Journey button did nothing. Guarded with `(state.segmentDay || 0)`.
- `window.__METIS_RENDER__ = render` exposed after esbuild ESM output so `addEventListener` arrow functions can trigger re-renders.
- Event delegation for Begin Journey moved from `#intro-overlay` to `#game-root` so the listener survives `render()` DOM rebuilds.
- Build script regex now matches `app.js?v=N` query strings and auto-bumps the cache-bust version on every build.
- `_metisMapInited` guard removed from `render()` because it prevented map init from ever firing on first render.

### Changed
- Cache-bust version auto-managed by build; removed manual template edits.
- All resolved issues marked closed in GitHub.

### Docs
- ISSUES.md fully reconciled with repo state.
- CHANGELOG.md updated through current commits.

### Tracked Issues
- #25 — Map bootstrap aborts with "Invalid LatLng" RESOLVED
- #26 — Begin Journey button click does nothing RESOLVED
- #27 — Build script strips cache-bust query string RESOLVED

## [v0.5.1] - 2026-06-05

### Fixed
- Intro overlay stays visible on load instead of flashing and disappearing.
- Begin Journey button sticky at bottom of intro card.
- Mobile: action buttons always visible without scrolling (sticky controls bar).
- Mobile: proper viewport height using `100dvh`, narrative compacted to `18vh` max.
- Leaflet CSS/JS bundled locally; no CDN dependency.
- Map tiles styled with sepia/saturate CSS filter for aged/historical appearance.
- Map starts at zoom 9 centered on Fort Garry bounding box.
- Full trail rendered as faint dashed line from start.
- Cart position interpolates between nodes day-by-day with smooth `panTo`.
- Dice click-to-dismiss with outcome text, pass/fail colors, hidden choices, compact mechanical summary.

### Changed
- Live at https://bayarddevries.github.io/metis-trail-v2/

## [v0.5-playable] - 2026-06-04

### Added
- First fully playable public release via GitHub Pages.
- Day/month/season UI advances in status bar during travel.
- Cart marker icon rendered at 100x48 on map via Leaflet `L.icon`.
- esbuild image file loaders (`.png`, `.jpg`, `.svg`).

### Fixed
- Cross-module map initialization fix so route tiles render.
- Cart marker aspect ratio corrected (100x48 matching ~2.1:1 source ratio).

### Docs
- Marked release baseline for continuing development.
