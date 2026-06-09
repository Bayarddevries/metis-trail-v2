export const CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 5,
  DAILY_FOOD: 1.35,
  EVENT_CHANCE: 0.45,
  DAYS_PER_WEEK: 7,
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
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
