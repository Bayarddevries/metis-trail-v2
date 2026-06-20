**Last updated:** 2026-06-19
**Agent session:** v14.3 Balance Pass + Sim Update
**Working branch:** `main`
**Build:** `bun scripts/build.mjs` ✅ passing
**Dev server:** `http://localhost:8081` (dist/) | Tailscale: `http://100.108.183.33:8081`

---

## Current State Summary

### Phase Status
- **V13 UI Overhaul Sessions 1–4**: ✅ Complete
- **Sprint A (Critical Bugs)**: ✅ Complete
- **Sprint B (Content Quality)**: ✅ Complete
- **Sprint C (Remaining Bug Fixes)**: ✅ Complete
- **v14.3 Balance Pass**: ✅ Complete — sim updated, food economy tuned
- **v14.4 Trade Grouping**: ✅ Complete — grouped settlement action cards with radio sub-options

### Completed Fixes

#### Sprint A — Critical Bug Fixes
- **A1**: Event resolution — conditional ok*/bad* effects, itemBonus DC reduction
- **A2**: Settlement actions — rest added to metis + mission types
- **A3**: End-screen score breakdown — field name mismatches fixed (tradeGoods, foodScore, crewBonus)
- **A4**: CSS contrast — `--clr-muted` bumped, italics removed from non-quote elements
- **A5**: Settlement status pills — food/wear/morale/crew with color coding

#### Sprint B — Content Quality
- **B1**: Journal voice — SETTLEMENT_ARRIVAL templates fixed to 1st person
- **B2**: Source-quote alignment — already resolved (explicit getSource per event)
- **B3**: Hunt pelt text — getCampFlavorText now pelt-aware
- **B5**: Trail Intel description — desc field added to trade_gossip, passthrough in getSettlementActions
- **B6**: Hall of Fame offline fallback — already implemented

#### Sprint C — Remaining Bug Fixes
- **C4**: Starvation game over — `checkGameOver()` now called after starvation block in `travelOneDay()`. Game ends immediately when food hits 0.
- **C3**: Event effects display — `res.effects` (item give/consume, reputation, flags) now appended to outcome text in all 3 UI paths:
  - `buildEventChoiceOutcome()` — Continue button path
  - `revealDiceOutcome()` — dice roll animation path
  - Non-dice outcome path in `showEvent()`

#### v14.3 — Balance Pass
- **Sim harness updated**: Fixed `addFood(15)` before `confirmPreDeparture()`, fixed settlement action handling, updated to current engine API (`getSettlementActions`, `getEndgameScore` format)
- **DAILY_FOOD**: 0.6 → 0.65
- **Starting food**: 18 → 15
- **Sim results**: 61.5% win rate (200 runs), 38% starvation deaths, avg score 238

### Verified Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Travel / Camp / Events / Settlements | ✅ | Core loop solid |
| Settlement status pills | ✅ | Food/Wear/Morale/Crew with color coding |
| Settlement flavour text | ✅ | Readable color, no italic |
| End-screen breakdown | ✅ | Correct field names, values display properly |
| All settlement types have rest | ✅ | hbc, metis, nwmp, mission, trading |
| Hall of Fame offline fallback | ✅ | Graceful error message |
| Starvation game over | ✅ | Immediate at food=0 |
| Event item effects visible | ✅ | give/consume shown in outcome text |
| Trail Intel description | ✅ | Shows "reveals terrain and conditions ahead" |
| Journal voice | ✅ | 1st person in settlement arrivals |
| Hunt pelt text | ✅ | Pelt references when items dropped |
| Sim harness | ✅ | Updated to current engine API, 61.5% win rate |

---

## Known Issues (Not Yet Addressed)

- **Settlement result redundancy**: Result card shows both flavor text and mechanical outcome, which can overlap. Minor.
- **`badGive` not handled in engine**: Events have `badGive` fields (e.g., supply_cache bad path gives fewer items) but engine only processes `ch.give`, not `ch.badGive`. Pre-existing, out of scope.
- **Roll display**: Die face shows raw d20 roll (standard TTRPG convention). Outcome text shows total + modifiers. Working as intended.

---

## Architecture Notes for Next Agent

### File Structure (src/)
```
src/
├── core/
│   ├── constants.js      # Balance constants (DAILY_FOOD=0.65, hunt yields, barter rates)
│   ├── calendar.js       # Date/season advancement
│   ├── schema.js         # Data schemas
│   ├── seed.js           # RNG (makeRNG, d20)
│   └── weather.js        # Weather helpers
├── data/
│   ├── events.js         # Event definitions + terrain-based picking
│   ├── items.js          # Item definitions (wt field, not weight)
│   ├── nodes.js          # Trail nodes/settlements
│   ├── endings.js        # End-game narratives
│   └── sources/index.js  # Historical source citations
├── systems/
│   ├── engine.js         # Game logic: travel, camp, events, settlements, scoring
│   ├── events.js         # Event picking logic
│   ├── scoring.js        # Scoring system
│   └── travel.js         # Travel mechanics
├── ui/
│   ├── journalNarrative.js  # All narrative templates + reflection API
│   ├── renderer.js       # DOM rendering (status bar, map, journal)
│   ├── shell.js          # UI mounting
│   ├── theme.js          # CSS custom properties / theme
│   ├── icons.js          # Item icon mapping
│   ├── persistence.js    # Save/load
│   ├── haptics.js        # Haptic feedback
│   └── debug.js          # Debug panel
├── main.js               # UI handlers, overlay management
└── template.html         # HTML structure + CSS
```

### Key Engine APIs
- `game.travelOneDay()` — returns stepLog array; sets pendingSettlement/pendingEvent
- `game.campAction(type)` — returns `{effects, roll, rollTotal, critical, itemEffects}`
- `game.settlementAction(id)` — executes settlement action, clears pendingSettlement
- `game.getSettlementActions(type)` — returns action definitions for a settlement type
- `game.getEndgameScore()` — returns `{score, breakdown, tier, ...}`
- `game.chooseEventChoice(index)` — resolves event, returns stepLog
- `game.addFood(n)` — adds food to state
- `game.confirmPreDeparture()` — sets preDeparture=false, updates weight

### Build & Deploy
```bash
bun scripts/build.mjs          # builds to dist/, bumps ?v=N
python3 -m http.server 8081    # serve dist/
```

### Balance Constants (src/core/constants.js)
```
DAILY_FOOD: 0.65
Starting food: 15
CART_CAPACITY: 100
MAX_WEAR: 8
EVENT_CHANCE: 0.45
HUNT_RARITY_WEIGHTS: { food: 0.70, common: 0.25, rare: 0.05 }
```

### Sim Harness (tests/simulate-entry.js)
- Run: `bun tests/simulate-entry.js [count]` (default 200)
- Handles events, settlements, game-over correctly
- Weighted choice AI for camp actions, settlement actions, event choices
- Outputs balance report with win rate, tier distribution, death breakdown, node-by-node death map

---

## Quick Verification Checklist
Before handing off, confirm:
- [x] `bun scripts/build.mjs` passes
- [x] `http://100.108.183.33:8081` loads, map renders, travel works
- [x] Settlement overlay shows status pills (food/wear/morale/crew)
- [x] Settlement flavor text is readable and not italic
- [x] End screen score breakdown shows correct field names
- [x] All settlement types have a rest action
- [x] Hall of Fame shows offline fallback message
- [x] Sim harness runs and produces balance report
- [x] 0 JS errors in browser
