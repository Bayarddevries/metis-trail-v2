# Agent Prompt: Fix Cart Overlay Unload Button UX

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. Current state: v44.

## Issue
When the cart overlay opens during an overload, unload buttons show text like "Unload -15 kg" but do NOT show which item is being unloaded. Players see weight reduction without knowing what they're losing.

## Your Task

### 1. Read the relevant code
- `src/main.js` — find where cart overlay renders unload buttons (look for "Unload" or "offloadItem" in the cart render logic)
- `src/ui/renderer.js` — if cart rendering is there, check there too
- Confirm: buttons likely use a template like `Unload −${item.wt * count} kg` but omit `item.name`

### 2. Fix
Change the unload button text to include the item name. Examples:
- **Before:** `Unload −15 kg`
- **After:** `Unload Pemmican Rations −15 kg` or `Unload 1× Pemmican Rations −15 kg`

Keep the existing data attributes and click handlers — only change the visible text.

### 3. Verify
Run `bun scripts/build.mjs` (exit 0). Open the game, overload the cart (start >100kg), and confirm unload buttons now show item names.

### 4. Commit
```bash
git add -A
git commit -m "fix: cart unload buttons show item name for clarity"
```

## Constraints
- Do not edit `dist/`
- Minimal change — only the button text label
- Conventional commit only
