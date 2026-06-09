import { createGame } from '../src/systems/engine.js';

const SIM_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : 200;

// ─── Choice weighting ──────────────────────────────────────────────
function weightedChoiceIndex(choices, rand) {
  const scored = choices.map((c, i) => {
    let score = 50;
    // Prefer safe choices slightly
    if (c.dc === null) score += 12;
    // Prefer choices that restore morale/food
    if (c.morale > 0) score += 15;
    if (c.food > 0) score += 12;
    // Slight preference for achievable DCs
    if (c.dc !== null && c.dc <= 10) score += 8;
    if (c.dc !== null && c.dc >= 14) score -= 12;
    // Avoid choices that cost items if low on them
    if (c.requiresItem) score -= 5;
    return { i, score };
  });

  // 70% pick from top half, 30% fully random
  if (rand() < 0.7) {
    scored.sort((a, b) => b.score - a.score);
    const halfLen = Math.max(1, Math.ceil(scored.length / 2));
    return scored[Math.floor(rand() * halfLen)].i;
  }
  return Math.floor(rand() * choices.length);
}

// ─── Settlement action weighting ───────────────────────────────────
function pickSettlementAction(actions, state, rand) {
  const weights = actions.map(a => {
    if (a === 'continue') return 35;
    if (a === 'rest' && (state.crew !== 'rested' || state.morale < 50)) return 30;
    if (a === 'rest') return 10;
    if (a === 'trade' && state.food < 10) return 30;
    if (a === 'trade') return 15;
    if (a === 'forage' && state.food < 8) return 25;
    if (a === 'forage') return 12;
    if (a === 'repair' && state.wear >= 3) return 30;
    if (a === 'repair' && state.wear >= 1) return 15;
    if (a === 'repair') return 3;
    if (a === 'heal' && (state.crew !== 'rested' || state.morale < 60)) return 20;
    if (a === 'heal') return 5;
    if (a === 'rumours') return 10;
    if (a === 'recruit' && state.crew === 'exhausted') return 20;
    if (a === 'recruit') return 8;
    return 10;
  });
  const total = weights.reduce((s, w) => s + w, 0);
  let r = rand() * total;
  for (let i = 0; i < actions.length; i++) {
    r -= weights[i];
    if (r <= 0) return actions[i];
  }
  return actions[0];
}

// ─── Single simulation ─────────────────────────────────────────────
function runSim(seed) {
  const game = createGame(seed);

  // ── Offload to capacity ──
  let weight = game.totalWeight();
  const cap = game.getState().capacity;
  if (weight > cap) {
    // Greedy offload: drop lowest-value items first until under capacity
    // Re-read cart each iteration since offloadItem mutates internal state
    let offloadSafety = 0;
    while (game.totalWeight() > cap && offloadSafety++ < 200) {
      const cart = game.getCart();
      const loaded = cart.filter(i => i.count > 0);
      if (loaded.length === 0) break;
      const lowest = loaded.sort((a, b) => (a.mbValue || 0) - (b.mbValue || 0))[0];
      game.offloadItem(lowest.name);
    }
  }

  // ── Tracking ──
  let campCount = 0;
  let eventCount = 0;
  let tradeCount = 0;
  let forageCount = 0;
  let repairCount = 0;
  let restCount = 0;
  let continueCount = 0;
  let travelCount = 0;

  // Track points where game diverged
  const foodHistory = [];
  const wearHistory = [];
  const moraleHistory = [];

  const maxDays = 200;

  for (let step = 0; step < maxDays; step++) {
    if (game.isOver()) break;

    const s = game.getState();

    // Snapshot every 5 days for trend analysis
    if (step % 5 === 0) {
      foodHistory.push({ step, food: s.food, wear: s.wear, morale: s.morale, node: s.node });
    }

    if (s.pendingEvent) {
      eventCount++;
      const ev = game.getPendingEvent();
      if (ev && ev.choices.length > 0) {
        const ci = weightedChoiceIndex(ev.choices, Math.random);
        game.chooseEventChoice(ci);
      }
    } else if (s.pendingSettlement) {
      const actions = game.getAvailableActions();
      if (actions.type === 'settlement') {
        const action = pickSettlementAction(actions.actions, s, Math.random);
        if (action === 'continue') continueCount++;
        else if (action === 'trade') tradeCount++;
        else if (action === 'forage') forageCount++;
        else if (action === 'repair') repairCount++;
        else if (action === 'rest') restCount++;
        game.settlementAction(action);
      }
    } else {
      const actions = game.getAvailableActions();
      if (actions.type === 'travel') {
        // Camp logic
        if (s.crew === 'exhausted') {
          game.makeCamp();
          campCount++;
        } else if (s.morale < 15) {
          game.makeCamp();
          campCount++;
        } else if (s.food < 4) {
          game.makeCamp();
          campCount++;
        } else {
          game.travelOneDay();
          travelCount++;
        }
      }
    }
  }

  const final = game.getState();
  const finalCart = game.getCart();
  const tradeGoods = finalCart.filter(i => i.type === 'trade' && i.count > 0).reduce((s, i) => s + i.count, 0);

  return {
    seed,
    won: game.hasWon(),
    over: game.isOver(),
    endReason: final.endReason || 'timeout',
    score: game.getScore(),
    days: final.day,
    finalFood: final.food,
    finalWear: final.wear,
    finalMorale: final.morale,
    finalNode: final.node,
    finalCrew: final.crew,
    finalSeason: final.season,
    tradeGoodsRemaining: tradeGoods,
    campCount,
    travelCount,
    eventCount,
    tradeCount,
    forageCount,
    repairCount,
    restCount,
    continueCount,
    totalActions: eventCount + tradeCount + forageCount + repairCount + restCount + continueCount + travelCount + campCount,
    foodHistory,
  };
}

// ─── Aggregation ───────────────────────────────────────────────────
function aggregate(results) {
  const total = results.length;
  const wins = results.filter(r => r.won);
  const victories = results.filter(r => r.endReason === 'victory');
  const losses = results.filter(r => !r.won);

  // Death reasons
  const reasons = {};
  results.forEach(r => { reasons[r.endReason] = (reasons[r.endReason] || 0) + 1; });

  // Score stats
  const scores = victories.map(r => r.score);
  const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const medianScore = scores.length ? [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)] : 0;
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;

  // Score buckets
  const buckets = { '0-499': 0, '500-799': 0, '800-999': 0, '1000-1199': 0, '1200-1399': 0, '1400+': 0 };
  scores.forEach(s => {
    if (s < 500) buckets['0-499']++;
    else if (s < 800) buckets['500-799']++;
    else if (s < 1000) buckets['800-999']++;
    else if (s < 1200) buckets['1000-1199']++;
    else if (s < 1400) buckets['1200-1399']++;
    else buckets['1400+']++;
  });

  // Ending quality
  const triumphant = victories.filter(r => r.score >= 1100).length;
  const humble = victories.filter(r => r.score < 1100).length;

  // Averages
  const avg = key => results.map(r => r[key]).reduce((s, v) => s + v, 0) / total;

  // Trade goods remaining for winners
  const avgTradeGoodsAtEnd = victories.length
    ? victories.reduce((s, r) => s + r.tradeGoodsRemaining, 0) / victories.length
    : 0;

  // How far did losses get?
  const lossNodes = losses.map(r => r.finalNode);
  const avgLossNode = lossNodes.length ? Math.round(lossNodes.reduce((s, v) => s + v, 0) * 10 / lossNodes.length) / 10 : 0;

  // Food at death for starvation
  const starvationDeaths = results.filter(r => r.endReason === 'starvation');
  const avgFoodAtStarvation = starvationDeaths.length
    ? starvationDeaths.reduce((s, r) => s + r.finalFood, 0) / starvationDeaths.length
    : 0;

  // Days survived by ending type
  const daysByReason = {};
  results.forEach(r => {
    if (!daysByReason[r.endReason]) daysByReason[r.endReason] = [];
    daysByReason[r.endReason].push(r.days);
  });
  const avgDaysByReason = {};
  Object.entries(daysByReason).forEach(([k, arr]) => {
    avgDaysByReason[k] = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
  });

  // Node reached by ending type
  const nodeByReason = {};
  results.forEach(r => {
    if (!nodeByReason[r.endReason]) nodeByReason[r.endReason] = [];
    nodeByReason[r.endReason].push(r.finalNode);
  });
  const avgNodeByReason = {};
  Object.entries(nodeByReason).forEach(([k, arr]) => {
    avgNodeByReason[k] = Math.round(arr.reduce((s, v) => s + v, 0) * 10 / arr.length) / 10;
  });

  // Action frequencies
  const actionFreq = {
    travel: avg('travelCount'),
    camp: avg('campCount'),
    events: avg('eventCount'),
    trade: avg('tradeCount'),
    forage: avg('forageCount'),
    repair: avg('repairCount'),
    rest: avg('restCount'),
    continueThrough: avg('continueCount'),
  };

  return {
    total, wins: wins.length, winRate: Math.round(wins.length / total * 1000) / 10,
    victories: victories.length, triumphant, humble,
    avgScore, medianScore, minScore, maxScore, buckets,
    avgDays: avg('days'), avgFinalFood: Math.round(avg('finalFood') * 10) / 10,
    avgFinalWear: Math.round(avg('finalWear') * 10) / 10,
    avgFinalMorale: Math.round(avg('finalMorale')),
    avgFinalNode: Math.round(avg('finalNode') * 10) / 10,
    avgTradeGoodsAtEnd: Math.round(avgTradeGoodsAtEnd * 10) / 10,
    avgLossNode,
    avgFoodAtStarvation: Math.round(avgFoodAtStarvation * 10) / 10,
    reasons, avgDaysByReason, avgNodeByReason, actionFreq,
    deathDistribution: Object.entries(reasons).filter(([k]) => k !== 'victory').sort((a, b) => b[1] - a[1]),
  };
}

// ─── Run ───────────────────────────────────────────────────────────
console.log(`[sim] Starting ${SIM_COUNT} simulations...\n`);

const results = [];
for (let i = 0; i < SIM_COUNT; i++) {
  results.push(runSim(Math.floor(Math.random() * 2147483647)));
  if ((i + 1) % 50 === 0) process.stdout.write(`  ${i + 1}/${SIM_COUNT}...\n`);
}

const s = aggregate(results);

// ─── Report ────────────────────────────────────────────────────────
console.log(`\n═══════════════════════════════════════════════════════════════`);
console.log(`  METIS TRAIL V2 — PLAYTEST RESULTS`);
console.log(`  ${s.total} simulations | ${new Date().toISOString().slice(0, 10)}`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

console.log(`OVERALL RESULTS`);
console.log(`  Win rate:     ${s.winRate}% (${s.wins}/${s.total})`);
console.log(`  — Triumphant (≥1400): ${s.triumphant}  (${Math.round(s.triumphant / s.total * 100)}% of all)`);
console.log(`  — Humble (<1400):     ${s.humble}  (${Math.round(s.humble / s.total * 100)}% of all)`);
console.log(`  — Losses:              ${s.total - s.wins}  (${Math.round((s.total - s.wins) / s.total * 100)}% of all)\n`);

console.log(`DEATH BREAKDOWN`);
s.deathDistribution.forEach(([reason, count]) => {
  const pct = Math.round(count / s.total * 1000) / 10;
  const avgD = s.avgDaysByReason[reason] || '?';
  const avgN = s.avgNodeByReason[reason] || '?';
  console.log(`  ${reason.padEnd(16)} ${String(count).padStart(3)} (${String(pct).padStart(5)}%)  avg ${avgD} days  node ${avgN}`);
});
console.log();

console.log(`SCORE DISTRIBUTION (wins only, n=${s.victories})`);
Object.entries(s.buckets).forEach(([bucket, count]) => {
  if (count > 0) {
    const pct = Math.round(count / s.victories * 1000) / 10;
    const bar = '█'.repeat(Math.max(1, Math.round(pct / 3)));
    console.log(`  ${bucket.padStart(6)}: ${bar} ${count} (${pct}%)`);
  }
});
if (s.victories > 0) {
  console.log(`  Average: ${s.avgScore}  Median: ${s.medianScore}  Range: ${s.minScore}–${s.maxScore}`);
}
console.log();

console.log(`GAMEPLAY METRICS`);
console.log(`  Avg days survived:      ${s.avgDays}`);
console.log(`  Avg final food:         ${s.avgFinalFood}`);
console.log(`  Avg final wear:         ${s.avgFinalWear}`);
console.log(`  Avg final morale:       ${s.avgFinalMorale}`);
console.log(`  Avg furthest node:      ${s.avgFinalNode}/12 (12 = Fort Edmonton)`);
console.log(`  Avg trade goods at end: ${s.avgTradeGoodsAtEnd} (winners)`);
console.log(`  Avg node at death:      ${s.avgLossNode} (losers)`);
console.log(`  Avg food at starvation: ${s.avgFoodAtStarvation}\n`);

console.log(`ACTION FREQUENCY (per game)`);
Object.entries(s.actionFreq).forEach(([action, avg]) => {
  console.log(`  ${action.padEnd(16)} ${avg.toFixed(1)}`);
});
console.log();

// ─── Balance Analysis ──────────────────────────────────────────────
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  BALANCE RECOMMENDATIONS`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

// Win rate assessment
if (s.winRate < 8) {
  console.log(`🔴 CRITICALLY HARD (${s.winRate}% win rate)`);
  console.log(`   Most players cannot reach Edmonton. Urgent rebalancing needed.`);
  console.log(`   → Increase food from events (many events give 0 food)`);
  console.log(`   → Reduce DAILY_FOOD consumption from 1.0 to 0.8`);
  console.log(`   → Lower event DCs by 1-2 across the board`);
  console.log(`   → Add more foraging opportunities or increase forage yield`);
} else if (s.winRate < 20) {
  console.log(`🟠 HARD (${s.winRate}% win rate)`);
  console.log(`   Challenging but possible. Good for hardcore, frustrating for casual.`);
  console.log(`   → Consider adding a "novice" difficulty with +5 starting food`);
  console.log(`   → Increase food yield from trade events`);
  console.log(`   → Reduce wear accumulation on plains terrain`);
} else if (s.winRate < 40) {
  console.log(`🟡 MODERATE (${s.winRate}% win rate)`);
  console.log(`   Good challenge level for most players. Fine-tune specific pain points.`);
} else if (s.winRate < 60) {
  console.log(`🟢 FAIRLY EASY (${s.winRate}% win rate)`);
  console.log(`   Most players win. May lack tension for experienced players.`);
  console.log(`   → Consider scaling difficulty with fewer items or harsher events`);
} else {
  console.log(`🔵 VERY EASY (${s.winRate}% win rate)`);
  console.log(`   Near-universal victory. Game needs more challenge.`);
  console.log(`   → Increase DAILY_FOOD consumption`);
  console.log(`   → Raise event DCs by 1-2`);
  console.log(`   → Add weather penalties`);
  console.log(`   → Reduce starting food`);
}
console.log();

// Death-specific analysis
const starvationPct = (s.reasons.starvation || 0) / s.total * 100;
const winterPct = (s.reasons.winter || 0) / s.total * 100;
const abandonedPct = (s.reasons.abandoned || 0) / s.total * 100;
const cartFailPct = (s.reasons.cart_failure || 0) / s.total * 100;

if (starvationPct > 25) {
  console.log(`🔴 FOOD ECONOMY CRITICAL: ${Math.round(starvationPct)}% of games end in starvation`);
  console.log(`   → Add more food-positive event choices`);
  console.log(`   → Increase base food yield from trading`);
  console.log(`   → Reduce daily food consumption to 0.8`);
  console.log(`   → Give players +10 starting food or a free foraging day`);
  console.log();
}
if (winterPct > 15) {
  console.log(`🟠 SPEED TRIAL ISSUE: ${Math.round(winterPct)}% caught by winter`);
  console.log(`   → Trail is too long for the season window`);
  console.log(`   → Reduce segment distances by 1-2 on late nodes`);
  console.log(`   → Start season earlier (May instead of June 15)`);
  console.log(`   → Add "express" trail choices that save a day at risk`);
  console.log();
}
if (abandonedPct > 15) {
  console.log(`🟠 MORALE TOO PUNISHING: ${Math.round(abandonedPct)}% crew abandonment`);
  console.log(`   → Reduce morale penalties on events (many are -8 to -20)`);
  console.log(`   → Increase morale recovery from camping (+15 is low)`);
  console.log(`   → Add more positive-morale events`);
  console.log(`   → Raise starting morale from 70 to 80`);
  console.log();
}
if (cartFailPct > 15) {
  console.log(`🟠 WEAR TOO AGGRESSIVE: ${Math.round(cartFailPct)}% cart failure deaths`);
  console.log(`   → Reduce wear accumulation probability on events`);
  console.log(`   → Make repair at settlement more effective (-2 wear instead of -1)`);
  console.log(`   → Add a "spare parts" starting item`);
  console.log(`   → Lower wear event DCs so repairs succeed more often`);
  console.log();
}

// Score spread
if (s.victories > 0) {
  if (s.triumphant === 0) {
    console.log(`🟠 NO TRIUMPHRIC ENDINGS: 1100 threshold unreachable`);
    console.log(`   → Verify calcScore() formula gives reachable scores`);
    console.log(`   → Consider lowering threshold to 900`);
    console.log(`   → Or increase trade goods scoring`);
    console.log();
  }
  if (s.triumphant > 0 && s.humble > 0) {
    const ratio = Math.round(s.triumphant / s.humble * 10) / 10;
    if (ratio > 5) {
      console.log(`🟡 TOO MANY TRIUMPHANT (${ratio}:1 vs humble)`);
      console.log(`   → Victory is too consistent once reached`);
      console.log(`   → Consider: score ≥ 1300 for Triumphant, or increase days penalty`);
      console.log();
    }
  }
}

// Action economy analysis
if (s.actionFreq.camp > 15) {
  console.log(`🟡 EXCESSIVE CAMPING (${s.actionFreq.camp.toFixed(1)}/game average)`);
  console.log(`   → Crew exhaustion happens too often`);
  console.log(`   → May need more frequent rest points (every 4 days instead of 5)`);
  console.log(`   → Or reduce crew exhaustion threshold from 5 to 6 days`);
  console.log();
}

if (s.actionFreq.events < 3) {
  console.log(`🟡 TOO FEW EVENTS (${s.actionFreq.events.toFixed(1)}/game average)`);
  console.log(`   → Players see only 2-3 events per playthrough`);
  console.log(`   → Increase EVENT_CHANCE from 0.35 to 0.45`);
  console.log(`   → Game may feel empty; more content needed`);
  console.log();
}

if (s.actionFreq.trade < 0.5 && s.victories > 0) {
  console.log(`🟡 RARELY ANY TRADING (${s.actionFreq.trade.toFixed(1)}/game)`);
  console.log(`   → Trade system may be underutilized`);
  console.log(`   → May not be worth the weight capacity`);
  console.log(`   → Consider: make trade more rewarding (increase food yield)`);
  console.log();
}

if (s.actionFreq.forage > 8) {
  console.log(`🟡 FORAGE SPAMMING (${s.actionFreq.forage.toFixed(1)}/game)`);
  console.log(`   → Forage may be the dominant strategy`);
  console.log(`   → Consider: reduce forage success chance, add diminishing returns`);
  console.log();
}

// Per-node death analysis
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  NODE-BY-NODE DEATH MAP`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

const nodes = [...new Set(results.map(r => r.finalNode))].sort((a, b) => a - b);
nodes.forEach(n => {
  const here = results.filter(r => r.finalNode === n);
  const deaths = here.filter(r => !r.won);
  const passes = here.filter(r => r.won || r.finalNode > n);
  if (deaths.length > 0) {
    const deathReasons = {};
    deaths.forEach(r => { deathReasons[r.endReason] = (deathReasons[r.endReason] || 0) + 1; });
    const reasonStr = Object.entries(deathReasons).map(([k, v]) => `${k}:${v}`).join(', ');
    console.log(`  Node ${String(n).padStart(2)}: ${deaths.length} deaths (${reasonStr})`);
  }
});
console.log();

// Spot-check last 5
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  SAMPLE REPLAYS (last 5)`);
console.log(`═══════════════════════════════════════════════════════════════\n`);
results.slice(-5).forEach(r => {
  const icon = r.won ? '✓' : '✗';
  console.log(`  ${icon} seed=${r.seed} | ${r.endReason.padEnd(12)} | score=${String(r.score).padStart(4)} | days=${String(r.days).padStart(3)} | node=${r.finalNode} | food=${String(r.finalFood).padStart(5)} | wear=${r.finalWear} | morale=${String(r.finalMorale).padStart(3)} | camps=${r.campCount} | events=${r.eventCount}`);
});

// JSON export
if (process.argv.includes('--json')) {
  const fs = await import('fs');
  const outPath = new URL('../tests/results.json', import.meta.url);
  fs.default.writeFileSync(outPath, JSON.stringify({ stats: s, results }, null, 2));
  console.log(`\nFull results written to tests/results.json`);
}
