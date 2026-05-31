# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

### 1. GitHub Pages deploy fails — missing `dist/`
- Opened: 2026-05-31
- Status: blocked
- Evidence: CI log `tar: dist: Cannot open: No such file or directory`
- Next action: verify `npm run build` actually writes `dist/` and update `scripts/build.mjs`

### 2. Local build fails on import path resolution
- Opened: 2026-05-31
- Status: blocked
- Evidence: `ERROR: Could not resolve "../systems/engine.js"` and `No matching export in "src/ui/shell.js" for import "mount"`
- Next action: fix `src/main.js` imports and export the missing symbols from `src/ui/shell.js`

## Resolved

### None yet
