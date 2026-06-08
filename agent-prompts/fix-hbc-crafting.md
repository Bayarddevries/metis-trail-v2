# Agent Prompt: Fix HBC Crafting Recipe Reachability (#33)

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. The current uncommitted state is v44.

## Bug
Recipe `finished_hides` exists with `settlement: 'hbc'` in `getAvailableRecipes()`, but HBC's action list does not expose `'craft'`. Players can never access HBC crafting.

## Your Task

### 1. Read the relevant code
- `src/systems/engine.js` — find `availableSettlementActions()` and `getAvailableRecipes()`
- `src/data/items.js` or `src/data/recipes.js` — find `finished_hides` recipe definition
- Confirm what settlement types currently have `'craft'` in their action lists (likely `metis`, `nwmp`)

### 2. Choose a fix and implement it
**Option A (add craft to HBC):** Add `'craft'` to HBC's action list in `availableSettlementActions()`.

**Option B (reassign recipe):** Change `finished_hides` recipe `settlement` field to a type that already exposes crafting (e.g., `'metis'` or `'nwmp'`).

Pick one. Either works.

### 3. Verify
Run `bun scripts/build.mjs` and confirm exit 0. Then in browser, reach Fort Edmonton (or whichever HBC node has crafting) and confirm the "Craft" action appears in the settlement overlay.

### 4. Commit
```bash
git add -A
git commit -m "fix: expose HBC crafting for finished_hides recipe (#33)"
```

## Constraints
- Do not edit files in `dist/`
- Minimal changes — only touch what's needed
- Conventional commit only
