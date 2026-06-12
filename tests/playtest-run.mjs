import { createGame } from '../src/systems/engine.js';

const g = createGame('headless-review-2026-06-12');

function offloadToCapacity() {
  while (g.totalWeight() > g.getState().capacity) {
    const cart = g.getCart();
    const item = cart.find((x) => x.count > 0);
    if (!item) break;
    g.offloadItem(item.name);
  }
}
offloadToCapacity();

function startTrail() {
  if (g.getState().preDeparture) {
    g.confirmPreDeparture();
  }
}
startTrail();

const history = [];

function log(label, detail = '') {
  const s = g.getState();
  history.push({
    label,
    detail,
    day: s.day,
    food: s.food,
    wear: s.wear,
    morale: s.morale,
    crew: s.crew,
    travelDaysWithoutRest: s.travelDaysWithoutRest,
    over: s.over,
    usedWeight: s.usedWeight,
    capacity: s.capacity,
    cart: g.getCart().map((i) => `${i.name} x${i.count}`).join(', '),
    pendingEvent: s.pendingEvent?.id || null,
    pendingSettlement: s.pendingSettlement?.name || null,
  });
}

log('start');

// Try to travel full trail, making reasonable decisions.
let turns = 0;
while (!g.getState().over && !g.getState().won && turns < 600) {
  turns++;
  const s = g.getState();

  // Resolve pending event if any, picking first choice.
  if (s.pendingEvent) {
    if (s.pendingEvent.choices?.length > 0) {
      g.chooseEventChoice(0);
      log('event_resolved');
    }
    continue;
  }

  // At settlement: prefer rest if tired, otherwise continue.
  if (s.pendingSettlement) {
    if (s.crew === 'tired' || s.crew === 'exhausted' || s.travelDaysWithoutRest >= 3) {
      g.settlementAction('rest');
      log('settlement_rest');
    } else if ((s.credit?.hbc || 0) >= 2 && s.wear > 4) {
      g.settlementAction('buy_repair');
      log('settlement_buy_repair');
    } else {
      g.settlementAction('continue');
      log('settlement_continue');
    }
    continue;
  }

  // Camp: rest if fatigued, otherwise push on.
  if (s.travelDaysWithoutRest >= 3 || s.crew !== 'rested') {
    g.makeCamp();
    log('camp_rest');
    if (s.pendingEvent) {
      if (s.pendingEvent.choices?.length > 0) g.chooseEventChoice(0);
    }
    continue;
  }

  // Default: advance.
  g.pushOn();
  log('push_on');
}

log('end');

import { writeFileSync } from 'fs';
writeFileSync('playtest-run.json', JSON.stringify(history, null, 2));
console.log(JSON.stringify({ turns, endState: g.getState(), history }, null, 2));
