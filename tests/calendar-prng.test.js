import { describe, it, expect } from 'vitest';
import { isLeap, daysInMonth, seasonFor, advanceDate, DAYS_IN_MONTH } from '../src/core/calendar.js';
import { makeRNG, d20 } from '../src/core/seed.js';

describe('Calendar', () => {
  describe('isLeap', () => {
    it('returns true for leap years divisible by 4 but not 100', () => {
      expect(isLeap(1876)).toBe(true);
      expect(isLeap(1880)).toBe(true);
      expect(isLeap(1884)).toBe(true);
    });

    it('returns false for century years not divisible by 400', () => {
      expect(isLeap(1800)).toBe(false);
      expect(isLeap(1900)).toBe(false);
      expect(isLeap(2100)).toBe(false);
    });

    it('returns true for century years divisible by 400', () => {
      expect(isLeap(1600)).toBe(true);
      expect(isLeap(2000)).toBe(true);
    });

    it('returns false for non-leap years', () => {
      expect(isLeap(1877)).toBe(false);
      expect(isLeap(1878)).toBe(false);
      expect(isLeap(1879)).toBe(false);
    });
  });

  describe('daysInMonth', () => {
    it('returns correct days for standard months', () => {
      expect(daysInMonth(1, 1878)).toBe(31); // January
      expect(daysInMonth(3, 1878)).toBe(31); // March
      expect(daysInMonth(4, 1878)).toBe(30); // April
      expect(daysInMonth(6, 1878)).toBe(30); // June
      expect(daysInMonth(7, 1878)).toBe(31); // July
    });

    it('returns 28 for February in non-leap year', () => {
      expect(daysInMonth(2, 1878)).toBe(28);
      expect(daysInMonth(2, 1879)).toBe(28);
    });

    it('returns 29 for February in leap year', () => {
      expect(daysInMonth(2, 1876)).toBe(29);
      expect(daysInMonth(2, 1880)).toBe(29);
    });

    it('matches DAYS_IN_MONTH array for non-February months', () => {
      for (let m = 1; m <= 12; m++) {
        if (m !== 2) {
          expect(daysInMonth(m, 1878)).toBe(DAYS_IN_MONTH[m]);
        }
      }
    });
  });

  describe('seasonFor', () => {
    it('returns summer for June, July, August', () => {
      expect(seasonFor(6)).toBe('summer');
      expect(seasonFor(7)).toBe('summer');
      expect(seasonFor(8)).toBe('summer');
    });

    it('returns autumn for September, October', () => {
      expect(seasonFor(9)).toBe('autumn');
      expect(seasonFor(10)).toBe('autumn');
    });

    it('returns early winter for November, December, January, February, March, April, May', () => {
      expect(seasonFor(11)).toBe('early winter');
      expect(seasonFor(12)).toBe('early winter');
      expect(seasonFor(1)).toBe('early winter');
      expect(seasonFor(2)).toBe('early winter');
      expect(seasonFor(3)).toBe('early winter');
      expect(seasonFor(4)).toBe('early winter');
      expect(seasonFor(5)).toBe('early winter');
    });
  });

  describe('advanceDate', () => {
    it('advances day within same month', () => {
      expect(advanceDate(6, 15, 1878)).toEqual({ month: 6, day: 16 });
      expect(advanceDate(6, 20, 1878)).toEqual({ month: 6, day: 21 });
    });

    it('rolls over to next month at month end', () => {
      expect(advanceDate(6, 30, 1878)).toEqual({ month: 7, day: 1 });
      expect(advanceDate(4, 30, 1878)).toEqual({ month: 5, day: 1 });
    });

    it('handles February correctly in non-leap year', () => {
      expect(advanceDate(2, 28, 1878)).toEqual({ month: 3, day: 1 });
    });

    it('handles February correctly in leap year', () => {
      expect(advanceDate(2, 28, 1876)).toEqual({ month: 2, day: 29 });
      expect(advanceDate(2, 29, 1876)).toEqual({ month: 3, day: 1 });
    });

    it('rolls over to next year at December 31', () => {
      expect(advanceDate(12, 31, 1878)).toEqual({ month: 1, day: 1 });
    });

    it('handles multi-day advance via repeated calls', () => {
      let date = { month: 6, day: 28 };
      date = advanceDate(date.month, date.day, 1878); // 29
      date = advanceDate(date.month, date.day, 1878); // 30
      date = advanceDate(date.month, date.day, 1878); // Jul 1
      date = advanceDate(date.month, date.day, 1878); // Jul 2
      expect(date).toEqual({ month: 7, day: 2 });
    });
  });
});

describe('PRNG', () => {
  describe('makeRNG', () => {
    it('returns null for null/undefined seed', () => {
      expect(makeRNG(null)).toBeNull();
      expect(makeRNG(undefined)).toBeNull();
    });

    it('produces deterministic sequence for same seed', () => {
      const rng1 = makeRNG(12345);
      const rng2 = makeRNG(12345);
      for (let i = 0; i < 100; i++) {
        expect(rng1()).toBe(rng2());
      }
    });

    it('produces different sequences for different seeds', () => {
      const rng1 = makeRNG(12345);
      const rng2 = makeRNG(54321);
      let allSame = true;
      for (let i = 0; i < 100; i++) {
        if (rng1() !== rng2()) { allSame = false; break; }
      }
      expect(allSame).toBe(false);
    });

    it('produces values in [0, 1)', () => {
      const rng = makeRNG(42);
      for (let i = 0; i < 1000; i++) {
        const val = rng();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    });

    it('has reasonable distribution (no obvious bias)', () => {
      const rng = makeRNG(999);
      const buckets = new Array(10).fill(0);
      for (let i = 0; i < 10000; i++) {
        const val = rng();
        const bucket = Math.floor(val * 10);
        buckets[bucket]++;
      }
      // Each bucket should get ~1000, allow ±30% variance
      for (const count of buckets) {
        expect(count).toBeGreaterThan(700);
        expect(count).toBeLessThan(1300);
      }
    });
  });

  describe('d20', () => {
    it('returns integers 1-20 inclusive', () => {
      const rng = makeRNG(1);
      for (let i = 0; i < 1000; i++) {
        const roll = d20(rng);
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(20);
        expect(Number.isInteger(roll)).toBe(true);
      }
    });

    it('produces uniform-like distribution', () => {
      const rng = makeRNG(42);
      const counts = new Array(21).fill(0);
      for (let i = 0; i < 20000; i++) {
        counts[d20(rng)]++;
      }
      // Each face should appear ~1000 times, allow ±40% for chi-square tolerance
      for (let face = 1; face <= 20; face++) {
        expect(counts[face]).toBeGreaterThan(600);
        expect(counts[face]).toBeLessThan(1400);
      }
    });

    it('is deterministic with same seed', () => {
      const rng1 = makeRNG(555);
      const rng2 = makeRNG(555);
      for (let i = 0; i < 100; i++) {
        expect(d20(rng1)).toBe(d20(rng2));
      }
    });
  });
});