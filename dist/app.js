var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/core/constants.js
var CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 8,
  DAILY_FOOD: 0.65,
  // Base food consumed per travel day (was 0.6 - tightened for balance)
  CAMP_BASE_FOOD: 0.5,
  // Base food cost per camp night (for 2 actions) (was 1.0)
  EVENT_CHANCE: 0.45,
  DAYS_PER_WEEK: 7,
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
  // Phase 0.4 — Hunting yields per terrain (configurable)
  HUNT_YIELDS: {
    plains: {
      foodMin: 3,
      foodMax: 5,
      // increased from 2-4
      common: { name: "Bison Hide", wt: 6, icon: "\u{1F9AC}", desc: "A heavy bison hide from the open prairie." },
      rare: { name: "Prime Bison Hide", wt: 10, icon: "\u{1F9AC}", desc: "A massive prime bison hide \u2014 worth triple at market." }
    },
    river_valley: {
      foodMin: 2,
      foodMax: 4,
      // increased from 1-3
      common: { name: "Beaver Pelt", wt: 4, icon: "\u{1F9AB}", desc: "A fine beaver pelt from the river valley." },
      rare: { name: "Prime Beaver Pelt", wt: 5, icon: "\u{1F9AB}", desc: "A prime winter beaver pelt \u2014 exceptionally thick." }
    },
    wooded: {
      foodMin: 2,
      foodMax: 3,
      // increased from 1-2
      common: { name: "Wolf Pelt", wt: 3, icon: "\u{1F43A}", desc: "A grey wolf pelt from the wooded trail." },
      rare: { name: "Prime Wolf Pelt", wt: 4, icon: "\u{1F43A}", desc: "A prime wolf pelt, thick and unblemished." }
    },
    uplands: {
      foodMin: 2,
      foodMax: 3,
      // increased from 1-2
      common: { name: "Elk Hide", wt: 6, icon: "\u{1F98C}", desc: "A sturdy elk hide from the uplands." },
      rare: { name: "Prime Elk Hide", wt: 9, icon: "\u{1F98C}", desc: "A prime elk hide \u2014 massive and worth triple at market." }
    }
  },
  HUNT_RARITY_WEIGHTS: { food: 0.7, common: 0.25, rare: 0.05 },
  WEATHER_STATES: ["clear", "overcast", "rain", "storm", "snow"],
  SEASON_BASE_WEATHER: {
    summer: { clear: 45, overcast: 25, rain: 20, storm: 10, snow: 0 },
    autumn: { clear: 30, overcast: 30, rain: 20, storm: 10, snow: 10 },
    "early winter": { clear: 15, overcast: 20, rain: 15, storm: 10, snow: 40 }
  },
  WEATHER_TRANSITION: {
    clear: { clear: 55, overcast: 30, rain: 10, storm: 5, snow: 0 },
    overcast: { clear: 20, overcast: 40, rain: 25, storm: 10, snow: 5 },
    rain: { clear: 10, overcast: 25, rain: 40, storm: 20, snow: 5 },
    storm: { clear: 5, overcast: 20, rain: 35, storm: 30, snow: 10 },
    snow: { clear: 0, overcast: 10, rain: 15, storm: 5, snow: 70 }
  },
  WEATHER_WEAR_MULT: { clear: 1, overcast: 1, rain: 1.25, storm: 1.5, snow: 1.4 },
  WEATHER_FOOD_MOD: { clear: 0, overcast: 0, rain: 0.3, storm: 0.5, snow: 0.5 },
  WEATHER_MORALE_MOD: { clear: 0, overcast: -1, rain: -2, storm: -4, snow: -3 },
  WEATHER_EVENT_MOD: { clear: 0, overcast: 0, rain: 0.1, storm: 0.15, snow: 0.1 },
  WEATHER_CAMP_MORALE: { clear: 15, overcast: 15, rain: 10, storm: 5, snow: 5 },
  WEATHER_LABELS: { clear: "Clear", overcast: "Overcast", rain: "Rain", storm: "Storm", snow: "Snow" },
  // Weight & travel physics
  CART_CAPACITY: 100,
  WEIGHT_TRAVEL_MULT: 0.5,
  // weightRatio * 0.5 = extra days per base day
  WEIGHT_WEAR_MULT: 0.5,
  // weightRatio * 0.5 = extra wear chance
  // Phase 0.5 — Settlement Barter (pure barter, no MB currency)
  // Each settlement type has unique exchange rates: { give: [{item, count}], receive: [{item, count}] }
  SETTLEMENT_BARTER: {
    hbc: {
      // Trade furs for food at Company rates (6 food per pelt, was 5)
      trade_furs_food: {
        give: [{ name: "any_fur", count: 1 }],
        // any trade/category:furs item
        receive: [{ name: "Pemmican Rations", count: 6 }],
        flavor: "The Company factor weighs your furs in silence. The ledger decides: pemmican or powder?"
      },
      // Trade furs for supplies
      trade_furs_supplies: {
        give: [{ name: "any_fur", count: 1 }],
        options: [
          { id: "ammunition", receive: [{ name: "Ammunition Belt", count: 2 }], flavor: "Pemmican, axes, shaganappi, tools \u2014 everything a carter needs for the long trail." },
          { id: "shaganappi", receive: [{ name: "Shaganappi", count: 3 }], flavor: "Rawhide strips. Binding, lashing, and cart repair." },
          { id: "medicine", receive: [{ name: "Medicine Pouch", count: 1 }], flavor: "Herbal remedies and bandages." }
        ],
        flavor: "The Company store has what you need \u2014 at Company prices."
      },
      // Rest costs food
      rest: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 15 }],
        flavor: "A warm fire in the mess hall, dry blankets, and a night without the wind."
      }
    },
    metis: {
      // Rest - costs 1 food
      rest: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 10 }],
        flavor: "A warm fire and a place by the hearth. The M\xE9tis camp is generous to travellers."
      },
      // Trade gossip - free, gives intel
      trade_gossip: {
        give: [],
        receive: [{ name: "trail_intel", count: 1 }, { name: "Morale", count: 3 }],
        flavor: "News travels faster than carts on the prairie. The women know everything.",
        desc: "Trail Intel reveals the terrain and conditions ahead for the next trail segment. Intel is most useful when fresh \u2014 it fades after a few days."
      },
      // Dance - costs 1 food, big morale boost
      dance: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "Morale", count: 15 }],
        flavor: "The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow."
      },
      // Share food - give food, get morale + reputation
      share_food: {
        give: [{ name: "Pemmican Rations", count: 2 }],
        // minimum 2
        receive: [{ name: "Morale", count: 10 }, { name: "ReputationMetis", count: 1 }],
        flavor: "Generosity on the trail is its own currency. What you give returns in loyalty."
      },
      // Trade furs for food at better rates (7 food per pelt, was 6)
      trade_furs_food: {
        give: [{ name: "any_fur", count: 1 }],
        receive: [{ name: "Pemmican Rations", count: 7 }],
        flavor: "The M\xE9tis traders know the prairie. Their prices are fair and the pemmican is rich."
      }
    },
    nwmp: {
      // Buy ammo - trade 1 fur for 2 ammo belts
      buy_ammo: {
        give: [{ name: "any_fur", count: 1 }],
        receive: [{ name: "Ammunition Belt", count: 2 }],
        flavor: "Ball and powder, measured honest. The Mounties don't cheat a carter on shot."
      },
      // Rest - costs 1 food, no morale bonus
      rest: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "rested", count: 1 }],
        flavor: "A cot in the barracks. Clean, quiet, and the sentry paces all night."
      }
    },
    mission: {
      // Plain rest - costs 1 food
      rest: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 8 }],
        flavor: "A quiet room in the mission house. Simple food, plain beds, and the sound of evening prayer."
      },
      // Heal crew - 1 Medicine Pouch (preferred)
      heal_crew: {
        giveOptions: [
          { give: [{ name: "Medicine Pouch", count: 1 }], receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 10 }] },
          { give: [{ name: "Pemmican Rations", count: 2 }], receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 10 }] }
        ],
        flavor: "The Grey Nuns tend the sick without asking who you are or where you come from."
      },
      // Free rest + blessing
      rest_blessing: {
        give: [],
        receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 15 }, { name: "blessingDays", count: 3 }],
        flavor: "A chapel bell at evening. You sleep on straw but wake with a lighter spirit."
      },
      // Trade furs for food at charity rates (4 food per pelt, was 3)
      trade_furs_food: {
        give: [{ name: "any_fur", count: 1 }],
        receive: [{ name: "Pemmican Rations", count: 4 }],
        flavor: "The mission garden feeds the body. The trade feeds the journey."
      }
    },
    trading: {
      // Trade furs for food at best rates (10 food per pelt, was 8)
      trade_furs_food: {
        give: [{ name: "any_fur", count: 1 }],
        receive: [{ name: "Pemmican Rations", count: 10 }],
        flavor: "A free trader with no Company badge. His prices are his own."
      },
      // Trade furs for supplies
      trade_furs_supplies: {
        give: [{ name: "any_fur", count: 1 }],
        options: [
          { id: "ammunition", receive: [{ name: "Ammunition Belt", count: 2 }], flavor: "What the Company posts run out of, the free traders sometimes have." },
          { id: "shaganappi", receive: [{ name: "Shaganappi", count: 3 }], flavor: "Rawhide strips. Binding, lashing, and cart repair." },
          { id: "medicine", receive: [{ name: "Medicine Pouch", count: 1 }], flavor: "Herbal remedies and bandages." }
        ],
        flavor: "What the Company posts run out of, the free traders sometimes have."
      },
      // Rest - costs 1 food
      rest: {
        give: [{ name: "Pemmican Rations", count: 1 }],
        receive: [{ name: "rested", count: 1 }, { name: "Morale", count: 10 }],
        flavor: "A lean-to by the fire. Simple shelter, honest company."
      }
    }
  }
});
function crewMod(state) {
  return CONSTANTS.CREW_MOD[state.crew] ?? 0;
}
__name(crewMod, "crewMod");
function wearMod(wear) {
  return CONSTANTS.WEAR_MOD[wear] ?? -5;
}
__name(wearMod, "wearMod");

// src/core/calendar.js
var DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeap(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
__name(isLeap, "isLeap");
function daysInMonth(month, year) {
  if (month === 2 && isLeap(year)) return 29;
  return DAYS_IN_MONTH[month];
}
__name(daysInMonth, "daysInMonth");
function seasonFor(month) {
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10].includes(month)) return "autumn";
  return "early winter";
}
__name(seasonFor, "seasonFor");
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
__name(advanceDate, "advanceDate");

// src/core/seed.js
function makeRNG(seed) {
  if (seed == null) return null;
  let s = seed | 0;
  return /* @__PURE__ */ __name(function prng() {
    s |= 0;
    s = s + 1831565813 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }, "prng");
}
__name(makeRNG, "makeRNG");
function d20(rand) {
  return Math.floor(rand() * 20) + 1;
}
__name(d20, "d20");

// src/data/nodes.js
var NODES = [
  {
    id: "fort_garry",
    name: "Fort Garry",
    art: "settlements/fort_garry.png",
    lat: 49.89,
    lon: -97.14,
    type: "hbc",
    settlementType: "hbc",
    settlementName: "Fort Garry",
    settlementDescription: "The Red River Settlement. HBC headquarters. The palisade walls rise from the mud \u2014 your journey begins here, where the Assiniboine meets the Red. Families load their carts for the long trail west.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 0,
    desc: "The Red River Settlement. HBC headquarters. The palisade walls rise from the mud \u2014 your journey begins here, where the Assiniboine meets the Red. Families load their carts for the long trail west.",
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
    art: "settlements/st_boniface.png",
    lat: 49.88,
    lon: -97.11,
    type: "mission",
    settlementType: "mission",
    settlementName: "St. Boniface Mission",
    settlementDescription: "Cathedral spires above the river landing. The Grey Nuns offer healing to all travellers. Free pottage and prayers.",
    priceMultiplier: { buy: 0.8, sell: 1.5, categories: { furs: { buy: 0.8, sell: 1.5 }, provisions: { buy: 0.7, sell: 1.3 }, repair: { buy: 1, sell: 1 }, medical: { buy: 0.8, sell: 1.2 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 1,
    desc: "Cathedral spires above the river landing. The Grey Nuns offer healing to all travellers. Free pottage and prayers.",
    source: {
      quote: "The Grey Nuns of St. Boniface gave their nursing freely to all who came, whatever their origin or creed.",
      author: "Sister Youville",
      work: "Grey Nuns of the Red River Mission, 1844-1866",
      year: 1866,
      url: "https://www.mhs.mb.ca/docs/people/grey_nuns.shtml"
    }
  },
  {
    id: "st_norbert",
    name: "St. Norbert",
    art: "settlements/st_norbert.png",
    lat: 49.77,
    lon: -97.15,
    type: "metis",
    settlementType: "metis",
    settlementName: "St. Norbert M\xE9tis Parish",
    settlementDescription: "A M\xE9tis parish straddling the ox-cart trail. Smoke rises from the churchyard. Families welcome you with bannock and Saskatoon preserve. The women here are known for their flower beadwork.",
    priceMultiplier: { buy: 0.9, sell: 1.1, categories: { furs: { buy: 0.9, sell: 1.1 }, provisions: { buy: 0.95, sell: 1.05 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 1,
    desc: "A M\xE9tis parish straddling the ox-cart trail. Smoke rises from the churchyard. Families welcome you with bannock and Saskatoon preserve. The women here are known for their flower beadwork.",
    source: {
      quote: "St. Norbert was the home of many M\xE9tis families who made their living from the buffalo hunt and the freight trade.",
      author: "MMF Research",
      work: "M\xE9tis Communities along the Carlton Trail",
      url: "https://www.metismuseum.ca"
    }
  },
  {
    id: "st_francois_xavier",
    name: "St. Fran\xE7ois Xavier",
    art: "settlements/st_francois_xavier.png",
    lat: 49.92,
    lon: -97.55,
    type: "metis",
    settlementType: "metis",
    settlementName: "St. Fran\xE7ois Xavier",
    settlementDescription: "Long lots stretching back from the river. Well-known ford across the Assiniboine. The M\xE9tis here remember the Sayer trial \u2014 free trade is their pride.",
    priceMultiplier: { buy: 0.9, sell: 1.1, categories: { furs: { buy: 0.9, sell: 1.1 }, provisions: { buy: 0.95, sell: 1.05 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
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
    art: "settlements/portage_la_prairie.png",
    lat: 49.97,
    lon: -98.29,
    type: "trading",
    settlementType: "trading",
    settlementName: "Portage la Prairie Trading Post",
    settlementDescription: "Trading post at the old lake crossing. Full barter available. The HBC fort is decaying \u2014 the wood is grey, the palisade leaning \u2014 but trade continues.",
    priceMultiplier: { buy: 1.1, sell: 0.9, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.1, sell: 0.9 }, repair: { buy: 1.1, sell: 0.9 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 2,
    desc: "Trading post at the old lake crossing. Full barter available. The HBC fort is decaying \u2014 the wood is grey, the palisade leaning \u2014 but trade continues.",
    source: {
      quote: "Portage la Prairie was an important stopping point on the Carlton Trail, where carts were repaired and provisions taken.",
      author: "Antoine Blanc",
      work: "The Carlton Trail",
      year: 1959,
      url: "https://archive.org/stream/P000411/P000411_djvu.txt"
    }
  },
  {
    id: "fort_ellice",
    name: "Fort Ellice",
    art: "settlements/fort_ellice.png",
    lat: 50.4,
    lon: -101.3,
    type: "hbc",
    settlementType: "hbc",
    settlementName: "Fort Ellice",
    settlementDescription: "Midpoint resupply where the Assiniboine meets the Qu'Appelle. The trail splits here \u2014 south to Qu'Appelle, west to the Touchwood Hills.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
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
    art: "settlements/fort_quappelle.png",
    lat: 50.55,
    lon: -103.85,
    type: "nwmp",
    settlementType: "nwmp",
    settlementName: "Fort Qu'Appelle NWMP Post",
    settlementDescription: "NWMP post. The red coats scrutinize every cart and cargo. Papers are checked. Duty collected. You keep your gaze steady.",
    priceMultiplier: { buy: 1.2, sell: 0.8, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.2, sell: 0.8 }, repair: { buy: 1.2, sell: 0.8 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 0.8, sell: 1.2 } } },
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
    art: "settlements/touchwood_hills.png",
    lat: 51.2,
    lon: -104.2,
    type: "trading",
    settlementType: "trading",
    settlementName: "Touchwood Hills Trading Post",
    settlementDescription: "The last trees for a hundred miles. A Cree trader speaks Michif and knows the northern route. Elm and poplar break the prairie monotony.",
    priceMultiplier: { buy: 1.1, sell: 0.9, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.1, sell: 0.9 }, repair: { buy: 1.1, sell: 0.9 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "wooded",
    dist: 3,
    desc: "The last trees for a hundred miles. A Cree trader speaks Michif and knows the northern route. Elm and poplar break the prairie monotony.",
    source: {
      quote: "The Touchwood Hills marked the edge of the prairie plains and a final place to gather fuel and game before the northern stretch.",
      author: "MMF Research",
      work: "M\xE9tis Communities along the Carlton Trail",
      url: "https://www.metismuseum.ca"
    }
  },
  {
    id: "humboldt",
    name: "Humboldt Mission",
    art: "settlements/humboldt_mission.png",
    lat: 52.2,
    lon: -105.12,
    type: "mission",
    settlementType: "mission",
    settlementName: "Humboldt Mission",
    settlementDescription: "Only reliable healing for a lonely stretch of prairie. The mission garden grows against all odds. A welcome sight.",
    priceMultiplier: { buy: 0.8, sell: 1.5, categories: { furs: { buy: 0.8, sell: 1.5 }, provisions: { buy: 0.7, sell: 1.3 }, repair: { buy: 1, sell: 1 }, medical: { buy: 0.8, sell: 1.2 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "plains",
    dist: 3,
    desc: "Only reliable healing for a lonely stretch of prairie. The mission garden grows against all odds. A welcome sight.",
    source: {
      quote: "St. John Baptist mission at Humboldt provided a rare fixed hospital for travellers crossing the open plains.",
      author: "Missionary records, St. John Baptist",
      work: "Diocesan Archives, early Red River settlements",
      year: 1870
    }
  },
  {
    id: "batoche",
    name: "Batoche",
    art: "settlements/batoche.png",
    lat: 52.75,
    lon: -106.1,
    type: "metis",
    settlementType: "metis",
    settlementName: "Batoche",
    settlementDescription: "Spiritual centre of the Saskatchewan M\xE9tis. The church bell rings across the river valley. The river-lot farms are prosperous, but Ottawa's surveyors have been making promises they don't keep.",
    priceMultiplier: { buy: 0.9, sell: 1.1, categories: { furs: { buy: 0.9, sell: 1.1 }, provisions: { buy: 0.95, sell: 1.05 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 2,
    desc: "Spiritual centre of the Saskatchewan M\xE9tis. The church bell rings across the river valley. The river-lot farms are prosperous, but Ottawa's surveyors have been making promises they don't keep.",
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
    art: "settlements/gabriels_crossing.png",
    lat: 52.7,
    lon: -105.75,
    type: "river",
    settlementType: "river",
    settlementName: "Gabriel's Crossing",
    settlementDescription: "Gabriel Dumont operates the ferry across the South Saskatchewan. His fee is fair. The current is deceptive \u2014 do not try to ford it.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
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
    art: "settlements/fort_carlton.png",
    lat: 52.8,
    lon: -106.5,
    type: "hbc",
    settlementType: "hbc",
    settlementName: "Fort Carlton",
    settlementDescription: "Major HBC depot on the North Saskatchewan. Full trade, full repair. The pemmican stores are declining \u2014 the Company feels the pressure.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
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
    art: "settlements/fort_pitt.png",
    lat: 53.65,
    lon: -109.75,
    type: "hbc",
    settlementType: "hbc",
    settlementName: "Fort Pitt",
    settlementDescription: "Edge of the boreal forest. Small, isolated. The last HBC post before Edmonton. Pine and spruce replace poplar.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    terrain: "river_valley",
    dist: 4,
    desc: "Edge of the boreal forest. Small, isolated. The last HBC post before Edmonton. Pine and spruce replace poplar.",
    source: {
      quote: "Fort Pitt... established on the North Saskatchewan, the last major post before the ascent to Edmonton.",
      author: "HBC Archives",
      work: "Fort Pitt Post Journal, 1874-1879",
      url: "https://www.metismuseum.ca",
      year: 1879
    }
  },
  {
    id: "fort_edmonton",
    name: "Fort Edmonton",
    art: "settlements/fort_edmonton.png",
    lat: 53.54,
    lon: -113.5,
    type: "hbc",
    settlementType: "hbc",
    settlementName: "Fort Edmonton",
    settlementDescription: "Western terminus. Gateway to the Athabasca. The palisade walls of Fort Edmonton rise from the riverbank. The end of the Carlton Trail.",
    priceMultiplier: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
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
    wt: 2.5,
    count: 7,
    type: "food",
    category: "provisions",
    perishable: true,
    desc: "Dried meat and fat. The staple of the prairie. Never truly spoils.",
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
    wt: 15,
    count: 1,
    type: "repair",
    category: "parts",
    perishable: false,
    desc: "Hard maple. Heavy but essential for a Red River cart."
  },
  {
    name: "Shaganappi",
    wt: 3,
    count: 3,
    type: "repair",
    category: "repair",
    perishable: false,
    desc: "Rawhide strips. Binding, lashing, and cart repair.",
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
    wt: 8,
    count: 1,
    type: "tool",
    category: "parts",
    perishable: false,
    desc: "Axe, auger, drawknife. Required for major repairs."
  },
  {
    name: "Bison Hide",
    wt: 6,
    count: 4,
    type: "trade",
    category: "furs",
    perishable: false,
    mbValue: 6,
    desc: "Folded. Trade value at any post."
  },
  {
    name: "Canvas Tarp",
    wt: 4,
    count: 2,
    type: "shelter",
    category: "shelter",
    perishable: false,
    desc: "Waterproof. Shelter and cart-raft conversion."
  },
  {
    name: "Firewood Bundle",
    wt: 6,
    count: 1,
    type: "fuel",
    category: "fuel",
    perishable: false,
    desc: "Dried poplar. Required for cold nights."
  },
  {
    name: "Rope (50ft)",
    wt: 3,
    count: 1,
    type: "tool",
    category: "parts",
    perishable: false,
    desc: "Hemp. Crossings, repairs, binding."
  },
  {
    name: "Ammunition Belt",
    wt: 2,
    count: 1,
    type: "ammo",
    category: "hunting",
    perishable: false,
    desc: "Shot and ball. For hunting and defence."
  },
  {
    name: "Medicine Pouch",
    wt: 1.5,
    count: 1,
    type: "medical",
    category: "medical",
    perishable: true,
    desc: "Herbal remedies and bandages."
  },
  {
    name: "Blanket",
    wt: 3,
    count: 2,
    type: "shelter",
    category: "shelter",
    perishable: false,
    desc: "Wool. Winter survival."
  },
  {
    name: "Beaver Pelts",
    wt: 4,
    count: 3,
    type: "trade",
    category: "furs",
    perishable: false,
    mbValue: 10,
    desc: "Prime bundle. The foundation of the northern trade.",
    source: {
      quote: "Beaver... the very foundation of the northern trade.",
      author: "HBC Archives",
      work: "Fort Edmonton Post Journal, 1878",
      url: "https://archive.org/stream/P000279/P000279_djvu.txt"
    }
  }
];
function startingCart() {
  return [
    { name: "Bison Hide", wt: 6, count: 4, type: "trade", category: "furs", perishable: false, mbValue: 6, desc: "Folded. Trade value at any post." },
    { name: "Beaver Pelts", wt: 4, count: 3, type: "trade", category: "furs", perishable: false, mbValue: 10, desc: "Prime bundle. The foundation of the northern trade." }
  ];
}
__name(startingCart, "startingCart");
function totalWeight(cart) {
  return cart.reduce((s, i) => s + i.wt * i.count, 0);
}
__name(totalWeight, "totalWeight");

// src/data/sources/index.js
var SOURCES = {
  SAWYER_TRIAL: {
    quote: `"I have broken no law. I have only traded with my own people." \u2014 Pierre Guillaume Sayer, upon his arrest at the Red River Settlement, 1849. The jury found him guilty but the judge imposed no penalty, and the crowd outside the courthouse cheered. The HBC's monopoly on trade was broken that day.`,
    author: "court transcript, Red River Settlement",
    work: "as cited in Manitoba Historical Society Transactions",
    year: 1849,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/pageant/01/sayertrial.shtml"
  },
  DUMONT_ACCOUNTS: {
    quote: `"Gabriel Dumont, the ferryman at the South Saskatchewan, charged one dollar per cart and no man complained, for he knew the river better than any man living and his crossing was safe." \u2014 a freighter's account, c. 1875.`,
    author: "anonymous freighter",
    work: "cited in Dumont family oral histories",
    year: 1875,
    type: "secondary",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  MACLEOD_NWMP: {
    quote: '"The establishment of the Mounted Police at Fort Macleod and along the western trails has had a marked effect upon the traffic. Duties are now collected on all goods passing through, and every cart is subject to inspection \u2014 a regulation which the free traders do not always relish."',
    author: "R. C. Macleod",
    work: "The North-West Mounted Police and Law Enforcement, 1873\u20131905",
    year: 1976,
    type: "secondary"
  },
  GOULET_HUNT: {
    quote: '"The hunt was the great event of the year. When the signal was given, four hundred mounted men rode out in a line across the prairie. The earth shook beneath them. The women and children followed behind with the carts to bring in the meat." \u2014 as described in M\xE9tis oral tradition.',
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    type: "secondary",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  BREHAUT_CART: {
    quote: '"The Red River cart is a remarkable vehicle. It is built entirely of wood and rawhide \u2014 no iron whatsoever. When loaded it gave forth a blood-curdling squeal which could be heard for miles, caused by the friction of the dry wooden hub turning on the axle. Grease was applied, but the squeal returned within a mile."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: The Origins and Construction of an Iconic Vehicle",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  BREHAUT_TRAILS: {
    quote: '"The wheels of the Red River carts, moving in the same track year after year, gradually wore two deep ruts into the prairie. These ruts became the trails \u2014 visible for miles across the flat grassland, and followed by every traveller who came after."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: The Origins and Construction of an Iconic Vehicle",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  FONSECA_MOSQUITOES: {
    quote: "Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud, the cart trains made their way westward.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_FORD: {
    quote: "The carts had indeed entered straight into the water, the oxen swimming, and the drivers, standing on the cart-tails, holding their feet as high as possible out of the water, and with long poles guiding the oxen.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_RAFT: {
    quote: "Four cart wheels were taken and placed dish upwards on the surface of the water. The boat was launched, and floated like a duck.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_BANK: {
    quote: "A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank. The cart was then lowered carefully down the steep bank to the water.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_CAMP: {
    quote: "Pemmican cooked in a frying-pan, a little grease, pepper, salt, with a trace of onions and potatoes added, constituted this, a dish to set before a king.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_DANCE: {
    quote: "The Red River jig was struck up, and one after another exercised himself to his heart's content. The fiddles were going from dusk till dawn.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  FONSECA_OX_SCATTER: {
    quote: "To drive the refractory animals among the carts was a last resort. The oxen had scattered after drinking, and the mid-day camp was a chaos of traces and running hooves.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  SCHULTZ_STUMPS: {
    quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees. The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  SCHULTZ_BURNT: {
    quote: "Bichon, the patient, would do his best and, failing, would lie down in the one. The prairie here has been burnt black. No grass, no water, and the sun is relentless.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  SCHULTZ_RATTLESNAKE: {
    quote: "Rattlesnakes were common on the southern stretches of the trail and caused many a nervous night.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  LACOMBE_FIRE: {
    quote: "The prairie burned every afternoon. The oxen grew restless in the smoke, and the horizon glowed red long after sunset.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  LACOMBE_HAIL: {
    quote: "Sudden storms of hail and sleet were not uncommon on the open prairie in late spring. The sky turns green and the air goes still, and then the hail comes \u2014 stones the size of walnuts.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  LACOMBE_BEAR: {
    quote: "The bears along the Carlton were a constant threat to unprotected provisions. A cinnamon bear rooting through the bread sack at dawn was a sight that needed no introduction.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878
  },
  BARKWELL_BRIGADE: {
    quote: `"The Portage La Loche Brigade was one of the great institutions of the North-West. Every spring, the brigade set out from Red River with the mail and supplies, traversing four thousand miles in four months \u2014 by river, portage, and trail \u2014 to the posts of the Athabasca and the Mackenzie. The guide's pay for the whole journey was thirty-five pounds."`,
    author: "Lawrence Barkwell",
    work: "Portage La Loche Brigade: The Great Northern Supply Line",
    year: 2005,
    type: "secondary",
    url: "https://www.louisrielinstitute.com/"
  },
  MMF_COMMUNITIES: {
    quote: '"The M\xE9tis settlements along the Carlton Trail \u2014 St. Fran\xE7ois Xavier, St. Laurent, Batoche \u2014 were communities bound by kinship, the French tongue, and the Catholic faith. The church bell rang across the river valley on Sunday morning, and every family within earshot came to Mass." \u2014 from the historical record of M\xE9tis river-lot communities.',
    author: "MMF Historical Research Centre",
    work: "M\xE9tis Communities along the Carlton Trail",
    year: 2020,
    type: "secondary",
    url: "https://www.metismuseum.ca"
  },
  GREY_NUNS: {
    quote: "The Grey Nuns of St. Boniface gave their nursing freely to all who came, whatever their origin or creed. Their pottage and prayers were offered without condition.",
    author: "Sister Youville",
    work: "Grey Nuns of the Red River Mission, 1844-1866",
    year: 1866,
    url: "https://www.mhs.mb.ca/docs/people/grey_nuns.shtml"
  },
  HBC_JOURNAL: {
    quote: "Pemmican stores declining. The Company feels the pressure of the free traders. The old barter economy still turns, but the margins grow thinner with each season.",
    author: "HBC Fort Edmonton Post Journal",
    work: "Archives of Manitoba",
    year: 1878,
    url: "https://archive.org/stream/P000279/P000279_djvu.txt"
  },
  SCHULTZ_FROST: {
    quote: "The temperature dropped after sunset. By morning, a thin crust of ice covered the water barrels and the oxen's breath rose in white plumes. The ground was too hard to drive tent pegs, and the firewood burned faster than planned.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  MMF_TRAIL_JUSTICE: {
    quote: '"Among the M\xE9tis, disputes on the trail were settled by the camp overseer and the community. Theft was rare but not unknown, and when goods went missing, the camp held its own court. Punishment was usually labour or restitution \u2014 the trail had no jail, and exile was the harshest penalty." \u2014 from the historical record of M\xE9tis trail governance.',
    author: "MMF Historical Research Centre",
    work: "M\xE9tis Communities along the Carlton Trail",
    year: 2020,
    type: "secondary",
    url: "https://www.metismuseum.ca"
  },
  HBC_DISEASE: {
    quote: "A waterborne sickness spread through the camping grounds where travellers drank from stagnant water. The trail had seen cholera before, and it was never gentle \u2014 whole crews could be laid low in a single day.",
    author: "HBC Fort Edmonton Post Journal",
    work: "Archives of Manitoba",
    year: 1878,
    url: "https://archive.org/stream/P000279/P000279_djvu.txt"
  },
  SCHULTZ_ALKALI: {
    quote: "The water holes in the uplands were often ringed with white alkali crust. The oxen refused to drink, and the men had to choose between pressing on to clean water or waiting for the animals to adjust.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  FONSECA_ICE: {
    quote: "In the spring breakup, great slabs of ice ground and tumbled in the brown water, crashing against the banks with a sound like cannon fire. The crossing was impassable until the channel cleared.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  BREHAUT_SANDBAR: {
    quote: '"The rivers of the prairie are treacherous in spring. A sandbar that was dry land yesterday may be under three feet of water today. The current shifts without warning, and a cart caught midstream may be swept downstream before the driver understands what has happened."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: River Crossings and Their Dangers",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  GOULET_BEE_TREE: {
    quote: '"A bee tree was a prize beyond reckoning on the open prairie. The hollow oak, scarred by fire, would hum with life \u2014 wild bees streaming in and out of a knot near the crown. A single tree might yield ten pounds of honey, and sugar was worth its weight in trade goods at any post." \u2014 from M\xE9tis accounts of prairie foraging.',
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    type: "secondary",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  FORT_EDMONTON: {
    quote: "Fort Edmonton... the great emporium of the northern trade. The palisade walls rose from the riverbank, and the sound of the bagpipes could be heard across the valley when the Carlton Trail brigades arrived.",
    author: "Ermatinger",
    work: "The York Factory Express",
    year: 1878,
    url: "https://archive.org/stream/P000279/P000279_djvu.txt"
  },
  PEMMICAN_FAMINE: {
    quote: "When the pemmican was gone, there was nothing. The trail offered no charity, and the prairie grass hid no food for the desperate. A man without food on the Carlton Trail was a dead man walking.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  WINTER_TRAIL: {
    quote: '"The first snow falls soft upon the prairie, and within a day the cart ruts are filled, the trail markers buried, and the Carlton Trail disappears. There will be no more travel until the spring thaw breaks the rivers and dries the ground. The long winter camp begins."',
    author: "Antoine Blanc",
    work: "The Carlton Trail (Manitoba History)",
    year: 1959,
    type: "secondary",
    url: "https://archive.org/stream/P000411/P000411_djvu.txt"
  },
  MORALE: {
    quote: '"A guide who cannot inspire hope is no guide at all. On the trail, the men who break first are not the weakest \u2014 they are the ones who stop believing the journey has a purpose. The brigade looks to its leader for certainty, and certainty is the one commodity that cannot be faked."',
    author: "Lawrence Barkwell",
    work: "Portage La Loche Brigade: Leadership on the Northern Trails",
    year: 2005,
    type: "secondary",
    url: "https://www.louisrielinstitute.com/"
  },
  BREHAUT_ABANDONED: {
    quote: '"Abandoned campsites were a common sight along the trail. Travellers who moved on left behind fire pits lined with stone, cached goods wrapped in oilcloth, and sometimes tools too heavy to carry. The prairie recycled everything \u2014 what one party left behind, the next might need."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: Life Along the Route",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  FONSECA_SUPPLY_CACHE: {
    quote: "The half-breeds and freighters often cached supplies along the trail \u2014 bundles wrapped in oilcloth and buried beneath a cairn of stones, marked for the return journey.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml",
    context: '"Half-breed" is period terminology Fonseca used to describe M\xE9tis people. The term is offensive today but appears here in its original historical context.'
  },
  BREHAUT_AMMO: {
    quote: '"Ammunition was among the most precious freight on the trail. A traveller who found a cache of shot or ball considered himself fortunate beyond measure, for there was no blacksmith between Fort Garry and Edmonton, and a man without powder was a man without meat."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: Freight and Provisions",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  LACOMBE_STORM: {
    quote: "The thunder rolled across the prairie like cannon fire. Lightning split the sky to the west, and the oxen bellowed in terror.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  FONSECA_RAIN: {
    quote: "Three days of rain turned the trail to the consistency of axle grease. The carts sank to the hubs and the oxen could scarcely move them.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  SCHULTZ_SNOW: {
    quote: "The first storm of the season caught us on the open prairie. By morning, the cart ruts were filled with snow and the trail was gone.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  LACOMBE_WIND: {
    quote: "A hot wind blew from the south for three days, carrying the smell of sun-baked grass and dust that stung the eyes.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  LACOMBE_HERBS: {
    quote: "The prairie is a pharmacy for those who know it. Sage for fever, willow bark for pain, and wild mint for the stomach \u2014 the land provides for those who read it.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  BREHAUT_ABANDONED_CARTS: {
    quote: '"Broken carts lined the trail like monuments to bad luck. A split wheel, a sheared axle, a load abandoned when the oxen gave out \u2014 every carter knew the signs. A wise traveller salvaged what he could: a sound axle from a rotted cart, shaganappi from a discarded harness. Nothing was wasted on the trail."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: Breakdowns and Salvage",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  FONSECA_HBC_SUPPLY: {
    quote: "The Company maintained supply caches along the trail \u2014 oilcloth bundles stamped with the HBC monogram, left at cairns for freighters who might need them.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  SCHULTZ_DEADFALL: {
    quote: "Deadfall was plentiful in the wooded corridors \u2014 trees brought down by wind and winter, dry and ready for the axe. A good fire meant survival on the northern trail.",
    author: "John C. Schultz",
    work: "The Old Crow Wing Trail",
    year: 1894,
    url: "https://www.mhs.mb.ca/docs/transactions/1/oldcrowwingtrail.shtml"
  },
  GOULET_BLANKET: {
    quote: '"A wool blanket was worth its weight in trade goods on the northern trail. Travellers who lost theirs to river crossings or prairie fires often did not survive the next cold snap. A wet man on the open prairie in October is a dead man by morning." \u2014 from accounts of northern trail hardships.',
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    type: "secondary",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  FONSECA_BEAVER: {
    quote: "The beaver ponds along the river were traps waiting to be set. A prime pelt could buy a week's provisions, and the meat was as good as any on the trail.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
  },
  CALHOON_CART_FORT: {
    quote: '"When the threat came, the brigade formed a tight circle of carts \u2014 a fortress on the open prairie. Inside, the women and children were secured while the men took up positions along the perimeter with whatever weapons they had. The carts were our walls, and we defended them." \u2014 Victoria Callihoo (M\xE9tis elder, 1901\u20131984), oral history, corroborated by the Indigenous Peoples Atlas of Canada.',
    author: "Victoria Callihoo (M\xE9tis elder, 1901\u20131984)",
    work: 'oral history, combined with "Red River Carts" (indigenouspeoplesatlasofcanada.ca)',
    year: 2019,
    type: "secondary",
    url: "https://indigenouspeoplesatlasofcanada.ca/article/red-river-carts/"
  },
  IPAC_RAFT: {
    quote: '"To cross a swollen river, the M\xE9tis would dismantle the cart. The great five-foot wheels were removed and lashed dish-upward beneath the cart box. Buffalo hides \u2014 soaked and stretched \u2014 were wrapped over the frame to make it watertight. Women and older children guided the raft across, holding the infants, while the men swam the oxen on a line. The cart floated like a boat, and the river was crossed." \u2014 from the Indigenous Peoples Atlas of Canada.',
    author: "Indigenous Peoples Atlas of Canada",
    work: "Red River Carts: River Crossings and Improvised Rafts",
    year: 2019,
    type: "secondary",
    url: "https://indigenouspeoplesatlasofcanada.ca/article/red-river-carts/"
  },
  SMALLPOX_1870: {
    quote: '"The sickness came up the river with the boats. Whole families were stricken. The Bruneau family fled St. Albert for the open prairie, but the smallpox found them on the trail. Eliza Bruneau and six of her children perished. Only one daughter survived to tell the story. The number of the dead was so great that the living could not bury them all." \u2014 from scrip records and family accounts of the 1870 epidemic.',
    author: "scrip records, 1885\u20131886; KnowHistory.ca",
    work: '"The number of the dead was so great": M\xE9tis accounts of the 1870 smallpox epidemic',
    year: 2022,
    type: "secondary",
    url: "https://www.knowhistory.ca/news/the-number-of-the-dead-was-so-great-metis-accounts-of-the-1870-smallpox-epidemic-on-the-prairies/"
  },
  // Settlement-specific sources
  HBC_INSPECTION: {
    quote: `"Every cart that passes through the fort is subject to inspection. The Company's factor examines the cargo, records the goods, and assesses the duty. A freighter who conceals his trade goods is liable to forfeiture \u2014 the factor's eye is sharp and his ledger is final." \u2014 from HBC post inspection records, Fort Ellice, c. 1875.`,
    author: "HBC Post Records",
    work: "Fort Ellice Inspection Journal",
    year: 1875
  },
  NWMP_DUTY: {
    quote: `"The sergeant at the gate asked our business. When I told him we were freighters bound for Edmonton, he produced a ledger and read aloud the regulations: no ammunition to be traded with Indigenous peoples without a permit, no spirits of any kind, and all carts subject to search. The Mounties do not jest about the law." \u2014 from a freighter's account of passing through an NWMP checkpoint, c. 1880.`,
    author: "anonymous freighter",
    work: "cited in NWMP checkpoint records",
    year: 1880
  },
  MISSION_CHARITY: {
    quote: `"The sisters gave us pottage and bread without asking for payment. One of the nuns washed the children's wounds and dressed them with clean cloth. When I tried to leave something in return, she pressed my hand and said, 'The road gives back what you put into it.' I did not know if she meant the trail or something larger." \u2014 from a freighter's account of a mission stop.`,
    author: "anonymous freighter",
    work: "cited in Grey Nuns mission records",
    year: 1878
  },
  METIS_WELCOME: {
    quote: '"The families at the M\xE9tis camp welcomed us with bannock and tea. The women had been baking since dawn. A fiddle was already going \u2014 someone always has a fiddle \u2014 and the children ran alongside the carts until we came to a stop. It costs nothing to be kind on the trail, and these people understood that better than any."',
    author: "anonymous freighter",
    work: "cited in M\xE9tis community oral histories",
    year: 1876
  },
  HBC_RIVALRY: {
    quote: `"The free traders pass by our post without stopping, and there is no law to make them. They sell gunpowder and blankets to anyone who will buy, and the Company loses its margin. The factor shakes his head and writes in his journal, but the carts keep rolling west, and the trade keeps flowing where it will." \u2014 from an HBC factor's journal.`,
    author: "HBC Fort Pelly Post Journal",
    work: "Archives of Manitoba",
    year: 1879
  },
  NWMP_DESERTER: {
    quote: '"A man arrived at the post half-starved, deserting from the Mounted Police. He said the duty was too hard and the pay too slow. The sergeant took him in without a word and fed him before putting him in irons. The trail hardens a man, but the law is harder still." \u2014 from an account of NWMP desertion along the Carlton Trail.',
    author: "anonymous observer",
    work: "cited in NWMP disciplinary records",
    year: 1881
  },
  MISSION_BLINDING: {
    quote: '"At the mission, a child had gone blind from snow glare. The nuns had been treating his eyes with cold water and bandages. The mother sat by his bed as though prayer alone could restore his sight. The trail takes things from you that it does not give back."',
    author: "anonymous freighter",
    work: "cited in mission medical records",
    year: 1879
  },
  METIS_COURT: {
    quote: '"Two freighters had a dispute over a cache of cached pemmican \u2014 each claimed to have buried it first. The camp overseer heard both sides and ruled that the cache be split evenly, with a third portion given to a widow in the camp. No one argued. The trail has its own justice, and it is swift."',
    author: "anonymous observer",
    work: "cited in M\xE9tis trail governance accounts",
    year: 1877
  }
};
function getSource(key) {
  return SOURCES[key];
}
__name(getSource, "getSource");

// src/data/events.js
var EVENT_POOLS = {
  plains: [
    {
      id: "plains_trader",
      text: "A M\xE9tis freighter catches up to your cart, his own load shifting and groaning with every rut. He eyes your cargo and offers a short-term deal \u2014 he knows a shortcut to the next post, one that saves a day if the weather holds. The trail has its own economy, and information is worth as much as pemmican.",
      classification: "Freight & Trade",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Hire him as a scout", dc: 11, ok: "He rides ahead and spots a safer campsite.", bad: "He takes the easy path and you lose a day.", wear: 0, time: 1, addsRep: { key: "metis", delta: 1 }, itemBonus: { name: "Rope (50ft)", dcBonus: 2 }, branch: {
          id: "plains_scout_return",
          text: "The scout returns with news: a lone HBC clerk is stranded with a broken cart ahead.",
          choices: [
            { text: "Help tow them to the next post", dc: 10, ok: "They are grateful. The clerk gives you trade goods.", bad: "The axle breaks under the strain.", wear: 2, morale: -4, setsFlag: "helped_hbc", addsRep: { key: "hbc", delta: 1 }, give: [{ name: "Bison Hide", amt: 1 }] },
            { text: "Tip your hat and press on", dc: null, always: "You do not have time for strangers." }
          ]
        } },
        { text: "Refuse", dc: null, always: "You keep to your own pace.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_wind",
      text: "A hot wind at your back. The grass goes flat in waves and the oxen lean in, pulling harder than they did at dawn. Cart lurches forward \u2014 a free mile, maybe two. But the wind's been pushing smoke all morning and smoke means fire somewhere west.",
      source: getSource("LACOMBE_WIND"),
      choices: [
        { text: "Run with it", dc: 10, ok: "You make excellent time.", bad: "A hidden rut jolts the cart. Repairs are needed after crossing.", wear: 1, time: -1 },
        { text: "Hunker down", dc: null, always: "You wrap the load and keep moving. No rain comes.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_camp_cookery",
      text: "Midday halt by a cattail slough. Pemmican is passed around; bannock is frying in a cast-iron pan, the smell of grease and onions drifting across the camp. A M\xE9tis campsite nearby offers company \u2014 strangers become friends over shared food and stories of the trail behind.",
      source: getSource("FONSECA_CAMP"),
      choices: [
        { text: "Share rubaboo and trade stories", dc: 8, ok: "The circle of travellers is warm. Morale rises.", bad: "You are too guarded to connect fully.", morale: 4, addsRep: { key: "metis", delta: 1 }, setsFlag: "shared_camp_meal" },
        { text: "Eat quickly and move on", dc: null, always: "Hunger is satisfied, but nothing more.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_night_camp",
      text: "Moon on the grass. A fiddle starts up somewhere down the line \u2014 a Red River jig, sharp enough to cut. French and Michif voices carry across the dark. One of the crew starts humming along.",
      source: getSource("FONSECA_DANCE"),
      choices: [
        { text: "Dance until your boots throw dust", dc: 10, ok: "Laughter drowns out the dark.", bad: "You strain a shoulder and sleep poorly.", morale: 12, addsRep: { key: "metis", delta: 1 }, badMorale: -4, badWear: 1 },
        { text: "Turn in early; tomorrow is long", dc: null, always: "Rest restores you in small measure.", morale: 4 }
      ]
    },
    {
      id: "plains_ox_scatter",
      text: "The oxen have scattered after drinking \u2014 a chaos of traces and running hooves across the mid-day camp. Ropes tangle, carts shift, and the air fills with shouting. To drive the refractory animals among the carts is a last resort, but sometimes the only one.",
      source: getSource("FONSECA_OX_SCATTER"),
      choices: [
        { text: "Call and whistle them back", dc: 11, ok: "The animals respond to the familiar sounds.", bad: "You lose an hour rounding them up.", time: 1, morale: -4, okMorale: 3 },
        { text: "Send someone ahead", dc: 9, ok: "Your crew brings them in quietly and quickly.", bad: "One runner turns an ankle.", crew: "tired", addsRep: { key: "metis", delta: 1 }, okMorale: 3, okTime: -1 }
      ]
    },
    {
      id: "plains_squeal_cart",
      text: "The dry wood of the hub screams against the axle \u2014 a blood-curdling sound that carries for miles across the open prairie. Every traveller on the trail knows that squeal. It means a loaded cart is coming, and the sound alone is enough to make oxen nervous and strangers take notice.",
      source: getSource("BREHAUT_CART"),
      choices: [
        { text: "Apply shaganappi before it worsens", dc: 7, ok: "The scream quiets. The trail is kinder.", bad: "Insufficient grease; the noise persists. The cart takes a beating.", morale: -3, wear: 1, requiresItem: "Shaganappi", consumesItem: "Shaganappi", branch: {
          id: "plains_squeal_draw_attention",
          text: "Your squealing cart draws a mounted rider from a nearby coul\xE9e.",
          choices: [
            { text: "Stand your ground", dc: 10, ok: "He is a M\xE9tis trader simply curious.", bad: "He is a rough type; you hand over a small toll.", food: -2 },
            { text: "Offer a quiet trade", dc: 9, ok: "He tips his hat and moves on.", bad: "He senses weakness and haggles hard.", food: -1, okFood: 0, badFood: -1 }
          ]
        } },
        { text: "Ignore the noise", dc: null, always: "The day's miles do not lessen the complaint. The axle groans louder with every league.", alwaysWear: 2 }
      ]
    },
    {
      id: "plains_buffalo_hunt_camp",
      text: "Cart crests the rise and you pull the ox up short. Below: a hundred carts in a circle, horses everywhere, dust so thick you can taste it. Four hundred hunters sitting quiet, waiting for the sign. Beyond them the herd \u2014 you feel the hooves through the ground before you hear them.",
      source: getSource("GOULET_HUNT"),
      choices: [
        { text: "Join the hunt", dc: 12, ok: "The hunt captain nods. You take a share of the meat.", bad: "You are slow to position. You earn only a strip.", food: 8, addsRep: { key: "metis", delta: 2 }, itemBonus: { name: "Ammunition Belt", dcBonus: 3 }, badFood: 2, badMorale: -3 },
        { text: "Observe and move on", dc: null, always: "You watch from a respectful distance. The hunt is spectacular.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_prairie_fire",
      text: "Smoke on the horizon, thick and brown against the blue sky. Then the wind shifts and the smell hits you \u2014 dry grass, pine, and the acrid bite of a prairie fire racing toward you. The dry grass crackles at its edge, and the wall of flame moves faster than a man can run.",
      source: getSource("LACOMBE_FIRE"),
      choices: [
        { text: "Ride for the river bottom", dc: 14, ok: "The fire edge passes. You lose only an afternoon's travel.", bad: "The wind shifts. You lose supplies and the cart is singed.", food: -3, okFood: -1, badFood: -3, wear: 1, morale: -12, okMorale: -4, badMorale: -12, time: 1, okTime: 1 },
        { text: "Light a backfire and wait it out", dc: 11, ok: "A practised escape. The backfire draws the main blaze away from your position.", bad: "The flames jump. Your cart is spared but the oxen panic.", morale: -8, okMorale: -4, badMorale: -8, time: 1 }
      ]
    },
    {
      id: "plains_sayer_trial",
      text: "A M\xE9tis settlement celebrates the anniversary of the Sayer trial \u2014 the day free trade became a right, not a privilege. The air is thick with pride and the smell of roasting meat. Folk cheer for independent carters, and your cart is a symbol of that freedom.",
      source: getSource("SAWYER_TRIAL"),
      choices: [
        { text: "Display independent freight proudly", dc: 9, ok: "The folk cheer. Prices are better here.", bad: "You are taken for a Company man. Prices are unkind.", food: -2, morale: -4, addsRep: { key: "metis", delta: 2 } },
        { text: "Stay quiet and keep moving", dc: null, always: "Circumspection keeps your goods and your secrets.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_burnt_prairie",
      text: "The prairie here has been burnt black \u2014 no grass, no water, and the sun is relentless. The ground is ash underfoot, and the air shimmers with heat. Bichon, the patient ox, would do his best and, failing, would lie down in the one. You must decide whether to push through or find a way around.",
      source: getSource("SCHULTZ_BURNT"),
      choices: [
        { text: "Push through to the next water", dc: 12, ok: "You make the crossing with grit.", bad: "The oxen lag. You are forced to camp on burnt ground.", food: -2, okFood: 0, badFood: -2, crew: "tired" },
        { text: "Detour to a shaded coulee", dc: null, always: "A slower, safer day. Grass and water restore the animals.", time: 1 }
      ]
    },
    {
      id: "plains_sand_hills",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of these stumps and coulees. The cart lurches and groans with every hidden obstacle.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1, morale: -4, okMorale: -2, badMorale: -6 },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_windfall",
      text: "A great elm has fallen across the trail \u2014 branches splayed like fingers blocking the path. The trunk is too heavy to move, and the bush on either side is thick with undergrowth. You will need to cut your way through or find another route entirely.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Cut a way through", dc: 10, ok: "The path opens. Useful firewood goes on the cart.", bad: "The work is harder than expected.", time: 1, give: [{ name: "Firewood Bundle", amt: 1 }] },
        { text: "Bypass through the bush", dc: 11, ok: "The bush breaks open onto the old trail.", bad: "A branch catches the canvas cover.", wear: 1 },
        { text: "Backtrack to the ford", dc: null, always: "A long, slow re-route. But safe.", time: 2 }
      ]
    },
    {
      id: "plains_axle_snap",
      text: "A sickening crack \u2014 the right axle shears against a hidden stone half-buried in yesterday's washout. The cart lurches and the load shifts. You are miles from the nearest post, and the tools for a proper repair are back at the settlement. A jury-rig will have to hold.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Set a splice with rope and wedges", dc: 11, ok: "A jury-rig holds. Progress is slow, but the cart is rolling again.", bad: "The splice splits by noon.", wear: 1, time: 1, morale: -4, okMorale: -2, badMorale: -6 },
        { text: "Cache the load and press on light", dc: null, always: "You bury the crated freight and mark the spot. The cart is light, but you return poorer.", time: -1, food: -4 }
      ]
    },
    {
      id: "plains_bear_camp",
      text: "Dawn finds a cinnamon bear rooting through your bread sack at the edge of camp. The bears along the Carlton were a constant threat to unprotected provisions. This one is bold \u2014 it has smelled the pemmican and it is not leaving without a fight.",
      source: getSource("LACOMBE_BEAR"),
      choices: [
        { text: "Beat the pan and drive it off", dc: 11, ok: "The bear lumbers away with a swat at its nose.", bad: "It turns. A strap snaps and half the flour is gone.", food: -3, morale: -6, wear: 1, itemBonus: { name: "Ammunition Belt", dcBonus: 4 }, requiresItem: "Ammunition Belt", okMorale: 4 },
        { text: "Climb for height and wait", dc: null, always: "The bear eventually loses interest. You lose the morning, not the flour.", time: 1 }
      ]
    },
    {
      id: "plains_hail",
      text: "Green sky. Dead still. Then the hail \u2014 walnut stones hammering the canvas, bouncing off the cart bed. The oxen bellow and pull sideways. On the open prairie the cart is all you've got.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Cover the canvas and ride it out", dc: 10, ok: "The wagon top holds. The oxen are skittish but unhurt.", bad: "Canvas tears and two rounds of cheese are spoiled.", food: -2, morale: -4, itemBonus: { name: "Canvas Tarp", dcBonus: 4 }, requiresItem: "Canvas Tarp", okMorale: 3 },
        { text: "Scramble to the nearest coulee", dc: 9, ok: "Natural shelter saves the load.", bad: "A slipped wheel in the rush.", wear: 1, okMorale: 3 }
      ]
    },
    {
      id: "plains_abandoned_camp",
      text: "You pass a ring of stones where a campfire once burned \u2014 the ash is cold, but someone left a bundle half-buried beneath a cairn. Travellers along the Carlton Trail cached supplies for the return journey, and this one was never reclaimed. The prairie recycled everything, but today the recycling benefits you.",
      classification: "Supply Find",
      source: getSource("BREHAUT_ABANDONED"),
      choices: [
        { text: "Search the cache", dc: 8, ok: "You find strips of dried rawhide \u2014 shaganappi, still supple. Useful for repairs or crafting.", bad: "The cache has been picked over. Only dust and a few scraps of hide remain.", give: [{ name: "Shaganappi", amt: 2 }], morale: 5, badGive: [{ name: "Shaganappi", amt: 1 }] },
        { text: "Leave it \u2014 mark the spot for the return", dc: null, always: "You notch a tree and remember the spot. The cache will keep.", morale: 2 }
      ]
    },
    {
      id: "plains_hbc_cache",
      text: "Beneath a flat stone cairn beside the trail, you find a oilcloth bundle stamped with the HBC monogram. A supply cache from a Company freighter who never made it back \u2014 the hide and contents are still sound, wrapped tight against the weather. The Company's loss is your gain.",
      classification: "Supply Find",
      source: getSource("FONSECA_SUPPLY_CACHE"),
      choices: [
        { text: "Open the cache", dc: 9, ok: "Inside: a folded bison hide, still cured and ready for trade or crafting. The Company's loss is your gain.", bad: "The bundle is damp. The hide is salvageable but the tools inside are rusted.", give: [{ name: "Bison Hide", amt: 1 }], morale: 5, badGive: [{ name: "Bison Hide", amt: 1 }], badWear: 1 },
        { text: "Report it at the next post", dc: null, always: "You rebury the cache and note the location. The Company can sort it out.", addsRep: { key: "hbc", delta: 1 } }
      ]
    },
    {
      id: "plains_theft",
      text: "Camp is crowded \u2014 too many carts, too many strangers. You wake to find a small bundle of trade goods missing from the cart pole. Thefts at rendezvous camps were usually petty and punished by the trail's own informal courts, but finding the thief among fifty families is another matter.",
      source: getSource("MMF_TRAIL_JUSTICE"),
      choices: [
        { text: "Tell the camp overseer and help search", dc: 9, ok: "The goods are returned. The thief is ordered to pay in labour.", addsRep: { key: "metis", delta: 1 } },
        { text: "Write it off and tighten watch", dc: null, always: "Pragmatic. The trail teaches scarcity.", alwaysWear: 0, morale: -2 }
      ]
    },
    {
      id: "plains_thunderstorm",
      text: "The sky turns green-black to the west. Thunder rolls across the open prairie like cannon fire. Lightning stitches the clouds to the earth, and the oxen bellow in terror. There is no shelter on the plains \u2014 only the cart and the storm.",
      classification: "Weather",
      source: getSource("LACOMBE_STORM"),
      choices: [
        { text: "Hobble the oxen and huddle under the cart", dc: null, always: "The storm passes in twenty minutes. Everyone is soaked but alive.", morale: -4 },
        { text: "Push for the nearest coulee", dc: 11, ok: "Lower ground offers shelter from the wind and lightning.", bad: "A lightning-struck tree falls nearby.", wear: 1, morale: -6, okMorale: -2, badMorale: -8 }
      ]
    },
    {
      id: "plains_windstorm",
      text: "A wind comes out of the north that never stops. It pushes at the cart from the side, threatening to tip it with every gust. The canvas tarp flaps and strains at its ties. The oxen lean against the wind and refuse to move forward.",
      classification: "Weather",
      source: getSource("LACOMBE_WIND"),
      choices: [
        { text: "Lower the cart bed and wait it out", dc: null, always: "You crouch behind the cart and wait. The wind lasts hours. When it passes, the prairie is scarred with dust devils.", time: 1 },
        { text: "Strap down the load and push into the wind", dc: 10, ok: "The oxen groan but move forward.", bad: "A gust catches the canvas. Supplies scatter.", food: -3, okFood: -1, badFood: -3, wear: 1 }
      ]
    },
    {
      id: "plains_medicine_herb",
      text: "A patch of wild sage and yarrow grows in a sheltered coul\xE9e \u2014 plants your mother taught you to recognize. The prairie pharmacy is open to those who know how to read it. Enough here to restock your supplies, if you know the preparation.",
      classification: "Supply Find",
      source: getSource("LACOMBE_HERBS"),
      choices: [
        { text: "Gather the herbs and prepare a remedy", dc: 8, ok: "You crush the yarrow for wounds and dry the sage for fever. A medicine pouch, restocked.", bad: "The preparation is imperfect but usable.", give: [{ name: "Medicine Pouch", amt: 1 }], morale: 6, consumesItem: "Firewood Bundle" },
        { text: "Take only what you need for now", dc: null, always: "You gather a small bundle. Enough for one use, not a full restock.", give: [{ name: "Medicine Pouch", amt: 1 }], morale: 3 }
      ]
    },
    {
      id: "plains_abandoned_cart",
      text: "An abandoned Red River cart sits at the edge of a coul\xE9e, its canvas rotted and one wheel missing. But the axle is sound \u2014 good hardwood, still greased. Someone left in a hurry and left usable parts behind. The trail provides for those who scavenge.",
      classification: "Supply Find",
      source: getSource("BREHAUT_ABANDONED_CARTS"),
      choices: [
        { text: "Salvage the spare axle", dc: 9, ok: "The axle comes free with some effort. Heavy, but a godsend when yours finally gives.", bad: "The wood is sound but the fittings are rusted. It will do in a pinch.", give: [{ name: "Spare Axle", amt: 1 }], morale: 5, requiresItem: "Tool Kit" },
        { text: "Take canvas and shaganappi too", dc: null, always: "You strip what you can carry. The tarp is rotted but the shaganappi bindings are still supple.", give: [{ name: "Canvas Tarp", amt: 1 }, { name: "Shaganappi", amt: 2 }], morale: 3 }
      ]
    },
    {
      id: "plains_cart_fortress",
      text: "A howl on the ridge line. Then another. The dogs go quiet first \u2014 then the oxen lift their heads. Something is wrong. Raiders, wolves, or a stampede \u2014 you cannot tell from here. The call goes out and the brigade moves as one, nudging the carts into a tight circle on the open prairie. Inside the ring, women and children huddle behind the cart beds, out of the wind and out of sight. You take your position on the perimeter with what you have.",
      classification: "Survival",
      source: getSource("CALHOON_CART_FORT"),
      choices: [
        { text: "Hold the line", dc: 12, ok: "Whatever it was, it passes. The circle holds. The women and children are safe. The brigade breaks camp and moves on.", bad: "The strain of holding takes its toll. Exhaustion sets in.", wear: 1, crew: "tired", morale: -6, okMorale: 5, okRep: { key: "metis", delta: 1 } },
        { text: "Scatter and flee", dc: null, always: "You break the circle and run. The carts are left behind \u2014 you salvage what you can, but supplies are lost to the plains.", food: -4, wear: 2, morale: -10, crew: "exhausted" }
      ]
    },
    {
      id: "plains_smallpox_trail",
      text: "A sickness is moving through the camps. You heard it at the last settlement \u2014 travellers feverish, covered in pustules, dying on the open prairie. The Bruneau family lost a mother and six children out here. Now one of your crew is burning with fever, and the medicine pouch will not help against this.",
      classification: "Disease",
      source: getSource("SMALLPOX_1870"),
      choices: [
        { text: "Make camp and pray", dc: null, always: "You stop and wait. Two days lost. The fever breaks \u2014 barely. The crew member survives, but will not be strong for days.", crew: "tired", morale: -15, time: 2 },
        { text: "Press on \u2014 reach the next post", dc: 14, ok: "The crew finds a reserve of strength. You make it to the next settlement with the sick in the cart.", bad: "The sick grow worse on the rough trail. The cart jolts them with every rut.", morale: -20, crew: "exhausted", wear: 1, okMorale: 5, okTime: -1 }
      ]
    }
  ],
  river_valley: [
    {
      id: "river_valley_sudden_rain",
      text: "The heavy cloud bursts without warning. The trail turns to a slurry and the cart sinks to the naves \u2014 the wheels disappearing into mud that grabs and holds. Sudden storms of rain turned the valley trail into a bog that could trap a loaded cart for hours.",
      source: getSource("FONSECA_RAIN"),
      choices: [
        { text: "Unhitch and pole the cart through", dc: 12, ok: "The oxen respond; you keep moving, soaked.", bad: "A wheel hub sinks axle-deep.", wear: 1, morale: -4, itemBonus: { name: "Rope (50ft)", dcBonus: 3 }, okMorale: 3, okWear: -1 },
        { text: "Wait it out on dry ground", dc: null, always: "Two hours of rain. The mud thickens.", time: 1 }
      ]
    },
    {
      id: "river_valley_broken_axle",
      text: "A hidden washout has eaten into the bank. The cart slews and the axle groans \u2014 a sound that makes every carter's stomach drop. The ground gives way beneath the wheel, and the cart tilts toward the river. You need a repair, and you need it before the bank collapses further.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Set a temporary truss with canvas and rope", dc: 11, ok: "A crude repair holds for the remaining miles.", bad: "The truss fails in the next gully.", wear: 1, time: 1, requiresItem: "Spare Axle", itemBonus: { name: "Tool Kit", dcBonus: 3 } },
        { text: "Spike the wheel and coast downhill", dc: null, always: "You save time but the wheel wobbles loose.", alwaysWear: 1, morale: -4 }
      ]
    },
    {
      id: "river_high",
      text: "The river is running high and fast, brown with spring melt. The bank trail is muddy and narrow \u2014 one wrong step and the cart slides toward the water. The carts had indeed entered straight into the water, turned upstream to make the crossing in a horse-shoe fashion. You must decide: risk the ford or wait for calmer water.",
      source: getSource("FONSECA_FORD"),
      choices: [
        { text: "Ford carefully", dc: 13, ok: "The ox keeps footing and you stay dry enough.", bad: "The cart tilts in the current. Repairs are needed after crossing.", wear: 1, itemBonus: { name: "Canvas Tarp", dcBonus: 2 }, requiresItem: "Rope (50ft)" },
        { text: "Wait for afternoon", dc: null, always: "You camp and cross later when the water drops.", time: 1 },
        { text: "Scout for the horse-shoe ford upstream", dc: 11, ok: "You find the concealed path and cross safely.", bad: "The scouting costs precious daylight and energy.", morale: -4, okMorale: -2, badMorale: -6, time: 1 }
      ]
    },
    {
      id: "river_mp_check",
      text: "An NWMP patrol stops you just above the ferry landing. Red coats inspect the carts with scrupulous care \u2014 duty is collected in cash or goods, and every cart is subject to inspection. The mounted police established posts along the trail to enforce Ottawa's regulations.",
      source: getSource("MACLEOD_NWMP"),
      choices: [
        { text: "Show your papers", dc: 9, ok: "The permits read clearly. They let you pass.", bad: "A signature mismatch. You are delayed.", time: 1, addsRep: { key: "nwmp", delta: -1 } },
        { text: "Talk your way past", dc: 12, ok: "They accept your story.", bad: "They insist on a spot inspection. Wear is likely.", wear: 1, addsRep: { key: "nwmp", delta: 0 }, branch: /* @__PURE__ */ __name(() => ({
          id: "nwmp_detain",
          text: "The inspection turns up a loose rivet in your axle. The sergeant orders you to make camp until morning.",
          choices: [
            { text: "Comply and camp for the night", dc: null, always: "The sergeant inspects in the morning and lets you go.", time: 1, addsRep: { key: "nwmp", delta: 1 } },
            { text: "Argue your case", dc: 10, ok: "The sergeant relents, but writes your name in the ledger.", bad: "You are held another full day.", time: 2, wear: 1 }
          ]
        }), "branch") }
      ]
    },
    {
      id: "river_valley_bank_descent",
      text: "The opposite bank is steep \u2014 eight feet of loose earth down to the water. A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank. The cart must be lowered carefully, or the whole thing slides into the river.",
      source: getSource("FONSECA_BANK"),
      choices: [
        { text: "Lower the cart with a line tied to a tree", dc: 10, ok: "A careful descent protects the load.", bad: "The knot slips at the last moment; the cart jars.", wear: 1, requiresItem: "Rope (50ft)", consumesItem: "Rope (50ft)" },
        { text: "Free descent", dc: null, always: "The cart slides hard; the contents shift dangerously.", alwaysWear: 1 }
      ]
    },
    {
      id: "river_boat",
      text: "At a wide crossing the captain offers passage \u2014 but he is clearly understaffed and the ferry rocks with every wave. The current is heavy and the oarsman strains. You must decide whether to trust the ferry or find another way across.",
      source: getSource("FONSECA_FORD"),
      choices: [
        { text: "Board and keep the load centred", dc: 11, ok: "You ride the swell and land clean.", bad: "A barrel breaks loose and damages a wheel.", wear: 1, food: -2, itemBonus: { name: "Rope (50ft)", dcBonus: 3 } },
        { text: "Wait for a larger brigade", dc: null, always: "A safer but slower choice.", time: 2 }
      ]
    },
    {
      id: "river_cholera_camp",
      text: "One of your crew wakes shaking. By noon they can't stand. The river water \u2014 you knew better, but the casks were low. The trail's seen this before. It doesn't get easier.",
      source: getSource("HBC_DISEASE"),
      choices: [
        { text: "Use the medicine pouch and rest the day", dc: 14, ok: "The crisis passes. One day lost, but the crew recovers.", bad: "The fever breaks but the crew is weak for days.", crew: "tired", morale: -8, okMorale: -4, badMorale: -8, consumesItem: "Medicine Pouch", time: 1 },
        { text: "Push through without rest", dc: null, always: "The worst passes but the toll is steep.", morale: -20, crew: "exhausted" }
      ]
    },
    {
      id: "river_mosquito_camp",
      text: "Mosquitoes rise from the riverbank in a cloud \u2014 you breathe them, they're in your eyes. The oxen stampede. The fire dies under the smoke. Sand flies after. Mud everywhere. The carts keep moving west because stopping is worse.",
      source: getSource("FONSECA_MOSQUITOES"),
      choices: [
        { text: "Move camp to high ground before dark", dc: 9, ok: "The move is miserable but the night is quieter.", bad: "A wheel is twisted in the dark.", wear: 1, okMorale: 3, okTime: -1 },
        { text: "Use canvas tarps and tough it out", dc: 11, ok: "You hunker down. Morning comes.", bad: "The insects are relentless. Morale falls hard.", morale: -10, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } }
      ]
    },
    {
      id: "ferry_gabriel",
      text: "Gabriel Dumont is at the crossing, his ferry moored to the bank. His fee is fair, but the current is heavy today \u2014 the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.",
      source: getSource("DUMONT_ACCOUNTS"),
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 }, itemBonus: { name: "Canvas Tarp", dcBonus: 2 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    },
    {
      id: "river_valley_flood_crossing",
      text: "The spring flood has turned the river into a brown, churning torrent. Debris spins in the current \u2014 branches, logs, the remains of last year's ice. The ford is barely visible, marked by two willow sticks driven into the bank. The oxen smell the water and balk.",
      source: getSource("FONSECA_FORD"),
      choices: [
        { text: "Ford now while you can see the markers", dc: 14, ok: "The oxen find their footing. The cart tilts but holds. You reach the far bank soaked but whole.", bad: "A submerged log catches the axle. The cart spins in the current.", wear: 2, food: -2, okFood: 0, badFood: -2, okMorale: 4, okWear: -1 },
        { text: "Wait for the water to drop", dc: null, always: "You camp on the high bank and wait. The river drops by morning.", time: 1 },
        { text: "Build a cart-raft with 2 Bison Hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river. Cargo gets wet.", morale: -6, food: -2, requiresItem: { name: "Bison Hide", count: 2 } }
      ]
    },
    {
      id: "river_valley_trader_encounter",
      text: "A lone trader crests the rise ahead, his cart loaded with bundles wrapped in oilcloth. He waves \u2014 a free trader, independent of the Company, carrying goods from settlement to settlement. His prices are his own, and his news is fresh.",
      source: getSource("SAWYER_TRIAL"),
      choices: [
        { text: "Trade with him", dc: null, always: "You exchange one of his goods for one of yours. Fair value, no questions asked.", morale: 5, consumesItem: "Bison Hide", take: [{ name: "Shaganappi", amt: 1 }] },
        { text: "Buy information about the trail ahead", dc: 8, ok: "He shares what he knows \u2014 which posts have supplies, which trails are washed out.", bad: "He is close-mouth about conditions ahead. You learn little.", morale: 3, badMorale: -2 },
        { text: "Refuse and keep moving", dc: null, always: "You tip your hat and press on. Not all strangers are friends." }
      ]
    },
    {
      id: "river_valley_mission_garden",
      text: "A small mission sits in the river valley, its garden a shock of green against the brown prairie. Rows of potatoes, turnips, and beans grow behind a wooden fence. The missionary offers freely \u2014 the garden is God's, and God's gifts are for all.",
      source: getSource("GREY_NUNS"),
      choices: [
        { text: "Accept the offering gratefully", dc: null, always: "Fresh food after weeks of pemmican. The crew eats like kings.", food: 4, morale: 10 },
        { text: "Trade labor for extra supplies", dc: null, always: "You help with the harvest in exchange for a full basket. The missionary is grateful.", food: 6, time: 1 },
        { text: "Move on \u2014 you cannot spare the time", dc: null, always: "The trail waits for no one. You press west." }
      ]
    },
    {
      id: "river_valley_ammo_trader",
      text: "A M\xE9tis hunter sits on his cart at the river crossing, mending a rifle sling. He has spare ammunition \u2014 shot and ball wrapped in a leather belt \u2014 and he is willing to part with it. Ammunition was precious on the trail, and traders who carried spare were the most welcome sight on the prairie.",
      classification: "Supply Find",
      source: getSource("BREHAUT_AMMO"),
      choices: [
        { text: "Trade food for the ammunition belt", dc: 9, ok: "He accepts your offer. The belt is sound \u2014 enough shot for several hunts or defence.", bad: "He wants more than you can spare. The deal falls through.", give: [{ name: "Ammunition Belt", amt: 1 }], food: -3, morale: 3, badFood: -1, badMorale: -2 },
        { text: "Ask where he found it", dc: null, always: 'He gestures vaguely upstream. "The trail provides." You press on.', morale: 2 }
      ]
    },
    {
      id: "river_valley_flash_flood",
      text: "Three days of rain upstream. The river is brown and rising, debris spinning in the current. The ford you crossed yesterday is gone \u2014 today the water is waist-deep and growing. The trail along the bank has become a river itself.",
      classification: "Weather",
      source: getSource("FONSECA_RAIN"),
      choices: [
        { text: "Wait for the water to drop", dc: null, always: "You camp on high ground. By morning the river has dropped enough to cross.", time: 1 },
        { text: "Push through while you can", dc: 13, ok: "The oxen find footing. The cart tilts but holds.", bad: "A submerged log catches the axle.", wear: 2, food: -2, okFood: 0, badFood: -2, okMorale: 3, okWear: -1 }
      ]
    },
    {
      id: "river_valley_canvas_cache",
      text: "Beneath a cairn of river stones, you find an oilcloth bundle stamped with the HBC monogram. A supply cache from a Company freighter \u2014 inside, a folded canvas tarp, still sound, wrapped tight against the weather. The Company's loss is your gain.",
      classification: "Supply Find",
      source: getSource("FONSECA_HBC_SUPPLY"),
      choices: [
        { text: "Take the canvas tarp", dc: 8, ok: "The tarp is heavy but waterproof. Shelter, cart cover, or raft material \u2014 it will serve.", bad: "The oilcloth is torn but the canvas beneath is sound.", give: [{ name: "Canvas Tarp", amt: 1 }], morale: 5, badGive: [{ name: "Canvas Tarp", amt: 1 }], badWear: 1 },
        { text: "Leave it \u2014 too heavy for the cart", dc: null, always: "You mark the cairn and move on. The cache will keep for the next traveller.", morale: 1 }
      ]
    },
    {
      id: "river_valley_cart_raft",
      text: "The river is swollen from three days of rain upstream \u2014 brown, churning, impassable as a ford. But the brigade has done this before. Women and older children help dismantle the five-foot wheels, lashing them dish-up beneath the cart box. Buffalo hides are soaked and stretched over the frame. In an hour, the cart floats. The oxen will swim. The freight, the women, and the children ride the raft across while you guide the line from the bow.",
      source: getSource("IPAC_RAFT"),
      choices: [
        { text: "Help with the raft", dc: 11, ok: "The improvised ferry holds. You reach the far bank soaked but whole.", bad: "A hide splits mid-river. Cargo gets wet and one food sack is lost.", food: -2, okFood: 0, badFood: -2, morale: -4, okMorale: -2, badMorale: -6 },
        { text: "Wait for the water to drop", dc: null, always: "You camp on the high bank for two days. The river drops by morning.", time: 2 }
      ]
    }
  ],
  wooded: [
    {
      id: "wooded_cree",
      text: "A Cree hunter steps onto the trail ahead, his rifle resting easy in the crook of his arm. He studies your cart and nods at the pemmican sacks \u2014 a gesture of recognition between peoples who know the same hunger. The wooded corridors of the Carlton Trail were meeting places, where M\xE9tis and Cree traded goods and news.",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Offer a trade", dc: 11, ok: "He swaps fresh meat for part of your load.", bad: "He senses you are short on food. The deal goes poorly.", food: 3, addsRep: { key: "cree", delta: 1 }, itemBonus: { name: "Ammunition Belt", dcBonus: 2 }, requiresItem: "Ammunition Belt", badFood: -1, badMorale: -3 },
        { text: "Keep moving", dc: null, always: "He watches but does not interfere.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_ambush_ravine",
      text: "A hidden rut drops one wheel into a creek bed \u2014 the cart tilts dangerously, and the load shifts toward the ditch. Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails. Quick hands are needed now.",
      source: getSource("BREHAUT_CART"),
      choices: [
        { text: "Catch the weight and right it", dc: 12, ok: "Quick hands save the day.", bad: "The cart upsets. One food item is lost.", food: -1, wear: 1, itemBonus: { name: "Rope (50ft)", dcBonus: 3 }, requiresItem: "Rope (50ft)" },
        { text: "Call for help", dc: 9, ok: "A nearby M\xE9tis party rights the cart swiftly. They share a laugh and some pemmican.", bad: "Helpers arrive slow and grumpy.", morale: 3, addsRep: { key: "metis", delta: 1 }, time: 1, give: [{ name: "Pemmican Rations", amt: 1 }] }
      ]
    },
    {
      id: "wooded_stung_by_flies",
      text: "The mosquitoes and biting flies rise from the slough in a living cloud. The animals spook and the crew wants to run. Bound away to the water, into which they plunged neck deep, remaining there safe from the tormenting flies and mosquitoes.",
      source: getSource("FONSECA_MOSQUITOES"),
      choices: [
        { text: "Drive through to firmer ground", dc: 11, ok: "You outpace the worst of the cloud.", bad: "The animals bolt; a strap snaps.", wear: 1, crew: "tired", okMorale: 3, okTime: -1 },
        { text: "Let the oxen cool in the water", dc: null, always: "The delay costs time but saves nerves.", time: 1 }
      ]
    },
    {
      id: "wooded_black_bear",
      text: "A black bear crosses the trail thirty yards ahead, then stops and turns, taking the measure of the party. Bears were common along the wooded corridors of the Carlton Trail and could be dangerous when surprised at close range. This one is calm \u2014 for now.",
      source: getSource("LACOMBE_BEAR"),
      choices: [
        { text: "Stand your ground and make noise", dc: 12, ok: "The bear veers away.", bad: "It charges and the oxen bolt.", wear: 1, morale: -6, crew: "tired", okMorale: 4 },
        { text: "Back away quietly with the cart", dc: null, always: "The bear waits until you are clear, then moves on.", time: 1 }
      ]
    },
    {
      id: "wooded_rattlesnake",
      text: "A rattlesnake hums in the grass beside the trail, still as a root until you are almost on it. Rattlesnakes were common on the southern stretches of the trail and caused many a nervous night. The lead ox smells it first and refuses to move.",
      source: getSource("SCHULTZ_RATTLESNAKE"),
      choices: [
        { text: "Hook it clear with a pole and move on", dc: 10, ok: "The snake disappears into the brush.", bad: "It strikes at the lead ox.", wear: 1, morale: -2, okMorale: 3 },
        { text: "Backtrack to a wider crossing", dc: null, always: "A slow detour, but nerves settle.", time: 1 }
      ]
    },
    {
      id: "wooded_axle_rut",
      text: "A hidden washout drops the front wheel axle-deep. The cart tilts dangerously toward the ditch. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. You need to free the cart before the soil gives way completely.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Spade and block the wheel", dc: 11, ok: "You free the cart without damage.", bad: "The soil gives way twice.", time: 1, morale: -3, okMorale: 3, okTime: -1 },
        { text: "Lighten and rock it free", dc: 9, ok: "A quick heave gets you out clean.", bad: "A crate lands in the muck.", food: -2, okFood: 0, badFood: -2, wear: 1, okMorale: 3, okTime: -1 }
      ]
    },
    {
      id: "wooded_cree_elder",
      text: "An old Cree man sits on a fallen log beside the trail, his pipe sending thin smoke into the still air. He watches your cart approach with calm eyes. When you stop, he speaks \u2014 not in English, but in gestures and a few French words. He knows these woods. He knows what lies ahead.",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Listen to what he has to say", dc: null, always: "He points to the trail ahead, then draws a line in the dust. Warning or welcome \u2014 you cannot be sure, but the gesture is clear.", morale: 5 },
        { text: "Offer a gift and trade words", dc: 9, ok: "He accepts your offering and shares what he knows about the trail. His directions save you a day.", bad: "He takes the gift but says little. Some knowledge is not for strangers.", morale: 3, okTime: -1, badMorale: -2, badFood: -1 },
        { text: "Nod respectfully and move on", dc: null, always: "You tip your hat and press west. The old man watches you go." }
      ]
    },
    {
      id: "wooded_bee_tree",
      text: "A hollow oak, its trunk scarred by fire, hums with life. Wild bees stream in and out of a knot near the crown \u2014 a bee tree, full of honey. The air smells of wax and sweetness. It is a rare find on the open prairie, where sugar is worth its weight in trade goods.",
      source: getSource("GOULET_BEE_TREE"),
      choices: [
        { text: "Harvest the honey", dc: 10, ok: "Smoke calms the bees. You fill a pail with golden honey \u2014 enough to trade or eat for days.", bad: "The bees are not pleased. Stings and smoke, but you get a little honey.", food: 3, time: 1, badFood: 1, badMorale: -2 },
        { text: "Mark the tree for the return journey", dc: null, always: "You notch the bark and remember the spot. The honey will keep.", morale: 3 },
        { text: "Leave it \u2014 you cannot spare the time", dc: null, always: "The trail waits. The bees keep their treasure." }
      ]
    },
    {
      id: "wooded_forest_fire",
      text: "Smoke on the horizon. Then the wind shifts and the smell hits you \u2014 dry wood, pine resin, and the acrid bite of a forest fire pushing toward you. The treeline ahead glows orange. The oxen smell it too and pull at their traces. The prairie burned every afternoon, but this is different \u2014 this fire is coming for you.",
      source: getSource("LACOMBE_FIRE"),
      choices: [
        { text: "Ride for the river bottom", dc: 12, ok: "The fire edge passes. You lose only an afternoon.", bad: "The wind shifts. You lose supplies and the cart is singed.", food: -3, okFood: -1, badFood: -3, wear: 1, morale: -12, okMorale: -4, badMorale: -12, time: 1, okTime: 1 },
        { text: "Light a backfire and wait it out", dc: 10, ok: "A practised escape. The backfire draws the main blaze away from your position.", bad: "The flames jump. Your cart is spared but the oxen panic.", morale: -8, okMorale: -4, badMorale: -8, time: 1 },
        { text: "Use water from the slough to wet the canvas", dc: 11, ok: "The wet tarp protects the load. You wait in the smoke until the fire passes.", bad: "There is not enough water. The canvas smolders.", morale: -2, time: 1, itemBonus: { name: "Canvas Tarp", dcBonus: 3 } }
      ]
    },
    {
      id: "wooded_rope_find",
      text: "A length of hemp rope lies coiled beside the trail, half-buried in leaf litter. Someone's cart broke a lash line and left the rest behind \u2014 fifty feet of sound rope, still supple. In the wooded corridors of the Carlton Trail, useful things turned up in the strangest places.",
      classification: "Supply Find",
      source: getSource("BREHAUT_ABANDONED"),
      choices: [
        { text: "Take the rope", dc: null, always: "You coil it and add it to the cart. Useful for crossings, repairs, or crafting.", give: [{ name: "Rope (50ft)", amt: 1 }], morale: 3 },
        { text: "Leave it \u2014 someone may return for it", dc: null, always: "You press on. The rope is not yours to take.", morale: 1 }
      ]
    },
    {
      id: "wooded_firewood_gather",
      text: "A stand of dead poplar, brought down by winter wind and now seasoned dry. The wood splits clean and burns hot \u2014 exactly what you need for the cold nights ahead. The wooded corridors of the Carlton Trail were the last reliable source of fuel before the open prairie.",
      classification: "Supply Find",
      source: getSource("SCHULTZ_DEADFALL"),
      choices: [
        { text: "Gather firewood", dc: 8, ok: "You split and bundle the dry wood. A full bundle \u2014 enough for several nights of warmth.", bad: "The wood is sound but heavier than expected. You take what you can carry.", give: [{ name: "Firewood Bundle", amt: 1 }], morale: 5, badGive: [{ name: "Firewood Bundle", amt: 1 }] },
        { text: "Mark the spot for the return journey", dc: null, always: "You notch a tree and remember the spot. The wood will keep.", morale: 2 }
      ]
    }
  ],
  uplands: [
    {
      id: "upland_high_pass",
      text: "The trail climbs onto a windy upland bench, the prairie falling away on all sides. Rain draws near \u2014 you can smell it in the air, feel it in the drop of temperature. The ridge offers no shelter, and the cart is exposed to whatever the sky decides to deliver.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Press through before the storm", dc: 11, ok: "You gain the far shelter with minutes to spare.", bad: "The rain catches you on exposed ground.", wear: 1, morale: -6, itemBonus: { name: "Canvas Tarp", dcBonus: 3 } },
        { text: "Hike to a rocky ledge and wait", dc: null, always: "Cold, but the cart and crew are intact.", time: 1 },
        { text: "Wrap up in blankets and endure", dc: 10, ok: "The blankets hold the cold at bay.", bad: "The wind cuts through the wool.", morale: -8, okMorale: -4, badMorale: -8, requiresItem: "Blanket", consumesItem: "Blanket" }
      ]
    },
    {
      id: "upland_sand_hill",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. The cart lurches and groans with every hidden obstacle.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1, itemBonus: { name: "Tool Kit", dcBonus: 2 } },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "upland_thunderstorm",
      text: "The ridge offers no shelter. Lightning finds the highest point and the rain comes down in sheets. Sudden storms of hail and sleet were not uncommon on the uplands in late spring. The oxen bellow and strain at their traces, and the cart slides on the wet grass.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Hobble the oxen and weather it under the cart", dc: 11, ok: "The canvas holds. You are soaked but intact.", bad: "A lightning-struck tree falls nearby.", morale: -6, time: 1, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } },
        { text: "Run for the coulee bottom", dc: 9, ok: "Lower ground is safer.", bad: "A slipped wheel in the mud.", wear: 1 }
      ]
    },
    {
      id: "upland_bison_herd",
      text: "The trail's gone. Buffalo everywhere \u2014 thousands, maybe ten thousand, brown humps to the horizon on both sides. The ground shakes. Your ox won't go forward, eyes white, pulling sideways.",
      source: getSource("GOULET_HUNT"),
      choices: [
        { text: "Wait for the herd to pass", dc: null, always: "You make camp and wait. The herd takes half a day to pass. The ground is churned to dust.", time: 1 },
        { text: "Drive through the edge of the herd", dc: 13, ok: "The oxen plunge in. The herd parts just enough. You emerge on the other side, hearts pounding.", bad: "A bull takes offense. The oxen bolt. Cart tips and supplies scatter.", wear: 2, morale: -8, okMorale: 5, okTime: -1 },
        { text: "Hunt a straggler for food", dc: 11, ok: "A young bull is separated from the herd. The crew brings it down and butchers it on the spot.", bad: "The shot scatters the herd toward you. The oxen stampede.", food: 6, itemBonus: { name: "Ammunition Belt", dcBonus: 3 }, badWear: 2, badMorale: -8 }
      ]
    },
    {
      id: "upland_storm_shelter",
      text: "Green sky. Then the hail starts \u2014 stones hammering the canvas. Lightning hits the ridge above. No up there, no cover here. The oxen bellow and sit down.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Hobble the oxen and wait it out", dc: null, always: "You huddle under the cart. The storm passes in twenty minutes. Everyone is soaked but alive.", morale: -4 },
        { text: "Push for the coulee bottom", dc: 10, ok: "Lower ground is safer. The hail lessens as you descend.", bad: "A slipped wheel in the mud. The cart tilts but holds.", wear: 1, okMorale: 3, okWear: -1 },
        { text: "Use the Canvas Tarp as shelter", dc: 9, ok: "The tarp holds against the worst of it. The crew stays dry enough.", bad: "The wind tears at the canvas. A pole snaps.", morale: -3, itemBonus: { name: "Canvas Tarp", dcBonus: 3 } }
      ]
    },
    {
      id: "upland_metis_scout",
      text: "A lone rider appears on the ridge ahead \u2014 a M\xE9tis scout, his cart painted red and blue, his sash bright against the brown grass. He knows these hills. He offers to guide you through the uplands for a price.",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Hire him as a guide", dc: null, always: "He rides ahead and finds the best path. You save a day of wandering.", food: -3, extraProgress: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Trade for information instead", dc: 8, ok: "He shares what he knows about the trail ahead in exchange for news from the settlements.", bad: "He is polite but reveals little. You part ways no wiser.", morale: 5, badMorale: -2 },
        { text: "Decline and rely on your own sense", dc: null, always: "You nod respectfully and press on alone. The trail is harder to find than expected.", time: 1 }
      ]
    },
    {
      id: "upland_water_hole",
      text: "The oxen refuse to drink. The water hole ahead is alkaline \u2014 white crust rings the edge, and the smell of alkali rides the wind. The animals know before you do: this water will sicken them.",
      source: getSource("SCHULTZ_ALKALI"),
      choices: [
        { text: "Force the oxen through to clean water beyond", dc: 11, ok: "The oxen drink reluctantly and you push on. They recover by evening.", bad: "One ox goes lame from the bad water. Progress slows to a crawl.", crew: "tired", morale: -6, itemBonus: { name: "Medicine Pouch", dcBonus: 2 } },
        { text: "Detour to find a clean spring", dc: null, always: "A longer route, but the water is sweet. The oxen drink deeply and press on with new energy.", time: 1, morale: 5 },
        { text: "Ration Pemmican Rations to sustain the crew", dc: null, always: "You stretch your food and wait for the oxen to adjust. A hungry day, but no one falls ill.", food: -3 }
      ]
    },
    {
      id: "upland_night_frost",
      text: "The temperature drops after sunset. By morning, a thin crust of ice covers the water barrels and the oxen's breath rises in white plumes. The ground is too hard to drive tent pegs. The crew huddles together for warmth, and the firewood burns faster than you planned.",
      source: getSource("SCHULTZ_FROST"),
      choices: [
        { text: "Burn extra Firewood Bundle to keep warm", dc: null, always: "The fire holds back the cold. The crew sleeps, but your fuel reserves are thinner now.", morale: 5, consumesItem: "Firewood Bundle" },
        { text: "Push through without extra fire", dc: 9, ok: "Grit and determination. The crew complains but holds together.", bad: "Fingers go numb. One crew member cannot feel their feet by morning.", crew: "tired", morale: -10, okMorale: 3 },
        { text: "Make camp and wait for the thaw", dc: null, always: "You wait for the sun to warm the ground. A lost day, but the crew is intact.", time: 1 }
      ]
    },
    {
      id: "upland_early_snow",
      text: "The first storm of the season catches you on the open uplands. By morning, the cart ruts are filled with snow and the trail is gone. The temperature plunges. The oxen breathe white plumes into the still air.",
      classification: "Weather",
      source: getSource("SCHULTZ_SNOW"),
      choices: [
        { text: "Make camp and wait for the thaw", dc: null, always: "You wait for the sun to melt the snow. A lost day, but the crew is intact.", time: 1, morale: -2 },
        { text: "Push through \u2014 follow the ridge", dc: 11, ok: "The going is brutal but you keep moving.", bad: "The snow deepens. Progress is measured in yards.", crew: "tired", morale: -8, okMorale: 3, okTime: -1 }
      ]
    },
    {
      id: "upland_blanket_find",
      text: "A hunter's camp, abandoned in haste \u2014 a fire pit still warm, a wool blanket cached beneath a tarp. Whoever left was in a hurry, and they are not coming back. The blanket is sound, if trail-worn. On the northern trail, wool is worth its weight in trade goods.",
      classification: "Supply Find",
      source: getSource("GOULET_BLANKET"),
      choices: [
        { text: "Take the blanket", dc: null, always: "You fold it and add it to the cart. Warmth for cold nights ahead.", give: [{ name: "Blanket", amt: 1 }], morale: 4 },
        { text: "Leave it \u2014 not yours to take", dc: null, always: "You press on. The blanket is not yours.", morale: 1 }
      ]
    }
  ],
  river: [
    {
      id: "river_cart_raft",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart. Four cart wheels were taken and placed dish upwards on the surface of the water. The boat was launched, and floated like a duck.",
      source: getSource("FONSECA_RAFT"),
      choices: [
        { text: "Build a cart-raft with 2 bison hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river; cargo gets wet.", morale: -6, food: -2, setsFlag: "built_rafts", requiresItem: { name: "Bison Hide", count: 2 }, branch: {
          id: "river_raft_wash",
          text: "On the far bank, an elder watches your landing and nods slowly.",
          choices: [
            { text: "Greet him respectfully", dc: 10, ok: "He shares drying hides and directions for the next leg.", bad: "He is suspicious and leaves without speaking.", addsRep: { key: "cree", delta: -1 }, morale: -4 },
            { text: "Get moving without conversation", dc: null, always: "Pragmatic. The crossing cost enough time.", alwaysWear: 0 }
          ]
        } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2, okFood: 0, badFood: -2, okMorale: 3, okWear: -1 }
      ]
    },
    {
      id: "river_nwmp_duty",
      text: "At the crossing, red coats inspect the carts with scrupulous care. Duty is collected in cash or goods. The mounted police established posts along the trail to enforce Ottawa's regulations, and every cart is subject to inspection.",
      source: getSource("MACLEOD_NWMP"),
      choices: [
        { text: "Declare your goods and pay duty", dc: null, always: "The paperwork is tedious but fair. You keep your peace.", food: -2, addsRep: { key: "nwmp", delta: 1 } },
        { text: "Attempt to pass quietly", dc: 13, ok: "They are busy and let you slip through.", bad: "Caught concealing cargo. Goods are confiscated.", morale: -15, addsRep: { key: "nwmp", delta: -2 }, okMorale: 3 }
      ]
    },
    {
      id: "river_lawrence_barkwell_boats",
      text: "You meet a crew of boatmen heading for the Portage La Loche. Their faces are lean, their hands calloused, but their eyes are sharp. This famous brigade traveled 4000 miles every year, and the men who crewed it knew every river from the Red to the Athabasca.",
      source: getSource("BARKWELL_BRIGADE"),
      choices: [
        { text: "Exchange dried fish and route talk", dc: 8, ok: "They share intelligence on the next water crossings.", bad: "The conversation is brief and businesslike.", morale: 6, badMorale: -2 },
        { text: "Hire a guide for the hard water ahead", dc: 10, ok: "A steady hand joins your crew for three days.", bad: "The boatman is competent but expensive.", food: -3, extraProgress: 2, addsRep: { key: "metis", delta: 1 }, badFood: -1, badMorale: -3 }
      ]
    },
    {
      id: "river_ice_breakup",
      text: "The river is in breakup. Great slabs of ice grind and tumble in the brown water, crashing against the banks with a sound like cannon fire. The crossing is impassable today \u2014 perhaps tomorrow, if the cold holds. The crew watches the ice flow past and wonders how long the wait will be.",
      source: getSource("FONSECA_ICE"),
      choices: [
        { text: "Wait for the ice to clear", dc: null, always: "You camp and watch the river. By morning, the channel is clear enough.", time: 1 },
        { text: "Find an alternate crossing upstream", dc: 11, ok: "A narrower point, but the ice has passed. You cross carefully.", bad: "The bank is steep. The cart slips but holds.", wear: 1, okMorale: 3, okWear: -1, okTime: -1 },
        { text: "Risk the crossing now", dc: 15, ok: "The oxen are strong swimmers. You make it across, ice grinding at the cart sides.", bad: "A slab of ice catches the axle. The cart tips. Cargo lost to the current.", wear: 2, food: -4, okFood: -1, badFood: -4 }
      ]
    },
    {
      id: "river_supply_boat",
      text: "A York boat rounds the bend, its oars flashing in the sun. HBC markings on the hull \u2014 a supply boat heading downstream from the northern posts. The crew waves. They have news, and they have trade goods that have not seen a settlement in months.",
      source: getSource("HBC_JOURNAL"),
      choices: [
        { text: "Trade with the boat crew", dc: null, always: "You exchange news and goods. The boatmen are glad for fresh supplies from the south.", morale: 5, consumesItem: "Bison Hide", take: [{ name: "Shaganappi", amt: 1 }] },
        { text: "Ask for news of the trail ahead", dc: 8, ok: "They tell you which posts are well-stocked and which trails have washed out. Valuable intelligence.", bad: "They are close-mouth about Company business. You learn little.", morale: 3, badMorale: -2 },
        { text: "Wave and continue on your way", dc: null, always: "You are heading west, they are heading east. Your paths cross and diverge." }
      ]
    },
    {
      id: "river_sandbar_trap",
      text: "The oxen are halfway across when the cart lurches and stops. The front wheels have dropped into a hidden sandbar, and the current is pushing against the cart bed. The oxen strain but cannot pull free. The water is rising.",
      source: getSource("BREHAUT_SANDBAR"),
      choices: [
        { text: "Unload and float the cart free", dc: 11, ok: "You lighten the load and the oxen pull clear. Wet cargo, but the cart is safe.", bad: "The current shifts the cart. A barrel is swept away.", food: -2, wear: 1, okFood: -1, okWear: -1 },
        { text: "Use Rope (50ft) to anchor and pull from bank", dc: 10, ok: "The rope holds. The crew on the bank heaves. The cart grinds free.", bad: "The rope slips. The cart settles deeper.", wear: 1, itemBonus: { name: "Rope (50ft)", dcBonus: 3 } },
        { text: "Wait for the water level to drop", dc: null, always: "You wait. The current lessens by afternoon and the oxen pull free.", time: 1, morale: -5 }
      ]
    },
    {
      id: "river_cart_raft_crossing",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart \u2014 enough to build a raft, if you know how. The river is wide and the current steady. On the far bank, the trail continues west.",
      source: getSource("FONSECA_RAFT"),
      choices: [
        { text: "Build a cart-raft with 2 Bison Hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river. Cargo gets wet.", morale: -6, food: -2, requiresItem: { name: "Bison Hide", count: 2 } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2, okFood: 0, badFood: -2, okMorale: 3, okWear: -1 }
      ]
    },
    {
      id: "river_beaver_trade",
      text: "The river bends through a series of still ponds where beaver dams hold the water high. Freshly cut saplings show the work of a large colony. The pelts would be prime this time of year, and the meat would stretch your food supplies. If you have ammunition to spare.",
      classification: "Supply Find",
      source: getSource("FONSECA_BEAVER"),
      choices: [
        { text: "Set traps and hunt beaver", dc: 10, ok: "The traps hold. You harvest two prime pelts and smoke the meat over the fire.", bad: "The beavers are wary. You get one pelt and little meat.", give: [{ name: "Beaver Pelts", amt: 2 }], morale: 6, badGive: [{ name: "Beaver Pelts", amt: 1 }], badFood: 1 },
        { text: "Fish instead \u2014 lower risk", dc: 8, ok: "The river yields enough fish to stretch your rations by a day.", bad: "The fish are not biting. A wasted afternoon.", food: 3, morale: 2, badMorale: -2 }
      ]
    }
  ]
};
var SETTLEMENT_EVENTS = {
  hbc: [
    {
      id: "hbc_inspection",
      text: 'The HBC factor at the fort demands to inspect your cargo. He opens each bundle, counts the trade goods, and records everything in a leather-bound ledger. His pen scratches across the page. "The Company does not look kindly on unrecorded freight," he says without looking up.',
      classification: "Trade & Regulation",
      source: getSource("HBC_INSPECTION"),
      choices: [
        { text: "Submit to inspection", dc: null, always: "You open your cart and let him count. He finds nothing contraband and waves you through. The process costs you an hour.", morale: -3 },
        { text: "Politely decline \u2014 your goods are personal", dc: 11, ok: 'The factor considers, then steps aside. "Very well. But the Company watches."', bad: 'He calls the clerk back. "Every cart gets inspected." You lose time and face.', morale: -5, okMorale: -2, badMorale: -5, time: 1 },
        { text: "Offer a small gift to ease the process", dc: null, always: `You pass a tin of tea across the counter. The factor's expression softens almost imperceptibly. "You may proceed." Sometimes grease moves the wheel.`, morale: 2 }
      ]
    },
    {
      id: "hbc_rivalry",
      text: `A free trader at the post pulls you aside. He's heard the HBC is offering below-market prices for hides \u2014 trying to undercut the independent freighters. "They want to starve us out," he says. "But we know the trails they don't." He offers to buy your hides at a better rate \u2014 quietly.`,
      classification: "Free Trade",
      source: getSource("HBC_RIVALRY"),
      choices: [
        { text: "Sell him your hides under the table", dc: 10, ok: "A quiet exchange behind the stable. His prices are fair and the factor never knows.", bad: "A Company servant spots the exchange. The factor notes your name in his ledger.", morale: 5 },
        { text: "Decline \u2014 you don't want trouble with the Company", dc: null, always: `You shake your head. The free trader shrugs. "Your choice. But the Company won't thank you for loyalty."`, morale: 2 },
        { text: "Ask what else he knows about the trail ahead", dc: 9, ok: "He tells you about a washed-out ford two days ahead \u2014 and a detour that saves half a day. Information is its own currency.", bad: "He wants payment for what he knows. Your pemmican buys a rumor you could have figured out yourself.", morale: 1, food: -1, okFood: 0, badFood: -1 }
      ]
    },
    {
      id: "hbc_forage_shortage",
      text: `The fort's pemmican stores are running low. The factor announces rations for all freighters passing through \u2014 half portions only. "The hunt was poor this season," he says, as though the prairie were accountable to him. Your own supplies feel lighter already.`,
      classification: "Supply & Scarcity",
      source: getSource("HBC_JOURNAL"),
      choices: [
        { text: "Ration carefully \u2014 the trail ahead may be lean", dc: null, always: "You tighten the belt and pack what you have. The prairie doesn't care about your hunger.", morale: -3 },
        { text: "Buy extra pemmican at the Company store", dc: null, always: "The prices are steep \u2014 the Company always charges more when supplies run thin \u2014 but full stomachs keep the crew steady.", morale: 3 },
        { text: "Offer to hunt for the fort in exchange for provisions", dc: 10, ok: "You ride out and return with enough meat to fill your bags and then some. The factor nods \u2014 the closest thing to praise you'll get.", bad: "The prairie gives nothing freely. You return empty-handed and a day poorer.", morale: -4, okMorale: -2, badMorale: -6, food: -1, okFood: 0, badFood: -1 }
      ]
    }
  ],
  nwmp: [
    {
      id: "nwmp_checkpoint",
      text: 'The NWMP post sits at the crossroads like a sentry. A constable steps into the path of your cart and raises his hand. "Papers, please." Behind him, another Mountie sorts through a wagon of trade goods, item by item. The Law rides a slow horse, but it rides.',
      classification: "Law & Order",
      source: getSource("NWMP_DUTY"),
      choices: [
        { text: "Present your papers and wait", dc: null, always: "The constable examines your permit, compares it to his ledger, and waves you through. The delay costs you half a day.", morale: -2, time: 1 },
        { text: "Ask what the inspection is looking for", dc: 9, ok: `"Contraband spirits, mostly," the constable says. "There's rum-runners working the trail. You don't look like rum-runners." He waves you on.`, bad: `"That's police business." The inspection takes longer than it needs to.`, morale: -3, okMorale: -1, badMorale: -6, time: 1 },
        { text: "Report suspicious activity on the trail ahead", dc: null, always: 'You mention the free traders you saw crossing the river without permits. The constable writes it down. "Every detail helps." You feel like an informant, but the law appreciates the help.', morale: -2 }
      ]
    },
    {
      id: "nwmp_deserter",
      text: `Outside the NWMP post, a man in civilian clothes sits in irons. His uniform \u2014 what's left of it \u2014 is folded on the post step. A sergeant explains to passersby: "Deserted his post. Threw away his badge and tried to walk into the prairie. Walked right back hungry three days later." The man stares at the ground.`,
      classification: "Law & Desertion",
      source: getSource("NWMP_DESERTER"),
      choices: [
        { text: "Offer him food before you go", dc: null, always: "You pass a strip of pemmican through the bars. The man takes it without a word. It's a small thing, but the trail teaches you that small things matter.", morale: 3 },
        { text: "Walk on \u2014 discipline is its own lesson", dc: null, always: "You pass without looking back. The Mounties have their justice. You have your trail.", morale: -1 }
      ]
    }
  ],
  metis: [
    {
      id: "metis_welcome",
      text: "The M\xE9tis camp has been expecting you \u2014 news travels fast along the trail. Before the cart fully stops, children are running alongside and a woman is already lifting the lid off a pot of rubaboo. The smell of onions and grease and prairie herbs. Someone tunes a fiddle.",
      classification: "Community & Hospitality",
      source: getSource("METIS_WELCOME"),
      choices: [
        { text: "Stay for the meal and the music", dc: null, always: "You eat until you can't eat more. The fiddle starts. An old man tells a story about the Sayer trial, and everyone laughs like it happened yesterday.", morale: 10 },
        { text: "Trade greetings and move on", dc: 8, ok: 'You share news and accept a bundle of dried berries. The women press bannock into your hands "for the children."', bad: "You're in a hurry, but the women notice. It costs nothing to sit for a moment.", morale: 3 },
        { text: "Ask about conditions on the trail ahead", dc: 9, ok: "An elder tells you the river is running high and the ferry has been pulled. She knows a shallow ford a mile north.", bad: 'They exchange glances. "The trail tells you what it wants when it wants to." Not helpful.', morale: 1 }
      ]
    },
    {
      id: "metis_court",
      text: "At the edge of the settlement, two freighters stand facing each other while the camp overseer listens to both sides. One claims the other stole from his cached pemmican. The other denies it. The camp has gathered to watch \u2014 the trail has its own court, and its sessions are public.",
      classification: "Trail Justice",
      source: getSource("METIS_COURT"),
      choices: [
        { text: "Quietly tell what you saw \u2014 the accused DID take from the cache", dc: null, always: "You step forward and describe what you saw. The overseer rules that the accused returns half the pemmican and gives a third to a widow. Justice on the trail is swift and visible.", morale: 3 },
        { text: "Stay out of it \u2014 not your dispute", dc: null, always: "You keep your eyes on your own cart. The trail teaches you to mind your own freight.", morale: 0 },
        { text: "Offer to share some of your own pemmican to settle it", dc: null, always: 'You step forward with a bundle of pemmican. "Let this settle it." Both men look surprised. The overseer nods. The widow gets her share and the dispute ends.', morale: 5 }
      ]
    }
  ],
  mission: [
    {
      id: "mission_charity",
      text: `A Grey Nun approaches your cart with a wooden bowl of pottage. Behind her, another tends to a man with a bandaged leg. "You look like you've been on the trail a while," she says. The soup is thin but warm, and her hands are gentle when she checks your crew for fever.`,
      classification: "Charity & Healing",
      source: getSource("MISSION_CHARITY"),
      choices: [
        { text: "Accept the food and let the nun check your crew", dc: null, always: `The nun finds one of your crew running a cool fever. She packs the man's forehead with a cold cloth and gives you herbs for the trail. "He should rest a day if you can afford it."`, morale: 8, crew: 1 },
        { text: "Thank her but press on \u2014 you can't afford the delay", dc: null, always: 'You take the pottage and move on. The nun watches you go with eyes that have seen a thousand carts roll past. "God keep you," she calls after you.', morale: 3 },
        { text: "Leave a small offering for the mission", dc: null, always: "You place a bundle of tea on the mission step. The nun presses your hand. What you give on the trail has a way of coming back.", morale: 5 }
      ]
    },
    {
      id: "mission_snow_blind",
      text: `Inside the mission, a child sits with bandaged eyes. A nun explains quietly: "Snow blindness. The glare off the prairie. We're doing what we can, but he may not see clearly again." The boy sits very still, as though stillness might help. His mother holds his hand.`,
      classification: "Hardship & Loss",
      source: getSource("MISSION_BLINDING"),
      choices: [
        { text: "Sit with the mother for a moment", dc: null, always: "You don't say anything. You don't need to. The mother nods. Sometimes the trail takes things you can't carry back.", morale: -3 },
        { text: "Leave food for the family", dc: null, always: "You quietly add your pottage to the mission's stores. The nun sees and whispers a prayer for you.", morale: 2 }
      ]
    }
  ],
  trading: [
    {
      id: "trading_news",
      text: "The trading post buzzes with news from the trail. Travellers share stories over tin cups of tea: a river crossing washed out, a cache of supplies raided by bears, a new detachment of Mounted Police two days ahead. Every traveller has a story, and every story might save your life.",
      classification: "Trail News",
      source: getSource("HBC_JOURNAL"),
      choices: [
        { text: "Listen carefully and trade what you know", dc: 8, ok: "The exchange is fair \u2014 your news for theirs. You learn of a shorter route through the uplands that saves a day.", bad: "The other traders hold their cards close. You learn nothing useful.", morale: 2 },
        { text: "Buy a hot meal and a warm bed for the night", dc: null, always: "The post charges extra for comfort, but you sleep on straw instead of prairie grass. The crew wakes rested.", morale: 6 }
      ]
    }
  ]
};
function getSettlementEvents(settlementType) {
  return SETTLEMENT_EVENTS[settlementType] || SETTLEMENT_EVENTS.hbc || [];
}
__name(getSettlementEvents, "getSettlementEvents");
function pickSettlementEvent(settlementType, rng) {
  const pool = getSettlementEvents(settlementType);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}
__name(pickSettlementEvent, "pickSettlementEvent");
function getEventsForTerrain(terrain) {
  return EVENT_POOLS[terrain] || EVENT_POOLS.plains;
}
__name(getEventsForTerrain, "getEventsForTerrain");
function pickEventForTerrain(terrain, rng) {
  const pool = getEventsForTerrain(terrain);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}
__name(pickEventForTerrain, "pickEventForTerrain");

// src/systems/engine.js
function createGame(seed = null) {
  const rng = makeRNG(seed);
  function rand() {
    return rng ? rng() : Math.random();
  }
  __name(rand, "rand");
  function d() {
    return d20(rand);
  }
  __name(d, "d");
  function blessingMod() {
    return S.blessingDays > 0 ? 1 : 0;
  }
  __name(blessingMod, "blessingMod");
  function pickWeighted(weights) {
    const total = Object.values(weights).reduce((s, w) => s + w, 0);
    let r = rand() * total;
    for (const [key, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return key;
    }
    return Object.keys(weights)[0];
  }
  __name(pickWeighted, "pickWeighted");
  function initWeather() {
    return pickWeighted(CONSTANTS.SEASON_BASE_WEATHER[seasonFor(CONSTANTS.START_MONTH)]);
  }
  __name(initWeather, "initWeather");
  function advanceWeather() {
    const seasonWeights = CONSTANTS.SEASON_BASE_WEATHER[seasonFor(S.month)];
    let next = pickWeighted(CONSTANTS.WEATHER_TRANSITION[S.weather]);
    if (seasonWeights[next] === 0) {
      next = "overcast";
    }
    S.weather = next;
  }
  __name(advanceWeather, "advanceWeather");
  const cart = startingCart();
  const S = {
    seed,
    day: 1,
    month: CONSTANTS.START_MONTH,
    year: CONSTANTS.YEAR,
    date: { month: CONSTANTS.START_MONTH, day: CONSTANTS.START_DAY },
    season: seasonFor(CONSTANTS.START_MONTH),
    crew: "rested",
    food: 0,
    // starting food added via pre-departure confirm
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
    fines: 0
  };
  function checkGameOver() {
    if (S.over) return;
    if (S.food <= 0) {
      S.food = 0;
      S.over = true;
      S.endReason = "starvation";
    }
    if (S.wear >= CONSTANTS.MAX_WEAR) {
      S.over = true;
      S.endReason = "cart_failure";
    }
    if (S.season === "early winter" && S.node < NODES.length - 1) {
      S.over = true;
      S.endReason = "winter";
    }
    if (S.morale <= 0) {
      S.morale = 0;
      S.over = true;
      S.endReason = "abandoned";
    }
  }
  __name(checkGameOver, "checkGameOver");
  function advance() {
    const next = advanceDate(S.date.month, S.date.day, 0);
    S.date = next;
    S.month = next.month;
    S.day++;
    S.season = seasonFor(S.month);
  }
  __name(advance, "advance");
  function resolveChoice(ev, ci) {
    const ch = ev.choices[ci];
    const result = { roll: null, total: null, dc: null, success: null, text: "", effects: [], flags: [], reps: [] };
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
      const success2 = total >= effectiveDC;
      result.roll = roll;
      result.total = total;
      result.dc = effectiveDC;
      result.success = success2;
      result.mod = total - roll;
      result.modBreakdown = [];
      if (crewBonus) result.modBreakdown.push(`Crew ${crewBonus >= 0 ? "+" : ""}${crewBonus}`);
      if (wearBonus) result.modBreakdown.push(`Wear ${wearBonus >= 0 ? "+" : ""}${wearBonus}`);
      if (blessingBonus) result.modBreakdown.push("Blessing +1");
      result.text = success2 ? `Success. ${ch.ok}` : `Failure. ${ch.bad}`;
      if (bonusItemName) {
        result.effects.push(`(${bonusItemName} \u2212${dcReduction} DC)`);
      }
      if (!success2) {
        const w = ch.badWear !== void 0 ? ch.badWear : ch.wear || 0;
        if (w) {
          S.wear = Math.max(0, S.wear + w);
          result.effects.push(`${w >= 0 ? "+" : ""}${w} Wear`);
        }
      } else {
        const w = ch.okWear !== void 0 ? ch.okWear : ch.wear;
        if (w) {
          S.wear = Math.max(0, S.wear + w);
          result.effects.push(`${w >= 0 ? "+" : ""}${w} Wear`);
        }
      }
    } else if (ch.always) {
      result.text = ch.always;
      result.success = true;
      if (ch.alwaysWear) {
        S.wear = Math.max(0, S.wear + ch.alwaysWear);
        result.effects.push(`${ch.alwaysWear >= 0 ? "+" : ""}${ch.alwaysWear} Wear`);
      }
    }
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
    const success = result.success === true;
    const failure = result.success === false;
    if (success) {
      if (ch.okFood !== void 0) {
        S.food += ch.okFood;
        result.effects.push(`${ch.okFood > 0 ? "+" : ""}${ch.okFood} Food`);
      } else if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? "+" : ""}${ch.food} Food`);
      }
      if (ch.okMorale !== void 0) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.okMorale));
        result.effects.push(`${ch.okMorale >= 0 ? "+" : ""}${ch.okMorale} Morale`);
      } else if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? "+" : ""}${ch.morale} Morale`);
      }
      if (ch.okTime !== void 0) {
        if (ch.okTime > 0) {
          advance();
          result.effects.push(`+${ch.okTime} day(s)`);
        } else if (ch.okTime < 0) {
          S.segmentDay = Math.max(0, S.segmentDay + ch.okTime);
          result.effects.push(`${ch.okTime} day(s)`);
        }
      } else if (ch.time) {
        if (ch.time > 0) {
          advance();
          result.effects.push(`+${ch.time} day(s)`);
        }
        if (ch.time < 0) {
          S.segmentDay = Math.max(0, S.segmentDay + ch.time);
          result.effects.push(`${ch.time} day(s)`);
        }
      }
      if (ch.okCrew) {
        S.crew = ch.okCrew;
        result.effects.push(`Crew: ${ch.okCrew}`);
      } else if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
      if (ch.addsRep) {
        S.reputation[ch.addsRep.key] = (S.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
        result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S.reputation[ch.addsRep.key] });
      }
      if (ch.okRep) {
        S.reputation[ch.okRep.key] = (S.reputation[ch.okRep.key] || 0) + ch.okRep.delta;
        result.reps.push({ key: ch.okRep.key, delta: ch.okRep.delta, value: S.reputation[ch.okRep.key] });
      }
    } else if (failure) {
      if (ch.badFood !== void 0) {
        S.food += ch.badFood;
        result.effects.push(`${ch.badFood > 0 ? "+" : ""}${ch.badFood} Food`);
      } else if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? "+" : ""}${ch.food} Food`);
      }
      if (ch.badMorale !== void 0) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.badMorale));
        result.effects.push(`${ch.badMorale >= 0 ? "+" : ""}${ch.badMorale} Morale`);
      } else if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? "+" : ""}${ch.morale} Morale`);
      }
      if (ch.badTime !== void 0) {
        if (ch.badTime > 0) {
          advance();
          result.effects.push(`+${ch.badTime} day(s)`);
        } else if (ch.badTime < 0) {
          S.segmentDay = Math.max(0, S.segmentDay + ch.badTime);
          result.effects.push(`${ch.badTime} day(s)`);
        }
      } else if (ch.time) {
        if (ch.time > 0) {
          advance();
          result.effects.push(`+${ch.time} day(s)`);
        }
        if (ch.time < 0) {
          S.segmentDay = Math.max(0, S.segmentDay + ch.time);
          result.effects.push(`${ch.time} day(s)`);
        }
      }
      if (ch.badCrew) {
        S.crew = ch.badCrew;
        result.effects.push(`Crew: ${ch.badCrew}`);
      } else if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
    }
    if (result.success === null) {
      if (ch.food) {
        S.food += ch.food;
        result.effects.push(`${ch.food > 0 ? "+" : ""}${ch.food} Food`);
      }
      if (ch.morale) {
        S.morale = Math.max(0, Math.min(100, S.morale + ch.morale));
        result.effects.push(`${ch.morale >= 0 ? "+" : ""}${ch.morale} Morale`);
      }
      if (ch.crew) {
        S.crew = ch.crew;
        result.effects.push(`Crew: ${ch.crew}`);
      }
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
          const template = ITEMS.find((i) => i.name === g.name);
          cart.push({
            name: g.name,
            count: g.amt,
            wt: template ? template.wt : 0,
            icon: template ? template.icon : "\u{1F4E6}",
            type: template ? template.type : "provisions",
            category: template ? template.category : "general",
            desc: template ? template.desc : ""
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
            icon: template ? template.icon : "\u{1F4E6}",
            type: template ? template.type : "provisions",
            category: template ? template.category : "general",
            desc: template ? template.desc : ""
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
    if (ch.extraProgress) {
      S.segmentDay += ch.extraProgress;
      result.effects.push(`+${ch.extraProgress} progress`);
    }
    if (result.success === false && ch.badGive) {
      ch.badGive.forEach((g) => {
        const item = cart.find((i) => i.name === g.name);
        if (item) {
          item.count += g.amt;
          result.effects.push(`${g.amt >= 0 ? "+" : ""}${g.amt} ${g.name}`);
        }
      });
    }
    if (ch.setsFlag) {
      S.flags[ch.setsFlag] = true;
      result.flags.push(ch.setsFlag);
    }
    if (ch.branch && !S.pendingEvent) {
      const branched = typeof ch.branch === "function" ? ch.branch({ flags: S.flags, reputation: S.reputation, rng: rand }) : ch.branch;
      if (branched) S.pendingEvent = branched;
    }
    S.eventsResolved++;
    return result;
  }
  __name(resolveChoice, "resolveChoice");
  function pickEvent() {
    if (rand() > CONSTANTS.EVENT_CHANCE) return null;
    return pickEventForTerrain(NODES[S.node]?.terrain || "plains", rand);
  }
  __name(pickEvent, "pickEvent");
  function pickEventWithChance(chance) {
    if (rand() > chance) return null;
    return pickEventForTerrain(NODES[S.node]?.terrain || "plains", rand);
  }
  __name(pickEventWithChance, "pickEventWithChance");
  function calcScore() {
    if (!S.won) return 0;
    const daysPenalty = S.day;
    const wearPenalty = S.wear * S.wear;
    const foodBonus = Math.min(S.food, 25);
    const crewBonus = S.crew === "rested" ? 30 : S.crew === "tired" ? 10 : 0;
    const noRestPenalty = Math.max(0, S.travelDaysWithoutRest - 3) * 10;
    const tradeGoodsCount = cart.filter((i) => i.type === "trade" || i.category === "furs").reduce((s, i) => s + i.count, 0);
    const tradeBonus = tradeGoodsCount * 150;
    let score = 1e3;
    score += tradeBonus;
    score += foodBonus * 15;
    score += crewBonus;
    score -= daysPenalty * 5;
    score -= wearPenalty * 25;
    score -= noRestPenalty;
    return Math.max(1, Math.round(score));
  }
  __name(calcScore, "calcScore");
  const stepLog = [];
  function travelOneDay2() {
    if (S.over || S.pendingSettlement) return stepLog;
    const nextDist = NODES[S.node + 1]?.dist || 1;
    const usedWeight = totalWeight(cart);
    const weightRatio = usedWeight / CONSTANTS.CART_CAPACITY;
    const travelMult = 1 + weightRatio * CONSTANTS.WEIGHT_TRAVEL_MULT;
    const wearMult = 1 + weightRatio * CONSTANTS.WEIGHT_WEAR_MULT;
    advanceWeather();
    const weatherFood = CONSTANTS.WEATHER_FOOD_MOD[S.weather] || 0;
    const foodBefore = S.food;
    S.food = Math.max(0, Math.round((S.food - CONSTANTS.DAILY_FOOD - weatherFood) * 10) / 10);
    if (S.food <= 0) {
      S.morale = Math.max(0, S.morale - 10);
      S.crew = "exhausted";
      S.wear = Math.min(CONSTANTS.MAX_WEAR, S.wear + 1);
      checkGameOver();
      if (S.over) return stepLog;
    }
    S.segmentDay += travelMult;
    S.travelDaysWithoutRest++;
    advance();
    if (S.blessingDays > 0) S.blessingDays--;
    const wearChance = { plains: 0.1, river_valley: 0.15, wooded: 0.2 };
    const weatherWearMult = CONSTANTS.WEATHER_WEAR_MULT[S.weather] || 1;
    if (rand() < (wearChance[NODES[S.node].terrain] || 0.2) * weatherWearMult * wearMult) S.wear++;
    if (S.wear >= 4 && rand() < 0.35) {
      S.pendingEvent = getSquealEvent();
      return stepLog;
    }
    if (S.travelDaysWithoutRest >= 5 && S.crew !== "exhausted") S.crew = "exhausted";
    else if (S.travelDaysWithoutRest >= 3 && S.crew === "rested") S.crew = "tired";
    const weatherMorale = CONSTANTS.WEATHER_MORALE_MOD[S.weather] || 0;
    S.morale = Math.max(0, Math.min(100, S.morale - 2 + weatherMorale));
    if (S.day % CONSTANTS.DAYS_PER_WEEK === 0 && !S.pendingSettlement) {
      S.crew = "rested";
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
        if (S.food <= 0) {
          S.endReason = "starvation";
        } else if (S.wear >= CONSTANTS.MAX_WEAR) {
          S.endReason = "cart_failure";
        } else if (S.morale <= 0) {
          S.endReason = "abandoned";
        } else {
          S.won = true;
          S.score = calcScore();
          S.endReason = "victory";
        }
        return stepLog;
      }
      if (n.type !== "river" && S.node >= 1) S.pendingSettlement = n;
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
  __name(travelOneDay2, "travelOneDay");
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
        S.won = true;
        S.score = calcScore();
      } else {
        const n = NODES[S.node];
        if (n.type !== "river") S.pendingSettlement = n;
        if (S.pendingSettlement && rand() < 0.3) {
          const sev = pickSettlementEvent(S.pendingSettlement.type, rand);
          if (sev) S.pendingEvent = sev;
        }
      }
    }
    checkGameOver();
    return [{ action: "eventResolved", event: ev.id, choiceIndex, result }];
  }
  __name(chooseEventChoice, "chooseEventChoice");
  function makeCamp() {
    if (S.pendingSettlement || S.over) return;
    S.food--;
    S.camps++;
    S.travelDaysWithoutRest = 0;
    if (S.crew === "exhausted") S.crew = "tired";
    else if (S.crew === "tired") S.crew = "rested";
    const campMorale = CONSTANTS.WEATHER_CAMP_MORALE[S.weather] ?? 15;
    S.morale = Math.min(100, S.morale + campMorale);
    advance();
    checkGameOver();
  }
  __name(makeCamp, "makeCamp");
  function pushOn2() {
    if (S.pendingSettlement || S.over) return;
    S.food = Math.max(0, Math.round((S.food - 1.5) * 10) / 10);
    S.wear = Math.min(S.wear + 1, 99);
    S.morale = Math.max(0, S.morale - 5);
    S.travelDaysWithoutRest++;
    if (S.travelDaysWithoutRest >= 5 && S.crew !== "exhausted") S.crew = "exhausted";
    else if (S.travelDaysWithoutRest >= 3 && S.crew === "rested") S.crew = "tired";
    advance();
    checkGameOver();
  }
  __name(pushOn2, "pushOn");
  function getSettlementActionsByType(type) {
    const barter = CONSTANTS.SETTLEMENT_BARTER[type] || CONSTANTS.SETTLEMENT_BARTER.hbc;
    const actions = [];
    const DISPLAY_NAMES = {
      "any_fur": "Any Fur/Pelt",
      "Pemmican Rations": "Pemmican Rations",
      "rested": "Rested",
      "Morale": "Morale",
      "blessingDays": "Blessing",
      "trail_intel": "Trail Intel",
      "hasPermit": "Permit",
      "finesCleared": "Fines Cleared",
      "ReputationMetis": "Reputation"
    };
    function displayName(name) {
      return DISPLAY_NAMES[name] || name.replace(/_/g, " ");
    }
    __name(displayName, "displayName");
    for (const [actionId, trade] of Object.entries(barter)) {
      if (trade.giveOptions) {
        trade.giveOptions.forEach((opt, idx) => {
          const giveDesc = opt.give.map((g) => `${g.count} ${displayName(g.name)}`).join(" + ");
          const receiveDesc = opt.receive.map((r) => `${r.count} ${displayName(r.name)}`).join(", ");
          const baseLabel = actionId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          actions.push({
            id: `${actionId}_${idx}`,
            label: `${baseLabel} (${giveDesc})`,
            cost: giveDesc || "Free",
            risk: receiveDesc,
            flavor: trade.flavor,
            desc: trade.desc
          });
        });
      } else if (trade.options) {
        const baseLabel = actionId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        trade.options.forEach((opt, idx) => {
          const giveDesc = trade.give.map((g) => `${g.count} ${displayName(g.name)}`).join(" + ");
          const receiveDesc = opt.receive.map((r) => `${r.count} ${displayName(r.name)}`).join(", ");
          actions.push({
            id: `${actionId}_${opt.id}`,
            label: opt.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            cost: giveDesc || "Free",
            risk: receiveDesc,
            flavor: opt.flavor,
            desc: trade.desc,
            groupId: actionId,
            groupLabel: baseLabel,
            groupIndex: idx
          });
        });
      } else {
        const giveDesc = trade.give.map((g) => `${g.count} ${displayName(g.name)}`).join(" + ");
        const receiveDesc = trade.receive.map((r) => `${r.count} ${displayName(r.name)}`).join(", ");
        actions.push({
          id: actionId,
          label: actionId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          cost: giveDesc || "Free",
          risk: receiveDesc,
          flavor: trade.flavor,
          desc: trade.desc
        });
      }
    }
    return actions;
  }
  __name(getSettlementActionsByType, "getSettlementActionsByType");
  return {
    travelOneDay: travelOneDay2,
    makeCamp,
    pushOn: pushOn2,
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
        currentTerrain: NODES[S.node]?.terrain || "plains",
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
        seed: S.seed
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
      const item = cart.find((i) => i.name === itemId);
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
        multiplier: mult
      };
    },
    tradeItem(itemName) {
      const idx = cart.findIndex((i) => i.name === itemName);
      if (idx === -1 || cart[idx].count <= 0) return null;
      cart[idx].count--;
      const item = cart[idx];
      const est = this.getTradeEstimate(itemName, 1, S.pendingSettlement?.type || item?.category || "hbc");
      if (!est) return null;
      S.food += est.sellPrice;
      S.tradesMade++;
      return { item: itemName, foodGain: est.sellPrice };
    },
    // ── NEW Engine API for Sprint 3 ───────────────────────────────────
    getSettlementActions(settlementType) {
      const actions = getSettlementActionsByType(settlementType);
      return actions.map((a) => ({
        id: a.id,
        label: a.label,
        cost: a.cost,
        risk: a.risk,
        flavor: a.flavor,
        desc: a.desc,
        groupId: a.groupId || null,
        groupLabel: a.groupLabel || null,
        groupIndex: a.groupIndex || 0
      }));
    },
    settlementAction(actionId, params = {}) {
      if (!S.pendingSettlement) return { error: "No settlement pending" };
      const type = S.pendingSettlement.type;
      const state = S;
      const result = executeSettlementAction(actionId, type, state, cart, params);
      if (result && !result.error) {
        S.pendingSettlement = null;
      }
      checkGameOver();
      return result || {};
    },
    getEndgameScore() {
      const state = S;
      const foodBonus = Math.min(state.food, 25);
      const crewBonus = state.crew === "rested" ? 30 : state.crew === "tired" ? 10 : 0;
      const daysPenalty = state.day * 8;
      const wearPenalty = state.wear * state.wear * 40;
      const baseScore = 500;
      const RARITY_MULT = {
        "Prime Bison Hide": 5,
        "Prime Elk Hide": 5,
        "Prime Beaver Pelt": 5,
        "Prime Wolf Pelt": 5,
        "Bison Hide": 3,
        "Elk Hide": 3,
        "Beaver Pelt": 2,
        "Wolf Pelt": 2
      };
      let tradeBonus = 0;
      let tradeGoodsCount = 0;
      let primeCount = 0;
      let typesCollected = /* @__PURE__ */ new Set();
      if (state.won) {
        const tradeItems = cart.filter((i) => i.type === "trade" || i.category === "furs");
        for (const item of tradeItems) {
          const mult = RARITY_MULT[item.name] || 1;
          tradeBonus += item.count * 50 * mult;
          tradeGoodsCount += item.count;
          if (mult >= 5) primeCount += item.count;
          typesCollected.add(item.name);
        }
      }
      const moraleBonus = Math.floor(state.morale / 2);
      const blessingBonus = (state.blessingDays || 0) * 10;
      const speedBonus = state.day <= 40 ? 100 : state.day <= 50 ? 50 : 0;
      const foodScore = foodBonus * 12;
      const total = baseScore + tradeBonus + foodScore + crewBonus + moraleBonus + blessingBonus + speedBonus - daysPenalty - wearPenalty;
      let tier = "Defeat";
      if (state.won) {
        const hasAllTypes = typesCollected.size >= 4;
        const noStarvation = state.food > 0;
        const lowWear = state.wear <= 2;
        if (tradeGoodsCount >= 5 && state.crew === "rested") {
          if (hasAllTypes && noStarvation && lowWear && primeCount >= 2) {
            tier = "Legendary";
          } else {
            tier = "Prosperous";
          }
        } else if (tradeGoodsCount >= 3 && state.food > 0) {
          tier = "Trader";
        } else {
          tier = "Survivor";
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
          wearPenalty: Math.round(-wearPenalty)
        },
        tier,
        tradeGoodsCount,
        primeCount,
        typesCollected: typesCollected.size
      };
    },
    getSettlementData(nodeId) {
      const idx = NODES.findIndex((n) => n.id === nodeId);
      if (idx === -1) return null;
      const node = NODES[idx];
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        terrain: node.terrain,
        desc: node.desc,
        dist: node.dist,
        priceMultiplier: getSettlementPriceMultiplier(node.type)
      };
    },
    getAvailableRecipes() {
      const recipes = [
        {
          id: "finished_hides",
          name: "Finished Hides",
          inputs: [
            { name: "Bison Hide", count: 2 },
            { name: "Shaganappi", count: 1 }
          ],
          output: { name: "Finished Hides", icon: "\u{1F7EB}" },
          settlement: "hbc"
        },
        {
          id: "travois_kit",
          name: "Travois Kit",
          inputs: [
            { name: "Shaganappi", count: 2 },
            { name: "Rope (50ft)", count: 1 }
          ],
          output: { name: "Travois Kit", icon: "\u{1F6D2}" },
          settlement: "metis"
        },
        {
          id: "gunpowder_pack",
          name: "Gunpowder Pack",
          inputs: [
            { name: "Ammunition Belt", count: 1 },
            { name: "Tool Kit", count: 1 }
          ],
          output: { name: "Gunpowder Pack", icon: "\u{1F4A5}" },
          settlement: "nwmp"
        }
      ];
      return recipes.filter((r) => {
        const n = NODES[S.node];
        return !r.settlement || r.settlement === n.type;
      }).map((r) => ({
        ...r,
        inputs: r.inputs.map((inp) => {
          const have = cart.find((c) => c.name === inp.name)?.count || 0;
          return { ...inp, have };
        })
      }));
    },
    campAction(type, extraFood = 0) {
      const action = String(type || "").toLowerCase();
      const costItems = [];
      const effects = [];
      const itemEffects = [];
      let roll = null;
      let rollTotal = null;
      let critical = false;
      if (action === "rest") {
        const foodCost = 1 + extraFood;
        if (S.food < foodCost) return { error: "Not enough food to rest." };
        S.food -= foodCost;
        costItems.push({ name: "Food", count: -foodCost });
        const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
        const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
        const hasFirewood2 = cart.some((i) => i.name === "Firewood Bundle" && i.count > 0);
        const isWetWeather = ["rain", "storm", "snow"].includes(S.weather);
        const isColdWeather = ["snow"].includes(S.weather);
        roll = d();
        const restBonus = Math.min(extraFood, 2) * 2;
        let itemBonus = 0;
        if (hasTarp && isWetWeather) {
          itemBonus += 2;
          itemEffects.push("Canvas Tarp kept the damp off. +2 rest bonus.");
        }
        if (hasBlanket && isColdWeather) {
          itemBonus += 3;
          itemEffects.push("Blankets held the cold at bay. +3 rest bonus.");
        }
        if (hasFirewood2 && isColdWeather) {
          itemBonus += 2;
          itemEffects.push("Firewood warmed the camp. +2 rest bonus.");
        }
        rollTotal = roll + crewMod(S) + restBonus + itemBonus;
        if (roll === 1) {
          critical = true;
          S.crew = "tired";
          S.morale = Math.max(0, S.morale - 3);
          S.travelDaysWithoutRest = 0;
          effects.push("Critical failure: the camp is a disaster \u2014 cold, sleepless, demoralizing.", "Morale -3", "Crew tired");
        } else if (rollTotal >= 15) {
          S.crew = "rested";
          S.morale = Math.max(0, Math.min(100, S.morale + 20 + extraFood * 5 + itemBonus));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push("Wonderful rest.", "Crew rested", `Morale +${20 + extraFood * 5 + itemBonus}`, "Wear -1");
        } else if (rollTotal >= 8) {
          S.crew = "rested";
          S.morale = Math.max(0, Math.min(100, S.morale + 15 + extraFood * 3 + itemBonus));
          S.wear = Math.max(0, S.wear - 1);
          S.travelDaysWithoutRest = 0;
          effects.push("Crew rested", `Morale +${15 + extraFood * 3 + itemBonus}`, "Wear -1");
        } else {
          S.crew = "tired";
          S.morale = Math.max(0, Math.min(100, S.morale + 5 + extraFood * 2 + itemBonus));
          S.travelDaysWithoutRest = 0;
          effects.push("Rough night.", `Morale +${5 + extraFood * 2 + itemBonus}`, "Crew tired");
        }
      } else if (action === "forage") {
        roll = d();
        const forageBonus = Math.min(extraFood, 2) * 2;
        rollTotal = roll + crewMod(S) + forageBonus;
        if (roll === 1) {
          critical = true;
          advance();
          effects.push("Critical failure: wasted the whole day. Found nothing.", "+1 day lost");
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
          effects.push("Found little today.");
        }
      } else if (action === "hunt") {
        const ammo = cart.find((i) => i.name === "Ammunition Belt");
        if (!ammo || ammo.count < 1) return { error: "Need 1 Ammunition Belt to hunt." };
        ammo.count -= 1;
        costItems.push({ name: "Ammunition Belt", count: -1 });
        const foodCost = extraFood;
        if (foodCost > 0) {
          if (S.food < foodCost) return { error: "Not enough food for extra supplies." };
          S.food -= foodCost;
          costItems.push({ name: "Food", count: -foodCost });
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
          effects.push("Critical failure: shot went wide, startled the game, lost ammo.", "Morale -2");
        } else if (rollTotal >= 10) {
          const terrain = NODES[S.node]?.terrain || "plains";
          const yields = CONSTANTS.HUNT_YIELDS[terrain] || CONSTANTS.HUNT_YIELDS.plains;
          const weights = CONSTANTS.HUNT_RARITY_WEIGHTS;
          const rarityRoll = Math.random();
          let yieldResult = { type: "food", item: null };
          if (rarityRoll < weights.food) {
            yieldResult.type = "food";
          } else if (rarityRoll < weights.food + weights.common) {
            yieldResult.type = "common";
            yieldResult.item = yields.common;
          } else {
            yieldResult.type = "rare";
            yieldResult.item = yields.rare;
          }
          if (yieldResult.type === "food") {
            meatGain = Math.floor(Math.random() * (yields.foodMax - yields.foodMin + 1)) + yields.foodMin;
          } else if (yieldResult.type === "common") {
            meatGain = Math.floor(yields.foodMin / 2) + 1;
          } else {
            meatGain = Math.floor(yields.foodMin / 2) + 1;
          }
          meatGain += extraFood;
          S.food += meatGain;
          effects.push(`Clean kill. +${meatGain} Food`);
          if (yieldResult.item) {
            const item = yieldResult.item;
            const existing = cart.find((c) => c.name === item.name);
            if (existing) {
              existing.count++;
            } else {
              cart.push({
                name: item.name,
                icon: item.icon,
                type: "trade",
                category: "furs",
                wt: item.wt,
                count: 1,
                desc: item.desc
              });
            }
            resultItems.push({
              name: item.name,
              wt: item.wt,
              rarity: yieldResult.type
              // 'common' or 'rare'
            });
            effects.push(`+1 ${item.name} (${item.wt} kg)`);
          }
        } else {
          effects.push("Shot went wide. No pelts gained.");
        }
        if (roll !== 1 && rollTotal >= 10) {
          return { day: S.day, effects, costItems, roll, rollTotal, critical, food: meatGain, items: resultItems };
        }
      } else if (action === "repair") {
        const shag = cart.find((i) => i.name === "Shaganappi");
        if (!shag || shag.count < 1) return { error: "Need 1 Shaganappi to repair." };
        shag.count -= 1;
        costItems.push({ name: "Shaganappi", count: -1 });
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.wear = Math.min(CONSTANTS.MAX_WEAR, S.wear + 1);
          effects.push("Critical failure: shaganappi wasted, repair botched. Cart worse off.", "Wear +1");
        } else {
          const hasAxle = cart.some((i) => i.name === "Spare Axle");
          const repaired = hasAxle ? 3 : 2;
          S.wear = Math.max(0, S.wear - repaired);
          effects.push(`Wear -${repaired}`);
        }
      } else if (action === "scout") {
        advance();
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.flags["scout_blind"] = true;
          effects.push("Critical failure: scout got turned around. Next event will have no warning.");
        } else if (rollTotal >= 12) {
          const n = NODES[S.node + 1];
          const terrain = n && n.terrain || "plains";
          effects.push(`Scout succeeded. Next leg is ${terrain.replace(/_/g, " ")}.`);
        } else {
          effects.push("Scout returned with nothing clear to report.");
        }
      } else if (action === "dance") {
        roll = d();
        rollTotal = roll + crewMod(S);
        if (roll === 1) {
          critical = true;
          S.morale = Math.max(0, S.morale - 3);
          effects.push("Critical failure: the evening fell flat. Old arguments resurfaced.", "Morale -3");
        } else {
          const bonus = S.crew === "rested" ? 12 : S.crew === "tired" ? 8 : 5;
          S.morale = Math.max(0, Math.min(100, S.morale + bonus));
          effects.push(`Morale +${bonus}`);
        }
      } else if (action === "pemmican_process") {
        if (S.food < 3) return { error: "Need at least 3 Food to process pemmican." };
        S.food -= 3;
        costItems.push({ name: "Food", count: -3 });
        roll = d();
        rollTotal = roll + crewMod(S);
        if (rollTotal >= 12) {
          const gained = Math.floor(Math.random() * 4) + 5;
          S.food += gained;
          S.morale = Math.max(0, Math.min(100, S.morale + 5));
          effects.push(`The women work fast \u2014 slicing, pounding, rendering tallow. +${gained} Pemmican`, "Morale +5");
        } else if (rollTotal >= 7) {
          const gained = Math.floor(Math.random() * 3) + 3;
          S.food += gained;
          effects.push(`Lean processing. +${gained} Pemmican`);
        } else {
          effects.push("The work is slow and the yield is poor. +1 Pemmican");
          S.food += 1;
        }
      } else if (action === "deeprest") {
        if (S.food < 2) return { error: "Need 2 Food for a deep rest." };
        S.food -= 2;
        S.crew = "rested";
        S.morale = Math.max(0, Math.min(100, S.morale + 30));
        S.wear = Math.max(0, S.wear - 2);
        S.travelDaysWithoutRest = 0;
        effects.push("+2 Food spent", "Crew rested", "Morale +30", "Wear -2");
        advance();
        advance();
      } else if (action === "cook") {
        const firewood = cart.find((i) => i.name === "Firewood Bundle");
        if (!firewood || firewood.count < 1) return { error: "Need Firewood to cook." };
        if (S.food < 1) return { error: "Need 1 Food to cook." };
        firewood.count -= 1;
        S.food -= 1;
        costItems.push({ name: "Firewood Bundle", count: -1 }, { name: "Food", count: -1 });
        S.crew = "rested";
        S.morale = Math.max(0, Math.min(100, S.morale + 10));
        const healAmt = S.crew === "exhausted" ? 30 : 20;
        S.morale = Math.max(0, Math.min(100, S.morale + healAmt));
        S.travelDaysWithoutRest = 0;
        effects.push("Cooked a hot meal.", "Firewood used", "Morale +" + (10 + healAmt), "Crew rested");
      } else {
        return { error: "Unknown camp action." };
      }
      if (effects.length === 0 && costItems.length === 0) effects.push("Nothing changes.");
      return { day: S.day, effects, costItems, roll, rollTotal, critical, itemEffects };
    },
    craftRecipe(recipeId) {
      const recipes = this.getAvailableRecipes();
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return null;
      for (const inp of recipe.inputs) {
        const item = cart.find((c) => c.name === inp.name);
        if (!item || item.count < inp.count) return null;
      }
      for (const inp of recipe.inputs) {
        const item = cart.find((c) => c.name === inp.name);
        item.count -= inp.count;
      }
      if (recipe.consumedOnUse) {
        if (recipe.id === "raft" && !S.flags.raftUsed) {
          S.flags.raftUsed = true;
          S.trailIntel = S.trailIntel || [];
          return { applied: "raft" };
        }
        if (recipe.id === "signal_fire") {
          S.trailIntel = S.trailIntel || [];
          S.trailIntel.push({ fromDay: S.day, text: "Signal fire lit.", bonus: { dcBonus: 2 } });
          return { applied: "signal_fire" };
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
          type: "trade",
          category: "furs",
          wt: 3,
          count: 1,
          desc: `Crafted: ${recipe.output.name}.`
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
          actions: getSettlementActionsByType(S.pendingSettlement.type).map((a) => a.id)
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
      const tradeGoods = cart.filter((i) => i.type === "trade" && i.count > 0);
      return {
        score: S.score,
        day: S.day,
        wear: S.wear,
        food: S.food,
        crew: S.crew,
        morale: S.morale,
        won: S.won,
        endReason: S.endReason || "unknown",
        nodes: S.node,
        tradesMade: S.tradesMade,
        camps: S.camps,
        eventsResolved: S.eventsResolved,
        weather: S.weather,
        cartItems: cart.reduce((s, i) => s + i.count, 0),
        tradeGoods: tradeGoods.reduce((s, i) => s + i.count, 0),
        distance: S.node,
        seed: S.seed
      };
    },
    buyItem(name, wt, category) {
      const existing = cart.find((i) => i.name === name);
      if (existing) {
        existing.count++;
      } else {
        cart.push({ name, wt, count: 1, category, type: category === "provisions" ? "food" : "item" });
      }
    },
    addFood(amount) {
      S.food += amount;
    }
  };
}
__name(createGame, "createGame");
function executeSettlementAction(actionId, type, state, cart, params) {
  if (actionId === "continue") {
    state.pendingSettlement = null;
    return { continued: true };
  }
  const barter = CONSTANTS.SETTLEMENT_BARTER[type] || CONSTANTS.SETTLEMENT_BARTER.hbc;
  let matchedTrade = null;
  let matchedOption = null;
  if (barter[actionId]) {
    matchedTrade = barter[actionId];
  } else {
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
  const furItems = cart.filter((i) => (i.type === "trade" || i.category === "furs") && i.count > 0);
  const hasFur = furItems.length > 0;
  const furItem = furItems[0];
  let giveItems = matchedTrade.give || [];
  let receiveItems = matchedOption?.receive || matchedTrade.receive || [];
  if (matchedOption && matchedOption.give) {
    giveItems = matchedOption.give;
  }
  for (const give of giveItems) {
    if (give.name === "any_fur") {
      if (!hasFur) return { error: "No furs to trade" };
    } else if (give.name === "Pemmican Rations") {
      if (state.food < give.count) return { error: `Need ${give.count} food` };
    } else {
      const item = cart.find((i) => i.name === give.name);
      if (!item || item.count < give.count) return { error: `Need ${give.count} ${give.name}` };
    }
  }
  for (const give of giveItems) {
    if (give.name === "any_fur") {
      const idx = cart.findIndex((i) => (i.type === "trade" || i.category === "furs") && i.count > 0);
      if (idx !== -1) {
        cart[idx].count--;
        if (cart[idx].count === 0) cart.splice(idx, 1);
      }
    } else if (give.name === "Pemmican Rations") {
      state.food -= give.count;
    } else {
      const idx = cart.findIndex((i) => i.name === give.name);
      if (idx !== -1) {
        cart[idx].count -= give.count;
        if (cart[idx].count === 0) cart.splice(idx, 1);
      }
    }
  }
  const isRestAction = receiveItems.some((r) => r.name === "rested");
  const isHealAction = actionId === "heal_crew_0" || actionId === "heal_crew_1";
  const itemEffects = [];
  if (isRestAction || isHealAction) {
    const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
    const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
    const hasFirewood2 = cart.some((i) => i.name === "Firewood Bundle" && i.count > 0);
    const isWetWeather = ["rain", "storm", "snow"].includes(state.weather);
    const isColdWeather = ["snow"].includes(state.weather);
    if (hasTarp && isWetWeather) {
      itemEffects.push("Canvas Tarp kept the damp off. +5 Morale.");
      state.morale = Math.min(100, state.morale + 5);
    }
    if (hasBlanket && isColdWeather) {
      itemEffects.push("Blankets held the cold at bay. +8 Morale.");
      state.morale = Math.min(100, state.morale + 8);
    }
    if (hasFirewood2 && isColdWeather) {
      itemEffects.push("Firewood warmed the shelter. +5 Morale.");
      state.morale = Math.min(100, state.morale + 5);
    }
  }
  const results = { flavor: matchedTrade.flavor || matchedOption?.flavor, itemEffects };
  for (const receive of receiveItems) {
    if (receive.name === "Pemmican Rations") {
      state.food += receive.count;
      results.foodGain = (results.foodGain || 0) + receive.count;
    } else if (receive.name === "rested") {
      state.crew = "rested";
      state.travelDaysWithoutRest = 0;
      results.rested = true;
    } else if (receive.name === "Morale") {
      state.morale = Math.min(100, state.morale + receive.count);
      results.moraleGain = (results.moraleGain || 0) + receive.count;
    } else if (receive.name === "blessingDays") {
      state.blessingDays = receive.count;
      results.blessingDays = receive.count;
    } else if (receive.name === "ReputationMetis") {
      state.reputation.metis = (state.reputation.metis || 0) + receive.count;
      results.reputationGain = receive.count;
    } else if (receive.name === "trail_intel") {
      state.trailIntel = state.trailIntel || [];
      const next = NODES[state.node + 1];
      if (next) state.trailIntel.push({ fromDay: state.day, text: `Gossip from ${state.pendingSettlement?.name}: ${next.name} has ${next.terrain.replace(/_/g, " ")} ahead.`, bonus: { dcBonus: 1 } });
      results.gossipGathered = true;
    } else if (receive.name === "hasPermit") {
      state.hasPermit = true;
      results.permitObtained = true;
    } else if (receive.name === "finesCleared") {
      state.fines = 0;
      results.finesPaid = true;
    } else {
      const existing = cart.find((i) => i.name === receive.name);
      if (existing) {
        existing.count += receive.count;
      } else {
        const itemData = ITEMS.find((i) => i.name === receive.name);
        if (itemData) {
          cart.push({ ...itemData, count: receive.count });
        } else {
          cart.push({ name: receive.name, wt: 1, count: receive.count, type: "item", category: "item", mbValue: 0, perishable: false, desc: "" });
        }
      }
      results[`got_${receive.name.replace(/\s+/g, "_").toLowerCase()}`] = receive.count;
    }
  }
  state.tradesMade++;
  return results;
}
__name(executeSettlementAction, "executeSettlementAction");
function getSquealEvent() {
  return {
    id: "squeal_axle",
    text: "The cart axle lets out a piercing shriek \u2014 a sound that carries for miles across the prairie. Every traveller knows that scream. It means a loaded cart with failing wood is coming, and the sound alone is enough to spook oxen and draw attention you do not want.",
    classification: "Cart Damage",
    source: getSource("BREHAUT_CART"),
    choices: [
      {
        text: "Stop and lash the axle with shaganappi",
        dc: 9,
        ok: "The rawhide binds the joint. The scream quiets. You lose the rest of the day to repairs.",
        bad: "The binding slips by morning. The squeal returns, fainter but still there.",
        wear: -1,
        time: 1
      },
      {
        text: "Push on \u2014 silence it at the next settlement",
        dc: null,
        always: "The axle shrieks with every rotation. Your oxen grow nervous. At least the sound fades with distance.",
        morale: -5
      },
      {
        text: "Night camp and attempt a proper repair",
        dc: 11,
        ok: "By firelight you wedge the joint tight. The cart rolls quieter by morning.",
        bad: "Your tools are not enough. The repair holds, but the wear remains.",
        wear: -1,
        time: 1,
        morale: -3
      }
    ]
  };
}
__name(getSquealEvent, "getSquealEvent");

// src/ui/theme.js
function applyTheme(root) {
  root.style.setProperty("--clr-bg", "#efe6d3");
  root.style.setProperty("--clr-panel-bg", "#e3d8b8");
  root.style.setProperty("--clr-journal-bg", "#e3d8b8");
  root.style.setProperty("--clr-ink-on-dark", "#1f1811");
  root.style.setProperty("--clr-ink-on-light", "#1f1811");
  root.style.setProperty("--clr-ink-light", "#6b5d48");
  root.style.setProperty("--clr-ink-dark", "#1f1811");
  root.style.setProperty("--clr-accent", "#4a6b4a");
  root.style.setProperty("--clr-accent-alt", "#6b4c7a");
  root.style.setProperty("--clr-success", "#4a6b4a");
  root.style.setProperty("--clr-danger", "#8a3324");
  root.style.setProperty("--clr-warn", "#9a7b2e");
  root.style.setProperty("--clr-blessing", "#4a6b4a");
  root.style.setProperty("--clr-ink", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-ink-panel", "var(--clr-ink-on-light)");
  root.style.setProperty("--clr-bg-dark", "#3f3529");
  root.style.setProperty("--clr-card-bg", "var(--clr-panel-bg)");
  root.style.setProperty("--clr-btn-bg", "var(--clr-panel-bg)");
  root.style.setProperty("--clr-btn-text", "#1f1811");
  root.style.setProperty("--clr-btn-hover", "var(--clr-panel-bg-2)");
  root.style.setProperty("--clr-status-bar-bg", "var(--clr-bg)");
  root.style.setProperty("--clr-status-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-status-accent", "var(--clr-accent)");
  root.style.setProperty("--clr-overlay-bg", "rgba(31,24,17,0.95)");
  root.style.setProperty("--clr-border", "rgba(107,76,122,0.28)");
  root.style.setProperty("--clr-map-bg", "#1a1410");
  root.style.setProperty("--clr-tooltip-bg", "rgba(31,24,17,0.95)");
  root.style.setProperty("--clr-tooltip-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-tooltip-border", "var(--clr-accent)");
  root.style.setProperty("--clr-map-frame-shadow", "rgba(0,0,0,0.5)");
  root.style.setProperty("--clr-narrative-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-ruled-line", "rgba(200,168,26,0.15)");
  root.style.setProperty("--clr-ledger-border", "rgba(200,168,26,0.18)");
  root.style.setProperty("--clr-ledger-margin", "var(--clr-accent)");
  root.style.setProperty("--clr-paper-texture", "none");
  root.style.setProperty("--clr-event-border", "var(--clr-accent)");
  root.style.setProperty("--clr-event-accent-bar", "var(--clr-accent)");
  root.style.setProperty("--clr-settlement-hbc", "#c85050");
  root.style.setProperty("--clr-settlement-metis", "#5a9cff");
  root.style.setProperty("--clr-settlement-nwmp", "#4ab86a");
  root.style.setProperty("--clr-settlement-mission", "#d8b840");
  root.style.setProperty("--clr-settlement-trading", "#d8b840");
  root.style.setProperty("--clr-food-low", "var(--clr-danger)");
  root.style.setProperty("--clr-ok", "var(--clr-success)");
  root.style.setProperty("--clr-weather-rain", "#8abce0");
  root.style.setProperty("--clr-weather-snow", "#b8c8e0");
  root.style.setProperty("--clr-over-bg", "rgba(200,80,64,0.15)");
  root.style.setProperty("--clr-over-border", "#c85040");
  root.style.setProperty("--clr-over-text", "#e07060");
  root.style.setProperty("--clr-warn-bg", "rgba(224,192,48,0.15)");
  root.style.setProperty("--clr-warn-border", "#e0c030");
  root.style.setProperty("--clr-gold", "#e0c030");
  root.style.setProperty("--clr-ok-bg", "rgba(122,168,90,0.15)");
  root.style.setProperty("--clr-ok-border", "#7aa85a");
  root.style.setProperty("--clr-ok-text", "#7aa85a");
  root.style.setProperty("--clr-catitem-bg", "rgba(74,107,74,0.08)");
  root.style.setProperty("--clr-catitem-border", "rgba(74,107,74,0.18)");
  root.style.setProperty("--clr-muted", "#6b5d48");
  root.style.setProperty("--clr-pdrow-bg", "rgba(74,107,74,0.06)");
  root.style.setProperty("--clr-pdrow-border", "rgba(74,107,74,0.12)");
  root.style.setProperty("--clr-camp-border", "var(--clr-accent)");
  root.style.setProperty("--clr-camp-pill-bg", "rgba(74,107,74,0.08)");
  root.style.setProperty("--clr-camp-pill-border", "rgba(74,107,74,0.2)");
  root.style.setProperty("--clr-camp-btn-hover", "var(--clr-panel-bg-2)");
  root.style.setProperty("--clr-campfire-glow", "radial-gradient(ellipse at 50% 100%, rgba(180,130,20,0.4) 0%, rgba(200,168,26,0.25) 35%, transparent 70%)");
  root.style.setProperty("--clr-campfire-embers", `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.1'/%3E%3C/svg%3E")`);
  root.style.setProperty("--clr-campfire-flicker", "radial-gradient(circle at 45% 75%, rgba(255,140,40,0.18) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.15) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.12) 0%, transparent 30%)");
  root.style.setProperty("--clr-success-glow", "rgba(74,107,74,0.35)");
  root.style.setProperty("--clr-danger-glow", "rgba(138,51,36,0.35)");
  root.style.setProperty("--clr-choice-cost", "#6b5d48");
  root.style.setProperty("--clr-source-text", "#6b5d48");
  root.style.setProperty("--clr-source-context", "#6b5d48");
  root.style.setProperty("--clr-placeholder", "#6b5d48");
  root.style.setProperty("--clr-input-bg", "rgba(31,24,17,0.08)");
  root.style.setProperty("--clr-input-bg-focus", "rgba(31,24,17,0.12)");
  root.style.setProperty("--clr-silver", "#b8b8b8");
  root.style.setProperty("--clr-bronze", "#d8a060");
  root.style.setProperty("--clr-gold-faint", "rgba(200,168,26,0.12)");
  root.style.setProperty("--clr-gold-light", "rgba(200,168,26,0.18)");
  root.style.setProperty("--clr-intel-border", "rgba(107,76,122,0.22)");
  root.style.setProperty("--font-heading", "'Cormorant Garamond', Georgia, 'Times New Roman', serif");
  root.style.setProperty("--font-body", "'Lora', Georgia, 'Times New Roman', serif");
  root.style.setProperty("--font-italic", "'Lora', Georgia, 'Times New Roman', serif");
}
__name(applyTheme, "applyTheme");

// src/ui/shell.js
function mount() {
  const gameRoot = document.getElementById("game-root");
  if (!gameRoot) throw new Error("#game-root missing");
  applyTheme(document.documentElement);
  return gameRoot;
}
__name(mount, "mount");
function find(selector) {
  return document.querySelector(selector);
}
__name(find, "find");

// art/cart_marker.png
var cart_marker_default = "./cart_marker-CQL7K2BU.png";

// src/ui/journalNarrative.js
function describeFood(units) {
  const u = Math.floor(units);
  if (u <= 0) return "No food left. The larder is bare.";
  if (u === 1) return "One day's pemmican remains.";
  if (u <= 3) return `${u} days' pemmican.`;
  if (u <= 7) return `A week's worth of pemmican (${u} days).`;
  if (u <= 14) return `Two weeks' pemmican (${u} days).`;
  return `Well-stocked: ${u} days' pemmican.`;
}
__name(describeFood, "describeFood");
var TRAVEL_OPENINGS = [
  (prev, next) => `We broke camp at ${prev} before dawn. ${next} lay ahead.`,
  (prev, next) => `The cart rolled out of ${prev} with first light. ${next} was the day's mark.`,
  (prev, next) => `Left ${prev} behind us. The trail to ${next} stretched empty and wide.`,
  (prev, next) => `Dawn found us harnessing up at ${prev}. ${next} called from the west.`,
  (prev, next) => `We pushed on from ${prev}. The road to ${next} would not walk itself.`
];
var TRAVEL_MIDDLES = [
  "The wheels groaned beneath the load. Oxen plodded, patient as the grass is tall.",
  "A long day under a bowl of sky. Nothing but grass and wind for miles.",
  "The trail wound through grass taller than a rider on horseback.",
  "Clouds gathered west but held their rain. We counted oxen at noon \u2014 all present.",
  "The jingle of harness, the creak of wood. The rhythm of the Carlton Trail.",
  "Heat shimmered off the prairie. The oxen breathed hard, but kept their pace.",
  "A hawk circled overhead. The grass rippled like water in the wind."
];
var TRAVEL_WEAR_LINES = [
  "The cart took a beating \u2014 the axle groans louder now.",
  "A bad rut near the river crossing. The near wheel nearly came off.",
  "The trail was rough today. Boards shifted in the bed. We'll need to check the lashings.",
  "Red River carts are tough, but this ground tests them. Wear shows on the hubs."
];
var TRAVEL_WEATHER_LINES = {
  overcast: [
    "A grey ceiling followed us all day. No sun, no rain \u2014 just the weight of cloud.",
    "The sky closed over by morning. Flat grey, pressing down on the grass."
  ],
  rain: [
    "Cold rain came on by midday. We huddled under canvas, steam rising from the oxen.",
    "A soaking rain. The trail turned to grease. Wheels sank to the hubs in places."
  ],
  storm: [
    "Thunder rolled across the prairie like wagon wheels on stone. We pressed on regardless.",
    "Lightning split the sky. The oxen balked but the whip brought them round."
  ],
  snow: [
    "Snow fell fine as powder, dusting the oxen's backs. Winter breathes early here.",
    "First snow of the season. White fingers in the grass. The cart left dark tracks."
  ]
};
var EVENT_CHOICE_RAIN_SUCCESS = [
  (choiceText) => `The rain hammered down but ${choiceText.toLowerCase()}. The ground was slick, boots heavy, but the work got done.`,
  (choiceText) => `Rain-soaked ground made every step a fight, yet ${choiceText.toLowerCase()}. The tarp shed water like a duck's back.`,
  (choiceText) => `Midday deluge. We ${choiceText.toLowerCase()} through the downpour. Canvas kept the powder dry \u2014 that mattered.`
];
var EVENT_CHOICE_RAIN_FAILURE = [
  (choiceText) => `The rain turned the trail to soup. We tried to ${choiceText.toLowerCase()} but the mud won. Boots stuck, temper frayed.`,
  (choiceText) => `Cold rain all day. ${choiceText} failed \u2014 the ground went to grease and the wagon slid sideways.`,
  (choiceText) => `Rain found every seam. We ${choiceText.toLowerCase()} but the wet powder fouled. A miserable failure.`
];
var EVENT_CHOICE_STORM_SUCCESS = [
  (choiceText) => `Thunder cracked overhead. We ${choiceText.toLowerCase()} with lightning at our backs. The oxen held \u2014 barely.`,
  (choiceText) => `Storm winds howled. Still we ${choiceText.toLowerCase()}. The tarp snapped but held. The work is done.`,
  (choiceText) => `Black sky, white lightning. We ${choiceText.toLowerCase()} and the storm didn't break us.`
];
var EVENT_CHOICE_STORM_FAILURE = [
  (choiceText) => `The storm broke right when we needed calm. ${choiceText} went wrong \u2014 lightning spooked the oxen, wind scattered our focus.`,
  (choiceText) => `Thunder rolled like drumbeats of doom. We ${choiceText.toLowerCase()} but the elements swallowed the effort.`,
  (choiceText) => `A flash, a crack, the oxen bolted. ${choiceText} \u2014 abandoned. The storm took its due.`
];
var EVENT_CHOICE_SNOW_SUCCESS = [
  (choiceText) => `Snow muffled the world. We ${choiceText.toLowerCase()} in the white quiet. Blankets and firewood kept the chill at bay.`,
  (choiceText) => `First snow dusted the trail. We ${choiceText.toLowerCase()} with cold fingers but steady hands. The fire waited at camp.`,
  (choiceText) => `White fingers of winter in the grass. Still we ${choiceText.toLowerCase()} and the work held.`
];
var EVENT_CHOICE_SNOW_FAILURE = [
  (choiceText) => `Snow blinded the way. We tried to ${choiceText.toLowerCase()} but the cold stole feeling from fingers. The work slipped.`,
  (choiceText) => `Frost bit deep. ${choiceText} failed \u2014 no firewood, no blankets, just the cold and the failure.`,
  (choiceText) => `The snow came down thick. We ${choiceText.toLowerCase()} but the world went white. Nothing gained.`
];
var EVENT_CHOICE_OVERCAST_SUCCESS = [
  (choiceText) => `Grey sky, flat light. We ${choiceText.toLowerCase()} in the gloom. No rain, no sun \u2014 just the work.`,
  (choiceText) => `The clouds pressed low. We ${choiceText.toLowerCase()} without drama. Steady does it.`
];
var EVENT_CHOICE_OVERCAST_FAILURE = [
  (choiceText) => `The grey day drained the spirit. We ${choiceText.toLowerCase()} but the weight of the sky wore us down.`,
  (choiceText) => `Overcast and heavy. ${choiceText} came to nothing. The light never broke through.`
];
var EVENT_AUTO_RAIN_TARP = [
  "Rain came on hard. The tarp was up in seconds \u2014 dry underneath while the prairie drowned.",
  "The canvas Tarp earned its weight today. Water ran off in sheets. Crew stayed dry, powder stayed ready.",
  "A proper soaking rain. But the tarp held. We watched the water bead and roll off. Good gear."
];
var EVENT_AUTO_STORM_TARP = [
  "Thunder and wind. The tarp snapped like a sail but the lashings held. Nothing wet but the ground.",
  "Storm winds tested every knot. The tarp stood firm. The oxen balked but the shelter held.",
  "Lightning split the sky. Under the tarp the crew waited it out. Dry, warm enough, alive."
];
var EVENT_AUTO_SNOW_BLANKET = [
  "Snow piled deep by morning. Blankets between the bedroll and the cold \u2014 that was the difference.",
  "First snow. The wool blankets turned bitter ground into tolerable rest. Firewood cracked beside you.",
  "White silence at dawn. Blankets held the body heat. The fire died to coals but you woke whole."
];
var EVENT_AUTO_SNOW_FIREWOOD = [
  "The fire burned all night. Poplar coals warming the watch. Snow melted in a circle around the flames.",
  "Firewood bundle spent, but the night was warm. Steam rose from wet blankets drying by the fire.",
  "Wood smoke in the wool. The fire held back the winter dark. Another night survived."
];
var EVENT_AUTO_CLEAR = [
  "Clear sky, dry trail. The day passed without weather trouble.",
  "Sun on the grass. Good travelling weather \u2014 rare enough to note.",
  "The prairie stretched empty under blue. No rain, no storm, no snow. Just trail."
];
var SETTLEMENT_ARRIVAL = [
  (name, type) => `We saw the spires of ${name} rise from the river bottom. A ${type} post \u2014 we'd heard tell.`,
  (name, type) => `${name} ahead. Smoke from chimneys, the smell of woodsmoke and cattle. Civilization, of a sort.`,
  (name, type) => `We rode into ${name} as the bell rang vespers. ${type} folk, but the trade's honest.`
];
var SETTLEMENT_TRADE = [
  (give, receive) => `Traded ${give} for ${receive}. Fair measure. The factor nodded, weighed honest.`,
  (give, receive) => `Laid out ${give} on the counter. Walked away with ${receive}. Good business.`,
  (give, receive) => `Haggling done. ${give} went their way, ${receive} came ours. Both sides satisfied.`
];
var SETTLEMENT_ACTION = {
  heal_crew: [
    "The sisters tended our sick. Cool hands, quiet prayers. The fever broke by morning.",
    "Grey Nuns asked no questions. Bound wounds, brewed tea. The crew walks easier now.",
    'Medicine given freely. "God provides," the sister said. We left pemmican on the altar.'
  ],
  rest_blessing: [
    "Slept in the chapel loft. Straw mattress, but the bell at matins woke a lighter spirit.",
    "Evening prayer in the nave. Three days' blessing on the road ahead. Felt the weight lift.",
    "Confession and communion. The trail feels shorter when the soul's unburdened."
  ],
  trade_furs_food: [
    "Folded hides on the counter. Pemmican in the cart. The mission garden feeds the journey.",
    "Beaver for bison meat. Straight trade. The factor's scales were true.",
    "Hides from the spring hunt. Now rations for the fall push. Good exchange."
  ],
  trade_gossip: [
    "Sat by the fire with the women. News travels fast on the prairie \u2014 next settlement's prairies, they said.",
    "Shared bannock and tea. The old women know every trail and river. Learned what lies ahead.",
    "Listened to stories in Michif and French. The gossip is worth more than gold on this trail."
  ],
  dance: [
    "The fiddle sang. Boots pounded the hard ground. For an hour, nobody remembered the trail.",
    "Red River jig until the fire died. Even the quiet ones joined in. Morale's high.",
    "Music and laughter carried across the grass. The night felt shorter for it."
  ],
  share_food: [
    "Broke pemmican with the camp. What you give on the trail returns in loyalty.",
    "Shared our rations with a family waiting for hunters. Their gratitude was a warm thing.",
    "The M\xE9tis remember generosity. Gave two rations, earned their respect for leagues."
  ],
  buy_ammo: [
    `"Ball and powder, measured honest. The Mounties don't cheat a carter on shot."`,
    "Two belts of ammunition for a beaver pelt. Fair trade from the Queen's men.",
    "Fresh powder and ball. The sergeant weighed it himself. Honest measure."
  ],
  trade_furs_supplies_ammunition: [
    "Traded pelts for powder and shot. The Company store prices are steep but the goods are good.",
    "Laid down a hide, walked away with ammunition. The factor didn't blink.",
    "Company lead and powder. Cost a pelt but the quality's there."
  ],
  trade_furs_supplies_shaganappi: [
    "Rawhide strips for a prime beaver. The best binding on the prairie.",
    "Three strips of shaganappi. That'll fix a wheel or lash a load proper.",
    "Wet rawhide shrinks drum-tight. Worth every hide we traded."
  ],
  trade_furs_supplies_medicine: [
    "Medicine pouch for a wolf pelt. The herbs smell of sage and willow bark.",
    "The factor handed over a pouch. Said it'd break a fever by morning.",
    "Traded fur for medicine. The Company knows what keeps carters alive."
  ],
  rest: [
    "A warm fire in the mess hall, dry blankets, and a night without the wind.",
    "Cot in the barracks. Clean, quiet, and the sentry paces all night.",
    "A lean-to by the fire. Simple shelter, honest company."
  ]
};
var TRAVEL_REFLECTIONS = [
  "Our backs ache from the jolting. The younger hands complain but they keep pace. We wonder how many more days this body has in it.",
  "The officer at the last post said the trail gets harder north of the Assiniboine. We believe him. Every mile feels earned now.",
  "We passed a grave today. Just a wooden cross, weathered grey. No name. The prairie keeps its dead close.",
  "The cart creaks a new rhythm. Hub on the near side needs attention. Shaganappi will hold it for now.",
  "Strange to think the river flows north while we chase the sunset. The world turns different out here.",
  "The crew talks less each day. Not from anger \u2014 just the weight of distance. We hear them hum old songs sometimes.",
  "A half-breed trapper shared firewater last night. Said the bison are moving west. Said the trail is changing. He was not wrong.",
  "Dreams of Red River feel like another life. The fort, the bells, the women laughing on the landing. All behind us now."
];
var EVENT_REFLECTIONS = {
  success: [
    "Fortune favored us today. We will not question why \u2014 only give thanks and keep moving.",
    "The dice fell right. Tomorrow they may not. We store this luck like pemmican for lean days."
  ],
  failure: [
    "The trail teaches hard lessons. This one stings. We carry the scar and the wisdom both.",
    "Failed today. The ground won. But we are still here, still moving. That counts for something."
  ],
  critical: [
    "The world broke open today. What we lost cannot be named in numbers. We walk differently now.",
    "A day that will wake us in winters to come. The crew watches us. We must not show the crack."
  ]
};
var SETTLEMENT_REFLECTIONS = [
  (name, day) => `${name} behind us. Day ${day} on the trail. The map shrinks in our hands but the distance feels longer.`,
  (name, day) => `Traded, rested, prayed at ${name}. The ledger balances but the soul's account is harder to tally. Day ${day}.`,
  (name, day) => `Left ${name} with full bellies and lighter hearts. The trail waits for no man. Day ${day} and counting.`,
  (name, day) => `The factor's scales were honest. The priest's blessing felt true. Even the Mountie nodded respect. Day ${day}.`,
  (name, day) => `Rode out of ${name} before the bell finished ringing. The road does not care for goodbyes. Day ${day}.`
];
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
__name(pick, "pick");
function buildTravelEntry(prevNode, node, after, prevWear, cart = []) {
  if (!prevNode || !node) {
    return "Another day on the Carlton Trail. The prairie stretches on, dry and endless.";
  }
  const opening = pick(TRAVEL_OPENINGS)(prevNode.name, node.name);
  const middle = pick(TRAVEL_MIDDLES);
  const wearLine = after.wear > prevWear ? " " + pick(TRAVEL_WEAR_LINES) : "";
  const weather = after.weather && after.weather !== "clear" ? " " + pickWeatherLine(after.weather, cart) : "";
  return `${opening}${wearLine}${weather} ${middle}`;
}
__name(buildTravelEntry, "buildTravelEntry");
function pickWeatherLine(weather, cart) {
  const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
  const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
  const hasFirewood2 = cart.some((i) => i.name === "Firewood Bundle" && i.count > 0);
  const lines = TRAVEL_WEATHER_LINES[weather] || [];
  if (!lines.length) return "";
  let line = pick(lines);
  if (weather === "rain" || weather === "storm") {
    if (hasTarp) {
      line = line.replace("We huddled under canvas", "The tarp held. We stirred dry underneath");
      line = line.replace("The trail turned to grease", "Wheels sank but the tarp kept the load dry");
    }
  }
  if (weather === "snow") {
    if (hasBlanket || hasFirewood2) {
      line = line.replace("Winter breathes early here", "Blankets and firewood kept the night at bay");
      line = line.replace("The cart left dark tracks", "Firewood warmed the watch, blankets the sleep");
    }
  }
  return line;
}
__name(pickWeatherLine, "pickWeatherLine");
function buildSettlementArrivalEntry(settlement) {
  return pick(SETTLEMENT_ARRIVAL)(settlement.name, settlement.type);
}
__name(buildSettlementArrivalEntry, "buildSettlementArrivalEntry");
function buildSettlementActionEntry(actionId, giveDesc, receiveDesc) {
  if (actionId === "trade" || actionId === "trade_limited") {
    return pick(SETTLEMENT_TRADE)(giveDesc, receiveDesc);
  }
  const templates = SETTLEMENT_ACTION[actionId];
  if (templates) return pick(templates);
  return `Completed ${actionId.replace(/_/g, " ")} at the post.`;
}
__name(buildSettlementActionEntry, "buildSettlementActionEntry");
function buildEventChoiceEntry(eventData, result, weather = "clear", cart = []) {
  const desc = eventData.text || "Something happened on the trail.";
  if (!result || result.roll === null) {
    return desc;
  }
  const isSuccess = result.success;
  const choiceText = result.text || (isSuccess ? "It went well enough." : "That did not go as hoped.");
  const cleanChoice = choiceText.replace(/^(Success|Failure)\.\s*/, "");
  const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
  const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
  const hasFirewood2 = cart.some((i) => i.name === "Firewood Bundle" && i.count > 0);
  const isWet = ["rain", "storm"].includes(weather);
  const isCold = weather === "snow";
  let templates;
  if (weather === "rain") {
    templates = isSuccess ? EVENT_CHOICE_RAIN_SUCCESS : EVENT_CHOICE_RAIN_FAILURE;
  } else if (weather === "storm") {
    templates = isSuccess ? EVENT_CHOICE_STORM_SUCCESS : EVENT_CHOICE_STORM_FAILURE;
  } else if (weather === "snow") {
    templates = isSuccess ? EVENT_CHOICE_SNOW_SUCCESS : EVENT_CHOICE_SNOW_FAILURE;
  } else if (weather === "overcast") {
    templates = isSuccess ? EVENT_CHOICE_OVERCAST_SUCCESS : EVENT_CHOICE_OVERCAST_FAILURE;
  } else {
    return `${desc} ${cleanChoice}`;
  }
  const templateFn = pick(templates);
  let enhanced = templateFn(cleanChoice);
  if (isSuccess && isWet && hasTarp) {
    enhanced += " The tarp kept the gear dry.";
  }
  if (isSuccess && isCold) {
    if (hasBlanket) enhanced += " Blankets turned the cold to comfort.";
    else if (hasFirewood2) enhanced += " The fire held the night back.";
  }
  return `${desc} ${enhanced}`;
}
__name(buildEventChoiceEntry, "buildEventChoiceEntry");
function buildEventAutoEntry(desc, weather = "clear", cart = []) {
  const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
  const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
  const hasFirewood2 = cart.some((i) => i.name === "Firewood Bundle" && i.count > 0);
  const isWet = ["rain", "storm"].includes(weather);
  const isCold = weather === "snow";
  let templates;
  if (weather === "rain" && hasTarp) templates = EVENT_AUTO_RAIN_TARP;
  else if (weather === "storm" && hasTarp) templates = EVENT_AUTO_STORM_TARP;
  else if (weather === "snow" && hasBlanket) templates = EVENT_AUTO_SNOW_BLANKET;
  else if (weather === "snow" && hasFirewood2) templates = EVENT_AUTO_SNOW_FIREWOOD;
  else templates = EVENT_AUTO_CLEAR;
  const template = pick(templates);
  return `${desc} ${template}`;
}
__name(buildEventAutoEntry, "buildEventAutoEntry");
function buildSettlementJourneyEntry(settlement, weather = "clear", cart = []) {
  const hasTarp = cart.some((i) => i.name === "Canvas Tarp" && i.count > 0);
  const hasBlanket = cart.some((i) => i.name === "Blanket" && i.count > 0);
  let base = pick(SETTLEMENT_ARRIVAL)(settlement.name, settlement.type);
  if (weather === "rain") {
    base += hasTarp ? " The tarp saw us through the wet miles." : " Rain soaked the trail all the way here.";
  } else if (weather === "storm") {
    base += hasTarp ? " Storm winds tested the canvas \u2014 it held." : " The storm broke over us on the final stretch.";
  } else if (weather === "snow") {
    base += hasBlanket || hasFirewood ? " Snow fell the last day but blankets and fire saw us through." : " Snow dusted the approach. Cold miles behind us.";
  } else if (weather === "overcast") {
    base += " Grey sky the whole way. No rain, but no sun either.";
  } else {
    base += " Clear skies favored the approach.";
  }
  return base;
}
__name(buildSettlementJourneyEntry, "buildSettlementJourneyEntry");
function getFoodDescription(units) {
  return describeFood(units);
}
__name(getFoodDescription, "getFoodDescription");
function buildTravelReflection(prevNode, node, after, cart = [], day = 1) {
  const base = buildTravelEntry(prevNode, node, after, 0, cart);
  const reflection = pick(TRAVEL_REFLECTIONS);
  const foodDesc = describeFood(after.food);
  const wearDesc = after.wear > 0 ? ` Cart wear: ${after.wear}.` : " Cart holds sound.";
  return `${base} ${reflection} ${foodDesc}${wearDesc}`;
}
__name(buildTravelReflection, "buildTravelReflection");
function buildEventReflection(eventData, result, weather = "clear", cart = []) {
  const base = buildEventChoiceEntry(eventData, result, weather, cart);
  let tier = "success";
  if (result?.critical) tier = "critical";
  else if (!result?.success) tier = "failure";
  const reflection = pick(EVENT_REFLECTIONS[tier] || EVENT_REFLECTIONS.success);
  return `${base} ${reflection}`;
}
__name(buildEventReflection, "buildEventReflection");
function buildSettlementReflection(settlement, after, cart = []) {
  const base = buildSettlementJourneyEntry(settlement, after.weather || "clear", cart);
  const reflection = pick(SETTLEMENT_REFLECTIONS)(settlement.name, after.day);
  const foodDesc = describeFood(after.food);
  return `${base} ${reflection} ${foodDesc}`;
}
__name(buildSettlementReflection, "buildSettlementReflection");

// src/ui/renderer.js
var MONTH_NAMES = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function monthName(month) {
  return MONTH_NAMES[month] || String(month);
}
__name(monthName, "monthName");
var map = null;
var tileLayer = null;
var markerGroup = null;
var fullTrailLine = null;
var cartIcon = L.icon({
  iconUrl: cart_marker_default,
  iconSize: [100, 48],
  iconAnchor: [50, 24],
  popupAnchor: [0, -24]
});
function getInitialView() {
  const initialNodes = NODES.slice(0, 4);
  const lats = initialNodes.map((n) => n.lat);
  const lons = initialNodes.map((n) => n.lon);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
  return { center: [centerLat, centerLon], zoom: 9 };
}
__name(getInitialView, "getInitialView");
function initMap() {
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;
  if (map) return;
  if (!window.__METIS_READY__) return;
  applyTheme(document.documentElement);
  const { center, zoom } = getInitialView();
  map = L.map("map", {
    center,
    zoom,
    zoomControl: true
  });
  tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OSM contributors",
    maxZoom: 18
  }).addTo(map);
  markerGroup = L.featureGroup().addTo(map);
  const allCoords = NODES.map((n) => [n.lat, n.lon]);
  fullTrailLine = L.polyline(allCoords, {
    color: "#8B2500",
    weight: 2,
    opacity: 0.2,
    dashArray: "6 4"
  }).addTo(markerGroup);
  updateMap({ node: 0 });
}
__name(initMap, "initMap");
function updateMap(state) {
  if (!map) return;
  const here = NODES[state.node];
  if (!here) return;
  const next = NODES[state.node + 1];
  const visited = NODES.slice(0, state.node + 1).map((n) => [n.lat, n.lon]);
  let cartLat = here.lat;
  let cartLon = here.lon;
  let viewLat = cartLat;
  let viewLon = cartLon;
  if (next && next.dist > 0) {
    const progress = Math.min((state.segmentDay || 0) / next.dist, 1);
    cartLat = here.lat + (next.lat - here.lat) * progress;
    cartLon = here.lon + (next.lon - here.lon) * progress;
    viewLat = cartLat;
    viewLon = cartLon;
  }
  map.panTo([viewLat, viewLon], { animate: true, duration: 0.3 });
  if (!markerGroup) markerGroup = L.featureGroup().addTo(map);
  markerGroup.clearLayers();
  if (fullTrailLine) {
    fullTrailLine.addTo(markerGroup);
  } else {
    const allCoords = NODES.map((n) => [n.lat, n.lon]);
    L.polyline(allCoords, {
      color: "#8B2500",
      weight: 2,
      opacity: 0.2,
      dashArray: "6 4"
    }).addTo(markerGroup);
  }
  if (visited.length > 1) {
    L.polyline(visited, { color: "#8B2500", weight: 3, opacity: 0.7 }).addTo(markerGroup);
  }
  const typeColors = {
    hbc: "#8B2500",
    metis: "#2E6A4A",
    nwmp: "#1A3C6E",
    mission: "#B8860B",
    trading: "#6B4423",
    river: "#4A90D9"
  };
  NODES.forEach((n, i) => {
    const isHere = i === state.node;
    const isVisited = i < state.node;
    const isFuture = i > state.node;
    let radius, color, fillColor, fillOpacity, weight;
    if (isHere) {
      radius = 9;
      color = typeColors[n.type] || "#1A1410";
      fillColor = typeColors[n.type] || "#E8DCC8";
      fillOpacity = 1;
      weight = 3;
    } else if (isVisited) {
      radius = 5;
      color = "#888";
      fillColor = "#bbb";
      fillOpacity = 0.6;
      weight = 1.5;
    } else {
      radius = 6;
      color = typeColors[n.type] || "#1A1410";
      fillColor = "#E8DCC8";
      fillOpacity = 0.9;
      weight = 2;
    }
    L.circleMarker([n.lat, n.lon], {
      radius,
      color,
      fillColor,
      fillOpacity,
      weight
    }).bindTooltip(n.name, {
      direction: "top",
      offset: [0, -8],
      className: "node-tooltip"
    }).addTo(markerGroup);
  });
  L.marker([cartLat, cartLon], { icon: cartIcon }).addTo(markerGroup);
}
__name(updateMap, "updateMap");
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
  const moraleEl = document.getElementById("s-morale");
  const tradeEl = document.getElementById("s-trade");
  if (dayEl) dayEl.textContent = String(state.day);
  if (monthEl) monthEl.textContent = monthName(state.month);
  if (seasonEl) seasonEl.textContent = state.season;
  if (segEl) {
    if (state.pendingSettlement) {
      segEl.textContent = `At: ${node?.name || "camp"}`;
    } else if (next) {
      segEl.textContent = `${node?.name || "Camp"} \u2192 ${next.name} \xB7 Segment ${state.segment || 1} of ${NODES.length - 1}`;
    } else {
      segEl.textContent = node?.name || "Arrived";
    }
  }
  const crewState = window._metisGame?.getCrew?.()?.state || "";
  let crewCls = "stat-value";
  if (crewState === "tired") crewCls += " crew-tired";
  else if (crewState === "exhausted") crewCls += " crew-exhausted";
  else if (crewState === "rested") crewCls += " crew-rested";
  if (crewEl) {
    crewEl.textContent = String(state.crew);
    crewEl.className = crewCls;
  }
  if (foodEl) {
    foodEl.textContent = String(Math.floor(state.food));
    foodEl.title = getFoodDescription(state.food);
    foodEl.className = "stat-value" + (state.food <= 5 ? " food-low" : "");
  }
  if (wearEl) {
    wearEl.textContent = String(state.wear);
    wearEl.className = "stat-value" + (state.wear >= 4 ? " wear-high" : "");
  }
  if (moraleEl) {
    moraleEl.textContent = String(state.morale);
    moraleEl.className = "stat-value";
  }
  if (tradeEl) {
    const tradeCount = (window._metisGame?.getCart?.() || []).filter((i) => i.type === "trade" || i.category === "furs").reduce((s, i) => s + i.count, 0);
    tradeEl.textContent = String(tradeCount);
    tradeEl.className = "stat-value";
  }
  const weatherEl = document.getElementById("s-weather");
  if (weatherEl) {
    const w = state.weather || "clear";
    weatherEl.textContent = CONSTANTS.WEATHER_LABELS[w] || "Clear";
    weatherEl.className = "stat-value";
  }
  const blessingWrap = document.getElementById("s-blessing-wrap");
  const blessingEl = document.getElementById("s-blessing");
  if (blessingWrap && blessingEl) {
    const bd = state.blessingDays || 0;
    if (bd > 0) {
      blessingEl.textContent = `\u271D ${bd}d`;
      blessingWrap.style.display = "inline";
    } else {
      blessingWrap.style.display = "none";
    }
  }
  const travelBtn = document.getElementById("btn-travel");
  const campBtn = document.getElementById("btn-camp");
  if (travelBtn && campBtn) {
    if (state.pendingEvent || state.pendingSettlement || state.over || state.preDeparture) {
      travelBtn.style.display = "none";
      campBtn.style.display = "none";
    } else if (state.traveledToday) {
      travelBtn.style.display = "none";
      campBtn.style.display = "flex";
    } else {
      travelBtn.style.display = "flex";
      campBtn.style.display = "none";
    }
  }
  if (!window.__METIS_PENDING_RESULT__) window.__METIS_PENDING_RESULT__ = null;
}
__name(renderStatusBar, "renderStatusBar");
function journalLog(entry) {
  const journal = document.getElementById("journal");
  if (!journal) return;
  const day = entry.day || 0;
  const date = entry.date || "";
  const title = entry.title || `Day ${day}`;
  const text = entry.text || "";
  const dice = entry.dice || null;
  const mech = entry.mech || "";
  const collapsed = entry.collapsed ? "collapsed" : "";
  const diceHtml = dice ? typeof dice === "string" ? `<div class="journal-dice">${dice}</div>` : `<div class="journal-dice ${dice.success ? "pass" : "fail"}">${dice.text}</div>` : "";
  let dayGroup = journal.querySelector(`.journal-day-group[data-day="${day}"]`);
  if (!dayGroup) {
    dayGroup = document.createElement("div");
    dayGroup.className = "journal-day-group";
    dayGroup.dataset.day = day;
    const dayHeader = document.createElement("div");
    dayHeader.className = "journal-day-header";
    dayHeader.innerHTML = `<span class="journal-day-toggle">\u25BC</span> Day ${day}${date ? " \u2014 " + date : ""}`;
    dayHeader.onclick = () => {
      dayGroup.classList.toggle("collapsed");
      const toggle = dayHeader.querySelector(".journal-day-toggle");
      toggle.textContent = dayGroup.classList.contains("collapsed") ? "\u25B6" : "\u25BC";
    };
    dayGroup.appendChild(dayHeader);
    const dayContent2 = document.createElement("div");
    dayContent2.className = "journal-day-content";
    dayGroup.appendChild(dayContent2);
    journal.appendChild(dayGroup);
  }
  const dayContent = dayGroup.querySelector(".journal-day-content");
  const entryEl = document.createElement("div");
  entryEl.className = `journal-entry ${collapsed}`;
  entryEl.innerHTML = `
    <div class="journal-entry-type">${title}</div>
    <div class="journal-text">${text}</div>
    ${diceHtml}
    ${mech ? `<div class="journal-mechanical">${mech}</div>` : ""}
  `;
  dayContent.appendChild(entryEl);
  journal.scrollTop = journal.scrollHeight;
}
__name(journalLog, "journalLog");
document.addEventListener("click", (e) => {
  const dayHeader = e.target.closest(".journal-day-header");
  if (!dayHeader) return;
  const dayGroup = dayHeader.closest(".journal-day-group");
  if (!dayGroup) return;
  if (e.target.closest(".journal-entry-type")) return;
  dayGroup.classList.toggle("collapsed");
  const toggle = dayHeader.querySelector(".journal-day-toggle");
  if (toggle) toggle.textContent = dayGroup.classList.contains("collapsed") ? "\u25B6" : "\u25BC";
});

// src/ui/persistence.js
var STORAGE_KEY = "metis-trail-v2.save";
function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
__name(clearSave, "clearSave");

// src/ui/debug.js
function mountDebugUI(game) {
  const url = new URL(location.href);
  if (!url.searchParams.has("debug")) return;
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.bottom = "0";
  panel.style.right = "0";
  panel.style.width = "360px";
  panel.style.maxHeight = "50vh";
  panel.style.background = "#1e1e1e";
  panel.style.color = "#e8dcc8";
  panel.style.fontFamily = "ui-monospace, monospace";
  panel.style.fontSize = "12px";
  panel.style.overflow = "auto";
  panel.style.borderTop = "2px solid #8B2500";
  panel.style.padding = "8px";
  panel.style.zIndex = "9999";
  const stateEl = document.createElement("pre");
  stateEl.id = "debug-state";
  const btn = document.createElement("button");
  btn.textContent = "\u2715";
  btn.onclick = () => panel.remove();
  panel.append(btn, stateEl);
  document.body.appendChild(panel);
  setInterval(() => {
    try {
      const s = game.getState();
      stateEl.textContent = JSON.stringify(s, null, 2);
    } catch (e) {
      stateEl.textContent = "no state";
    }
  }, 500);
}
__name(mountDebugUI, "mountDebugUI");

// src/ui/haptics.js
var Haptics = (() => {
  const supported = typeof navigator !== "undefined" && "vibrate" in navigator;
  function fire(pattern) {
    if (supported) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
      }
    }
  }
  __name(fire, "fire");
  return {
    travel: /* @__PURE__ */ __name(() => fire(15), "travel"),
    wear: /* @__PURE__ */ __name(() => fire([30, 50, 30]), "wear"),
    roughTrail: /* @__PURE__ */ __name(() => fire([80, 40, 80, 40, 80]), "roughTrail"),
    riverFail: /* @__PURE__ */ __name(() => fire([200, 100, 300]), "riverFail"),
    foodCritical: /* @__PURE__ */ __name(() => fire([50, 100, 50, 100, 50]), "foodCritical"),
    diceRoll: /* @__PURE__ */ __name(() => fire([10, 20, 10, 20, 10, 20, 10]), "diceRoll"),
    arrive: /* @__PURE__ */ __name(() => fire([25, 80, 25]), "arrive"),
    uiTap: /* @__PURE__ */ __name(() => fire(8), "uiTap"),
    stop: /* @__PURE__ */ __name(() => {
      if (supported) navigator.vibrate(0);
    }, "stop")
  };
})();
var haptics_default = Haptics;

// src/ui/icons.js
var ICONS = {
  "Pemmican Rations": "\u{1F969}",
  "Spare Axle": "\u{1FAB5}",
  "Shaganappi": "\u{1FAA2}",
  "Tool Kit": "\u2692\uFE0F",
  "Bison Hide": "\u{1F9AC}",
  "Canvas Tarp": "\u26FA",
  "Firewood Bundle": "\u{1F525}",
  "Rope (50ft)": "\u{1FAA2}",
  "Ammunition Belt": "\u{1F3AF}",
  "Medicine Pouch": "\u{1F48A}",
  "Blanket": "\u{1F9E3}",
  "Beaver Pelts": "\u{1F9AB}",
  // Crafted items
  "Finished Hides": "\u{1F9AC}",
  "Travois Kit": "\u{1F6D2}",
  "Gunpowder Pack": "\u{1F4A3}"
};
function getItemIcon(name) {
  return ICONS[name] || "\u2022";
}
__name(getItemIcon, "getItemIcon");

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
    travel: /* @__PURE__ */ __name(() => game.travelOneDay(), "travel"),
    camp: /* @__PURE__ */ __name(() => game.makeCamp(), "camp"),
    choose: /* @__PURE__ */ __name((i) => game.chooseEventChoice(i), "choose"),
    reroll: /* @__PURE__ */ __name((s) => {
      const g = createGame(s);
      window._metisGame = g;
      window.__METIS_RENDER__();
    }, "reroll")
  };
  mount();
  const rootEl = find("#game-root");
  if (!rootEl) {
    console.error("Metis bootstrap aborted: #game-root is missing.");
    return;
  }
  var journal = document.getElementById("journal");
  if (journal) {
    journal.addEventListener("click", (e) => {
      var header = e.target.closest(".journal-header");
      if (header) {
        var entry = header.closest(".journal-entry");
        if (entry) entry.classList.toggle("collapsed");
      }
    });
  }
  applyTheme(rootEl);
  const state = game.getState();
  document.getElementById("intro-overlay")?.classList.add("active");
  document.getElementById("predeparture-overlay")?.classList.remove("active");
  initMap();
  mountDebugUI(game);
  const nameInput = find("#intro-name-input");
  if (nameInput) {
    const savedName = localStorage.getItem("metisPlayerName");
    if (savedName) nameInput.value = savedName;
  }
  const visitedSettlements = /* @__PURE__ */ new Set();
  document.getElementById("stat-food")?.addEventListener("click", () => {
    if (window._metisGame) showCart(window._metisGame);
  });
  document.getElementById("stat-crew")?.addEventListener("click", () => {
    if (window._metisGame) showCrew(window._metisGame);
  });
  document.getElementById("settings-btn")?.addEventListener("click", () => {
    document.getElementById("settings-overlay")?.classList.add("active");
  });
  document.getElementById("settings-close")?.addEventListener("click", () => {
    document.getElementById("settings-overlay")?.classList.remove("active");
  });
  document.getElementById("settings-new-game")?.addEventListener("click", () => {
    clearSave();
    window.location.reload();
  });
  const overlayIds = ["event-overlay", "settlement-overlay", "cart-overlay", "crew-overlay", "camp-overlay", "predeparture-overlay", "settings-overlay"];
  function closeAllOverlays() {
    overlayIds.forEach((id) => document.getElementById(id)?.classList.remove("active"));
  }
  __name(closeAllOverlays, "closeAllOverlays");
  const SAVE_VERSION = 2;
  const savedRaw = localStorage.getItem("metis-trail-v2.save");
  if (savedRaw) {
    try {
      const parsed = JSON.parse(savedRaw);
      const saveVer = parsed.schemaVersion || parsed.data?.schemaVersion || 0;
      if (saveVer < SAVE_VERSION) {
        localStorage.removeItem("metis-trail-v2.save");
        console.info(`[Metis] Cleared incompatible save (v${saveVer} < v${SAVE_VERSION})`);
      }
    } catch (e) {
    }
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#intro-start")) {
      const rawName = nameInput?.value?.trim() || "";
      const nameVal = rawName || "Traveller";
      if (nameVal) localStorage.setItem("metisPlayerName", nameVal);
      const introOverlay = document.getElementById("intro-overlay");
      if (introOverlay) {
        introOverlay.classList.remove("active");
        introOverlay.setAttribute("hidden", "");
      }
      if (game.getState().preDeparture) {
        showShop(game);
      } else {
        window.__METIS_RENDER__();
      }
    }
  });
  const travelBtn = document.getElementById("btn-travel");
  const campBtn = document.getElementById("btn-camp");
  if (travelBtn) {
    travelBtn.addEventListener("click", () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const prevWear = game.getState().wear;
      const blocked = travelOneDay();
      haptics_default.travel();
      if (blocked === true) return;
      if (blocked) return;
      const after = game.getState();
      if (after.wear > prevWear) haptics_default.wear();
      const node = NODES[after.node];
      const prevNode = NODES[after.node - 1];
      const cart = game.getCart();
      journalLog({
        day: after.day,
        date: monthName(after.month) + " " + after.day,
        title: "On the Trail",
        text: buildTravelReflection(prevNode, node, after, cart, after.day),
        mech: after.wear > prevWear ? "Wear +1" : "",
        collapsed: false
      });
      window.__METIS_RENDER__();
    });
  }
  if (campBtn) {
    campBtn.addEventListener("click", () => {
      showCamp(game);
    });
  }
  const journalToggle = document.getElementById("journal-toggle");
  if (journalToggle) {
    journalToggle.addEventListener("click", () => {
      const panel = document.getElementById("bottom-panel");
      if (panel) {
        panel.classList.toggle("collapsed");
        const icon = document.getElementById("journal-toggle-icon");
        if (icon) icon.textContent = panel.classList.contains("collapsed") ? "\u25B6" : "\u25BC";
      }
    });
  }
  const eventContinue = document.getElementById("event-continue");
  if (eventContinue) eventContinue.onclick = () => {
    document.getElementById("event-overlay")?.classList.remove("active");
  };
  const settlementContinue = document.getElementById("settlement-continue");
  if (settlementContinue) settlementContinue.onclick = () => {
    const st = game.getState().pendingSettlement;
    const after = game.getState();
    if (st) {
      const cart = game.getCart();
      const weather = after.weather || "clear";
      const isFirstVisit = !visitedSettlements.has(st.name);
      if (isFirstVisit) visitedSettlements.add(st.name);
      const text = isFirstVisit ? buildSettlementArrivalEntry(st) : buildSettlementJourneyEntry(st, weather, cart);
      journalLog({
        day: after.day,
        date: monthName(after.month) + " " + after.day,
        title: `Arrived at ${st.name}`,
        text,
        mech: "",
        collapsed: false
      });
    }
    game.settlementAction("continue");
    document.getElementById("settlement-overlay")?.classList.remove("active");
    window.__METIS_RENDER__();
  };
  const cartClose = document.getElementById("cart-close-btn");
  const cartClose2 = document.getElementById("cart-close-btn-2");
  if (cartClose) cartClose.onclick = () => document.getElementById("cart-overlay")?.classList.remove("active");
  if (cartClose2) cartClose2.onclick = () => document.getElementById("cart-overlay")?.classList.remove("active");
  const crewClose = document.getElementById("crew-close-btn");
  const crewClose2 = document.getElementById("crew-close-btn-2");
  if (crewClose) crewClose.onclick = () => document.getElementById("crew-overlay")?.classList.remove("active");
  if (crewClose2) crewClose2.onclick = () => document.getElementById("crew-overlay")?.classList.remove("active");
  const restartBtn = document.getElementById("end-restart");
  if (restartBtn) restartBtn.onclick = () => {
    clearSave();
    window.location.reload();
  };
}
__name(bootstrap, "bootstrap");
window.__METIS_BOOT__ = bootstrap;
(/* @__PURE__ */ __name(function fixMobileViewport() {
  const root = document.getElementById("game-root");
  const container = document.getElementById("game-container");
  if (!root) return;
  function setHeight() {
    const h = window.innerHeight;
    root.style.height = h + "px";
    if (container) container.style.height = h + "px";
  }
  __name(setHeight, "setHeight");
  if (window.innerWidth < 768) {
    setHeight();
    window.addEventListener("resize", setHeight);
  }
}, "fixMobileViewport"))();
function publishResult(text) {
  window.__METIS_PENDING_RESULT__ = text;
}
__name(publishResult, "publishResult");
function travelOneDay() {
  const game = window._metisGame;
  const prev = game.getState();
  if (prev.usedWeight > prev.capacity) {
    showCart(game);
    publishResult("Cart is overloaded. Offload items before traveling.");
    return true;
  }
  const result = game.travelOneDay();
  const state = game.getState();
  if (state.pendingEvent) return null;
  if (state.over) return null;
  if (state.pendingSettlement) return null;
  showCamp(game);
  return result;
}
__name(travelOneDay, "travelOneDay");
function pushOn(game) {
  game.pushOn();
}
__name(pushOn, "pushOn");
function render() {
  const game = window._metisGame;
  if (!game) return;
  if (!window._metisMapInited && window.__METIS_READY__ && document.getElementById("intro-overlay")?.classList.contains("active")) {
    initMap();
    window._metisMapInited = true;
  }
  const state = game.getState();
  renderStatusBar(state);
  updateMap(state);
  if (state.over) {
    showEnd(game);
    return;
  }
  if (state.preDeparture) {
    showShop(game);
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
  window.__METIS_PENDING_RESULT__ = null;
  renderTrailIntel(state);
}
__name(render, "render");
function renderTrailIntel(state) {
  const el = document.getElementById("trail-intel");
  if (!el) return;
  const intel = (state.trailIntel || []).filter((i) => state.day - i.fromDay <= 3);
  if (intel.length === 0) {
    el.innerHTML = "";
    el.style.display = "none";
    return;
  }
  el.style.display = "block";
  el.innerHTML = intel.map((i) => {
    const daysOld = state.day - i.fromDay;
    const freshness = daysOld <= 1 ? "\u{1F7E2}" : daysOld <= 2 ? "\u{1F7E1}" : "\u{1F534}";
    return `<div class="intel-item" style="font-size:0.85em;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.08);"><span style="margin-right:4px;">${freshness}</span>${i.text}${i.bonus ? ' <span style="color:#B8860B;font-size:0.8em;">(+' + i.bonus.dcBonus + " DC)</span>" : ""}</div>`;
  }).join("");
}
__name(renderTrailIntel, "renderTrailIntel");
function hideOverlays() {
  ["intro-overlay", "event-overlay", "settlement-overlay", "cart-overlay", "crew-overlay", "camp-overlay", "predeparture-overlay", "settings-overlay", "leaderboard-overlay", "end-overlay"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
}
__name(hideOverlays, "hideOverlays");
function renderDicePill(result) {
  const rc = document.getElementById("event-roll-display");
  if (!rc) return;
  rc.style.display = "flex";
  rc.innerHTML = `
    <div class="roll-label">Roll</div>
    <div id="die" class="die small font-spectral">-</div>
    <div class="roll-label">Need ${result.dc}+</div>
  `;
}
__name(renderDicePill, "renderDicePill");
function animateDicePill(result, fullDiceResult) {
  const el = document.getElementById("die");
  if (!el) return;
  el.className = "die small font-spectral spin";
  let ticks = 0;
  const maxTicks = 8 + Math.floor(Math.random() * 5);
  const id = setInterval(() => {
    el.textContent = String(Math.floor(Math.random() * 20) + 1);
    ticks += 1;
    if (ticks >= maxTicks) {
      clearInterval(id);
      el.textContent = String(result.roll);
      el.className = "die small font-spectral settled " + (result.success ? "pass" : "fail");
      let revealed = false;
      const doReveal = /* @__PURE__ */ __name(() => {
        if (revealed) return;
        revealed = true;
        el.removeEventListener("animationend", doReveal);
        revealDiceOutcome(fullDiceResult);
      }, "doReveal");
      el.addEventListener("animationend", doReveal);
      setTimeout(doReveal, 500);
    }
  }, 60);
}
__name(animateDicePill, "animateDicePill");
function revealDiceOutcome(diceResult) {
  const result = diceResult.result;
  const outcomeEl = document.getElementById("event-dice-outcome");
  if (outcomeEl) {
    const mod = result.total - result.roll;
    const modStr = mod !== 0 ? ` (${mod >= 0 ? "+" : ""}${mod}${result.modBreakdown && result.modBreakdown.length ? ": " + result.modBreakdown.join(", ") : ""})` : "";
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll}${modStr} = ${result.total} \u2014 need ${result.dc}+</span>`;
    const resultHtml = result.success ? '<span class="outcome-pass">Success</span>' : '<span class="outcome-fail">Failure</span>';
    let flavorText = result.text || "";
    flavorText = flavorText.replace(/^(Success|Failure)\.\s*/, "");
    const flavorClass = result.success ? "success" : "fail";
    const flavorHtml = flavorText ? `<p class="outcome-flavor ${flavorClass}">${flavorText}</p>` : "";
    const mechMsgs = [];
    if (result.effects && result.effects.length) {
      mechMsgs.push(...result.effects);
    }
    const mechHtml = mechMsgs.length ? `<div class="outcome-mechanical">${mechMsgs.join(" \xB7 ")}</div>` : "";
    outcomeEl.innerHTML = `${rollHtml} \u2014 ${resultHtml}${flavorHtml}${mechHtml}`;
    outcomeEl.classList.add("visible");
  }
  const continueEl = document.getElementById("event-continue");
  if (continueEl) {
    continueEl.style.display = "inline-block";
    continueEl.classList.add("ready");
  }
}
__name(revealDiceOutcome, "revealDiceOutcome");
var EVENT_IMAGE_MAP = {
  // By classification
  "Weather": "events/event_storm.png",
  "Supply Find": "events/event_supplies.png",
  "Survival": "events/event_cart.png",
  "Disease": "events/event_sick.png",
  "Trade & Regulation": "events/event_people.png",
  "Free Trade": "events/event_people.png",
  "Supply & Scarcity": "events/event_supplies.png",
  "Law & Order": "events/event_people.png",
  "Law & Desertion": "events/event_people.png",
  "Community & Hospitality": "events/event_camp.png",
  "Trail Justice": "events/event_people.png",
  "Charity & Healing": "events/event_sick.png",
  "Hardship & Loss": "events/event_sick.png",
  "Trail News": "events/event_people.png",
  "Freight & Trade": "events/event_people.png"
};
function pickEventImage(ev) {
  if (ev.classification && EVENT_IMAGE_MAP[ev.classification]) {
    return EVENT_IMAGE_MAP[ev.classification];
  }
  const id = ev.id || "";
  if (/fire|wind|storm|hail|thunder/.test(id)) return "events/event_storm.png";
  if (/river|ford|ferry|boat|crossing|flood|ice_break/.test(id)) return "events/event_river.png";
  if (/buffalo|bison|hunt/.test(id)) return "events/event_buffalo.png";
  if (/camp|cookery|night|dance|prayer/.test(id)) return "events/event_camp.png";
  if (/axle|wheel|cart_fort|sandbar|cart_raft|cache/.test(id)) return "events/event_cart.png";
  if (/trader|scout|cree|elder|nwmp|mp_check|inspection|rivalry|court|welcome|charity|news|boat|brigade/.test(id)) return "events/event_people.png";
  if (/cholera|smallpox|snow_blind|frost|deserter/.test(id)) return "events/event_sick.png";
  if (/cache|find|herb|bee|tree|blanket|gather|beaver|ammo|firewood/.test(id)) return "events/event_supplies.png";
  if (/river/.test(id)) return "events/event_river.png";
  return "events/event_prairie.png";
}
__name(pickEventImage, "pickEventImage");
function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  hideOverlays();
  const textEl = document.getElementById("event-text");
  const choicesEl = document.getElementById("event-choices");
  const continueEl = document.getElementById("event-continue");
  if (!textEl || !choicesEl) return;
  const eventArtEl = document.getElementById("event-art");
  if (eventArtEl) {
    const img = pickEventImage(ev);
    if (img) {
      eventArtEl.src = img;
      eventArtEl.style.display = "block";
    } else {
      eventArtEl.style.display = "none";
    }
  }
  textEl.textContent = ev.text;
  const sourceEl = document.getElementById("event-source");
  if (sourceEl) {
    if (ev.source && ev.source.quote) {
      const rawQuote = ev.source.quote;
      const quote = rawQuote.replace(/^"|"$/g, "");
      const author = ev.source.author || "";
      const work = ev.source.work || "";
      const year = ev.source.year || "";
      const attrib = [author, work, year].filter(Boolean).join(", ");
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">\u2014 ${attrib}</span>` : "") + (ev.source.context ? `<span class="src-context">${ev.source.context}</span>` : "");
      sourceEl.style.display = "block";
    } else {
      sourceEl.style.display = "none";
    }
  }
  const amountEl = document.getElementById("event-amount");
  if (amountEl) {
    const amount = ev.amount || ev.rollAdjust || null;
    amountEl.textContent = "";
    amountEl.style.display = "none";
    if (amount) {
      amountEl.textContent = amount;
      amountEl.style.display = "block";
    }
  }
  const stampEl = document.getElementById("event-stamp");
  if (stampEl) {
    stampEl.textContent = ev.classification || "";
    stampEl.style.display = ev.classification ? "inline-block" : "none";
  }
  choicesEl.innerHTML = "";
  continueEl.style.display = "none";
  continueEl.classList.remove("ready");
  const rc = document.getElementById("event-roll-display");
  if (rc) rc.style.display = "none";
  const outcomeEl = document.getElementById("event-dice-outcome");
  if (outcomeEl) {
    outcomeEl.textContent = "";
    outcomeEl.classList.remove("visible");
  }
  let diceResult = null;
  let eventData = null;
  let eventBefore = null;
  continueEl.onclick = () => {
    continueEl.classList.remove("ready");
    if (diceResult) {
      const outcome = buildEventChoiceOutcome(diceResult.stepLog, diceResult.before, game.getState());
      if (outcome) publishResult(outcome);
      if (eventData) {
        const after = game.getState();
        const res = diceResult.result;
        const cart = game.getCart();
        const weather = after.weather || "clear";
        const mechParts = [];
        if (after.food !== diceResult.before.food) mechParts.push(`${after.food - diceResult.before.food >= 0 ? "+" : ""}${(after.food - diceResult.before.food).toFixed(1)} Food`);
        if (after.wear !== diceResult.before.wear) mechParts.push(`Wear ${after.wear - diceResult.before.wear >= 0 ? "+" : ""}${after.wear - diceResult.before.wear}`);
        if (after.morale !== diceResult.before.morale) mechParts.push(`Morale ${after.morale - diceResult.before.morale >= 0 ? "+" : ""}${after.morale - diceResult.before.morale}`);
        if (after.crew !== diceResult.before.crew) mechParts.push(`Crew: ${diceResult.before.crew} \u2192 ${after.crew}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + " " + after.day,
          title: eventData.classification || "Event",
          text: buildEventReflection(eventData, res, weather, cart),
          dice: res && res.roll !== null ? `Rolled ${res.roll}${res.total - res.roll !== 0 ? ` (${res.total - res.roll >= 0 ? "+" : ""}${res.total - res.roll}${res.modBreakdown && res.modBreakdown.length ? ": " + res.modBreakdown.join(", ") : ""})` : ""} = ${res.total} \u2014 need ${res.dc}+ \u2014 ${res.success ? "\u2713 Success" : "\u2717 Failure"}` : null,
          mech: mechParts.join(" \xB7 "),
          collapsed: false
        });
      }
      diceResult = null;
      eventData = null;
    } else {
      if (eventData) {
        const after = game.getState();
        const cart = game.getCart();
        const weather = after.weather || "clear";
        const beforeState = eventBefore || after;
        const mechParts = [];
        if (after.food !== beforeState.food) mechParts.push(`${after.food - beforeState.food >= 0 ? "+" : ""}${(after.food - beforeState.food).toFixed(1)} Food`);
        if (after.wear !== beforeState.wear) mechParts.push(`Wear ${after.wear - beforeState.wear >= 0 ? "+" : ""}${after.wear - beforeState.wear}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + " " + after.day,
          title: eventData.classification || "Event",
          text: buildEventAutoEntry(eventData.text || "", weather, cart),
          mech: mechParts.join(" \xB7 "),
          collapsed: false
        });
        eventData = null;
        eventBefore = null;
      }
    }
    continueEl.style.display = "none";
    const overlay = document.getElementById("event-overlay");
    if (overlay) overlay.classList.remove("active");
    window.__METIS_RENDER__();
  };
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    const hasItem = !ch.requiresItem || game.getCart()?.some((it) => it.name === ch.requiresItem.name && it.count >= ch.requiresItem.count);
    if (ch.requiresItem && !hasItem) {
      btn.disabled = true;
      btn.style.opacity = "0.45";
      btn.style.cursor = "not-allowed";
    }
    btn.textContent = ch.text;
    const costParts = [];
    if (typeof ch.dc === "number") costParts.push(`Roll ${ch.dc}+`);
    if (typeof ch.food === "number" && ch.food < 0) costParts.push(`${ch.food} food`);
    if (typeof ch.wear === "number" && ch.wear > 0) costParts.push(`+${ch.wear} wear`);
    if (typeof ch.morale === "number" && ch.morale < 0) costParts.push(`${ch.morale} morale`);
    if (typeof ch.time === "number" && ch.time > 0) costParts.push(`+${ch.time} day`);
    if (ch.requiresItem) costParts.push(`requires ${ch.requiresItem.name}\xD7${ch.requiresItem.count}`);
    const costText = costParts.join(" \xB7 ");
    if (costText) {
      const sub = document.createElement("div");
      sub.className = "choice-cost";
      sub.textContent = costText;
      btn.appendChild(sub);
    }
    btn.onclick = () => {
      const prev = game.getState();
      eventData = { classification: ev.classification, text: ev.text };
      const stepLog = game.chooseEventChoice(i);
      const entry = stepLog && stepLog[0] ? stepLog[0] : null;
      const res = entry && entry.result ? entry.result : entry;
      document.querySelectorAll(".choice-btn").forEach((b) => {
        b.style.display = "none";
      });
      if (res && res.roll !== null && res.dc !== null) {
        diceResult = { stepLog, before: prev, result: res };
        renderDicePill(res);
        animateDicePill(res, diceResult);
        return;
      }
      const flavorText = res && res.text ? res.text.replace(/^(Success|Failure)\.\s*/, "") : "";
      const oc = document.getElementById("event-dice-outcome");
      if (oc) {
        let html = "";
        if (flavorText) {
          html += `<p class="outcome-flavor neutral">${flavorText}</p>`;
        }
        const mechMsgs = [];
        if (res && res.effects && res.effects.length) {
          mechMsgs.push(...res.effects);
        }
        if (mechMsgs.length) {
          html += `<div class="outcome-mechanical">${mechMsgs.join(" \xB7 ")}</div>`;
        }
        oc.innerHTML = html;
        oc.classList.add("visible");
      }
      continueEl.style.display = "inline-block";
      continueEl.classList.add("ready");
    };
    choicesEl.appendChild(btn);
  });
  if (!ev.choices || ev.choices.length === 0) {
    continueEl.style.display = "inline-block";
    continueEl.classList.add("ready");
    eventData = { classification: ev.classification, text: ev.text };
    eventBefore = { ...game.getState() };
  }
  document.getElementById("event-overlay")?.classList.add("active");
}
__name(showEvent, "showEvent");
function buildEventChoiceOutcome(stepLog, before, after) {
  const msgs = [];
  const entry = stepLog && stepLog[0] ? stepLog[0] : null;
  const res = entry && entry.result ? entry.result : entry;
  if (res && res.roll !== null && res.dc !== null) {
    const mod = res.total - res.roll;
    const modStr = mod !== 0 ? ` (${mod >= 0 ? "+" : ""}${mod}${res.modBreakdown && res.modBreakdown.length ? ": " + res.modBreakdown.join(", ") : ""})` : "";
    msgs.push(`Rolled ${res.roll}${modStr} = ${res.total} (needed ${res.dc}+): ${res.success ? "Success" : "Failure"}`);
  }
  if (res && res.text) msgs.push(res.text);
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? "+" : ""}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? "+" : ""}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? "+" : ""}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.node !== before.node) msgs.push(`Arrived at: ${NODES[after.node]?.name || "unknown"}`);
  if (res && res.flags && res.flags.length) msgs.push(`Flag: ${res.flags[0]}`);
  if (res && res.reps && res.reps.length) {
    const r = res.reps[0];
    msgs.push(`Reputation ${r.key}: ${r.delta >= 0 ? "+" : ""}${r.delta} (now ${r.value})`);
  }
  if (res && res.effects && res.effects.length) {
    msgs.push(...res.effects);
  }
  if (!msgs.length) return "The day passes without change.";
  return msgs.join(", ");
}
__name(buildEventChoiceOutcome, "buildEventChoiceOutcome");
function showSettlement(game) {
  hideOverlays();
  haptics_default.arrive();
  const state = game.getState();
  const node = game.getCurrentNode();
  const nameEl = document.getElementById("settlement-name");
  const badgeEl = document.getElementById("settlement-badge");
  const distanceEl = document.getElementById("settlement-distance");
  const descEl = document.getElementById("settlement-desc");
  const actionsEl = document.getElementById("settlement-actions");
  const rollEl = document.getElementById("settlement-roll-display");
  const resultEl = document.getElementById("settlement-result");
  const continueEl = document.getElementById("settlement-continue");
  if (!nameEl || !badgeEl || !distanceEl || !descEl || !actionsEl) return;
  const artEl = document.getElementById("settlement-art");
  if (artEl) {
    if (node.art) {
      artEl.src = node.art;
      artEl.style.display = "block";
    } else {
      artEl.style.display = "none";
    }
  }
  nameEl.textContent = node.name;
  const typeLabels = { hbc: "HBC Fort", metis: "M\xE9tis Camp", nwmp: "NWMP Post", mission: "Mission", trading: "Trading Post" };
  badgeEl.textContent = typeLabels[node.type] || node.type.toUpperCase();
  badgeEl.className = "settlement-badge " + (node.type || "hbc");
  const distKm = Math.round((node.dist || 0) * 50);
  distanceEl.textContent = `${distKm} km from Fort Garry`;
  descEl.textContent = node.desc || "";
  const statusEl = document.getElementById("settlement-status");
  if (statusEl) {
    const foodCls = state.food <= 5 ? ' style="color:var(--clr-danger)"' : "";
    const wearCls = state.wear >= 4 ? ' style="color:var(--clr-danger)"' : "";
    const crewCls = state.crew === "exhausted" ? ' style="color:var(--clr-danger)"' : state.crew === "tired" ? ' style="color:var(--clr-warn)"' : "";
    statusEl.innerHTML = `
      <span class="pill"${foodCls}>\u{1F356} ${Math.floor(state.food)} Food</span>
      <span class="pill"${wearCls}>\u{1F527} ${state.wear} Wear</span>
      <span class="pill">\u{1F60A} ${state.morale} Morale</span>
      <span class="pill"${crewCls}>\u{1F465} ${state.crew}</span>
    `;
  }
  actionsEl.innerHTML = "";
  if (rollEl) {
    rollEl.style.display = "none";
    rollEl.innerHTML = "";
  }
  if (resultEl) {
    resultEl.style.display = "none";
    resultEl.textContent = "";
  }
  if (continueEl) continueEl.style.display = "none";
  const actions = game.getSettlementActions(node.type);
  const grouped = {};
  const ungrouped = [];
  actions.forEach((a) => {
    if (a.groupId) {
      if (!grouped[a.groupId]) grouped[a.groupId] = [];
      grouped[a.groupId].push(a);
    } else {
      ungrouped.push(a);
    }
  });
  let settlementActionPerformed = false;
  function checkCanDo(action) {
    const st = game.getState();
    const cart = game.getCart();
    switch (action.groupId || action.id) {
      case "trade_furs_food":
        return cart.some((i) => (i.type === "trade" || i.category === "furs") && i.count > 0);
      case "trade_furs_supplies":
        return cart.some((i) => (i.type === "trade" || i.category === "furs") && i.count > 0);
      case "rest":
        return st.food >= 1;
      case "trade_gossip":
        return true;
      case "dance":
        return st.food >= 1;
      case "share_food":
        return st.food >= 2;
      case "rest_blessing":
        return true;
      case "heal_crew":
        return (cart.find((i) => i.name === "Medicine Pouch")?.count || 0) >= 1 || st.food >= 2;
      default:
        return true;
    }
  }
  __name(checkCanDo, "checkCanDo");
  function renderGroupedCard(groupActions) {
    const groupId = groupActions[0].groupId;
    const groupLabel = groupActions[0].groupLabel;
    const card = document.createElement("div");
    card.className = "settlement-action-card settlement-action-group";
    const nameRow = document.createElement("div");
    nameRow.className = "settlement-action-card-name";
    nameRow.textContent = groupLabel;
    card.appendChild(nameRow);
    const sharedDesc = groupActions[0].desc;
    if (sharedDesc) {
      const descRow = document.createElement("div");
      descRow.className = "settlement-action-card-desc";
      descRow.textContent = sharedDesc;
      card.appendChild(descRow);
    }
    const optionsWrap = document.createElement("div");
    optionsWrap.className = "settlement-action-group-options";
    let selectedIndex = 0;
    groupActions.forEach((action, idx) => {
      const canDo = !settlementActionPerformed && checkCanDo(action);
      const optRow = document.createElement("label");
      optRow.className = "settlement-action-group-option" + (canDo ? "" : " disabled");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `group_${groupId}`;
      radio.value = idx;
      radio.checked = idx === 0;
      radio.disabled = !canDo;
      radio.className = "settlement-action-group-radio";
      const optLabel = document.createElement("span");
      optLabel.className = "settlement-action-group-label";
      optLabel.textContent = action.label;
      const optDetail = document.createElement("span");
      optDetail.className = "settlement-action-group-detail";
      optDetail.textContent = `Cost: ${action.cost} \u2192 ${action.risk}`;
      optRow.appendChild(radio);
      optRow.appendChild(optLabel);
      optRow.appendChild(optDetail);
      optionsWrap.appendChild(optRow);
    });
    card.appendChild(optionsWrap);
    const btn = document.createElement("button");
    btn.className = "settlement-action-card-btn";
    btn.textContent = "Do It";
    const canDoAny = groupActions.some((a) => checkCanDo(a));
    if (!canDoAny) {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
    card.appendChild(btn);
    actionsEl.appendChild(card);
    if (canDoAny) {
      btn.addEventListener("click", () => {
        if (settlementActionPerformed) return;
        settlementActionPerformed = true;
        const checked = optionsWrap.querySelector('input[type="radio"]:checked');
        const selectedGroupIndex = checked ? parseInt(checked.value, 10) : 0;
        const selectedAction = groupActions[selectedGroupIndex];
        actionsEl.querySelectorAll(".settlement-action-card-btn").forEach((b) => {
          b.disabled = true;
          b.classList.add("disabled");
        });
        const beforeState = game.getState();
        const beforeCart = game.getCart();
        const result = game.settlementAction(selectedAction.id);
        const afterState = game.getState();
        const afterCart = game.getCart();
        actionsEl.querySelectorAll(".settlement-action-card").forEach((c) => {
          c.style.display = "none";
        });
        const flavor = buildSettlementActionEntry(selectedAction.id, selectedAction.cost, selectedAction.risk || selectedAction.flavor);
        const reflectionText = buildSettlementReflection(node, afterState, afterCart);
        const fullText = flavor + " " + reflectionText;
        const mechParts = [];
        if (afterState.food !== beforeState.food) mechParts.push(`${afterState.food - beforeState.food >= 0 ? "+" : ""}${(afterState.food - beforeState.food).toFixed(1)} Food`);
        if (afterState.wear !== beforeState.wear) mechParts.push(`Wear ${afterState.wear - beforeState.wear >= 0 ? "+" : ""}${afterState.wear - beforeState.wear}`);
        if (afterState.morale !== beforeState.morale) mechParts.push(`Morale ${afterState.morale - beforeState.morale >= 0 ? "+" : ""}${afterState.morale - beforeState.morale}`);
        if (afterState.crew !== beforeState.crew) mechParts.push(`Crew: ${beforeState.crew} \u2192 ${afterState.crew}`);
        const resultCard = document.createElement("div");
        resultCard.className = "settlement-action-card";
        resultCard.style.borderColor = "var(--clr-accent)";
        const rcName = document.createElement("div");
        rcName.className = "settlement-action-card-name";
        rcName.textContent = selectedAction.label;
        resultCard.appendChild(rcName);
        const rcFlavor = document.createElement("div");
        rcFlavor.className = "settlement-action-card-flavor";
        rcFlavor.textContent = fullText;
        resultCard.appendChild(rcFlavor);
        if (mechParts.length) {
          const rcMech = document.createElement("div");
          rcMech.className = "settlement-action-card-cost";
          rcMech.textContent = mechParts.join(" \xB7 ");
          resultCard.appendChild(rcMech);
        }
        if (intelText(groupActions[0].id)) {
          const rcIntel = document.createElement("div");
          rcIntel.className = "settlement-action-card-desc";
          const intel = afterState.trailIntel || [];
          if (intel.length > 0) rcIntel.textContent = intel[intel.length - 1].text;
          resultCard.appendChild(rcIntel);
        }
        const rcBtn = document.createElement("button");
        rcBtn.className = "settlement-action-card-btn";
        rcBtn.textContent = "Continue West";
        rcBtn.addEventListener("click", () => {
          actionsEl.querySelectorAll(".settlement-action-card").forEach((c) => {
            c.style.display = "none";
          });
          if (continueEl) continueEl.style.display = "none";
          game.settlementAction("continue");
          window.__METIS_RENDER__();
        });
        resultCard.appendChild(rcBtn);
        actionsEl.appendChild(resultCard);
      });
    }
  }
  __name(renderGroupedCard, "renderGroupedCard");
  function intelText(id) {
    return ["get_intel", "trade_gossip", "gossip"].includes(id);
  }
  __name(intelText, "intelText");
  function renderSingleCard(action) {
    const card = document.createElement("div");
    card.className = "settlement-action-card";
    const nameRow = document.createElement("div");
    nameRow.className = "settlement-action-card-name";
    nameRow.textContent = action.label;
    const costRow = document.createElement("div");
    costRow.className = "settlement-action-card-cost";
    costRow.textContent = `Cost: ${action.cost}`;
    const riskRow = document.createElement("div");
    riskRow.className = "settlement-action-card-risk";
    riskRow.textContent = action.risk ? `Receive: ${action.risk}` : "";
    const flavorRow = document.createElement("div");
    flavorRow.className = "settlement-action-card-flavor";
    flavorRow.textContent = action.flavor;
    const descRow = document.createElement("div");
    descRow.className = "settlement-action-card-desc";
    descRow.textContent = action.desc || "";
    const btn = document.createElement("button");
    btn.className = "settlement-action-card-btn";
    btn.textContent = "Do It";
    const canDo = !settlementActionPerformed && checkCanDo(action);
    if (!canDo) {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
    card.appendChild(nameRow);
    card.appendChild(costRow);
    if (riskRow.textContent) card.appendChild(riskRow);
    card.appendChild(flavorRow);
    if (descRow.textContent) card.appendChild(descRow);
    card.appendChild(btn);
    actionsEl.appendChild(card);
    if (canDo) {
      btn.addEventListener("click", () => {
        if (settlementActionPerformed) return;
        settlementActionPerformed = true;
        actionsEl.querySelectorAll(".settlement-action-card-btn").forEach((b) => {
          b.disabled = true;
          b.classList.add("disabled");
        });
        const beforeState = game.getState();
        const beforeCart = game.getCart();
        const result = game.settlementAction(action.id);
        const afterState = game.getState();
        const afterCart = game.getCart();
        actionsEl.querySelectorAll(".settlement-action-card").forEach((c) => {
          c.style.display = "none";
        });
        const flavor = buildSettlementActionEntry(action.id, action.cost, action.risk || action.flavor);
        const reflectionText = buildSettlementReflection(node, afterState, afterCart);
        const fullText = flavor + " " + reflectionText;
        const mechParts = [];
        if (afterState.food !== beforeState.food) mechParts.push(`${afterState.food - beforeState.food >= 0 ? "+" : ""}${(afterState.food - beforeState.food).toFixed(1)} Food`);
        if (afterState.wear !== beforeState.wear) mechParts.push(`Wear ${afterState.wear - beforeState.wear >= 0 ? "+" : ""}${afterState.wear - beforeState.wear}`);
        if (afterState.morale !== beforeState.morale) mechParts.push(`Morale ${afterState.morale - beforeState.morale >= 0 ? "+" : ""}${afterState.morale - beforeState.morale}`);
        if (afterState.crew !== beforeState.crew) mechParts.push(`Crew: ${beforeState.crew} \u2192 ${afterState.crew}`);
        const resultCard = document.createElement("div");
        resultCard.className = "settlement-action-card";
        resultCard.style.borderColor = "var(--clr-accent)";
        const rcName = document.createElement("div");
        rcName.className = "settlement-action-card-name";
        rcName.textContent = action.label;
        resultCard.appendChild(rcName);
        const rcFlavor = document.createElement("div");
        rcFlavor.className = "settlement-action-card-flavor";
        rcFlavor.textContent = fullText;
        resultCard.appendChild(rcFlavor);
        if (mechParts.length) {
          const rcMech = document.createElement("div");
          rcMech.className = "settlement-action-card-cost";
          rcMech.textContent = mechParts.join(" \xB7 ");
          resultCard.appendChild(rcMech);
        }
        if (intelText(action.id)) {
          const rcIntel = document.createElement("div");
          rcIntel.className = "settlement-action-card-desc";
          const intel = afterState.trailIntel || [];
          if (intel.length > 0) rcIntel.textContent = intel[intel.length - 1].text;
          resultCard.appendChild(rcIntel);
        }
        const rcBtn = document.createElement("button");
        rcBtn.className = "settlement-action-card-btn";
        rcBtn.textContent = "Continue West";
        rcBtn.addEventListener("click", () => {
          actionsEl.querySelectorAll(".settlement-action-card").forEach((c) => {
            c.style.display = "none";
          });
          if (continueEl) continueEl.style.display = "none";
          game.settlementAction("continue");
          window.__METIS_RENDER__();
        });
        resultCard.appendChild(rcBtn);
        actionsEl.appendChild(resultCard);
      });
    }
  }
  __name(renderSingleCard, "renderSingleCard");
  Object.values(grouped).forEach(renderGroupedCard);
  ungrouped.forEach(renderSingleCard);
  document.getElementById("settlement-overlay")?.classList.add("active");
}
__name(showSettlement, "showSettlement");
function showCart(game) {
  hideOverlays();
  const state = game.getState();
  const cart = game.getCart();
  const listEl = document.getElementById("inv-list");
  if (!listEl) return;
  const overloaded = state.usedWeight > state.capacity;
  const excess = state.usedWeight - state.capacity;
  const weightBar = overloaded ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:0;"><div style="font-weight:700;color:#8B0000;">\u26A0 Overloaded \u2014 ${state.usedWeight} / ${state.capacity} kg</div><div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div></div>` : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:0;"><div style="font-weight:700;color:#2D4A3E;">Cart \u2014 ${state.usedWeight} / ${state.capacity} kg</div></div>`;
  const items = cart.map((i) => {
    const canUnload = i.count > 0;
    const hint = i.category ? getCategoryHint(i.category) : "";
    const desc = i.desc ? `<div style="font-size:0.8em;color:#5a4a3a;margin-top:2px;">${i.desc}</div>` : "";
    const mbStr = i.type === "trade" || i.category === "furs" ? `<span style="color:var(--clr-accent);font-size:0.85em;margin-left:4px;">Trade good</span>` : "";
    return `
    <div class="cart-row" style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;"><span style="font-weight:600;">${getItemIcon(i.name)} ${i.name} \xD7${i.count} (${(i.wt * i.count).toFixed(1)} kg)</span>${mbStr}${hint ? `<div style="font-size:0.75em;color:#6b5c4a;margin-top:1px;">${hint}</div>` : ""}${desc}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;flex-shrink:0;">Unload (\u2212${i.wt} kg)</button>` : ""}
    </div>`;
  }).join("");
  listEl.innerHTML = weightBar + items;
  listEl.querySelectorAll(".unload-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemName = btn.getAttribute("data-item");
      game.offloadItem(itemName);
      const newState = game.getState();
      if (overloaded && newState.usedWeight <= newState.capacity) {
        document.getElementById("cart-overlay")?.classList.remove("active");
        window.__METIS_RENDER__();
      } else {
        showCart(game);
      }
    });
  });
  document.getElementById("cart-overlay")?.classList.add("active");
}
__name(showCart, "showCart");
function getCategoryHint(category) {
  const map2 = {
    provisions: "1 food/day keeps the crew alive. Running out means death.",
    repair: "Reduces cart wear. No repair supplies = stranded when cart breaks.",
    parts: "Needed for cart repair and crafting recipes at settlements.",
    furs: "Trade goods. Deliver to Fort Edmonton for endgame score.",
    shelter: "Cold nights and river crossings. Tarp doubles as raft.",
    fuel: "Required for cold nights. Without fire, crew condition drops.",
    hunting: "Ammo enables hunting camp action. Also used in defensive events.",
    medical: "Heals crew when injured or ill. Saves morale in crisis events.",
    tool: "Enables major repairs and advanced crafting at settlements.",
    ammo: "Required for hunting. Some events need ammunition."
  };
  return map2[category] || "";
}
__name(getCategoryHint, "getCategoryHint");
function showShop(game) {
  const state = game.getState();
  const listEl = document.getElementById("predeparture-list");
  const weightEl = document.getElementById("predeparture-weight");
  const currentEl = document.getElementById("pd-weight-current");
  const statusEl = document.getElementById("pd-weight-status");
  const confirmBtn = document.getElementById("pd-confirm");
  if (!listEl || !weightEl || !currentEl || !statusEl || !confirmBtn) return;
  const balanceEl = document.getElementById("shop-balance");
  const shopStatusEl = document.getElementById("shop-status");
  const foodCountEl = document.getElementById("shop-food-count");
  const isPreDeparture = !!state.preDeparture;
  if (isPreDeparture) {
    let recalc = function() {
      let totalWeight2 = 0;
      const cart2 = game.getCart();
      cart2.forEach((i) => {
        totalWeight2 += i.wt * i.count;
      });
      starterItems.forEach((item) => {
        totalWeight2 += item.wt * item.count;
      });
      if (selectedExtra) {
        totalWeight2 += selectedExtra.wt * selectedExtra.count;
      }
      currentEl.textContent = totalWeight2.toFixed(1);
      weightEl.classList.remove("over", "at-capacity", "under");
      statusEl.classList.remove("over", "at-capacity", "under");
      if (totalWeight2 > state.capacity) {
        weightEl.classList.add("over");
        statusEl.classList.add("over");
        statusEl.textContent = `${(totalWeight2 - state.capacity).toFixed(1)} kg over`;
        confirmBtn.disabled = true;
      } else {
        weightEl.classList.add("under");
        statusEl.classList.add("under");
        statusEl.textContent = `${(state.capacity - totalWeight2).toFixed(1)} kg spare`;
        confirmBtn.disabled = false;
      }
    }, renderList = function() {
      let html = '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:10px 0 6px;">Starter Kit (auto-included)</div>';
      starterItems.forEach((item) => {
        html += `<div class="pd-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--clr-muted);">
          <div class="pd-item-info">
            <span class="pd-name">${item.name}</span>
            <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.wt} kg</div>
          </div>
        </div>`;
      });
      html += '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:14px 0 6px;">Pick ONE Extra Item</div>';
      extraItems.forEach((item) => {
        const isSelected = selectedExtra && selectedExtra.name === item.name;
        const itemWeight = (item.wt * item.count).toFixed(1);
        html += `<div class="pd-row extra-item-row" data-item="${item.name}" style="display:flex;justify-content:space-between;align-items:center;padding:10px;border:2px solid ${isSelected ? "var(--clr-accent)" : "var(--clr-muted)"};background:${isSelected ? "rgba(139,105,20,0.1)" : "transparent"};cursor:pointer;border-radius:0;transition:border-color 0.15s,background 0.15s;" onmouseover="this.style.borderColor='var(--clr-accent)'" onmouseout="this.style.borderColor='${isSelected ? "var(--clr-accent)" : "var(--clr-muted)"}'">
          <div class="pd-item-info" style="flex:1;">
            <span class="pd-name" style="font-weight:${isSelected ? "700" : "600"};">${item.name} \xD7${item.count}</span>
            <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.desc}</div>
            <div style="font-size:0.7em;color:var(--clr-accent);margin-top:2px;">${itemWeight} kg total</div>
          </div>
          <div class="pd-controls" style="display:flex;align-items:center;gap:8px;">
            ${isSelected ? '<span style="color:var(--clr-accent);font-family:var(--font-heading);font-size:14px;">\u2713 Selected</span>' : '<button class="pd-extra-pick" data-item="' + item.name + '" style="padding:6px 14px;background:var(--clr-accent);color:var(--clr-bg);border:2px solid var(--clr-accent);font-family:var(--font-heading);font-weight:600;cursor:pointer;">Pick This</button>'}
          </div>
        </div>`;
      });
      if (cart.length > 0) {
        html += '<div style="font-family:var(--font-heading);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--clr-accent);margin:14px 0 6px;">Your Trade Goods</div>';
        cart.forEach((item) => {
          const itemWeight = (item.wt * item.count).toFixed(1);
          html += `<div class="pd-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--clr-muted);">
            <div class="pd-item-info">
              <span class="pd-name">${item.name} \xD7${item.count}</span>
              <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${itemWeight} kg total</div>
            </div>
          </div>`;
        });
      }
      listEl.innerHTML = html;
      listEl.querySelectorAll(".pd-extra-pick").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const name3 = btn.getAttribute("data-item");
          selectedExtra = extraItems.find((i) => i.name === name3);
          recalc();
          renderList();
        });
      });
      listEl.querySelectorAll(".extra-item-row").forEach((row) => {
        row.addEventListener("click", () => {
          const rowItem = row.getAttribute("data-item");
          if (!selectedExtra || selectedExtra.name !== rowItem) {
            selectedExtra = extraItems.find((i) => i.name === rowItem);
          } else {
            selectedExtra = null;
          }
          recalc();
          renderList();
        });
      });
    };
    __name(recalc, "recalc");
    __name(renderList, "renderList");
    document.getElementById("predeparture-overlay")?.classList.add("active");
    document.getElementById("predeparture-overlay")?.removeAttribute("hidden");
    const starterItems = [
      { name: "Medicine Pouch", wt: 1.5, category: "medical", count: 1 },
      { name: "Ammunition Belt", wt: 2, category: "hunting", count: 1 },
      { name: "Canvas Tarp", wt: 4, category: "shelter", count: 1 }
    ];
    const extraItems = [
      { name: "Pemmican Rations", wt: 2.5, category: "provisions", count: 7, desc: "Dried meat and fat. The staple of the prairie." },
      { name: "Spare Axle", wt: 15, category: "parts", count: 1, desc: "Hard maple. Heavy but essential for a Red River cart." },
      { name: "Shaganappi", wt: 3, category: "repair", count: 3, desc: "Rawhide strips. Binding, lashing, and cart repair." },
      { name: "Tool Kit", wt: 8, category: "parts", count: 1, desc: "Axe, auger, drawknife. Required for major repairs." },
      { name: "Firewood Bundle", wt: 6, category: "fuel", count: 1, desc: "Dried poplar. Required for cold nights." },
      { name: "Rope (50ft)", wt: 3, category: "parts", count: 1, desc: "Hemp. Crossings, repairs, binding." },
      { name: "Blanket", wt: 3, category: "shelter", count: 2, desc: "Wool. Winter survival." }
    ];
    let selectedExtra = null;
    const cart = game.getCart();
    recalc();
    renderList();
    confirmBtn.onclick = () => {
      const game2 = window._metisGame;
      starterItems.forEach((item) => {
        for (let i = 0; i < item.count; i++) {
          game2.buyItem(item.name, item.wt, item.category);
        }
      });
      if (selectedExtra) {
        for (let i = 0; i < selectedExtra.count; i++) {
          game2.buyItem(selectedExtra.name, selectedExtra.wt, selectedExtra.category);
        }
      }
      game2.addFood(15);
      game2.confirmPreDeparture();
      document.getElementById("predeparture-overlay")?.classList.remove("active");
      window.__METIS_RENDER__();
    };
    return;
  }
}
__name(showShop, "showShop");
function showCrew(game) {
  hideOverlays();
  const c = game.getCrew();
  const el = document.getElementById("crew-status");
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById("crew-overlay")?.classList.add("active");
}
__name(showCrew, "showCrew");
var CAMP_FLAVOR = {
  rest: {
    high: [
      "The crew sleeps deeply under a sky full of stars. Morning comes with fresh energy and quiet purpose.",
      "A perfect night by the fire. The oxen rest well, the crew wakes restored \u2014 tomorrow feels full of promise.",
      "The camp is peaceful, the fire burns steady, and sleep comes easy. You wake before dawn, rested and ready."
    ],
    mid: [
      "The night is adequate. Sleep comes in fits, but the crew wakes functional if not truly refreshed.",
      "A serviceable rest. The ground is hard but the fire holds. Morning finds the crew ready to move on.",
      "You sleep light and wake stiff, but the crew is rested enough. The trail waits."
    ],
    low: [
      "A rough night. The fire dies and the cold creeps in. The crew wakes tired, and the day ahead feels long.",
      "Sleep is fitful and short. The crew rises grumbling, and morale suffers for it.",
      "The camp offers little comfort. The crew wakes cold and irritable, and the morning is slow to start."
    ]
  },
  forage: {
    high: [
      "Berry bushes heavy with saskatoon fruit, and a patch of wild turnips beside a creek. The land provides generously.",
      "You find a meadow thick with edible roots and early berries. The foraging is excellent \u2014 the crew eats well tonight.",
      "A stroke of luck: a patch of wild onions, gooseberries, and a patch of camas root. The foraging bucket is full."
    ],
    mid: [
      "A modest haul \u2014 some wild onions, a few berries, and some edible greens. Enough to supplement the rations.",
      "You forage enough to keep the pot boiling. Not a feast, but not a famine either.",
      "The land yields enough to keep the crew fed. Unspectacular but welcome."
    ],
    low: [
      "The prairie offers little today. A few bitter roots and not much else. The foraging was lean.",
      "You find almost nothing edible. A handful of bitter roots. The crew goes to bed hungry.",
      "A wasted afternoon. The forage comes back nearly empty-handed, and the rations remain thin."
    ]
  },
  hunt: {
    high: [
      "A young bull, separated from the herd. The shot is clean and the butchering efficient. The crew feasts tonight.",
      "A prairie grouse covey flushes at your feet. The hunt is quick and the meat is tender. A good day.",
      "A deer at the creek crossing. One shot, one kill. The crew will eat well for days."
    ],
    mid: [
      "You take a shot but the hit is poor. Some food, but not a clean kill. The crew makes do.",
      "A close call \u2014 you wound it but it runs. You track it down eventually, but the meat is less than hoped.",
      "A jackrabbit and a grouse. Not a feast, but the pot will boil tonight."
    ],
    low: [
      "The shot goes wide. The game scatters and you return to camp empty-handed.",
      "You track a deer for hours but never get a clean shot. The ammunition is wasted.",
      "No game today. The prairie is empty and the hunt returns nothing."
    ]
  },
  pemmican_process: {
    high: [
      "The women work fast \u2014 slicing the lean meat into thin sheets, setting them on drying racks over the fire. By evening the flails are pounding, the kettles are rendering tallow, and the pemmican bags are being stitched shut with sinew. The crew will eat well for weeks.",
      "A full day of processing. The women move through the steps like a dance \u2014 slice, dry, pound, render, pack. The smell of boiling fat and dried meat fills the camp. Tomorrow the pemmican bags rest heavy in the cart."
    ],
    mid: [
      "The work is steady but the yield is modest. Some meat dried well, some did not. The tallow is rendered but the bags are only half full. Enough to keep the crew fed.",
      "A few hours of slicing and drying. The sun is hot and the work is slow, but the pemmican takes shape. The women Knead and pack while the crew tends the fire."
    ],
    low: [
      "The meat is lean and the drying is slow. A wasted afternoon \u2014 the forage returns nearly empty-handed, and the rations remain thin.",
      "The work drags. The heat spoils more than it preserves. The women do what they can, but the yield is poor."
    ]
  },
  scout: {
    high: [
      "The scout returns with detailed news: the next stretch is clear, with good water and firm ground. You map the way forward with confidence.",
      "A successful reconnaissance. The scout finds the best path and marks it. Tomorrow's travel will be smoother.",
      "The scout spots a shortcut through a coul\xE9e that saves half a day. The trail ahead looks favorable."
    ],
    low: [
      "The scout comes back with nothing. The trail ahead remains a mystery.",
      "The scouting party finds no clear path. You will have to feel your way forward tomorrow.",
      "The scout returns empty-handed. No shortcuts, no intelligence \u2014 just more trail."
    ],
    mid: [
      "The scout brings back some useful information. Not a breakthrough, but enough to plan tomorrow's leg."
    ]
  },
  repair: {
    high: [
      "The repair is sound. The shaganappi binds tight and the cart rolls smoother by morning. Good work.",
      "A clean repair job. The cartwright would be proud. The wear comes off and the cart feels solid again."
    ],
    mid: [
      "A decent repair. The cart is sounder than before, and the shaganappi was well-used.",
      "The work holds. Not pretty, but the cart will make it to the next settlement."
    ],
    low: [
      "The repair is rough but it holds. The shaganappi is well-spent, even if the work is ugly.",
      "The fix is imperfect. Some wear comes off, but the cart still groans. It will do until the next settlement."
    ]
  },
  dance: {
    high: [
      "The fiddle starts and the crew dances until the fire burns low. Someone's boots throw sparks. A Red River jig, then a reel. Nobody talks about tomorrow.",
      "A night of song and dance. The old tunes from Red River ring out across the dark.",
      "The dancing is spirited and the stories are long. The crew goes to bed smiling."
    ],
    low: [
      "A quiet night. A few songs, some half-hearted dancing. The mood lifts, but only a little.",
      "The crew is too tired for much revelry. A few tunes around the fire, then early sleep."
    ],
    mid: [
      "A few songs. Some half-hearted dancing. Nobody's heart's in it, but the fire's warm and the night passes.",
      "A decent evening by the fire. Not the best night, but the spirits are lifted."
    ]
  },
  deeprest: {
    high: [
      "Two days of proper rest. The crew emerges refreshed, the oxen are strong, and the cart feels lighter. The trail ahead looks better.",
      "A full deep rest. Hot food, long sleep, and time to mend what is broken. The crew is ready for whatever comes."
    ],
    low: [
      "Two days lost to rest. The crew needed it, but the trail does not wait. Still, you leave camp stronger than you arrived.",
      "The deep rest costs time and food, but the crew needed it. Tomorrow you push forward with renewed strength."
    ],
    mid: [
      "The rest does its work. Two days of recovery, and the crew is noticeably improved."
    ]
  },
  push_on: {
    high: [
      "You drive on through the evening light. The cart groans but holds. Every mile gained is a mile closer.",
      "No rest, no respite. The oxen strain but the trail yields. You make camp after dark, exhausted but ahead."
    ],
    low: [
      "The push costs dearly. The cart takes a beating, the crew is spent, and the food runs lower. But the trail does not wait.",
      "A hard push. The oxen are done, the crew is grumbling, and the cart axle groans louder than ever. But you gained ground."
    ],
    mid: [
      "You press on without rest. The food runs lower, the cart takes wear, but the miles add up.",
      "No camp tonight. The trail stretches on, and so do you. Tomorrow will be harder, but today you gained ground."
    ]
  }
};
function getCampFlavorText(type, rollTotal, effects, items) {
  const pool = CAMP_FLAVOR[type];
  if (!pool) return (effects || []).join("\n");
  let tier;
  if (type === "rest") {
    tier = rollTotal >= 15 ? "high" : rollTotal >= 8 ? "mid" : "low";
  } else if (type === "forage") {
    tier = rollTotal >= 12 ? "high" : rollTotal >= 8 ? "mid" : "low";
  } else if (type === "hunt") {
    tier = rollTotal >= 10 ? "high" : rollTotal >= 6 ? "mid" : "low";
  } else if (type === "scout") {
    tier = rollTotal >= 12 ? "high" : rollTotal >= 8 ? "mid" : "low";
  } else if (type === "repair") {
    tier = rollTotal >= 9 ? "high" : rollTotal >= 5 ? "mid" : "low";
  } else if (type === "dance") {
    tier = rollTotal >= 10 ? "high" : rollTotal >= 6 ? "mid" : "low";
  } else if (type === "pemmican_process") {
    tier = rollTotal >= 12 ? "high" : rollTotal >= 7 ? "mid" : "low";
  } else if (type === "deeprest") {
    tier = rollTotal >= 10 ? "high" : rollTotal >= 5 ? "mid" : "low";
  } else if (type === "push_on") {
    tier = "mid";
  } else {
    tier = "mid";
  }
  const options = pool[tier] || pool.mid || [];
  if (!options.length) return (effects || []).join("\n");
  let flavor = options[Math.floor(Math.random() * options.length)];
  if (type === "hunt" && items && items.length > 0) {
    const peltNames = items.map((i) => `${i.name} (${i.rarity})`).join(", ");
    flavor += ` You also recover: ${peltNames}.`;
  }
  return flavor + "\n" + (effects || []).join("\n");
}
__name(getCampFlavorText, "getCampFlavorText");
function showCamp(game) {
  hideOverlays();
  const state = game.getState();
  if (state.over || state.pendingEvent || state.pendingSettlement) return;
  const foodEl = document.getElementById("camp-food");
  const wearEl = document.getElementById("camp-wear");
  const moraleEl = document.getElementById("camp-morale");
  const crewEl = document.getElementById("camp-crew");
  const subEl = document.getElementById("camp-sub");
  const resultEl = document.getElementById("camp-result");
  const actionsEl = document.getElementById("camp-actions");
  if (foodEl) foodEl.textContent = Math.floor(state.food);
  if (wearEl) wearEl.textContent = state.wear;
  if (moraleEl) moraleEl.textContent = state.morale;
  if (crewEl) crewEl.textContent = state.crew;
  if (subEl) subEl.textContent = `Day ${state.day} \u2014 ${state.season}`;
  if (resultEl) {
    resultEl.style.display = "none";
    resultEl.textContent = "";
  }
  const campRollEl = document.getElementById("camp-roll-display");
  if (campRollEl) {
    campRollEl.style.display = "none";
    campRollEl.innerHTML = "";
  }
  const terrain = NODES[state.node]?.terrain || "plains";
  const hasAmmo = game.getCart()?.some((i) => i.name === "Ammunition Belt" && i.count > 0);
  const hasShag = game.getCart()?.some((i) => i.name === "Shaganappi" && i.count > 0);
  const actions = [
    {
      type: "rest",
      icon: "\u{1F6CF}\uFE0F",
      label: "Rest",
      cost: "1 food",
      risk: "On fail: rough night, crew tired, +5 morale",
      flavor: "Sleep under the stars. The oxen graze. The fire crackles low.",
      canDo: state.food >= 1,
      needRoll: true
    },
    {
      type: "forage",
      icon: "\u{1F33F}",
      label: "Forage",
      cost: "1 day",
      risk: "On fail: lean haul, almost nothing found",
      flavor: "Search the grass for wild turnips, saskatoon berries, edible roots.",
      canDo: true,
      needRoll: true
    },
    {
      type: "hunt",
      icon: "\u{1F3F9}",
      label: "Hunt",
      cost: "1 Ammunition Belt \xB7 1 day",
      risk: "On fail: lose ammo, no pelts. Crit fail: morale \u22122",
      flavor: terrain === "river_valley" ? "Track beaver along the creek." : terrain === "uplands" ? "Stalk elk through the high ground." : terrain === "wooded" ? "Hunt deer at the forest edge." : "Stalk bison on the open prairie.",
      canDo: !!hasAmmo,
      needRoll: true
    },
    {
      type: "repair",
      icon: "\u{1F527}",
      label: "Repair",
      cost: "1 Shaganappi",
      risk: "On fail: shaganappi wasted. Crit fail: wear +1",
      flavor: "Bind the wheels, lash the joints. Shaganappi holds the cart together.",
      canDo: !!hasShag && state.wear > 0,
      needRoll: true
    },
    {
      type: "scout",
      icon: "\u{1F52D}",
      label: "Scout",
      cost: "1 day",
      risk: "On fail: nothing useful. Crit fail: next event has no warning",
      flavor: "Ride ahead. Read the trail. Water, grass, and what lies beyond the next rise.",
      canDo: state.node < NODES.length - 1,
      needRoll: true
    },
    {
      type: "dance",
      icon: "\u{1F3BB}",
      label: "Dance",
      cost: "free",
      risk: "On fail: half-hearted. Crit fail: morale \u22123",
      flavor: "The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow.",
      canDo: true,
      needRoll: true
    },
    {
      type: "push_on",
      icon: "\u23E9",
      label: "Push On",
      cost: "1.5 food \xB7 wear +1 \xB7 morale \u22125",
      risk: "Skip camp. No recovery. Cart takes extra damage.",
      flavor: "No rest. The trail does not wait. Drive on through the evening light.",
      canDo: true,
      needRoll: false
    }
  ];
  if (actionsEl) {
    actionsEl.innerHTML = "";
    actionsEl.style.display = "grid";
    actions.forEach((a) => {
      const card = document.createElement("div");
      card.className = "camp-card";
      const nameRow = document.createElement("div");
      nameRow.className = "camp-card-name";
      nameRow.innerHTML = `<span class="camp-card-icon">${a.icon}</span> ${a.label}`;
      const costRow = document.createElement("div");
      costRow.className = "camp-card-cost";
      costRow.textContent = `Cost: ${a.cost}`;
      const riskRow = document.createElement("div");
      riskRow.className = "camp-card-risk";
      riskRow.textContent = `Receive: ${a.risk}`;
      const flavorRow = document.createElement("div");
      flavorRow.className = "camp-card-flavor";
      flavorRow.textContent = a.flavor;
      const btn = document.createElement("button");
      btn.className = "camp-card-btn";
      btn.textContent = "Do It";
      if (!a.canDo) {
        btn.disabled = true;
        btn.classList.add("disabled");
      }
      card.appendChild(nameRow);
      card.appendChild(costRow);
      card.appendChild(riskRow);
      card.appendChild(flavorRow);
      card.appendChild(btn);
      if (a.canDo) {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".camp-card-btn").forEach((b) => {
            b.disabled = true;
            b.classList.add("disabled");
          });
          let result;
          if (a.type === "push_on") {
            pushOn(game);
            result = { effects: ["Pushed on \u2014 extra wear, less food, lower morale"], critical: false };
            const after2 = game.getState();
            journalLog({
              day: after2.day,
              date: monthName(after2.month) + " " + after2.day,
              title: "Camp: Push On",
              text: a.flavor,
              mech: `-1.5 Food \xB7 +1 Wear \xB7 -5 Morale`,
              collapsed: false
            });
            document.getElementById("camp-overlay")?.classList.remove("active");
            window.__METIS_RENDER__();
            return;
          } else {
            result = game.campAction(a.type);
          }
          if (result && !result.error) {
            result.foodAfter = game.getState().food;
          }
          const errEl = document.getElementById("camp-result");
          const rollEl = document.getElementById("camp-roll-display");
          if (!result) {
            if (errEl) {
              errEl.style.display = "block";
              errEl.textContent = "No result.";
            }
            return;
          }
          if (result.error) {
            if (errEl) {
              errEl.style.display = "block";
              errEl.textContent = result.error;
            }
            return;
          }
          const after = game.getState();
          if (foodEl) foodEl.textContent = Math.floor(after.food);
          if (wearEl) wearEl.textContent = after.wear;
          if (moraleEl) moraleEl.textContent = after.morale;
          if (crewEl) crewEl.textContent = after.crew;
          if (subEl) subEl.textContent = `Day ${after.day} \u2014 ${after.season}`;
          document.querySelectorAll(".camp-card").forEach((c) => {
            c.style.display = "none";
          });
          const flavorText = getCampFlavorText(a.type, result.rollTotal, result.effects, result.items);
          if (a.needRoll && result.roll !== null && rollEl) {
            const DC = {
              rest: 12,
              forage: 10,
              hunt: 10,
              repair: 8,
              scout: 9,
              dance: 8
            }[a.type] || 10;
            const isSuccess = result.rollTotal >= DC;
            rollEl.style.display = "flex";
            rollEl.innerHTML = `
              <div class="roll-label">Roll</div>
              <div class="die small font-spectral spin" id="camp-die">${result.roll}</div>
              <div class="roll-total">Need ${DC}+ ${isSuccess ? "\u2713" : "\u2717"}</div>
            `;
            const dieEl = document.getElementById("camp-die");
            if (dieEl) {
              let ticks = 0;
              const maxTicks = 6 + Math.floor(Math.random() * 4);
              const spinId = setInterval(() => {
                if (!dieEl.parentNode) {
                  clearInterval(spinId);
                  return;
                }
                dieEl.textContent = String(Math.floor(Math.random() * 20) + 1);
                ticks++;
                if (ticks >= maxTicks) {
                  clearInterval(spinId);
                  dieEl.textContent = String(result.roll);
                  dieEl.className = "die small font-spectral settled " + (isSuccess ? "pass" : "fail");
                  if (haptics_default) haptics_default.uiTap();
                  if (errEl) {
                    errEl.style.display = "block";
                    let html = "";
                    if (result.critical) {
                      html += '<div class="camp-critical">\u26A0 Critical Failure</div>';
                    }
                    html += flavorText;
                    errEl.innerHTML = html;
                  }
                  const continueEl = document.getElementById("camp-continue");
                  if (continueEl) continueEl.style.display = "inline-block";
                }
              }, 60);
            }
          } else {
            if (errEl) {
              errEl.style.display = "block";
              let html = "";
              if (result.critical) {
                html += `<div class="camp-critical">\u26A0 Critical Failure</div>`;
              }
              html += flavorText;
              errEl.innerHTML = html;
            }
            const continueEl = document.getElementById("camp-continue");
            if (continueEl) continueEl.style.display = "inline-block";
          }
          const actionLabels = {
            rest: "Rest",
            forage: "Forage",
            hunt: "Hunt",
            repair: "Repair",
            scout: "Scout",
            dance: "Dance",
            push_on: "Push On"
          };
          const mechParts = [];
          if (after.food !== state.food) mechParts.push(`${after.food - state.food >= 0 ? "+" : ""}${(after.food - state.food).toFixed(1)} Food`);
          if (after.wear !== state.wear) mechParts.push(`Wear ${after.wear - state.wear >= 0 ? "+" : ""}${after.wear - state.wear}`);
          if (after.morale !== state.morale) mechParts.push(`Morale ${after.morale - state.morale >= 0 ? "+" : ""}${after.morale - state.morale}`);
          if (after.crew !== state.crew) mechParts.push(`Crew: ${state.crew} \u2192 ${after.crew}`);
          const cart = game.getCart();
          const weather = after.weather || "clear";
          const campEntry = buildCampEntry(a.type, result, 0, cart, weather);
          const campReflection = buildCampReflection(a.type, result, cart, weather, after.day);
          journalLog({
            day: after.day,
            date: monthName(after.month) + " " + after.day,
            title: `Camp: ${actionLabels[a.type] || a.type}`,
            text: campReflection,
            dice: result.roll !== null ? `Rolled ${result.roll} \u2014 need ${{ rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, pemmican_process: 10 }[a.type] || 10}+ \u2014 ${result.rollTotal >= ({ rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, pemmican_process: 10 }[a.type] || 10) ? "\u2713 Success" : "\u2717 Failure"}${result.critical ? " \u2014 \u26A0 CRITICAL" : ""}` : null,
            mech: mechParts.join(" \xB7 "),
            collapsed: false
          });
        });
      }
      actionsEl.appendChild(card);
    });
  }
  const campContinueBtn = document.getElementById("camp-continue");
  if (campContinueBtn) {
    campContinueBtn.onclick = () => {
      document.getElementById("camp-overlay")?.classList.remove("active");
      window.__METIS_RENDER__();
    };
  }
  document.getElementById("camp-overlay")?.classList.add("active");
}
__name(showCamp, "showCamp");
function showEnd(game) {
  hideOverlays();
  const state = game.getState();
  const cart = game.getCart();
  const titleEl = document.getElementById("end-title");
  const narrativeEl = document.getElementById("end-narrative");
  const statsEl = document.getElementById("end-stats");
  const sourceEl = document.getElementById("end-source");
  if (!titleEl || !narrativeEl || !statsEl) return;
  const ending = ENDINGS[state.endReason] || ENDINGS.no_trade;
  const isVictory = state.endReason === "victory";
  const isHighScore = isVictory && state.score >= 1200;
  titleEl.textContent = ending.title;
  let narrativeText;
  if (isVictory) {
    narrativeText = isHighScore ? ending.narrative.high : ending.narrative.humble;
  } else {
    const progress = state.getNode ? state.node / 15 : 0;
    narrativeText = progress > 0.6 ? ending.narrative.high : ending.narrative.humble;
  }
  narrativeEl.textContent = narrativeText;
  if (sourceEl) {
    const quoteData = isHighScore && ending.quoteHigh ? ending.quoteHigh : ending.quote;
    if (quoteData && quoteData.quote) {
      const rawQuote = quoteData.quote;
      const quote = rawQuote.replace(/^"|"$/g, "");
      const author = quoteData.author || "";
      const work = quoteData.work || "";
      const year = quoteData.year || "";
      const attrib = [author, work, year].filter(Boolean).join(", ");
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">\u2014 ${attrib}</span>` : "") + (quoteData.context ? `<span class="src-context">${quoteData.context}</span>` : "");
      sourceEl.style.display = "block";
    } else {
      sourceEl.style.display = "none";
    }
  }
  let scoreLines;
  try {
    const scoreData2 = game.getEndgameScore();
    const bd = scoreData2?.breakdown || {};
    const safeNum = /* @__PURE__ */ __name((v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.round(n) : 0;
    }, "safeNum");
    scoreLines = [
      { label: "Base score", value: safeNum(bd.base) },
      { label: "Trade goods delivered", value: safeNum(bd.tradeGoods) },
      { label: `Food bonus (${Math.min(safeNum(state.food), 25)} \xD7 12)`, value: safeNum(bd.foodBonus) },
      { label: `Crew condition (${state.crew || "unknown"})`, value: safeNum(bd.crewCondition) },
      { label: `Days on trail (${safeNum(state.day)} \xD7 -8)`, value: safeNum(bd.daysPenalty) },
      { label: `Cart wear (${safeNum(state.wear)}\xB2 \xD7 -40)`, value: safeNum(bd.wearPenalty) }
    ];
  } catch (e) {
    console.warn("[Metis] Score calc error:", e);
    scoreLines = [
      { label: "Base score", value: 500 },
      { label: "MB value", value: 0 },
      { label: "Food bonus", value: 0 },
      { label: "Crew condition", value: 0 },
      { label: "Days on trail", value: 0 },
      { label: "Cart wear", value: 0 }
    ];
  }
  const totalScore = (() => {
    try {
      return Math.max(0, Math.round(Number(game.getEndgameScore()?.score) || 0));
    } catch (e) {
      return 0;
    }
  })();
  const scoreHtml = scoreLines.map((l) => `
    <div class="stat-row">
      <span class="label">${l.label}</span>
      <span>${l.value >= 0 ? "+" : ""}${l.value}</span>
    </div>
  `).join("") + `
    <div class="stat-row score-row">
      <span class="label">Final Score</span>
      <span>${Math.max(0, totalScore)}</span>
    </div>
    ${!isVictory ? `<div class="stat-row" style="color:#8B2500;font-style:italic;margin-top:8px;">Journey ended before reaching Edmonton \u2014 trade goods not delivered.</div>` : ""}
    <div style="margin-top:10px;padding:8px;background:rgba(184,134,11,0.08);border-left:2px solid #B8860B;font-size:11px;color:#5a4a3a;line-height:1.5;">
      ${ending.tip}
    </div>
  `;
  statsEl.innerHTML = scoreHtml;
  document.getElementById("end-overlay")?.classList.add("active");
  const playerName = localStorage.getItem("metisPlayerName") || "";
  const scoreData = game.getScoreData();
  saveScore(scoreData, playerName).then((result) => {
    if (result.local) {
      console.log("[Metis] Score saved locally (Firestore unavailable)");
    } else {
      console.log("[Metis] Score saved to Firestore:", result.id);
    }
  });
  const endCard = document.querySelector("#end-overlay .end-card");
  if (endCard && !document.getElementById("end-leaderboard-btn")) {
    const lbBtn = document.createElement("button");
    lbBtn.id = "end-leaderboard-btn";
    lbBtn.className = "restart-btn end-btn";
    lbBtn.textContent = "\u{1F3C6} View Hall of Fame";
    lbBtn.onclick = () => showLeaderboard();
    endCard.appendChild(lbBtn);
  }
}
__name(showEnd, "showEnd");
var cachedTopScores = null;
var cachedMyScores = null;
function showLeaderboard() {
  hideOverlays();
  document.getElementById("leaderboard-overlay")?.classList.add("active");
  loadHallOfFame();
  loadMyScores();
}
__name(showLeaderboard, "showLeaderboard");
function loadHallOfFame() {
  const container = document.getElementById("lb-hall-of-fame");
  if (!container) return;
  container.innerHTML = '<div class="lb-loading">Loading...</div>';
  getTopScores().then((scores) => {
    cachedTopScores = scores;
    if (!scores || scores.length === 0) {
      container.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
      return;
    }
    container.innerHTML = '<div class="lb-list">' + scores.map((s, i) => renderLbEntry(s, i + 1)).join("") + "</div>";
  }).catch((err) => {
    console.warn("[Metis] Hall of Fame load failed:", err);
    container.innerHTML = '<div class="lb-error">Leaderboard unavailable \u2014 playing offline</div>';
  });
}
__name(loadHallOfFame, "loadHallOfFame");
function loadMyScores() {
  const container = document.getElementById("lb-my-list");
  if (!container) return;
  container.innerHTML = '<div class="lb-loading">Loading...</div>';
  const name = localStorage.getItem("metisPlayerName") || "";
  if (!name) {
    container.innerHTML = '<div class="lb-empty">Set your party name in the intro to track personal scores.</div>';
    return;
  }
  getMyScores(name).then((scores) => {
    cachedMyScores = scores;
    if (!scores) {
      document.getElementById("lb-my-list").innerHTML = '<div class="lb-error">Unable to load personal scores \u2014 playing offline</div>';
      return;
    }
    if (scores.length === 0) {
      document.getElementById("lb-my-list").innerHTML = '<div class="lb-empty">No personal scores yet. Play a game!</div>';
      return;
    }
    renderMyScoresSorted();
  }).catch((err) => {
    console.warn("[Metis] My Scores load failed:", err);
    document.getElementById("lb-my-list").innerHTML = '<div class="lb-error">Unable to load personal scores \u2014 playing offline</div>';
  });
}
__name(loadMyScores, "loadMyScores");
function renderMyScoresSorted() {
  const container = document.getElementById("lb-my-list");
  if (!container || !cachedMyScores) return;
  const sortKey = document.getElementById("lb-sort-select")?.value || "score";
  const sorted = sortScores(cachedMyScores, sortKey);
  container.innerHTML = '<div class="lb-list">' + sorted.map((s, i) => renderLbEntry(s, i + 1)).join("") + "</div>";
}
__name(renderMyScoresSorted, "renderMyScoresSorted");
function sortScores(scores, key) {
  const copy = [...scores];
  switch (key) {
    case "score":
      return copy.sort((a, b) => (b.score || 0) - (a.score || 0));
    case "day":
      return copy.sort((a, b) => (b.day || 0) - (a.day || 0));
    case "wear":
      return copy.sort((a, b) => (b.wear || 0) - (a.wear || 0));
    case "food-asc":
      return copy.sort((a, b) => (a.food || 0) - (b.food || 0));
    case "tradesMade":
      return copy.sort((a, b) => (b.tradesMade || 0) - (a.tradesMade || 0));
    case "nodes":
      return copy.sort((a, b) => (b.nodes || 0) - (a.nodes || 0));
    case "eventsResolved":
      return copy.sort((a, b) => (b.eventsResolved || 0) - (a.eventsResolved || 0));
    case "morale":
      return copy.sort((a, b) => (b.morale || 0) - (a.morale || 0));
    default:
      return copy;
  }
}
__name(sortScores, "sortScores");
function renderLbEntry(s, rank) {
  const rankClass = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
  const icon = s.won ? "\u{1F3C6}" : "\u{1F480}";
  const dateStr = s.date?.toDate ? s.date.toDate().toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "";
  const metaLabel = s.won ? `${s.day || 0}d` : (s.endReason || "").replace(/_/g, " ");
  return `
    <div class="lb-entry">
      <span class="lb-rank ${rankClass}">#${rank}</span>
      <span class="lb-icon">${icon}</span>
      <span class="lb-name">${escapeHtml(s.name || "Traveller")}</span>
      <span class="lb-score">${s.score || 0}</span>
      <span class="lb-meta">${dateStr} \xB7 ${metaLabel}</span>
    </div>`;
}
__name(renderLbEntry, "renderLbEntry");
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
__name(escapeHtml, "escapeHtml");
window.__METIS_RENDER__ = render;
document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest(".lb-tab");
  if (tabBtn) {
    document.querySelectorAll(".lb-tab").forEach((t) => t.classList.remove("active"));
    tabBtn.classList.add("active");
    const tab = tabBtn.getAttribute("data-tab");
    document.getElementById("lb-hall-of-fame").style.display = tab === "hall-of-fame" ? "block" : "none";
    document.getElementById("lb-my-scores").style.display = tab === "my-scores" ? "block" : "none";
  }
  if (e.target.closest("#leaderboard-close")) {
    document.getElementById("leaderboard-overlay")?.classList.remove("active");
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "lb-sort-select") {
    renderMyScoresSorted();
  }
});
export {
  bootstrap
};

if (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }