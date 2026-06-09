import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveGame, loadGame, clearSave, saveExists, SAVE_SCHEMA_VERSION, validateState } from '../src/ui/persistence.js';

const STORAGE_KEY = 'metis-trail-v2.save';

// Mock localStorage for Node.js test environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, value) => mockStorage.set(key, value),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

const VALID_STATE = {
  day: 15,
  month: 6,
  year: 1878,
  season: 'summer',
  crew: 'rested',
  food: 27.5,
  wear: 12,
  morale: 70,
  node: 3,
  segmentDay: 4,
  over: false,
  won: false,
  endReason: null,
  score: 450,
  pendingEvent: null,
  pendingSettlement: null,
  usedWeight: 85,
  capacity: 100,
  preDeparture: false,
  weather: 'clear',
  camps: 2,
  eventsResolved: 5,
  tradesMade: 3,
  flags: { sawBison: true },
  reputation: { hbc: 10, nwmp: 5, metis: 15, mission: 0, cree: -5 },
  credit: { hbc: 0, metis: 0, nwmp: 0, mission: 0 },
  perishable: {},
  travelDaysWithoutRest: 3,
  seed: 12345,
};

describe('Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('validateState', () => {
    it('returns true for valid state', () => {
      expect(validateState(VALID_STATE)).toBe(true);
    });

    it('returns false for null/undefined', () => {
      expect(validateState(null)).toBe(false);
      expect(validateState(undefined)).toBe(false);
    });

    it('returns false for missing required fields', () => {
      const state = { ...VALID_STATE };
      delete state.day;
      expect(validateState(state)).toBe(false);
    });

    it('returns false for wrong types on critical fields', () => {
      let state = { ...VALID_STATE, day: '15' };
      expect(validateState(state)).toBe(false);

      state = { ...VALID_STATE, food: 'lots' };
      expect(validateState(state)).toBe(false);

      state = { ...VALID_STATE, over: 'false' };
      expect(validateState(state)).toBe(false);
    });

    it('returns false for out-of-range values', () => {
      let state = { ...VALID_STATE, month: 13 };
      expect(validateState(state)).toBe(false);

      state = { ...VALID_STATE, wear: -5 };
      expect(validateState(state)).toBe(false);

      state = { ...VALID_STATE, day: 0 };
      expect(validateState(state)).toBe(false);
    });

    it('returns false for invalid endReason type', () => {
      const state = { ...VALID_STATE, endReason: 123 };
      expect(validateState(state)).toBe(false);
    });

    it('accepts null endReason', () => {
      const state = { ...VALID_STATE, endReason: null };
      expect(validateState(state)).toBe(true);
    });

    it('accepts string endReason', () => {
      const state = { ...VALID_STATE, endReason: 'starvation' };
      expect(validateState(state)).toBe(true);
    });
  });

  describe('saveGame/loadGame round-trip', () => {
    it('saves and loads valid state', () => {
      expect(saveGame(VALID_STATE)).toBe(true);
      const loaded = loadGame();
      expect(loaded).toEqual(VALID_STATE);
    });

    it('returns null when no save exists', () => {
      expect(loadGame()).toBeNull();
    });

    it('returns false for invalid state', () => {
      expect(saveGame(null)).toBe(false);
      expect(saveGame({})).toBe(false);
    });

    it('includes schemaVersion in saved payload', () => {
      saveGame(VALID_STATE);
      const raw = localStorage.getItem(STORAGE_KEY);
      const payload = JSON.parse(raw);
      expect(payload.schemaVersion).toBe(SAVE_SCHEMA_VERSION);
      expect(payload.ts).toBeGreaterThan(0);
      expect(payload.data).toEqual(VALID_STATE);
    });

    it('clearSave removes save', () => {
      saveGame(VALID_STATE);
      expect(saveExists()).toBe(true);
      clearSave();
      expect(saveExists()).toBe(false);
      expect(loadGame()).toBeNull();
    });

    it('saveExists returns correct boolean', () => {
      expect(saveExists()).toBe(false);
      saveGame(VALID_STATE);
      expect(saveExists()).toBe(true);
    });
  });

  describe('Legacy save migration', () => {
    it('migrates legacy save (no schemaVersion)', () => {
      // Simulate legacy save format
      const legacyPayload = { ts: Date.now(), data: VALID_STATE };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPayload));

      const loaded = loadGame();
      expect(loaded).toEqual(VALID_STATE);
    });

    it('rejects corrupted legacy save', () => {
      const legacyPayload = { ts: Date.now(), data: { ...VALID_STATE, day: 'invalid' } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPayload));

      const loaded = loadGame();
      expect(loaded).toBeNull();
    });

    it('handles completely malformed JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json');
      expect(loadGame()).toBeNull();
    });
  });

  describe('Schema version migration', () => {
    it('loads current version without migration', () => {
      const payload = { schemaVersion: SAVE_SCHEMA_VERSION, ts: Date.now(), data: VALID_STATE };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      const loaded = loadGame();
      expect(loaded).toEqual(VALID_STATE);
    });

    it('calls migrateState for older schema version', () => {
      const oldState = { ...VALID_STATE, newField: 'test' };
      const payload = { schemaVersion: SAVE_SCHEMA_VERSION - 1, ts: Date.now(), data: oldState };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      const loaded = loadGame();
      // migrateState currently just passes through
      expect(loaded).toEqual(oldState);
    });

    it('rejects migrated state that fails validation', () => {
      const oldState = { ...VALID_STATE, day: 'bad' };
      const payload = { schemaVersion: SAVE_SCHEMA_VERSION - 1, ts: Date.now(), data: oldState };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      const loaded = loadGame();
      expect(loaded).toBeNull();
    });
  });

  describe('Round-trip with engine-like state', () => {
    it('preserves all state fields including nested objects', () => {
      const complexState = {
        ...VALID_STATE,
        flags: { a: 1, b: { c: 2 } },
        reputation: { hbc: 0, nwmp: 0, metis: 0, mission: 0, cree: 0 },
        credit: { hbc: 100, metis: 50, nwmp: 25, mission: 10 },
        perishable: { pemmican: 2, firewood: 1 },
      };
      saveGame(complexState);
      const loaded = loadGame();
      expect(loaded).toEqual(complexState);
    });

    it('preserves floating point precision for food', () => {
      const state = { ...VALID_STATE, food: 27.333333 };
      saveGame(state);
      const loaded = loadGame();
      expect(loaded.food).toBeCloseTo(27.333333, 5);
    });
  });
});