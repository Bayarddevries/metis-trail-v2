# Pitfalls & Lessons Learned

This file captures patterns that already caused failures in this project. Future agents should treat it as required reading before changing build or deploy code.

## Build pipeline
- `scripts/build.mjs` writes the bundle to `dist/app.js` and the page to `dist/index.html`.
- GitHub Pages deploy workflow archives `dist/`. If `dist/` is missing or empty, Pages deploy fails with `tar: dist: Cannot open: No such file or directory`.
- After any build-related change, verify with:
  - `npm run build`
  - `ls dist`
- If `npm run build` fails, do not try to open a link. Fix the build first.

## Import paths
- `src/main.js` imports shell, renderer, debug, persistence from the `ui/` folder, not directly from `src/`.
- `src/ui/debug.js` imports the event bus from `../systems/events.js`.
- If you add a new module, update imports in dependent files; do not assume esbuild will resolve symbol names automatically.

## Exports
- `src/ui/shell.js` must export `mount` and `find`.
- If `main.js` reports `No matching export`, the issue is in the exporting module, not in import syntax.

## Image assets
- esbuild needs explicit `loader` config for image files (`.png`, `.jpg`, `.svg`). Without it, `import` statements on image paths fail at build time.
- Use `L.icon` + `L.marker` for Leaflet custom markers, not `L.circleMarker`. Set `iconSize` to match the source image aspect ratio to avoid visual distortion.
- Always verify marker icon renders at correct proportions in the browser after build.

## Permissions and approvals
- Do not run `rm -rf` or other destructive commands without explicit approval.
- Do not push to `main` until changes are verified locally.

## History policy
- Do not synthesize historical content. Use sources from `src/data/sources/index.js`.
- If a source is missing, add a TODO comment instead of inventing narration.
