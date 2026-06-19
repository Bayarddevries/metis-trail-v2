export const CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 8,
  DAILY_FOOD: 0.6,           // Base food consumed per travel day (was 1.0 - reduced for survivability)
  CAMP_BASE_FOOD: 0.5,        // Base food cost per camp night (for 2 actions) (was 1.0)
  EVENT_CHANCE: 0.45,
  DAYS_PER_WEEK: 7,
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },

  // Phase 0.4 — Hunting yields per terrain (configurable)
  HUNT_YIELDS: {
    plains: {
      foodMin: 3, foodMax: 5,  // increased from 2-4
      common: { name: 'Bison Hide', wt: 6, icon: '🦬', desc: 'A heavy bison hide from the open prairie.' },
      rare: { name: 'Prime Bison Hide', wt: 10, icon: '🦬', desc: 'A massive prime bison hide — worth triple at market.' },
    },
    river_valley: {
      foodMin: 2, foodMax: 4,  // increased from 1-3
      common: { name: 'Beaver Pelt', wt: 4, icon: '🦫', desc: 'A fine beaver pelt from the river valley.' },
      rare: { name: 'Prime Beaver Pelt', wt: 5, icon: '🦫', desc: 'A prime winter beaver pelt — exceptionally thick.' },
    },
    wooded: {
      foodMin: 2, foodMax: 3,  // increased from 1-2
      common: { name: 'Wolf Pelt', wt: 3, icon: '🐺', desc: 'A grey wolf pelt from the wooded trail.' },
      rare: { name: 'Prime Wolf Pelt', wt: 4, icon: '🐺', desc: 'A prime wolf pelt, thick and unblemished.' },
    },
    uplands: {
      foodMin: 2, foodMax: 3,  // increased from 1-2
      common: { name: 'Elk Hide', wt: 6, icon: '🦌', desc: 'A sturdy elk hide from the uplands.' },
      rare: { name: 'Prime Elk Hide', wt: 9, icon: '🦌', desc: 'A prime elk hide — massive and worth triple at market.' },
    },
  },
  HUNT_RARITY_WEIGHTS: { food: 0.70, common: 0.25, rare: 0.05 },
  WEATHER_STATES: ['clear', 'overcast', 'rain', 'storm', 'snow'],
  SEASON_BASE_WEATHER: {
    summer: { clear: 45, overcast: 25, rain: 20, storm: 10, snow: 0 },
    autumn: { clear: 30, overcast: 30, rain: 20, storm: 10, snow: 10 },
    'early winter': { clear: 15, overcast: 20, rain: 15, storm: 10, snow: 40 },
  },
  WEATHER_TRANSITION: {
    clear: { clear: 55, overcast: 30, rain: 10, storm: 5, snow: 0 },
    overcast: { clear: 20, overcast: 40, rain: 25, storm: 10, snow: 5 },
    rain: { clear: 10, overcast: 25, rain: 40, storm: 20, snow: 5 },
    storm: { clear: 5, overcast: 20, rain: 35, storm: 30, snow: 10 },
    snow: { clear: 0, overcast: 10, rain: 15, storm: 5, snow: 70 },
  },
  WEATHER_WEAR_MULT: { clear: 1, overcast: 1, rain: 1.25, storm: 1.5, snow: 1.4 },
  WEATHER_FOOD_MOD: { clear: 0, overcast: 0, rain: 0.3, storm: 0.5, snow: 0.5 },
  WEATHER_MORALE_MOD: { clear: 0, overcast: -1, rain: -2, storm: -4, snow: -3 },
  WEATHER_EVENT_MOD: { clear: 0, overcast: 0, rain: 0.10, storm: 0.15, snow: 0.10 },
  WEATHER_CAMP_MORALE: { clear: 15, overcast: 15, rain: 10, storm: 5, snow: 5 },
  WEATHER_LABELS: { clear: 'Clear', overcast: 'Overcast', rain: 'Rain', storm: 'Storm', snow: 'Snow' },
  // Weight & travel physics
  CART_CAPACITY: 100,
  WEIGHT_TRAVEL_MULT: 0.5,      // weightRatio * 0.5 = extra days per base day
  WEIGHT_WEAR_MULT: 0.5,        // weightRatio * 0.5 = extra wear chance

  // Phase 0.5 — Settlement Barter (pure barter, no MB currency)
  // Each settlement type has unique exchange rates: { give: [{item, count}], receive: [{item, count}] }
  SETTLEMENT_BARTER: {
    hbc: {
      // Trade furs for food at Company rates (6 food per pelt, was 5)
      trade_furs_food: {
        give: [{ name: 'any_fur', count: 1 }], // any trade/category:furs item
        receive: [{ name: 'Pemmican Rations', count: 6 }],
        flavor: 'The Company factor weighs your furs in silence. The ledger decides: pemmican or powder?',
      },
      // Trade furs for supplies
      trade_furs_supplies: {
        give: [{ name: 'any_fur', count: 1 }],
        options: [
          { id: 'ammunition', receive: [{ name: 'Ammunition Belt', count: 2 }], flavor: 'Pemmican, axes, shaganappi, tools — everything a carter needs for the long trail.' },
          { id: 'shaganappi', receive: [{ name: 'Shaganappi', count: 3 }], flavor: 'Rawhide strips. Binding, lashing, and cart repair.' },
          { id: 'medicine', receive: [{ name: 'Medicine Pouch', count: 1 }], flavor: 'Herbal remedies and bandages.' },
        ],
        flavor: 'The Company store has what you need — at Company prices.',
      },
      // Rest costs food
      rest: {
        give: [{ name: 'Pemmican Rations', count: 1 }],
        receive: [{ name: 'rested', count: 1 }, { name: 'Morale', count: 15 }],
        flavor: 'A warm fire in the mess hall, dry blankets, and a night without the wind.',
      },
    },
    metis: {
      // Trade gossip - free, gives intel
      trade_gossip: {
        give: [],
        receive: [{ name: 'trail_intel', count: 1 }, { name: 'Morale', count: 3 }],
        flavor: 'News travels faster than carts on the prairie. The women know everything.',
      },
      // Dance - costs 1 food, big morale boost
      dance: {
        give: [{ name: 'Pemmican Rations', count: 1 }],
        receive: [{ name: 'Morale', count: 15 }],
        flavor: 'The fiddle starts. A Red River jig. Boots on hard ground. Nobody thinks about tomorrow.',
      },
      // Share food - give food, get morale + reputation
      share_food: {
        give: [{ name: 'Pemmican Rations', count: 2 }], // minimum 2
        receive: [{ name: 'Morale', count: 10 }, { name: 'ReputationMetis', count: 1 }],
        flavor: 'Generosity on the trail is its own currency. What you give returns in loyalty.',
      },
      // Trade furs for food at better rates (7 food per pelt, was 6)
      trade_furs_food: {
        give: [{ name: 'any_fur', count: 1 }],
        receive: [{ name: 'Pemmican Rations', count: 7 }],
        flavor: 'The Métis traders know the prairie. Their prices are fair and the pemmican is rich.',
      },
    },
    nwmp: {
      // Buy ammo - trade 1 fur for 2 ammo belts
      buy_ammo: {
        give: [{ name: 'any_fur', count: 1 }],
        receive: [{ name: 'Ammunition Belt', count: 2 }],
        flavor: "Ball and powder, measured honest. The Mounties don't cheat a carter on shot.",
      },
      // Rest - costs 1 food, no morale bonus
      rest: {
        give: [{ name: 'Pemmican Rations', count: 1 }],
        receive: [{ name: 'rested', count: 1 }],
        flavor: 'A cot in the barracks. Clean, quiet, and the sentry paces all night.',
      },
    },
    mission: {
      // Heal crew - 1 Medicine Pouch (preferred)
      heal_crew: {
        giveOptions: [
          { give: [{ name: 'Medicine Pouch', count: 1 }], receive: [{ name: 'rested', count: 1 }, { name: 'Morale', count: 10 }] },
          { give: [{ name: 'Pemmican Rations', count: 2 }], receive: [{ name: 'rested', count: 1 }, { name: 'Morale', count: 10 }] },
        ],
        flavor: 'The Grey Nuns tend the sick without asking who you are or where you come from.',
      },
      // Free rest + blessing
      rest_blessing: {
        give: [],
        receive: [{ name: 'rested', count: 1 }, { name: 'Morale', count: 15 }, { name: 'blessingDays', count: 3 }],
        flavor: 'A chapel bell at evening. You sleep on straw but wake with a lighter spirit.',
      },
      // Trade furs for food at charity rates (4 food per pelt, was 3)
      trade_furs_food: {
        give: [{ name: 'any_fur', count: 1 }],
        receive: [{ name: 'Pemmican Rations', count: 4 }],
        flavor: 'The mission garden feeds the body. The trade feeds the journey.',
      },
    },
    trading: {
      // Trade furs for food at best rates (10 food per pelt, was 8)
      trade_furs_food: {
        give: [{ name: 'any_fur', count: 1 }],
        receive: [{ name: 'Pemmican Rations', count: 10 }],
        flavor: 'A free trader with no Company badge. His prices are his own.',
      },
      // Trade furs for supplies
      trade_furs_supplies: {
        give: [{ name: 'any_fur', count: 1 }],
        options: [
          { id: 'ammunition', receive: [{ name: 'Ammunition Belt', count: 2 }], flavor: 'What the Company posts run out of, the free traders sometimes have.' },
          { id: 'shaganappi', receive: [{ name: 'Shaganappi', count: 3 }], flavor: 'Rawhide strips. Binding, lashing, and cart repair.' },
          { id: 'medicine', receive: [{ name: 'Medicine Pouch', count: 1 }], flavor: 'Herbal remedies and bandages.' },
        ],
        flavor: 'What the Company posts run out of, the free traders sometimes have.',
      },
      // Rest - costs 1 food
      rest: {
        give: [{ name: 'Pemmican Rations', count: 1 }],
        receive: [{ name: 'rested', count: 1 }, { name: 'Morale', count: 10 }],
        flavor: 'A lean-to by the fire. Simple shelter, honest company.',
      },
    },
  },
});

export function crewMod(state) {
  return CONSTANTS.CREW_MOD[state.crew] ?? 0;
}

export function wearMod(wear) {
  return CONSTANTS.WEAR_MOD[wear] ?? -5;
}

export function totalMod(state) {
  return crewMod(state) + wearMod(state.wear) + (state.blessingDays > 0 ? 1 : 0);
}
