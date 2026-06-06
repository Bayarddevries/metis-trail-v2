var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
    terrain: "river_valley",
    dist: 1,
    desc: "A M\xE9tis parish straddling the ox-cart trail. Smoke rises from the churchyard. Family welcomes you with bannock and Saskatoon preserve.",
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
    category: "provisions",
    mbValue: 0.4,
    perishable: true,
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
    category: "parts",
    mbValue: 1.2,
    perishable: false,
    desc: "Hard maple. Heavy but essential for a Red River cart.",
    icon: "\u{1FAB5}"
  },
  {
    name: "Shaganappi",
    wt: 5,
    count: 3,
    type: "repair",
    category: "repair",
    mbValue: 0.6,
    perishable: false,
    factionPref: "hbc",
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
    category: "parts",
    mbValue: 1.8,
    perishable: false,
    desc: "Axe, auger, drawknife. Required for major repairs.",
    icon: "\u{1F6E0}\uFE0F"
  },
  {
    name: "Bison Hide",
    wt: 8,
    count: 2,
    type: "trade",
    category: "furs",
    mbValue: 1.25,
    perishable: false,
    factionPref: "metis",
    desc: "Folded. Trade value: ~1.25 MB each at Edmonton.",
    icon: "\u{1F9AC}"
  },
  {
    name: "Canvas Tarp",
    wt: 6,
    count: 1,
    type: "shelter",
    category: "shelter",
    mbValue: 1,
    perishable: false,
    desc: "Waterproof. Shelter and cart-raft conversion.",
    icon: "\u26FA"
  },
  {
    name: "Firewood Bundle",
    wt: 10,
    count: 2,
    type: "fuel",
    category: "fuel",
    mbValue: 0.2,
    perishable: false,
    desc: "Dried poplar. Required for cold nights.",
    icon: "\u{1FAB5}"
  },
  {
    name: "Rope (50ft)",
    wt: 3,
    count: 1,
    type: "tool",
    category: "parts",
    mbValue: 0.5,
    perishable: false,
    desc: "Hemp. Crossings, repairs, binding.",
    icon: "\u{1FAA2}"
  },
  {
    name: "Ammunition Belt",
    wt: 2,
    count: 0,
    type: "ammo",
    category: "hunting",
    mbValue: 0.9,
    perishable: false,
    desc: "Shot and ball. For hunting and defence.",
    icon: "\u{1F3AF}"
  },
  {
    name: "Medicine Pouch",
    wt: 2,
    count: 1,
    type: "medical",
    category: "medical",
    mbValue: 1.8,
    perishable: true,
    desc: "Herbal remedies and bandages.",
    icon: "\u{1FAD9}"
  },
  {
    name: "Blanket",
    wt: 3,
    count: 1,
    type: "shelter",
    category: "shelter",
    mbValue: 2.2,
    perishable: false,
    desc: "Wool. Winter survival.",
    icon: "\u{1F6CF}\uFE0F"
  },
  {
    name: "Beaver Pelts",
    wt: 5,
    count: 1,
    type: "trade",
    category: "furs",
    mbValue: 3,
    perishable: false,
    factionPref: "nwmp",
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
    quote: "The trial of Pierre Guillaume Sayer marked the beginning of free trade in the West.",
    author: "MMF Historical Research",
    work: "metis-research-vault",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  DUMONT_ACCOUNTS: {
    quote: "Gabriel Dumont... ferryman, guide, and later military leader of the M\xE9tis forces.",
    author: "Dumont Family Accounts",
    work: "MMF Research Vault",
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  MCCONNELL_NW: {
    quote: "Fort Garry, the centre of the Hudson's Bay Company's operations in the Red River.",
    author: "R. G. McConnell",
    work: "The North-West of Canada",
    year: 1885,
    url: "https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt"
  },
  CARLTON_TRAIL: {
    quote: "The Carlton Trail... the great highway of the prairies.",
    author: "Antoine Blanc",
    work: "The Carlton Trail (Manitoba History)",
    year: 1959,
    url: "https://archive.org/stream/P000411/P000411_djvu.txt"
  },
  NWMP_HISTORY: {
    quote: "The mounted police established posts along the trail to enforce Ottawa's regulations.",
    author: "R. C. Macleod",
    work: "The North-West Mounted Police and Law Enforcement, 1873-1905",
    year: 1976
  },
  BUFFALO_HUNT: {
    quote: "The buffalo hunt... the very foundation of M\xE9tis economy and culture.",
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  BREHAUT_CART: {
    quote: "When loaded it gave forth a blood-curdling squeal which could be heard for miles and which came to be associated with it. This squeal was caused by the friction of the dry wood of the hub of the wheel turning on the axle and could not be eliminated.",
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails",
    year: 1972,
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  BREHAUNT_TRAILS: {
    quote: "The wheels of the Red River carts gradually marked the prairie terrain with well defined tracks, one for each wheel, which in time wore down to deep ruts and became known as trails.",
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails",
    year: 1972,
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
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails",
    year: 1972,
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  MACLEOD_NWMP: {
    quote: "The mounted police established posts along the trail to enforce Ottawa's regulations. Duty was collected in cash or goods, and every cart was subject to inspection.",
    author: "R. C. Macleod",
    work: "The North-West Mounted Police and Law Enforcement, 1873-1905",
    year: 1976
  },
  BARKWELL_BRIGADE: {
    quote: "This famous brigade traveled 4000 miles every year. The pay of a guide for the entire trip occupying the four summer months has been \xA335.",
    author: "Lawrence Barkwell",
    work: "Portage La Loche Brigade",
    year: 2005,
    url: "https://www.louisrielinstitute.com/"
  },
  GOULET_HUNT: {
    quote: "The buffalo hunt was the very foundation of M\xE9tis economy and culture. Four hundred mounted huntsmen await the signal, and the earth trembles beneath the hooves.",
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
  },
  MMF_COMMUNITIES: {
    quote: "The M\xE9tis communities along the Carlton Trail were bound together by kinship, the French language, and the Catholic faith. The church bell rang across the river valley.",
    author: "MMF Historical Research",
    work: "M\xE9tis Communities along the Carlton Trail",
    year: 2020,
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
    quote: "Thefts at rendezvous camps were usually petty and punished by the trail's own informal courts. The camp overseer kept order, and the community enforced its own justice when goods went missing.",
    author: "MMF Historical Research",
    work: "M\xE9tis Communities along the Carlton Trail",
    year: 2020,
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
    quote: "The Carlton Trail was the great highway of the prairies. From Fort Garry to Edmonton, the cart ruts marked the longest overland route in the Northwest.",
    author: "Antoine Blanc",
    work: "The Carlton Trail (Manitoba History)",
    year: 1959,
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
    quote: "The river shifted its bed without warning. A sandbar that was dry land yesterday could swallow a cart wheel today, and the current would push against the cart bed until the oxen strained and the ropes snapped.",
    author: "Harry Baker Brehaut",
    work: "The Red River Cart and Trails",
    year: 1972,
    url: "https://www.mhs.mb.ca/docs/transactions/3/redrivercart.shtml"
  },
  GOULET_BEE_TREE: {
    quote: "A hollow oak, its trunk scarred by fire, hummed with life. Wild bees streamed in and out of a knot near the crown \u2014 a bee tree, full of honey. On the open prairie, sugar was worth its weight in trade goods.",
    author: "Terry Goulet & George Goulet",
    work: "The M\xE9tis: Memorable Events and Memorable People",
    year: 2005,
    url: "https://github.com/Bayarddevries/metis-research-wiki"
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
      text: "A hot wind pushes at your back, carrying the smell of sun-baked grass and distant smoke. The prairie grass ripples in long waves like a green sea, and the oxen lean into their traces with new energy. Your cart groans but the wheels turn faster \u2014 the wind is a gift, but the prairie gives nothing without a price.",
      source: getSource("LACOMBE_JOURNALS"),
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
      text: "Moonlight spills across the prairie, turning the grass to silver. Somewhere nearby a fiddle begins a Red River jig, the notes carrying clean and sharp through the still air. Voices rise in song \u2014 French and Michif, old tunes from the Red River settlements. The crew listens, and for a moment the trail feels like home.",
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
      text: "You crest a rise and the world opens below \u2014 a massive buffalo hunt camp spreads across the valley, hundreds of carts in a great circle. The air is thick with dust and the sound of running horses. Four hundred mounted huntsmen await the signal, and the earth trembles beneath the hooves of the herd beyond.",
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
      text: "The sky turns green and the air goes still \u2014 then the hail comes. Stones the size of walnuts hammer the canvas cover and bounce off the cart bed. The oxen bellow and strain at their traces. There is no shelter on the open prairie, only the cart and whatever you can do to protect it.",
      source: getSource("LACOMBE_HAIL"),
      choices: [
        { text: "Cover the canvas and ride it out", dc: 10, ok: "The wagon top holds. The oxen are skittish but unhurt.", bad: "Canvas tears and two rounds of cheese are spoiled.", food: -2, morale: -4, itemBonus: { name: "Canvas Tarp", dcBonus: 4 } },
        { text: "Scramble to the nearest coulee", dc: 9, ok: "Natural shelter saves the load.", bad: "A slipped wheel in the rush.", wear: 1 }
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
    }
  ],
  river_valley: [
    {
      id: "river_valley_sudden_rain",
      text: "The heavy cloud bursts without warning. The trail turns to a slurry and the cart sinks to the naves \u2014 the wheels disappearing into mud that grabs and holds. Sudden storms of rain turned the valley trail into a bog that could trap a loaded cart for hours.",
      source: getSource("LACOMBE_HAIL"),
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
      text: "A member of your crew wakes shaking and cold \u2014 by midday they cannot stand. The river water was contaminated, a waterborne bacteria that thrived in the stagnant water of common camping grounds. The trail has seen this before, and it is never gentle.",
      source: getSource("HBC_DISEASE"),
      choices: [
        { text: "Use the medicine pouch and rest the day", dc: 14, ok: "The crisis passes. One day lost, but the crew recovers.", bad: "The fever breaks but the crew is weak for days.", crew: "tired", morale: -8, consumesItem: "Medicine Pouch" },
        { text: "Push through without rest", dc: null, always: "The worst passes but the toll is steep.", morale: -20, crew: "exhausted" }
      ]
    },
    {
      id: "river_mosquito_camp",
      text: "The mosquitoes rise in clouds from the riverbank \u2014 a living fog that descends on man and beast alike. The oxen stampede; the cooking fire smoulders and dies. Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud, the cart trains made their way westward.",
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
      text: "The trail vanishes beneath a sea of brown backs. A buffalo herd \u2014 thousands strong \u2014 blocks the path ahead, the earth trembling beneath their hooves. The oxen low and pull at their traces, eyes rolling white. You cannot go around; the herd stretches to the horizon on both sides.",
      source: getSource("GOULET_HUNT"),
      choices: [
        { text: "Wait for the herd to pass", dc: null, always: "You make camp and wait. The herd takes half a day to pass. The ground is churned to dust.", time: 1 },
        { text: "Drive through the edge of the herd", dc: 13, ok: "The oxen plunge in. The herd parts just enough. You emerge on the other side, hearts pounding.", bad: "A bull takes offense. The oxen bolt. Cart tips and supplies scatter.", wear: 2, morale: -8 },
        { text: "Hunt a straggler for food", dc: 11, ok: "A young bull is separated from the herd. The crew brings it down and butchers it on the spot.", bad: "The shot scatters the herd toward you. The oxen stampede.", food: 6, itemBonus: { name: "Ammunition Belt", dcBonus: 3 } }
      ]
    },
    {
      id: "upland_storm_shelter",
      text: "The sky turns green and the air goes still \u2014 then the hail comes. Stones the size of walnuts hammer the canvas cover. Lightning finds the highest point, and the ridge offers no shelter. The oxen bellow and strain against their traces.",
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
    }
  ],
  river: [
    {
      id: "ferry_gabriel",
      text: "Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today \u2014 the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.",
      source: getSource("DUMONT_ACCOUNTS"),
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    },
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
      id: "river_ferry_dumont",
      text: "Gabriel Dumont is at the crossing, his ferry moored to the bank. His fee is fair, but the current is heavy today \u2014 the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.",
      source: getSource("DUMONT_ACCOUNTS"),
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    },
    {
      id: "river_cart_raft_crossing",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart \u2014 enough to build a raft, if you know how. The river is wide and the current steady. On the far bank, the trail continues west.",
      source: getSource("FONSECA_RAFT"),
      choices: [
        { text: "Build a cart-raft with 2 Bison Hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river. Cargo gets wet.", morale: -6, requiresItem: { name: "Bison Hide", count: 2 } },
        { text: "Ford the cart carefully", dc: 13, ok: "The ox swims straight and true; the bed stays high.", bad: "The current turns the cart. Wet freight and one damaged wheel.", wear: 2, food: -2 }
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
    flags: {},
    reputation: { hbc: 0, nwmp: 0, metis: 0, mission: 0, cree: 0 },
    capacity: 100,
    usedWeight: 0,
    credit: { hbc: 0, metis: 0, nwmp: 0, mission: 0 },
    perishable: {}
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
    if (ch.setsFlag) {
      S.flags[ch.setsFlag] = true;
      result.flags.push(ch.setsFlag);
    }
    if (ch.addsRep) {
      S.reputation[ch.addsRep.key] = (S.reputation[ch.addsRep.key] || 0) + ch.addsRep.delta;
      result.reps.push({ key: ch.addsRep.key, delta: ch.addsRep.delta, value: S.reputation[ch.addsRep.key] });
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
  __name(calcScore, "calcScore");
  const stepLog = [];
  function travelOneDay2() {
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
  __name(chooseEventChoice, "chooseEventChoice");
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
  __name(makeCamp, "makeCamp");
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
  __name(settlementAction, "settlementAction");
  return {
    travelOneDay: travelOneDay2,
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
__name(createGame, "createGame");
function availableSettlementActions(type) {
  const base = ["rest"];
  if (type === "hbc") return [...base, "trade", "repair", "grease", "forage", "recruit"];
  if (type === "metis") return [...base, "trade", "grease", "forage", "rumours", "recruit"];
  if (type === "trading") return [...base, "trade", "forage", "rumours"];
  if (type === "mission") return [...base, "heal", "rumours"];
  if (type === "nwmp") return [...base, "trade", "grease", "rumours"];
  return base;
}
__name(availableSettlementActions, "availableSettlementActions");

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
  if (next) {
    L.circleMarker([next.lat, next.lon], {
      radius: 6,
      color: "#1A1410",
      fillColor: "#E8DCC8",
      fillOpacity: 1
    }).addTo(markerGroup);
  }
  L.marker([cartLat, cartLon], { icon: cartIcon }).addTo(markerGroup);
}
__name(updateMap, "updateMap");
function renderTravelLinesView(state, gameRef, result) {
  const here = gameRef?.getCurrentNode?.();
  const next = gameRef?.getNextNode?.();
  const lines = [];
  if (here) {
    lines.push(`${here.name} \u2014 Day ${state.day}`);
    if (here.desc) lines.push(here.desc);
  }
  if (next) {
    lines.push(`Next: ${next.name}`);
    if (next.desc) lines.push(next.desc);
  }
  if (result) lines.push(result);
  if (!lines.length) lines.push("On the trail...");
  renderNarrative(lines);
}
__name(renderTravelLinesView, "renderTravelLinesView");
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
  crewEl.innerHTML = `<span class="stat-label">Crew </span><span class="${crewCls}">${state.crew}</span>`;
  foodEl.innerHTML = `<span class="stat-label">Food </span><span class="stat-value${state.food <= 4 ? " food-low" : ""}">${state.food}</span>`;
  wearEl.innerHTML = `<span class="stat-label">Wear </span><span class="stat-value${state.wear >= 4 ? " wear-high" : ""}">${state.wear}</span>`;
  if (!window.__METIS_PENDING_RESULT__) window.__METIS_PENDING_RESULT__ = null;
  renderTravelLinesView(state, window._metisGame, window.__METIS_PENDING_RESULT__);
}
__name(renderStatusBar, "renderStatusBar");
function renderNarrative(lines) {
  const el = document.getElementById("narrative");
  el.innerHTML = lines.map((t) => `<div class="scene-text">${t}</div>`).join("");
  el.scrollTop = el.scrollHeight;
}
__name(renderNarrative, "renderNarrative");

// src/ui/persistence.js
var STORAGE_KEY = "metis-trail-v2.save";
function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}
__name(clearSave, "clearSave");

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
  renderNarrative(["Welcome to the M\xE9tis Trail. Click Begin Journey to start."]);
  initMap();
  const gameRoot = find("#game-root");
  if (gameRoot) {
    gameRoot.addEventListener("click", (e) => {
      if (e.target.closest("#intro-start")) {
        const overlay = find("#intro-overlay");
        if (overlay) {
          overlay.classList.remove("active");
          overlay.setAttribute("hidden", "");
        }
        window.__METIS_RENDER__();
      }
    });
  } else {
    console.warn("Metis bootstrap: #game-root not found; Begin Journey button is offline.");
  }
  const travelBtn = find("#btn-travel");
  if (travelBtn) {
    travelBtn.addEventListener("click", () => {
      const { pendingEvent, pendingSettlement, over } = game.getState();
      if (pendingEvent || pendingSettlement || over) return;
      const blocked = travelOneDay();
      if (blocked === true) return;
      window.__METIS_RENDER__();
    });
    travelBtn.setAttribute("data-metis-travel-bound", "1");
  }
  const campBtn = find("#btn-camp");
  if (campBtn) campBtn.onclick = () => {
    publishCampResult();
    game.makeCamp();
    window.__METIS_RENDER__();
  };
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
    game.settlementAction("continue");
    find("#settlement-overlay")?.classList.remove("active");
    window.__METIS_RENDER__();
  };
  const settlementClose = find("#settlement-close");
  if (settlementClose) settlementClose.onclick = () => {
    find("#settlement-overlay")?.classList.remove("active");
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
  const msgs = [];
  msgs.push("Day advances.");
  msgs.push(`-1 Food.`);
  if (state.crew !== prev.crew) msgs.push(`Crew: ${prev.crew} -> ${state.crew}`);
  if (state.wear > prev.wear) msgs.push(`${state.wear - prev.wear} Wear added.`);
  if (state.morale < prev.morale) msgs.push(`Morale: ${prev.morale} -> ${state.morale}`);
  if (state.node > prev.node) {
    msgs.push(`Arrived at: ${game.getCurrentNode().name}`);
  } else if (state.node === prev.node && state.over) {
    msgs.push("Journey ends here.");
  } else if (state.node === prev.node) {
    msgs.push("Still on the trail.");
  }
  const msg = msgs.join(" ");
  publishResult(msg);
  return result;
}
__name(travelOneDay, "travelOneDay");
function publishCampResult() {
  const game = window._metisGame;
  const prev = game.getState();
  game.makeCamp();
  const after = game.getState();
  const msgs = [];
  msgs.push("Camp.");
  if (after.food !== prev.food) msgs.push(`${after.food - prev.food >= 0 ? "+" : ""}${after.food - prev.food} Food`);
  msgs.push(`Crew: ${prev.crew} -> ${after.crew}`);
  if (after.morale !== prev.morale) msgs.push(`Morale: ${prev.morale} -> ${after.morale}`);
  msgs.push(`${after.day - prev.day} Day(s)`);
  publishResult(msgs.join(" "));
}
__name(publishCampResult, "publishCampResult");
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
  if (state.pendingEvent) {
    showEvent(game);
    return;
  }
  if (state.pendingSettlement) {
    showSettlement(game);
    return;
  }
  hideOverlays();
  renderTravelLinesView(state, game, window.__METIS_PENDING_RESULT__);
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
    <div class="roll-label">DC ${result.dc}</div>
    <div class="roll-result ${result.success ? "pass" : "fail"}">${result.success ? "Pass" : "Fail"}</div>
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
      setTimeout(() => {
        revealDiceOutcome(fullDiceResult);
      }, 500);
    }
  }, 60);
}
__name(animateDicePill, "animateDicePill");
function revealDiceOutcome(diceResult) {
  const result = diceResult.result;
  const outcomeEl = document.getElementById("event-dice-outcome");
  if (outcomeEl) {
    const rollHtml = `<span class="outcome-roll">Rolled ${result.roll} vs DC ${result.dc}</span>`;
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
      sourceEl.innerHTML = `<span class="src-quote">"${quote}"</span>` + (attrib ? `<span class="src-attrib">\u2014 ${attrib}</span>` : "");
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
  continueEl.onclick = () => {
    continueEl.classList.remove("ready");
    if (diceResult) {
      const outcome = buildEventChoiceOutcome(diceResult.stepLog, diceResult.before, game.getState());
      if (outcome) publishResult(outcome);
      diceResult = null;
    }
    continueEl.style.display = "none";
    const overlay = document.getElementById("event-overlay");
    if (overlay) overlay.classList.remove("active");
    window.__METIS_RENDER__();
  };
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = ch.text;
    btn.onclick = () => {
      const prev = game.getState();
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
    msgs.push(`Rolled ${res.roll} vs DC ${res.dc}: ${res.success ? "Success" : "Failure"}`);
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
  const next = game.getCurrentNode();
  const before = game.getState();
  const beforeCart = game.getCart();
  const nameEl = document.getElementById("settlement-name");
  const descEl = document.getElementById("settlement-desc");
  const actionsEl = document.getElementById("settlement-actions");
  if (!nameEl || !descEl || !actionsEl) return;
  nameEl.textContent = next.name;
  descEl.textContent = next.desc;
  actionsEl.innerHTML = "";
  const available = game.getAvailableActions();
  (available.actions || []).forEach((action) => {
    if (action === "craft") {
      const recipes = game.getAvailableRecipes();
      if (recipes.length === 0) {
        const wrap2 = document.createElement("div");
        wrap2.className = "settlement-action";
        const btn2 = document.createElement("button");
        btn2.className = "ctrl-btn";
        btn2.style.display = "flex";
        btn2.style.flexDirection = "column";
        btn2.style.alignItems = "flex-start";
        btn2.style.gap = "2px";
        btn2.style.opacity = "0.5";
        btn2.style.cursor = "not-allowed";
        const label2 = document.createElement("div");
        label2.className = "settlement-action-label";
        label2.textContent = "Craft";
        const sub2 = document.createElement("div");
        sub2.className = "settlement-action-sub";
        sub2.textContent = "No recipes available.";
        btn2.appendChild(label2);
        btn2.appendChild(sub2);
        actionsEl.appendChild(btn2);
        return;
      }
      const recipePanel = document.createElement("div");
      recipePanel.style.cssText = "width:100%;margin-top:8px;padding:10px;background:rgba(46,90,62,0.08);border:1px solid rgba(46,90,62,0.3);border-radius:6px;";
      const panelTitle = document.createElement("div");
      panelTitle.style.cssText = "font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--clr-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;";
      panelTitle.textContent = "Crafting";
      recipePanel.appendChild(panelTitle);
      recipes.forEach((r) => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;";
        const inputs = r.inputs.map((inp) => `${inp.name} \xD7${inp.count} (${inp.have}/${inp.count})`).join(" + ");
        const info = document.createElement("div");
        info.style.cssText = "flex:1;font-size:12px;";
        info.innerHTML = `<strong>${r.output.icon || ""} ${r.name}</strong> \u2014 ${inputs} \u2192 <span style="color:var(--clr-accent);">${r.output.mbValue} MB</span>`;
        const craftBtn = document.createElement("button");
        craftBtn.className = "ctrl-btn";
        craftBtn.style.cssText = "padding:3px 10px;font-size:11px;white-space:nowrap;";
        craftBtn.textContent = "Craft";
        craftBtn.disabled = !r.inputs.every((inp) => inp.have >= inp.count);
        if (craftBtn.disabled) craftBtn.style.opacity = "0.4";
        craftBtn.onclick = () => {
          hideOverlays();
          game.craftRecipe(r.id);
          publishResult(`Crafted ${r.name}.`);
          window.__METIS_RENDER__();
        };
        row.appendChild(info);
        row.appendChild(craftBtn);
        recipePanel.appendChild(row);
      });
      actionsEl.appendChild(recipePanel);
      return;
    }
    if (action === "trade") {
      const cart = game.getCart();
      const tradeItems = cart.filter((i) => i.type === "trade" && i.count > 0);
      if (tradeItems.length === 0) {
        const wrap2 = document.createElement("div");
        wrap2.className = "settlement-action";
        const btn2 = document.createElement("button");
        btn2.className = "ctrl-btn";
        btn2.style.cssText = "display:flex;flex-direction:column;align-items:flex-start;gap:2px;opacity:0.5;cursor:not-allowed;";
        const label2 = document.createElement("div");
        label2.className = "settlement-action-label";
        label2.textContent = "Trade";
        const sub2 = document.createElement("div");
        sub2.className = "settlement-action-sub";
        sub2.textContent = "No trade goods.";
        btn2.appendChild(label2);
        btn2.appendChild(sub2);
        actionsEl.appendChild(btn2);
        return;
      }
      const tradePanel = document.createElement("div");
      tradePanel.style.cssText = "width:100%;margin-top:8px;padding:10px;background:rgba(46,90,62,0.08);border:1px solid rgba(46,90,62,0.3);border-radius:6px;";
      const panelTitle = document.createElement("div");
      panelTitle.style.cssText = "font-family:var(--font-heading);font-size:12px;font-weight:600;color:var(--clr-accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;";
      panelTitle.textContent = "Trade";
      tradePanel.appendChild(panelTitle);
      tradeItems.forEach((item) => {
        const est = game.getTradeEstimate(item.name);
        const multStr = est && est.mult > 1 ? " \u2191" : est && est.mult < 1 ? " \u2193" : "";
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;padding:6px;background:rgba(255,255,255,0.5);border-radius:4px;";
        const info = document.createElement("div");
        info.style.cssText = "flex:1;font-size:12px;";
        info.innerHTML = `${item.icon || ""} ${item.name} \xD7${item.count} <span style="color:var(--clr-accent);">${est ? est.min + "-" + est.max + " food" : ""}${multStr}</span>`;
        const tradeBtn = document.createElement("button");
        tradeBtn.className = "ctrl-btn";
        tradeBtn.style.cssText = "padding:3px 10px;font-size:11px;white-space:nowrap;";
        tradeBtn.textContent = "Trade";
        tradeBtn.onclick = () => {
          hideOverlays();
          const result = game.tradeItem(item.name);
          if (result) {
            publishResult(`Traded 1 ${result.item} \u2192 +${result.foodGain} food.`);
          } else {
            publishResult("Trade failed \u2014 no trade goods available.");
          }
          window.__METIS_RENDER__();
        };
        row.appendChild(info);
        row.appendChild(tradeBtn);
        tradePanel.appendChild(row);
      });
      actionsEl.appendChild(tradePanel);
      return;
    }
    const wrap = document.createElement("div");
    wrap.className = "settlement-action";
    const label = document.createElement("div");
    label.className = "settlement-action-label";
    label.textContent = actionLabel(action);
    const sub = document.createElement("div");
    sub.className = "settlement-action-sub";
    sub.textContent = actionSubtitle(action);
    const btn = document.createElement("button");
    btn.className = "ctrl-btn";
    btn.style.display = "flex";
    btn.style.flexDirection = "column";
    btn.style.alignItems = "flex-start";
    btn.style.gap = "2px";
    btn.appendChild(label);
    btn.appendChild(sub);
    btn.onclick = () => {
      hideOverlays();
      game.settlementAction(action);
      const after = game.getState();
      const afterCart = game.getCart();
      const outcome = buildSettlementOutcome(action, before, after, beforeCart, afterCart);
      if (outcome) publishResult(outcome);
      window.__METIS_RENDER__();
    };
    actionsEl.appendChild(btn);
  });
  document.getElementById("settlement-overlay")?.classList.add("active");
}
__name(showSettlement, "showSettlement");
function buildSettlementOutcome(action, before, after, beforeCart, afterCart) {
  const msgs = [];
  if (after.food !== before.food) msgs.push(`${after.food - before.food >= 0 ? "+" : ""}${after.food - before.food} Food`);
  if (after.wear !== before.wear) msgs.push(`Wear ${after.wear - before.wear >= 0 ? "+" : ""}${after.wear - before.wear}`);
  if (after.morale !== before.morale) msgs.push(`Morale ${after.morale - before.morale >= 0 ? "+" : ""}${after.morale - before.morale}`);
  if (after.crew !== before.crew) msgs.push(`Crew: ${before.crew} -> ${after.crew}`);
  if (after.day !== before.day) msgs.push(`${after.day - before.day} Day(s)`);
  if (action === "trade") {
    const gained = afterCart.reduce((s, i) => s + Math.max(0, i.count - (beforeCart.find((j) => j.name === i.name)?.count || 0)), 0);
    if (gained > 0) msgs.push(`Food gained.`);
  }
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
  const weightBar = overloaded ? `<div style="margin-bottom:10px;padding:8px;background:rgba(180,60,60,0.15);border:1px solid rgba(180,60,60,0.4);border-radius:4px;">
        <div style="font-weight:700;color:#8B0000;">\u26A0 Overloaded \u2014 ${state.usedWeight} / ${state.capacity} kg</div>
        <div style="font-size:0.9em;color:#8B0000;margin-top:2px;">Offload at least <strong>${excess} kg</strong> before traveling.</div>
       </div>` : `<div style="margin-bottom:10px;padding:8px;background:rgba(46,90,62,0.12);border:1px solid rgba(46,90,62,0.3);border-radius:4px;">
        <div style="font-weight:700;color:#2D4A3E;">Cart \u2014 ${state.usedWeight} / ${state.capacity} kg</div>
       </div>`;
  const items = cart.map((i) => {
    const canUnload = overloaded && i.count > 0;
    const mbDisplay = i.mbValue ? `<span style="font-size:0.75em;color:var(--clr-accent);margin-left:4px;">${i.mbValue} MB</span>` : "";
    return `
    <div class="cart-row" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid rgba(0,0,0,0.08);">
      <span style="flex:1;">${i.icon || ""} ${i.name} \xD7${i.count} (${i.wt * i.count} kg)${mbDisplay}</span>
      ${canUnload ? `<button class="ctrl-btn unload-btn" data-item="${i.name}" style="padding:2px 10px;font-size:0.85em;">Unload \u2212${i.wt} kg</button>` : ""}
    </div>`;
  }).join("");
  listEl.innerHTML = weightBar + items;
  listEl.querySelectorAll(".unload-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemName = btn.dataset.item;
      game.offloadItem(itemName);
      const newState = game.getState();
      if (newState.usedWeight <= newState.capacity) {
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
function showCrew(game) {
  const c = game.getCrew();
  const el = document.getElementById("crew-status");
  if (!el) return;
  el.innerHTML = `<div>State: ${c.state}</div><div>Morale: ${c.morale}</div><div>Modifier: ${c.mod}</div>`;
  document.getElementById("crew-overlay")?.classList.add("active");
}
__name(showCrew, "showCrew");
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
__name(showEnd, "showEnd");
function actionLabel(a) {
  const map2 = { rest: "Rest", trade: "Trade", repair: "Repair", grease: "Grease", forage: "Forage", recruit: "Recruit", rumours: "Rumours", gossip: "Gossip", heal: "Heal", craft: "Craft", continue: "Continue West" };
  return map2[a] || a;
}
__name(actionLabel, "actionLabel");
function actionSubtitle(a) {
  const map2 = {
    rest: "Crew rested, morale restored, supplies refresh.",
    trade: "Spend one trade good for food. Yield varies by item and settlement.",
    repair: "Reduce wheel wear, or apply shaganappi if carried.",
    grease: "Consume shaganappi to silence axle squeal.",
    forage: "D20 + crew modifier; 12+ gains 1-4 food.",
    recruit: "Rests tired crew if not exhausted.",
    rumours: "Advance one day. Hear scattered news \u2014 less reliable than proper gossip.",
    gossip: "Spend a day learning trail news and local gossip. Costs 1 day.",
    heal: "Crew rested, morale restored.",
    craft: "Combine items into higher-value trade goods.",
    continue: "Resume the journey."
  };
  return map2[a] || "";
}
__name(actionSubtitle, "actionSubtitle");
window.__METIS_RENDER__ = render;
export {
  bootstrap
};

if (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }