# HANDOFF — Metis Trail V2

## Current State (v38)

- **Build**: `dist/app.js?v=38`, `src/template.html` at `?v=38` (synced)
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Local test**: `http://100.108.183.33:8081/index.html`
- **Branch**: `main`, clean working tree

## Verified Working (v38)

- All v37 features still working
- **Balance pass applied**: DAILY_FOOD 1.2, wear chances reduced, repair -2, EVENT_CHANCE 0.45, triumphant threshold 1200
- **#29 fixed**: Starvation properly detected before victory (0 wins with food ≤ 0 in 200 sims)
- **#30 fixed**: Trade buttons labeled with item name (e.g., "Trade Bison Hide")
- **Post-balance 200 sims**: win rate 66.5%, starvation 11%, cart failure 19.5%, avg events 8.5/game
- Browser QA: settlement trade buttons show item names, map renders, overlays work

## Recent Changes (v38)

### v38 — Balance Pass & Bug Fixes
- DAILY_FOOD: 1.0 → 1.2
- Wear accumulation: plains 0.08, river_valley 0.12, wooded 0.15
- Settlement repair: always -2 wear (was -1 without shaganappi)
- EVENT_CHANCE: 0.35 → 0.45
- Triumphant threshold: 1400 → 1200
- Fixed #29: starvation/wear/morale checks before victory condition
- Fixed #30: trade buttons labeled with item name

## Known Issues

### Build version drift
Build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match.

### `generateGossip` possibly tree-shaken
Not grep-able in esbuild bundle but works at runtime. Monitor.

### Cart overlay: no item count in unload buttons
Buttons show "Unload −X kg" but not which item. Minor UX issue.

### Win rate still above target
66.5% win rate after balance pass (target 25-40%). May need weather system, higher food consumption, or more aggressive event penalties.

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

### Scoring system (currently used only in endings)
- Base: 1000
- Trade goods: count × 120
- Food bonus: count × 12
- Crew condition bonus
- Days penalty: −8/day
- Wear penalty: −40 × wear²
- Threshold: ≥ 1400 = Triumphant, < 1400 = Humble

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

## Next Priorities — PHASE 6: Playtesting & Balance

The user wants **two types of testing** (GitHub issue #5):

### 1. Headless Playtesting Harness
- Run 100s of automated game simulations using the real engine (`src/systems/engine.js`)
- No UI needed — call engine methods directly: `travelOneDay()`, `settlementAction()`, event choices
- Goal: find balance issues (is the game too hard/easy?), edge cases (can you get stuck?), and economy exploits
- Suggested approach:
  - Write a test harness in `tests/simulate.js` that imports the engine
  - Run N simulations with randomized player choices
  - Log outcomes: ending type, score, days, death reason, items remaining
  - Aggregate stats: win rate, avg score, most common death, item usage frequencies
- The engine is a pure JS module with no DOM dependency — it can be `require()`/`import()`-ed directly from Node/bun
- Key engine entry point: the factory function in `src/systems/engine.js` that returns `{ getState, setState, travelOneDay, ... }`
- **IMPORTANT**: You cannot import `src/systems/engine.js` directly from bun/node because it imports from relative paths. You'll need to either:
  - Use `bun --conditions=source tests/simulate.js` (if bun supports it), or
  - Create a bunfig.toml with path aliases, or
  - Run the harness inside the bundled dist/app.js context (use esbuild to bundle a test entry point)
- **Simplest path**: Write the harness as an esbuild entry point like `tests/simulate-entry.js` that imports the source modules the same way `src/main.js` does, then `bun scripts/build-test.mjs` to bundle it for Node

### 2. Browser Click-Through Testing
- Non-headless, visual QA of the full user experience
- Use the browser tool (Hermes built-in) to load https://bayarddevries.github.io/metis-trail-v2/ and click through the game
- Verify: overlays appear/disappear correctly, buttons work, flow from intro → travel → events → settlement → endings works end-to-end
- Pay special attention to mobile layout (user tests on real mobile devices)
- **browser_click does NOT reliably trigger addEventListener on mobile** — if user says button doesn't work, it's real. Verify via JS click or real device.

### Suggested First Steps for Next Agent
1. Read this file, TODO.md, AGENTS.md, CHANGELOG.md
2. Read `src/systems/engine.js` to understand the public API for headless testing
3. Build the headless harness first — it's higher value for balance tuning
4. Run 100+ simulations, report aggregate stats
5. Then do browser click-through QA on the live site
6. Document findings in ISSUES.md

## Open GitHub Issues

| # | Title | Priority | Notes |
|---|-------|----------|-------|
| 26 | Node/location markers on map | Medium | Leaflet markers for settlements. Manny Morr's pixel art from Google Drive are arrival cards, not map pins — tabled pending decision |
| 25 | Cultural review | Low | External dependency — needs human reviewer |
| 15 | Pre-departure cart packing | Medium | Let players choose starting loadout with budget/space |
| 13 | Weather system | Medium | Daily weather modifiers for events/outcomes/morale/wear |
| 12 | Highscore/leaderboard | Medium | Score tracking by outcome type |
| 10 | Basic icons | Low | Replace basic UI icons with themed artwork |
| 6 | AI writing review | Low | Audit copy for AI-isms |
| 5 | Testing infrastructure | Medium | Phase 6 complete. Balance pass applied (v38). Win rate 66.5% — still above target. |

## Balance Pass — v38 Applied

All 6 recommendations from the v37 playtest have been applied:

1. ✅ DAILY_FOOD 1.0 → 1.2
2. ✅ Wear accumulation reduced (plains 0.08, river_valley 0.12, wooded 0.15)
3. ✅ Settlement repair now always -2 wear
4. ✅ Triumphant threshold 1400 → 1200
5. ✅ EVENT_CHANCE 0.35 → 0.45
6. ✅ #29 starvation bypass fixed

Post-balance results: win rate 66.5%, starvation 11%, cart failure 19.5%. Win rate still above 25-40% target — further tuning may be needed (weather system, higher food consumption).

## Closed GitHub Issues (this session)

| # | Title | Version |
|---|-------|---------|
| 30 | Duplicate trade buttons | v38 |
| 29 | Victory bypasses starvation | v38 |
| 28 | Trim dead features | v34 |
| 27 | Mobile top bar clipped | v32 |
| 20 | Gossip benefit | v26 |
| 18 | Deeper event text | v24 |
| 16 | Economy/trade | v26 |
| 14 | Conditional endings | v36 |
| 3 | Research-archive citations | v24 |

## Files Modified (this session)

- `src/systems/engine.js` — fixed #29 (starvation check before victory), reduced wear chances, repair always -2
- `src/core/constants.js` — DAILY_FOOD 1.0→1.2, EVENT_CHANCE 0.35→0.45
- `src/main.js` — fixed #30 (trade buttons labeled with item name), triumphant threshold 1400→1200
- `src/template.html` — version synced to v38
- `tests/simulate-entry.js` — NEW, headless simulation harness
- `scripts/build-test.mjs` — NEW, esbuild bundler for test harness
- `tests/results.json` — NEW, 200-sim raw data (×2 runs)
- `CHANGELOG.md` — v37, v38 entries
- `HANDOFF.md` — v38 state
- `TODO.md` — Phase 6 complete, balance pass applied
- `AGENTS.md` — 2 new pitfalls
- `ISSUES.md` — #29, #30 resolved; #5 updated
