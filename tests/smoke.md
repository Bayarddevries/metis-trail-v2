# Metis Trail V2 — Smoke Test

Cheapest possible pre-push gate. Creates a game, runs 14 travel turns, and confirms the engine doesn't throw an uncaught exception during normal play. Catches "engine API surface broken," "relative-import error," "module loading broken." **Does not** test balance, win rate, UI, or persistence.

Run:

```bash
node tests/smoke.mjs
# or
bun tests/smoke.mjs
```

- Exit 0 = pass.
- Exit 1 = engine broke since last green push. Read the `[smoke] fail` line for the exception count.

## What it doesn't test

- **Win rate.** Use `tests/simulate-entry.js` for that.
- **Balance.** `tests/balance-sim.mjs` exists, but as of 2026-06-22 it reports 100% starvation because it skips `confirmPreDeparture()` + `addFood()` — fix needed before those numbers are meaningful.
- **Visual rendering.** A real browser is required.
- **Persistence / Hall of Fame.** Out of scope here.

## Why this exists

`bun scripts/build.mjs` only runs esbuild. It exits 0 even if every mechanic is broken. This is the 30-line tax that catches a class of regressions before they ship.
