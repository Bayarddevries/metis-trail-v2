import { CONSTANTS } from '../core/constants.js';
import { crewMod, wearMod, totalMod } from '../core/constants.js';
import { advanceDate, seasonFor } from '../core/calendar.js';
import { makeRNG, d20 } from '../core/seed.js';
import { NODES } from '../data/nodes.js';
import { startingCart, totalWeight, ITEMS } from '../data/items.js';
import { getSource } from '../data/sources/index.js';
import { pickEventForTerrain, pickSettlementEvent } from '../data/events.js';

export function createGame(seed = null) {
  const rng = makeRNG(seed);
  function rand() {
    return rng ? rng() : Math.random();
  }

  function d() {
    return d20(rand);
  }

  // #80 — Blessing roll buff: +1 to all dice rolls when blessingDays > 0
  function blessingMod() {
    return S.blessingDays > 0 ? 1 : 0;
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
    food: 0,  // starting food added via pre-departure confirm
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
    perishable: {},
    preDeparture: true,
    weather: initWeather(),
    blessingDays: 0,
    trailIntel: [],
    hasPermit: false,
    fines: 0,
  };

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

    // ── ItemBonus: reduce DC if player has the required item ──
    let dcReduction = 0;
    let bonusItemName = null;
    if (ch.itemBonus) {
      const hasItem = cart.some((i) => i.name === ch.itemBonus.name && i.count > 0);
      if (hasItem) {
        dcReduction = ch.itemBonus.dcBonus || 0;
        bonusItemName = ch.itemBonus.name;
      }
    }

    if (ch.dc !== null) {
      const roll = d();
      const crewBonus = crewMod(S);
      const wearBonus = wearMod(S.wear);
      const blessingBonus = S.blessingDays > 0 ? 1 : 0;
      const effectiveDC = ch.dc - dcReduction;
      const total = roll + crewBonus + wearBonus + blessingBonus;
      const success = total >= effectiveDC;
      result.roll = roll;
      result.total = total;
      result.dc = effectiveDC;
      result.success = success;
      result.mod = total - roll;
      result.modBreakdown = [];
      if (crewBonus) result.modBreakdown.push(`Crew ${crewBonus >= 0 ? '+' : ''}${crewBonus}`);
      if (wearBonus) result.modBreakdown.push(`Wear ${wearBonus >= 0 ? '+' : ''}${wearBonus}`);
      if (blessingBonus) result.modBreakdown.push('Blessing +1');
      result.text = success ? `Success. ${ch.ok}` : `Failure. ${ch.bad}`;
      if (bonusItemName) {
        result.effects.push(`(${bonusItemName} −${dcReduction} DC)`);
      }
      // Wear: on failure use badWear if defined, on success use okWear if defined, else fall back to ch.wear
      if (!success) {
        const w = ch.badWear !== undefined ? ch.badWear : (ch.wear || 0);
        if (w) {
          S.wear = Math.max(0, S.wear + w);
          result.effects.push(`${w >= 0 ? '+' : ''}${w} Wear`);
        }
      } else {
        const w = ch.okWear !== undefined ? ch.okWear : ch.wear;
        if (w) {
          S.wear = Math.max(0, S.wear + w);
          result.effects.push(`${w >= 0 ? '+' : ''}${w} Wear`);
        }
      }
    } else if (ch.always) {
      result.text = ch.always;
      result.success = true;
      if (ch.alwaysWear) {
        S.wear = Math.max(0, S.wear + ch.alwaysWear);
        result.effects.push(`${ch.alwaysWear >= 0 ? '+' : ''}${ch.alwaysWear} Wear`);
      }
    }

    // ── Time: non-dice choices only (dice choices use okTime/badTime below) ──
    if (result.success === null && ch.time) {
      if (ch.time > 0) {
        advance();
        result.effects.push(`+${ch.time} day(s)`);
      }
      if (ch.time < 0) {
        S.segmentDay = Math.max(0, S.segmentDay + ch.time);
        result.effects.push(`${ch.time} day(s)`);
      }
    }

    // ── Food/Morale/Crew/Time/Rep: conditional on success/failure ──
    const success = result.success === true;
    const failure = result.success === false;

    if (success) {
      // ── Success path: ok* fields with fallback to base fields ──
      if (ch.okFood !== undefined) {
        S.food += ch.okFood;
        result.effects.push(`${ch.okFood > 0 ? '+' : ''}${ch.okFood} Food`);
      } else if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? '+' : ''}${ch.food} Food`);
      }
      if (ch.okMorale !== undefined) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.okMorale));
        result.effects.push(`${ch.okMorale >= 0 ? '+' : ''}${ch.okMorale} Morale`);
      } else if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? '+' : ''}${ch.morale} Morale`);
      }
      // Time on success: okTime with fallback to base time
      if (ch.okTime !== undefined) {
        if (ch.okTime > 0) { advance(); result.effects.push(`+${ch.okTime} day(s)`); }
        else if (ch.okTime < 0) { S.segmentDay = Math.max(0, S.segmentDay + ch.okTime); result.effects.push(`${ch.okTime} day(s)`); }
      } else if (ch.time) {
        if (ch.time > 0) { advance(); result.effects.push(`+${ch.time} day(s)`); }
        if (ch.time < 0) { S.segmentDay = Math.max(0, S.segmentDay + ch.time); result.effects.push(`${ch.time} day(s)`); }
      }
      // Crew on success: okCrew with fallback to base crew
      if (ch.okCrew) {
        S.crew = ch.okCrew;
        result.effects.push(`Crew: ${ch.okCrew}`);
      } else if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
      // Reputation on success
      if (ch.addsRep) {
        S.reputation[ch.addsRep.key] = (S.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
        result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S.reputation[ch.addsRep.key] });
      }
      if (ch.okRep) {
        S.reputation[ch.okRep.key] = (S.reputation[ch.okRep.key] || 0) + ch.okRep.delta;
        result.reps.push({ key: ch.okRep.key, delta: ch.okRep.delta, value: S.reputation[ch.okRep.key] });
      }
    } else if (failure) {
      // ── Failure path: bad* fields with fallback to base fields ──
      if (ch.badFood !== undefined) {
        S.food += ch.badFood;
        result.effects.push(`${ch.badFood > 0 ? '+' : ''}${ch.badFood} Food`);
      } else if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? '+' : ''}${ch.food} Food`);
      }
      if (ch.badMorale !== undefined) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.badMorale));
        result.effects.push(`${ch.badMorale >= 0 ? '+' : ''}${ch.badMorale} Morale`);
      } else if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? '+' : ''}${ch.morale} Morale`);
      }
      // Time on failure: badTime with fallback to base time
      if (ch.badTime !== undefined) {
        if (ch.badTime > 0) { advance(); result.effects.push(`+${ch.badTime} day(s)`); }
        else if (ch.badTime < 0) { S.segmentDay = Math.max(0, S.segmentDay + ch.badTime); result.effects.push(`${ch.badTime} day(s)`); }
      } else if (ch.time) {
        if (ch.time > 0) { advance(); result.effects.push(`+${ch.time} day(s)`); }
        if (ch.time < 0) { S.segmentDay = Math.max(0, S.segmentDay + ch.time); result.effects.push(`${ch.time} day(s)`); }
      }
      // Crew on failure: badCrew with fallback to base crew
      if (ch.badCrew) {
        S.crew = ch.badCrew;
        result.effects.push(`Crew: ${ch.badCrew}`);
      } else if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
    }
    // Non-dice path: apply base fields unconditionally
    if (result.success === null) {
      if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? '+' : ''}${ch.food} Food`);
      }
      if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? '+' : ''}${ch.morale} Morale`);
      }
      if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
      // Reputation on non-dice path
      if (ch.addsRep) {
        S.reputation[ch.addsRep.key] = (S.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
        result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S.reputation[ch.addsRep.key] });
      }
    }

    if (ch.give) {
      ch.give.forEach((g) => {
        const item = cart.find((i) => i.name === g.name);
        if (item) {
          item.count += g.amt;
          result.effects.push(`+${g.amt} ${g.name}`);
        } else if (g.amt > 0) {
          // Item not in cart yet — create it from template
          const template = ITEMS.find((i) => i.name === g.name);
          cart.push({
            name: g.name,
            count: g.amt,
            wt: template ? template.wt : 0,
            icon: template ? template.icon : '📦',
            type: template ? template.type : 'provisions',
            category: template ? template.category : 'general',
            desc: template ? template.desc : '',
          });
          result.effects.push(`+${g.amt} ${g.name}`);
        }
      });
    }
    if (ch.take) {
      ch.take.forEach((t) => {
        const item = cart.find((i) => i.name === t.name);
        if (item) {
          item.count += t.amt;
          result.effects.push(`+${t.amt} ${t.name}`);
        } else if (t.amt > 0) {
          const template = ITEMS.find((i) => i.name === t.name);
          cart.push({
            name: t.name,
            count: t.amt,
            wt: template ? template.wt : 0,
            icon: template ? template.icon : '📦',
            type: template ? template.type : 'provisions',
            category: template ? template.category : 'general',
            desc: template ? template.desc : '',
          });
          result.effects.push(`+${t.amt} ${t.name}`);
        }
      });
    }
    if (ch.consumesItem) {
      const idx = cart.findIndex((i) => i.name === ch.consumesItem);
      if (idx !== -1 && cart[idx].count > 0) {
        cart[idx].count--;
        result.effects.push(`-1 ${ch.consumesItem}`);
      }
    }

    // Deduplicate effects — same string appearing more than once is a bug
    result.effects = result.effects.filter((e, i, arr) => arr.indexOf(e) === i);

    if (ch.extraProgress) {
      S.segmentDay += ch.extraProgress;
      result.effects.push(`+${ch.extraProgress} progress`);
    }

    // badGive: alternative give on failure
    if (result.success === false && ch.badGive) {
      ch.badGive.forEach((g) => {
        const item = cart.find((i) => i.name === g.name);
        if (item) {
          item.count += g.amt;
          result.effects.push(`${g.amt >= 0 ? '+' : ''}${g.amt} ${g.name}`);
        }
      });
    }

    if (ch.setsFlag) {
      S.flags[ch.setsFlag] = true;
      result.flags.push(ch.setsFlag);
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
    const noRestPenalty = Math.max(0, S.travelDaysWithoutRest - 3) * 10;
    // Trade goods count as endgame score (furs remaining)
    const tradeGoodsCount = cart.filter(i => i.type === 'trade' || i.category === 'furs')
      .reduce((s, i) => s + i.count, 0);
    const tradeBonus = tradeGoodsCount * 150;

    let score = 1000;
    score += tradeBonus;
    score += foodBonus * 15;
    score += crewBonus;
    score -= daysPenalty * 5;
    score -= wearPenalty * 25;
    score -= noRestPenalty;
    return Math.max(1, Math.round(score));
  }

  const stepLog = [];

  function travelOneDay() {
    if (S.over || S.pendingSettlement) return stepLog;
    const nextDist = NODES[S.node + 1]?.dist || 1;

    // Weight physics: calculate weight ratio for travel/wear modifiers
    const usedWeight = totalWeight(cart);
    const weightRatio = usedWeight / CONSTANTS.CART_CAPACITY; // 0.0 to 1.5+
    const travelMult = 1 + weightRatio * CONSTANTS.WEIGHT_TRAVEL_MULT;
    const wearMult = 1 + weightRatio * CONSTANTS.WEIGHT_WEAR_MULT;

    // Advance weather at start of day
    advanceWeather();

    const weatherFood = CONSTANTS.WEATHER_FOOD_MOD[S.weather] || 0;
    const foodBefore = S.food;
    S.food = Math.max(0, Math.round((S.food - CONSTANTS.DAILY_FOOD - weatherFood) * 10) / 10);
    
    // Starvation mechanics: food ≤ 0 triggers penalties
    if (S.food <= 0) {
      S.morale = Math.max(0, S.morale - 10);
      S.crew = 'exhausted';
      S.wear = Math.min(CONSTANTS.MAX_WEAR, S.wear + 1);
      checkGameOver();
      if (S.over) return stepLog;
    }

    S.segmentDay += travelMult; // heavier cart = slower progress per day
    S.travelDaysWithoutRest++;
    advance();
    // #80 — Decrement blessing days
    if (S.blessingDays > 0) S.blessingDays--;

    const wearChance = { plains: 0.10, river_valley: 0.15, wooded: 0.20 };
    const weatherWearMult = CONSTANTS.WEATHER_WEAR_MULT[S.weather] || 1;
    if (rand() < (wearChance[NODES[S.node].terrain] || 0.2) * weatherWearMult * wearMult) S.wear++;

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
        S.over = true;
        // Check starvation/wear before declaring victory
        if (S.food <= 0) {
          S.endReason = 'starvation';
        } else if (S.wear >= CONSTANTS.MAX_WEAR) {
          S.endReason = 'cart_failure';
        } else if (S.morale <= 0) {
          S.endReason = 'abandoned';
        } else {
          S.won = true; // Reaching the end alive = victory
          S.score = calcScore();
          S.endReason = 'victory';
        }
        return stepLog;
      }
      if (n.type !== 'river' && S.node >= 1) S.pendingSettlement = n;
      // Settlement event: 30% chance when arriving at a settlement
      if (S.pendingSettlement && rand() < 0.3) {
        const sev = pickSettlementEvent(S.pendingSettlement.type, rand);
        if (sev) S.pendingEvent = sev;
      }
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
        S.over = true;
        S.won = true; // Reaching the end alive = victory
        S.score = calcScore();
      } else {
        const n = NODES[S.node];
        if (n.type !== 'river') S.pendingSettlement = n;
        // Settlement event: 30% chance when arriving at a settlement
        if (S.pendingSettlement && rand() < 0.3) {
          const sev = pickSettlementEvent(S.pendingSettlement.type, rand);
          if (sev) S.pendingEvent = sev;
        }
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

  function getSettlementActionsByType(type) {
  const barter = CONSTANTS.SETTLEMENT_BARTER[type] || CONSTANTS.SETTLEMENT_BARTER.hbc;
  const actions = [];

  // Display name mapping for internal item names
  const DISPLAY_NAMES = {
    'any_fur': 'Any Fur/Pelt',
    'Pemmican Rations': 'Pemmican Rations',
    'rested': 'Rested',
    'Morale': 'Morale',
    'blessingDays': 'Blessing',
    'trail_intel': 'Trail Intel',
    'hasPermit': 'Permit',
    'finesCleared': 'Fines Cleared',
    'ReputationMetis': 'Reputation',
  };

  function displayName(name) {
    return DISPLAY_NAMES[name] || name.replace(/_/g, ' ');
  }

  // Add each barter option as an action
  for (const [actionId, trade] of Object.entries(barter)) {
    if (trade.giveOptions) {
      // Multiple give options (e.g., mission heal_crew)
      trade.giveOptions.forEach((opt, idx) => {
        const giveDesc = opt.give.map(g => `${g.count} ${displayName(g.name)}`).join(' + ');
        const receiveDesc = opt.receive.map(r => `${r.count} ${displayName(r.name)}`).join(', ');
        const baseLabel = actionId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        actions.push({
          id: `${actionId}_${idx}`,
          label: `${baseLabel} (${giveDesc})`,
          cost: giveDesc || 'Free',
          risk: receiveDesc,
          flavor: trade.flavor,
          desc: trade.desc,
        });
      });
    } else if (trade.options) {
      // Multiple receive options (e.g., trade_furs_supplies) — group under one card
      const baseLabel = actionId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      trade.options.forEach((opt, idx) => {
        const giveDesc = trade.give.map(g => `${g.count} ${displayName(g.name)}`).join(' + ');
        const receiveDesc = opt.receive.map(r => `${r.count} ${displayName(r.name)}`).join(', ');
        actions.push({
          id: `${actionId}_${opt.id}`,
          label: opt.id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          cost: giveDesc || 'Free',
          risk: receiveDesc,
          flavor: opt.flavor,
          desc: trade.desc,
          groupId: actionId,
          groupLabel: baseLabel,
          groupIndex: idx,
        });
      });
    } else {
      // Simple single give/receive
      const giveDesc = trade.give.map(g => `${g.count} ${displayName(g.name)}`).join(' + ');
      const receiveDesc = trade.receive.map(r => `${r.count} ${displayName(r.name)}`).join(', ');
      actions.push({
        id: actionId,
        label: actionId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        cost: giveDesc || 'Free',
        risk: receiveDesc,
        flavor: trade.flavor,
        desc: trade.desc,
      });
    }
  }

  return actions;
}

  return {
    travelOneDay,
    makeCamp,
    pushOn,
    chooseEventChoice,
    getSettlementActionsByType,
    getState() {
      const usedWeight = totalWeight(cart);
      const weightRatio = usedWeight / CONSTANTS.CART_CAPACITY;
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
        usedWeight,
        capacity: S.capacity,
        weightRatio: Math.round(weightRatio * 100) / 100,
        preDeparture: S.preDeparture,
        weather: S.weather,
        currentTerrain: NODES[S.node]?.terrain || 'plains',
        travelDaysWithoutRest: S.travelDaysWithoutRest,
        blessingDays: S.blessingDays,
        trailIntel: S.trailIntel ? [...S.trailIntel] : [],
        camps: S.camps,
        eventsResolved: S.eventsResolved,
        tradesMade: S.tradesMade,
        flags: S.flags,
        reputation: S.reputation,
        credit: S.credit || {},
        perishable: S.perishable,
        seed: S.seed,
      };
    },
    getCart() {
      return JSON.parse(JSON.stringify(cart));
    },
    offloadItem(name) {
      const idx = cart.findIndex((i) => i.name === name);
      if (idx === -1 || cart[idx].count <= 0) return false;
      cart[idx].count--;
      return true;
    },
    getTradeEstimate(itemId, quantity, settlementType) {
      const item = cart.find(i => i.name === itemId);
      if (!item) return null;
      const basePrice = 1;
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
      const item = cart[idx];
      const est = this.getTradeEstimate(itemName, 1, S.pendingSettlement?.type || item?.category || 'hbc');
      if (!est) return null;
      S.food += est.sellPrice;
      S.tradesMade++;
      return { item: itemName, foodGain: est.sellPrice };
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
        desc: a.desc,
        groupId: a.groupId || null,
        groupLabel: a.groupLabel || null,
        groupIndex: a.groupIndex || 0,
      }));
    },

    settlementAction(actionId, params = {}) {
      if (!S.pendingSettlement) return { error: 'No settlement pending' };
      const type = S.pendingSettlement.type;
      const state = S;
      const result = executeSettlementAction(actionId, type, state, cart, params);
      // One action per visit: clear pendingSettlement after any successful action (including continue)
      if (result && !result.error) {
        S.pendingSettlement = null;
      }
      checkGameOver();
      return result || {};
    },

    getEndgameScore() {
      const state = S;
      const foodBonus = Math.min(state.food, 25);
      const crewBonus = state.crew === 'rested' ? 30 : state.crew === 'tired' ? 10 : 0;
      const daysPenalty = state.day * 8;
      const wearPenalty = state.wear * state.wear * 40;
      const baseScore = 500;

      // Rarity multipliers for trade goods (per PHASE_0_PLAN)
      const RARITY_MULT = {
        'Prime Bison Hide': 5,
        'Prime Elk Hide': 5,
        'Prime Beaver Pelt': 5,
        'Prime Wolf Pelt': 5,
        'Bison Hide': 3,
        'Elk Hide': 3,
        'Beaver Pelt': 2,
        'Wolf Pelt': 2,
      };

      // Calculate trade goods score with rarity multipliers
      // Trade goods only count toward score if the player reached Edmonton (won)
      let tradeBonus = 0;
      let tradeGoodsCount = 0;
      let primeCount = 0;
      let typesCollected = new Set();
      if (state.won) {
        const tradeItems = cart.filter(i => i.type === 'trade' || i.category === 'furs');
        for (const item of tradeItems) {
          const mult = RARITY_MULT[item.name] || 1;
          tradeBonus += item.count * 50 * mult;
          tradeGoodsCount += item.count;
          if (mult >= 5) primeCount += item.count;
          typesCollected.add(item.name);
        }
      }

      // Survival bonuses
      const moraleBonus = Math.floor(state.morale / 2); // up to 50
      const blessingBonus = (state.blessingDays || 0) * 10; // up to 30
      const speedBonus = state.day <= 40 ? 100 : state.day <= 50 ? 50 : 0; // faster journey bonus

      const foodScore = foodBonus * 12;

      const total = baseScore + tradeBonus + foodScore + crewBonus + moraleBonus + blessingBonus + speedBonus - daysPenalty - wearPenalty;

      // Tiered win conditions (PHASE_0_PLAN)
      let tier = 'Defeat';
      if (state.won) {
        const hasAllTypes = typesCollected.size >= 4; // at least 4 different trade good types
        const noStarvation = state.food > 0;
        const lowWear = state.wear <= 2;

        if (tradeGoodsCount >= 5 && state.crew === 'rested') {
          if (hasAllTypes && noStarvation && lowWear && primeCount >= 2) {
            tier = 'Legendary';
          } else {
            tier = 'Prosperous';
          }
        } else if (tradeGoodsCount >= 3 && state.food > 0) {
          tier = 'Trader';
        } else {
          tier = 'Survivor';
        }
      }

      return {
        score: Math.max(1, Math.round(total)),
        breakdown: {
          base: Math.round(baseScore),
          tradeGoods: Math.round(tradeBonus),
          foodBonus: Math.round(foodScore),
          crewCondition: Math.round(crewBonus),
          morale: Math.round(moraleBonus),
          blessings: Math.round(blessingBonus),
          speed: Math.round(speedBonus),
          daysPenalty: Math.round(-daysPenalty),
          wearPenalty: Math.round(-wearPenalty),
        },
        tier,
        tradeGoodsCount,
        primeCount,
        typesCollected: typesCollected.size,
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
          output: { name: 'Finished Hides', icon: '🟫' },
          settlement: 'hbc',
        },
        {
          id: 'travois_kit',
          name: 'Travois Kit',
          inputs: [
            { name: 'Shaganappi', count: 2 },
            { name: 'Rope (50ft)', count: 1 },
          ],
          output: { name: 'Travois Kit', icon: '🛒' },
          settlement: 'metis',
        },
        {
          id: 'gunpowder_pack',
          name: 'Gunpowder Pack',
          inputs: [
            { name: 'Ammunition Belt', count: 1 },
            { name: 'Tool Kit', count: 1 },
          ],
          output: { name: 'Gunpowder Pack', icon: '💥' },
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
    campAction(type, extraFood = 0) {
      const action = String(type || '').toLowerCase();
      const costItems = [];
      const effects = [];
      const itemEffects = [];
      let roll = null;
      let rollTotal = null;
      let critical = false;

      if (action === 'rest') {
        const foodCost = 1 + extraFood;
        if (S.food < foodCost) return { error: 'Not enough food to rest.' };
        S.food -= foodCost;
        costItems.push({ name: 'Food', count: -foodCost });
        
        // Check for shelter/fuel items for rest bonuses
        const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
        const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
        const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
        const isWetWeather = ['rain', 'storm', 'snow'].includes(S.weather);
        const isColdWeather = ['snow'].includes(S.weather);
        
        roll = d();
        // Extra food gives +2 to roll per extra food spent (up to +4)
        const restBonus = Math.min(extraFood, 2) * 2;
        // Item bonuses
        let itemBonus = 0;
        if (hasTarp && isWetWeather) {
          itemBonus += 2;
          itemEffects.push('Canvas Tarp kept the damp off. +2 rest bonus.');
        }
        if (hasBlanket && isColdWeather) {
          itemBonus += 3;
          itemEffects.push('Blankets held the cold at bay. +3 rest bonus.');
        }
        if (hasFirewood && isColdWeather) {
          itemBonus += 2;
          itemEffects.push('Firewood warmed the camp. +2 rest bonus.');
        }
        rollTotal = roll + crewMod(S) + restBonus + itemBonus;
        if (roll === 1) {
          critical = true;
          S.crew = 'tired';
          S.morale = Math.max(0, S.morale - 3);
          S.travelDaysWithoutRest = 0;
          effects.push('Critical failure: the camp is a disaster — cold, sleepless, demoralizing.', 'Morale -3', 'Crew tired');
        } else if (rollTotal >= 15) {
          S.crew = 'rested';
          S.morale = Math.max(0, Math.min(100, S.morale + 20 + extraFood * 5 + itemBonus));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push('Wonderful rest.', 'Crew rested', `Morale +${20 + extraFood * 5 + itemBonus}`, 'Wear -1');
        } else if (rollTotal >= 8) {
          S.crew = 'rested';
          S.morale = Math.max(0, Math.min(100, S.morale + 15 + extraFood * 3 + itemBonus));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push('Crew rested', `Morale +${15 + extraFood * 3 + itemBonus}`, 'Wear -1');
        } else {
          S.crew = 'tired';
          S.morale = Math.max(0, Math.min(100, S.morale + 5 + extraFood * 2 + itemBonus));
          S.travelDaysWithoutRest = 0;
          effects.push('Rough night.', `Morale +${5 + extraFood * 2 + itemBonus}`, 'Crew tired');
        }
      } else if (action === 'forage') {
        roll = d();
        const forageBonus = Math.min(extraFood, 2) * 2;
        rollTotal = roll + crewMod(S) + forageBonus;
        if (roll === 1) {
          critical = true;
          advance(); // lose an extra day
          effects.push('Critical failure: wasted the whole day. Found nothing.', '+1 day lost');
        }
        const baseGain = Math.floor(Math.random() * 6) + (rollTotal >= 12 ? 6 : rollTotal >= 8 ? 4 : 1);
        S.food += baseGain + extraFood;
        if (rollTotal >= 12) {
          effects.push(`Excellent foraging. +${baseGain + extraFood} Food`);
        } else if (rollTotal >= 8) {
          effects.push(`Foraged +${baseGain + extraFood} Food`);
        } else if (rollTotal >= 5) {
          effects.push(`Lean haul. +${baseGain + extraFood} Food`);
        } else {
          effects.push('Found little today.');
        }
      } else if (action === 'hunt') {
        const ammo = cart.find((i) => i.name === 'Ammunition Belt');
        if (!ammo || ammo.count < 1) return { error: 'Need 1 Ammunition Belt to hunt.' };
        ammo.count -= 1;
        costItems.push({ name: 'Ammunition Belt', count: -1 });
        // Extra food for better preparation (+1 food per extra)
        const foodCost = extraFood;
        if (foodCost > 0) {
          if (S.food < foodCost) return { error: 'Not enough food for extra supplies.' };
          S.food -= foodCost;
          costItems.push({ name: 'Food', count: -foodCost });
        }
        advance();
        roll = d();
        const huntBonus = Math.min(extraFood, 2) * 2;
        rollTotal = roll + crewMod(S) + huntBonus;
        
        const resultItems = [];
        let meatGain = 0;
        
        if (roll === 1) {
          critical = true;
          S.morale = Math.max(0, S.morale - 2);
          effects.push('Critical failure: shot went wide, startled the game, lost ammo.', 'Morale -2');
        } else if (rollTotal >= 10) {
          // Success: determine yield based on terrain and rarity weights
          const terrain = NODES[S.node]?.terrain || 'plains';
          const yields = CONSTANTS.HUNT_YIELDS[terrain] || CONSTANTS.HUNT_YIELDS.plains;
          const weights = CONSTANTS.HUNT_RARITY_WEIGHTS;
          
          // Roll for rarity: 70% food only, 25% common pelt, 5% rare hide
          const rarityRoll = Math.random();
          let yieldResult = { type: 'food', item: null };
          
          if (rarityRoll < weights.food) {
            yieldResult.type = 'food';
          } else if (rarityRoll < weights.food + weights.common) {
            yieldResult.type = 'common';
            yieldResult.item = yields.common;
          } else {
            yieldResult.type = 'rare';
            yieldResult.item = yields.rare;
          }
          
          // Food amount based on yield type
          if (yieldResult.type === 'food') {
            meatGain = Math.floor(Math.random() * (yields.foodMax - yields.foodMin + 1)) + yields.foodMin;
          } else if (yieldResult.type === 'common') {
            meatGain = Math.floor(yields.foodMin / 2) + 1; // 1-2 food for common
          } else {
            meatGain = Math.floor(yields.foodMin / 2) + 1; // 1-2 food for rare
          }
          
          // Extra food spent gives +1 food yield per extra
          meatGain += extraFood;
          
          S.food += meatGain;
          effects.push(`Clean kill. +${meatGain} Food`);
          
          // Add pelt/hide if not food-only
          if (yieldResult.item) {
            const item = yieldResult.item;
            const existing = cart.find((c) => c.name === item.name);
            if (existing) {
              existing.count++;
            } else {
              cart.push({
                name: item.name,
                icon: item.icon,
                type: 'trade',
                category: 'furs',
                wt: item.wt,
                count: 1,
                desc: item.desc,
              });
            }
            resultItems.push({
              name: item.name,
              wt: item.wt,
              rarity: yieldResult.type, // 'common' or 'rare'
            });
            effects.push(`+1 ${item.name} (${item.wt} kg)`);
          }
        } else {
          effects.push('Shot went wide. No pelts gained.');
        }
        
        // Return structured result for hunt
        if (roll !== 1 && rollTotal >= 10) {
          return { day: S.day, effects, costItems, roll, rollTotal, critical, food: meatGain, items: resultItems };
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
          const gained = Math.floor(Math.random() * 4) + 5; // 5-8 pemmican
          S.food += gained;
          S.morale = Math.max(0, Math.min(100, S.morale + 5));
          effects.push(`The women work fast — slicing, pounding, rendering tallow. +${gained} Pemmican`, 'Morale +5');
        } else if (rollTotal >= 7) {
          const gained = Math.floor(Math.random() * 3) + 3; // 3-5 pemmican
          S.food += gained;
          effects.push(`Lean processing. +${gained} Pemmican`);
        } else {
          effects.push('The work is slow and the yield is poor. +1 Pemmican');
          S.food += 1;
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
      } else if (action === 'cook') {
        const firewood = cart.find((i) => i.name === 'Firewood Bundle');
        if (!firewood || firewood.count < 1) return { error: 'Need Firewood to cook.' };
        if (S.food < 1) return { error: 'Need 1 Food to cook.' };
        firewood.count -= 1;
        S.food -= 1;
        costItems.push({ name: 'Firewood Bundle', count: -1 }, { name: 'Food', count: -1 });
        S.crew = 'rested';
        S.morale = Math.max(0, Math.min(100, S.morale + 10));
        const healAmt = S.crew === 'exhausted' ? 30 : 20;
        S.morale = Math.max(0, Math.min(100, S.morale + healAmt));
        S.travelDaysWithoutRest = 0;
        effects.push('Cooked a hot meal.', 'Firewood used', 'Morale +' + (10 + healAmt), 'Crew rested');
      } else {
        return { error: 'Unknown camp action.' };
      }

      if (effects.length === 0 && costItems.length === 0) effects.push('Nothing changes.');
      return { day: S.day, effects, costItems, roll, rollTotal, critical, itemEffects };
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
          actions: getSettlementActionsByType(S.pendingSettlement.type).map(a => a.id),
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
        icon: item.icon
      }));
    },
    setPreDepartureCount(itemName, newCount) {
      const item = cart.find((i) => i.name === itemName);
      if (!item) return false;
      const maxCount = item.count;
      const clamped = Math.max(0, Math.min(newCount, maxCount));
      item.count = clamped;
      S.usedWeight = totalWeight(cart);
      return true;
    },
    confirmPreDeparture() {
      S.preDeparture = false;
      S.usedWeight = totalWeight(cart);
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
        distance: S.node,
        seed: S.seed,
      };
    },
    buyItem(name, wt, category) {
      const existing = cart.find(i => i.name === name);
      if (existing) {
        existing.count++;
      } else {
        cart.push({ name, wt, count: 1, category, type: category === 'provisions' ? 'food' : 'item' });
      }
    },
    addFood(amount) {
      S.food += amount;
    },
  };
}
function executeSettlementAction(actionId, type, state, cart, params) {
  // Handle 'continue' action - just clear the settlement
  if (actionId === 'continue') {
    state.pendingSettlement = null;
    return { continued: true };
  }

  const barter = CONSTANTS.SETTLEMENT_BARTER[type] || CONSTANTS.SETTLEMENT_BARTER.hbc;
  
  // Handle compound action IDs (e.g., trade_furs_supplies_ammunition)
  // Find the base action and option
  let matchedTrade = null;
  let matchedOption = null;
  
  // First check for exact match
  if (barter[actionId]) {
    matchedTrade = barter[actionId];
  } else {
    // Check for compound IDs
    for (const [baseId, trade] of Object.entries(barter)) {
      if (trade.options) {
        for (const opt of trade.options) {
          if (`${baseId}_${opt.id}` === actionId) {
            matchedTrade = trade;
            matchedOption = opt;
            break;
          }
        }
      } else if (trade.giveOptions) {
        for (let i = 0; i < trade.giveOptions.length; i++) {
          if (`${baseId}_${i}` === actionId) {
            matchedTrade = trade;
            matchedOption = trade.giveOptions[i];
            break;
          }
        }
      }
      if (matchedTrade) break;
    }
  }
  
  if (!matchedTrade) {
    return { error: `Unknown action: ${actionId}` };
  }

  // Helper: find first fur/trade good
  const furItems = cart.filter(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0);
  const hasFur = furItems.length > 0;
  const furItem = furItems[0];

  // Determine what to give and receive
  let giveItems = matchedTrade.give || [];
  let receiveItems = matchedOption?.receive || matchedTrade.receive || [];

  // Handle giveOptions (e.g., mission heal_crew)
  if (matchedOption && matchedOption.give) {
    giveItems = matchedOption.give;
  }

  // Check if we can afford the give items
  for (const give of giveItems) {
    if (give.name === 'any_fur') {
      if (!hasFur) return { error: 'No furs to trade' };
    } else if (give.name === 'Pemmican Rations') {
      if (state.food < give.count) return { error: `Need ${give.count} food` };
    } else {
      const item = cart.find(i => i.name === give.name);
      if (!item || item.count < give.count) return { error: `Need ${give.count} ${give.name}` };
    }
  }

  // Execute the trade - remove give items
  for (const give of giveItems) {
    if (give.name === 'any_fur') {
      // Remove one fur/trade good
      const idx = cart.findIndex(i => (i.type === 'trade' || i.category === 'furs') && i.count > 0);
      if (idx !== -1) {
        cart[idx].count--;
        if (cart[idx].count === 0) cart.splice(idx, 1);
      }
    } else if (give.name === 'Pemmican Rations') {
      state.food -= give.count;
    } else {
      const idx = cart.findIndex(i => i.name === give.name);
      if (idx !== -1) {
        cart[idx].count -= give.count;
        if (cart[idx].count === 0) cart.splice(idx, 1);
      }
    }
  }

  // Settlement rest item bonuses (Tarp/Blanket/Firewood) - similar to camp rest
  const isRestAction = receiveItems.some(r => r.name === 'rested');
  const isHealAction = actionId === 'heal_crew_0' || actionId === 'heal_crew_1';
  const itemEffects = [];

  if (isRestAction || isHealAction) {
    const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
    const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
    const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
    const isWetWeather = ['rain', 'storm', 'snow'].includes(state.weather);
    const isColdWeather = ['snow'].includes(state.weather);

    if (hasTarp && isWetWeather) {
      itemEffects.push('Canvas Tarp kept the damp off. +5 Morale.');
      state.morale = Math.min(100, state.morale + 5);
    }
    if (hasBlanket && isColdWeather) {
      itemEffects.push('Blankets held the cold at bay. +8 Morale.');
      state.morale = Math.min(100, state.morale + 8);
    }
    if (hasFirewood && isColdWeather) {
      itemEffects.push('Firewood warmed the shelter. +5 Morale.');
      state.morale = Math.min(100, state.morale + 5);
    }
  }

  // Add receive items
  const results = { flavor: matchedTrade.flavor || matchedOption?.flavor, itemEffects };
  for (const receive of receiveItems) {
    if (receive.name === 'Pemmican Rations') {
      state.food += receive.count;
      results.foodGain = (results.foodGain || 0) + receive.count;
    } else if (receive.name === 'rested') {
      state.crew = 'rested';
      state.travelDaysWithoutRest = 0;
      results.rested = true;
    } else if (receive.name === 'Morale') {
      state.morale = Math.min(100, state.morale + receive.count);
      results.moraleGain = (results.moraleGain || 0) + receive.count;
    } else if (receive.name === 'blessingDays') {
      state.blessingDays = receive.count;
      results.blessingDays = receive.count;
    } else if (receive.name === 'ReputationMetis') {
      state.reputation.metis = (state.reputation.metis || 0) + receive.count;
      results.reputationGain = receive.count;
    } else if (receive.name === 'trail_intel') {
      state.trailIntel = state.trailIntel || [];
      const next = NODES[state.node + 1];
      if (next) state.trailIntel.push({ fromDay: state.day, text: `Gossip from ${state.pendingSettlement?.name}: ${next.name} has ${next.terrain.replace(/_/g, ' ')} ahead.`, bonus: { dcBonus: 1 } });
      results.gossipGathered = true;
    } else if (receive.name === 'hasPermit') {
      state.hasPermit = true;
      results.permitObtained = true;
    } else if (receive.name === 'finesCleared') {
      state.fines = 0;
      results.finesPaid = true;
    } else {
      // Regular item
      const existing = cart.find(i => i.name === receive.name);
      if (existing) {
        existing.count += receive.count;
      } else {
        // Get item data from ITEMS array
        const itemData = ITEMS.find(i => i.name === receive.name);
        if (itemData) {
          cart.push({ ...itemData, count: receive.count });
        } else {
          // Fallback
          cart.push({ name: receive.name, wt: 1, count: receive.count, type: 'item', category: 'item', mbValue: 0, perishable: false, desc: '' });
        }
      }
      results[`got_${receive.name.replace(/\s+/g, '_').toLowerCase()}`] = receive.count;
    }
  }

  state.tradesMade++;
  return results;
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
