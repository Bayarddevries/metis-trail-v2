import { createGame } from '../src/systems/engine.js';
import { CONSTANTS } from '../src/core/constants.js';

const SIM_COUNT = process.argv[2] ? parseInt(process.argv[2], 10) : 200;

// ─── Choice weighting ──────────────────────────────────────────────
function weightedChoiceIndex(choices, rand) {
  const scored = choices.map((c, i) => {
    let score = 50;
    if (c.dc === null) score += 12;
    if (c.morale > 0) score += 15;
    if (c.food > 0) score += 12;
    if (c.dc !== null && c.dc <= 10) score += 8;
    if (c.dc !== null && c.dc >= 14) score -= 12;
    if (c.requiresItem) score -= 5;
    return { i, score };
  });

  if (rand() < 0.7) {
    scored.sort((a, b) => b.score - a.score);
    const halfLen = Math.max(1, Math.ceil(scored.length / 2));
    return scored[Math.floor(rand() * halfLen)].i;
  }
  return Math.floor(rand() * choices.length);
}

// ─── Settlement action weighting ───────────────────────────────────
function pickSettlementAction(actions, state, rand) {
  // actions is array of {id, label, cost, risk, flavor, desc}
  const weights = actions.map(a => {
    const id = typeof a === 'string' ? a : a.id;

    // Continue - low priority unless desperate
    if (id === 'continue') return 5;

    // Rest actions
    if (id.startsWith('rest_blessing')) {
      if (state.crew !== 'rested' || state.morale < 60) return 35;
      if (state.blessingDays > 0) return 3;
      return 15;
    }
    if (id.startsWith('rest')) {
      if (state.crew === 'exhausted') return 40;
      if (state.crew === 'tired') return 25;
      if (state.morale < 40) return 15;
      return 8;
    }

    // Heal crew
    if (id.startsWith('heal_crew')) {
      const hasMedicine = state.cart?.some(i => i.name === 'Medicine Pouch' && i.count > 0) || false;
      if (!hasMedicine && state.food < 2) return 0;
      if (state.morale < 30) return 30;
      if (state.morale < 50) return 20;
      return 5;
    }

    // Trade furs for food
    if (id.startsWith('trade_furs_food')) {
      const hasFur = state.cart?.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0) || false;
      if (!hasFur) return 0;
      if (state.food < 3) return 60;
      if (state.food < 6) return 45;
      if (state.food < 10) return 30;
      if (state.food < 15) return 15;
      return 5;
    }

    // Trade furs for supplies
    if (id.startsWith('trade_furs_supplies')) {
      const hasFur = state.cart?.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0) || false;
      if (!hasFur) return 0;
      if (id.includes('ammunition')) {
        const hasAmmo = state.cart?.some(i => i.name === 'Ammunition Belt' && i.count > 0) || false;
        if (hasAmmo) return 3;
        return 15;
      }
      if (id.includes('shaganappi')) {
        if (state.wear >= 3) return 30;
        if (state.wear >= 1) return 15;
        return 5;
      }
      if (id.includes('medicine')) {
        const hasMedicine = state.cart?.some(i => i.name === 'Medicine Pouch' && i.count > 0) || false;
        if (hasMedicine) return 3;
        return 10;
      }
      if (id.includes('rope')) return 5;
      return 10;
    }

    // Métis gossip (trail intel)
    if (id === 'trade_gossip_0') return 15;

    // Métis dance
    if (id === 'dance_0') {
      if (state.food < 1) return 0;
      if (state.morale < 30) return 25;
      if (state.morale < 50) return 15;
      return 8;
    }

    // Métis share food
    if (id === 'share_food_0') {
      if (state.food < 4) return 0;
      if (state.morale < 40) return 20;
      return 8;
    }

    // NWMP permit
    if (id === 'permit_0') {
      const hasFur = state.cart?.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0) || false;
      if (!hasFur) return 0;
      if (!state.hasPermit) return 12;
      return 2;
    }

    // NWMP pay fine
    if (id === 'pay_fine_0') {
      if ((state.fines || 0) <= 0) return 0;
      const hasFur = state.cart?.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0) || false;
      if (!hasFur) return 0;
      return 30;
    }

    // NWMP buy ammo
    if (id === 'buy_ammo_0') {
      const hasFur = state.cart?.some(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0) || false;
      if (!hasFur) return 0;
      const hasAmmo = state.cart?.some(i => i.name === 'Ammunition Belt' && i.count > 0) || false;
      if (hasAmmo) return 5;
      return 15;
    }

    return 8;
  });

  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return actions[0]?.id || 'continue';
  let r = rand() * total;
  for (let i = 0; i < actions.length; i++) {
    r -= weights[i];
    if (r <= 0) return typeof actions[i] === 'string' ? actions[i] : actions[i].id;
  }
  return typeof actions[0] === 'string' ? actions[0] : actions[0]?.id || 'continue';
}

// ─── Camp action weighting ─────────────────────────────────────────
function pickCampAction(state, cart, rand) {
  const actions = [];
  const terrain = state.currentTerrain || 'plains';

  if (state.food >= 1) {
    let restWeight = 20;
    if (state.crew === 'exhausted') restWeight = 50;
    else if (state.crew === 'tired') restWeight = 35;
    if (state.morale < 30) restWeight += 15;
    actions.push({ type: 'rest', weight: restWeight });
  }

  if (terrain !== 'plains') {
    let forageWeight = 15;
    if (state.food < 6) forageWeight = 40;
    else if (state.food < 10) forageWeight = 25;
    actions.push({ type: 'forage', weight: forageWeight });
  }

  const hasAmmo = cart.some(i => i.name === 'Ammunition Belt' && i.count > 0);
  if (hasAmmo && terrain !== 'wooded') {
    let huntWeight = 10;
    if (state.food < 6) huntWeight = 35;
    else if (state.food < 10) huntWeight = 20;
    actions.push({ type: 'hunt', weight: huntWeight });
  }

  const hasShag = cart.some(i => i.name === 'Shaganappi' && i.count > 0);
  if (state.wear > 0 && hasShag) {
    let repairWeight = 10;
    if (state.wear >= 4) repairWeight = 45;
    else if (state.wear >= 2) repairWeight = 25;
    actions.push({ type: 'repair', weight: repairWeight });
  }

  if (state.node < 12) {
    actions.push({ type: 'scout', weight: 8 });
  }

  let danceWeight = 8;
  if (state.morale < 30) danceWeight = 20;
  else if (state.morale < 50) danceWeight = 12;
  actions.push({ type: 'dance', weight: danceWeight });

  if (state.food >= 3) {
    actions.push({ type: 'pemmican_process', weight: 10 });
  }

  if (state.food >= 2) {
    let deepRestWeight = 8;
    if (state.crew === 'exhausted') deepRestWeight = 30;
    else if (state.crew === 'tired') deepRestWeight = 18;
    actions.push({ type: 'deeprest', weight: deepRestWeight });
  }

  if (state.crew !== 'exhausted' && state.morale > 20) {
    let pushOnWeight = 3;
    if (state.food > 15 && state.morale > 60) pushOnWeight = 8;
    actions.push({ type: 'push_on', weight: pushOnWeight });
  }

  if (actions.length === 0) return 'rest';

  const total = actions.reduce((s, a) => s + a.weight, 0);
  let r = rand() * total;
  for (const a of actions) {
    r -= a.weight;
    if (r <= 0) return a.type;
  }
  return actions[0].type;
}

// ─── Single simulation ─────────────────────────────────────────────
function runSim(seed) {
  const game = createGame(seed);

  // Add starting food then confirm pre-departure
  game.addFood(15);
  game.confirmPreDeparture();

  // ── Offload to capacity if needed ──
  let weight = game.totalWeight();
  const cap = game.getState().capacity;
  if (weight > cap) {
    let offloadSafety = 0;
    while (game.totalWeight() > cap && offloadSafety++ < 200) {
      const cart = game.getCart();
      const loaded = cart.filter(i => i.count > 0);
      if (loaded.length === 0) break;
      // Offload heaviest non-essential items first
      const lowest = loaded.sort((a, b) => (b.wt || 0) - (a.wt || 0))[0];
      game.offloadItem(lowest.name);
    }
  }

  // ── Tracking ──
  let campCount = 0;
  let pushOnCount = 0;
  let eventCount = 0;
  let tradeCount = 0;
  let repairCount = 0;
  let restCount = 0;
  let travelCount = 0;
  let forageCount = 0;
  let huntCount = 0;
  let scoutCount = 0;
  let danceCount = 0;
  let pemmicanCount = 0;
  let deepRestCount = 0;
  let squealCount = 0;
  let sundayRestCount = 0;
  let gossipCount = 0;
  let shareFoodCount = 0;
  let blessingCount = 0;
  let payFinesCount = 0;
  let getPermitsCount = 0;
  let buyAmmoCount = 0;
  let healCrewCount = 0;

  const foodHistory = [];
  const wearHistory = [];
  const moraleHistory = [];

  const maxDays = 200;

  for (let step = 0; step < maxDays; step++) {
    if (game.isOver()) break;

    const s = game.getState();

    if (step % 5 === 0) {
      foodHistory.push({ step, food: s.food, wear: s.wear, morale: s.morale, node: s.node });
    }

    if (s.pendingEvent) {
      eventCount++;
      const ev = game.getPendingEvent();
      if (ev && ev.choices && ev.choices.length > 0) {
        const ci = weightedChoiceIndex(ev.choices, Math.random);
        game.chooseEventChoice(ci);
      }
    } else if (s.pendingSettlement) {
      // Get settlement actions using the current engine API
      const node = game.getCurrentNode();
      const settleType = node?.type || 'hbc';
      const actions = game.getSettlementActions(settleType);

      if (actions && actions.length > 0) {
        const cart = game.getCart();
        const stateForWeights = { ...s, cart };
        const actionId = pickSettlementAction(actions, stateForWeights, Math.random);

        if (actionId && actionId !== 'continue') {
          // Track action type
          if (actionId.startsWith('rest')) restCount++;
          else if (actionId.startsWith('trade_furs_food')) tradeCount++;
          else if (actionId.startsWith('trade_furs_supplies')) tradeCount++;
          else if (actionId === 'trade_gossip_0') gossipCount++;
          else if (actionId === 'dance_0') danceCount++;
          else if (actionId === 'share_food_0') shareFoodCount++;
          else if (actionId.startsWith('heal_crew')) healCrewCount++;
          else if (actionId.startsWith('rest_blessing')) blessingCount++;
          else if (actionId === 'permit_0') getPermitsCount++;
          else if (actionId === 'pay_fine_0') payFinesCount++;
          else if (actionId === 'buy_ammo_0') buyAmmoCount++;

          game.settlementAction(actionId);
        }
        // settlementAction already clears pendingSettlement on success
        // No need to call 'continue' separately
      }
    } else {
      const needsCamp = s.crew === 'exhausted' || s.morale < 15 || s.food < 3;
      const wantsCamp = s.crew === 'tired' && s.travelDaysWithoutRest >= 3;
      const campRoll = Math.random() < 0.15;

      if (needsCamp || wantsCamp || campRoll) {
        const cart = game.getCart();
        const campAction = pickCampAction(s, cart, Math.random);

        if (campAction === 'push_on') {
          game.pushOn();
          pushOnCount++;
        } else {
          game.makeCamp();
          campCount++;

          const result = game.campAction(campAction);
          if (result && !result.error) {
            switch (campAction) {
              case 'forage': forageCount++; break;
              case 'hunt': huntCount++; break;
              case 'repair': repairCount++; break;
              case 'scout': scoutCount++; break;
              case 'dance': danceCount++; break;
              case 'pemmican_process': pemmicanCount++; break;
              case 'deeprest': deepRestCount++; break;
              case 'rest': restCount++; break;
            }
          }
        }
      } else {
        game.travelOneDay();
        travelCount++;

        const afterState = game.getState();
        if (afterState.pendingEvent && afterState.pendingEvent.id === 'squeal_axle') {
          squealCount++;
        }
        if (afterState.day > 0 && afterState.day % 7 === 0) {
          sundayRestCount++;
        }
      }
    }
  }

  const final = game.getState();
  const finalCart = game.getCart();
  const tradeGoods = finalCart.filter(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0)
    .reduce((s, i) => s + i.count, 0);

  // Get endgame score (returns {score, breakdown, tier, ...})
  const endgameScore = game.getEndgameScore();

  return {
    seed,
    won: game.hasWon(),
    over: game.isOver(),
    endReason: final.endReason || 'timeout',
    score: endgameScore?.score || 0,
    tier: endgameScore?.tier || 'Defeat',
    breakdown: endgameScore?.breakdown || {},
    days: final.day,
    finalFood: final.food,
    finalWear: final.wear,
    finalMorale: final.morale,
    finalNode: final.node,
    finalCrew: final.crew,
    finalSeason: final.season,
    finalWeather: final.weather,
    tradeGoodsRemaining: tradeGoods,
    campCount,
    pushOnCount,
    travelCount,
    eventCount,
    tradeCount,
    forageCount,
    huntCount,
    scoutCount,
    danceCount,
    pemmicanCount,
    deepRestCount,
    restCount,
    repairCount,
    squealCount,
    sundayRestCount,
    gossipCount,
    shareFoodCount,
    blessingCount,
    payFinesCount,
    getPermitsCount,
    buyAmmoCount,
    healCrewCount,
    foodHistory,
  };
}

// ─── Aggregation ───────────────────────────────────────────────────
function aggregate(results) {
  const total = results.length;
  const wins = results.filter(r => r.won);
  const victories = results.filter(r => r.endReason === 'victory');
  const losses = results.filter(r => !r.won);

  const reasons = {};
  results.forEach(r => { reasons[r.endReason] = (reasons[r.endReason] || 0) + 1; });

  const scores = victories.map(r => r.score);
  const avgScore = scores.length ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : 0;
  const medianScore = scores.length ? [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)] : 0;
  const maxScore = scores.length ? Math.max(...scores) : 0;
  const minScore = scores.length ? Math.min(...scores) : 0;

  const buckets = { '0-499': 0, '500-799': 0, '800-999': 0, '1000-1199': 0, '1200-1399': 0, '1400+': 0 };
  scores.forEach(s => {
    if (s < 500) buckets['0-499']++;
    else if (s < 800) buckets['500-799']++;
    else if (s < 1000) buckets['800-999']++;
    else if (s < 1200) buckets['1000-1199']++;
    else if (s < 1400) buckets['1200-1399']++;
    else buckets['1400+']++;
  });

  // Tier distribution
  const tiers = {};
  victories.forEach(r => { tiers[r.tier] = (tiers[r.tier] || 0) + 1; });

  const avg = key => results.map(r => r[key]).reduce((s, v) => s + v, 0) / total;

  const avgTradeGoodsAtEnd = victories.length
    ? victories.reduce((s, r) => s + r.tradeGoodsRemaining, 0) / victories.length
    : 0;

  const lossNodes = losses.map(r => r.finalNode);
  const avgLossNode = lossNodes.length ? Math.round(lossNodes.reduce((s, v) => s + v, 0) * 10 / lossNodes.length) / 10 : 0;

  const starvationDeaths = results.filter(r => r.endReason === 'starvation');
  const avgFoodAtStarvation = starvationDeaths.length
    ? starvationDeaths.reduce((s, r) => s + r.finalFood, 0) / starvationDeaths.length
    : 0;

  const daysByReason = {};
  results.forEach(r => {
    if (!daysByReason[r.endReason]) daysByReason[r.endReason] = [];
    daysByReason[r.endReason].push(r.days);
  });
  const avgDaysByReason = {};
  Object.entries(daysByReason).forEach(([k, arr]) => {
    avgDaysByReason[k] = Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
  });

  const nodeByReason = {};
  results.forEach(r => {
    if (!nodeByReason[r.endReason]) nodeByReason[r.endReason] = [];
    nodeByReason[r.endReason].push(r.finalNode);
  });
  const avgNodeByReason = {};
  Object.entries(nodeByReason).forEach(([k, arr]) => {
    avgNodeByReason[k] = Math.round(arr.reduce((s, v) => s + v, 0) * 10 / arr.length) / 10;
  });

  const weatherDist = {};
  results.forEach(r => {
    const w = r.finalWeather || 'unknown';
    weatherDist[w] = (weatherDist[w] || 0) + 1;
  });

  const actionFreq = {
    travel: avg('travelCount'),
    camp: avg('campCount'),
    pushOn: avg('pushOnCount'),
    events: avg('eventCount'),
    trade: avg('tradeCount'),
    forage: avg('forageCount'),
    hunt: avg('huntCount'),
    scout: avg('scoutCount'),
    dance: avg('danceCount'),
    pemmican: avg('pemmicanCount'),
    deepRest: avg('deepRestCount'),
    rest: avg('restCount'),
    repair: avg('repairCount'),
    squealEvents: avg('squealCount'),
    sundayRests: avg('sundayRestCount'),
    gossip: avg('gossipCount'),
    shareFood: avg('shareFoodCount'),
    blessing: avg('blessingCount'),
    payFines: avg('payFinesCount'),
    getPermits: avg('getPermitsCount'),
    buyAmmo: avg('buyAmmoCount'),
    healCrew: avg('healCrewCount'),
  };

  return {
    total, wins: wins.length, winRate: Math.round(wins.length / total * 1000) / 10,
    victories: victories.length, tiers,
    avgScore, medianScore, minScore, maxScore, buckets,
    avgDays: avg('days'), avgFinalFood: Math.round(avg('finalFood') * 10) / 10,
    avgFinalWear: Math.round(avg('finalWear') * 10) / 10,
    avgFinalMorale: Math.round(avg('finalMorale')),
    avgFinalNode: Math.round(avg('finalNode') * 10) / 10,
    avgTradeGoodsAtEnd: Math.round(avgTradeGoodsAtEnd * 10) / 10,
    avgLossNode,
    avgFoodAtStarvation: Math.round(avgFoodAtStarvation * 10) / 10,
    reasons, avgDaysByReason, avgNodeByReason, actionFreq, weatherDist,
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
console.log(`  METIS TRAIL V2 — BALANCE REPORT (v14.2)`);
console.log(`  ${s.total} simulations | ${new Date().toISOString().slice(0, 10)}`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

console.log(`OVERALL RESULTS`);
console.log(`  Win rate:     ${s.winRate}% (${s.wins}/${s.total})`);
if (s.victories > 0) {
  console.log(`  Tier distribution (wins):`);
  Object.entries(s.tiers).forEach(([tier, count]) => {
    const pct = Math.round(count / s.victories * 1000) / 10;
    console.log(`    ${tier.padEnd(14)} ${count} (${pct}%)`);
  });
}
console.log(`  Losses:       ${s.total - s.wins} (${Math.round((s.total - s.wins) / s.total * 100)}%)\n`);

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
console.log(`  Avg furthest node:      ${s.avgFinalNode}/13 (13 = Fort Edmonton)`);
console.log(`  Avg trade goods at end: ${s.avgTradeGoodsAtEnd} (winners)`);
console.log(`  Avg node at death:      ${s.avgLossNode} (losers)`);
console.log(`  Avg food at starvation: ${s.avgFoodAtStarvation}\n`);

console.log(`WEATHER AT GAME END`);
Object.entries(s.weatherDist).forEach(([w, count]) => {
  const pct = Math.round(count / s.total * 1000) / 10;
  console.log(`  ${w.padEnd(12)} ${String(count).padStart(3)} (${pct}%)`);
});
console.log();

console.log(`ACTION FREQUENCY (per game)`);
Object.entries(s.actionFreq).forEach(([action, avg]) => {
  if (avg > 0.01) console.log(`  ${action.padEnd(16)} ${avg.toFixed(1)}`);
});
console.log();

// ─── Balance Analysis ──────────────────────────────────────────────
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  BALANCE RECOMMENDATIONS`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

const dailyFood = CONSTANTS.DAILY_FOOD || 0.6;
console.log(`  DAILY_FOOD: ${dailyFood} | Starting food: 18 | Max wear: ${CONSTANTS.MAX_WEAR || 8}`);
console.log(`  Event chance: ${CONSTANTS.EVENT_CHANCE || 0.45} | Nodes: 14\n`);

if (s.winRate < 8) {
  console.log(`🔴 CRITICALLY HARD (${s.winRate}% win rate)`);
  console.log(`   Most players cannot reach Edmonton. Urgent rebalancing needed.`);
} else if (s.winRate < 20) {
  console.log(`🟠 HARD (${s.winRate}% win rate)`);
  console.log(`   Challenging but possible. Good for hardcore, frustrating for casual.`);
} else if (s.winRate < 40) {
  console.log(`🟡 MODERATE (${s.winRate}% win rate)`);
  console.log(`   Good challenge level for most players. Fine-tune specific pain points.`);
} else if (s.winRate < 60) {
  console.log(`🟢 FAIRLY EASY (${s.winRate}% win rate)`);
  console.log(`   Most players win. May lack tension for experienced players.`);
} else {
  console.log(`🔵 VERY EASY (${s.winRate}% win rate)`);
  console.log(`   Near-universal victory. Game needs more challenge.`);
}
console.log();

const starvationPct = (s.reasons.starvation || 0) / s.total * 100;
const winterPct = (s.reasons.winter || 0) / s.total * 100;
const abandonedPct = (s.reasons.abandoned || 0) / s.total * 100;
const cartFailPct = (s.reasons.cart_failure || 0) / s.total * 100;

if (starvationPct > 25) {
  console.log(`🔴 FOOD CRITICAL: ${Math.round(starvationPct)}% starvation deaths`);
  console.log(`   → Increase food from events or reduce DAILY_FOOD (${dailyFood})`);
  console.log(`   → Add more foraging opportunities`);
  console.log();
}
if (winterPct > 15) {
  console.log(`🟠 WINTER WALL: ${Math.round(winterPct)}% caught by winter`);
  console.log(`   → Trail may be too long for season window`);
  console.log(`   → Consider starting earlier or reducing node distances`);
  console.log();
}
if (abandonedPct > 15) {
  console.log(`🟠 MORALE CRITICAL: ${Math.round(abandonedPct)}% crew abandonment`);
  console.log(`   → Reduce morale penalties on events`);
  console.log(`   → Increase morale recovery from camping`);
  console.log();
}
if (cartFailPct > 15) {
  console.log(`🟠 WEAR CRITICAL: ${Math.round(cartFailPct)}% cart failure deaths`);
  console.log(`   → Reduce wear accumulation or improve repair effectiveness`);
  console.log();
}

// Node-by-node death map
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  NODE-BY-NODE DEATH MAP`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

const nodes = [...new Set(results.map(r => r.finalNode))].sort((a, b) => a - b);
nodes.forEach(n => {
  const here = results.filter(r => r.finalNode === n);
  const deaths = here.filter(r => !r.won);
  if (deaths.length > 0) {
    const deathReasons = {};
    deaths.forEach(r => { deathReasons[r.endReason] = (deathReasons[r.endReason] || 0) + 1; });
    const reasonStr = Object.entries(deathReasons).map(([k, v]) => `${k}:${v}`).join(', ');
    console.log(`  Node ${String(n).padStart(2)}: ${deaths.length} deaths (${reasonStr})`);
  }
});
console.log();

// Sample replays
console.log(`═══════════════════════════════════════════════════════════════`);
console.log(`  SAMPLE REPLAYS (last 5)`);
console.log(`═══════════════════════════════════════════════════════════════\n`);
results.slice(-5).forEach(r => {
  const icon = r.won ? '✓' : '✗';
  console.log(`  ${icon} seed=${r.seed} | ${r.endReason.padEnd(12)} | score=${String(r.score).padStart(4)} | days=${String(r.days).padStart(3)} | node=${r.finalNode} | food=${String(r.finalFood).padStart(5)} | wear=${r.finalWear} | morale=${String(r.finalMorale).padStart(3)} | camps=${r.campCount} | events=${r.eventCount} | weather=${r.finalWeather}`);
});

// JSON export
if (process.argv.includes('--json')) {
  const fs = await import('fs');
  const outPath = new URL('../tests/results.json', import.meta.url);
  fs.default.writeFileSync(outPath, JSON.stringify({ stats: s, results }, null, 2));
  console.log(`\nFull results written to tests/results.json`);
}
