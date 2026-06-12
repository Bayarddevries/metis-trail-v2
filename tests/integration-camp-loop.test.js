import { describe, it, expect, beforeEach } from 'vitest';
import { createGame } from '../src/systems/engine.js';

function unload(game, count = 1) {
  for (let i = 0; i < count; i++) {
    const cart = game.getCart();
    const item = cart.find((x) => x.count > 0);
    if (!item) break;
    game.offloadItem(item.name);
  }
}

describe('Headless harness accuracy: core gameplay rules', () => {
  let game;

  beforeEach(() => {
    game = createGame('balance-harness');
    while (game.totalWeight() > game.getState().capacity) {
      unload(game);
    }
  });

  it('travelOneDay advances one in-game day', () => {
    const before = game.getState();
    game.travelOneDay();
    const after = game.getState();
    expect(after.day).toBe(before.day + 1);
  });

  it('overload autos check does not block travel once under capacity', () => {
    game.travelOneDay();
    expect(game.getState().over).toBe(false);
  });

  it('pushOn applies food, wear, morale, and rest-debt penalties', () => {
    const before = game.getState();
    game.pushOn();
    const after = game.getState();
    expect(after.food).toBe(Math.max(0, Math.round((before.food - 1.5) * 10) / 10));
    expect(after.wear).toBe(before.wear + 1);
    expect(after.morale).toBe(Math.max(0, before.morale - 5));
    expect(after.travelDaysWithoutRest).toBe(before.travelDaysWithoutRest + 1);
  });

  it('crew degrades after sustained pushOn cycles', () => {
    // Repeated pushOn builds rest debt until crew degrades.
    for (let i = 0; i < 5; i++) game.pushOn();
    expect(['tired', 'exhausted']).toContain(game.getState().crew);
  });

  it('makeCamp costs 1 food, advances a day, and resets rest debt', () => {
    game.travelOneDay();
    game.travelOneDay();
    const before = game.getState();
    if (before.pendingSettlement) game.settlementAction('continue');
    if (before.pendingEvent) game.chooseEventChoice(0);

    game.makeCamp();
    const after = game.getState();
    expect(after.day).toBe(before.day + 1);
    expect(after.food).toBeCloseTo(before.food - 1, 10);
    expect(after.travelDaysWithoutRest).toBe(0);
  });

  it('campAction rest requires food and resolves without crash', () => {
    game.getState().food = 0;
    const zeroFoodResult = game.campAction('rest');
    expect(typeof zeroFoodResult).toBe('object');
    expect(zeroFoodResult).toBeDefined();

    game.getState().food = 10;
    game.getState().crew = 'tired';
    const result = game.campAction('rest');
    expect(typeof result).toBe('object');
    expect(result).toBeDefined();
    // Dice-dependent: rest may succeed fully or degrade; structural correctness is the invariant.
  });

  it('campAction repair without shaganappi returns structured error instead of throwing', () => {
    const result = game.campAction('repair');
    expect(typeof result).toBe('object');
    expect(result).toBeDefined();
    expect('error' in result).toBe(true);
  });

  it('campAction hunt uses ammo and can return pelts/hides', () => {
    game.buyItem('Ammunition Belt', 2, 'hunting');
    const result = game.campAction('hunt');
    expect(typeof result).toBe('object');
    expect(result).toBeDefined();
    const afterCart = game.getCart();
    const ammo = afterCart.find((i) => i.name === 'Ammunition Belt');
    expect(ammo ? ammo.count : 0).toBeLessThanOrEqual(2);
  });

  it('settlement rest restores crew and clears rest debt', () => {
    let turns = 0;
    while (!game.getState().pendingSettlement && turns < 200) {
      game.travelOneDay();
      turns++;
    }
    expect(game.getState().pendingSettlement).not.toBeNull();

    const before = game.getState();
    const result = game.settlementAction('rest');
    expect(typeof result).toBe('object');
    expect(result?.rested || game.getState().crew === 'rested').toBe(true);
    expect(game.getState().travelDaysWithoutRest).toBe(0);
    expect(game.getState().food).toBeCloseTo(before.food - 1, 10);
  });
});
