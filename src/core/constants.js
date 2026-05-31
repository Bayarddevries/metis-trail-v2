export const CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 5,
  DAILY_FOOD: 1,
  MAX_CART_KG: 450,
  EVENT_CHANCE: 0.35,
  DAYS_PER_WEEK: 7,
  CREW_STATES: ['rested', 'tired', 'exhausted'],
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
  SQUEAL_THRESHOLDS: [0, 10, 30, 60],
  SQUEAL_LABELS: ['Quiet', 'Murmuring', 'Loud', 'Shrieking'],
});

export function crewMod(state) {
  return CONSTANTS.CREW_MOD[state.crew] ?? 0;
}

export function wearMod(wear) {
  return CONSTANTS.WEAR_MOD[wear] ?? -5;
}

export function totalMod(state) {
  return crewMod(state) + wearMod(state.wear);
}

export function squealIndex(squeal) {
  let idx = 0;
  for (let i = 0; i < CONSTANTS.SQUEAL_THRESHOLDS.length; i++) {
    if (squeal >= CONSTANTS.SQUEAL_THRESHOLDS[i]) idx = i;
  }
  return idx;
}
