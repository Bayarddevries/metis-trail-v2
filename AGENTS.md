# AGENTS.md

This file is the contract for any agent or contributor working on `metis-trail-v2`.

## Your job
- Advance the TODO without creating ambiguity for the next agent.
- Do not ship undocumented history; prefer a TODO over invented content.

## First actions
1. Read `README.md`, `TODO.md`, `ISSUES.md`, and `CHANGELOG.md` before editing code.
2. **Check GitHub issues**: Run `gh issue list --state open` to see all open bugs and features. These are the authoritative source for what needs to be worked on. Issues labeled `bug` take priority over `enhancement`.
3. Run `bun scripts/build.mjs` and confirm `dist/` contents before attempting to open URL.
4. Run `git status` to check for uncommitted changes before starting work.

## Code rules
- Keep changes minimal and contained to `src/`.
- Do not edit generated files in `dist/`.
- Follow conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Any historical narrative must cite `src/data/sources/index.js` or leave a clear placeholder.
- Every engine method called from `main.js` MUST exist on the engine's public API — add it before wiring the UI.

## Permissions and limits
- Do not run destructive commands without explicit user approval.
- Do not make claims about public URLs without verified evidence from the workflow or a local file check.
- If blocked by an environment issue, log it in `ISSUES.md` with evidence and stop.

## Handoff expectations
- Update `TODO.md` status.
- Append a dated note to `CHANGELOG.md`.
- If you made any architectural decision or discovered a pitfall, update `AGENTS.md`.
- Write/update `HANDOFF.md` with current state, verified working features, and known issues.
- Commit and push all changes — do not leave uncommitted work.

## Commit message conventions

All commits must use the following format:

```
<type>(<scope>): <concise description>
```

Types — use exactly one:
- `feat:` — new feature or content (events, items, nodes, UI panels)
- `fix:` — bug fix (engine logic, UI rendering, broken behavior)
- `docs:` — documentation only (AGENTS.md, HANDOFF.md, ISSUES.md, CHANGELOG.md, comments)
- `chore:` — tooling, build, dependencies, formatting, no game logic changes
- `balance:` — win rate, difficulty, economy tuning (constants, event tuning, probabilities)

Scope — optional but encouraged for clarity:
- `engine`, `events`, `items`, `nodes`, `sources`, `ui`, `renderer`, `persistence`, `firebase`, `map`, `build`

Rules:
- Imperative mood: "add feature" not "added feature" or "adds feature"
- No period at end of subject line
- Keep subject under 72 characters
- One logical change per commit — do not bundle unrelated fixes

Examples:
```
feat(events): add cart_fortress defensive circle event
fix(engine): Medicine Pouch now consumed by cholera event
docs(handoff): add v70 women/children session summary
chore(build): bump version to v78
balance(constants): DAILY_FOOD 1.2 → 1.35 for win rate normalization
```

## Known Pitfalls
- **Map initialization timing**: `initMap()` must be called during `bootstrap()`, not deferred to user interaction. If the intro overlay is dismissed (e.g., saved game), the map must already be ready. Always init the map in bootstrap; the intro overlay sits on top.
- **CDN dependencies**: Do not rely on CDN-hosted assets (unpkg.com, etc.) — the Tailscale network may not reach them. Bundle all dependencies locally.
- **Build command**: Use `bun scripts/build.mjs` (npm is broken in this environment).
- **Browser verification**: Always verify map rendering in browser after build. Check `L` is defined, tile pane exists, and markers are present. Verify settlement overlays appear after any engine API changes.
- **Build version drift**: The build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match the new version, or the next build will double-increment. The src template is the source of truth for the next build's bump.
- **Event source citation standard**: Every event must use `getSource('KEY')` — never inline source objects. When adding a new event: (1) add the source entry to `src/data/sources/index.js` first, (2) reference it with `getSource('KEY')` in the event, (3) verify the quote text thematically matches the event narrative. Run the source-quote audit after any event changes.
- **Source-quote alignment**: When writing event text, the `source.quote` should thematically match the event's content. A fire event needs a fire quote, a river crossing needs a river quote. Mismatches break immersion. Always cross-check.
- **`pendingSettlement` blocks travel**: `travelOneDay()` returns early if `state.pendingSettlement` is set. The settlement overlay must be dismissed (Continue West) before travel resumes. This is by design. Both "Continue West" and "✕" must call `settlementAction('continue')`.
- **Overload guard auto-opens cart**: When `usedWeight > capacity`, the cart overlay auto-opens on travel attempt. This is the overload guard working as intended. Starting cart is 146.5 kg vs 100 kg capacity — player must unload before first travel.
- **Engine API methods must exist before UI calls them**: If `main.js` calls `game.someMethod()`, that method MUST be defined on the engine's return object. A missing method causes a JS error that silently kills the entire render function — no overlay appears, no error shown to player. Always verify the full chain: engine method exists → UI calls it → overlay renders in browser.
- **HBC crafting recipe unreachable**: Recipe `finished_hides` is defined with `settlement: 'hbc'` but HBC's `availableSettlementActions()` does NOT include `'craft'`. Either add `'craft'` to HBC actions or reassign the recipe. This is a dangling feature — data exists but is unreachable.
- **Item field name is `wt` not `weight`**: Items in `src/data/items.js` use `wt` for weight. Using `weight` returns undefined and silently breaks calculations.
- **GitHub issues are the authoritative backlog**: Always check `gh issue list --state open` before starting work. The local ISSUES.md is outdated. GitHub issues are the source of truth for bugs and features. Bugs take priority over enhancements.
- **Do NOT overwrite `src/template.html`**: Use `patch` for targeted edits only. The build script reads from it. Never use `write_file` to replace the entire template.
- **Build script does NOT inject into template**: The build script only injects `__METIS_ASSETS__` into `dist/index.html`. The template is the source of truth and should never contain duplicate script blocks.
- **Weather wear multipliers stack with terrain**: Weather wear multipliers (rain ×1.25, storm ×1.5) multiply the base terrain wear chance, not add to it. A plains day in storm = 0.10 × 1.5 = 0.15 wear chance. Don't accidentally add instead of multiply.
- **Season gating in `advanceWeather()`**: When a Markov transition picks a weather state impossible for the current season (snow in summer), the fallback is `overcast`. This is intentional — the `SEASON_BASE_WEATHER` weights naturally prevent impossible states on new-season transitions, but the safety net catches edge cases.
- **Headless testing: engine import path**: `src/systems/engine.js` uses relative imports (`../data/...`). You can't `import` it directly from Node/bun. Bundle a test entry point with esbuild instead, or use the dist bundle. See HANDOFF.md Phase 6 for details.
- **Playtesting harness should use randomized choices**: Don't script optimal play — random choices surface real balance issues. Weight choices reasonably (e.g., 70% "sensible" vs 30% "risky") for more realistic simulation.
- **Stale cart reference in offload loops**: When offloading items to reach capacity, never cache `game.getCart()` in a variable and then loop — `offloadItem()` mutates the internal cart, so cached references go stale. Always call `game.totalWeight()` and `game.getCart()` fresh inside the loop. See `tests/simulate-entry.js` for correct pattern.
- **Item field name is `wt` not `weight`**: Items in `src/data/items.js` use `wt` for weight. Using `weight` returns undefined and silently breaks calculations.
