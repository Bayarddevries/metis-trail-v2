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
    }
  ],
  river_valley: [
    {
      id: 'river_high',
      text: 'The river is running high and fast. The bank trail is muddy and narrow.',
      source: { quote: 'River crossings were the most dangerous segments of the Carlton Trail.', author: 'Carlton Trail Heritage', work: 'Regional History' },
      choices: [
        { text: 'Ford carefully', dc: 13, ok: 'The ox keeps footing and you stay dry enough.', bad: 'The cart tilts in the current. Repairs are needed after crossing.', wear: 1 },
        { text: 'Wait for afternoon', dc: null, always: 'You camp and cross later when the water drops.', time: 1 }
      ]
    },
    {
      id: 'river_mp_check',
      text: 'An NWMP patrol stops you just above the ferry landing.',
      choices: [
        { text: 'Show your papers', dc: 9, ok: 'The permits read clearly. They let you pass.', bad: 'A signature mismatch. You are delayed.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
        { text: 'Talk your way past', dc: 12, ok: 'They accept your story.', bad: 'They insist on a spot inspection. Wear is likely.', wear: 1, addsRep: { key: 'nwmp', delta: -1 }, branch: () => ({
          id: 'nwmp_detain',
          text: 'The inspection turns up a loose rivet in your axel. The sergeant orders you to make camp until morning.',
          choices: [
            { text: 'Complying seems wisest', dc: null, always: 'You spend a day in camp. The sergeant inspects your cart again in the morning and lets you go.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
            { text: 'Argue your case', dc: 10, ok: 'The sergeant relents, but writes your name in the ledger.', bad: 'You are held for another full day.', time: 2, wear: 1 }
          ]
        })}
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
    }
  ],
  uplands: [],
  river: [
    {
      id: 'ferry_gabriel',
      text: "Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.",
      source: { quote: 'Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.', author: 'Dumont Family Accounts', work: 'MMF Research Vault' },
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
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
