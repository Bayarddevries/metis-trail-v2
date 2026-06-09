const STORAGE_KEY = 'metis-trail-v2.save';
const SAVE_SCHEMA_VERSION = 1;

const REQUIRED_FIELDS = [
  'day', 'month', 'year', 'season', 'crew', 'food',
  'wear', 'morale', 'node', 'segmentDay', 'over', 'won',
  'endReason', 'score', 'pendingEvent', 'pendingSettlement',
  'usedWeight', 'capacity', 'preDeparture', 'weather',
  'camps', 'eventsResolved', 'tradesMade', 'flags',
  'reputation', 'credit', 'perishable', 'travelDaysWithoutRest',
  'seed'
];

function validateState(state) {
  if (!state || typeof state !== 'object') return false;
  for (const field of REQUIRED_FIELDS) {
    if (!(field in state)) return false;
  }
  // Type checks for critical fields
  if (typeof state.day !== 'number' || state.day < 1) return false;
  if (typeof state.month !== 'number' || state.month < 1 || state.month > 12) return false;
  if (typeof state.year !== 'number') return false;
  if (typeof state.food !== 'number') return false;
  if (typeof state.wear !== 'number' || state.wear < 0) return false;
  if (typeof state.morale !== 'number') return false;
  if (typeof state.node !== 'number' || state.node < 0) return false;
  if (typeof state.score !== 'number') return false;
  if (typeof state.capacity !== 'number') return false;
  if (typeof state.over !== 'boolean') return false;
  if (typeof state.won !== 'boolean') return false;
  if (typeof state.preDeparture !== 'boolean') return false;
  if (state.endReason !== null && typeof state.endReason !== 'string') return false;
  if (typeof state.weather !== 'string') return false;
  return true;
}

function migrateState(state, fromVersion) {
  // Future migrations go here
  // Example for v1 -> v2:
  // if (fromVersion < 2) {
  //   state.newField = defaultValue;
  // }
  return state;
}

export function saveGame(state) {
  try {
    // Validate state before saving
    if (!validateState(state)) {
      console.warn('Save failed: invalid state');
      return false;
    }
    const payload = {
      schemaVersion: SAVE_SCHEMA_VERSION,
      ts: Date.now(),
      data: state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn('Save failed', e);
    return false;
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw);

    // Handle legacy saves (no schemaVersion)
    if (!payload.schemaVersion) {
      console.info('Legacy save detected, migrating to v1');
      const migrated = migrateState(payload.data || payload, 0);
      if (!validateState(migrated)) return null;
      return migrated;
    }

    // Handle version migrations
    if (payload.schemaVersion < SAVE_SCHEMA_VERSION) {
      console.info(`Migrating save from v${payload.schemaVersion} to v${SAVE_SCHEMA_VERSION}`);
      const migrated = migrateState(payload.data, payload.schemaVersion);
      if (!validateState(migrated)) return null;
      return migrated;
    }

    // Current version - validate and return
    if (!validateState(payload.data)) {
      console.warn('Save validation failed - corrupted or incompatible');
      return null;
    }

    return payload.data;
  } catch (e) {
    console.warn('Load failed', e);
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveExists() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export { SAVE_SCHEMA_VERSION, validateState, migrateState };