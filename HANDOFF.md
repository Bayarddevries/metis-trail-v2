# HANDOFF — Metis Trail V2

## Current State (v31)

- **Build**: `dist/app.js?v=31`, `src/template.html` at `?v=29` (known drift — sync after build)
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Local test**: `http://100.108.183.33:8081/index.html`
- **Branch**: `main`, clean working tree

## Verified Working (v31)

- Overload guard fires: cart shows **146.5 / 100 kg — Overloaded**
- Unload buttons remove items; cart auto-closes when under capacity
- Settlement close (✕) button clears `pendingSettlement` — no more stuck travel
- **Settlement overlays show correctly** at St. Boniface, St. Norbert, St. François Xavier
- Trade panel shows per-item yield estimates with ↑/↓ indicators
- Craft panel shows recipes filtered by settlement type
- Gossip mechanic generates trail intel with freshness indicators (🟢🟡🔴)
- Source-quote rendering in event overlay (`#event-source` div)
- All 55 events verified with `getSource()` key alignment
- 35 source entries in archive
- Full travel chain verified: Fort Garry → St. Boniface → St. Norbert → St. François Xavier

## What Was Fixed in v31

### Settlement overlay never showed (critical)
`showSettlement()` in `main.js` called `game.getTradeEstimate()` — a method referenced in UI code but **never implemented in the engine**. The JS error silently killed the entire render function. `pendingSettlement` was correctly set by the engine, but the overlay never got `display:block`. Fixed by adding all four missing methods to `src/systems/engine.js`:
- `getTradeEstimate(itemName)` → `{min, max, mult}`
- `tradeItem(itemName)` → trades specific item, returns `{item, foodGain}`
- `getAvailableRecipes()` → recipes filtered by settlement type with `have` counts
- `craftRecipe(recipeId)` → consumes inputs, adds crafted output

### Root cause
The trade/craft UI was built against an API that didn't exist. The methods were called in `showSettlement()` but never defined in the engine's public API. No error was visible to the player — the overlay just never appeared.

## Known Issues

### Build version drift
Build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match. Current: src at v29, dist at v31.

### `factionPref` unused
Items have `factionPref` field but no code reads it. Dead data.

### Missions can't trade
Settlements with `type: 'mission'` don't offer trade. May be intentional — verify with designer.

### `generateGossip` possibly tree-shaken
Not grep-able in esbuild bundle but works at runtime. Monitor.

### Mobile top bar clipped (GitHub issue #27)
Top bar not fully visible in portrait mode. CSS fix needed — likely `100dvh` or padding.

### Cart overlay: no item count in unload buttons
Buttons show "Unload −X kg" but not which item. Minor UX issue.

## Critical Code Paths

### Travel flow
1. `travelOneDay()` in `src/main.js` — overload guard checks `usedWeight > capacity`, auto-opens cart if over
2. `travelOneDay()` in `src/systems/engine.js` — advances day, fires events, checks arrival, sets `pendingSettlement`
3. Travel button returns early if `pendingSettlement` is set (by design)

### Settlement dismissal
- "Continue West" → `settlementAction('continue')` → clears `pendingSettlement` → re-renders
- "✕" close button → same path (fixed in v30, was only hiding DOM before)

### Settlement overlay rendering
- `showSettlement()` in `main.js` calls `game.getTradeEstimate()`, `game.getAvailableRecipes()`, `game.tradeItem()`, `game.craftRecipe()`
- All four methods must exist on the engine's public API — if any are missing, the entire overlay silently fails
- **Always verify settlement overlay appears after any engine API changes**

### Weight system
- Starting cart: **146.5 kg** (overloaded by 46.5 kg vs 100 kg capacity)
- `capacity: 100` in engine state
- `totalWeight(cart)` → `cart.reduce((s, i) => s + i.wt * i.count, 0)`
- Items use `wt` field (NOT `weight`)

### Trade/Craft system
- `tradeMultiplier(settlementType, category, trailPosition)` → multiplier
  - HBC pays 1.3× for furs, Métis pays 1.3× for repair, mission pays 1.2× for ammo, NWMP pays 1.2× for trade/furs
  - Trail arc: early (nodes 0–4) furs +20%, food −20%; late (nodes 9–12) food +30%, repair +30%, furs −20%
- 3 crafting recipes: Finished Hides (HBC), Travois Kit (metis), Gunpowder Pack (NWMP)
- Gossip `trade_hint` bonus: +3 food on next trade at mentioned settlement

### Item system
- 12 items with categories: `furs`, `repair`, `ammo`, `trade`, `food`, `shelter`, `fuel`, `hunting`, `medical`
- Event choice fields: `itemBonus` (DC reduction), `consumesItem` (auto-success + consume), `requiresItem` (gate + consume)
- All 12 items wired into repair/rest/heal/event systems

### Gossip/intel system
- Costs 1 day, generates `trailIntel` entries with `expiresOnDay`
- Intel types: `river_hint`, `nwmp_hint`, `heal_hint`, `trade_hint`, `morale_hint`, `fuel_hint`, `trail_hint`
- 50% chance intel includes DC +2 bonus on matching events
- Rendered in `#trail-intel` div with 🟢🟡🔴 freshness

### Source citation system
- All 55 events use `getSource('KEY')` pattern — never inline source objects
- 35 source entries in `src/data/sources/index.js`
- Quotes rendered in `#event-source` div in event overlay
- All quotes verified for thematic alignment with event content

## Build & Deploy

```bash
cd /home/bayarddevries/metis-trail-v2-repo
bun scripts/build.mjs
# Sync src/template.html version to match dist/index.html
git add -A && git commit -m "feat/fix: ..." && git push
# GitHub Actions auto-deploys to GitHub Pages
```

## Server

```bash
cd /home/bayarddevries/metis-trail-v2-repo/dist
python3 -m http.server 8081 --bind 0.0.0.0
```

## Next Priorities (in order)

1. **GitHub issue #27** — Mobile top bar clipped in portrait (CSS fix, high priority — blocks mobile testing)
2. **GitHub issue #26** — Add location/node markers on map (Leaflet markers for settlements)
3. **GitHub issue #15** — Pre-departure cart packing (let players choose starting loadout)
4. **GitHub issue #13** — Weather system (seasonal travel/event effects)
5. **GitHub issue #14** — Conditional endings (multiple ending paths)
6. **GitHub issue #12** — Score/leaderboard (end-game scoring)
7. **GitHub issue #28** — Trim dead features/options (cleanup)
8. **GitHub issue #10** — Basic icons (UI icon set)
9. **TODO: Second half of Carlton Trail nodes** — nodes past Fort Edmonton with citations
10. **TODO: Scout/guide hire moral choices** — history-anchored decisions
11. **TODO: `mountDebugUI` with `?debug=1`** — conditional debug panel
12. **TODO: Unit tests** — calendar and PRNG
13. **TODO: Save/load validation** — schema version migration

## Files Modified (this session)

- `src/systems/engine.js` — added getTradeEstimate, tradeItem, craftRecipe, getAvailableRecipes
- `src/main.js` — settlement overlay calls the above methods
- `CHANGELOG.md` — v31 entry
- `HANDOFF.md` — this file
