import { CONSTANTS } from '../core/constants.js';
import { crewMod, wearMod, totalMod, squealIndex } from '../core/constants.js';
import { advanceDate, seasonFor } from '../core/calendar.js';
import { makeRNG, d20 } from '../core/seed.js';
import { NODES } from '../data/nodes.js';
import { startingCart, totalWeight } from '../data/items.js';
import { getSource } from '../data/sources/index.js';

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
    const result = { roll: null, total: null, dc: null, success: null, text: '', effects: [] };

    if (ch.need) {
      const needs = cart.some((i) => i.name === ch.need && i.count > 0);
      if (!needs) {
        result.text = `You don't have a ${ch.need}. You can't do that.`;
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

    S.eventsResolved++;
    return result;
  }

  function pickEvent() {
    if (rand() > CONSTANTS.EVENT_CHANCE) return null;
    const node = NODES[S.node];
    const pool = EVENTS[node.terrain] || EVENTS.plains;
    return pool[Math.floor(rand() * pool.length)];
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
