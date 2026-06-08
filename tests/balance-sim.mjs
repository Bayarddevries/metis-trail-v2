import { createGame } from '../src/systems/engine.js';
import { NODES } from '../src/data/nodes.js';

const SEEDS = Array.from({ length: 300 }, (_, i) => `playtest_${i}`);

function senseRating(state, choice) {
  // Lower is worse for player
  let score = 0;
  if (choice.wear) score += choice.wear * 2;
  if (choice.food && choice.food < 0) score += Math.abs(choice.food) * 1.5;
  if (choice.crew === 'exhausted') score += 6;
  if (choice.crew === 'tired') score += 3;
  if (choice.morale && choice.morale < 0) score += Math.abs(choice.morale) * 0.1;
  if (choice.time && choice.time > 0) score += choice.time * 1.2;
  if (choice.setsFlag === 'built_rafts') score -= 2; // usually good
  if (choice.addsRep) score -= choice.addsRep.delta * 0.5; // rep is slight benefit
  return score;
}

function pickChoice(pendingEvent, state) {
  const choices = pendingEvent.choices;
  if (!choices || !choices.length) return 0;

  // 30% of the time, make a "human" choice based on current needs
  // 70% of the time, pick randomly among acceptable options
  if (Math.random() < 0.3 && choices.length > 1) {
    // Rate each choice; lower score = more sensible
    const ratings = choices.map((c, i) => ({ i, score: senseRating(state, c) }));
    ratings.sort((a, b) => a.score - b.score);

    // Pick from top half, weighted toward top
    const pool = ratings.slice(0, Math.max(1, Math.floor(choices.length / 2)));
    const pick = pool[Math.floor(Math.random() * pool.length)].i;
    return pick;
  }

  // Random choice, but bias: 60% pick first option (typical human reads top-down)
  if (Math.random() < 0.6) return 0;
  return Math.floor(Math.random() * choices.length);
}

function settleAction(state, cart) {
  // Mirror player behavior at settlements
  if (state.food < 6 && cart.some(i => i.type === 'trade' && i.count > 0)) return 'trade';
  if (state.wear >= 3 && cart.some(i => i.name === 'Shaganappi' && i.count > 0)) return 'repair';
  if (state.crew === 'exhausted' || state.food < 4) return 'rest';
  if (Math.random() < 0.4 && state.food < 10) return 'forage';
  if (Math.random() < 0.25) return 'rest';
  return 'continue';
}

function narrateDelta(before, after, evId, choiceIdx) {
  const parts = [];
  parts.push(`Day ${before.day}: ${evId || 'travel'}`);
  if (after.food !== before.food) parts.push(`food ${before.food}→${after.food}`);
  if (after.wear !== before.wear) parts.push(`wear ${before.wear}→${after.wear}`);
  if (after.morale !== before.morale) parts.push(`morale ${before.morale}→${after.morale}`);
  if (after.crew !== before.crew) parts.push(`crew→${after.crew}`);
  if (after.node !== before.node) parts.push(`arrived ${NODES[after.node]?.name || '?'}`);
  if (choiceIdx !== undefined && evId) parts.push(`choice ${choiceIdx}`);
  return parts.join(' | ');
}

function run(seed) {
  const game = createGame(seed);
  const timeline = [];
  let turns = 0;
  const MAX_TURNS = 140;

  while (!game.getState().over && turns < MAX_TURNS) {
    const before = { ...game.getState() };
    game.travelOneDay();
    const afterTravel = game.getState();

    if (afterTravel.node !== before.node) timeline.push(narrateDelta(before, afterTravel, 'travel'));

    if (afterTravel.pendingEvent) {
      const ev = afterTravel.pendingEvent;
      const idx = pickChoice(ev, afterTravel);
      const beforeEv = { ...game.getState() };
      game.chooseEventChoice(idx);
      const afterEv = game.getState();
      timeline.push(narrateDelta(beforeEv, afterEv, ev.id, idx));
    }

    if (afterTravel.pendingSettlement) {
      const act = settleAction(afterTravel, game.getCart());
      const beforeSet = { ...game.getState() };
      game.settlementAction(act);
      const afterSet = game.getState();
      timeline.push(narrateDelta(beforeSet, afterSet, `settlement_${act}`));
    }

    turns++;
  }

  const final = game.getState();
  return {
    seed,
    outcome: final.won ? 'victory' : final.endReason || 'timeout',
    day: final.day,
    node: final.node,
    food: final.food,
    wear: final.wear,
    morale: final.morale,
    score: final.score,
    turns,
    timeline,
  };
}

const results = SEEDS.map(run);

const counts = {};
for (const r of results) counts[r.outcome] = (counts[r.outcome] || 0) + 1;
console.log('OUTCOMES');
for (const [k, v] of Object.entries(counts)) {
  const pct = ((v / results.length) * 100).toFixed(1);
  console.log(`  ${k}: ${v} (${pct}%)`);
}

const byOutcome = {};
for (const r of results) (byOutcome[r.outcome] ||= []).push(r);

function stats(arr, key) {
  const vals = arr.map(a => a[key]).sort((a, b) => a - b);
  const sum = vals.reduce((s, v) => s + v, 0);
  return { min: vals[0], p25: vals[Math.floor(vals.length * 0.25)], median: vals[Math.floor(vals.length * 0.5)], p75: vals[Math.floor(vals.length * 0.75)], max: vals[vals.length - 1], mean: sum / vals.length };
}

console.log('\nMETRICS_BY_OUTCOME');
for (const [outcome, arr] of Object.entries(byOutcome)) {
  console.log(`[${outcome}]`);
  for (const key of ['day', 'food', 'wear', 'morale', 'score']) {
    const s = stats(arr, key);
    console.log(`  ${key}: min=${s.min} p25=${s.p25} median=${s.median} p75=${s.p75} max=${s.max} mean=${(s.mean).toFixed?.(2) || Math.round(s.mean)}`);
  }
}

console.log('\nWORST_RUN_NARRATIVES');
const worst = [...results].sort((a, b) => {
  const order = { starvation: 0, cart_failure: 1, winter: 2, morale: 3, abandoned: 4, timeout: 5, victory: 6 };
  return (order[a.outcome] ?? 9) - (order[b.outcome] ?? 9) || a.day - b.day;
});

for (const r of worst.slice(0, 8)) {
  console.log(`\n--- ${r.outcome.toUpperCase()} day ${r.day} food ${r.food} wear ${r.wear} morale ${r.morale} ---`);
  const recent = r.timeline.slice(-40);
  for (const line of recent.slice(0, 22)) console.log('  ' + line);
  if (recent.length > 22) console.log(`  ... (${recent.length - 22} more entries)`);
}
