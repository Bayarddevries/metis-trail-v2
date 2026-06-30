# Metis Trail V2 — Comprehensive Audit Report

## Overview

Audited:
- **49 terrain events** (plains: 22, river_valley: 16, wooded: 11)
- **6 river events** (EVENT_POOLS.river: 7 entries)
- **10 settlement events** (hbc: 3, nwmp: 2, metis: 2, mission: 2, trading: 1)
- **13 settlement types** with barter tables
- **8 camp actions** (rest, forage, hunt, repair, scout, dance, pemmican_process, deeprest, cook)
- **Engine core**: `resolveChoice()`, `campAction()`, `executeSettlementAction()`

---

## 🔴 CRITICAL ISSUES

### 1. `crew` field is NEVER applied by the engine

**Location**: `src/systems/engine.js` lines 207-264 — `resolveChoice()`

The engine only checks `ch.okCrew` (line 224) and `ch.badCrew` (line 245). The base `crew` field is never applied on dice-roll choices. Additionally, the fallback block at lines 250-264 explicitly excludes always-path choices (the condition `(ch.dc === null && !ch.always)` is false when `ch.always` is truthy).

**Affected events (dice-roll choices with `crew` but no `okCrew`/`badCrew`):**
| Event | Line | Field |
|-------|------|-------|
| `plains_ox_scatter` (choice 1) | 56 | `crew: 'tired'` |
| `plains_cart_fortress` (choice 0) | 231 | `crew: 'tired'` |
| `plains_smallpox_trail` (choice 1) | 242 | `crew: 'exhausted'` |
| `plains_burnt_prairie` (choice 0) | 106 | `crew: 'tired'` |
| `river_cholera_camp` (choice 0) | 314 | `crew: 'tired'` |
| `wooded_stung_by_flies` (choice 0) | 431 | `crew: 'tired'` |
| `wooded_black_bear` (choice 0) | 440 | `crew: 'tired'` |
| `upland_water_hole` (choice 0) | 577 | `crew: 'tired'` |
| `upland_night_frost` (choice 1) | 588 | `crew: 'tired'` |
| `upland_early_snow` (choice 1) | 599 | `crew: 'tired'` |

**Affected events (always-path choices with `crew`):**
| Event | Line | Field |
|-------|------|-------|
| `plains_cart_fortress` (choice 1) | 232 | `crew: 'exhausted'` |
| `plains_smallpox_trail` (choice 0) | 241 | `crew: 'tired'` |
| `river_cholera_camp` (choice 1) | 315 | `crew: 'exhausted'` |

### 2. `okTime` / `badTime` fields are dead code

**Location**: `src/systems/engine.js` lines 190-199

The `time` field is applied unconditionally — there is no `okTime`/`badTime` check. Many events define these fields but they are never read.

**Affected events** (defined but never consumed):
- `plains_ox_scatter` — `okTime: -1` on choice 1 (line 56)
- `plains_prairie_fire` — `okTime: 1` on choice 0 (line 88)
- `river_mosquito_camp` — `okTime: -1` on choice 0 (line 323)
- `wooded_stung_by_flies` — `okTime: -1` on choice 0 (line 431)
- `wooded_axle_rut` — `okTime: -1` on choice 0 (line 458) and choice 1 (line 459)
- `wooded_cree_elder` — `okTime: -1` on choice 1 (line 468)
- `wooded_forest_fire` — `okTime: 1` on choice 0 (line 487)
- `upland_bison_herd` — `okTime: -1` on choice 1 (line 548)
- `upland_early_snow` — `okTime: -1` on choice 1 (line 599)
- `river_ice_breakup` — `okTime: -1` on choice 1 (line 654)
- `river_valley_flood_crossing` — `okWear: -1` is handled correctly, but `okTime` follows same pattern (on choice 0, line 342)

### 3. Missing `id` field on a plains event

**Location**: `src/data/events.js` line 60

The plains squealing-cart event (starting at line 60, after `plains_ox_scatter`) has NO `id` field. It begins with just `{ text: 'The dry wood of the hub screams...'`. This means:
- Cannot be referenced by other systems (debug, log, tracking)
- `eventsResolved` counter increments but the event is unidentifiable
- The squeal trigger at line 388 of engine.js calls `getSquealEvent()` separately, so this specific entry IS what the squeal mechanic pulls — but it lacks an id

---

## 🟠 MAJOR BALANCE ISSUES

### 4. `addsRep` with negative delta applies unconditionally

**Issue**: `addsRep: { key: '...', delta: -N }` is applied on BOTH success and failure paths (line 303: `if (ch.addsRep)` is unconditional). This means even on success, reputation decreases when the narrative says the encounter went well.

**Affected choices:**
| Event | Choice | Narrative on success | Effect |
|-------|--------|---------------------|--------|
| `plains_squeal_draw_attention` — Stand ground (line 67) | DC 10 success: "He is a Métis trader simply curious." | **addsRep metis: -1** on both success AND failure |
| `river_mp_check` — Show papers (line 280) | DC 9 success: "The permits read clearly. They let you pass." | **addsRep nwmp: -1** on both success AND failure |
| `river_nwmp_duty` — Pass quietly (line 636) | DC 13 success: "They are busy and let you slip through." | **addsRep nwmp: -2** on both success AND failure |
| `river_cart_raft` — branch `river_raft_wash` — Greet respectfully (line 623) | DC 10 success: "He shares drying hides and directions" | **addsRep cree: -1** on both success AND failure |

### 5. Success path penalizes player where narrative is positive

**Location**: `plains_sayer_trial` (lines 97-98, `id: 'plains_sayer_trial'`)

Choice "Display independent freight proudly" — DC 9, NO okFood/okMorale overrides.
- **Narrative on success**: "The folk cheer. Prices are better here."
- **Actual mechanics**: `food: -2, morale: -4` applied on both success AND failure
- **Problem**: Success should not cost food/morale. Should have `okFood: 0, okMorale: 0` or similar.

### 6. Event `plains_bear_camp` (lines 139-146) — Success food loss

Choice "Beat the pan and drive it off" — DC 11, `food: -3, okMorale: 4`
- **Narrative on success**: "The bear lumbers away with a swat at its nose."
- **Mechanics on success**: `food -3, morale +4, wear +1`
- **Problem**: You successfully drive the bear off BUT still lose 3 food. The food loss narratively only makes sense on failure ("half the flour is gone"). Should be `okFood: 0`.

### 7. `river_boat` (lines 301-308) — Success food/wear loss

Choice "Board and keep the load centred" — DC 11, `wear: 1, food: -2`
- **Narrative on success**: "You ride the swell and land clean."
- **Mechanics on success**: `wear: +1, food: -2`
- **Problem**: "Land clean" but lose 2 food and 1 wear. Should have `okFood: 0` and `okWear: 0`.

### 8. `river_cart_raft_crossing` / `river_cart_raft` — Build raft success morale

Both raft-building choices (line 619-620, line 683): DC 12, `morale: -6, food: -2`
- **Narrative on success**: "The improvised ferry floats. The crew swims the line across."
- **Mechanics on success**: `morale -6, food -2`
- **Problem**: Successfully building a raft and crossing shouldn't tank morale. Should have `okMorale` override.

### 9. `upland_high_pass` (lines 515-523) — No success differentiation

Choice "Press through before the storm": DC 11, `wear: 1, morale: -6`
- **Both paths**: Same penalties. Success "You gain the far shelter" ≠ failure "The rain catches you"

### 10. `upland_thunderstorm` (lines 534-541) — No success differentiation

Choice "Hobble the oxen" (DC 11): Both paths `morale: -6, time: 1`
Choice "Run for the coulee" (DC 9): Both paths `wear: 1`

---

## 🟡 MODERATE ISSUES

### 11. `plains_camp_cookery` — Success/failure morale mismatch

Choice "Share rubaboo" (line 37): DC 8, `morale: 4`
- **Both paths**: same +4 morale
- **Failure text**: "You are too guarded to connect fully" — but still get +4 morale. Should be `okMorale: 4, badMorale: 0` or similar.

### 12. `wooded_ambush_ravine` — Choice 1 success/failure identical

Choice "Call for help" (line 423): DC 9, `morale: 3, time: 1, give: [{Pemmican Rations}]`
- **Both paths**: `morale +3, time +1, get 1 pemmican`
- **Failure text**: "Helpers arrive slow and grumpy." — but you still get +3 morale AND free food from grumpy helpers.

### 13. `plains_abandoned_cart` — Failure rewards same as success

Choice "Salvage spare axle" (line 221): DC 9, `give: [Spare Axle], morale: 5`
- **Failure**: No `badGive`, no `badMorale` — same outcome as success
- **Failure text**: "The wood is sound but the fittings are rusted." — still +5 morale and the same reward

### 14. `plains_hbc_cache` / `river_valley_canvas_cache` — Failure morale too high

Both cache events have `morale: 5` with no `badMorale` override, so failure still gives +5 morale despite narrative saying the cache is damp/torn.

### 15. `wooded_firewood_gather` — Failure gives same as success

Choice "Gather firewood" (line 508): DC 8, `badGive: [{Firewood Bundle}]` — same as `give`. No `badMorale`. Failure = same as success mechanically.

### 16. `wooded_forest_fire` — Choice 2 wet canvas

Choice "Use water from the slough" (line 489): DC 11, `morale: -2, time: 1`
- **Both paths**: Same penalties. Success "The wet tarp protects the load" vs failure "The canvas smolders."

### 17. River-flood raft choice — Success morale penalty

`river_valley_flood_crossing` choice 2 (line 344): DC 12, `morale: -6, food: -2`
- **Success**: "The improvised ferry floats." But still -6 morale, -2 food.

---

## 🟢 MINOR & COSMETIC ISSUES

### 18. Settlement event — `hbc_rivalry` failure/morale

Choice "Sell under table" (line 720): DC 10, `morale: 5`
- **Failure**: "A Company servant spots the exchange." But still +5 morale.

### 19. Settlement event — `trading_news` failure/morale

Choice "Listen carefully" (line 818): DC 8, `morale: 2`
- **Failure**: "You learn nothing useful." But still +2 morale.

### 20. Settlement event — `metis_welcome` actions

Choice "Trade greetings" (line 770): DC 8, `morale: 3` — both paths same morale
Choice "Ask about conditions" (line 771): DC 9, `morale: 1` — both paths same

### 21. `plains_sand_hills` — Success says "saves the cart" but takes wear

### 22. `river_valley_bank_descent` — Success says "protects the load" but takes wear

### 23. `upland_sand_hill` — Same as #21

### 24. `ferry_gabriel` — Rep applies even on failure

Gabriel's rep +1 applies unconditionally. On failure narrative says ferry lurches, but still get rep.

---

## 🔧 CAMP ACTION ISSUES

### 25. `forage` — No terrain differentiation

Forage uses a flat random formula (`Math.random() * 6 + threshold bonus`). Hunting has terrain-based yields. Forage should too (plains yield more than uplands).

### 26. `repair` — No wear check

`campAction('repair')` consumes Shaganappi even if `S.wear === 0`. Should check if repair is needed before consuming resources. Currently you can waste Shaganappi repairing a perfectly good cart.

### 27. `scout` — Very weak utility

Costs a full day (`advance()`), and on success (DC 12+) only reveals the next terrain type. No DC bonuses, no event-skipping benefit. For 1 day cost, the payoff is extremely low compared to other camp actions. Consider giving a concrete benefit like +1 to next event roll.

### 28. `pemmican_process` — Possibly too strong

Cost: 3 food. Expected return on typical roll (~DC 7): ~7-12 food. That's 133-400% return rate. By far the best food economy action. Compare to hunting which costs 1 ammo and a day for 2-5 food + possibly a pelt. Pemmican processing can be done at any camp with no special items.

### 29. `deeprest` — Costs 2 days

Costs 2 food + 2 days for guaranteed crew rested + morale +30 + wear -2. The 2-day cost is extremely steep (2 days of food consumption, weather/events, and progress loss). Typically 1 regular rest (1 food, 1 day, some RNG) is better value.

---

## ✅ SETTLEMENT ACTION BALANCE (mostly good)

| Settlement | Trade food rate (1 fur → N food) | Notes |
|------------|----------------------------------|-------|
| Mission | 4 food | Lowest — thematic (charity, not trade) |
| HBC | 6 food | Baseline Company rate |
| Métis | 7 food | Better than HBC, matches lore |
| Trading Post | 10 food | Best — free traders, no Company markup |

Mission `rest_blessing` (free!) is notably strong — +15 morale, crew rested, 3 blessing days for nothing. But thematically appropriate.

Supply trade rates are consistent across HBC and Trading Post (1 fur → 2 ammo / 3 shaganappi / 1 medicine). ✅

---

## 📋 SUMMARY COUNTS

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 CRITICAL | 10+ events | `crew` field never applied (systematic engine bug) |
| 🔴 CRITICAL | 11+ events | `okTime`/`badTime` dead code (fields defined but never read) |
| 🔴 CRITICAL | 1 event | Missing `id` field (unnavigable event at line 60) |
| 🔴 CRITICAL | 4 choices | `addsRep` negative delta applied on success (wrong faction) |
| 🟠 MAJOR | 2+ events | Success penalizes player despite positive narrative |
| 🟠 MAJOR | 4+ choices | No distinction between success/failure paths |
| 🟡 MODERATE | 6+ events | Failure rewards same as success (missing `badMorale`/`badGive`) |
| 🟢 MINOR | 5+ events | Narrative says "saves/protects" but mechanics apply wear/food loss |
| 🔧 CAMP | 4 issues | forage (no terrain), repair (no wear check), scout (weak), pemmican_process (strong) |

## 🏁 TOP PRIORITY FIXES

1. **Engine bug**: Add `okCrew`/`badCrew` fallback → base `crew` in `resolveChoice()`
2. **Engine bug**: Add `okTime`/`badTime` handling alongside existing `time` logic
3. **Engine bug**: Make `addsRep` conditional on success/failure (or add `okRep`/`badRep`)
4. **Data fix**: Add `id` field to the unnamed plains squealing-cart event (line 60)
5. **Data fix**: Add `okFood: 0` to `plains_sayer_trial`, `plains_bear_camp`, `river_boat` to prevent success penalties
6. **Data fix**: Add `badMorale`/`badGive` to events where failure should feel worse
