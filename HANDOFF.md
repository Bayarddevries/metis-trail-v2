# HANDOFF — Metis Trail V2

**Last updated:** 2026-06-19
**Agent session:** Sprint A/B — Post-V13 Bug Fixes + Content Quality
**Working branch:** `main`
**Build:** `bun scripts/build.mjs` ✅ passing
**Dev server:** `http://localhost:8081` (dist/) | Tailscale: `http://100.108.183.33:8081`

---

## Current State Summary

### Phase Status
- **V13 UI Overhaul Sessions 1–4**: ✅ Complete
- **Sprint A (Critical Bugs)**: ✅ Complete — all items verified
- **Sprint B (Content Quality)**: ⏳ Pending — B1, B2, B3, B5 not started

### Completed Fixes (Sprint A)

#### A1: Event Resolution System ✅
- Conditional food/morale/crew on success/failure (ok*/bad* fields)
- ItemBonus DC reduction from items
- okWear/badWear conditional application
- Effects array populated for give/consume/itemBonus

#### A2: Settlement Actions ✅
- Added `rest` action to `metis` settlement type
- Added `rest` action to `mission` settlement type
- All settlement types now have a plain rest option
- Settlement flavour text: removed italic, bumped `--clr-muted` for readability

#### A3: End Screen Score Breakdown ✅
- Fixed `breakdown.tradeBonus` → `breakdown.tradeGoods` field name mismatch
- "Play Again" button already existed in template

#### A4: CSS Dark-on-Dark Text ✅
- `--clr-muted` bumped from `#8a7a60` → `#b8a890` in theme.js + template.html
- Removed `font-style: italic` from non-quote elements:
  - `.settlement-action-card-flavor`, `.camp-card-flavor`, `.camp-action-desc`
  - `.camp-sub`, `.briefing-hint`, `.pd-category-hint`
  - `.settlement-desc`, `.settlement-distance`, `.settlement-craft-hint`
- Kept italic on actual quotes: `.src-quote`, `.src-context`, `.outcome-flavor`

#### A5: Settlement Status Display ✅
- Added food/wear/morale/crew pills to settlement overlay header
- Color-coded: red for danger (food ≤ 5, wear ≥ 4, crew exhausted), yellow for warning (crew tired)

#### B6: Hall of Fame Offline Fallback ✅
- Already implemented: `.catch()` handlers show "Leaderboard unavailable — playing offline"

### Verified Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Travel / Camp / Events / Settlements | ✅ | Core loop solid |
| Settlement status pills | ✅ | Food/Wear/Morale/Crew with color coding |
| Settlement flavour text | ✅ | Readable color, no italic |
| End-score breakdown | ✅ | Field names match engine |
| All settlement types have rest | ✅ | hbc, metis, nwmp, mission, trading |
| Hall of Fame offline fallback | ✅ | Graceful error message |

---

## Sprint B: Content Quality + Balance (Remaining)

### B1: Journal Narrative Voice (Audit) — ⏳ Pending
- Convert 3rd person lines ("The cart rolled...", "The crew woke...") to 1st person ("We rolled...", "I woke...")
- Audit all ~730 lines of `journalNarrative.js`

### B2: Source-Quote Alignment — ⏳ Pending
- Quotes randomly assigned and may not match event content
- Add thematic tags to sources and events, match on tag

### B3: Hunt Text/Outcome Mismatch — ⏳ Pending
- Hunt flavour text says "Tracked a bull bison..." but item drop is random
- Either make drops deterministic by terrain or add multiple flavour variants

### B5: Trail Intel Clarity — ⏳ Pending
- Gossip action shows "Trail Intel" but doesn't explain what it does

---

## Known Issues (Not Yet Addressed)

- **Food = 0 during travel doesn't trigger game over**: `travelOneDay()` applies starvation penalties but doesn't call `checkGameOver()` after food hits 0. Only triggers on next event/camp.
- **Fort trade buttons**: `trade_furs_supplies` still generates 3 separate buttons (one per option). Needs UI grouping.
- **Settlement result redundancy**: Result card shows both flavor text and mechanical outcome, which can overlap.

---

## Architecture Notes for Next Agent

### File Structure (src/)
```
src/
├── core/
│   ├── constants.js      # Balance constants (DAILY_FOOD=0.6, hunt yields, barter rates)
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
- `game.getEndgameScore()` — returns `{score, breakdown, tier, tradeGoodsCount, ...}`
- `game.chooseEventChoice(index)` — resolves event, returns stepLog

### Build & Deploy
```bash
bun scripts/build.mjs          # builds to dist/, bumps ?v=N
python3 -m http.server 8081    # serve dist/
```

### Balance Constants (src/core/constants.js)
```
DAILY_FOOD: 0.6
CART_CAPACITY: 100
MAX_WEAR: 8
EVENT_CHANCE: 0.45
HUNT_RARITY_WEIGHTS: { food: 0.70, common: 0.25, rare: 0.05 }
```

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
- [ ] Journal narrative voice audit (B1)
- [ ] Source-quote alignment (B2)
- [ ] Hunt text/outcome match (B3)
- [ ] Trail Intel description (B5)
