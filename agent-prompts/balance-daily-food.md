# Agent Prompt: Primary Balance Lever — Raise Daily Food Cost

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. Current state: v44.

## Problem
Win rate is 66.5% after the balance pass. Target is 25-40%. Starvation deaths are only 11% of losses (the rest is cart failure or triumphant). The food economy is too forgiving — players are surviving but not thriving enough to offset the time penalty.

## Your Task

### 1. Read the relevant code
- `src/core/constants.js` — find `DAILY_FOOD` constant (currently 1.2 per unit/day)
- `src/systems/engine.js` — find how daily food consumption is applied (`travelOneDay()` or equivalent)
- `src/data/items.js` — confirm food items (pemmican, flour, etc.) and their names/values

### 2. Choose ONE lever and implement it
**Recommended: raise DAILY_FOOD to 1.5** (from 1.2). This makes food burn faster, increases starvation pressure, and cuts into comfortable playthroughs without adding new systems.

Alternative levers (pick only ONE):
- Raise daily wear accumulation on plains terrain (currently 0.08)
- Reduce starting Pemmican from 15 back toward 10-12
- Exponentially scale EVENT_CHANCE instead of flat 0.45

### 3. Verify balance impact
Run the headless harness:
```bash
bun tests/simulate-entry.js
```
Or use the existing build-test script if present:
```bash
bun scripts/build-test.mjs
```
Report the new win rate / starvation rate. If it's not in the 25-40% range, adjust once more.

### 4. Commit
```bash
git add -A
git commit -m "balance: raise daily food consumption to increase survival pressure (target 25-40% win rate)"
```

## Constraints
- Change only ONE lever per run — do not stack multiple balance changes
- Do not edit `dist/`
- If the fix requires adding weather (not recommended here), stop and report it as a larger feature, not a balance tweak
- Conventional commit only
