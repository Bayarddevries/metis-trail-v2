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
// MB-based economy: trade goods → MB credit → spend on food/repair/heal
// Actions are now objects with {id, label, cost, risk, flavor}
function pickSettlementAction(actions, state, rand) {
  // actions is array of {id, label, cost, risk, flavor}
  const actionIds = actions.map(a => typeof a === 'string' ? a : a.id);
  const weights = actionIds.map(a => {
    if (a === 'continue') return 15;
    if (a === 'rest' && (state.crew !== 'rested' || state.morale < 50)) return 30;
    if (a === 'rest') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit >= 0.5 && state.food < 10) return 5;
      return 10;
    }
    // Trade: convert goods to MB credit
    if (a === 'trade' || a === 'trade_limited') {
      const mb = state.mbValue || 0;
      if (mb >= 8) return 2;
      if (state.food > 15) return 20;
      if (state.food > 10) return 12;
      return 2;
    }
    // Buy food with MB credit
    if (a === 'buy_food') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 0.5) return 0;
      if (state.food < 3) return 80;
      if (state.food < 6) return 60;
      if (state.food < 10) return 45;
      if (state.food < 15) return 30;
      return 10;
    }
    // Buy repair with MB credit
    if (a === 'buy_repair') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 2 || state.wear <= 0) return 0;
      if (state.wear >= 4) return 35;
      if (state.wear >= 2) return 20;
      return 5;
    }
    // Buy heal with MB credit
    if (a === 'buy_heal' || a === 'heal_crew') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 1) return 0;
      if (state.morale < 30) return 30;
      if (state.morale < 50) return 15;
      return 3;
    }
    // Buy info / get intel with MB credit
    if (a === 'buy_info' || a === 'get_intel') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 0.5) return 0;
      return 5;
    }
    // Trade gossip (free, gives intel + morale)
    if (a === 'trade_gossip') {
      return 12;
    }
    // Recruit crew (costs 2 credit + 1 food)
    if (a === 'recruit_crew') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 2 || state.food < 1) return 0;
      if (state.crew === 'exhausted') return 25;
      if (state.crew === 'tired') return 15;
      return 5;
    }
    // Dance (costs 1 food, boosts morale)
    if (a === 'dance') {
      if (state.food < 1) return 0;
      if (state.morale < 30) return 20;
      if (state.morale < 50) return 12;
      return 5;
    }
    // Share food (costs 2+ food, boosts morale + reputation)
    if (a === 'share_food') {
      if (state.food < 4) return 0;
      if (state.morale < 40) return 15;
      return 5;
    }
    // Get blessing (costs 1 food, gives roll buff)
    if (a === 'get_blessing') {
      if (state.food < 1) return 0;
      if (state.blessingDays > 0) return 2; // already blessed
      return 10;
    }
    // Craft hides
    if (a === 'craft' || a === 'craft_hides') return 12;
    // Pay fines
    if (a === 'pay_fines') {
      if ((state.fines || 0) <= 0) return 0;
      return 30;
    }
    // Get permits
    if (a === 'get_permits') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 2) return 0;
      return 8;
    }
    // Report duty (free, gives credit but costs time)
    if (a === 'report_duty') return 6;
    // Buy ammo
    if (a === 'buy_ammo') {
      const credit = state.credit?.[state.pendingSettlementType || 'hbc'] || 0;
      if (credit < 1.5) return 0;
      return 8;
    }
    // Legacy repair/heal (free)
    if (a === 'repair' && state.wear >= 3) return 30;
    if (a === 'repair' && state.wear >= 1) return 15;
    if (a === 'repair') return 3;
    if (a === 'heal' && (state.crew !== 'rested' || state.morale < 60)) return 20;
    if (a === 'heal') return 5;
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

// ─── Camp action weighting ─────────────────────────────────────────
// Simulates the player choosing a camp action after makeCamp().
// Context-aware: respects terrain, items, crew state, food.
function pickCampAction(state, cart, rand) {
  const actions = [];

  // Rest: always available if food >= 1
  if (state.food >= 1) {
    let restWeight = 20;
    if (state.crew === 'exhausted') restWeight = 50;
    else if (state.crew === 'tired') restWeight = 35;
    if (state.morale < 30) restWeight += 15;
    actions.push({ type: 'rest', weight: restWeight });
  }

  // Forage: available in river_valley/wooded (not plains)
  const terrain = state.currentTerrain || 'plains';
  if (terrain !== 'plains') {
    let forageWeight = 15;
    if (state.food < 6) forageWeight = 40;
    else if (state.food < 10) forageWeight = 25;
    actions.push({ type: 'forage', weight: forageWeight });
  }

  // Hunt: requires Ammunition Belt + open terrain (not wooded)
  const hasAmmo = cart.some(i => i.name === 'Ammunition Belt' && i.count > 0);
  if (hasAmmo && terrain !== 'wooded') {
    let huntWeight = 10;
    if (state.food < 6) huntWeight = 35;
    else if (state.food < 10) huntWeight = 20;
    actions.push({ type: 'hunt', weight: huntWeight });
  }

  // Repair: requires wear > 0 + Shaganappi
  const hasShag = cart.some(i => i.name === 'Shaganappi' && i.count > 0);
  if (state.wear > 0 && hasShag) {
    let repairWeight = 10;
    if (state.wear >= 4) repairWeight = 45;
    else if (state.wear >= 2) repairWeight = 25;
    actions.push({ type: 'repair', weight: repairWeight });
  }

  // Scout: requires next node exists (not at final destination)
  if (state.node < 12) {
    actions.push({ type: 'scout', weight: 8 });
  }

  // Dance: always available
  let danceWeight = 8;
  if (state.morale < 30) danceWeight = 20;
  else if (state.morale < 50) danceWeight = 12;
  actions.push({ type: 'dance', weight: danceWeight });

  // Process Pemmican: requires food >= 3
  if (state.food >= 3) {
    actions.push({ type: 'pemmican_process', weight: 10 });
  }

  // Deep Rest: requires food >= 2
  if (state.food >= 2) {
    let deepRestWeight = 8;
    if (state.crew === 'exhausted') deepRestWeight = 30;
    else if (state.crew === 'tired') deepRestWeight = 18;
    actions.push({ type: 'deeprest', weight: deepRestWeight });
  }

  // Push On: skip camp benefits, take penalties
  // Only consider if crew is not exhausted and morale is decent
  if (state.crew !== 'exhausted' && state.morale > 20) {
    let pushOnWeight = 3;
    if (state.food > 15 && state.morale > 60) pushOnWeight = 8;
    actions.push({ type: 'push_on', weight: pushOnWeight });
  }

  if (actions.length === 0) return 'rest'; // fallback

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

  // ── Offload to capacity ──
  let weight = game.totalWeight();
  const cap = game.getState().capacity;
  if (weight > cap) {
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
  let pushOnCount = 0;
  let eventCount = 0;
  let tradeCount = 0;
  let buyFoodCount = 0;
  let buyRepairCount = 0;
  let buyHealCount = 0;
  let buyInfoCount = 0;
  let repairCount = 0;
  let restCount = 0;
  let continueCount = 0;
  let travelCount = 0;
  let forageCount = 0;
  let huntCount = 0;
  let scoutCount = 0;
  let danceCount = 0;
  let pemmicanCount = 0;
  let deepRestCount = 0;
  let squealCount = 0;
  let sundayRestCount = 0;
  // New settlement action trackers
  let gossipCount = 0;
  let getIntelCount = 0;
  let recruitCount = 0;
  let shareFoodCount = 0;
  let blessingCount = 0;
  let payFinesCount = 0;
  let getPermitsCount = 0;
  let reportDutyCount = 0;
  let buyAmmoCount = 0;
  let healCrewCount = 0;
  let craftCount = 0;
  let tradeLimitedCount = 0;

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
        // #81 — One action per settlement visit
        const settleType = s.pendingSettlement?.type || 'hbc';
        const stateForWeights = { ...s, pendingSettlementType: settleType };
        // pickSettlementAction now receives action objects and returns an action ID string
        const actionId = pickSettlementAction(actions.actions, game.getState(), Math.random);
        if (actionId === 'continue') {
          continueCount++;
        } else if (actionId) {
          // Track the action type
          if (actionId === 'rest') restCount++;
          else if (actionId === 'trade') tradeCount++;
          else if (actionId === 'buy_food') buyFoodCount++;
          else if (actionId === 'buy_repair') buyRepairCount++;
          else if (actionId === 'buy_heal') buyHealCount++;
          else if (actionId === 'buy_info') buyInfoCount++;
          else if (actionId === 'repair') repairCount++;
          else if (actionId === 'craft' || actionId === 'craft_hides') craftCount++;
          else if (actionId === 'trade_gossip') gossipCount++;
          else if (actionId === 'get_intel') getIntelCount++;
          else if (actionId === 'recruit_crew') recruitCount++;
          else if (actionId === 'dance') danceCount++;
          else if (actionId === 'share_food') shareFoodCount++;
          else if (actionId === 'get_blessing') blessingCount++;
          else if (actionId === 'pay_fines') payFinesCount++;
          else if (actionId === 'get_permits') getPermitsCount++;
          else if (actionId === 'report_duty') reportDutyCount++;
          else if (actionId === 'buy_ammo') buyAmmoCount++;
          else if (actionId === 'heal_crew') healCrewCount++;
          else if (actionId === 'trade_limited') tradeLimitedCount++;
          game.settlementAction(actionId);
        }
        // Continue west after one action
        game.settlementAction('continue');
      }
    } else {
      const actions = game.getAvailableActions();
      if (actions.type === 'travel') {
        // Decide: travel or camp
        // Camp if crew is exhausted, morale is critically low, or food is very low
        const needsCamp = s.crew === 'exhausted' || s.morale < 15 || s.food < 3;
        // Also camp periodically if crew is tired or morale is middling
        const wantsCamp = s.crew === 'tired' && s.travelDaysWithoutRest >= 3;
        const campRoll = Math.random() < 0.15; // 15% chance to camp opportunistically

        if (needsCamp || wantsCamp || campRoll) {
          // Decide which camp action to take BEFORE calling makeCamp
          // "push_on" means skip makeCamp entirely and apply penalties
          const cart = game.getCart();
          const campAction = pickCampAction(s, cart, Math.random);

          if (campAction === 'push_on') {
            // Push On: skip camp, apply penalties directly
            game.pushOn();
            pushOnCount++;
          } else {
            // Normal camp: make camp first, then execute action
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

          // Check if travel triggered a squeal event (wear >= 4)
          const afterState = game.getState();
          if (afterState.pendingEvent && afterState.pendingEvent.id === 'squeal_event') {
            squealCount++;
          }

          // Check if Sunday Rest was triggered (every 7th day)
          if (afterState.day > 0 && afterState.day % 7 === 0) {
            sundayRestCount++;
          }
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
    finalWeather: final.weather,
    tradeGoodsRemaining: tradeGoods,
    mbValue: final.mbValue || 0,
    credit: final.credit || {},
    campCount,
    pushOnCount,
    travelCount,
    eventCount,
    tradeCount,
    buyFoodCount,
    buyRepairCount,
    buyHealCount,
    buyInfoCount,
    forageCount,
    huntCount,
    scoutCount,
    danceCount,
    pemmicanCount,
    deepRestCount,
    restCount,
    continueCount,
    repairCount,
    squealCount,
    sundayRestCount,
    gossipCount,
    getIntelCount,
    recruitCount,
    shareFoodCount,
    blessingCount,
    payFinesCount,
    getPermitsCount,
    reportDutyCount,
    buyAmmoCount,
    healCrewCount,
    craftCount,
    tradeLimitedCount,
    totalActions: eventCount + tradeCount + forageCount + huntCount + scoutCount + danceCount + pemmicanCount + deepRestCount + restCount + continueCount + travelCount + campCount + gossipCount + getIntelCount + recruitCount + shareFoodCount + blessingCount + payFinesCount + getPermitsCount + reportDutyCount + buyAmmoCount + healCrewCount + craftCount + tradeLimitedCount,
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

  // MB value for winners
  const avgMBAtEnd = victories.length
    ? victories.reduce((s, r) => s + (r.mbValue || 0), 0) / victories.length
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

  // Weather distribution at end
  const weatherDist = {};
  results.forEach(r => {
    const w = r.finalWeather || 'unknown';
    weatherDist[w] = (weatherDist[w] || 0) + 1;
  });

  // Action frequencies
  const actionFreq = {
    travel: avg('travelCount'),
    camp: avg('campCount'),
    pushOn: avg('pushOnCount'),
    events: avg('eventCount'),
    trade: avg('tradeCount'),
    buyFood: avg('buyFoodCount'),
    buyRepair: avg('buyRepairCount'),
    buyHeal: avg('buyHealCount'),
    buyInfo: avg('buyInfoCount'),
    forage: avg('forageCount'),
    hunt: avg('huntCount'),
    scout: avg('scoutCount'),
    dance: avg('danceCount'),
    pemmican: avg('pemmicanCount'),
    deepRest: avg('deepRestCount'),
    rest: avg('restCount'),
    repair: avg('repairCount'),
    continueThrough: avg('continueCount'),
    squealEvents: avg('squealCount'),
    sundayRests: avg('sundayRestCount'),
    gossip: avg('gossipCount'),
    getIntel: avg('getIntelCount'),
    recruit: avg('recruitCount'),
    shareFood: avg('shareFoodCount'),
    blessing: avg('blessingCount'),
    payFines: avg('payFinesCount'),
    getPermits: avg('getPermitsCount'),
    reportDuty: avg('reportDutyCount'),
    buyAmmo: avg('buyAmmoCount'),
    healCrew: avg('healCrewCount'),
    craft: avg('craftCount'),
    tradeLimited: avg('tradeLimitedCount'),
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
    avgMBAtEnd: Math.round(avgMBAtEnd * 10) / 10,
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
console.log(`  METIS TRAIL V2 — PLAYTEST RESULTS (v79 camp overhaul)`);
console.log(`  ${s.total} simulations | ${new Date().toISOString().slice(0, 10)}`);
console.log(`═══════════════════════════════════════════════════════════════\n`);

console.log(`OVERALL RESULTS`);
console.log(`  Win rate:     ${s.winRate}% (${s.wins}/${s.total})`);
console.log(`  — Triumphant (≥1100): ${s.triumphant}  (${Math.round(s.triumphant / s.total * 100)}% of all)`);
console.log(`  — Humble (<1100):     ${s.humble}  (${Math.round(s.humble / s.total * 100)}% of all)`);
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
console.log(`  Avg MB value at end:    ${s.avgMBAtEnd} (winners, need ${CONSTANTS.MB_WIN_THRESHOLD} to win)`);
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

// Win rate assessment
if (s.winRate < 8) {
  console.log(`🔴 CRITICALLY HARD (${s.winRate}% win rate)`);
  console.log(`   Most players cannot reach Edmonton. Urgent rebalancing needed.`);
  console.log(`   → Increase food from events (many events give 0 food)`);
  console.log(`   → Reduce DAILY_FOOD consumption from 1.35 to 1.1`);
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
const noTradePct = (s.reasons.no_trade || 0) / s.total * 100;

if (starvationPct > 25) {
  console.log(`🔴 FOOD ECONOMY CRITICAL: ${Math.round(starvationPct)}% of games end in starvation`);
  console.log(`   → Add more food-positive event choices`);
  console.log(`   → Increase base food yield from trading`);
  console.log(`   → Reduce daily food consumption`);
  console.log(`   → Give players +3 starting food or a free foraging day`);
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
  console.log(`   → Increase morale recovery from camping`);
  console.log(`   → Add more positive-morale events`);
  console.log(`   → Raise starting morale from 70 to 80`);
  console.log();
}
if (cartFailPct > 15) {
  console.log(`🟠 WEAR TOO AGGRESSIVE: ${Math.round(cartFailPct)}% cart failure deaths`);
  console.log(`   → Reduce wear accumulation probability on events`);
  console.log(`   → Make repair at settlement more effective`);
  console.log(`   → Add a "spare parts" starting item`);
  console.log(`   → Lower wear event DCs so repairs succeed more often`);
  console.log();
}
if (noTradePct > 20) {
  console.log(`🟠 NO_TRADE LOSSES: ${Math.round(noTradePct)}% reach Edmonton without enough MB`);
  console.log(`   → MB win threshold may be too high (currently ${CONSTANTS.MB_WIN_THRESHOLD})`);
  console.log(`   → Add more trade-good-giving events`);
  console.log(`   → Reduce trade good weight`);
  console.log(`   → Make trading at settlements more rewarding`);
  console.log();
}

// Score spread
if (s.victories > 0) {
  if (s.triumphant === 0) {
    console.log(`🟠 NO TRIUMPHANT ENDINGS: 1100 threshold unreachable`);
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

// Camp action analysis
if (s.actionFreq.camp > 20) {
  console.log(`🟡 EXCESSIVE CAMPING (${s.actionFreq.camp.toFixed(1)}/game average)`);
  console.log(`   → Crew exhaustion happens too often`);
  console.log(`   → May need more frequent rest points`);
  console.log(`   → Or reduce crew exhaustion threshold from 5 to 6 days`);
  console.log();
}

if (s.actionFreq.pushOn > 5) {
  console.log(`🟡 HIGH PUSH-ON RATE (${s.actionFreq.pushOn.toFixed(1)}/game)`);
  console.log(`   → Players are skipping camp too often`);
  console.log(`   → Push On penalties may need to be harsher`);
  console.log();
}

if (s.actionFreq.forage > 8) {
  console.log(`🟡 FORAGE SPAMMING (${s.actionFreq.forage.toFixed(1)}/game)`);
  console.log(`   → Forage may be the dominant strategy`);
  console.log(`   → Consider: reduce forage success chance, add diminishing returns`);
  console.log();
}

if (s.actionFreq.hunt > 5) {
  console.log(`🟡 HUNT HEAVY (${s.actionFreq.hunt.toFixed(1)}/game)`);
  console.log(`   → Hunt is being used frequently; check if it's overpowered`);
  console.log(`   → Ammunition Belt scarcity should limit this`);
  console.log();
}

if (s.actionFreq.events < 5) {
  console.log(`🟡 TOO FEW EVENTS (${s.actionFreq.events.toFixed(1)}/game average)`);
  console.log(`   → Players see only a few events per playthrough`);
  console.log(`   → Increase EVENT_CHANCE or add more event content`);
  console.log();
}

if (s.actionFreq.squealEvents > 3) {
  console.log(`🟠 SQUEAL EVENTS HIGH (${s.actionFreq.squealEvents.toFixed(1)}/game)`);
  console.log(`   → Wear accumulation is triggering too many squeal events`);
  console.log(`   → Consider: raise wear threshold from 4 to 5`);
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
  console.log(`  ${icon} seed=${r.seed} | ${r.endReason.padEnd(12)} | score=${String(r.score).padStart(4)} | days=${String(r.days).padStart(3)} | node=${r.finalNode} | food=${String(r.finalFood).padStart(5)} | wear=${r.finalWear} | morale=${String(r.finalMorale).padStart(3)} | camps=${r.campCount} | events=${r.eventCount} | weather=${r.finalWeather}`);
});

// JSON export
if (process.argv.includes('--json')) {
  const fs = await import('fs');
  const outPath = new URL('../tests/results.json', import.meta.url);
  fs.default.writeFileSync(outPath, JSON.stringify({ stats: s, results }, null, 2));
  console.log(`\nFull results written to tests/results.json`);
}
