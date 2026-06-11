import { CONSTANTS } from '../core/constants.js';
import { crewMod, wearMod, totalMod } from '../core/constants.js';
import { advanceDate, seasonFor } from '../core/calendar.js';
import { makeRNG, d20 } from '../core/seed.js';
import { NODES } from '../data/nodes.js';
import { startingCart, totalWeight } from '../data/items.js';
import { getSource } from '../data/sources/index.js';
import { pickEventForTerrain } from '../data/events.js';

export function createGame(seed = null) {
  const rng = makeRNG(seed);
  function rand() {
    return rng ? rng() : Math.random();
  }

  function d() {
    return d20(rand);
  }

  // ── Weather helpers ──────────────────────────────────────────────
  function pickWeighted(weights) {
    const total = Object.values(weights).reduce((s, w) => s + w, 0);
    let r = rand() * total;
    for (const [key, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return key;
    }
    return Object.keys(weights)[0];
  }

  function initWeather() {
    return pickWeighted(CONSTANTS.SEASON_BASE_WEATHER[seasonFor(CONSTANTS.START_MONTH)]);
  }

  function advanceWeather() {
    const seasonWeights = CONSTANTS.SEASON_BASE_WEATHER[seasonFor(S.month)];
    let next = pickWeighted(CONSTANTS.WEATHER_TRANSITION[S.weather]);
    // Block impossible weather for current season (e.g., snow in summer)
    if (seasonWeights[next] === 0) {
      next = 'overcast';
    }
    S.weather = next;
  }

  const cart = startingCart();

  const S = {
    seed,
    day: 1,
    month: CONSTANTS.START_MONTH,
    year: CONSTANTS.YEAR,
    date: { month: CONSTANTS.START_MONTH, day: CONSTANTS.START_DAY },
    season: seasonFor(CONSTANTS.START_MONTH),
    crew: 'rested',
    food: 23,
    wear: 0,
    morale: 70,
    node: 0,
    segmentDay: 0,
    travelDaysWithoutRest: 0,
    over: false,
    won: false,
    score: 0,
    pendingEvent: null,
    pendingSettlement: null,
    camps: 0,
    eventsResolved: 0,
    tradesMade: 0,
    flags: {},
    reputation: { hbc: 0, nwmp: 0, metis: 0, mission: 0, cree: 0 },
    capacity: 100,
    usedWeight: 0,
    credit: { hbc: 0, metis: 0, nwmp: 0, mission: 0 },
    mbValue: 0,          // total MB value of all trade goods in cart
    perishable: {},
    preDeparture: true,
    weather: initWeather(),
  };

  // ── MB helpers ────────────────────────────────────────────────────
  function calcMB() {
    return cart.filter(i => i.type === 'trade' || i.category === 'furs')
      .reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
  }

  function recalcMB() {
    S.mbValue = Math.round(calcMB() * 100) / 100;
  }

  function checkGameOver() {
    if (S.over) return;
    if (S.food <= 0) {
      S.food = 0;
      S.over = true;
      S.endReason = 'starvation';
    }
    if (S.wear >= CONSTANTS.MAX_WEAR) {
      S.over = true;
      S.endReason = 'cart_failure';
    }
    if (S.season === 'early winter' && S.node < NODES.length - 1) {
      S.over = true;
      S.endReason = 'winter';
    }
    if (S.morale <= 0) {
      S.morale = 0;
      S.over = true;
      S.endReason = 'abandoned';
    }
  }

  function advance() {
    const next = advanceDate(S.date.month, S.date.day, 0);
    S.date = next;
    S.month = next.month;
    S.day++;
    S.season = seasonFor(S.month);
  }

  function resolveChoice(ev, ci) {
    const ch = ev.choices[ci];
    const result = { roll: null, total: null, dc: null, success: null, text: '', effects: [], flags: [], reps: [] };

    if (ch.requiresFlag && !S.flags[ch.requiresFlag]) {
      result.text = `You need a different circumstance for that.`;
      result.success = false;
      return result;
    }
    if (ch.requiresRep) {
      const cur = S.reputation[ch.requiresRep.key] || 0;
      if (cur < ch.requiresRep.min) {
        result.text = `Your reputation with the ${ch.requiresRep.key} is too low for that.`;
        result.success = false;
        return result;
      }
    }

    if (ch.dc !== null) {
      const roll = d();
      const total = roll + totalMod(S);
      const success = total >= ch.dc;
      result.roll = roll;
      result.total = total;
      result.dc = ch.dc;
      result.success = success;
      result.text = success ? `Success. ${ch.ok}` : `Failure. ${ch.bad}`;
      if (!success) {
        S.wear = Math.max(0, S.wear + (ch.wear || 0));
        result.effects.push(`${ch.wear || 0 >= 0 ? '+' : ''}${ch.wear || 0} Wear`);
      } else if (ch.wear) {
        S.wear = Math.max(0, S.wear + ch.wear);
        result.effects.push(`${ch.wear >= 0 ? '+' : ''}${ch.wear} Wear`);
      }
    } else if (ch.always) {
      result.text = ch.always;
      result.success = true;
      if (ch.alwaysWear) {
        S.wear = Math.max(0, S.wear + ch.alwaysWear);
        result.effects.push(`${ch.alwaysWear >= 0 ? '+' : ''}${ch.alwaysWear} Wear`);
      }
    }

    if (ch.time) {
      if (ch.time > 0) {
        advance();
        result.effects.push(`+${ch.time} day(s)`);
      }
      if (ch.time < 0) {
        S.segmentDay = Math.max(0, S.segmentDay + ch.time);
        result.effects.push(`${ch.time} day(s)`);
      }
    }
    if (ch.food) {
      S.food += ch.food;
      result.effects.push(`${ch.food > 0 ? '+' : ''}${ch.food} Food`);
    }
    if (ch.crew) {
      S.crew = ch.crew;
      result.effects.push(`Crew: ${ch.crew}`);
    }
    if (ch.morale) {
      S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
      result.effects.push(`${ch.morale >= 0 ? '+' : ''}${ch.morale} Morale`);
    }
    if (ch.give) {
      ch.give.forEach((g) => {
        const item = cart.find((i) => i.name === g.name);
        if (item) {
          item.count += g.amt;
          result.effects.push(`+${g.amt} ${g.name}`);
        }
      });
      recalcMB();
    }
    if (ch.consumesItem) {
      const idx = cart.findIndex((i) => i.name === ch.consumesItem);
      if (idx !== -1 && cart[idx].count > 0) {
        cart[idx].count--;
        result.effects.push(`-1 ${ch.consumesItem}`);
        recalcMB();
      }
    }
    if (ch.extraProgress) {
      S.segmentDay += ch.extraProgress;
      result.effects.push(`+${ch.extraProgress} progress`);
    }

    if (ch.setsFlag) {
      S.flags[ch.setsFlag] = true;
      result.flags.push(ch.setsFlag);
    }
    if (ch.addsRep) {
      S.reputation[ch.addsRep.key] = (S.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
      result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S.reputation[ch.addsRep.key] });
    }

    if (ch.branch && !S.pendingEvent) {
      const branched = typeof ch.branch === 'function' ? ch.branch({ flags: S.flags, reputation: S.reputation, rng: rand }) : ch.branch;
      if (branched) S.pendingEvent = branched;
    }

    S.eventsResolved++;
    return result;
  }

  function pickEvent() {
    if (rand() > CONSTANTS.EVENT_CHANCE) return null;
    return pickEventForTerrain(NODES[S.node]?.terrain || 'plains', rand);
  }

  function pickEventWithChance(chance) {
    if (rand() > chance) return null;
    return pickEventForTerrain(NODES[S.node]?.terrain || 'plains', rand);
  }

  function calcScore() {
    if (!S.won) return 0;
    const daysPenalty = S.day;
    const wearPenalty = S.wear * S.wear;
    const foodBonus = Math.min(S.food, 25);
    const crewBonus = S.crew === 'rested' ? 30 : S.crew === 'tired' ? 10 : 0;
    const noRestPenalty = Math.max(0, S.travelDaysWithoutRest - 3) * 15;

    let score = 1000;
    score += Math.round(S.mbValue * 80);
    score += foodBonus * 12;
    score += crewBonus;
    score -= daysPenalty * 8;
    score -= wearPenalty * 40;
    score -= noRestPenalty;
    return Math.max(0, Math.round(score));
  }

  const stepLog = [];

  function travelOneDay() {
    if (S.over || S.pendingSettlement) return stepLog;
    const nextDist = NODES[S.node + 1]?.dist || 1;

    // Advance weather at start of day
    advanceWeather();

    const weatherFood = CONSTANTS.WEATHER_FOOD_MOD[S.weather] || 0;
    S.food = Math.max(0, Math.round((S.food - CONSTANTS.DAILY_FOOD - weatherFood) * 10) / 10);
    S.segmentDay++;
    S.travelDaysWithoutRest++;
    advance();

    const wearChance = { plains: 0.10, river_valley: 0.15, wooded: 0.20 };
    const weatherWearMult = CONSTANTS.WEATHER_WEAR_MULT[S.weather] || 1;
    if (rand() < (wearChance[NODES[S.node].terrain] || 0.2) * weatherWearMult) S.wear++;

    // Squeal event: at high wear, the axle's scream draws attention
    if (S.wear >= 4 && rand() < 0.35) {
      S.pendingEvent = getSquealEvent();
      return stepLog;
    }

    if (S.travelDaysWithoutRest >= 5 && S.crew !== 'exhausted') S.crew = 'exhausted';
    else if (S.travelDaysWithoutRest >= 3 && S.crew === 'rested') S.crew = 'tired';

    const weatherMorale = CONSTANTS.WEATHER_MORALE_MOD[S.weather] || 0;
    S.morale = Math.max(0, Math.min(100, S.morale - 2 + weatherMorale));

    if (S.day % CONSTANTS.DAYS_PER_WEEK === 0 && !S.pendingSettlement) {
      S.crew = 'rested';
      S.wear = Math.max(0, S.wear - 1);
      S.travelDaysWithoutRest = 0;
      S.morale = Math.min(100, S.morale + 20);
      return stepLog;
    }

    if (S.segmentDay >= nextDist) {
      S.node++;
      S.segmentDay = 0;
      const n = S.node < NODES.length ? NODES[S.node] : null;
      if (!n) {
        S.over = true;
        return stepLog;
      }
      if (S.node >= NODES.length - 1) {
        const hasTrade = cart.some((i) => i.type === 'trade' && i.count > 0);
        recalcMB();
        S.over = true;
        // Check starvation/wear before declaring victory
        if (S.food <= 0) {
          S.endReason = 'starvation';
        } else if (S.wear >= CONSTANTS.MAX_WEAR) {
          S.endReason = 'cart_failure';
        } else if (S.morale <= 0) {
          S.endReason = 'abandoned';
        } else {
          S.won = S.mbValue >= CONSTANTS.MB_WIN_THRESHOLD;
          S.score = calcScore();
          S.endReason = S.won ? 'victory' : 'no_trade';
        }
        return stepLog;
      }
      if (n.type !== 'river' && S.node >= 1) S.pendingSettlement = n;
      return stepLog;
    }

    const weatherEventMod = CONSTANTS.WEATHER_EVENT_MOD[S.weather] || 0;
    const ev = pickEventWithChance(CONSTANTS.EVENT_CHANCE + weatherEventMod);
    if (ev) {
      S.pendingEvent = ev;
      return stepLog;
    }
    return stepLog;
  }

  function chooseEventChoice(choiceIndex) {
    if (!S.pendingEvent) return [];
    const ev = S.pendingEvent;
    S.pendingEvent = null;
    const result = resolveChoice(ev, choiceIndex);
    checkGameOver();
    if (S.segmentDay >= (NODES[S.node + 1]?.dist || 1)) {
      S.node++;
      S.segmentDay = 0;
      if (S.node >= NODES.length - 1) {
        const hasTrade = cart.some((i) => i.type === 'trade' && i.count > 0);
        recalcMB();
        S.over = true;
        S.won = S.mbValue >= CONSTANTS.MB_WIN_THRESHOLD && S.wear < CONSTANTS.MAX_WEAR;
        S.score = calcScore();
      } else {
        const n = NODES[S.node];
        if (n.type !== 'river') S.pendingSettlement = n;
      }
    }
    checkGameOver();
    return [{ action: 'eventResolved', event: ev.id, choiceIndex, result }];
  }

  function makeCamp() {
    if (S.pendingSettlement || S.over) return;
    S.food--;
    S.camps++;
    S.travelDaysWithoutRest = 0;
    if (S.crew === 'exhausted') S.crew = 'tired';
    else if (S.crew === 'tired') S.crew = 'rested';
    const campMorale = CONSTANTS.WEATHER_CAMP_MORALE[S.weather] ?? 15;
    S.morale = Math.min(100, S.morale + campMorale);
    advance();
    checkGameOver();
  }

  function pushOn() {
    if (S.pendingSettlement || S.over) return;
    // Penalties for pushing on without resting
    S.food = Math.max(0, Math.round((S.food - 1.5) * 10) / 10);
    S.wear = Math.min(S.wear + 1, 99);
    S.morale = Math.max(0, S.morale - 5);
    S.travelDaysWithoutRest++;
    // Crew degradation
    if (S.travelDaysWithoutRest >= 5 && S.crew !== 'exhausted') S.crew = 'exhausted';
    else if (S.travelDaysWithoutRest >= 3 && S.crew === 'rested') S.crew = 'tired';
    advance();
    checkGameOver();
  }

  function settlementAction(action) {
    if (!S.pendingSettlement) return [];
    // Only clear pendingSettlement on 'continue' — other actions keep the settlement open
    if (action === 'continue') {
      S.pendingSettlement = null;
      return [];
    }
    if (action === 'rest') {
      S.crew = 'rested';
      S.food = Math.max(0, S.food - 1); // Costs 1 food to rest
      S.travelDaysWithoutRest = 0;
      S.morale = Math.min(100, S.morale + 15);
    }
    // Legacy repair/heal (free, no MB cost) — kept for backward compat
    if (action === 'repair') {
      const shag = cart.find((i) => i.name === 'Shaganappi');
      if (S.wear > 0 && shag && shag.count > 0) {
        shag.count--;
        S.wear = Math.max(0, S.wear - 2);
        recalcMB();
      } else if (S.wear > 0) {
        S.wear = Math.max(0, S.wear - 2);
      }
    }
    if (action === 'heal') {
      S.crew = 'rested';
      S.morale = Math.min(100, S.morale + 20);
    }
    if (action === 'trade') {
      const tg = cart.find((i) => i.type === 'trade' && i.count > 0);
      if (tg) {
        tg.count--;
        recalcMB();
        const mbGain = tg.mbValue || 1;
        S.credit[S.pendingSettlement?.type || 'hbc'] =
          (S.credit[S.pendingSettlement?.type || 'hbc'] || 0) + mbGain;
        S.tradesMade++;
      }
    }
    if (action === 'buy_food') {
      const cost = CONSTANTS.MB_FOOD_COST;
      const settleType = S.pendingSettlement?.type || 'hbc';
      if ((S.credit[settleType] || 0) >= cost) {
        S.credit[settleType] -= cost;
        S.food += Math.floor(1 / cost); // 0.5 MB → 2 food
      }
    }
    if (action === 'buy_repair') {
      const cost = CONSTANTS.MB_REPAIR_COST;
      const settleType = S.pendingSettlement?.type || 'hbc';
      if ((S.credit[settleType] || 0) >= cost && S.wear > 0) {
        S.credit[settleType] -= cost;
        S.wear = Math.max(0, S.wear - 2);
      }
    }
    if (action === 'buy_heal') {
      const cost = CONSTANTS.MB_HEAL_COST;
      const settleType = S.pendingSettlement?.type || 'hbc';
      if ((S.credit[settleType] || 0) >= cost) {
        S.credit[settleType] -= cost;
        S.morale = Math.min(100, S.morale + 20);
        S.crew = 'rested';
      }
    }
    if (action === 'buy_info') {
      const cost = CONSTANTS.MB_INFO_COST;
      const settleType = S.pendingSettlement?.type || 'hbc';
      if ((S.credit[settleType] || 0) >= cost) {
        S.credit[settleType] -= cost;
        // Trail intel: small morale boost + flag
        S.morale = Math.min(100, S.morale + 5);
        S.flags['trail_intel_' + S.node] = true;
      }
    }
    if (action === 'craft') {
      const recipes = this.getAvailableRecipes();
      if (recipes.length === 0) return { error: 'No recipes available' };
      // Note: The actual crafting is done via the UI buttons which call game.craftRecipe()
      // This just advances time for the crafting activity
      advance();
    }
    checkGameOver();
    return [];
  }

  return {
    travelOneDay,
    makeCamp,
    pushOn,
    chooseEventChoice,
    getState() {
      return {
        day: S.day,
        month: S.month,
        year: S.year,
        season: S.season,
        crew: S.crew,
        food: S.food,
        wear: S.wear,
        morale: S.morale,
        node: S.node,
        segmentDay: S.segmentDay,
        over: S.over,
        won: S.won,
        endReason: S.endReason || null,
        score: S.score,
        pendingEvent: S.pendingEvent,
        pendingSettlement: S.pendingSettlement,
        usedWeight: totalWeight(cart),
        capacity: S.capacity,
        preDeparture: S.preDeparture,
        weather: S.weather,
        currentTerrain: NODES[S.node]?.terrain || 'plains',
        travelDaysWithoutRest: S.travelDaysWithoutRest,
        mbValue: S.mbValue,
        credit: { ...S.credit },
      };
    },
    getCart() {
      return JSON.parse(JSON.stringify(cart));
    },
    offloadItem(name) {
      const idx = cart.findIndex((i) => i.name === name);
      if (idx === -1 || cart[idx].count <= 0) return false;
      cart[idx].count--;
      recalcMB();
      return true;
    },
    getTradeEstimate(itemId, quantity, settlementType) {
      const item = cart.find(i => i.name === itemId);
      if (!item) return null;
      const basePrice = item.mbValue || 1;
      const mult = getSettlementPriceMultiplier(settlementType, item.category);
      const distanceFactor = S.node / (NODES.length - 1);
      const buyPrice = Math.round(basePrice * mult.buy * (1 + distanceFactor * 0.15) * 100) / 100;
      const sellPrice = Math.round(basePrice * mult.sell * (1 - distanceFactor * 0.1) * 100) / 100;
      return {
        item: itemId,
        quantity,
        buyPrice: buyPrice * quantity,
        sellPrice: sellPrice * quantity,
        buyPriceEach: buyPrice,
        sellPriceEach: sellPrice,
        multiplier: mult,
      };
    },
    tradeItem(itemName) {
      const idx = cart.findIndex((i) => i.name === itemName);
      if (idx === -1 || cart[idx].count <= 0) return null;
      cart[idx].count--;
      const est = this.getTradeEstimate(itemName);
      const foodGain = Math.floor(rand() * (est.max - est.min + 1)) + est.min;
      S.food += foodGain;
      S.tradesMade++;
      return { item: itemName, foodGain };
    },

    // ── NEW Engine API for Sprint 3 ───────────────────────────────────
    getSettlementActions(settlementType) {
      const actions = getSettlementActionsByType(settlementType);
      return actions.map(a => ({
        id: a.id,
        label: a.label,
        cost: a.cost,
        risk: a.risk,
        flavor: a.flavor,
      }));
    },

    settlementAction(actionId, params = {}) {
      if (!S.pendingSettlement) return { error: 'No settlement pending' };
      const type = S.pendingSettlement.type;
      const state = S;
      const result = executeSettlementAction(actionId, type, state, cart, params);
      checkGameOver();
      return result || {};
    },

    getEndgameScore() {
      if (!S.won) return { score: 0, breakdown: {} };
      const mbVal = S.mbValue || 0;
      const foodBonus = Math.min(S.food, 25);
      const crewBonus = S.crew === 'rested' ? 30 : S.crew === 'tired' ? 10 : 0;
      const daysPenalty = S.day * 8;
      const wearPenalty = S.wear * S.wear * 40;
      const baseScore = 500;
      const mbScore = Math.round(mbVal * 80);
      const foodScore = foodBonus * 12;
      const total = baseScore + mbScore + foodScore + crewBonus - daysPenalty - wearPenalty;
      let tier;
      if (total < 500) tier = 'Barely Survived';
      else if (total < 1200) tier = 'Solid Profit';
      else tier = 'Legendary Haul';
      return {
        score: Math.max(0, Math.round(total)),
        breakdown: {
          base: baseScore,
          mbValue: mbScore,
          foodBonus: foodScore,
          crewCondition: crewBonus,
          daysPenalty: -daysPenalty,
          wearPenalty: -wearPenalty,
        },
        tier,
      };
    },

    getSettlementData(nodeId) {
      const idx = NODES.findIndex(n => n.id === nodeId);
      if (idx === -1) return null;
      const node = NODES[idx];
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        terrain: node.terrain,
        desc: node.desc,
        dist: node.dist,
        priceMultiplier: getSettlementPriceMultiplier(node.type),
      };
    },

    getAvailableRecipes() {
      const recipes = [
        {
          id: 'finished_hides',
          name: 'Finished Hides',
          inputs: [
            { name: 'Bison Hide', count: 2 },
            { name: 'Shaganappi', count: 1 },
          ],
          output: { name: 'Finished Hides', icon: '🟫', mbValue: 3.5 },
          settlement: 'hbc',
        },
        {
          id: 'travois_kit',
          name: 'Travois Kit',
          inputs: [
            { name: 'Shaganappi', count: 2 },
            { name: 'Rope (50ft)', count: 1 },
          ],
          output: { name: 'Travois Kit', icon: '🛒', mbValue: 2.5 },
          settlement: 'metis',
        },
        {
          id: 'gunpowder_pack',
          name: 'Gunpowder Pack',
          inputs: [
            { name: 'Ammunition Belt', count: 1 },
            { name: 'Tool Kit', count: 1 },
          ],
          output: { name: 'Gunpowder Pack', icon: '💥', mbValue: 4.0 },
          settlement: 'nwmp',
        },
      ];
      return recipes
        .filter((r) => {
          // Only show recipes matching current settlement type (or all if no match)
          const n = NODES[S.node];
          return !r.settlement || r.settlement === n.type;
        })
        .map((r) => ({
          ...r,
          inputs: r.inputs.map((inp) => {
            const have = cart.find((c) => c.name === inp.name)?.count || 0;
            return { ...inp, have };
          }),
        }));
    },
    campAction(type) {
      const action = String(type || '').toLowerCase();
      const costItems = [];
      const effects = [];
      let roll = null;
      let rollTotal = null;
      let critical = false;

      if (action === 'rest') {
        if (S.food < 1) return { error: 'Not enough food to rest.' };
        S.food -= 1;
        costItems.push({ name: 'Food', count: -1 });
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.crew = 'tired';
          S.morale = Math.max(0, S.morale - 3);
          S.travelDaysWithoutRest = 0;
          effects.push('Critical failure: the camp is a disaster — cold, sleepless, demoralizing.', 'Morale -3', 'Crew tired');
        } else if (rollTotal >= 15) {
          S.crew = 'rested';
          S.morale = Math.max(0, Math.min(100, S.morale + 20));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push('Wonderful rest.', 'Crew rested', 'Morale +20', 'Wear -1');
        } else if (rollTotal >= 8) {
          S.crew = 'rested';
          S.morale = Math.max(0, Math.min(100, S.morale + 15));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push('Crew rested', 'Morale +15', 'Wear -1');
        } else {
          S.crew = 'tired';
          S.morale = Math.max(0, Math.min(100, S.morale + 5));
          S.travelDaysWithoutRest = 0;
          effects.push('Rough night.', 'Morale +5', 'Crew tired');
        }
      } else if (action === 'forage') {
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          advance(); // lose an extra day
          effects.push('Critical failure: wasted the whole day. Found nothing.', '+1 day lost');
        }
        const baseGain = Math.floor(Math.random() * 6) + (rollTotal >= 12 ? 6 : rollTotal >= 8 ? 4 : 1);
        S.food += baseGain;
        if (rollTotal >= 12) {
          effects.push(`Excellent foraging. +${baseGain} Food`);
        } else if (rollTotal >= 8) {
          effects.push(`Foraged +${baseGain} Food`);
        } else if (rollTotal >= 5) {
          effects.push(`Lean haul. +${baseGain} Food`);
        } else {
          effects.push('Found little today.');
        }
      } else if (action === 'hunt') {
        const ammo = cart.find((i) => i.name === 'Ammunition Belt');
        if (!ammo || ammo.count < 1) return { error: 'Need 1 Ammunition Belt to hunt.' };
        ammo.count -= 1;
        costItems.push({ name: 'Ammunition Belt', count: -1 });
        advance();
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.morale = Math.max(0, S.morale - 2);
          effects.push('Critical failure: shot went wide, startled the game, lost ammo.', 'Morale -2');
        } else if (rollTotal >= 10) {
          // Success: add trade goods (pelts/hides) based on terrain
          const terrain = NODES[S.node]?.terrain || 'plains';
          let prey;
          if (terrain === 'river_valley') {
            prey = { name: 'Beaver Pelt', icon: '🦫', mbValue: 3.0 };
          } else if (terrain === 'uplands') {
            prey = { name: 'Elk Hide', icon: '🫎', mbValue: 2.5 };
          } else if (terrain === 'wooded') {
            prey = { name: 'Deer Hide', icon: '🦌', mbValue: 1.8 };
          } else {
            prey = { name: 'Bison Hide', icon: '🐃', mbValue: 1.25 };
          }
          const existing = cart.find((c) => c.name === prey.name);
          if (existing) {
            existing.count++;
          } else {
            cart.push({ name: prey.name, icon: prey.icon, type: 'trade', category: 'furs', wt: 4, count: 1, mbValue: prey.mbValue, desc: `Hunted on the ${terrain.replace(/_/g, ' ')}.` });
          }
          recalcMB();
          effects.push(`Clean kill. +1 ${prey.name} (trade good)`);
        } else {
          effects.push('Shot went wide. No pelts gained.');
        }
      } else if (action === 'repair') {
        const shag = cart.find((i) => i.name === 'Shaganappi');
        if (!shag || shag.count < 1) return { error: 'Need 1 Shaganappi to repair.' };
        shag.count -= 1;
        costItems.push({ name: 'Shaganappi', count: -1 });
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.wear = Math.min(CONSTANTS.MAX_WEAR, S.wear + 1);
          effects.push('Critical failure: shaganappi wasted, repair botched. Cart worse off.', 'Wear +1');
        } else {
          const hasAxle = cart.some((i) => i.name === 'Spare Axle');
          const repaired = hasAxle ? 3 : 2;
          S.wear = Math.max(0, S.wear - repaired);
          effects.push(`Wear -${repaired}`);
        }
      } else if (action === 'scout') {
        advance();
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.flags['scout_blind'] = true;
          effects.push('Critical failure: scout got turned around. Next event will have no warning.');
        } else if (rollTotal >= 12) {
          const n = NODES[S.node + 1];
          const terrain = (n && n.terrain) || 'plains';
          effects.push(`Scout succeeded. Next leg is ${terrain.replace(/_/g, ' ')}.`);
        } else {
          effects.push('Scout returned with nothing clear to report.');
        }
      } else if (action === 'dance') {
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.morale = Math.max(0, S.morale - 3);
          effects.push('Critical failure: the evening fell flat. Old arguments resurfaced.', 'Morale -3');
        } else {
          const bonus = S.crew === 'rested' ? 12 : S.crew === 'tired' ? 8 : 5;
          S.morale = Math.max(0, Math.min(100, S.morale + bonus));
          effects.push(`Morale +${bonus}`);
        }
      } else if (action === 'pemmican_process') {
        if (S.food < 3) return { error: 'Need at least 3 Food to process pemmican.' };
        S.food -= 3;
        costItems.push({ name: 'Food', count: -3 });
        roll = d();
        rollTotal = roll + crewMod(S);
        if (rollTotal >= 12) {
          const gained = Math.floor(Math.random() * 8) + 10;
          S.food += gained;
          S.morale = Math.max(0, Math.min(100, S.morale + 10));
          effects.push(`The women work fast — slicing, pounding, rendering tallow. +${gained} Pemmican`, 'Morale +10');
        } else if (rollTotal >= 7) {
          const gained = Math.floor(Math.random() * 5) + 5;
          S.food += gained;
          effects.push(`Lean processing. +${gained} Pemmican`);
        } else {
          effects.push('The work is slow and the yield is poor. +2 Pemmican');
          S.food += 2;
        }
      } else if (action === 'deeprest') {
        if (S.food < 2) return { error: 'Need 2 Food for a deep rest.' };
        S.food -= 2;
        S.crew = 'rested';
        S.morale = Math.max(0, Math.min(100, S.morale + 30));
        S.wear = Math.max(0, S.wear - 2);
        S.travelDaysWithoutRest = 0;
        effects.push('+2 Food spent', 'Crew rested', 'Morale +30', 'Wear -2');
        advance();
        advance();
      } else {
        return { error: 'Unknown camp action.' };
      }

      if (effects.length === 0 && costItems.length === 0) effects.push('Nothing changes.');
      return { day: S.day, effects, costItems, roll, rollTotal, critical };
    },

    craftRecipe(recipeId) {
      const recipes = this.getAvailableRecipes();
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return null;
      // Check all inputs available
      for (const inp of recipe.inputs) {
        const item = cart.find((c) => c.name === inp.name);
        if (!item || item.count < inp.count) return null;
      }
      // Consume inputs
      for (const inp of recipe.inputs) {
        const item = cart.find((c) => c.name === inp.name);
        item.count -= inp.count;
      }
      // Add output as a trade good, or apply situational craft
      if (recipe.consumedOnUse) {
        if (recipe.id === 'raft' && !S.flags.raftUsed) {
          S.flags.raftUsed = true;
          S.trailIntel = S.trailIntel || [];
          return { applied: 'raft' };
        }
        if (recipe.id === 'signal_fire') {
          S.trailIntel = S.trailIntel || [];
          S.trailIntel.push({ fromDay: S.day, text: 'Signal fire lit.', bonus: { dcBonus: 2 } });
          return { applied: 'signal_fire' };
        }
        return null;
      }
      const existing = cart.find((c) => c.name === recipe.output.name);
      if (existing) {
        existing.count++;
      } else {
        cart.push({
          name: recipe.output.name,
          icon: recipe.output.icon,
          type: 'trade',
          category: 'furs',
          wt: 3,
          count: 1,
          mbValue: recipe.output.mbValue,
          desc: `Crafted: ${recipe.output.name}.`,
        });
      }
      return recipe.output.name;
    },

    getNodes() {
      return NODES;
    },
    getCurrentNode() {
      return NODES[S.node];
    },
    getNextNode() {
      return NODES[S.node + 1] || null;
    },
    totalWeight() {
      return totalWeight(cart);
    },
    getCrew() {
      return { state: S.crew, morale: S.morale, mod: crewMod(S), label: S.crew };
    },
    getPendingEvent() {
      if (!S.pendingEvent) return null;
      return {
        id: S.pendingEvent.id,
        text: S.pendingEvent.text,
        source: S.pendingEvent.source || null,
        choices: S.pendingEvent.choices.map((c) => ({
          text: c.text,
          dc: c.dc,
          need: c.need || null,
        })),
      };
    },
    getAvailableActions() {
      if (S.pendingEvent)
        return {
          type: 'event',
          choices: S.pendingEvent.choices.map((c, i) => ({
            index: i,
            text: c.text,
            dc: c.dc,
          })),
        };
      if (S.pendingSettlement)
        return {
          type: 'settlement',
          name: S.pendingSettlement.name,
          actions: availableSettlementActions(S.pendingSettlement.type),
        };
      return { type: 'travel' };
    },
    isOver() {
      return S.over;
    },
    hasWon() {
      return S.won;
    },
    getScore() {
      return S.score;
    },
    getPreDepartureItems() {
      return cart.map((item) => ({
        name: item.name,
        wt: item.wt,
        maxCount: item.count,
        currentCount: item.count,
        category: item.category,
        desc: item.desc,
        icon: item.icon,
        mbValue: item.mbValue,
      }));
    },
    setPreDepartureCount(itemName, newCount) {
      const item = cart.find((i) => i.name === itemName);
      if (!item) return false;
      const maxCount = item.count;
      const clamped = Math.max(0, Math.min(newCount, maxCount));
      item.count = clamped;
      S.usedWeight = totalWeight(cart);
      recalcMB();
      return true;
    },
    confirmPreDeparture() {
      S.preDeparture = false;
      S.usedWeight = totalWeight(cart);
      recalcMB();
      return cart.map((i) => ({ name: i.name, count: i.count, wt: i.wt }));
    },
    getScoreData() {
      const tradeGoods = cart.filter((i) => i.type === 'trade' && i.count > 0);
      return {
        score: S.score,
        day: S.day,
        wear: S.wear,
        food: S.food,
        crew: S.crew,
        morale: S.morale,
        won: S.won,
        endReason: S.endReason || 'unknown',
        nodes: S.node,
        tradesMade: S.tradesMade,
        camps: S.camps,
        eventsResolved: S.eventsResolved,
        weather: S.weather,
        cartItems: cart.reduce((s, i) => s + i.count, 0),
        tradeGoods: tradeGoods.reduce((s, i) => s + i.count, 0),
        mbValue: S.mbValue,
        distance: S.node,
        seed: S.seed,
      };
    },
    buyItem(name, wt, category) {
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.count++;
      } else {
        cart.push({ name, wt, count: 1, category, type: category === 'provisions' ? 'food' : 'item', mbValue: 0 });
      }
      recalcMB();
    },
    addFood(amount) {
      S.food += amount;
    },
    clearTradeGoods() {
      // Remove all trade goods (they were converted to ₥ at the shop)
      for (let i = cart.length - 1; i >= 0; i--) {
        if (cart[i].type === 'trade' || cart[i].category === 'furs') {
          cart.splice(i, 1);
        }
      }
      recalcMB();
    },
  };
}

function getSettlementPriceMultiplier(type, category) {
  const multipliers = {
    hbc: { buy: 1.0, sell: 1.0, categories: { furs: { buy: 1.0, sell: 1.0 }, provisions: { buy: 1.0, sell: 1.0 }, repair: { buy: 1.0, sell: 1.0 }, medical: { buy: 1.0, sell: 1.0 }, shelter: { buy: 1.0, sell: 1.0 }, fuel: { buy: 1.0, sell: 1.0 }, tool: { buy: 1.0, sell: 1.0 }, hunting: { buy: 1.0, sell: 1.0 } } },
    metis: { buy: 0.9, sell: 1.1, categories: { furs: { buy: 0.9, sell: 1.1 }, provisions: { buy: 0.95, sell: 1.05 }, repair: { buy: 1.0, sell: 1.0 }, medical: { buy: 1.0, sell: 1.0 }, shelter: { buy: 1.0, sell: 1.0 }, fuel: { buy: 1.0, sell: 1.0 }, tool: { buy: 1.0, sell: 1.0 }, hunting: { buy: 1.0, sell: 1.0 } } },
    nwmp: { buy: 1.2, sell: 0.8, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.2, sell: 0.8 }, repair: { buy: 1.2, sell: 0.8 }, medical: { buy: 1.0, sell: 1.0 }, shelter: { buy: 1.0, sell: 1.0 }, fuel: { buy: 1.0, sell: 1.0 }, tool: { buy: 1.0, sell: 1.0 }, hunting: { buy: 0.8, sell: 1.2 } } }, // ammo cheaper
    mission: { buy: 0.8, sell: 1.5, categories: { furs: { buy: 0.8, sell: 1.5 }, provisions: { buy: 0.7, sell: 1.3 }, repair: { buy: 1.0, sell: 1.0 }, medical: { buy: 0.8, sell: 1.2 }, shelter: { buy: 1.0, sell: 1.0 }, fuel: { buy: 1.0, sell: 1.0 }, tool: { buy: 1.0, sell: 1.0 }, hunting: { buy: 1.0, sell: 1.0 } } },
    trading: { buy: 1.1, sell: 0.9, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.1, sell: 0.9 }, repair: { buy: 1.1, sell: 0.9 }, medical: { buy: 1.0, sell: 1.0 }, shelter: { buy: 1.0, sell: 1.0 }, fuel: { buy: 1.0, sell: 1.0 }, tool: { buy: 1.0, sell: 1.0 }, hunting: { buy: 1.0, sell: 1.0 } } },
  };
  const m = multipliers[type] || multipliers.hbc;
  const cat = m.categories[category] || { buy: m.buy, sell: m.sell };
  return { buy: cat.buy, sell: cat.sell };
}

function getSettlementActionsByType(type) {
  switch (type) {
    case 'hbc':
      return [
        { id: 'trade', label: 'Trade Goods for ₥', cost: '1 trade good', risk: 'Best rates for pelts/hides', flavor: 'The Company factors weigh your furs in silence. The ledger decides your worth.' },
        { id: 'buy_supplies', label: 'Buy Supplies', cost: '₥ varies', risk: 'Full inventory available', flavor: 'Pemmican, axes, shaganappi, tools — everything a carter needs for the long trail.' },
        { id: 'rest', label: 'Rest at the Fort', cost: '1 food', risk: 'Crew rested, morale +15', flavor: 'A warm fire in the mess hall, dry blankets, and a night without the wind.' },
        { id: 'get_intel', label: 'Get Trail Intel', cost: '1 ₥', risk: 'Reveals next 2 nodes', flavor: 'The clerk unfolds a map stained with ink and tea. He marks the hazards ahead.' },
      ];
    case 'metis':
      return [
        { id: 'trade_gossip', label: 'Trade Gossip', cost: 'Free', risk: 'Reveals 1 gossip entry', flavor: 'News travels faster than carts on the prairie. The women know everything.' },
        { id: 'recruit_crew', label: 'Recruit Crew', cost: '2 ₥ + 1 food', risk: '+1 crew member (max 6)', flavor: 'A young hand looking for work. Strong back, willing heart — if you can feed him.' },
        { id: 'dance', label: 'Dance', cost: '1 food', risk: 'Morale +10, no day advance', flavor: 'The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow.' },
        { id: 'share_food', label: 'Share Food', cost: 'Give 2+ food', risk: 'Morale +5 per food', flavor: 'Generosity on the trail is its own currency. What you give returns in loyalty.' },
        { id: 'craft_hides', label: 'Craft Finished Hides', cost: '3 raw hides + 1 shaganappi', risk: 'Creates finished_hide (worth 2× ₥)', flavor: 'The women scrape, stretch, and smoke the hides. Patience turns rawhide into profit.' },
      ];
    case 'nwmp':
      return [
        { id: 'pay_fines', label: 'Pay Fines', cost: '₥ varies', risk: 'Clears fines if any', flavor: 'The sergeant reads your name from the ledger. The amount is not negotiable.' },
        { id: 'get_permits', label: 'Get Permits', cost: '2 ₥', risk: 'Required for river crossings', flavor: 'A stamp, a signature, and the Queen\'s law lets you cross the water legal.' },
        { id: 'report_duty', label: 'Report for Duty', cost: '1 day', risk: '₥ reward, morale −5', flavor: 'Red coats, drill, and the weight of Ottawa\'s authority. The pay is fair but the pride costs.' },
        { id: 'buy_ammo', label: 'Buy Ammo', cost: '1.5 ₥ per Belt', risk: 'Cheaper than HBC', flavor: 'Ball and powder, measured honest. The Mounties don\'t cheat a carter on shot.' },
        { id: 'rest', label: 'Rest', cost: '1 food', risk: 'Crew rested (no morale bonus)', flavor: 'A cot in the barracks. Clean, quiet, and the sentry paces all night.' },
      ];
    case 'mission':
      return [
        { id: 'heal_crew', label: 'Heal Crew', cost: '1 Medicine Pouch or 2 ₥', risk: 'Clears injury/illness, morale +10', flavor: 'The Grey Nuns tend the sick without asking who you are or where you come from.' },
        { id: 'rest', label: 'Free Rest + Blessing', cost: 'Free', risk: 'Crew rested, morale +15', flavor: 'A chapel bell at evening. You sleep on straw but wake with a lighter spirit.' },
        { id: 'get_blessing', label: 'Get Blessing', cost: '1 food', risk: 'Morale +10, next event DC −1', flavor: 'The priest\'s hand on your brow. The trail feels less hostile after prayer.' },
        { id: 'trade_limited', label: 'Trade (Limited)', cost: 'Buy pemmican 0.5 ₥, sell blankets 1.5 ₥', risk: 'Charity rates', flavor: 'The mission garden feeds the body. The trade feeds the journey.' },
      ];
    case 'trading':
      return [
        { id: 'trade', label: 'Trade Goods', cost: '1 trade good', risk: 'Standard rates', flavor: 'A free trader with no Company badge. His prices are his own.' },
        { id: 'buy_supplies', label: 'Buy Supplies', cost: '₥ varies', risk: 'Basic inventory', flavor: 'What the Company posts run out of, the free traders sometimes have.' },
        { id: 'rest', label: 'Rest', cost: '1 food', risk: 'Crew rested, morale +10', flavor: 'A lean-to by the fire. Simple shelter, honest company.' },
        { id: 'get_intel', label: 'Get Trail Intel', cost: '1 ₥', risk: 'Reveals next node', flavor: 'He rides the trail weekly. His news is fresh and his memory long.' },
      ];
    default:
      return [
        { id: 'trade', label: 'Trade Goods', cost: '1 trade good', risk: 'Standard rates', flavor: 'The factor weighs your furs. The ledger is final.' },
        { id: 'rest', label: 'Rest', cost: '1 food', risk: 'Crew rested, morale +10', flavor: 'A night under roof and beam. The trail waits for morning.' },
      ];
  }
}

function executeSettlementAction(actionId, type, state, cart, params) {
  const credit = state.credit?.[type] || 0;

  // HBC Actions
  if (actionId === 'trade') {
    const tradeItems = cart.filter(i => i.type === 'trade' && i.count > 0);
    if (tradeItems.length === 0) return { error: 'No trade goods to trade' };
    // Trade the first trade good (UI handles selection)
    const item = tradeItems[0];
    item.count--;
    const mbGain = item.mbValue || 1;
    state.credit[type] = (state.credit[type] || 0) + mbGain;
    state.tradesMade++;
    return { traded: item.name, mbGain, credit: state.credit[type] };
  }

  if (actionId === 'buy_supplies') {
    // Open shop-like interface - for now just return info
    return { action: 'buy_supplies', message: 'Opens supply purchase interface', credit: state.credit[type] };
  }

  if (actionId === 'rest') {
    if (state.food < 1) return { error: 'Need 1 food to rest' };
    state.food -= 1;
    state.crew = 'rested';
    state.travelDaysWithoutRest = 0;
    state.morale = Math.min(100, state.morale + (type === 'hbc' ? 15 : type === 'mission' ? 15 : 10));
    return { rested: true, moraleGain: type === 'hbc' ? 15 : type === 'mission' ? 15 : 10 };
  }

  if (actionId === 'get_intel') {
    if ((state.credit[type] || 0) < 1) return { error: 'Need 1 ₥ for intelligence' };
    state.credit[type] -= 1;
    // Add trail intel for next 1-2 nodes
    const nextNode1 = NODES[state.node + 1];
    const nextNode2 = NODES[state.node + 2];
    state.trailIntel = state.trailIntel || [];
    if (nextNode1) {
      state.trailIntel.push({
        fromDay: state.day,
        text: `${nextNode1.name}: ${nextNode1.terrain.replace(/_/g, ' ')} terrain. ${nextNode1.desc?.substring(0, 80)}...`,
        bonus: { dcBonus: 1 },
      });
    }
    if (nextNode2 && type === 'hbc') {
      state.trailIntel.push({
        fromDay: state.day,
        text: `${nextNode2.name}: ${nextNode2.terrain.replace(/_/g, ' ')} terrain.`,
        bonus: { dcBonus: 1 },
      });
    }
    state.morale = Math.min(100, state.morale + 5);
    return { intelGathered: true, moraleGain: 5, credit: state.credit[type] };
  }

  // Métis Actions
  if (actionId === 'trade_gossip') {
    state.trailIntel = state.trailIntel || [];
    const nextNode = NODES[state.node + 1];
    if (nextNode) {
      state.trailIntel.push({
        fromDay: state.day,
        text: `Gossip from ${state.pendingSettlement?.name}: ${nextNode.name} has ${nextNode.terrain.replace(/_/g, ' ')} ahead.`,
        bonus: { dcBonus: 1 },
      });
    }
    state.morale = Math.min(100, state.morale + 3);
    return { gossipGathered: true, moraleGain: 3 };
  }

  if (actionId === 'recruit_crew') {
    if ((state.credit[type] || 0) < 2) return { error: 'Need 2 ₥ to recruit' };
    if (state.food < 1) return { error: 'Need 1 food to recruit' };
    if ((state.crewCount || 3) >= 6) return { error: 'Maximum crew (6) reached' };
    state.credit[type] -= 2;
    state.food -= 1;
    state.crewCount = (state.crewCount || 3) + 1;
    state.morale = Math.min(100, state.morale + 5);
    return { recruited: true, crewCount: state.crewCount, moraleGain: 5, credit: state.credit[type] };
  }

  if (actionId === 'dance') {
    if (state.food < 1) return { error: 'Need 1 food to dance' };
    state.food -= 1;
    state.morale = Math.min(100, state.morale + 10);
    return { danced: true, moraleGain: 10 };
  }

  if (actionId === 'share_food') {
    const foodToGive = params.food || 2;
    if (state.food < foodToGive) return { error: `Need ${foodToGive} food to share` };
    state.food -= foodToGive;
    const moraleGain = foodToGive * 5;
    state.morale = Math.min(100, state.morale + moraleGain);
    state.reputation.metis = (state.reputation.metis || 0) + 1;
    return { shared: true, foodGiven: foodToGive, moraleGain, reputationGain: 1 };
  }

  if (actionId === 'craft_hides') {
    const hides = cart.find(i => ['Bison Hide', 'Beaver Pelts', 'Elk Hide', 'Deer Hide'].includes(i.name));
    const shag = cart.find(i => i.name === 'Shaganappi');
    if (!hides || hides.count < 3) return { error: 'Need 3 raw hides' };
    if (!shag || shag.count < 1) return { error: 'Need 1 shaganappi' };
    hides.count -= 3;
    shag.count -= 1;
    const finished = cart.find(i => i.name === 'Finished Hides');
    if (finished) finished.count++;
    else cart.push({ name: 'Finished Hides', wt: 3, count: 1, type: 'trade', category: 'furs', mbValue: 3.5, desc: 'Expertly prepared hides. Worth double at market.', perishable: false });
    // Recalculate MB value
    state.mbValue = cart.filter(i => i.type === 'trade' || i.category === 'furs').reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
    return { crafted: 'Finished Hides', mbValue: state.mbValue };
  }

  // NWMP Actions
  if (actionId === 'pay_fines') {
    const fines = state.fines || 0;
    if (fines === 0) return { error: 'No fines to pay' };
    if ((state.credit[type] || 0) < fines) return { error: `Need ${fines} ₥ to pay fines` };
    state.credit[type] -= fines;
    state.fines = 0;
    return { finesPaid: fines, credit: state.credit[type] };
  }

  if (actionId === 'get_permits') {
    if ((state.credit[type] || 0) < 2) return { error: 'Need 2 ₥ for permit' };
    state.credit[type] -= 2;
    state.hasPermit = true;
    return { permitObtained: true, credit: state.credit[type] };
  }

  if (actionId === 'report_duty') {
    // Reward scales with distance
    const reward = Math.round((state.node / NODES.length) * 10) + 2;
    state.credit[type] = (state.credit[type] || 0) + reward;
    state.morale = Math.max(0, state.morale - 5);
    // Advance time by 1 day using imported advanceDate
    const nextDate = advanceDate(state.date.month, state.date.day, state.year);
    state.date = nextDate;
    state.month = nextDate.month;
    state.day++;
    state.segmentDay = 0;
    return { dutyDone: true, reward, moraleLoss: 5, credit: state.credit[type] };
  }

  if (actionId === 'buy_ammo') {
    if ((state.credit[type] || 0) < 1.5) return { error: 'Need 1.5 ₥ for ammunition' };
    state.credit[type] -= 1.5;
    const ammo = cart.find(i => i.name === 'Ammunition Belt');
    if (ammo) ammo.count++;
    else cart.push({ name: 'Ammunition Belt', wt: 2, count: 1, type: 'ammo', category: 'hunting', mbValue: 0.9, desc: 'Shot and ball. For hunting and defence.', perishable: false });
    return { bought: 'Ammunition Belt', credit: state.credit[type] };
  }

  // Mission Actions
  if (actionId === 'heal_crew') {
    const med = cart.find(i => i.name === 'Medicine Pouch');
    if ((state.credit[type] || 0) >= 2) {
      state.credit[type] -= 2;
    } else if (med && med.count > 0) {
      med.count--;
    } else {
      return { error: 'Need 2 ₥ or 1 Medicine Pouch' };
    }
    state.crew = 'rested';
    state.morale = Math.min(100, state.morale + 10);
    // Clear any illness/injury flags
    state.flags.injured = false;
    state.flags.ill = false;
    return { healed: true, moraleGain: 10, credit: state.credit[type] };
  }

  if (actionId === 'get_blessing') {
    if (state.food < 1) return { error: 'Need 1 food for blessing' };
    state.food -= 1;
    state.morale = Math.min(100, state.morale + 10);
    state.flags.blessed = true; // Next event DC -1
    return { blessed: true, moraleGain: 10 };
  }

  if (actionId === 'trade_limited') {
    // Limited trade: buy pemmican at 0.5 ₥, sell blankets at 1.5 ₥
    return { action: 'trade_limited', message: 'Limited trade available: buy pemmican (0.5 ₥), sell blankets (1.5 ₥)', credit: state.credit[type] };
  }

  // Legacy actions (for backward compatibility)
  if (actionId === 'buy_food') {
    const cost = 0.5;
    if ((state.credit[type] || 0) < cost) return { error: 'Need 0.5 ₥ credit' };
    state.credit[type] -= cost;
    state.food += 2;
    return { bought: 'food', amount: 2, credit: state.credit[type] };
  }

  if (actionId === 'buy_repair') {
    const cost = 2;
    if ((state.credit[type] || 0) < cost) return { error: 'Need 2 ₥ credit' };
    if (state.wear <= 0) return { error: 'Cart does not need repair' };
    state.credit[type] -= cost;
    state.wear = Math.max(0, state.wear - 2);
    return { repaired: true, wearReduced: 2, credit: state.credit[type] };
  }

  if (actionId === 'buy_heal') {
    const cost = 1;
    if ((state.credit[type] || 0) < cost) return { error: 'Need 1 ₥ credit' };
    state.credit[type] -= cost;
    state.morale = Math.min(100, state.morale + 20);
    state.crew = 'rested';
    return { healed: true, moraleGain: 20, credit: state.credit[type] };
  }

  if (actionId === 'buy_info') {
    const cost = 0.5;
    if ((state.credit[type] || 0) < cost) return { error: 'Need 0.5 ₥ credit' };
    state.credit[type] -= cost;
    state.morale = Math.min(100, state.morale + 5);
    state.flags['trail_intel_' + state.node] = true;
    return { intel: true, moraleGain: 5, credit: state.credit[type] };
  }

  if (actionId === 'repair') {
    const shag = cart.find(i => i.name === 'Shaganappi');
    if (state.wear > 0 && shag && shag.count > 0) {
      shag.count--;
      state.wear = Math.max(0, state.wear - 2);
      state.mbValue = cart.filter(i => i.type === 'trade' || i.category === 'furs').reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
    } else if (state.wear > 0) {
      state.wear = Math.max(0, state.wear - 2);
    }
    return { repaired: true };
  }

  if (actionId === 'heal') {
    state.crew = 'rested';
    state.morale = Math.min(100, state.morale + 20);
    return { healed: true };
  }

  if (actionId === 'continue') {
    state.pendingSettlement = null;
    return { continued: true };
  }

  return { error: `Unknown action: ${actionId}` };
}

function availableSettlementActions(type) {
  const base = ['rest', 'trade', 'buy_food'];
  if (type === 'hbc') return [...base, 'buy_repair', 'craft', 'buy_info'];
  if (type === 'metis') return [...base, 'craft', 'buy_info'];
  if (type === 'trading') return [...base, 'buy_repair', 'buy_info'];
  if (type === 'mission') return [...base, 'buy_heal', 'buy_info'];
  if (type === 'nwmp') return [...base, 'craft', 'buy_info'];
  return base;
}

function getSquealEvent() {
  return {
    id: 'squeal_axle',
    text: 'The cart axle lets out a piercing shriek — a sound that carries for miles across the prairie. Every traveller knows that scream. It means a loaded cart with failing wood is coming, and the sound alone is enough to spook oxen and draw attention you do not want.',
    classification: 'Cart Damage',
    source: getSource('BREHAUT_CART'),
    choices: [
      {
        text: 'Stop and lash the axle with shaganappi',
        dc: 9,
        ok: 'The rawhide binds the joint. The scream quiets. You lose the rest of the day to repairs.',
        bad: 'The binding slips by morning. The squeal returns, fainter but still there.',
        wear: -1,
        time: 1,
      },
      {
        text: 'Push on — silence it at the next settlement',
        dc: null,
        always: 'The axle shrieks with every rotation. Your oxen grow nervous. At least the sound fades with distance.',
        morale: -5,
      },
      {
        text: 'Night camp and attempt a proper repair',
        dc: 11,
        ok: 'By firelight you wedge the joint tight. The cart rolls quieter by morning.',
        bad: 'Your tools are not enough. The repair holds, but the wear remains.',
        wear: -1,
        time: 1,
        morale: -3,
      },
    ],
  };
}

const EVENTS = {
  plains: [
    { id: 'plains_rough', text: "The prairie trail is rutted and slow. Your ox leans into the traces, but the ground saps momentum.", choices: [{ text: 'Press on carefully', dc: null, ok: '', bad: '', always: 'The cart creaks forward. Nothing breaks, but the day is long.', alwaysWear: 0 }, { text: 'Push the pace', dc: 10, ok: 'You find firmer ground ahead. Progress is better than expected.', bad: 'A hidden rut jolts the cart. The axle complains.', wear: 1 }] },
    { id: 'plains_wind', text: "A hot wind pushes at your back. The prairie grass ripples like water.", choices: [{ text: 'Let the wind carry you', dc: null, ok: '', bad: '', always: 'You make excellent time.' }, { text: 'Hunker against expected rain', dc: null, ok: '', bad: '', always: 'You wrap the load and keep moving. No rain comes.' }] },
  ],
  river_valley: [
    { id: 'river_high', text: "The river is running high and fast. The bank trail is muddy and narrow.", choices: [{ text: 'Ford carefully', dc: 12, ok: 'The ox keeps footing and you stay dry enough.', bad: 'The cart tilts in the current. Repairs are needed after crossing.', wear: 1 }, { text: 'Wait for afternoon', dc: null, ok: '', bad: '', always: 'You camp and cross later when the water drops.', time: 1 }] },
  ],
  wooded: [
    { id: 'wooded_brush', text: "A windfall blocks the trail through the trees.", choices: [{ text: 'Unload and drag the cart clear', dc: null, ok: '', bad: '', always: 'You clear it. Half an hour lost.', time: 1 }, { text: 'Blaze a bypass', dc: 9, ok: 'A narrow detour avoids the mess.', bad: 'You scratch the paint and lose twenty minutes.', time: 1, wear: 0 }] },
  ],
  uplands: [
    { id: 'upland_gust', text: "The wind on the ridge cuts through your clothes. The cart groans.", choices: [{ text: 'Descend to shelter', dc: null, ok: '', bad: '', always: 'You lose elevation but keep the crew safe.', time: 1 }, { text: 'Push through the wind', dc: 11, ok: 'The gust passes. The crew holds together.', bad: 'A sudden gust slams the cart body.', wear: 1 }] },
  ],
  river: [
    { id: 'river_crossing', text: "You reach the river crossing and check the depth.", choices: [{ text: 'Ford it', dc: 12, ok: 'The water is high but passable.', bad: 'A wheel drops into a hole mid-crossing.', wear: 1 }, { text: 'Wait for safer water', dc: null, ok: '', bad: '', always: 'You wait a day and cross when levels drop.', time: 1 }] },
  ],
};

function getEventsForTerrain(t) {
  const primary = EVENTS[t];
  if (primary && primary.length) return primary;
  return FALLBACK_EVENTS[t] || FALLBACK_EVENTS.plains;
}
