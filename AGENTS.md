# AGENTS.md

This file is the contract for any agent or contributor working on `metis-trail-v2`.

## Your job
- Advance the TODO without creating ambiguity for the next agent.
- Do not ship undocumented history; prefer a TODO over invented content.

## First actions
1. Read `README.md`, `TODO.md`, `ISSUES.md`, and `CHANGELOG.md` before editing code.
2. Run `npm run build` and confirm `dist/` contents before attempting to open any URL.

## Code rules
- Keep changes minimal and contained to `src/`.
- Do not edit generated files in `dist/`.
- Follow conventional commits.
- Any historical narrative must cite `src/data/sources/index.js` or leave a clear placeholder.

## Permissions and limits
- Do not run destructive commands without explicit user approval.
- Do not make claims about public URLs without verified evidence from the workflow or a local file check.
- If blocked by an environment issue, log it in `ISSUES.md` with evidence and stop.

## Handoff expectations
- Update `TODO.md` status.
- Append a dated note to `CHANGELOG.md`.
- If you made any architectural decision or discovered a pitfall, update `AGENTS.md` if it affects future runs.

## Known Pitfalls
- **Map initialization timing**: `initMap()` must be called during `bootstrap()`, not deferred to user interaction. If the intro overlay is dismissed (e.g., saved game), the map must already be ready. Always init the map in bootstrap; the intro overlay sits on top.
- **CDN dependencies**: Do not rely on CDN-hosted assets (unpkg.com, etc.) — the Tailscale network may not reach them. Bundle all dependencies locally.
- **Build command**: Use `bun scripts/build.mjs` (npm is broken in this environment).
- **Browser verification**: Always verify map rendering in browser after build. Check `L` is defined, tile pane exists, and markers are present.
- **Build version drift**: The build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match the new version, or the next build will double-increment. The src template is the source of truth for the next build's bump.
- **Event source citation standard**: Every event must use `getSource('KEY')` — never inline source objects. When adding a new event: (1) add the source entry to `src/data/sources/index.js` first, (2) reference it with `getSource('KEY')` in the event, (3) verify the quote text thematically matches the event narrative. Run the source-quote audit (see v25 changelog) after any event changes.
- **Source-quote alignment**: When writing event text, the `source.quote` should thematically match the event's content. A fire event needs a fire quote, a river crossing needs a river quote. Mismatches break immersion. Always cross-check.
- **`pendingSettlement` blocks travel**: `travelOneDay()` returns early if `state.pendingSettlement` is set. The settlement overlay must be dismissed (Continue West) before travel resumes. This is by design — but means the player MUST interact with settlement UI before continuing.
- **Overload guard auto-opens cart**: When `usedWeight > capacity`, the cart overlay auto-opens on travel attempt. This is the overload guard working as intended, but it means the player sees the cart overlay instead of traveling. They must unload first.
