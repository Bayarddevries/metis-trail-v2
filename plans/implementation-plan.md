# Implementation Plan — Camp Overlay + Path A Economy (Current-Source Edition)

## Current source topology (verified 2026-06-05)
- State factory: `src/systems/engine.js`
- State shape fields (current): `seed, day, month, year, date, season, crew, food, squeal, wear, morale, node, segmentDay, over, won, score, pendingEvent, pendingSettlement, camps, eventsResolved, tradesMade, flags, reputation, travelDaysWithoutRest`
- Missing fields (Phase 0 will add): `credit`, `capacity`, `usedWeight`, `perishable`
- Persistence: `src/ui/persistence.js` — simple `localStorage` JSON, no version tag, no migration
- Build bundle: `src/template.html` (HTML + CSS), `src/main.js` (bootstrap + all UI rendering), modules build to `dist/app.v5.js` (83KB)
- Camp already exists: `btn-camp` calls `game.makeCamp()` + `publishCampResult()`. `makeCamp()` exists but has no outcome UI beyond a stale-prev-state message bug.

## Confirmed actual bugs
1. `publishCampResult()` reads `game.getState()` BEFORE `game.makeCamp()` runs — outcome message shows old values. Fix: compute after mutation.
2. `travelOneDay()` in `main.js` has the same ordering for morale diff, but since `prev` is captured before the engine call this is actually correct. Verify visually; no patch needed unless tests fail.
3. No `#camp-overlay` — camp is a one-line publish + render update.

## Phase 0 — Schema + safe defaults (3 files, ~12 lines)
Touch points:
1. `src/systems/engine.js` — add `credit`, `capacity`, `usedWeight`, `perishable` defaults at state init
2. `src/data/items.js` — add `mbValue`, `perishable`, `factionPref`, `category` to each item (safe defaults: mbValue=0, perishable=false)
3. `src/ui/persistence.js` — add load fallback: merge saved state with safe defaults so old saves load cleanly without `null` fields

Commit: `feat: add economy/weight fields with backward-compatible persistence defaults`

## Phase 1 — Camp overlay as default transition (4 files, ~40 lines)
Touch points:
1. `src/template.html` — insert `#camp-overlay` HTML block (Rest / Break Camp / Gossip buttons + outcome area)
2. `src/systems/engine.js` — extend `makeCamp()`; add `doCampAction('rest'|'break'|'gossip')` returning outcome text
3. `src/ui/renderer.js` — add `renderCampOverlay(state)` and `renderTallyBar(state)` (compact Tally indicator in status bar)
4. `src/main.js` — wire travel end to always show camp overlay first; Break Camp bypasses rest without advancing day; fix `publishCampResult()` ordering bug here

Commit: `feat: camp overlay default post-travel; tally indicator; fix camp outcome precedence`

## Phase 2 — Faction markets (4 files, ~60 lines)
Touch points:
1. `src/data/nodes.js` — add `market: { itemKey: {buy, sell} }` and `faction` fields to nodes
2. `src/data/items.js` — populate `mbValue`, `perishable`, `factionPref`, `category`
3. `src/systems/engine.js` — rewrite settlement trade: `buyItem(key)` / `sellItem(key)` with HBC credit, Métis pemmican gate, NWMP harsh prices
4. `src/ui/renderer.js` — render faction-specific market rows with tab/pemican cues

Commit: `feat: asymmetric faction markets — HBC credit, Métis barter, NWMP cash`

## Phase 3 — Perishability + debt morale coupling (3 files, ~30 lines)
Touch points:
1. `src/systems/engine.js` — add daily decay for perishable items in winter (rate 0.15 per day); morale penalty if `credit.hbc > 4`
2. `src/data/events.js` — add 2-3 camp-gated events using perishable + shaganappi/medicine gates
3. `src/ui/renderer.js` — show perishable decay in outcome cards

Commit: `feat: perishable decay and debt morale coupling`

## Phase 4 — Edmonton settlement + endings (3 files, ~40 lines)
Touch points:
1. `src/systems/engine.js` — `settleTab()`: cargo premium + credit deduction + net MB scoring
2. `src/systems/scoring.js` — add profitMargin bonus
3. `src/ui/renderer.js` — `renderEndOverlay(state)` with final ledger table + branching titles

Commit: `feat: Edmonton settlement closes tabs and branches endings`

## What this plan does NOT do (explicit cut list)
- No RE-style grid inventory (weight UI only, no grid reshuffling)
- No event art
- No gossip intel network (event text only; prices remain static until gossip phase later)
- No reputation gating beyond morale penalty
- No crafting

## Save contract
Old saves lack new fields. `getState()` return shape now includes `credit`, `capacity`, `usedWeight`. Persistence load will post-merge missing fields with zero/empty defaults so old saves remain playable.

## Mobile guardrails
- `#camp-overlay` buttons must hit 44px min height (`min-height: 44px` in CSS)
- `#camp-overlay` outcome card must use existing `.dice-outcome` / `.outcome-flavor` classes
- Status bar Tally must fit in current bar width; on overflow, hide less-critical stat (morale) behind expandable row — to be validated during Phase 1 UI work
