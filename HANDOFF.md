# HANDOFF — Metis Trail V2

## Current State (lane A UI polish complete, balance baseline accepted)
- **Build**: `dist/app.js?v=46`, `src/template.html` synced to `?v=46`
- **Live**: https://bayarddevries.github.io/metis-trail-v2/
- **Branch**: `main`
- **Recent UI work**: darker aged palette, primary/secondary/ghost button hierarchy, camp action grouping, status urgency states, event cost/risk display, travel narrative dedupe, close-button touch hardening, interface enhancement report
- **Balance decision**: 300-run realistic-choice sim showed 88.7% victory, 4.0% cart failure, 7.3% starvation. User accepted these outcomes. No balance numbers were changed.
- **Known issue**: #36 — Day 1 first travel can resolve to settlement overlay that blocks primary actions. Left as decision point.
- **Tests**: `tests/balance-sim.mjs` added for realistic-choice playtest simulation

## Verified Working (v47 build path)

- Camp overlay action panel reliably visible across multiple opens after one-action-at-a-time flow fixed
- Continue button still dismisses overlay after a camp action and resets result/actions state for next camp use
- All previous v41-v46 features unchanged by the fix

### Version drift note
`src/template.html` is currently at `?v=46`; `dist/index.html` is at `?v=46`. Drift cleared.

## Known Bugs (v47)

### Day 1 settlement soft-lock (Issue #36)
- Observed behavior: after Begin Journey, first Travel 1 Day can lead straight into a settlement overlay.
- That blocks Travel/Camp/Cart/Crew until dismissed.
- Root cause is likely a render/side-effect path in main.js showSettlement(), not necessarily an engine state error.
- Currently left as a decision point.

### Camp overlay sequence guard
If `showCamp()` is called while `pendingEvent` or `pendingSettlement` is set, it returns early without opening the overlay. This is intentional and safe, but hard for players to understand if they see no feedback. Add a small status hint later.

## Verified Working (v44)
- All previous v38/v39 features still working
- Category hints render in cart overlay during overload
- Crafting panel available at Métis and NWMP settlements
- MB currency display removed from cart and crafting UI
- Pre-departure overlay renders with briefing, category legend, weight tracking, +/- controls, Auto-Pack

## Known Bugs (v44)

### Overlay sequence broken — pre-departure shows before intro
- **Root cause**: `src/systems/engine.js` sets `preDeparture: true` in initial state (line 50). `bootstrap()` in `src/main.js` (lines 32-37) immediately activates `#predeparture-overlay` and deactivates `#intro-overlay` on load.
- **Expected flow**: Intro overlay (with "Begin Journey") → click → pre-departure overlay → confirm → game start.
- **Actual flow**: Pre-departure shows immediately; "Begin Journey" click hides intro but never activates pre-departure (already active but never re-shown).
- **Fix needed**: In `bootstrap()`, always show intro first. On `#intro-start` click, hide intro AND activate pre-departure overlay. Then on `#pd-confirm`, hide pre-departure and start game.
- **Files**: `src/main.js` (bootstrap, lines 32-58), `src/template.html` (both overlays present with correct IDs).

### HBC crafting recipe unreachable
- Recipe `finished_hides` exists with `settlement: 'hbc'` in `getAvailableRecipes()` but HBC action list does NOT include `'craft'`. Player can never access it.
- Either add `'craft'` to HBC actions in `availableSettlementActions()` or reassign recipe to a settlement type that has it.

## Recent Changes (v41-v44)

### v41 — Cart UX / Crafting Exposure (Issue #31)
- Reduced starting `Pemmican Rations` from 20 to 15 and `Firewood Bundle` from 3 to 2, dropping starting weight to ~128 kg
- Added `getCategoryHint()` in `src/main.js` for per-category tooltips in the cart overlay
- Removed `mbValue` MB display from crafting-panel recipes and cart item rows (data preserved in engine/items/recipes)
- Exposed `'craft'` as a settlement action for `metis` and `nwmp` nodes in `src/systems/engine.js`

### v42 — Version sync fix
- Build bumped to v42 automatically; `src/template.html` manually synced to v42

### v43 — Pre-departure overlay implementation
- Added `#predeparture-overlay` to `src/template.html` with briefing, category legend, weight display, item list, +/- controls, Confirm Loadout, Auto-Pack
- Added CSS for `.predeparture-briefing`, `.category-legend`, `.pd-row`, `.predeparture-weight`, `.predeparture-actions`
- Added `getPreDepartureItems()`, `setPreDepartureCount()`, `confirmPreDeparture()` to engine
- Added `showPreDeparture()` to `src/main.js` with full UI logic

### v44 — Build auto-bump
- Build script bumped `dist/index.html` to v44; `src/template.html` still at v43 (drift persists)

## Known Issues

### Build version drift (PARTIALLY RESOLVED)
Build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. After every build, manually sync `src/template.html` to match. The script should be fixed to update both.

### `generateGossip` possibly tree-shaken
Not grep-able in esbuild bundle but works at runtime. Monitor.

### Cart overlay: unload buttons lack item name
Buttons show "Unload −X kg" but not which item. Data-attribute carries item name so clicks work, but UX is unclear. Minor.

### Win rate still above target
66.5% win rate after balance pass (target 25-40%). User accepted realistic-choice sim results: 88.7% victory, 4.0% cart failure, 7.3% starvation. Further tuning is optional.

### HBC crafting recipe unreachable
Recipe `finished_hides` exists with `settlement: 'hbc'` in `getAvailableRecipes()` but HBC action list does NOT include `'craft'`. Player can never access it. Either add `'craft'` to HBC actions or reassign recipe to a settlement type that has it.

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

## Next Priorities — POST UI/BALANCE BASELINE

### Immediate
- Keep UI polish iterations going: settlements buttons styling, more overlay consistency
- Investigate or decide on Issue #36 Day 1 settlement flow
- Continue version-drift mitigation

### Later
- Weather system
- Highscore/leaderboard
- Second-half trail nodes
- Cultural review / AI-writing audit

## Open GitHub Issues

| # | Title | Priority | Notes |
|---|-------|----------|-------|
| 36 | Day 1 settlement overlay blocks primary actions | Medium | Decision point, not patched |
| 35 | Reduce action-dense screens by grouping secondary actions | Medium | In progress via UI polish |
| 34 | Audit and consolidate primary/secondary action verbs | Medium | Camp grouping done; broader audit pending |
| 33 | Crafting discoverability in settlement UI | Medium | Settlement UI restyle may address this |
| 32 | Balance pass on unforgiving events (medicine pouch) | Medium | Balance baseline accepted; tuning optional |
| 31 | Prune redundant settlement/camp actions | Medium | Camp overhaul done; settlement pruning remains |
| 26 | Node/location markers on map | Medium | Pending art/assets decision |
| 25 | Cultural review | Low | Needs external reviewer |
| 15 | Pre-departure cart packing | Medium | Implemented; iterating |
| 13 | Weather system | Medium | Future |
| 12 | Highscore/leaderboard | Medium | Future |
| 10 | Basic icons | Low | Waiting on assets |
| 6 | AI writing review | Low | Periodic/optional |

## Closed GitHub Issues (this session)

| # | Title | Version |
|---|-------|---------|
| — | Lane A UI polish shipped | v46 |
| — | Touch-target hardening shipped | v46 |
| — | Realistic-choice balance baseline documented | current |

## Files Modified (this session)

- `src/template.html` — touch-target hardening, version sync to v46
- `dist/index.html` — rebuilt artifact
- `tests/balance-sim.mjs` — NEW realistic-choice playtest harness
- `docs/interface-enhancement-report.html` — refreshed interface audit report
- `CHANGELOG.md` — interface + testing docs
- `HANDOFF.md` — current state refresh
- `TODO.md` — lane A marked complete, balance baseline noted
- `ISSUES.md` — #36 added for Day 1 settlement blocker
