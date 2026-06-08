# Agent Prompt: Fix Pre-Departure Overlay Sequence (#32)

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. The current uncommitted state is v44.

## Bug
The pre-departure overlay shows immediately on page load, before the intro screen. Players should see:
1. Intro overlay with "Begin Journey" button
2. Click "Begin Journey" → pre-departure overlay
3. Click "Confirm Loadout" → game starts

## Root Cause (confirmed)
- `src/systems/engine.js` line ~50: initial state sets `preDeparture: true`
- `src/main.js` lines ~32-37: `bootstrap()` checks this and immediately swaps overlays on page load

## Your Task

### 1. Read the relevant code
- `src/systems/engine.js` — find the initial state object where `preDeparture` is set
- `src/main.js` — find `bootstrap()` and `handleIntroStart()` (or wherever `#intro-start` click is bound)
- `src/template.html` — confirm overlay IDs: `#intro-overlay`, `#predeparture-overlay`, `#game-root`

### 2. Fix the state machine
**Approach A (preferred):** Remove `preDeparture: true` from the engine's initial state. Let `bootstrap()` always show intro first. On `#intro-start` click, set `preDeparture: true` in state, then activate pre-departure overlay. On `#pd-confirm`, set `preDeparture: false` and start the game.

**Approach B:** Keep engine state as-is, but change `bootstrap()` to NOT auto-swap overlays on load. Always show intro first regardless of `preDeparture` flag.

Pick one and implement it.

### 3. Verify
Run `bun scripts/build.mjs` and confirm it exits 0. Then open `dist/index.html` in browser (or serve with `python3 -m http.server`) and confirm:
- Page loads → intro overlay visible
- Click "Begin Journey" → intro disappears, pre-departure appears
- Click "Confirm Loadout" → pre-departure disappears, game map shows

### 4. Commit
```bash
git add -A
git commit -m "fix: overlay sequence — intro now correctly precedes pre-departure (#32)"
```

## Constraints
- Do not edit files in `dist/`
- Minimal changes — only touch what's needed for the fix
- Conventional commit only
