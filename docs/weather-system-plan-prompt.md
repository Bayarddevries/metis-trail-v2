# Weather System Planning Prompt

**Created:** 2026-06-08 by OWL
**Target:** Next agent for implementation planning
**Phase:** Phase 3/5 — Content & Mechanics Expansion
**GitHub Issue:** #13

---

## Context

Metis Trail V2 is a narrative-driven historical simulation game. Players travel the Carlton Trail from Fort Garry to Fort Edmonton (June 1878) with a Red River cart, managing food, wear, morale, and crew. The game is a single-file HTML5/esbuild app with an engine (`src/systems/engine.js`), event pools (`src/data/events.js`), and inline UI rendering.

**Current state:**
- v64, clean tree, server running at http://100.108.183.33:5173/
- 35% win rate (200-sim baseline, target 25-40%)
- 4 terrain types across nodes: `plains` (2), `river_valley` (11), `wooded` (1)
- 62 events in terrain-specific pools (plains, river_valley, wooded, uplands, river)
- Season system exists: `summer` (Jun-Aug), `autumn` (Sep-Oct), `early winter` (Nov+)
- Game starts June 15. Early winter = game over if not at final node.
- DAILY_FOOD: 1.5. Starting food: 27. MAX_WEAR: 5.
- Calendar: `src/core/calendar.js` with `seasonFor(month)`, `advanceDate()`
- Constants: `src/core/constants.js` with `CONSTANTS` object
- Travel narrative uses atmospheric fragments keyed on terrain × crew state
- Event chance: `EVENT_CHANCE: 0.45` per travel day

---

## Goal

Design and plan a **comprehensive weather system** that adds meaningful, historically grounded tactical decisions to the travel loop without overwhelming the core gameplay.

### Design Principles

1. **Weather is a modifier, not a system.** It should layer onto existing mechanics (travel, wear, events, food) rather than becoming a parallel system.
2. **Visible but not dominant.** Players should notice weather, plan around it, but not feel controlled by it.
3. **Historically grounded.** 1878 prairie weather — summer thunderstorms, autumn rain, early winter snow. All weather text should use primary sources from `src/data/sources/index.js`.
4. **Creates meaningful choices.** Weather should make players decide: push through, wait it out, take a detour, camp early.
5. **Scales with game balance.** System should work within the existing 25-40% win rate target.
6. **Plan-first workflow.** Write the full plan, get confirmation, then implement.

---

## Current Mechanics Weather Should Interact With

| Mechanic | How Weather Could Interact |
|---|---|
| `travelOneDay()` | Weather could add wear, slow progress, block travel, or trigger weather events |
| `DAILY_FOOD` (1.5/day) | Cold weather could increase consumption (+0.3/day in rain/snow) |
| Wear accumulation (0.10-0.22) | Rain increases mud → +wear chance. Snow increases wear. |
| `makeCamp()` | Bad weather could reduce camp effectiveness (less morale recovery, no foraging) |
| Event pools | New weather-specific events (storm, fog, etc.) added to existing terrain pools |
| `EVENT_CHANCE` (0.45) | Could be modified by weather (clear = normal, storm = more events) |
| Morale | Cold/rain reduces morale. Clear skies boost it. |
| Terrain | Each terrain reacts differently to weather (plains = exposed, wooded = shelter, river = flooding) |
| Season | Weather patterns change by season (summer = thunderstorms, autumn = rain, winter = snow) |

---

## Existing Architecture Constraints

### Engine API (do not break any of these):
```javascript
// Public API on the game object — all called from main.js
game.travelOneDay()        // returns stepLog or null
game.makeCamp()            // returns nothing, mutates state
game.chooseEventChoice(i)  // returns stepLog
game.settlementAction(a)   // returns []
game.getState()            // returns snapshot (no mutation)
game.getCart()             // returns deep copy
game.getCurrentNode()      // returns {name, desc, terrain, type, lat, lon, dist}
game.getNextNode()         // returns next node or null
game.totalWeight()         // returns number
game.isOver(), game.hasWon(), game.getScore()
game.getCrew()             // returns {state, morale, mod, label}
game.offloadItem(name)     // returns boolean
game.tradeItem(name)       // returns {item, foodGain} or null
game.getTradeEstimate(name)// returns {min, max, mult}
game.getAvailableRecipes() // returns recipe[]
game.craftRecipe(id)       // returns output name or null
game.getAvailableActions() // returns {type, ...}
game.getPreDepartureItems()
game.setPreDepartureCount(name, count)
game.confirmPreDeparture()
```

### State shape inside engine (read-only from main.js via `getState()`):
```
{ day, month, year, season, crew, food, wear, morale, node, segmentDay,
  over, won, endReason, score, pendingEvent, pendingSettlement,
  usedWeight, capacity, reputation, flags, credit, perishable, camps,
  eventsResolved, tradesMade, travelDaysWithoutRest, trailIntel, ... }
```

### Files you will need to modify or create:
1. **`src/core/constants.js`** — Add weather-related constants (daily wear modifiers, food modifiers, weather states)
2. **`src/systems/engine.js`** — Add weather state to game state, modify `travelOneDay()` for weather effects, add weather transition logic, expose weather via `getState()`
3. **`src/core/calendar.js`** (or new `src/core/weather.js`) — Weather generation logic: deterministic (seeded) or semi-random, season-aware
4. **`src/data/events.js`** — New weather-specific events added to terrain pools
5. **`src/data/sources/index.js`** — New weather-related source entries for atmospheric text
6. **`src/main.js`** — Weather display in travel narrative, weather indicator in status bar, weather-related UI
7. **`src/template.html`** — Weather indicator CSS, any new UI elements
8. **`tests/simulate-entry.js`** — Update sim to account for weather effects
9. **`dist/index.html`** — Sync CSS changes (build script limitation)

### Files you should NOT modify:
- `src/ui/renderer.js` (map rendering, status bar — unless adding weather display)
- `src/data/items.js` (item definitions)
- `src/data/nodes.js` (trail nodes)
- `scripts/build.mjs` (build pipeline)

### Build & verification:
```bash
bun scripts/build.mjs                          # build
cd dist && python3 -m http.server 5173 &       # serve (port 5173)
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5173/  # verify 200
bun scripts/build-test.mjs                     # sim verification (200 sims)
```

---

## Scope Options (for the plan to define)

### Tier 1 — Minimal (recommended starting point)
- Weather state per day: `clear | overcast | rain | storm | snow` (season-dependent probabilities)
- Weather affects: travel wear chance (+25% in rain/snow), food consumption (+0.3 in cold), morale (±5)
- Weather transitions: simple Markov chain (clear → overcast → rain → clear, etc.)
- Weather display: single icon/label in status bar ("☀ Clear" / "🌧 Rain" / "❄ Snow")
- 3-4 new weather-specific events (thorough: prairie thunderstorm, autumn downpour, early snow)
- Season determines which weather states are possible

### Tier 2 — Full (if Tier 1 is approved and implemented)
All of Tier 1 plus:
- Terrain-specific weather effects (exposed plains +storm = penalty, wooded +rain = shelter bonus)
- Weather affects event pools (storm events replace normal events during storms)
- Player choice: "Push on" vs "Wait out the storm" at travel time
- Extended forecast hint (weather trend description: "The sky is darkening.")
- 6-10 more weather events across pools

### Tier 3 — Comprehensive (future)
All of Tier 2 plus:
- Weather persistence across days (storms last 2-3 days)
- River crossing difficulty scales with recent rain
- Forage effectiveness scales with season/weather
- Weather affects trade prices at settlements

---

## Balance Requirements

- System must not push win rate outside 25-40% without explicit tuning
- Weather should create ~5-10% additional tension (more deaths, tighter margins)
- Run 200-sim baseline after implementation; report results
- Target: weather contributes to ~10-15% of all deaths (a meaningful but not dominant factor)
- If weather makes the game too hard, tier back (reduce modifiers, not remove features)

---

## Output Required

Write a **design doc** at `docs/weather-system-design.md` that includes:

1. **Executive summary** — What weather system does, in 3 sentences
2. **Weather states** — Complete list with season availability and probabilities
3. **Mechanical effects table** — Each weather state's effect on every game mechanic (travel, wear, food, morale, events, terrain)
4. **Weather transition logic** — Markov chain or deterministic approach, with diagram
5. **New source entries** — List of new `SOURCE_KEY` entries needed for weather text, with historical quotes
6. **New events list** — List of new weather events to add (ID, terrain pool, trigger condition, narrative summary)
7. **UI changes** — What the player sees, where, how (status bar, travel narrative, new overlays?)
8. **Engine API changes** — New methods or state fields needed on the game object
9. **Files changed** — Complete file-by-file change list
10. **Balance impact estimate** — Expected win rate change, which deaths increase/decrease
11. **Implementation order** — Sequenced steps (engine → events → UI → sources → build → sim)
12. **Verification plan** — How to test, what sim results to check

Then present the plan for approval before implementing.

---

## Key References

- **Engine:** `src/systems/engine.js` — `travelOneDay()`, `createGame()`, `availableSettlementActions()`
- **Calendar:** `src/core/calendar.js` — `seasonFor()`, `advanceDate()`, `daysInMonth()`
- **Constants:** `src/core/constants.js` — `CONSTANTS` object
- **Events:** `src/data/events.js` — `EVENT_POOLS`, `pickEventForTerrain()`
- **Sources:** `src/data/sources/index.js` — `SOURCES` object, `getSource()`
- **Nodes:** `src/data/nodes.js` — trail nodes with terrain types
- **Travel narrative:** `src/main.js` — `travelOneDay()`, `buildTravelLinesView()`, `TRAVEL_FRAGMENTS`
- **Sim:** `tests/simulate-entry.js` — weighted choice system, sim aggregation
- **AGENTS.md** — coding rules and pitfalls
- **HANDOFF.md** — full project state
