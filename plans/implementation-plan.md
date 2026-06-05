# Implementation Plan — Path A: Loose Credit (Agent-Executable Edition)

## Agent Execution Contract
- Read-only orientation first: inspect repo, then execute without asking.
- Execute exactly this plan in order: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4.
- No side quests: do not write new plans, audit reports, or unrelated artifacts.
- Phase boundary checks: confirm state schema, persistence, and UI targets before each phase.
- Commit cadence: update CHANGELOG.md, then commit with the prescribed message per phase.
- Failure mode: halt and report the exact blocker; do not improvise outside this plan.

## Current source topology (verified 2026-06-05)
- State: `src/systems/engine.js`
- State shape today: `seed, day, month, year, date, season, crew, food, squeal, wear, morale, node, segmentDay, over, won, score, pendingEvent, pendingSettlement, camps, eventsResolved, tradesMade, flags, reputation: { hbc, nwmp, metis, mission, cree }, travelDaysWithoutRest`
- Missing now: `credit`, `capacity`, `usedWeight`, `perishable`
- Persistence: `src/ui/persistence.js` — plain localStorage JSON, no version tag, no migration yet
- Bundles: `src/template.html` (HTML/CSS), `src/main.js` (bootstrap + UI), modules → `dist/app.v5.js`
- UI shell: `src/ui/shell.js`
- Renderer: `src/ui/renderer.js`
- Data: `src/data/nodes.js`, `src/data/items.js`, `src/data/events.js`

## Phase 0 — Schema + ledger defaults (backward compat)
Files:
1. `src/systems/engine.js`
2. `src/data/items.js`
3. `src/ui/persistence.js`

Behavior:
- Add `credit: { hbc: 0, metis: 0, nwmp: 0, mission: 0 }` to state init
- Add `capacity`, `usedWeight` defaults
- Add `perishable: {}` to state
- Items already have `mbValue`, `perishable`, `factionPref`, `category` in this branch (verified 2026-06-05)
- Persistence: merge saved state with safe defaults on load so old saves remain playable

Verification:
- Old save loads without crashing
- New save includes new fields
- No null deref in `getState()` consumer paths

Commit message: `feat: add economy/weight fields with backward-compatible persistence defaults`

## Phase 1 — Status bar Tally + expandable per-faction ledger (UI only)
Files:
1. `src/ui/shell.js`
2. `src/ui/renderer.js`
3. `src/main.js`

Behavior:
- Add Tally pill to status bar (`#s-tally`)
- Add ledger container (`#s-tally-ledger`)
- Tapping Tally toggles expandable ledger:
  - HBC +2.4 MB
  - Métis 0.0 MB
  - NWMP 0.0 MB
  - Mission 0.0 MB
- No gameplay effect in Phase 1 — read-only
- Use existing event delegation pattern on `#game-root`; re-resolve targets in handlers since `render()` rebuilds DOM

Verification:
- Status bar renders net tally number
- Toggle expand/collapse works on touch and click
- Rebuilds via `render()` do not break toggle functionality
- No state mutation occurs from opening the ledger

Commit message: `feat: Phase 1 — status bar Tally pill with expandable faction ledger`

## Phase 2 — Market tables + faction behavior
Files:
1. `src/data/nodes.js`
2. `src/data/items.js`
3. `src/systems/engine.js`
4. `src/ui/renderer.js`

Behavior:
- Nodes expose `market: { itemKey: { buy, sell, buyUnit? } }` and `credit: boolean`, `creditLimit: number`
- Settlement trade splits into explicit buy/sell actions with faction rules:
  - HBC: buy adds `credit.hbc += cost`; sell subtracts credit
  - Métis: buy requires `cart.pemmican.count >= cost` or `cart.bisonHide.count >= 1`; no credit
  - NWMP: buy requires pemmican or hides; no credit
  - Mission: healing + gossip only
- Settlement overlay shows faction-specific warning text
- Update `availableSettlementActions` per node type

Verification:
- At HBC post, Buy increments tab; Sell reduces tab
- At Métis post, Buy button disabled unless barter met
- At NWMP post, same barter gate, harsher prices
- Save + load preserves credit ledger

Commit message: `feat: Phase 2 — asymmetric faction markets (HBC credit, Métis barter, NWMP cash)`

## Phase 3 — Edmonton settlement + ending rewrite
Files:
1. `src/systems/engine.js`
2. `src/systems/scoring.js` (create if missing)
3. `src/ui/renderer.js`

Behavior:
- Add `settleTab()` path triggered at Fort Edmonton arrival
- Final cargo tallied at destination premium MB value
- All credits deducted from net
- Net MB becomes score component
- Ending title + narrative branch on net MB tiers

Verification:
- Run to Fort Edmonton with open HBC tab and cargo
- Confirm net MB calculation and ending copy match spec
- Rollback-safe: must be able to revert to Phase 2 and still reach the same editable Edmonton screen via alt ending path

Commit message: `feat: Phase 3 — Edmonton settlement closes tabs and rewrites endings`

## Phase 4 — Reputation modifier on credit limit
Files:
1. `src/systems/engine.js`

Behavior:
- HBC `creditLimit = 6 + reputation.hbc`
- Reputation can unlock higher limits; exceeded limit disables buy buttons
- Métis prices improved by rep but never credit-enabled

Verification:
- Reputation gains expand HBC tab limit
- Buy buttons disable when limit hit
- Métis prices visibly improve with reputation

Commit message: `feat: Phase 4 — reputation unlocks HBC credit limit and Métis/NWMP price breaks`

## What this plan does NOT do
- No RE-style grid inventory
- No event art
- No gossip intel network
- No reputation gating beyond credit limit and prices
- No crafting

## Save contract
Old saves lack new fields. Patching missing fields with zero/empty defaults preserves playability for:
- `credit`, `capacity`, `usedWeight`, `perishable`

## Mobile / UX guardrails
- Touch targets >= 44px
- Toggle/ledger must not push status bar off-screen on small widths
- Settlement action buttons reset after rebuilds; use event delegation on `#game-root`

## Phase handoff prompt for agents
```
Read plans/implementation-plan.md and execute Phase N only.
Follow the Agent Execution Contract in that file.
Do not edit files outside the touch-point list for this phase.
Verify the listed checks, then update CHANGELOG.md and commit with the prescribed message.
```
