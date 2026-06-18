/**
 * Haptics module — lightweight vibration feedback for game events.
 * Uses Navigator Vibration API with graceful fallback.
 * All patterns are short, subtle, and respect user preferences.
 */

const HAPTICS_ENABLED_KEY = 'metis-trail-haptics-enabled';

// Default patterns (ms) — [vibrate, pause, vibrate, ...]
const PATTERNS = {
  // Travel & movement
  travel: [30],
  segmentComplete: [40, 20, 40],
  arrival: [60, 30, 60],

  // Trade & economy
  tradeSuccess: [20, 10, 20, 10, 20],
  tradeFail: [80],
  mbEarned: [15, 10, 15],
  mbSpent: [40],

  // Supplies & resources
  foodConsumed: [10],
  foodBought: [20, 10, 20],
  foodLow: [100, 50, 100], // warning pattern
  restock: [30, 15, 30],

  // Cart & equipment
  wearIncrease: [50],
  wearCritical: [150, 50, 150],
  cartOverload: [200, 100, 200],
  itemAdded: [15],
  itemRemoved: [25],

  // Crew & morale
  crewRested: [30, 15, 30],
  crewTired: [60],
  crewExhausted: [120, 40, 120],
  crewInjured: [180],
  crewHealed: [40, 20, 40, 20, 40],
  moraleUp: [20, 10, 20],
  moraleDown: [50, 20, 50],
  moraleCritical: [200],

  // Events & outcomes
  eventSuccess: [25, 15, 25],
  eventFailure: [70],
  eventRisk: [40, 30, 40],
  diceRoll: [10],

  // Weather
  weatherClear: [15],
  weatherRain: [40, 20, 40],
  weatherStorm: [100, 30, 100, 30, 100],
  weatherSnow: [60, 30, 60],

  // Settlement actions
  settlementAction: [30, 15, 30],
  settlementRecommended: [25, 10, 25, 10, 25], // special pattern for recommended
  healCrew: [40, 20, 40, 20, 40],
  recruitCrew: [30, 15, 30, 15, 30],

  // Game milestones
  gameStart: [50, 30, 50, 30, 50],
  gameWin: [100, 50, 100, 50, 100, 50, 200],
  gameOver: [300],
  dayAdvance: [40, 20, 40],

  // UI interactions
  buttonPress: [5],
  buttonDisabled: [40],
  overlayOpen: [20],
  overlayClose: [15],
  tabSwitch: [10],
};

/**
 * Check if haptics are supported and enabled
 */
function isSupported() {
  return 'vibrate' in navigator;
}

function isEnabled() {
  if (!isSupported()) return false;
  const stored = localStorage.getItem(HAPTICS_ENABLED_KEY);
  return stored !== 'false'; // default: true
}

/**
 * Enable/disable haptics (persisted)
 */
export function setHapticsEnabled(enabled) {
  localStorage.setItem(HAPTICS_ENABLED_KEY, enabled.toString());
}

/**
 * Trigger a named haptic pattern
 */
export function trigger(patternName, options = {}) {
  if (!isEnabled()) return;
  if (!isSupported()) return;

  const pattern = PATTERNS[patternName];
  if (!pattern) {
    console.warn(`[Haptics] Unknown pattern: ${patternName}`);
    return;
  }

  // Allow intensity scaling (0-1)
  const intensity = Math.max(0, Math.min(1, options.intensity ?? 1));
  const scaledPattern = pattern.map(ms => Math.round(ms * intensity));

  try {
    navigator.vibrate(scaledPattern);
  } catch (e) {
    // Silently fail — haptics are optional enhancement
  }
}

/**
 * Trigger multiple patterns in sequence (with gap)
 */
export function triggerSequence(patternNames, gapMs = 100) {
  if (!isEnabled() || !isSupported()) return;

  const combined = patternNames.flatMap((name, i) => {
    const pattern = PATTERNS[name];
    if (!pattern) return [];
    const result = [...pattern];
    if (i < patternNames.length - 1) result.push(gapMs);
    return result;
  });

  if (combined.length) {
    try {
      navigator.vibrate(combined);
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Stop any ongoing vibration
 */
export function stop() {
  if (isSupported()) {
    navigator.vibrate(0);
  }
}

/**
 * Get available pattern names (for debugging/settings UI)
 */
export function getAvailablePatterns() {
  return Object.keys(PATTERNS);
}

/**
 * Test a pattern (for settings menu)
 */
export function testPattern(patternName) {
  trigger(patternName, { intensity: 1 });
}

// Export patterns for direct access if needed
export { PATTERNS };