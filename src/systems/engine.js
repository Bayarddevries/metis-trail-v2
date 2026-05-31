import { CONSTANTS } from '../core/constants.js';
import { crewMod, wearMod, totalMod, squealIndex } from '../core/constants.js';
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

  const cart = startingCart();

  const S = {
    seed,
    day: 1,
    month: CONSTANTS.START_MONTH,
    year: CONSTANTS.YEAR,
    date: { month: CONSTANTS.START_MONTH, day: CONSTANTS.START_DAY },
    season: seasonFor(CONSTANTS.START_MONTH),
    crew: 'rested',
    food: 30,
    squeal: 0,
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
  };

  function checkGameOver() {
    if (S.over) return;
    if (S.food <= 0) {
      S.food = 0;
      S.over = true;
      S.crew = 'exhausted';
      S.morale = Math.max(0, S.morale - 30);
    }
    if (S.wear >= CONSTANTS.MAX_WEAR) {
      S.over = true;
    }
    if (S.season === 'early winter' && S.node < NODES.length - 1) {
      S.over = true;
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
        S.wear += ch.wear || 0;
        result.effects.push(`+${ch.wear || 0} Wear`);
      }
    } else if (ch.always) {
      result.text = ch.always;
      result.success = true;
      if (ch.alwaysWear) {
        S.wear += ch.alwaysWear;
        result.effects.push(`+${ch.alwaysWear} Wear`);
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
    if (ch.give) {
      ch.give.forEach((g) => {
        const item = cart.find((i) => i.name === g.name);
        if (item) {
          item.count += g.amt;
          result.effects.push(`+${g.amt} ${g.name}`);
        }
      });
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

  function calcScore() {
    if (!S.won) return 0;
    const tradeUnits = cart.filter((i) => i.type === 'trade' && i.count > 0).reduce((s, i) => s + i.count, 0);
    const daysPenalty = S.day;
    const wearPenalty = S.wear * S.wear;
    const foodBonus = Math.min(S.food, 25);
    const crewBonus = S.crew === 'rested' ? 30 : S.crew === 'tired' ? 10 : 0;
    const noRestPenalty = Math.max(0, S.travelDaysWithoutRest - 3) * 15;

    let score = 1000;
    score += tradeUnits * 120;
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
    S.food -= CONSTANTS.DAILY_FOOD;
    S.segmentDay++;
    S.travelDaysWithoutRest++;
    advance();

    const wearChance = { plains: 0.12, river_valley: 0.18, wooded: 0.22 };
    if (rand() < (wearChance[NODES[S.node].terrain] || 0.2)) S.wear++;

    const squealChance = { plains: 0.15, river_valley: 0.1, wooded: 0.2 };
    if (rand() < (squealChance[NODES[S.node].terrain] || 0.15)) S.squeal = Math.min(100, S.squeal + 10);

    if (S.travelDaysWithoutRest >= 5 && S.crew !== 'exhausted') S.crew = 'exhausted';
    else if (S.travelDaysWithoutRest >= 3 && S.crew === 'rested') S.crew = 'tired';

    S.morale = Math.max(0, Math.min(100, S.morale - 2));

    if (S.day % CONSTANTS.DAYS_PER_WEEK === 0 && !S.pendingSettlement) {
      S.crew = 'rested';
      S.squeal = 0;
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
        S.over = true;
        S.won = hasTrade && S.wear < CONSTANTS.MAX_WEAR;
        S.score = calcScore();
        return stepLog;
      }
      if (n.type !== 'river') S.pendingSettlement = n;
      return stepLog;
    }

    const ev = pickEvent();
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
        S.over = true;
        S.won = hasTrade && S.wear < CONSTANTS.MAX_WEAR;
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
    S.morale = Math.min(100, S.morale + 15);
    advance();
    checkGameOver();
  }

  function settlementAction(action) {
    if (!S.pendingSettlement) return [];
    S.pendingSettlement = null;
    if (action === 'continue') return [];
    if (action === 'rest') {
      S.crew = 'rested';
      S.food += 2;
      S.squeal = 0;
      S.travelDaysWithoutRest = 0;
      S.morale = Math.min(100, S.morale + 25);
      advance();
    }
    if (action === 'repair') {
      const shag = cart.find((i) => i.name === 'Shaganappi');
      if (S.wear > 0 && shag && shag.count > 0) {
        shag.count--;
        S.wear = Math.max(0, S.wear - 2);
      } else if (S.wear > 0) {
        S.wear = Math.max(0, S.wear - 1);
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
        const foodGain = Math.floor(rand() * 5) + 6;
        S.food += foodGain;
        S.tradesMade++;
      }
    }
    if (action === 'grease') {
      const shag = cart.find((i) => i.name === 'Shaganappi');
      if (shag && shag.count > 0) {
        shag.count--;
        S.squeal = 0;
      }
    }
    if (action === 'forage') {
      const roll = d() + crewMod(S);
      if (roll >= 12) {
        const gain = Math.floor(rand() * 4) + 1;
        S.food += gain;
      }
      advance();
    }
    if (action === 'recruit') {
      if (S.crew !== 'exhausted') S.crew = 'rested';
    }
    if (action === 'rumours') advance();
    checkGameOver();
    return [];
  }

  return {
    travelOneDay,
    makeCamp,
    chooseEventChoice,
    settlementAction,
    getState() {
      return {
        day: S.day,
        month: S.month,
        year: S.year,
        season: S.season,
        crew: S.crew,
        food: S.food,
        squeal: S.squeal,
        wear: S.wear,
        morale: S.morale,
        node: S.node,
        segmentDay: S.segmentDay,
        over: S.over,
        won: S.won,
        score: S.score,
        pendingEvent: S.pendingEvent,
        pendingSettlement: S.pendingSettlement,
      };
    },
    getCart() {
      return JSON.parse(JSON.stringify(cart));
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
  };
}

function availableSettlementActions(type) {
  const base = ['rest'];
  if (type === 'hbc') return [...base, 'trade', 'repair', 'grease', 'forage', 'recruit'];
  if (type === 'metis') return [...base, 'trade', 'grease', 'forage', 'rumours', 'recruit'];
  if (type === 'trading') return [...base, 'trade', 'forage', 'rumours'];
  if (type === 'mission') return [...base, 'heal', 'rumours'];
  if (type === 'nwmp') return [...base, 'trade', 'grease', 'rumours'];
  return base;
}

const EVENTS = {
  plains: [],
  river_valley: [],
  wooded: [],
  uplands: [],
  river: [],
};

const FALLBACK_EVENTS = {
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
