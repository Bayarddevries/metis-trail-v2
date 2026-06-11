# HANDOFF — Métis Trail V2

**Last Updated:** Sprint 3 & 4 Complete
**Repo:** `/home/bayarddevries/metis-trail-v2-repo`
**Test URL:** http://100.108.183.33:8081/index.html (v124+)
**Build:** `bun scripts/build.mjs` ✅

---

## Current State: Sprint 3 (Settlements & Economy) + Sprint 4 (Visual Unification) COMPLETE

### What Works
- **Pre-departure shop** → buy supplies with trade goods (₥)
- **Travel** → day-by-day, food/wear/morale/weather tracked
- **Settlement overlays** → 4 types (HBC, Métis, NWMP, Mission) with unique action cards
- **Continue West** → dismisses settlement, advances trail
- **Events** → choice-based, dice-rolled, logged to journal
- **Status bar** → two-cluster (Journey | Cart), 36px, brass separator
- **Map** → sepia tiles, dotted brass trail, type-colored settlement markers
- **Journal** → parchment, brass left border, chevron collapse/expand
- **Color palette** → Green `#0d2b0d` + Parchment `#f5e6c8` (period map aesthetic)

### Key Files
| File | Purpose |
|------|---------|
| `src/main.js` | UI controllers: `showSettlement()`, `showShop()`, `showEvent()`, render |
| `src/systems/engine.js` | Game logic: settlement actions, Engine API, travel, events |
| `src/data/nodes.js` | 15 trail nodes with settlement types & price multipliers |
| `src/ui/theme.js` | CSS custom properties — **period map palette (green + parchment)** |
| `src/template.html` | All markup + unified CSS using `--clr-ink-panel` / `--clr-ink-on-dark` |
| `src/ui/renderer.js` | Status bar, map, journal rendering |

### Color Palette (source of truth)
- `--clr-bg: #0d2b0d` — dark green body / status bar / map
- `--clr-panel-bg: #f5e6c8` — parchment overlays (shop, settlement, camp, event, journal)
- `--clr-ink-on-dark: #f5e6c8` — text on dark green (labels, status values)
- `--clr-ink-on-light: #1a3a1a` — text on parchment (headings, body copy)
- `--clr-accent: #c8a81a` — gold / brass borders, buttons, highlights
- **Hard rule:** no border-radius, no box-shadow, flat brass look only

### Verified Flows
```
Intro → Begin Journey → Pre-departure Shop
  → Confirm Outfit → Travel Day 1 → St. Boniface (Mission) overlay
  → Continue West → Travel Day 2 → St. Norbert (Métis Camp) overlay
  → Continue West → Travel Day 3+ → Event/Mission Garden → Settlement
  → ... → Fort Edmonton → Endgame scoring
```

### Known Issues (minor)
1. Browser tool click on shop confirm button imperfect — real user clicks work fine
2. Status bar weather text uses lowercase in state (`clear/overcast/storm`)
3. Pre-departure shop overlay can re-show on re-render if `preDeparture` gets re-true

---

## Quick Commands
```bash
# Build
bun scripts/build.mjs

# Test server
npx serve dist -l 8081

# Git
git add -A && git commit -m "feat: Sprint 3+4 — Settlements, Economy, Visual Unification"
```

## Next Sprint Options
- River crossing mechanics
- Weather event system (storm/blizzard/heat)
- Crew injury/illness + settlement healing
- Journal chevron polish / mobile touch audit
- More event cards + endgame variant narratives
