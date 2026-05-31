import { NODES } from './nodes.js';

export const EVENT_POOLS = {
  plains: [
    {
      id: 'plains_trader',
      text: 'A Metis freighter catches up to your cart. He eyes your load and offers a short-term deal.',
      source: { quote: 'The freighting trade along the Carlton Trail was dominated by Metis independent carters.', author: 'MMF Research', work: 'Research Vault' },
      choices: [
        { text: 'Hire him as a scout', dc: 11, ok: 'He rides ahead and spots a safer campsite.', bad: 'He takes the easy path and you lose a day.', wear: 0, time: -1, addsRep: { key: 'metis', delta: 1 }, branch: {
          id: 'plains_scout_return',
          text: 'The scout returns with news: a lone HBC clerk is stranded with a broken cart ahead.',
          choices: [
            { text: 'Help tow them to the next post', dc: 10, ok: 'They are grateful. The clerk gives you trade goods.', bad: 'The axle breaks under the strain.', wear: 1, food: 4, setsFlag: 'helped_hbc', addsRep: { key: 'hbc', delta: 1 } },
            { text: 'Tip your hat and press on', dc: null, always: 'You do not have time for strangers.', alwaysWear: 0 }
          ]
        } },
        { text: 'Refuse', dc: null, always: 'You keep to your own pace.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_wind',
      text: 'A hot wind pushes at your back. The prairie grass ripples like water.',
      choices: [
        { text: 'Run with it', dc: 10, ok: 'You make excellent time.', bad: 'A hidden rut jolts the cart. Repairs are needed after crossing.', wear: 1, time: -1 },
        { text: 'Hunker down', dc: null, always: 'You wrap the load and keep moving. No rain comes.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_camp_cookery',
      text: ' midday halt by a cattail slough. Pemmican is passed around; bannock is frying. A Métis campsite nearby offers company.',
      source: { quote: 'Pemmican cooked in a frying-pan, a little grease, pepper, salt, with a trace of onions and potatoes added, constituted this, a dish to set before a king.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Share rubaboo and trade stories', dc: 8, ok: 'The circle of travellers is warm. Morale rises.', bad: 'You are too guarded to connect fully.', morale: 8, addsRep: { key: 'metis', delta: 1 }, setsFlag: 'shared_camp_meal' },
        { text: 'Eat quickly and move on', dc: null, always: 'Hunger is satisfied, but nothing more.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_night_camp',
      text: 'Moonlight spills across the prairie. Somewhere nearby a fiddle begins a Red River jig.',
      source: { quote: 'The Red River jig was struck up, and one after another exercised himself to his heart\'s content.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Dance until your boots throw dust', dc: 10, ok: 'Laughter drowns out the dark.', bad: 'You strain a shoulder and sleep poorly.', morale: 12, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Turn in early; tomorrow is long', dc: null, always: 'Rest restores you in small measure.', morale: 4 }
      ]
    },
    {
      id: 'plains_ox_scatter',
      text: 'The oxen have scattered after drinking. The mid-day camp is a chaos of traces and running hooves.',
      source: { quote: 'To drive the refractory animals among the carts was a last resort.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Call and whistle them back', dc: 11, ok: 'The animals respond to the familiar sounds.', bad: 'You lose an hour rounding them up.', time: 1, morale: -4 },
        { text: 'Send someone ahead', dc: 9, ok: 'Your crew brings them in quietly and quickly.', bad: 'One runner turns an ankle.', crew: 'tired', addsRep: { key: 'metis', delta: 1 } }
      ]
    },
    {
      id: 'plains_squeal',
      text: 'The dry wood of the hub screams against the axle — a sound that carries for miles.',
      source: { quote: 'When loaded it gave forth a blood-curdling squeal which could be heard for miles and which came to be associated with it.', author: 'Harry Baker Brehaut', work: 'The Red River Cart and Trails, MHS Transactions, 1971-72' },
      choices: [
        { text: 'Apply shaganappi before it worsens', dc: 7, ok: 'The scream quiets. The trail is kinder.', bad: 'Insufficient grease; the noise persists.', morale: -3, squeal: 0, branch: {
          id: 'plains_squeal_draw_attention',
          text: 'Your squealing cart draws a mounted rider from a nearby coulée.',
          choices: [
            { text: 'Stand your ground', dc: 10, ok: 'He is a Métis trader simply curious.', bad: 'He is a rough type; you hand over a small toll.', food: 2, addsRep: { key: 'metis', delta: -1 } },
            { text: 'Offer a quiet trade', dc: 9, ok: 'He tips his hat and moves on.', bad: 'He senses weakness and haggles hard.', food: 1 }
          ]
        } },
        { text: 'Ignore the noise', dc: null, always: 'The day\'s miles do not lessen the complaint.', alwaysWear: 0, squeal: 25 }
      ]
    }
  ],
  river_valley: [
    {
      id: 'river_high',
      text: 'The river is running high and fast. The bank trail is muddy and narrow.',
      source: { quote: 'The carts had indeed entered straight into the water... turned upstream to make the crossing in a horse shoe fashion.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Ford carefully', dc: 13, ok: 'The ox keeps footing and you stay dry enough.', bad: 'The cart tilts in the current. Repairs are needed after crossing.', wear: 1 },
        { text: 'Wait for afternoon', dc: null, always: 'You camp and cross later when the water drops.', time: 1 },
        { text: 'Scout for the horse-shoe ford upstream', dc: 11, ok: 'You find the concealed path and cross safely.', bad: 'The scouting costs precious daylight and energy.', morale: -4, time: -1 }
      ]
    },
    {
      id: 'river_mp_check',
      text: 'An NWMP patrol stops you just above the ferry landing.',
      choices: [
        { text: 'Show your papers', dc: 9, ok: 'The permits read clearly. They let you pass.', bad: 'A signature mismatch. You are delayed.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
        { text: 'Talk your way past', dc: 12, ok: 'They accept your story.', bad: 'They insist on a spot inspection. Wear is likely.', wear: 1, addsRep: { key: 'nwmp', delta: -1 }, branch: () => ({
          id: 'nwmp_detain',
          text: 'The inspection turns up a loose rivet in your axle. The sergeant orders you to make camp until morning.',
          choices: [
            { text: 'Comply and camp for the night', dc: null, always: 'The sergeant inspects in the morning and lets you go.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
            { text: 'Argue your case', dc: 10, ok: 'The sergeant relents, but writes your name in the ledger.', bad: 'You are held another full day.', time: 2, wear: 1 }
          ]
        })}
      ]
    },
    {
      id: 'river_valley_bank_descent',
      text: 'The opposite bank is steep — eight feet of loose earth down to the water.',
      source: { quote: 'A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Lower the cart with a line tied to a tree', dc: 10, ok: 'A careful descent protects the load.', bad: 'The knot slips at the last moment; the cart jars.', wear: 1 },
        { text: 'Free descent', dc: null, always: 'The cart slides hard; the contents shift dangerously.', alwaysWear: 1 }
      ]
    },
    {
      id: 'river_boat',
      text: 'At a wide crossing the captain offers passage - but he is clearly understaffed and the ferry rocks.',
      source: { quote: 'The ferry lurches. Cargo shifts and one wheel takes damage.', author: 'Carlton Trail Heritage', work: 'Regional History' },
      choices: [
        { text: 'Board and keep the load centred', dc: 11, ok: 'You ride the swell and land clean.', bad: 'A barrel breaks loose and damages a wheel.', wear: 1, food: -2 },
        { text: 'Wait for a larger brigade', dc: null, always: 'A safer but slower choice.', time: 2 }
      ]
    }
  ],
  wooded: [
    {
      id: 'wooded_cree',
      text: 'A Cree hunter steps onto the trail ahead. He studies your cart and nods at the pemmican sacks.',
      choices: [
        { text: 'Offer a trade', dc: 11, ok: 'He swaps fresh meat for part of your load.', bad: 'He senses you are short on food. The deal goes poorly.', food: 3, addsRep: { key: 'cree', delta: 1 } },
        { text: 'Keep moving', dc: null, always: 'He watches but does not interfere.', alwaysWear: 0 }
      ]
    },
    {
      id: 'wooded_ambush_ravine',
      text: 'A hidden rut drops one wheel into a creek bed — the cart tilts dangerously.',
      source: { quote: 'Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails.', author: 'Cart Trail Game Research', work: 'Research Vault' },
      choices: [
        { text: 'Catch the weight and right it', dc: 12, ok: 'Quick hands save the day.', bad: 'The cart upsets. One random food item is lost.', food: -1, wear: 1 },
        { text: 'Call for help', dc: 9, ok: 'A nearby Métis party rights the cart swiftly.', bad: 'Helpers are slow and grumpy.', morale: -5 }
      ]
    }
  ],
  uplands: [
    {
      id: 'upland_high_pass',
      text: 'The trail climbs onto a windy upland bench. Rain draws near.',
      choices: [
        { text: 'Press through before the storm', dc: 11, ok: 'You gain the far shelter with minutes to spare.', bad: 'The rain catches you on exposed ground.', wear: 1, morale: -6 },
        { text: 'Hike to a rocky ledge and wait', dc: null, always: 'Cold, but the cart and crew are intact.', time: 1 }
      ]
    }
  ],
  river: [
    {
      id: 'ferry_gabriel',
      text: 'Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.',
      source: { quote: 'Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.', author: 'Dumont Family Accounts', work: 'MMF Research Vault' },
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
      ]
    },
    {
      id: 'river_cart_raft',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart.',
      source: { quote: 'Four cart wheels were taken and placed dish upwards... A party would then swim across, carrying the bow line over; the boat was launched, and floated like a duck.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Build a cart-raft with 4 bison hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river; cargo gets wet.', morale: -6, setsFlag: 'built_rafts', requiresFlag: 'has_hides', branch: {
          id: 'river_raft_wash',
          text: 'On the far bank, an elder watches your landing and nods slowly.',
          choices: [
            { text: 'Greet him respectfully', dc: 10, ok: 'He shares drying hides and directions for the next leg.', bad: 'He is suspicious and leaves without speaking.', addsRep: { key: 'cree', delta: 1 }, morale: 8 },
            { text: 'Get moving without conversation', dc: null, always: 'Pragmatic. The crossing cost enough time.', alwaysWear: 0 }
          ]
        } },
        { text: 'Ford the cart carefully', dc: 13, ok: 'The ox swims straight and true; the bed stays high.', bad: 'The current turns the cart. Wet freight and one damaged wheel.', wear: 2, food: -2 }
      ]
    }
  ]
};

export function getEventsForTerrain(terrain) {
  return EVENT_POOLS[terrain] || EVENT_POOLS.plains;
}

export function pickEventForTerrain(terrain, rng) {
  const pool = getEventsForTerrain(terrain);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}

export function pickBranchEvent() {
  const names = Object.keys(EVENT_POOLS);
  const terrain = names[Math.floor(Math.random() * names.length)];
  const pool = getEventsForTerrain(terrain);
  return pickEventForTerrain(terrain, Math.random);
}
