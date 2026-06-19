/**
 * Journal Narrative Polish (Phase 0.8)
 * First-person templates for travel, camp, settlement, item-use, leave-behind entries.
 * Descriptive food strings and narrative variety.
 */

import { NODES } from '../data/nodes.js';

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ── Food description helpers ─────────────────────────────────────────

/** Convert raw food units into narrative description */
export function describeFood(units) {
  const u = Math.floor(units);
  if (u <= 0) return 'No food left. The larder is bare.';
  if (u === 1) return 'One day\'s pemmican remains.';
  if (u <= 3) return `${u} days\' pemmican.`; 
  if (u <= 7) return `A week\'s worth of pemmican (${u} days).`;
  if (u <= 14) return `Two weeks\' pemmican (${u} days).`;
  return `Well-stocked: ${u} days\' pemmican.`;
}

/** Get food status for status bar display */
export function getFoodStatusText(units) {
  const u = Math.floor(units);
  if (u <= 0) return 'Starving';
  if (u <= 3) return 'Critical';
  if (u <= 7) return 'Low';
  if (u <= 14) return 'Adequate';
  return 'Plentiful';
}

// ── Template arrays for narrative variety ────────────────────────────

const TRAVEL_OPENINGS = [
  (prev, next) => `We broke camp at ${prev} before dawn. ${next} lay ahead.`,
  (prev, next) => `The cart rolled out of ${prev} with first light. ${next} was the day's mark.`,
  (prev, next) => `Left ${prev} behind us. The trail to ${next} stretched empty and wide.`,
  (prev, next) => `Dawn found us harnessing up at ${prev}. ${next} called from the west.`,
  (prev, next) => `We pushed on from ${prev}. The road to ${next} would not walk itself.`,
];

const TRAVEL_MIDDLES = [
  'The wheels groaned beneath the load. Oxen plodded, patient as the grass is tall.',
  'A long day under a bowl of sky. Nothing but grass and wind for miles.',
  'The trail wound through grass taller than a rider on horseback.',
  'Clouds gathered west but held their rain. We counted oxen at noon — all present.',
  'The jingle of harness, the creak of wood. The rhythm of the Carlton Trail.',
  'Heat shimmered off the prairie. The oxen breathed hard, but kept their pace.',
  'A hawk circled overhead. The grass rippled like water in the wind.',
];

const TRAVEL_WEAR_LINES = [
  'The cart took a beating — the axle groans louder now.',
  'A bad rut near the river crossing. The near wheel nearly came off.',
  'The trail was rough today. Boards shifted in the bed. We\'ll need to check the lashings.',
  'Red River carts are tough, but this ground tests them. Wear shows on the hubs.',
];

const TRAVEL_WEATHER_LINES = {
  overcast: [
    'A grey ceiling followed us all day. No sun, no rain — just the weight of cloud.',
    'The sky closed over by morning. Flat grey, pressing down on the grass.',
  ],
  rain: [
    'Cold rain came on by midday. We huddled under canvas, steam rising from the oxen.',
    'A soaking rain. The trail turned to grease. Wheels sank to the hubs in places.',
  ],
  storm: [
    'Thunder rolled across the prairie like wagon wheels on stone. We pressed on regardless.',
    'Lightning split the sky. The oxen balked but the whip brought them round.',
  ],
  snow: [
    'Snow fell fine as powder, dusting the oxen\'s backs. Winter breathes early here.',
    'First snow of the season. White fingers in the grass. The cart left dark tracks.',
  ],
};

// ── Event prose templates (weather + item aware) ──────────────────────

const EVENT_CHOICE_RAIN_SUCCESS = [
  (choiceText) => `The rain hammered down but ${choiceText.toLowerCase()}. The ground was slick, boots heavy, but the work got done.`,
  (choiceText) => `Rain-soaked ground made every step a fight, yet ${choiceText.toLowerCase()}. The tarp shed water like a duck's back.`,
  (choiceText) => `Midday deluge. You ${choiceText.toLowerCase()} through the downpour. Canvas kept the powder dry — that mattered.`,
];

const EVENT_CHOICE_RAIN_FAILURE = [
  (choiceText) => `The rain turned the trail to soup. You tried to ${choiceText.toLowerCase()} but the mud won. Boots stuck, temper frayed.`,
  (choiceText) => `Cold rain all day. ${choiceText} failed — the ground went to grease and the wagon slid sideways.`,
  (choiceText) => `Rain found every seam. You ${choiceText.toLowerCase()} but the wet powder fouled. A miserable failure.`,
];

const EVENT_CHOICE_STORM_SUCCESS = [
  (choiceText) => `Thunder cracked overhead. You ${choiceText.toLowerCase()} with lightning at your back. The oxen held — barely.`,
  (choiceText) => `Storm winds howled. Still you ${choiceText.toLowerCase()}. The tarp snapped but held. The work is done.`,
  (choiceText) => `Black sky, white lightning. You ${choiceText.toLowerCase()} and the gods didn't strike you down.`,
];

const EVENT_CHOICE_STORM_FAILURE = [
  (choiceText) => `The storm broke right when you needed calm. ${choiceText} went wrong — lightning spooked the oxen, wind scattered your focus.`,
  (choiceText) => `Thunder rolled like drumbeats of doom. You ${choiceText.toLowerCase()} but the elements swallowed the effort.`,
  (choiceText) => `A flash, a crack, the oxen bolted. ${choiceText} — abandoned. The storm took its due.`,
];

const EVENT_CHOICE_SNOW_SUCCESS = [
  (choiceText) => `Snow muffled the world. You ${choiceText.toLowerCase()} in the white quiet. Blankets and firewood kept the chill at bay.`,
  (choiceText) => `First snow dusted the trail. You ${choiceText.toLowerCase()} with cold fingers but steady hands. The fire waited at camp.`,
  (choiceText) => `White fingers of winter in the grass. Still you ${choiceText.toLowerCase()} and the work held.`,
];

const EVENT_CHOICE_SNOW_FAILURE = [
  (choiceText) => `Snow blinded the way. You tried to ${choiceText.toLowerCase()} but the cold stole feeling from fingers. The work slipped.`,
  (choiceText) => `Frost bit deep. ${choiceText} failed — no firewood, no blankets, just the cold and the failure.`,
  (choiceText) => `The snow came down thick. You ${choiceText.toLowerCase()} but the world went white. Nothing gained.`,
];

const EVENT_CHOICE_OVERCAST_SUCCESS = [
  (choiceText) => `Grey sky, flat light. You ${choiceText.toLowerCase()} in the gloom. No rain, no sun — just the work.`,
  (choiceText) => `The clouds pressed low. You ${choiceText.toLowerCase()} without drama. Steady does it.`,
];

const EVENT_CHOICE_OVERCAST_FAILURE = [
  (choiceText) => `The grey day drained the spirit. You ${choiceText.toLowerCase()} but the weight of the sky wore you down.`,
  (choiceText) => `Overcast and heavy. ${choiceText} came to nothing. The light never broke through.`,
];

// Item-aware prose for "always" outcomes (no choice, automatic)
const EVENT_AUTO_RAIN_TARP = [
  'Rain came on hard. The tarp was up in seconds — dry underneath while the prairie drowned.',
  'The canvas Tarp earned its weight today. Water ran off in sheets. Crew stayed dry, powder stayed ready.',
  'A proper soaking rain. But the tarp held. You watched the water bead and roll off. Good gear.',
];

const EVENT_AUTO_STORM_TARP = [
  'Thunder and wind. The tarp snapped like a sail but the lashings held. Nothing wet but the ground.',
  'Storm winds tested every knot. The tarp stood firm. The oxen balked but the shelter held.',
  'Lightning split the sky. Under the tarp the crew waited it out. Dry, warm enough, alive.',
];

const EVENT_AUTO_SNOW_BLANKET = [
  'Snow piled deep by morning. Blankets between the bedroll and the cold — that was the difference.',
  'First snow. The wool blankets turned bitter ground into tolerable rest. Firewood cracked beside you.',
  'White silence at dawn. Blankets held the body heat. The fire died to coals but you woke whole.',
];

const EVENT_AUTO_SNOW_FIREWOOD = [
  'The fire burned all night. Poplar coals warming the watch. Snow melted in a circle around the flames.',
  'Firewood bundle spent, but the night was warm. Steam rose from wet blankets drying by the fire.',
  'Wood smoke in the wool. The fire held back the winter dark. Another night survived.',
];

const EVENT_AUTO_CLEAR = [
  'Clear sky, dry trail. The day passed without weather trouble.',
  'Sun on the grass. Good travelling weather — rare enough to note.',
  'The prairie stretched empty under blue. No rain, no storm, no snow. Just trail.',
];

// ── Camp narrative templates ─────────────────────────────────────────

const CAMP_REST_SUCCESS = [
  'We slept deep. The fire held. Morning found us whole.',
  'Good rest. The crew woke slow but steady. Oxen grazed the sweet grass.',
  'The night passed quiet. No wolves, no wind. Just stars and the fire\'s glow.',
];

const CAMP_REST_SUCCESS_RAIN = [
  'Rain hammered the tarp all night, but we stayed dry underneath. The fire hissed but held. Morning comes grey and clean.',
  'The canvas Tarp earned its weight. Water ran off in sheets while we slept warm. Crew woke rested, not soaked.',
  'Thunder rolled overhead. The tarp drummed but didn\'t leak. A good night\'s rest despite the storm.',
];

const CAMP_REST_SUCCESS_SNOW = [
  'Snow piled against the tarp by morning. Blankets and firewood saw us through. The crew woke to white silence.',
  'The cold bit deep but the blankets held. Firewood cracked and popped all night. We wake stiff but alive.',
  'First light on fresh snow. The fire died to coals but the blankets kept the chill off. Crew rested.',
];

const CAMP_REST_FAILURE = [
  'Slept light. Every sound woke us. The crew rises stiff and grumbling.',
  'The ground was hard. Roots and stones through the bedroll. No true rest.',
  'Wind moaned through the grass all night. We watched the fire die by turns.',
];

const CAMP_REST_FAILURE_RAIN = [
  'Rain found every gap in the shelter. Woke shivering, clothes damp. The crew is miserable.',
  'The tarp leaked at the seams. Spent half the night re-lashing it. No one slept well.',
  'Cold rain all night. The fire went out. Crew rises soaked and sullen.',
];

const CAMP_REST_FAILURE_SNOW = [
  'Snow drifted over the bedrolls. No blankets, no firewood — just cold ground and waking up frozen.',
  'The cold crept through everything. No firewood to keep the dark warm. Crew exhausted.',
  'Woke to ice on the whiskers. No blankets meant a night of shivering. Morale is shot.',
];

const CAMP_FORAGE_SUCCESS = [
  'Found wild turnips and saskatoons in the coulee. The pot will be full tonight.',
  'Prairie onions and lamb\'s quarters. Enough for a proper meal and tomorrow\'s breakfast.',
  'A good haul — berries, roots, even a few mushrooms. The land provides when you know where to look.',
];

const CAMP_FORAGE_FAILURE = [
  'Walked miles. Found nothing but dry grass and mosquitoes. The basket stays empty.',
  'The ground\'s been picked clean. Not a turnip, not a berry. Lean night ahead.',
  'Spent the day searching. Came back with a handful of bitter greens and sore feet.',
];

const CAMP_HUNT_SUCCESS = [
  'Tracked a bull bison to the river crossing. Clean shot. The crew is butchering now.',
  'Beaver at the creek bend. Two pelts and meat for days. The trap line paid off.',
  'Elk on the uplands. Long stalk, clean kill. Heavy packs on the return.',
];

const CAMP_HUNT_FAILURE = [
  'Stalked a herd all afternoon. Wind shifted. They smelled us and vanished.',
  'Found sign but no beast. The ammunition\'s spent and the bag\'s empty.',
  'A shot at a running deer. Missed clean. The echo\'s the only thing we brought back.',
];

const CAMP_REPAIR_SUCCESS = [
  'Shaganappi held. The wheel\'s true again. Good for another hundred miles.',
  'Bound the hub, lashed the reach. The cart rolls quiet now.',
  'Axe and auger did the work. New spokes fitted, old ones saved for patches.',
];

const CAMP_REPAIR_FAILURE = [
  'The shaganappi snapped mid-pull. Wasted the strip and the time.',
  'Cracked the hub trying to seat the spoke. That\'s a day lost and a part ruined.',
  'Rain softened the rawhide. It stretched instead of binding. Have to do it over.',
];

const CAMP_SCOUT_SUCCESS = [
  'Rode five miles ahead. Good water at the next crossing. Grass thick. No sign of trouble.',
  'Scouted the river bend. Shallow ford, firm bottom. We\'ll cross easy tomorrow.',
  'Trail\'s clear to the next ridge. Saw a herd of bison — meat if we need it.',
];

const CAMP_SCOUT_FAILURE = [
  'Rode out and saw nothing but grass. The trail\'s empty. No news is news, I suppose.',
  'Horse threw a shoe halfway. Had to walk back. Wasted the day.',
  'Got turned around in a coulee. Came back after dark with nothing to report.',
];

const CAMP_DANCE_SUCCESS = [
  'The fiddle sang. Boots pounded the hard ground. For an hour, nobody remembered the trail.',
  'Red River jig until the fire died. Even the quiet ones joined in. Morale\'s high.',
  'Music and laughter carried across the grass. The night felt shorter for it.',
];

const CAMP_DANCE_FAILURE = [
  'Fiddle started but the tune fell flat. Feet dragged. Hearts weren\'t in it.',
  'Half the crew sat it out. The rest went through motions. Silence crowded back fast.',
  'Played a reel but nobody danced. The fire popped. Someone muttered about tomorrow.',
];

const CAMP_COOK_SUCCESS = [
  'Pemmican stew thick with onions and wild roots. Steam rose. The crew ate slow, savoring.',
  'The pot bubbled. Fat slicked the surface. Warm food in cold hands — that\'s wealth.',
  'Stew tonight. Everyone had seconds. Even the oxen got the scraps.',
];

const CAMP_COOK_FAILURE = [
  'Fire wouldn\'t catch. Wood too green. The pemmican stayed tough and cold.',
  'Pot boiled over. Lost half the broth to the coals. Thin supper for the lot of us.',
  'Burnt the bottom. Scraped the pot clean but the taste lingers. Morale took a hit.',
];

const CAMP_PUSH_ON = [
  'No camp tonight. Drove on through the gloaming. The cart groans, the crew\'s silent.',
  'Pushed past the usual stopping place. Night fell. We\'ll pay for this in the morning.',
  'The trail doesn\'t wait. Neither do we. Wear on the cart, wear on the people.',
];

// ── Settlement templates ────────────────────────────────────────────

const SETTLEMENT_ARRIVAL = [
  (name, type) => `We saw the spires of ${name} rise from the river bottom. A ${type} post — we'd heard tell.`,
  (name, type) => `${name} ahead. Smoke from chimneys, the smell of woodsmoke and cattle. Civilization, of a sort.`,
  (name, type) => `We rode into ${name} as the bell rang vespers. ${type} folk, but the trade's honest.`,
];

const SETTLEMENT_TRADE = [
  (give, receive) => `Traded ${give} for ${receive}. Fair measure. The factor nodded, weighed honest.`,
  (give, receive) => `Laid out ${give} on the counter. Walked away with ${receive}. Good business.`,
  (give, receive) => `Haggling done. ${give} went their way, ${receive} came ours. Both sides satisfied.`,
];

const SETTLEMENT_ACTION = {
  heal_crew: [
    'The sisters tended our sick. Cool hands, quiet prayers. The fever broke by morning.',
    'Grey Nuns asked no questions. Bound wounds, brewed tea. The crew walks easier now.',
    'Medicine given freely. "God provides," the sister said. We left pemmican on the altar.',
  ],
  rest_blessing: [
    'Slept in the chapel loft. Straw mattress, but the bell at matins woke a lighter spirit.',
    'Evening prayer in the nave. Three days\' blessing on the road ahead. Felt the weight lift.',
    'Confession and communion. The trail feels shorter when the soul\'s unburdened.',
  ],
  trade_furs_food: [
    'Folded hides on the counter. Pemmican in the cart. The mission garden feeds the journey.',
    'Beaver for bison meat. Straight trade. The factor\'s scales were true.',
    'Hides from the spring hunt. Now rations for the fall push. Good exchange.',
  ],
  trade_gossip: [
    'Sat by the fire with the women. News travels fast on the prairie — next settlement\'s prairies, they said.',
    'Shared bannock and tea. The old women know every trail and river. Learned what lies ahead.',
    'Listened to stories in Michif and French. The gossip is worth more than gold on this trail.',
  ],
  dance: [
    'The fiddle sang. Boots pounded the hard ground. For an hour, nobody remembered the trail.',
    'Red River jig until the fire died. Even the quiet ones joined in. Morale\'s high.',
    'Music and laughter carried across the grass. The night felt shorter for it.',
  ],
  share_food: [
    'Broke pemmican with the camp. What you give on the trail returns in loyalty.',
    'Shared our rations with a family waiting for hunters. Their gratitude was a warm thing.',
    'The Métis remember generosity. Gave two rations, earned their respect for leagues.',
  ],

  buy_ammo: [
    '"Ball and powder, measured honest. The Mounties don\'t cheat a carter on shot."',
    'Two belts of ammunition for a beaver pelt. Fair trade from the Queen\'s men.',
    'Fresh powder and ball. The sergeant weighed it himself. Honest measure.',
  ],
  trade_furs_supplies_ammunition: [
    'Traded pelts for powder and shot. The Company store prices are steep but the goods are good.',
    'Laid down a hide, walked away with ammunition. The factor didn\'t blink.',
    'Company lead and powder. Cost a pelt but the quality\'s there.',
  ],
  trade_furs_supplies_shaganappi: [
    'Rawhide strips for a prime beaver. The best binding on the prairie.',
    'Three strips of shaganappi. That\'ll fix a wheel or lash a load proper.',
    'Wet rawhide shrinks drum-tight. Worth every hide we traded.',
  ],
  trade_furs_supplies_medicine: [
    'Medicine pouch for a wolf pelt. The herbs smell of sage and willow bark.',
    'The factor handed over a pouch. Said it\'d break a fever by morning.',
    'Traded fur for medicine. The Company knows what keeps carters alive.',
  ],

  rest: [
    'A warm fire in the mess hall, dry blankets, and a night without the wind.',
    'Cot in the barracks. Clean, quiet, and the sentry paces all night.',
    'A lean-to by the fire. Simple shelter, honest company.',
  ],
};

// ── Item use / Leave behind templates ────────────────────────────────

const ITEM_USE = {
  'Medicine Pouch': [
    'Tipped the pouch into hot water. Steam carried the scent of sage and willow bark. The fever broke.',
    'Bound the wound with clean linen from the pouch. Poultice of yarrow and plantain. He\'ll live.',
    'Two doses of the tonic. Bitter, but the cough eased by nightfall. Medicine works when you believe.',
  ],
  'Shaganappi': [
    'Wet the rawhide, stretched it tight over the cracked hub. It\'ll shrink hard as iron when it dries.',
    'Two strips of shaganappi, braided. The reach holds now. Old Métis tech, still the best.',
    'Lashed the broken box-board. Rawhide shrinks drum-tight. That cart\'s not coming apart today.',
  ],
  'Tool Kit': [
    'Auger bit through the seasoned oak. New spoke seated clean. The kit earns its weight.',
    'Drawknife shaped the replacement reach. Axe split the hickory for spare spokes. Good steel.',
    'Fitted the spare axle. Bolts turned true. The tool kit just saved the journey.',
  ],
  'Pemmican Rations': [
    'Chewed a strip raw. Fat and protein, the fuel of the prairie. Sustains a man all day.',
    'Crumbled pemmican into the stew pot. Thickened the broth. The crew ate every spoonful.',
    'Shared the last ration with the youngest hand. He needs it more. We\'ll hunt tomorrow.',
  ],
  'Firewood Bundle': [
    'Poplar burns hot and fast. The fire caught quick. Warmth against the prairie night.',
    'Split the bundle. Half for tonight, half for tomorrow. Dry wood is gold in wet weather.',
    'The fire crackled. Sparks rose to the stars. Wood smoke in the wool — smells like survival.',
  ],
  'Canvas Tarp': [
    'Stretched the tarp over the cart bed. Rain drummed on canvas. Dry inside. Worth every kilogram.',
    'Rigged the tarp as a lean-to. The wind howled but we stayed dry. Good shelter.',
    'Wrapped the pemmican barrels in canvas before the crossing. Not a drop got through.',
  ],
};

const LEAVE_BEHIND = [
  (item) => `Left the ${item} beside the trail. Marked the spot with a cairn. Maybe we'll retrieve it on the return.`,
  (item) => `The ${item} stayed behind. No choice. The cart was overloaded and the oxen failing.`,
  (item) => `Cached the ${item} under a flat stone. Marked it on the map. If winter doesn't claim it, it'll wait.`,
];

// ── First-person reflection templates (diary depth) ───────────────────

const TRAVEL_REFLECTIONS = [
  'My back aches from the jolting. The younger hands complain but they keep pace. I wonder how many more days this body has in it.',
  'The officer at the last post said the trail gets harder north of the Assiniboine. I believe him. Every mile feels earned now.',
  'We passed a grave today. Just a wooden cross, weathered grey. No name. The prairie keeps its dead close.',
  'The cart creaks a new rhythm. Hub on the near side needs attention. Shaganappi will hold it for now.',
  'Strange to think the river flows north while we chase the sunset. The world turns different out here.',
  'The crew talks less each day. Not from anger — just the weight of distance. I hear them hum old songs sometimes.',
  'A half-breed trapper shared firewater last night. Said the bison are moving west. Said the trail is changing. He was not wrong.',
  'Dreams of Red River feel like another life. The fort, the bells, the women laughing on the landing. All behind us now.',
];

const CAMP_REFLECTIONS = {
  rest: [
    'Fire dimming. The oxen breathe slow. Tomorrow we do it again. God willing, the wheels hold.',
    'Stars so thick you could scoop them. The quiet is the loudest thing on the trail.',
    'Wrote a letter in my head to Marie. Burned it in the fire. Some words aren\'t meant to travel.',
  ],
  forage: [
    'Hands smell of earth and onion. Good work today, if the pot holds out.',
    'The land gives when you ask right. Took only what we needed. Left the rest for the next hands.',
  ],
  hunt: [
    'Blood on the knife, steam in the cold. The animal gave its life. We waste nothing — hide, meat, sinew, bone.',
    'The shot rings in my ears still. Clean kill. The crew works fast now. They know the rhythm.',
  ],
  repair: [
    'Shaganappi binds more than wood. It binds the journey together. One more day the cart rolls.',
    'The auger sang through oak. Spoke seated true. This cart has carried generations — it carries us now.',
  ],
  scout: [
    'Rode until the grass meet sky. The trail ahead is honest. No surprises waiting — just distance.',
    'Saw smoke on the horizon. Another camp, another story. We are not alone on this road.',
  ],
  dance: [
    'The fiddle quiet now. Feet sore, heart lighter. We laughed at nothing and everything.',
    'Old Pierre played the tune my father taught me. For a moment I was a boy again at St. Boniface.',
  ],
  cook: [
    'Steam rises, bellies fill. This is the wealth of the trail — hot food and hands that made it.',
    'The youngest hand asked for seconds. Gave him mine. He\'s growing. We all are, in our way.',
  ],
  push_on: [
    'No fire tonight. The dark presses close. We gained miles but lost something softer.',
    'The oxen\'s breath clouds the lantern light. They do not complain. Neither should I.',
  ],
};

const EVENT_REFLECTIONS = {
  success: [
    'Fortune favored us today. I will not question why — only give thanks and keep moving.',
    'The dice fell right. Tomorrow they may not. I store this luck like pemmican for lean days.',
  ],
  failure: [
    'The trail teaches hard lessons. This one stings. We carry the scar and the wisdom both.',
    'Failed today. The ground won. But we are still here, still moving. That counts for something.',
  ],
  critical: [
    'The world broke open today. What we lost cannot be named in numbers. We walk differently now.',
    'A day that will wake me in winters to come. The crew watches me. I must not show the crack.',
  ],
};

const SETTLEMENT_REFLECTIONS = [
  (name, day) => `${name} behind us. Day ${day} on the trail. The map shrinks in my hands but the distance feels longer.`,
  (name, day) => `Traded, rested, prayed at ${name}. The ledger balances but the soul's account is harder to tally. Day ${day}.`,
  (name, day) => `Left ${name} with full bellies and lighter hearts. The trail waits for no man. Day ${day} and counting.`,
  (name, day) => `The factor's scales were honest. The priest's blessing felt true. Even the Mountie nodded respect. Day ${day}.`,
  (name, day) => `Rode out of ${name} before the bell finished ringing. The road does not care for goodbyes. Day ${day}.`,
];

// ── Helper to pick random template ──────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Public API ──────────────────────────────────────────────────────

/** Generate first-person travel journal entry */
export function buildTravelEntry(prevNode, node, after, prevWear, cart = []) {
  if (!prevNode || !node) {
    return 'Another day on the Carlton Trail. The prairie stretches on, dry and endless.';
  }

  const opening = pick(TRAVEL_OPENINGS)(prevNode.name, node.name);
  const middle = pick(TRAVEL_MIDDLES);
  
  const wearLine = after.wear > prevWear ? ' ' + pick(TRAVEL_WEAR_LINES) : '';
  
  const weather = after.weather && after.weather !== 'clear'
    ? ' ' + pickWeatherLine(after.weather, cart)
    : '';

  return `${opening}${wearLine}${weather} ${middle}`;
}

function pickWeatherLine(weather, cart) {
  const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
  const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
  const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
  
  const lines = TRAVEL_WEATHER_LINES[weather] || [];
  if (!lines.length) return '';
  
  let line = pick(lines);
  
  // Add item-aware variants
  if (weather === 'rain' || weather === 'storm') {
    if (hasTarp) {
      line = line.replace('We huddled under canvas', 'The tarp held. We stirred dry underneath');
      line = line.replace('The trail turned to grease', 'Wheels sank but the tarp kept the load dry');
    }
  }
  if (weather === 'snow') {
    if (hasBlanket || hasFirewood) {
      line = line.replace('Winter breathes early here', 'Blankets and firewood kept the night at bay');
      line = line.replace('The cart left dark tracks', 'Firewood warmed the watch, blankets the sleep');
    }
  }
  
  return line;
}

/** Generate first-person camp journal entry */
export function buildCampEntry(actionType, result, extraFood = 0, cart = [], weather = 'clear') {
  const isSuccess = result && result.rollTotal !== null && result.rollTotal >=
    ({ rest: 12, forage: 10, hunt: 10, repair: 8, scout: 9, dance: 8, cook: 10 }[actionType] || 10);

  const critical = result && result.critical;
  const extraFoodLine = extraFood > 0 ? ` We put in ${extraFood} extra rations for the effort.` : '';

  const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
  const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
  const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
  
  const isWet = ['rain', 'storm'].includes(weather);
  const isCold = weather === 'snow';

  let templates;
  if (actionType === 'rest') {
    if (isSuccess) {
      if (isWet) templates = CAMP_REST_SUCCESS_RAIN;
      else if (isCold) templates = CAMP_REST_SUCCESS_SNOW;
      else templates = CAMP_REST_SUCCESS;
    } else {
      if (isWet) templates = CAMP_REST_FAILURE_RAIN;
      else if (isCold) templates = CAMP_REST_FAILURE_SNOW;
      else templates = CAMP_REST_FAILURE;
    }
  } else {
    templates = {
      forage: isSuccess ? CAMP_FORAGE_SUCCESS : CAMP_FORAGE_FAILURE,
      hunt: isSuccess ? CAMP_HUNT_SUCCESS : CAMP_HUNT_FAILURE,
      repair: isSuccess ? CAMP_REPAIR_SUCCESS : CAMP_REPAIR_FAILURE,
      scout: isSuccess ? CAMP_SCOUT_SUCCESS : CAMP_SCOUT_FAILURE,
      dance: isSuccess ? CAMP_DANCE_SUCCESS : CAMP_DANCE_FAILURE,
      cook: isSuccess ? CAMP_COOK_SUCCESS : CAMP_COOK_FAILURE,
      push_on: CAMP_PUSH_ON,
    }[actionType] || ['The night passed.'];
  }

  let text = pick(templates);

  if (critical && !isSuccess) {
    text = '⚠ Critical failure. ' + text;
  }

  return text + extraFoodLine;
}

/** Generate settlement arrival entry */
export function buildSettlementArrivalEntry(settlement) {
  return pick(SETTLEMENT_ARRIVAL)(settlement.name, settlement.type);
}

/** Generate settlement trade/action entry */
export function buildSettlementActionEntry(actionId, giveDesc, receiveDesc) {
  if (actionId === 'trade' || actionId === 'trade_limited') {
    return pick(SETTLEMENT_TRADE)(giveDesc, receiveDesc);
  }
  const templates = SETTLEMENT_ACTION[actionId];
  if (templates) return pick(templates);
  return `Completed ${actionId.replace(/_/g, ' ')} at the post.`;
}

/** Generate item use entry */
export function buildItemUseEntry(itemName) {
  const templates = ITEM_USE[itemName];
  if (templates) return pick(templates);
  return `Used the ${itemName}. It served its purpose.`;
}

/** Generate leave-behind entry */
export function buildLeaveBehindEntry(itemName) {
  return pick(LEAVE_BEHIND)(itemName);
}

/** Generate event journal entry */
export function buildEventEntry(eventData, result) {
  const desc = eventData.text || 'Something happened on the trail.';
  if (!result || result.roll === null) {
    return desc;
  }
  const outcome = result.text || (result.success ? 'It went well enough.' : 'That did not go as hoped.');
  // Strip "Success. " / "Failure. " prefix for cleaner prose
  const clean = outcome.replace(/^(Success|Failure)\.\s*/, '');
  return `${desc} ${clean}`;
}

/** Generate weather + item aware event choice outcome entry */
export function buildEventChoiceEntry(eventData, result, weather = 'clear', cart = []) {
  const desc = eventData.text || 'Something happened on the trail.';
  if (!result || result.roll === null) {
    return desc;
  }
  const isSuccess = result.success;
  const choiceText = result.text || (isSuccess ? 'It went well enough.' : 'That did not go as hoped.');
  const cleanChoice = choiceText.replace(/^(Success|Failure)\.\s*/, '');
  
  const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
  const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
  const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
  const isWet = ['rain', 'storm'].includes(weather);
  const isCold = weather === 'snow';
  
  let templates;
  if (weather === 'rain') {
    templates = isSuccess ? EVENT_CHOICE_RAIN_SUCCESS : EVENT_CHOICE_RAIN_FAILURE;
  } else if (weather === 'storm') {
    templates = isSuccess ? EVENT_CHOICE_STORM_SUCCESS : EVENT_CHOICE_STORM_FAILURE;
  } else if (weather === 'snow') {
    templates = isSuccess ? EVENT_CHOICE_SNOW_SUCCESS : EVENT_CHOICE_SNOW_FAILURE;
  } else if (weather === 'overcast') {
    templates = isSuccess ? EVENT_CHOICE_OVERCAST_SUCCESS : EVENT_CHOICE_OVERCAST_FAILURE;
  } else {
    // Clear - use base entry
    return `${desc} ${cleanChoice}`;
  }
  
  const templateFn = pick(templates);
  let enhanced = templateFn(cleanChoice);
  
  // Add item-aware detail for success in bad weather
  if (isSuccess && isWet && hasTarp) {
    enhanced += ' The tarp kept the gear dry.';
  }
  if (isSuccess && isCold) {
    if (hasBlanket) enhanced += ' Blankets turned the cold to comfort.';
    else if (hasFirewood) enhanced += ' The fire held the night back.';
  }
  
  return `${desc} ${enhanced}`;
}

/** Generate weather + item aware automatic (no-choice) event entry */
export function buildEventAutoEntry(desc, weather = 'clear', cart = []) {
  const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
  const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
  const hasFirewood = cart.some(i => i.name === 'Firewood Bundle' && i.count > 0);
  const isWet = ['rain', 'storm'].includes(weather);
  const isCold = weather === 'snow';
  
  let templates;
  if (weather === 'rain' && hasTarp) templates = EVENT_AUTO_RAIN_TARP;
  else if (weather === 'storm' && hasTarp) templates = EVENT_AUTO_STORM_TARP;
  else if (weather === 'snow' && hasBlanket) templates = EVENT_AUTO_SNOW_BLANKET;
  else if (weather === 'snow' && hasFirewood) templates = EVENT_AUTO_SNOW_FIREWOOD;
  else templates = EVENT_AUTO_CLEAR;
  
  const template = pick(templates);
  return `${desc} ${template}`;
}

/** Generate settlement arrival with journey flavor (weather aware) */
export function buildSettlementJourneyEntry(settlement, weather = 'clear', cart = []) {
  const hasTarp = cart.some(i => i.name === 'Canvas Tarp' && i.count > 0);
  const hasBlanket = cart.some(i => i.name === 'Blanket' && i.count > 0);
  
  let base = pick(SETTLEMENT_ARRIVAL)(settlement.name, settlement.type);
  
  if (weather === 'rain') {
    base += hasTarp ? ' The tarp saw us through the wet miles.' : ' Rain soaked the trail all the way here.';
  } else if (weather === 'storm') {
    base += hasTarp ? ' Storm winds tested the canvas — it held.' : ' The storm broke over us on the final stretch.';
  } else if (weather === 'snow') {
    base += (hasBlanket || hasFirewood) ? ' Snow fell the last day but blankets and fire saw us through.' : ' Snow dusted the approach. Cold miles behind us.';
  } else if (weather === 'overcast') {
    base += ' Grey sky the whole way. No rain, but no sun either.';
  } else {
    base += ' Clear skies favored the approach.';
  }
  
  return base;
}

/** Get descriptive food string for status displays */
export function getFoodDescription(units) {
  return describeFood(units);
}

/** Get food status label for status bar */
export function getFoodStatusLabel(units) {
  return getFoodStatusText(units);
}

/** Generate first-person travel reflection (diary depth) */
export function buildTravelReflection(prevNode, node, after, cart = [], day = 1) {
  const base = buildTravelEntry(prevNode, node, after, 0, cart);
  const reflection = pick(TRAVEL_REFLECTIONS);
  const foodDesc = describeFood(after.food);
  const wearDesc = after.wear > 0 ? ` Cart wear: ${after.wear}.` : ' Cart holds sound.';
  return `${base} ${reflection} ${foodDesc}${wearDesc}`;
}

/** Generate first-person camp reflection (diary depth) */
export function buildCampReflection(actionType, result, cart = [], weather = 'clear', day = 1) {
  const base = buildCampEntry(actionType, result, 0, cart, weather);
  const reflections = CAMP_REFLECTIONS[actionType] || ['The night passes.'];
  const reflection = pick(reflections);
  const foodDesc = describeFood(result?.foodAfter || 0);
  return `${base} ${reflection} ${foodDesc}`;
}

/** Generate first-person event reflection (diary depth) */
export function buildEventReflection(eventData, result, weather = 'clear', cart = []) {
  const base = buildEventChoiceEntry(eventData, result, weather, cart);
  let tier = 'success';
  if (result?.critical) tier = 'critical';
  else if (!result?.success) tier = 'failure';
  const reflection = pick(EVENT_REFLECTIONS[tier] || EVENT_REFLECTIONS.success);
  return `${base} ${reflection}`;
}

/** Generate first-person settlement reflection (diary depth) */
export function buildSettlementReflection(settlement, after, cart = []) {
  const base = buildSettlementJourneyEntry(settlement, after.weather || 'clear', cart);
  const reflection = pick(SETTLEMENT_REFLECTIONS)(settlement.name, after.day);
  const foodDesc = describeFood(after.food);
  return `${base} ${reflection} ${foodDesc}`;
}