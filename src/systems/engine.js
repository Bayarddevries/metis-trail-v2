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
    perishable: {},
    preDeparture: false,
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
    S.food = Math.max(0, Math.round((S.food - CONSTANTS.DAILY_FOOD) * 10) / 10);
    S.segmentDay++;
    S.travelDaysWithoutRest++;
    advance();

    const wearChance = { plains: 0.08, river_valley: 0.12, wooded: 0.15 };
    if (rand() < (wearChance[NODES[S.node].terrain] || 0.2)) S.wear++;

    // Squeal event: at high wear, the axle's scream draws attention
    if (S.wear >= 4 && rand() < 0.35) {
      S.pendingEvent = getSquealEvent();
      return stepLog;
    }

    if (S.travelDaysWithoutRest >= 5 && S.crew !== 'exhausted') S.crew = 'exhausted';
    else if (S.travelDaysWithoutRest >= 3 && S.crew === 'rested') S.crew = 'tired';

    S.morale = Math.max(0, Math.min(100, S.morale - 2));

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
        S.over = true;
        // Check starvation/wear before declaring victory
        if (S.food <= 0) {
          S.endReason = 'starvation';
        } else if (S.wear >= CONSTANTS.MAX_WEAR) {
          S.endReason = 'cart_failure';
        } else if (S.morale <= 0) {
          S.endReason = 'abandoned';
        } else {
          S.won = hasTrade;
          S.score = calcScore();
          S.endReason = S.won ? 'victory' : 'no_trade';
        }
        return stepLog;
      }
      if (n.type !== 'river' && S.node > 1) S.pendingSettlement = n;
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
        const foodGain = Math.floor(rand() * 5) + 6;
        S.food += foodGain;
        S.tradesMade++;
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
    if (action === 'craft') {
      const recipes = game.getAvailableRecipes();
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
    getTradeEstimate(itemName) {
      const item = cart.find((i) => i.name === itemName);
      if (!item) return null;
      const n = NODES[S.node];
      // Base food yield: 4-8
      const baseMin = 4;
      const baseMax = 8;
      // Settlement type multiplier
      const settleMult = { hbc: 1.3, nwmp: 1.1, metis: 1.0, trading: 1.2, mission: 0.8 }[n.type] || 1.0;
      // Item category bonus
      const catMult = { furs: 1.4, trade: 1.2, ammo: 1.1, repair: 0.9, food: 0.7, shelter: 0.8, fuel: 0.6, medical: 1.0, tool: 0.9, hunting: 1.0 }[item.type] || 1.0;
      // Trail position bonus (further = more valuable)
      const trailMult = 1.0 + (S.node / NODES.length) * 0.3;
      const mult = settleMult * catMult * trailMult;
      return {
        min: Math.round(baseMin * mult),
        max: Math.round(baseMax * mult),
        mult: Math.round(mult * 100) / 100,
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
      if (action === 'rest') {
        if (S.food < 1) return { error: 'Not enough food to rest.' };
        S.food -= 1;
        costItems.push({ name: 'Food', count: -1 });
        const roll = d() + crewMod(S);
        if (roll >= 15) {
          S.crew = 'rested';
          S.morale = Math.max(0, Math.min(100, S.morale + 20));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push('Wonderful rest.', 'Crew rested', 'Morale +20', 'Wear -1');
        } else if (roll >= 8) {
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
        const roll = d() + crewMod(S);
        const baseGain = Math.floor(Math.random() * 6) + (roll >= 12 ? 6 : roll >= 8 ? 4 : 1);
        S.food += baseGain;
        if (roll >= 12) {
          effects.push(`Excellent foraging. +${baseGain} Food`);
        } else if (roll >= 8) {
          effects.push(`Foraged +${baseGain} Food`);
        } else if (roll >= 5) {
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
        const roll = d() + crewMod(S);
        if (roll >= 10) {
          const gained = Math.floor(Math.random() * 9) + 6;
          S.food += gained;
          effects.push(`+${gained} Food`);
        } else if (roll <= 5) {
          effects.push('Shot went wide. No food gained.');
        } else {
          effects.push('Close. Food scarce today.');
        }
      } else if (action === 'repair') {
        const shag = cart.find((i) => i.name === 'Shaganappi');
        if (!shag || shag.count < 1) return { error: 'Need 1 Shaganappi to repair.' };
        shag.count -= 1;
        costItems.push({ name: 'Shaganappi', count: -1 });
        const hasAxle = cart.some((i) => i.name === 'Spare Axle');
        const repaired = hasAxle ? 3 : 2;
        S.wear = Math.max(0, S.wear - repaired);
        effects.push(`Wear -${repaired}`);
      } else if (action === 'scout') {
        advance();
        const roll = d() + crewMod(S);
        if (roll >= 12) {
          const n = NODES[S.node + 1];
          const terrain = (n && n.terrain) || 'plains';
          effects.push(`Scout succeeded. Next leg is ${terrain.replace(/_/g, ' ')}.`);
        } else {
          effects.push('Scout returned with nothing clear to report.');
        }
      } else if (action === 'dance') {
        const bonus = S.crew === 'rested' ? 12 : S.crew === 'tired' ? 8 : 5;
        S.morale = Math.max(0, Math.min(100, S.morale + bonus));
        effects.push(`Morale +${bonus}`);
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
      return { day: S.day, effects, costItems };
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
      return true;
    },
    confirmPreDeparture() {
      S.preDeparture = false;
      S.usedWeight = totalWeight(cart);
      return cart.map((i) => ({ name: i.name, count: i.count, wt: i.wt }));
    },
  };
}

function availableSettlementActions(type) {
  const base = ['rest'];
  if (type === 'hbc') return [...base, 'trade', 'repair', 'forage', 'recruit', 'craft'];
  if (type === 'metis') return [...base, 'craft', 'trade', 'forage', 'rumours', 'recruit'];
  if (type === 'trading') return [...base, 'trade', 'forage', 'rumours'];
  if (type === 'mission') return [...base, 'heal', 'rumours'];
  if (type === 'nwmp') return [...base, 'craft', 'trade', 'rumours'];
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
