var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/core/constants.js
var CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 5,
  DAILY_FOOD: 1.35,
  EVENT_CHANCE: 0.45,
  DAYS_PER_WEEK: 7,
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
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
  // MB (Made Beaver) currency system
  MB_WIN_THRESHOLD: 10,
  // minimum MB value needed at Edmonton to win
  MB_FOOD_COST: 0.5,
  // 1 MB buys 2 food at base rate
  MB_REPAIR_COST: 2,
  // 2 MB for a settlement-quality repair (-2 wear)
  MB_HEAL_COST: 1,
  // 1 MB for medical treatment (+20 morale)
  MB_INFO_COST: 0.5
  // 0.5 MB for trail intelligence / gossip
});
function crewMod(state) {
  return CONSTANTS.CREW_MOD[state.crew] ?? 0;
}
__name(crewMod, "crewMod");
function wearMod(wear) {
  return CONSTANTS.WEAR_MOD[wear] ?? -5;
}
__name(wearMod, "wearMod");
function totalMod(state) {
  return crewMod(state) + wearMod(state.wear);
}
__name(totalMod, "totalMod");

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
function startingCart() {
  return [
    { name: "Bison Hide", wt: 6, count: 4, type: "trade", category: "furs", mbValue: 1.25, perishable: false, desc: "Folded. Trade value: ~1.25 \u20A5 each at any post." },
    { name: "Beaver Pelts", wt: 4, count: 3, type: "trade", category: "furs", mbValue: 3, perishable: false, desc: "Prime bundle. The foundation of the northern trade. ~3 \u20A5 each." }
  ];
}
__name(startingCart, "startingCart");
function totalWeight(cart) {
  return cart.reduce((s, i) => s + i.wt * i.count, 0);
}
__name(totalWeight, "totalWeight");

// src/data/sources/index.js
var SOURCES = {
  LACOMBE_JOURNALS: {
    quote: "The prairie burned every afternoon... the oxen grew restless in the smoke.",
    author: "Father Albert Lacombe",
    work: "Missionary Journals",
    year: 1878,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  HBC_JOURNALS: {
    quote: "Pemmican stores declining. The Company feels the pressure of the free traders.",
    author: "HBC Fort Edmonton Post Journal",
    work: "Archives of Manitoba",
    year: 1878,
    url: "https://archive.org/stream/P000279/P000279_djvu.txt"
  },
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
  MCCONNELL_NW: {
    quote: `"Fort Garry stands at the junction of the Red and Assiniboine rivers, and is the principal depot of the Hudson's Bay Company for the distribution of goods throughout the North-West. The settlement around it is the largest in the territory."`,
    author: "R. G. McConnell",
    work: "Notes on the North-West of Canada",
    year: 1885,
    type: "secondary",
    url: "https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt"
  },
  CARLTON_TRAIL: {
    quote: '"The trail from Fort Garry to Fort Edmonton is marked by the carts. Two parallel ruts, one for each wheel, worn into the prairie sod \u2014 in places a foot deep. The distance is near eight hundred miles, and the carts make it in six weeks." \u2014 a description of the Carlton Trail route, as recorded in early accounts.',
    author: "Antoine Blanc",
    work: "The Carlton Trail (Manitoba History)",
    year: 1959,
    type: "secondary",
    url: "https://archive.org/stream/P000411/P000411_djvu.txt"
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
  BREHAUNT_TRAILS: {
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
  BLANC_TRAIL: {
    quote: '"From Fort Garry to Edmonton, the cart ruts mark the longest overland route in the Northwest. The trail follows the north bank of the Saskatchewan, crossing the South Branch at the ferry below Batoche, and the North Branch above Fort Pitt. Eight hundred miles of prairie, river, and woodland \u2014 and the carts have worn it into the earth."',
    author: "Antoine Blanc",
    work: "The Carlton Trail (Manitoba History)",
    year: 1959,
    type: "secondary",
    url: "https://archive.org/stream/P000411/P000411_djvu.txt"
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
  GOULET_HIDE: {
    quote: `"The bison hide was the currency of the prairie. A single prime hide could buy a week's provisions at any post, and a cartload of hides was a fortune. Travellers cached them along the trail like buried treasure, wrapped in oilcloth and marked with a cairn." \u2014 from accounts of the M\xE9tis hide trade.`,
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    type: "secondary",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
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
  BREHAUT_WET_AXE: {
    quote: '"Wet weather swelled the wooden axles of the Red River carts, making the wheels bind against the box. A cart that rolled freely in dry weather could become nearly immovable after a rain. Experienced carters carried spare axles and kept their hubs well-greased against the damp."',
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails: Maintenance and Misfortune",
    year: 1972,
    type: "secondary",
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  FONSECA_OVERCAST: {
    quote: "A grey sky hung low over the prairie for days. The air was heavy and still, and the oxen moved as if they could sense a storm coming.",
    author: "William G. Fonseca",
    work: "On the St. Paul Trail in the Sixties",
    year: 1900,
    url: "https://www.mhs.mb.ca/docs/transactions/3/stpaultrail.shtml"
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
  CALHOON_PEMM: {
    quote: '"When the hunt was over, the women would go out to help bring the meat in. Then the slicing began \u2014 the meat cut into thin strips, dried over a slow fire, and the tallow rendered. A woman could process a whole buffalo in a day if she had to. That was our work, and we were proud of it." \u2014 Victoria Callihoo (M\xE9tis elder, 1901\u20131984), oral history.',
    author: "Victoria Callihoo (M\xE9tis elder, 1901\u20131984)",
    work: `oral history, as transcribed in "The Pemmican Trade: A M\xE9tis Woman's Account"`,
    year: 2022,
    type: "secondary",
    url: "https://letsfindoutpodcast.com/wp-content/uploads/2022/05/hist-699-pemmican-paper-final-draft.docx"
  },
  SIMPSON_BRIGADE: {
    quote: "Their cavalcade extended over a mile. Each family had two or three carts, together with a band of horses, cattle and dogs. The men and the lads travelled on the saddle, while the carts, which were covered with awnings against the sun and rain, carried the women and young children.",
    author: 'Sir George Simpson, "Narrative of a Journey Round the World"',
    work: "cited in Manitoba Pageant, via MHS Transactions",
    year: 1847,
    url: "https://www.mhs.mb.ca/docs/pageant/01/redrivercart.shtml"
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
        { text: "Hire him as a scout", dc: 11, ok: "He rides ahead and spots a safer campsite.", bad: "He takes the easy path and you lose a day.", wear: 0, time: -1, addsRep: { key: "metis", delta: 1 }, branch: {
          id: "plains_scout_return",
          text: "The scout returns with news: a lone HBC clerk is stranded with a broken cart ahead.",
          choices: [
            { text: "Help tow them to the next post", dc: 10, ok: "They are grateful. The clerk gives you trade goods.", bad: "The axle breaks under the strain.", wear: 1, food: 4, setsFlag: "helped_hbc", addsRep: { key: "hbc", delta: 1 } },
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
        { text: "Share rubaboo and trade stories", dc: 8, ok: "The circle of travellers is warm. Morale rises.", bad: "You are too guarded to connect fully.", morale: 8, addsRep: { key: "metis", delta: 1 }, setsFlag: "shared_camp_meal" },
        { text: "Eat quickly and move on", dc: null, always: "Hunger is satisfied, but nothing more.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_night_camp",
      text: "Moon on the grass. A fiddle starts up somewhere down the line \u2014 a Red River jig, sharp enough to cut. French and Michif voices carry across the dark. One of the crew starts humming along.",
      source: getSource("FONSECA_DANCE"),
      choices: [
        { text: "Dance until your boots throw dust", dc: 10, ok: "Laughter drowns out the dark.", bad: "You strain a shoulder and sleep poorly.", morale: 12, addsRep: { key: "metis", delta: 1 } },
        { text: "Turn in early; tomorrow is long", dc: null, always: "Rest restores you in small measure.", morale: 4 }
      ]
    },
    {
      id: "plains_ox_scatter",
      text: "The oxen have scattered after drinking \u2014 a chaos of traces and running hooves across the mid-day camp. Ropes tangle, carts shift, and the air fills with shouting. To drive the refractory animals among the carts is a last resort, but sometimes the only one.",
      source: getSource("FONSECA_OX_SCATTER"),
      choices: [
        { text: "Call and whistle them back", dc: 11, ok: "The animals respond to the familiar sounds.", bad: "You lose an hour rounding them up.", time: 1, morale: -4 },
        { text: "Send someone ahead", dc: 9, ok: "Your crew brings them in quietly and quickly.", bad: "One runner turns an ankle.", crew: "tired", addsRep: { key: "metis", delta: 1 } }
      ]
    },
    {
      id: "plains_squeal",
      text: "The dry wood of the hub screams against the axle \u2014 a blood-curdling sound that carries for miles across the open prairie. Every traveller on the trail knows that squeal. It means a loaded cart is coming, and the sound alone is enough to make oxen nervous and strangers take notice.",
      source: getSource("BREHAUT_CART"),
      choices: [
        { text: "Apply shaganappi before it worsens", dc: 7, ok: "The scream quiets. The trail is kinder.", bad: "Insufficient grease; the noise persists.", morale: -3, squeal: 0, branch: {
          id: "plains_squeal_draw_attention",
          text: "Your squealing cart draws a mounted rider from a nearby coul\xE9e.",
          choices: [
            { text: "Stand your ground", dc: 10, ok: "He is a M\xE9tis trader simply curious.", bad: "He is a rough type; you hand over a small toll.", food: -2, addsRep: { key: "metis", delta: -1 } },
            { text: "Offer a quiet trade", dc: 9, ok: "He tips his hat and moves on.", bad: "He senses weakness and haggles hard.", food: -1 }
          ]
        } },
        { text: "Ignore the noise", dc: null, always: "The day's miles do not lessen the complaint.", alwaysWear: 0, squeal: 25 }
      ]
    },
    {
      id: "plains_buffalo_hunt_camp",
      text: "Cart crests the rise and you pull the ox up short. Below: a hundred carts in a circle, horses everywhere, dust so thick you can taste it. Four hundred hunters sitting quiet, waiting for the sign. Beyond them the herd \u2014 you feel the hooves through the ground before you hear them.",
      source: getSource("GOULET_HUNT"),
      choices: [
        { text: "Join the hunt", dc: 12, ok: "The hunt captain nods. You take a share of the meat.", bad: "You are slow to position. You earn only a strip.", food: 8, addsRep: { key: "metis", delta: 2 }, itemBonus: { name: "Ammunition Belt", dcBonus: 3 } },
        { text: "Observe and move on", dc: null, always: "You watch from a respectful distance. The hunt is spectacular.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_prairie_fire",
      text: "Smoke on the horizon, thick and brown against the blue sky. Then the wind shifts and the smell hits you \u2014 dry grass, pine, and the acrid bite of a prairie fire racing toward you. The dry grass crackles at its edge, and the wall of flame moves faster than a man can run.",
      source: getSource("LACOMBE_FIRE"),
      choices: [
        { text: "Ride for the river bottom", dc: 14, ok: "The fire edge passes. You lose only an afternoon's travel.", bad: "The wind shifts. You lose supplies and the cart is singed.", food: -3, wear: 1, morale: -12 },
        { text: "Light a backfire and wait it out", dc: 11, ok: "A practised escape. The backfire draws the main blaze away.", bad: "The flames jump. Your cart is spared but the oxen panic.", morale: -8, time: -1 }
      ]
    },
    {
      id: "plains_sayer_trial",
      text: "A M\xE9tis settlement celebrates the anniversary of the Sayer trial \u2014 the day free trade became a right, not a privilege. The air is thick with pride and the smell of roasting meat. Folk cheer for independent carters, and your cart is a symbol of that freedom.",
      source: getSource("SAWYER_TRIAL"),
      choices: [
        { text: "Display independent freight proudly", dc: 9, ok: "The folk cheer. Prices are better here.", bad: "You are taken for a Company man. Prices are unkind.", food: 5, addsRep: { key: "metis", delta: 2 } },
        { text: "Stay quiet and keep moving", dc: null, always: "Circumspection keeps your goods and your secrets.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_burnt_prairie",
      text: "The prairie here has been burnt black \u2014 no grass, no water, and the sun is relentless. The ground is ash underfoot, and the air shimmers with heat. Bichon, the patient ox, would do his best and, failing, would lie down in the one. You must decide whether to push through or find a way around.",
      source: getSource("SCHULTZ_BURNT"),
      choices: [
        { text: "Push through to the next water", dc: 12, ok: "You make the crossing with grit.", bad: "The oxen lag. You are forced to camp on burnt ground.", food: -2, crew: "tired" },
        { text: "Detour to a shaded coulee", dc: null, always: "A slower, safer day. Grass and water restore the animals.", time: 1 }
      ]
    },
    {
      id: "plains_sand_hills",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of these stumps and coulees. The cart lurches and groans with every hidden obstacle.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1, morale: -4 },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_windfall",
      text: "A great elm has fallen across the trail \u2014 branches splayed like fingers blocking the path. The trunk is too heavy to move, and the bush on either side is thick with undergrowth. You will need to cut your way through or find another route entirely.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Cut a way through", dc: 10, ok: "The path opens. Useful firewood goes on the cart.", bad: "The work is harder than expected.", time: 1 },
        { text: "Bypass through the bush", dc: 11, ok: "The bush breaks open onto the old trail.", bad: "A branch catches the canvas cover.", wear: 1 },
        { text: "Backtrack to the ford", dc: null, always: "A long, slow re-route. But safe.", time: 2 }
      ]
    },
    {
      id: "plains_axle_snap",
      text: "A sickening crack \u2014 the right axle shears against a hidden stone half-buried in yesterday's washout. The cart lurches and the load shifts. You are miles from the nearest post, and the tools for a proper repair are back at the settlement. A jury-rig will have to hold.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Set a splice with rope and wedges", dc: 11, ok: "A jury-rig holds. Progress is slow, but the cart is rolling again.", bad: "The splice splits by noon.", wear: 1, time: 1, morale: -4 },
        { text: "Cache the load and press on light", dc: null, always: "You bury the crated freight and mark the spot. The cart is light, but you return poorer.", time: -1, food: -4 }
      ]
    },
    {
      id: "plains_bear_camp",
      text: "Dawn finds a cinnamon bear rooting through your bread sack at the edge of camp. The bears along the Carlton were a constant threat to unprotected provisions. This one is bold \u2014 it has smelled the pemmican and it is not leaving without a fight.",
      source: getSource("LACOMBE_BEAR"),
      choices: [
        { text: "Beat the pan and drive it off", dc: 11, ok: "The bear lumbers away with a swat at its nose.", bad: "It turns. A strap snaps and half the flour is gone.", food: -3, morale: -6, wear: 1, itemBonus: { name: "Ammunition Belt", dcBonus: 4 } },
        { text: "Climb for height and wait", dc: null, always: "The bear eventually loses interest. You lose the morning, not the flour.", time: 1 }
      ]
    },
    {
      id: "plains_hail",
      text: "Green sky. Dead still. Then the hail \u2014 walnut stones hammering the canvas, bouncing off the cart bed. The oxen bellow and pull sideways. On the open prairie the cart is all you've got.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Cover the canvas and ride it out", dc: 10, ok: "The wagon top holds. The oxen are skittish but unhurt.", bad: "Canvas tears and two rounds of cheese are spoiled.", food: -2, morale: -4, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } },
        { text: "Scramble to the nearest coulee", dc: 9, ok: "Natural shelter saves the load.", bad: "A slipped wheel in the rush.", wear: 1 }
      ]
    },
    {
      id: "plains_abandoned_camp",
      text: "You pass a ring of stones where a campfire once burned \u2014 the ash is cold, but someone left a bundle half-buried beneath a cairn. Travellers along the Carlton Trail cached supplies for the return journey, and this one was never reclaimed. The prairie recycled everything, but today the recycling benefits you.",
      classification: "Supply Find",
      source: getSource("BREHAUT_ABANDONED"),
      choices: [
        { text: "Search the cache", dc: 8, ok: "You find strips of dried rawhide \u2014 shaganappi, still supple. Useful for repairs or crafting.", bad: "The cache has been picked over. Only dust and a few scraps of hide remain.", give: [{ name: "Shaganappi", amt: 2 }], morale: 5 },
        { text: "Leave it \u2014 mark the spot for the return", dc: null, always: "You notch a tree and remember the spot. The cache will keep.", morale: 2 }
      ]
    },
    {
      id: "plains_hbc_cache",
      text: "Beneath a flat stone cairn beside the trail, you find a oilcloth bundle stamped with the HBC monogram. A supply cache from a Company freighter who never made it back \u2014 the hide and contents are still sound, wrapped tight against the weather. The Company's loss is your gain.",
      classification: "Supply Find",
      source: getSource("FONSECA_SUPPLY_CACHE"),
      choices: [
        { text: "Open the cache", dc: 9, ok: "Inside: a folded bison hide, still cured and ready for trade or crafting. The Company's loss is your gain.", bad: "The bundle is damp. The hide is salvageable but the tools inside are rusted.", give: [{ name: "Bison Hide", amt: 1 }], morale: 5 },
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
        { text: "Push for the nearest coulee", dc: 11, ok: "Lower ground offers shelter from the wind and lightning.", bad: "A lightning-struck tree falls nearby.", wear: 1, morale: -6 }
      ]
    },
    {
      id: "plains_windstorm",
      text: "A wind comes out of the north that never stops. It pushes at the cart from the side, threatening to tip it with every gust. The canvas tarp flaps and strains at its ties. The oxen lean against the wind and refuse to move forward.",
      classification: "Weather",
      source: getSource("LACOMBE_WIND"),
      choices: [
        { text: "Lower the cart bed and wait it out", dc: null, always: "You crouch behind the cart and wait. The wind lasts hours. When it passes, the prairie is scarred with dust devils.", time: 1 },
        { text: "Strap down the load and push into the wind", dc: 10, ok: "The oxen groan but move forward.", bad: "A gust catches the canvas. Supplies scatter.", food: -3, wear: 1 }
      ]
    },
    {
      id: "plains_medicine_herb",
      text: "A patch of wild sage and yarrow grows in a sheltered coul\xE9e \u2014 plants your mother taught you to recognize. The prairie pharmacy is open to those who know how to read it. Enough here to restock your supplies, if you know the preparation.",
      classification: "Supply Find",
      source: getSource("LACOMBE_HERBS"),
      choices: [
        { text: "Gather the herbs and prepare a remedy", dc: 8, ok: "You crush the yarrow for wounds and dry the sage for fever. A medicine pouch, restocked.", bad: "The preparation is imperfect but usable.", give: [{ name: "Medicine Pouch", amt: 1 }], morale: 6 },
        { text: "Take only what you need for now", dc: null, always: "You gather a small bundle. Enough for one use, not a full restock.", give: [{ name: "Medicine Pouch", amt: 1 }], morale: 3 }
      ]
    },
    {
      id: "plains_abandoned_cart",
      text: "An abandoned Red River cart sits at the edge of a coul\xE9e, its canvas rotted and one wheel missing. But the axle is sound \u2014 good hardwood, still greased. Someone left in a hurry and left usable parts behind. The trail provides for those who scavenge.",
      classification: "Supply Find",
      source: getSource("BREHAUT_ABANDONED_CARTS"),
      choices: [
        { text: "Salvage the spare axle", dc: 9, ok: "The axle comes free with some effort. Heavy, but a godsend when yours finally gives.", bad: "The wood is sound but the fittings are rusted. It will do in a pinch.", give: [{ name: "Spare Axle", amt: 1 }], morale: 5 },
        { text: "Take canvas and shaganappi too", dc: null, always: "You strip what you can carry. The tarp is rotted but the shaganappi bindings are still supple.", give: [{ name: "Shaganappi", amt: 2 }], morale: 3 }
      ]
    },
    {
      id: "plains_cart_fortress",
      text: "A howl on the ridge line. Then another. The dogs go quiet first \u2014 then the oxen lift their heads. Something is wrong. Raiders, wolves, or a stampede \u2014 you cannot tell from here. The call goes out and the brigade moves as one, nudging the carts into a tight circle on the open prairie. Inside the ring, women and children huddle behind the cart beds, out of the wind and out of sight. You take your position on the perimeter with what you have.",
      classification: "Survival",
      source: getSource("CALHOON_CART_FORT"),
      choices: [
        { text: "Hold the line", dc: 12, ok: "Whatever it was, it passes. The circle holds. The women and children are safe. The brigade breaks camp and moves on.", bad: "The strain of holding takes its toll. Exhaustion sets in.", wear: 1, crew: "tired", morale: -6 },
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
        { text: "Press on \u2014 reach the next post", dc: 14, ok: "The crew finds a reserve of strength. You make it to the next settlement with the sick in the cart.", bad: "The sick grow worse on the rough trail. The cart jolts them with every rut.", morale: -20, crew: "exhausted", wear: 1 }
      ]
    }
  ],
  river_valley: [
    {
      id: "river_valley_sudden_rain",
      text: "The heavy cloud bursts without warning. The trail turns to a slurry and the cart sinks to the naves \u2014 the wheels disappearing into mud that grabs and holds. Sudden storms of rain turned the valley trail into a bog that could trap a loaded cart for hours.",
      source: getSource("FONSECA_RAIN"),
      choices: [
        { text: "Unhitch and pole the cart through", dc: 12, ok: "The oxen respond; you keep moving, soaked.", bad: "A wheel hub sinks axle-deep.", wear: 1, morale: -4, itemBonus: { name: "Rope (50ft)", dcBonus: 3 } },
        { text: "Wait it out on dry ground", dc: null, always: "Two hours of rain. The mud thickens.", time: 1 }
      ]
    },
    {
      id: "river_valley_broken_axle",
      text: "A hidden washout has eaten into the bank. The cart slews and the axle groans \u2014 a sound that makes every carter's stomach drop. The ground gives way beneath the wheel, and the cart tilts toward the river. You need a repair, and you need it before the bank collapses further.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Set a temporary truss with canvas and rope", dc: 11, ok: "A crude repair holds for the remaining miles.", bad: "The truss fails in the next gully.", wear: 1, time: 1 },
        { text: "Spike the wheel and coast downhill", dc: null, always: "You save time but the wheel wobbles loose.", alwaysWear: 1, morale: -4 }
      ]
    },
    {
      id: "river_high",
      text: "The river is running high and fast, brown with spring melt. The bank trail is muddy and narrow \u2014 one wrong step and the cart slides toward the water. The carts had indeed entered straight into the water, turned upstream to make the crossing in a horse-shoe fashion. You must decide: risk the ford or wait for calmer water.",
      source: getSource("FONSECA_FORD"),
      choices: [
        { text: "Ford carefully", dc: 13, ok: "The ox keeps footing and you stay dry enough.", bad: "The cart tilts in the current. Repairs are needed after crossing.", wear: 1 },
        { text: "Wait for afternoon", dc: null, always: "You camp and cross later when the water drops.", time: 1 },
        { text: "Scout for the horse-shoe ford upstream", dc: 11, ok: "You find the concealed path and cross safely.", bad: "The scouting costs precious daylight and energy.", morale: -4, time: -1 }
      ]
    },
    {
      id: "river_mp_check",
      text: "An NWMP patrol stops you just above the ferry landing. Red coats inspect the carts with scrupulous care \u2014 duty is collected in cash or goods, and every cart is subject to inspection. The mounted police established posts along the trail to enforce Ottawa's regulations.",
      source: getSource("MACLEOD_NWMP"),
      choices: [
        { text: "Show your papers", dc: 9, ok: "The permits read clearly. They let you pass.", bad: "A signature mismatch. You are delayed.", time: 1, addsRep: { key: "nwmp", delta: 1 } },
        { text: "Talk your way past", dc: 12, ok: "They accept your story.", bad: "They insist on a spot inspection. Wear is likely.", wear: 1, addsRep: { key: "nwmp", delta: -1 }, branch: /* @__PURE__ */ __name(() => ({
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
        { text: "Lower the cart with a line tied to a tree", dc: 10, ok: "A careful descent protects the load.", bad: "The knot slips at the last moment; the cart jars.", wear: 1 },
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
        { text: "Use the medicine pouch and rest the day", dc: 14, ok: "The crisis passes. One day lost, but the crew recovers.", bad: "The fever breaks but the crew is weak for days.", crew: "tired", morale: -8, consumesItem: "Medicine Pouch" },
        { text: "Push through without rest", dc: null, always: "The worst passes but the toll is steep.", morale: -20, crew: "exhausted" }
      ]
    },
    {
      id: "river_mosquito_camp",
      text: "Mosquitoes rise from the riverbank in a cloud \u2014 you breathe them, they're in your eyes. The oxen stampede. The fire dies under the smoke. Sand flies after. Mud everywhere. The carts keep moving west because stopping is worse.",
      source: getSource("FONSECA_MOSQUITOES"),
      choices: [
        { text: "Move camp to high ground before dark", dc: 9, ok: "The move is miserable but the night is quieter.", bad: "A wheel is twisted in the dark.", wear: 1 },
        { text: "Use canvas tarps and tough it out", dc: 11, ok: "You hunker down. Morning comes.", bad: "The insects are relentless. Morale falls hard.", morale: -10, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } }
      ]
    },
    {
      id: "river_cart_raft",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart \u2014 enough to build a raft, if you know how. Four cart wheels were taken and placed dish upwards on the surface of the water. The boat was launched, and floated like a duck.",
      source: getSource("FONSECA_RAFT"),
      choices: [
        { text: "Build a cart-raft with 2 bison hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river; cargo gets wet.", morale: -6, setsFlag: "built_rafts", requiresItem: { name: "Bison Hide", count: 2 }, branch: {
          id: "river_raft_wash",
          text: "On the far bank, an elder watches your landing and nods slowly.",
          choices: [
            { text: "Greet him respectfully", dc: 10, ok: "He shares drying hides and directions for the next leg.", bad: "He is suspicious and leaves without speaking.", addsRep: { key: "cree", delta: 1 }, morale: 8 },
            { text: "Get moving without conversation", dc: null, always: "Pragmatic. The crossing cost enough time.", alwaysWear: 0 }
          ]
        } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2 }
      ]
    },
    {
      id: "ferry_gabriel",
      text: "Gabriel Dumont is at the crossing, his ferry moored to the bank. His fee is fair, but the current is heavy today \u2014 the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.",
      source: getSource("DUMONT_ACCOUNTS"),
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    },
    {
      id: "river_valley_flood_crossing",
      text: "The spring flood has turned the river into a brown, churning torrent. Debris spins in the current \u2014 branches, logs, the remains of last year's ice. The ford is barely visible, marked by two willow sticks driven into the bank. The oxen smell the water and balk.",
      source: getSource("FONSECA_FORD"),
      choices: [
        { text: "Ford now while you can see the markers", dc: 14, ok: "The oxen find their footing. The cart tilts but holds. You reach the far bank soaked but whole.", bad: "A submerged log catches the axle. The cart spins in the current.", wear: 2, food: -2 },
        { text: "Wait for the water to drop", dc: null, always: "You camp on the high bank and wait. The river drops by morning.", time: 1 },
        { text: "Build a cart-raft with 2 Bison Hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river. Cargo gets wet.", morale: -6, requiresItem: { name: "Bison Hide", count: 2 } }
      ]
    },
    {
      id: "river_valley_trader_encounter",
      text: "A lone trader crests the rise ahead, his cart loaded with bundles wrapped in oilcloth. He waves \u2014 a free trader, independent of the Company, carrying goods from settlement to settlement. His prices are his own, and his news is fresh.",
      source: getSource("SAWYER_TRIAL"),
      choices: [
        { text: "Trade with him", dc: null, always: "You exchange one of his goods for one of yours. Fair value, no questions asked.", morale: 5 },
        { text: "Buy information about the trail ahead", dc: 8, ok: "He shares what he knows \u2014 which posts have supplies, which trails are washed out.", bad: "He is close-mouth about conditions ahead. You learn little.", morale: 3 },
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
        { text: "Trade food for the ammunition belt", dc: 9, ok: "He accepts your offer. The belt is sound \u2014 enough shot for several hunts or defence.", bad: "He wants more than you can spare. The deal falls through.", give: [{ name: "Ammunition Belt", amt: 1 }], food: -3, morale: 3 },
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
        { text: "Push through while you can", dc: 13, ok: "The oxen find footing. The cart tilts but holds.", bad: "A submerged log catches the axle.", wear: 2, food: -2 }
      ]
    },
    {
      id: "river_valley_canvas_cache",
      text: "Beneath a cairn of river stones, you find an oilcloth bundle stamped with the HBC monogram. A supply cache from a Company freighter \u2014 inside, a folded canvas tarp, still sound, wrapped tight against the weather. The Company's loss is your gain.",
      classification: "Supply Find",
      source: getSource("FONSECA_HBC_SUPPLY"),
      choices: [
        { text: "Take the canvas tarp", dc: 8, ok: "The tarp is heavy but waterproof. Shelter, cart cover, or raft material \u2014 it will serve.", bad: "The oilcloth is torn but the canvas beneath is sound.", give: [{ name: "Canvas Tarp", amt: 1 }], morale: 5 },
        { text: "Leave it \u2014 too heavy for the cart", dc: null, always: "You mark the cairn and move on. The cache will keep for the next traveller.", morale: 1 }
      ]
    },
    {
      id: "river_valley_cart_raft",
      text: "The river is swollen from three days of rain upstream \u2014 brown, churning, impassable as a ford. But the brigade has done this before. Women and older children help dismantle the five-foot wheels, lashing them dish-up beneath the cart box. Buffalo hides are soaked and stretched over the frame. In an hour, the cart floats. The oxen will swim. The freight, the women, and the children ride the raft across while you guide the line from the bow.",
      source: getSource("IPAC_RAFT"),
      choices: [
        { text: "Help with the raft", dc: 11, ok: "The improvised ferry holds. You reach the far bank soaked but whole.", bad: "A hide splits mid-river. Cargo gets wet and one food sack is lost.", food: -2, morale: -4 },
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
        { text: "Offer a trade", dc: 11, ok: "He swaps fresh meat for part of your load.", bad: "He senses you are short on food. The deal goes poorly.", food: 3, addsRep: { key: "cree", delta: 1 }, itemBonus: { name: "Ammunition Belt", dcBonus: 2 } },
        { text: "Keep moving", dc: null, always: "He watches but does not interfere.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_ambush_ravine",
      text: "A hidden rut drops one wheel into a creek bed \u2014 the cart tilts dangerously, and the load shifts toward the ditch. Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails. Quick hands are needed now.",
      source: getSource("BREHAUT_CART"),
      choices: [
        { text: "Catch the weight and right it", dc: 12, ok: "Quick hands save the day.", bad: "The cart upsets. One food item is lost.", food: -1, wear: 1, itemBonus: { name: "Rope (50ft)", dcBonus: 3 } },
        { text: "Call for help", dc: 9, ok: "A nearby M\xE9tis party rights the cart swiftly.", bad: "Helpers arrive slow and grumpy.", morale: -5, time: 1 }
      ]
    },
    {
      id: "wooded_stung_by_flies",
      text: "The mosquitoes and biting flies rise from the slough in a living cloud. The animals spook and the crew wants to run. Bound away to the water, into which they plunged neck deep, remaining there safe from the tormenting flies and mosquitoes.",
      source: getSource("FONSECA_MOSQUITOES"),
      choices: [
        { text: "Drive through to firmer ground", dc: 11, ok: "You outpace the worst of the cloud.", bad: "The animals bolt; a strap snaps.", wear: 1, crew: "tired" },
        { text: "Let the oxen cool in the water", dc: null, always: "The delay costs time but saves nerves.", time: 1 }
      ]
    },
    {
      id: "wooded_black_bear",
      text: "A black bear crosses the trail thirty yards ahead, then stops and turns, taking the measure of the party. Bears were common along the wooded corridors of the Carlton Trail and could be dangerous when surprised at close range. This one is calm \u2014 for now.",
      source: getSource("LACOMBE_BEAR"),
      choices: [
        { text: "Stand your ground and make noise", dc: 12, ok: "The bear veers away.", bad: "It charges and the oxen bolt.", wear: 1, morale: -6, crew: "tired" },
        { text: "Back away quietly with the cart", dc: null, always: "The bear waits until you are clear, then moves on.", time: 1 }
      ]
    },
    {
      id: "wooded_rattlesnake",
      text: "A rattlesnake hums in the grass beside the trail, still as a root until you are almost on it. Rattlesnakes were common on the southern stretches of the trail and caused many a nervous night. The lead ox smells it first and refuses to move.",
      source: getSource("SCHULTZ_RATTLESNAKE"),
      choices: [
        { text: "Hook it clear with a pole and move on", dc: 10, ok: "The snake disappears into the brush.", bad: "It strikes at the lead ox.", wear: 1, morale: -2 },
        { text: "Backtrack to a wider crossing", dc: null, always: "A slow detour, but nerves settle.", time: 1 }
      ]
    },
    {
      id: "wooded_axle_rut",
      text: "A hidden washout drops the front wheel axle-deep. The cart tilts dangerously toward the ditch. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. You need to free the cart before the soil gives way completely.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Spade and block the wheel", dc: 11, ok: "You free the cart without damage.", bad: "The soil gives way twice.", time: 1, morale: -3 },
        { text: "Lighten and rock it free", dc: 9, ok: "A quick heave gets you out clean.", bad: "A crate lands in the muck.", food: -2, wear: 1 }
      ]
    },
    {
      id: "wooded_cree_elder",
      text: "An old Cree man sits on a fallen log beside the trail, his pipe sending thin smoke into the still air. He watches your cart approach with calm eyes. When you stop, he speaks \u2014 not in English, but in gestures and a few French words. He knows these woods. He knows what lies ahead.",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Listen to what he has to say", dc: null, always: "He points to the trail ahead, then draws a line in the dust. Warning or welcome \u2014 you cannot be sure, but the gesture is clear.", morale: 5 },
        { text: "Offer a gift and trade words", dc: 9, ok: "He accepts your offering and shares what he knows about the trail. His directions save you a day.", bad: "He takes the gift but says little. Some knowledge is not for strangers.", morale: 3 },
        { text: "Nod respectfully and move on", dc: null, always: "You tip your hat and press west. The old man watches you go." }
      ]
    },
    {
      id: "wooded_bee_tree",
      text: "A hollow oak, its trunk scarred by fire, hums with life. Wild bees stream in and out of a knot near the crown \u2014 a bee tree, full of honey. The air smells of wax and sweetness. It is a rare find on the open prairie, where sugar is worth its weight in trade goods.",
      source: getSource("GOULET_BEE_TREE"),
      choices: [
        { text: "Harvest the honey", dc: 10, ok: "Smoke calms the bees. You fill a pail with golden honey \u2014 enough to trade or eat for days.", bad: "The bees are not pleased. Stings and smoke, but you get a little honey.", food: 3, time: 1 },
        { text: "Mark the tree for the return journey", dc: null, always: "You notch the bark and remember the spot. The honey will keep.", morale: 3 },
        { text: "Leave it \u2014 you cannot spare the time", dc: null, always: "The trail waits. The bees keep their treasure." }
      ]
    },
    {
      id: "wooded_forest_fire",
      text: "Smoke on the horizon. Then the wind shifts and the smell hits you \u2014 dry wood, pine resin, and the acrid bite of a forest fire pushing toward you. The treeline ahead glows orange. The oxen smell it too and pull at their traces. The prairie burned every afternoon, but this is different \u2014 this fire is coming for you.",
      source: getSource("LACOMBE_FIRE"),
      choices: [
        { text: "Ride for the river bottom", dc: 12, ok: "The fire edge passes. You lose only an afternoon.", bad: "The wind shifts. You lose supplies and the cart is singed.", food: -3, wear: 1, morale: -12 },
        { text: "Light a backfire and wait it out", dc: 10, ok: "A practised escape. The backfire draws the main blaze away from your position.", bad: "The flames jump. Your cart is spared but the oxen panic.", morale: -8, time: -1 },
        { text: "Use water from the slough to wet the canvas", dc: 11, ok: "The wet tarp protects the load. You wait in the smoke until the fire passes.", bad: "There is not enough water. The canvas smolders.", morale: -6, itemBonus: { name: "Canvas Tarp", dcBonus: 3 } }
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
        { text: "Gather firewood", dc: 8, ok: "You split and bundle the dry wood. A full bundle \u2014 enough for several nights of warmth.", bad: "The wood is sound but heavier than expected. You take what you can carry.", give: [{ name: "Firewood Bundle", amt: 1 }], morale: 5 },
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
        { text: "Press through before the storm", dc: 11, ok: "You gain the far shelter with minutes to spare.", bad: "The rain catches you on exposed ground.", wear: 1, morale: -6 },
        { text: "Hike to a rocky ledge and wait", dc: null, always: "Cold, but the cart and crew are intact.", time: 1 }
      ]
    },
    {
      id: "upland_sand_hill",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. The cart lurches and groans with every hidden obstacle.",
      source: getSource("SCHULTZ_STUMPS"),
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1 },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "upland_thunderstorm",
      text: "The ridge offers no shelter. Lightning finds the highest point and the rain comes down in sheets. Sudden storms of hail and sleet were not uncommon on the uplands in late spring. The oxen bellow and strain at their traces, and the cart slides on the wet grass.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Hobble the oxen and weather it under the cart", dc: 11, ok: "The canvas holds. You are soaked but intact.", bad: "A lightning-struck tree falls nearby.", morale: -6, time: -1, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } },
        { text: "Run for the coulee bottom", dc: 9, ok: "Lower ground is safer.", bad: "A slipped wheel in the mud.", wear: 1 }
      ]
    },
    {
      id: "upland_bison_herd",
      text: "The trail's gone. Buffalo everywhere \u2014 thousands, maybe ten thousand, brown humps to the horizon on both sides. The ground shakes. Your ox won't go forward, eyes white, pulling sideways.",
      source: getSource("GOULET_HUNT"),
      choices: [
        { text: "Wait for the herd to pass", dc: null, always: "You make camp and wait. The herd takes half a day to pass. The ground is churned to dust.", time: 1 },
        { text: "Drive through the edge of the herd", dc: 13, ok: "The oxen plunge in. The herd parts just enough. You emerge on the other side, hearts pounding.", bad: "A bull takes offense. The oxen bolt. Cart tips and supplies scatter.", wear: 2, morale: -8 },
        { text: "Hunt a straggler for food", dc: 11, ok: "A young bull is separated from the herd. The crew brings it down and butchers it on the spot.", bad: "The shot scatters the herd toward you. The oxen stampede.", food: 6, itemBonus: { name: "Ammunition Belt", dcBonus: 3 } }
      ]
    },
    {
      id: "upland_storm_shelter",
      text: "Green sky. Then the hail starts \u2014 stones hammering the canvas. Lightning hits the ridge above. No up there, no cover here. The oxen bellow and sit down.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Hobble the oxen and wait it out", dc: null, always: "You huddle under the cart. The storm passes in twenty minutes. Everyone is soaked but alive.", morale: -4 },
        { text: "Push for the coulee bottom", dc: 10, ok: "Lower ground is safer. The hail lessens as you descend.", bad: "A slipped wheel in the mud. The cart tilts but holds.", wear: 1 },
        { text: "Use the Canvas Tarp as shelter", dc: 9, ok: "The tarp holds against the worst of it. The crew stays dry enough.", bad: "The wind tears at the canvas. A pole snaps.", morale: -3, itemBonus: { name: "Canvas Tarp", dcBonus: 3 } }
      ]
    },
    {
      id: "upland_metis_scout",
      text: "A lone rider appears on the ridge ahead \u2014 a M\xE9tis scout, his cart painted red and blue, his sash bright against the brown grass. He knows these hills. He offers to guide you through the uplands for a price.",
      source: getSource("MMF_COMMUNITIES"),
      choices: [
        { text: "Hire him as a guide", dc: null, always: "He rides ahead and finds the best path. You save a day of wandering.", food: -3, extraProgress: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Trade for information instead", dc: 8, ok: "He shares what he knows about the trail ahead in exchange for news from the settlements.", bad: "He is polite but reveals little. You part ways no wiser.", morale: 5 },
        { text: "Decline and rely on your own sense", dc: null, always: "You nod respectfully and press on alone. The trail is harder to find than expected.", time: 1 }
      ]
    },
    {
      id: "upland_water_hole",
      text: "The oxen refuse to drink. The water hole ahead is alkaline \u2014 white crust rings the edge, and the smell of alkali rides the wind. The animals know before you do: this water will sicken them.",
      source: getSource("SCHULTZ_ALKALI"),
      choices: [
        { text: "Force the oxen through to clean water beyond", dc: 11, ok: "The oxen drink reluctantly and you push on. They recover by evening.", bad: "One ox goes lame from the bad water. Progress slows to a crawl.", crew: "tired", morale: -6 },
        { text: "Detour to find a clean spring", dc: null, always: "A longer route, but the water is sweet. The oxen drink deeply and press on with new energy.", time: 1, morale: 5 },
        { text: "Ration Pemmican Rations to sustain the crew", dc: null, always: "You stretch your food and wait for the oxen to adjust. A hungry day, but no one falls ill.", food: -3 }
      ]
    },
    {
      id: "upland_night_frost",
      text: "The temperature drops after sunset. By morning, a thin crust of ice covers the water barrels and the oxen's breath rises in white plumes. The ground is too hard to drive tent pegs. The crew huddles together for warmth, and the firewood burns faster than you planned.",
      source: getSource("SCHULTZ_FROST"),
      choices: [
        { text: "Burn extra Firewood Bundle to keep warm", dc: null, always: "The fire holds back the cold. The crew sleeps, but your fuel reserves are thinner now.", morale: 5 },
        { text: "Push through without extra fire", dc: 9, ok: "Grit and determination. The crew complains but holds together.", bad: "Fingers go numb. One crew member cannot feel their feet by morning.", crew: "tired", morale: -10 },
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
        { text: "Push through \u2014 follow the ridge", dc: 11, ok: "The going is brutal but you keep moving.", bad: "The snow deepens. Progress is measured in yards.", crew: "tired", morale: -8 }
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
        { text: "Build a cart-raft with 2 bison hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river; cargo gets wet.", morale: -6, setsFlag: "built_rafts", requiresItem: { name: "Bison Hide", count: 2 }, branch: {
          id: "river_raft_wash",
          text: "On the far bank, an elder watches your landing and nods slowly.",
          choices: [
            { text: "Greet him respectfully", dc: 10, ok: "He shares drying hides and directions for the next leg.", bad: "He is suspicious and leaves without speaking.", addsRep: { key: "cree", delta: 1 }, morale: 8 },
            { text: "Get moving without conversation", dc: null, always: "Pragmatic. The crossing cost enough time.", alwaysWear: 0 }
          ]
        } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2 }
      ]
    },
    {
      id: "river_nwmp_duty",
      text: "At the crossing, red coats inspect the carts with scrupulous care. Duty is collected in cash or goods. The mounted police established posts along the trail to enforce Ottawa's regulations, and every cart is subject to inspection.",
      source: getSource("MACLEOD_NWMP"),
      choices: [
        { text: "Declare your goods and pay duty", dc: null, always: "The paperwork is tedious but fair. You keep your peace.", food: -2, addsRep: { key: "nwmp", delta: 1 } },
        { text: "Attempt to pass quietly", dc: 13, ok: "They are busy and let you slip through.", bad: "Caught concealing cargo. Goods are confiscated.", morale: -15, addsRep: { key: "nwmp", delta: -2 } }
      ]
    },
    {
      id: "river_lawrence_barkwell_boats",
      text: "You meet a crew of boatmen heading for the Portage La Loche. Their faces are lean, their hands calloused, but their eyes are sharp. This famous brigade traveled 4000 miles every year, and the men who crewed it knew every river from the Red to the Athabasca.",
      source: getSource("BARKWELL_BRIGADE"),
      choices: [
        { text: "Exchange dried fish and route talk", dc: 8, ok: "They share intelligence on the next water crossings.", bad: "The conversation is brief and businesslike.", morale: 6 },
        { text: "Hire a guide for the hard water ahead", dc: 10, ok: "A steady hand joins your crew for three days.", bad: "The boatman is competent but expensive.", food: -3, extraProgress: 2, addsRep: { key: "metis", delta: 1 } }
      ]
    },
    {
      id: "river_ice_breakup",
      text: "The river is in breakup. Great slabs of ice grind and tumble in the brown water, crashing against the banks with a sound like cannon fire. The crossing is impassable today \u2014 perhaps tomorrow, if the cold holds. The crew watches the ice flow past and wonders how long the wait will be.",
      source: getSource("FONSECA_ICE"),
      choices: [
        { text: "Wait for the ice to clear", dc: null, always: "You camp and watch the river. By morning, the channel is clear enough.", time: 1 },
        { text: "Find an alternate crossing upstream", dc: 11, ok: "A narrower point, but the ice has passed. You cross carefully.", bad: "The bank is steep. The cart slips but holds.", wear: 1 },
        { text: "Risk the crossing now", dc: 15, ok: "The oxen are strong swimmers. You make it across, ice grinding at the cart sides.", bad: "A slab of ice catches the axle. The cart tips. Cargo lost to the current.", wear: 2, food: -4 }
      ]
    },
    {
      id: "river_supply_boat",
      text: "A York boat rounds the bend, its oars flashing in the sun. HBC markings on the hull \u2014 a supply boat heading downstream from the northern posts. The crew waves. They have news, and they have trade goods that have not seen a settlement in months.",
      source: getSource("HBC_JOURNAL"),
      choices: [
        { text: "Trade with the boat crew", dc: null, always: "You exchange news and goods. The boatmen are glad for fresh supplies from the south.", morale: 5 },
        { text: "Ask for news of the trail ahead", dc: 8, ok: "They tell you which posts are well-stocked and which trails have washed out. Valuable intelligence.", bad: "They are close-mouth about Company business. You learn little.", morale: 3 },
        { text: "Wave and continue on your way", dc: null, always: "You are heading west, they are heading east. Your paths cross and diverge." }
      ]
    },
    {
      id: "river_sandbar_trap",
      text: "The oxen are halfway across when the cart lurches and stops. The front wheels have dropped into a hidden sandbar, and the current is pushing against the cart bed. The oxen strain but cannot pull free. The water is rising.",
      source: getSource("BREHAUT_SANDBAR"),
      choices: [
        { text: "Unload and float the cart free", dc: 11, ok: "You lighten the load and the oxen pull clear. Wet cargo, but the cart is safe.", bad: "The current shifts the cart. A barrel is swept away.", food: -2, wear: 1 },
        { text: "Use Rope (50ft) to anchor and pull from bank", dc: 10, ok: "The rope holds. The crew on the bank heaves. The cart grinds free.", bad: "The rope slips. The cart settles deeper.", wear: 1, itemBonus: { name: "Rope (50ft)", dcBonus: 3 } },
        { text: "Wait for the water level to drop", dc: null, always: "You wait. The current lessens by afternoon and the oxen pull free.", time: 1, morale: -5 }
      ]
    },
    {
      id: "river_cart_raft_crossing",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart \u2014 enough to build a raft, if you know how. The river is wide and the current steady. On the far bank, the trail continues west.",
      source: getSource("FONSECA_RAF"),
      choices: [
        { text: "Build a cart-raft with 2 Bison Hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river. Cargo gets wet.", morale: -6, requiresItem: { name: "Bison Hide", count: 2 } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2 }
      ]
    },
    {
      id: "river_beaver_trade",
      text: "The river bends through a series of still ponds where beaver dams hold the water high. Freshly cut saplings show the work of a large colony. The pelts would be prime this time of year, and the meat would stretch your food supplies. If you have ammunition to spare.",
      classification: "Supply Find",
      source: getSource("FONSECA_BEAVER"),
      choices: [
        { text: "Set traps and hunt beaver", dc: 10, ok: "The traps hold. You harvest two prime pelts and smoke the meat over the fire.", bad: "The beavers are wary. You get one pelt and little meat.", give: [{ name: "Beaver Pelts", amt: 2 }], morale: 6 },
        { text: "Fish instead \u2014 lower risk", dc: 8, ok: "The river yields enough fish to stretch your rations by a day.", bad: "The fish are not biting. A wasted afternoon.", food: 3, morale: 2 }
      ]
    }
  ]
};
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
    const seasonWeights = CONSTANTS.SEASON_BASE_WEATHER[seasonFor(S2.month)];
    let next = pickWeighted(CONSTANTS.WEATHER_TRANSITION[S2.weather]);
    if (seasonWeights[next] === 0) {
      next = "overcast";
    }
    S2.weather = next;
  }
  __name(advanceWeather, "advanceWeather");
  const cart = startingCart();
  const S2 = {
    seed,
    day: 1,
    month: CONSTANTS.START_MONTH,
    year: CONSTANTS.YEAR,
    date: { month: CONSTANTS.START_MONTH, day: CONSTANTS.START_DAY },
    season: seasonFor(CONSTANTS.START_MONTH),
    crew: "rested",
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
    mbValue: 0,
    // total MB value of all trade goods in cart
    perishable: {},
    preDeparture: true,
    weather: initWeather()
  };
  function calcMB() {
    return cart.filter((i) => i.type === "trade" || i.category === "furs").reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
  }
  __name(calcMB, "calcMB");
  function recalcMB() {
    S2.mbValue = Math.round(calcMB() * 100) / 100;
  }
  __name(recalcMB, "recalcMB");
  function checkGameOver() {
    if (S2.over) return;
    if (S2.food <= 0) {
      S2.food = 0;
      S2.over = true;
      S2.endReason = "starvation";
    }
    if (S2.wear >= CONSTANTS.MAX_WEAR) {
      S2.over = true;
      S2.endReason = "cart_failure";
    }
    if (S2.season === "early winter" && S2.node < NODES.length - 1) {
      S2.over = true;
      S2.endReason = "winter";
    }
    if (S2.morale <= 0) {
      S2.morale = 0;
      S2.over = true;
      S2.endReason = "abandoned";
    }
  }
  __name(checkGameOver, "checkGameOver");
  function advance() {
    const next = advanceDate(S2.date.month, S2.date.day, 0);
    S2.date = next;
    S2.month = next.month;
    S2.day++;
    S2.season = seasonFor(S2.month);
  }
  __name(advance, "advance");
  function resolveChoice(ev, ci) {
    const ch = ev.choices[ci];
    const result = { roll: null, total: null, dc: null, success: null, text: "", effects: [], flags: [], reps: [] };
    if (ch.requiresFlag && !S2.flags[ch.requiresFlag]) {
      result.text = `You need a different circumstance for that.`;
      result.success = false;
      return result;
    }
    if (ch.requiresRep) {
      const cur = S2.reputation[ch.requiresRep.key] || 0;
      if (cur < ch.requiresRep.min) {
        result.text = `Your reputation with the ${ch.requiresRep.key} is too low for that.`;
        result.success = false;
        return result;
      }
    }
    if (ch.dc !== null) {
      const roll = d();
      const total = roll + totalMod(S2);
      const success = total >= ch.dc;
      result.roll = roll;
      result.total = total;
      result.dc = ch.dc;
      result.success = success;
      result.text = success ? `Success. ${ch.ok}` : `Failure. ${ch.bad}`;
      if (!success) {
        S2.wear = Math.max(0, S2.wear + (ch.wear || 0));
        result.effects.push(`${ch.wear || 0 >= 0 ? "+" : ""}${ch.wear || 0} Wear`);
      } else if (ch.wear) {
        S2.wear = Math.max(0, S2.wear + ch.wear);
        result.effects.push(`${ch.wear >= 0 ? "+" : ""}${ch.wear} Wear`);
      }
    } else if (ch.always) {
      result.text = ch.always;
      result.success = true;
      if (ch.alwaysWear) {
        S2.wear = Math.max(0, S2.wear + ch.alwaysWear);
        result.effects.push(`${ch.alwaysWear >= 0 ? "+" : ""}${ch.alwaysWear} Wear`);
      }
    }
    if (ch.time) {
      if (ch.time > 0) {
        advance();
        result.effects.push(`+${ch.time} day(s)`);
      }
      if (ch.time < 0) {
        S2.segmentDay = Math.max(0, S2.segmentDay + ch.time);
        result.effects.push(`${ch.time} day(s)`);
      }
    }
    if (ch.food) {
      S2.food += ch.food;
      result.effects.push(`${ch.food > 0 ? "+" : ""}${ch.food} Food`);
    }
    if (ch.crew) {
      S2.crew = ch.crew;
      result.effects.push(`Crew: ${ch.crew}`);
    }
    if (ch.morale) {
      S2.morale = Math.max(0, Math.min(100, S2.morale + ch.morale));
      result.effects.push(`${ch.morale >= 0 ? "+" : ""}${ch.morale} Morale`);
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
      S2.segmentDay += ch.extraProgress;
      result.effects.push(`+${ch.extraProgress} progress`);
    }
    if (ch.setsFlag) {
      S2.flags[ch.setsFlag] = true;
      result.flags.push(ch.setsFlag);
    }
    if (ch.addsRep) {
      S2.reputation[ch.addsRep.key] = (S2.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
      result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S2.reputation[ch.addsRep.key] });
    }
    if (ch.branch && !S2.pendingEvent) {
      const branched = typeof ch.branch === "function" ? ch.branch({ flags: S2.flags, reputation: S2.reputation, rng: rand }) : ch.branch;
      if (branched) S2.pendingEvent = branched;
    }
    S2.eventsResolved++;
    return result;
  }
  __name(resolveChoice, "resolveChoice");
  function pickEvent() {
    if (rand() > CONSTANTS.EVENT_CHANCE) return null;
    return pickEventForTerrain(NODES[S2.node]?.terrain || "plains", rand);
  }
  __name(pickEvent, "pickEvent");
  function pickEventWithChance(chance) {
    if (rand() > chance) return null;
    return pickEventForTerrain(NODES[S2.node]?.terrain || "plains", rand);
  }
  __name(pickEventWithChance, "pickEventWithChance");
  function calcScore() {
    if (!S2.won) return 0;
    const daysPenalty = S2.day;
    const wearPenalty = S2.wear * S2.wear;
    const foodBonus = Math.min(S2.food, 25);
    const crewBonus = S2.crew === "rested" ? 30 : S2.crew === "tired" ? 10 : 0;
    const noRestPenalty = Math.max(0, S2.travelDaysWithoutRest - 3) * 15;
    let score = 1e3;
    score += Math.round(S2.mbValue * 80);
    score += foodBonus * 12;
    score += crewBonus;
    score -= daysPenalty * 8;
    score -= wearPenalty * 40;
    score -= noRestPenalty;
    return Math.max(0, Math.round(score));
  }
  __name(calcScore, "calcScore");
  const stepLog = [];
  function travelOneDay2() {
    if (S2.over || S2.pendingSettlement) return stepLog;
    const nextDist = NODES[S2.node + 1]?.dist || 1;
    advanceWeather();
    const weatherFood = CONSTANTS.WEATHER_FOOD_MOD[S2.weather] || 0;
    S2.food = Math.max(0, Math.round((S2.food - CONSTANTS.DAILY_FOOD - weatherFood) * 10) / 10);
    S2.segmentDay++;
    S2.travelDaysWithoutRest++;
    advance();
    const wearChance = { plains: 0.1, river_valley: 0.15, wooded: 0.2 };
    const weatherWearMult = CONSTANTS.WEATHER_WEAR_MULT[S2.weather] || 1;
    if (rand() < (wearChance[NODES[S2.node].terrain] || 0.2) * weatherWearMult) S2.wear++;
    if (S2.wear >= 4 && rand() < 0.35) {
      S2.pendingEvent = getSquealEvent();
      return stepLog;
    }
    if (S2.travelDaysWithoutRest >= 5 && S2.crew !== "exhausted") S2.crew = "exhausted";
    else if (S2.travelDaysWithoutRest >= 3 && S2.crew === "rested") S2.crew = "tired";
    const weatherMorale = CONSTANTS.WEATHER_MORALE_MOD[S2.weather] || 0;
    S2.morale = Math.max(0, Math.min(100, S2.morale - 2 + weatherMorale));
    if (S2.day % CONSTANTS.DAYS_PER_WEEK === 0 && !S2.pendingSettlement) {
      S2.crew = "rested";
      S2.wear = Math.max(0, S2.wear - 1);
      S2.travelDaysWithoutRest = 0;
      S2.morale = Math.min(100, S2.morale + 20);
      return stepLog;
    }
    if (S2.segmentDay >= nextDist) {
      S2.node++;
      S2.segmentDay = 0;
      const n = S2.node < NODES.length ? NODES[S2.node] : null;
      if (!n) {
        S2.over = true;
        return stepLog;
      }
      if (S2.node >= NODES.length - 1) {
        const hasTrade = cart.some((i) => i.type === "trade" && i.count > 0);
        recalcMB();
        S2.over = true;
        if (S2.food <= 0) {
          S2.endReason = "starvation";
        } else if (S2.wear >= CONSTANTS.MAX_WEAR) {
          S2.endReason = "cart_failure";
        } else if (S2.morale <= 0) {
          S2.endReason = "abandoned";
        } else {
          S2.won = S2.mbValue >= CONSTANTS.MB_WIN_THRESHOLD;
          S2.score = calcScore();
          S2.endReason = S2.won ? "victory" : "no_trade";
        }
        return stepLog;
      }
      if (n.type !== "river" && S2.node >= 1) S2.pendingSettlement = n;
      return stepLog;
    }
    const weatherEventMod = CONSTANTS.WEATHER_EVENT_MOD[S2.weather] || 0;
    const ev = pickEventWithChance(CONSTANTS.EVENT_CHANCE + weatherEventMod);
    if (ev) {
      S2.pendingEvent = ev;
      return stepLog;
    }
    return stepLog;
  }
  __name(travelOneDay2, "travelOneDay");
  function chooseEventChoice(choiceIndex) {
    if (!S2.pendingEvent) return [];
    const ev = S2.pendingEvent;
    S2.pendingEvent = null;
    const result = resolveChoice(ev, choiceIndex);
    checkGameOver();
    if (S2.segmentDay >= (NODES[S2.node + 1]?.dist || 1)) {
      S2.node++;
      S2.segmentDay = 0;
      if (S2.node >= NODES.length - 1) {
        const hasTrade = cart.some((i) => i.type === "trade" && i.count > 0);
        recalcMB();
        S2.over = true;
        S2.won = S2.mbValue >= CONSTANTS.MB_WIN_THRESHOLD && S2.wear < CONSTANTS.MAX_WEAR;
        S2.score = calcScore();
      } else {
        const n = NODES[S2.node];
        if (n.type !== "river") S2.pendingSettlement = n;
      }
    }
    checkGameOver();
    return [{ action: "eventResolved", event: ev.id, choiceIndex, result }];
  }
  __name(chooseEventChoice, "chooseEventChoice");
  function makeCamp() {
    if (S2.pendingSettlement || S2.over) return;
    S2.food--;
    S2.camps++;
    S2.travelDaysWithoutRest = 0;
    if (S2.crew === "exhausted") S2.crew = "tired";
    else if (S2.crew === "tired") S2.crew = "rested";
    const campMorale = CONSTANTS.WEATHER_CAMP_MORALE[S2.weather] ?? 15;
    S2.morale = Math.min(100, S2.morale + campMorale);
    advance();
    checkGameOver();
  }
  __name(makeCamp, "makeCamp");
  function pushOn2() {
    if (S2.pendingSettlement || S2.over) return;
    S2.food = Math.max(0, Math.round((S2.food - 1.5) * 10) / 10);
    S2.wear = Math.min(S2.wear + 1, 99);
    S2.morale = Math.max(0, S2.morale - 5);
    S2.travelDaysWithoutRest++;
    if (S2.travelDaysWithoutRest >= 5 && S2.crew !== "exhausted") S2.crew = "exhausted";
    else if (S2.travelDaysWithoutRest >= 3 && S2.crew === "rested") S2.crew = "tired";
    advance();
    checkGameOver();
  }
  __name(pushOn2, "pushOn");
  function settlementAction(action) {
    if (!S2.pendingSettlement) return [];
    if (action === "continue") {
      S2.pendingSettlement = null;
      return [];
    }
    if (action === "rest") {
      S2.crew = "rested";
      S2.food = Math.max(0, S2.food - 1);
      S2.travelDaysWithoutRest = 0;
      S2.morale = Math.min(100, S2.morale + 15);
    }
    if (action === "repair") {
      const shag = cart.find((i) => i.name === "Shaganappi");
      if (S2.wear > 0 && shag && shag.count > 0) {
        shag.count--;
        S2.wear = Math.max(0, S2.wear - 2);
        recalcMB();
      } else if (S2.wear > 0) {
        S2.wear = Math.max(0, S2.wear - 2);
      }
    }
    if (action === "heal") {
      S2.crew = "rested";
      S2.morale = Math.min(100, S2.morale + 20);
    }
    if (action === "trade") {
      const tg = cart.find((i) => i.type === "trade" && i.count > 0);
      if (tg) {
        tg.count--;
        recalcMB();
        const mbGain = tg.mbValue || 1;
        S2.credit[S2.pendingSettlement?.type || "hbc"] = (S2.credit[S2.pendingSettlement?.type || "hbc"] || 0) + mbGain;
        S2.tradesMade++;
      }
    }
    if (action === "buy_food") {
      const cost = CONSTANTS.MB_FOOD_COST;
      const settleType = S2.pendingSettlement?.type || "hbc";
      if ((S2.credit[settleType] || 0) >= cost) {
        S2.credit[settleType] -= cost;
        S2.food += Math.floor(1 / cost);
      }
    }
    if (action === "buy_repair") {
      const cost = CONSTANTS.MB_REPAIR_COST;
      const settleType = S2.pendingSettlement?.type || "hbc";
      if ((S2.credit[settleType] || 0) >= cost && S2.wear > 0) {
        S2.credit[settleType] -= cost;
        S2.wear = Math.max(0, S2.wear - 2);
      }
    }
    if (action === "buy_heal") {
      const cost = CONSTANTS.MB_HEAL_COST;
      const settleType = S2.pendingSettlement?.type || "hbc";
      if ((S2.credit[settleType] || 0) >= cost) {
        S2.credit[settleType] -= cost;
        S2.morale = Math.min(100, S2.morale + 20);
        S2.crew = "rested";
      }
    }
    if (action === "buy_info") {
      const cost = CONSTANTS.MB_INFO_COST;
      const settleType = S2.pendingSettlement?.type || "hbc";
      if ((S2.credit[settleType] || 0) >= cost) {
        S2.credit[settleType] -= cost;
        S2.morale = Math.min(100, S2.morale + 5);
        S2.flags["trail_intel_" + S2.node] = true;
      }
    }
    if (action === "craft") {
      const recipes = this.getAvailableRecipes();
      if (recipes.length === 0) return { error: "No recipes available" };
      advance();
    }
    checkGameOver();
    return [];
  }
  __name(settlementAction, "settlementAction");
  return {
    travelOneDay: travelOneDay2,
    makeCamp,
    pushOn: pushOn2,
    chooseEventChoice,
    getState() {
      return {
        day: S2.day,
        month: S2.month,
        year: S2.year,
        season: S2.season,
        crew: S2.crew,
        food: S2.food,
        wear: S2.wear,
        morale: S2.morale,
        node: S2.node,
        segmentDay: S2.segmentDay,
        over: S2.over,
        won: S2.won,
        endReason: S2.endReason || null,
        score: S2.score,
        pendingEvent: S2.pendingEvent,
        pendingSettlement: S2.pendingSettlement,
        usedWeight: totalWeight(cart),
        capacity: S2.capacity,
        preDeparture: S2.preDeparture,
        weather: S2.weather,
        currentTerrain: NODES[S2.node]?.terrain || "plains",
        travelDaysWithoutRest: S2.travelDaysWithoutRest,
        mbValue: S2.mbValue,
        credit: { ...S2.credit }
      };
    },
    getCart() {
      return JSON.parse(JSON.stringify(cart));
    },
    offloadItem(name3) {
      const idx = cart.findIndex((i) => i.name === name3);
      if (idx === -1 || cart[idx].count <= 0) return false;
      cart[idx].count--;
      recalcMB();
      return true;
    },
    getTradeEstimate(itemId, quantity, settlementType) {
      const item = cart.find((i) => i.name === itemId);
      if (!item) return null;
      const basePrice = item.mbValue || 1;
      const mult = getSettlementPriceMultiplier(settlementType, item.category);
      const distanceFactor = S2.node / (NODES.length - 1);
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
      const est = this.getTradeEstimate(itemName);
      const foodGain = Math.floor(rand() * (est.max - est.min + 1)) + est.min;
      S2.food += foodGain;
      S2.tradesMade++;
      return { item: itemName, foodGain };
    },
    // ── NEW Engine API for Sprint 3 ───────────────────────────────────
    getSettlementActions(settlementType) {
      const actions = getSettlementActionsByType(settlementType);
      return actions.map((a) => ({
        id: a.id,
        label: a.label,
        cost: a.cost,
        risk: a.risk,
        flavor: a.flavor
      }));
    },
    settlementAction(actionId, params = {}) {
      if (!S2.pendingSettlement) return { error: "No settlement pending" };
      const type = S2.pendingSettlement.type;
      const state = S2;
      const result = executeSettlementAction(actionId, type, state, cart, params);
      checkGameOver();
      return result || {};
    },
    getEndgameScore() {
      if (!S2.won) return { score: 0, breakdown: {} };
      const mbVal = S2.mbValue || 0;
      const foodBonus = Math.min(S2.food, 25);
      const crewBonus = S2.crew === "rested" ? 30 : S2.crew === "tired" ? 10 : 0;
      const daysPenalty = S2.day * 8;
      const wearPenalty = S2.wear * S2.wear * 40;
      const baseScore = 500;
      const mbScore = Math.round(mbVal * 80);
      const foodScore = foodBonus * 12;
      const total = baseScore + mbScore + foodScore + crewBonus - daysPenalty - wearPenalty;
      let tier;
      if (total < 500) tier = "Barely Survived";
      else if (total < 1200) tier = "Solid Profit";
      else tier = "Legendary Haul";
      return {
        score: Math.max(0, Math.round(total)),
        breakdown: {
          base: baseScore,
          mbValue: mbScore,
          foodBonus: foodScore,
          crewCondition: crewBonus,
          daysPenalty: -daysPenalty,
          wearPenalty: -wearPenalty
        },
        tier
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
          output: { name: "Finished Hides", icon: "\u{1F7EB}", mbValue: 3.5 },
          settlement: "hbc"
        },
        {
          id: "travois_kit",
          name: "Travois Kit",
          inputs: [
            { name: "Shaganappi", count: 2 },
            { name: "Rope (50ft)", count: 1 }
          ],
          output: { name: "Travois Kit", icon: "\u{1F6D2}", mbValue: 2.5 },
          settlement: "metis"
        },
        {
          id: "gunpowder_pack",
          name: "Gunpowder Pack",
          inputs: [
            { name: "Ammunition Belt", count: 1 },
            { name: "Tool Kit", count: 1 }
          ],
          output: { name: "Gunpowder Pack", icon: "\u{1F4A5}", mbValue: 4 },
          settlement: "nwmp"
        }
      ];
      return recipes.filter((r) => {
        const n = NODES[S2.node];
        return !r.settlement || r.settlement === n.type;
      }).map((r) => ({
        ...r,
        inputs: r.inputs.map((inp) => {
          const have = cart.find((c) => c.name === inp.name)?.count || 0;
          return { ...inp, have };
        })
      }));
    },
    campAction(type) {
      const action = String(type || "").toLowerCase();
      const costItems = [];
      const effects = [];
      let roll = null;
      let rollTotal = null;
      let critical = false;
      if (action === "rest") {
        if (S2.food < 1) return { error: "Not enough food to rest." };
        S2.food -= 1;
        costItems.push({ name: "Food", count: -1 });
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          S2.crew = "tired";
          S2.morale = Math.max(0, S2.morale - 3);
          S2.travelDaysWithoutRest = 0;
          effects.push("Critical failure: the camp is a disaster \u2014 cold, sleepless, demoralizing.", "Morale -3", "Crew tired");
        } else if (rollTotal >= 15) {
          S2.crew = "rested";
          S2.morale = Math.max(0, Math.min(100, S2.morale + 20));
          S2.wear = Math.max(0, S2.wear - 1);
          S2.travelDaysWithoutRest = 0;
          effects.push("Wonderful rest.", "Crew rested", "Morale +20", "Wear -1");
        } else if (rollTotal >= 8) {
          S2.crew = "rested";
          S2.morale = Math.max(0, Math.min(100, S2.morale + 15));
          S2.wear = Math.max(0, S2.wear - 1);
          S2.travelDaysWithoutRest = 0;
          effects.push("Crew rested", "Morale +15", "Wear -1");
        } else {
          S2.crew = "tired";
          S2.morale = Math.max(0, Math.min(100, S2.morale + 5));
          S2.travelDaysWithoutRest = 0;
          effects.push("Rough night.", "Morale +5", "Crew tired");
        }
      } else if (action === "forage") {
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          advance();
          effects.push("Critical failure: wasted the whole day. Found nothing.", "+1 day lost");
        }
        const baseGain = Math.floor(Math.random() * 6) + (rollTotal >= 12 ? 6 : rollTotal >= 8 ? 4 : 1);
        S2.food += baseGain;
        if (rollTotal >= 12) {
          effects.push(`Excellent foraging. +${baseGain} Food`);
        } else if (rollTotal >= 8) {
          effects.push(`Foraged +${baseGain} Food`);
        } else if (rollTotal >= 5) {
          effects.push(`Lean haul. +${baseGain} Food`);
        } else {
          effects.push("Found little today.");
        }
      } else if (action === "hunt") {
        const ammo = cart.find((i) => i.name === "Ammunition Belt");
        if (!ammo || ammo.count < 1) return { error: "Need 1 Ammunition Belt to hunt." };
        ammo.count -= 1;
        costItems.push({ name: "Ammunition Belt", count: -1 });
        advance();
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          S2.morale = Math.max(0, S2.morale - 2);
          effects.push("Critical failure: shot went wide, startled the game, lost ammo.", "Morale -2");
        } else if (rollTotal >= 10) {
          const terrain = NODES[S2.node]?.terrain || "plains";
          let prey;
          if (terrain === "river_valley") {
            prey = { name: "Beaver Pelt", icon: "\u{1F9AB}", mbValue: 3 };
          } else if (terrain === "uplands") {
            prey = { name: "Elk Hide", icon: "\u{1FACE}", mbValue: 2.5 };
          } else if (terrain === "wooded") {
            prey = { name: "Deer Hide", icon: "\u{1F98C}", mbValue: 1.8 };
          } else {
            prey = { name: "Bison Hide", icon: "\u{1F403}", mbValue: 1.25 };
          }
          const existing = cart.find((c) => c.name === prey.name);
          if (existing) {
            existing.count++;
          } else {
            cart.push({ name: prey.name, icon: prey.icon, type: "trade", category: "furs", wt: 4, count: 1, mbValue: prey.mbValue, desc: `Hunted on the ${terrain.replace(/_/g, " ")}.` });
          }
          recalcMB();
          effects.push(`Clean kill. +1 ${prey.name} (trade good)`);
        } else {
          effects.push("Shot went wide. No pelts gained.");
        }
      } else if (action === "repair") {
        const shag = cart.find((i) => i.name === "Shaganappi");
        if (!shag || shag.count < 1) return { error: "Need 1 Shaganappi to repair." };
        shag.count -= 1;
        costItems.push({ name: "Shaganappi", count: -1 });
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          S2.wear = Math.min(CONSTANTS.MAX_WEAR, S2.wear + 1);
          effects.push("Critical failure: shaganappi wasted, repair botched. Cart worse off.", "Wear +1");
        } else {
          const hasAxle = cart.some((i) => i.name === "Spare Axle");
          const repaired = hasAxle ? 3 : 2;
          S2.wear = Math.max(0, S2.wear - repaired);
          effects.push(`Wear -${repaired}`);
        }
      } else if (action === "scout") {
        advance();
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          S2.flags["scout_blind"] = true;
          effects.push("Critical failure: scout got turned around. Next event will have no warning.");
        } else if (rollTotal >= 12) {
          const n = NODES[S2.node + 1];
          const terrain = n && n.terrain || "plains";
          effects.push(`Scout succeeded. Next leg is ${terrain.replace(/_/g, " ")}.`);
        } else {
          effects.push("Scout returned with nothing clear to report.");
        }
      } else if (action === "dance") {
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (roll === 1) {
          critical = true;
          S2.morale = Math.max(0, S2.morale - 3);
          effects.push("Critical failure: the evening fell flat. Old arguments resurfaced.", "Morale -3");
        } else {
          const bonus = S2.crew === "rested" ? 12 : S2.crew === "tired" ? 8 : 5;
          S2.morale = Math.max(0, Math.min(100, S2.morale + bonus));
          effects.push(`Morale +${bonus}`);
        }
      } else if (action === "pemmican_process") {
        if (S2.food < 3) return { error: "Need at least 3 Food to process pemmican." };
        S2.food -= 3;
        costItems.push({ name: "Food", count: -3 });
        roll = d();
        rollTotal = roll + crewMod(S2);
        if (rollTotal >= 12) {
          const gained = Math.floor(Math.random() * 8) + 10;
          S2.food += gained;
          S2.morale = Math.max(0, Math.min(100, S2.morale + 10));
          effects.push(`The women work fast \u2014 slicing, pounding, rendering tallow. +${gained} Pemmican`, "Morale +10");
        } else if (rollTotal >= 7) {
          const gained = Math.floor(Math.random() * 5) + 5;
          S2.food += gained;
          effects.push(`Lean processing. +${gained} Pemmican`);
        } else {
          effects.push("The work is slow and the yield is poor. +2 Pemmican");
          S2.food += 2;
        }
      } else if (action === "deeprest") {
        if (S2.food < 2) return { error: "Need 2 Food for a deep rest." };
        S2.food -= 2;
        S2.crew = "rested";
        S2.morale = Math.max(0, Math.min(100, S2.morale + 30));
        S2.wear = Math.max(0, S2.wear - 2);
        S2.travelDaysWithoutRest = 0;
        effects.push("+2 Food spent", "Crew rested", "Morale +30", "Wear -2");
        advance();
        advance();
      } else {
        return { error: "Unknown camp action." };
      }
      if (effects.length === 0 && costItems.length === 0) effects.push("Nothing changes.");
      return { day: S2.day, effects, costItems, roll, rollTotal, critical };
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
        if (recipe.id === "raft" && !S2.flags.raftUsed) {
          S2.flags.raftUsed = true;
          S2.trailIntel = S2.trailIntel || [];
          return { applied: "raft" };
        }
        if (recipe.id === "signal_fire") {
          S2.trailIntel = S2.trailIntel || [];
          S2.trailIntel.push({ fromDay: S2.day, text: "Signal fire lit.", bonus: { dcBonus: 2 } });
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
          mbValue: recipe.output.mbValue,
          desc: `Crafted: ${recipe.output.name}.`
        });
      }
      return recipe.output.name;
    },
    getNodes() {
      return NODES;
    },
    getCurrentNode() {
      return NODES[S2.node];
    },
    getNextNode() {
      return NODES[S2.node + 1] || null;
    },
    totalWeight() {
      return totalWeight(cart);
    },
    getCrew() {
      return { state: S2.crew, morale: S2.morale, mod: crewMod(S2), label: S2.crew };
    },
    getPendingEvent() {
      if (!S2.pendingEvent) return null;
      return {
        id: S2.pendingEvent.id,
        text: S2.pendingEvent.text,
        source: S2.pendingEvent.source || null,
        choices: S2.pendingEvent.choices.map((c) => ({
          text: c.text,
          dc: c.dc,
          need: c.need || null
        }))
      };
    },
    getAvailableActions() {
      if (S2.pendingEvent)
        return {
          type: "event",
          choices: S2.pendingEvent.choices.map((c, i) => ({
            index: i,
            text: c.text,
            dc: c.dc
          }))
        };
      if (S2.pendingSettlement)
        return {
          type: "settlement",
          name: S2.pendingSettlement.name,
          actions: availableSettlementActions(S2.pendingSettlement.type)
        };
      return { type: "travel" };
    },
    isOver() {
      return S2.over;
    },
    hasWon() {
      return S2.won;
    },
    getScore() {
      return S2.score;
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
        mbValue: item.mbValue
      }));
    },
    setPreDepartureCount(itemName, newCount) {
      const item = cart.find((i) => i.name === itemName);
      if (!item) return false;
      const maxCount = item.count;
      const clamped = Math.max(0, Math.min(newCount, maxCount));
      item.count = clamped;
      S2.usedWeight = totalWeight(cart);
      recalcMB();
      return true;
    },
    confirmPreDeparture() {
      S2.preDeparture = false;
      S2.usedWeight = totalWeight(cart);
      recalcMB();
      return cart.map((i) => ({ name: i.name, count: i.count, wt: i.wt }));
    },
    getScoreData() {
      const tradeGoods = cart.filter((i) => i.type === "trade" && i.count > 0);
      return {
        score: S2.score,
        day: S2.day,
        wear: S2.wear,
        food: S2.food,
        crew: S2.crew,
        morale: S2.morale,
        won: S2.won,
        endReason: S2.endReason || "unknown",
        nodes: S2.node,
        tradesMade: S2.tradesMade,
        camps: S2.camps,
        eventsResolved: S2.eventsResolved,
        weather: S2.weather,
        cartItems: cart.reduce((s, i) => s + i.count, 0),
        tradeGoods: tradeGoods.reduce((s, i) => s + i.count, 0),
        mbValue: S2.mbValue,
        distance: S2.node,
        seed: S2.seed
      };
    },
    buyItem(name3, wt, category) {
      const existing = cart.find((i) => i.name === name3);
      if (existing) {
        existing.count++;
      } else {
        cart.push({ name: name3, wt, count: 1, category, type: category === "provisions" ? "food" : "item", mbValue: 0 });
      }
      recalcMB();
    },
    addFood(amount) {
      S2.food += amount;
    },
    clearTradeGoods() {
      for (let i = cart.length - 1; i >= 0; i--) {
        if (cart[i].type === "trade" || cart[i].category === "furs") {
          cart.splice(i, 1);
        }
      }
      recalcMB();
    }
  };
}
__name(createGame, "createGame");
function getSettlementPriceMultiplier(type, category) {
  const multipliers = {
    hbc: { buy: 1, sell: 1, categories: { furs: { buy: 1, sell: 1 }, provisions: { buy: 1, sell: 1 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    metis: { buy: 0.9, sell: 1.1, categories: { furs: { buy: 0.9, sell: 1.1 }, provisions: { buy: 0.95, sell: 1.05 }, repair: { buy: 1, sell: 1 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    nwmp: { buy: 1.2, sell: 0.8, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.2, sell: 0.8 }, repair: { buy: 1.2, sell: 0.8 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 0.8, sell: 1.2 } } },
    // ammo cheaper
    mission: { buy: 0.8, sell: 1.5, categories: { furs: { buy: 0.8, sell: 1.5 }, provisions: { buy: 0.7, sell: 1.3 }, repair: { buy: 1, sell: 1 }, medical: { buy: 0.8, sell: 1.2 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } },
    trading: { buy: 1.1, sell: 0.9, categories: { furs: { buy: 1.1, sell: 0.9 }, provisions: { buy: 1.1, sell: 0.9 }, repair: { buy: 1.1, sell: 0.9 }, medical: { buy: 1, sell: 1 }, shelter: { buy: 1, sell: 1 }, fuel: { buy: 1, sell: 1 }, tool: { buy: 1, sell: 1 }, hunting: { buy: 1, sell: 1 } } }
  };
  const m = multipliers[type] || multipliers.hbc;
  const cat = m.categories[category] || { buy: m.buy, sell: m.sell };
  return { buy: cat.buy, sell: cat.sell };
}
__name(getSettlementPriceMultiplier, "getSettlementPriceMultiplier");
function getSettlementActionsByType(type) {
  switch (type) {
    case "hbc":
      return [
        { id: "trade", label: "Trade Goods for \u20A5", cost: "1 trade good", risk: "Best rates for pelts/hides", flavor: "The Company factors weigh your furs in silence. The ledger decides your worth." },
        { id: "buy_supplies", label: "Buy Supplies", cost: "\u20A5 varies", risk: "Full inventory available", flavor: "Pemmican, axes, shaganappi, tools \u2014 everything a carter needs for the long trail." },
        { id: "rest", label: "Rest at the Fort", cost: "1 food", risk: "Crew rested, morale +15", flavor: "A warm fire in the mess hall, dry blankets, and a night without the wind." },
        { id: "get_intel", label: "Get Trail Intel", cost: "1 \u20A5", risk: "Reveals next 2 nodes", flavor: "The clerk unfolds a map stained with ink and tea. He marks the hazards ahead." }
      ];
    case "metis":
      return [
        { id: "trade_gossip", label: "Trade Gossip", cost: "Free", risk: "Reveals 1 gossip entry", flavor: "News travels faster than carts on the prairie. The women know everything." },
        { id: "recruit_crew", label: "Recruit Crew", cost: "2 \u20A5 + 1 food", risk: "+1 crew member (max 6)", flavor: "A young hand looking for work. Strong back, willing heart \u2014 if you can feed him." },
        { id: "dance", label: "Dance", cost: "1 food", risk: "Morale +10, no day advance", flavor: "The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow." },
        { id: "share_food", label: "Share Food", cost: "Give 2+ food", risk: "Morale +5 per food", flavor: "Generosity on the trail is its own currency. What you give returns in loyalty." },
        { id: "craft_hides", label: "Craft Finished Hides", cost: "3 raw hides + 1 shaganappi", risk: "Creates finished_hide (worth 2\xD7 \u20A5)", flavor: "The women scrape, stretch, and smoke the hides. Patience turns rawhide into profit." }
      ];
    case "nwmp":
      return [
        { id: "pay_fines", label: "Pay Fines", cost: "\u20A5 varies", risk: "Clears fines if any", flavor: "The sergeant reads your name from the ledger. The amount is not negotiable." },
        { id: "get_permits", label: "Get Permits", cost: "2 \u20A5", risk: "Required for river crossings", flavor: "A stamp, a signature, and the Queen's law lets you cross the water legal." },
        { id: "report_duty", label: "Report for Duty", cost: "1 day", risk: "\u20A5 reward, morale \u22125", flavor: "Red coats, drill, and the weight of Ottawa's authority. The pay is fair but the pride costs." },
        { id: "buy_ammo", label: "Buy Ammo", cost: "1.5 \u20A5 per Belt", risk: "Cheaper than HBC", flavor: "Ball and powder, measured honest. The Mounties don't cheat a carter on shot." },
        { id: "rest", label: "Rest", cost: "1 food", risk: "Crew rested (no morale bonus)", flavor: "A cot in the barracks. Clean, quiet, and the sentry paces all night." }
      ];
    case "mission":
      return [
        { id: "heal_crew", label: "Heal Crew", cost: "1 Medicine Pouch or 2 \u20A5", risk: "Clears injury/illness, morale +10", flavor: "The Grey Nuns tend the sick without asking who you are or where you come from." },
        { id: "rest", label: "Free Rest + Blessing", cost: "Free", risk: "Crew rested, morale +15", flavor: "A chapel bell at evening. You sleep on straw but wake with a lighter spirit." },
        { id: "get_blessing", label: "Get Blessing", cost: "1 food", risk: "Morale +10, next event DC \u22121", flavor: "The priest's hand on your brow. The trail feels less hostile after prayer." },
        { id: "trade_limited", label: "Trade (Limited)", cost: "Buy pemmican 0.5 \u20A5, sell blankets 1.5 \u20A5", risk: "Charity rates", flavor: "The mission garden feeds the body. The trade feeds the journey." }
      ];
    case "trading":
      return [
        { id: "trade", label: "Trade Goods", cost: "1 trade good", risk: "Standard rates", flavor: "A free trader with no Company badge. His prices are his own." },
        { id: "buy_supplies", label: "Buy Supplies", cost: "\u20A5 varies", risk: "Basic inventory", flavor: "What the Company posts run out of, the free traders sometimes have." },
        { id: "rest", label: "Rest", cost: "1 food", risk: "Crew rested, morale +10", flavor: "A lean-to by the fire. Simple shelter, honest company." },
        { id: "get_intel", label: "Get Trail Intel", cost: "1 \u20A5", risk: "Reveals next node", flavor: "He rides the trail weekly. His news is fresh and his memory long." }
      ];
    default:
      return [
        { id: "trade", label: "Trade Goods", cost: "1 trade good", risk: "Standard rates", flavor: "The factor weighs your furs. The ledger is final." },
        { id: "rest", label: "Rest", cost: "1 food", risk: "Crew rested, morale +10", flavor: "A night under roof and beam. The trail waits for morning." }
      ];
  }
}
__name(getSettlementActionsByType, "getSettlementActionsByType");
function executeSettlementAction(actionId, type, state, cart, params) {
  const credit = state.credit?.[type] || 0;
  if (actionId === "trade") {
    const tradeItems = cart.filter((i) => i.type === "trade" && i.count > 0);
    if (tradeItems.length === 0) return { error: "No trade goods to trade" };
    const item = tradeItems[0];
    item.count--;
    const mbGain = item.mbValue || 1;
    state.credit[type] = (state.credit[type] || 0) + mbGain;
    state.tradesMade++;
    return { traded: item.name, mbGain, credit: state.credit[type] };
  }
  if (actionId === "buy_supplies") {
    return { action: "buy_supplies", message: "Opens supply purchase interface", credit: state.credit[type] };
  }
  if (actionId === "rest") {
    if (state.food < 1) return { error: "Need 1 food to rest" };
    state.food -= 1;
    state.crew = "rested";
    state.travelDaysWithoutRest = 0;
    state.morale = Math.min(100, state.morale + (type === "hbc" ? 15 : type === "mission" ? 15 : 10));
    return { rested: true, moraleGain: type === "hbc" ? 15 : type === "mission" ? 15 : 10 };
  }
  if (actionId === "get_intel") {
    if ((state.credit[type] || 0) < 1) return { error: "Need 1 \u20A5 for intelligence" };
    state.credit[type] -= 1;
    const nextNode1 = NODES[state.node + 1];
    const nextNode2 = NODES[state.node + 2];
    state.trailIntel = state.trailIntel || [];
    if (nextNode1) {
      state.trailIntel.push({
        fromDay: state.day,
        text: `${nextNode1.name}: ${nextNode1.terrain.replace(/_/g, " ")} terrain. ${nextNode1.desc?.substring(0, 80)}...`,
        bonus: { dcBonus: 1 }
      });
    }
    if (nextNode2 && type === "hbc") {
      state.trailIntel.push({
        fromDay: state.day,
        text: `${nextNode2.name}: ${nextNode2.terrain.replace(/_/g, " ")} terrain.`,
        bonus: { dcBonus: 1 }
      });
    }
    state.morale = Math.min(100, state.morale + 5);
    return { intelGathered: true, moraleGain: 5, credit: state.credit[type] };
  }
  if (actionId === "trade_gossip") {
    state.trailIntel = state.trailIntel || [];
    const nextNode = NODES[state.node + 1];
    if (nextNode) {
      state.trailIntel.push({
        fromDay: state.day,
        text: `Gossip from ${state.pendingSettlement?.name}: ${nextNode.name} has ${nextNode.terrain.replace(/_/g, " ")} ahead.`,
        bonus: { dcBonus: 1 }
      });
    }
    state.morale = Math.min(100, state.morale + 3);
    return { gossipGathered: true, moraleGain: 3 };
  }
  if (actionId === "recruit_crew") {
    if ((state.credit[type] || 0) < 2) return { error: "Need 2 \u20A5 to recruit" };
    if (state.food < 1) return { error: "Need 1 food to recruit" };
    if ((state.crewCount || 3) >= 6) return { error: "Maximum crew (6) reached" };
    state.credit[type] -= 2;
    state.food -= 1;
    state.crewCount = (state.crewCount || 3) + 1;
    state.morale = Math.min(100, state.morale + 5);
    return { recruited: true, crewCount: state.crewCount, moraleGain: 5, credit: state.credit[type] };
  }
  if (actionId === "dance") {
    if (state.food < 1) return { error: "Need 1 food to dance" };
    state.food -= 1;
    state.morale = Math.min(100, state.morale + 10);
    return { danced: true, moraleGain: 10 };
  }
  if (actionId === "share_food") {
    const foodToGive = params.food || 2;
    if (state.food < foodToGive) return { error: `Need ${foodToGive} food to share` };
    state.food -= foodToGive;
    const moraleGain = foodToGive * 5;
    state.morale = Math.min(100, state.morale + moraleGain);
    state.reputation.metis = (state.reputation.metis || 0) + 1;
    return { shared: true, foodGiven: foodToGive, moraleGain, reputationGain: 1 };
  }
  if (actionId === "craft_hides") {
    const hides = cart.find((i) => ["Bison Hide", "Beaver Pelts", "Elk Hide", "Deer Hide"].includes(i.name));
    const shag = cart.find((i) => i.name === "Shaganappi");
    if (!hides || hides.count < 3) return { error: "Need 3 raw hides" };
    if (!shag || shag.count < 1) return { error: "Need 1 shaganappi" };
    hides.count -= 3;
    shag.count -= 1;
    const finished = cart.find((i) => i.name === "Finished Hides");
    if (finished) finished.count++;
    else cart.push({ name: "Finished Hides", wt: 3, count: 1, type: "trade", category: "furs", mbValue: 3.5, desc: "Expertly prepared hides. Worth double at market.", perishable: false });
    state.mbValue = cart.filter((i) => i.type === "trade" || i.category === "furs").reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
    return { crafted: "Finished Hides", mbValue: state.mbValue };
  }
  if (actionId === "pay_fines") {
    const fines = state.fines || 0;
    if (fines === 0) return { error: "No fines to pay" };
    if ((state.credit[type] || 0) < fines) return { error: `Need ${fines} \u20A5 to pay fines` };
    state.credit[type] -= fines;
    state.fines = 0;
    return { finesPaid: fines, credit: state.credit[type] };
  }
  if (actionId === "get_permits") {
    if ((state.credit[type] || 0) < 2) return { error: "Need 2 \u20A5 for permit" };
    state.credit[type] -= 2;
    state.hasPermit = true;
    return { permitObtained: true, credit: state.credit[type] };
  }
  if (actionId === "report_duty") {
    const reward = Math.round(state.node / NODES.length * 10) + 2;
    state.credit[type] = (state.credit[type] || 0) + reward;
    state.morale = Math.max(0, state.morale - 5);
    const nextDate = advanceDate(state.date.month, state.date.day, state.year);
    state.date = nextDate;
    state.month = nextDate.month;
    state.day++;
    state.segmentDay = 0;
    return { dutyDone: true, reward, moraleLoss: 5, credit: state.credit[type] };
  }
  if (actionId === "buy_ammo") {
    if ((state.credit[type] || 0) < 1.5) return { error: "Need 1.5 \u20A5 for ammunition" };
    state.credit[type] -= 1.5;
    const ammo = cart.find((i) => i.name === "Ammunition Belt");
    if (ammo) ammo.count++;
    else cart.push({ name: "Ammunition Belt", wt: 2, count: 1, type: "ammo", category: "hunting", mbValue: 0.9, desc: "Shot and ball. For hunting and defence.", perishable: false });
    return { bought: "Ammunition Belt", credit: state.credit[type] };
  }
  if (actionId === "heal_crew") {
    const med = cart.find((i) => i.name === "Medicine Pouch");
    if ((state.credit[type] || 0) >= 2) {
      state.credit[type] -= 2;
    } else if (med && med.count > 0) {
      med.count--;
    } else {
      return { error: "Need 2 \u20A5 or 1 Medicine Pouch" };
    }
    state.crew = "rested";
    state.morale = Math.min(100, state.morale + 10);
    state.flags.injured = false;
    state.flags.ill = false;
    return { healed: true, moraleGain: 10, credit: state.credit[type] };
  }
  if (actionId === "get_blessing") {
    if (state.food < 1) return { error: "Need 1 food for blessing" };
    state.food -= 1;
    state.morale = Math.min(100, state.morale + 10);
    state.flags.blessed = true;
    return { blessed: true, moraleGain: 10 };
  }
  if (actionId === "trade_limited") {
    return { action: "trade_limited", message: "Limited trade available: buy pemmican (0.5 \u20A5), sell blankets (1.5 \u20A5)", credit: state.credit[type] };
  }
  if (actionId === "buy_food") {
    const cost = 0.5;
    if ((state.credit[type] || 0) < cost) return { error: "Need 0.5 \u20A5 credit" };
    state.credit[type] -= cost;
    state.food += 2;
    return { bought: "food", amount: 2, credit: state.credit[type] };
  }
  if (actionId === "buy_repair") {
    const cost = 2;
    if ((state.credit[type] || 0) < cost) return { error: "Need 2 \u20A5 credit" };
    if (state.wear <= 0) return { error: "Cart does not need repair" };
    state.credit[type] -= cost;
    state.wear = Math.max(0, state.wear - 2);
    return { repaired: true, wearReduced: 2, credit: state.credit[type] };
  }
  if (actionId === "buy_heal") {
    const cost = 1;
    if ((state.credit[type] || 0) < cost) return { error: "Need 1 \u20A5 credit" };
    state.credit[type] -= cost;
    state.morale = Math.min(100, state.morale + 20);
    state.crew = "rested";
    return { healed: true, moraleGain: 20, credit: state.credit[type] };
  }
  if (actionId === "buy_info") {
    const cost = 0.5;
    if ((state.credit[type] || 0) < cost) return { error: "Need 0.5 \u20A5 credit" };
    state.credit[type] -= cost;
    state.morale = Math.min(100, state.morale + 5);
    state.flags["trail_intel_" + state.node] = true;
    return { intel: true, moraleGain: 5, credit: state.credit[type] };
  }
  if (actionId === "repair") {
    const shag = cart.find((i) => i.name === "Shaganappi");
    if (state.wear > 0 && shag && shag.count > 0) {
      shag.count--;
      state.wear = Math.max(0, state.wear - 2);
      state.mbValue = cart.filter((i) => i.type === "trade" || i.category === "furs").reduce((s, i) => s + (i.mbValue || 0) * i.count, 0);
    } else if (state.wear > 0) {
      state.wear = Math.max(0, state.wear - 2);
    }
    return { repaired: true };
  }
  if (actionId === "heal") {
    state.crew = "rested";
    state.morale = Math.min(100, state.morale + 20);
    return { healed: true };
  }
  if (actionId === "continue") {
    state.pendingSettlement = null;
    return { continued: true };
  }
  return { error: `Unknown action: ${actionId}` };
}
__name(executeSettlementAction, "executeSettlementAction");
function availableSettlementActions(type) {
  const base = ["rest", "trade", "buy_food"];
  if (type === "hbc") return [...base, "buy_repair", "craft", "buy_info"];
  if (type === "metis") return [...base, "craft", "buy_info"];
  if (type === "trading") return [...base, "buy_repair", "buy_info"];
  if (type === "mission") return [...base, "buy_heal", "buy_info"];
  if (type === "nwmp") return [...base, "craft", "buy_info"];
  return base;
}
__name(availableSettlementActions, "availableSettlementActions");
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
  root.style.setProperty("--clr-bg", "#0d2b0d");
  root.style.setProperty("--clr-panel-bg", "#f5e6c8");
  root.style.setProperty("--clr-journal-bg", "#f5e6c8");
  root.style.setProperty("--clr-ink-on-dark", "#e8d5a8");
  root.style.setProperty("--clr-ink-on-light", "#1a3a1a");
  root.style.setProperty("--clr-ink-light", "#c4b080");
  root.style.setProperty("--clr-ink-dark", "#2c1a0a");
  root.style.setProperty("--clr-accent", "#d4a820");
  root.style.setProperty("--clr-success", "#5a9a4a");
  root.style.setProperty("--clr-danger", "#b83030");
  root.style.setProperty("--clr-ink", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-ink-panel", "var(--clr-ink-on-light)");
  root.style.setProperty("--clr-bg-dark", "#0a1f0a");
  root.style.setProperty("--clr-card-bg", "var(--clr-panel-bg)");
  root.style.setProperty("--clr-btn-bg", "var(--clr-accent)");
  root.style.setProperty("--clr-btn-text", "#0d2b0d");
  root.style.setProperty("--clr-btn-hover", "#e0b830");
  root.style.setProperty("--clr-status-bar-bg", "var(--clr-bg)");
  root.style.setProperty("--clr-status-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-status-accent", "var(--clr-accent)");
  root.style.setProperty("--clr-overlay-bg", "rgba(10,25,10,0.92)");
  root.style.setProperty("--clr-border", "var(--clr-accent)");
  root.style.setProperty("--clr-map-bg", "#0d2b0d");
  root.style.setProperty("--clr-tooltip-bg", "rgba(10,25,10,0.92)");
  root.style.setProperty("--clr-tooltip-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-tooltip-border", "var(--clr-accent)");
  root.style.setProperty("--clr-map-frame-shadow", "rgba(0,0,0,0.4)");
  root.style.setProperty("--clr-narrative-text", "var(--clr-ink-on-dark)");
  root.style.setProperty("--clr-ruled-line", "rgba(212,168,32,0.12)");
  root.style.setProperty("--clr-ledger-border", "rgba(212,168,32,0.15)");
  root.style.setProperty("--clr-ledger-margin", "var(--clr-accent)");
  root.style.setProperty("--clr-paper-texture", "none");
  root.style.setProperty("--clr-event-border", "var(--clr-accent)");
  root.style.setProperty("--clr-event-accent-bar", "var(--clr-accent)");
  root.style.setProperty("--clr-settlement-hbc", "#c84040");
  root.style.setProperty("--clr-settlement-metis", "#4a8cc8");
  root.style.setProperty("--clr-settlement-nwmp", "#3a9a5a");
  root.style.setProperty("--clr-settlement-mission", "#c8a030");
  root.style.setProperty("--clr-settlement-trading", "#c8a030");
  root.style.setProperty("--clr-food-low", "var(--clr-danger)");
  root.style.setProperty("--clr-warn", "#e0b830");
  root.style.setProperty("--clr-ok", "var(--clr-success)");
  root.style.setProperty("--clr-weather-rain", "#7ab0d0");
  root.style.setProperty("--clr-weather-snow", "#d0dce8");
  root.style.setProperty("--clr-over-bg", "rgba(184,48,48,0.12)");
  root.style.setProperty("--clr-over-border", "#c84040");
  root.style.setProperty("--clr-over-text", "#e06060");
  root.style.setProperty("--clr-warn-bg", "rgba(224,184,48,0.12)");
  root.style.setProperty("--clr-warn-border", "#e0b830");
  root.style.setProperty("--clr-gold", "#e0b830");
  root.style.setProperty("--clr-ok-bg", "rgba(90,154,74,0.12)");
  root.style.setProperty("--clr-ok-border", "#5a9a4a");
  root.style.setProperty("--clr-ok-text", "#5a9a4a");
  root.style.setProperty("--clr-catitem-bg", "rgba(212,168,32,0.06)");
  root.style.setProperty("--clr-catitem-border", "rgba(212,168,32,0.15)");
  root.style.setProperty("--clr-muted", "#6b5740");
  root.style.setProperty("--clr-pdrow-bg", "rgba(212,168,32,0.04)");
  root.style.setProperty("--clr-pdrow-border", "rgba(212,168,32,0.1)");
  root.style.setProperty("--clr-camp-border", "var(--clr-accent)");
  root.style.setProperty("--clr-camp-pill-bg", "rgba(212,168,32,0.08)");
  root.style.setProperty("--clr-camp-pill-border", "rgba(212,168,32,0.2)");
  root.style.setProperty("--clr-camp-btn-hover", "#1a3a1a");
  root.style.setProperty("--clr-campfire-glow", "radial-gradient(ellipse at 50% 100%, rgba(190,130,20,0.35) 0%, rgba(200,168,26,0.22) 35%, transparent 70%)");
  root.style.setProperty("--clr-campfire-embers", `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.08'/%3E%3C/svg%3E")`);
  root.style.setProperty("--clr-campfire-flicker", "radial-gradient(circle at 45% 75%, rgba(255,140,40,0.15) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.12) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.1) 0%, transparent 30%)");
  root.style.setProperty("--clr-success-glow", "rgba(90,154,74,0.3)");
  root.style.setProperty("--clr-danger-glow", "rgba(184,48,48,0.3)");
  root.style.setProperty("--clr-choice-cost", "#7a6a50");
  root.style.setProperty("--clr-source-text", "#5a4a35");
  root.style.setProperty("--clr-source-context", "#6b5740");
  root.style.setProperty("--clr-placeholder", "#5a4a35");
  root.style.setProperty("--clr-input-bg", "rgba(255,245,230,0.08)");
  root.style.setProperty("--clr-input-bg-focus", "rgba(255,245,230,0.12)");
  root.style.setProperty("--clr-silver", "#b0b0b0");
  root.style.setProperty("--clr-bronze", "#c89050");
  root.style.setProperty("--clr-gold-faint", "rgba(212,168,32,0.08)");
  root.style.setProperty("--clr-gold-light", "rgba(212,168,32,0.15)");
  root.style.setProperty("--clr-intel-border", "rgba(212,168,32,0.12)");
  root.style.setProperty("--font-heading", "'Playfair Display', 'Georgia', serif");
  root.style.setProperty("--font-body", "'Crimson Text', 'Georgia', serif");
}
__name(applyTheme, "applyTheme");

// src/ui/shell.js
function mount() {
  const gameRoot = document.getElementById("game-root");
  if (!gameRoot) throw new Error("#game-root missing");
  applyTheme(gameRoot);
  return gameRoot;
}
__name(mount, "mount");
function find(selector) {
  return document.querySelector(selector);
}
__name(find, "find");

// art/cart_marker.png
var cart_marker_default = "./cart_marker-CQL7K2BU.png";

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
  applyTheme(el);
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
  if (dayEl) dayEl.textContent = String(state.day);
  if (monthEl) monthEl.textContent = monthName(state.month);
  if (seasonEl) seasonEl.textContent = state.season;
  if (segEl) {
    if (state.pendingSettlement) {
      segEl.textContent = `At: ${node?.name || "camp"}`;
    } else if (next) {
      segEl.textContent = `Next: ${next.name} (${next.dist} day segment)`;
    } else {
      segEl.textContent = node?.name || "Arrived";
    }
  }
  const crewState = window._metisGame?.getCrew?.()?.state || "";
  let crewCls = "stat-value";
  if (crewState === "tired") crewCls += " crew-tired";
  else if (crewState === "exhausted") crewCls += " crew-exhausted";
  else if (crewState === "rested") crewCls += " crew-rested";
  crewEl.textContent = String(state.crew);
  crewEl.className = crewCls;
  foodEl.textContent = String(Math.floor(state.food));
  foodEl.className = "stat-value" + (state.food <= 5 ? " food-low" : "");
  wearEl.textContent = String(state.wear);
  wearEl.className = "stat-value" + (state.wear >= 4 ? " wear-high" : "");
  const weatherEl = document.getElementById("s-weather");
  if (weatherEl) {
    const w = state.weather || "clear";
    weatherEl.textContent = CONSTANTS.WEATHER_LABELS[w] || "Clear";
    weatherEl.className = "stat-value weather-" + w;
  }
  const mbEl = document.getElementById("s-mb");
  if (mbEl) {
    const mb = Math.round(state.mbValue || 0);
    mbEl.textContent = `${mb} \u20A5`;
    mbEl.className = "stat-value" + (mb < CONSTANTS.MB_WIN_THRESHOLD ? " mb-low" : " mb-ok");
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
  const html = `
    <div class="journal-entry ${collapsed}" data-day="${day}">
      <div class="journal-header">${title}${date ? " \u2014 " + date : ""}</div>
      <div class="journal-text">${text}</div>
      ${diceHtml}
      ${mech ? `<div class="journal-mechanical">${mech}</div>` : ""}
    </div>`;
  journal.insertAdjacentHTML("beforeend", html);
  journal.scrollTop = journal.scrollHeight;
}
__name(journalLog, "journalLog");

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

// src/data/endings.js
var ENDINGS = {
  victory: {
    id: "victory",
    title: "Fort Edmonton at Last!",
    narrative: {
      high: "The palisade walls at Edmonton. Your cart made it \u2014 axle held, wheels still on. The crew's behind you, hollow-eyed but standing. You've still got MB credit to your name. The Company men will pay well.",
      humble: "You reach Fort Edmonton with nothing left to give but your word. The cart groans as you roll through the gate \u2014 held together by rope and stubbornness. The crew is hollow-eyed but standing. Your MB credit is thin, but you arrived. Against the prairie, the weather, and every broken trail between Garry and Edmonton, you arrived."
    },
    quote: getSource("FORT_EDMONTON"),
    quoteHigh: getSource("SAWYER_TRIAL"),
    tip: "Tip: Trade goods for MB credit at settlements, then spend MB on food and repairs. Keep your total MB value above 8 when you reach Edmonton. Repair wear early \u2014 letting the cart degrade costs points fast."
  },
  no_trade: {
    id: "no_trade",
    title: "Empty-Handed at Edmonton",
    narrative: {
      high: "You reach Fort Edmonton, but your MB credit is gone. Every fur and hide was traded along the way to survive \u2014 food, repairs, medicine. You made the journey, but the Company men at the post look at your bare cart and empty ledger and shake their heads. A trip without profit is just a long walk.",
      humble: "The gates of Fort Edmonton are open before you, but there is nothing to show for the journey. No furs, no hides, no MB credit to your name. You spent everything to keep the crew alive through the hardest stretches. You survived \u2014 but the ledger will not remember this trip."
    },
    quote: getSource("HBC_JOURNAL"),
    tip: "Tip: Trade goods for MB credit at settlements, then spend MB on food and repairs. Keep your total MB value above 8 when you reach Edmonton. Balance survival with profit \u2014 forage and hunt to supplement food instead of trading away all your cargo."
  },
  starvation: {
    id: "starvation",
    title: "Gone to Hunger",
    narrative: {
      high: "Food's gone. Three days of foraging turned up nothing but bitter roots. The oxen can't pull anymore. You make camp and wait. The nearest post is days away on foot, and you're not walking.",
      humble: "You count the last of the pemmican and divide it into portions too small to matter. Three days later, there is nothing. The crew sits by the cart, too weak to walk. The prairie stretches in every direction, indifferent to your hunger. The trail has claimed another party."
    },
    quote: getSource("PEMMICAN_FAMINE"),
    tip: "Tip: Food is your most critical resource. Trade for it at every settlement. Forage when the crew is rested. Never let your food drop below 5 \u2014 the trail between settlements is longer than you think."
  },
  cart_failure: {
    id: "cart_failure",
    title: "Axle Broken, Journey Over",
    narrative: {
      high: "The axle splinters with a crack that echoes across the prairie. The cart lurches and the load shifts \u2014 irreparable damage. Without a spare axle and proper tools, you cannot continue. The nearest post is days away on foot. The journey ends here, stranded on the open trail with a broken cart and fading hope.",
      humble: "You knew the cart was failing. The squeal grew louder each day, the wheels wobbled, the frame groaned. But you pushed on, hoping to reach the next settlement. The axle finally gives out on open prairie, miles from anywhere. The cart will not roll again."
    },
    quote: getSource("BREHAUT_CART"),
    tip: "Tip: Repair wear at every settlement. Use shaganappi to reduce wear before it reaches critical levels. If your cart squeals, stop and fix it \u2014 ignoring wear is the fastest way to end up stranded. A spare axle weighs 15 kg but could save your journey."
  },
  winter: {
    id: "winter",
    title: "Caught by Winter",
    narrative: {
      high: "First snow. Soft enough, but you know what it means. The trail will be gone by morning \u2014 snow-filled ruts, white ground, no way to follow the track. Edmonton's still four days west. The cold goes right through the cart boards. You're done.",
      humble: "October winds carry the first frost, and the sky turns the color of old iron. Winter is coming, and you are still on the open prairie between posts. The trail ahead will soon be buried. You make camp for the last time, knowing the journey ends here."
    },
    quote: getSource("WINTER_TRAIL"),
    tip: "Tip: Speed matters. Every day on the trail brings winter closer. Don't linger too long at settlements \u2014 rest and repair quickly, then move. The trail from Fort Garry to Fort Edmonton takes roughly 35-50 days. Leave early and keep moving."
  },
  abandoned: {
    id: "abandoned",
    title: "The Crew Has Had Enough",
    narrative: {
      high: "The crew stops at the rise. Won't go further. Three broken wheels in two weeks. Six nights without enough food. One of them sits down in the grass and stares. The others follow. You can't force them. The trail goes on. They don't.",
      humble: "One morning, the crew simply will not rise. They sit by the dead fire and stare at the horizon. No amount of encouragement can move them. The journey has ground them down to nothing. You are alone on the Carlton Trail with a cart full of goods and no one willing to pull it."
    },
    quote: getSource("MORALE"),
    tip: "Tip: Keep your crew's morale up. Make camp to rest when tired. Share meals at settlements. Don't push through exhaustion \u2014 a rested crew travels faster and survives longer. Morale is invisible until it's gone."
  }
};

// node_modules/@firebase/util/dist/postinstall.mjs
var getDefaultsFromPostinstall = /* @__PURE__ */ __name(() => void 0, "getDefaultsFromPostinstall");

// node_modules/@firebase/util/dist/index.esm.js
var stringToByteArray$1 = /* @__PURE__ */ __name(function(str) {
  const out = [];
  let p = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = c >> 6 | 192;
      out[p++] = c & 63 | 128;
    } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
      c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
      out[p++] = c >> 18 | 240;
      out[p++] = c >> 12 & 63 | 128;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    } else {
      out[p++] = c >> 12 | 224;
      out[p++] = c >> 6 & 63 | 128;
      out[p++] = c & 63 | 128;
    }
  }
  return out;
}, "stringToByteArray$1");
var byteArrayToString = /* @__PURE__ */ __name(function(bytes) {
  const out = [];
  let pos = 0, c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      const c4 = bytes[pos++];
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
      out[c++] = String.fromCharCode(55296 + (u >> 10));
      out[c++] = String.fromCharCode(56320 + (u & 1023));
    } else {
      const c2 = bytes[pos++];
      const c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
}, "byteArrayToString");
var base64 = {
  /**
   * Maps bytes to characters.
   */
  byteToCharMap_: null,
  /**
   * Maps characters to bytes.
   */
  charToByteMap_: null,
  /**
   * Maps bytes to websafe characters.
   * @private
   */
  byteToCharMapWebSafe_: null,
  /**
   * Maps websafe characters to bytes.
   * @private
   */
  charToByteMapWebSafe_: null,
  /**
   * Our default alphabet, shared between
   * ENCODED_VALS and ENCODED_VALS_WEBSAFE
   */
  ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  /**
   * Our default alphabet. Value 64 (=) is special; it means "nothing."
   */
  get ENCODED_VALS() {
    return this.ENCODED_VALS_BASE + "+/=";
  },
  /**
   * Our websafe alphabet.
   */
  get ENCODED_VALS_WEBSAFE() {
    return this.ENCODED_VALS_BASE + "-_.";
  },
  /**
   * Whether this browser supports the atob and btoa functions. This extension
   * started at Mozilla but is now implemented by many browsers. We use the
   * ASSUME_* variables to avoid pulling in the full useragent detection library
   * but still allowing the standard per-browser compilations.
   *
   */
  HAS_NATIVE_SUPPORT: typeof atob === "function",
  /**
   * Base64-encode an array of bytes.
   *
   * @param input An array of bytes (numbers with
   *     value in [0, 255]) to encode.
   * @param webSafe Boolean indicating we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeByteArray(input, webSafe) {
    if (!Array.isArray(input)) {
      throw Error("encodeByteArray takes an array as a parameter");
    }
    this.init_();
    const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
    const output = [];
    for (let i = 0; i < input.length; i += 3) {
      const byte1 = input[i];
      const haveByte2 = i + 1 < input.length;
      const byte2 = haveByte2 ? input[i + 1] : 0;
      const haveByte3 = i + 2 < input.length;
      const byte3 = haveByte3 ? input[i + 2] : 0;
      const outByte1 = byte1 >> 2;
      const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
      let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
      let outByte4 = byte3 & 63;
      if (!haveByte3) {
        outByte4 = 64;
        if (!haveByte2) {
          outByte3 = 64;
        }
      }
      output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
    }
    return output.join("");
  },
  /**
   * Base64-encode a string.
   *
   * @param input A string to encode.
   * @param webSafe If true, we should use the
   *     alternative alphabet.
   * @return The base64 encoded string.
   */
  encodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return btoa(input);
    }
    return this.encodeByteArray(stringToByteArray$1(input), webSafe);
  },
  /**
   * Base64-decode a string.
   *
   * @param input to decode.
   * @param webSafe True if we should use the
   *     alternative alphabet.
   * @return string representing the decoded value.
   */
  decodeString(input, webSafe) {
    if (this.HAS_NATIVE_SUPPORT && !webSafe) {
      return atob(input);
    }
    return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
  },
  /**
   * Base64-decode a string.
   *
   * In base-64 decoding, groups of four characters are converted into three
   * bytes.  If the encoder did not apply padding, the input length may not
   * be a multiple of 4.
   *
   * In this case, the last group will have fewer than 4 characters, and
   * padding will be inferred.  If the group has one or two characters, it decodes
   * to one byte.  If the group has three characters, it decodes to two bytes.
   *
   * @param input Input to decode.
   * @param webSafe True if we should use the web-safe alphabet.
   * @return bytes representing the decoded value.
   */
  decodeStringToByteArray(input, webSafe) {
    this.init_();
    const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
    const output = [];
    for (let i = 0; i < input.length; ) {
      const byte1 = charToByteMap[input.charAt(i++)];
      const haveByte2 = i < input.length;
      const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
      ++i;
      const haveByte3 = i < input.length;
      const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      const haveByte4 = i < input.length;
      const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
      ++i;
      if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
        throw new DecodeBase64StringError();
      }
      const outByte1 = byte1 << 2 | byte2 >> 4;
      output.push(outByte1);
      if (byte3 !== 64) {
        const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
        output.push(outByte2);
        if (byte4 !== 64) {
          const outByte3 = byte3 << 6 & 192 | byte4;
          output.push(outByte3);
        }
      }
    }
    return output;
  },
  /**
   * Lazy static initialization function. Called before
   * accessing any of the static map variables.
   * @private
   */
  init_() {
    if (!this.byteToCharMap_) {
      this.byteToCharMap_ = {};
      this.charToByteMap_ = {};
      this.byteToCharMapWebSafe_ = {};
      this.charToByteMapWebSafe_ = {};
      for (let i = 0; i < this.ENCODED_VALS.length; i++) {
        this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
        this.charToByteMap_[this.byteToCharMap_[i]] = i;
        this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
        this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
        if (i >= this.ENCODED_VALS_BASE.length) {
          this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
          this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
        }
      }
    }
  }
};
var _DecodeBase64StringError = class _DecodeBase64StringError extends Error {
  constructor() {
    super(...arguments);
    this.name = "DecodeBase64StringError";
  }
};
__name(_DecodeBase64StringError, "DecodeBase64StringError");
var DecodeBase64StringError = _DecodeBase64StringError;
var base64Encode = /* @__PURE__ */ __name(function(str) {
  const utf8Bytes = stringToByteArray$1(str);
  return base64.encodeByteArray(utf8Bytes, true);
}, "base64Encode");
var base64urlEncodeWithoutPadding = /* @__PURE__ */ __name(function(str) {
  return base64Encode(str).replace(/\./g, "");
}, "base64urlEncodeWithoutPadding");
var base64Decode = /* @__PURE__ */ __name(function(str) {
  try {
    return base64.decodeString(str, true);
  } catch (e) {
    console.error("base64Decode failed: ", e);
  }
  return null;
}, "base64Decode");
function getGlobal() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("Unable to locate global object.");
}
__name(getGlobal, "getGlobal");
var getDefaultsFromGlobal = /* @__PURE__ */ __name(() => getGlobal().__FIREBASE_DEFAULTS__, "getDefaultsFromGlobal");
var getDefaultsFromEnvVariable = /* @__PURE__ */ __name(() => {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return;
  }
  const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
  if (defaultsJsonString) {
    return JSON.parse(defaultsJsonString);
  }
}, "getDefaultsFromEnvVariable");
var getDefaultsFromCookie = /* @__PURE__ */ __name(() => {
  if (typeof document === "undefined") {
    return;
  }
  let match;
  try {
    match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
  } catch (e) {
    return;
  }
  const decoded = match && base64Decode(match[1]);
  return decoded && JSON.parse(decoded);
}, "getDefaultsFromCookie");
var getDefaults = /* @__PURE__ */ __name(() => {
  try {
    return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
  } catch (e) {
    console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
    return;
  }
}, "getDefaults");
var getDefaultEmulatorHost = /* @__PURE__ */ __name((productName) => getDefaults()?.emulatorHosts?.[productName], "getDefaultEmulatorHost");
var getDefaultEmulatorHostnameAndPort = /* @__PURE__ */ __name((productName) => {
  const host = getDefaultEmulatorHost(productName);
  if (!host) {
    return void 0;
  }
  const separatorIndex = host.lastIndexOf(":");
  if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
    throw new Error(`Invalid host ${host} with no separate hostname and port!`);
  }
  const port = parseInt(host.substring(separatorIndex + 1), 10);
  if (host[0] === "[") {
    return [host.substring(1, separatorIndex - 1), port];
  } else {
    return [host.substring(0, separatorIndex), port];
  }
}, "getDefaultEmulatorHostnameAndPort");
var getDefaultAppConfig = /* @__PURE__ */ __name(() => getDefaults()?.config, "getDefaultAppConfig");
var _Deferred = class _Deferred {
  constructor() {
    this.reject = () => {
    };
    this.resolve = () => {
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  /**
   * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
   * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
   * and returns a node-style callback which will resolve or reject the Deferred's promise.
   */
  wrapCallback(callback) {
    return (error, value) => {
      if (error) {
        this.reject(error);
      } else {
        this.resolve(value);
      }
      if (typeof callback === "function") {
        this.promise.catch(() => {
        });
        if (callback.length === 1) {
          callback(error);
        } else {
          callback(error, value);
        }
      }
    };
  }
};
__name(_Deferred, "Deferred");
var Deferred = _Deferred;
function createMockUserToken(token, projectId) {
  if (token.uid) {
    throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
  }
  const header = {
    alg: "none",
    type: "JWT"
  };
  const project = projectId || "demo-project";
  const iat = token.iat || 0;
  const sub = token.sub || token.user_id;
  if (!sub) {
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
  }
  const payload = {
    // Set all required fields to decent defaults
    iss: `https://securetoken.google.com/${project}`,
    aud: project,
    iat,
    exp: iat + 3600,
    auth_time: iat,
    sub,
    user_id: sub,
    firebase: {
      sign_in_provider: "custom",
      identities: {}
    },
    // Override with user options
    ...token
  };
  const signature = "";
  return [
    base64urlEncodeWithoutPadding(JSON.stringify(header)),
    base64urlEncodeWithoutPadding(JSON.stringify(payload)),
    signature
  ].join(".");
}
__name(createMockUserToken, "createMockUserToken");
function getUA() {
  if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
    return navigator["userAgent"];
  } else {
    return "";
  }
}
__name(getUA, "getUA");
function isNode() {
  const forceEnvironment = getDefaults()?.forceEnvironment;
  if (forceEnvironment === "node") {
    return true;
  } else if (forceEnvironment === "browser") {
    return false;
  }
  try {
    return Object.prototype.toString.call(global.process) === "[object process]";
  } catch (e) {
    return false;
  }
}
__name(isNode, "isNode");
function isSafari() {
  return !isNode() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
}
__name(isSafari, "isSafari");
function isIndexedDBAvailable() {
  try {
    return typeof indexedDB === "object";
  } catch (e) {
    return false;
  }
}
__name(isIndexedDBAvailable, "isIndexedDBAvailable");
function validateIndexedDBOpenable() {
  return new Promise((resolve, reject) => {
    try {
      let preExist = true;
      const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
      const request = self.indexedDB.open(DB_CHECK_NAME);
      request.onsuccess = () => {
        request.result.close();
        if (!preExist) {
          self.indexedDB.deleteDatabase(DB_CHECK_NAME);
        }
        resolve(true);
      };
      request.onupgradeneeded = () => {
        preExist = false;
      };
      request.onerror = () => {
        reject(request.error?.message || "");
      };
    } catch (error) {
      reject(error);
    }
  });
}
__name(validateIndexedDBOpenable, "validateIndexedDBOpenable");
var ERROR_NAME = "FirebaseError";
var _FirebaseError = class _FirebaseError extends Error {
  constructor(code, message, customData) {
    super(message);
    this.code = code;
    this.customData = customData;
    this.name = ERROR_NAME;
    Object.setPrototypeOf(this, _FirebaseError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorFactory.prototype.create);
    }
  }
};
__name(_FirebaseError, "FirebaseError");
var FirebaseError = _FirebaseError;
var _ErrorFactory = class _ErrorFactory {
  constructor(service, serviceName, errors) {
    this.service = service;
    this.serviceName = serviceName;
    this.errors = errors;
  }
  create(code, ...data) {
    const customData = data[0] || {};
    const fullCode = `${this.service}/${code}`;
    const template = this.errors[code];
    const message = template ? replaceTemplate(template, customData) : "Error";
    const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
    const error = new FirebaseError(fullCode, fullMessage, customData);
    return error;
  }
};
__name(_ErrorFactory, "ErrorFactory");
var ErrorFactory = _ErrorFactory;
function replaceTemplate(template, data) {
  return template.replace(PATTERN, (_, key) => {
    const value = data[key];
    return value != null ? String(value) : `<${key}?>`;
  });
}
__name(replaceTemplate, "replaceTemplate");
var PATTERN = /\{\$([^}]+)}/g;
function deepEqual(a, b2) {
  if (a === b2) {
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b2);
  for (const k of aKeys) {
    if (!bKeys.includes(k)) {
      return false;
    }
    const aProp = a[k];
    const bProp = b2[k];
    if (isObject(aProp) && isObject(bProp)) {
      if (!deepEqual(aProp, bProp)) {
        return false;
      }
    } else if (aProp !== bProp) {
      return false;
    }
  }
  for (const k of bKeys) {
    if (!aKeys.includes(k)) {
      return false;
    }
  }
  return true;
}
__name(deepEqual, "deepEqual");
function isObject(thing) {
  return thing !== null && typeof thing === "object";
}
__name(isObject, "isObject");
var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
function getModularInstance(service) {
  if (service && service._delegate) {
    return service._delegate;
  } else {
    return service;
  }
}
__name(getModularInstance, "getModularInstance");
function isCloudWorkstation(url) {
  try {
    const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
    return host.endsWith(".cloudworkstations.dev");
  } catch {
    return false;
  }
}
__name(isCloudWorkstation, "isCloudWorkstation");
async function pingServer(endpoint) {
  const result = await fetch(endpoint, {
    credentials: "include"
  });
  return result.ok;
}
__name(pingServer, "pingServer");

// node_modules/@firebase/component/dist/esm/index.esm.js
var _Component = class _Component {
  /**
   *
   * @param name The public service name, e.g. app, auth, firestore, database
   * @param instanceFactory Service factory responsible for creating the public interface
   * @param type whether the service provided by the component is public or private
   */
  constructor(name3, instanceFactory, type) {
    this.name = name3;
    this.instanceFactory = instanceFactory;
    this.type = type;
    this.multipleInstances = false;
    this.serviceProps = {};
    this.instantiationMode = "LAZY";
    this.onInstanceCreated = null;
  }
  setInstantiationMode(mode) {
    this.instantiationMode = mode;
    return this;
  }
  setMultipleInstances(multipleInstances) {
    this.multipleInstances = multipleInstances;
    return this;
  }
  setServiceProps(props) {
    this.serviceProps = props;
    return this;
  }
  setInstanceCreatedCallback(callback) {
    this.onInstanceCreated = callback;
    return this;
  }
};
__name(_Component, "Component");
var Component = _Component;
var DEFAULT_ENTRY_NAME = "[DEFAULT]";
var _Provider = class _Provider {
  constructor(name3, container) {
    this.name = name3;
    this.container = container;
    this.component = null;
    this.instances = /* @__PURE__ */ new Map();
    this.instancesDeferred = /* @__PURE__ */ new Map();
    this.instancesOptions = /* @__PURE__ */ new Map();
    this.onInitCallbacks = /* @__PURE__ */ new Map();
  }
  /**
   * @param identifier A provider can provide multiple instances of a service
   * if this.component.multipleInstances is true.
   */
  get(identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    if (!this.instancesDeferred.has(normalizedIdentifier)) {
      const deferred = new Deferred();
      this.instancesDeferred.set(normalizedIdentifier, deferred);
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          if (instance) {
            deferred.resolve(instance);
          }
        } catch (e) {
        }
      }
    }
    return this.instancesDeferred.get(normalizedIdentifier).promise;
  }
  getImmediate(options) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
    const optional = options?.optional ?? false;
    if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
      try {
        return this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
      } catch (e) {
        if (optional) {
          return null;
        } else {
          throw e;
        }
      }
    } else {
      if (optional) {
        return null;
      } else {
        throw Error(`Service ${this.name} is not available`);
      }
    }
  }
  getComponent() {
    return this.component;
  }
  setComponent(component) {
    if (component.name !== this.name) {
      throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
    }
    if (this.component) {
      throw Error(`Component for ${this.name} has already been provided`);
    }
    this.component = component;
    if (!this.shouldAutoInitialize()) {
      return;
    }
    if (isComponentEager(component)) {
      try {
        this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
      } catch (e) {
      }
    }
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      try {
        const instance = this.getOrInitializeService({
          instanceIdentifier: normalizedIdentifier
        });
        instanceDeferred.resolve(instance);
      } catch (e) {
      }
    }
  }
  clearInstance(identifier = DEFAULT_ENTRY_NAME) {
    this.instancesDeferred.delete(identifier);
    this.instancesOptions.delete(identifier);
    this.instances.delete(identifier);
  }
  // app.delete() will call this method on every provider to delete the services
  // TODO: should we mark the provider as deleted?
  async delete() {
    const services = Array.from(this.instances.values());
    await Promise.all([
      ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
      ...services.filter((service) => "_delete" in service).map((service) => service._delete())
    ]);
  }
  isComponentSet() {
    return this.component != null;
  }
  isInitialized(identifier = DEFAULT_ENTRY_NAME) {
    return this.instances.has(identifier);
  }
  getOptions(identifier = DEFAULT_ENTRY_NAME) {
    return this.instancesOptions.get(identifier) || {};
  }
  initialize(opts = {}) {
    const { options = {} } = opts;
    const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
    if (this.isInitialized(normalizedIdentifier)) {
      throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
    }
    if (!this.isComponentSet()) {
      throw Error(`Component ${this.name} has not been registered yet`);
    }
    const instance = this.getOrInitializeService({
      instanceIdentifier: normalizedIdentifier,
      options
    });
    for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
      const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
      if (normalizedIdentifier === normalizedDeferredIdentifier) {
        instanceDeferred.resolve(instance);
      }
    }
    return instance;
  }
  /**
   *
   * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
   * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
   *
   * @param identifier An optional instance identifier
   * @returns a function to unregister the callback
   */
  onInit(callback, identifier) {
    const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
    const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
    existingCallbacks.add(callback);
    this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
    const existingInstance = this.instances.get(normalizedIdentifier);
    if (existingInstance) {
      callback(existingInstance, normalizedIdentifier);
    }
    return () => {
      existingCallbacks.delete(callback);
    };
  }
  /**
   * Invoke onInit callbacks synchronously
   * @param instance the service instance`
   */
  invokeOnInitCallbacks(instance, identifier) {
    const callbacks = this.onInitCallbacks.get(identifier);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      try {
        callback(instance, identifier);
      } catch {
      }
    }
  }
  getOrInitializeService({ instanceIdentifier, options = {} }) {
    let instance = this.instances.get(instanceIdentifier);
    if (!instance && this.component) {
      instance = this.component.instanceFactory(this.container, {
        instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
        options
      });
      this.instances.set(instanceIdentifier, instance);
      this.instancesOptions.set(instanceIdentifier, options);
      this.invokeOnInitCallbacks(instance, instanceIdentifier);
      if (this.component.onInstanceCreated) {
        try {
          this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
        } catch {
        }
      }
    }
    return instance || null;
  }
  normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
    if (this.component) {
      return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
    } else {
      return identifier;
    }
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== "EXPLICIT";
  }
};
__name(_Provider, "Provider");
var Provider = _Provider;
function normalizeIdentifierForFactory(identifier) {
  return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
}
__name(normalizeIdentifierForFactory, "normalizeIdentifierForFactory");
function isComponentEager(component) {
  return component.instantiationMode === "EAGER";
}
__name(isComponentEager, "isComponentEager");
var _ComponentContainer = class _ComponentContainer {
  constructor(name3) {
    this.name = name3;
    this.providers = /* @__PURE__ */ new Map();
  }
  /**
   *
   * @param component Component being added
   * @param overwrite When a component with the same name has already been registered,
   * if overwrite is true: overwrite the existing component with the new component and create a new
   * provider with the new component. It can be useful in tests where you want to use different mocks
   * for different tests.
   * if overwrite is false: throw an exception
   */
  addComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
    }
    provider.setComponent(component);
  }
  addOrOverwriteComponent(component) {
    const provider = this.getProvider(component.name);
    if (provider.isComponentSet()) {
      this.providers.delete(component.name);
    }
    this.addComponent(component);
  }
  /**
   * getProvider provides a type safe interface where it can only be called with a field name
   * present in NameServiceMapping interface.
   *
   * Firebase SDKs providing services should extend NameServiceMapping interface to register
   * themselves.
   */
  getProvider(name3) {
    if (this.providers.has(name3)) {
      return this.providers.get(name3);
    }
    const provider = new Provider(name3, this);
    this.providers.set(name3, provider);
    return provider;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
};
__name(_ComponentContainer, "ComponentContainer");
var ComponentContainer = _ComponentContainer;

// node_modules/@firebase/logger/dist/esm/index.esm.js
var instances = [];
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
  LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
  LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
  LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
  LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
  LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
var levelStringToEnum = {
  "debug": LogLevel.DEBUG,
  "verbose": LogLevel.VERBOSE,
  "info": LogLevel.INFO,
  "warn": LogLevel.WARN,
  "error": LogLevel.ERROR,
  "silent": LogLevel.SILENT
};
var defaultLogLevel = LogLevel.INFO;
var ConsoleMethod = {
  [LogLevel.DEBUG]: "log",
  [LogLevel.VERBOSE]: "log",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error"
};
var defaultLogHandler = /* @__PURE__ */ __name((instance, logType, ...args) => {
  if (logType < instance.logLevel) {
    return;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const method = ConsoleMethod[logType];
  if (method) {
    console[method](`[${now}]  ${instance.name}:`, ...args);
  } else {
    throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
  }
}, "defaultLogHandler");
var _Logger = class _Logger {
  /**
   * Gives you an instance of a Logger to capture messages according to
   * Firebase's logging scheme.
   *
   * @param name The name that the logs will be associated with
   */
  constructor(name3) {
    this.name = name3;
    this._logLevel = defaultLogLevel;
    this._logHandler = defaultLogHandler;
    this._userLogHandler = null;
    instances.push(this);
  }
  get logLevel() {
    return this._logLevel;
  }
  set logLevel(val) {
    if (!(val in LogLevel)) {
      throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
    }
    this._logLevel = val;
  }
  // Workaround for setter/getter having to be the same type.
  setLogLevel(val) {
    this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
  }
  get logHandler() {
    return this._logHandler;
  }
  set logHandler(val) {
    if (typeof val !== "function") {
      throw new TypeError("Value assigned to `logHandler` must be a function");
    }
    this._logHandler = val;
  }
  get userLogHandler() {
    return this._userLogHandler;
  }
  set userLogHandler(val) {
    this._userLogHandler = val;
  }
  /**
   * The functions below are all based on the `console` interface
   */
  debug(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
    this._logHandler(this, LogLevel.DEBUG, ...args);
  }
  log(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
    this._logHandler(this, LogLevel.VERBOSE, ...args);
  }
  info(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
    this._logHandler(this, LogLevel.INFO, ...args);
  }
  warn(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
    this._logHandler(this, LogLevel.WARN, ...args);
  }
  error(...args) {
    this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
    this._logHandler(this, LogLevel.ERROR, ...args);
  }
};
__name(_Logger, "Logger");
var Logger = _Logger;

// node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = /* @__PURE__ */ __name((object, constructors) => constructors.some((c) => object instanceof c), "instanceOfAny");
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
__name(getIdbProxyableTypes, "getIdbProxyableTypes");
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
__name(getCursorAdvanceMethods, "getCursorAdvanceMethods");
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = /* @__PURE__ */ __name(() => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    }, "unlisten");
    const success = /* @__PURE__ */ __name(() => {
      resolve(wrap(request.result));
      unlisten();
    }, "success");
    const error = /* @__PURE__ */ __name(() => {
      reject(request.error);
      unlisten();
    }, "error");
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
__name(promisifyRequest, "promisifyRequest");
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = /* @__PURE__ */ __name(() => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    }, "unlisten");
    const complete = /* @__PURE__ */ __name(() => {
      resolve();
      unlisten();
    }, "complete");
    const error = /* @__PURE__ */ __name(() => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    }, "error");
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
__name(cacheDonePromiseForTransaction, "cacheDonePromiseForTransaction");
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
__name(replaceTraps, "replaceTraps");
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
__name(wrapFunction, "wrapFunction");
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
__name(transformCachableValue, "transformCachableValue");
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
__name(wrap, "wrap");
var unwrap = /* @__PURE__ */ __name((value) => reverseTransformCache.get(value), "unwrap");

// node_modules/idb/build/index.js
function openDB(name3, version3, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name3, version3);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db2) => {
    if (terminated)
      db2.addEventListener("close", () => terminated());
    if (blocking) {
      db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
__name(openDB, "openDB");
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = /* @__PURE__ */ __name(async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  }, "method");
  cachedMethods.set(prop, method);
  return method;
}
__name(getMethod, "getMethod");
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: /* @__PURE__ */ __name((target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver), "get"),
  has: /* @__PURE__ */ __name((target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop), "has")
}));

// node_modules/@firebase/app/dist/esm/index.esm.js
var _PlatformLoggerServiceImpl = class _PlatformLoggerServiceImpl {
  constructor(container) {
    this.container = container;
  }
  // In initial implementation, this will be called by installations on
  // auth token refresh, and installations will send this string.
  getPlatformInfoString() {
    const providers = this.container.getProviders();
    return providers.map((provider) => {
      if (isVersionServiceProvider(provider)) {
        const service = provider.getImmediate();
        return `${service.library}/${service.version}`;
      } else {
        return null;
      }
    }).filter((logString) => logString).join(" ");
  }
};
__name(_PlatformLoggerServiceImpl, "PlatformLoggerServiceImpl");
var PlatformLoggerServiceImpl = _PlatformLoggerServiceImpl;
function isVersionServiceProvider(provider) {
  const component = provider.getComponent();
  return component?.type === "VERSION";
}
__name(isVersionServiceProvider, "isVersionServiceProvider");
var name$q = "@firebase/app";
var version$1 = "0.14.13";
var logger = new Logger("@firebase/app");
var name$p = "@firebase/app-compat";
var name$o = "@firebase/analytics-compat";
var name$n = "@firebase/analytics";
var name$m = "@firebase/app-check-compat";
var name$l = "@firebase/app-check";
var name$k = "@firebase/auth";
var name$j = "@firebase/auth-compat";
var name$i = "@firebase/database";
var name$h = "@firebase/data-connect";
var name$g = "@firebase/database-compat";
var name$f = "@firebase/functions";
var name$e = "@firebase/functions-compat";
var name$d = "@firebase/installations";
var name$c = "@firebase/installations-compat";
var name$b = "@firebase/messaging";
var name$a = "@firebase/messaging-compat";
var name$9 = "@firebase/performance";
var name$8 = "@firebase/performance-compat";
var name$7 = "@firebase/remote-config";
var name$6 = "@firebase/remote-config-compat";
var name$5 = "@firebase/storage";
var name$4 = "@firebase/storage-compat";
var name$3 = "@firebase/firestore";
var name$2 = "@firebase/ai";
var name$1 = "@firebase/firestore-compat";
var name = "firebase";
var version = "12.14.0";
var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
var PLATFORM_LOG_STRING = {
  [name$q]: "fire-core",
  [name$p]: "fire-core-compat",
  [name$n]: "fire-analytics",
  [name$o]: "fire-analytics-compat",
  [name$l]: "fire-app-check",
  [name$m]: "fire-app-check-compat",
  [name$k]: "fire-auth",
  [name$j]: "fire-auth-compat",
  [name$i]: "fire-rtdb",
  [name$h]: "fire-data-connect",
  [name$g]: "fire-rtdb-compat",
  [name$f]: "fire-fn",
  [name$e]: "fire-fn-compat",
  [name$d]: "fire-iid",
  [name$c]: "fire-iid-compat",
  [name$b]: "fire-fcm",
  [name$a]: "fire-fcm-compat",
  [name$9]: "fire-perf",
  [name$8]: "fire-perf-compat",
  [name$7]: "fire-rc",
  [name$6]: "fire-rc-compat",
  [name$5]: "fire-gcs",
  [name$4]: "fire-gcs-compat",
  [name$3]: "fire-fst",
  [name$1]: "fire-fst-compat",
  [name$2]: "fire-vertex",
  "fire-js": "fire-js",
  // Platform identifier for JS SDK.
  [name]: "fire-js-all"
};
var _apps = /* @__PURE__ */ new Map();
var _serverApps = /* @__PURE__ */ new Map();
var _components = /* @__PURE__ */ new Map();
function _addComponent(app2, component) {
  try {
    app2.container.addComponent(component);
  } catch (e) {
    logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
  }
}
__name(_addComponent, "_addComponent");
function _registerComponent(component) {
  const componentName = component.name;
  if (_components.has(componentName)) {
    logger.debug(`There were multiple attempts to register component ${componentName}.`);
    return false;
  }
  _components.set(componentName, component);
  for (const app2 of _apps.values()) {
    _addComponent(app2, component);
  }
  for (const serverApp of _serverApps.values()) {
    _addComponent(serverApp, component);
  }
  return true;
}
__name(_registerComponent, "_registerComponent");
function _getProvider(app2, name3) {
  const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
  if (heartbeatController) {
    void heartbeatController.triggerHeartbeat();
  }
  return app2.container.getProvider(name3);
}
__name(_getProvider, "_getProvider");
function _isFirebaseServerApp(obj) {
  if (obj === null || obj === void 0) {
    return false;
  }
  return obj.settings !== void 0;
}
__name(_isFirebaseServerApp, "_isFirebaseServerApp");
var ERRORS = {
  [
    "no-app"
    /* AppError.NO_APP */
  ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
  [
    "bad-app-name"
    /* AppError.BAD_APP_NAME */
  ]: "Illegal App name: '{$appName}'",
  [
    "duplicate-app"
    /* AppError.DUPLICATE_APP */
  ]: "Firebase App named '{$appName}' already exists with different options or config",
  [
    "app-deleted"
    /* AppError.APP_DELETED */
  ]: "Firebase App named '{$appName}' already deleted",
  [
    "server-app-deleted"
    /* AppError.SERVER_APP_DELETED */
  ]: "Firebase Server App has been deleted",
  [
    "no-options"
    /* AppError.NO_OPTIONS */
  ]: "Need to provide options, when not being deployed to hosting via source.",
  [
    "invalid-app-argument"
    /* AppError.INVALID_APP_ARGUMENT */
  ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
  [
    "invalid-log-argument"
    /* AppError.INVALID_LOG_ARGUMENT */
  ]: "First argument to `onLog` must be null or a function.",
  [
    "idb-open"
    /* AppError.IDB_OPEN */
  ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-get"
    /* AppError.IDB_GET */
  ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-set"
    /* AppError.IDB_WRITE */
  ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "idb-delete"
    /* AppError.IDB_DELETE */
  ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  [
    "finalization-registry-not-supported"
    /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
  ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
  [
    "invalid-server-app-environment"
    /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
  ]: "FirebaseServerApp is not for use in browser environments."
};
var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
var _FirebaseAppImpl = class _FirebaseAppImpl {
  constructor(options, config, container) {
    this._isDeleted = false;
    this._options = { ...options };
    this._config = { ...config };
    this._name = config.name;
    this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
    this._container = container;
    this.container.addComponent(new Component(
      "app",
      () => this,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
  }
  get automaticDataCollectionEnabled() {
    this.checkDestroyed();
    return this._automaticDataCollectionEnabled;
  }
  set automaticDataCollectionEnabled(val) {
    this.checkDestroyed();
    this._automaticDataCollectionEnabled = val;
  }
  get name() {
    this.checkDestroyed();
    return this._name;
  }
  get options() {
    this.checkDestroyed();
    return this._options;
  }
  get config() {
    this.checkDestroyed();
    return this._config;
  }
  get container() {
    return this._container;
  }
  get isDeleted() {
    return this._isDeleted;
  }
  set isDeleted(val) {
    this._isDeleted = val;
  }
  /**
   * This function will throw an Error if the App has already been deleted -
   * use before performing API actions on the App.
   */
  checkDestroyed() {
    if (this.isDeleted) {
      throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
    }
  }
};
__name(_FirebaseAppImpl, "FirebaseAppImpl");
var FirebaseAppImpl = _FirebaseAppImpl;
var SDK_VERSION = version;
function initializeApp(_options, rawConfig = {}) {
  let options = _options;
  if (typeof rawConfig !== "object") {
    const name4 = rawConfig;
    rawConfig = { name: name4 };
  }
  const config = {
    name: DEFAULT_ENTRY_NAME2,
    automaticDataCollectionEnabled: true,
    ...rawConfig
  };
  const name3 = config.name;
  if (typeof name3 !== "string" || !name3) {
    throw ERROR_FACTORY.create("bad-app-name", {
      appName: String(name3)
    });
  }
  options || (options = getDefaultAppConfig());
  if (!options) {
    throw ERROR_FACTORY.create(
      "no-options"
      /* AppError.NO_OPTIONS */
    );
  }
  const existingApp = _apps.get(name3);
  if (existingApp) {
    if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
      return existingApp;
    } else {
      throw ERROR_FACTORY.create("duplicate-app", { appName: name3 });
    }
  }
  const container = new ComponentContainer(name3);
  for (const component of _components.values()) {
    container.addComponent(component);
  }
  const newApp = new FirebaseAppImpl(options, config, container);
  _apps.set(name3, newApp);
  return newApp;
}
__name(initializeApp, "initializeApp");
function getApp(name3 = DEFAULT_ENTRY_NAME2) {
  const app2 = _apps.get(name3);
  if (!app2 && name3 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
    return initializeApp();
  }
  if (!app2) {
    throw ERROR_FACTORY.create("no-app", { appName: name3 });
  }
  return app2;
}
__name(getApp, "getApp");
function registerVersion(libraryKeyOrName, version3, variant) {
  let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
  if (variant) {
    library += `-${variant}`;
  }
  const libraryMismatch = library.match(/\s|\//);
  const versionMismatch = version3.match(/\s|\//);
  if (libraryMismatch || versionMismatch) {
    const warning = [
      `Unable to register library "${library}" with version "${version3}":`
    ];
    if (libraryMismatch) {
      warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
    }
    if (libraryMismatch && versionMismatch) {
      warning.push("and");
    }
    if (versionMismatch) {
      warning.push(`version name "${version3}" contains illegal characters (whitespace or "/")`);
    }
    logger.warn(warning.join(" "));
    return;
  }
  _registerComponent(new Component(
    `${library}-version`,
    () => ({ library, version: version3 }),
    "VERSION"
    /* ComponentType.VERSION */
  ));
}
__name(registerVersion, "registerVersion");
var DB_NAME = "firebase-heartbeat-database";
var DB_VERSION = 1;
var STORE_NAME = "firebase-heartbeat-store";
var dbPromise = null;
function getDbPromise() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade: /* @__PURE__ */ __name((db2, oldVersion) => {
        switch (oldVersion) {
          case 0:
            try {
              db2.createObjectStore(STORE_NAME);
            } catch (e) {
              console.warn(e);
            }
        }
      }, "upgrade")
    }).catch((e) => {
      throw ERROR_FACTORY.create("idb-open", {
        originalErrorMessage: e.message
      });
    });
  }
  return dbPromise;
}
__name(getDbPromise, "getDbPromise");
async function readHeartbeatsFromIndexedDB(app2) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME);
    const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
    await tx.done;
    return result;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-get", {
        originalErrorMessage: e?.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
__name(readHeartbeatsFromIndexedDB, "readHeartbeatsFromIndexedDB");
async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
  try {
    const db2 = await getDbPromise();
    const tx = db2.transaction(STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(STORE_NAME);
    await objectStore.put(heartbeatObject, computeKey(app2));
    await tx.done;
  } catch (e) {
    if (e instanceof FirebaseError) {
      logger.warn(e.message);
    } else {
      const idbGetError = ERROR_FACTORY.create("idb-set", {
        originalErrorMessage: e?.message
      });
      logger.warn(idbGetError.message);
    }
  }
}
__name(writeHeartbeatsToIndexedDB, "writeHeartbeatsToIndexedDB");
function computeKey(app2) {
  return `${app2.name}!${app2.options.appId}`;
}
__name(computeKey, "computeKey");
var MAX_HEADER_BYTES = 1024;
var MAX_NUM_STORED_HEARTBEATS = 30;
var _HeartbeatServiceImpl = class _HeartbeatServiceImpl {
  constructor(container) {
    this.container = container;
    this._heartbeatsCache = null;
    const app2 = this.container.getProvider("app").getImmediate();
    this._storage = new HeartbeatStorageImpl(app2);
    this._heartbeatsCachePromise = this._storage.read().then((result) => {
      this._heartbeatsCache = result;
      return result;
    });
  }
  /**
   * Called to report a heartbeat. The function will generate
   * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
   * to IndexedDB.
   * Note that we only store one heartbeat per day. So if a heartbeat for today is
   * already logged, subsequent calls to this function in the same day will be ignored.
   */
  async triggerHeartbeat() {
    try {
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (this._heartbeatsCache?.heartbeats == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (this._heartbeatsCache?.heartbeats == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
        if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
          const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
          this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
        }
      }
      return this._storage.overwrite(this._heartbeatsCache);
    } catch (e) {
      logger.warn(e);
    }
  }
  /**
   * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
   * It also clears all heartbeats from memory as well as in IndexedDB.
   *
   * NOTE: Consuming product SDKs should not send the header if this method
   * returns an empty string.
   */
  async getHeartbeatsHeader() {
    try {
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    } catch (e) {
      logger.warn(e);
      return "";
    }
  }
};
__name(_HeartbeatServiceImpl, "HeartbeatServiceImpl");
var HeartbeatServiceImpl = _HeartbeatServiceImpl;
function getUTCDateString() {
  const today = /* @__PURE__ */ new Date();
  return today.toISOString().substring(0, 10);
}
__name(getUTCDateString, "getUTCDateString");
function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
  const heartbeatsToSend = [];
  let unsentEntries = heartbeatsCache.slice();
  for (const singleDateHeartbeat of heartbeatsCache) {
    const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
    if (!heartbeatEntry) {
      heartbeatsToSend.push({
        agent: singleDateHeartbeat.agent,
        dates: [singleDateHeartbeat.date]
      });
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatsToSend.pop();
        break;
      }
    } else {
      heartbeatEntry.dates.push(singleDateHeartbeat.date);
      if (countBytes(heartbeatsToSend) > maxSize) {
        heartbeatEntry.dates.pop();
        break;
      }
    }
    unsentEntries = unsentEntries.slice(1);
  }
  return {
    heartbeatsToSend,
    unsentEntries
  };
}
__name(extractHeartbeatsForHeader, "extractHeartbeatsForHeader");
var _HeartbeatStorageImpl = class _HeartbeatStorageImpl {
  constructor(app2) {
    this.app = app2;
    this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
  }
  async runIndexedDBEnvironmentCheck() {
    if (!isIndexedDBAvailable()) {
      return false;
    } else {
      return validateIndexedDBOpenable().then(() => true).catch(() => false);
    }
  }
  /**
   * Read all heartbeats.
   */
  async read() {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return { heartbeats: [] };
    } else {
      const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
      if (idbHeartbeatObject?.heartbeats) {
        return idbHeartbeatObject;
      } else {
        return { heartbeats: [] };
      }
    }
  }
  // overwrite the storage with the provided heartbeats
  async overwrite(heartbeatsObject) {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: heartbeatsObject.heartbeats
      });
    }
  }
  // add heartbeats
  async add(heartbeatsObject) {
    const canUseIndexedDB = await this._canUseIndexedDBPromise;
    if (!canUseIndexedDB) {
      return;
    } else {
      const existingHeartbeatsObject = await this.read();
      return writeHeartbeatsToIndexedDB(this.app, {
        lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
        heartbeats: [
          ...existingHeartbeatsObject.heartbeats,
          ...heartbeatsObject.heartbeats
        ]
      });
    }
  }
};
__name(_HeartbeatStorageImpl, "HeartbeatStorageImpl");
var HeartbeatStorageImpl = _HeartbeatStorageImpl;
function countBytes(heartbeatsCache) {
  return base64urlEncodeWithoutPadding(
    // heartbeatsCache wrapper properties
    JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
  ).length;
}
__name(countBytes, "countBytes");
function getEarliestHeartbeatIdx(heartbeats) {
  if (heartbeats.length === 0) {
    return -1;
  }
  let earliestHeartbeatIdx = 0;
  let earliestHeartbeatDate = heartbeats[0].date;
  for (let i = 1; i < heartbeats.length; i++) {
    if (heartbeats[i].date < earliestHeartbeatDate) {
      earliestHeartbeatDate = heartbeats[i].date;
      earliestHeartbeatIdx = i;
    }
  }
  return earliestHeartbeatIdx;
}
__name(getEarliestHeartbeatIdx, "getEarliestHeartbeatIdx");
function registerCoreComponents(variant) {
  _registerComponent(new Component(
    "platform-logger",
    (container) => new PlatformLoggerServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  _registerComponent(new Component(
    "heartbeat",
    (container) => new HeartbeatServiceImpl(container),
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ));
  registerVersion(name$q, version$1, variant);
  registerVersion(name$q, version$1, "esm2020");
  registerVersion("fire-js", "");
}
__name(registerCoreComponents, "registerCoreComponents");
registerCoreComponents("");

// node_modules/firebase/app/dist/esm/index.esm.js
var name2 = "firebase";
var version2 = "12.14.0";
registerVersion(name2, version2, "app");

// node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var bloom_blob_es2018 = {};
var Integer;
var Md5;
(function() {
  var h;
  function k(d, a) {
    function c() {
    }
    __name(c, "c");
    c.prototype = a.prototype;
    d.F = a.prototype;
    d.prototype = new c();
    d.prototype.constructor = d;
    d.D = function(f, e, g) {
      for (var b2 = Array(arguments.length - 2), r = 2; r < arguments.length; r++) b2[r - 2] = arguments[r];
      return a.prototype[e].apply(f, b2);
    };
  }
  __name(k, "k");
  function l() {
    this.blockSize = -1;
  }
  __name(l, "l");
  function m() {
    this.blockSize = -1;
    this.blockSize = 64;
    this.g = Array(4);
    this.C = Array(this.blockSize);
    this.o = this.h = 0;
    this.u();
  }
  __name(m, "m");
  k(m, l);
  m.prototype.u = function() {
    this.g[0] = 1732584193;
    this.g[1] = 4023233417;
    this.g[2] = 2562383102;
    this.g[3] = 271733878;
    this.o = this.h = 0;
  };
  function n(d, a, c) {
    c || (c = 0);
    const f = Array(16);
    if (typeof a === "string") for (var e = 0; e < 16; ++e) f[e] = a.charCodeAt(c++) | a.charCodeAt(c++) << 8 | a.charCodeAt(c++) << 16 | a.charCodeAt(c++) << 24;
    else for (e = 0; e < 16; ++e) f[e] = a[c++] | a[c++] << 8 | a[c++] << 16 | a[c++] << 24;
    a = d.g[0];
    c = d.g[1];
    e = d.g[2];
    let g = d.g[3], b2;
    b2 = a + (g ^ c & (e ^ g)) + f[0] + 3614090360 & 4294967295;
    a = c + (b2 << 7 & 4294967295 | b2 >>> 25);
    b2 = g + (e ^ a & (c ^ e)) + f[1] + 3905402710 & 4294967295;
    g = a + (b2 << 12 & 4294967295 | b2 >>> 20);
    b2 = e + (c ^ g & (a ^ c)) + f[2] + 606105819 & 4294967295;
    e = g + (b2 << 17 & 4294967295 | b2 >>> 15);
    b2 = c + (a ^ e & (g ^ a)) + f[3] + 3250441966 & 4294967295;
    c = e + (b2 << 22 & 4294967295 | b2 >>> 10);
    b2 = a + (g ^ c & (e ^ g)) + f[4] + 4118548399 & 4294967295;
    a = c + (b2 << 7 & 4294967295 | b2 >>> 25);
    b2 = g + (e ^ a & (c ^ e)) + f[5] + 1200080426 & 4294967295;
    g = a + (b2 << 12 & 4294967295 | b2 >>> 20);
    b2 = e + (c ^ g & (a ^ c)) + f[6] + 2821735955 & 4294967295;
    e = g + (b2 << 17 & 4294967295 | b2 >>> 15);
    b2 = c + (a ^ e & (g ^ a)) + f[7] + 4249261313 & 4294967295;
    c = e + (b2 << 22 & 4294967295 | b2 >>> 10);
    b2 = a + (g ^ c & (e ^ g)) + f[8] + 1770035416 & 4294967295;
    a = c + (b2 << 7 & 4294967295 | b2 >>> 25);
    b2 = g + (e ^ a & (c ^ e)) + f[9] + 2336552879 & 4294967295;
    g = a + (b2 << 12 & 4294967295 | b2 >>> 20);
    b2 = e + (c ^ g & (a ^ c)) + f[10] + 4294925233 & 4294967295;
    e = g + (b2 << 17 & 4294967295 | b2 >>> 15);
    b2 = c + (a ^ e & (g ^ a)) + f[11] + 2304563134 & 4294967295;
    c = e + (b2 << 22 & 4294967295 | b2 >>> 10);
    b2 = a + (g ^ c & (e ^ g)) + f[12] + 1804603682 & 4294967295;
    a = c + (b2 << 7 & 4294967295 | b2 >>> 25);
    b2 = g + (e ^ a & (c ^ e)) + f[13] + 4254626195 & 4294967295;
    g = a + (b2 << 12 & 4294967295 | b2 >>> 20);
    b2 = e + (c ^ g & (a ^ c)) + f[14] + 2792965006 & 4294967295;
    e = g + (b2 << 17 & 4294967295 | b2 >>> 15);
    b2 = c + (a ^ e & (g ^ a)) + f[15] + 1236535329 & 4294967295;
    c = e + (b2 << 22 & 4294967295 | b2 >>> 10);
    b2 = a + (e ^ g & (c ^ e)) + f[1] + 4129170786 & 4294967295;
    a = c + (b2 << 5 & 4294967295 | b2 >>> 27);
    b2 = g + (c ^ e & (a ^ c)) + f[6] + 3225465664 & 4294967295;
    g = a + (b2 << 9 & 4294967295 | b2 >>> 23);
    b2 = e + (a ^ c & (g ^ a)) + f[11] + 643717713 & 4294967295;
    e = g + (b2 << 14 & 4294967295 | b2 >>> 18);
    b2 = c + (g ^ a & (e ^ g)) + f[0] + 3921069994 & 4294967295;
    c = e + (b2 << 20 & 4294967295 | b2 >>> 12);
    b2 = a + (e ^ g & (c ^ e)) + f[5] + 3593408605 & 4294967295;
    a = c + (b2 << 5 & 4294967295 | b2 >>> 27);
    b2 = g + (c ^ e & (a ^ c)) + f[10] + 38016083 & 4294967295;
    g = a + (b2 << 9 & 4294967295 | b2 >>> 23);
    b2 = e + (a ^ c & (g ^ a)) + f[15] + 3634488961 & 4294967295;
    e = g + (b2 << 14 & 4294967295 | b2 >>> 18);
    b2 = c + (g ^ a & (e ^ g)) + f[4] + 3889429448 & 4294967295;
    c = e + (b2 << 20 & 4294967295 | b2 >>> 12);
    b2 = a + (e ^ g & (c ^ e)) + f[9] + 568446438 & 4294967295;
    a = c + (b2 << 5 & 4294967295 | b2 >>> 27);
    b2 = g + (c ^ e & (a ^ c)) + f[14] + 3275163606 & 4294967295;
    g = a + (b2 << 9 & 4294967295 | b2 >>> 23);
    b2 = e + (a ^ c & (g ^ a)) + f[3] + 4107603335 & 4294967295;
    e = g + (b2 << 14 & 4294967295 | b2 >>> 18);
    b2 = c + (g ^ a & (e ^ g)) + f[8] + 1163531501 & 4294967295;
    c = e + (b2 << 20 & 4294967295 | b2 >>> 12);
    b2 = a + (e ^ g & (c ^ e)) + f[13] + 2850285829 & 4294967295;
    a = c + (b2 << 5 & 4294967295 | b2 >>> 27);
    b2 = g + (c ^ e & (a ^ c)) + f[2] + 4243563512 & 4294967295;
    g = a + (b2 << 9 & 4294967295 | b2 >>> 23);
    b2 = e + (a ^ c & (g ^ a)) + f[7] + 1735328473 & 4294967295;
    e = g + (b2 << 14 & 4294967295 | b2 >>> 18);
    b2 = c + (g ^ a & (e ^ g)) + f[12] + 2368359562 & 4294967295;
    c = e + (b2 << 20 & 4294967295 | b2 >>> 12);
    b2 = a + (c ^ e ^ g) + f[5] + 4294588738 & 4294967295;
    a = c + (b2 << 4 & 4294967295 | b2 >>> 28);
    b2 = g + (a ^ c ^ e) + f[8] + 2272392833 & 4294967295;
    g = a + (b2 << 11 & 4294967295 | b2 >>> 21);
    b2 = e + (g ^ a ^ c) + f[11] + 1839030562 & 4294967295;
    e = g + (b2 << 16 & 4294967295 | b2 >>> 16);
    b2 = c + (e ^ g ^ a) + f[14] + 4259657740 & 4294967295;
    c = e + (b2 << 23 & 4294967295 | b2 >>> 9);
    b2 = a + (c ^ e ^ g) + f[1] + 2763975236 & 4294967295;
    a = c + (b2 << 4 & 4294967295 | b2 >>> 28);
    b2 = g + (a ^ c ^ e) + f[4] + 1272893353 & 4294967295;
    g = a + (b2 << 11 & 4294967295 | b2 >>> 21);
    b2 = e + (g ^ a ^ c) + f[7] + 4139469664 & 4294967295;
    e = g + (b2 << 16 & 4294967295 | b2 >>> 16);
    b2 = c + (e ^ g ^ a) + f[10] + 3200236656 & 4294967295;
    c = e + (b2 << 23 & 4294967295 | b2 >>> 9);
    b2 = a + (c ^ e ^ g) + f[13] + 681279174 & 4294967295;
    a = c + (b2 << 4 & 4294967295 | b2 >>> 28);
    b2 = g + (a ^ c ^ e) + f[0] + 3936430074 & 4294967295;
    g = a + (b2 << 11 & 4294967295 | b2 >>> 21);
    b2 = e + (g ^ a ^ c) + f[3] + 3572445317 & 4294967295;
    e = g + (b2 << 16 & 4294967295 | b2 >>> 16);
    b2 = c + (e ^ g ^ a) + f[6] + 76029189 & 4294967295;
    c = e + (b2 << 23 & 4294967295 | b2 >>> 9);
    b2 = a + (c ^ e ^ g) + f[9] + 3654602809 & 4294967295;
    a = c + (b2 << 4 & 4294967295 | b2 >>> 28);
    b2 = g + (a ^ c ^ e) + f[12] + 3873151461 & 4294967295;
    g = a + (b2 << 11 & 4294967295 | b2 >>> 21);
    b2 = e + (g ^ a ^ c) + f[15] + 530742520 & 4294967295;
    e = g + (b2 << 16 & 4294967295 | b2 >>> 16);
    b2 = c + (e ^ g ^ a) + f[2] + 3299628645 & 4294967295;
    c = e + (b2 << 23 & 4294967295 | b2 >>> 9);
    b2 = a + (e ^ (c | ~g)) + f[0] + 4096336452 & 4294967295;
    a = c + (b2 << 6 & 4294967295 | b2 >>> 26);
    b2 = g + (c ^ (a | ~e)) + f[7] + 1126891415 & 4294967295;
    g = a + (b2 << 10 & 4294967295 | b2 >>> 22);
    b2 = e + (a ^ (g | ~c)) + f[14] + 2878612391 & 4294967295;
    e = g + (b2 << 15 & 4294967295 | b2 >>> 17);
    b2 = c + (g ^ (e | ~a)) + f[5] + 4237533241 & 4294967295;
    c = e + (b2 << 21 & 4294967295 | b2 >>> 11);
    b2 = a + (e ^ (c | ~g)) + f[12] + 1700485571 & 4294967295;
    a = c + (b2 << 6 & 4294967295 | b2 >>> 26);
    b2 = g + (c ^ (a | ~e)) + f[3] + 2399980690 & 4294967295;
    g = a + (b2 << 10 & 4294967295 | b2 >>> 22);
    b2 = e + (a ^ (g | ~c)) + f[10] + 4293915773 & 4294967295;
    e = g + (b2 << 15 & 4294967295 | b2 >>> 17);
    b2 = c + (g ^ (e | ~a)) + f[1] + 2240044497 & 4294967295;
    c = e + (b2 << 21 & 4294967295 | b2 >>> 11);
    b2 = a + (e ^ (c | ~g)) + f[8] + 1873313359 & 4294967295;
    a = c + (b2 << 6 & 4294967295 | b2 >>> 26);
    b2 = g + (c ^ (a | ~e)) + f[15] + 4264355552 & 4294967295;
    g = a + (b2 << 10 & 4294967295 | b2 >>> 22);
    b2 = e + (a ^ (g | ~c)) + f[6] + 2734768916 & 4294967295;
    e = g + (b2 << 15 & 4294967295 | b2 >>> 17);
    b2 = c + (g ^ (e | ~a)) + f[13] + 1309151649 & 4294967295;
    c = e + (b2 << 21 & 4294967295 | b2 >>> 11);
    b2 = a + (e ^ (c | ~g)) + f[4] + 4149444226 & 4294967295;
    a = c + (b2 << 6 & 4294967295 | b2 >>> 26);
    b2 = g + (c ^ (a | ~e)) + f[11] + 3174756917 & 4294967295;
    g = a + (b2 << 10 & 4294967295 | b2 >>> 22);
    b2 = e + (a ^ (g | ~c)) + f[2] + 718787259 & 4294967295;
    e = g + (b2 << 15 & 4294967295 | b2 >>> 17);
    b2 = c + (g ^ (e | ~a)) + f[9] + 3951481745 & 4294967295;
    d.g[0] = d.g[0] + a & 4294967295;
    d.g[1] = d.g[1] + (e + (b2 << 21 & 4294967295 | b2 >>> 11)) & 4294967295;
    d.g[2] = d.g[2] + e & 4294967295;
    d.g[3] = d.g[3] + g & 4294967295;
  }
  __name(n, "n");
  m.prototype.v = function(d, a) {
    a === void 0 && (a = d.length);
    const c = a - this.blockSize, f = this.C;
    let e = this.h, g = 0;
    for (; g < a; ) {
      if (e == 0) for (; g <= c; ) n(this, d, g), g += this.blockSize;
      if (typeof d === "string") for (; g < a; ) {
        if (f[e++] = d.charCodeAt(g++), e == this.blockSize) {
          n(this, f);
          e = 0;
          break;
        }
      }
      else for (; g < a; ) if (f[e++] = d[g++], e == this.blockSize) {
        n(this, f);
        e = 0;
        break;
      }
    }
    this.h = e;
    this.o += a;
  };
  m.prototype.A = function() {
    var d = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
    d[0] = 128;
    for (var a = 1; a < d.length - 8; ++a) d[a] = 0;
    a = this.o * 8;
    for (var c = d.length - 8; c < d.length; ++c) d[c] = a & 255, a /= 256;
    this.v(d);
    d = Array(16);
    a = 0;
    for (c = 0; c < 4; ++c) for (let f = 0; f < 32; f += 8) d[a++] = this.g[c] >>> f & 255;
    return d;
  };
  function p(d, a) {
    var c = q2;
    return Object.prototype.hasOwnProperty.call(c, d) ? c[d] : c[d] = a(d);
  }
  __name(p, "p");
  function t(d, a) {
    this.h = a;
    const c = [];
    let f = true;
    for (let e = d.length - 1; e >= 0; e--) {
      const g = d[e] | 0;
      f && g == a || (c[e] = g, f = false);
    }
    this.g = c;
  }
  __name(t, "t");
  var q2 = {};
  function u(d) {
    return -128 <= d && d < 128 ? p(d, function(a) {
      return new t([a | 0], a < 0 ? -1 : 0);
    }) : new t([d | 0], d < 0 ? -1 : 0);
  }
  __name(u, "u");
  function v2(d) {
    if (isNaN(d) || !isFinite(d)) return w;
    if (d < 0) return x2(v2(-d));
    const a = [];
    let c = 1;
    for (let f = 0; d >= c; f++) a[f] = d / c | 0, c *= 4294967296;
    return new t(a, 0);
  }
  __name(v2, "v");
  function y(d, a) {
    if (d.length == 0) throw Error("number format error: empty string");
    a = a || 10;
    if (a < 2 || 36 < a) throw Error("radix out of range: " + a);
    if (d.charAt(0) == "-") return x2(y(d.substring(1), a));
    if (d.indexOf("-") >= 0) throw Error('number format error: interior "-" character');
    const c = v2(Math.pow(a, 8));
    let f = w;
    for (let g = 0; g < d.length; g += 8) {
      var e = Math.min(8, d.length - g);
      const b2 = parseInt(d.substring(g, g + e), a);
      e < 8 ? (e = v2(Math.pow(a, e)), f = f.j(e).add(v2(b2))) : (f = f.j(c), f = f.add(v2(b2)));
    }
    return f;
  }
  __name(y, "y");
  var w = u(0), z = u(1), A = u(16777216);
  h = t.prototype;
  h.m = function() {
    if (B2(this)) return -x2(this).m();
    let d = 0, a = 1;
    for (let c = 0; c < this.g.length; c++) {
      const f = this.i(c);
      d += (f >= 0 ? f : 4294967296 + f) * a;
      a *= 4294967296;
    }
    return d;
  };
  h.toString = function(d) {
    d = d || 10;
    if (d < 2 || 36 < d) throw Error("radix out of range: " + d);
    if (C2(this)) return "0";
    if (B2(this)) return "-" + x2(this).toString(d);
    const a = v2(Math.pow(d, 6));
    var c = this;
    let f = "";
    for (; ; ) {
      const e = D2(c, a).g;
      c = F2(c, e.j(a));
      let g = ((c.g.length > 0 ? c.g[0] : c.h) >>> 0).toString(d);
      c = e;
      if (C2(c)) return g + f;
      for (; g.length < 6; ) g = "0" + g;
      f = g + f;
    }
  };
  h.i = function(d) {
    return d < 0 ? 0 : d < this.g.length ? this.g[d] : this.h;
  };
  function C2(d) {
    if (d.h != 0) return false;
    for (let a = 0; a < d.g.length; a++) if (d.g[a] != 0) return false;
    return true;
  }
  __name(C2, "C");
  function B2(d) {
    return d.h == -1;
  }
  __name(B2, "B");
  h.l = function(d) {
    d = F2(this, d);
    return B2(d) ? -1 : C2(d) ? 0 : 1;
  };
  function x2(d) {
    const a = d.g.length, c = [];
    for (let f = 0; f < a; f++) c[f] = ~d.g[f];
    return new t(c, ~d.h).add(z);
  }
  __name(x2, "x");
  h.abs = function() {
    return B2(this) ? x2(this) : this;
  };
  h.add = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    let f = 0;
    for (let e = 0; e <= a; e++) {
      let g = f + (this.i(e) & 65535) + (d.i(e) & 65535), b2 = (g >>> 16) + (this.i(e) >>> 16) + (d.i(e) >>> 16);
      f = b2 >>> 16;
      g &= 65535;
      b2 &= 65535;
      c[e] = b2 << 16 | g;
    }
    return new t(c, c[c.length - 1] & -2147483648 ? -1 : 0);
  };
  function F2(d, a) {
    return d.add(x2(a));
  }
  __name(F2, "F");
  h.j = function(d) {
    if (C2(this) || C2(d)) return w;
    if (B2(this)) return B2(d) ? x2(this).j(x2(d)) : x2(x2(this).j(d));
    if (B2(d)) return x2(this.j(x2(d)));
    if (this.l(A) < 0 && d.l(A) < 0) return v2(this.m() * d.m());
    const a = this.g.length + d.g.length, c = [];
    for (var f = 0; f < 2 * a; f++) c[f] = 0;
    for (f = 0; f < this.g.length; f++) for (let e = 0; e < d.g.length; e++) {
      const g = this.i(f) >>> 16, b2 = this.i(f) & 65535, r = d.i(e) >>> 16, E = d.i(e) & 65535;
      c[2 * f + 2 * e] += b2 * E;
      G2(c, 2 * f + 2 * e);
      c[2 * f + 2 * e + 1] += g * E;
      G2(c, 2 * f + 2 * e + 1);
      c[2 * f + 2 * e + 1] += b2 * r;
      G2(c, 2 * f + 2 * e + 1);
      c[2 * f + 2 * e + 2] += g * r;
      G2(c, 2 * f + 2 * e + 2);
    }
    for (d = 0; d < a; d++) c[d] = c[2 * d + 1] << 16 | c[2 * d];
    for (d = a; d < 2 * a; d++) c[d] = 0;
    return new t(c, 0);
  };
  function G2(d, a) {
    for (; (d[a] & 65535) != d[a]; ) d[a + 1] += d[a] >>> 16, d[a] &= 65535, a++;
  }
  __name(G2, "G");
  function H(d, a) {
    this.g = d;
    this.h = a;
  }
  __name(H, "H");
  function D2(d, a) {
    if (C2(a)) throw Error("division by zero");
    if (C2(d)) return new H(w, w);
    if (B2(d)) return a = D2(x2(d), a), new H(x2(a.g), x2(a.h));
    if (B2(a)) return a = D2(d, x2(a)), new H(x2(a.g), a.h);
    if (d.g.length > 30) {
      if (B2(d) || B2(a)) throw Error("slowDivide_ only works with positive integers.");
      for (var c = z, f = a; f.l(d) <= 0; ) c = I(c), f = I(f);
      var e = J(c, 1), g = J(f, 1);
      f = J(f, 2);
      for (c = J(c, 2); !C2(f); ) {
        var b2 = g.add(f);
        b2.l(d) <= 0 && (e = e.add(c), g = b2);
        f = J(f, 1);
        c = J(c, 1);
      }
      a = F2(d, e.j(a));
      return new H(e, a);
    }
    for (e = w; d.l(a) >= 0; ) {
      c = Math.max(1, Math.floor(d.m() / a.m()));
      f = Math.ceil(Math.log(c) / Math.LN2);
      f = f <= 48 ? 1 : Math.pow(2, f - 48);
      g = v2(c);
      for (b2 = g.j(a); B2(b2) || b2.l(d) > 0; ) c -= f, g = v2(c), b2 = g.j(a);
      C2(g) && (g = z);
      e = e.add(g);
      d = F2(d, b2);
    }
    return new H(e, d);
  }
  __name(D2, "D");
  h.B = function(d) {
    return D2(this, d).h;
  };
  h.and = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f = 0; f < a; f++) c[f] = this.i(f) & d.i(f);
    return new t(c, this.h & d.h);
  };
  h.or = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f = 0; f < a; f++) c[f] = this.i(f) | d.i(f);
    return new t(c, this.h | d.h);
  };
  h.xor = function(d) {
    const a = Math.max(this.g.length, d.g.length), c = [];
    for (let f = 0; f < a; f++) c[f] = this.i(f) ^ d.i(f);
    return new t(c, this.h ^ d.h);
  };
  function I(d) {
    const a = d.g.length + 1, c = [];
    for (let f = 0; f < a; f++) c[f] = d.i(f) << 1 | d.i(f - 1) >>> 31;
    return new t(c, d.h);
  }
  __name(I, "I");
  function J(d, a) {
    const c = a >> 5;
    a %= 32;
    const f = d.g.length - c, e = [];
    for (let g = 0; g < f; g++) e[g] = a > 0 ? d.i(g + c) >>> a | d.i(g + c + 1) << 32 - a : d.i(g + c);
    return new t(e, d.h);
  }
  __name(J, "J");
  m.prototype.digest = m.prototype.A;
  m.prototype.reset = m.prototype.u;
  m.prototype.update = m.prototype.v;
  Md5 = bloom_blob_es2018.Md5 = m;
  t.prototype.add = t.prototype.add;
  t.prototype.multiply = t.prototype.j;
  t.prototype.modulo = t.prototype.B;
  t.prototype.compare = t.prototype.l;
  t.prototype.toNumber = t.prototype.m;
  t.prototype.toString = t.prototype.toString;
  t.prototype.getBits = t.prototype.i;
  t.fromNumber = v2;
  t.fromString = y;
  Integer = bloom_blob_es2018.Integer = t;
}).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

// node_modules/@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js
var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var webchannel_blob_es2018 = {};
var XhrIo;
var FetchXmlHttpFactory;
var WebChannel;
var EventType;
var ErrorCode;
var Stat;
var Event;
var getStatEventTarget;
var createWebChannelTransport;
(function() {
  var _a2, _b;
  var h, aa = Object.defineProperty;
  function ba(a) {
    a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof commonjsGlobal2 && commonjsGlobal2];
    for (var b2 = 0; b2 < a.length; ++b2) {
      var c = a[b2];
      if (c && c.Math == Math) return c;
    }
    throw Error("Cannot find global object");
  }
  __name(ba, "ba");
  var ca = ba(this);
  function da(a, b2) {
    if (b2) a: {
      var c = ca;
      a = a.split(".");
      for (var d = 0; d < a.length - 1; d++) {
        var e = a[d];
        if (!(e in c)) break a;
        c = c[e];
      }
      a = a[a.length - 1];
      d = c[a];
      b2 = b2(d);
      b2 != d && b2 != null && aa(c, a, { configurable: true, writable: true, value: b2 });
    }
  }
  __name(da, "da");
  da("Symbol.dispose", function(a) {
    return a ? a : Symbol("Symbol.dispose");
  });
  da("Array.prototype.values", function(a) {
    return a ? a : function() {
      return this[Symbol.iterator]();
    };
  });
  da("Object.entries", function(a) {
    return a ? a : function(b2) {
      var c = [], d;
      for (d in b2) Object.prototype.hasOwnProperty.call(b2, d) && c.push([d, b2[d]]);
      return c;
    };
  });
  var ea = ea || {}, l = this || self;
  function n(a) {
    var b2 = typeof a;
    return b2 == "object" && a != null || b2 == "function";
  }
  __name(n, "n");
  function fa(a, b2, c) {
    return a.call.apply(a.bind, arguments);
  }
  __name(fa, "fa");
  function p(a, b2, c) {
    p = fa;
    return p.apply(null, arguments);
  }
  __name(p, "p");
  function ha(a, b2) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
      var d = c.slice();
      d.push.apply(d, arguments);
      return a.apply(this, d);
    };
  }
  __name(ha, "ha");
  function t(a, b2) {
    function c() {
    }
    __name(c, "c");
    c.prototype = b2.prototype;
    a.Z = b2.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.Ob = function(d, e, f) {
      for (var g = Array(arguments.length - 2), k = 2; k < arguments.length; k++) g[k - 2] = arguments[k];
      return b2.prototype[e].apply(d, g);
    };
  }
  __name(t, "t");
  var ia = typeof AsyncContext !== "undefined" && typeof AsyncContext.Snapshot === "function" ? (a) => a && AsyncContext.Snapshot.wrap(a) : (a) => a;
  function ja(a) {
    const b2 = a.length;
    if (b2 > 0) {
      const c = Array(b2);
      for (let d = 0; d < b2; d++) c[d] = a[d];
      return c;
    }
    return [];
  }
  __name(ja, "ja");
  function ka(a, b2) {
    for (let d = 1; d < arguments.length; d++) {
      const e = arguments[d];
      var c = typeof e;
      c = c != "object" ? c : e ? Array.isArray(e) ? "array" : c : "null";
      if (c == "array" || c == "object" && typeof e.length == "number") {
        c = a.length || 0;
        const f = e.length || 0;
        a.length = c + f;
        for (let g = 0; g < f; g++) a[c + g] = e[g];
      } else a.push(e);
    }
  }
  __name(ka, "ka");
  const _la = class _la {
    constructor(a, b2) {
      this.i = a;
      this.j = b2;
      this.h = 0;
      this.g = null;
    }
    get() {
      let a;
      this.h > 0 ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
      return a;
    }
  };
  __name(_la, "la");
  let la = _la;
  function ma(a) {
    l.setTimeout(() => {
      throw a;
    }, 0);
  }
  __name(ma, "ma");
  function na() {
    var a = oa;
    let b2 = null;
    a.g && (b2 = a.g, a.g = a.g.next, a.g || (a.h = null), b2.next = null);
    return b2;
  }
  __name(na, "na");
  const _pa = class _pa {
    constructor() {
      this.h = this.g = null;
    }
    add(a, b2) {
      const c = qa.get();
      c.set(a, b2);
      this.h ? this.h.next = c : this.g = c;
      this.h = c;
    }
  };
  __name(_pa, "pa");
  let pa = _pa;
  var qa = new la(() => new ra(), (a) => a.reset());
  const _ra = class _ra {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(a, b2) {
      this.h = a;
      this.g = b2;
      this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  };
  __name(_ra, "ra");
  let ra = _ra;
  let u, v2 = false, oa = new pa(), ta = /* @__PURE__ */ __name(() => {
    const a = Promise.resolve(void 0);
    u = /* @__PURE__ */ __name(() => {
      a.then(sa);
    }, "u");
  }, "ta");
  function sa() {
    for (var a; a = na(); ) {
      try {
        a.h.call(a.g);
      } catch (c) {
        ma(c);
      }
      var b2 = qa;
      b2.j(a);
      b2.h < 100 && (b2.h++, a.next = b2.g, b2.g = a);
    }
    v2 = false;
  }
  __name(sa, "sa");
  function w() {
    this.u = this.u;
    this.C = this.C;
  }
  __name(w, "w");
  w.prototype.u = false;
  w.prototype.dispose = function() {
    this.u || (this.u = true, this.N());
  };
  w.prototype[Symbol.dispose] = function() {
    this.dispose();
  };
  w.prototype.N = function() {
    if (this.C) for (; this.C.length; ) this.C.shift()();
  };
  function x2(a, b2) {
    this.type = a;
    this.g = this.target = b2;
    this.defaultPrevented = false;
  }
  __name(x2, "x");
  x2.prototype.h = function() {
    this.defaultPrevented = true;
  };
  var ua = function() {
    if (!l.addEventListener || !Object.defineProperty) return false;
    var a = false, b2 = Object.defineProperty({}, "passive", { get: /* @__PURE__ */ __name(function() {
      a = true;
    }, "get") });
    try {
      const c = /* @__PURE__ */ __name(() => {
      }, "c");
      l.addEventListener("test", c, b2);
      l.removeEventListener("test", c, b2);
    } catch (c) {
    }
    return a;
  }();
  function y(a) {
    return /^[\s\xa0]*$/.test(a);
  }
  __name(y, "y");
  function z(a, b2) {
    x2.call(this, a ? a.type : "");
    this.relatedTarget = this.g = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.i = null;
    a && this.init(a, b2);
  }
  __name(z, "z");
  t(z, x2);
  z.prototype.init = function(a, b2) {
    const c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b2;
    b2 = a.relatedTarget;
    b2 || (c == "mouseover" ? b2 = a.fromElement : c == "mouseout" && (b2 = a.toElement));
    this.relatedTarget = b2;
    d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = a.pointerType;
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && z.Z.h.call(this);
  };
  z.prototype.h = function() {
    z.Z.h.call(this);
    const a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = false;
  };
  var B2 = "closure_listenable_" + (Math.random() * 1e6 | 0);
  var va = 0;
  function wa(a, b2, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b2;
    this.type = c;
    this.capture = !!d;
    this.ha = e;
    this.key = ++va;
    this.da = this.fa = false;
  }
  __name(wa, "wa");
  function xa(a) {
    a.da = true;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.ha = null;
  }
  __name(xa, "xa");
  function ya(a, b2, c) {
    for (const d in a) b2.call(c, a[d], d, a);
  }
  __name(ya, "ya");
  function Aa(a, b2) {
    for (const c in a) b2.call(void 0, a[c], c, a);
  }
  __name(Aa, "Aa");
  function Ba(a) {
    const b2 = {};
    for (const c in a) b2[c] = a[c];
    return b2;
  }
  __name(Ba, "Ba");
  const Ca = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function Da(a, b2) {
    let c, d;
    for (let e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d) a[c] = d[c];
      for (let f = 0; f < Ca.length; f++) c = Ca[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
  __name(Da, "Da");
  function Ea(a) {
    this.src = a;
    this.g = {};
    this.h = 0;
  }
  __name(Ea, "Ea");
  Ea.prototype.add = function(a, b2, c, d, e) {
    const f = a.toString();
    a = this.g[f];
    a || (a = this.g[f] = [], this.h++);
    const g = Fa(a, b2, d, e);
    g > -1 ? (b2 = a[g], c || (b2.fa = false)) : (b2 = new wa(b2, this.src, f, !!d, e), b2.fa = c, a.push(b2));
    return b2;
  };
  function Ga(a, b2) {
    const c = b2.type;
    if (c in a.g) {
      var d = a.g[c], e = Array.prototype.indexOf.call(d, b2, void 0), f;
      (f = e >= 0) && Array.prototype.splice.call(d, e, 1);
      f && (xa(b2), a.g[c].length == 0 && (delete a.g[c], a.h--));
    }
  }
  __name(Ga, "Ga");
  function Fa(a, b2, c, d) {
    for (let e = 0; e < a.length; ++e) {
      const f = a[e];
      if (!f.da && f.listener == b2 && f.capture == !!c && f.ha == d) return e;
    }
    return -1;
  }
  __name(Fa, "Fa");
  var Ha = "closure_lm_" + (Math.random() * 1e6 | 0), Ia = {};
  function Ka(a, b2, c, d, e) {
    if (d && d.once) return La(a, b2, c, d, e);
    if (Array.isArray(b2)) {
      for (let f = 0; f < b2.length; f++) Ka(a, b2[f], c, d, e);
      return null;
    }
    c = Ma(c);
    return a && a[B2] ? a.J(b2, c, n(d) ? !!d.capture : !!d, e) : Na(a, b2, c, false, d, e);
  }
  __name(Ka, "Ka");
  function Na(a, b2, c, d, e, f) {
    if (!b2) throw Error("Invalid event type");
    const g = n(e) ? !!e.capture : !!e;
    let k = Oa(a);
    k || (a[Ha] = k = new Ea(a));
    c = k.add(b2, c, d, g, f);
    if (c.proxy) return c;
    d = Pa();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener) ua || (e = g), e === void 0 && (e = false), a.addEventListener(b2.toString(), d, e);
    else if (a.attachEvent) a.attachEvent(Qa(b2.toString()), d);
    else if (a.addListener && a.removeListener) a.addListener(d);
    else throw Error("addEventListener and attachEvent are unavailable.");
    return c;
  }
  __name(Na, "Na");
  function Pa() {
    function a(c) {
      return b2.call(a.src, a.listener, c);
    }
    __name(a, "a");
    const b2 = Ra;
    return a;
  }
  __name(Pa, "Pa");
  function La(a, b2, c, d, e) {
    if (Array.isArray(b2)) {
      for (let f = 0; f < b2.length; f++) La(a, b2[f], c, d, e);
      return null;
    }
    c = Ma(c);
    return a && a[B2] ? a.K(b2, c, n(d) ? !!d.capture : !!d, e) : Na(a, b2, c, true, d, e);
  }
  __name(La, "La");
  function Sa(a, b2, c, d, e) {
    if (Array.isArray(b2)) for (var f = 0; f < b2.length; f++) Sa(a, b2[f], c, d, e);
    else (d = n(d) ? !!d.capture : !!d, c = Ma(c), a && a[B2]) ? (a = a.i, f = String(b2).toString(), f in a.g && (b2 = a.g[f], c = Fa(b2, c, d, e), c > -1 && (xa(b2[c]), Array.prototype.splice.call(b2, c, 1), b2.length == 0 && (delete a.g[f], a.h--)))) : a && (a = Oa(a)) && (b2 = a.g[b2.toString()], a = -1, b2 && (a = Fa(b2, c, d, e)), (c = a > -1 ? b2[a] : null) && Ta(c));
  }
  __name(Sa, "Sa");
  function Ta(a) {
    if (typeof a !== "number" && a && !a.da) {
      var b2 = a.src;
      if (b2 && b2[B2]) Ga(b2.i, a);
      else {
        var c = a.type, d = a.proxy;
        b2.removeEventListener ? b2.removeEventListener(c, d, a.capture) : b2.detachEvent ? b2.detachEvent(Qa(c), d) : b2.addListener && b2.removeListener && b2.removeListener(d);
        (c = Oa(b2)) ? (Ga(c, a), c.h == 0 && (c.src = null, b2[Ha] = null)) : xa(a);
      }
    }
  }
  __name(Ta, "Ta");
  function Qa(a) {
    return a in Ia ? Ia[a] : Ia[a] = "on" + a;
  }
  __name(Qa, "Qa");
  function Ra(a, b2) {
    if (a.da) a = true;
    else {
      b2 = new z(b2, this);
      const c = a.listener, d = a.ha || a.src;
      a.fa && Ta(a);
      a = c.call(d, b2);
    }
    return a;
  }
  __name(Ra, "Ra");
  function Oa(a) {
    a = a[Ha];
    return a instanceof Ea ? a : null;
  }
  __name(Oa, "Oa");
  var Ua = "__closure_events_fn_" + (Math.random() * 1e9 >>> 0);
  function Ma(a) {
    if (typeof a === "function") return a;
    a[Ua] || (a[Ua] = function(b2) {
      return a.handleEvent(b2);
    });
    return a[Ua];
  }
  __name(Ma, "Ma");
  function C2() {
    w.call(this);
    this.i = new Ea(this);
    this.M = this;
    this.G = null;
  }
  __name(C2, "C");
  t(C2, w);
  C2.prototype[B2] = true;
  C2.prototype.removeEventListener = function(a, b2, c, d) {
    Sa(this, a, b2, c, d);
  };
  function D2(a, b2) {
    var c, d = a.G;
    if (d) for (c = []; d; d = d.G) c.push(d);
    a = a.M;
    d = b2.type || b2;
    if (typeof b2 === "string") b2 = new x2(b2, a);
    else if (b2 instanceof x2) b2.target = b2.target || a;
    else {
      var e = b2;
      b2 = new x2(d, a);
      Da(b2, e);
    }
    e = true;
    let f, g;
    if (c) for (g = c.length - 1; g >= 0; g--) f = b2.g = c[g], e = Va(f, d, true, b2) && e;
    f = b2.g = a;
    e = Va(f, d, true, b2) && e;
    e = Va(f, d, false, b2) && e;
    if (c) for (g = 0; g < c.length; g++) f = b2.g = c[g], e = Va(f, d, false, b2) && e;
  }
  __name(D2, "D");
  C2.prototype.N = function() {
    C2.Z.N.call(this);
    if (this.i) {
      var a = this.i;
      for (const c in a.g) {
        const d = a.g[c];
        for (let e = 0; e < d.length; e++) xa(d[e]);
        delete a.g[c];
        a.h--;
      }
    }
    this.G = null;
  };
  C2.prototype.J = function(a, b2, c, d) {
    return this.i.add(String(a), b2, false, c, d);
  };
  C2.prototype.K = function(a, b2, c, d) {
    return this.i.add(String(a), b2, true, c, d);
  };
  function Va(a, b2, c, d) {
    b2 = a.i.g[String(b2)];
    if (!b2) return true;
    b2 = b2.concat();
    let e = true;
    for (let f = 0; f < b2.length; ++f) {
      const g = b2[f];
      if (g && !g.da && g.capture == c) {
        const k = g.listener, q2 = g.ha || g.src;
        g.fa && Ga(a.i, g);
        e = k.call(q2, d) !== false && e;
      }
    }
    return e && !d.defaultPrevented;
  }
  __name(Va, "Va");
  function Wa(a, b2) {
    if (typeof a !== "function") if (a && typeof a.handleEvent == "function") a = p(a.handleEvent, a);
    else throw Error("Invalid listener argument");
    return Number(b2) > 2147483647 ? -1 : l.setTimeout(a, b2 || 0);
  }
  __name(Wa, "Wa");
  function Xa(a) {
    a.g = Wa(() => {
      a.g = null;
      a.i && (a.i = false, Xa(a));
    }, a.l);
    const b2 = a.h;
    a.h = null;
    a.m.apply(null, b2);
  }
  __name(Xa, "Xa");
  const _Ya = class _Ya extends w {
    constructor(a, b2) {
      super();
      this.m = a;
      this.l = b2;
      this.h = null;
      this.i = false;
      this.g = null;
    }
    j(a) {
      this.h = arguments;
      this.g ? this.i = true : Xa(this);
    }
    N() {
      super.N();
      this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
    }
  };
  __name(_Ya, "Ya");
  let Ya = _Ya;
  function E(a) {
    w.call(this);
    this.h = a;
    this.g = {};
  }
  __name(E, "E");
  t(E, w);
  var Za = [];
  function $a(a) {
    ya(a.g, function(b2, c) {
      this.g.hasOwnProperty(c) && Ta(b2);
    }, a);
    a.g = {};
  }
  __name($a, "$a");
  E.prototype.N = function() {
    E.Z.N.call(this);
    $a(this);
  };
  E.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
  };
  var ab = l.JSON.stringify;
  var cb = l.JSON.parse;
  var db2 = (_a2 = class {
    stringify(a) {
      return l.JSON.stringify(a, void 0);
    }
    parse(a) {
      return l.JSON.parse(a, void 0);
    }
  }, __name(_a2, "db"), _a2);
  function eb() {
  }
  __name(eb, "eb");
  function fb() {
  }
  __name(fb, "fb");
  var H = { OPEN: "a", hb: "b", ERROR: "c", tb: "d" };
  function gb() {
    x2.call(this, "d");
  }
  __name(gb, "gb");
  t(gb, x2);
  function hb() {
    x2.call(this, "c");
  }
  __name(hb, "hb");
  t(hb, x2);
  var I = {}, ib = null;
  function jb() {
    return ib = ib || new C2();
  }
  __name(jb, "jb");
  I.Ia = "serverreachability";
  function kb(a) {
    x2.call(this, I.Ia, a);
  }
  __name(kb, "kb");
  t(kb, x2);
  function lb(a) {
    const b2 = jb();
    D2(b2, new kb(b2));
  }
  __name(lb, "lb");
  I.STAT_EVENT = "statevent";
  function mb(a, b2) {
    x2.call(this, I.STAT_EVENT, a);
    this.stat = b2;
  }
  __name(mb, "mb");
  t(mb, x2);
  function J(a) {
    const b2 = jb();
    D2(b2, new mb(b2, a));
  }
  __name(J, "J");
  I.Ja = "timingevent";
  function nb(a, b2) {
    x2.call(this, I.Ja, a);
    this.size = b2;
  }
  __name(nb, "nb");
  t(nb, x2);
  function ob(a, b2) {
    if (typeof a !== "function") throw Error("Fn must not be null and must be a function");
    return l.setTimeout(function() {
      a();
    }, b2);
  }
  __name(ob, "ob");
  function pb() {
    this.g = true;
  }
  __name(pb, "pb");
  pb.prototype.ua = function() {
    this.g = false;
  };
  function qb(a, b2, c, d, e, f) {
    a.info(function() {
      if (a.g) if (f) {
        var g = "";
        var k = f.split("&");
        for (let m = 0; m < k.length; m++) {
          var q2 = k[m].split("=");
          if (q2.length > 1) {
            const r = q2[0];
            q2 = q2[1];
            const A = r.split("_");
            g = A.length >= 2 && A[1] == "type" ? g + (r + "=" + q2 + "&") : g + (r + "=redacted&");
          }
        }
      } else g = null;
      else g = f;
      return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b2 + "\n" + c + "\n" + g;
    });
  }
  __name(qb, "qb");
  function rb(a, b2, c, d, e, f, g) {
    a.info(function() {
      return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b2 + "\n" + c + "\n" + f + " " + g;
    });
  }
  __name(rb, "rb");
  function K(a, b2, c, d) {
    a.info(function() {
      return "XMLHTTP TEXT (" + b2 + "): " + sb(a, c) + (d ? " " + d : "");
    });
  }
  __name(K, "K");
  function tb(a, b2) {
    a.info(function() {
      return "TIMEOUT: " + b2;
    });
  }
  __name(tb, "tb");
  pb.prototype.info = function() {
  };
  function sb(a, b2) {
    if (!a.g) return b2;
    if (!b2) return null;
    try {
      const f = JSON.parse(b2);
      if (f) {
        for (a = 0; a < f.length; a++) if (Array.isArray(f[a])) {
          var c = f[a];
          if (!(c.length < 2)) {
            var d = c[1];
            if (Array.isArray(d) && !(d.length < 1)) {
              var e = d[0];
              if (e != "noop" && e != "stop" && e != "close") for (let g = 1; g < d.length; g++) d[g] = "";
            }
          }
        }
      }
      return ab(f);
    } catch (f) {
      return b2;
    }
  }
  __name(sb, "sb");
  var ub = { NO_ERROR: 0, cb: 1, qb: 2, pb: 3, kb: 4, ob: 5, rb: 6, Ga: 7, TIMEOUT: 8, ub: 9 };
  var vb = { ib: "complete", Fb: "success", ERROR: "error", Ga: "abort", xb: "ready", yb: "readystatechange", TIMEOUT: "timeout", sb: "incrementaldata", wb: "progress", lb: "downloadprogress", Nb: "uploadprogress" };
  var wb;
  function xb() {
  }
  __name(xb, "xb");
  t(xb, eb);
  xb.prototype.g = function() {
    return new XMLHttpRequest();
  };
  wb = new xb();
  function L2(a) {
    return encodeURIComponent(String(a));
  }
  __name(L2, "L");
  function yb(a) {
    var b2 = 1;
    a = a.split(":");
    const c = [];
    for (; b2 > 0 && a.length; ) c.push(a.shift()), b2--;
    a.length && c.push(a.join(":"));
    return c;
  }
  __name(yb, "yb");
  function N2(a, b2, c, d) {
    this.j = a;
    this.i = b2;
    this.l = c;
    this.S = d || 1;
    this.V = new E(this);
    this.H = 45e3;
    this.J = null;
    this.o = false;
    this.u = this.B = this.A = this.M = this.F = this.T = this.D = null;
    this.G = [];
    this.g = null;
    this.C = 0;
    this.m = this.v = null;
    this.X = -1;
    this.K = false;
    this.P = 0;
    this.O = null;
    this.W = this.L = this.U = this.R = false;
    this.h = new zb();
  }
  __name(N2, "N");
  function zb() {
    this.i = null;
    this.g = "";
    this.h = false;
  }
  __name(zb, "zb");
  var Ab = {}, Bb = {};
  function Cb(a, b2, c) {
    a.M = 1;
    a.A = Db(O2(b2));
    a.u = c;
    a.R = true;
    Eb(a, null);
  }
  __name(Cb, "Cb");
  function Eb(a, b2) {
    a.F = Date.now();
    Fb(a);
    a.B = O2(a.A);
    var c = a.B, d = a.S;
    Array.isArray(d) || (d = [String(d)]);
    Gb(c.i, "t", d);
    a.C = 0;
    c = a.j.L;
    a.h = new zb();
    a.g = Hb(a.j, c ? b2 : null, !a.u);
    a.P > 0 && (a.O = new Ya(p(a.Y, a, a.g), a.P));
    b2 = a.V;
    c = a.g;
    d = a.ba;
    var e = "readystatechange";
    Array.isArray(e) || (e && (Za[0] = e.toString()), e = Za);
    for (let f = 0; f < e.length; f++) {
      const g = Ka(c, e[f], d || b2.handleEvent, false, b2.h || b2);
      if (!g) break;
      b2.g[g.key] = g;
    }
    b2 = a.J ? Ba(a.J) : {};
    a.u ? (a.v || (a.v = "POST"), b2["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(
      a.B,
      a.v,
      a.u,
      b2
    )) : (a.v = "GET", a.g.ea(a.B, a.v, null, b2));
    lb();
    qb(a.i, a.v, a.B, a.l, a.S, a.u);
  }
  __name(Eb, "Eb");
  N2.prototype.ba = function(a) {
    a = a.target;
    const b2 = this.O;
    b2 && P(a) == 3 ? b2.j() : this.Y(a);
  };
  N2.prototype.Y = function(a) {
    try {
      if (a == this.g) a: {
        const k = P(this.g), q2 = this.g.ya(), m = this.g.ca();
        if (!(k < 3) && (k != 3 || this.g && (this.h.h || this.g.la() || Ib(this.g)))) {
          this.K || k != 4 || q2 == 7 || (q2 == 8 || m <= 0 ? lb(3) : lb(2));
          Jb(this);
          var b2 = this.g.ca();
          this.X = b2;
          var c = Kb(this);
          this.o = b2 == 200;
          rb(this.i, this.v, this.B, this.l, this.S, k, b2);
          if (this.o) {
            if (this.U && !this.L) {
              b: {
                if (this.g) {
                  var d, e = this.g;
                  if ((d = e.g ? e.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !y(d)) {
                    var f = d;
                    break b;
                  }
                }
                f = null;
              }
              if (a = f) K(this.i, this.l, a, "Initial handshake response via X-HTTP-Initial-Response"), this.L = true, Lb(this, a);
              else {
                this.o = false;
                this.m = 3;
                J(12);
                Q(this);
                Mb(this);
                break a;
              }
            }
            if (this.R) {
              a = true;
              let r;
              for (; !this.K && this.C < c.length; ) if (r = Nb(this, c), r == Bb) {
                k == 4 && (this.m = 4, J(14), a = false);
                K(this.i, this.l, null, "[Incomplete Response]");
                break;
              } else if (r == Ab) {
                this.m = 4;
                J(15);
                K(this.i, this.l, c, "[Invalid Chunk]");
                a = false;
                break;
              } else K(this.i, this.l, r, null), Lb(this, r);
              Ob(this) && this.C != 0 && (this.h.g = this.h.g.slice(this.C), this.C = 0);
              k != 4 || c.length != 0 || this.h.h || (this.m = 1, J(16), a = false);
              this.o = this.o && a;
              if (!a) K(
                this.i,
                this.l,
                c,
                "[Invalid Chunked Response]"
              ), Q(this), Mb(this);
              else if (c.length > 0 && !this.W) {
                this.W = true;
                var g = this.j;
                g.g == this && g.aa && !g.P && (g.j.info("Great, no buffering proxy detected. Bytes received: " + c.length), Pb(g), g.P = true, J(11));
              }
            } else K(this.i, this.l, c, null), Lb(this, c);
            k == 4 && Q(this);
            this.o && !this.K && (k == 4 ? Qb(this.j, this) : (this.o = false, Fb(this)));
          } else Rb(this.g), b2 == 400 && c.indexOf("Unknown SID") > 0 ? (this.m = 3, J(12)) : (this.m = 0, J(13)), Q(this), Mb(this);
        }
      }
    } catch (k) {
    } finally {
    }
  };
  function Kb(a) {
    if (!Ob(a)) return a.g.la();
    const b2 = Ib(a.g);
    if (b2 === "") return "";
    let c = "";
    const d = b2.length, e = P(a.g) == 4;
    if (!a.h.i) {
      if (typeof TextDecoder === "undefined") return Q(a), Mb(a), "";
      a.h.i = new l.TextDecoder();
    }
    for (let f = 0; f < d; f++) a.h.h = true, c += a.h.i.decode(b2[f], { stream: !(e && f == d - 1) });
    b2.length = 0;
    a.h.g += c;
    a.C = 0;
    return a.h.g;
  }
  __name(Kb, "Kb");
  function Ob(a) {
    return a.g ? a.v == "GET" && a.M != 2 && a.j.Aa : false;
  }
  __name(Ob, "Ob");
  function Nb(a, b2) {
    var c = a.C, d = b2.indexOf("\n", c);
    if (d == -1) return Bb;
    c = Number(b2.substring(c, d));
    if (isNaN(c)) return Ab;
    d += 1;
    if (d + c > b2.length) return Bb;
    b2 = b2.slice(d, d + c);
    a.C = d + c;
    return b2;
  }
  __name(Nb, "Nb");
  N2.prototype.cancel = function() {
    this.K = true;
    Q(this);
  };
  function Fb(a) {
    a.T = Date.now() + a.H;
    Sb(a, a.H);
  }
  __name(Fb, "Fb");
  function Sb(a, b2) {
    if (a.D != null) throw Error("WatchDog timer not null");
    a.D = ob(p(a.aa, a), b2);
  }
  __name(Sb, "Sb");
  function Jb(a) {
    a.D && (l.clearTimeout(a.D), a.D = null);
  }
  __name(Jb, "Jb");
  N2.prototype.aa = function() {
    this.D = null;
    const a = Date.now();
    a - this.T >= 0 ? (tb(this.i, this.B), this.M != 2 && (lb(), J(17)), Q(this), this.m = 2, Mb(this)) : Sb(this, this.T - a);
  };
  function Mb(a) {
    a.j.I == 0 || a.K || Qb(a.j, a);
  }
  __name(Mb, "Mb");
  function Q(a) {
    Jb(a);
    var b2 = a.O;
    b2 && typeof b2.dispose == "function" && b2.dispose();
    a.O = null;
    $a(a.V);
    a.g && (b2 = a.g, a.g = null, b2.abort(), b2.dispose());
  }
  __name(Q, "Q");
  function Lb(a, b2) {
    try {
      var c = a.j;
      if (c.I != 0 && (c.g == a || Tb(c.h, a))) {
        if (!a.L && Tb(c.h, a) && c.I == 3) {
          try {
            var d = c.Ba.g.parse(b2);
          } catch (m) {
            d = null;
          }
          if (Array.isArray(d) && d.length == 3) {
            var e = d;
            if (e[0] == 0) a: {
              if (!c.v) {
                if (c.g) if (c.g.F + 3e3 < a.F) Ub(c), Vb(c);
                else break a;
                Wb(c);
                J(18);
              }
            }
            else c.xa = e[1], 0 < c.xa - c.K && e[2] < 37500 && c.F && c.A == 0 && !c.C && (c.C = ob(p(c.Va, c), 6e3));
            Xb(c.h) <= 1 && c.ta && (c.ta = void 0);
          } else R(c, 11);
        } else if ((a.L || c.g == a) && Ub(c), !y(b2)) for (e = c.Ba.g.parse(b2), b2 = 0; b2 < e.length; b2++) {
          let m = e[b2];
          const r = m[0];
          if (!(r <= c.K)) if (c.K = r, m = m[1], c.I == 2) if (m[0] == "c") {
            c.M = m[1];
            c.ba = m[2];
            const A = m[3];
            A != null && (c.ka = A, c.j.info("VER=" + c.ka));
            const M2 = m[4];
            M2 != null && (c.za = M2, c.j.info("SVER=" + c.za));
            const F2 = m[5];
            F2 != null && typeof F2 === "number" && F2 > 0 && (d = 1.5 * F2, c.O = d, c.j.info("backChannelRequestTimeoutMs_=" + d));
            d = c;
            const G2 = a.g;
            if (G2) {
              const za = G2.g ? G2.g.getResponseHeader("X-Client-Wire-Protocol") : null;
              if (za) {
                var f = d.h;
                f.g || za.indexOf("spdy") == -1 && za.indexOf("quic") == -1 && za.indexOf("h2") == -1 || (f.j = f.l, f.g = /* @__PURE__ */ new Set(), f.h && (Yb(f, f.h), f.h = null));
              }
              if (d.G) {
                const bb = G2.g ? G2.g.getResponseHeader("X-HTTP-Session-Id") : null;
                bb && (d.wa = bb, S2(d.J, d.G, bb));
              }
            }
            c.I = 3;
            c.l && c.l.ra();
            c.aa && (c.T = Date.now() - a.F, c.j.info("Handshake RTT: " + c.T + "ms"));
            d = c;
            var g = a;
            d.na = Zb(d, d.L ? d.ba : null, d.W);
            if (g.L) {
              $b(d.h, g);
              var k = g, q2 = d.O;
              q2 && (k.H = q2);
              k.D && (Jb(k), Fb(k));
              d.g = g;
            } else ac(d);
            c.i.length > 0 && bc(c);
          } else m[0] != "stop" && m[0] != "close" || R(c, 7);
          else c.I == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? R(c, 7) : cc(c) : m[0] != "noop" && c.l && c.l.qa(m), c.A = 0);
        }
      }
      lb(4);
    } catch (m) {
    }
  }
  __name(Lb, "Lb");
  var dc = (_b = class {
    constructor(a, b2) {
      this.g = a;
      this.map = b2;
    }
  }, __name(_b, "dc"), _b);
  function ec(a) {
    this.l = a || 10;
    l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = a.length > 0 && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.chrome && l.chrome.loadTimes && l.chrome.loadTimes() && l.chrome.loadTimes().wasFetchedViaSpdy);
    this.j = a ? this.l : 1;
    this.g = null;
    this.j > 1 && (this.g = /* @__PURE__ */ new Set());
    this.h = null;
    this.i = [];
  }
  __name(ec, "ec");
  function fc(a) {
    return a.h ? true : a.g ? a.g.size >= a.j : false;
  }
  __name(fc, "fc");
  function Xb(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
  }
  __name(Xb, "Xb");
  function Tb(a, b2) {
    return a.h ? a.h == b2 : a.g ? a.g.has(b2) : false;
  }
  __name(Tb, "Tb");
  function Yb(a, b2) {
    a.g ? a.g.add(b2) : a.h = b2;
  }
  __name(Yb, "Yb");
  function $b(a, b2) {
    a.h && a.h == b2 ? a.h = null : a.g && a.g.has(b2) && a.g.delete(b2);
  }
  __name($b, "$b");
  ec.prototype.cancel = function() {
    this.i = hc(this);
    if (this.h) this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
      for (const a of this.g.values()) a.cancel();
      this.g.clear();
    }
  };
  function hc(a) {
    if (a.h != null) return a.i.concat(a.h.G);
    if (a.g != null && a.g.size !== 0) {
      let b2 = a.i;
      for (const c of a.g.values()) b2 = b2.concat(c.G);
      return b2;
    }
    return ja(a.i);
  }
  __name(hc, "hc");
  var ic = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
  function jc(a, b2) {
    if (a) {
      a = a.split("&");
      for (let c = 0; c < a.length; c++) {
        const d = a[c].indexOf("=");
        let e, f = null;
        d >= 0 ? (e = a[c].substring(0, d), f = a[c].substring(d + 1)) : e = a[c];
        b2(e, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "");
      }
    }
  }
  __name(jc, "jc");
  function T(a) {
    this.g = this.o = this.j = "";
    this.u = null;
    this.m = this.h = "";
    this.l = false;
    let b2;
    a instanceof T ? (this.l = a.l, kc(this, a.j), this.o = a.o, this.g = a.g, lc(this, a.u), this.h = a.h, mc(this, nc(a.i)), this.m = a.m) : a && (b2 = String(a).match(ic)) ? (this.l = false, kc(this, b2[1] || "", true), this.o = oc(b2[2] || ""), this.g = oc(b2[3] || "", true), lc(this, b2[4]), this.h = oc(b2[5] || "", true), mc(this, b2[6] || "", true), this.m = oc(b2[7] || "")) : (this.l = false, this.i = new pc(null, this.l));
  }
  __name(T, "T");
  T.prototype.toString = function() {
    const a = [];
    var b2 = this.j;
    b2 && a.push(qc(b2, rc, true), ":");
    var c = this.g;
    if (c || b2 == "file") a.push("//"), (b2 = this.o) && a.push(qc(b2, rc, true), "@"), a.push(L2(c).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.u, c != null && a.push(":", String(c));
    if (c = this.h) this.g && c.charAt(0) != "/" && a.push("/"), a.push(qc(c, c.charAt(0) == "/" ? sc : tc, true));
    (c = this.i.toString()) && a.push("?", c);
    (c = this.m) && a.push("#", qc(c, uc));
    return a.join("");
  };
  T.prototype.resolve = function(a) {
    const b2 = O2(this);
    let c = !!a.j;
    c ? kc(b2, a.j) : c = !!a.o;
    c ? b2.o = a.o : c = !!a.g;
    c ? b2.g = a.g : c = a.u != null;
    var d = a.h;
    if (c) lc(b2, a.u);
    else if (c = !!a.h) {
      if (d.charAt(0) != "/") if (this.g && !this.h) d = "/" + d;
      else {
        var e = b2.h.lastIndexOf("/");
        e != -1 && (d = b2.h.slice(0, e + 1) + d);
      }
      e = d;
      if (e == ".." || e == ".") d = "";
      else if (e.indexOf("./") != -1 || e.indexOf("/.") != -1) {
        d = e.lastIndexOf("/", 0) == 0;
        e = e.split("/");
        const f = [];
        for (let g = 0; g < e.length; ) {
          const k = e[g++];
          k == "." ? d && g == e.length && f.push("") : k == ".." ? ((f.length > 1 || f.length == 1 && f[0] != "") && f.pop(), d && g == e.length && f.push("")) : (f.push(k), d = true);
        }
        d = f.join("/");
      } else d = e;
    }
    c ? b2.h = d : c = a.i.toString() !== "";
    c ? mc(b2, nc(a.i)) : c = !!a.m;
    c && (b2.m = a.m);
    return b2;
  };
  function O2(a) {
    return new T(a);
  }
  __name(O2, "O");
  function kc(a, b2, c) {
    a.j = c ? oc(b2, true) : b2;
    a.j && (a.j = a.j.replace(/:$/, ""));
  }
  __name(kc, "kc");
  function lc(a, b2) {
    if (b2) {
      b2 = Number(b2);
      if (isNaN(b2) || b2 < 0) throw Error("Bad port number " + b2);
      a.u = b2;
    } else a.u = null;
  }
  __name(lc, "lc");
  function mc(a, b2, c) {
    b2 instanceof pc ? (a.i = b2, vc(a.i, a.l)) : (c || (b2 = qc(b2, wc)), a.i = new pc(b2, a.l));
  }
  __name(mc, "mc");
  function S2(a, b2, c) {
    a.i.set(b2, c);
  }
  __name(S2, "S");
  function Db(a) {
    S2(a, "zx", Math.floor(Math.random() * 2147483648).toString(36) + Math.abs(Math.floor(Math.random() * 2147483648) ^ Date.now()).toString(36));
    return a;
  }
  __name(Db, "Db");
  function oc(a, b2) {
    return a ? b2 ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }
  __name(oc, "oc");
  function qc(a, b2, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b2, xc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }
  __name(qc, "qc");
  function xc(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }
  __name(xc, "xc");
  var rc = /[#\/\?@]/g, tc = /[#\?:]/g, sc = /[#\?]/g, wc = /[#\?@]/g, uc = /#/g;
  function pc(a, b2) {
    this.h = this.g = null;
    this.i = a || null;
    this.j = !!b2;
  }
  __name(pc, "pc");
  function U2(a) {
    a.g || (a.g = /* @__PURE__ */ new Map(), a.h = 0, a.i && jc(a.i, function(b2, c) {
      a.add(decodeURIComponent(b2.replace(/\+/g, " ")), c);
    }));
  }
  __name(U2, "U");
  h = pc.prototype;
  h.add = function(a, b2) {
    U2(this);
    this.i = null;
    a = V(this, a);
    let c = this.g.get(a);
    c || this.g.set(a, c = []);
    c.push(b2);
    this.h += 1;
    return this;
  };
  function yc(a, b2) {
    U2(a);
    b2 = V(a, b2);
    a.g.has(b2) && (a.i = null, a.h -= a.g.get(b2).length, a.g.delete(b2));
  }
  __name(yc, "yc");
  function zc(a, b2) {
    U2(a);
    b2 = V(a, b2);
    return a.g.has(b2);
  }
  __name(zc, "zc");
  h.forEach = function(a, b2) {
    U2(this);
    this.g.forEach(function(c, d) {
      c.forEach(function(e) {
        a.call(b2, e, d, this);
      }, this);
    }, this);
  };
  function Ac(a, b2) {
    U2(a);
    let c = [];
    if (typeof b2 === "string") zc(a, b2) && (c = c.concat(a.g.get(V(a, b2))));
    else for (a = Array.from(a.g.values()), b2 = 0; b2 < a.length; b2++) c = c.concat(a[b2]);
    return c;
  }
  __name(Ac, "Ac");
  h.set = function(a, b2) {
    U2(this);
    this.i = null;
    a = V(this, a);
    zc(this, a) && (this.h -= this.g.get(a).length);
    this.g.set(a, [b2]);
    this.h += 1;
    return this;
  };
  h.get = function(a, b2) {
    if (!a) return b2;
    a = Ac(this, a);
    return a.length > 0 ? String(a[0]) : b2;
  };
  function Gb(a, b2, c) {
    yc(a, b2);
    c.length > 0 && (a.i = null, a.g.set(V(a, b2), ja(c)), a.h += c.length);
  }
  __name(Gb, "Gb");
  h.toString = function() {
    if (this.i) return this.i;
    if (!this.g) return "";
    const a = [], b2 = Array.from(this.g.keys());
    for (let d = 0; d < b2.length; d++) {
      var c = b2[d];
      const e = L2(c);
      c = Ac(this, c);
      for (let f = 0; f < c.length; f++) {
        let g = e;
        c[f] !== "" && (g += "=" + L2(c[f]));
        a.push(g);
      }
    }
    return this.i = a.join("&");
  };
  function nc(a) {
    const b2 = new pc();
    b2.i = a.i;
    a.g && (b2.g = new Map(a.g), b2.h = a.h);
    return b2;
  }
  __name(nc, "nc");
  function V(a, b2) {
    b2 = String(b2);
    a.j && (b2 = b2.toLowerCase());
    return b2;
  }
  __name(V, "V");
  function vc(a, b2) {
    b2 && !a.j && (U2(a), a.i = null, a.g.forEach(function(c, d) {
      const e = d.toLowerCase();
      d != e && (yc(this, d), Gb(this, e, c));
    }, a));
    a.j = b2;
  }
  __name(vc, "vc");
  function Bc(a, b2) {
    const c = new pb();
    if (l.Image) {
      const d = new Image();
      d.onload = ha(W2, c, "TestLoadImage: loaded", true, b2, d);
      d.onerror = ha(W2, c, "TestLoadImage: error", false, b2, d);
      d.onabort = ha(W2, c, "TestLoadImage: abort", false, b2, d);
      d.ontimeout = ha(W2, c, "TestLoadImage: timeout", false, b2, d);
      l.setTimeout(function() {
        if (d.ontimeout) d.ontimeout();
      }, 1e4);
      d.src = a;
    } else b2(false);
  }
  __name(Bc, "Bc");
  function Cc(a, b2) {
    const c = new pb(), d = new AbortController(), e = setTimeout(() => {
      d.abort();
      W2(c, "TestPingServer: timeout", false, b2);
    }, 1e4);
    fetch(a, { signal: d.signal }).then((f) => {
      clearTimeout(e);
      f.ok ? W2(c, "TestPingServer: ok", true, b2) : W2(c, "TestPingServer: server error", false, b2);
    }).catch(() => {
      clearTimeout(e);
      W2(c, "TestPingServer: error", false, b2);
    });
  }
  __name(Cc, "Cc");
  function W2(a, b2, c, d, e) {
    try {
      e && (e.onload = null, e.onerror = null, e.onabort = null, e.ontimeout = null), d(c);
    } catch (f) {
    }
  }
  __name(W2, "W");
  function Dc() {
    this.g = new db2();
  }
  __name(Dc, "Dc");
  function Ec(a) {
    this.i = a.Sb || null;
    this.h = a.ab || false;
  }
  __name(Ec, "Ec");
  t(Ec, eb);
  Ec.prototype.g = function() {
    return new Fc(this.i, this.h);
  };
  function Fc(a, b2) {
    C2.call(this);
    this.H = a;
    this.o = b2;
    this.m = void 0;
    this.status = this.readyState = 0;
    this.responseType = this.responseText = this.response = this.statusText = "";
    this.onreadystatechange = null;
    this.A = new Headers();
    this.h = null;
    this.F = "GET";
    this.D = "";
    this.g = false;
    this.B = this.j = this.l = null;
    this.v = new AbortController();
  }
  __name(Fc, "Fc");
  t(Fc, C2);
  h = Fc.prototype;
  h.open = function(a, b2) {
    if (this.readyState != 0) throw this.abort(), Error("Error reopening a connection");
    this.F = a;
    this.D = b2;
    this.readyState = 1;
    Gc(this);
  };
  h.send = function(a) {
    if (this.readyState != 1) throw this.abort(), Error("need to call open() first. ");
    if (this.v.signal.aborted) throw this.abort(), Error("Request was aborted.");
    this.g = true;
    const b2 = { headers: this.A, method: this.F, credentials: this.m, cache: void 0, signal: this.v.signal };
    a && (b2.body = a);
    (this.H || l).fetch(new Request(this.D, b2)).then(this.Pa.bind(this), this.ga.bind(this));
  };
  h.abort = function() {
    this.response = this.responseText = "";
    this.A = new Headers();
    this.status = 0;
    this.v.abort();
    this.j && this.j.cancel("Request was aborted.").catch(() => {
    });
    this.readyState >= 1 && this.g && this.readyState != 4 && (this.g = false, Hc(this));
    this.readyState = 0;
  };
  h.Pa = function(a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, Gc(this)), this.g && (this.readyState = 3, Gc(this), this.g))) if (this.responseType === "arraybuffer") a.arrayBuffer().then(this.Na.bind(this), this.ga.bind(this));
    else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
      this.j = a.body.getReader();
      if (this.o) {
        if (this.responseType) throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else this.response = this.responseText = "", this.B = new TextDecoder();
      Ic(this);
    } else a.text().then(this.Oa.bind(this), this.ga.bind(this));
  };
  function Ic(a) {
    a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a));
  }
  __name(Ic, "Ic");
  h.Ma = function(a) {
    if (this.g) {
      if (this.o && a.value) this.response.push(a.value);
      else if (!this.o) {
        var b2 = a.value ? a.value : new Uint8Array(0);
        if (b2 = this.B.decode(b2, { stream: !a.done })) this.response = this.responseText += b2;
      }
      a.done ? Hc(this) : Gc(this);
      this.readyState == 3 && Ic(this);
    }
  };
  h.Oa = function(a) {
    this.g && (this.response = this.responseText = a, Hc(this));
  };
  h.Na = function(a) {
    this.g && (this.response = a, Hc(this));
  };
  h.ga = function() {
    this.g && Hc(this);
  };
  function Hc(a) {
    a.readyState = 4;
    a.l = null;
    a.j = null;
    a.B = null;
    Gc(a);
  }
  __name(Hc, "Hc");
  h.setRequestHeader = function(a, b2) {
    this.A.append(a, b2);
  };
  h.getResponseHeader = function(a) {
    return this.h ? this.h.get(a.toLowerCase()) || "" : "";
  };
  h.getAllResponseHeaders = function() {
    if (!this.h) return "";
    const a = [], b2 = this.h.entries();
    for (var c = b2.next(); !c.done; ) c = c.value, a.push(c[0] + ": " + c[1]), c = b2.next();
    return a.join("\r\n");
  };
  function Gc(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  }
  __name(Gc, "Gc");
  Object.defineProperty(Fc.prototype, "withCredentials", { get: /* @__PURE__ */ __name(function() {
    return this.m === "include";
  }, "get"), set: /* @__PURE__ */ __name(function(a) {
    this.m = a ? "include" : "same-origin";
  }, "set") });
  function Jc(a) {
    let b2 = "";
    ya(a, function(c, d) {
      b2 += d;
      b2 += ":";
      b2 += c;
      b2 += "\r\n";
    });
    return b2;
  }
  __name(Jc, "Jc");
  function Kc(a, b2, c) {
    a: {
      for (d in c) {
        var d = false;
        break a;
      }
      d = true;
    }
    d || (c = Jc(c), typeof a === "string" ? c != null && L2(c) : S2(a, b2, c));
  }
  __name(Kc, "Kc");
  function X(a) {
    C2.call(this);
    this.headers = /* @__PURE__ */ new Map();
    this.L = a || null;
    this.h = false;
    this.g = null;
    this.D = "";
    this.o = 0;
    this.l = "";
    this.j = this.B = this.v = this.A = false;
    this.m = null;
    this.F = "";
    this.H = false;
  }
  __name(X, "X");
  t(X, C2);
  var Lc = /^https?$/i, Mc = ["POST", "PUT"];
  h = X.prototype;
  h.Fa = function(a) {
    this.H = a;
  };
  h.ea = function(a, b2, c, d) {
    if (this.g) throw Error("[goog.net.XhrIo] Object is active with another request=" + this.D + "; newUri=" + a);
    b2 = b2 ? b2.toUpperCase() : "GET";
    this.D = a;
    this.l = "";
    this.o = 0;
    this.A = false;
    this.h = true;
    this.g = this.L ? this.L.g() : wb.g();
    this.g.onreadystatechange = ia(p(this.Ca, this));
    try {
      this.B = true, this.g.open(b2, String(a), true), this.B = false;
    } catch (f) {
      Nc(this, f);
      return;
    }
    a = c || "";
    c = new Map(this.headers);
    if (d) if (Object.getPrototypeOf(d) === Object.prototype) for (var e in d) c.set(e, d[e]);
    else if (typeof d.keys === "function" && typeof d.get === "function") for (const f of d.keys()) c.set(f, d.get(f));
    else throw Error("Unknown input type for opt_headers: " + String(d));
    d = Array.from(c.keys()).find((f) => "content-type" == f.toLowerCase());
    e = l.FormData && a instanceof l.FormData;
    !(Array.prototype.indexOf.call(Mc, b2, void 0) >= 0) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [f, g] of c) this.g.setRequestHeader(f, g);
    this.F && (this.g.responseType = this.F);
    "withCredentials" in this.g && this.g.withCredentials !== this.H && (this.g.withCredentials = this.H);
    try {
      this.m && (clearTimeout(this.m), this.m = null), this.v = true, this.g.send(a), this.v = false;
    } catch (f) {
      Nc(this, f);
    }
  };
  function Nc(a, b2) {
    a.h = false;
    a.g && (a.j = true, a.g.abort(), a.j = false);
    a.l = b2;
    a.o = 5;
    Oc(a);
    Pc(a);
  }
  __name(Nc, "Nc");
  function Oc(a) {
    a.A || (a.A = true, D2(a, "complete"), D2(a, "error"));
  }
  __name(Oc, "Oc");
  h.abort = function(a) {
    this.g && this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false, this.o = a || 7, D2(this, "complete"), D2(this, "abort"), Pc(this));
  };
  h.N = function() {
    this.g && (this.h && (this.h = false, this.j = true, this.g.abort(), this.j = false), Pc(this, true));
    X.Z.N.call(this);
  };
  h.Ca = function() {
    this.u || (this.B || this.v || this.j ? Qc(this) : this.Xa());
  };
  h.Xa = function() {
    Qc(this);
  };
  function Qc(a) {
    if (a.h && typeof ea != "undefined") {
      if (a.v && P(a) == 4) setTimeout(a.Ca.bind(a), 0);
      else if (D2(a, "readystatechange"), P(a) == 4) {
        a.h = false;
        try {
          const f = a.ca();
          a: switch (f) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b2 = true;
              break a;
            default:
              b2 = false;
          }
          var c;
          if (!(c = b2)) {
            var d;
            if (d = f === 0) {
              let g = String(a.D).match(ic)[1] || null;
              !g && l.self && l.self.location && (g = l.self.location.protocol.slice(0, -1));
              d = !Lc.test(g ? g.toLowerCase() : "");
            }
            c = d;
          }
          if (c) D2(a, "complete"), D2(a, "success");
          else {
            a.o = 6;
            try {
              var e = P(a) > 2 ? a.g.statusText : "";
            } catch (g) {
              e = "";
            }
            a.l = e + " [" + a.ca() + "]";
            Oc(a);
          }
        } finally {
          Pc(a);
        }
      }
    }
  }
  __name(Qc, "Qc");
  function Pc(a, b2) {
    if (a.g) {
      a.m && (clearTimeout(a.m), a.m = null);
      const c = a.g;
      a.g = null;
      b2 || D2(a, "ready");
      try {
        c.onreadystatechange = null;
      } catch (d) {
      }
    }
  }
  __name(Pc, "Pc");
  h.isActive = function() {
    return !!this.g;
  };
  function P(a) {
    return a.g ? a.g.readyState : 0;
  }
  __name(P, "P");
  h.ca = function() {
    try {
      return P(this) > 2 ? this.g.status : -1;
    } catch (a) {
      return -1;
    }
  };
  h.la = function() {
    try {
      return this.g ? this.g.responseText : "";
    } catch (a) {
      return "";
    }
  };
  h.La = function(a) {
    if (this.g) {
      var b2 = this.g.responseText;
      a && b2.indexOf(a) == 0 && (b2 = b2.substring(a.length));
      return cb(b2);
    }
  };
  function Ib(a) {
    try {
      if (!a.g) return null;
      if ("response" in a.g) return a.g.response;
      switch (a.F) {
        case "":
        case "text":
          return a.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.g) return a.g.mozResponseArrayBuffer;
      }
      return null;
    } catch (b2) {
      return null;
    }
  }
  __name(Ib, "Ib");
  function Rb(a) {
    const b2 = {};
    a = (a.g && P(a) >= 2 ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
    for (let d = 0; d < a.length; d++) {
      if (y(a[d])) continue;
      var c = yb(a[d]);
      const e = c[0];
      c = c[1];
      if (typeof c !== "string") continue;
      c = c.trim();
      const f = b2[e] || [];
      b2[e] = f;
      f.push(c);
    }
    Aa(b2, function(d) {
      return d.join(", ");
    });
  }
  __name(Rb, "Rb");
  h.ya = function() {
    return this.o;
  };
  h.Ha = function() {
    return typeof this.l === "string" ? this.l : String(this.l);
  };
  function Rc(a, b2, c) {
    return c && c.internalChannelParams ? c.internalChannelParams[a] || b2 : b2;
  }
  __name(Rc, "Rc");
  function Sc(a) {
    this.za = 0;
    this.i = [];
    this.j = new pb();
    this.ba = this.na = this.J = this.W = this.g = this.wa = this.G = this.H = this.u = this.U = this.o = null;
    this.Ya = this.V = 0;
    this.Sa = Rc("failFast", false, a);
    this.F = this.C = this.v = this.m = this.l = null;
    this.X = true;
    this.xa = this.K = -1;
    this.Y = this.A = this.D = 0;
    this.Qa = Rc("baseRetryDelayMs", 5e3, a);
    this.Za = Rc("retryDelaySeedMs", 1e4, a);
    this.Ta = Rc("forwardChannelMaxRetries", 2, a);
    this.va = Rc("forwardChannelRequestTimeoutMs", 2e4, a);
    this.ma = a && a.xmlHttpFactory || void 0;
    this.Ua = a && a.Rb || void 0;
    this.Aa = a && a.useFetchStreams || false;
    this.O = void 0;
    this.L = a && a.supportsCrossDomainXhr || false;
    this.M = "";
    this.h = new ec(a && a.concurrentRequestLimit);
    this.Ba = new Dc();
    this.S = a && a.fastHandshake || false;
    this.R = a && a.encodeInitMessageHeaders || false;
    this.S && this.R && (this.R = false);
    this.Ra = a && a.Pb || false;
    a && a.ua && this.j.ua();
    a && a.forceLongPolling && (this.X = false);
    this.aa = !this.S && this.X && a && a.detectBufferingProxy || false;
    this.ia = void 0;
    a && a.longPollingTimeout && a.longPollingTimeout > 0 && (this.ia = a.longPollingTimeout);
    this.ta = void 0;
    this.T = 0;
    this.P = false;
    this.ja = this.B = null;
  }
  __name(Sc, "Sc");
  h = Sc.prototype;
  h.ka = 8;
  h.I = 1;
  h.connect = function(a, b2, c, d) {
    J(0);
    this.W = a;
    this.H = b2 || {};
    c && d !== void 0 && (this.H.OSID = c, this.H.OAID = d);
    this.F = this.X;
    this.J = Zb(this, null, this.W);
    bc(this);
  };
  function cc(a) {
    Tc(a);
    if (a.I == 3) {
      var b2 = a.V++, c = O2(a.J);
      S2(c, "SID", a.M);
      S2(c, "RID", b2);
      S2(c, "TYPE", "terminate");
      Uc(a, c);
      b2 = new N2(a, a.j, b2);
      b2.M = 2;
      b2.A = Db(O2(c));
      c = false;
      if (l.navigator && l.navigator.sendBeacon) try {
        c = l.navigator.sendBeacon(b2.A.toString(), "");
      } catch (d) {
      }
      !c && l.Image && (new Image().src = b2.A, c = true);
      c || (b2.g = Hb(b2.j, null), b2.g.ea(b2.A));
      b2.F = Date.now();
      Fb(b2);
    }
    Vc(a);
  }
  __name(cc, "cc");
  function Vb(a) {
    a.g && (Pb(a), a.g.cancel(), a.g = null);
  }
  __name(Vb, "Vb");
  function Tc(a) {
    Vb(a);
    a.v && (l.clearTimeout(a.v), a.v = null);
    Ub(a);
    a.h.cancel();
    a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
  }
  __name(Tc, "Tc");
  function bc(a) {
    if (!fc(a.h) && !a.m) {
      a.m = true;
      var b2 = a.Ea;
      u || ta();
      v2 || (u(), v2 = true);
      oa.add(b2, a);
      a.D = 0;
    }
  }
  __name(bc, "bc");
  function Wc(a, b2) {
    if (Xb(a.h) >= a.h.j - (a.m ? 1 : 0)) return false;
    if (a.m) return a.i = b2.G.concat(a.i), true;
    if (a.I == 1 || a.I == 2 || a.D >= (a.Sa ? 0 : a.Ta)) return false;
    a.m = ob(p(a.Ea, a, b2), Xc(a, a.D));
    a.D++;
    return true;
  }
  __name(Wc, "Wc");
  h.Ea = function(a) {
    if (this.m) if (this.m = null, this.I == 1) {
      if (!a) {
        this.V = Math.floor(Math.random() * 1e5);
        a = this.V++;
        const e = new N2(this, this.j, a);
        let f = this.o;
        this.U && (f ? (f = Ba(f), Da(f, this.U)) : f = this.U);
        this.u !== null || this.R || (e.J = f, f = null);
        if (this.S) a: {
          var b2 = 0;
          for (var c = 0; c < this.i.length; c++) {
            b: {
              var d = this.i[c];
              if ("__data__" in d.map && (d = d.map.__data__, typeof d === "string")) {
                d = d.length;
                break b;
              }
              d = void 0;
            }
            if (d === void 0) break;
            b2 += d;
            if (b2 > 4096) {
              b2 = c;
              break a;
            }
            if (b2 === 4096 || c === this.i.length - 1) {
              b2 = c + 1;
              break a;
            }
          }
          b2 = 1e3;
        }
        else b2 = 1e3;
        b2 = Yc(this, e, b2);
        c = O2(this.J);
        S2(c, "RID", a);
        S2(c, "CVER", 22);
        this.G && S2(c, "X-HTTP-Session-Id", this.G);
        Uc(this, c);
        f && (this.R ? b2 = "headers=" + L2(Jc(f)) + "&" + b2 : this.u && Kc(c, this.u, f));
        Yb(this.h, e);
        this.Ra && S2(c, "TYPE", "init");
        this.S ? (S2(c, "$req", b2), S2(c, "SID", "null"), e.U = true, Cb(e, c, null)) : Cb(e, c, b2);
        this.I = 2;
      }
    } else this.I == 3 && (a ? Zc(this, a) : this.i.length == 0 || fc(this.h) || Zc(this));
  };
  function Zc(a, b2) {
    var c;
    b2 ? c = b2.l : c = a.V++;
    const d = O2(a.J);
    S2(d, "SID", a.M);
    S2(d, "RID", c);
    S2(d, "AID", a.K);
    Uc(a, d);
    a.u && a.o && Kc(d, a.u, a.o);
    c = new N2(a, a.j, c, a.D + 1);
    a.u === null && (c.J = a.o);
    b2 && (a.i = b2.G.concat(a.i));
    b2 = Yc(a, c, 1e3);
    c.H = Math.round(a.va * 0.5) + Math.round(a.va * 0.5 * Math.random());
    Yb(a.h, c);
    Cb(c, d, b2);
  }
  __name(Zc, "Zc");
  function Uc(a, b2) {
    a.H && ya(a.H, function(c, d) {
      S2(b2, d, c);
    });
    a.l && ya({}, function(c, d) {
      S2(b2, d, c);
    });
  }
  __name(Uc, "Uc");
  function Yc(a, b2, c) {
    c = Math.min(a.i.length, c);
    const d = a.l ? p(a.l.Ka, a.l, a) : null;
    a: {
      var e = a.i;
      let k = -1;
      for (; ; ) {
        const q2 = ["count=" + c];
        k == -1 ? c > 0 ? (k = e[0].g, q2.push("ofs=" + k)) : k = 0 : q2.push("ofs=" + k);
        let m = true;
        for (let r = 0; r < c; r++) {
          var f = e[r].g;
          const A = e[r].map;
          f -= k;
          if (f < 0) k = Math.max(0, e[r].g - 100), m = false;
          else try {
            f = "req" + f + "_" || "";
            try {
              var g = A instanceof Map ? A : Object.entries(A);
              for (const [M2, F2] of g) {
                let G2 = F2;
                n(F2) && (G2 = ab(F2));
                q2.push(f + M2 + "=" + encodeURIComponent(G2));
              }
            } catch (M2) {
              throw q2.push(f + "type=" + encodeURIComponent("_badmap")), M2;
            }
          } catch (M2) {
            d && d(A);
          }
        }
        if (m) {
          g = q2.join("&");
          break a;
        }
      }
      g = void 0;
    }
    a = a.i.splice(0, c);
    b2.G = a;
    return g;
  }
  __name(Yc, "Yc");
  function ac(a) {
    if (!a.g && !a.v) {
      a.Y = 1;
      var b2 = a.Da;
      u || ta();
      v2 || (u(), v2 = true);
      oa.add(b2, a);
      a.A = 0;
    }
  }
  __name(ac, "ac");
  function Wb(a) {
    if (a.g || a.v || a.A >= 3) return false;
    a.Y++;
    a.v = ob(p(a.Da, a), Xc(a, a.A));
    a.A++;
    return true;
  }
  __name(Wb, "Wb");
  h.Da = function() {
    this.v = null;
    $c(this);
    if (this.aa && !(this.P || this.g == null || this.T <= 0)) {
      var a = 4 * this.T;
      this.j.info("BP detection timer enabled: " + a);
      this.B = ob(p(this.Wa, this), a);
    }
  };
  h.Wa = function() {
    this.B && (this.B = null, this.j.info("BP detection timeout reached."), this.j.info("Buffering proxy detected and switch to long-polling!"), this.F = false, this.P = true, J(10), Vb(this), $c(this));
  };
  function Pb(a) {
    a.B != null && (l.clearTimeout(a.B), a.B = null);
  }
  __name(Pb, "Pb");
  function $c(a) {
    a.g = new N2(a, a.j, "rpc", a.Y);
    a.u === null && (a.g.J = a.o);
    a.g.P = 0;
    var b2 = O2(a.na);
    S2(b2, "RID", "rpc");
    S2(b2, "SID", a.M);
    S2(b2, "AID", a.K);
    S2(b2, "CI", a.F ? "0" : "1");
    !a.F && a.ia && S2(b2, "TO", a.ia);
    S2(b2, "TYPE", "xmlhttp");
    Uc(a, b2);
    a.u && a.o && Kc(b2, a.u, a.o);
    a.O && (a.g.H = a.O);
    var c = a.g;
    a = a.ba;
    c.M = 1;
    c.A = Db(O2(b2));
    c.u = null;
    c.R = true;
    Eb(c, a);
  }
  __name($c, "$c");
  h.Va = function() {
    this.C != null && (this.C = null, Vb(this), Wb(this), J(19));
  };
  function Ub(a) {
    a.C != null && (l.clearTimeout(a.C), a.C = null);
  }
  __name(Ub, "Ub");
  function Qb(a, b2) {
    var c = null;
    if (a.g == b2) {
      Ub(a);
      Pb(a);
      a.g = null;
      var d = 2;
    } else if (Tb(a.h, b2)) c = b2.G, $b(a.h, b2), d = 1;
    else return;
    if (a.I != 0) {
      if (b2.o) if (d == 1) {
        c = b2.u ? b2.u.length : 0;
        b2 = Date.now() - b2.F;
        var e = a.D;
        d = jb();
        D2(d, new nb(d, c));
        bc(a);
      } else ac(a);
      else if (e = b2.m, e == 3 || e == 0 && b2.X > 0 || !(d == 1 && Wc(a, b2) || d == 2 && Wb(a))) switch (c && c.length > 0 && (b2 = a.h, b2.i = b2.i.concat(c)), e) {
        case 1:
          R(a, 5);
          break;
        case 4:
          R(a, 10);
          break;
        case 3:
          R(a, 6);
          break;
        default:
          R(a, 2);
      }
    }
  }
  __name(Qb, "Qb");
  function Xc(a, b2) {
    let c = a.Qa + Math.floor(Math.random() * a.Za);
    a.isActive() || (c *= 2);
    return c * b2;
  }
  __name(Xc, "Xc");
  function R(a, b2) {
    a.j.info("Error code " + b2);
    if (b2 == 2) {
      var c = p(a.bb, a), d = a.Ua;
      const e = !d;
      d = new T(d || "//www.google.com/images/cleardot.gif");
      l.location && l.location.protocol == "http" || kc(d, "https");
      Db(d);
      e ? Bc(d.toString(), c) : Cc(d.toString(), c);
    } else J(2);
    a.I = 0;
    a.l && a.l.pa(b2);
    Vc(a);
    Tc(a);
  }
  __name(R, "R");
  h.bb = function(a) {
    a ? (this.j.info("Successfully pinged google.com"), J(2)) : (this.j.info("Failed to ping google.com"), J(1));
  };
  function Vc(a) {
    a.I = 0;
    a.ja = [];
    if (a.l) {
      const b2 = hc(a.h);
      if (b2.length != 0 || a.i.length != 0) ka(a.ja, b2), ka(a.ja, a.i), a.h.i.length = 0, ja(a.i), a.i.length = 0;
      a.l.oa();
    }
  }
  __name(Vc, "Vc");
  function Zb(a, b2, c) {
    var d = c instanceof T ? O2(c) : new T(c);
    if (d.g != "") b2 && (d.g = b2 + "." + d.g), lc(d, d.u);
    else {
      var e = l.location;
      d = e.protocol;
      b2 = b2 ? b2 + "." + e.hostname : e.hostname;
      e = +e.port;
      const f = new T(null);
      d && kc(f, d);
      b2 && (f.g = b2);
      e && lc(f, e);
      c && (f.h = c);
      d = f;
    }
    c = a.G;
    b2 = a.wa;
    c && b2 && S2(d, c, b2);
    S2(d, "VER", a.ka);
    Uc(a, d);
    return d;
  }
  __name(Zb, "Zb");
  function Hb(a, b2, c) {
    if (b2 && !a.L) throw Error("Can't create secondary domain capable XhrIo object.");
    b2 = a.Aa && !a.ma ? new X(new Ec({ ab: c })) : new X(a.ma);
    b2.Fa(a.L);
    return b2;
  }
  __name(Hb, "Hb");
  h.isActive = function() {
    return !!this.l && this.l.isActive(this);
  };
  function ad() {
  }
  __name(ad, "ad");
  h = ad.prototype;
  h.ra = function() {
  };
  h.qa = function() {
  };
  h.pa = function() {
  };
  h.oa = function() {
  };
  h.isActive = function() {
    return true;
  };
  h.Ka = function() {
  };
  function bd() {
  }
  __name(bd, "bd");
  bd.prototype.g = function(a, b2) {
    return new Y2(a, b2);
  };
  function Y2(a, b2) {
    C2.call(this);
    this.g = new Sc(b2);
    this.l = a;
    this.h = b2 && b2.messageUrlParams || null;
    a = b2 && b2.messageHeaders || null;
    b2 && b2.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
    this.g.o = a;
    a = b2 && b2.initMessageHeaders || null;
    b2 && b2.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b2.messageContentType : a = { "X-WebChannel-Content-Type": b2.messageContentType });
    b2 && b2.sa && (a ? a["X-WebChannel-Client-Profile"] = b2.sa : a = { "X-WebChannel-Client-Profile": b2.sa });
    this.g.U = a;
    (a = b2 && b2.Qb) && !y(a) && (this.g.u = a);
    this.A = b2 && b2.supportsCrossDomainXhr || false;
    this.v = b2 && b2.sendRawJson || false;
    (b2 = b2 && b2.httpSessionIdParam) && !y(b2) && (this.g.G = b2, a = this.h, a !== null && b2 in a && (a = this.h, b2 in a && delete a[b2]));
    this.j = new Z(this);
  }
  __name(Y2, "Y");
  t(Y2, C2);
  Y2.prototype.m = function() {
    this.g.l = this.j;
    this.A && (this.g.L = true);
    this.g.connect(this.l, this.h || void 0);
  };
  Y2.prototype.close = function() {
    cc(this.g);
  };
  Y2.prototype.o = function(a) {
    var b2 = this.g;
    if (typeof a === "string") {
      var c = {};
      c.__data__ = a;
      a = c;
    } else this.v && (c = {}, c.__data__ = ab(a), a = c);
    b2.i.push(new dc(b2.Ya++, a));
    b2.I == 3 && bc(b2);
  };
  Y2.prototype.N = function() {
    this.g.l = null;
    delete this.j;
    cc(this.g);
    delete this.g;
    Y2.Z.N.call(this);
  };
  function cd(a) {
    gb.call(this);
    a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
    var b2 = a.__sm__;
    if (b2) {
      a: {
        for (const c in b2) {
          a = c;
          break a;
        }
        a = void 0;
      }
      if (this.i = a) a = this.i, b2 = b2 !== null && a in b2 ? b2[a] : void 0;
      this.data = b2;
    } else this.data = a;
  }
  __name(cd, "cd");
  t(cd, gb);
  function dd() {
    hb.call(this);
    this.status = 1;
  }
  __name(dd, "dd");
  t(dd, hb);
  function Z(a) {
    this.g = a;
  }
  __name(Z, "Z");
  t(Z, ad);
  Z.prototype.ra = function() {
    D2(this.g, "a");
  };
  Z.prototype.qa = function(a) {
    D2(this.g, new cd(a));
  };
  Z.prototype.pa = function(a) {
    D2(this.g, new dd());
  };
  Z.prototype.oa = function() {
    D2(this.g, "b");
  };
  bd.prototype.createWebChannel = bd.prototype.g;
  Y2.prototype.send = Y2.prototype.o;
  Y2.prototype.open = Y2.prototype.m;
  Y2.prototype.close = Y2.prototype.close;
  createWebChannelTransport = webchannel_blob_es2018.createWebChannelTransport = function() {
    return new bd();
  };
  getStatEventTarget = webchannel_blob_es2018.getStatEventTarget = function() {
    return jb();
  };
  Event = webchannel_blob_es2018.Event = I;
  Stat = webchannel_blob_es2018.Stat = { jb: 0, mb: 1, nb: 2, Hb: 3, Mb: 4, Jb: 5, Kb: 6, Ib: 7, Gb: 8, Lb: 9, PROXY: 10, NOPROXY: 11, Eb: 12, Ab: 13, Bb: 14, zb: 15, Cb: 16, Db: 17, fb: 18, eb: 19, gb: 20 };
  ub.NO_ERROR = 0;
  ub.TIMEOUT = 8;
  ub.HTTP_ERROR = 6;
  ErrorCode = webchannel_blob_es2018.ErrorCode = ub;
  vb.COMPLETE = "complete";
  EventType = webchannel_blob_es2018.EventType = vb;
  fb.EventType = H;
  H.OPEN = "a";
  H.CLOSE = "b";
  H.ERROR = "c";
  H.MESSAGE = "d";
  C2.prototype.listen = C2.prototype.J;
  WebChannel = webchannel_blob_es2018.WebChannel = fb;
  FetchXmlHttpFactory = webchannel_blob_es2018.FetchXmlHttpFactory = Ec;
  X.prototype.listenOnce = X.prototype.K;
  X.prototype.getLastError = X.prototype.Ha;
  X.prototype.getLastErrorCode = X.prototype.ya;
  X.prototype.getStatus = X.prototype.ca;
  X.prototype.getResponseJson = X.prototype.La;
  X.prototype.getResponseText = X.prototype.la;
  X.prototype.send = X.prototype.ea;
  X.prototype.setWithCredentials = X.prototype.Fa;
  XhrIo = webchannel_blob_es2018.XhrIo = X;
}).apply(typeof commonjsGlobal2 !== "undefined" ? commonjsGlobal2 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

// node_modules/@firebase/firestore/dist/common-b3e8012f.esm.js
var _User = class _User {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return null != this.uid;
  }
  /**
   * Returns a key representing this user, suitable for inclusion in a
   * dictionary.
   */
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
};
__name(_User, "User");
var User = _User;
User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
var b = "12.14.0";
function __PRIVATE_setSDKVersion(e) {
  b = e;
}
__name(__PRIVATE_setSDKVersion, "__PRIVATE_setSDKVersion");
var S = new Logger("@firebase/firestore");
function __PRIVATE_getLogLevel() {
  return S.logLevel;
}
__name(__PRIVATE_getLogLevel, "__PRIVATE_getLogLevel");
function __PRIVATE_logDebug(e, ...t) {
  if (S.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    S.debug(`Firestore (${b}): ${e}`, ...n);
  }
}
__name(__PRIVATE_logDebug, "__PRIVATE_logDebug");
function __PRIVATE_logError(e, ...t) {
  if (S.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    S.error(`Firestore (${b}): ${e}`, ...n);
  }
}
__name(__PRIVATE_logError, "__PRIVATE_logError");
function __PRIVATE_logWarn(e, ...t) {
  if (S.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    S.warn(`Firestore (${b}): ${e}`, ...n);
  }
}
__name(__PRIVATE_logWarn, "__PRIVATE_logWarn");
function __PRIVATE_argToString(e) {
  if ("string" == typeof e) return e;
  try {
    return (/* @__PURE__ */ __name(function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }, "__PRIVATE_formatJSON"))(e);
  } catch (t) {
    return e;
  }
}
__name(__PRIVATE_argToString, "__PRIVATE_argToString");
function fail(e, t, n) {
  let r = "Unexpected state";
  "string" == typeof t ? r = t : n = t, __PRIVATE__fail(e, r, n);
}
__name(fail, "fail");
function __PRIVATE__fail(e, t, n) {
  let r = `FIRESTORE (${b}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
  if (void 0 !== n) try {
    r += " CONTEXT: " + JSON.stringify(n);
  } catch (e2) {
    r += " CONTEXT: " + n;
  }
  throw __PRIVATE_logError(r), new Error(r);
}
__name(__PRIVATE__fail, "__PRIVATE__fail");
function __PRIVATE_hardAssert(e, t, n, r) {
  let i = "Unexpected state";
  "string" == typeof n ? i = n : r = n, e || __PRIVATE__fail(t, i, r);
}
__name(__PRIVATE_hardAssert, "__PRIVATE_hardAssert");
function __PRIVATE_debugCast(e, t) {
  return e;
}
__name(__PRIVATE_debugCast, "__PRIVATE_debugCast");
var D = {
  // Causes are copied from:
  // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
  /** Not an error; returned on success. */
  OK: "ok",
  /** The operation was cancelled (typically by the caller). */
  CANCELLED: "cancelled",
  /** Unknown error or an error from a different error domain. */
  UNKNOWN: "unknown",
  /**
   * Client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system (e.g., a malformed file
   * name).
   */
  INVALID_ARGUMENT: "invalid-argument",
  /**
   * Deadline expired before operation could complete. For operations that
   * change the state of the system, this error may be returned even if the
   * operation has completed successfully. For example, a successful response
   * from a server could have been delayed long enough for the deadline to
   * expire.
   */
  DEADLINE_EXCEEDED: "deadline-exceeded",
  /** Some requested entity (e.g., file or directory) was not found. */
  NOT_FOUND: "not-found",
  /**
   * Some entity that we attempted to create (e.g., file or directory) already
   * exists.
   */
  ALREADY_EXISTS: "already-exists",
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller cannot be identified
   * (use UNAUTHENTICATED instead for those errors).
   */
  PERMISSION_DENIED: "permission-denied",
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED: "unauthenticated",
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
   * entire file system is out of space.
   */
  RESOURCE_EXHAUSTED: "resource-exhausted",
  /**
   * Operation was rejected because the system is not in a state required for
   * the operation's execution. For example, directory to be deleted may be
   * non-empty, an rmdir operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *  (a) Use UNAVAILABLE if the client can retry just the failing call.
   *  (b) Use ABORTED if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FAILED_PRECONDITION if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FAILED_PRECONDITION
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FAILED_PRECONDITION if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   */
  FAILED_PRECONDITION: "failed-precondition",
  /**
   * The operation was aborted, typically due to a concurrency issue like
   * sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  ABORTED: "aborted",
  /**
   * Operation was attempted past the valid range. E.g., seeking or reading
   * past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
   * if the system state changes. For example, a 32-bit file system will
   * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
   * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
   * an offset past the current file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  OUT_OF_RANGE: "out-of-range",
  /** Operation is not implemented or not supported/enabled in this service. */
  UNIMPLEMENTED: "unimplemented",
  /**
   * Internal errors. Means some invariants expected by underlying System has
   * been broken. If you see one of these errors, Something is very broken.
   */
  INTERNAL: "internal",
  /**
   * The service is currently unavailable. This is a most likely a transient
   * condition and may be corrected by retrying with a backoff.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  UNAVAILABLE: "unavailable",
  /** Unrecoverable data loss or corruption. */
  DATA_LOSS: "data-loss"
};
var _FirestoreError = class _FirestoreError extends FirebaseError {
  /** @hideconstructor */
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
};
__name(_FirestoreError, "FirestoreError");
var FirestoreError = _FirestoreError;
var ___PRIVATE_Deferred = class ___PRIVATE_Deferred {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
};
__name(___PRIVATE_Deferred, "__PRIVATE_Deferred");
var __PRIVATE_Deferred = ___PRIVATE_Deferred;
var ___PRIVATE_OAuthToken = class ___PRIVATE_OAuthToken {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
};
__name(___PRIVATE_OAuthToken, "__PRIVATE_OAuthToken");
var __PRIVATE_OAuthToken = ___PRIVATE_OAuthToken;
var ___PRIVATE_EmptyAuthCredentialsProvider = class ___PRIVATE_EmptyAuthCredentialsProvider {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
};
__name(___PRIVATE_EmptyAuthCredentialsProvider, "__PRIVATE_EmptyAuthCredentialsProvider");
var __PRIVATE_EmptyAuthCredentialsProvider = ___PRIVATE_EmptyAuthCredentialsProvider;
var ___PRIVATE_EmulatorAuthCredentialsProvider = class ___PRIVATE_EmulatorAuthCredentialsProvider {
  constructor(e) {
    this.token = e, /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, // Fire with initial user.
    e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
};
__name(___PRIVATE_EmulatorAuthCredentialsProvider, "__PRIVATE_EmulatorAuthCredentialsProvider");
var __PRIVATE_EmulatorAuthCredentialsProvider = ___PRIVATE_EmulatorAuthCredentialsProvider;
var ___PRIVATE_FirebaseAuthCredentialsProvider = class ___PRIVATE_FirebaseAuthCredentialsProvider {
  constructor(e) {
    this.t = e, /** Tracks the current User. */
    this.currentUser = User.UNAUTHENTICATED, /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    __PRIVATE_hardAssert(void 0 === this.o, 42304);
    let n = this.i;
    const __PRIVATE_guardedChangeListener = /* @__PURE__ */ __name((e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve(), "__PRIVATE_guardedChangeListener");
    let r = new __PRIVATE_Deferred();
    this.o = () => {
      this.i++, this.currentUser = this.u(), r.resolve(), r = new __PRIVATE_Deferred(), e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = /* @__PURE__ */ __name(() => {
      const t2 = r;
      e.enqueueRetryable(async () => {
        await t2.promise, await __PRIVATE_guardedChangeListener(this.currentUser);
      });
    }, "__PRIVATE_awaitNextToken"), __PRIVATE_registerAuth = /* @__PURE__ */ __name((e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.o && (this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken());
    }, "__PRIVATE_registerAuth");
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), // Our users can initialize Auth right after Firestore, so we give it
    // a chance to register itself with the component framework before we
    // determine whether to start up in unauthenticated mode.
    setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (
          // If auth is still not available, proceed with `null` user
          (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r.resolve(), r = new __PRIVATE_Deferred())
        );
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then((t2) => (
      // Cancel the request since the token changed while the request was
      // outstanding so the response is potentially for a previous user (which
      // user, we can't be sure).
      this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert("string" == typeof t2.accessToken, 31837, {
        l: t2
      }), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null
    )) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.o && this.auth.removeAuthTokenListener(this.o), this.o = void 0;
  }
  // Auth.getUid() can return null even with a user logged in. It is because
  // getUid() is synchronous, but the auth code populating Uid is asynchronous.
  // This method should only be called in the AuthTokenListener callback
  // to guarantee to get the actual user.
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(null === e || "string" == typeof e, 2055, {
      h: e
    }), new User(e);
  }
};
__name(___PRIVATE_FirebaseAuthCredentialsProvider, "__PRIVATE_FirebaseAuthCredentialsProvider");
var __PRIVATE_FirebaseAuthCredentialsProvider = ___PRIVATE_FirebaseAuthCredentialsProvider;
var ___PRIVATE_FirstPartyToken = class ___PRIVATE_FirstPartyToken {
  constructor(e, t, n) {
    this.P = e, this.T = t, this.I = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.R = /* @__PURE__ */ new Map();
  }
  /**
   * Gets an authorization token, using a provided factory function, or return
   * null.
   */
  A() {
    return this.I ? this.I() : null;
  }
  get headers() {
    this.R.set("X-Goog-AuthUser", this.P);
    const e = this.A();
    return e && this.R.set("Authorization", e), this.T && this.R.set("X-Goog-Iam-Authorization-Token", this.T), this.R;
  }
};
__name(___PRIVATE_FirstPartyToken, "__PRIVATE_FirstPartyToken");
var __PRIVATE_FirstPartyToken = ___PRIVATE_FirstPartyToken;
var ___PRIVATE_FirstPartyAuthCredentialsProvider = class ___PRIVATE_FirstPartyAuthCredentialsProvider {
  constructor(e, t, n) {
    this.P = e, this.T = t, this.I = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.P, this.T, this.I));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
};
__name(___PRIVATE_FirstPartyAuthCredentialsProvider, "__PRIVATE_FirstPartyAuthCredentialsProvider");
var __PRIVATE_FirstPartyAuthCredentialsProvider = ___PRIVATE_FirstPartyAuthCredentialsProvider;
var _AppCheckToken = class _AppCheckToken {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
};
__name(_AppCheckToken, "AppCheckToken");
var AppCheckToken = _AppCheckToken;
var ___PRIVATE_FirebaseAppCheckTokenProvider = class ___PRIVATE_FirebaseAppCheckTokenProvider {
  constructor(t, n) {
    this.V = n, this.forceRefresh = false, this.appCheck = null, this.m = null, this.p = null, _isFirebaseServerApp(t) && t.settings.appCheckToken && (this.p = t.settings.appCheckToken);
  }
  start(e, t) {
    __PRIVATE_hardAssert(void 0 === this.o, 3512);
    const onTokenChanged = /* @__PURE__ */ __name((e2) => {
      null != e2.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.m;
      return this.m = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    }, "onTokenChanged");
    this.o = (t2) => {
      e.enqueueRetryable(() => onTokenChanged(t2));
    };
    const __PRIVATE_registerAppCheck = /* @__PURE__ */ __name((e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.o && this.appCheck.addTokenListener(this.o);
    }, "__PRIVATE_registerAppCheck");
    this.V.onInit((e2) => __PRIVATE_registerAppCheck(e2)), // Our users can initialize AppCheck after Firestore, so we give it
    // a chance to register itself with the component framework.
    setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.V.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : (
          // If AppCheck is still not available, proceed without it.
          __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
        );
      }
    }, 0);
  }
  getToken() {
    if (this.p) return Promise.resolve(new AppCheckToken(this.p));
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert("string" == typeof e2.token, 44558, {
      tokenResult: e2
    }), this.m = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.o && this.appCheck.removeTokenListener(this.o), this.o = void 0;
  }
};
__name(___PRIVATE_FirebaseAppCheckTokenProvider, "__PRIVATE_FirebaseAppCheckTokenProvider");
var __PRIVATE_FirebaseAppCheckTokenProvider = ___PRIVATE_FirebaseAppCheckTokenProvider;
function __PRIVATE_randomBytes(e) {
  const t = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto)
  ), n = new Uint8Array(e);
  if (t && "function" == typeof t.getRandomValues) t.getRandomValues(n);
  else
    for (let t2 = 0; t2 < e; t2++) n[t2] = Math.floor(256 * Math.random());
  return n;
}
__name(__PRIVATE_randomBytes, "__PRIVATE_randomBytes");
var ___PRIVATE_AutoId = class ___PRIVATE_AutoId {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
    let n = "";
    for (; n.length < 20; ) {
      const r = __PRIVATE_randomBytes(40);
      for (let i = 0; i < r.length; ++i)
        n.length < 20 && r[i] < t && (n += e.charAt(r[i] % 62));
    }
    return n;
  }
};
__name(___PRIVATE_AutoId, "__PRIVATE_AutoId");
var __PRIVATE_AutoId = ___PRIVATE_AutoId;
function __PRIVATE_primitiveComparator(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
__name(__PRIVATE_primitiveComparator, "__PRIVATE_primitiveComparator");
function __PRIVATE_compareUtf8Strings(e, t) {
  const n = Math.min(e.length, t.length);
  for (let r = 0; r < n; r++) {
    const n2 = e.charAt(r), i = t.charAt(r);
    if (n2 !== i) return __PRIVATE_isSurrogate(n2) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(n2, i) : __PRIVATE_isSurrogate(n2) ? 1 : -1;
  }
  return __PRIVATE_primitiveComparator(e.length, t.length);
}
__name(__PRIVATE_compareUtf8Strings, "__PRIVATE_compareUtf8Strings");
var C = 55296;
var v = 57343;
function __PRIVATE_isSurrogate(e) {
  const t = e.charCodeAt(0);
  return t >= C && t <= v;
}
__name(__PRIVATE_isSurrogate, "__PRIVATE_isSurrogate");
function __PRIVATE_arrayEquals(e, t, n) {
  return e.length === t.length && e.every((e2, r) => n(e2, t[r]));
}
__name(__PRIVATE_arrayEquals, "__PRIVATE_arrayEquals");
var F = "__name__";
var _BasePath = class _BasePath {
  constructor(e, t, n) {
    void 0 === t ? t = 0 : t > e.length && fail(637, {
      offset: t,
      range: e.length
    }), void 0 === n ? n = e.length - t : n > e.length - t && fail(1746, {
      length: n,
      range: e.length - t
    }), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return 0 === _BasePath.comparator(this, e);
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof _BasePath ? e.forEach((e2) => {
      t.push(e2);
    }) : t.push(e), this.construct(t);
  }
  /** The index of one past the last segment of the path. */
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return 0 === this.length;
  }
  isPrefixOf(e) {
    if (e.length < this.length) return false;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length) return false;
    for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit(); t < n; t++) e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  /**
   * Compare 2 paths segment by segment, prioritizing numeric IDs
   * (e.g., "__id123__") in numeric ascending order, followed by string
   * segments in lexicographical order.
   */
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r = 0; r < n; r++) {
      const n2 = _BasePath.compareSegments(e.get(r), t.get(r));
      if (0 !== n2) return n2;
    }
    return __PRIVATE_primitiveComparator(e.length, t.length);
  }
  static compareSegments(e, t) {
    const n = _BasePath.isNumericId(e), r = _BasePath.isNumericId(t);
    return n && !r ? -1 : !n && r ? 1 : n && r ? _BasePath.extractNumericId(e).compare(_BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
  }
  // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
  static isNumericId(e) {
    return e.startsWith("__id") && e.endsWith("__");
  }
  static extractNumericId(e) {
    return Integer.fromString(e.substring(4, e.length - 2));
  }
};
__name(_BasePath, "BasePath");
var BasePath = _BasePath;
var _ResourcePath = class _ResourcePath extends BasePath {
  construct(e, t, n) {
    return new _ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns a string representation of this path
   * where each path segment has been encoded with
   * `encodeURIComponent`.
   */
  toUriEncodedString() {
    return this.toArray().map(encodeURIComponent).join("/");
  }
  /**
   * Creates a resource path from the given slash-delimited string. If multiple
   * arguments are provided, all components are combined. Leading and trailing
   * slashes from all components are ignored.
   */
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter((e2) => e2.length > 0));
    }
    return new _ResourcePath(t);
  }
  static emptyPath() {
    return new _ResourcePath([]);
  }
};
__name(_ResourcePath, "ResourcePath");
var ResourcePath = _ResourcePath;
var M = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
var _FieldPath$1 = class _FieldPath$1 extends BasePath {
  construct(e, t, n) {
    return new _FieldPath$1(e, t, n);
  }
  /**
   * Returns true if the string could be used as a segment in a field path
   * without escaping.
   */
  static isValidIdentifier(e) {
    return M.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), _FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns true if this field references the key of a document.
   */
  isKeyField() {
    return 1 === this.length && this.get(0) === F;
  }
  /**
   * The field designating the key of a document.
   */
  static keyField() {
    return new _FieldPath$1([F]);
  }
  /**
   * Parses a field string from the given server-formatted string.
   *
   * - Splitting the empty string is not allowed (for now at least).
   * - Empty segments within the string (e.g. if there are two consecutive
   *   separators) are not allowed.
   *
   * TODO(b/37244157): we should make this more strict. Right now, it allows
   * non-identifier path components, even if they aren't escaped.
   */
  static fromServerFormat(e) {
    const t = [];
    let n = "", r = 0;
    const __PRIVATE_addCurrentSegment = /* @__PURE__ */ __name(() => {
      if (0 === n.length) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(n), n = "";
    }, "__PRIVATE_addCurrentSegment");
    let i = false;
    for (; r < e.length; ) {
      const t2 = e[r];
      if ("\\" === t2) {
        if (r + 1 === e.length) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t3 = e[r + 1];
        if ("\\" !== t3 && "." !== t3 && "`" !== t3) throw new FirestoreError(D.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n += t3, r += 2;
      } else "`" === t2 ? (i = !i, r++) : "." !== t2 || i ? (n += t2, r++) : (__PRIVATE_addCurrentSegment(), r++);
    }
    if (__PRIVATE_addCurrentSegment(), i) throw new FirestoreError(D.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new _FieldPath$1(t);
  }
  static emptyPath() {
    return new _FieldPath$1([]);
  }
};
__name(_FieldPath$1, "FieldPath$1");
var FieldPath$1 = _FieldPath$1;
var _DocumentKey = class _DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new _DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new _DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new _DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  /** Returns true if the document is in the specified collectionId. */
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  /** Returns the collection group (i.e. the name of the parent collection) for this key. */
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  /** Returns the fully qualified path to the parent collection. */
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  /**
   * Creates and returns a new document key with the given segments.
   *
   * @param segments - The segments of the path to the document
   * @returns A new instance of DocumentKey
   */
  static fromSegments(e) {
    return new _DocumentKey(new ResourcePath(e.slice()));
  }
};
__name(_DocumentKey, "DocumentKey");
var DocumentKey = _DocumentKey;
function __PRIVATE_validateNonEmptyArgument(e, t, n) {
  if (!n) throw new FirestoreError(D.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
__name(__PRIVATE_validateNonEmptyArgument, "__PRIVATE_validateNonEmptyArgument");
function __PRIVATE_validateIsNotUsedTogether(e, t, n, r) {
  if (true === t && true === r) throw new FirestoreError(D.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}
__name(__PRIVATE_validateIsNotUsedTogether, "__PRIVATE_validateIsNotUsedTogether");
function __PRIVATE_validateDocumentPath(e) {
  if (!DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
__name(__PRIVATE_validateDocumentPath, "__PRIVATE_validateDocumentPath");
function __PRIVATE_validateCollectionPath(e) {
  if (DocumentKey.isDocumentKey(e)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
__name(__PRIVATE_validateCollectionPath, "__PRIVATE_validateCollectionPath");
function __PRIVATE_isPlainObject(e) {
  return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
}
__name(__PRIVATE_isPlainObject, "__PRIVATE_isPlainObject");
function __PRIVATE_valueDescription(e) {
  if (void 0 === e) return "undefined";
  if (null === e) return "null";
  if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if ("number" == typeof e || "boolean" == typeof e) return "" + e;
  if ("object" == typeof e) {
    if (e instanceof Array) return "an array";
    {
      const t = (
        /** try to get the constructor name for an object. */
        (/* @__PURE__ */ __name(function __PRIVATE_tryGetCustomObjectType(e2) {
          if (e2.constructor) return e2.constructor.name;
          return null;
        }, "__PRIVATE_tryGetCustomObjectType"))(e)
      );
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return "function" == typeof e ? "a function" : fail(12329, {
    type: typeof e
  });
}
__name(__PRIVATE_valueDescription, "__PRIVATE_valueDescription");
function __PRIVATE_cast(e, t) {
  if ("_delegate" in e && // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name) throw new FirestoreError(D.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(D.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
}
__name(__PRIVATE_cast, "__PRIVATE_cast");
function __PRIVATE_validatePositiveNumber(e, t) {
  if (t <= 0) throw new FirestoreError(D.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
}
__name(__PRIVATE_validatePositiveNumber, "__PRIVATE_validatePositiveNumber");
function property(e, t) {
  const n = {
    typeString: e
  };
  return t && (n.value = t), n;
}
__name(property, "property");
function __PRIVATE_validateJSON(e, t) {
  if (!__PRIVATE_isPlainObject(e)) throw new FirestoreError(D.INVALID_ARGUMENT, "JSON must be an object");
  let n;
  for (const r in t) if (t[r]) {
    const i = t[r].typeString, s = "value" in t[r] ? {
      value: t[r].value
    } : void 0;
    if (!(r in e)) {
      n = `JSON missing required field: '${r}'`;
      break;
    }
    const o = e[r];
    if (i && typeof o !== i) {
      n = `JSON field '${r}' must be a ${i}.`;
      break;
    }
    if (void 0 !== s && o !== s.value) {
      n = `Expected '${r}' field to equal '${s.value}'`;
      break;
    }
  }
  if (n) throw new FirestoreError(D.INVALID_ARGUMENT, n);
  return true;
}
__name(__PRIVATE_validateJSON, "__PRIVATE_validateJSON");
var x = -62135596800;
var O = 1e6;
var _Timestamp = class _Timestamp {
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */
  static now() {
    return _Timestamp.fromMillis(Date.now());
  }
  /**
   * Creates a new timestamp from the given date.
   *
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(e) {
    return _Timestamp.fromMillis(e.getTime());
  }
  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(e) {
    const t = Math.floor(e / 1e3), n = Math.floor((e - 1e3 * t) * O);
    return new _Timestamp(t, n);
  }
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < x) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800) throw new FirestoreError(D.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  /**
   * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
   * causes a loss of precision since `Date` objects only support millisecond
   * precision.
   *
   * @returns JavaScript `Date` object representing the same point in time as
   *     this `Timestamp`, with millisecond precision.
   */
  toDate() {
    return new Date(this.toMillis());
  }
  /**
   * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
   * epoch). This operation causes a loss of precision.
   *
   * @returns The point in time corresponding to this timestamp, represented as
   *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
   */
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / O;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  /**
   * Returns true if this `Timestamp` is equal to the provided one.
   *
   * @param other - The `Timestamp` to compare against.
   * @returns true if this `Timestamp` is equal to the provided one.
   */
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  /** Returns a textual representation of this `Timestamp`. */
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  /**
   * Returns a JSON-serializable representation of this `Timestamp`.
   */
  toJSON() {
    return {
      type: _Timestamp._jsonSchemaVersion,
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  /**
   * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, _Timestamp._jsonSchema)) return new _Timestamp(e.seconds, e.nanoseconds);
  }
  /**
   * Converts this object to a primitive string, which allows `Timestamp` objects
   * to be compared using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const e = this.seconds - x;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
};
__name(_Timestamp, "Timestamp");
var Timestamp = _Timestamp;
Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
  type: property("string", Timestamp._jsonSchemaVersion),
  seconds: property("number"),
  nanoseconds: property("number")
};
var _SnapshotVersion = class _SnapshotVersion {
  static fromTimestamp(e) {
    return new _SnapshotVersion(e);
  }
  static min() {
    return new _SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new _SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  constructor(e) {
    this.timestamp = e;
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  /** Returns a number representation of the version for use in spec tests. */
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
};
__name(_SnapshotVersion, "SnapshotVersion");
var SnapshotVersion = _SnapshotVersion;
var N = -1;
var _FieldIndex = class _FieldIndex {
  constructor(e, t, n, r) {
    this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r;
  }
};
__name(_FieldIndex, "FieldIndex");
var FieldIndex = _FieldIndex;
FieldIndex.UNKNOWN_ID = -1;
function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
  const n = e.toTimestamp().seconds, r = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r ? new Timestamp(n + 1, 0) : new Timestamp(n, r));
  return new IndexOffset(i, DocumentKey.empty(), t);
}
__name(__PRIVATE_newIndexOffsetSuccessorFromReadTime, "__PRIVATE_newIndexOffsetSuccessorFromReadTime");
function __PRIVATE_newIndexOffsetFromDocument(e) {
  return new IndexOffset(e.readTime, e.key, N);
}
__name(__PRIVATE_newIndexOffsetFromDocument, "__PRIVATE_newIndexOffsetFromDocument");
var _IndexOffset = class _IndexOffset {
  constructor(e, t, n) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = n;
  }
  /** Returns an offset that sorts before all regular offsets. */
  static min() {
    return new _IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), N);
  }
  /** Returns an offset that sorts after all regular offsets. */
  static max() {
    return new _IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), N);
  }
};
__name(_IndexOffset, "IndexOffset");
var IndexOffset = _IndexOffset;
function __PRIVATE_indexOffsetComparator(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
}
__name(__PRIVATE_indexOffsetComparator, "__PRIVATE_indexOffsetComparator");
var B = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
var _PersistenceTransaction = class _PersistenceTransaction {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
};
__name(_PersistenceTransaction, "PersistenceTransaction");
var PersistenceTransaction = _PersistenceTransaction;
async function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  if (e.code !== D.FAILED_PRECONDITION || e.message !== B) throw e;
  __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
}
__name(__PRIVATE_ignoreIfPrimaryLeaseLoss, "__PRIVATE_ignoreIfPrimaryLeaseLoss");
var _PersistencePromise = class _PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
    this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
    // chaining.
    this.callbackAttached = false, e((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && // value should be defined unless T is Void, but we can't express
      // that in the type system.
      this.nextCallback(e2);
    }, (e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    });
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return this.callbackAttached && fail(59440), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new _PersistencePromise((n, r) => {
      this.nextCallback = (t2) => {
        this.wrapSuccess(e, t2).next(n, r);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t, e2).next(n, r);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof _PersistencePromise ? t : _PersistencePromise.resolve(t);
    } catch (e2) {
      return _PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : _PersistencePromise.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : _PersistencePromise.reject(t);
  }
  static resolve(e) {
    return new _PersistencePromise((t, n) => {
      t(e);
    });
  }
  static reject(e) {
    return new _PersistencePromise((t, n) => {
      n(e);
    });
  }
  static waitFor(e) {
    return new _PersistencePromise((t, n) => {
      let r = 0, i = 0, s = false;
      e.forEach((e2) => {
        ++r, e2.next(() => {
          ++i, s && i === r && t();
        }, (e3) => n(e3));
      }), s = true, i === r && t();
    });
  }
  /**
   * Given an array of predicate functions that asynchronously evaluate to a
   * boolean, implements a short-circuiting `or` between the results. Predicates
   * will be evaluated until one of them returns `true`, then stop. The final
   * result will be whether any of them returned `true`.
   */
  static or(e) {
    let t = _PersistencePromise.resolve(false);
    for (const n of e) t = t.next((e2) => e2 ? _PersistencePromise.resolve(e2) : n());
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return e.forEach((e2, r) => {
      n.push(t.call(this, e2, r));
    }), this.waitFor(n);
  }
  /**
   * Concurrently map all array elements through asynchronous function.
   */
  static mapArray(e, t) {
    return new _PersistencePromise((n, r) => {
      const i = e.length, s = new Array(i);
      let o = 0;
      for (let _ = 0; _ < i; _++) {
        const a = _;
        t(e[a]).next((e2) => {
          s[a] = e2, ++o, o === i && n(s);
        }, (e2) => r(e2));
      }
    });
  }
  /**
   * An alternative to recursive PersistencePromise calls, that avoids
   * potential memory problems from unbounded chains of promises.
   *
   * The `action` will be called repeatedly while `condition` is true.
   */
  static doWhile(e, t) {
    return new _PersistencePromise((n, r) => {
      const process2 = /* @__PURE__ */ __name(() => {
        true === e() ? t().next(() => {
          process2();
        }, r) : n();
      }, "process");
      process2();
    });
  }
};
__name(_PersistencePromise, "PersistencePromise");
var PersistencePromise = _PersistencePromise;
function __PRIVATE_getAndroidVersion(e) {
  const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
  return Number(n);
}
__name(__PRIVATE_getAndroidVersion, "__PRIVATE_getAndroidVersion");
function __PRIVATE_isIndexedDbTransactionError(e) {
  return "IndexedDbTransactionError" === e.name;
}
__name(__PRIVATE_isIndexedDbTransactionError, "__PRIVATE_isIndexedDbTransactionError");
var ___PRIVATE_ListenSequence = class ___PRIVATE_ListenSequence {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.ae(e2), this.ue = (e2) => t.writeSequenceNumber(e2));
  }
  ae(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.ue && this.ue(e), e;
  }
};
__name(___PRIVATE_ListenSequence, "__PRIVATE_ListenSequence");
var __PRIVATE_ListenSequence = ___PRIVATE_ListenSequence;
__PRIVATE_ListenSequence.ce = -1;
var q = -1;
function __PRIVATE_isNullOrUndefined(e) {
  return null == e;
}
__name(__PRIVATE_isNullOrUndefined, "__PRIVATE_isNullOrUndefined");
function __PRIVATE_isNegativeZero(e) {
  return 0 === e && 1 / e == -1 / 0;
}
__name(__PRIVATE_isNegativeZero, "__PRIVATE_isNegativeZero");
function isSafeInteger(e) {
  return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
}
__name(isSafeInteger, "isSafeInteger");
var U = "";
function __PRIVATE_encodeResourcePath(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
  return __PRIVATE_encodeSeparator(t);
}
__name(__PRIVATE_encodeResourcePath, "__PRIVATE_encodeResourcePath");
function __PRIVATE_encodeSegment(e, t) {
  let n = t;
  const r = e.length;
  for (let t2 = 0; t2 < r; t2++) {
    const r2 = e.charAt(t2);
    switch (r2) {
      case "\0":
        n += "";
        break;
      case U:
        n += "";
        break;
      default:
        n += r2;
    }
  }
  return n;
}
__name(__PRIVATE_encodeSegment, "__PRIVATE_encodeSegment");
function __PRIVATE_encodeSeparator(e) {
  return e + U + "";
}
__name(__PRIVATE_encodeSeparator, "__PRIVATE_encodeSeparator");
var $ = "remoteDocuments";
var W = "owner";
var G = "mutationQueues";
var j = "mutations";
var Y = "documentMutations";
var ee = "remoteDocumentsV14";
var oe = "remoteDocumentGlobal";
var ae = "targets";
var le = "targetDocuments";
var Ee = "targetGlobal";
var Re = "collectionParents";
var Ve = "clientMetadata";
var me = "bundles";
var ge = "namedQueries";
var ye = "indexConfiguration";
var De = "indexState";
var Me = "indexEntries";
var Be = "documentOverlays";
var $e = "globals";
var Qe = [...[...[...[...[G, j, Y, $, ae, W, Ee, le], Ve], oe], Re], me, ge];
var Ge = [...Qe, Be];
var ze = [G, j, Y, ee, ae, W, Ee, le, Ve, oe, Re, me, ge, Be];
var je = ze;
var He = [...je, ye, De, Me];
var Ze = [...He, $e];
function __PRIVATE_objectSize(e) {
  let t = 0;
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
__name(__PRIVATE_objectSize, "__PRIVATE_objectSize");
function forEach(e, t) {
  for (const n in e) Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
__name(forEach, "forEach");
function isEmpty(e) {
  for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return false;
  return true;
}
__name(isEmpty, "isEmpty");
var _SortedMap = class _SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  // Returns a copy of the map, with the specified key/value added or replaced.
  insert(e, t) {
    return new _SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns a copy of the map, with the specified key removed.
  remove(e) {
    return new _SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns the value of the node with the given key, or null.
  get(e) {
    let t = this.root;
    for (; !t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (0 === n) return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  // Returns the index of the element in this sorted map, or -1 if it doesn't
  // exist.
  indexOf(e) {
    let t = 0, n = this.root;
    for (; !n.isEmpty(); ) {
      const r = this.comparator(e, n.key);
      if (0 === r) return t + n.left.size;
      r < 0 ? n = n.left : (
        // Count all nodes left of the node plus the node itself
        (t += n.left.size + 1, n = n.right)
      );
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  // Returns the total number of nodes in the map.
  get size() {
    return this.root.size;
  }
  // Returns the minimum key in the map.
  minKey() {
    return this.root.minKey();
  }
  // Returns the maximum key in the map.
  maxKey() {
    return this.root.maxKey();
  }
  // Traverses the map in key order and calls the specified action function
  // for each key/value pair. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), false)), `{${e.join(", ")}}`;
  }
  // Traverses the map in reverse key order and calls the specified action
  // function for each key/value pair. If action returns true, traversal is
  // aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  // Returns an iterator over the SortedMap.
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
};
__name(_SortedMap, "SortedMap");
var SortedMap = _SortedMap;
var _SortedMapIterator = class _SortedMapIterator {
  constructor(e, t, n, r) {
    this.isReverse = r, this.nodeStack = [];
    let i = 1;
    for (; !e.isEmpty(); ) if (i = t ? n(e.key, t) : 1, // flip the comparison if we're going in reverse
    t && r && (i *= -1), i < 0)
      e = this.isReverse ? e.left : e.right;
    else {
      if (0 === i) {
        this.nodeStack.push(e);
        break;
      }
      this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
    }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
    else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (0 === this.nodeStack.length) return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
};
__name(_SortedMapIterator, "SortedMapIterator");
var SortedMapIterator = _SortedMapIterator;
var _LLRBNode = class _LLRBNode {
  constructor(e, t, n, r, i) {
    this.key = e, this.value = t, this.color = null != n ? n : _LLRBNode.RED, this.left = null != r ? r : _LLRBNode.EMPTY, this.right = null != i ? i : _LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  // Returns a copy of the current node, optionally replacing pieces of it.
  copy(e, t, n, r, i) {
    return new _LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  // Traverses the tree in key order and calls the specified action function
  // for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  // Traverses the tree in reverse key order and calls the specified action
  // function for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  // Returns the minimum node in the tree.
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  // Returns the maximum key in the tree.
  minKey() {
    return this.min().key;
  }
  // Returns the maximum key in the tree.
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  // Returns new tree, with the key/value added.
  insert(e, t, n) {
    let r = this;
    const i = n(e, r.key);
    return r = i < 0 ? r.copy(null, null, null, r.left.insert(e, t, n), null) : 0 === i ? r.copy(null, t, null, null, null) : r.copy(null, null, null, null, r.right.insert(e, t, n)), r.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty()) return _LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  // Returns new tree, with the specified item removed.
  remove(e, t) {
    let n, r = this;
    if (t(e, r.key) < 0) r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(e, t), null);
    else {
      if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === t(e, r.key)) {
        if (r.right.isEmpty()) return _LLRBNode.EMPTY;
        n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
      }
      r = r.copy(null, null, null, null, r.right.remove(e, t));
    }
    return r.fixUp();
  }
  isRed() {
    return this.color;
  }
  // Returns new tree after performing any needed rotations.
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  // For testing.
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  // In a balanced RB tree, the black-depth (number of black nodes) from root to
  // leaves is equal on both sides.  This function verifies that or asserts.
  check() {
    if (this.isRed() && this.left.isRed()) throw fail(43730, {
      key: this.key,
      value: this.value
    });
    if (this.right.isRed()) throw fail(14113, {
      key: this.key,
      value: this.value
    });
    const e = this.left.check();
    if (e !== this.right.check()) throw fail(27949);
    return e + (this.isRed() ? 0 : 1);
  }
};
__name(_LLRBNode, "LLRBNode");
var LLRBNode = _LLRBNode;
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
var _a;
LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
(_a = class {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail(57766);
  }
  get value() {
    throw fail(16141);
  }
  get color() {
    throw fail(16727);
  }
  get left() {
    throw fail(29726);
  }
  get right() {
    throw fail(36894);
  }
  // Returns a copy of the current node.
  copy(e, t, n, r, i) {
    return this;
  }
  // Returns a copy of the tree, with the specified key/value added.
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  // Returns a copy of the tree, with the specified key removed.
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  // For testing.
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
}, __name(_a, "LLRBEmptyNode"), _a)();
var _SortedSet = class _SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return null !== this.data.get(e);
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  /** Iterates elements in order defined by "comparator" */
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), false));
  }
  /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (; n.hasNext(); ) {
      const r = n.getNext();
      if (this.comparator(r.key, e[1]) >= 0) return;
      t(r.key);
    }
  }
  /**
   * Iterates over `elem`s such that: start &lt;= elem until false is returned.
   */
  forEachWhile(e, t) {
    let n;
    for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); ) {
      if (!e(n.getNext().key)) return;
    }
  }
  /** Finds the least element greater than or equal to `elem`. */
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  /** Inserts or updates an element */
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  /** Deletes an element */
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((e2) => {
      t = t.add(e2);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof _SortedSet)) return false;
    if (this.size !== e.size) return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (; t.hasNext(); ) {
      const e2 = t.getNext().key, r = n.getNext().key;
      if (0 !== this.comparator(e2, r)) return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new _SortedSet(this.comparator);
    return t.data = e, t;
  }
};
__name(_SortedSet, "SortedSet");
var SortedSet = _SortedSet;
var _SortedSetIterator = class _SortedSetIterator {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
};
__name(_SortedSetIterator, "SortedSetIterator");
var SortedSetIterator = _SortedSetIterator;
var _FieldMask = class _FieldMask {
  constructor(e) {
    this.fields = e, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new _FieldMask([]);
  }
  /**
   * Returns a new FieldMask object that is the result of adding all the given
   * fields paths to this field mask.
   */
  unionWith(e) {
    let t = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields) t = t.add(e2);
    for (const n of e) t = t.add(n);
    return new _FieldMask(t.toArray());
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */
  covers(e) {
    for (const t of this.fields) if (t.isPrefixOf(e)) return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, (e2, t) => e2.isEqual(t));
  }
};
__name(_FieldMask, "FieldMask");
var FieldMask = _FieldMask;
var ___PRIVATE_Base64DecodeError = class ___PRIVATE_Base64DecodeError extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
};
__name(___PRIVATE_Base64DecodeError, "__PRIVATE_Base64DecodeError");
var __PRIVATE_Base64DecodeError = ___PRIVATE_Base64DecodeError;
var _ByteString = class _ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = (/* @__PURE__ */ __name(function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }, "__PRIVATE_decodeBase64"))(e);
    return new _ByteString(t);
  }
  static fromUint8Array(e) {
    const t = (
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      (/* @__PURE__ */ __name(function __PRIVATE_binaryStringFromUint8Array(e2) {
        let t2 = "";
        for (let n = 0; n < e2.length; ++n) t2 += String.fromCharCode(e2[n]);
        return t2;
      }, "__PRIVATE_binaryStringFromUint8Array"))(e)
    );
    return new _ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: /* @__PURE__ */ __name(() => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: void 0,
        done: true
      }, "next")
    };
  }
  toBase64() {
    return (/* @__PURE__ */ __name(function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }, "__PRIVATE_encodeBase64"))(this.binaryString);
  }
  toUint8Array() {
    return (/* @__PURE__ */ __name(function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n);
      return t;
    }, "__PRIVATE_uint8ArrayFromBinaryString"))(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
};
__name(_ByteString, "ByteString");
var ByteString = _ByteString;
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var Ye = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function __PRIVATE_normalizeTimestamp(e) {
  if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
    let t = 0;
    const n = Ye.exec(e);
    if (__PRIVATE_hardAssert(!!n, 46558, {
      timestamp: e
    }), n[1]) {
      let e2 = n[1];
      e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
    }
    const r = new Date(e);
    return {
      seconds: Math.floor(r.getTime() / 1e3),
      nanos: t
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
}
__name(__PRIVATE_normalizeTimestamp, "__PRIVATE_normalizeTimestamp");
function __PRIVATE_normalizeNumber(e) {
  return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}
__name(__PRIVATE_normalizeNumber, "__PRIVATE_normalizeNumber");
function __PRIVATE_normalizeByteString(e) {
  return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
}
__name(__PRIVATE_normalizeByteString, "__PRIVATE_normalizeByteString");
var et = "server_timestamp";
var tt = "__type__";
var nt = "__previous_value__";
var rt = "__local_write_time__";
function __PRIVATE_isServerTimestamp(e) {
  const t = (e?.mapValue?.fields || {})[tt]?.stringValue;
  return t === et;
}
__name(__PRIVATE_isServerTimestamp, "__PRIVATE_isServerTimestamp");
function __PRIVATE_getPreviousValue(e) {
  const t = e.mapValue.fields[nt];
  return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}
__name(__PRIVATE_getPreviousValue, "__PRIVATE_getPreviousValue");
function __PRIVATE_getLocalWriteTime(e) {
  const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields[rt].timestampValue);
  return new Timestamp(t.seconds, t.nanos);
}
__name(__PRIVATE_getLocalWriteTime, "__PRIVATE_getLocalWriteTime");
var _DatabaseInfo = class _DatabaseInfo {
  /**
   * Constructs a DatabaseInfo using the provided host, databaseId and
   * persistenceKey.
   *
   * @param databaseId - The database to use.
   * @param appId - The Firebase App Id.
   * @param persistenceKey - A unique identifier for this Firestore's local
   * storage (used in conjunction with the databaseId).
   * @param host - The Firestore backend host to connect to.
   * @param ssl - Whether to use SSL when connecting.
   * @param forceLongPolling - Whether to use the forceLongPolling option
   * when using WebChannel as the network transport.
   * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
   * option when using WebChannel as the network transport.
   * @param longPollingOptions - Options that configure long-polling.
   * @param useFetchStreams - Whether to use the Fetch API instead of
   * XMLHTTPRequest
   */
  constructor(e, t, n, r, i, s, o, _, a, u, c) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a, this.isUsingEmulator = u, this.apiKey = c;
  }
};
__name(_DatabaseInfo, "DatabaseInfo");
var DatabaseInfo = _DatabaseInfo;
var it = "(default)";
var _DatabaseId = class _DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || it;
  }
  static empty() {
    return new _DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return this.database === it;
  }
  isEqual(e) {
    return e instanceof _DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
};
__name(_DatabaseId, "DatabaseId");
var DatabaseId = _DatabaseId;
function __PRIVATE_databaseIdFromApp(e, t) {
  if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new FirestoreError(D.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
  return new DatabaseId(e.options.projectId, t);
}
__name(__PRIVATE_databaseIdFromApp, "__PRIVATE_databaseIdFromApp");
var st = "__type__";
var ot = "__max__";
var _t = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: ot
      }
    }
  }
};
var at = "__vector__";
var ut = "value";
function __PRIVATE_typeOrder(e) {
  return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : __PRIVATE_isVectorValue(e) ? 10 : 11 : fail(28295, {
    value: e
  });
}
__name(__PRIVATE_typeOrder, "__PRIVATE_typeOrder");
function __PRIVATE_valueEquals(e, t) {
  if (e === t) return true;
  const n = __PRIVATE_typeOrder(e);
  if (n !== __PRIVATE_typeOrder(t)) return false;
  switch (n) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
    case 3:
      return (/* @__PURE__ */ __name(function __PRIVATE_timestampEquals(e2, t2) {
        if ("string" == typeof e2.timestampValue && "string" == typeof t2.timestampValue && e2.timestampValue.length === t2.timestampValue.length)
          return e2.timestampValue === t2.timestampValue;
        const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r = __PRIVATE_normalizeTimestamp(t2.timestampValue);
        return n2.seconds === r.seconds && n2.nanos === r.nanos;
      }, "__PRIVATE_timestampEquals"))(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return (/* @__PURE__ */ __name(function __PRIVATE_blobEquals(e2, t2) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
      }, "__PRIVATE_blobEquals"))(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return (/* @__PURE__ */ __name(function __PRIVATE_geoPointEquals(e2, t2) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
      }, "__PRIVATE_geoPointEquals"))(e, t);
    case 2:
      return (/* @__PURE__ */ __name(function __PRIVATE_numberEquals(e2, t2) {
        if ("integerValue" in e2 && "integerValue" in t2) return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
        if ("doubleValue" in e2 && "doubleValue" in t2) {
          const n2 = __PRIVATE_normalizeNumber(e2.doubleValue), r = __PRIVATE_normalizeNumber(t2.doubleValue);
          return n2 === r ? __PRIVATE_isNegativeZero(n2) === __PRIVATE_isNegativeZero(r) : isNaN(n2) && isNaN(r);
        }
        return false;
      }, "__PRIVATE_numberEquals"))(e, t);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
    case 10:
    case 11:
      return (/* @__PURE__ */ __name(function __PRIVATE_objectEquals(e2, t2) {
        const n2 = e2.mapValue.fields || {}, r = t2.mapValue.fields || {};
        if (__PRIVATE_objectSize(n2) !== __PRIVATE_objectSize(r)) return false;
        for (const e3 in n2) if (n2.hasOwnProperty(e3) && (void 0 === r[e3] || !__PRIVATE_valueEquals(n2[e3], r[e3]))) return false;
        return true;
      }, "__PRIVATE_objectEquals"))(e, t);
    default:
      return fail(52216, {
        left: e
      });
  }
}
__name(__PRIVATE_valueEquals, "__PRIVATE_valueEquals");
function __PRIVATE_arrayValueContains(e, t) {
  return void 0 !== (e.values || []).find((e2) => __PRIVATE_valueEquals(e2, t));
}
__name(__PRIVATE_arrayValueContains, "__PRIVATE_arrayValueContains");
function __PRIVATE_valueCompare(e, t) {
  if (e === t) return 0;
  const n = __PRIVATE_typeOrder(e), r = __PRIVATE_typeOrder(t);
  if (n !== r) return __PRIVATE_primitiveComparator(n, r);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
    case 2:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareNumbers(e2, t2) {
        const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
        return n2 < r2 ? -1 : n2 > r2 ? 1 : n2 === r2 ? 0 : (
          // one or both are NaN.
          isNaN(n2) ? isNaN(r2) ? 0 : -1 : 1
        );
      }, "__PRIVATE_compareNumbers"))(e, t);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
    case 5:
      return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);
    case 6:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareBlobs(e2, t2) {
        const n2 = __PRIVATE_normalizeByteString(e2), r2 = __PRIVATE_normalizeByteString(t2);
        return n2.compareTo(r2);
      }, "__PRIVATE_compareBlobs"))(e.bytesValue, t.bytesValue);
    case 7:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareReferences(e2, t2) {
        const n2 = e2.split("/"), r2 = t2.split("/");
        for (let e3 = 0; e3 < n2.length && e3 < r2.length; e3++) {
          const t3 = __PRIVATE_primitiveComparator(n2[e3], r2[e3]);
          if (0 !== t3) return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r2.length);
      }, "__PRIVATE_compareReferences"))(e.referenceValue, t.referenceValue);
    case 8:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareGeoPoints(e2, t2) {
        const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
        if (0 !== n2) return n2;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
      }, "__PRIVATE_compareGeoPoints"))(e.geoPointValue, t.geoPointValue);
    case 9:
      return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);
    case 10:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareVectors(e2, t2) {
        const n2 = e2.fields || {}, r2 = t2.fields || {}, i = n2[ut]?.arrayValue, s = r2[ut]?.arrayValue, o = __PRIVATE_primitiveComparator(i?.values?.length || 0, s?.values?.length || 0);
        if (0 !== o) return o;
        return __PRIVATE_compareArrays(i, s);
      }, "__PRIVATE_compareVectors"))(e.mapValue, t.mapValue);
    case 11:
      return (/* @__PURE__ */ __name(function __PRIVATE_compareMaps(e2, t2) {
        if (e2 === _t.mapValue && t2 === _t.mapValue) return 0;
        if (e2 === _t.mapValue) return 1;
        if (t2 === _t.mapValue) return -1;
        const n2 = e2.fields || {}, r2 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
        r2.sort(), s.sort();
        for (let e3 = 0; e3 < r2.length && e3 < s.length; ++e3) {
          const t3 = __PRIVATE_compareUtf8Strings(r2[e3], s[e3]);
          if (0 !== t3) return t3;
          const o = __PRIVATE_valueCompare(n2[r2[e3]], i[s[e3]]);
          if (0 !== o) return o;
        }
        return __PRIVATE_primitiveComparator(r2.length, s.length);
      }, "__PRIVATE_compareMaps"))(e.mapValue, t.mapValue);
    default:
      throw fail(23264, {
        he: n
      });
  }
}
__name(__PRIVATE_valueCompare, "__PRIVATE_valueCompare");
function __PRIVATE_compareTimestamps(e, t) {
  if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
  const n = __PRIVATE_normalizeTimestamp(e), r = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r.seconds);
  return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r.nanos);
}
__name(__PRIVATE_compareTimestamps, "__PRIVATE_compareTimestamps");
function __PRIVATE_compareArrays(e, t) {
  const n = e.values || [], r = t.values || [];
  for (let e2 = 0; e2 < n.length && e2 < r.length; ++e2) {
    const t2 = __PRIVATE_valueCompare(n[e2], r[e2]);
    if (t2) return t2;
  }
  return __PRIVATE_primitiveComparator(n.length, r.length);
}
__name(__PRIVATE_compareArrays, "__PRIVATE_compareArrays");
function canonicalId(e) {
  return __PRIVATE_canonifyValue(e);
}
__name(canonicalId, "canonicalId");
function __PRIVATE_canonifyValue(e) {
  return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t.seconds},${t.nanos})`;
  }, "__PRIVATE_canonifyTimestamp"))(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  }, "__PRIVATE_canonifyByteString"))(e.bytesValue) : "referenceValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  }, "__PRIVATE_canonifyReference"))(e.referenceValue) : "geoPointValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  }, "__PRIVATE_canonifyGeoPoint"))(e.geoPointValue) : "arrayValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyArray(e2) {
    let t = "[", n = true;
    for (const r of e2.values || []) n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r);
    return t + "]";
  }, "__PRIVATE_canonifyArray"))(e.arrayValue) : "mapValue" in e ? (/* @__PURE__ */ __name(function __PRIVATE_canonifyMap(e2) {
    const t = Object.keys(e2.fields || {}).sort();
    let n = "{", r = true;
    for (const i of t) r ? r = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n + "}";
  }, "__PRIVATE_canonifyMap"))(e.mapValue) : fail(61005, {
    value: e
  });
}
__name(__PRIVATE_canonifyValue, "__PRIVATE_canonifyValue");
function __PRIVATE_estimateByteSize(e) {
  switch (__PRIVATE_typeOrder(e)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const t = __PRIVATE_getPreviousValue(e);
      return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;
    case 5:
      return 2 * e.stringValue.length;
    case 6:
      return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
    case 7:
      return e.referenceValue.length;
    case 9:
      return (/* @__PURE__ */ __name(function __PRIVATE_estimateArrayByteSize(e2) {
        return (e2.values || []).reduce((e3, t2) => e3 + __PRIVATE_estimateByteSize(t2), 0);
      }, "__PRIVATE_estimateArrayByteSize"))(e.arrayValue);
    case 10:
    case 11:
      return (/* @__PURE__ */ __name(function __PRIVATE_estimateMapByteSize(e2) {
        let t2 = 0;
        return forEach(e2.fields, (e3, n) => {
          t2 += e3.length + __PRIVATE_estimateByteSize(n);
        }), t2;
      }, "__PRIVATE_estimateMapByteSize"))(e.mapValue);
    default:
      throw fail(13486, {
        value: e
      });
  }
}
__name(__PRIVATE_estimateByteSize, "__PRIVATE_estimateByteSize");
function __PRIVATE_refValue(e, t) {
  return {
    referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
  };
}
__name(__PRIVATE_refValue, "__PRIVATE_refValue");
function isInteger(e) {
  return !!e && "integerValue" in e;
}
__name(isInteger, "isInteger");
function __PRIVATE_isNumber(e) {
  return isInteger(e) || (/* @__PURE__ */ __name(function __PRIVATE_isDouble(e2) {
    return !!e2 && "doubleValue" in e2;
  }, "__PRIVATE_isDouble"))(e);
}
__name(__PRIVATE_isNumber, "__PRIVATE_isNumber");
function isArray(e) {
  return !!e && "arrayValue" in e;
}
__name(isArray, "isArray");
function __PRIVATE_isNullValue(e) {
  return !!e && "nullValue" in e;
}
__name(__PRIVATE_isNullValue, "__PRIVATE_isNullValue");
function __PRIVATE_isNanValue(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
__name(__PRIVATE_isNanValue, "__PRIVATE_isNanValue");
function __PRIVATE_isMapValue(e) {
  return !!e && "mapValue" in e;
}
__name(__PRIVATE_isMapValue, "__PRIVATE_isMapValue");
function __PRIVATE_isVectorValue(e) {
  const t = (e?.mapValue?.fields || {})[st]?.stringValue;
  return t === at;
}
__name(__PRIVATE_isVectorValue, "__PRIVATE_isVectorValue");
function __PRIVATE_deepClone(e) {
  if (e.geoPointValue) return {
    geoPointValue: {
      ...e.geoPointValue
    }
  };
  if (e.timestampValue && "object" == typeof e.timestampValue) return {
    timestampValue: {
      ...e.timestampValue
    }
  };
  if (e.mapValue) {
    const t = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, (e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n)), t;
  }
  if (e.arrayValue) {
    const t = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0; n < (e.arrayValue.values || []).length; ++n) t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
    return t;
  }
  return {
    ...e
  };
}
__name(__PRIVATE_deepClone, "__PRIVATE_deepClone");
function __PRIVATE_isMaxValue(e) {
  return (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue === ot;
}
__name(__PRIVATE_isMaxValue, "__PRIVATE_isMaxValue");
var lt = {
  mapValue: {
    fields: {
      [st]: {
        stringValue: at
      },
      [ut]: {
        arrayValue: {}
      }
    }
  }
};
var _ObjectValue = class _ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new _ObjectValue({
      mapValue: {}
    });
  }
  /**
   * Returns the value at the given path or null.
   *
   * @param path - the path to search
   * @returns The value at the path or null if the path is not set.
   */
  field(e) {
    if (e.isEmpty()) return this.value;
    {
      let t = this.value;
      for (let n = 0; n < e.length - 1; ++n) if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t)) return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  /**
   * Sets the field to the provided value.
   *
   * @param path - The field path to set.
   * @param value - The value to set.
   */
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
  }
  /**
   * Sets the provided fields to the provided values.
   *
   * @param data - A map of fields to values (or null for deletes).
   */
  setAll(e) {
    let t = FieldPath$1.emptyPath(), n = {}, r = [];
    e.forEach((e2, i2) => {
      if (!t.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t);
        this.applyChanges(e3, n, r), n = {}, r = [], t = i2.popLast();
      }
      e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r);
  }
  /**
   * Removes the field at the specified path. If there is no field at the
   * specified path, nothing is changed.
   *
   * @param path - The field path to remove.
   */
  delete(e) {
    const t = this.field(e.popLast());
    __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals(this.value, e.value);
  }
  /**
   * Returns the map that contains the leaf element of `path`. If the parent
   * entry does not yet exist, or if it is not a map, a new map will be created.
   */
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let n = 0; n < e.length; ++n) {
      let r = t.mapValue.fields[e.get(n)];
      __PRIVATE_isMapValue(r) && r.mapValue.fields || (r = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(n)] = r), t = r;
    }
    return t.mapValue.fields;
  }
  /**
   * Modifies `fieldsMap` by adding, replacing or deleting the specified
   * entries.
   */
  applyChanges(e, t, n) {
    forEach(t, (t2, n2) => e[t2] = n2);
    for (const t2 of n) delete e[t2];
  }
  clone() {
    return new _ObjectValue(__PRIVATE_deepClone(this.value));
  }
};
__name(_ObjectValue, "ObjectValue");
var ObjectValue = _ObjectValue;
function __PRIVATE_extractFieldMask(e) {
  const t = [];
  return forEach(e.fields, (e2, n) => {
    const r = new FieldPath$1([e2]);
    if (__PRIVATE_isMapValue(n)) {
      const e3 = __PRIVATE_extractFieldMask(n.mapValue).fields;
      if (0 === e3.length)
        t.push(r);
      else
        for (const n2 of e3) t.push(r.child(n2));
    } else
      t.push(r);
  }), new FieldMask(t);
}
__name(__PRIVATE_extractFieldMask, "__PRIVATE_extractFieldMask");
var _MutableDocument = class _MutableDocument {
  constructor(e, t, n, r, i, s, o) {
    this.key = e, this.documentType = t, this.version = n, this.readTime = r, this.createTime = i, this.data = s, this.documentState = o;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(e) {
    return new _MutableDocument(
      e,
      0,
      /* version */
      SnapshotVersion.min(),
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(e, t, n, r) {
    return new _MutableDocument(
      e,
      1,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      n,
      r,
      0
      /* DocumentState.SYNCED */
    );
  }
  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(e, t) {
    return new _MutableDocument(
      e,
      2,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(e, t) {
    return new _MutableDocument(
      e,
      3,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      2
      /* DocumentState.HAS_COMMITTED_MUTATIONS */
    );
  }
  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it exists at a given version but
   * that its data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return 1 === this.documentState;
  }
  get hasCommittedMutations() {
    return 2 === this.documentState;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return 0 !== this.documentType;
  }
  isFoundDocument() {
    return 1 === this.documentType;
  }
  isNoDocument() {
    return 2 === this.documentType;
  }
  isUnknownDocument() {
    return 3 === this.documentType;
  }
  isEqual(e) {
    return e instanceof _MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new _MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
};
__name(_MutableDocument, "MutableDocument");
var MutableDocument = _MutableDocument;
var _Bound = class _Bound {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
};
__name(_Bound, "Bound");
var Bound = _Bound;
function __PRIVATE_boundCompareToDocument(e, t, n) {
  let r = 0;
  for (let i = 0; i < e.position.length; i++) {
    const s = t[i], o = e.position[i];
    if (s.field.isKeyField()) r = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
    else {
      r = __PRIVATE_valueCompare(o, n.data.field(s.field));
    }
    if ("desc" === s.dir && (r *= -1), 0 !== r) break;
  }
  return r;
}
__name(__PRIVATE_boundCompareToDocument, "__PRIVATE_boundCompareToDocument");
function __PRIVATE_boundEquals(e, t) {
  if (null === e) return null === t;
  if (null === t) return false;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length) return false;
  for (let n = 0; n < e.position.length; n++) {
    if (!__PRIVATE_valueEquals(e.position[n], t.position[n])) return false;
  }
  return true;
}
__name(__PRIVATE_boundEquals, "__PRIVATE_boundEquals");
var _OrderBy = class _OrderBy {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
};
__name(_OrderBy, "OrderBy");
var OrderBy = _OrderBy;
function __PRIVATE_orderByEquals(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
}
__name(__PRIVATE_orderByEquals, "__PRIVATE_orderByEquals");
var _Filter = class _Filter {
};
__name(_Filter, "Filter");
var Filter = _Filter;
var _FieldFilter = class _FieldFilter extends Filter {
  constructor(e, t, n) {
    super(), this.field = e, this.op = t, this.value = n;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t, n) {
    return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" === t ? new __PRIVATE_InFilter(e, n) : "not-in" === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new _FieldFilter(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return "!=" === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return 0 === e;
      case "!=":
        return 0 !== e;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail(47266, {
          operator: this.op
        });
    }
  }
  isInequality() {
    return [
      "<",
      "<=",
      ">",
      ">=",
      "!=",
      "not-in"
      /* Operator.NOT_IN */
    ].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
};
__name(_FieldFilter, "FieldFilter");
var FieldFilter = _FieldFilter;
var _CompositeFilter = class _CompositeFilter extends Filter {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.Pe = null;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t) {
    return new _CompositeFilter(e, t);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find((t) => !t.matches(e)) : void 0 !== this.filters.find((t) => t.matches(e));
  }
  getFlattenedFilters() {
    return null !== this.Pe || (this.Pe = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.Pe;
  }
  // Returns a mutable copy of `this.filters`
  getFilters() {
    return Object.assign([], this.filters);
  }
};
__name(_CompositeFilter, "CompositeFilter");
var CompositeFilter = _CompositeFilter;
function __PRIVATE_compositeFilterIsConjunction(e) {
  return "and" === e.op;
}
__name(__PRIVATE_compositeFilterIsConjunction, "__PRIVATE_compositeFilterIsConjunction");
function __PRIVATE_compositeFilterIsFlatConjunction(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}
__name(__PRIVATE_compositeFilterIsFlatConjunction, "__PRIVATE_compositeFilterIsFlatConjunction");
function __PRIVATE_compositeFilterIsFlat(e) {
  for (const t of e.filters) if (t instanceof CompositeFilter) return false;
  return true;
}
__name(__PRIVATE_compositeFilterIsFlat, "__PRIVATE_compositeFilterIsFlat");
function __PRIVATE_canonifyFilter(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
  {
    const t = e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
    return `${e.op}(${t})`;
  }
}
__name(__PRIVATE_canonifyFilter, "__PRIVATE_canonifyFilter");
function __PRIVATE_filterEquals(e, t) {
  return e instanceof FieldFilter ? (/* @__PURE__ */ __name(function __PRIVATE_fieldFilterEquals(e2, t2) {
    return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals(e2.value, t2.value);
  }, "__PRIVATE_fieldFilterEquals"))(e, t) : e instanceof CompositeFilter ? (/* @__PURE__ */ __name(function __PRIVATE_compositeFilterEquals(e2, t2) {
    if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
      return e2.filters.reduce((e3, n, r) => e3 && __PRIVATE_filterEquals(n, t2.filters[r]), true);
    }
    return false;
  }, "__PRIVATE_compositeFilterEquals"))(e, t) : void fail(19439);
}
__name(__PRIVATE_filterEquals, "__PRIVATE_filterEquals");
function __PRIVATE_stringifyFilter(e) {
  return e instanceof FieldFilter ? (/* @__PURE__ */ __name(function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  }, "__PRIVATE_stringifyFieldFilter"))(e) : e instanceof CompositeFilter ? (/* @__PURE__ */ __name(function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  }, "__PRIVATE_stringifyCompositeFilter"))(e) : "Filter";
}
__name(__PRIVATE_stringifyFilter, "__PRIVATE_stringifyFilter");
var ___PRIVATE_KeyFieldFilter = class ___PRIVATE_KeyFieldFilter extends FieldFilter {
  constructor(e, t, n) {
    super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
  }
  matches(e) {
    const t = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
};
__name(___PRIVATE_KeyFieldFilter, "__PRIVATE_KeyFieldFilter");
var __PRIVATE_KeyFieldFilter = ___PRIVATE_KeyFieldFilter;
var ___PRIVATE_KeyFieldInFilter = class ___PRIVATE_KeyFieldInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
  }
  matches(e) {
    return this.keys.some((t) => t.isEqual(e.key));
  }
};
__name(___PRIVATE_KeyFieldInFilter, "__PRIVATE_KeyFieldInFilter");
var __PRIVATE_KeyFieldInFilter = ___PRIVATE_KeyFieldInFilter;
var ___PRIVATE_KeyFieldNotInFilter = class ___PRIVATE_KeyFieldNotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
  }
  matches(e) {
    return !this.keys.some((t) => t.isEqual(e.key));
  }
};
__name(___PRIVATE_KeyFieldNotInFilter, "__PRIVATE_KeyFieldNotInFilter");
var __PRIVATE_KeyFieldNotInFilter = ___PRIVATE_KeyFieldNotInFilter;
function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
  return (t.arrayValue?.values || []).map((e2) => DocumentKey.fromName(e2.referenceValue));
}
__name(__PRIVATE_extractDocumentKeysFromArrayValue, "__PRIVATE_extractDocumentKeysFromArrayValue");
var ___PRIVATE_ArrayContainsFilter = class ___PRIVATE_ArrayContainsFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
  }
};
__name(___PRIVATE_ArrayContainsFilter, "__PRIVATE_ArrayContainsFilter");
var __PRIVATE_ArrayContainsFilter = ___PRIVATE_ArrayContainsFilter;
var ___PRIVATE_InFilter = class ___PRIVATE_InFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
};
__name(___PRIVATE_InFilter, "__PRIVATE_InFilter");
var __PRIVATE_InFilter = ___PRIVATE_InFilter;
var ___PRIVATE_NotInFilter = class ___PRIVATE_NotInFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    })) return false;
    const t = e.data.field(this.field);
    return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
};
__name(___PRIVATE_NotInFilter, "__PRIVATE_NotInFilter");
var __PRIVATE_NotInFilter = ___PRIVATE_NotInFilter;
var ___PRIVATE_ArrayContainsAnyFilter = class ___PRIVATE_ArrayContainsAnyFilter extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2));
  }
};
__name(___PRIVATE_ArrayContainsAnyFilter, "__PRIVATE_ArrayContainsAnyFilter");
var __PRIVATE_ArrayContainsAnyFilter = ___PRIVATE_ArrayContainsAnyFilter;
var ___PRIVATE_TargetImpl = class ___PRIVATE_TargetImpl {
  constructor(e, t = null, n = [], r = [], i = null, s = null, o = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r, this.limit = i, this.startAt = s, this.endAt = o, this.Te = null;
  }
};
__name(___PRIVATE_TargetImpl, "__PRIVATE_TargetImpl");
var __PRIVATE_TargetImpl = ___PRIVATE_TargetImpl;
function __PRIVATE_newTarget(e, t = null, n = [], r = [], i = null, s = null, o = null) {
  return new __PRIVATE_TargetImpl(e, t, n, r, i, s, o);
}
__name(__PRIVATE_newTarget, "__PRIVATE_newTarget");
function __PRIVATE_canonifyTarget(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.Te) {
    let e2 = t.path.canonicalString();
    null !== t.collectionGroup && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map((e3) => __PRIVATE_canonifyFilter(e3)).join(","), e2 += "|ob:", e2 += t.orderBy.map((e3) => (/* @__PURE__ */ __name(function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    }, "__PRIVATE_canonifyOrderBy"))(e3)).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map((e3) => canonicalId(e3)).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map((e3) => canonicalId(e3)).join(",")), t.Te = e2;
  }
  return t.Te;
}
__name(__PRIVATE_canonifyTarget, "__PRIVATE_canonifyTarget");
function __PRIVATE_targetEquals(e, t) {
  if (e.limit !== t.limit) return false;
  if (e.orderBy.length !== t.orderBy.length) return false;
  for (let n = 0; n < e.orderBy.length; n++) if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n])) return false;
  if (e.filters.length !== t.filters.length) return false;
  for (let n = 0; n < e.filters.length; n++) if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n])) return false;
  return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
}
__name(__PRIVATE_targetEquals, "__PRIVATE_targetEquals");
function __PRIVATE_targetIsDocumentTarget(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
__name(__PRIVATE_targetIsDocumentTarget, "__PRIVATE_targetIsDocumentTarget");
var ___PRIVATE_QueryImpl = class ___PRIVATE_QueryImpl {
  /**
   * Initializes a Query with a path and optional additional query constraints.
   * Path must currently be empty if this is a collection group query.
   */
  constructor(e, t = null, n = [], r = [], i = null, s = "F", o = null, _ = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.Ie = null, // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.Ee = null, // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.Re = null, this.startAt, this.endAt;
  }
};
__name(___PRIVATE_QueryImpl, "__PRIVATE_QueryImpl");
var __PRIVATE_QueryImpl = ___PRIVATE_QueryImpl;
function __PRIVATE_newQuery(e, t, n, r, i, s, o, _) {
  return new __PRIVATE_QueryImpl(e, t, n, r, i, s, o, _);
}
__name(__PRIVATE_newQuery, "__PRIVATE_newQuery");
function __PRIVATE_newQueryForPath(e) {
  return new __PRIVATE_QueryImpl(e);
}
__name(__PRIVATE_newQueryForPath, "__PRIVATE_newQueryForPath");
function __PRIVATE_queryMatchesAllDocuments(e) {
  return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}
__name(__PRIVATE_queryMatchesAllDocuments, "__PRIVATE_queryMatchesAllDocuments");
function __PRIVATE_isDocumentQuery$1(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
__name(__PRIVATE_isDocumentQuery$1, "__PRIVATE_isDocumentQuery$1");
function __PRIVATE_isCollectionGroupQuery(e) {
  return null !== e.collectionGroup;
}
__name(__PRIVATE_isCollectionGroupQuery, "__PRIVATE_isCollectionGroupQuery");
function __PRIVATE_queryNormalizedOrderBy(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.Ie) {
    t.Ie = [];
    const e2 = /* @__PURE__ */ new Set();
    for (const n2 of t.explicitOrderBy) t.Ie.push(n2), e2.add(n2.field.canonicalString());
    const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r = (/* @__PURE__ */ __name(function __PRIVATE_getInequalityFilterFields(e3) {
      let t2 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach((e4) => {
        e4.getFlattenedFilters().forEach((e5) => {
          e5.isInequality() && (t2 = t2.add(e5.field));
        });
      }), t2;
    }, "__PRIVATE_getInequalityFilterFields"))(t);
    r.forEach((r2) => {
      e2.has(r2.canonicalString()) || r2.isKeyField() || t.Ie.push(new OrderBy(r2, n));
    }), // Add the document key field to the last if it is not explicitly ordered.
    e2.has(FieldPath$1.keyField().canonicalString()) || t.Ie.push(new OrderBy(FieldPath$1.keyField(), n));
  }
  return t.Ie;
}
__name(__PRIVATE_queryNormalizedOrderBy, "__PRIVATE_queryNormalizedOrderBy");
function __PRIVATE_queryToTarget(e) {
  const t = __PRIVATE_debugCast(e);
  return t.Ee || (t.Ee = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.Ee;
}
__name(__PRIVATE_queryToTarget, "__PRIVATE_queryToTarget");
function __PRIVATE__queryToTarget(e, t) {
  if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
  {
    t = t.map((e2) => {
      const t2 = "desc" === e2.dir ? "asc" : "desc";
      return new OrderBy(e2.field, t2);
    });
    const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r);
  }
}
__name(__PRIVATE__queryToTarget, "__PRIVATE__queryToTarget");
function __PRIVATE_queryWithAddedFilter(e, t) {
  const n = e.filters.concat([t]);
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
}
__name(__PRIVATE_queryWithAddedFilter, "__PRIVATE_queryWithAddedFilter");
function __PRIVATE_queryWithAddedOrderBy(e, t) {
  const n = e.explicitOrderBy.concat([t]);
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, n, e.filters.slice(), e.limit, e.limitType, e.startAt, e.endAt);
}
__name(__PRIVATE_queryWithAddedOrderBy, "__PRIVATE_queryWithAddedOrderBy");
function __PRIVATE_queryWithLimit(e, t, n) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}
__name(__PRIVATE_queryWithLimit, "__PRIVATE_queryWithLimit");
function __PRIVATE_queryEquals(e, t) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
}
__name(__PRIVATE_queryEquals, "__PRIVATE_queryEquals");
function __PRIVATE_canonifyQuery(e) {
  return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
}
__name(__PRIVATE_canonifyQuery, "__PRIVATE_canonifyQuery");
function __PRIVATE_stringifyQuery(e) {
  return `Query(target=${(/* @__PURE__ */ __name(function __PRIVATE_stringifyTarget(e2) {
    let t = e2.path.canonicalString();
    return null !== e2.collectionGroup && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map((e3) => __PRIVATE_stringifyFilter(e3)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map((e3) => (/* @__PURE__ */ __name(function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    }, "__PRIVATE_stringifyOrderBy"))(e3)).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map((e3) => canonicalId(e3)).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map((e3) => canonicalId(e3)).join(",")), `Target(${t})`;
  }, "__PRIVATE_stringifyTarget"))(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}
__name(__PRIVATE_stringifyQuery, "__PRIVATE_stringifyQuery");
function __PRIVATE_queryMatches(e, t) {
  return t.isFoundDocument() && (/* @__PURE__ */ __name(function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
    const n = t2.key.path;
    return null !== e2.collectionGroup ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
  }, "__PRIVATE_queryMatchesPathAndCollectionGroup"))(e, t) && (/* @__PURE__ */ __name(function __PRIVATE_queryMatchesOrderBy(e2, t2) {
    for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n.field.isKeyField() && null === t2.data.field(n.field)) return false;
    return true;
  }, "__PRIVATE_queryMatchesOrderBy"))(e, t) && (/* @__PURE__ */ __name(function __PRIVATE_queryMatchesFilters(e2, t2) {
    for (const n of e2.filters) if (!n.matches(t2)) return false;
    return true;
  }, "__PRIVATE_queryMatchesFilters"))(e, t) && (/* @__PURE__ */ __name(function __PRIVATE_queryMatchesBounds(e2, t2) {
    if (e2.startAt && !/**
    * Returns true if a document sorts before a bound using the provided sort
    * order.
    */
    (/* @__PURE__ */ __name(function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r <= 0 : r < 0;
    }, "__PRIVATE_boundSortsBeforeDocument"))(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
    if (e2.endAt && !(/* @__PURE__ */ __name(function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
      const r = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r >= 0 : r > 0;
    }, "__PRIVATE_boundSortsAfterDocument"))(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2)) return false;
    return true;
  }, "__PRIVATE_queryMatchesBounds"))(e, t);
}
__name(__PRIVATE_queryMatches, "__PRIVATE_queryMatches");
function __PRIVATE_queryCollectionGroup(e) {
  return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
}
__name(__PRIVATE_queryCollectionGroup, "__PRIVATE_queryCollectionGroup");
function __PRIVATE_newQueryComparator(e) {
  return (t, n) => {
    let r = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t, n);
      if (0 !== e2) return e2;
      r = r || i.field.isKeyField();
    }
    return 0;
  };
}
__name(__PRIVATE_newQueryComparator, "__PRIVATE_newQueryComparator");
function __PRIVATE_compareDocs(e, t, n) {
  const r = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : (/* @__PURE__ */ __name(function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
    const r2 = t2.data.field(e2), i = n2.data.field(e2);
    return null !== r2 && null !== i ? __PRIVATE_valueCompare(r2, i) : fail(42886);
  }, "__PRIVATE_compareDocumentsByField"))(e.field, t, n);
  switch (e.dir) {
    case "asc":
      return r;
    case "desc":
      return -1 * r;
    default:
      return fail(19790, {
        direction: e.dir
      });
  }
}
__name(__PRIVATE_compareDocs, "__PRIVATE_compareDocs");
var _ObjectMap = class _ObjectMap {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    this.inner = {}, /** The number of entries stored in the map */
    this.innerSize = 0;
  }
  /** Get a value for this key, or undefined if it does not exist. */
  get(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 !== n) {
      for (const [t2, r] of n) if (this.equalsFn(t2, e)) return r;
    }
  }
  has(e) {
    return void 0 !== this.get(e);
  }
  /** Put this key and value in the map. */
  set(e, t) {
    const n = this.mapKeyFn(e), r = this.inner[n];
    if (void 0 === r) return this.inner[n] = [[e, t]], void this.innerSize++;
    for (let n2 = 0; n2 < r.length; n2++) if (this.equalsFn(r[n2][0], e))
      return void (r[n2] = [e, t]);
    r.push([e, t]), this.innerSize++;
  }
  /**
   * Remove this key from the map. Returns a boolean if anything was deleted.
   */
  delete(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 === n) return false;
    for (let r = 0; r < n.length; r++) if (this.equalsFn(n[r][0], e)) return 1 === n.length ? delete this.inner[t] : n.splice(r, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, (t, n) => {
      for (const [t2, r] of n) e(t2, r);
    });
  }
  isEmpty() {
    return isEmpty(this.inner);
  }
  size() {
    return this.innerSize;
  }
};
__name(_ObjectMap, "ObjectMap");
var ObjectMap = _ObjectMap;
var ht = new SortedMap(DocumentKey.comparator);
function __PRIVATE_mutableDocumentMap() {
  return ht;
}
__name(__PRIVATE_mutableDocumentMap, "__PRIVATE_mutableDocumentMap");
var Pt = new SortedMap(DocumentKey.comparator);
function documentMap(...e) {
  let t = Pt;
  for (const n of e) t = t.insert(n.key, n);
  return t;
}
__name(documentMap, "documentMap");
function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
  let t = Pt;
  return e.forEach((e2, n) => t = t.insert(e2, n.overlayedDocument)), t;
}
__name(__PRIVATE_convertOverlayedDocumentMapToDocumentMap, "__PRIVATE_convertOverlayedDocumentMapToDocumentMap");
function __PRIVATE_newOverlayMap() {
  return __PRIVATE_newDocumentKeyMap();
}
__name(__PRIVATE_newOverlayMap, "__PRIVATE_newOverlayMap");
function __PRIVATE_newMutationMap() {
  return __PRIVATE_newDocumentKeyMap();
}
__name(__PRIVATE_newMutationMap, "__PRIVATE_newMutationMap");
function __PRIVATE_newDocumentKeyMap() {
  return new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t));
}
__name(__PRIVATE_newDocumentKeyMap, "__PRIVATE_newDocumentKeyMap");
var Tt = new SortedMap(DocumentKey.comparator);
var It = new SortedSet(DocumentKey.comparator);
function __PRIVATE_documentKeySet(...e) {
  let t = It;
  for (const n of e) t = t.add(n);
  return t;
}
__name(__PRIVATE_documentKeySet, "__PRIVATE_documentKeySet");
var Et = new SortedSet(__PRIVATE_primitiveComparator);
function __PRIVATE_targetIdSet() {
  return Et;
}
__name(__PRIVATE_targetIdSet, "__PRIVATE_targetIdSet");
function __PRIVATE_toDouble(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t)) return {
      doubleValue: "NaN"
    };
    if (t === 1 / 0) return {
      doubleValue: "Infinity"
    };
    if (t === -1 / 0) return {
      doubleValue: "-Infinity"
    };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
  };
}
__name(__PRIVATE_toDouble, "__PRIVATE_toDouble");
function __PRIVATE_toInteger(e) {
  return {
    integerValue: "" + e
  };
}
__name(__PRIVATE_toInteger, "__PRIVATE_toInteger");
function toNumber(e, t) {
  return isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
}
__name(toNumber, "toNumber");
var _TransformOperation = class _TransformOperation {
  constructor() {
    this._ = void 0;
  }
};
__name(_TransformOperation, "TransformOperation");
var TransformOperation = _TransformOperation;
function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? (/* @__PURE__ */ __name(function serverTimestamp$1(e2, t2) {
    const n2 = {
      fields: {
        [tt]: {
          stringValue: et
        },
        [rt]: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields[nt] = t2), {
      mapValue: n2
    };
  }, "serverTimestamp$1"))(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : e instanceof __PRIVATE_NumericIncrementTransformOperation ? (/* @__PURE__ */ __name(function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
    const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r = asNumber(n2) + asNumber(e2.Ae);
    return isInteger(n2) && isInteger(e2.Ae) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e2.serializer, r);
  }, "__PRIVATE_applyNumericIncrementTransformOperationToLocalView"))(e, t) : e instanceof __PRIVATE_NumericMinimumTransformOperation ? (/* @__PURE__ */ __name(function __PRIVATE_applyNumericMinimumTransformOperationToLocalView(e2, t2) {
    return __PRIVATE_applyNumericTransformOperationToLocalView(e2, t2, Math.min);
  }, "__PRIVATE_applyNumericMinimumTransformOperationToLocalView"))(e, t) : e instanceof __PRIVATE_NumericMaximumTransformOperation ? (/* @__PURE__ */ __name(function __PRIVATE_applyNumericMaximumTransformOperationToLocalView(e2, t2) {
    return __PRIVATE_applyNumericTransformOperationToLocalView(e2, t2, Math.max);
  }, "__PRIVATE_applyNumericMaximumTransformOperationToLocalView"))(e, t) : void 0;
}
__name(__PRIVATE_applyTransformOperationToLocalView, "__PRIVATE_applyTransformOperationToLocalView");
function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
}
__name(__PRIVATE_applyTransformOperationToRemoteDocument, "__PRIVATE_applyTransformOperationToRemoteDocument");
function __PRIVATE_computeTransformOperationBaseValue(e, t) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_isNumber(t) ? t : {
    integerValue: 0
  } : null;
}
__name(__PRIVATE_computeTransformOperationBaseValue, "__PRIVATE_computeTransformOperationBaseValue");
var ___PRIVATE_ServerTimestampTransform = class ___PRIVATE_ServerTimestampTransform extends TransformOperation {
};
__name(___PRIVATE_ServerTimestampTransform, "__PRIVATE_ServerTimestampTransform");
var __PRIVATE_ServerTimestampTransform = ___PRIVATE_ServerTimestampTransform;
var ___PRIVATE_ArrayUnionTransformOperation = class ___PRIVATE_ArrayUnionTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
};
__name(___PRIVATE_ArrayUnionTransformOperation, "__PRIVATE_ArrayUnionTransformOperation");
var __PRIVATE_ArrayUnionTransformOperation = ___PRIVATE_ArrayUnionTransformOperation;
function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
  const n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements) n.some((e2) => __PRIVATE_valueEquals(e2, t2)) || n.push(t2);
  return {
    arrayValue: {
      values: n
    }
  };
}
__name(__PRIVATE_applyArrayUnionTransformOperation, "__PRIVATE_applyArrayUnionTransformOperation");
var ___PRIVATE_ArrayRemoveTransformOperation = class ___PRIVATE_ArrayRemoveTransformOperation extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
};
__name(___PRIVATE_ArrayRemoveTransformOperation, "__PRIVATE_ArrayRemoveTransformOperation");
var __PRIVATE_ArrayRemoveTransformOperation = ___PRIVATE_ArrayRemoveTransformOperation;
function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
  let n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements) n = n.filter((e2) => !__PRIVATE_valueEquals(e2, t2));
  return {
    arrayValue: {
      values: n
    }
  };
}
__name(__PRIVATE_applyArrayRemoveTransformOperation, "__PRIVATE_applyArrayRemoveTransformOperation");
var ___PRIVATE_NumericTransformOperation = class ___PRIVATE_NumericTransformOperation extends TransformOperation {
  constructor(e, t) {
    super(), this.serializer = e, this.Ae = t;
  }
};
__name(___PRIVATE_NumericTransformOperation, "__PRIVATE_NumericTransformOperation");
var __PRIVATE_NumericTransformOperation = ___PRIVATE_NumericTransformOperation;
var ___PRIVATE_NumericIncrementTransformOperation = class ___PRIVATE_NumericIncrementTransformOperation extends __PRIVATE_NumericTransformOperation {
};
__name(___PRIVATE_NumericIncrementTransformOperation, "__PRIVATE_NumericIncrementTransformOperation");
var __PRIVATE_NumericIncrementTransformOperation = ___PRIVATE_NumericIncrementTransformOperation;
var ___PRIVATE_NumericMinimumTransformOperation = class ___PRIVATE_NumericMinimumTransformOperation extends __PRIVATE_NumericTransformOperation {
};
__name(___PRIVATE_NumericMinimumTransformOperation, "__PRIVATE_NumericMinimumTransformOperation");
var __PRIVATE_NumericMinimumTransformOperation = ___PRIVATE_NumericMinimumTransformOperation;
var ___PRIVATE_NumericMaximumTransformOperation = class ___PRIVATE_NumericMaximumTransformOperation extends __PRIVATE_NumericTransformOperation {
};
__name(___PRIVATE_NumericMaximumTransformOperation, "__PRIVATE_NumericMaximumTransformOperation");
var __PRIVATE_NumericMaximumTransformOperation = ___PRIVATE_NumericMaximumTransformOperation;
function __PRIVATE_applyNumericTransformOperationToLocalView(e, t, n) {
  if (!__PRIVATE_isNumber(t)) return e.Ae;
  const r = n(asNumber(t), asNumber(e.Ae));
  return isInteger(t) && isInteger(e.Ae) ? __PRIVATE_toInteger(r) : __PRIVATE_toDouble(e.serializer, r);
}
__name(__PRIVATE_applyNumericTransformOperationToLocalView, "__PRIVATE_applyNumericTransformOperationToLocalView");
function asNumber(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}
__name(asNumber, "asNumber");
function __PRIVATE_coercedFieldValuesArray(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
__name(__PRIVATE_coercedFieldValuesArray, "__PRIVATE_coercedFieldValuesArray");
var _FieldTransform = class _FieldTransform {
  constructor(e, t) {
    this.field = e, this.transform = t;
  }
};
__name(_FieldTransform, "FieldTransform");
var FieldTransform = _FieldTransform;
function __PRIVATE_fieldTransformEquals(e, t) {
  return e.field.isEqual(t.field) && (/* @__PURE__ */ __name(function __PRIVATE_transformOperationEquals(e2, t2) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation || e2 instanceof __PRIVATE_NumericMinimumTransformOperation && t2 instanceof __PRIVATE_NumericMinimumTransformOperation || e2 instanceof __PRIVATE_NumericMaximumTransformOperation && t2 instanceof __PRIVATE_NumericMaximumTransformOperation ? __PRIVATE_valueEquals(e2.Ae, t2.Ae) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
  }, "__PRIVATE_transformOperationEquals"))(e.transform, t.transform);
}
__name(__PRIVATE_fieldTransformEquals, "__PRIVATE_fieldTransformEquals");
var _MutationResult = class _MutationResult {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
};
__name(_MutationResult, "MutationResult");
var MutationResult = _MutationResult;
var _Precondition = class _Precondition {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  /** Creates a new empty Precondition. */
  static none() {
    return new _Precondition();
  }
  /** Creates a new Precondition with an exists flag. */
  static exists(e) {
    return new _Precondition(void 0, e);
  }
  /** Creates a new Precondition based on a version a document exists at. */
  static updateTime(e) {
    return new _Precondition(e);
  }
  /** Returns whether this Precondition is empty. */
  get isNone() {
    return void 0 === this.updateTime && void 0 === this.exists;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
};
__name(_Precondition, "Precondition");
var Precondition = _Precondition;
function __PRIVATE_preconditionIsValidForDocument(e, t) {
  return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
}
__name(__PRIVATE_preconditionIsValidForDocument, "__PRIVATE_preconditionIsValidForDocument");
var _Mutation = class _Mutation {
};
__name(_Mutation, "Mutation");
var Mutation = _Mutation;
function __PRIVATE_calculateOverlayMutation(e, t) {
  if (!e.hasLocalMutations || t && 0 === t.fields.length) return null;
  if (null === t) return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n = e.data, r = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t.fields) if (!i.has(e2)) {
      let t2 = n.field(e2);
      null === t2 && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), null === t2 ? r.delete(e2) : r.set(e2, t2), i = i.add(e2);
    }
    return new __PRIVATE_PatchMutation(e.key, r, new FieldMask(i.toArray()), Precondition.none());
  }
}
__name(__PRIVATE_calculateOverlayMutation, "__PRIVATE_calculateOverlayMutation");
function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
  e instanceof __PRIVATE_SetMutation ? (/* @__PURE__ */ __name(function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
    const r = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
    r.setAll(i), t2.convertToFoundDocument(n2.version, r).setHasCommittedMutations();
  }, "__PRIVATE_setMutationApplyToRemoteDocument"))(e, t, n) : e instanceof __PRIVATE_PatchMutation ? (/* @__PURE__ */ __name(function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return void t2.convertToUnknownDocument(n2.version);
    const r = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  }, "__PRIVATE_patchMutationApplyToRemoteDocument"))(e, t, n) : (/* @__PURE__ */ __name(function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
    t2.convertToNoDocument(n2.version).setHasCommittedMutations();
  }, "__PRIVATE_deleteMutationApplyToRemoteDocument"))(0, t, n);
}
__name(__PRIVATE_mutationApplyToRemoteDocument, "__PRIVATE_mutationApplyToRemoteDocument");
function __PRIVATE_mutationApplyToLocalView(e, t, n, r) {
  return e instanceof __PRIVATE_SetMutation ? (/* @__PURE__ */ __name(function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2);
    return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
  }, "__PRIVATE_setMutationApplyToLocalView"))(e, t, n, r) : e instanceof __PRIVATE_PatchMutation ? (/* @__PURE__ */ __name(function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return n2;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r2, t2), s = t2.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), null === n2) return null;
    return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map((e3) => e3.field));
  }, "__PRIVATE_patchMutationApplyToLocalView"))(e, t, n, r) : (/* @__PURE__ */ __name(function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2)) return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
    return n2;
  }, "__PRIVATE_deleteMutationApplyToLocalView"))(e, t, n);
}
__name(__PRIVATE_mutationApplyToLocalView, "__PRIVATE_mutationApplyToLocalView");
function __PRIVATE_mutationExtractBaseValue(e, t) {
  let n = null;
  for (const r of e.fieldTransforms) {
    const e2 = t.data.field(r.field), i = __PRIVATE_computeTransformOperationBaseValue(r.transform, e2 || null);
    null != i && (null === n && (n = ObjectValue.empty()), n.set(r.field, i));
  }
  return n || null;
}
__name(__PRIVATE_mutationExtractBaseValue, "__PRIVATE_mutationExtractBaseValue");
function __PRIVATE_mutationEquals(e, t) {
  return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!(/* @__PURE__ */ __name(function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
    return void 0 === e2 && void 0 === t2 || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, (e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3));
  }, "__PRIVATE_fieldTransformsAreEqual"))(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
}
__name(__PRIVATE_mutationEquals, "__PRIVATE_mutationEquals");
var ___PRIVATE_SetMutation = class ___PRIVATE_SetMutation extends Mutation {
  constructor(e, t, n, r = []) {
    super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
};
__name(___PRIVATE_SetMutation, "__PRIVATE_SetMutation");
var __PRIVATE_SetMutation = ___PRIVATE_SetMutation;
var ___PRIVATE_PatchMutation = class ___PRIVATE_PatchMutation extends Mutation {
  constructor(e, t, n, r, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
};
__name(___PRIVATE_PatchMutation, "__PRIVATE_PatchMutation");
var __PRIVATE_PatchMutation = ___PRIVATE_PatchMutation;
function __PRIVATE_getPatch(e) {
  const t = /* @__PURE__ */ new Map();
  return e.fieldMask.fields.forEach((n) => {
    if (!n.isEmpty()) {
      const r = e.data.field(n);
      t.set(n, r);
    }
  }), t;
}
__name(__PRIVATE_getPatch, "__PRIVATE_getPatch");
function __PRIVATE_serverTransformResults(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  __PRIVATE_hardAssert(e.length === n.length, 32656, {
    Ve: n.length,
    de: e.length
  });
  for (let i = 0; i < n.length; i++) {
    const s = e[i], o = s.transform, _ = t.data.field(s.field);
    r.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
  }
  return r;
}
__name(__PRIVATE_serverTransformResults, "__PRIVATE_serverTransformResults");
function __PRIVATE_localTransformResults(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const i of e) {
    const e2 = i.transform, s = n.data.field(i.field);
    r.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
  }
  return r;
}
__name(__PRIVATE_localTransformResults, "__PRIVATE_localTransformResults");
var ___PRIVATE_DeleteMutation = class ___PRIVATE_DeleteMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
};
__name(___PRIVATE_DeleteMutation, "__PRIVATE_DeleteMutation");
var __PRIVATE_DeleteMutation = ___PRIVATE_DeleteMutation;
var ___PRIVATE_VerifyMutation = class ___PRIVATE_VerifyMutation extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
};
__name(___PRIVATE_VerifyMutation, "__PRIVATE_VerifyMutation");
var __PRIVATE_VerifyMutation = ___PRIVATE_VerifyMutation;
var _MutationBatch = class _MutationBatch {
  /**
   * @param batchId - The unique ID of this mutation batch.
   * @param localWriteTime - The original write time of this mutation.
   * @param baseMutations - Mutations that are used to populate the base
   * values when this mutation is applied locally. This can be used to locally
   * overwrite values that are persisted in the remote document cache. Base
   * mutations are never sent to the backend.
   * @param mutations - The user-provided mutations in this mutation batch.
   * User-provided mutations are applied both locally and remotely on the
   * backend.
   */
  constructor(e, t, n, r) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r;
  }
  /**
   * Applies all the mutations in this MutationBatch to the specified document
   * to compute the state of the remote document
   *
   * @param document - The document to apply mutations to.
   * @param batchResult - The result of applying the MutationBatch to the
   * backend.
   */
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t2 = 0; t2 < this.mutations.length; t2++) {
      const r = this.mutations[t2];
      if (r.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r, e, n[t2]);
      }
    }
  }
  /**
   * Computes the local view of a document given all the mutations in this
   * batch.
   *
   * @param document - The document to apply mutations to.
   * @param mutatedFields - Fields that have been updated before applying this mutation batch.
   * @returns A `FieldMask` representing all the fields that are mutated.
   */
  applyToLocalView(e, t) {
    for (const n of this.baseMutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    for (const n of this.mutations) n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    return t;
  }
  /**
   * Computes the local view for all provided documents given the mutations in
   * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
   * replace all the mutation applications.
   */
  applyToLocalDocumentSet(e, t) {
    const n = __PRIVATE_newMutationMap();
    return this.mutations.forEach((r) => {
      const i = e.get(r.key), s = i.overlayedDocument;
      let o = this.applyToLocalView(s, i.mutatedFields);
      o = t.has(r.key) ? null : o;
      const _ = __PRIVATE_calculateOverlayMutation(s, o);
      null !== _ && n.set(r.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    }), n;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, (e2, t) => __PRIVATE_mutationEquals(e2, t)) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, (e2, t) => __PRIVATE_mutationEquals(e2, t));
  }
};
__name(_MutationBatch, "MutationBatch");
var MutationBatch = _MutationBatch;
var _MutationBatchResult = class _MutationBatchResult {
  constructor(e, t, n, r) {
    this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r;
  }
  /**
   * Creates a new MutationBatchResult for the given batch and results. There
   * must be one result for each mutation in the batch. This static factory
   * caches a document=&gt;version mapping (docVersions).
   */
  static from(e, t, n) {
    __PRIVATE_hardAssert(e.mutations.length === n.length, 58842, {
      me: e.mutations.length,
      fe: n.length
    });
    let r = (/* @__PURE__ */ __name(function __PRIVATE_documentVersionMap() {
      return Tt;
    }, "__PRIVATE_documentVersionMap"))();
    const i = e.mutations;
    for (let e2 = 0; e2 < i.length; e2++) r = r.insert(i[e2].key, n[e2].version);
    return new _MutationBatchResult(e, t, n, r);
  }
};
__name(_MutationBatchResult, "MutationBatchResult");
var MutationBatchResult = _MutationBatchResult;
var _Overlay = class _Overlay {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return null !== e && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
};
__name(_Overlay, "Overlay");
var Overlay = _Overlay;
var _ExistenceFilter = class _ExistenceFilter {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
};
__name(_ExistenceFilter, "ExistenceFilter");
var ExistenceFilter = _ExistenceFilter;
var Rt;
var At;
function __PRIVATE_isPermanentError(e) {
  switch (e) {
    case D.OK:
      return fail(64938);
    case D.CANCELLED:
    case D.UNKNOWN:
    case D.DEADLINE_EXCEEDED:
    case D.RESOURCE_EXHAUSTED:
    case D.INTERNAL:
    case D.UNAVAILABLE:
    case D.UNAUTHENTICATED:
      return false;
    case D.INVALID_ARGUMENT:
    case D.NOT_FOUND:
    case D.ALREADY_EXISTS:
    case D.PERMISSION_DENIED:
    case D.FAILED_PRECONDITION:
    case D.ABORTED:
    case D.OUT_OF_RANGE:
    case D.UNIMPLEMENTED:
    case D.DATA_LOSS:
      return true;
    default:
      return fail(15467, {
        code: e
      });
  }
}
__name(__PRIVATE_isPermanentError, "__PRIVATE_isPermanentError");
function __PRIVATE_mapCodeFromRpcCode(e) {
  if (void 0 === e)
    return __PRIVATE_logError("GRPC error has no .code"), D.UNKNOWN;
  switch (e) {
    case Rt.OK:
      return D.OK;
    case Rt.CANCELLED:
      return D.CANCELLED;
    case Rt.UNKNOWN:
      return D.UNKNOWN;
    case Rt.DEADLINE_EXCEEDED:
      return D.DEADLINE_EXCEEDED;
    case Rt.RESOURCE_EXHAUSTED:
      return D.RESOURCE_EXHAUSTED;
    case Rt.INTERNAL:
      return D.INTERNAL;
    case Rt.UNAVAILABLE:
      return D.UNAVAILABLE;
    case Rt.UNAUTHENTICATED:
      return D.UNAUTHENTICATED;
    case Rt.INVALID_ARGUMENT:
      return D.INVALID_ARGUMENT;
    case Rt.NOT_FOUND:
      return D.NOT_FOUND;
    case Rt.ALREADY_EXISTS:
      return D.ALREADY_EXISTS;
    case Rt.PERMISSION_DENIED:
      return D.PERMISSION_DENIED;
    case Rt.FAILED_PRECONDITION:
      return D.FAILED_PRECONDITION;
    case Rt.ABORTED:
      return D.ABORTED;
    case Rt.OUT_OF_RANGE:
      return D.OUT_OF_RANGE;
    case Rt.UNIMPLEMENTED:
      return D.UNIMPLEMENTED;
    case Rt.DATA_LOSS:
      return D.DATA_LOSS;
    default:
      return fail(39323, {
        code: e
      });
  }
}
__name(__PRIVATE_mapCodeFromRpcCode, "__PRIVATE_mapCodeFromRpcCode");
(At = Rt || (Rt = {}))[At.OK = 0] = "OK", At[At.CANCELLED = 1] = "CANCELLED", At[At.UNKNOWN = 2] = "UNKNOWN", At[At.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", At[At.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", At[At.NOT_FOUND = 5] = "NOT_FOUND", At[At.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", At[At.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", At[At.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", At[At.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", At[At.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", At[At.ABORTED = 10] = "ABORTED", At[At.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", At[At.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", At[At.INTERNAL = 13] = "INTERNAL", At[At.UNAVAILABLE = 14] = "UNAVAILABLE", At[At.DATA_LOSS = 15] = "DATA_LOSS";
var Vt = null;
function __PRIVATE_newTextEncoder() {
  return new TextEncoder();
}
__name(__PRIVATE_newTextEncoder, "__PRIVATE_newTextEncoder");
var dt = new Integer([4294967295, 4294967295], 0);
function __PRIVATE_getMd5HashValue(e) {
  const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5();
  return n.update(t), new Uint8Array(n.digest());
}
__name(__PRIVATE_getMd5HashValue, "__PRIVATE_getMd5HashValue");
function __PRIVATE_get64BitUints(e) {
  const t = new DataView(e.buffer), n = t.getUint32(
    0,
    /* littleEndian= */
    true
  ), r = t.getUint32(
    4,
    /* littleEndian= */
    true
  ), i = t.getUint32(
    8,
    /* littleEndian= */
    true
  ), s = t.getUint32(
    12,
    /* littleEndian= */
    true
  );
  return [new Integer([n, r], 0), new Integer([i, s], 0)];
}
__name(__PRIVATE_get64BitUints, "__PRIVATE_get64BitUints");
var _BloomFilter = class _BloomFilter {
  constructor(e, t, n) {
    if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8) throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
    if (n < 0) throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length > 0 && 0 === this.hashCount)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (0 === e.length && 0 !== t)
      throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
    this.ge = 8 * e.length - t, // Set the bit count in Integer to avoid repetition in mightContain().
    this.pe = Integer.fromNumber(this.ge);
  }
  // Calculate the ith hash value based on the hashed 64bit integers,
  // and calculate its corresponding bit index in the bitmap to be checked.
  ye(e, t, n) {
    let r = e.add(t.multiply(Integer.fromNumber(n)));
    return 1 === r.compare(dt) && (r = new Integer([r.getBits(0), r.getBits(1)], 0)), r.modulo(this.pe).toNumber();
  }
  // Return whether the bit on the given index in the bitmap is set to 1.
  we(e) {
    return !!(this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
  }
  mightContain(e) {
    if (0 === this.ge) return false;
    const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t2 = this.ye(n, r, e2);
      if (!this.we(t2)) return false;
    }
    return true;
  }
  /** Create bloom filter for testing purposes only. */
  static create(e, t, n) {
    const r = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new _BloomFilter(i, r, t);
    return n.forEach((e2) => s.insert(e2)), s;
  }
  insert(e) {
    if (0 === this.ge) return;
    const t = __PRIVATE_getMd5HashValue(e), [n, r] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t2 = this.ye(n, r, e2);
      this.Se(t2);
    }
  }
  Se(e) {
    const t = Math.floor(e / 8), n = e % 8;
    this.bitmap[t] |= 1 << n;
  }
};
__name(_BloomFilter, "BloomFilter");
var BloomFilter = _BloomFilter;
var ___PRIVATE_BloomFilterError = class ___PRIVATE_BloomFilterError extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
};
__name(___PRIVATE_BloomFilterError, "__PRIVATE_BloomFilterError");
var __PRIVATE_BloomFilterError = ___PRIVATE_BloomFilterError;
var _RemoteEvent = class _RemoteEvent {
  constructor(e, t, n, r, i) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r, this.resolvedLimboDocuments = i;
  }
  /**
   * HACK: Views require RemoteEvents in order to determine whether the view is
   * CURRENT, but secondary tabs don't receive remote events. So this method is
   * used to create a synthesized RemoteEvent that can be used to apply a
   * CURRENT status change to a View, for queries executed in a different tab.
   */
  // PORTING NOTE: Multi-tab only
  static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
    const r = /* @__PURE__ */ new Map();
    return r.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new _RemoteEvent(SnapshotVersion.min(), r, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
  }
};
__name(_RemoteEvent, "RemoteEvent");
var RemoteEvent = _RemoteEvent;
var _TargetChange = class _TargetChange {
  constructor(e, t, n, r, i) {
    this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r, this.removedDocuments = i;
  }
  /**
   * This method is used to create a synthesized TargetChanges that can be used to
   * apply a CURRENT status change to a View (for queries executed in a different
   * tab) or for new queries (to raise snapshots with correct CURRENT status).
   */
  static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
    return new _TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
  }
};
__name(_TargetChange, "TargetChange");
var TargetChange = _TargetChange;
var ___PRIVATE_DocumentWatchChange = class ___PRIVATE_DocumentWatchChange {
  constructor(e, t, n, r) {
    this.be = e, this.removedTargetIds = t, this.key = n, this.De = r;
  }
};
__name(___PRIVATE_DocumentWatchChange, "__PRIVATE_DocumentWatchChange");
var __PRIVATE_DocumentWatchChange = ___PRIVATE_DocumentWatchChange;
var ___PRIVATE_ExistenceFilterChange = class ___PRIVATE_ExistenceFilterChange {
  constructor(e, t) {
    this.targetId = e, this.Ce = t;
  }
};
__name(___PRIVATE_ExistenceFilterChange, "__PRIVATE_ExistenceFilterChange");
var __PRIVATE_ExistenceFilterChange = ___PRIVATE_ExistenceFilterChange;
var ___PRIVATE_WatchTargetChange = class ___PRIVATE_WatchTargetChange {
  constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r = null) {
    this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r;
  }
};
__name(___PRIVATE_WatchTargetChange, "__PRIVATE_WatchTargetChange");
var __PRIVATE_WatchTargetChange = ___PRIVATE_WatchTargetChange;
var ___PRIVATE_TargetState = class ___PRIVATE_TargetState {
  /**
   * Track the targetId for logging.
   */
  constructor(e) {
    this.targetId = e, /**
     * The number of pending responses (adds or removes) that we are waiting on.
     * We only consider targets active that have no pending responses.
     */
    this.ve = 0, /**
     * Keeps track of the document changes since the last raised snapshot.
     *
     * These changes are continuously updated as we receive document updates and
     * always reflect the current set of changes against the last issued snapshot.
     */
    this.Fe = __PRIVATE_snapshotChangesMap(), /** See public getters for explanations of these fields. */
    this.Me = ByteString.EMPTY_BYTE_STRING, this.xe = false, /**
     * Whether this target state should be included in the next snapshot. We
     * initialize to true so that newly-added targets are included in the next
     * RemoteEvent.
     */
    this.Oe = true;
  }
  /**
   * Whether this target has been marked 'current'.
   *
   * 'Current' has special meaning in the RPC protocol: It implies that the
   * Watch backend has sent us all changes up to the point at which the target
   * was added and that the target is consistent with the rest of the watch
   * stream.
   */
  get current() {
    return this.xe;
  }
  /** The last resume token sent to us for this target. */
  get resumeToken() {
    return this.Me;
  }
  /** Whether this target has pending target adds or target removes. */
  get Ne() {
    return 0 !== this.ve;
  }
  /** Whether we have modified any state that should trigger a snapshot. */
  get Be() {
    return this.Oe;
  }
  /**
   * Applies the resume token to the TargetChange, but only when it has a new
   * value. Empty resumeTokens are discarded.
   */
  Le(e) {
    e.approximateByteSize() > 0 && (this.Oe = true, this.Me = e);
  }
  /**
   * Creates a target change from the current set of changes.
   *
   * To reset the document changes after raising this snapshot, call
   * `clearPendingChanges()`.
   */
  ke() {
    let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
    return this.Fe.forEach((r, i) => {
      switch (i) {
        case 0:
          e = e.add(r);
          break;
        case 2:
          t = t.add(r);
          break;
        case 1:
          n = n.add(r);
          break;
        default:
          fail(38017, {
            changeType: i
          });
      }
    }), new TargetChange(this.Me, this.xe, e, t, n);
  }
  /**
   * Resets the document changes and sets `hasPendingChanges` to false.
   */
  qe() {
    this.Oe = false, this.Fe = __PRIVATE_snapshotChangesMap();
  }
  Ke(e, t) {
    this.Oe = true, this.Fe = this.Fe.insert(e, t);
  }
  Ue(e) {
    this.Oe = true, this.Fe = this.Fe.remove(e);
  }
  $e() {
    this.ve += 1;
  }
  We() {
    this.ve -= 1, __PRIVATE_hardAssert(this.ve >= 0, 3241, {
      ve: this.ve,
      targetId: this.targetId
    });
  }
  Qe() {
    this.Oe = true, this.xe = true;
  }
};
__name(___PRIVATE_TargetState, "__PRIVATE_TargetState");
var __PRIVATE_TargetState = ___PRIVATE_TargetState;
var mt = "WatchChangeAggregator";
var ___PRIVATE_WatchChangeAggregator = class ___PRIVATE_WatchChangeAggregator {
  constructor(e) {
    this.Ge = e, /**
     * The internal state of all tracked targets.
     *
     * Targets have the following lifecycle of [states] within the WatchChangeAggregator:
     * [unknown] -> recordPendingTargetRequest(t)
     *           -> [pending]
     *           -> handleTargetChange(t, Added)
     *           -> [added / !pending]
     *           -> recordPendingTargetRequest(t)
     *           -> [pending]
     *           -> handleTargetChange(t, Removed)
     *           -> [unknown]
     *
     * A reset on an [added] target leaves the target in an [added] state.
     * [added / !pending] -> handleTargetChange(t, Reset)
     *                    -> [added / !pending]
     *
     * [active]: is a substate of [added], where also `remoteStore.listenTargets.has(t) === true`.
     *           Generally it is expected that when a target is [active / !pending]
     *           then it is also [active], but the implementation does not guarantee
     *           this will always be true.
     *
     */
    this.ze = /* @__PURE__ */ new Map(), /** Keeps track of the documents to update since the last raised snapshot. */
    this.je = __PRIVATE_mutableDocumentMap(), this.Je = __PRIVATE_documentTargetMap(), /** A mapping of document keys to their set of target IDs. */
    this.He = __PRIVATE_documentTargetMap(), /**
     * A map of targets with existence filter mismatches. These targets are
     * known to be inconsistent and their listens needs to be re-established by
     * RemoteStore.
     */
    this.Ze = new SortedMap(__PRIVATE_primitiveComparator);
  }
  /**
   * Processes and adds the DocumentWatchChange to the current set of changes.
   */
  Xe(e) {
    for (const t of e.be) e.De && e.De.isFoundDocument() ? this.Ye(t, e.De) : this.et(t, e.key, e.De);
    for (const t of e.removedTargetIds) this.et(t, e.key, e.De);
  }
  /** Processes and adds the WatchTargetChange to the current set of changes. */
  tt(e) {
    this.forEachTarget(e, (t) => {
      const n = this.ze.get(t);
      if (n) switch (e.state) {
        case 0:
          this.nt(t) && n.Le(e.resumeToken);
          break;
        case 1:
          n.We(), n.Ne || // We have a freshly added target, so we need to reset any state
          // that we had previously. This can happen e.g. when remove and add
          // back a target for existence filter mismatches.
          n.qe(), n.Le(e.resumeToken);
          break;
        case 2:
          n.We(), n.Ne || this.removeTarget(t);
          break;
        case 3:
          this.nt(t) && (n.Qe(), n.Le(e.resumeToken));
          break;
        case 4:
          this.nt(t) && // Reset the target and synthesizes removes for all existing
          // documents. The backend will re-add any documents that still
          // match the target before it sends the next global snapshot.
          (this.rt(t), n.Le(e.resumeToken));
          break;
        default:
          fail(56790, {
            state: e.state
          });
      }
      else __PRIVATE_logDebug(mt, `handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`);
    });
  }
  /**
   * Iterates over all targetIds that the watch change applies to: either the
   * targetIds explicitly listed in the change or the targetIds of all currently
   * active targets.
   */
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.ze.forEach((e2, n) => {
      this.nt(n) && t(n);
    });
  }
  /**
   * Handles existence filters and synthesizes deletes for filter mismatches.
   * Targets that are invalidated by filter mismatches are added to
   * `pendingTargetResets`.
   */
  it(e) {
    const t = e.targetId, n = e.Ce.count, r = this.st(t);
    if (r) {
      const i = r.target;
      if (__PRIVATE_targetIsDocumentTarget(i)) if (0 === n) {
        const e2 = new DocumentKey(i.path);
        this.et(t, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
      } else __PRIVATE_hardAssert(1 === n, 20013, {
        expectedCount: n
      });
      else {
        const r2 = this.ot(t);
        if (r2 !== n) {
          const n2 = this._t(e), i2 = n2 ? this.ut(n2, e, r2) : 1;
          if (0 !== i2) {
            this.rt(t);
            const e2 = 2 === i2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Ze = this.Ze.insert(t, e2);
          }
          Vt?.o((/* @__PURE__ */ __name(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e2, t2, n3, r3, i3) {
            const s = {
              localCacheCount: e2,
              existenceFilterCount: t2.count,
              databaseId: n3.database,
              projectId: n3.projectId
            }, o = t2.unchangedNames;
            o && (s.bloomFilter = {
              applied: 0 === i3,
              hashCount: o?.hashCount ?? 0,
              bitmapLength: o?.bits?.bitmap?.length ?? 0,
              padding: o?.bits?.padding ?? 0,
              mightContain: /* @__PURE__ */ __name((e3) => r3?.mightContain(e3) ?? false, "mightContain")
            });
            return s;
          }, "__PRIVATE_createExistenceFilterMismatchInfoForTestingHooks"))(r2, e.Ce, this.Ge.lt(), n2, i2));
        }
      }
    }
  }
  /**
   * Parse the bloom filter from the "unchanged_names" field of an existence
   * filter.
   */
  _t(e) {
    const t = e.Ce.unchangedNames;
    if (!t || !t.bits) return null;
    const { bits: { bitmap: n = "", padding: r = 0 }, hashCount: i = 0 } = t;
    let s, o;
    try {
      s = __PRIVATE_normalizeByteString(n).toUint8Array();
    } catch (e2) {
      if (e2 instanceof __PRIVATE_Base64DecodeError) return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw e2;
    }
    try {
      o = new BloomFilter(s, r, i);
    } catch (e2) {
      return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
    }
    return 0 === o.ge ? null : o;
  }
  /**
   * Apply bloom filter to remove the deleted documents, and return the
   * application status.
   */
  ut(e, t, n) {
    return t.Ce.count === n - this.ht(e, t.targetId) ? 0 : 2;
  }
  /**
   * Filter out removed documents based on bloom filter membership result and
   * return number of documents removed.
   */
  ht(e, t) {
    const n = this.Ge.getRemoteKeysForTarget(t);
    let r = 0;
    return n.forEach((n2) => {
      const i = this.Ge.lt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
      e.mightContain(s) || (this.et(
        t,
        n2,
        /*updatedDocument=*/
        null
      ), r++);
    }), r;
  }
  /**
   * Converts the currently accumulated state into a remote event at the
   * provided snapshot version. Resets the accumulated changes before returning.
   */
  Pt(e) {
    const t = /* @__PURE__ */ new Map();
    this.ze.forEach((n2, r2) => {
      const i = this.st(r2);
      if (i) {
        if (n2.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
          const t2 = new DocumentKey(i.target.path);
          this.Tt(t2).has(r2) || this.It(r2, t2) || this.et(r2, t2, MutableDocument.newNoDocument(t2, e));
        }
        n2.Be && (t.set(r2, n2.ke()), n2.qe());
      }
    });
    let n = __PRIVATE_documentKeySet();
    this.He.forEach((e2, t2) => {
      let r2 = true;
      t2.forEachWhile((e3) => {
        const t3 = this.st(e3);
        return !t3 || "TargetPurposeLimboResolution" === t3.purpose || (r2 = false, false);
      }), r2 && (n = n.add(e2));
    }), this.je.forEach((t2, n2) => n2.setReadTime(e));
    const r = new RemoteEvent(e, t, this.Ze, this.je, n);
    return this.je = __PRIVATE_mutableDocumentMap(), this.Je = __PRIVATE_documentTargetMap(), this.He = __PRIVATE_documentTargetMap(), this.Ze = new SortedMap(__PRIVATE_primitiveComparator), r;
  }
  /**
   * Adds the provided document to the internal list of document updates and
   * its document key to the given target's mapping.
   */
  // Visible for testing.
  Ye(e, t) {
    const n = this.ze.get(e);
    if (!n || !this.nt(e)) return void __PRIVATE_logDebug(mt, `addDocumentToTarget received document for unknown inactive target (${e})`);
    const r = this.It(e, t.key) ? 2 : 0;
    n.Ke(t.key, r), this.je = this.je.insert(t.key, t), this.Je = this.Je.insert(t.key, this.Tt(t.key).add(e)), this.He = this.He.insert(t.key, this.Et(t.key).add(e));
  }
  /**
   * Removes the provided document from the target mapping. If the
   * document no longer matches the target, but the document's state is still
   * known (e.g. we know that the document was deleted or we received the change
   * that caused the filter mismatch), the new document can be provided
   * to update the remote document cache.
   */
  // Visible for testing.
  et(e, t, n) {
    const r = this.ze.get(e);
    r && this.nt(e) ? (this.It(e, t) ? r.Ke(
      t,
      1
      /* ChangeType.Removed */
    ) : (
      // The document may have entered and left the target before we raised a
      // snapshot, so we can just ignore the change.
      r.Ue(t)
    ), this.He = this.He.insert(t, this.Et(t).delete(e)), this.He = this.He.insert(t, this.Et(t).add(e)), n && (this.je = this.je.insert(t, n))) : __PRIVATE_logDebug(mt, `removeDocumentFromTarget received document for unknown or inactive target (${e})`);
  }
  removeTarget(e) {
    this.ze.delete(e);
  }
  /**
   * Returns the current count of documents in the target. This includes both
   * the number of documents that the LocalStore considers to be part of the
   * target as well as any accumulated changes.
   */
  ot(e) {
    const t = this.ze.get(e);
    if (!t) return 0;
    const n = t.ke();
    return this.Ge.getRemoteKeysForTarget(e).size + n.addedDocuments.size - n.removedDocuments.size;
  }
  /**
   * Increment the number of acks needed from watch before we can consider the
   * server to be 'in-sync' with the client's active targets.
   */
  $e(e) {
    let t = this.ze.get(e);
    t || (__PRIVATE_logDebug(mt, `recordPendingTargetRequest set up tracking for target ID ${e}`), t = new __PRIVATE_TargetState(e), this.ze.set(e, t)), t.$e();
  }
  Et(e) {
    let t = this.He.get(e);
    return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.He = this.He.insert(e, t)), t;
  }
  Tt(e) {
    let t = this.Je.get(e);
    return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.Je = this.Je.insert(e, t)), t;
  }
  /**
   * Verifies that the user is still interested in this target (by calling
   * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
   * from watch.
   */
  nt(e) {
    const t = null !== this.st(e);
    return t || __PRIVATE_logDebug(mt, "Detected inactive target", e), t;
  }
  /**
   * Returns the TargetData for an active target (i.e. a target that the user
   * is still interested in that has no outstanding target change requests).
   */
  st(e) {
    const t = this.ze.get(e);
    return void 0 === t || t.Ne ? null : this.Ge.Rt(e);
  }
  /**
   * Resets the state of a Watch target to its initial state (e.g. sets
   * 'current' to false, clears the resume token and removes its target mapping
   * from all documents).
   */
  rt(e) {
    this.ze.set(e, new __PRIVATE_TargetState(e));
    this.Ge.getRemoteKeysForTarget(e).forEach((t) => {
      this.et(
        e,
        t,
        /*updatedDocument=*/
        null
      );
    });
  }
  /**
   * Returns whether the LocalStore considers the document to be part of the
   * specified target.
   */
  It(e, t) {
    return this.Ge.getRemoteKeysForTarget(e).has(t);
  }
};
__name(___PRIVATE_WatchChangeAggregator, "__PRIVATE_WatchChangeAggregator");
var __PRIVATE_WatchChangeAggregator = ___PRIVATE_WatchChangeAggregator;
function __PRIVATE_documentTargetMap() {
  return new SortedMap(DocumentKey.comparator);
}
__name(__PRIVATE_documentTargetMap, "__PRIVATE_documentTargetMap");
function __PRIVATE_snapshotChangesMap() {
  return new SortedMap(DocumentKey.comparator);
}
__name(__PRIVATE_snapshotChangesMap, "__PRIVATE_snapshotChangesMap");
var ft = /* @__PURE__ */ (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})();
var gt = /* @__PURE__ */ (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})();
var pt = /* @__PURE__ */ (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();
var _JsonProtoSerializer = class _JsonProtoSerializer {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
};
__name(_JsonProtoSerializer, "JsonProtoSerializer");
var JsonProtoSerializer = _JsonProtoSerializer;
function __PRIVATE_toInt32Proto(e, t) {
  return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
    value: t
  };
}
__name(__PRIVATE_toInt32Proto, "__PRIVATE_toInt32Proto");
function toTimestamp(e, t) {
  if (e.useProto3Json) {
    return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t.seconds,
    nanos: t.nanoseconds
  };
}
__name(toTimestamp, "toTimestamp");
function __PRIVATE_toBytes(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
__name(__PRIVATE_toBytes, "__PRIVATE_toBytes");
function __PRIVATE_toVersion(e, t) {
  return toTimestamp(e, t.toTimestamp());
}
__name(__PRIVATE_toVersion, "__PRIVATE_toVersion");
function __PRIVATE_fromVersion(e) {
  return __PRIVATE_hardAssert(!!e, 49232), SnapshotVersion.fromTimestamp((/* @__PURE__ */ __name(function fromTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return new Timestamp(t.seconds, t.nanos);
  }, "fromTimestamp"))(e));
}
__name(__PRIVATE_fromVersion, "__PRIVATE_fromVersion");
function __PRIVATE_toResourceName(e, t) {
  return __PRIVATE_toResourcePath(e, t).canonicalString();
}
__name(__PRIVATE_toResourceName, "__PRIVATE_toResourceName");
function __PRIVATE_toResourcePath(e, t) {
  const n = (/* @__PURE__ */ __name(function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  }, "__PRIVATE_fullyQualifiedPrefixPath"))(e).child("documents");
  return void 0 === t ? n : n.child(t);
}
__name(__PRIVATE_toResourcePath, "__PRIVATE_toResourcePath");
function __PRIVATE_fromResourceName(e) {
  const t = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t), 10190, {
    key: t.toString()
  }), t;
}
__name(__PRIVATE_fromResourceName, "__PRIVATE_fromResourceName");
function __PRIVATE_toName(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t.path);
}
__name(__PRIVATE_toName, "__PRIVATE_toName");
function fromName(e, t) {
  const n = __PRIVATE_fromResourceName(t);
  if (n.get(1) !== e.databaseId.projectId) throw new FirestoreError(D.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
  if (n.get(3) !== e.databaseId.database) throw new FirestoreError(D.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
  return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
}
__name(fromName, "fromName");
function __PRIVATE_toQueryPath(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t);
}
__name(__PRIVATE_toQueryPath, "__PRIVATE_toQueryPath");
function __PRIVATE_fromQueryPath(e) {
  const t = __PRIVATE_fromResourceName(e);
  return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
}
__name(__PRIVATE_fromQueryPath, "__PRIVATE_fromQueryPath");
function __PRIVATE_getEncodedDatabaseId(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
}
__name(__PRIVATE_getEncodedDatabaseId, "__PRIVATE_getEncodedDatabaseId");
function __PRIVATE_extractLocalPathFromResourceName(e) {
  return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4), 29091, {
    key: e.toString()
  }), e.popFirst(5);
}
__name(__PRIVATE_extractLocalPathFromResourceName, "__PRIVATE_extractLocalPathFromResourceName");
function __PRIVATE_toMutationDocument(e, t, n) {
  return {
    name: __PRIVATE_toName(e, t),
    fields: n.value.mapValue.fields
  };
}
__name(__PRIVATE_toMutationDocument, "__PRIVATE_toMutationDocument");
function __PRIVATE_fromWatchChange(e, t) {
  let n;
  if ("targetChange" in t) {
    t.targetChange;
    const r = (/* @__PURE__ */ __name(function __PRIVATE_fromWatchTargetChangeState(e2) {
      return "NO_CHANGE" === e2 ? 0 : "ADD" === e2 ? 1 : "REMOVE" === e2 ? 2 : "CURRENT" === e2 ? 3 : "RESET" === e2 ? 4 : fail(39313, {
        state: e2
      });
    }, "__PRIVATE_fromWatchTargetChangeState"))(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = (/* @__PURE__ */ __name(function __PRIVATE_fromBytes(e2, t2) {
      return e2.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t2 || "string" == typeof t2, 58123), ByteString.fromBase64String(t2 || "")) : (__PRIVATE_hardAssert(void 0 === t2 || // Check if the value is an instance of both Buffer and Uint8Array,
      // despite the fact that Buffer extends Uint8Array. In some
      // environments, such as jsdom, the prototype chain of Buffer
      // does not indicate that it extends Uint8Array.
      t2 instanceof Buffer || t2 instanceof Uint8Array, 16193), ByteString.fromUint8Array(t2 || new Uint8Array()));
    }, "__PRIVATE_fromBytes"))(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && (/* @__PURE__ */ __name(function __PRIVATE_fromRpcStatus(e2) {
      const t2 = void 0 === e2.code ? D.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
      return new FirestoreError(t2, e2.message || "");
    }, "__PRIVATE_fromRpcStatus"))(o);
    n = new __PRIVATE_WatchTargetChange(r, i, s, _ || null);
  } else if ("documentChange" in t) {
    t.documentChange;
    const r = t.documentChange;
    r.document, r.document.name, r.document.updateTime;
    const i = fromName(e, r.document.name), s = __PRIVATE_fromVersion(r.document.updateTime), o = r.document.createTime ? __PRIVATE_fromVersion(r.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
      mapValue: {
        fields: r.document.fields
      }
    }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r.targetIds || [], c = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
  } else if ("documentDelete" in t) {
    t.documentDelete;
    const r = t.documentDelete;
    r.document;
    const i = fromName(e, r.document), s = r.readTime ? __PRIVATE_fromVersion(r.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
  } else if ("documentRemove" in t) {
    t.documentRemove;
    const r = t.documentRemove;
    r.document;
    const i = fromName(e, r.document), s = r.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], s, i, null);
  } else {
    if (!("filter" in t)) return fail(11601, {
      At: t
    });
    {
      t.filter;
      const e2 = t.filter;
      e2.targetId;
      const { count: r = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r, i), o = e2.targetId;
      n = new __PRIVATE_ExistenceFilterChange(o, s);
    }
  }
  return n;
}
__name(__PRIVATE_fromWatchChange, "__PRIVATE_fromWatchChange");
function toMutation(e, t) {
  let n;
  if (t instanceof __PRIVATE_SetMutation) n = {
    update: __PRIVATE_toMutationDocument(e, t.key, t.value)
  };
  else if (t instanceof __PRIVATE_DeleteMutation) n = {
    delete: __PRIVATE_toName(e, t.key)
  };
  else if (t instanceof __PRIVATE_PatchMutation) n = {
    update: __PRIVATE_toMutationDocument(e, t.key, t.data),
    updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
  };
  else {
    if (!(t instanceof __PRIVATE_VerifyMutation)) return fail(16599, {
      Vt: t.type
    });
    n = {
      verify: __PRIVATE_toName(e, t.key)
    };
  }
  return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map((e2) => (/* @__PURE__ */ __name(function __PRIVATE_toFieldTransform(e3, t2) {
    const n2 = t2.transform;
    if (n2 instanceof __PRIVATE_ServerTimestampTransform) return {
      fieldPath: t2.field.canonicalString(),
      setToServerValue: "REQUEST_TIME"
    };
    if (n2 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      appendMissingElements: {
        values: n2.elements
      }
    };
    if (n2 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      removeAllFromArray: {
        values: n2.elements
      }
    };
    if (n2 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      increment: n2.Ae
    };
    if (n2 instanceof __PRIVATE_NumericMinimumTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      minimum: n2.Ae
    };
    if (n2 instanceof __PRIVATE_NumericMaximumTransformOperation) return {
      fieldPath: t2.field.canonicalString(),
      maximum: n2.Ae
    };
    throw fail(20930, {
      transform: t2.transform
    });
  }, "__PRIVATE_toFieldTransform"))(0, e2))), t.precondition.isNone || (n.currentDocument = (/* @__PURE__ */ __name(function __PRIVATE_toPrecondition(e2, t2) {
    return void 0 !== t2.updateTime ? {
      updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
    } : void 0 !== t2.exists ? {
      exists: t2.exists
    } : fail(27497);
  }, "__PRIVATE_toPrecondition"))(e, t.precondition)), n;
}
__name(toMutation, "toMutation");
function __PRIVATE_fromWriteResults(e, t) {
  return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t, 14353), e.map((e2) => (/* @__PURE__ */ __name(function __PRIVATE_fromWriteResult(e3, t2) {
    let n = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t2);
    return n.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
    // deletes of non-existing documents (rather than null). This breaks the
    // test "get deleted doc while offline with source=cache" as NoDocuments
    // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
    // TODO(#2149): Remove this when Emulator is fixed
    (n = __PRIVATE_fromVersion(t2)), new MutationResult(n, e3.transformResults || []);
  }, "__PRIVATE_fromWriteResult"))(e2, t))) : [];
}
__name(__PRIVATE_fromWriteResults, "__PRIVATE_fromWriteResults");
function __PRIVATE_toDocumentsTarget(e, t) {
  return {
    documents: [__PRIVATE_toQueryPath(e, t.path)]
  };
}
__name(__PRIVATE_toDocumentsTarget, "__PRIVATE_toDocumentsTarget");
function __PRIVATE_toQueryTarget(e, t) {
  const n = {
    structuredQuery: {}
  }, r = t.path;
  let i;
  null !== t.collectionGroup ? (i = r, n.structuredQuery.from = [{
    collectionId: t.collectionGroup,
    allDescendants: true
  }]) : (i = r.popLast(), n.structuredQuery.from = [{
    collectionId: r.lastSegment()
  }]), n.parent = __PRIVATE_toQueryPath(e, i);
  const s = (/* @__PURE__ */ __name(function __PRIVATE_toFilters(e2) {
    if (0 === e2.length) return;
    return __PRIVATE_toFilter(CompositeFilter.create(
      e2,
      "and"
      /* CompositeOperator.AND */
    ));
  }, "__PRIVATE_toFilters"))(t.filters);
  s && (n.structuredQuery.where = s);
  const o = (/* @__PURE__ */ __name(function __PRIVATE_toOrder(e2) {
    if (0 === e2.length) return;
    return e2.map((e3) => (
      // visible for testing
      (/* @__PURE__ */ __name(function __PRIVATE_toPropertyOrder(e4) {
        return {
          field: __PRIVATE_toFieldPathReference(e4.field),
          direction: __PRIVATE_toDirection(e4.dir)
        };
      }, "__PRIVATE_toPropertyOrder"))(e3)
    ));
  }, "__PRIVATE_toOrder"))(t.orderBy);
  o && (n.structuredQuery.orderBy = o);
  const _ = __PRIVATE_toInt32Proto(e, t.limit);
  return null !== _ && (n.structuredQuery.limit = _), t.startAt && (n.structuredQuery.startAt = (/* @__PURE__ */ __name(function __PRIVATE_toStartAtCursor(e2) {
    return {
      before: e2.inclusive,
      values: e2.position
    };
  }, "__PRIVATE_toStartAtCursor"))(t.startAt)), t.endAt && (n.structuredQuery.endAt = (/* @__PURE__ */ __name(function __PRIVATE_toEndAtCursor(e2) {
    return {
      before: !e2.inclusive,
      values: e2.position
    };
  }, "__PRIVATE_toEndAtCursor"))(t.endAt)), {
    dt: n,
    parent: i
  };
}
__name(__PRIVATE_toQueryTarget, "__PRIVATE_toQueryTarget");
function __PRIVATE_convertQueryTargetToQuery(e) {
  let t = __PRIVATE_fromQueryPath(e.parent);
  const n = e.structuredQuery, r = n.from ? n.from.length : 0;
  let i = null;
  if (r > 0) {
    __PRIVATE_hardAssert(1 === r, 65062);
    const e2 = n.from[0];
    e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
  }
  let s = [];
  n.where && (s = (/* @__PURE__ */ __name(function __PRIVATE_fromFilters(e2) {
    const t2 = __PRIVATE_fromFilter(e2);
    if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2)) return t2.getFilters();
    return [t2];
  }, "__PRIVATE_fromFilters"))(n.where));
  let o = [];
  n.orderBy && (o = (/* @__PURE__ */ __name(function __PRIVATE_fromOrder(e2) {
    return e2.map((e3) => (/* @__PURE__ */ __name(function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(
        __PRIVATE_fromFieldPathReference(e4.field),
        // visible for testing
        (/* @__PURE__ */ __name(function __PRIVATE_fromDirection(e5) {
          switch (e5) {
            case "ASCENDING":
              return "asc";
            case "DESCENDING":
              return "desc";
            default:
              return;
          }
        }, "__PRIVATE_fromDirection"))(e4.direction)
      );
    }, "__PRIVATE_fromPropertyOrder"))(e3));
  }, "__PRIVATE_fromOrder"))(n.orderBy));
  let _ = null;
  n.limit && (_ = (/* @__PURE__ */ __name(function __PRIVATE_fromInt32Proto(e2) {
    let t2;
    return t2 = "object" == typeof e2 ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
  }, "__PRIVATE_fromInt32Proto"))(n.limit));
  let a = null;
  n.startAt && (a = (/* @__PURE__ */ __name(function __PRIVATE_fromStartAtCursor(e2) {
    const t2 = !!e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }, "__PRIVATE_fromStartAtCursor"))(n.startAt));
  let u = null;
  return n.endAt && (u = (/* @__PURE__ */ __name(function __PRIVATE_fromEndAtCursor(e2) {
    const t2 = !e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }, "__PRIVATE_fromEndAtCursor"))(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
}
__name(__PRIVATE_convertQueryTargetToQuery, "__PRIVATE_convertQueryTargetToQuery");
function __PRIVATE_toListenRequestLabels(e, t) {
  const n = (/* @__PURE__ */ __name(function __PRIVATE_toLabel(e2) {
    switch (e2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return fail(28987, {
          purpose: e2
        });
    }
  }, "__PRIVATE_toLabel"))(t.purpose);
  return null == n ? null : {
    "goog-listen-tags": n
  };
}
__name(__PRIVATE_toListenRequestLabels, "__PRIVATE_toListenRequestLabels");
function __PRIVATE_fromFilter(e) {
  return void 0 !== e.unaryFilter ? (/* @__PURE__ */ __name(function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      case "OPERATOR_UNSPECIFIED":
        return fail(61313);
      default:
        return fail(60726);
    }
  }, "__PRIVATE_fromUnaryFilter"))(e) : void 0 !== e.fieldFilter ? (/* @__PURE__ */ __name(function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), (/* @__PURE__ */ __name(function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        case "OPERATOR_UNSPECIFIED":
          return fail(58110);
        default:
          return fail(50506);
      }
    }, "__PRIVATE_fromOperatorName"))(e2.fieldFilter.op), e2.fieldFilter.value);
  }, "__PRIVATE_fromFieldFilter"))(e) : void 0 !== e.compositeFilter ? (/* @__PURE__ */ __name(function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map((e3) => __PRIVATE_fromFilter(e3)), (/* @__PURE__ */ __name(function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail(1026);
      }
    }, "__PRIVATE_fromCompositeOperatorName"))(e2.compositeFilter.op));
  }, "__PRIVATE_fromCompositeFilter"))(e) : fail(30097, {
    filter: e
  });
}
__name(__PRIVATE_fromFilter, "__PRIVATE_fromFilter");
function __PRIVATE_toDirection(e) {
  return ft[e];
}
__name(__PRIVATE_toDirection, "__PRIVATE_toDirection");
function __PRIVATE_toOperatorName(e) {
  return gt[e];
}
__name(__PRIVATE_toOperatorName, "__PRIVATE_toOperatorName");
function __PRIVATE_toCompositeOperatorName(e) {
  return pt[e];
}
__name(__PRIVATE_toCompositeOperatorName, "__PRIVATE_toCompositeOperatorName");
function __PRIVATE_toFieldPathReference(e) {
  return {
    fieldPath: e.canonicalString()
  };
}
__name(__PRIVATE_toFieldPathReference, "__PRIVATE_toFieldPathReference");
function __PRIVATE_fromFieldPathReference(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
}
__name(__PRIVATE_fromFieldPathReference, "__PRIVATE_fromFieldPathReference");
function __PRIVATE_toFilter(e) {
  return e instanceof FieldFilter ? (/* @__PURE__ */ __name(function __PRIVATE_toUnaryOrFieldFilter(e2) {
    if ("==" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NAN"
        }
      };
      if (__PRIVATE_isNullValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NULL"
        }
      };
    } else if ("!=" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NOT_NAN"
        }
      };
      if (__PRIVATE_isNullValue(e2.value)) return {
        unaryFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: "IS_NOT_NULL"
        }
      };
    }
    return {
      fieldFilter: {
        field: __PRIVATE_toFieldPathReference(e2.field),
        op: __PRIVATE_toOperatorName(e2.op),
        value: e2.value
      }
    };
  }, "__PRIVATE_toUnaryOrFieldFilter"))(e) : e instanceof CompositeFilter ? (/* @__PURE__ */ __name(function __PRIVATE_toCompositeFilter(e2) {
    const t = e2.getFilters().map((e3) => __PRIVATE_toFilter(e3));
    if (1 === t.length) return t[0];
    return {
      compositeFilter: {
        op: __PRIVATE_toCompositeOperatorName(e2.op),
        filters: t
      }
    };
  }, "__PRIVATE_toCompositeFilter"))(e) : fail(54877, {
    filter: e
  });
}
__name(__PRIVATE_toFilter, "__PRIVATE_toFilter");
function __PRIVATE_toDocumentMask(e) {
  const t = [];
  return e.fields.forEach((e2) => t.push(e2.canonicalString())), {
    fieldPaths: t
  };
}
__name(__PRIVATE_toDocumentMask, "__PRIVATE_toDocumentMask");
function __PRIVATE_isValidResourceName(e) {
  return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}
__name(__PRIVATE_isValidResourceName, "__PRIVATE_isValidResourceName");
function __PRIVATE_isProtoValueSerializable(e) {
  return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
}
__name(__PRIVATE_isProtoValueSerializable, "__PRIVATE_isProtoValueSerializable");
var _TargetData = class _TargetData {
  constructor(e, t, n, r, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
    this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
  }
  /** Creates a new target data instance with an updated sequence number. */
  withSequenceNumber(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  /**
   * Creates a new target data instance with an updated resume token and
   * snapshot version.
   */
  withResumeToken(e, t) {
    return new _TargetData(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      t,
      this.lastLimboFreeSnapshotVersion,
      e,
      /* expectedCount= */
      null
    );
  }
  /**
   * Creates a new target data instance with an updated expected count.
   */
  withExpectedCount(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  /**
   * Creates a new target data instance with an updated last limbo free
   * snapshot version number.
   */
  withLastLimboFreeSnapshotVersion(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
};
__name(_TargetData, "TargetData");
var TargetData = _TargetData;
var ___PRIVATE_LocalSerializer = class ___PRIVATE_LocalSerializer {
  constructor(e) {
    this.gt = e;
  }
};
__name(___PRIVATE_LocalSerializer, "__PRIVATE_LocalSerializer");
var __PRIVATE_LocalSerializer = ___PRIVATE_LocalSerializer;
function __PRIVATE_fromBundledQuery(e) {
  const t = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(
    t,
    t.limit,
    "L"
    /* LimitType.Last */
  ) : t;
}
__name(__PRIVATE_fromBundledQuery, "__PRIVATE_fromBundledQuery");
var ___PRIVATE_FirestoreIndexValueWriter = class ___PRIVATE_FirestoreIndexValueWriter {
  constructor() {
  }
  // The write methods below short-circuit writing terminators for values
  // containing a (terminating) truncated value.
  // As an example, consider the resulting encoding for:
  // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
  // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
  // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
  /** Writes an index value.  */
  bt(e, t) {
    this.Dt(e, t), // Write separator to split index values
    // (see go/firestore-storage-format#encodings).
    t.Ct();
  }
  Dt(e, t) {
    if ("nullValue" in e) this.vt(t, 5);
    else if ("booleanValue" in e) this.vt(t, 10), t.Ft(e.booleanValue ? 1 : 0);
    else if ("integerValue" in e) this.vt(t, 15), t.Ft(__PRIVATE_normalizeNumber(e.integerValue));
    else if ("doubleValue" in e) {
      const n = __PRIVATE_normalizeNumber(e.doubleValue);
      isNaN(n) ? this.vt(t, 13) : (this.vt(t, 15), __PRIVATE_isNegativeZero(n) ? (
        // -0.0, 0 and 0.0 are all considered the same
        t.Ft(0)
      ) : t.Ft(n));
    } else if ("timestampValue" in e) {
      let n = e.timestampValue;
      this.vt(t, 20), "string" == typeof n && (n = __PRIVATE_normalizeTimestamp(n)), t.Mt(`${n.seconds || ""}`), t.Ft(n.nanos || 0);
    } else if ("stringValue" in e) this.xt(e.stringValue, t), this.Ot(t);
    else if ("bytesValue" in e) this.vt(t, 30), t.Nt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Ot(t);
    else if ("referenceValue" in e) this.Bt(e.referenceValue, t);
    else if ("geoPointValue" in e) {
      const n = e.geoPointValue;
      this.vt(t, 45), t.Ft(n.latitude || 0), t.Ft(n.longitude || 0);
    } else "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.vt(t, Number.MAX_SAFE_INTEGER) : __PRIVATE_isVectorValue(e) ? this.Lt(e.mapValue, t) : (this.kt(e.mapValue, t), this.Ot(t)) : "arrayValue" in e ? (this.qt(e.arrayValue, t), this.Ot(t)) : fail(19022, {
      Kt: e
    });
  }
  xt(e, t) {
    this.vt(t, 25), this.Ut(e, t);
  }
  Ut(e, t) {
    t.Mt(e);
  }
  kt(e, t) {
    const n = e.fields || {};
    this.vt(t, 55);
    for (const e2 of Object.keys(n)) this.xt(e2, t), this.Dt(n[e2], t);
  }
  Lt(e, t) {
    const n = e.fields || {};
    this.vt(t, 53);
    const r = ut, i = n[r].arrayValue?.values?.length || 0;
    this.vt(t, 15), t.Ft(__PRIVATE_normalizeNumber(i)), // Vectors then sort by position value
    this.xt(r, t), this.Dt(n[r], t);
  }
  qt(e, t) {
    const n = e.values || [];
    this.vt(t, 50);
    for (const e2 of n) this.Dt(e2, t);
  }
  Bt(e, t) {
    this.vt(t, 37);
    DocumentKey.fromName(e).path.forEach((e2) => {
      this.vt(t, 60), this.Ut(e2, t);
    });
  }
  vt(e, t) {
    e.Ft(t);
  }
  Ot(e) {
    e.Ft(2);
  }
};
__name(___PRIVATE_FirestoreIndexValueWriter, "__PRIVATE_FirestoreIndexValueWriter");
var __PRIVATE_FirestoreIndexValueWriter = ___PRIVATE_FirestoreIndexValueWriter;
__PRIVATE_FirestoreIndexValueWriter.$t = new __PRIVATE_FirestoreIndexValueWriter();
var ___PRIVATE_MemoryIndexManager = class ___PRIVATE_MemoryIndexManager {
  constructor() {
    this.Sn = new __PRIVATE_MemoryCollectionParentIndex();
  }
  addToCollectionParentIndex(e, t) {
    return this.Sn.add(t), PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    return PersistencePromise.resolve(this.Sn.getEntries(t));
  }
  addFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t) {
    return PersistencePromise.resolve(
      0
      /* IndexType.NONE */
    );
  }
  getFieldIndexes(e, t) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t, n) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t) {
    return PersistencePromise.resolve();
  }
};
__name(___PRIVATE_MemoryIndexManager, "__PRIVATE_MemoryIndexManager");
var __PRIVATE_MemoryIndexManager = ___PRIVATE_MemoryIndexManager;
var ___PRIVATE_MemoryCollectionParentIndex = class ___PRIVATE_MemoryCollectionParentIndex {
  constructor() {
    this.index = {};
  }
  // Returns false if the entry already existed.
  add(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r.has(n);
    return this.index[t] = r.add(n), i;
  }
  has(e) {
    const t = e.lastSegment(), n = e.popLast(), r = this.index[t];
    return r && r.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
};
__name(___PRIVATE_MemoryCollectionParentIndex, "__PRIVATE_MemoryCollectionParentIndex");
var __PRIVATE_MemoryCollectionParentIndex = ___PRIVATE_MemoryCollectionParentIndex;
var bt = new Uint8Array(0);
var St = {
  didRun: false,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
};
var Dt = 41943040;
var _LruParams = class _LruParams {
  static withCacheSize(e) {
    return new _LruParams(e, _LruParams.DEFAULT_COLLECTION_PERCENTILE, _LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
};
__name(_LruParams, "LruParams");
var LruParams = _LruParams;
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(Dt, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
var ___PRIVATE_TargetIdGenerator = class ___PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.ir = e;
  }
  next() {
    return this.ir += 2, this.ir;
  }
  static sr() {
    return new ___PRIVATE_TargetIdGenerator(0);
  }
  static _r() {
    return new ___PRIVATE_TargetIdGenerator(-1);
  }
};
__name(___PRIVATE_TargetIdGenerator, "__PRIVATE_TargetIdGenerator");
var __PRIVATE_TargetIdGenerator = ___PRIVATE_TargetIdGenerator;
var Ct = "LruGarbageCollector";
var vt = 1048576;
function __PRIVATE_bufferEntryComparator([e, t], [n, r]) {
  const i = __PRIVATE_primitiveComparator(e, n);
  return 0 === i ? __PRIVATE_primitiveComparator(t, r) : i;
}
__name(__PRIVATE_bufferEntryComparator, "__PRIVATE_bufferEntryComparator");
var ___PRIVATE_RollingSequenceNumberBuffer = class ___PRIVATE_RollingSequenceNumberBuffer {
  constructor(e) {
    this.hr = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Pr = 0;
  }
  Tr() {
    return ++this.Pr;
  }
  Ir(e) {
    const t = [e, this.Tr()];
    if (this.buffer.size < this.hr) this.buffer = this.buffer.add(t);
    else {
      const e2 = this.buffer.last();
      __PRIVATE_bufferEntryComparator(t, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
};
__name(___PRIVATE_RollingSequenceNumberBuffer, "__PRIVATE_RollingSequenceNumberBuffer");
var __PRIVATE_RollingSequenceNumberBuffer = ___PRIVATE_RollingSequenceNumberBuffer;
var ___PRIVATE_LruScheduler = class ___PRIVATE_LruScheduler {
  constructor(e, t, n) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Er = null;
  }
  start() {
    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Rr(6e4);
  }
  stop() {
    this.Er && (this.Er.cancel(), this.Er = null);
  }
  get started() {
    return null !== this.Er;
  }
  Rr(e) {
    __PRIVATE_logDebug(Ct, `Garbage collection scheduled in ${e}ms`), this.Er = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, async () => {
      this.Er = null;
      try {
        await this.localStore.collectGarbage(this.garbageCollector);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug(Ct, "Ignoring IndexedDB error during garbage collection: ", e2) : await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      await this.Rr(3e5);
    });
  }
};
__name(___PRIVATE_LruScheduler, "__PRIVATE_LruScheduler");
var __PRIVATE_LruScheduler = ___PRIVATE_LruScheduler;
var ___PRIVATE_LruGarbageCollectorImpl = class ___PRIVATE_LruGarbageCollectorImpl {
  constructor(e, t) {
    this.Ar = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.Ar.Vr(e).next((e2) => Math.floor(t / 100 * e2));
  }
  nthSequenceNumber(e, t) {
    if (0 === t) return PersistencePromise.resolve(__PRIVATE_ListenSequence.ce);
    const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
    return this.Ar.forEachTarget(e, (e2) => n.Ir(e2.sequenceNumber)).next(() => this.Ar.dr(e, (e2) => n.Ir(e2))).next(() => n.maxValue);
  }
  removeTargets(e, t, n) {
    return this.Ar.removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    return this.Ar.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(St)) : this.getCacheSize(e).next((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), St) : this.mr(e, t));
  }
  getCacheSize(e) {
    return this.Ar.getCacheSize(e);
  }
  mr(e, t) {
    let n, r, i, s, o, _, a;
    const u = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next((t2) => (
      // Cap at the configured max
      (t2 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t2}`), r = this.params.maximumSequenceNumbersToCollect) : r = t2, s = Date.now(), this.nthSequenceNumber(e, r))
    )).next((r2) => (n = r2, o = Date.now(), this.removeTargets(e, n, t))).next((t2) => (i = t2, _ = Date.now(), this.removeOrphanedDocuments(e, n))).next((e2) => {
      if (a = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
        __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s - u}ms
	Determined least recently used ${r} in ` + (o - s) + `ms
	Removed ${i} targets in ` + (_ - o) + `ms
	Removed ${e2} documents in ` + (a - _) + `ms
Total Duration: ${a - u}ms`);
      }
      return PersistencePromise.resolve({
        didRun: true,
        sequenceNumbersCollected: r,
        targetsRemoved: i,
        documentsRemoved: e2
      });
    });
  }
};
__name(___PRIVATE_LruGarbageCollectorImpl, "__PRIVATE_LruGarbageCollectorImpl");
var __PRIVATE_LruGarbageCollectorImpl = ___PRIVATE_LruGarbageCollectorImpl;
function __PRIVATE_newLruGarbageCollector(e, t) {
  return new __PRIVATE_LruGarbageCollectorImpl(e, t);
}
__name(__PRIVATE_newLruGarbageCollector, "__PRIVATE_newLruGarbageCollector");
var _RemoteDocumentChangeBuffer = class _RemoteDocumentChangeBuffer {
  constructor() {
    this.changes = new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = false;
  }
  /**
   * Buffers a `RemoteDocumentCache.addEntry()` call.
   *
   * You can only modify documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  /**
   * Buffers a `RemoteDocumentCache.removeEntry()` call.
   *
   * You can only remove documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
  }
  /**
   * Looks up an entry in the cache. The buffered changes will first be checked,
   * and if no buffered change applies, this will forward to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document or an invalid document if we have nothing
   * cached.
   */
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
  }
  /**
   * Looks up several entries in the cache, forwarding to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKeys - The keys of the entries to look up.
   * @returns A map of cached documents, indexed by key. If an entry cannot be
   *     found, the corresponding key will be mapped to an invalid document.
   */
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  /**
   * Applies buffered changes to the underlying RemoteDocumentCache, using
   * the provided transaction.
   */
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  /** Helper to assert this.changes is not null  */
  assertNotApplied() {
  }
};
__name(_RemoteDocumentChangeBuffer, "RemoteDocumentChangeBuffer");
var RemoteDocumentChangeBuffer = _RemoteDocumentChangeBuffer;
var _OverlayedDocument = class _OverlayedDocument {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
};
__name(_OverlayedDocument, "OverlayedDocument");
var OverlayedDocument = _OverlayedDocument;
var _LocalDocumentsView = class _LocalDocumentsView {
  constructor(e, t, n, r) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r;
  }
  /**
   * Get the local view of the document identified by `key`.
   *
   * @returns Local view of the document or null if we don't have any cached
   * state for it.
   */
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache.getOverlay(e, t).next((r) => (n = r, this.remoteDocumentCache.getEntry(e, t))).next((e2) => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2));
  }
  /**
   * Gets the local view of the documents identified by `keys`.
   *
   * If we don't have cached state for a document in `keys`, a NoDocument will
   * be stored for that key in the resulting set.
   */
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next(() => t2));
  }
  /**
   * Similar to `getDocuments`, but creates the local view from the given
   * `baseDocs` without retrieving documents from the local store.
   *
   * @param transaction - The transaction this operation is scoped to.
   * @param docs - The documents to apply local mutations to get the local views.
   * @param existenceStateChanged - The set of document keys whose existence state
   *   is changed. This is useful to determine if some documents overlay needs
   *   to be recalculated.
   */
  getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
    const r = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r, t).next(() => this.computeViews(e, t, r, n).next((e2) => {
      let t2 = documentMap();
      return e2.forEach((e3, n2) => {
        t2 = t2.insert(e3, n2.overlayedDocument);
      }), t2;
    }));
  }
  /**
   * Gets the overlayed documents for the given document map, which will include
   * the local view of those documents and a `FieldMask` indicating which fields
   * are mutated locally, `null` if overlay is a Set or Delete mutation.
   */
  getOverlayedDocuments(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n, t).next(() => this.computeViews(e, t, n, __PRIVATE_documentKeySet()));
  }
  /**
   * Fetches the overlays for {@code docs} and adds them to provided overlay map
   * if the map does not already contain an entry for the given document key.
   */
  populateOverlays(e, t, n) {
    const r = [];
    return n.forEach((e2) => {
      t.has(e2) || r.push(e2);
    }), this.documentOverlayCache.getOverlays(e, r).next((e2) => {
      e2.forEach((e3, n2) => {
        t.set(e3, n2);
      });
    });
  }
  /**
   * Computes the local view for the given documents.
   *
   * @param docs - The documents to compute views for. It also has the base
   *   version of the documents.
   * @param overlays - The overlays that need to be applied to the given base
   *   version of the documents.
   * @param existenceStateChanged - A set of documents whose existence states
   *   might have changed. This is used to determine if we need to re-calculate
   *   overlays from mutation queues.
   * @returns A map represents the local documents view.
   */
  computeViews(e, t, n, r) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), o = (/* @__PURE__ */ __name(function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    }, "__PRIVATE_newOverlayedDocumentMap"))();
    return t.forEach((e2, t2) => {
      const o2 = n.get(t2.key);
      r.has(t2.key) && (void 0 === o2 || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : void 0 !== o2 ? (s.set(t2.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t2, o2.mutation.getFieldMask(), Timestamp.now())) : (
        // no overlay exists
        // Using EMPTY to indicate there is no overlay for the document.
        s.set(t2.key, FieldMask.empty())
      );
    }), this.recalculateAndSaveOverlays(e, i).next((e2) => (e2.forEach((e3, t2) => s.set(e3, t2)), t.forEach((e3, t2) => o.set(e3, new OverlayedDocument(t2, s.get(e3) ?? null))), o));
  }
  recalculateAndSaveOverlays(e, t) {
    const n = __PRIVATE_newDocumentKeyMap();
    let r = new SortedMap((e2, t2) => e2 - t2), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e2) => {
      for (const i2 of e2) i2.keys().forEach((e3) => {
        const s = t.get(e3);
        if (null === s) return;
        let o = n.get(e3) || FieldMask.empty();
        o = i2.applyToLocalView(s, o), n.set(e3, o);
        const _ = (r.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
        r = r.insert(i2.batchId, _);
      });
    }).next(() => {
      const s = [], o = r.getReverseIterator();
      for (; o.hasNext(); ) {
        const r2 = o.getNext(), _ = r2.key, a = r2.value, u = __PRIVATE_newMutationMap();
        a.forEach((e2) => {
          if (!i.has(e2)) {
            const r3 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
            null !== r3 && u.set(e2, r3), i = i.add(e2);
          }
        }), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
      }
      return PersistencePromise.waitFor(s);
    }).next(() => n);
  }
  /**
   * Recalculates overlays by reading the documents from remote document cache
   * first, and saves them after they are calculated.
   */
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.recalculateAndSaveOverlays(e, t2));
  }
  /**
   * Performs a query against the local view of all documents.
   *
   * @param transaction - The persistence transaction.
   * @param query - The query to match documents against.
   * @param offset - Read time and key to start scanning by (exclusive).
   * @param context - A optional tracker to keep a record of important details
   *   during database local query execution.
   */
  getDocumentsMatchingQuery(e, t, n, r) {
    return __PRIVATE_isDocumentQuery$1(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r) : this.getDocumentsMatchingCollectionQuery(e, t, n, r);
  }
  /**
   * Given a collection group, returns the next documents that follow the provided offset, along
   * with an updated batch ID.
   *
   * <p>The documents returned by this method are ordered by remote version from the provided
   * offset. If there are no more remote documents after the provided offset, documents with
   * mutations in order of batch id from the offset are returned. Since all documents in a batch are
   * returned together, the total number of documents returned can exceed {@code count}.
   *
   * @param transaction
   * @param collectionGroup - The collection group for the documents.
   * @param offset - The offset to index into.
   * @param count - The number of documents to return
   * @returns A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
   */
  getNextDocuments(e, t, n, r) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r).next((i) => {
      const s = r - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let o = N, _ = i;
      return s.next((t2) => PersistencePromise.forEach(t2, (t3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next((e2) => {
        _ = _.insert(t3, e2);
      }))).next(() => this.populateOverlays(e, t2, i)).next(() => this.computeViews(e, _, t2, __PRIVATE_documentKeySet())).next((e2) => ({
        batchId: o,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new DocumentKey(t)).next((e2) => {
      let t2 = documentMap();
      return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r) {
    const i = t.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next((o) => PersistencePromise.forEach(o, (o2) => {
      const _ = (/* @__PURE__ */ __name(function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
        return new __PRIVATE_QueryImpl(
          t2,
          /*collectionGroup=*/
          null,
          e2.explicitOrderBy.slice(),
          e2.filters.slice(),
          e2.limit,
          e2.limitType,
          e2.startAt,
          e2.endAt
        );
      }, "__PRIVATE_asCollectionQueryAtPath"))(t, o2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, _, n, r).next((e2) => {
        e2.forEach((e3, t2) => {
          s = s.insert(e3, t2);
        });
      });
    }).next(() => s));
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r))).next((e2) => {
      i.forEach((t2, n3) => {
        const r2 = n3.getKey();
        null === e2.get(r2) && (e2 = e2.insert(r2, MutableDocument.newInvalidDocument(r2)));
      });
      let n2 = documentMap();
      return e2.forEach((e3, r2) => {
        const s = i.get(e3);
        void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r2, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
        __PRIVATE_queryMatches(t, r2) && (n2 = n2.insert(e3, r2));
      }), n2;
    });
  }
};
__name(_LocalDocumentsView, "LocalDocumentsView");
var LocalDocumentsView = _LocalDocumentsView;
var ___PRIVATE_MemoryBundleCache = class ___PRIVATE_MemoryBundleCache {
  constructor(e) {
    this.serializer = e, this.Or = /* @__PURE__ */ new Map(), this.Nr = /* @__PURE__ */ new Map();
  }
  getBundleMetadata(e, t) {
    return PersistencePromise.resolve(this.Or.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.Or.set(
      t.id,
      /** Decodes a BundleMetadata proto into a BundleMetadata object. */
      (/* @__PURE__ */ __name(function __PRIVATE_fromBundleMetadata(e2) {
        return {
          id: e2.id,
          version: e2.version,
          createTime: __PRIVATE_fromVersion(e2.createTime)
        };
      }, "__PRIVATE_fromBundleMetadata"))(t)
    ), PersistencePromise.resolve();
  }
  getNamedQuery(e, t) {
    return PersistencePromise.resolve(this.Nr.get(t));
  }
  saveNamedQuery(e, t) {
    return this.Nr.set(t.name, (/* @__PURE__ */ __name(function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    }, "__PRIVATE_fromProtoNamedQuery"))(t)), PersistencePromise.resolve();
  }
};
__name(___PRIVATE_MemoryBundleCache, "__PRIVATE_MemoryBundleCache");
var __PRIVATE_MemoryBundleCache = ___PRIVATE_MemoryBundleCache;
var ___PRIVATE_MemoryDocumentOverlayCache = class ___PRIVATE_MemoryDocumentOverlayCache {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.Br = /* @__PURE__ */ new Map();
  }
  getOverlay(e, t) {
    return PersistencePromise.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      null !== e2 && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    return n.forEach((n2, r) => {
      this.wt(e, t, r);
    }), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t, n) {
    const r = this.Br.get(n);
    return void 0 !== r && (r.forEach((e2) => this.overlays = this.overlays.remove(e2)), this.Br.delete(n)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t, n) {
    const r = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
    for (; o.hasNext(); ) {
      const e2 = o.getNext().value, s2 = e2.getKey();
      if (!t.isPrefixOf(s2.path)) break;
      s2.path.length === i && (e2.largestBatchId > n && r.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r);
  }
  getOverlaysForCollectionGroup(e, t, n, r) {
    let i = new SortedMap((e2, t2) => e2 - t2);
    const s = this.overlays.getIterator();
    for (; s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
        let t2 = i.get(e2.largestBatchId);
        null === t2 && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
      }
    }
    const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
    for (; _.hasNext(); ) {
      if (_.getNext().value.forEach((e2, t2) => o.set(e2, t2)), o.size() >= r) break;
    }
    return PersistencePromise.resolve(o);
  }
  wt(e, t, n) {
    const r = this.overlays.get(n.key);
    if (null !== r) {
      const e2 = this.Br.get(r.largestBatchId).delete(n.key);
      this.Br.set(r.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
    let i = this.Br.get(t);
    void 0 === i && (i = __PRIVATE_documentKeySet(), this.Br.set(t, i)), this.Br.set(t, i.add(n.key));
  }
};
__name(___PRIVATE_MemoryDocumentOverlayCache, "__PRIVATE_MemoryDocumentOverlayCache");
var __PRIVATE_MemoryDocumentOverlayCache = ___PRIVATE_MemoryDocumentOverlayCache;
var ___PRIVATE_MemoryGlobalsCache = class ___PRIVATE_MemoryGlobalsCache {
  constructor() {
    this.sessionToken = ByteString.EMPTY_BYTE_STRING;
  }
  getSessionToken(e) {
    return PersistencePromise.resolve(this.sessionToken);
  }
  setSessionToken(e, t) {
    return this.sessionToken = t, PersistencePromise.resolve();
  }
};
__name(___PRIVATE_MemoryGlobalsCache, "__PRIVATE_MemoryGlobalsCache");
var __PRIVATE_MemoryGlobalsCache = ___PRIVATE_MemoryGlobalsCache;
var ___PRIVATE_ReferenceSet = class ___PRIVATE_ReferenceSet {
  constructor() {
    this.Lr = new SortedSet(__PRIVATE_DocReference.kr), // A set of outstanding references to a document sorted by target id.
    this.qr = new SortedSet(__PRIVATE_DocReference.Kr);
  }
  /** Returns true if the reference set contains no references. */
  isEmpty() {
    return this.Lr.isEmpty();
  }
  /** Adds a reference to the given document key for the given ID. */
  addReference(e, t) {
    const n = new __PRIVATE_DocReference(e, t);
    this.Lr = this.Lr.add(n), this.qr = this.qr.add(n);
  }
  /** Add references to the given document keys for the given ID. */
  Ur(e, t) {
    e.forEach((e2) => this.addReference(e2, t));
  }
  /**
   * Removes a reference to the given document key for the given
   * ID.
   */
  removeReference(e, t) {
    this.$r(new __PRIVATE_DocReference(e, t));
  }
  Wr(e, t) {
    e.forEach((e2) => this.removeReference(e2, t));
  }
  /**
   * Clears all references with a given ID. Calls removeRef() for each key
   * removed.
   */
  Qr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1), i = [];
    return this.qr.forEachInRange([n, r], (e2) => {
      this.$r(e2), i.push(e2.key);
    }), i;
  }
  Gr() {
    this.Lr.forEach((e) => this.$r(e));
  }
  $r(e) {
    this.Lr = this.Lr.delete(e), this.qr = this.qr.delete(e);
  }
  zr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r = new __PRIVATE_DocReference(t, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.qr.forEachInRange([n, r], (e2) => {
      i = i.add(e2.key);
    }), i;
  }
  containsKey(e) {
    const t = new __PRIVATE_DocReference(e, 0), n = this.Lr.firstAfterOrEqual(t);
    return null !== n && e.isEqual(n.key);
  }
};
__name(___PRIVATE_ReferenceSet, "__PRIVATE_ReferenceSet");
var __PRIVATE_ReferenceSet = ___PRIVATE_ReferenceSet;
var ___PRIVATE_DocReference = class ___PRIVATE_DocReference {
  constructor(e, t) {
    this.key = e, this.jr = t;
  }
  /** Compare by key then by ID */
  static kr(e, t) {
    return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.jr, t.jr);
  }
  /** Compare by ID then by key */
  static Kr(e, t) {
    return __PRIVATE_primitiveComparator(e.jr, t.jr) || DocumentKey.comparator(e.key, t.key);
  }
};
__name(___PRIVATE_DocReference, "__PRIVATE_DocReference");
var __PRIVATE_DocReference = ___PRIVATE_DocReference;
var ___PRIVATE_MemoryMutationQueue = class ___PRIVATE_MemoryMutationQueue {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, /**
     * The set of all mutations that have been sent but not yet been applied to
     * the backend.
     */
    this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
    this.Xn = 1, /** An ordered mapping between documents and the mutations batch IDs. */
    this.Jr = new SortedSet(__PRIVATE_DocReference.kr);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(0 === this.mutationQueue.length);
  }
  addMutationBatch(e, t, n, r) {
    const i = this.Xn;
    this.Xn++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t, n, r);
    this.mutationQueue.push(s);
    for (const t2 of r) this.Jr = this.Jr.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return PersistencePromise.resolve(this.Hr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r = this.Zr(n), i = r < 0 ? 0 : r;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(0 === this.mutationQueue.length ? q : this.Xn - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
    return this.Jr.forEachInRange([n, r], (e2) => {
      const t2 = this.Hr(e2.jr);
      i.push(t2);
    }), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    return t.forEach((e2) => {
      const t2 = new __PRIVATE_DocReference(e2, 0), r = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.Jr.forEachInRange([t2, r], (e3) => {
        n = n.add(e3.jr);
      });
    }), PersistencePromise.resolve(this.Xr(n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r = n.length + 1;
    let i = n;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return this.Jr.forEachWhile((e2) => {
      const t2 = e2.key.path;
      return !!n.isPrefixOf(t2) && // Rows with document keys more than one segment longer than the query
      // path can't be matches. For example, a query on 'rooms' can't match
      // the document /rooms/abc/messages/xyx.
      // TODO(mcg): we'll need a different scanner when we implement
      // ancestor queries.
      (t2.length === r && (o = o.add(e2.jr)), true);
    }, s), PersistencePromise.resolve(this.Xr(o));
  }
  Xr(e) {
    const t = [];
    return e.forEach((e2) => {
      const n = this.Hr(e2);
      null !== n && t.push(n);
    }), t;
  }
  removeMutationBatch(e, t) {
    __PRIVATE_hardAssert(0 === this.Yr(t.batchId, "removed"), 55003), this.mutationQueue.shift();
    let n = this.Jr;
    return PersistencePromise.forEach(t.mutations, (r) => {
      const i = new __PRIVATE_DocReference(r.key, t.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r.key);
    }).next(() => {
      this.Jr = n;
    });
  }
  tr(e) {
  }
  containsKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r = this.Jr.firstAfterOrEqual(n);
    return PersistencePromise.resolve(t.isEqual(r && r.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  /**
   * Finds the index of the given batchId in the mutation queue and asserts that
   * the resulting index is within the bounds of the queue.
   *
   * @param batchId - The batchId to search for
   * @param action - A description of what the caller is doing, phrased in passive
   * form (e.g. "acknowledged" in a routine that acknowledges batches).
   */
  Yr(e, t) {
    return this.Zr(e);
  }
  /**
   * Finds the index of the given batchId in the mutation queue. This operation
   * is O(1).
   *
   * @returns The computed index of the batch with the given batchId, based on
   * the state of the queue. Note this index can be negative if the requested
   * batchId has already been removed from the queue or past the end of the
   * queue if the batchId is larger than the last added batch.
   */
  Zr(e) {
    if (0 === this.mutationQueue.length)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  /**
   * A version of lookupMutationBatch that doesn't return a promise, this makes
   * other functions that uses this code easier to read and more efficient.
   */
  Hr(e) {
    const t = this.Zr(e);
    if (t < 0 || t >= this.mutationQueue.length) return null;
    return this.mutationQueue[t];
  }
};
__name(___PRIVATE_MemoryMutationQueue, "__PRIVATE_MemoryMutationQueue");
var __PRIVATE_MemoryMutationQueue = ___PRIVATE_MemoryMutationQueue;
var ___PRIVATE_MemoryRemoteDocumentCacheImpl = class ___PRIVATE_MemoryRemoteDocumentCacheImpl {
  /**
   * @param sizer - Used to assess the size of a document. For eager GC, this is
   * expected to just return 0 to avoid unnecessarily doing the work of
   * calculating the size.
   */
  constructor(e) {
    this.ei = e, /** Underlying cache of documents and their read times. */
    this.docs = (/* @__PURE__ */ __name(function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    }, "__PRIVATE_documentEntryMap"))(), /** Size of all cached documents. */
    this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entry to the cache and updates the cache size as appropriate.
   *
   * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  addEntry(e, t) {
    const n = t.key, r = this.docs.get(n), i = r ? r.size : 0, s = this.ei(t);
    return this.docs = this.docs.insert(n, {
      document: t.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
  }
  /**
   * Removes the specified entry from the cache and updates the cache size as appropriate.
   *
   * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return t.forEach((e2) => {
      const t2 = this.docs.get(e2);
      n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    }), PersistencePromise.resolve(n);
  }
  getDocumentsMatchingQuery(e, t, n, r) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = t.path, o = new DocumentKey(s.child("__id-9223372036854775808__")), _ = this.docs.getIteratorFrom(o);
    for (; _.hasNext(); ) {
      const { key: e2, value: { document: o2 } } = _.getNext();
      if (!s.isPrefixOf(e2.path)) break;
      e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n) <= 0 || (r.has(o2.key) || __PRIVATE_queryMatches(t, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return PersistencePromise.resolve(i);
  }
  getAllFromCollectionGroup(e, t, n, r) {
    fail(9500);
  }
  ti(e, t) {
    return PersistencePromise.forEach(this.docs, (e2) => t(e2));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
};
__name(___PRIVATE_MemoryRemoteDocumentCacheImpl, "__PRIVATE_MemoryRemoteDocumentCacheImpl");
var __PRIVATE_MemoryRemoteDocumentCacheImpl = ___PRIVATE_MemoryRemoteDocumentCacheImpl;
var ___PRIVATE_MemoryRemoteDocumentChangeBuffer = class ___PRIVATE_MemoryRemoteDocumentChangeBuffer extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this.Fr = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((n, r) => {
      r.isValidDocument() ? t.push(this.Fr.addEntry(e, r)) : this.Fr.removeEntry(n);
    }), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this.Fr.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this.Fr.getEntries(e, t);
  }
};
__name(___PRIVATE_MemoryRemoteDocumentChangeBuffer, "__PRIVATE_MemoryRemoteDocumentChangeBuffer");
var __PRIVATE_MemoryRemoteDocumentChangeBuffer = ___PRIVATE_MemoryRemoteDocumentChangeBuffer;
var ___PRIVATE_MemoryTargetCache = class ___PRIVATE_MemoryTargetCache {
  constructor(e) {
    this.persistence = e, /**
     * Maps a target to the data about that target
     */
    this.ni = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /** The last received snapshot version. */
    this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
    this.highestTargetId = 0, /** The highest sequence number encountered. */
    this.ri = 0, /**
     * A ordered bidirectional mapping between documents and the remote target
     * IDs.
     */
    this.ii = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.si = __PRIVATE_TargetIdGenerator.sr();
  }
  forEachTarget(e, t) {
    return this.ni.forEach((e2, n) => t(n)), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.ri);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.si.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, n) {
    return n && (this.lastRemoteSnapshotVersion = n), t > this.ri && (this.ri = t), PersistencePromise.resolve();
  }
  cr(e) {
    this.ni.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.si = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.ri && (this.ri = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.cr(t), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t) {
    return this.cr(t), PersistencePromise.resolve();
  }
  removeTargetData(e, t) {
    return this.ni.delete(t.target), this.ii.Qr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t, n) {
    let r = 0;
    const i = [];
    return this.ni.forEach((s, o) => {
      o.sequenceNumber <= t && null === n.get(o.targetId) && (this.ni.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r++);
    }), PersistencePromise.waitFor(i).next(() => r);
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.ni.get(t) || null;
    return PersistencePromise.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return this.ii.Ur(t, n), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t, n) {
    this.ii.Wr(t, n);
    const r = this.persistence.referenceDelegate, i = [];
    return r && t.forEach((t2) => {
      i.push(r.markPotentiallyOrphaned(e, t2));
    }), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.ii.Qr(t), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.ii.zr(t);
    return PersistencePromise.resolve(n);
  }
  containsKey(e, t) {
    return PersistencePromise.resolve(this.ii.containsKey(t));
  }
};
__name(___PRIVATE_MemoryTargetCache, "__PRIVATE_MemoryTargetCache");
var __PRIVATE_MemoryTargetCache = ___PRIVATE_MemoryTargetCache;
var ___PRIVATE_MemoryPersistence = class ___PRIVATE_MemoryPersistence {
  /**
   * The constructor accepts a factory for creating a reference delegate. This
   * allows both the delegate and this instance to have strong references to
   * each other without having nullable fields that would then need to be
   * checked or asserted on every access.
   */
  constructor(e, t) {
    this.oi = {}, this.overlays = {}, this._i = new __PRIVATE_ListenSequence(0), this.ai = false, this.ai = true, this.ui = new __PRIVATE_MemoryGlobalsCache(), this.referenceDelegate = e(this), this.ci = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = (/* @__PURE__ */ __name(function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    }, "__PRIVATE_newMemoryRemoteDocumentCache"))((e2) => this.referenceDelegate.li(e2)), this.serializer = new __PRIVATE_LocalSerializer(t), this.hi = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.ai = false, Promise.resolve();
  }
  get started() {
    return this.ai;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let n = this.oi[e.toKey()];
    return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.oi[e.toKey()] = n), n;
  }
  getGlobalsCache() {
    return this.ui;
  }
  getTargetCache() {
    return this.ci;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.hi;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r = new __PRIVATE_MemoryTransaction(this._i.next());
    return this.referenceDelegate.Pi(), n(r).next((e2) => this.referenceDelegate.Ti(r).next(() => e2)).toPromise().then((e2) => (r.raiseOnCommittedEvent(), e2));
  }
  Ii(e, t) {
    return PersistencePromise.or(Object.values(this.oi).map((n) => () => n.containsKey(e, t)));
  }
};
__name(___PRIVATE_MemoryPersistence, "__PRIVATE_MemoryPersistence");
var __PRIVATE_MemoryPersistence = ___PRIVATE_MemoryPersistence;
var ___PRIVATE_MemoryTransaction = class ___PRIVATE_MemoryTransaction extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
};
__name(___PRIVATE_MemoryTransaction, "__PRIVATE_MemoryTransaction");
var __PRIVATE_MemoryTransaction = ___PRIVATE_MemoryTransaction;
var ___PRIVATE_MemoryEagerDelegate = class ___PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, /** Tracks all documents that are active in Query views. */
    this.Ei = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
    this.Ri = null;
  }
  static Ai(e) {
    return new ___PRIVATE_MemoryEagerDelegate(e);
  }
  get Vi() {
    if (this.Ri) return this.Ri;
    throw fail(60996);
  }
  addReference(e, t, n) {
    return this.Ei.addReference(n, t), this.Vi.delete(n.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.Ei.removeReference(n, t), this.Vi.add(n.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.Vi.add(t.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    this.Ei.Qr(t.targetId).forEach((e2) => this.Vi.add(e2.toString()));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(e, t.targetId).next((e2) => {
      e2.forEach((e3) => this.Vi.add(e3.toString()));
    }).next(() => n.removeTargetData(e, t));
  }
  Pi() {
    this.Ri = /* @__PURE__ */ new Set();
  }
  Ti(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.Vi, (n) => {
      const r = DocumentKey.fromPath(n);
      return this.di(e, r).next((e2) => {
        e2 || t.removeEntry(r, SnapshotVersion.min());
      });
    }).next(() => (this.Ri = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.di(e, t).next((e2) => {
      e2 ? this.Vi.delete(t.toString()) : this.Vi.add(t.toString());
    });
  }
  li(e) {
    return 0;
  }
  di(e, t) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.Ei.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Ii(e, t)]);
  }
};
__name(___PRIVATE_MemoryEagerDelegate, "__PRIVATE_MemoryEagerDelegate");
var __PRIVATE_MemoryEagerDelegate = ___PRIVATE_MemoryEagerDelegate;
var ___PRIVATE_MemoryLruDelegate = class ___PRIVATE_MemoryLruDelegate {
  constructor(e, t) {
    this.persistence = e, this.mi = new ObjectMap((e2) => __PRIVATE_encodeResourcePath(e2.path), (e2, t2) => e2.isEqual(t2)), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
  }
  static Ai(e, t) {
    return new ___PRIVATE_MemoryLruDelegate(e, t);
  }
  // No-ops, present so memory persistence doesn't have to care which delegate
  // it has.
  Pi() {
  }
  Ti(e) {
    return PersistencePromise.resolve();
  }
  forEachTarget(e, t) {
    return this.persistence.getTargetCache().forEachTarget(e, t);
  }
  Vr(e) {
    const t = this.gr(e);
    return this.persistence.getTargetCache().getTargetCount(e).next((e2) => t.next((t2) => e2 + t2));
  }
  gr(e) {
    let t = 0;
    return this.dr(e, (e2) => {
      t++;
    }).next(() => t);
  }
  dr(e, t) {
    return PersistencePromise.forEach(this.mi, (n, r) => this.yr(e, n, r).next((e2) => e2 ? PersistencePromise.resolve() : t(r)));
  }
  removeTargets(e, t, n) {
    return this.persistence.getTargetCache().removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    let n = 0;
    const r = this.persistence.getRemoteDocumentCache(), i = r.newChangeBuffer();
    return r.ti(e, (r2) => this.yr(e, r2, t).next((e2) => {
      e2 || (n++, i.removeEntry(r2, SnapshotVersion.min()));
    })).next(() => i.apply(e)).next(() => n);
  }
  markPotentiallyOrphaned(e, t) {
    return this.mi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, n);
  }
  addReference(e, t, n) {
    return this.mi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.mi.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  updateLimboDocument(e, t) {
    return this.mi.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  li(e) {
    let t = e.key.toString().length;
    return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
  }
  yr(e, t, n) {
    return PersistencePromise.or([() => this.persistence.Ii(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
      const e2 = this.mi.get(t);
      return PersistencePromise.resolve(void 0 !== e2 && e2 > n);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
};
__name(___PRIVATE_MemoryLruDelegate, "__PRIVATE_MemoryLruDelegate");
var __PRIVATE_MemoryLruDelegate = ___PRIVATE_MemoryLruDelegate;
var ___PRIVATE_LocalViewChanges = class ___PRIVATE_LocalViewChanges {
  constructor(e, t, n, r) {
    this.targetId = e, this.fromCache = t, this.Ps = n, this.Ts = r;
  }
  static Is(e, t) {
    let n = __PRIVATE_documentKeySet(), r = __PRIVATE_documentKeySet();
    for (const e2 of t.docChanges) switch (e2.type) {
      case 0:
        n = n.add(e2.doc.key);
        break;
      case 1:
        r = r.add(e2.doc.key);
    }
    return new ___PRIVATE_LocalViewChanges(e, t.fromCache, n, r);
  }
};
__name(___PRIVATE_LocalViewChanges, "__PRIVATE_LocalViewChanges");
var __PRIVATE_LocalViewChanges = ___PRIVATE_LocalViewChanges;
var _QueryContext = class _QueryContext {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
};
__name(_QueryContext, "QueryContext");
var QueryContext = _QueryContext;
var ___PRIVATE_QueryEngine = class ___PRIVATE_QueryEngine {
  constructor() {
    this.Es = false, this.Rs = false, /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    this.As = 100, this.Vs = /**
    * This cost represents the evaluation result of
    * (([index, docKey] + [docKey, docContent]) per document in the result set)
    * / ([docKey, docContent] per documents in full collection scan) coming from
    * experiment [enter PR experiment URL here].
    */
    (/* @__PURE__ */ __name(function __PRIVATE_getDefaultRelativeIndexReadCostPerDocument() {
      return isSafari() ? 8 : __PRIVATE_getAndroidVersion(getUA()) > 0 ? 6 : 4;
    }, "__PRIVATE_getDefaultRelativeIndexReadCostPerDocument"))();
  }
  /** Sets the document view to query against. */
  initialize(e, t) {
    this.ds = e, this.indexManager = t, this.Es = true;
  }
  /** Returns all local documents matching the specified query. */
  getDocumentsMatchingQuery(e, t, n, r) {
    const i = {
      result: null
    };
    return this.fs(e, t).next((e2) => {
      i.result = e2;
    }).next(() => {
      if (!i.result) return this.gs(e, t, r, n).next((e2) => {
        i.result = e2;
      });
    }).next(() => {
      if (i.result) return;
      const n2 = new QueryContext();
      return this.ps(e, t, n2).next((r2) => {
        if (i.result = r2, this.Rs) return this.ys(e, t, n2, r2.size);
      });
    }).next(() => i.result);
  }
  ys(e, t, n, r) {
    return n.documentReadCount < this.As ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.As, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r, "documents as results."), n.documentReadCount > this.Vs * r ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
  }
  /**
   * Performs an indexed query that evaluates the query based on a collection's
   * persisted index values. Returns `null` if an index is not available.
   */
  fs(e, t) {
    if (__PRIVATE_queryMatchesAllDocuments(t))
      return PersistencePromise.resolve(null);
    let n = __PRIVATE_queryToTarget(t);
    return this.indexManager.getIndexType(e, n).next((r) => 0 === r ? null : (null !== t.limit && 1 === r && // We cannot apply a limit for targets that are served using a partial
    // index. If a partial index will be used to serve the target, the
    // query may return a superset of documents that match the target
    // (e.g. if the index doesn't include all the target's filters), or
    // may return the correct set of documents in the wrong order (e.g. if
    // the index doesn't include a segment for one of the orderBys).
    // Therefore, a limit should not be applied in such cases.
    (t = __PRIVATE_queryWithLimit(
      t,
      null,
      "F"
      /* LimitType.First */
    ), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next((r2) => {
      const i = __PRIVATE_documentKeySet(...r2);
      return this.ds.getDocuments(e, i).next((r3) => this.indexManager.getMinOffset(e, n).next((n2) => {
        const s = this.ws(t, r3);
        return this.Ss(t, s, i, n2.readTime) ? this.fs(e, __PRIVATE_queryWithLimit(
          t,
          null,
          "F"
          /* LimitType.First */
        )) : this.bs(e, s, t, n2);
      }));
    })));
  }
  /**
   * Performs a query based on the target's persisted query mapping. Returns
   * `null` if the mapping is not available or cannot be used.
   */
  gs(e, t, n, r) {
    return __PRIVATE_queryMatchesAllDocuments(t) || r.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.ds.getDocuments(e, n).next((i) => {
      const s = this.ws(t, i);
      return this.Ss(t, s, n, r) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r.toString(), __PRIVATE_stringifyQuery(t)), this.bs(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r, N)).next((e2) => e2));
    });
  }
  /** Applies the query filter and sorting to the provided documents.  */
  ws(e, t) {
    let n = new SortedSet(__PRIVATE_newQueryComparator(e));
    return t.forEach((t2, r) => {
      __PRIVATE_queryMatches(e, r) && (n = n.add(r));
    }), n;
  }
  /**
   * Determines if a limit query needs to be refilled from cache, making it
   * ineligible for index-free execution.
   *
   * @param query - The query.
   * @param sortedPreviousResults - The documents that matched the query when it
   * was last synchronized, sorted by the query's comparator.
   * @param remoteKeys - The document keys that matched the query at the last
   * snapshot.
   * @param limboFreeSnapshotVersion - The version of the snapshot when the
   * query was last synchronized.
   */
  Ss(e, t, n, r) {
    if (null === e.limit)
      return false;
    if (n.size !== t.size)
      return true;
    const i = "F" === e.limitType ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r) > 0);
  }
  ps(e, t, n) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.ds.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
  }
  /**
   * Combines the results from an indexed execution with the remaining documents
   * that have not yet been indexed.
   */
  bs(e, t, n, r) {
    return this.ds.getDocumentsMatchingQuery(e, n, r).next((e2) => (
      // Merge with existing results
      (t.forEach((t2) => {
        e2 = e2.insert(t2.key, t2);
      }), e2)
    ));
  }
};
__name(___PRIVATE_QueryEngine, "__PRIVATE_QueryEngine");
var __PRIVATE_QueryEngine = ___PRIVATE_QueryEngine;
var Bt = "LocalStore";
var Lt = 3e8;
var ___PRIVATE_LocalStoreImpl = class ___PRIVATE_LocalStoreImpl {
  constructor(e, t, n, r) {
    this.persistence = e, this.Ds = t, this.serializer = r, /**
     * Maps a targetID to data about its target.
     *
     * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
     * of `applyRemoteEvent()` idempotent.
     */
    this.Cs = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
    // TODO(wuandy): Evaluate if TargetId can be part of Target.
    this.vs = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /**
     * A per collection group index of the last read time processed by
     * `getNewDocumentChanges()`.
     *
     * PORTING NOTE: This is only used for multi-tab synchronization.
     */
    this.Fs = /* @__PURE__ */ new Map(), this.Ms = e.getRemoteDocumentCache(), this.ci = e.getTargetCache(), this.hi = e.getBundleCache(), this.xs(n);
  }
  xs(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.Ms, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.Ms.setIndexManager(this.indexManager), this.Ds.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t) => e.collect(t, this.Cs));
  }
};
__name(___PRIVATE_LocalStoreImpl, "__PRIVATE_LocalStoreImpl");
var __PRIVATE_LocalStoreImpl = ___PRIVATE_LocalStoreImpl;
function __PRIVATE_newLocalStore(e, t, n, r) {
  return new __PRIVATE_LocalStoreImpl(e, t, n, r);
}
__name(__PRIVATE_newLocalStore, "__PRIVATE_newLocalStore");
async function __PRIVATE_localStoreHandleUserChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  return await n.persistence.runTransaction("Handle user change", "readonly", (e2) => {
    let r;
    return n.mutationQueue.getAllMutationBatches(e2).next((i) => (r = i, n.xs(t), n.mutationQueue.getAllMutationBatches(e2))).next((t2) => {
      const i = [], s = [];
      let o = __PRIVATE_documentKeySet();
      for (const e3 of r) {
        i.push(e3.batchId);
        for (const t3 of e3.mutations) o = o.add(t3.key);
      }
      for (const e3 of t2) {
        s.push(e3.batchId);
        for (const t3 of e3.mutations) o = o.add(t3.key);
      }
      return n.localDocuments.getDocuments(e2, o).next((e3) => ({
        Os: e3,
        removedBatchIds: i,
        addedBatchIds: s
      }));
    });
  });
}
__name(__PRIVATE_localStoreHandleUserChange, "__PRIVATE_localStoreHandleUserChange");
function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e2) => {
    const r = t.batch.keys(), i = n.Ms.newChangeBuffer({
      trackRemovals: true
    });
    return (/* @__PURE__ */ __name(function __PRIVATE_applyWriteToRemoteDocuments(e3, t2, n2, r2) {
      const i2 = n2.batch, s = i2.keys();
      let o = PersistencePromise.resolve();
      return s.forEach((e4) => {
        o = o.next(() => r2.getEntry(t2, e4)).next((t3) => {
          const s2 = n2.docVersions.get(e4);
          __PRIVATE_hardAssert(null !== s2, 48541), t3.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t3, n2), t3.isValidDocument() && // We use the commitVersion as the readTime rather than the
          // document's updateTime since the updateTime is not advanced
          // for updates that do not modify the underlying document.
          (t3.setReadTime(n2.commitVersion), r2.addEntry(t3)));
        });
      }), o.next(() => e3.mutationQueue.removeMutationBatch(t2, i2));
    }, "__PRIVATE_applyWriteToRemoteDocuments"))(n, e2, t, i).next(() => i.apply(e2)).next(() => n.mutationQueue.performConsistencyCheck(e2)).next(() => n.documentOverlayCache.removeOverlaysForBatchId(e2, r, t.batch.batchId)).next(() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, (/* @__PURE__ */ __name(function __PRIVATE_getKeysWithTransformResults(e3) {
      let t2 = __PRIVATE_documentKeySet();
      for (let n2 = 0; n2 < e3.mutationResults.length; ++n2) {
        e3.mutationResults[n2].transformResults.length > 0 && (t2 = t2.add(e3.batch.mutations[n2].key));
      }
      return t2;
    }, "__PRIVATE_getKeysWithTransformResults"))(t))).next(() => n.localDocuments.getDocuments(e2, r));
  });
}
__name(__PRIVATE_localStoreAcknowledgeBatch, "__PRIVATE_localStoreAcknowledgeBatch");
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
  const t = __PRIVATE_debugCast(e);
  return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e2) => t.ci.getLastRemoteSnapshotVersion(e2));
}
__name(__PRIVATE_localStoreGetLastRemoteSnapshotVersion, "__PRIVATE_localStoreGetLastRemoteSnapshotVersion");
function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.snapshotVersion;
  let i = n.Cs;
  return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e2) => {
    const s = n.Ms.newChangeBuffer({
      trackRemovals: true
    });
    i = n.Cs;
    const o = [];
    t.targetChanges.forEach((s2, _2) => {
      const a2 = i.get(_2);
      if (!a2) return;
      o.push(n.ci.removeMatchingKeys(e2, s2.removedDocuments, _2).next(() => n.ci.addMatchingKeys(e2, s2.addedDocuments, _2)));
      let u = a2.withSequenceNumber(e2.currentSequenceNumber);
      null !== t.targetMismatches.get(_2) ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s2.resumeToken, r)), i = i.insert(_2, u), // Update the target data if there are target changes (or if
      // sufficient time has passed since the last update).
      /**
      * Returns true if the newTargetData should be persisted during an update of
      * an active target. TargetData should always be persisted when a target is
      * being released and should not call this function.
      *
      * While the target is active, TargetData updates can be omitted when nothing
      * about the target has changed except metadata like the resume token or
      * snapshot version. Occasionally it's worth the extra write to prevent these
      * values from getting too stale after a crash, but this doesn't have to be
      * too frequent.
      */
      (/* @__PURE__ */ __name(function __PRIVATE_shouldPersistTargetData(e3, t2, n2) {
        if (0 === e3.resumeToken.approximateByteSize()) return true;
        const r2 = t2.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds();
        if (r2 >= Lt) return true;
        const i2 = n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size;
        return i2 > 0;
      }, "__PRIVATE_shouldPersistTargetData"))(a2, u, s2) && o.push(n.ci.updateTargetData(e2, u));
    });
    let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
    if (t.documentUpdates.forEach((r2) => {
      t.resolvedLimboDocuments.has(r2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e2, r2));
    }), // Each loop iteration only affects its "own" doc, so it's safe to get all
    // the remote documents in advance in a single call.
    o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t.documentUpdates).next((e3) => {
      _ = e3.Ns, a = e3.Bs;
    })), !r.isEqual(SnapshotVersion.min())) {
      const t2 = n.ci.getLastRemoteSnapshotVersion(e2).next((t3) => n.ci.setTargetsMetadata(e2, e2.currentSequenceNumber, r));
      o.push(t2);
    }
    return PersistencePromise.waitFor(o).next(() => s.apply(e2)).next(() => n.localDocuments.getLocalViewOfDocuments(e2, _, a)).next(() => _);
  }).then((e2) => (n.Cs = i, e2));
}
__name(__PRIVATE_localStoreApplyRemoteEventToLocalCache, "__PRIVATE_localStoreApplyRemoteEventToLocalCache");
function __PRIVATE_populateDocumentChangeBuffer(e, t, n) {
  let r = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
  return n.forEach((e2) => r = r.add(e2)), t.getEntries(e, r).next((e2) => {
    let r2 = __PRIVATE_mutableDocumentMap();
    return n.forEach((n2, s) => {
      const o = e2.get(n2);
      s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), // Note: The order of the steps below is important, since we want
      // to ensure that rejected limbo resolutions (which fabricate
      // NoDocuments with SnapshotVersion.min()) never add documents to
      // cache.
      s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (
        // NoDocuments with SnapshotVersion.min() are used in manufactured
        // events. We remove these documents from cache since we lost
        // access.
        (t.removeEntry(n2, s.readTime), r2 = r2.insert(n2, s))
      ) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t.addEntry(s), r2 = r2.insert(n2, s)) : __PRIVATE_logDebug(Bt, "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", s.version);
    }), {
      Ns: r2,
      Bs: i
    };
  });
}
__name(__PRIVATE_populateDocumentChangeBuffer, "__PRIVATE_populateDocumentChangeBuffer");
function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Get next mutation batch", "readonly", (e2) => (void 0 === t && (t = q), n.mutationQueue.getNextMutationBatchAfterBatchId(e2, t)));
}
__name(__PRIVATE_localStoreGetNextMutationBatch, "__PRIVATE_localStoreGetNextMutationBatch");
function __PRIVATE_localStoreAllocateTarget(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Allocate target", "readwrite", (e2) => {
    let r;
    return n.ci.getTargetData(e2, t).next((i) => i ? (
      // This target has been listened to previously, so reuse the
      // previous targetID.
      // TODO(mcg): freshen last accessed date?
      (r = i, PersistencePromise.resolve(r))
    ) : n.ci.allocateTargetId(e2).next((i2) => (r = new TargetData(t, i2, "TargetPurposeListen", e2.currentSequenceNumber), n.ci.addTargetData(e2, r).next(() => r))));
  }).then((e2) => {
    const r = n.Cs.get(e2.targetId);
    return (null === r || e2.snapshotVersion.compareTo(r.snapshotVersion) > 0) && (n.Cs = n.Cs.insert(e2.targetId, e2), n.vs.set(t, e2.targetId)), e2;
  });
}
__name(__PRIVATE_localStoreAllocateTarget, "__PRIVATE_localStoreAllocateTarget");
async function __PRIVATE_localStoreReleaseTarget(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.Cs.get(t), s = n ? "readwrite" : "readwrite-primary";
  try {
    n || await r.persistence.runTransaction("Release target", s, (e2) => r.persistence.referenceDelegate.removeTarget(e2, i));
  } catch (e2) {
    if (!__PRIVATE_isIndexedDbTransactionError(e2)) throw e2;
    __PRIVATE_logDebug(Bt, `Failed to update sequence numbers for target ${t}: ${e2}`);
  }
  r.Cs = r.Cs.remove(t), r.vs.delete(i.target);
}
__name(__PRIVATE_localStoreReleaseTarget, "__PRIVATE_localStoreReleaseTarget");
function __PRIVATE_localStoreExecuteQuery(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
  return r.persistence.runTransaction(
    "Execute query",
    "readwrite",
    // Use readwrite instead of readonly so indexes can be created
    // Use readwrite instead of readonly so indexes can be created
    (e2) => (/* @__PURE__ */ __name(function __PRIVATE_localStoreGetTargetData(e3, t2, n2) {
      const r2 = __PRIVATE_debugCast(e3), i2 = r2.vs.get(n2);
      return void 0 !== i2 ? PersistencePromise.resolve(r2.Cs.get(i2)) : r2.ci.getTargetData(t2, n2);
    }, "__PRIVATE_localStoreGetTargetData"))(r, e2, __PRIVATE_queryToTarget(t)).next((t2) => {
      if (t2) return i = t2.lastLimboFreeSnapshotVersion, r.ci.getMatchingKeysForTargetId(e2, t2.targetId).next((e3) => {
        s = e3;
      });
    }).next(() => r.Ds.getDocumentsMatchingQuery(e2, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet())).next((e3) => (__PRIVATE_setMaxReadTime(r, __PRIVATE_queryCollectionGroup(t), e3), {
      documents: e3,
      Ls: s
    }))
  );
}
__name(__PRIVATE_localStoreExecuteQuery, "__PRIVATE_localStoreExecuteQuery");
function __PRIVATE_setMaxReadTime(e, t, n) {
  let r = e.Fs.get(t) || SnapshotVersion.min();
  n.forEach((e2, t2) => {
    t2.readTime.compareTo(r) > 0 && (r = t2.readTime);
  }), e.Fs.set(t, r);
}
__name(__PRIVATE_setMaxReadTime, "__PRIVATE_setMaxReadTime");
var ___PRIVATE_LocalClientState = class ___PRIVATE_LocalClientState {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  Ws(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  Qs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  /**
   * Converts this entry into a JSON-encoded format we can use for WebStorage.
   * Does not encode `clientId` as it is part of the key in WebStorage.
   */
  $s() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
};
__name(___PRIVATE_LocalClientState, "__PRIVATE_LocalClientState");
var __PRIVATE_LocalClientState = ___PRIVATE_LocalClientState;
var ___PRIVATE_MemorySharedClientState = class ___PRIVATE_MemorySharedClientState {
  constructor() {
    this.Co = new __PRIVATE_LocalClientState(), this.vo = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, n) {
  }
  addLocalQueryTarget(e, t = true) {
    return t && this.Co.Ws(e), this.vo[e] || "not-current";
  }
  updateQueryState(e, t, n) {
    this.vo[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.Co.Qs(e);
  }
  isLocalQueryTarget(e) {
    return this.Co.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.vo[e];
  }
  getAllActiveQueryTargets() {
    return this.Co.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.Co.activeTargetIds.has(e);
  }
  start() {
    return this.Co = new __PRIVATE_LocalClientState(), Promise.resolve();
  }
  handleUserChange(e, t, n) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
};
__name(___PRIVATE_MemorySharedClientState, "__PRIVATE_MemorySharedClientState");
var __PRIVATE_MemorySharedClientState = ___PRIVATE_MemorySharedClientState;
var ___PRIVATE_NoopConnectivityMonitor = class ___PRIVATE_NoopConnectivityMonitor {
  Fo(e) {
  }
  shutdown() {
  }
};
__name(___PRIVATE_NoopConnectivityMonitor, "__PRIVATE_NoopConnectivityMonitor");
var __PRIVATE_NoopConnectivityMonitor = ___PRIVATE_NoopConnectivityMonitor;
var $t = "ConnectivityMonitor";
var ___PRIVATE_BrowserConnectivityMonitor = class ___PRIVATE_BrowserConnectivityMonitor {
  constructor() {
    this.Mo = () => this.xo(), this.Oo = () => this.No(), this.Bo = [], this.Lo();
  }
  Fo(e) {
    this.Bo.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.Mo), window.removeEventListener("offline", this.Oo);
  }
  Lo() {
    window.addEventListener("online", this.Mo), window.addEventListener("offline", this.Oo);
  }
  xo() {
    __PRIVATE_logDebug($t, "Network connectivity changed: AVAILABLE");
    for (const e of this.Bo) e(
      0
      /* NetworkStatus.AVAILABLE */
    );
  }
  No() {
    __PRIVATE_logDebug($t, "Network connectivity changed: UNAVAILABLE");
    for (const e of this.Bo) e(
      1
      /* NetworkStatus.UNAVAILABLE */
    );
  }
  // TODO(chenbrian): Consider passing in window either into this component or
  // here for testing via FakeWindow.
  /** Checks that all used attributes of window are available. */
  static v() {
    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
  }
};
__name(___PRIVATE_BrowserConnectivityMonitor, "__PRIVATE_BrowserConnectivityMonitor");
var __PRIVATE_BrowserConnectivityMonitor = ___PRIVATE_BrowserConnectivityMonitor;
var Wt = null;
function __PRIVATE_generateUniqueDebugId() {
  return null === Wt ? Wt = (/* @__PURE__ */ __name(function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }, "__PRIVATE_generateInitialUniqueDebugId"))() : Wt++, "0x" + Wt.toString(16);
}
__name(__PRIVATE_generateUniqueDebugId, "__PRIVATE_generateUniqueDebugId");
var Qt = "RestConnection";
var Gt = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery",
  ExecutePipeline: "executePipeline"
};
var ___PRIVATE_RestConnection = class ___PRIVATE_RestConnection {
  get ko() {
    return false;
  }
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r = encodeURIComponent(this.databaseId.database);
    this.qo = t + "://" + e.host, this.Ko = `projects/${n}/databases/${r}`, this.Uo = this.databaseId.database === it ? `project_id=${n}` : `project_id=${n}&database_id=${r}`;
  }
  $o(e, t, n, r, i) {
    const s = __PRIVATE_generateUniqueDebugId(), o = this.Wo(e, t.toUriEncodedString());
    __PRIVATE_logDebug(Qt, `Sending RPC '${e}' ${s}:`, o, n);
    const _ = {
      "google-cloud-resource-prefix": this.Ko,
      "x-goog-request-params": this.Uo
    };
    this.Qo(_, r, i);
    const { host: a } = new URL(o), c = isCloudWorkstation(a);
    return this.Go(e, o, _, n, c).then((t2) => (__PRIVATE_logDebug(Qt, `Received RPC '${e}' ${s}: `, t2), t2), (t2) => {
      throw __PRIVATE_logWarn(Qt, `RPC '${e}' ${s} failed with error: `, t2, "url: ", o, "request:", n), t2;
    });
  }
  zo(e, t, n, r, i, s) {
    return this.$o(e, t, n, r, i);
  }
  /**
   * Modifies the headers for a request, adding any authorization token if
   * present and any additional headers for the request.
   */
  Qo(e, t, n) {
    e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
    // so we need to get its value when we need it in a function.
    (/* @__PURE__ */ __name(function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + b;
    }, "__PRIVATE_getGoogApiClientValue"))(), // Content-Type: text/plain will avoid preflight requests which might
    // mess with CORS and redirects by proxies. If we add custom headers
    // we will need to change this code to potentially use the $httpOverwrite
    // parameter supported by ESF to avoid triggering preflight requests.
    e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((t2, n2) => e[n2] = t2), n && n.headers.forEach((t2, n2) => e[n2] = t2);
  }
  Wo(e, t) {
    const n = Gt[e];
    let r = `${this.qo}/v1/${t}:${n}`;
    return this.databaseInfo.apiKey && (r = `${r}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), r;
  }
  /**
   * Closes and cleans up any resources associated with the connection. This
   * implementation is a no-op because there are no resources associated
   * with the RestConnection that need to be cleaned up.
   */
  terminate() {
  }
};
__name(___PRIVATE_RestConnection, "__PRIVATE_RestConnection");
var __PRIVATE_RestConnection = ___PRIVATE_RestConnection;
var ___PRIVATE_StreamBridge = class ___PRIVATE_StreamBridge {
  constructor(e) {
    this.jo = e.jo, this.Jo = e.Jo;
  }
  Ho(e) {
    this.Zo = e;
  }
  Xo(e) {
    this.Yo = e;
  }
  e_(e) {
    this.t_ = e;
  }
  onMessage(e) {
    this.n_ = e;
  }
  close() {
    this.Jo();
  }
  send(e) {
    this.jo(e);
  }
  r_() {
    this.Zo();
  }
  i_() {
    this.Yo();
  }
  s_(e) {
    this.t_(e);
  }
  o_(e) {
    this.n_(e);
  }
};
__name(___PRIVATE_StreamBridge, "__PRIVATE_StreamBridge");
var __PRIVATE_StreamBridge = ___PRIVATE_StreamBridge;
var zt = "WebChannelConnection";
var __PRIVATE_unguardedEventListen = /* @__PURE__ */ __name((e, t, n) => {
  e.listen(t, (e2) => {
    try {
      n(e2);
    } catch (e3) {
      setTimeout(() => {
        throw e3;
      }, 0);
    }
  });
}, "__PRIVATE_unguardedEventListen");
var ___PRIVATE_WebChannelConnection = class ___PRIVATE_WebChannelConnection extends __PRIVATE_RestConnection {
  constructor(e) {
    super(e), /** A collection of open WebChannel instances */
    this.__ = [], this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  /**
   * Initialize STAT_EVENT listener once. Subsequent calls are a no-op.
   * getStatEventTarget() returns the same target every time.
   */
  static a_() {
    if (!___PRIVATE_WebChannelConnection.u_) {
      const e = getStatEventTarget();
      __PRIVATE_unguardedEventListen(e, Event.STAT_EVENT, (e2) => {
        e2.stat === Stat.PROXY ? __PRIVATE_logDebug(zt, "STAT_EVENT: detected buffering proxy") : e2.stat === Stat.NOPROXY && __PRIVATE_logDebug(zt, "STAT_EVENT: detected no buffering proxy");
      }), ___PRIVATE_WebChannelConnection.u_ = true;
    }
  }
  Go(e, t, n, r, i) {
    const s = __PRIVATE_generateUniqueDebugId();
    return new Promise((i2, o) => {
      const _ = new XhrIo();
      _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (_.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t2 = _.getResponseJson();
              __PRIVATE_logDebug(zt, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(t2)), i2(t2);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(zt, `RPC '${e}' ${s} timed out`), o(new FirestoreError(D.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = _.getStatus();
              if (__PRIVATE_logDebug(zt, `RPC '${e}' ${s} failed with status:`, n2, "response text:", _.getResponseText()), n2 > 0) {
                let e2 = _.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t3 = e2?.error;
                if (t3 && t3.status && t3.message) {
                  const e3 = (/* @__PURE__ */ __name(function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t4 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(D).indexOf(t4) >= 0 ? t4 : D.UNKNOWN;
                  }, "__PRIVATE_mapCodeFromHttpResponseErrorStatus"))(t3.status);
                  o(new FirestoreError(e3, t3.message));
                } else o(new FirestoreError(D.UNKNOWN, "Server responded with status " + _.getStatus()));
              } else
                o(new FirestoreError(D.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail(9055, {
                c_: e,
                streamId: s,
                l_: _.getLastErrorCode(),
                h_: _.getLastError()
              });
          }
        } finally {
          __PRIVATE_logDebug(zt, `RPC '${e}' ${s} completed.`);
        }
      });
      const a = JSON.stringify(r);
      __PRIVATE_logDebug(zt, `RPC '${e}' ${s} sending request:`, r), _.send(t, "POST", a, n, 15);
    });
  }
  P_(e, t, n) {
    const r = __PRIVATE_generateUniqueDebugId(), i = [this.qo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = this.createWebChannelTransport(), o = {
      // Required for backend stickiness, routing behavior is based on this
      // parameter.
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        // This param is used to improve routing and project isolation by the
        // backend and must be included in every request.
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        // Override the default timeout (randomized between 10-20 seconds) since
        // a large write batch on a slow internet connection may take a long
        // time to send to the backend. Rather than have WebChannel impose a
        // tight timeout which could lead to infinite timeouts and retries, we
        // set it very large (5-10 minutes) and rely on the browser's builtin
        // timeouts to kick in if the request isn't working.
        forwardChannelRequestTimeoutMs: 6e5
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, _ = this.longPollingOptions.timeoutSeconds;
    void 0 !== _ && (o.longPollingTimeout = Math.round(1e3 * _)), this.useFetchStreams && (o.useFetchStreams = true), this.Qo(o.initMessageHeaders, t, n), // Sending the custom headers we just added to request.initMessageHeaders
    // (Authorization, etc.) will trigger the browser to make a CORS preflight
    // request because the XHR will no longer meet the criteria for a "simple"
    // CORS request:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
    // Therefore to avoid the CORS preflight request (an extra network
    // roundtrip), we use the encodeInitMessageHeaders option to specify that
    // the headers should instead be encoded in the request's POST payload,
    // which is recognized by the webchannel backend.
    o.encodeInitMessageHeaders = true;
    const a = i.join("");
    __PRIVATE_logDebug(zt, `Creating RPC '${e}' stream ${r}: ${a}`, o);
    const u = s.createWebChannel(a, o);
    this.T_(u);
    let c = false, l = false;
    const h = new __PRIVATE_StreamBridge({
      jo: /* @__PURE__ */ __name((t2) => {
        l ? __PRIVATE_logDebug(zt, `Not sending because RPC '${e}' stream ${r} is closed:`, t2) : (c || (__PRIVATE_logDebug(zt, `Opening RPC '${e}' stream ${r} transport.`), u.open(), c = true), __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r} sending:`, t2), u.send(t2));
      }, "jo"),
      Jo: /* @__PURE__ */ __name(() => u.close(), "Jo")
    });
    return __PRIVATE_unguardedEventListen(u, WebChannel.EventType.OPEN, () => {
      l || (__PRIVATE_logDebug(zt, `RPC '${e}' stream ${r} transport opened.`), h.r_());
    }), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.CLOSE, () => {
      l || (l = true, __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r} transport closed`), h.s_(), this.I_(u));
    }), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.ERROR, (t2) => {
      l || (l = true, __PRIVATE_logWarn(zt, `RPC '${e}' stream ${r} transport errored. Name:`, t2.name, "Message:", t2.message), h.s_(new FirestoreError(D.UNAVAILABLE, "The operation could not be completed")));
    }), __PRIVATE_unguardedEventListen(u, WebChannel.EventType.MESSAGE, (t2) => {
      if (!l) {
        const n2 = t2.data[0];
        __PRIVATE_hardAssert(!!n2, 16349);
        const i2 = n2, s2 = i2?.error || i2[0]?.error;
        if (s2) {
          __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r} received error:`, s2);
          const t3 = s2.status;
          let n3 = (
            /**
            * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
            *
            * @returns The Code equivalent to the given status string or undefined if
            *     there is no match.
            */
            (/* @__PURE__ */ __name(function __PRIVATE_mapCodeFromRpcStatus(e2) {
              const t4 = Rt[e2];
              if (void 0 !== t4) return __PRIVATE_mapCodeFromRpcCode(t4);
            }, "__PRIVATE_mapCodeFromRpcStatus"))(t3)
          ), i3 = s2.message;
          "NOT_FOUND" === t3 && i3.includes("database") && i3.includes("does not exist") && i3.includes(this.databaseId.database) && __PRIVATE_logWarn(`Database '${this.databaseId.database}' not found. Please check your project configuration.`), void 0 === n3 && (n3 = D.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + s2.message), // Mark closed so no further events are propagated
          l = true, h.s_(new FirestoreError(n3, i3)), u.close();
        } else __PRIVATE_logDebug(zt, `RPC '${e}' stream ${r} received:`, n2), h.o_(n2);
      }
    }), // Ensure that event listeners are configured for STAT_EVENTs.
    ___PRIVATE_WebChannelConnection.a_(), setTimeout(() => {
      h.i_();
    }, 0), h;
  }
  /**
   * Closes and cleans up any resources associated with the connection.
   */
  terminate() {
    this.__.forEach((e) => e.close()), this.__ = [];
  }
  /**
   * Add a WebChannel instance to the collection of open instances.
   * @param webChannel
   */
  T_(e) {
    this.__.push(e);
  }
  /**
   * Remove a WebChannel instance from the collection of open instances.
   * @param webChannel
   */
  I_(e) {
    this.__ = this.__.filter((t) => t === e);
  }
  /**
   * Modifies the headers for a request, adding the api key if present,
   * and then calling super.modifyHeadersForRequest
   */
  Qo(e, t, n) {
    super.Qo(e, t, n), // For web channel streams, we want to send the api key in the headers.
    this.databaseInfo.apiKey && (e["x-goog-api-key"] = this.databaseInfo.apiKey);
  }
  /**
   * Wrapped for mocking.
   * @protected
   */
  createWebChannelTransport() {
    return createWebChannelTransport();
  }
};
__name(___PRIVATE_WebChannelConnection, "__PRIVATE_WebChannelConnection");
var __PRIVATE_WebChannelConnection = ___PRIVATE_WebChannelConnection;
function __PRIVATE_newConnection(e) {
  return new __PRIVATE_WebChannelConnection(e);
}
__name(__PRIVATE_newConnection, "__PRIVATE_newConnection");
function getDocument() {
  return "undefined" != typeof document ? document : null;
}
__name(getDocument, "getDocument");
function __PRIVATE_newSerializer(e) {
  return new JsonProtoSerializer(
    e,
    /* useProto3Json= */
    true
  );
}
__name(__PRIVATE_newSerializer, "__PRIVATE_newSerializer");
__PRIVATE_WebChannelConnection.u_ = false;
var ___PRIVATE_ExponentialBackoff = class ___PRIVATE_ExponentialBackoff {
  constructor(e, t, n = 1e3, r = 1.5, i = 6e4) {
    this.Di = e, this.timerId = t, this.E_ = n, this.R_ = r, this.A_ = i, this.V_ = 0, this.d_ = null, /** The last backoff attempt, as epoch milliseconds. */
    this.m_ = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */
  reset() {
    this.V_ = 0;
  }
  /**
   * Resets the backoff delay to the maximum delay (e.g. for use after a
   * RESOURCE_EXHAUSTED error).
   */
  f_() {
    this.V_ = this.A_;
  }
  /**
   * Returns a promise that resolves after currentDelayMs, and increases the
   * delay for any subsequent attempts. If there was a pending backoff operation
   * already, it will be canceled.
   */
  g_(e) {
    this.cancel();
    const t = Math.floor(this.V_ + this.p_()), n = Math.max(0, Date.now() - this.m_), r = Math.max(0, t - n);
    r > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.d_ = this.Di.enqueueAfterDelay(this.timerId, r, () => (this.m_ = Date.now(), e())), // Apply backoff factor to determine next delay and ensure it is within
    // bounds.
    this.V_ *= this.R_, this.V_ < this.E_ && (this.V_ = this.E_), this.V_ > this.A_ && (this.V_ = this.A_);
  }
  y_() {
    null !== this.d_ && (this.d_.skipDelay(), this.d_ = null);
  }
  cancel() {
    null !== this.d_ && (this.d_.cancel(), this.d_ = null);
  }
  /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
  p_() {
    return (Math.random() - 0.5) * this.V_;
  }
};
__name(___PRIVATE_ExponentialBackoff, "__PRIVATE_ExponentialBackoff");
var __PRIVATE_ExponentialBackoff = ___PRIVATE_ExponentialBackoff;
var jt = "PersistentStream";
var ___PRIVATE_PersistentStream = class ___PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s, o, _) {
    this.Di = e, this.w_ = n, this.S_ = r, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, /**
     * A close count that's incremented every time the stream is closed; used by
     * getCloseGuardedDispatcher() to invalidate callbacks that happen after
     * close.
     */
    this.b_ = 0, this.D_ = null, this.C_ = null, this.stream = null, /**
     * Count of response messages received.
     */
    this.v_ = 0, this.F_ = new __PRIVATE_ExponentialBackoff(e, t);
  }
  /**
   * Returns true if start() has been called and no error has occurred. True
   * indicates the stream is open or in the process of opening (which
   * encompasses respecting backoff, getting auth tokens, and starting the
   * actual RPC). Use isOpen() to determine if the stream is open and ready for
   * outbound requests.
   */
  M_() {
    return 1 === this.state || 5 === this.state || this.x_();
  }
  /**
   * Returns true if the underlying RPC is open (the onOpen() listener has been
   * called) and the stream is ready for outbound requests.
   */
  x_() {
    return 2 === this.state || 3 === this.state;
  }
  /**
   * Starts the RPC. Only allowed if isStarted() returns false. The stream is
   * not immediately ready for use: onOpen() will be invoked when the RPC is
   * ready for outbound requests, at which point isOpen() will return true.
   *
   * When start returns, isStarted() will return true.
   */
  start() {
    this.v_ = 0, 4 !== this.state ? this.auth() : this.O_();
  }
  /**
   * Stops the RPC. This call is idempotent and allowed regardless of the
   * current isStarted() state.
   *
   * When stop returns, isStarted() and isOpen() will both return false.
   */
  async stop() {
    this.M_() && await this.close(
      0
      /* PersistentStreamState.Initial */
    );
  }
  /**
   * After an error the stream will usually back off on the next attempt to
   * start it. If the error warrants an immediate restart of the stream, the
   * sender can use this to indicate that the receiver should not back off.
   *
   * Each error will call the onClose() listener. That function can decide to
   * inhibit backoff if required.
   */
  N_() {
    this.state = 0, this.F_.reset();
  }
  /**
   * Marks this stream as idle. If no further actions are performed on the
   * stream for one minute, the stream will automatically close itself and
   * notify the stream's onClose() handler with Status.OK. The stream will then
   * be in a !isStarted() state, requiring the caller to start the stream again
   * before further use.
   *
   * Only streams that are in state 'Open' can be marked idle, as all other
   * states imply pending network operations.
   */
  B_() {
    this.x_() && null === this.D_ && (this.D_ = this.Di.enqueueAfterDelay(this.w_, 6e4, () => this.L_()));
  }
  /** Sends a message to the underlying stream. */
  k_(e) {
    this.q_(), this.stream.send(e);
  }
  /** Called by the idle timer when the stream should close due to inactivity. */
  async L_() {
    if (this.x_())
      return this.close(
        0
        /* PersistentStreamState.Initial */
      );
  }
  /** Marks the stream as active again. */
  q_() {
    this.D_ && (this.D_.cancel(), this.D_ = null);
  }
  /** Cancels the health check delayed operation. */
  K_() {
    this.C_ && (this.C_.cancel(), this.C_ = null);
  }
  /**
   * Closes the stream and cleans up as necessary:
   *
   * * closes the underlying GRPC stream;
   * * calls the onClose handler with the given 'error';
   * * sets internal stream state to 'finalState';
   * * adjusts the backoff timer based on the error
   *
   * A new stream can be opened by calling start().
   *
   * @param finalState - the intended state of the stream after closing.
   * @param error - the error the connection was closed with.
   */
  async close(e, t) {
    this.q_(), this.K_(), this.F_.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
    // underlying stream), guaranteeing they won't execute.
    this.b_++, 4 !== e ? (
      // If this is an intentional close ensure we don't delay our next connection attempt.
      this.F_.reset()
    ) : t && t.code === D.RESOURCE_EXHAUSTED ? (
      // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
      (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.F_.f_())
    ) : t && t.code === D.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
    // happen since both Auth and AppCheck ensure a sufficient TTL when we
    // request a token. If a user manually resets their system clock this can
    // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
    // before we received the first message and we need to invalidate the token
    // to ensure that we fetch a new token.
    (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
    null !== this.stream && (this.U_(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
    // inhibit backoff or otherwise manipulate the state in its non-started state.
    this.state = e, // Notify the listener that the stream closed.
    await this.listener.e_(t);
  }
  /**
   * Can be overridden to perform additional cleanup before the stream is closed.
   * Calling super.tearDown() is not required.
   */
  U_() {
  }
  auth() {
    this.state = 1;
    const e = this.W_(this.b_), t = this.b_;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e2, n]) => {
      this.b_ === t && // Normally we'd have to schedule the callback on the AsyncQueue.
      // However, the following calls are safe to be called outside the
      // AsyncQueue since they don't chain asynchronous calls
      this.Q_(e2, n);
    }, (t2) => {
      e(() => {
        const e2 = new FirestoreError(D.UNKNOWN, "Fetching auth token failed: " + t2.message);
        return this.G_(e2);
      });
    });
  }
  Q_(e, t) {
    const n = this.W_(this.b_);
    this.stream = this.z_(e, t), this.stream.Ho(() => {
      n(() => this.listener.Ho());
    }), this.stream.Xo(() => {
      n(() => (this.state = 2, this.C_ = this.Di.enqueueAfterDelay(this.S_, 1e4, () => (this.x_() && (this.state = 3), Promise.resolve())), this.listener.Xo()));
    }), this.stream.e_((e2) => {
      n(() => this.G_(e2));
    }), this.stream.onMessage((e2) => {
      n(() => 1 == ++this.v_ ? this.j_(e2) : this.onNext(e2));
    });
  }
  O_() {
    this.state = 5, this.F_.g_(async () => {
      this.state = 0, this.start();
    });
  }
  // Visible for tests
  G_(e) {
    return __PRIVATE_logDebug(jt, `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  /**
   * Returns a "dispatcher" function that dispatches operations onto the
   * AsyncQueue but only runs them if closeCount remains unchanged. This allows
   * us to turn auth / stream callbacks into no-ops if the stream is closed /
   * re-opened, etc.
   */
  W_(e) {
    return (t) => {
      this.Di.enqueueAndForget(() => this.b_ === e ? t() : (__PRIVATE_logDebug(jt, "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
};
__name(___PRIVATE_PersistentStream, "__PRIVATE_PersistentStream");
var __PRIVATE_PersistentStream = ___PRIVATE_PersistentStream;
var ___PRIVATE_PersistentListenStream = class ___PRIVATE_PersistentListenStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
  }
  z_(e, t) {
    return this.connection.P_("Listen", e, t);
  }
  j_(e) {
    return this.onNext(e);
  }
  onNext(e) {
    this.F_.reset();
    const t = __PRIVATE_fromWatchChange(this.serializer, e), n = (/* @__PURE__ */ __name(function __PRIVATE_versionFromListenResponse(e2) {
      if (!("targetChange" in e2)) return SnapshotVersion.min();
      const t2 = e2.targetChange;
      return t2.targetIds && t2.targetIds.length ? SnapshotVersion.min() : t2.readTime ? __PRIVATE_fromVersion(t2.readTime) : SnapshotVersion.min();
    }, "__PRIVATE_versionFromListenResponse"))(e);
    return this.listener.J_(t, n);
  }
  /**
   * Registers interest in the results of the given target. If the target
   * includes a resumeToken it will be included in the request. Results that
   * affect the target will be streamed back as WatchChange messages that
   * reference the targetId.
   */
  H_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = (/* @__PURE__ */ __name(function __PRIVATE_toTarget(e2, t2) {
      let n2;
      const r = t2.target;
      if (n2 = __PRIVATE_targetIsDocumentTarget(r) ? {
        documents: __PRIVATE_toDocumentsTarget(e2, r)
      } : {
        query: __PRIVATE_toQueryTarget(e2, r).dt
      }, n2.targetId = t2.targetId, t2.resumeToken.approximateByteSize() > 0) {
        n2.resumeToken = __PRIVATE_toBytes(e2, t2.resumeToken);
        const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        null !== r2 && (n2.expectedCount = r2);
      } else if (t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        n2.readTime = toTimestamp(e2, t2.snapshotVersion.toTimestamp());
        const r2 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        null !== r2 && (n2.expectedCount = r2);
      }
      return n2;
    }, "__PRIVATE_toTarget"))(this.serializer, e);
    const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
    n && (t.labels = n), this.k_(t);
  }
  /**
   * Unregisters interest in the results of the target associated with the
   * given targetId.
   */
  Z_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.k_(t);
  }
};
__name(___PRIVATE_PersistentListenStream, "__PRIVATE_PersistentListenStream");
var __PRIVATE_PersistentListenStream = ___PRIVATE_PersistentListenStream;
var ___PRIVATE_PersistentWriteStream = class ___PRIVATE_PersistentWriteStream extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r, i, s) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r, s), this.serializer = i;
  }
  /**
   * Tracks whether or not a handshake has been successfully exchanged and
   * the stream is ready to accept mutations.
   */
  get X_() {
    return this.v_ > 0;
  }
  // Override of PersistentStream.start
  start() {
    this.lastStreamToken = void 0, super.start();
  }
  U_() {
    this.X_ && this.Y_([]);
  }
  z_(e, t) {
    return this.connection.P_("Write", e, t);
  }
  j_(e) {
    return __PRIVATE_hardAssert(!!e.streamToken, 31322), this.lastStreamToken = e.streamToken, // The first response is always the handshake response
    __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length, 55816), this.listener.ea();
  }
  onNext(e) {
    __PRIVATE_hardAssert(!!e.streamToken, 12678), this.lastStreamToken = e.streamToken, // A successful first write response means the stream is healthy,
    // Note, that we could consider a successful handshake healthy, however,
    // the write itself might be causing an error we want to back off from.
    this.F_.reset();
    const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
    return this.listener.ta(n, t);
  }
  /**
   * Sends an initial streamToken to the server, performing the handshake
   * required to make the StreamingWrite RPC work. Subsequent
   * calls should wait until onHandshakeComplete was called.
   */
  na() {
    const e = {};
    e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.k_(e);
  }
  /** Sends a group of mutations to the Firestore backend to apply. */
  Y_(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map((e2) => toMutation(this.serializer, e2))
    };
    this.k_(t);
  }
};
__name(___PRIVATE_PersistentWriteStream, "__PRIVATE_PersistentWriteStream");
var __PRIVATE_PersistentWriteStream = ___PRIVATE_PersistentWriteStream;
var _Datastore = class _Datastore {
};
__name(_Datastore, "Datastore");
var Datastore = _Datastore;
var ___PRIVATE_DatastoreImpl = class ___PRIVATE_DatastoreImpl extends Datastore {
  constructor(e, t, n, r) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r, this.ra = false;
  }
  ia() {
    if (this.ra) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  /** Invokes the provided RPC with auth and AppCheck tokens. */
  $o(e, t, n, r) {
    return this.ia(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, s]) => this.connection.$o(e, __PRIVATE_toResourcePath(t, n), r, i, s)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D.UNKNOWN, e2.toString());
    });
  }
  /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
  zo(e, t, n, r, i) {
    return this.ia(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, o]) => this.connection.zo(e, __PRIVATE_toResourcePath(t, n), r, s, o, i)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D.UNKNOWN, e2.toString());
    });
  }
  terminate() {
    this.ra = true, this.connection.terminate();
  }
};
__name(___PRIVATE_DatastoreImpl, "__PRIVATE_DatastoreImpl");
var __PRIVATE_DatastoreImpl = ___PRIVATE_DatastoreImpl;
function __PRIVATE_newDatastore(e, t, n, r) {
  return new __PRIVATE_DatastoreImpl(e, t, n, r);
}
__name(__PRIVATE_newDatastore, "__PRIVATE_newDatastore");
var ___PRIVATE_OnlineStateTracker = class ___PRIVATE_OnlineStateTracker {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, /** The current OnlineState. */
    this.state = "Unknown", /**
     * A count of consecutive failures to open the stream. If it reaches the
     * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
     * Offline.
     */
    this.sa = 0, /**
     * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
     * transition from OnlineState.Unknown to OnlineState.Offline without waiting
     * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
     */
    this.oa = null, /**
     * Whether the client should log a warning message if it fails to connect to
     * the backend (initially true, cleared after a successful stream, or if we've
     * logged the message already).
     */
    this._a = true;
  }
  /**
   * Called by RemoteStore when a watch stream is started (including on each
   * backoff attempt).
   *
   * If this is the first attempt, it sets the OnlineState to Unknown and starts
   * the onlineStateTimer.
   */
  aa() {
    0 === this.sa && (this.ua(
      "Unknown"
      /* OnlineState.Unknown */
    ), this.oa = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.oa = null, this.ca("Backend didn't respond within 10 seconds."), this.ua(
      "Offline"
      /* OnlineState.Offline */
    ), Promise.resolve())));
  }
  /**
   * Updates our OnlineState as appropriate after the watch stream reports a
   * failure. The first failure moves us to the 'Unknown' state. We then may
   * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
   * actually transition to the 'Offline' state.
   */
  la(e) {
    "Online" === this.state ? this.ua(
      "Unknown"
      /* OnlineState.Unknown */
    ) : (this.sa++, this.sa >= 1 && (this.ha(), this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.ua(
      "Offline"
      /* OnlineState.Offline */
    )));
  }
  /**
   * Explicitly sets the OnlineState to the specified state.
   *
   * Note that this resets our timers / failure counters, etc. used by our
   * Offline heuristics, so must not be used in place of
   * handleWatchStreamStart() and handleWatchStreamFailure().
   */
  set(e) {
    this.ha(), this.sa = 0, "Online" === e && // We've connected to watch at least once. Don't warn the developer
    // about being offline going forward.
    (this._a = false), this.ua(e);
  }
  ua(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  ca(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this._a ? (__PRIVATE_logError(t), this._a = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
  }
  ha() {
    null !== this.oa && (this.oa.cancel(), this.oa = null);
  }
};
__name(___PRIVATE_OnlineStateTracker, "__PRIVATE_OnlineStateTracker");
var __PRIVATE_OnlineStateTracker = ___PRIVATE_OnlineStateTracker;
var Ht = "RemoteStore";
var ___PRIVATE_RemoteStoreImpl = class ___PRIVATE_RemoteStoreImpl {
  constructor(e, t, n, r, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, /**
     * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
     * LocalStore via fillWritePipeline() and have or will send to the write
     * stream.
     *
     * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
     * restart the write stream. When the stream is established the writes in the
     * pipeline will be sent in order.
     *
     * Writes remain in writePipeline until they are acknowledged by the backend
     * and thus will automatically be re-sent if the stream is interrupted /
     * restarted before they're acknowledged.
     *
     * Write responses from the backend are linked to their originating request
     * purely based on order, and so we can just shift() writes from the front of
     * the writePipeline as we receive responses.
     */
    this.Pa = [], /**
     * A mapping of watched targets that the client cares about tracking and the
     * user has explicitly called a 'listen' for this target.
     *
     * These targets may or may not have been sent to or acknowledged by the
     * server. On re-establishing the listen stream, these targets should be sent
     * to the server. The targets removed with unlistens are removed eagerly
     * without waiting for confirmation from the listen stream.
     */
    this.Ta = /* @__PURE__ */ new Map(), this.Ia = /* @__PURE__ */ new Map(), this.Ea = /* @__PURE__ */ new Map(), this.Ra = new __PRIVATE_TargetIdGenerator(1e3), this.Aa = new __PRIVATE_TargetIdGenerator(1001), /**
     * A set of reasons for why the RemoteStore may be offline. If empty, the
     * RemoteStore may start its network connections.
     */
    this.Va = /* @__PURE__ */ new Set(), /**
     * Event handlers that get called when the network is disabled or enabled.
     *
     * PORTING NOTE: These functions are used on the Web client to create the
     * underlying streams (to support tree-shakeable streams). On Android and iOS,
     * the streams are created during construction of RemoteStore.
     */
    this.da = [], this.ma = i, this.ma.Fo((e2) => {
      n.enqueueAndForget(async () => {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug(Ht, "Restarting streams for network reachability change."), await (/* @__PURE__ */ __name(async function __PRIVATE_restartNetwork(e3) {
          const t2 = __PRIVATE_debugCast(e3);
          t2.Va.add(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_disableNetworkInternal(t2), t2.fa.set(
            "Unknown"
            /* OnlineState.Unknown */
          ), t2.Va.delete(
            4
            /* OfflineCause.ConnectivityChange */
          ), await __PRIVATE_enableNetworkInternal(t2);
        }, "__PRIVATE_restartNetwork"))(this));
      });
    }), this.fa = new __PRIVATE_OnlineStateTracker(n, r);
  }
};
__name(___PRIVATE_RemoteStoreImpl, "__PRIVATE_RemoteStoreImpl");
var __PRIVATE_RemoteStoreImpl = ___PRIVATE_RemoteStoreImpl;
async function __PRIVATE_enableNetworkInternal(e) {
  if (__PRIVATE_canUseNetwork(e)) for (const t of e.da) await t(
    /* enabled= */
    true
  );
}
__name(__PRIVATE_enableNetworkInternal, "__PRIVATE_enableNetworkInternal");
async function __PRIVATE_disableNetworkInternal(e) {
  for (const t of e.da) await t(
    /* enabled= */
    false
  );
}
__name(__PRIVATE_disableNetworkInternal, "__PRIVATE_disableNetworkInternal");
function __PRIVATE_getRemoteTargetId(e, t) {
  return e.Ia.get(t) || void 0;
}
__name(__PRIVATE_getRemoteTargetId, "__PRIVATE_getRemoteTargetId");
function __PRIVATE_remoteStoreListen(e, t) {
  const n = __PRIVATE_debugCast(e), r = __PRIVATE_getRemoteTargetId(n, t.targetId);
  if (void 0 !== r && n.Ta.has(r)) return;
  const i = (
    /**
    * Generate a new remote target ID for the given SDK target ID.
    * Re-map the given SDK to the new remote ID.
    * Delete any mapping of the old remote ID, if given.
    * @param remoteStoreImpl
    * @param sdkTargetId
    * @return The new remote ID.
    */
    (/* @__PURE__ */ __name(function __PRIVATE_allocateRemoteTargetId(e2, t2) {
      const n2 = __PRIVATE_getRemoteTargetId(e2, t2);
      void 0 !== n2 && // If there was an existing remote target ID mapped to that SDK target ID, forget about the old remote ID.
      e2.Ea.delete(n2);
      const r2 = (/* @__PURE__ */ __name(function __PRIVATE_generateRemoteTargetId(e3, t3) {
        return t3 % 2 != 0 ? e3.Aa.next() : e3.Ra.next();
      }, "__PRIVATE_generateRemoteTargetId"))(e2, t2);
      return e2.Ia.set(t2, r2), e2.Ea.set(r2, t2), r2;
    }, "__PRIVATE_allocateRemoteTargetId"))(n, t.targetId)
  );
  __PRIVATE_logDebug(Ht, "remoteStoreListen mapping SDK target ID to remote", t.targetId, i);
  const s = new TargetData(t.target, i, t.purpose, t.sequenceNumber, t.snapshotVersion, t.lastLimboFreeSnapshotVersion, t.resumeToken);
  n.Ta.set(i, s), __PRIVATE_shouldStartWatchStream(n) ? (
    // The listen will be sent in onWatchStreamOpen
    __PRIVATE_startWatchStream(n)
  ) : __PRIVATE_ensureWatchStream(n).x_() && __PRIVATE_sendWatchRequest(n, s);
}
__name(__PRIVATE_remoteStoreListen, "__PRIVATE_remoteStoreListen");
function __PRIVATE_remoteStoreUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r = __PRIVATE_ensureWatchStream(n), i = __PRIVATE_getRemoteTargetId(n, t);
  __PRIVATE_logDebug(Ht, "remoteStoreUnlisten removing mapping of SDK target ID to remote", t, i), n.Ta.delete(i), n.Ia.delete(t), n.Ea.delete(i), r.x_() && __PRIVATE_sendUnwatchRequest(n, i), 0 === n.Ta.size && (r.x_() ? r.B_() : __PRIVATE_canUseNetwork(n) && // Revert to OnlineState.Unknown if the watch stream is not open and we
  // have no listeners, since without any listens to send we cannot
  // confirm if the stream is healthy and upgrade to OnlineState.Online.
  n.fa.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
__name(__PRIVATE_remoteStoreUnlisten, "__PRIVATE_remoteStoreUnlisten");
function __PRIVATE_sendWatchRequest(e, t) {
  if (e.ga.$e(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
    const n = e.Ea.get(t.targetId);
    if (void 0 === n)
      return void __PRIVATE_logDebug(Ht, "SDK target ID not found for remote ID: " + t.targetId);
    const r = e.remoteSyncer.getRemoteKeysForTarget(n).size;
    t = t.withExpectedCount(r);
  }
  __PRIVATE_ensureWatchStream(e).H_(t);
}
__name(__PRIVATE_sendWatchRequest, "__PRIVATE_sendWatchRequest");
function __PRIVATE_sendUnwatchRequest(e, t) {
  e.ga.$e(t), __PRIVATE_ensureWatchStream(e).Z_(t);
}
__name(__PRIVATE_sendUnwatchRequest, "__PRIVATE_sendUnwatchRequest");
function __PRIVATE_startWatchStream(e) {
  e.ga = new __PRIVATE_WatchChangeAggregator({
    getRemoteKeysForTarget: /* @__PURE__ */ __name((t) => {
      const n = e.Ea.get(t);
      return void 0 !== n ? e.remoteSyncer.getRemoteKeysForTarget(n) : __PRIVATE_documentKeySet();
    }, "getRemoteKeysForTarget"),
    Rt: /* @__PURE__ */ __name((t) => e.Ta.get(t) || null, "Rt"),
    lt: /* @__PURE__ */ __name(() => e.datastore.serializer.databaseId, "lt")
  }), __PRIVATE_ensureWatchStream(e).start(), e.fa.aa();
}
__name(__PRIVATE_startWatchStream, "__PRIVATE_startWatchStream");
function __PRIVATE_shouldStartWatchStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).M_() && e.Ta.size > 0;
}
__name(__PRIVATE_shouldStartWatchStream, "__PRIVATE_shouldStartWatchStream");
function __PRIVATE_canUseNetwork(e) {
  return 0 === __PRIVATE_debugCast(e).Va.size;
}
__name(__PRIVATE_canUseNetwork, "__PRIVATE_canUseNetwork");
function __PRIVATE_cleanUpWatchStreamState(e) {
  e.ga = void 0;
}
__name(__PRIVATE_cleanUpWatchStreamState, "__PRIVATE_cleanUpWatchStreamState");
async function __PRIVATE_onWatchStreamConnected(e) {
  e.fa.set(
    "Online"
    /* OnlineState.Online */
  );
}
__name(__PRIVATE_onWatchStreamConnected, "__PRIVATE_onWatchStreamConnected");
async function __PRIVATE_onWatchStreamOpen(e) {
  e.Ta.forEach((t, n) => {
    __PRIVATE_sendWatchRequest(e, t);
  });
}
__name(__PRIVATE_onWatchStreamOpen, "__PRIVATE_onWatchStreamOpen");
async function __PRIVATE_onWatchStreamClose(e, t) {
  __PRIVATE_cleanUpWatchStreamState(e), // If we still need the watch stream, retry the connection.
  __PRIVATE_shouldStartWatchStream(e) ? (e.fa.la(t), __PRIVATE_startWatchStream(e)) : (
    // No need to restart watch stream because there are no active targets.
    // The online state is set to unknown because there is no active attempt
    // at establishing a connection
    e.fa.set(
      "Unknown"
      /* OnlineState.Unknown */
    )
  );
}
__name(__PRIVATE_onWatchStreamClose, "__PRIVATE_onWatchStreamClose");
async function __PRIVATE_onWatchStreamChange(e, t, n) {
  if (
    // Mark the client as online since we got a message from the server
    e.fa.set(
      "Online"
      /* OnlineState.Online */
    ), t instanceof __PRIVATE_WatchTargetChange && 2 === t.state && t.cause
  )
    try {
      await (/* @__PURE__ */ __name(async function __PRIVATE_handleTargetError(e2, t2) {
        const n2 = t2.cause;
        for (const r of t2.targetIds) {
          if (e2.Ta.has(r)) {
            const t3 = e2.Ea.get(r);
            void 0 !== t3 && (await e2.remoteSyncer.rejectListen(t3, n2), e2.Ia.delete(t3), e2.Ea.delete(r)), e2.Ta.delete(r);
          }
          e2.ga.removeTarget(r);
        }
      }, "__PRIVATE_handleTargetError"))(e, t);
    } catch (n2) {
      __PRIVATE_logDebug(Ht, "Failed to remove targets %s: %s ", t.targetIds.join(","), n2), await __PRIVATE_disableNetworkUntilRecovery(e, n2);
    }
  else if (t instanceof __PRIVATE_DocumentWatchChange ? e.ga.Xe(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.ga.it(t) : e.ga.tt(t), !n.isEqual(SnapshotVersion.min())) try {
    const t2 = await __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
    n.compareTo(t2) >= 0 && // We have received a target change with a global snapshot if the snapshot
    // version is not equal to SnapshotVersion.min().
    /**
    * Takes a batch of changes from the Datastore, repackages them as a
    * RemoteEvent, and passes that on to the listener, which is typically the
    * SyncEngine.
    */
    await (/* @__PURE__ */ __name(function __PRIVATE_raiseWatchSnapshot(e2, t3) {
      const n2 = e2.ga.Pt(t3);
      n2.targetChanges.forEach((n3, r2) => {
        if (n3.resumeToken.approximateByteSize() > 0) {
          const i = e2.Ta.get(r2);
          i && e2.Ta.set(r2, i.withResumeToken(n3.resumeToken, t3));
        }
      }), // Re-establish listens for the targets that have been invalidated by
      // existence filter mismatches.
      // TODO ideally this would use a new remote target ID
      n2.targetMismatches.forEach((t4, n3) => {
        const r2 = e2.Ta.get(t4);
        if (!r2)
          return;
        e2.Ta.set(t4, r2.withResumeToken(ByteString.EMPTY_BYTE_STRING, r2.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
        // deliberately don't send a resume token so that we get a full update.
        __PRIVATE_sendUnwatchRequest(e2, t4);
        const i = new TargetData(r2.target, t4, n3, r2.sequenceNumber);
        __PRIVATE_sendWatchRequest(e2, i);
      });
      const r = (
        /**
        * Convert a RemoteEvent with remote IDs to a RemoteEvent with
        * SDK IDs and dropped updates
        * for any targets we no longer track.
        *
        * @param remoteStoreImpl
        * @param remoteEvent
        * @return a new RemoteEvent with SDK IDs and dropped updates
        * for any targets we no longer track.
        */
        (/* @__PURE__ */ __name(function __PRIVATE_toSdkRemoteEvent(e3, t4) {
          const n3 = /* @__PURE__ */ new Map();
          t4.targetChanges.forEach((t5, r3) => {
            const i = e3.Ea.get(r3);
            void 0 !== i && n3.set(i, t5);
          });
          let r2 = new SortedMap(__PRIVATE_primitiveComparator);
          return t4.targetMismatches.forEach((t5, n4) => {
            const i = e3.Ea.get(t5);
            void 0 !== i && (r2 = r2.insert(i, n4));
          }), new RemoteEvent(t4.snapshotVersion, n3, r2, t4.documentUpdates, t4.resolvedLimboDocuments);
        }, "__PRIVATE_toSdkRemoteEvent"))(e2, n2)
      );
      return e2.remoteSyncer.applyRemoteEvent(r);
    }, "__PRIVATE_raiseWatchSnapshot"))(e, n);
  } catch (t2) {
    __PRIVATE_logDebug(Ht, "Failed to raise snapshot:", t2), await __PRIVATE_disableNetworkUntilRecovery(e, t2);
  }
}
__name(__PRIVATE_onWatchStreamChange, "__PRIVATE_onWatchStreamChange");
async function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
  if (!__PRIVATE_isIndexedDbTransactionError(t)) throw t;
  e.Va.add(
    1
    /* OfflineCause.IndexedDbFailed */
  ), // Disable network and raise offline snapshots
  await __PRIVATE_disableNetworkInternal(e), e.fa.set(
    "Offline"
    /* OnlineState.Offline */
  ), n || // Use a simple read operation to determine if IndexedDB recovered.
  // Ideally, we would expose a health check directly on SimpleDb, but
  // RemoteStore only has access to persistence through LocalStore.
  (n = /* @__PURE__ */ __name(() => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore), "n")), // Probe IndexedDB periodically and re-enable network
  e.asyncQueue.enqueueRetryable(async () => {
    __PRIVATE_logDebug(Ht, "Retrying IndexedDB access"), await n(), e.Va.delete(
      1
      /* OfflineCause.IndexedDbFailed */
    ), await __PRIVATE_enableNetworkInternal(e);
  });
}
__name(__PRIVATE_disableNetworkUntilRecovery, "__PRIVATE_disableNetworkUntilRecovery");
function __PRIVATE_executeWithRecovery(e, t) {
  return t().catch((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t));
}
__name(__PRIVATE_executeWithRecovery, "__PRIVATE_executeWithRecovery");
async function __PRIVATE_fillWritePipeline(e) {
  const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
  let r = t.Pa.length > 0 ? t.Pa[t.Pa.length - 1].batchId : q;
  for (; __PRIVATE_canAddToWritePipeline(t); ) try {
    const e2 = await __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r);
    if (null === e2) {
      0 === t.Pa.length && n.B_();
      break;
    }
    r = e2.batchId, __PRIVATE_addToWritePipeline(t, e2);
  } catch (e2) {
    await __PRIVATE_disableNetworkUntilRecovery(t, e2);
  }
  __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
}
__name(__PRIVATE_fillWritePipeline, "__PRIVATE_fillWritePipeline");
function __PRIVATE_canAddToWritePipeline(e) {
  return __PRIVATE_canUseNetwork(e) && e.Pa.length < 10;
}
__name(__PRIVATE_canAddToWritePipeline, "__PRIVATE_canAddToWritePipeline");
function __PRIVATE_addToWritePipeline(e, t) {
  e.Pa.push(t);
  const n = __PRIVATE_ensureWriteStream(e);
  n.x_() && n.X_ && n.Y_(t.mutations);
}
__name(__PRIVATE_addToWritePipeline, "__PRIVATE_addToWritePipeline");
function __PRIVATE_shouldStartWriteStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).M_() && e.Pa.length > 0;
}
__name(__PRIVATE_shouldStartWriteStream, "__PRIVATE_shouldStartWriteStream");
function __PRIVATE_startWriteStream(e) {
  __PRIVATE_ensureWriteStream(e).start();
}
__name(__PRIVATE_startWriteStream, "__PRIVATE_startWriteStream");
async function __PRIVATE_onWriteStreamOpen(e) {
  __PRIVATE_ensureWriteStream(e).na();
}
__name(__PRIVATE_onWriteStreamOpen, "__PRIVATE_onWriteStreamOpen");
async function __PRIVATE_onWriteHandshakeComplete(e) {
  const t = __PRIVATE_ensureWriteStream(e);
  for (const n of e.Pa) t.Y_(n.mutations);
}
__name(__PRIVATE_onWriteHandshakeComplete, "__PRIVATE_onWriteHandshakeComplete");
async function __PRIVATE_onMutationResult(e, t, n) {
  const r = e.Pa.shift(), i = MutationBatchResult.from(r, t, n);
  await __PRIVATE_executeWithRecovery(e, () => e.remoteSyncer.applySuccessfulWrite(i)), // It's possible that with the completion of this mutation another
  // slot has freed up.
  await __PRIVATE_fillWritePipeline(e);
}
__name(__PRIVATE_onMutationResult, "__PRIVATE_onMutationResult");
async function __PRIVATE_onWriteStreamClose(e, t) {
  t && __PRIVATE_ensureWriteStream(e).X_ && // This error affects the actual write.
  await (/* @__PURE__ */ __name(async function __PRIVATE_handleWriteError(e2, t2) {
    if ((/* @__PURE__ */ __name(function __PRIVATE_isPermanentWriteError(e3) {
      return __PRIVATE_isPermanentError(e3) && e3 !== D.ABORTED;
    }, "__PRIVATE_isPermanentWriteError"))(t2.code)) {
      const n = e2.Pa.shift();
      __PRIVATE_ensureWriteStream(e2).N_(), await __PRIVATE_executeWithRecovery(e2, () => e2.remoteSyncer.rejectFailedWrite(n.batchId, t2)), // It's possible that with the completion of this mutation
      // another slot has freed up.
      await __PRIVATE_fillWritePipeline(e2);
    }
  }, "__PRIVATE_handleWriteError"))(e, t), // The write stream might have been started by refilling the write
  // pipeline for failed writes
  __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
}
__name(__PRIVATE_onWriteStreamClose, "__PRIVATE_onWriteStreamClose");
async function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Ht, "RemoteStore received new credentials");
  const r = __PRIVATE_canUseNetwork(n);
  n.Va.add(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_disableNetworkInternal(n), r && // Don't set the network status to Unknown if we are offline.
  n.fa.set(
    "Unknown"
    /* OnlineState.Unknown */
  ), await n.remoteSyncer.handleCredentialChange(t), n.Va.delete(
    3
    /* OfflineCause.CredentialChange */
  ), await __PRIVATE_enableNetworkInternal(n);
}
__name(__PRIVATE_remoteStoreHandleCredentialChange, "__PRIVATE_remoteStoreHandleCredentialChange");
async function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
  const n = __PRIVATE_debugCast(e);
  t ? (n.Va.delete(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_enableNetworkInternal(n)) : t || (n.Va.add(
    2
    /* OfflineCause.IsSecondary */
  ), await __PRIVATE_disableNetworkInternal(n), n.fa.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
__name(__PRIVATE_remoteStoreApplyPrimaryState, "__PRIVATE_remoteStoreApplyPrimaryState");
function __PRIVATE_ensureWatchStream(e) {
  return e.pa || // Create stream (but note that it is not started yet).
  (e.pa = (/* @__PURE__ */ __name(function __PRIVATE_newPersistentWatchStream(e2, t, n) {
    const r = __PRIVATE_debugCast(e2);
    return r.ia(), new __PRIVATE_PersistentListenStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
  }, "__PRIVATE_newPersistentWatchStream"))(e.datastore, e.asyncQueue, {
    Ho: __PRIVATE_onWatchStreamConnected.bind(null, e),
    Xo: __PRIVATE_onWatchStreamOpen.bind(null, e),
    e_: __PRIVATE_onWatchStreamClose.bind(null, e),
    J_: __PRIVATE_onWatchStreamChange.bind(null, e)
  }), e.da.push(async (t) => {
    t ? (e.pa.N_(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.fa.set(
      "Unknown"
      /* OnlineState.Unknown */
    )) : (await e.pa.stop(), __PRIVATE_cleanUpWatchStreamState(e));
  })), e.pa;
}
__name(__PRIVATE_ensureWatchStream, "__PRIVATE_ensureWatchStream");
function __PRIVATE_ensureWriteStream(e) {
  return e.ya || // Create stream (but note that it is not started yet).
  (e.ya = (/* @__PURE__ */ __name(function __PRIVATE_newPersistentWriteStream(e2, t, n) {
    const r = __PRIVATE_debugCast(e2);
    return r.ia(), new __PRIVATE_PersistentWriteStream(t, r.connection, r.authCredentials, r.appCheckCredentials, r.serializer, n);
  }, "__PRIVATE_newPersistentWriteStream"))(e.datastore, e.asyncQueue, {
    Ho: /* @__PURE__ */ __name(() => Promise.resolve(), "Ho"),
    Xo: __PRIVATE_onWriteStreamOpen.bind(null, e),
    e_: __PRIVATE_onWriteStreamClose.bind(null, e),
    ea: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
    ta: __PRIVATE_onMutationResult.bind(null, e)
  }), e.da.push(async (t) => {
    t ? (e.ya.N_(), // This will start the write stream if necessary.
    await __PRIVATE_fillWritePipeline(e)) : (await e.ya.stop(), e.Pa.length > 0 && (__PRIVATE_logDebug(Ht, `Stopping write stream with ${e.Pa.length} pending writes`), e.Pa = []));
  })), e.ya;
}
__name(__PRIVATE_ensureWriteStream, "__PRIVATE_ensureWriteStream");
var _DelayedOperation = class _DelayedOperation {
  constructor(e, t, n, r, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */
  static createAndSchedule(e, t, n, r, i) {
    const s = Date.now() + n, o = new _DelayedOperation(e, t, s, r, i);
    return o.start(n), o;
  }
  /**
   * Starts the timer. This is called immediately after construction by
   * createAndSchedule().
   */
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  /**
   * Queues the operation to run immediately (if it hasn't already been run or
   * canceled).
   */
  skipDelay() {
    return this.handleDelayElapsed();
  }
  /**
   * Cancels the operation if it hasn't already been executed or canceled. The
   * promise will be rejected.
   *
   * As long as the operation has not yet been run, calling cancel() provides a
   * guarantee that the operation will not be run.
   */
  cancel(e) {
    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(D.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
};
__name(_DelayedOperation, "DelayedOperation");
var DelayedOperation = _DelayedOperation;
function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e)) return new FirestoreError(D.UNAVAILABLE, `${t}: ${e}`);
  throw e;
}
__name(__PRIVATE_wrapInUserErrorIfRecoverable, "__PRIVATE_wrapInUserErrorIfRecoverable");
var _DocumentSet = class _DocumentSet {
  /**
   * Returns an empty copy of the existing DocumentSet, using the same
   * comparator.
   */
  static emptySet(e) {
    return new _DocumentSet(e.comparator);
  }
  /** The default ordering is by key if the comparator is omitted */
  constructor(e) {
    this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e2, t) => DocumentKey.comparator(e2.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
  }
  has(e) {
    return null != this.keyedMap.get(e);
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  /**
   * Returns the index of the provided key in the document set, or -1 if the
   * document key is not present in the set;
   */
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  /** Iterates documents in order defined by "comparator" */
  forEach(e) {
    this.sortedSet.inorderTraversal((t, n) => (e(t), false));
  }
  /** Inserts or updates a document with the same key */
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  /** Deletes a document with a given key */
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof _DocumentSet)) return false;
    if (this.size !== e.size) return false;
    const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
    for (; t.hasNext(); ) {
      const e2 = t.getNext().key, r = n.getNext().key;
      if (!e2.isEqual(r)) return false;
    }
    return true;
  }
  toString() {
    const e = [];
    return this.forEach((t) => {
      e.push(t.toString());
    }), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
  }
  copy(e, t) {
    const n = new _DocumentSet();
    return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
  }
};
__name(_DocumentSet, "DocumentSet");
var DocumentSet = _DocumentSet;
var ___PRIVATE_DocumentChangeSet = class ___PRIVATE_DocumentChangeSet {
  constructor() {
    this.wa = new SortedMap(DocumentKey.comparator);
  }
  track(e) {
    const t = e.doc.key, n = this.wa.get(t);
    n ? (
      // Merge the new change with the existing change.
      0 !== e.type && 3 === n.type ? this.wa = this.wa.insert(t, e) : 3 === e.type && 1 !== n.type ? this.wa = this.wa.insert(t, {
        type: n.type,
        doc: e.doc
      }) : 2 === e.type && 2 === n.type ? this.wa = this.wa.insert(t, {
        type: 2,
        doc: e.doc
      }) : 2 === e.type && 0 === n.type ? this.wa = this.wa.insert(t, {
        type: 0,
        doc: e.doc
      }) : 1 === e.type && 0 === n.type ? this.wa = this.wa.remove(t) : 1 === e.type && 2 === n.type ? this.wa = this.wa.insert(t, {
        type: 1,
        doc: n.doc
      }) : 0 === e.type && 1 === n.type ? this.wa = this.wa.insert(t, {
        type: 2,
        doc: e.doc
      }) : (
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        fail(63341, {
          At: e,
          Sa: n
        })
      )
    ) : this.wa = this.wa.insert(t, e);
  }
  ba() {
    const e = [];
    return this.wa.inorderTraversal((t, n) => {
      e.push(n);
    }), e;
  }
};
__name(___PRIVATE_DocumentChangeSet, "__PRIVATE_DocumentChangeSet");
var __PRIVATE_DocumentChangeSet = ___PRIVATE_DocumentChangeSet;
var _ViewSnapshot = class _ViewSnapshot {
  constructor(e, t, n, r, i, s, o, _, a) {
    this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
  }
  /** Returns a view snapshot as if all documents in the snapshot were added. */
  static fromInitialDocuments(e, t, n, r, i) {
    const s = [];
    return t.forEach((e2) => {
      s.push({
        type: 0,
        doc: e2
      });
    }), new _ViewSnapshot(
      e,
      t,
      DocumentSet.emptySet(t),
      s,
      n,
      r,
      /* syncStateChanged= */
      true,
      /* excludesMetadataChanges= */
      false,
      i
    );
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs))) return false;
    const t = this.docChanges, n = e.docChanges;
    if (t.length !== n.length) return false;
    for (let e2 = 0; e2 < t.length; e2++) if (t[e2].type !== n[e2].type || !t[e2].doc.isEqual(n[e2].doc)) return false;
    return true;
  }
};
__name(_ViewSnapshot, "ViewSnapshot");
var ViewSnapshot = _ViewSnapshot;
var ___PRIVATE_QueryListenersInfo = class ___PRIVATE_QueryListenersInfo {
  constructor() {
    this.Da = void 0, this.Ca = [];
  }
  // Helper methods that checks if the query has listeners that listening to remote store
  va() {
    return this.Ca.some((e) => e.Fa());
  }
};
__name(___PRIVATE_QueryListenersInfo, "__PRIVATE_QueryListenersInfo");
var __PRIVATE_QueryListenersInfo = ___PRIVATE_QueryListenersInfo;
var ___PRIVATE_EventManagerImpl = class ___PRIVATE_EventManagerImpl {
  constructor() {
    this.queries = __PRIVATE_newQueriesObjectMap(), this.onlineState = "Unknown", this.Ma = /* @__PURE__ */ new Set();
  }
  terminate() {
    !(/* @__PURE__ */ __name(function __PRIVATE_errorAllTargets(e, t) {
      const n = __PRIVATE_debugCast(e), r = n.queries;
      n.queries = __PRIVATE_newQueriesObjectMap(), r.forEach((e2, n2) => {
        for (const e3 of n2.Ca) e3.onError(t);
      });
    }, "__PRIVATE_errorAllTargets"))(this, new FirestoreError(D.ABORTED, "Firestore shutting down"));
  }
};
__name(___PRIVATE_EventManagerImpl, "__PRIVATE_EventManagerImpl");
var __PRIVATE_EventManagerImpl = ___PRIVATE_EventManagerImpl;
function __PRIVATE_newQueriesObjectMap() {
  return new ObjectMap((e) => __PRIVATE_canonifyQuery(e), __PRIVATE_queryEquals);
}
__name(__PRIVATE_newQueriesObjectMap, "__PRIVATE_newQueriesObjectMap");
async function __PRIVATE_eventManagerListen(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r = 3;
  const i = t.query;
  let s = n.queries.get(i);
  s ? !s.va() && t.Fa() && // Query has been listening to local cache, and tries to add a new listener sourced from watch.
  (r = 2) : (s = new __PRIVATE_QueryListenersInfo(), r = t.Fa() ? 0 : 1);
  try {
    switch (r) {
      case 0:
        s.Da = await n.onListen(
          i,
          /** enableRemoteListen= */
          true
        );
        break;
      case 1:
        s.Da = await n.onListen(
          i,
          /** enableRemoteListen= */
          false
        );
        break;
      case 2:
        await n.onFirstRemoteStoreListen(i);
    }
  } catch (e2) {
    const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
    return void t.onError(n2);
  }
  if (n.queries.set(i, s), s.Ca.push(t), // Run global snapshot listeners if a consistent snapshot has been emitted.
  t.xa(n.onlineState), s.Da) {
    t.Oa(s.Da) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
  }
}
__name(__PRIVATE_eventManagerListen, "__PRIVATE_eventManagerListen");
async function __PRIVATE_eventManagerUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.query;
  let i = 3;
  const s = n.queries.get(r);
  if (s) {
    const e2 = s.Ca.indexOf(t);
    e2 >= 0 && (s.Ca.splice(e2, 1), 0 === s.Ca.length ? i = t.Fa() ? 0 : 1 : !s.va() && t.Fa() && // The removed listener is the last one that sourced from watch.
    (i = 2));
  }
  switch (i) {
    case 0:
      return n.queries.delete(r), n.onUnlisten(
        r,
        /** disableRemoteListen= */
        true
      );
    case 1:
      return n.queries.delete(r), n.onUnlisten(
        r,
        /** disableRemoteListen= */
        false
      );
    case 2:
      return n.onLastRemoteStoreUnlisten(r);
    default:
      return;
  }
}
__name(__PRIVATE_eventManagerUnlisten, "__PRIVATE_eventManagerUnlisten");
function __PRIVATE_eventManagerOnWatchChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r = false;
  for (const e2 of t) {
    const t2 = e2.query, i = n.queries.get(t2);
    if (i) {
      for (const t3 of i.Ca) t3.Oa(e2) && (r = true);
      i.Da = e2;
    }
  }
  r && __PRIVATE_raiseSnapshotsInSyncEvent(n);
}
__name(__PRIVATE_eventManagerOnWatchChange, "__PRIVATE_eventManagerOnWatchChange");
function __PRIVATE_eventManagerOnWatchError(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.queries.get(t);
  if (i) for (const e2 of i.Ca) e2.onError(n);
  r.queries.delete(t);
}
__name(__PRIVATE_eventManagerOnWatchError, "__PRIVATE_eventManagerOnWatchError");
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
  e.Ma.forEach((e2) => {
    e2.next();
  });
}
__name(__PRIVATE_raiseSnapshotsInSyncEvent, "__PRIVATE_raiseSnapshotsInSyncEvent");
var Jt;
var Zt;
(Zt = Jt || (Jt = {})).Na = "default", /** Listen to changes in cache only */
Zt.Cache = "cache";
var ___PRIVATE_QueryListener = class ___PRIVATE_QueryListener {
  constructor(e, t, n) {
    this.query = e, this.Ba = t, /**
     * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
     * observer. This flag is set to true once we've actually raised an event.
     */
    this.La = false, this.ka = null, this.onlineState = "Unknown", this.options = n || {};
  }
  /**
   * Applies the new ViewSnapshot to this listener, raising a user-facing event
   * if applicable (depending on what changed, whether the user has opted into
   * metadata-only changes, etc.). Returns true if a user-facing event was
   * indeed raised.
   */
  Oa(e) {
    if (!this.options.includeMetadataChanges) {
      const t2 = [];
      for (const n of e.docChanges) 3 !== n.type && t2.push(n);
      e = new ViewSnapshot(
        e.query,
        e.docs,
        e.oldDocs,
        t2,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        /* excludesMetadataChanges= */
        true,
        e.hasCachedResults
      );
    }
    let t = false;
    return this.La ? this.qa(e) && (this.Ba.next(e), t = true) : this.Ka(e, this.onlineState) && (this.Ua(e), t = true), this.ka = e, t;
  }
  onError(e) {
    this.Ba.error(e);
  }
  /** Returns whether a snapshot was raised. */
  xa(e) {
    this.onlineState = e;
    let t = false;
    return this.ka && !this.La && this.Ka(this.ka, e) && (this.Ua(this.ka), t = true), t;
  }
  Ka(e, t) {
    if (!e.fromCache) return true;
    if (!this.Fa()) return true;
    const n = "Offline" !== t;
    return (!this.options.$a || !n) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t);
  }
  qa(e) {
    if (e.docChanges.length > 0) return true;
    const t = this.ka && this.ka.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && true === this.options.includeMetadataChanges;
  }
  Ua(e) {
    e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.La = true, this.Ba.next(e);
  }
  Fa() {
    return this.options.source !== Jt.Cache;
  }
};
__name(___PRIVATE_QueryListener, "__PRIVATE_QueryListener");
var __PRIVATE_QueryListener = ___PRIVATE_QueryListener;
var ___PRIVATE_AddedLimboDocument = class ___PRIVATE_AddedLimboDocument {
  constructor(e) {
    this.key = e;
  }
};
__name(___PRIVATE_AddedLimboDocument, "__PRIVATE_AddedLimboDocument");
var __PRIVATE_AddedLimboDocument = ___PRIVATE_AddedLimboDocument;
var ___PRIVATE_RemovedLimboDocument = class ___PRIVATE_RemovedLimboDocument {
  constructor(e) {
    this.key = e;
  }
};
__name(___PRIVATE_RemovedLimboDocument, "__PRIVATE_RemovedLimboDocument");
var __PRIVATE_RemovedLimboDocument = ___PRIVATE_RemovedLimboDocument;
var ___PRIVATE_View = class ___PRIVATE_View {
  constructor(e, t) {
    this.query = e, this.eu = t, this.tu = null, this.hasCachedResults = false, /**
     * A flag whether the view is current with the backend. A view is considered
     * current after it has seen the current flag from the backend and did not
     * lose consistency within the watch stream (e.g. because of an existence
     * filter mismatch).
     */
    this.current = false, /** Documents in the view but not in the remote target */
    this.nu = __PRIVATE_documentKeySet(), /** Document Keys that have local changes */
    this.mutatedKeys = __PRIVATE_documentKeySet(), this.ru = __PRIVATE_newQueryComparator(e), this.iu = new DocumentSet(this.ru);
  }
  /**
   * The set of remote documents that the server has told us belongs to the target associated with
   * this view.
   */
  get su() {
    return this.eu;
  }
  /**
   * Iterates over a set of doc changes, applies the query limit, and computes
   * what the new results should be, what the changes were, and whether we may
   * need to go back to the local cache for more results. Does not make any
   * changes to the view.
   * @param docChanges - The doc changes to apply to this view.
   * @param previousChanges - If this is being called with a refill, then start
   *        with this set of docs and changes instead of the current view.
   * @returns a new set of docs, changes, and refill flag.
   */
  ou(e, t) {
    const n = t ? t._u : new __PRIVATE_DocumentChangeSet(), r = t ? t.iu : this.iu;
    let i = t ? t.mutatedKeys : this.mutatedKeys, s = r, o = false;
    const _ = "F" === this.query.limitType && r.size === this.query.limit ? r.last() : null, a = "L" === this.query.limitType && r.size === this.query.limit ? r.first() : null;
    if (e.inorderTraversal((e2, t2) => {
      const u = r.get(e2), c = __PRIVATE_queryMatches(this.query, t2) ? t2 : null, l = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || // We only consider committed mutations for documents that were
      // mutated during the lifetime of the view.
      this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
      let P = false;
      if (u && c) {
        u.data.isEqual(c.data) ? l !== h && (n.track({
          type: 3,
          doc: c
        }), P = true) : this.au(u, c) || (n.track({
          type: 2,
          doc: c
        }), P = true, (_ && this.ru(c, _) > 0 || a && this.ru(c, a) < 0) && // This doc moved from inside the limit to outside the limit.
        // That means there may be some other doc in the local cache
        // that should be included instead.
        (o = true));
      } else !u && c ? (n.track({
        type: 0,
        doc: c
      }), P = true) : u && !c && (n.track({
        type: 1,
        doc: u
      }), P = true, (_ || a) && // A doc was removed from a full limit query. We'll need to
      // requery from the local cache to see if we know about some other
      // doc that should be in the results.
      (o = true));
      P && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
    }), null !== this.query.limit) for (; s.size > this.query.limit; ) {
      const e2 = "F" === this.query.limitType ? s.last() : s.first();
      s = s.delete(e2.key), i = i.delete(e2.key), n.track({
        type: 1,
        doc: e2
      });
    }
    return {
      iu: s,
      _u: n,
      Ss: o,
      mutatedKeys: i
    };
  }
  au(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  /**
   * Updates the view with the given ViewDocumentChanges and optionally updates
   * limbo docs and sync state from the provided target change.
   * @param docChanges - The set of changes to make to the view's docs.
   * @param limboResolutionEnabled - Whether to update limbo documents based on
   *        this change.
   * @param targetChange - A target change to apply for computing limbo docs and
   *        sync state.
   * @param targetIsPendingReset - Whether the target is pending to reset due to
   *        existence filter mismatch. If not explicitly specified, it is treated
   *        equivalently to `false`.
   * @returns A new ViewChange with the given docs, changes, and sync state.
   */
  // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
  applyChanges(e, t, n, r) {
    const i = this.iu;
    this.iu = e.iu, this.mutatedKeys = e.mutatedKeys;
    const s = e._u.ba();
    s.sort((e2, t2) => (/* @__PURE__ */ __name(function __PRIVATE_compareChangeType(e3, t3) {
      const order = /* @__PURE__ */ __name((e4) => {
        switch (e4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return fail(20277, {
              At: e4
            });
        }
      }, "order");
      return order(e3) - order(t3);
    }, "__PRIVATE_compareChangeType"))(e2.type, t2.type) || this.ru(e2.doc, t2.doc)), this.uu(n), r = r ?? false;
    const o = t && !r ? this.cu() : [], _ = 0 === this.nu.size && this.current && !r ? 1 : 0, a = _ !== this.tu;
    if (this.tu = _, 0 !== s.length || a) {
      return {
        snapshot: new ViewSnapshot(
          this.query,
          e.iu,
          i,
          s,
          e.mutatedKeys,
          0 === _,
          a,
          /* excludesMetadataChanges= */
          false,
          !!n && n.resumeToken.approximateByteSize() > 0
        ),
        lu: o
      };
    }
    return {
      lu: o
    };
  }
  /**
   * Applies an OnlineState change to the view, potentially generating a
   * ViewChange if the view's syncState changes as a result.
   */
  xa(e) {
    return this.current && "Offline" === e ? (
      // If we're offline, set `current` to false and then call applyChanges()
      // to refresh our syncState and generate a ViewChange as appropriate. We
      // are guaranteed to get a new TargetChange that sets `current` back to
      // true once the client is back online.
      (this.current = false, this.applyChanges(
        {
          iu: this.iu,
          _u: new __PRIVATE_DocumentChangeSet(),
          mutatedKeys: this.mutatedKeys,
          Ss: false
        },
        /* limboResolutionEnabled= */
        false
      ))
    ) : {
      lu: []
    };
  }
  /**
   * Returns whether the doc for the given key should be in limbo.
   */
  hu(e) {
    return !this.eu.has(e) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
    (!!this.iu.has(e) && !this.iu.get(e).hasLocalMutations);
  }
  /**
   * Updates syncedDocuments, current, and limbo docs based on the given change.
   * Returns the list of changes to which docs are in limbo.
   */
  uu(e) {
    e && (e.addedDocuments.forEach((e2) => this.eu = this.eu.add(e2)), e.modifiedDocuments.forEach((e2) => {
    }), e.removedDocuments.forEach((e2) => this.eu = this.eu.delete(e2)), this.current = e.current);
  }
  cu() {
    if (!this.current) return [];
    const e = this.nu;
    this.nu = __PRIVATE_documentKeySet(), this.iu.forEach((e2) => {
      this.hu(e2.key) && (this.nu = this.nu.add(e2.key));
    });
    const t = [];
    return e.forEach((e2) => {
      this.nu.has(e2) || t.push(new __PRIVATE_RemovedLimboDocument(e2));
    }), this.nu.forEach((n) => {
      e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
    }), t;
  }
  /**
   * Update the in-memory state of the current view with the state read from
   * persistence.
   *
   * We update the query view whenever a client's primary status changes:
   * - When a client transitions from primary to secondary, it can miss
   *   LocalStorage updates and its query views may temporarily not be
   *   synchronized with the state on disk.
   * - For secondary to primary transitions, the client needs to update the list
   *   of `syncedDocuments` since secondary clients update their query views
   *   based purely on synthesized RemoteEvents.
   *
   * @param queryResult.documents - The documents that match the query according
   * to the LocalStore.
   * @param queryResult.remoteKeys - The keys of the documents that match the
   * query according to the backend.
   *
   * @returns The ViewChange that resulted from this synchronization.
   */
  // PORTING NOTE: Multi-tab only.
  Pu(e) {
    this.eu = e.Ls, this.nu = __PRIVATE_documentKeySet();
    const t = this.ou(e.documents);
    return this.applyChanges(
      t,
      /* limboResolutionEnabled= */
      true
    );
  }
  /**
   * Returns a view snapshot as if this query was just listened to. Contains
   * a document add for every existing document and the `fromCache` and
   * `hasPendingWrites` status of the already established view.
   */
  // PORTING NOTE: Multi-tab only.
  Tu() {
    return ViewSnapshot.fromInitialDocuments(this.query, this.iu, this.mutatedKeys, 0 === this.tu, this.hasCachedResults);
  }
};
__name(___PRIVATE_View, "__PRIVATE_View");
var __PRIVATE_View = ___PRIVATE_View;
var Xt = "SyncEngine";
var ___PRIVATE_QueryView = class ___PRIVATE_QueryView {
  constructor(e, t, n) {
    this.query = e, this.targetId = t, this.view = n;
  }
};
__name(___PRIVATE_QueryView, "__PRIVATE_QueryView");
var __PRIVATE_QueryView = ___PRIVATE_QueryView;
var _LimboResolution = class _LimboResolution {
  constructor(e) {
    this.key = e, /**
     * Set to true once we've received a document. This is used in
     * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
     * decide whether it needs to manufacture a delete event for the target once
     * the target is CURRENT.
     */
    this.Iu = false;
  }
};
__name(_LimboResolution, "LimboResolution");
var LimboResolution = _LimboResolution;
var ___PRIVATE_SyncEngineImpl = class ___PRIVATE_SyncEngineImpl {
  constructor(e, t, n, r, i, s) {
    this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Eu = {}, this.Ru = new ObjectMap((e2) => __PRIVATE_canonifyQuery(e2), __PRIVATE_queryEquals), this.Au = /* @__PURE__ */ new Map(), /**
     * The keys of documents that are in limbo for which we haven't yet started a
     * limbo resolution query. The strings in this set are the result of calling
     * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
     *
     * The `Set` type was chosen because it provides efficient lookup and removal
     * of arbitrary elements and it also maintains insertion order, providing the
     * desired queue-like FIFO semantics.
     */
    this.Vu = /* @__PURE__ */ new Set(), /**
     * Keeps track of the target ID for each document that is in limbo with an
     * active target.
     */
    this.du = new SortedMap(DocumentKey.comparator), /**
     * Keeps track of the information about an active limbo resolution for each
     * active target ID that was started for the purpose of limbo resolution.
     */
    this.mu = /* @__PURE__ */ new Map(), this.fu = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
    this.gu = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
    this.pu = /* @__PURE__ */ new Map(), this.yu = __PRIVATE_TargetIdGenerator._r(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
    // startup. In the interim, a client should only be considered primary if
    // `isPrimary` is true.
    this.wu = void 0;
  }
  get isPrimaryClient() {
    return true === this.wu;
  }
};
__name(___PRIVATE_SyncEngineImpl, "__PRIVATE_SyncEngineImpl");
var __PRIVATE_SyncEngineImpl = ___PRIVATE_SyncEngineImpl;
async function __PRIVATE_syncEngineListen(e, t, n = true) {
  const r = __PRIVATE_ensureWatchCallbacks(e);
  let i;
  const s = r.Ru.get(t);
  return s ? (
    // PORTING NOTE: With Multi-Tab Web, it is possible that a query view
    // already exists when EventManager calls us for the first time. This
    // happens when the primary tab is already listening to this query on
    // behalf of another tab and the user of the primary also starts listening
    // to the query. EventManager will not have an assigned target ID in this
    // case and calls `listen` to obtain this ID.
    (r.sharedClientState.addLocalQueryTarget(s.targetId), i = s.view.Tu())
  ) : i = await __PRIVATE_allocateTargetAndMaybeListen(
    r,
    t,
    n,
    /** shouldInitializeView= */
    true
  ), i;
}
__name(__PRIVATE_syncEngineListen, "__PRIVATE_syncEngineListen");
async function __PRIVATE_triggerRemoteStoreListen(e, t) {
  const n = __PRIVATE_ensureWatchCallbacks(e);
  await __PRIVATE_allocateTargetAndMaybeListen(
    n,
    t,
    /** shouldListenToRemote= */
    true,
    /** shouldInitializeView= */
    false
  );
}
__name(__PRIVATE_triggerRemoteStoreListen, "__PRIVATE_triggerRemoteStoreListen");
async function __PRIVATE_allocateTargetAndMaybeListen(e, t, n, r) {
  const i = await __PRIVATE_localStoreAllocateTarget(e.localStore, __PRIVATE_queryToTarget(t)), s = i.targetId, o = e.sharedClientState.addLocalQueryTarget(s, n);
  let _;
  return r && (_ = await __PRIVATE_initializeViewAndComputeSnapshot(e, t, s, "current" === o, i.resumeToken)), e.isPrimaryClient && n && __PRIVATE_remoteStoreListen(e.remoteStore, i), _;
}
__name(__PRIVATE_allocateTargetAndMaybeListen, "__PRIVATE_allocateTargetAndMaybeListen");
async function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r, i) {
  e.Su = (t2, n2, r2) => (/* @__PURE__ */ __name(async function __PRIVATE_applyDocChanges(e2, t3, n3, r3) {
    let i2 = t3.view.ou(n3);
    i2.Ss && // The query has a limit and some docs were removed, so we need
    // to re-run the query against the local store to make sure we
    // didn't lose any good docs that had been past the limit.
    (i2 = await __PRIVATE_localStoreExecuteQuery(
      e2.localStore,
      t3.query,
      /* usePreviousResults= */
      false
    ).then(({ documents: e3 }) => t3.view.ou(e3, i2)));
    const s2 = r3 && r3.targetChanges.get(t3.targetId), o2 = r3 && null != r3.targetMismatches.get(t3.targetId), _2 = t3.view.applyChanges(
      i2,
      /* limboResolutionEnabled= */
      e2.isPrimaryClient,
      s2,
      o2
    );
    return __PRIVATE_updateTrackedLimbos(e2, t3.targetId, _2.lu), _2.snapshot;
  }, "__PRIVATE_applyDocChanges"))(e, t2, n2, r2);
  const s = await __PRIVATE_localStoreExecuteQuery(
    e.localStore,
    t,
    /* usePreviousResults= */
    true
  ), o = new __PRIVATE_View(t, s.Ls), _ = o.ou(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r && "Offline" !== e.onlineState, i), u = o.applyChanges(
    _,
    /* limboResolutionEnabled= */
    e.isPrimaryClient,
    a
  );
  __PRIVATE_updateTrackedLimbos(e, n, u.lu);
  const c = new __PRIVATE_QueryView(t, n, o);
  return e.Ru.set(t, c), e.Au.has(n) ? e.Au.get(n).push(t) : e.Au.set(n, [t]), u.snapshot;
}
__name(__PRIVATE_initializeViewAndComputeSnapshot, "__PRIVATE_initializeViewAndComputeSnapshot");
async function __PRIVATE_syncEngineUnlisten(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = r.Ru.get(t), s = r.Au.get(i.targetId);
  if (s.length > 1) return r.Au.set(i.targetId, s.filter((e2) => !__PRIVATE_queryEquals(e2, t))), void r.Ru.delete(t);
  if (r.isPrimaryClient) {
    r.sharedClientState.removeLocalQueryTarget(i.targetId);
    r.sharedClientState.isActiveQueryTarget(i.targetId) || await __PRIVATE_localStoreReleaseTarget(
      r.localStore,
      i.targetId,
      /*keepPersistedTargetData=*/
      false
    ).then(() => {
      r.sharedClientState.clearQueryState(i.targetId), n && __PRIVATE_remoteStoreUnlisten(r.remoteStore, i.targetId), __PRIVATE_removeAndCleanupTarget(r, i.targetId);
    }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  } else __PRIVATE_removeAndCleanupTarget(r, i.targetId), await __PRIVATE_localStoreReleaseTarget(
    r.localStore,
    i.targetId,
    /*keepPersistedTargetData=*/
    true
  );
}
__name(__PRIVATE_syncEngineUnlisten, "__PRIVATE_syncEngineUnlisten");
async function __PRIVATE_triggerRemoteStoreUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r = n.Ru.get(t), i = n.Au.get(r.targetId);
  n.isPrimaryClient && 1 === i.length && // PORTING NOTE: Unregister the target ID with local Firestore client as
  // watch target.
  (n.sharedClientState.removeLocalQueryTarget(r.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r.targetId));
}
__name(__PRIVATE_triggerRemoteStoreUnlisten, "__PRIVATE_triggerRemoteStoreUnlisten");
async function __PRIVATE_syncEngineWrite(e, t, n) {
  const r = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
  try {
    const e2 = await (/* @__PURE__ */ __name(function __PRIVATE_localStoreWriteLocally(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3), r2 = Timestamp.now(), i = t2.reduce((e4, t3) => e4.add(t3.key), __PRIVATE_documentKeySet());
      let s, o;
      return n2.persistence.runTransaction("Locally write mutations", "readwrite", (e4) => {
        let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
        return n2.Ms.getEntries(e4, i).next((e5) => {
          _ = e5, _.forEach((e6, t3) => {
            t3.isValidDocument() || (a = a.add(e6));
          });
        }).next(() => n2.localDocuments.getOverlayedDocuments(e4, _)).next((i2) => {
          s = i2;
          const o2 = [];
          for (const e5 of t2) {
            const t3 = __PRIVATE_mutationExtractBaseValue(e5, s.get(e5.key).overlayedDocument);
            null != t3 && // NOTE: The base state should only be applied if there's some
            // existing document to override, so use a Precondition of
            // exists=true
            o2.push(new __PRIVATE_PatchMutation(e5.key, t3, __PRIVATE_extractFieldMask(t3.value.mapValue), Precondition.exists(true)));
          }
          return n2.mutationQueue.addMutationBatch(e4, r2, o2, t2);
        }).next((t3) => {
          o = t3;
          const r3 = t3.applyToLocalDocumentSet(s, a);
          return n2.documentOverlayCache.saveOverlays(e4, t3.batchId, r3);
        });
      }).then(() => ({
        batchId: o.batchId,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
      }));
    }, "__PRIVATE_localStoreWriteLocally"))(r.localStore, t);
    r.sharedClientState.addPendingMutation(e2.batchId), (/* @__PURE__ */ __name(function __PRIVATE_addMutationCallback(e3, t2, n2) {
      let r2 = e3.gu[e3.currentUser.toKey()];
      r2 || (r2 = new SortedMap(__PRIVATE_primitiveComparator));
      r2 = r2.insert(t2, n2), e3.gu[e3.currentUser.toKey()] = r2;
    }, "__PRIVATE_addMutationCallback"))(r, e2.batchId, n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2.changes), await __PRIVATE_fillWritePipeline(r.remoteStore);
  } catch (e2) {
    const t2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Failed to persist write");
    n.reject(t2);
  }
}
__name(__PRIVATE_syncEngineWrite, "__PRIVATE_syncEngineWrite");
async function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
  const n = __PRIVATE_debugCast(e);
  try {
    const e2 = await __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
    t.targetChanges.forEach((e3, t2) => {
      const r = n.mu.get(t2);
      r && // Since this is a limbo resolution lookup, it's for a single document
      // and it could be added, modified, or removed, but not a combination.
      (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1, 22616), e3.addedDocuments.size > 0 ? r.Iu = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r.Iu, 14607) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r.Iu, 42227), r.Iu = false));
    }), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2, t);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
__name(__PRIVATE_syncEngineApplyRemoteEvent, "__PRIVATE_syncEngineApplyRemoteEvent");
function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  if (r.isPrimaryClient && 0 === n || !r.isPrimaryClient && 1 === n) {
    const e2 = [];
    r.Ru.forEach((n2, r2) => {
      const i = r2.view.xa(t);
      i.snapshot && e2.push(i.snapshot);
    }), (/* @__PURE__ */ __name(function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      n2.onlineState = t2;
      let r2 = false;
      n2.queries.forEach((e4, n3) => {
        for (const e5 of n3.Ca)
          e5.xa(t2) && (r2 = true);
      }), r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
    }, "__PRIVATE_eventManagerOnOnlineStateChange"))(r.eventManager, t), e2.length && r.Eu.J_(e2), r.onlineState = t, r.isPrimaryClient && r.sharedClientState.setOnlineState(t);
  }
}
__name(__PRIVATE_syncEngineApplyOnlineStateChange, "__PRIVATE_syncEngineApplyOnlineStateChange");
async function __PRIVATE_syncEngineRejectListen(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  r.sharedClientState.updateQueryState(t, "rejected", n);
  const i = r.mu.get(t), s = i && i.key;
  if (s) {
    let e2 = new SortedMap(DocumentKey.comparator);
    e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
    const n2 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(
      SnapshotVersion.min(),
      /* targetChanges= */
      /* @__PURE__ */ new Map(),
      /* targetMismatches= */
      new SortedMap(__PRIVATE_primitiveComparator),
      e2,
      n2
    );
    await __PRIVATE_syncEngineApplyRemoteEvent(r, i2), // Since this query failed, we won't want to manually unlisten to it.
    // We only remove it from bookkeeping after we successfully applied the
    // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
    // this query when the RemoteStore restarts the Watch stream, which should
    // re-trigger the target failure.
    r.du = r.du.remove(s), r.mu.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r);
  } else await __PRIVATE_localStoreReleaseTarget(
    r.localStore,
    t,
    /* keepPersistedTargetData */
    false
  ).then(() => __PRIVATE_removeAndCleanupTarget(r, t, n)).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
}
__name(__PRIVATE_syncEngineRejectListen, "__PRIVATE_syncEngineRejectListen");
async function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
  const n = __PRIVATE_debugCast(e), r = t.batch.batchId;
  try {
    const e2 = await __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
    __PRIVATE_processUserCallback(
      n,
      r,
      /*error=*/
      null
    ), __PRIVATE_triggerPendingWritesCallbacks(n, r), n.sharedClientState.updateMutationState(r, "acknowledged"), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2);
  } catch (e2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
  }
}
__name(__PRIVATE_syncEngineApplySuccessfulWrite, "__PRIVATE_syncEngineApplySuccessfulWrite");
async function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  try {
    const e2 = await (/* @__PURE__ */ __name(function __PRIVATE_localStoreRejectBatch(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      return n2.persistence.runTransaction("Reject batch", "readwrite-primary", (e4) => {
        let r2;
        return n2.mutationQueue.lookupMutationBatch(e4, t2).next((t3) => (__PRIVATE_hardAssert(null !== t3, 37113), r2 = t3.keys(), n2.mutationQueue.removeMutationBatch(e4, t3))).next(() => n2.mutationQueue.performConsistencyCheck(e4)).next(() => n2.documentOverlayCache.removeOverlaysForBatchId(e4, r2, t2)).next(() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r2)).next(() => n2.localDocuments.getDocuments(e4, r2));
      });
    }, "__PRIVATE_localStoreRejectBatch"))(r.localStore, t);
    __PRIVATE_processUserCallback(r, t, n), __PRIVATE_triggerPendingWritesCallbacks(r, t), r.sharedClientState.updateMutationState(t, "rejected", n), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r, e2);
  } catch (n2) {
    await __PRIVATE_ignoreIfPrimaryLeaseLoss(n2);
  }
}
__name(__PRIVATE_syncEngineRejectFailedWrite, "__PRIVATE_syncEngineRejectFailedWrite");
function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
  (e.pu.get(t) || []).forEach((e2) => {
    e2.resolve();
  }), e.pu.delete(t);
}
__name(__PRIVATE_triggerPendingWritesCallbacks, "__PRIVATE_triggerPendingWritesCallbacks");
function __PRIVATE_processUserCallback(e, t, n) {
  const r = __PRIVATE_debugCast(e);
  let i = r.gu[r.currentUser.toKey()];
  if (i) {
    const e2 = i.get(t);
    e2 && (n ? e2.reject(n) : e2.resolve(), i = i.remove(t)), r.gu[r.currentUser.toKey()] = i;
  }
}
__name(__PRIVATE_processUserCallback, "__PRIVATE_processUserCallback");
function __PRIVATE_removeAndCleanupTarget(e, t, n = null) {
  e.sharedClientState.removeLocalQueryTarget(t);
  for (const r of e.Au.get(t)) e.Ru.delete(r), n && e.Eu.bu(r, n);
  if (e.Au.delete(t), e.isPrimaryClient) {
    e.fu.Qr(t).forEach((t2) => {
      e.fu.containsKey(t2) || // We removed the last reference for this key
      __PRIVATE_removeLimboTarget(e, t2);
    });
  }
}
__name(__PRIVATE_removeAndCleanupTarget, "__PRIVATE_removeAndCleanupTarget");
function __PRIVATE_removeLimboTarget(e, t) {
  e.Vu.delete(t.path.canonicalString());
  const n = e.du.get(t);
  null !== n && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.du = e.du.remove(t), e.mu.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
__name(__PRIVATE_removeLimboTarget, "__PRIVATE_removeLimboTarget");
function __PRIVATE_updateTrackedLimbos(e, t, n) {
  for (const r of n) if (r instanceof __PRIVATE_AddedLimboDocument) e.fu.addReference(r.key, t), __PRIVATE_trackLimboChange(e, r);
  else if (r instanceof __PRIVATE_RemovedLimboDocument) {
    __PRIVATE_logDebug(Xt, "Document no longer in limbo: " + r.key), e.fu.removeReference(r.key, t);
    e.fu.containsKey(r.key) || // We removed the last reference for this key
    __PRIVATE_removeLimboTarget(e, r.key);
  } else fail(19791, {
    Du: r
  });
}
__name(__PRIVATE_updateTrackedLimbos, "__PRIVATE_updateTrackedLimbos");
function __PRIVATE_trackLimboChange(e, t) {
  const n = t.key, r = n.path.canonicalString();
  e.du.get(n) || e.Vu.has(r) || (__PRIVATE_logDebug(Xt, "New document in limbo: " + n), e.Vu.add(r), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
__name(__PRIVATE_trackLimboChange, "__PRIVATE_trackLimboChange");
function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
  for (; e.Vu.size > 0 && e.du.size < e.maxConcurrentLimboResolutions; ) {
    const t = e.Vu.values().next().value;
    e.Vu.delete(t);
    const n = new DocumentKey(ResourcePath.fromString(t)), r = e.yu.next();
    e.mu.set(r, new LimboResolution(n)), e.du = e.du.insert(n, r), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence.ce));
  }
}
__name(__PRIVATE_pumpEnqueuedLimboResolutions, "__PRIVATE_pumpEnqueuedLimboResolutions");
async function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
  const r = __PRIVATE_debugCast(e), i = [], s = [], o = [];
  r.Ru.isEmpty() || (r.Ru.forEach((e2, _) => {
    o.push(r.Su(_, t, n).then((e3) => {
      if ((e3 || n) && r.isPrimaryClient) {
        const t2 = e3 ? !e3.fromCache : n?.targetChanges.get(_.targetId)?.current;
        r.sharedClientState.updateQueryState(_.targetId, t2 ? "current" : "not-current");
      }
      if (e3) {
        i.push(e3);
        const t2 = __PRIVATE_LocalViewChanges.Is(_.targetId, e3);
        s.push(t2);
      }
    }));
  }), await Promise.all(o), r.Eu.J_(i), await (/* @__PURE__ */ __name(async function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
    const n2 = __PRIVATE_debugCast(e2);
    try {
      await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e3) => PersistencePromise.forEach(t2, (t3) => PersistencePromise.forEach(t3.Ps, (r2) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r2)).next(() => PersistencePromise.forEach(t3.Ts, (r2) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r2)))));
    } catch (e3) {
      if (!__PRIVATE_isIndexedDbTransactionError(e3)) throw e3;
      __PRIVATE_logDebug(Bt, "Failed to update sequence numbers: " + e3);
    }
    for (const e3 of t2) {
      const t3 = e3.targetId;
      if (!e3.fromCache) {
        const e4 = n2.Cs.get(t3), r2 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r2);
        n2.Cs = n2.Cs.insert(t3, i2);
      }
    }
  }, "__PRIVATE_localStoreNotifyLocalViewChanges"))(r.localStore, s));
}
__name(__PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore, "__PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore");
async function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  if (!n.currentUser.isEqual(t)) {
    __PRIVATE_logDebug(Xt, "User change. New user:", t.toKey());
    const e2 = await __PRIVATE_localStoreHandleUserChange(n.localStore, t);
    n.currentUser = t, // Fails tasks waiting for pending writes requested by previous user.
    (/* @__PURE__ */ __name(function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
      e3.pu.forEach((e4) => {
        e4.forEach((e5) => {
          e5.reject(new FirestoreError(D.CANCELLED, t2));
        });
      }), e3.pu.clear();
    }, "__PRIVATE_rejectOutstandingPendingWritesCallbacks"))(n, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
    n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), await __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2.Os);
  }
}
__name(__PRIVATE_syncEngineHandleCredentialChange, "__PRIVATE_syncEngineHandleCredentialChange");
function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t) {
  const n = __PRIVATE_debugCast(e), r = n.mu.get(t);
  if (r && r.Iu) return __PRIVATE_documentKeySet().add(r.key);
  {
    let e2 = __PRIVATE_documentKeySet();
    const r2 = n.Au.get(t);
    if (!r2) return e2;
    for (const t2 of r2) {
      const r3 = n.Ru.get(t2);
      e2 = e2.unionWith(r3.view.su);
    }
    return e2;
  }
}
__name(__PRIVATE_syncEngineGetRemoteKeysForTarget, "__PRIVATE_syncEngineGetRemoteKeysForTarget");
function __PRIVATE_ensureWatchCallbacks(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.Eu.J_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Eu.bu = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
}
__name(__PRIVATE_ensureWatchCallbacks, "__PRIVATE_ensureWatchCallbacks");
function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
}
__name(__PRIVATE_syncEngineEnsureWriteCallbacks, "__PRIVATE_syncEngineEnsureWriteCallbacks");
var ___PRIVATE_MemoryOfflineComponentProvider = class ___PRIVATE_MemoryOfflineComponentProvider {
  constructor() {
    this.kind = "memory", this.synchronizeTabs = false;
  }
  async initialize(e) {
    this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.Fu(e), this.persistence = this.Mu(e), await this.persistence.start(), this.localStore = this.xu(e), this.gcScheduler = this.Ou(e, this.localStore), this.indexBackfillerScheduler = this.Nu(e, this.localStore);
  }
  Ou(e, t) {
    return null;
  }
  Nu(e, t) {
    return null;
  }
  xu(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
  }
  Mu(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.Ai, this.serializer);
  }
  Fu(e) {
    return new __PRIVATE_MemorySharedClientState();
  }
  async terminate() {
    this.gcScheduler?.stop(), this.indexBackfillerScheduler?.stop(), this.sharedClientState.shutdown(), await this.persistence.shutdown();
  }
};
__name(___PRIVATE_MemoryOfflineComponentProvider, "__PRIVATE_MemoryOfflineComponentProvider");
var __PRIVATE_MemoryOfflineComponentProvider = ___PRIVATE_MemoryOfflineComponentProvider;
__PRIVATE_MemoryOfflineComponentProvider.provider = {
  build: /* @__PURE__ */ __name(() => new __PRIVATE_MemoryOfflineComponentProvider(), "build")
};
var ___PRIVATE_LruGcMemoryOfflineComponentProvider = class ___PRIVATE_LruGcMemoryOfflineComponentProvider extends __PRIVATE_MemoryOfflineComponentProvider {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  Ou(e, t) {
    __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate, 46915);
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
  }
  Mu(e) {
    const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_MemoryPersistence((e2) => __PRIVATE_MemoryLruDelegate.Ai(e2, t), this.serializer);
  }
};
__name(___PRIVATE_LruGcMemoryOfflineComponentProvider, "__PRIVATE_LruGcMemoryOfflineComponentProvider");
var __PRIVATE_LruGcMemoryOfflineComponentProvider = ___PRIVATE_LruGcMemoryOfflineComponentProvider;
var _OnlineComponentProvider = class _OnlineComponentProvider {
  async initialize(e, t) {
    this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(
      t,
      /* startAsPrimary=*/
      !e.synchronizeTabs
    ), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      1
      /* OnlineStateSource.SharedClientState */
    ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), await __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
  }
  createEventManager(e) {
    return (/* @__PURE__ */ __name(function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl();
    }, "__PRIVATE_newEventManager"))();
  }
  createDatastore(e) {
    const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = __PRIVATE_newConnection(e.databaseInfo);
    return __PRIVATE_newDatastore(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return (/* @__PURE__ */ __name(function __PRIVATE_newRemoteStore(e2, t, n, r, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t, n, r, i);
    }, "__PRIVATE_newRemoteStore"))(this.localStore, this.datastore, e.asyncQueue, (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      0
      /* OnlineStateSource.RemoteStore */
    ), (/* @__PURE__ */ __name(function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.v() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
    }, "__PRIVATE_newConnectivityMonitor"))());
  }
  createSyncEngine(e, t) {
    return (/* @__PURE__ */ __name(function __PRIVATE_newSyncEngine(e2, t2, n, r, i, s, o) {
      const _ = new __PRIVATE_SyncEngineImpl(e2, t2, n, r, i, s);
      return o && (_.wu = true), _;
    }, "__PRIVATE_newSyncEngine"))(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  async terminate() {
    await (/* @__PURE__ */ __name(async function __PRIVATE_remoteStoreShutdown(e) {
      const t = __PRIVATE_debugCast(e);
      __PRIVATE_logDebug(Ht, "RemoteStore shutting down."), t.Va.add(
        5
        /* OfflineCause.Shutdown */
      ), await __PRIVATE_disableNetworkInternal(t), t.ma.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
      // triggering spurious listener events with cached data, etc.
      t.fa.set(
        "Unknown"
        /* OnlineState.Unknown */
      );
    }, "__PRIVATE_remoteStoreShutdown"))(this.remoteStore), this.datastore?.terminate(), this.eventManager?.terminate();
  }
};
__name(_OnlineComponentProvider, "OnlineComponentProvider");
var OnlineComponentProvider = _OnlineComponentProvider;
OnlineComponentProvider.provider = {
  build: /* @__PURE__ */ __name(() => new OnlineComponentProvider(), "build")
};
var ___PRIVATE_AsyncObserver = class ___PRIVATE_AsyncObserver {
  constructor(e) {
    this.observer = e, /**
     * When set to true, will not raise future events. Necessary to deal with
     * async detachment of listener.
     */
    this.muted = false;
  }
  next(e) {
    this.muted || this.observer.next && this.Lu(this.observer.next, e);
  }
  error(e) {
    this.muted || (this.observer.error ? this.Lu(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString()));
  }
  ku() {
    this.muted = true;
  }
  Lu(e, t) {
    setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
};
__name(___PRIVATE_AsyncObserver, "__PRIVATE_AsyncObserver");
var __PRIVATE_AsyncObserver = ___PRIVATE_AsyncObserver;
var Yt = "FirestoreClient";
var _FirestoreClient = class _FirestoreClient {
  constructor(e, t, n, r, i) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this._databaseInfo = r, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this._uninitializedComponentsProvider = i, this.authCredentials.start(n, async (e2) => {
      __PRIVATE_logDebug(Yt, "Received user=", e2.uid), await this.authCredentialListener(e2), this.user = e2;
    }), this.appCheckCredentials.start(n, (e2) => (__PRIVATE_logDebug(Yt, "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this._databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100
    };
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
      try {
        this._onlineComponents && await this._onlineComponents.terminate(), this._offlineComponents && await this._offlineComponents.terminate(), // The credentials provider must be terminated after shutting down the
        // RemoteStore as it will prevent the RemoteStore from retrieving auth
        // tokens.
        this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    }), e.promise;
  }
};
__name(_FirestoreClient, "FirestoreClient");
var FirestoreClient = _FirestoreClient;
async function __PRIVATE_setOfflineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug(Yt, "Initializing OfflineComponentProvider");
  const n = e.configuration;
  await t.initialize(n);
  let r = n.initialUser;
  e.setCredentialChangeListener(async (e2) => {
    r.isEqual(e2) || (await __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r = e2);
  }), // When a user calls clearPersistence() in one client, all other clients
  // need to be terminated to allow the delete to succeed.
  t.persistence.setDatabaseDeletedListener(() => e.terminate()), e._offlineComponents = t;
}
__name(__PRIVATE_setOfflineComponentProvider, "__PRIVATE_setOfflineComponentProvider");
async function __PRIVATE_setOnlineComponentProvider(e, t) {
  e.asyncQueue.verifyOperationInProgress();
  const n = await __PRIVATE_ensureOfflineComponents(e);
  __PRIVATE_logDebug(Yt, "Initializing OnlineComponentProvider"), await t.initialize(n, e.configuration), // The CredentialChangeListener of the online component provider takes
  // precedence over the offline component provider.
  e.setCredentialChangeListener((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2)), e.setAppCheckTokenChangeListener((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2)), e._onlineComponents = t;
}
__name(__PRIVATE_setOnlineComponentProvider, "__PRIVATE_setOnlineComponentProvider");
async function __PRIVATE_ensureOfflineComponents(e) {
  if (!e._offlineComponents) if (e._uninitializedComponentsProvider) {
    __PRIVATE_logDebug(Yt, "Using user provided OfflineComponentProvider");
    try {
      await __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
    } catch (t) {
      const n = t;
      if (!(/* @__PURE__ */ __name(function __PRIVATE_canFallbackFromIndexedDbError(e2) {
        return "FirebaseError" === e2.name ? e2.code === D.FAILED_PRECONDITION || e2.code === D.UNIMPLEMENTED : !("undefined" != typeof DOMException && e2 instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
        // or an aborted error depending on whether the error happened during
        // schema migration.
        22 === e2.code || 20 === e2.code || // Firefox Private Browsing mode disables IndexedDb and returns
        // INVALID_STATE for any usage.
        11 === e2.code;
      }, "__PRIVATE_canFallbackFromIndexedDbError"))(n)) throw n;
      __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_MemoryOfflineComponentProvider());
    }
  } else __PRIVATE_logDebug(Yt, "Using default OfflineComponentProvider"), await __PRIVATE_setOfflineComponentProvider(e, new __PRIVATE_LruGcMemoryOfflineComponentProvider(void 0));
  return e._offlineComponents;
}
__name(__PRIVATE_ensureOfflineComponents, "__PRIVATE_ensureOfflineComponents");
async function __PRIVATE_ensureOnlineComponents(e) {
  return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug(Yt, "Using user provided OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug(Yt, "Using default OnlineComponentProvider"), await __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
}
__name(__PRIVATE_ensureOnlineComponents, "__PRIVATE_ensureOnlineComponents");
function __PRIVATE_getSyncEngine(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.syncEngine);
}
__name(__PRIVATE_getSyncEngine, "__PRIVATE_getSyncEngine");
async function __PRIVATE_getEventManager(e) {
  const t = await __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
  return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n.onFirstRemoteStoreListen = __PRIVATE_triggerRemoteStoreListen.bind(null, t.syncEngine), n.onLastRemoteStoreUnlisten = __PRIVATE_triggerRemoteStoreUnlisten.bind(null, t.syncEngine), n;
}
__name(__PRIVATE_getEventManager, "__PRIVATE_getEventManager");
function __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(e, t, n = {}) {
  const r = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => (/* @__PURE__ */ __name(function __PRIVATE_executeQueryViaSnapshotListener(e2, t2, n2, r2, i) {
    const s = new __PRIVATE_AsyncObserver({
      next: /* @__PURE__ */ __name((n3) => {
        s.ku(), t2.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o)), n3.fromCache && "server" === r2.source ? i.reject(new FirestoreError(D.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n3);
      }, "next"),
      error: /* @__PURE__ */ __name((e3) => i.reject(e3), "error")
    }), o = new __PRIVATE_QueryListener(n2, s, {
      includeMetadataChanges: true,
      $a: true
    });
    return __PRIVATE_eventManagerListen(e2, o);
  }, "__PRIVATE_executeQueryViaSnapshotListener"))(await __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r)), r.promise;
}
__name(__PRIVATE_firestoreClientGetDocumentsViaSnapshotListener, "__PRIVATE_firestoreClientGetDocumentsViaSnapshotListener");
function __PRIVATE_firestoreClientWrite(e, t) {
  const n = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(async () => __PRIVATE_syncEngineWrite(await __PRIVATE_getSyncEngine(e), t, n)), n.promise;
}
__name(__PRIVATE_firestoreClientWrite, "__PRIVATE_firestoreClientWrite");
function __PRIVATE_cloneLongPollingOptions(e) {
  const t = {};
  return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
}
__name(__PRIVATE_cloneLongPollingOptions, "__PRIVATE_cloneLongPollingOptions");
var en = "ComponentProvider";
var tn = /* @__PURE__ */ new Map();
function __PRIVATE_makeDatabaseInfo(e, t, n, r, i) {
  return new DatabaseInfo(e, t, n, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, r);
}
__name(__PRIVATE_makeDatabaseInfo, "__PRIVATE_makeDatabaseInfo");
var nn = "firestore.googleapis.com";
var rn = true;
var _FirestoreSettingsImpl = class _FirestoreSettingsImpl {
  constructor(e) {
    if (void 0 === e.host) {
      if (void 0 !== e.ssl) throw new FirestoreError(D.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = nn, this.ssl = rn;
    } else this.host = e.host, this.ssl = e.ssl ?? rn;
    if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes) this.cacheSizeBytes = Dt;
    else {
      if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < vt) throw new FirestoreError(D.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
      // For backwards compatibility, coerce the value to boolean even though
      // the TypeScript compiler has narrowed the type to boolean already.
      // noinspection PointlessBooleanExpressionJS
      this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
    ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), (/* @__PURE__ */ __name(function __PRIVATE_validateLongPollingOptions(e2) {
      if (void 0 !== e2.timeoutSeconds) {
        if (isNaN(e2.timeoutSeconds)) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30) throw new FirestoreError(D.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }, "__PRIVATE_validateLongPollingOptions"))(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && (/* @__PURE__ */ __name(function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    }, "__PRIVATE_longPollingOptionsEqual"))(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
};
__name(_FirestoreSettingsImpl, "FirestoreSettingsImpl");
var FirestoreSettingsImpl = _FirestoreSettingsImpl;
var _Firestore$1 = class _Firestore$1 {
  /** @hideconstructor */
  constructor(e, t, n, r) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r, /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
    // all components have shut down. Otherwise, Firestore is not terminated,
    // which can mean either the FirestoreClient is in the process of starting,
    // or restarting.
    this._terminateTask = "notTerminated";
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */
  get app() {
    if (!this._app) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return "notTerminated" !== this._terminateTask;
  }
  _setSettings(e) {
    if (this._settingsFrozen) throw new FirestoreError(D.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = (/* @__PURE__ */ __name(function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2) return new __PRIVATE_EmptyAuthCredentialsProvider();
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(D.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }, "__PRIVATE_makeAuthCredentialsProvider"))(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _getEmulatorOptions() {
    return this._emulatorOptions;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
  }
  async _restart() {
    "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
  }
  /** Returns a JSON-serializable representation of this `Firestore` instance. */
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  /**
   * Terminates all components used by this client. Subclasses can override
   * this method to clean up their own dependencies, but must also call this
   * method.
   *
   * Only ever called once.
   */
  _terminate() {
    return (/* @__PURE__ */ __name(function __PRIVATE_removeComponents(e) {
      const t = tn.get(e);
      t && (__PRIVATE_logDebug(en, "Removing Datastore"), tn.delete(e), t.terminate());
    }, "__PRIVATE_removeComponents"))(this), Promise.resolve();
  }
};
__name(_Firestore$1, "Firestore$1");
var Firestore$1 = _Firestore$1;
function connectFirestoreEmulator(e, t, n, r = {}) {
  e = __PRIVATE_cast(e, Firestore$1);
  const i = isCloudWorkstation(t), s = e._getSettings(), o = {
    ...s,
    emulatorOptions: e._getEmulatorOptions()
  }, _ = `${t}:${n}`;
  i && pingServer(`https://${_}`), s.host !== nn && s.host !== _ && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
  const a = {
    ...s,
    host: _,
    ssl: i,
    emulatorOptions: r
  };
  if (!deepEqual(a, o) && (e._setSettings(a), r.mockUserToken)) {
    let t2, n2;
    if ("string" == typeof r.mockUserToken) t2 = r.mockUserToken, n2 = User.MOCK_USER;
    else {
      t2 = createMockUserToken(r.mockUserToken, e._app?.options.projectId);
      const i2 = r.mockUserToken.sub || r.mockUserToken.user_id;
      if (!i2) throw new FirestoreError(D.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n2 = new User(i2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
  }
}
__name(connectFirestoreEmulator, "connectFirestoreEmulator");
var _Query = class _Query {
  // This is the lite version of the Query class in the main SDK.
  /** @hideconstructor protected */
  constructor(e, t, n) {
    this.converter = t, this._query = n, /** The type of this Firestore reference. */
    this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new _Query(this.firestore, e, this._query);
  }
};
__name(_Query, "Query");
var Query = _Query;
var _DocumentReference = class _DocumentReference {
  /** @hideconstructor */
  constructor(e, t, n) {
    this.converter = t, this._key = n, /** The type of this Firestore reference. */
    this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  /**
   * The document's identifier within its collection.
   */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this._key.path.canonicalString();
  }
  /**
   * The collection this `DocumentReference` belongs to.
   */
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new _DocumentReference(this.firestore, e, this._key);
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentReference` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: _DocumentReference._jsonSchemaVersion,
      referencePath: this._key.toString()
    };
  }
  static fromJSON(e, t, n) {
    if (__PRIVATE_validateJSON(t, _DocumentReference._jsonSchema)) return new _DocumentReference(e, n || null, new DocumentKey(ResourcePath.fromString(t.referencePath)));
  }
};
__name(_DocumentReference, "DocumentReference");
var DocumentReference = _DocumentReference;
DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
  type: property("string", DocumentReference._jsonSchemaVersion),
  referencePath: property("string")
};
var _CollectionReference = class _CollectionReference extends Query {
  /** @hideconstructor */
  constructor(e, t, n) {
    super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, /** The type of this Firestore reference. */
    this.type = "collection";
  }
  /** The collection's identifier. */
  get id() {
    return this._query.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path() {
    return this._query.path.canonicalString();
  }
  /**
   * A reference to the containing `DocumentReference` if this is a
   * subcollection. If this isn't a subcollection, the reference is null.
   */
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      new DocumentKey(e)
    );
  }
  withConverter(e) {
    return new _CollectionReference(this.firestore, e, this._path);
  }
};
__name(_CollectionReference, "CollectionReference");
var CollectionReference = _CollectionReference;
function collection(e, t, ...n) {
  if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
    const r = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(
      e,
      /* converter= */
      null,
      r
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateCollectionPath(r), new CollectionReference(
      e.firestore,
      /* converter= */
      null,
      r
    );
  }
}
__name(collection, "collection");
function doc(e, t, ...n) {
  if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
    const r = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateDocumentPath(r), new DocumentReference(
      e,
      /* converter= */
      null,
      new DocumentKey(r)
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new FirestoreError(D.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateDocumentPath(r), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r));
  }
}
__name(doc, "doc");
var sn = "AsyncQueue";
var ___PRIVATE_AsyncQueueImpl = class ___PRIVATE_AsyncQueueImpl {
  constructor(e = Promise.resolve()) {
    this.nc = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.rc = false, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.sc = [], // visible for testing
    this.oc = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this._c = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.ac = false, // List of TimerIds to fast-forward delays for.
    this.uc = [], // Backoff timer used to schedule retries for retryable operations
    this.F_ = new __PRIVATE_ExponentialBackoff(
      this,
      "async_queue_retry"
      /* TimerId.AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this.cc = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug(sn, "Visibility state changed to " + e2.visibilityState), this.F_.y_();
    }, this.lc = e;
    const t = getDocument();
    t && "function" == typeof t.addEventListener && t.addEventListener("visibilitychange", this.cc);
  }
  get isShuttingDown() {
    return this.rc;
  }
  /**
   * Adds a new operation to the queue without waiting for it to complete (i.e.
   * we ignore the Promise result).
   */
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.hc(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.Pc(e);
  }
  enterRestrictedMode(e) {
    if (!this.rc) {
      this.rc = true, this.ac = e || false;
      const t = getDocument();
      t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.cc);
    }
  }
  enqueue(e) {
    if (this.hc(), this.rc)
      return new Promise(() => {
      });
    const t = new __PRIVATE_Deferred();
    return this.Pc(() => this.rc && this.ac ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.nc.push(e), this.Tc()));
  }
  /**
   * Runs the next operation from the retryable queue. If the operation fails,
   * reschedules with backoff.
   */
  async Tc() {
    if (0 !== this.nc.length) {
      try {
        await this.nc[0](), this.nc.shift(), this.F_.reset();
      } catch (e) {
        if (!__PRIVATE_isIndexedDbTransactionError(e)) throw e;
        __PRIVATE_logDebug(sn, "Operation failed with retryable error: " + e);
      }
      this.nc.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
      // This is necessary to run retryable operations that failed during
      // their initial attempt since we don't know whether they are already
      // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
      // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
      // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
      // call scheduled here.
      // Since `backoffAndRun()` cancels an existing backoff and schedules a
      // new backoff on every call, there is only ever a single additional
      // operation in the queue.
      this.F_.g_(() => this.Tc());
    }
  }
  Pc(e) {
    const t = this.lc.then(() => (this._c = true, e().catch((e2) => {
      this.oc = e2, this._c = false;
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", __PRIVATE_getMessageOrStack(e2)), e2;
    }).then((e2) => (this._c = false, e2))));
    return this.lc = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.hc(), // Fast-forward delays for timerIds that have been overridden.
    this.uc.indexOf(e) > -1 && (t = 0);
    const r = DelayedOperation.createAndSchedule(this, e, t, n, (e2) => this.Ic(e2));
    return this.sc.push(r), r;
  }
  hc() {
    this.oc && fail(47125, {
      Ec: __PRIVATE_getMessageOrStack(this.oc)
    });
  }
  verifyOperationInProgress() {
  }
  /**
   * Waits until all currently queued tasks are finished executing. Delayed
   * operations are not run.
   */
  async Rc() {
    let e;
    do {
      e = this.lc, await e;
    } while (e !== this.lc);
  }
  /**
   * For Tests: Determine if a delayed operation with a particular TimerId
   * exists.
   */
  Ac(e) {
    for (const t of this.sc) if (t.timerId === e) return true;
    return false;
  }
  /**
   * For Tests: Runs some or all delayed operations early.
   *
   * @param lastTimerId - Delayed operations up to and including this TimerId
   * will be drained. Pass TimerId.All to run all delayed operations.
   * @returns a Promise that resolves once all operations have been run.
   */
  Vc(e) {
    return this.Rc().then(() => {
      this.sc.sort((e2, t) => e2.targetTimeMs - t.targetTimeMs);
      for (const t of this.sc) if (t.skipDelay(), "all" !== e && t.timerId === e) break;
      return this.Rc();
    });
  }
  /**
   * For Tests: Skip all subsequent delays for a timer id.
   */
  dc(e) {
    this.uc.push(e);
  }
  /** Called once a DelayedOperation is run or canceled. */
  Ic(e) {
    const t = this.sc.indexOf(e);
    this.sc.splice(t, 1);
  }
};
__name(___PRIVATE_AsyncQueueImpl, "__PRIVATE_AsyncQueueImpl");
var __PRIVATE_AsyncQueueImpl = ___PRIVATE_AsyncQueueImpl;
function __PRIVATE_getMessageOrStack(e) {
  let t = e.message || "";
  return e.stack && (t = e.stack.includes(e.message) ? e.stack : e.message + "\n" + e.stack), t;
}
__name(__PRIVATE_getMessageOrStack, "__PRIVATE_getMessageOrStack");
var _Firestore = class _Firestore extends Firestore$1 {
  /** @hideconstructor */
  constructor(e, t, n, r) {
    super(e, t, n, r), /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    this.type = "firestore", this._queue = new __PRIVATE_AsyncQueueImpl(), this._persistenceKey = r?.name || "[DEFAULT]";
  }
  async _terminate() {
    if (this._firestoreClient) {
      const e = this._firestoreClient.terminate();
      this._queue = new __PRIVATE_AsyncQueueImpl(e), this._firestoreClient = void 0, await e;
    }
  }
};
__name(_Firestore, "Firestore");
var Firestore = _Firestore;
function getFirestore(e, n) {
  const r = "object" == typeof e ? e : getApp(), i = "string" == typeof e ? e : n || it, s = _getProvider(r, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e2 = getDefaultEmulatorHostnameAndPort("firestore");
    e2 && connectFirestoreEmulator(s, ...e2);
  }
  return s;
}
__name(getFirestore, "getFirestore");
function ensureFirestoreConfigured(e) {
  if (e._terminated) throw new FirestoreError(D.FAILED_PRECONDITION, "The client has already been terminated.");
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient;
}
__name(ensureFirestoreConfigured, "ensureFirestoreConfigured");
function __PRIVATE_configureFirestore(e) {
  const t = e._freezeSettings(), n = __PRIVATE_makeDatabaseInfo(e._databaseId, e._app?.options.appId || "", e._persistenceKey, e._app?.options.apiKey, t);
  e._componentsProvider || t.localCache?._offlineComponentProvider && t.localCache?._onlineComponentProvider && (e._componentsProvider = {
    _offline: t.localCache._offlineComponentProvider,
    _online: t.localCache._onlineComponentProvider
  }), e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, n, e._componentsProvider && (/* @__PURE__ */ __name(function __PRIVATE_buildComponentProvider(e2) {
    const t2 = e2?._online.build();
    return {
      _offline: e2?._offline.build(t2),
      _online: t2
    };
  }, "__PRIVATE_buildComponentProvider"))(e._componentsProvider));
}
__name(__PRIVATE_configureFirestore, "__PRIVATE_configureFirestore");
var _Bytes = class _Bytes {
  /** @hideconstructor */
  constructor(e) {
    this._byteString = e;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */
  static fromBase64String(e) {
    try {
      return new _Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(D.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  /**
   * Creates a new `Bytes` object from the given Uint8Array.
   *
   * @param array - The Uint8Array used to create the `Bytes` object.
   */
  static fromUint8Array(e) {
    return new _Bytes(ByteString.fromUint8Array(e));
  }
  /**
   * Returns the underlying bytes as a Base64-encoded string.
   *
   * @returns The Base64-encoded string created from the `Bytes` object.
   */
  toBase64() {
    return this._byteString.toBase64();
  }
  /**
   * Returns the underlying bytes in a new `Uint8Array`.
   *
   * @returns The Uint8Array created from the `Bytes` object.
   */
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  /**
   * Returns a string representation of the `Bytes` object.
   *
   * @returns A string representation of the `Bytes` object.
   */
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  /**
   * Returns true if this `Bytes` object is equal to the provided one.
   *
   * @param other - The `Bytes` object to compare against.
   * @returns true if this `Bytes` object is equal to the provided one.
   */
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
  /**
   * Returns a JSON-serializable representation of this `Bytes` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: _Bytes._jsonSchemaVersion,
      bytes: this.toBase64()
    };
  }
  /**
   * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
   *
   * @param json - a JSON object represention of a `Bytes` instance
   * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, _Bytes._jsonSchema)) return _Bytes.fromBase64String(e.bytes);
  }
};
__name(_Bytes, "Bytes");
var Bytes = _Bytes;
Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
  type: property("string", Bytes._jsonSchemaVersion),
  bytes: property("string")
};
var _FieldPath = class _FieldPath {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  constructor(...e) {
    for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
};
__name(_FieldPath, "FieldPath");
var FieldPath = _FieldPath;
var _FieldValue = class _FieldValue {
  /**
   * @param _methodName - The public API endpoint that returns this class.
   * @hideconstructor
   */
  constructor(e) {
    this._methodName = e;
  }
};
__name(_FieldValue, "FieldValue");
var FieldValue = _FieldValue;
var _GeoPoint = class _GeoPoint {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90) throw new FirestoreError(D.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180) throw new FirestoreError(D.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */
  get latitude() {
    return this._lat;
  }
  /**
   * The longitude of this `GeoPoint` instance.
   */
  get longitude() {
    return this._long;
  }
  /**
   * Returns true if this `GeoPoint` is equal to the provided one.
   *
   * @param other - The `GeoPoint` to compare against.
   * @returns true if this `GeoPoint` is equal to the provided one.
   */
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  /**
   * Actually private to JS consumers of our API, so this function is prefixed
   * with an underscore.
   */
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
  /**
   * Returns a JSON-serializable representation of this `GeoPoint` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long,
      type: _GeoPoint._jsonSchemaVersion
    };
  }
  /**
   * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
   *
   * @param json - a JSON object represention of a `GeoPoint` instance
   * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, _GeoPoint._jsonSchema)) return new _GeoPoint(e.latitude, e.longitude);
  }
};
__name(_GeoPoint, "GeoPoint");
var GeoPoint = _GeoPoint;
GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
  type: property("string", GeoPoint._jsonSchemaVersion),
  latitude: property("number"),
  longitude: property("number")
};
var _VectorValue = class _VectorValue {
  /**
   * @private
   * @internal
   */
  constructor(e) {
    this._values = (e || []).map((e2) => e2);
  }
  /**
   * Returns a copy of the raw number array form of the vector.
   */
  toArray() {
    return this._values.map((e) => e);
  }
  /**
   * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
   */
  isEqual(e) {
    return (/* @__PURE__ */ __name(function __PRIVATE_isPrimitiveArrayEqual(e2, t) {
      if (e2.length !== t.length) return false;
      for (let n = 0; n < e2.length; ++n) if (e2[n] !== t[n]) return false;
      return true;
    }, "__PRIVATE_isPrimitiveArrayEqual"))(this._values, e._values);
  }
  /**
   * Returns a JSON-serializable representation of this `VectorValue` instance.
   *
   * @returns a JSON representation of this object.
   */
  toJSON() {
    return {
      type: _VectorValue._jsonSchemaVersion,
      vectorValues: this._values
    };
  }
  /**
   * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
   *
   * @param json - a JSON object represention of a `VectorValue` instance.
   * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
   * {@link FirestoreError} if an error occurs.
   */
  static fromJSON(e) {
    if (__PRIVATE_validateJSON(e, _VectorValue._jsonSchema)) {
      if (Array.isArray(e.vectorValues) && e.vectorValues.every((e2) => "number" == typeof e2)) return new _VectorValue(e.vectorValues);
      throw new FirestoreError(D.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
    }
  }
};
__name(_VectorValue, "VectorValue");
var VectorValue = _VectorValue;
VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
  type: property("string", VectorValue._jsonSchemaVersion),
  vectorValues: property("object")
};
var _n = /^__.*__$/;
var _ParsedSetData = class _ParsedSetData {
  constructor(e, t, n) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = n;
  }
  toMutation(e, t) {
    return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
  }
};
__name(_ParsedSetData, "ParsedSetData");
var ParsedSetData = _ParsedSetData;
function __PRIVATE_isWrite(e) {
  switch (e) {
    case 0:
    case 2:
    case 1:
      return true;
    case 3:
    case 4:
      return false;
    default:
      throw fail(40011, {
        dataSource: e
      });
  }
}
__name(__PRIVATE_isWrite, "__PRIVATE_isWrite");
var ___PRIVATE_ParseContextImpl = class ___PRIVATE_ParseContextImpl {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  constructor(e, t, n, r, i, s) {
    this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    void 0 === i && this.mc(), this.fieldTransforms = i || [], this.fieldMask = s || [];
  }
  get path() {
    return this.settings.path;
  }
  get dataSource() {
    return this.settings.dataSource;
  }
  /** Returns a new context with the specified settings overwritten. */
  i(e) {
    return new ___PRIVATE_ParseContextImpl({
      ...this.settings,
      ...e
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  gc(e) {
    const t = this.path?.child(e), n = this.i({
      path: t,
      arrayElement: false
    });
    return n.yc(e), n;
  }
  wc(e) {
    const t = this.path?.child(e), n = this.i({
      path: t,
      arrayElement: false
    });
    return n.mc(), n;
  }
  Sc(e) {
    return this.i({
      path: void 0,
      arrayElement: true
    });
  }
  bc(e) {
    return __PRIVATE_createError(e, this.settings.methodName, this.settings.hasConverter || false, this.path, this.settings.targetDoc);
  }
  /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
  contains(e) {
    return void 0 !== this.fieldMask.find((t) => e.isPrefixOf(t)) || void 0 !== this.fieldTransforms.find((t) => e.isPrefixOf(t.field));
  }
  mc() {
    if (this.path) for (let e = 0; e < this.path.length; e++) this.yc(this.path.get(e));
  }
  yc(e) {
    if (0 === e.length) throw this.bc("Document fields must not be empty");
    if (__PRIVATE_isWrite(this.dataSource) && _n.test(e)) throw this.bc('Document fields cannot begin and end with "__"');
  }
};
__name(___PRIVATE_ParseContextImpl, "__PRIVATE_ParseContextImpl");
var __PRIVATE_ParseContextImpl = ___PRIVATE_ParseContextImpl;
var ___PRIVATE_UserDataReader = class ___PRIVATE_UserDataReader {
  constructor(e, t, n) {
    this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
  }
  /** Creates a new top-level parse context. */
  V(e, t, n, r = false) {
    return new __PRIVATE_ParseContextImpl({
      dataSource: e,
      methodName: t,
      targetDoc: n,
      path: FieldPath$1.emptyPath(),
      arrayElement: false,
      hasConverter: r
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
};
__name(___PRIVATE_UserDataReader, "__PRIVATE_UserDataReader");
var __PRIVATE_UserDataReader = ___PRIVATE_UserDataReader;
function __PRIVATE_newUserDataReader(e) {
  const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
  return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
__name(__PRIVATE_newUserDataReader, "__PRIVATE_newUserDataReader");
function __PRIVATE_parseSetData(e, t, n, r, i, s = {}) {
  const o = e.V(s.merge || s.mergeFields ? 2 : 0, t, n, i);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r);
  const _ = __PRIVATE_parseObject(r, o);
  let a, u;
  if (s.merge) a = new FieldMask(o.fieldMask), u = o.fieldTransforms;
  else if (s.mergeFields) {
    const e2 = [];
    for (const r2 of s.mergeFields) {
      const i2 = __PRIVATE_fieldPathFromArgument(t, r2, n);
      if (!o.contains(i2)) throw new FirestoreError(D.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
      __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
    }
    a = new FieldMask(e2), u = o.fieldTransforms.filter((e3) => a.covers(e3.field));
  } else a = null, u = o.fieldTransforms;
  return new ParsedSetData(new ObjectValue(_), a, u);
}
__name(__PRIVATE_parseSetData, "__PRIVATE_parseSetData");
var ___PRIVATE_ServerTimestampFieldValueImpl = class ___PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
  _toFieldTransform(e) {
    return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform());
  }
  isEqual(e) {
    return e instanceof ___PRIVATE_ServerTimestampFieldValueImpl;
  }
};
__name(___PRIVATE_ServerTimestampFieldValueImpl, "__PRIVATE_ServerTimestampFieldValueImpl");
var __PRIVATE_ServerTimestampFieldValueImpl = ___PRIVATE_ServerTimestampFieldValueImpl;
function __PRIVATE_parseQueryValue(e, t, n, r = false) {
  return __PRIVATE_parseData(n, e.V(r ? 4 : 3, t));
}
__name(__PRIVATE_parseQueryValue, "__PRIVATE_parseQueryValue");
function __PRIVATE_parseData(e, t) {
  if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = getModularInstance(e)
  )) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
  if (e instanceof FieldValue)
    return (/* @__PURE__ */ __name(function __PRIVATE_parseSentinelFieldValue(e2, t2) {
      if (!__PRIVATE_isWrite(t2.dataSource)) throw t2.bc(`${e2._methodName}() can only be used with update() and set()`);
      if (!t2.path) throw t2.bc(`${e2._methodName}() is not currently supported inside arrays`);
      const n = e2._toFieldTransform(t2);
      n && t2.fieldTransforms.push(n);
    }, "__PRIVATE_parseSentinelFieldValue"))(e, t), null;
  if (void 0 === e && t.ignoreUndefinedProperties)
    return null;
  if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t.path && t.fieldMask.push(t.path), e instanceof Array
  ) {
    if (t.settings.arrayElement && 4 !== t.dataSource) throw t.bc("Nested arrays are not supported");
    return (/* @__PURE__ */ __name(function __PRIVATE_parseArray(e2, t2) {
      const n = [];
      let r = 0;
      for (const i of e2) {
        let e3 = __PRIVATE_parseData(i, t2.Sc(r));
        null == e3 && // Just include nulls in the array for fields being replaced with a
        // sentinel.
        (e3 = {
          nullValue: "NULL_VALUE"
        }), n.push(e3), r++;
      }
      return {
        arrayValue: {
          values: n
        }
      };
    }, "__PRIVATE_parseArray"))(e, t);
  }
  return (/* @__PURE__ */ __name(function __PRIVATE_parseScalarValue(e2, t2) {
    if (null === (e2 = getModularInstance(e2))) return {
      nullValue: "NULL_VALUE"
    };
    if ("number" == typeof e2) return toNumber(t2.serializer, e2);
    if ("boolean" == typeof e2) return {
      booleanValue: e2
    };
    if ("string" == typeof e2) return {
      stringValue: e2
    };
    if (e2 instanceof Date) {
      const n = Timestamp.fromDate(e2);
      return {
        timestampValue: toTimestamp(t2.serializer, n)
      };
    }
    if (e2 instanceof Timestamp) {
      const n = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
      return {
        timestampValue: toTimestamp(t2.serializer, n)
      };
    }
    if (e2 instanceof GeoPoint) return {
      geoPointValue: {
        latitude: e2.latitude,
        longitude: e2.longitude
      }
    };
    if (e2 instanceof Bytes) return {
      bytesValue: __PRIVATE_toBytes(t2.serializer, e2._byteString)
    };
    if (e2 instanceof DocumentReference) {
      const n = t2.databaseId, r = e2.firestore._databaseId;
      if (!r.isEqual(n)) throw t2.bc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
      return {
        referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t2.databaseId, e2._key.path)
      };
    }
    if (e2 instanceof VectorValue)
      return (/* @__PURE__ */ __name(function __PRIVATE_parseVectorValue(e3, t3) {
        const n = e3 instanceof VectorValue ? e3.toArray() : e3, r = {
          fields: {
            [st]: {
              stringValue: at
            },
            [ut]: {
              arrayValue: {
                values: n.map((e4) => {
                  if ("number" != typeof e4) throw t3.bc("VectorValues must only contain numeric values.");
                  return __PRIVATE_toDouble(t3.serializer, e4);
                })
              }
            }
          }
        };
        return {
          mapValue: r
        };
      }, "__PRIVATE_parseVectorValue"))(e2, t2);
    if (__PRIVATE_isProtoValueSerializable(e2)) return e2._toProto(t2.serializer);
    throw t2.bc(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
  }, "__PRIVATE_parseScalarValue"))(e, t);
}
__name(__PRIVATE_parseData, "__PRIVATE_parseData");
function __PRIVATE_parseObject(e, t) {
  const n = {};
  return isEmpty(e) ? (
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t.path && t.path.length > 0 && t.fieldMask.push(t.path)
  ) : forEach(e, (e2, r) => {
    const i = __PRIVATE_parseData(r, t.gc(e2));
    null != i && (n[e2] = i);
  }), {
    mapValue: {
      fields: n
    }
  };
}
__name(__PRIVATE_parseObject, "__PRIVATE_parseObject");
function __PRIVATE_looksLikeJsonObject(e) {
  return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || __PRIVATE_isProtoValueSerializable(e));
}
__name(__PRIVATE_looksLikeJsonObject, "__PRIVATE_looksLikeJsonObject");
function __PRIVATE_validatePlainObject(e, t, n) {
  if (!__PRIVATE_looksLikeJsonObject(n) || !__PRIVATE_isPlainObject(n)) {
    const r = __PRIVATE_valueDescription(n);
    throw "an object" === r ? t.bc(e + " a custom object") : t.bc(e + " " + r);
  }
}
__name(__PRIVATE_validatePlainObject, "__PRIVATE_validatePlainObject");
function __PRIVATE_fieldPathFromArgument(e, t, n) {
  if (
    // If required, replace the FieldPath Compat class with the firestore-exp
    // FieldPath.
    (t = getModularInstance(t)) instanceof FieldPath
  ) return t._internalPath;
  if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
  throw __PRIVATE_createError(
    "Field path arguments must be of type string or ",
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n
  );
}
__name(__PRIVATE_fieldPathFromArgument, "__PRIVATE_fieldPathFromArgument");
var an = new RegExp("[~\\*/\\[\\]]");
function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
  if (t.search(an) >= 0) throw __PRIVATE_createError(
    `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n
  );
  try {
    return new FieldPath(...t.split("."))._internalPath;
  } catch (r) {
    throw __PRIVATE_createError(
      `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  }
}
__name(__PRIVATE_fieldPathFromDotSeparatedString, "__PRIVATE_fieldPathFromDotSeparatedString");
function __PRIVATE_createError(e, t, n, r, i) {
  const s = r && !r.isEmpty(), o = void 0 !== i;
  let _ = `Function ${t}() called with invalid data`;
  n && (_ += " (via `toFirestore()`)"), _ += ". ";
  let a = "";
  return (s || o) && (a += " (found", s && (a += ` in field ${r}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(D.INVALID_ARGUMENT, _ + e + a);
}
__name(__PRIVATE_createError, "__PRIVATE_createError");
function __PRIVATE_fieldMaskContains(e, t) {
  return e.some((e2) => e2.isEqual(t));
}
__name(__PRIVATE_fieldMaskContains, "__PRIVATE_fieldMaskContains");
var _AbstractUserDataWriter = class _AbstractUserDataWriter {
  convertValue(e, t = "none") {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 11:
        return this.convertObject(e.mapValue, t);
      case 10:
        return this.convertVectorValue(e.mapValue);
      default:
        throw fail(62114, {
          value: e
        });
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  /**
   * @internal
   */
  convertObjectMap(e, t = "none") {
    const n = {};
    return forEach(e, (e2, r) => {
      n[e2] = this.convertValue(r, t);
    }), n;
  }
  /**
   * @internal
   */
  convertVectorValue(e) {
    const t = e.fields?.[ut].arrayValue?.values?.map((e2) => __PRIVATE_normalizeNumber(e2.doubleValue));
    return new VectorValue(t);
  }
  convertGeoPoint(e) {
    return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map((e2) => this.convertValue(e2, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const n = __PRIVATE_getPreviousValue(e);
        return null == n ? null : this.convertValue(n, t);
      case "estimate":
        return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = __PRIVATE_normalizeTimestamp(e);
    return new Timestamp(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const n = ResourcePath.fromString(e);
    __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n), 9688, {
      name: e
    });
    const r = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
    return r.isEqual(t) || // TODO(b/64130202): Somehow support foreign references.
    __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
  }
};
__name(_AbstractUserDataWriter, "AbstractUserDataWriter");
var AbstractUserDataWriter = _AbstractUserDataWriter;
var ___PRIVATE_ExpUserDataWriter = class ___PRIVATE_ExpUserDataWriter extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      t
    );
  }
};
__name(___PRIVATE_ExpUserDataWriter, "__PRIVATE_ExpUserDataWriter");
var __PRIVATE_ExpUserDataWriter = ___PRIVATE_ExpUserDataWriter;
function serverTimestamp() {
  return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
}
__name(serverTimestamp, "serverTimestamp");

// node_modules/@firebase/firestore/dist/index.esm.js
var Ut = "@firebase/firestore";
var Ht2 = "4.15.0";
var _DocumentSnapshot$1 = class _DocumentSnapshot$1 {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.
  /** @hideconstructor protected */
  constructor(t, e, n, r, s) {
    this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, this._converter = s;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * The `DocumentReference` for the document included in the `DocumentSnapshot`.
   */
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  /**
   * Signals whether or not the document at the snapshot's location exists.
   *
   * @returns true if the document exists.
   */
  exists() {
    return null !== this._document;
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  data() {
    if (this._document) {
      if (this._converter) {
        const t = new QueryDocumentSnapshot$1(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(t);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  /**
   * @internal
   * @private
   *
   * Retrieves all fields in the document as a proto Value. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  _fieldsProto() {
    return this._document?.data.clone().value.mapValue.fields ?? void 0;
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t) {
    if (this._document) {
      const e = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
      if (null !== e) return this._userDataWriter.convertValue(e);
    }
  }
};
__name(_DocumentSnapshot$1, "DocumentSnapshot$1");
var DocumentSnapshot$1 = _DocumentSnapshot$1;
var _QueryDocumentSnapshot$1 = class _QueryDocumentSnapshot$1 extends DocumentSnapshot$1 {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * @override
   * @returns An `Object` containing all fields in the document.
   */
  data() {
    return super.data();
  }
};
__name(_QueryDocumentSnapshot$1, "QueryDocumentSnapshot$1");
var QueryDocumentSnapshot$1 = _QueryDocumentSnapshot$1;
function __PRIVATE_validateHasExplicitOrderByForLimitToLast(t) {
  if ("L" === t.limitType && 0 === t.explicitOrderBy.length) throw new FirestoreError(D.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
__name(__PRIVATE_validateHasExplicitOrderByForLimitToLast, "__PRIVATE_validateHasExplicitOrderByForLimitToLast");
var _AppliableConstraint = class _AppliableConstraint {
};
__name(_AppliableConstraint, "AppliableConstraint");
var AppliableConstraint = _AppliableConstraint;
var _QueryConstraint = class _QueryConstraint extends AppliableConstraint {
};
__name(_QueryConstraint, "QueryConstraint");
var QueryConstraint = _QueryConstraint;
function query(t, e, ...n) {
  let r = [];
  e instanceof AppliableConstraint && r.push(e), r = r.concat(n), (/* @__PURE__ */ __name(function __PRIVATE_validateQueryConstraintArray(t2) {
    const e2 = t2.filter((t3) => t3 instanceof QueryCompositeFilterConstraint).length, n2 = t2.filter((t3) => t3 instanceof QueryFieldFilterConstraint).length;
    if (e2 > 1 || e2 > 0 && n2 > 0) throw new FirestoreError(D.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
  }, "__PRIVATE_validateQueryConstraintArray"))(r);
  for (const e2 of r) t = e2._apply(t);
  return t;
}
__name(query, "query");
var _QueryFieldFilterConstraint = class _QueryFieldFilterConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(t, e, n) {
    super(), this._field = t, this._op = e, this._value = n, /** The type of this query constraint */
    this.type = "where";
  }
  static _create(t, e, n) {
    return new _QueryFieldFilterConstraint(t, e, n);
  }
  _apply(t) {
    const e = this._parse(t);
    return __PRIVATE_validateNewFieldFilter(t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e));
  }
  _parse(t) {
    const e = __PRIVATE_newUserDataReader(t.firestore), n = (/* @__PURE__ */ __name(function __PRIVATE_newQueryFilter(t2, e2, n2, r, s, a, o) {
      let i;
      if (s.isKeyField()) {
        if ("array-contains" === a || "array-contains-any" === a) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid Query. You can't perform '${a}' queries on documentId().`);
        if ("in" === a || "not-in" === a) {
          __PRIVATE_validateDisjunctiveFilterElements(o, a);
          const e3 = [];
          for (const n3 of o) e3.push(__PRIVATE_parseDocumentIdValue(r, t2, n3));
          i = {
            arrayValue: {
              values: e3
            }
          };
        } else i = __PRIVATE_parseDocumentIdValue(r, t2, o);
      } else "in" !== a && "not-in" !== a && "array-contains-any" !== a || __PRIVATE_validateDisjunctiveFilterElements(o, a), i = __PRIVATE_parseQueryValue(
        n2,
        e2,
        o,
        /* allowArrays= */
        "in" === a || "not-in" === a
      );
      const c = FieldFilter.create(s, a, i);
      return c;
    }, "__PRIVATE_newQueryFilter"))(t._query, "where", e, t.firestore._databaseId, this._field, this._op, this._value);
    return n;
  }
};
__name(_QueryFieldFilterConstraint, "QueryFieldFilterConstraint");
var QueryFieldFilterConstraint = _QueryFieldFilterConstraint;
function where(t, e, n) {
  const r = e, s = __PRIVATE_fieldPathFromArgument("where", t);
  return QueryFieldFilterConstraint._create(s, r, n);
}
__name(where, "where");
var _QueryCompositeFilterConstraint = class _QueryCompositeFilterConstraint extends AppliableConstraint {
  /**
   * @internal
   */
  constructor(t, e) {
    super(), this.type = t, this._queryConstraints = e;
  }
  static _create(t, e) {
    return new _QueryCompositeFilterConstraint(t, e);
  }
  _parse(t) {
    const e = this._queryConstraints.map((e2) => e2._parse(t)).filter((t2) => t2.getFilters().length > 0);
    return 1 === e.length ? e[0] : CompositeFilter.create(e, this._getOperator());
  }
  _apply(t) {
    const e = this._parse(t);
    return 0 === e.getFilters().length ? t : ((/* @__PURE__ */ __name(function __PRIVATE_validateNewFilter(t2, e2) {
      let n = t2;
      const r = e2.getFlattenedFilters();
      for (const t3 of r) __PRIVATE_validateNewFieldFilter(n, t3), n = __PRIVATE_queryWithAddedFilter(n, t3);
    }, "__PRIVATE_validateNewFilter"))(t._query, e), new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedFilter(t._query, e)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return "and" === this.type ? "and" : "or";
  }
};
__name(_QueryCompositeFilterConstraint, "QueryCompositeFilterConstraint");
var QueryCompositeFilterConstraint = _QueryCompositeFilterConstraint;
var _QueryOrderByConstraint = class _QueryOrderByConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(t, e) {
    super(), this._field = t, this._direction = e, /** The type of this query constraint */
    this.type = "orderBy";
  }
  static _create(t, e) {
    return new _QueryOrderByConstraint(t, e);
  }
  _apply(t) {
    const e = (/* @__PURE__ */ __name(function __PRIVATE_newQueryOrderBy(t2, e2, n) {
      if (null !== t2.startAt) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
      if (null !== t2.endAt) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
      const r = new OrderBy(e2, n);
      return r;
    }, "__PRIVATE_newQueryOrderBy"))(t._query, this._field, this._direction);
    return new Query(t.firestore, t.converter, __PRIVATE_queryWithAddedOrderBy(t._query, e));
  }
};
__name(_QueryOrderByConstraint, "QueryOrderByConstraint");
var QueryOrderByConstraint = _QueryOrderByConstraint;
function orderBy(t, e = "asc") {
  const n = e, r = __PRIVATE_fieldPathFromArgument("orderBy", t);
  return QueryOrderByConstraint._create(r, n);
}
__name(orderBy, "orderBy");
var _QueryLimitConstraint = class _QueryLimitConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(t, e, n) {
    super(), this.type = t, this._limit = e, this._limitType = n;
  }
  static _create(t, e, n) {
    return new _QueryLimitConstraint(t, e, n);
  }
  _apply(t) {
    return new Query(t.firestore, t.converter, __PRIVATE_queryWithLimit(t._query, this._limit, this._limitType));
  }
};
__name(_QueryLimitConstraint, "QueryLimitConstraint");
var QueryLimitConstraint = _QueryLimitConstraint;
function limit(t) {
  return __PRIVATE_validatePositiveNumber("limit", t), QueryLimitConstraint._create(
    "limit",
    t,
    "F"
    /* LimitType.First */
  );
}
__name(limit, "limit");
function __PRIVATE_parseDocumentIdValue(t, e, n) {
  if ("string" == typeof (n = getModularInstance(n))) {
    if ("" === n) throw new FirestoreError(D.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!__PRIVATE_isCollectionGroupQuery(e) && -1 !== n.indexOf("/")) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
    const r = e.path.child(ResourcePath.fromString(n));
    if (!DocumentKey.isDocumentKey(r)) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);
    return __PRIVATE_refValue(t, new DocumentKey(r));
  }
  if (n instanceof DocumentReference) return __PRIVATE_refValue(t, n._key);
  throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n)}.`);
}
__name(__PRIVATE_parseDocumentIdValue, "__PRIVATE_parseDocumentIdValue");
function __PRIVATE_validateDisjunctiveFilterElements(t, e) {
  if (!Array.isArray(t) || 0 === t.length) throw new FirestoreError(D.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${e.toString()}' filters.`);
}
__name(__PRIVATE_validateDisjunctiveFilterElements, "__PRIVATE_validateDisjunctiveFilterElements");
function __PRIVATE_validateNewFieldFilter(t, e) {
  const n = (/* @__PURE__ */ __name(function __PRIVATE_findOpInsideFilters(t2, e2) {
    for (const n2 of t2) for (const t3 of n2.getFlattenedFilters()) if (e2.indexOf(t3.op) >= 0) return t3.op;
    return null;
  }, "__PRIVATE_findOpInsideFilters"))(t.filters, (/* @__PURE__ */ __name(function __PRIVATE_conflictingOps(t2) {
    switch (t2) {
      case "!=":
        return [
          "!=",
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "array-contains-any":
      case "in":
        return [
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "not-in":
        return [
          "array-contains-any",
          "in",
          "not-in",
          "!="
          /* Operator.NOT_EQUAL */
        ];
      default:
        return [];
    }
  }, "__PRIVATE_conflictingOps"))(e.op));
  if (null !== n)
    throw n === e.op ? new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new FirestoreError(D.INVALID_ARGUMENT, `Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`);
}
__name(__PRIVATE_validateNewFieldFilter, "__PRIVATE_validateNewFieldFilter");
function __PRIVATE_applyFirestoreDataConverter(t, e, n) {
  let r;
  return r = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, r;
}
__name(__PRIVATE_applyFirestoreDataConverter, "__PRIVATE_applyFirestoreDataConverter");
var _SnapshotMetadata = class _SnapshotMetadata {
  /** @hideconstructor */
  constructor(t, e) {
    this.hasPendingWrites = t, this.fromCache = e;
  }
  /**
   * Returns true if this `SnapshotMetadata` is equal to the provided one.
   *
   * @param other - The `SnapshotMetadata` to compare against.
   * @returns true if this `SnapshotMetadata` is equal to the provided one.
   */
  isEqual(t) {
    return this.hasPendingWrites === t.hasPendingWrites && this.fromCache === t.fromCache;
  }
};
__name(_SnapshotMetadata, "SnapshotMetadata");
var SnapshotMetadata = _SnapshotMetadata;
var _DocumentSnapshot = class _DocumentSnapshot extends DocumentSnapshot$1 {
  /** @hideconstructor protected */
  constructor(t, e, n, r, s, a) {
    super(t, e, n, r, a), this._firestore = t, this._firestoreImpl = t, this.metadata = s;
  }
  /**
   * Returns whether or not the data exists. True if the document exists.
   */
  exists() {
    return super.exists();
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document or `undefined` if
   * the document doesn't exist.
   */
  data(t = {}) {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(e, t);
      }
      return this._userDataWriter.convertValue(this._document.data.value, t.serverTimestamps);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * By default, a `serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @param options - An options object to configure how the field is retrieved
   * from the snapshot (for example the desired behavior for server timestamps
   * that have not yet been set to their final value).
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(t, e = {}) {
    if (this._document) {
      const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", t));
      if (null !== n) return this._userDataWriter.convertValue(n, e.serverTimestamps);
    }
  }
  /**
   * Returns a JSON-serializable representation of this `DocumentSnapshot` instance.
   *
   * @returns a JSON representation of this object.  Throws a {@link FirestoreError} if this
   * `DocumentSnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t = this._document, e = {};
    if (e.type = _DocumentSnapshot._jsonSchemaVersion, e.bundle = "", e.bundleSource = "DocumentSnapshot", e.bundleName = this._key.toString(), !t || !t.isValidDocument() || !t.isFoundDocument()) return e;
    this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields, "previous");
    return e.bundle = (this._firestore, this.ref.path, "NOT SUPPORTED"), e;
  }
};
__name(_DocumentSnapshot, "DocumentSnapshot");
var DocumentSnapshot = _DocumentSnapshot;
DocumentSnapshot._jsonSchemaVersion = "firestore/documentSnapshot/1.0", DocumentSnapshot._jsonSchema = {
  type: property("string", DocumentSnapshot._jsonSchemaVersion),
  bundleSource: property("string", "DocumentSnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
var _QueryDocumentSnapshot = class _QueryDocumentSnapshot extends DocumentSnapshot {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document.
   */
  data(t = {}) {
    return super.data(t);
  }
};
__name(_QueryDocumentSnapshot, "QueryDocumentSnapshot");
var QueryDocumentSnapshot = _QueryDocumentSnapshot;
var _QuerySnapshot = class _QuerySnapshot {
  /** @hideconstructor */
  constructor(t, e, n, r) {
    this._firestore = t, this._userDataWriter = e, this._snapshot = r, this.metadata = new SnapshotMetadata(r.hasPendingWrites, r.fromCache), this.query = n;
  }
  /** An array of all the documents in the `QuerySnapshot`. */
  get docs() {
    const t = [];
    return this.forEach((e) => t.push(e)), t;
  }
  /** The number of documents in the `QuerySnapshot`. */
  get size() {
    return this._snapshot.docs.size;
  }
  /** True if there are no documents in the `QuerySnapshot`. */
  get empty() {
    return 0 === this.size;
  }
  /**
   * Enumerates all of the documents in the `QuerySnapshot`.
   *
   * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg - The `this` binding for the callback.
   */
  forEach(t, e) {
    this._snapshot.docs.forEach((n) => {
      t.call(e, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  /**
   * Returns an array of the documents changes since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as 'added'
   * changes.
   *
   * @param options - `SnapshotListenOptions` that control whether metadata-only
   * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
   * snapshot events.
   */
  docChanges(t = {}) {
    const e = !!t.includeMetadataChanges;
    if (e && this._snapshot.excludesMetadataChanges) throw new FirestoreError(D.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
    (/* @__PURE__ */ __name(function __PRIVATE_changesFromSnapshot(t2, e2) {
      if (t2._snapshot.oldDocs.isEmpty()) {
        let e3 = 0;
        return t2._snapshot.docChanges.map((n) => {
          const r = new QueryDocumentSnapshot(t2._firestore, t2._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(t2._snapshot.mutatedKeys.has(n.doc.key), t2._snapshot.fromCache), t2.query.converter);
          return n.doc, {
            type: "added",
            doc: r,
            oldIndex: -1,
            newIndex: e3++
          };
        });
      }
      {
        let n = t2._snapshot.oldDocs;
        return t2._snapshot.docChanges.filter((t3) => e2 || 3 !== t3.type).map((e3) => {
          const r = new QueryDocumentSnapshot(t2._firestore, t2._userDataWriter, e3.doc.key, e3.doc, new SnapshotMetadata(t2._snapshot.mutatedKeys.has(e3.doc.key), t2._snapshot.fromCache), t2.query.converter);
          let s = -1, a = -1;
          return 0 !== e3.type && (s = n.indexOf(e3.doc.key), n = n.delete(e3.doc.key)), 1 !== e3.type && (n = n.add(e3.doc), a = n.indexOf(e3.doc.key)), {
            type: __PRIVATE_resultChangeType(e3.type),
            doc: r,
            oldIndex: s,
            newIndex: a
          };
        });
      }
    }, "__PRIVATE_changesFromSnapshot"))(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
  }
  /**
   * Returns a JSON-serializable representation of this `QuerySnapshot` instance.
   *
   * @returns a JSON representation of this object. Throws a {@link FirestoreError} if this
   * `QuerySnapshot` has pending writes.
   */
  toJSON() {
    if (this.metadata.hasPendingWrites) throw new FirestoreError(D.FAILED_PRECONDITION, "QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");
    const t = {};
    t.type = _QuerySnapshot._jsonSchemaVersion, t.bundleSource = "QuerySnapshot", t.bundleName = __PRIVATE_AutoId.newId(), this._firestore._databaseId.database, this._firestore._databaseId.projectId;
    const e = [], n = [], r = [];
    return this.docs.forEach((t2) => {
      null !== t2._document && (e.push(t2._document), n.push(this._userDataWriter.convertObjectMap(t2._document.data.value.mapValue.fields, "previous")), r.push(t2.ref.path));
    }), t.bundle = (this._firestore, this.query._query, t.bundleName, "NOT SUPPORTED"), t;
  }
};
__name(_QuerySnapshot, "QuerySnapshot");
var QuerySnapshot = _QuerySnapshot;
function __PRIVATE_resultChangeType(t) {
  switch (t) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return fail(61501, {
        type: t
      });
  }
}
__name(__PRIVATE_resultChangeType, "__PRIVATE_resultChangeType");
QuerySnapshot._jsonSchemaVersion = "firestore/querySnapshot/1.0", QuerySnapshot._jsonSchema = {
  type: property("string", QuerySnapshot._jsonSchemaVersion),
  bundleSource: property("string", "QuerySnapshot"),
  bundleName: property("string"),
  bundle: property("string")
};
function getDocs(t) {
  t = __PRIVATE_cast(t, Query);
  const e = __PRIVATE_cast(t.firestore, Firestore), n = ensureFirestoreConfigured(e), r = new __PRIVATE_ExpUserDataWriter(e);
  return __PRIVATE_validateHasExplicitOrderByForLimitToLast(t._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, t._query).then((n2) => new QuerySnapshot(e, r, t, n2));
}
__name(getDocs, "getDocs");
function addDoc(t, e) {
  const n = __PRIVATE_cast(t.firestore, Firestore), r = doc(t), s = __PRIVATE_applyFirestoreDataConverter(t.converter, e), o = __PRIVATE_newUserDataReader(t.firestore);
  return executeWrite(n, [__PRIVATE_parseSetData(o, "addDoc", r._key, s, null !== t.converter, {}).toMutation(r._key, Precondition.exists(false))]).then(() => r);
}
__name(addDoc, "addDoc");
function executeWrite(t, e) {
  const n = ensureFirestoreConfigured(t);
  return __PRIVATE_firestoreClientWrite(n, e);
}
__name(executeWrite, "executeWrite");
!(/* @__PURE__ */ __name(function __PRIVATE_registerFirestore(h, d = true) {
  __PRIVATE_setSDKVersion(SDK_VERSION), _registerComponent(new Component("firestore", (t, { instanceIdentifier: e, options: n }) => {
    const r = t.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(t.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(r, t.getProvider("app-check-internal")), __PRIVATE_databaseIdFromApp(r, e), r);
    return n = {
      useFetchStreams: d,
      ...n
    }, s._setSettings(n), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(Ut, Ht2, h), // BUILD_TARGET will be replaced by values like esm, cjs, etc during the compilation
  registerVersion(Ut, Ht2, "esm2020");
}, "__PRIVATE_registerFirestore"))();

// src/firebase.js
var firebaseConfig = {
  apiKey: "AIzaSyA1F98nBAKviNgpDNP3SaD9dN1w0bsyDTI",
  authDomain: "metis-trail.firebaseapp.com",
  projectId: "metis-trail",
  storageBucket: "metis-trail.firebasestorage.app",
  messagingSenderId: "518851271945",
  appId: "1:518851271945:web:0793b124677177bed947d8",
  measurementId: "G-M7BEXL4QY0"
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var LOCAL_KEY = "metisLocalScores";
var SYNC_KEY = "metisSyncedLocalScores";
async function saveScore(scoreData, playerName) {
  const doc2 = {
    name: playerName || "Traveller",
    ...scoreData,
    date: serverTimestamp()
  };
  try {
    const ref = await addDoc(collection(db, "scores"), doc2);
    return { id: ref.id, local: false };
  } catch (err) {
    console.warn("[Metis] Firestore save failed, storing locally:", err.message);
    saveLocal(doc2);
    return { id: null, local: true };
  }
}
__name(saveScore, "saveScore");
async function getTopScores() {
  try {
    const q2 = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
    const snap = await getDocs(q2);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("[Metis] Firestore top scores unavailable:", err.message);
    return null;
  }
}
__name(getTopScores, "getTopScores");
async function getMyScores(name3) {
  if (!name3) return [];
  try {
    const q2 = query(
      collection(db, "scores"),
      where("name", "==", name3),
      orderBy("date", "desc"),
      limit(20)
    );
    const snap = await getDocs(q2);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn("[Metis] Firestore personal scores unavailable:", err.message);
    return null;
  }
}
__name(getMyScores, "getMyScores");
async function syncLocalScores() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return;
  const scores = JSON.parse(raw);
  if (!scores.length) return;
  const syncedIds = JSON.parse(localStorage.getItem(SYNC_KEY) || "[]");
  const stillLocal = [];
  for (const s of scores) {
    if (syncedIds.includes(s._localId)) continue;
    try {
      await addDoc(collection(db, "scores"), { ...s, date: serverTimestamp() });
      syncedIds.push(s._localId);
    } catch {
      stillLocal.push(s);
    }
  }
  localStorage.setItem(SYNC_KEY, JSON.stringify(syncedIds));
  if (stillLocal.length) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(stillLocal));
  } else {
    localStorage.removeItem(LOCAL_KEY);
  }
}
__name(syncLocalScores, "syncLocalScores");
function saveLocal(doc2) {
  const raw = localStorage.getItem(LOCAL_KEY);
  const scores = raw ? JSON.parse(raw) : [];
  doc2._localId = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  scores.push(doc2);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(scores));
}
__name(saveLocal, "saveLocal");

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
function getItemIcon(name3) {
  return ICONS[name3] || "\u2022";
}
__name(getItemIcon, "getItemIcon");

// src/main.js
syncLocalScores();
function buildTravelJournalEntry(prevNode, node, after, prevWear) {
  if (!prevNode || !node) {
    return "Another day on the Carlton Trail. The prairie stretches on, dry and endless.";
  }
  const openings = [
    `We pushed west from ${prevNode.name}, heading toward ${node.name}.`,
    `The cart rolled out of ${prevNode.name} at first light. ${node.name} lies ahead.`,
    `Left ${prevNode.name} behind. The road to ${node.name} beckons.`,
    `We broke camp and set our faces west \u2014 ${node.name} was the day's goal.`,
    `Dawn found us loading up and moving on. ${prevNode.name} gave way to open trail.`
  ];
  const middles = [
    `The wheels creak beneath our load. The oxen plod on, patient as the grass.`,
    `A long day under a wide sky. Not a tree for miles, just the big empty.`,
    `The trail winds through grass taller than a man on horseback.`,
    `Clouds built in the west but held their rain. We counted the oxen at midday \u2014 all present.`,
    `The jingle of harness, the groan of the cart. The rhythm of the trail.`
  ];
  const wear = after.wear > prevWear ? " The cart took a beating on the rough trail \u2014 the axle groans louder now." : "";
  const weather = after.weather && after.weather !== "clear" ? ` ${{ overcast: "A grey ceiling of cloud followed us all day.", rain: "A cold rain came on by noon \u2014 we huddled under canvas.", storm: "Thunder rolled across the prairie. We pressed on regardless.", snow: "Snow fell fine as powder, dusting the oxen's backs." }[after.weather] || ""}` : "";
  const day = after.day || 1;
  const opening = openings[day % openings.length];
  const middle = middles[day * 3 % middles.length];
  return `${opening}${wear}${weather} ${middle}`;
}
__name(buildTravelJournalEntry, "buildTravelJournalEntry");
function buildEventJournalEntry(eventData, result) {
  const desc = eventData.text || "Something happened on the trail.";
  if (!result || result.roll === null) {
    return desc;
  }
  const outcome = result.text || (result.success ? "It went well enough." : "That did not go as hoped.");
  const clean = outcome.replace(/^(Success|Failure)\.\s*/, "");
  return `${desc} ${clean}`;
}
__name(buildEventJournalEntry, "buildEventJournalEntry");
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
  const PROFANE = /\b(f+u+c+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|d+a+m+n+|c+u+n+t+|f+a+g+|n+i+g+g+|r+e+t+a+r+d+|w+h+o+r+e+|s+l+u+t+|p+i+s+s+|t+i+t+s+|d+i+c+k+|p+u+s+s+y+|c+o+c+k+|m+e+r+d+e+|p+u+t+a+|b+a+r+d+a+s+h+|b+o+r+d+e+l+|c+h+i+n+k+|g+o+o+k+|k+i+k+e+|s+p+i+c+|w+e+t+b+a+c+k+|t+r+a+n+n+y+|d+y+k+e+|k+a+f+i+r+|m+u+l+a+t+t+o+|p+a+k+i+|s+q+u+a+w+|w+o+g+|z+i+g+g+e+r+)\b/gi;
  function sanitizeName(raw) {
    let cleaned = raw.replace(PROFANE, (m) => "*".repeat(m.length));
    if (!/[a-zA-Z]/.test(cleaned)) cleaned = "Traveller";
    return cleaned.substring(0, 32);
  }
  __name(sanitizeName, "sanitizeName");
  const gameRoot = find("#game-root");
  if (gameRoot) {
    gameRoot.addEventListener("click", (e) => {
      if (e.target.closest("#intro-start")) {
        const rawName = nameInput?.value?.trim() || "";
        const nameVal = sanitizeName(rawName) || "Traveller";
        if (nameVal) {
          localStorage.setItem("metisPlayerName", nameVal);
        }
        if (nameInput && rawName !== nameVal) {
          nameInput.value = nameVal;
        }
        const introOverlay = find("#intro-overlay");
        if (introOverlay) {
          introOverlay.classList.remove("active");
          introOverlay.setAttribute("hidden", "");
        }
        const currentState = game.getState();
        if (currentState.preDeparture) {
          showShop(game);
        } else {
          window.__METIS_RENDER__();
        }
      }
    });
  } else {
    console.warn("Metis bootstrap: #game-root not found; Begin Journey button is offline.");
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#pd-confirm")) {
      e.preventDefault();
      e.stopPropagation();
      const btn = e.target.closest("#pd-confirm");
      if (btn.disabled) return;
      const game2 = window._metisGame;
      if (window.__METIS_SHOP_ITEMS && window.__METIS_SHOP_PURCHASED) {
        window.__METIS_SHOP_ITEMS.forEach((item) => {
          if (window.__METIS_SHOP_PURCHASED[item.name] > 0) {
            for (let i = 0; i < window.__METIS_SHOP_PURCHASED[item.name]; i++) {
              if (item.category === "provisions") {
                game2.addFood(item.count);
              } else {
                game2.buyItem(item.name, item.wt, item.category);
              }
            }
          }
        });
      }
      game2.confirmPreDeparture();
      document.getElementById("predeparture-overlay")?.classList.remove("active");
      window.__METIS_RENDER__();
    }
  });
  const travelBtn = find("#btn-travel");
  if (travelBtn) {
    travelBtn.addEventListener("click", () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const prevWear = game.getState().wear;
      const blocked = travelOneDay();
      haptics_default.travel();
      if (blocked === true) return;
      const after = game.getState();
      if (after.wear > prevWear) haptics_default.wear();
      const node = NODES[after.node];
      const prevNode = NODES[after.node - 1];
      journalLog({
        day: after.day,
        date: monthName(after.month) + " " + after.day,
        title: "On the Trail",
        text: buildTravelJournalEntry(prevNode, node, after, prevWear),
        mech: after.wear > prevWear ? "Wear +1" : "",
        collapsed: true
      });
      window.__METIS_RENDER__();
    });
    travelBtn.setAttribute("data-metis-travel-bound", "1");
  }
  const campClose = find("#camp-close-btn");
  const campContinue = find("#camp-continue");
  if (campClose) campClose.onclick = () => find("#camp-overlay")?.classList.remove("active");
  if (campContinue) {
    campContinue.onclick = () => {
      find("#camp-overlay")?.classList.remove("active");
    };
  }
  const campBtn = find("#btn-camp");
  if (campBtn) campBtn.onclick = () => showCamp(game);
  const cartBtn = find("#btn-cart");
  if (cartBtn) cartBtn.onclick = () => showCart(game);
  const crewBtn = find("#btn-crew");
  if (crewBtn) crewBtn.onclick = () => showCrew(game);
  const eventContinue = find("#event-continue");
  if (eventContinue) eventContinue.onclick = () => {
    find("#event-overlay")?.classList.remove("active");
  };
  const settlementContinue = find("#settlement-continue");
  if (settlementContinue) settlementContinue.onclick = () => {
    const st2 = game.getState().pendingSettlement;
    const after = game.getState();
    if (st2) {
      journalLog({
        day: after.day,
        date: monthName(after.month) + " " + after.day,
        title: `Arrived at ${st2.name}`,
        text: st2.desc || `${st2.name} \u2014 a ${st2.type} settlement on the Carlton Trail.`,
        mech: "",
        collapsed: true
      });
    }
    game.settlementAction("continue");
    find("#settlement-overlay")?.classList.remove("active");
    window.__METIS_RENDER__();
  };
  const settlementClose = find("#settlement-close");
  if (settlementClose) settlementClose.onclick = () => {
    const st2 = game.getState().pendingSettlement;
    const after = game.getState();
    if (st2) {
      journalLog({
        day: after.day,
        date: monthName(after.month) + " " + after.day,
        title: `Arrived at ${st2.name}`,
        text: st2.desc || `${st2.name} \u2014 a ${st2.type} settlement on the Carlton Trail.`,
        mech: "",
        collapsed: true
      });
    }
    game.settlementAction("continue");
    find("#settlement-overlay")?.classList.remove("active");
    window.__METIS_RENDER__();
  };
  const cartClose = find("#cart-close-btn");
  const cartClose2 = find("#cart-close-btn-2");
  if (cartClose) cartClose.onclick = () => find("#cart-overlay")?.classList.remove("active");
  if (cartClose2) cartClose2.onclick = () => find("#cart-overlay")?.classList.remove("active");
  const crewClose = find("#crew-close-btn");
  const crewClose2 = find("#crew-close-btn-2");
  if (crewClose) crewClose.onclick = () => find("#crew-overlay")?.classList.remove("active");
  if (crewClose2) crewClose2.onclick = () => find("#crew-overlay")?.classList.remove("active");
  const restartBtn = find("#end-restart");
  if (restartBtn) restartBtn.onclick = () => {
    clearSave();
    window.location.reload();
  };
}
__name(bootstrap, "bootstrap");
window.__METIS_BOOT__ = bootstrap;
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
  ["intro-overlay", "event-overlay", "settlement-overlay", "cart-overlay", "crew-overlay"].forEach((id) => {
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
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll} \u2014 need ${result.dc}+</span>`;
    const resultHtml = result.success ? '<span class="outcome-pass">Success</span>' : '<span class="outcome-fail">Failure</span>';
    let flavorText = result.text || "";
    flavorText = flavorText.replace(/^(Success|Failure)\.\s*/, "");
    const flavorClass = result.success ? "success" : "fail";
    const flavorHtml = flavorText ? `<p class="outcome-flavor ${flavorClass}">${flavorText}</p>` : "";
    const mechMsgs = [];
    const after = window._metisGame.getState();
    const before = diceResult.before;
    if (after.food !== before.food) mechMsgs.push(`${after.food - before.food >= 0 ? "+" : ""}${after.food - before.food} Food`);
    if (after.wear !== before.wear) mechMsgs.push(`Wear ${after.wear - before.wear >= 0 ? "+" : ""}${after.wear - before.wear}`);
    if (after.morale !== before.morale) mechMsgs.push(`Morale ${after.morale - before.morale >= 0 ? "+" : ""}${after.morale - before.morale}`);
    if (after.crew !== before.crew) mechMsgs.push(`Crew: ${before.crew} \u2192 ${after.crew}`);
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
function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  hideOverlays();
  const textEl = document.getElementById("event-text");
  const choicesEl = document.getElementById("event-choices");
  const continueEl = document.getElementById("event-continue");
  if (!textEl || !choicesEl) return;
  textEl.textContent = ev.text;
  const sourceEl = document.getElementById("event-source");
  if (sourceEl) {
    if (ev.source && ev.source.quote) {
      const quote = ev.source.quote;
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
  continueEl.onclick = () => {
    continueEl.classList.remove("ready");
    if (diceResult) {
      const outcome = buildEventChoiceOutcome(diceResult.stepLog, diceResult.before, game.getState());
      if (outcome) publishResult(outcome);
      if (eventData) {
        const after = game.getState();
        const res = diceResult.result;
        const mechParts = [];
        if (after.food !== diceResult.before.food) mechParts.push(`${after.food - diceResult.before.food >= 0 ? "+" : ""}${(after.food - diceResult.before.food).toFixed(1)} Food`);
        if (after.wear !== diceResult.before.wear) mechParts.push(`Wear ${after.wear - diceResult.before.wear >= 0 ? "+" : ""}${after.wear - diceResult.before.wear}`);
        if (after.morale !== diceResult.before.morale) mechParts.push(`Morale ${after.morale - diceResult.before.morale >= 0 ? "+" : ""}${after.morale - diceResult.before.morale}`);
        if (after.crew !== diceResult.before.crew) mechParts.push(`Crew: ${diceResult.before.crew} \u2192 ${after.crew}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + " " + after.day,
          title: eventData.classification || "Event",
          text: buildEventJournalEntry(eventData, res),
          dice: res && res.roll !== null ? `Rolled ${res.roll} \u2014 need ${res.dc}+ \u2014 ${res.success ? "\u2713 Success" : "\u2717 Failure"}` : null,
          mech: mechParts.join(" \xB7 "),
          collapsed: true
        });
      }
      diceResult = null;
      eventData = null;
    }
    continueEl.style.display = "none";
    const overlay = document.getElementById("event-overlay");
    if (overlay) overlay.classList.remove("active");
    window.__METIS_RENDER__();
  };
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    const hasItem = !ch.requiresItem || game.getCart()?.some((it2) => it2.name === ch.requiresItem.name && it2.count >= ch.requiresItem.count);
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
      document.querySelectorAll(".choice-btn").forEach((b2) => {
        b2.style.display = "none";
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
        const afterState = game.getState();
        const mechMsgs = [];
        if (afterState.food !== prev.food) mechMsgs.push(`${afterState.food - prev.food >= 0 ? "+" : ""}${afterState.food - prev.food} Food`);
        if (afterState.wear !== prev.wear) mechMsgs.push(`Wear ${afterState.wear - prev.wear >= 0 ? "+" : ""}${afterState.wear - prev.wear}`);
        if (afterState.morale !== prev.morale) mechMsgs.push(`Morale ${afterState.morale - prev.morale >= 0 ? "+" : ""}${afterState.morale - prev.morale}`);
        if (afterState.crew !== prev.crew) mechMsgs.push(`Crew: ${prev.crew} \u2192 ${afterState.crew}`);
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
  }
  document.getElementById("event-overlay")?.classList.add("active");
}
__name(showEvent, "showEvent");
function buildEventChoiceOutcome(stepLog, before, after) {
  const msgs = [];
  const entry = stepLog && stepLog[0] ? stepLog[0] : null;
  const res = entry && entry.result ? entry.result : entry;
  if (res && res.roll !== null && res.dc !== null) {
    msgs.push(`Rolled ${res.roll} (needed ${res.dc}+): ${res.success ? "Success" : "Failure"}`);
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
  if (!msgs.length) return "The day passes without change.";
  return msgs.join(", ");
}
__name(buildEventChoiceOutcome, "buildEventChoiceOutcome");
function showSettlement(game) {
  haptics_default.arrive();
  const state = game.getState();
  const node = game.getCurrentNode();
  const before = game.getState();
  const beforeCart = game.getCart();
  const nameEl = document.getElementById("settlement-name");
  const badgeEl = document.getElementById("settlement-badge");
  const distanceEl = document.getElementById("settlement-distance");
  const descEl = document.getElementById("settlement-desc");
  const actionsEl = document.getElementById("settlement-actions");
  if (!nameEl || !badgeEl || !distanceEl || !descEl || !actionsEl) return;
  nameEl.textContent = node.name;
  const typeLabels = { hbc: "HBC Fort", metis: "M\xE9tis Camp", nwmp: "NWMP Post", mission: "Mission", trading: "Trading Post" };
  badgeEl.textContent = typeLabels[node.type] || node.type.toUpperCase();
  badgeEl.className = "settlement-badge " + (node.type || "hbc");
  const distKm = Math.round((node.dist || 0) * 50);
  distanceEl.textContent = `${distKm} km from Fort Garry`;
  descEl.textContent = node.desc || "";
  actionsEl.innerHTML = "";
  const actions = game.getSettlementActions(node.type);
  actions.forEach((action) => {
    renderSettlementActionCard(actionsEl, action, game, before, beforeCart, node);
  });
  document.getElementById("settlement-overlay")?.classList.add("active");
}
__name(showSettlement, "showSettlement");
function renderSettlementActionCard(container, action, game, before, beforeCart, node) {
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
  riskRow.textContent = `Risk: ${action.risk}`;
  const flavorRow = document.createElement("div");
  flavorRow.className = "settlement-action-card-flavor";
  flavorRow.textContent = action.flavor;
  const btn = document.createElement("button");
  btn.className = "settlement-action-card-btn";
  btn.textContent = "Do It";
  const state = game.getState();
  const cart = game.getCart();
  const credit = state.credit?.[node.type] || 0;
  let canDo = true;
  let needsHide = true;
  switch (action.id) {
    case "trade":
      canDo = cart.some((i) => i.type === "trade" && i.count > 0);
      break;
    case "buy_supplies":
      canDo = credit > 0;
      break;
    case "rest":
      canDo = state.food >= 1;
      break;
    case "get_intel":
      canDo = credit >= 1;
      break;
    case "trade_gossip":
      canDo = true;
      break;
    case "recruit_crew":
      canDo = credit >= 2 && state.food >= 1 && (state.crewCount || 3) < 6;
      break;
    case "dance":
      canDo = state.food >= 1;
      break;
    case "share_food":
      canDo = state.food >= 2;
      break;
    case "craft_hides":
      const hides = cart.find((i) => i.name === "Bison Hide" || i.name === "Beaver Pelts" || i.name === "Elk Hide" || i.name === "Deer Hide");
      const shag = cart.find((i) => i.name === "Shaganappi");
      canDo = (hides?.count || 0) >= 3 && (shag?.count || 0) >= 1;
      break;
    case "pay_fines":
      canDo = (state.fines || 0) > 0 && credit >= (state.fines || 0);
      break;
    case "get_permits":
      canDo = credit >= 2;
      break;
    case "report_duty":
      canDo = true;
      break;
    case "buy_ammo":
      canDo = credit >= 1.5;
      break;
    case "heal_crew":
      const med = cart.find((i) => i.name === "Medicine Pouch");
      canDo = credit >= 2 || (med?.count || 0) >= 1;
      break;
    case "get_blessing":
      canDo = state.food >= 1;
      break;
    case "trade_limited":
      canDo = true;
      break;
  }
  if (!canDo) {
    btn.disabled = true;
    btn.classList.add("disabled");
  }
  if (action.id === "trade") {
    const tradeItems = cart.filter((i) => i.type === "trade" && i.count > 0);
    if (tradeItems.length === 0) {
      btn.disabled = true;
      btn.classList.add("disabled");
    } else {
      btn.onclick = () => {
        card.querySelectorAll(".settlement-trade-sub").forEach((el) => el.remove());
        tradeItems.forEach((item) => {
          const mbVal = item.mbValue || 1;
          const subRow = document.createElement("div");
          subRow.className = "settlement-trade-sub";
          subRow.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;margin:4px 0;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;font-size:12px;";
          subRow.innerHTML = `${getItemIcon(item.name)} ${item.name} \xD7${item.count} <span style="color:var(--clr-accent);">\u2192 ${mbVal} MB each</span>`;
          const subBtn = document.createElement("button");
          subBtn.className = "ctrl-btn";
          subBtn.style.cssText = "padding:2px 8px;font-size:10px;white-space:nowrap;";
          subBtn.textContent = `Trade 1`;
          subBtn.onclick = () => {
            hideOverlays();
            const beforeMB = game.getState().mbValue;
            game.settlementAction("trade");
            const afterMB = game.getState().mbValue;
            const gained = item.mbValue || 1;
            publishResult(`Traded 1 ${item.name} \u2192 +${gained.toFixed(2)} MB credit.`);
            window.__METIS_RENDER__();
          };
          subRow.appendChild(subBtn);
          card.appendChild(subRow);
        });
        btn.textContent = "Hide";
        btn.onclick = () => {
          card.querySelectorAll(".settlement-trade-sub").forEach((el) => el.remove());
          btn.textContent = "Trade";
          btn.onclick = () => {
          };
        };
      };
    }
  } else {
    btn.onclick = () => {
      if (!canDo) return;
      if (needsHide) hideOverlays();
      const st2 = game.getState().pendingSettlement;
      const beforeJournal = game.getState();
      const result = game.settlementAction(action.id);
      const after = game.getState();
      const afterCart = game.getCart();
      const outcome = buildSettlementOutcome(action.id, beforeJournal, after, beforeCart, afterCart);
      if (outcome) publishResult(outcome);
      if (st2) {
        const mechParts = [];
        if (after.food !== beforeJournal.food) mechParts.push(`${after.food - beforeJournal.food >= 0 ? "+" : ""}${(after.food - beforeJournal.food).toFixed(1)} Food`);
        if (after.wear !== beforeJournal.wear) mechParts.push(`Wear ${after.wear - beforeJournal.wear >= 0 ? "+" : ""}${after.wear - beforeJournal.wear}`);
        if (after.morale !== beforeJournal.morale) mechParts.push(`Morale ${after.morale - beforeJournal.morale >= 0 ? "+" : ""}${after.morale - beforeJournal.morale}`);
        if (after.crew !== beforeJournal.crew) mechParts.push(`Crew: ${beforeJournal.crew} \u2192 ${after.crew}`);
        journalLog({
          day: after.day,
          date: monthName(after.month) + " " + after.day,
          title: `${action.label} at ${st2.name}`,
          text: buildSettlementJournalText(action.id, st2),
          mech: mechParts.join(" \xB7 "),
          collapsed: true
        });
      }
      window.__METIS_RENDER__();
    };
  }
  card.appendChild(nameRow);
  card.appendChild(costRow);
  card.appendChild(riskRow);
  card.appendChild(flavorRow);
  card.appendChild(btn);
  container.appendChild(card);
}
__name(renderSettlementActionCard, "renderSettlementActionCard");
function buildSettlementOutcome(action, before, after, beforeCart, afterCart) {
  const msgs = [];
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? "+" : ""}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? "+" : ""}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? "+" : ""}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.day !== before.day) msgs.push(`${after.day - before.day} Day(s)`);
  if (action === "trade") {
    const lost = beforeCart.reduce((s, i) => s + i.count, 0) - afterCart.reduce((s, i) => s + i.count, 0);
    if (lost > 0) msgs.push(`Traded ${lost} good(s) for MB credit.`);
  }
  if (action === "buy_food") msgs.push("Bought food with MB credit.");
  if (action === "buy_repair") msgs.push("Repaired cart with MB credit.");
  if (action === "buy_heal") msgs.push("Healed crew with MB credit.");
  if (action === "buy_info") msgs.push("Gathered trail intelligence.");
  if (action === "repair") msgs.push("Cart repaired.");
  if (action === "grease") msgs.push("Axle greased.");
  if (action === "heal") msgs.push("Healed.");
  if (action === "forage") msgs.push("Foraging...");
  if (action === "recruit") msgs.push("Reinforcements found.");
  if (action === "rumours") msgs.push("You learn the latest trail news.");
  if (action === "gossip") {
    const intel = after.trailIntel && after.trailIntel.length > 0 ? after.trailIntel[after.trailIntel.length - 1] : null;
    if (intel && intel.text) {
      msgs.push(`You spend a day gossiping. "${intel.text}"`);
    } else {
      msgs.push("You spend a day gossiping. The locals share what they know.");
    }
  }
  if (action === "rest") msgs.push("Rest. Crew and supplies refreshed.");
  if (action === "craft") msgs.push("Item crafted.");
  if (!msgs.length) return "Nothing changed.";
  return msgs.join(", ");
}
__name(buildSettlementOutcome, "buildSettlementOutcome");
function showCart(game) {
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
    const mbStr = (i.type === "trade" || i.category === "furs") && i.mbValue ? `<span style="color:var(--clr-accent);font-size:0.85em;margin-left:4px;">${i.mbValue} \u20A5</span>` : "";
    return `
    <div class="cart-row" style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;"><span style="font-weight:600;">${getItemIcon(i.name)} ${i.name} \xD7${i.count} (${(i.wt * i.count).toFixed(1)} kg)</span>${mbStr}${hint ? `<div style="font-size:0.75em;color:#6b5c4a;margin-top:1px;">${hint}</div>` : ""}${desc}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;flex-shrink:0;">Unload (\u2212${i.wt} kg)</button>` : ""}
    </div>`;
  }).join("");
  listEl.innerHTML = weightBar + items;
  listEl.querySelectorAll(".unload-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemName = btn.dataset.item;
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
    furs: "Trade goods. Sell at settlements for \u20A5 credit. Need \u20A5 to win.",
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
  const balanceEl = document.getElementById("shop-balance");
  const shopStatusEl = document.getElementById("shop-status");
  const foodCountEl = document.getElementById("shop-food-count");
  if (!listEl || !weightEl || !currentEl || !statusEl || !confirmBtn || !balanceEl || !shopStatusEl || !foodCountEl) return;
  let balance = game.getCart().reduce((sum, i) => sum + (i.mbValue || 0) * i.count, 0);
  const startingBalance = balance;
  const shopItems = [
    { name: "Pemmican Rations", desc: "Dried meat and fat. 1 food/day keeps the crew alive.", price: 2.5, category: "provisions", wt: 2.5, count: 5 },
    { name: "Spare Axle", desc: "Hard maple. Heavy but essential for a Red River cart.", price: 3, category: "parts", wt: 15, count: 1 },
    { name: "Shaganappi", desc: "Rawhide strips. Binding, lashing, and cart repair.", price: 1.5, category: "repair", wt: 3, count: 3 },
    { name: "Tool Kit", desc: "Axe, auger, drawknife. Required for major repairs.", price: 2.5, category: "parts", wt: 8, count: 1 },
    { name: "Canvas Tarp", desc: "Waterproof. Shelter and cart-raft conversion.", price: 2, category: "shelter", wt: 4, count: 1 },
    { name: "Firewood Bundle", desc: "Dried poplar. Required for cold nights.", price: 1, category: "fuel", wt: 6, count: 2 },
    { name: "Rope (50ft)", desc: "Hemp. Crossings, repairs, binding.", price: 1.5, category: "parts", wt: 3, count: 1 },
    { name: "Ammunition Belt", desc: "Shot and ball. For hunting and defence.", price: 2, category: "hunting", wt: 2, count: 1 },
    { name: "Medicine Pouch", desc: "Herbal remedies and bandages.", price: 3, category: "medical", wt: 1.5, count: 1 },
    { name: "Blanket", desc: "Wool. Winter survival.", price: 2, category: "shelter", wt: 3, count: 2 }
  ];
  const purchased = {};
  shopItems.forEach((item) => {
    purchased[item.name] = 0;
  });
  window.__METIS_SHOP_ITEMS = shopItems;
  window.__METIS_SHOP_PURCHASED = purchased;
  function recalc() {
    let totalWeight2 = 0;
    let totalFood = 0;
    shopItems.forEach((item) => {
      totalWeight2 += item.wt * purchased[item.name];
      if (item.category === "provisions") totalFood += purchased[item.name] * 5;
    });
    const cart = game.getCart();
    cart.forEach((i) => {
      totalWeight2 += i.wt * i.count;
    });
    currentEl.textContent = totalWeight2.toFixed(1);
    balanceEl.textContent = Math.round(balance);
    foodCountEl.textContent = "Food: " + totalFood;
    const capacity = state.capacity;
    weightEl.classList.remove("over", "at-capacity", "under");
    statusEl.classList.remove("over", "at-capacity", "under");
    if (totalWeight2 > capacity) {
      weightEl.classList.add("over");
      statusEl.classList.add("over");
      statusEl.textContent = `${(totalWeight2 - capacity).toFixed(1)} kg over`;
      confirmBtn.disabled = true;
    } else {
      weightEl.classList.add("under");
      statusEl.classList.add("under");
      statusEl.textContent = `${(capacity - totalWeight2).toFixed(1)} kg spare`;
      confirmBtn.disabled = totalFood < 10;
      if (totalFood < 10) {
        shopStatusEl.textContent = `Need ${10 - totalFood} more food to begin.`;
        shopStatusEl.style.color = "var(--clr-danger)";
      } else {
        shopStatusEl.textContent = "Ready to depart!";
        shopStatusEl.style.color = "var(--clr-success)";
      }
    }
  }
  __name(recalc, "recalc");
  function renderList() {
    listEl.innerHTML = shopItems.map((item) => {
      const canBuy = balance >= item.price;
      const itemWeight = (item.wt * item.count).toFixed(1);
      const qty = purchased[item.name];
      return `
    <div class="pd-row" data-item="${item.name}">
      <div class="pd-item-info">
        <span class="pd-icon">${getItemIcon(item.name)}</span>
        <span class="pd-name">${item.name}</span>
        <div style="font-size:0.75em;color:var(--clr-muted);margin-top:2px;">${item.desc}</div>
      </div>
      <div class="pd-controls">
        <span class="pd-count">${qty > 0 ? "\xD7" + qty : "\u2014"}</span>
        <button class="pd-buy" data-item="${item.name}" ${canBuy ? "" : "disabled"}>Buy (${item.price} \u20A5)</button>
        ${qty > 0 ? `<button class="pd-remove" data-item="${item.name}">Remove</button>` : ""}
        <span class="pd-weight">${itemWeight} kg</span>
      </div>
    </div>`;
    }).join("");
    listEl.querySelectorAll(".pd-buy").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name3 = btn.dataset.item;
        const item = shopItems.find((i) => i.name === name3);
        if (item && balance >= item.price) {
          balance -= item.price;
          purchased[item.name]++;
          recalc();
          renderList();
        }
      });
    });
    listEl.querySelectorAll(".pd-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const name3 = btn.dataset.item;
        const item = shopItems.find((i) => i.name === name3);
        if (item && purchased[item.name] > 0) {
          balance += item.price;
          purchased[item.name]--;
          recalc();
          renderList();
        }
      });
    });
  }
  __name(renderList, "renderList");
  recalc();
  renderList();
  document.getElementById("predeparture-overlay")?.classList.add("active");
}
__name(showShop, "showShop");
function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById("crew-status");
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById("crew-overlay")?.classList.add("active");
}
__name(showCrew, "showCrew");
function showCamp(game) {
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
      type: "pemmican_process",
      icon: "\u{1F969}",
      label: "Process Pemmican",
      cost: "3 food",
      risk: "On fail: poor yield, meat spoils",
      flavor: "Slice the lean meat thin. Dry it over the fire. Pound it fine. Render the tallow. Pack it tight.",
      canDo: state.food >= 3,
      needRoll: true
    },
    {
      type: "deeprest",
      icon: "\u26FA",
      label: "Deep Rest",
      cost: "2 food \xB7 2 days",
      risk: "Lose two days but crew fully recovers",
      flavor: "Two days of proper rest. Hot food, long sleep, time to mend what is broken.",
      canDo: state.food >= 2,
      needRoll: false
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
      riskRow.textContent = `Risk: ${a.risk}`;
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
          let result;
          if (a.type === "push_on") {
            pushOn(game);
            result = { effects: ["Pushed on \u2014 extra wear, less food, lower morale"], critical: false };
          } else {
            result = game.campAction(a.type);
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
          if (a.needRoll && result.roll !== null && rollEl) {
            const DC = {
              rest: 12,
              forage: 10,
              hunt: 10,
              repair: 8,
              scout: 9,
              dance: 8,
              pemmican_process: 10
            }[a.type] || 10;
            const isSuccess = result.rollTotal >= DC;
            rollEl.style.display = "flex";
            rollEl.innerHTML = `
              <div class="roll-label">Roll</div>
              <div class="die small font-spectral spin" id="camp-die">${result.roll}</div>
              <div class="roll-total">Need ${DC}+ ${isSuccess ? "\u2713" : "\u2717"}</div>
            `;
            const dieEl = document.getElementById("camp-die");
            let ticks = 0;
            const maxTicks = 6 + Math.floor(Math.random() * 4);
            const spinId = setInterval(() => {
              dieEl.textContent = String(Math.floor(Math.random() * 20) + 1);
              ticks++;
              if (ticks >= maxTicks) {
                clearInterval(spinId);
                dieEl.textContent = String(result.roll);
                dieEl.className = "die small font-spectral settled " + (isSuccess ? "pass" : "fail");
                haptics_default.uiTap();
                if (errEl) {
                  errEl.style.display = "block";
                  let html = "";
                  if (result.critical) {
                    html += `<div class="camp-critical">\u26A0 Critical Failure</div>`;
                  }
                  html += result.effects.join("<br>");
                  errEl.innerHTML = html;
                }
                const continueEl = document.getElementById("camp-continue");
                if (continueEl) continueEl.style.display = "inline-block";
              }
            }, 60);
          } else {
            if (errEl) {
              errEl.style.display = "block";
              let html = "";
              if (result.critical) {
                html += `<div class="camp-critical">\u26A0 Critical Failure</div>`;
              }
              html += (result?.effects || []).join("<br>");
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
            pemmican_process: "Process Pemmican",
            deeprest: "Deep Rest",
            push_on: "Push On"
          };
          const mechParts = [];
          if (after.food !== state.food) mechParts.push(`${after.food - state.food >= 0 ? "+" : ""}${(after.food - state.food).toFixed(1)} Food`);
          if (after.wear !== state.wear) mechParts.push(`Wear ${after.wear - state.wear >= 0 ? "+" : ""}${after.wear - state.wear}`);
          if (after.morale !== state.morale) mechParts.push(`Morale ${after.morale - state.morale >= 0 ? "+" : ""}${after.morale - state.morale}`);
          if (after.crew !== state.crew) mechParts.push(`Crew: ${state.crew} \u2192 ${after.crew}`);
          journalLog({
            day: after.day,
            date: monthName(after.month) + " " + after.day,
            title: `Camp: ${actionLabels[a.type] || a.type}`,
            text: a.flavor,
            dice: result.roll !== null ? `Rolled ${result.roll} \u2014 need ${{ rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, pemmican_process: 10 }[a.type] || 10}+ \u2014 ${result.rollTotal >= ({ rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, pemmican_process: 10 }[a.type] || 10) ? "\u2713 Success" : "\u2717 Failure"}${result.critical ? " \u2014 \u26A0 CRITICAL" : ""}` : null,
            mech: mechParts.join(" \xB7 "),
            collapsed: true
          });
        });
      }
      actionsEl.appendChild(card);
    });
  }
  document.getElementById("camp-overlay")?.classList.add("active");
}
__name(showCamp, "showCamp");
function showEnd(game) {
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
      const author = quoteData.author || "";
      const work = quoteData.work || "";
      const year = quoteData.year || "";
      const attrib = [author, work, year].filter(Boolean).join(", ");
      sourceEl.innerHTML = `<span class="src-quote">"${quoteData.quote}"</span>` + (attrib ? `<span class="src-attrib">\u2014 ${attrib}</span>` : "") + (quoteData.context ? `<span class="src-context">${quoteData.context}</span>` : "");
      sourceEl.style.display = "block";
    } else {
      sourceEl.style.display = "none";
    }
  }
  const breakdown = game.getEndgameScore();
  const scoreLines = [
    { label: "Base score", value: breakdown.base },
    { label: `MB value (${Math.round(state.mbValue || 0)} \xD7 80)`, value: breakdown.mbValue },
    { label: `Food bonus (${Math.min(state.food, 25)} \xD7 12)`, value: breakdown.foodBonus },
    { label: `Crew condition (${state.crew})`, value: breakdown.crewCondition },
    { label: `Days on trail (${state.day} \xD7 -8)`, value: breakdown.daysPenalty },
    { label: `Cart wear (${state.wear}\xB2 \xD7 -40)`, value: breakdown.wearPenalty }
  ];
  const totalScore = breakdown.score;
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
    ${!isVictory ? `<div class="stat-row" style="color:#8B2500;font-style:italic;margin-top:8px;">No trade goods delivered \u2014 score forfeit.</div>` : ""}
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
    lbBtn.className = "restart-btn";
    lbBtn.style.marginTop = "10px";
    lbBtn.textContent = "\u{1F3C6} View Hall of Fame";
    lbBtn.onclick = () => showLeaderboard();
    endCard.appendChild(lbBtn);
  }
}
__name(showEnd, "showEnd");
var cachedTopScores = null;
var cachedMyScores = null;
function showLeaderboard() {
  document.getElementById("end-overlay")?.classList.remove("active");
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
  const name3 = localStorage.getItem("metisPlayerName") || "";
  if (!name3) {
    container.innerHTML = '<div class="lb-empty">Set your party name in the intro to track personal scores.</div>';
    return;
  }
  getMyScores(name3).then((scores) => {
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
      return copy.sort((a, b2) => (b2.score || 0) - (a.score || 0));
    case "day":
      return copy.sort((a, b2) => (b2.day || 0) - (a.day || 0));
    case "wear":
      return copy.sort((a, b2) => (b2.wear || 0) - (a.wear || 0));
    case "food-asc":
      return copy.sort((a, b2) => (a.food || 0) - (b2.food || 0));
    case "tradesMade":
      return copy.sort((a, b2) => (b2.tradesMade || 0) - (a.tradesMade || 0));
    case "nodes":
      return copy.sort((a, b2) => (b2.nodes || 0) - (a.nodes || 0));
    case "eventsResolved":
      return copy.sort((a, b2) => (b2.eventsResolved || 0) - (a.eventsResolved || 0));
    case "morale":
      return copy.sort((a, b2) => (b2.morale || 0) - (a.morale || 0));
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
function buildSettlementJournalText(action, st2) {
  const stName = st2?.name || "the settlement";
  const texts = {
    rest: `A day of rest at ${stName}. The crew recovers, the oxen graze. The weight of the trail lifts, if only for a day.`,
    trade: `Trade goods exchanged at ${stName}. The ledgers are updated, the cart a little lighter, the credit a little heavier.`,
    repair: `The cart is tended at ${stName}. Shaganappi and effort \u2014 the wheels turn smoother.`,
    heal: `The crew is tended at ${stName}. Wounds dressed, spirits mended.`,
    buy_food: `Supplies taken on at ${stName}. The cart grows heavier with food for the trail ahead.`,
    buy_repair: `Cart repaired at ${stName}. The wear comes off, the wheels turn true.`,
    buy_heal: `The crew is healed at ${stName}. Morale restored, strength returned.`,
    buy_info: `News gathered at ${stName}. The trail ahead becomes a little less uncertain.`,
    craft: `Work done at ${stName}. Raw materials become something more useful.`,
    forage: `Foraging around ${stName}. The land yields what it can.`,
    gossip: `Talk at ${stName}. News from other travellers, rumours from the trail.`,
    recruit: `New hands found at ${stName}. The crew grows by one.`,
    rumours: `Stories traded at ${stName}. Every traveller has one.`
  };
  return texts[action] || `Time spent at ${stName}.`;
}
__name(buildSettlementJournalText, "buildSettlementJournalText");
window.__METIS_RENDER__ = render;
document.addEventListener("click", (e) => {
  const tabBtn = e.target.closest(".lb-tab");
  if (tabBtn) {
    document.querySelectorAll(".lb-tab").forEach((t) => t.classList.remove("active"));
    tabBtn.classList.add("active");
    const tab = tabBtn.dataset.tab;
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
/*! Bundled license information:

@firebase/util/dist/postinstall.mjs:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/webchannel-wrapper/dist/webchannel-blob/esm/webchannel_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law | agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/common-b3e8012f.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/

if (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }