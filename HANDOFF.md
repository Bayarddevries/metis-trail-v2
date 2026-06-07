# HANDOFF — Metis Trail V2

## Current State (v30)

- **Build**: `dist/app.js?v=30` (dist), `src/template.html` at `?v=29`
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Local test**: `http://100.108.183.33:8081/index.html` (python3 http.server, serves `dist/`)

## Verified Working

- Overload guard fires correctly: cart shows **146.5 / 100 kg — Overloaded**
- Unload buttons remove items, cart auto-closes when under capacity
- Settlement close (✕) button clears `pendingSettlement` — no more stuck travel
- Gossip mechanic generates trail intel with freshness indicators
- Trade economy with per-item yield estimates and ↑/↓ indicators
- Crafting recipes (Finished Hides, Travois Kit, Gunpowder Pack)
- Source-quote rendering in event overlay (#event-source div)
- All 55 events verified with `getSource()` key alignment
- 35 source entries in archive

## Known Issues

### #inv-list empty on overload auto-open
When the overload guard auto-opens the cart overlay (travel attempt while overloaded), `showCart(game)` is called but `#inv-list` may be empty. The function runs but the innerHTML render might not populate if the DOM element isn't ready. Needs investigation — manually clicking Cart button works fine.

### Build version drift
Build script (`scripts/build.mjs`) bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match. The src template is the source of truth for the next build's bump.

### `generateGossip` possibly tree-shaken
`generateGossip` function may be tree-shaken by esbuild — not grep-able in bundle but may still work at runtime. Verify gossip still generates intel after builds.

### `factionPref` unused
Items have `factionPref` field but no code reads it. Trade multiplier uses settlement type × item category × trail position only.

### Missions can't trade
Settlements with `type: 'mission'` (St. Boniface, Humboldt) don't offer trade. This may be intentional.

## Critical Code Paths

### Travel flow
1. `travelOneDay()` in `src/main.js` — overload guard check, then `game.travelOneDay()`
2. `travelOneDay()` in `src/systems/engine.js` — advances day, checks segment arrival, sets `pendingSettlement`
3. Travel button handler returns early if `pendingSettlement` is set (line 54-55)

### Settlement dismissal
- "Continue West" button → `game.settlementAction('continue')` → clears `pendingSettlement` → re-renders
- "✕" close button → same as above (fixed in v30)

### Weight system
- `ITEMS` array in `src/data/items.js` — each item has `wt` (per-unit kg) and `count`
- `totalWeight(cart)` → `cart.reduce((s, i) => s + i.wt * i.count, 0)`
- `capacity: 100` in engine state
- Starting cart: **146.5 kg** (overloaded by 46.5 kg)

## Build & Deploy

```bash
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs
# Manually sync src/template.html version to match dist/index.html
git add -A && git commit -m "..." && git push
# GitHub Actions auto-deploys to GitHub Pages
```

## Server

```bash
# Local test server (if not already running)
cd /home/bayarddevries/metis-trail-v2-repo/dist
python3 -m http.server 8081 --bind 0.0.0.0
```
