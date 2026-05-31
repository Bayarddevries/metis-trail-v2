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

// src/data/events.js
var EVENT_POOLS = {
  plains: [
    {
      id: "plains_trader",
      text: "A Metis freighter catches up to your cart. He eyes your load and offers a short-term deal.",
      classification: "Freight & Trade",
      source: { quote: "The freighting trade along the Carlton Trail was dominated by Metis independent carters.", author: "MMF Research", work: "Research Vault" },
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
      text: "A hot wind pushes at your back. The prairie grass ripples like water.",
      choices: [
        { text: "Run with it", dc: 10, ok: "You make excellent time.", bad: "A hidden rut jolts the cart. Repairs are needed after crossing.", wear: 1, time: -1 },
        { text: "Hunker down", dc: null, always: "You wrap the load and keep moving. No rain comes.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_camp_cookery",
      text: "Midday halt by a cattail slough. Pemmican is passed around; bannock is frying. A M\xE9tis campsite nearby offers company.",
      source: { quote: "Pemmican cooked in a frying-pan, a little grease, pepper, salt, with a trace of onions and potatoes added, constituted this, a dish to set before a king.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Share rubaboo and trade stories", dc: 8, ok: "The circle of travellers is warm. Morale rises.", bad: "You are too guarded to connect fully.", morale: 8, addsRep: { key: "metis", delta: 1 }, setsFlag: "shared_camp_meal" },
        { text: "Eat quickly and move on", dc: null, always: "Hunger is satisfied, but nothing more.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_night_camp",
      text: "Moonlight spills across the prairie. Somewhere nearby a fiddle begins a Red River jig.",
      source: { quote: "The Red River jig was struck up, and one after another exercised himself to his heart's content.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Dance until your boots throw dust", dc: 10, ok: "Laughter drowns out the dark.", bad: "You strain a shoulder and sleep poorly.", morale: 12, addsRep: { key: "metis", delta: 1 } },
        { text: "Turn in early; tomorrow is long", dc: null, always: "Rest restores you in small measure.", morale: 4 }
      ]
    },
    {
      id: "plains_ox_scatter",
      text: "The oxen have scattered after drinking. The mid-day camp is a chaos of traces and running hooves.",
      source: { quote: "To drive the refractory animals among the carts was a last resort.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Call and whistle them back", dc: 11, ok: "The animals respond to the familiar sounds.", bad: "You lose an hour rounding them up.", time: 1, morale: -4 },
        { text: "Send someone ahead", dc: 9, ok: "Your crew brings them in quietly and quickly.", bad: "One runner turns an ankle.", crew: "tired", addsRep: { key: "metis", delta: 1 } }
      ]
    },
    {
      id: "plains_squeal",
      text: "The dry wood of the hub screams against the axle \u2014 a sound that carries for miles.",
      source: { quote: "When loaded it gave forth a blood-curdling squeal which could be heard for miles and which came to be associated with it.", author: "Harry Baker Brehaut", work: "The Red River Cart and Trails, MHS Transactions, 1971-72" },
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
      text: "You encounter a massive buffalo hunt camp \u2014 hundreds of carts in a great circle, the air thick with dust and the sound of running horses.",
      source: { quote: "Four hundred mounted huntsmen await the signal... the earth trembles.", author: "Brehaut, citing Alexander Ross", work: "MHS Transactions, 1971-72" },
      choices: [
        { text: "Join the hunt", dc: 12, ok: "The hunt captain nods. You take a share of the meat.", bad: "You are slow to position. You earn only a strip.", food: 8, addsRep: { key: "metis", delta: 2 } },
        { text: "Observe and move on", dc: null, always: "You watch from a respectful distance. The hunt is spectacular.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_prairie_fire",
      text: "Smoke on the horizon. The dry grass crackles \u2014 a wall of flame races toward you.",
      source: { quote: "The prairie burned every afternoon... the oxen grew restless in the smoke.", author: "Father Albert Lacombe", work: "Missionary Journals, 1878" },
      choices: [
        { text: "Ride for the river bottom", dc: 14, ok: "The fire edge passes. You lose only a afternoon's travel.", bad: "The wind shifts. You lose supplies and the cart is singed.", food: -3, wear: 1, morale: -12 },
        { text: "Light a backfire and wait it out", dc: 11, ok: "A practised escape. The backfire draws the main blaze away.", bad: "The flames jump. Your cart is spared but the oxen panic.", morale: -8, time: -1 }
      ]
    },
    {
      id: "plains_sayer_trial",
      text: "A M\xE9tis settlement celebrates the anniversary of the Sayer trial. Free trade pride fills the air \u2014 and your cart.",
      source: { quote: "The trial of Pierre Guillaume Sayer marked the beginning of free trade in the West.", author: "MMF Historical Research", work: "metis-research-vault" },
      choices: [
        { text: "Display independent freight proudly", dc: 9, ok: "The folk cheer. Prices are better here.", bad: "You are taken for a Company man. Prices are unkind.", food: 5, addsRep: { key: "metis", delta: 2 } },
        { text: "Stay quiet and keep moving", dc: null, always: "Circumspection keeps your goods and your secrets.", alwaysWear: 0 }
      ]
    },
    {
      id: "plains_burnt_prairie",
      text: "The prairie here has been burnt black. No grass, no water, and the sun is relentless.",
      source: { quote: "Bichon, the patient, would do his best and, failing, would lie down in the one.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Push through to the next water", dc: 12, ok: "You make the crossing with grit.", bad: "The oxen lag. You are forced to camp on burnt ground.", food: -2, crew: "tired" },
        { text: "Detour to a shaded coulee", dc: null, always: "A slower, safer day. Grass and water restore the animals.", time: 1 }
      ]
    },
    {
      id: "plains_sand_hills",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1, morale: -4 },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_windfall",
      text: "A great elm has fallen across the trail \u2014 branches splayed like fingers blocking the path.",
      source: { quote: "A great elm has fallen across the trail.", author: "Schultz (1894)" },
      choices: [
        { text: "Cut a way through", dc: 10, ok: "The path opens. Useful firewood goes on the cart.", bad: "The work is harder than expected.", time: 1 },
        { text: "Bypass through the bush", dc: 11, ok: "The bush breaks open onto the old trail.", bad: "A branch catches the canvas cover.", wear: 1 },
        { text: "Backtrack to the ford", dc: null, always: "A long, slow re-route. But safe.", time: 2 }
      ]
    },
    {
      id: "plains_axle_snap",
      text: "A sickening crack \u2014 the right axle shears against a hidden stone half-buried in yesterday's washout.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Set a splice with rope and wedges", dc: 11, ok: "A jury-rig holds. Progress is slow, but the cart is rolling again.", bad: "The splice splits by noon.", wear: 1, time: 1, morale: -4 },
        { text: "Cache the load and press on light", dc: null, always: "You bury the crated freight and mark the spot. The cart is light, but you return poorer.", time: -1, food: -4 }
      ]
    },
    {
      id: "plains_bear_camp",
      text: "Dawn finds a cinnamon bear rooting through your bread sack at the edge of camp.",
      source: { quote: "The bears along the Carlton were a constant threat to unprotected provisions.", author: "Brehaut, citing Fort Qu'Appelle accounts", work: "MHS Transactions, 1971-72" },
      choices: [
        { text: "Beat the pan and drive it off", dc: 11, ok: "The bear lumbers away with a swat at its nose.", bad: "It turns. A strap snaps and half the flour is gone.", food: -3, morale: -6, wear: 1 },
        { text: "Climb for height and wait", dc: null, always: "The bear eventually loses interest. You lose the morning, not the flour.", time: 1 }
      ]
    },
    {
      id: "plains_hail",
      text: "The sky turns green and the air goes still. Then the hail comes \u2014 stones the size of walnuts.",
      source: { quote: "Sudden storms of hail and sleet were not uncommon on the open prairie in late spring.", author: "Lacombe missionary journals, 1878" },
      choices: [
        { text: "Cover the canvas and ride it out", dc: 10, ok: "The wagon top holds. The oxen are skittish but unhurt.", bad: "Canvas tears and two rounds of cheese are spoiled.", food: -2, morale: -4 },
        { text: "Scramble to the nearest coulee", dc: 9, ok: "Natural shelter saves the load.", bad: "A slipped wheel in the rush.", wear: 1 }
      ]
    },
    {
      id: "plains_theft",
      text: "Camp is crowded. You wake to find a small bundle of trade goods missing from the cart pole.",
      source: { quote: "Thefts at rendezvous camps were usually petty and punished by the trail's own informal courts.", author: "MMF Historical Research" },
      choices: [
        { text: "Tell the camp overseer and help search", dc: 9, ok: "The goods are returned. The thief is ordered to pay in labour.", addsRep: { key: "metis", delta: 1 } },
        { text: "Write it off and tighten watch", dc: null, always: "Pragmatic. The trail teaches scarcity.", alwaysWear: 0, morale: -2 }
      ]
    }
  ],
  river_valley: [
    {
      id: "river_valley_sudden_rain",
      text: "The heavy cloud bursts without warning. The trail turns to a slurry and the cart sinks to the naves.",
      source: { quote: "Sudden storms of rain turned the valley trail into a bog that could trap a loaded cart for hours.", author: "Lacombe missionary journals, 1878" },
      choices: [
        { text: "Unhitch and pole the cart through", dc: 12, ok: "The oxen respond; you keep moving, soaked.", bad: "A wheel hub sinks axle-deep.", wear: 1, morale: -4 },
        { text: "Wait it out on dry ground", dc: null, always: "Two hours of rain. The mud thickens.", time: 1 }
      ]
    },
    {
      id: "river_valley_broken_axle",
      text: "A hidden washout has eaten into the bank. The cart slews and the axle groans.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Set a temporary truss with canvas and rope", dc: 11, ok: "A crude repair holds for the remaining miles.", bad: "The truss fails in the next gully.", wear: 1, time: 1 },
        { text: "Spike the wheel and coast downhill", dc: null, always: "You save time but the wheel wobbles loose.", alwaysWear: 1, morale: -4 }
      ]
    },
    {
      id: "river_high",
      text: "The river is running high and fast. The bank trail is muddy and narrow.",
      source: { quote: "The carts had indeed entered straight into the water... turned upstream to make the crossing in a horse shoe fashion.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Ford carefully", dc: 13, ok: "The ox keeps footing and you stay dry enough.", bad: "The cart tilts in the current. Repairs are needed after crossing.", wear: 1 },
        { text: "Wait for afternoon", dc: null, always: "You camp and cross later when the water drops.", time: 1 },
        { text: "Scout for the horse-shoe ford upstream", dc: 11, ok: "You find the concealed path and cross safely.", bad: "The scouting costs precious daylight and energy.", morale: -4, time: -1 }
      ]
    },
    {
      id: "river_mp_check",
      text: "An NWMP patrol stops you just above the ferry landing.",
      choices: [
        { text: "Show your papers", dc: 9, ok: "The permits read clearly. They let you pass.", bad: "A signature mismatch. You are delayed.", time: 1, addsRep: { key: "nwmp", delta: 1 } },
        { text: "Talk your way past", dc: 12, ok: "They accept your story.", bad: "They insist on a spot inspection. Wear is likely.", wear: 1, addsRep: { key: "nwmp", delta: -1 }, branch: () => ({
          id: "nwmp_detain",
          text: "The inspection turns up a loose rivet in your axle. The sergeant orders you to make camp until morning.",
          choices: [
            { text: "Comply and camp for the night", dc: null, always: "The sergeant inspects in the morning and lets you go.", time: 1, addsRep: { key: "nwmp", delta: 1 } },
            { text: "Argue your case", dc: 10, ok: "The sergeant relents, but writes your name in the ledger.", bad: "You are held another full day.", time: 2, wear: 1 }
          ]
        }) }
      ]
    },
    {
      id: "river_valley_bank_descent",
      text: "The opposite bank is steep \u2014 eight feet of loose earth down to the water.",
      source: { quote: "A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Lower the cart with a line tied to a tree", dc: 10, ok: "A careful descent protects the load.", bad: "The knot slips at the last moment; the cart jars.", wear: 1 },
        { text: "Free descent", dc: null, always: "The cart slides hard; the contents shift dangerously.", alwaysWear: 1 }
      ]
    },
    {
      id: "river_boat",
      text: "At a wide crossing the captain offers passage \u2014 but he is clearly understaffed and the ferry rocks.",
      choices: [
        { text: "Board and keep the load centred", dc: 11, ok: "You ride the swell and land clean.", bad: "A barrel breaks loose and damages a wheel.", wear: 1, food: -2 },
        { text: "Wait for a larger brigade", dc: null, always: "A safer but slower choice.", time: 2 }
      ]
    },
    {
      id: "river_cholera_camp",
      text: "A member of your crew wakes shaking and cold \u2014 by midday they cannot stand. The river water was contaminated.",
      source: { quote: "A waterborne bacteria that thrived in the stagnant water of common camping grounds.", author: "Cart Trail Game Research (2025)" },
      choices: [
        { text: "Use the medicine pouch and rest the day", dc: 14, ok: "The crisis passes. One day lost, but the crew recovers.", bad: "The fever breaks but the crew is weak for days.", crew: "tired", morale: -8 },
        { text: "Push through without rest", dc: null, always: "The worst passes but the toll is steep.", morale: -20, crew: "exhausted" }
      ]
    },
    {
      id: "river_mosquito_camp",
      text: "The mosquitoes rise in clouds from the riverbank. The oxen stampede; the cooking fire smoulders.",
      source: { quote: "Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Move camp to high ground before dark", dc: 9, ok: "The move is miserable but the night is quieter.", bad: "A wheel is twisted in the dark.", wear: 1 },
        { text: "Use canvas tarps and tough it out", dc: 11, ok: "You hunker down. Morning comes.", bad: "The insects are relentless. Morale falls hard.", morale: -10 }
      ]
    },
    {
      id: "river_cart_raft",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart.",
      source: { quote: "Four cart wheels were taken and placed dish upwards... The boat was launched, and floated like a duck.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Build a cart-raft with 4 bison hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river; cargo gets wet.", morale: -6, setsFlag: "built_rafts", requiresFlag: "has_hides", branch: {
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
      text: "Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.",
      source: { quote: "Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.", author: "Dumont Family Accounts", work: "MMF Research Vault" },
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    }
  ],
  wooded: [
    {
      id: "wooded_cree",
      text: "A Cree hunter steps onto the trail ahead. He studies your cart and nods at the pemmican sacks.",
      choices: [
        { text: "Offer a trade", dc: 11, ok: "He swaps fresh meat for part of your load.", bad: "He senses you are short on food. The deal goes poorly.", food: 3, addsRep: { key: "cree", delta: 1 } },
        { text: "Keep moving", dc: null, always: "He watches but does not interfere.", alwaysWear: 0 }
      ]
    },
    {
      id: "wooded_ambush_ravine",
      text: "A hidden rut drops one wheel into a creek bed \u2014 the cart tilts dangerously.",
      source: { quote: "Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails.", author: "Cart Trail Game Research", work: "Research Vault" },
      choices: [
        { text: "Catch the weight and right it", dc: 12, ok: "Quick hands save the day.", bad: "The cart upsets. One food item is lost.", food: -1, wear: 1 },
        { text: "Call for help", dc: 9, ok: "A nearby M\xE9tis party rights the cart swiftly.", bad: "Helpers arrive slow and grumpy.", morale: -5, time: 1 }
      ]
    },
    {
      id: "wooded_stung_by_flies",
      text: "The mosquitoes and biting flies rise from the slough. The animals spook and the crew wants to run.",
      source: { quote: "Bound away to the water, into which they plunged neck deep, remaining there safe from the tormenting flies and mosquitoes.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Drive through to firmer ground", dc: 11, ok: "You outpace the worst of the cloud.", bad: "The animals bolt; a strap snaps.", wear: 1, crew: "tired" },
        { text: "Let the oxen cool in the water", dc: null, always: "The delay costs time but saves nerves.", time: 1 }
      ]
    },
    {
      id: "wooded_black_bear",
      text: "A black bear crosses the trail thirty yards ahead, then stops and turns, taking the measure of the party.",
      source: { quote: "Bears were common along the wooded corridors of the Carlton Trail and could be dangerous when surprised at close range.", author: "Brehaut, citing Fort Qu'Appelle accounts", work: "MHS Transactions, 1971-72" },
      choices: [
        { text: "Stand your ground and make noise", dc: 12, ok: "The bear veers away.", bad: "It charges and the oxen bolt.", wear: 1, morale: -6, crew: "tired" },
        { text: "Back away quietly with the cart", dc: null, always: "The bear waits until you are clear, then moves on.", time: 1 }
      ]
    },
    {
      id: "wooded_rattlesnake",
      text: "A rattlesnake hums in the grass beside the trail, still as a root until you are almost on it.",
      source: { quote: "Rattlesnakes were common on the southern stretches of the trail and caused many a nervous night.", author: "Schultz, citing settler accounts", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Hook it clear with a pole and move on", dc: 10, ok: "The snake disappears into the brush.", bad: "It strikes at the lead ox.", wear: 1, morale: -2 },
        { text: "Backtrack to a wider crossing", dc: null, always: "A slow detour, but nerves settle.", time: 1 }
      ]
    },
    {
      id: "wooded_axle_rut",
      text: "A hidden washout drops the front wheel axle-deep. The cart tilts dangerously toward the ditch.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Spade and block the wheel", dc: 11, ok: "You free the cart without damage.", bad: "The soil gives way twice.", time: 1, morale: -3 },
        { text: "Lighten and rock it free", dc: 9, ok: "A quick heave gets you out clean.", bad: "A crate lands in the muck.", food: -2, wear: 1 }
      ]
    }
  ],
  uplands: [
    {
      id: "upland_high_pass",
      text: "The trail climbs onto a windy upland bench. Rain draws near.",
      choices: [
        { text: "Press through before the storm", dc: 11, ok: "You gain the far shelter with minutes to spare.", bad: "The rain catches you on exposed ground.", wear: 1, morale: -6 },
        { text: "Hike to a rocky ledge and wait", dc: null, always: "Cold, but the cart and crew are intact.", time: 1 }
      ]
    },
    {
      id: "upland_sand_hill",
      text: "The ground turns treacherous \u2014 old stumps hidden in tall grass, narrow coulees cutting across the path.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of its stumps and coulees.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Hug the ridge line to avoid low ground", dc: 11, ok: "Clear ground saves the cart.", bad: "A hidden stump catches the wheel hub.", wear: 1 },
        { text: "Take the direct trail", dc: null, always: "The going is rough but quick.", alwaysWear: 0 }
      ]
    },
    {
      id: "upland_thunderstorm",
      text: "The ridge offers no shelter. Lightning finds the highest point and the rain comes down in sheets.",
      source: { quote: "Sudden storms of hail and sleet were not uncommon on the uplands in late spring.", author: "Lacombe missionary journals, 1878" },
      choices: [
        { text: "Hobble the oxen and weather it under the cart", dc: 11, ok: "The canvas holds. You are soaked but intact.", bad: "A lightning-struck tree falls nearby.", morale: -6, time: -1 },
        { text: "Run for the coulee bottom", dc: 9, ok: "Lower ground is safer.", bad: "A slipped wheel in the mud.", wear: 1 }
      ]
    }
  ],
  river: [
    {
      id: "ferry_gabriel",
      text: "Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.",
      source: { quote: "Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.", author: "Dumont Family Accounts", work: "MMF Research Vault" },
      choices: [
        { text: "Take the ferry now", dc: 10, ok: "He rows hard and gets you across cleanly.", bad: "The ferry lurches. Cargo shifts and one wheel takes damage.", wear: 1, addsRep: { key: "metis", delta: 1 } },
        { text: "Wait out the current", dc: null, always: "You wait one day for calmer water.", time: 1 }
      ]
    },
    {
      id: "river_cart_raft",
      text: "The crossing here is too deep to ford. You eye the spare hides in the cart.",
      source: { quote: "Four cart wheels were taken and placed dish upwards... The boat was launched, and floated like a duck.", author: "William G. Fonseca", work: "On the St. Paul Trail in the Sixties, MHS Transactions, 1900" },
      choices: [
        { text: "Build a cart-raft with 4 bison hides", dc: 12, ok: "The improvised ferry floats. The crew swims the line across.", bad: "One hide splits mid-river; cargo gets wet.", morale: -6, setsFlag: "built_rafts", requiresFlag: "has_hides", branch: {
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
      text: "At the crossing, red coats inspect the carts with scrupulous care. Duty is collected in cash or goods.",
      source: { quote: "The mounted police established posts along the trail to enforce Ottawa's regulations.", author: "R. C. Macleod", work: "The North-West Mounted Police and Law Enforcement, 1873-1905" },
      choices: [
        { text: "Declare your goods and pay duty", dc: null, always: "The paperwork is tedious but fair. You keep your peace.", food: -2, addsRep: { key: "nwmp", delta: 1 } },
        { text: "Attempt to pass quietly", dc: 13, ok: "They are busy and let you slip through.", bad: "Caught concealing cargo. Goods are confiscated.", morale: -15, addsRep: { key: "nwmp", delta: -2 } }
      ]
    },
    {
      id: "river_lawrence_barkwell_boats",
      text: "You meet a crew of boatmen heading for the Portage La Loche. Their faces are lean, their hands calloused, but their eyes are sharp.",
      source: { quote: "This famous brigade traveled 4000 miles every year... the pay of a guide for the entire trip occupying the four summer months has been \xA335.", author: "Lawrence Barkwell", work: "Portage La Loche Brigade, Louis Riel Institute" },
      choices: [
        { text: "Exchange dried fish and route talk", dc: 8, ok: "They share intelligence on the next water crossings.", bad: "The conversation is brief and businesslike.", morale: 6 },
        { text: "Hire a guide for the hard water ahead", dc: 10, ok: "A steady hand joins your crew for three days.", bad: "The boatman is competent but expensive.", food: -3, extraProgress: 2, addsRep: { key: "metis", delta: 1 } }
      ]
    },
    {
      id: "river_broken_wheel",
      text: "The wheel bites into a submerged root and the rim splits with a crack.",
      source: { quote: "Many a worn-out axle and broken wheel attest the power of riverbank obstacles.", author: "John C. Schultz", work: "The Old Crow Wing Trail, MHS Transactions, 1894" },
      choices: [
        { text: "Fell a nearby birch and fashion a new felly", dc: 12, ok: "A rough repair, but the wheel is round again.", bad: "The timber is green and splits by afternoon.", wear: 1, time: 1, morale: -3 },
        { text: "Rig an axle skid and limp to the post", dc: null, always: "You arrive, but the cart is lopsided and the load is light.", alwaysWear: 1, food: -2 }
      ]
    }
  ]
};
function getEventsForTerrain(terrain) {
  return EVENT_POOLS[terrain] || EVENT_POOLS.plains;
}
function pickEventForTerrain(terrain, rng) {
  const pool = getEventsForTerrain(terrain);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
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
    flags: {},
    reputation: { hbc: 0, nwmp: 0, metis: 0, mission: 0, cree: 0 }
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
  function pickEvent() {
    if (rand() > CONSTANTS.EVENT_CHANCE) return null;
    return pickEventForTerrain(NODES[S.node]?.terrain || "plains", rand);
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
function availableSettlementActions(type) {
  const base = ["rest"];
  if (type === "hbc") return [...base, "trade", "repair", "grease", "forage", "recruit"];
  if (type === "metis") return [...base, "trade", "grease", "forage", "rumours", "recruit"];
  if (type === "trading") return [...base, "trade", "forage", "rumours"];
  if (type === "mission") return [...base, "heal", "rumours"];
  if (type === "nwmp") return [...base, "trade", "grease", "rumours"];
  return base;
}

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
  const gameRoot = document.getElementById("game-root");
  if (!gameRoot) throw new Error("#game-root missing");
  applyTheme(gameRoot);
  return gameRoot;
}
function find(selector) {
  return document.querySelector(selector);
}

// src/ui/renderer.js
var map = null;
var tileLayer = null;
var markerGroup = null;
function initMap() {
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;
  if (map) return;
  applyTheme(el);
  map = L.map("map", {
    center: [NODES[0].lat, NODES[0].lon],
    zoom: 6,
    zoomControl: true
  });
  tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OSM contributors",
    maxZoom: 18
  }).addTo(map);
  markerGroup = L.featureGroup().addTo(map);
  updateMap({ node: 0 });
}
function updateMap(state) {
  if (!map) return;
  const here = NODES[state.node];
  if (!here) return;
  const visited = NODES.slice(0, state.node + 1).map((n) => [n.lat, n.lon]);
  const next = NODES[state.node + 1];
  map.setView([here.lat, here.lon], Math.max(map.getZoom(), 6));
  if (!markerGroup) markerGroup = L.featureGroup().addTo(map);
  markerGroup.clearLayers();
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
  L.circleMarker([here.lat, here.lon], {
    radius: 8,
    color: "#1A1410",
    fillColor: "#8B2500",
    fillOpacity: 1
  }).addTo(markerGroup);
}
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
  renderNarrative(["Welcome to the M\xE9tis Trail. Click Begin Journey to start."]);
  const startBtn = find("#intro-start");
  if (startBtn) startBtn.addEventListener("click", () => {
    find("#intro-overlay")?.classList.remove("active");
    initMap();
    render();
  });
  find("#btn-travel").addEventListener("click", () => {
    const { pendingEvent, pendingSettlement, over } = game.getState();
    if (pendingEvent || pendingSettlement || over) return;
    travelOneDay();
    render();
  });
  find("#btn-camp").onclick = () => {
    publishCampResult();
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
var pendingResult = null;
function publishResult(text) {
  pendingResult = text;
}
function travelOneDay() {
  const game = window._metisGame;
  const prev = game.getState();
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
function publishCampResult() {
  const game = window._metisGame;
  const prev = game.getState();
  const msgs = [];
  msgs.push("Camp.");
  msgs.push("-1 Food.");
  msgs.push("+1 Day.");
  msgs.push("Crew rested.");
  if (prev.morale < 100) {
    const newMorale = Math.min(100, prev.morale + 15);
    msgs.push(`Morale: ${prev.morale} -> ${newMorale}`);
  }
  publishResult(msgs.join(" "));
}
function render() {
  const game = window._metisGame;
  if (!game) return;
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
  renderTravelLines(state, game, pendingResult);
  pendingResult = null;
}
function renderTravelLines(state, gameRef, result) {
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
function hideOverlays() {
  ["event-overlay", "settlement-overlay", "cart-overlay", "crew-overlay"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
}
var pendingDice = null;
function rollDiceOnce() {
  return Math.floor(Math.random() * 20) + 1;
}
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
function animateDicePill(result) {
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
      const settled = rollDiceOnce();
      el.textContent = String(settled);
      el.className = "die small font-spectral " + (result.success ? "pass" : "fail");
    }
  }, 60);
}
function showEvent(game) {
  const ev = game.getPendingEvent();
  if (!ev) return;
  const textEl = document.getElementById("event-text");
  const choicesEl = document.getElementById("event-choices");
  const continueEl = document.getElementById("event-continue");
  if (!textEl || !choicesEl) return;
  textEl.textContent = ev.text;
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
  const rc = document.getElementById("event-roll-display");
  if (rc) rc.style.display = "none";
  (ev.choices || []).forEach((ch, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = ch.text;
    btn.onclick = () => {
      const prev = game.getState();
      const stepLog = game.chooseEventChoice(i);
      const entry = stepLog && stepLog[0] ? stepLog[0] : null;
      const res = entry && entry.result ? entry.result : entry;
      if (res && res.roll !== null && res.dc !== null) {
        btn.disabled = true;
        pendingDice = res;
        renderDicePill(res);
        animateDicePill(res);
        setTimeout(() => {
          const outcome2 = buildEventChoiceOutcome(stepLog, prev, game.getState());
          if (outcome2) publishResult(outcome2);
          pendingDice = null;
          render();
        }, 650 + Math.random() * 180);
        return;
      }
      const outcome = buildEventChoiceOutcome(stepLog, prev, game.getState());
      if (outcome) publishResult(outcome);
      render();
    };
    choicesEl.appendChild(btn);
  });
  document.getElementById("event-overlay")?.classList.add("active");
}
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
      render();
    };
    actionsEl.appendChild(btn);
  });
  document.getElementById("settlement-overlay")?.classList.add("active");
}
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
  if (action === "rest") msgs.push("Rest. Crew and supplies refreshed.");
  if (!msgs.length) return "Nothing changed.";
  return msgs.join(", ");
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
  const map2 = { rest: "Rest", trade: "Trade", repair: "Repair", grease: "Grease", forage: "Forage", recruit: "Recruit", rumours: "Gossip", heal: "Heal", continue: "Continue West" };
  return map2[a] || a;
}
function actionSubtitle(a) {
  const map2 = {
    rest: "Crew rested, morale restored, supplies refresh.",
    trade: "Spend one trade good for +6-10 food.",
    repair: "Reduce wheel wear, or apply shaganappi if carried.",
    grease: "Consume shaganappi to silence axle squeal.",
    forage: "D20 + crew modifier; 12+ gains 1-4 food.",
    recruit: "Rests tired crew if not exhausted.",
    rumours: "Advance one day, learn trail news.",
    heal: "Crew rested, morale restored.",
    continue: "Resume the journey."
  };
  return map2[a] || "";
}
export {
  bootstrap
};

if (!window.__METIS_BOOTED__) { window.__METIS_BOOTED__ = true; try { bootstrap(); } catch (e) { console.error("Metis boot error:", e); } }