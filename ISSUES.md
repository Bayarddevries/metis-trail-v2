# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

## Active

None.

## Resolved

### 1. GitHub Pages deploy fails — missing `dist/`
- Opened: 2026-05-31
- Resolved: 2026-06-04
- Fix: Build pipeline fixed; `npm run build` writes `dist/` correctly. CI deploy verified.

### 2. Local build fails on import path resolution
- Opened: 2026-05-31
- Resolved: 2026-06-04
- Fix: Import paths corrected in `src/main.js`; `mount` and `find` exports added to `src/ui/shell.js`.
