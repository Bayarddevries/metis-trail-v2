# HANDOFF — Metis Trail V2

- Last updated: 2026-06-10
- Branch: main
- Latest commit: 2579bc8
- Remote: origin https://github.com/Bayarddevries/metis-trail-v2.git
- Working tree: clean

## Verified state

- https://bayarddevries.github.io/metis-trail-v2/ serving latest build
- Local test server: http://100.108.183.33:8081/index.html
- Build command: `bun scripts/build.mjs`
- Current version: v119

## DESIGN DOCUMENT

**READ `DESIGN.md` BEFORE DOING ANY WORK.** It contains the complete redesign plan with all context.

## What's COMPLETE

- Shop screen (buy supplies with ₥, trade goods only start)
- Narrative journal (basic — travel logging)
- Cart overlay (detailed, unload buttons)
- Audio module removed
- Hunt/repair bug fixed
- Dice clarity ("Need X+" instead of "DC X")
- Party name + profanity filter
- Status bar grouping
- Weather text (no emoji)
- Lined paper simplified
- Settlement rest fixed
- **Camp action cards with cost/risk/flavor**
- **Critical failures on roll 1** (extra consequences per action)
- **Journal logging for events, camp actions, settlements**
- **Hunt gives trade goods (pelts/hides) not food**

## What's NEXT — Sprint 3: Settlements & Economy

1. **Settlement Overlay Redesign** — Type-specific overlays (HBC, Métis, NWMP, Mission) with unique action cards
2. **HBC Fort Actions** — Trade goods→₥ (best rates), buy supplies, rest, trail intel
3. **Métis Camp Actions** — Trade gossip, recruit crew, dance, share food, craft finished hides
4. **NWMP Post Actions** — Pay fines, get permits, report for duty, buy ammo, rest
5. **Mission Actions** — Heal crew, free rest+blessing, get blessing, limited trade
6. **Settlement Data** — settlementType, name, description, priceMultiplier per node
7. **Hunting Events** — Terrain-specific events (bison/beaver/elk/deer) with DCs and trade good rewards
8. **Price Variation** — Settlement × category × trail position multipliers
9. **Endgame Scoring Screen** — Breakdown with tiers, narrative endings, Hall of Fame button
10. **Engine API** — getSettlementActions, settlementAction, getTradeEstimate, getEndgameScore, getSettlementData

## Sprint 4: Visual Unification (After Sprint 3)

1. **Color Palette** — Migrate to CSS custom properties via theme.js
2. **Overlay Unification** — Shared .overlay-panel base class, consistent headers/buttons
3. **Status Bar Redesign** — Two clusters with brass separator
4. **Map Styling** — Sepia tiles, dotted trail, typed settlement markers, cart SVG icon
5. **Button Polish** — Primary/secondary/ghost hierarchy, 44px touch targets
6. **Journal Polish** — Collapse chevrons, consistent dice/mechanical styling
7. **Dice Consistency** — Wooden block, settle animation, ink-stamp results

## Key Files

- `src/main.js` — Main game logic, UI handlers, shop, journal
- `src/systems/engine.js` — Game engine, camp actions, settlement actions
- `src/template.html` — HTML structure, CSS
- `src/ui/renderer.js` — Journal logging, status bar, map
- `src/data/events.js` — Event definitions
- `src/data/nodes.js` — Trail nodes, settlement types
- `DESIGN.md` — Full design document

## Conventions

- Build: `bun scripts/build.mjs`
- Commit: conventional commits (feat/fix/chore/docs/balance)
- Do NOT edit `dist/` files directly
- Sync `src/template.html` version with `dist/index.html` after each build
- Update DESIGN.md as work progresses
- Update HANDOFF.md with each session

## Known Issues

- Cart shows empty on returning players (old save data) — clear localStorage
- Journal only logs travel, not events/camp/settlements yet
- Camp actions still use old grouped layout
