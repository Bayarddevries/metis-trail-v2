# HANDOFF — Metis Trail V2

**Last updated:** 2026-06-19
**Agent session:** Sprint A/B — Post-V13 Bug Fixes + Content Quality
**Working branch:** `main`
**Build:** `bun scripts/build.mjs` ✅ passing
**Dev server:** `http://localhost:8081` (dist/) | Tailscale: `http://100.108.183.33:8081`

---

## Current State Summary

### Phase Status
- **V13 UI Overhaul Sessions 1–4**: ✅ Complete — layout shell, narrative wiring, mobile responsive, polish/edge cases
- **V13 Session 5 (Balance Pass)**: ⏳ Deferred — superseded by Sprint A/B bug fix plan
- **Sprint A (Critical Bugs)**: 🔄 In Progress — started 2026-06-19
- **Sprint B (Content Quality)**: ⏳ Pending — starts after Sprint A

### Verified Working Features
| Feature | Status | Notes |
|---------|--------|-------|
| Travel / Camp / Events / Settlements | ✅ | Core loop solid |
| Hunting → physical items (terrain-specific) | ✅ | Hides, pemmican, pelts with weight |
| Settlement actions (trade, rest, heal, craft) | ✅ | 8 starter items with 2+ uses each |
| Save/Load + auto-save | ✅ | Full persistence |
| Weather sensory prose (rain/snow variants) | ✅ | Item-aware (Tarp/Blanket/Firewood) |
| Journal: first-person reflections | ✅ | Travel/camp/event/settlement templates |
| Event choice outcomes (weather/item-aware) | ✅ | Dice + non-dice paths |
| Settlement journey narratives | ✅ | Arrival prose with item context |
| Pre-departure: 18 food + starter kit on confirm | ✅ | Engine starts at 0 food |
| V13 layout: status bar, contextual buttons, journal | ✅ | Mobile responsive, overlay exclusivity |

### Recently Fixed (Session 4)
- **Camp overlay not staying open** — early return in Travel West click handler when `travelOneDay()` returns truthy
- **Pre-departure "Pick This" not selecting** — variable name mismatch `name` vs `name3` in handler closure
- Commits: `854e187` (bug fixes), `4d61154` (Session 4 docs)

---

## Sprint A: Critical Bug Fixes + Core Loop Integrity

**Goal:** Fix broken mechanics and missing feedback that make the game unplayable or confusing.

### A1: Event Resolution System (Deep Fix) — ⏳ Pending
The `resolveChoice` engine function has systemic issues:
- **Food/morale/crew effects apply on both success AND failure** — event data defines `badFood`, `badMorale`, `badWear`, `okFood`, `okMorale`, `okWear` but the engine ignores them
- **Item give/consumes not reflected in outcome text** — `ch.give` and `ch.consumesItem` push to `result.effects` but the event UI only shows `result.text`
- **Roll display shows raw die, not total** — "Rolled 10 — need 8+ — Failure" is confusing when modifiers exist
- **ItemBonus (DC reduction from items) not implemented** — events have `itemBonus: { name: 'Ammunition Belt', dcBonus: 3 }` but `resolveChoice` never checks for items when calculating DC

### A2: Settlement Action System (Deep Fix) — ⏳ Pending
- **Cost/risk display same value** — `getSettlementActionsByType` sets both `cost` and `risk` to `giveDesc` for `giveOptions` actions
- **No rest option in some settlements** — `metis` and `trading` have no plain rest
- **Fort trade too many buttons** — `trade_furs_supplies` generates one button per option
- **Settlement flavour text dark+italic** — `.settlement-action-card-flavor` uses `color: var(--clr-muted)` + `font-style: italic`
- **Settlement result redundant with flavour** — result div and flavour card show overlapping info

### A3: End Screen Score Breakdown — ⏳ Pending
- **Field name mismatches** — `breakdown.tradeBonus` vs engine's `breakdown.tradeGoods`, `foodBonus` vs `foodScore`, `crewCondition` vs `crewBonus`
- **No new game option** — Add "New Game" button to end screen

### A4: CSS Dark-on-Dark Text (Systemic) — ⏳ Pending
- `--clr-muted` (#8a7a60) too dark on panel backgrounds — bump to `#b8a890`
- **Italics audit** — Remove italics from all non-quote text

### A5: Settlement Arrival Status Display — ⏳ Pending
- Add food/wear/morale/crew pills to settlement overlay header, matching camp overlay pattern

---

## Sprint B: Content Quality + Balance

**Goal:** Fix narrative inconsistencies, improve feedback clarity, and tune difficulty.

### B1: Journal Narrative Voice (Audit) — ⏳ Pending
- Convert 3rd person lines ("The cart rolled...", "The crew woke...") to 1st person ("We rolled...", "I woke...")
- Audit all ~730 lines of `journalNarrative.js`

### B2: Source-Quote Alignment — ⏳ Pending
- Quotes randomly assigned and may not match event content
- Add thematic tags to sources and events, match on tag

### B3: Hunt Text/Outcome Mismatch — ⏳ Pending
- Hunt flavour text says "Tracked a bull bison..." but item drop is random
- Either make drops deterministic by terrain or add multiple flavour variants

### B4: Item Integration in Events — ⏳ Pending
- **Mosquito event: tarp should reduce DC** — `itemBonus` exists in data but isn't implemented
- **NWMP delay should cost food/wear** — Time penalties without resource cost are invisible

### B5: Trail Intel Clarity — ⏳ Pending
- Gossip action shows "Trail Intel" but doesn't explain what it does

### B6: Hall of Fame — ⏳ Pending
- Firebase-dependent, only works when properly hosted
- Add fallback message: "Hall of Fame requires an internet connection"

---

## Known Issues (Not Yet in Sprint)

- **#43**: Settlement re-render — `settlementAction()` must call `window.__METIS_RENDER__()`
- **#44**: Template hardcodes `FOOD 30` — intended initial is 0 until pre-departure confirm
- **#73**: Hall of Fame endpoint / UI (covered in B6)
- **#74**: Duplicate `heal_crew` action in settlement (covered in A2)
- **#75**: Result panel duplicates event flavor text (covered in A2)
- **#76**: Duplicate Continue West/✕ buttons at St. Norbert (covered in A2)
- **#77**: "New Game" button visible during play (covered in A3)
- **#78**: Camp button missing in some states
- **#79**: End screen trade goods count (covered in A3)

---

## Architecture Notes for Next Agent

### File Structure (src/)
```
src/
├── core/
│   ├── constants.js      # Balance constants (DAILY_FOOD=0.6, hunt yields, barter rates)
│   └── engine.js         # Game logic: travel, camp, events, settlements, scoring
├── data/
│   ├── events.js         # 88 events, 264 choices
│   ├── items.js          # 8 starter items (wt field, not weight)
│   ├── settlements.js    # 4 settlement types, actions, barter rates
│   └── sources/index.js  # Historical source citations (getSource('KEY'))
├── systems/
│   └── engine.js         # (re-exported from core)
├── ui/
│   ├── journalNarrative.js  # All narrative templates + reflection API
│   └── renderer.js       # DOM rendering
├── main.js               # UI handlers, journal/result integration
└── template.html         # HTML structure — patch only, never overwrite
```

### Key Engine APIs (must exist before UI calls)
- `game.travelOneDay()` — returns early if `pendingSettlement` set
- `game.campAction(type)` — returns `{itemEffects: [...]}`
- `game.executeSettlementAction(id)` — returns `{itemEffects: [...]}`
- `game.getSettlementActions()` — IDs must match `pickSettlementAction()` in sim
- `game.hunt(terrain)` — terrain-specific yields
- `game.getEndgameScore()` — tradeGoodsCount for end screen
- `game.resolveChoice(event, choiceIndex)` — resolves event choice, returns `{success, roll, total, dc, effects, text}`

### Build & Deploy
```bash
bun scripts/build.mjs          # builds to dist/, bumps ?v=N in dist/index.html
# MANUALLY sync src/template.html version after each build
python3 -m http.server 8081    # serve dist/
```

### Simulation Harness
`tests/simulate-entry.js` — 200+ runs, randomized choices, balance report
- `pickSettlementAction()` **must mirror** `getSettlementActions()` IDs exactly
- Stale cart reference bug: always call `game.totalWeight()` and `game.getCart()` fresh in loops

### Balance Constants (src/core/constants.js)
```javascript
DAILY_FOOD: 0.6
CAMP_BASE_FOOD: 0.5
HUNT_YIELDS: {
  plains: { min: 3, max: 5 },
  river: { min: 2, max: 4 },
  wooded: { min: 2, max: 3 },
  uplands: { min: 2, max: 3 }
}
BARTER_RATES: {
  hbc: 6, metis: 7, mission: 4, trading: 10
}
MB_WIN_THRESHOLD: 1000
```

### Item Integration Rules
- Every starter item has **2+ mechanical uses** with explicit feedback
- Usage visible in **journal text** AND **result panel**
- Item fields: `wt` (not `weight`), `icon`, `type`
- Camp bonuses: Tarp +2 rest (wet), Blanket +3 rest (snow), Firewood +2 rest (snow)
- Settlement rest/heal: Tarp +5 Morale, Blanket +8, Firewood +5 (cold/wet)

### Narrative Standards
- **Cultural review required** for all new content
- Source quotes from `src/data/sources/index.js` via `getSource('KEY')`
- First-person journal voice: "We met..." not "Event:"
- Weather/item-aware prose variants for travel, camp, events, settlements
- Font stack: Cormorant (body), Infill (titles)
- Map: darker Leaflet tile filter

---

## Critical Path
1. **A1 (Event Resolution)** — highest risk, touches engine core, affects all events
2. **A2 (Settlement Actions)** — data + rendering changes
3. **A3 (End Screen)** — field name fixes
4. **A4 (CSS)** — find/replace
5. **A5 (Settlement Status)** — copy camp pattern
6. **B1–B6** — content quality, depends on Sprint A structural fixes

## Estimated Complexity
- **A1**: High — touches engine core, affects all 864 lines of events
- **A2**: Medium — data + rendering changes
- **A3**: Low — field name fixes
- **A4**: Low — find/replace
- **A5**: Low — copy camp pattern
- **B1**: Medium — 730 lines to audit
- **B2–B6**: Low-Medium each

---

## Quick Verification Checklist
Before handing off, confirm:
- [ ] `bun scripts/build.mjs` passes
- [ ] `http://localhost:8081` loads, map renders, travel works
- [ ] Settlement overlay appears, Continue West clears pendingSettlement
- [ ] Journal entries expand by default, collapse/expand by day works
- [ ] Event choices show weather/item effects in result panel
- [ ] Simulation runs without error (200+ iterations)
- [ ] CHANGELOG.md updated with dated entry
- [ ] git status clean (commit changes)
