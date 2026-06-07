# HANDOFF — Metis Trail V2

## Current State (v31)

- **Build**: `dist/app.js?v=31`, `src/template.html` at `?v=30`
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Local test**: `http://100.108.183.33:8081/index.html`

## Verified Working

- Overload guard fires: cart shows **146.5 / 100 kg — Overloaded**
- Unload buttons remove items; cart auto-closes when under capacity
- Settlement close (✕) button clears `pendingSettlement` — no more stuck travel
- **Settlement overlays show correctly** at St. Boniface, St. Norbert, St. François Xavier
- Trade panel shows per-item yield estimates with ↑/↓ indicators
- Craft panel shows recipes filtered by settlement type
- Gossip mechanic generates trail intel with freshness indicators
- Source-quote rendering in event overlay
- All 55 events verified with `getSource()` key alignment
- 35 source entries in archive

## Known Issues

### Build version drift
Build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html`.

### `factionPref` unused
Items have `factionPref` field but no code reads it.

### Missions can't trade
Settlements with `type: 'mission'` don't offer trade. May be intentional.

### `generateGossip` possibly tree-shaken
Not grep-able in bundle but may still work at runtime.

## Critical Code Paths

### Travel flow
1. `travelOneDay()` in `src/main.js` — overload guard, then `game.travelOneDay()`
2. `travelOneDay()` in `src/systems/engine.js` — advances day, checks arrival, sets `pendingSettlement`
3. Travel button returns early if `pendingSettlement` is set

### Settlement dismissal
- "Continue West" → `settlementAction('continue')` → clears `pendingSettlement` → re-renders
- "✕" close button → same (fixed in v30)

### Weight system
- Starting cart: **146.5 kg** (overloaded by 46.5 kg)
- `capacity: 100` in engine
- `totalWeight(cart)` → `cart.reduce((s, i) => s + i.wt * i.count, 0)`

### Trade/Craft (added v31)
- `getTradeEstimate(itemName)` — `{min, max, mult}` based on settlement type × item category × trail position
- `tradeItem(itemName)` — trades specific item, returns `{item, foodGain}`
- `getAvailableRecipes()` — recipes filtered by settlement type with `have` counts
- `craftRecipe(recipeId)` — consumes inputs, adds crafted output
- 3 recipes: Finished Hides (HBC), Travois Kit (metis), Gunpowder Pack (NWMP)

## Build & Deploy

```bash
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs
# Sync src/template.html version to match dist/index.html
git add -A && git commit -m "..." && git push
# GitHub Actions auto-deploys to GitHub Pages
```

## Server

```bash
cd /home/bayarddevries/metis-trail-v2-repo/dist
python3 -m http.server 8081 --bind 0.0.0.0
```
