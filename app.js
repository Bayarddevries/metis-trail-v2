// src/core/constants.js
var CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 5,
  DAILY_FOOD: 1,
  MAX_CART_KG: 450,
  EVENT_CHANCE: 0.35,
  DAYS_PER_WEEK: 7,
  CREW_STATES: ["rested", "tired", "exhausted"],
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
  SQUEAL_THRESHOLDS: [0, 10, 30, 60],
  SQUEAL_LABELS: ["Quiet", "Murmuring", "Loud", "Shrieking"]
});
function crewMod(state) {
  return CONSTANTS.CREW_MOD[state.crew] ?? 0;
}
function wearMod(wear) {
  return CONSTANTS.WEAR_MOD[wear] ?? -5;
}
function totalMod(state) {
  return crewMod(state) + wearMod(state.wear);
}

// src/core/calendar.js
var DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeap(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function daysInMonth(month, year) {
  if (month === 2 && isLeap(year)) return 29;
  return DAYS_IN_MONTH[month];
}
function seasonFor(month) {
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10].includes(month)) return "autumn";
  return "early winter";
}
function advanceDate(month, day, year = 1878) {
  let m = month;
  let d = day + 1;
  while (d > daysInMonth(m, year)) {
    d -= daysInMonth(m, year);
    m += 1;
    if (m > 12) {
      m = 1;
      year += 1;
    }
  }
  return { month: m, day: d };
}

// src/core/seed.js
function makeRNG(seed) {
  if (seed == null) return null;
  let s = seed | 0;
  return function prng() {
    s |= 0;
    s = s + 1831565813 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function d20(rand) {
  return Math.floor(rand() * 20) + 1;
}

// src/data/nodes.js
var NODES = [
  {
    id: "fort_garry",
    name: "Fort Garry",
    lat: 49.89,
    lon: -97.14,
    type: "hbc",
    terrain: "river_valley",
    dist: 0,
    desc: "The Red River Settlement. HBC headquarters. The palisade walls rise from the mud \u2014 your journey begins here, where the Assiniboine meets the Red.",
    source: {
      quote: "Fort Garry... the centre of the Hudson's Bay Company's operations in the Red River Settlement.",
      author: "R. G. McConnell",
      work: "The North-West of Canada",
      year: 1885,
      url: "https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt"
    }
  },
  {
    id: "st_boniface",
    name: "St. Boniface",
    lat: 49.88,
    lon: -97.11,
    type: "mission",
    terrain: "river_valley",
    dist: 1,
    desc: "Cathedral spires above the river landing. The Grey Nuns offer healing to all travellers. Free pottage and prayers."
  },
  {
    id: "st_norbert",
    name: "St. Norbert",
    lat: 49.77,
    lon: -97.15,
    type: "metis",
    terrain: "river_valley",
    dist: 1,
    desc: "A M\xE9tis parish straddling the ox-cart trail. Smoke rises from the churchyard. Family welcomes you with bannock and Saskatoon preserve."
  },
  {
    id: "st_francois_xavier",
    name: "St. Fran\xE7ois Xavier",
    lat: 49.92,
    lon: -97.55,
    type: "metis",
    terrain: "plains",
    dist: 2,
    desc: "Long lots stretching back from the river. Well-known ford across the Assiniboine. The M\xE9tis here remember the Sayer trial \u2014 free trade is their pride.",
    source: {
      quote: "The trial of Pierre Guillaume Sayer... marked the beginning of free trade in the West.",
      author: "MMF Historical Research",
      work: "metis-research-vault",
      url: "https://github.com/Bayarddevries/metis-research-wiki"
    }
  },
  {
    id: "portage",
    name: "Portage la Prairie",
    lat: 49.97,
    lon: -98.29,
    type: "trading",
    terrain: "river_valley",
    dist: 2,
    desc: "Trading post at the old lake crossing. Full barter available. The HBC fort is decaying \u2014 the wood is grey, the palisade leaning \u2014 but trade continues."
  },
  {
    id: "fort_ellice",
    name: "Fort Ellice",
    lat: 50.4,
    lon: -101.3,
    type: "hbc",
    terrain: "river_valley",
    dist: 4,
    desc: "Midpoint resupply where the Assiniboine meets the Qu'Appelle. The trail splits here \u2014 south to Qu'Appelle, west to the Touchwood Hills.",
    source: {
      quote: "Fort Ellice... established at the junction of the Assiniboine and Qu'Appelle rivers.",
      author: "Antoine Blanc",
      work: "The Carlton Trail",
      year: 1959,
      url: "https://archive.org/stream/P000411/P000411_djvu.txt"
    }
  },
  {
    id: "fort_quappelle",
    name: "Fort Qu'Appelle",
    lat: 50.55,
    lon: -103.85,
    type: "nwmp",
    terrain: "river_valley",
    dist: 3,
    desc: "NWMP post. The red coats scrutinize every cart and cargo. Papers are checked. Duty collected. You keep your gaze steady.",
    source: {
      quote: "The mounted police... established posts along the trail to enforce Ottawa's regulations.",
      author: "R. C. Macleod",
      work: "The North-West Mounted Police and Law Enforcement, 1873-1905",
      year: 1976
    }
  },
  {
    id: "touchwood",
    name: "Touchwood Hills",
    lat: 51.2,
    lon: -104.2,
    type: "trading",
    terrain: "wooded",
    dist: 3,
    desc: "The last trees for a hundred miles. A Cree trader speaks Michif and knows the northern route. Elm and poplar break the prairie monotony."
  },
  {
    id: "humboldt",
    name: "Humboldt Mission",
    lat: 52.2,
    lon: -105.12,
    type: "mission",
    terrain: "plains",
    dist: 3,
    desc: "Only reliable healing for a lonely stretch of prairie. The mission garden grows against all odds. A welcome sight."
  },
  {
    id: "batoche",
    name: "Batoche",
    lat: 52.75,
    lon: -106.1,
    type: "metis",
    terrain: "river_valley",
    dist: 2,
    desc: "Spiritual centre of the Saskatchewan M\xE9tis. The church bell rings across the river valley. Full ceremony, full communion.",
    source: {
      quote: "Batoche... the centre of the M\xE9tis community on the South Saskatchewan.",
      author: "Lionel Goudreau",
      work: "MMF Digital Museums Collection",
      url: "https://github.com/Bayarddevries/metis-research-wiki"
    }
  },
  {
    id: "gabriels_crossing",
    name: "Gabriel's Crossing",
    lat: 52.7,
    lon: -105.75,
    type: "river",
    terrain: "river_valley",
    dist: 1,
    desc: "Gabriel Dumont operates the ferry across the South Saskatchewan. His fee is fair. The current is deceptive \u2014 do not try to ford it.",
    source: {
      quote: "Gabriel Dumont... ferryman, guide, and later military leader of the M\xE9tis forces.",
      author: "Dumont Family Accounts",
      work: "MMF Research Vault",
      url: "https://github.com/Bayarddevries/metis-research-wiki"
    }
  },
  {
    id: "fort_carlton",
    name: "Fort Carlton",
    lat: 52.8,
    lon: -106.5,
    type: "hbc",
    terrain: "river_valley",
    dist: 2,
    desc: "Major HBC depot on the North Saskatchewan. Full trade, full repair. The pemmican stores are declining \u2014 the Company feels the pressure.",
    source: {
      quote: "Fort Carlton... one of the most important posts on the Saskatchewan.",
      author: "HBC Archives",
      work: "Fort Carlton Post Journal, 1878",
      url: "https://archive.org/stream/P000279/P000279_djvu.txt"
    }
  },
  {
    id: "fort_pitt",
    name: "Fort Pitt",
    lat: 53.65,
    lon: -109.75,
    type: "hbc",
    terrain: "river_valley",
    dist: 4,
    desc: "Edge of the boreal forest. Small, isolated. The last HBC post before Edmonton. Pine and spruce replace poplar."
  },
  {
    id: "fort_edmonton",
    name: "Fort Edmonton",
    lat: 53.54,
    lon: -113.5,
    type: "hbc",
    terrain: "river_valley",
    dist: 5,
    desc: "Western terminus. Gateway to the Athabasca. The palisade walls of Fort Edmonton rise from the riverbank. The end of the Carlton Trail.",
    source: {
      quote: "Fort Edmonton... the great emporium of the northern trade.",
      author: "Ermatinger",
      work: "The York Factory Express",
      year: 1878,
      url: "https://archive.org/stream/P000279/P000279_djvu.txt"
    }
  }
];

// src/data/items.js
var ITEMS = [
  {
    name: "Pemmican Rations",
    wt: 15,
    count: 30,
    type: "food",
    desc: "Dried meat and fat. The staple of the prairie. Never truly spoils.",
    icon: "\u{1F969}",
    source: {
      quote: "Pemmican... composed of pounded dried meat, melted fat, and berries.",
      author: "Ernest C. N. Acheson",
      work: "The Buffalo and the Prairie",
      year: 1910,
      url: "https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt"
    }
  },
  {
    name: "Spare Axle",
    wt: 40,
    count: 1,
    type: "repair",
    desc: "Hard maple. Heavy but essential for a Red River cart.",
    icon: "\u{1FAB5}"
  },
  {
    name: "Shaganappi",
    wt: 5,
    count: 3,
    type: "repair",
    desc: "Rawhide strips. Binding, lashing, and cart repair.",
    icon: "\u{1FA92}",
    source: {
      quote: "Shaganappi... raw-hide thongs, much used by the half-breeds for binding their cart-wheels.",
      author: "R. G. McConnell",
      work: "The North-West of Canada",
      year: 1885,
      url: "https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt"
    }
  },
  {
    name: "Tool Kit",
    wt: 10,
    count: 1,
    type: "tool",
    desc: "Axe, auger, drawknife. Required for major repairs.",
    icon: "\u{1F6E0}\uFE0F"
  },
  {
    name: "Bison Hide",
    wt: 8,
    count: 2,
    type: "trade",
    desc: "Folded. Trade value: ~1.25 MB each at Edmonton.",
    icon: "\u{1F9AC}"
  },
  {
    name: "Canvas Tarp",
    wt: 6,
    count: 1,
    type: "shelter",
    desc: "Waterproof. Shelter and cart-raft conversion.",
    icon: "\u26FA"
  },
  {
    name: "Firewood Bundle",
    wt: 10,
    count: 2,
    type: "fuel",
    desc: "Dried poplar. Required for cold nights.",
    icon: "\u{1FAB5}"
  },
  {
    name: "Rope (50ft)",
    wt: 3,
    count: 1,
    type: "tool",
    desc: "Hemp. Crossings, repairs, binding.",
    icon: "\u{1FAA2}"
  },
  {
    name: "Ammunition Belt",
    wt: 2,
    count: 0,
    type: "ammo",
    desc: "Shot and ball. For hunting and defence.",
    icon: "\u{1F3AF}"
  },
  {
    name: "Medicine Pouch",
    wt: 2,
    count: 1,
    type: "medical",
    desc: "Herbal remedies and bandages.",
    icon: "\u{1FAD9}"
  },
  {
    name: "Blanket",
    wt: 3,
    count: 1,
    type: "shelter",
    desc: "Wool. Winter survival.",
    icon: "\u{1F6CF}\uFE0F"
  },
  {
    name: "Beaver Pelts",
    wt: 5,
    count: 1,
    type: "trade",
    desc: "Prime bundle. Trade value: ~3 MB.",
    icon: "\u{1F9AB}",
    source: {
      quote: "Beaver... the very foundation of the northern trade.",
      author: "HBC Archives",
      work: "Fort Edmonton Post Journal, 1878",
      url: "https://archive.org/stream/P000279/P000279_djvu.txt"
    }
  }
];
function startingCart() {
  return JSON.parse(JSON.stringify(ITEMS));
}
function totalWeight(cart) {
  return cart.reduce((s, i) => s + i.wt * i.count, 0);
}

// src/systems/engine.js
function createGame(seed = null) {
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
    crew: "rested",
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
    flags: {}
  };
  function checkGameOver() {
    if (S.over) return;
    if (S.food <= 0) {
      S.food = 0;
      S.over = true;
      S.crew = "exhausted";
      S.morale = Math.max(0, S.morale - 30);
    }
    if (S.wear >= CONSTANTS.MAX_WEAR) {
      S.over = true;
    }
    if (S.season === "early winter" && S.node < NODES.length - 1) {
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
    const result = { roll: null, total: null, dc: null, success: null, text: "", effects: [] };
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
      result.effects.push(`${ch.food > 0 ? "+" : ""}${ch.food} Food`);
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
    const tradeUnits = cart.filter((i) => i.type === "trade" && i.count > 0).reduce((s, i) => s + i.count, 0);
    const daysPenalty = S.day;
    const wearPenalty = S.wear * S.wear;
    const foodBonus = Math.min(S.food, 25);
    const crewBonus = S.crew === "rested" ? 30 : S.crew === "tired" ? 10 : 0;
    const noRestPenalty = Math.max(0, S.travelDaysWithoutRest - 3) * 15;
    let score = 1e3;
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
    if (S.travelDaysWithoutRest >= 5 && S.crew !== "exhausted") S.crew = "exhausted";
    else if (S.travelDaysWithoutRest >= 3 && S.crew === "rested") S.crew = "tired";
    S.morale = Math.max(0, Math.min(100, S.morale - 2));
    if (S.day % CONSTANTS.DAYS_PER_WEEK === 0 && !S.pendingSettlement) {
      S.crew = "rested";
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
        const hasTrade = cart.some((i) => i.type === "trade" && i.count > 0);
        S.over = true;
        S.won = hasTrade && S.wear < CONSTANTS.MAX_WEAR;
        S.score = calcScore();
        return stepLog;
      }
      if (n.type !== "river") S.pendingSettlement = n;
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
        const hasTrade = cart.some((i) => i.type === "trade" && i.count > 0);
        S.over = true;
        S.won = hasTrade && S.wear < CONSTANTS.MAX_WEAR;
        S.score = calcScore();
      } else {
        const n = NODES[S.node];
        if (n.type !== "river") S.pendingSettlement = n;
      }
    }
    checkGameOver();
    return [{ action: "eventResolved", event: ev.id, choiceIndex, result }];
  }
  function makeCamp() {
    if (S.pendingSettlement || S.over) return;
    S.food--;
    S.camps++;
    S.travelDaysWithoutRest = 0;
    if (S.crew === "exhausted") S.crew = "tired";
    else if (S.crew === "tired") S.crew = "rested";
    S.morale = Math.min(100, S.morale + 15);
    advance();
    checkGameOver();
  }
  function settlementAction(action) {
    if (!S.pendingSettlement) return [];
    S.pendingSettlement = null;
    if (action === "continue") return [];
    if (action === "rest") {
      S.crew = "rested";
      S.food += 2;
      S.squeal = 0;
      S.travelDaysWithoutRest = 0;
      S.morale = Math.min(100, S.morale + 25);
      advance();
    }
    if (action === "repair") {
      const shag = cart.find((i) => i.name === "Shaganappi");
      if (S.wear > 0 && shag && shag.count > 0) {
        shag.count--;
        S.wear = Math.max(0, S.wear - 2);
      } else if (S.wear > 0) {
        S.wear = Math.max(0, S.wear - 1);
      }
    }
    if (action === "heal") {
      S.crew = "rested";
      S.morale = Math.min(100, S.morale + 20);
    }
    if (action === "trade") {
      const tg = cart.find((i) => i.type === "trade" && i.count > 0);
      if (tg) {
        tg.count--;
        const foodGain = Math.floor(rand() * 5) + 6;
        S.food += foodGain;
        S.tradesMade++;
      }
    }
    if (action === "grease") {
      const shag = cart.find((i) => i.name === "Shaganappi");
      if (shag && shag.count > 0) {
        shag.count--;
        S.squeal = 0;
      }
    }
    if (action === "forage") {
      const roll = d() + crewMod(S);
      if (roll >= 12) {
        const gain = Math.floor(rand() * 4) + 1;
        S.food += gain;
      }
      advance();
    }
    if (action === "recruit") {
      if (S.crew !== "exhausted") S.crew = "rested";
    }
    if (action === "rumours") advance();
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
        pendingSettlement: S.pendingSettlement
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
          need: c.need || null
        }))
      };
    },
    getAvailableActions() {
      if (S.pendingEvent)
        return {
          type: "event",
          choices: S.pendingEvent.choices.map((c, i) => ({
            index: i,
            text: c.text,
            dc: c.dc
          }))
        };
      if (S.pendingSettlement)
        return {
          type: "settlement",
          name: S.pendingSettlement.name,
          actions: availableSettlementActions(S.pendingSettlement.type)
        };
      return { type: "travel" };
    },
    isOver() {
      return S.over;
    },
    hasWon() {
      return S.won;
    },
    getScore() {
      return S.score;
    }
  };
}
function availableSettlementActions(type) {
  const base = ["rest"];
  if (type === "hbc") return [...base, "trade", "repair", "grease", "forage", "recruit"];
  if (type === "metis") return [...base, "trade", "grease", "forage", "rumours", "recruit"];
  if (type === "trading") return [...base, "trade", "forage", "rumours"];
  if (type === "mission") return [...base, "heal", "rumours"];
  if (type === "nwmp") return [...base, "trade", "grease", "rumours"];
  return base;
}
var EVENTS = {
  plains: [],
  river_valley: [],
  wooded: [],
  uplands: [],
  river: []
};

// src/ui/theme.js
function applyTheme(root) {
  const isDark = false;
  root.style.setProperty("--clr-bg", "#E8DCC8");
  root.style.setProperty("--clr-bg-dark", "#D6C8A8");
  root.style.setProperty("--clr-ink", "#1A1410");
  root.style.setProperty("--clr-accent", "#8B2500");
  root.style.setProperty("--clr-forest", "#2C4A1E");
  root.style.setProperty("--clr-brass", "#A67C29");
  root.style.setProperty("--clr-border", "#B8A478");
  root.style.setProperty("--clr-status-bg", "#1A1410");
  root.style.setProperty("--clr-status-text", "#E8DCC8");
  root.style.setProperty("--clr-overlay-bg", "rgba(26,20,16,0.92)");
  root.style.setProperty("--font-heading", "'Rye', 'Georgia', serif");
  root.style.setProperty("--font-body", "'Alegreya', 'Georgia', serif");
}

// src/ui/shell.js
function mount() {
  const existing = document.getElementById("game-container");
  if (existing && existing.children.length > 0) {
    applyTheme(existing);
    return existing;
  }
  const { root } = createShell();
  const gameRoot = document.getElementById("game-root");
  if (!gameRoot) throw new Error("#game-root missing");
  gameRoot.replaceWith(root);
  return root;
}
function find(selector) {
  return document.querySelector(selector);
}
function createShell() {
  const root = document.createElement("div");
  root.id = "game-container";
  root.innerHTML = `
    <div id="status-bar">
      <span id="s-day"><span class="stat-label">Day </span><span class="stat-value">1</span></span>
      <span id="s-month" class="stat-label">June 15</span>
      <span id="s-season" class="stat-label">Summer</span>
      <span id="s-segment" class="segment-progress">Fort Garry \u2014 begin your journey</span>
      <span id="s-food"><span class="stat-label">Food </span><span class="stat-value">30</span></span>
      <span id="s-wear"><span class="stat-label">Wear </span><span class="stat-value">0</span></span>
      <span id="s-crew"><span class="stat-label">Crew </span><span class="stat-value">Rested</span></span>
    </div>
    <div id="map-panel">
      <div id="map"></div>
    </div>
    <div id="bottom-panel">
      <div id="narrative"></div>
      <div id="controls">
        <button class="ctrl-btn" id="btn-travel">Travel</button>
        <button class="ctrl-btn" id="btn-camp">Make Camp</button>
        <button class="ctrl-btn" id="btn-cart">Cart</button>
        <button class="ctrl-btn" id="btn-crew">Crew</button>
      </div>
    </div>
    <div id="intro-overlay" class="overlay active">
      <div class="overlay-card intro-card">
        <h1>M\xE9tis Trail</h1>
        <p class="scene-text">Fort Garry, June 1878. Load your cart. Choose your crew. Head west.</p>
        <button class="start-btn" id="intro-start">Begin Journey</button>
      </div>
    </div>
    <div id="event-overlay" class="overlay"></div>
    <div id="settlement-overlay" class="overlay"></div>
    <div id="end-overlay" class="overlay"></div>
  `;
  applyTheme(root);
  return { root };
}

// src/ui/renderer.js
function renderStatusBar(state) {
  const node = NODES[state.node];
  const next = NODES[state.node + 1];
  const dayEl = document.getElementById("s-day");
  const monthEl = document.getElementById("s-month");
  const seasonEl = document.getElementById("s-season");
  const segEl = document.getElementById("s-segment");
  const foodEl = document.getElementById("s-food");
  const wearEl = document.getElementById("s-wear");
  const crewEl = document.getElementById("s-crew");
  dayEl.innerHTML = `<span class="stat-label">Day </span><span class="stat-value">${state.day}</span>`;
  monthEl.textContent = `${state.month}/${state.date?.day ?? state.day}`;
  seasonEl.textContent = state.season.replace("_", " ");
  if (state.pendingSettlement) {
    segEl.textContent = `${node.name} \u2014 you have arrived`;
  } else if (next) {
    segEl.textContent = `${node.name} \u2192 ${next.name}`;
  } else {
    segEl.textContent = node.name;
  }
  foodEl.innerHTML = `<span class="stat-label">Food </span><span class="stat-value${state.food <= 5 ? " food-low" : ""}">${state.food}</span>`;
  wearEl.innerHTML = `<span class="stat-label">Wear </span><span class="stat-value${state.wear >= 4 ? " wear-high" : ""}">${state.wear}</span>`;
  crewEl.innerHTML = `<span class="stat-label">Crew </span><span class="stat-value">${state.crew}</span>`;
}
function renderNarrative(lines) {
  const el = document.getElementById("narrative");
  el.innerHTML = lines.map((t) => `<div class="scene-text">${t}</div>`).join("");
  el.scrollTop = el.scrollHeight;
}

// src/ui/persistence.js
var STORAGE_KEY = "metis-trail-v2.save";
function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}

// src/main.js
function bootstrap(seed = null) {
  const game = createGame(seed);
  window._metisGame = game;
  window.__METIS_READY__ = true;
  window.__METIS_DEBUG__ = {
    get state() {
      return game.getState();
    },
    get cart() {
      return game.getCart();
    },
    get crew() {
      return game.getCrew();
    },
    get node() {
      return game.getCurrentNode();
    },
    travel: () => game.travelOneDay(),
    camp: () => game.makeCamp(),
    choose: (i) => game.chooseEventChoice(i),
    reroll: (s) => {
      const g = createGame(s);
      window._metisGame = g;
      render();
    }
  };
  mount();
  const state = game.getState();
  renderStatusBar(state);
  renderNarrative(["Welcome to the M\xE9tis Trail. Click Begin Journey to start."]);
  find("#intro-start").onclick = () => {
    find("#intro-overlay")?.classList.remove("active");
    render();
  };
  find("#btn-travel").onclick = () => {
    const { pendingEvent, pendingSettlement, over } = game.getState();
    if (pendingEvent || pendingSettlement || over) return;
    game.travelOneDay();
    render();
  };
  find("#btn-camp").onclick = () => {
    game.makeCamp();
    render();
  };
  find("#btn-cart").onclick = () => showCart(game);
  find("#btn-crew").onclick = () => showCrew(game);
  find("#event-continue").onclick = () => {
    find("#event-overlay")?.classList.remove("active");
  };
  find("#settlement-continue").onclick = () => {
    game.settlementAction("continue");
    find("#settlement-overlay")?.classList.remove("active");
    render();
  };
  find("#settlement-close").onclick = () => {
    find("#settlement-overlay")?.classList.remove("active");
  };
  find("#cart-close-btn").onclick = () => find("#cart-overlay")?.classList.remove("active");
  find("#cart-close-btn-2").onclick = () => find("#cart-overlay")?.classList.remove("active");
  find("#crew-close-btn").onclick = () => find("#crew-overlay")?.classList.remove("active");
  find("#crew-close-btn-2").onclick = () => find("#crew-overlay")?.classList.remove("active");
  find("#end-restart").onclick = () => {
    clearSave();
    window.location.reload();
  };
  render();
}
window.__METIS_BOOT__ = bootstrap;
function render() {
  const game = window._metisGame;
  if (!game) return;
  const state = game.getState();
  renderStatusBar(state);
  if (state.over) {
    showEnd(game);
    return;
  }
  if (state.pendingEvent) {
    showEvent(game);
    return;
  }
  if (state.pendingSettlement) {
    showSettlement(game);
    return;
  }
  hideOverlays();
}
function hideOverlays() {
  ["event-overlay", "settlement-overlay", "cart-overlay", "crew-overlay"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
}
function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const textEl = document.getElementById("event-text");
  const choicesEl = document.getElementById("event-choices");
  const continueEl = document.getElementById("event-continue");
  if (!textEl || !choicesEl) return;
  textEl.textContent = ev.text;
  choicesEl.innerHTML = "";
  continueEl.style.display = "none";
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = ch.text;
    btn.onclick = () => {
      game.chooseEventChoice(i);
      render();
    };
    choicesEl.appendChild(btn);
  });
  document.getElementById("event-overlay")?.classList.add("active");
}
function showSettlement(game) {
  const state = game.getState();
  const next = game.getCurrentNode();
  const nameEl = document.getElementById("settlement-name");
  const descEl = document.getElementById("settlement-desc");
  const actionsEl = document.getElementById("settlement-actions");
  if (!nameEl || !descEl || !actionsEl) return;
  nameEl.textContent = next.name;
  descEl.textContent = next.desc;
  actionsEl.innerHTML = "";
  const available = game.getAvailableActions();
  (available.actions || []).forEach((action) => {
    const btn = document.createElement("button");
    btn.className = "ctrl-btn";
    btn.textContent = actionLabel(action);
    btn.onclick = () => {
      hideOverlays();
      game.settlementAction(action);
      render();
    };
    actionsEl.appendChild(btn);
  });
  document.getElementById("settlement-overlay")?.classList.add("active");
}
function showCart(game) {
  const cart = game.getCart();
  const listEl = document.getElementById("inv-list");
  if (!listEl) return;
  listEl.innerHTML = cart.map((i) => `<div>${i.icon || ""} ${i.name} \xD7${i.count} (${i.wt * i.count} kg)</div>`).join("");
  document.getElementById("cart-overlay")?.classList.add("active");
}
function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById("crew-status");
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById("crew-overlay")?.classList.add("active");
}
function showEnd(game) {
  const state = game.getState();
  const titleEl = document.getElementById("end-title");
  const narrativeEl = document.getElementById("end-narrative");
  const statsEl = document.getElementById("end-stats");
  if (!titleEl || !narrativeEl || !statsEl) return;
  titleEl.textContent = state.won ? "You Made It!" : "Journey Over";
  narrativeEl.textContent = state.won ? `You reached Fort Edmonton on day ${state.day}. Your cart held, the crew survived, and the trade goods arrived.` : `Your journey ends on day ${state.day} on the Carlton Trail.`;
  statsEl.innerHTML = `
    <div class="stat-row"><span class="label">Days</span><span>${state.day}</span></div>
    <div class="stat-row"><span class="label">Score</span><span>${state.score}</span></div>
    <div class="score-row">Score</div>
  `;
  document.getElementById("end-overlay")?.classList.add("active");
}
function actionLabel(a) {
  const map = { rest: "Rest", trade: "Trade", repair: "Repair", grease: "Grease", forage: "Forage", recruit: "Recruit", rumours: "Gossip", heal: "Heal", continue: "Continue West" };
  return map[a] || a;
}
export {
  bootstrap
};

if (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }