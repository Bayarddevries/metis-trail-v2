// Smoke test: create a game, run 10 turns, confirm no uncaught exceptions.
// Pre-push gate. Cheap. Catches "engine API broken" regressions.
//
// Run: bun tests/smoke.mjs
// Exits 0 if clean, 1 otherwise.

import { createGame } from '../src/systems/engine.js';

const MAX_DAYS = 14;
let exceptions = 0;
let turns = 0;

try {
  const game = createGame('smoke');
  // Mirror the engine's UI lifecycle: confirm departure then add food.
  try { typeof game.confirmPreDeparture === 'function' && game.confirmPreDeparture(); } catch (_) {}
  try { typeof game.addFood === 'function' && game.addFood(15); } catch (_) {}

  while (turns < MAX_DAYS) {
    const before = game.getState();
    if (before.over) break;

    game.travelOneDay();
    const stepState = game.getState();

    if (stepState.pendingSettlement) {
      try { game.settlementAction('continue'); } catch (e) { exceptions++; }
    }
    if (stepState.pendingEvent) {
      try {
        const ev = stepState.pendingEvent;
        const idx = Array.isArray(ev.choices) && ev.choices.length > 0 ? 0 : null;
        if (idx !== null) game.chooseEventChoice(idx);
      } catch (e) { exceptions++; }
    }
    turns++;
  }
} catch (e) {
  // Top-level throw = engine itself failed to initialize or broken mid-loop.
  console.error('[smoke] engine threw:', e.message);
  exceptions++;
}

if (exceptions === 0) {
  console.log(`[smoke] ok — ${turns} turns, no uncaught exceptions`);
  process.exit(0);
} else {
  console.error(`[smoke] fail — ${exceptions} exceptions across ${turns} turns`);
  process.exit(1);
}
