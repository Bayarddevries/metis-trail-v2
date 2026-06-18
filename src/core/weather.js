// Weather system — deterministic per-node weather based on season, terrain, and node seed

export const WEATHER_STATES = ['CLEAR', 'OVERCAST', 'RAIN', 'STORM'];

// Base seasonal probabilities (CLEAR, OVERCAST, RAIN, STORM)
const SEASON_PROBS = {
  summer:      [0.60, 0.25, 0.12, 0.03],   // June/July
  lateSummer:  [0.50, 0.30, 0.15, 0.05],   // August
  earlyFall:   [0.35, 0.30, 0.25, 0.10],   // September
  fall:        [0.20, 0.25, 0.35, 0.20],   // October/November
};

// Terrain modifiers: adjustments added to each weather prob
const TERRAIN_MODS = {
  river_valley: [ -0.10, -0.05, +0.10, +0.05 ],
  wooded:       [ -0.05,  0.00, +0.05,  0.00 ],
  plains:       [ +0.10, -0.05, -0.05,  0.00 ],
  uplands:      [ -0.05, -0.05,  0.00, +0.10 ],
};

/**
 * Deterministic hash from string -> 32-bit integer
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator (Mulberry32)
 */
export function makeSeededRNG(seed) {
  let t = seed >>> 0;
  return function() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Get season name from month (1-12)
 * Oregon Trail months: typically May-November
 */
export function getSeason(month) {
  if (month <= 7) return 'summer';       // June, July
  if (month === 8) return 'lateSummer';  // August
  if (month === 9) return 'earlyFall';   // September
  return 'fall';                          // October, November
}

/**
 * Generate weather for a specific node
 * @param {Object} node - Node data (id, terrain, etc.)
 * @param {number} month - Current month (1-12)
 * @returns {string} Weather state
 */
export function generateWeather(node, month) {
  const season = getSeason(month);
  const [pClear, pOvercast, pRain, pStorm] = SEASON_PROBS[season];

  // Apply terrain modifiers
  const terrainMod = TERRAIN_MODS[node.terrain] || [0, 0, 0, 0];
  const probs = [
    pClear + terrainMod[0],
    pOvercast + terrainMod[1],
    pRain + terrainMod[2],
    pStorm + terrainMod[3],
  ];

  // Clamp to valid range
  const clamped = probs.map(p => Math.max(0, Math.min(1, p)));
  const sum = clamped.reduce((a, b) => a + b, 0);
  const normalized = clamped.map(p => p / sum);

  // Deterministic selection based on node seed
  const seed = hashString(`metis-weather-${node.id}`);
  const rng = makeSeededRNG(seed);
  const roll = rng();

  // Select weather based on cumulative probabilities
  let cum = 0;
  for (let i = 0; i < normalized.length; i++) {
    cum += normalized[i];
    if (roll < cum) return WEATHER_STATES[i];
  }
  return WEATHER_STATES[0]; // fallback
}

/**
 * Get travel effects for weather
 * @param {string} weather
 * @returns {Object} { wearBonus, moraleDelta }
 */
export function getTravelEffects(weather) {
  switch (weather) {
    case 'CLEAR': return { wearBonus: 0, moraleDelta: 0 };
    case 'OVERCAST': return { wearBonus: 0, moraleDelta: 0 };
    case 'RAIN': return { wearBonus: 0.05, moraleDelta: 0 };
    case 'STORM': return { wearBonus: 0.10, moraleDelta: -1 };
    default: return { wearBonus: 0, moraleDelta: 0 };
  }
}

/**
 * Get camp effects for weather
 * @param {string} weather
 * @returns {Object} { outdoorDCMod, moraleBonus, disabledActions }
 */
export function getCampEffects(weather) {
  switch (weather) {
    case 'CLEAR': return { outdoorDCMod: 0, moraleBonus: 3, disabledActions: [] };
    case 'OVERCAST': return { outdoorDCMod: 0, moraleBonus: 0, disabledActions: [] };
    case 'RAIN': return { outdoorDCMod: 1, moraleBonus: 0, disabledActions: [] };
    case 'STORM': return { outdoorDCMod: 3, moraleBonus: 0, disabledActions: [] };
    default: return { outdoorDCMod: 0, moraleBonus: 0, disabledActions: [] };
  }
}

const OUTDOOR_ACTIONS = ['scout', 'forage', 'fish', 'hunt'];

export function isOutdoorAction(actionId) {
  return OUTDOOR_ACTIONS.includes(actionId);
}