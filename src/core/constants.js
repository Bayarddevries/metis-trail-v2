export const CONSTANTS = Object.freeze({
  YEAR: 1878,
  START_MONTH: 6,
  START_DAY: 15,
  MAX_WEAR: 8,
  DAILY_FOOD: 1.35,
  EVENT_CHANCE: 0.45,
  DAYS_PER_WEEK: 7,
  CREW_MOD: { rested: 1, tired: 0, exhausted: -2 },
  WEAR_MOD: { 0: 0, 1: 0, 2: 0, 3: -1, 4: -3, 5: -5 },
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
  // MB (Made Beaver) currency system
  MB_WIN_THRESHOLD: 10,      // minimum MB value needed at Edmonton to win
  MB_FOOD_COST: 0.5,         // 1 MB buys 2 food at base rate
  MB_REPAIR_COST: 2,         // 2 MB for a settlement-quality repair (-2 wear)
  MB_HEAL_COST: 1,           // 1 MB for medical treatment (+20 morale)
  MB_INFO_COST: 0.5,         // 0.5 MB for trail intelligence / gossip
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
