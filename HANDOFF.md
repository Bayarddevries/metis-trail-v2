# HANDOFF — Metis Trail V2

- Last updated: 2026-06-10
- Branch: main
- Latest commit: aec044c
- Remote: origin https://github.com/Bayarddevries/metis-trail-v2.git
- Working tree: clean

## Verified state

- https://bayarddevries.github.io/metis-trail-v2/ serving latest build
- Local test server: http://100.108.183.33:8081/index.html
- Build command: `bun scripts/build.mjs`
- Current version: v124

## DESIGN DOCUMENT

**READ `DESIGN.md` BEFORE DOING ANY WORK.** It contains the complete redesign plan with all context (sections 12-14 for Sprint 3-5 details).

## What's COMPLETE (Sprint 1 & 2)

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
- **Camp action cards with cost/risk/flavor** (7 actions + Push On)
- **Critical failures on roll 1** (extra consequences per action type)
- **Journal logging for events, camp actions, settlements**
- **Hunt gives trade goods (pelts/hides) not food**

## What's NEXT — Sprint 3: Settlements & Economy (START HERE)

### Priority Order

1. **Settlement Overlay Redesign** (`src/main.js`, `src/template.html`)
   - Replace generic settlement overlay with type-specific overlays
   - Action cards: cost (₥/food/items), risk, flavor text, button — same pattern as camp
   - Settlement header: name, type badge, distance from Fort Garry, description

2. **HBC Fort Actions** (`src/systems/engine.js`, `src/data/nodes.js`)
   - Trade Goods → ₥ (best rates), Buy Supplies, Rest, Get Trail Intel
   - Price multiplier: 1.0x base

3. **Métis Camp Actions**
   - Trade Gossip, Recruit Crew, Dance, Share Food, Craft Finished Hides
   - Price multiplier: 0.9x buy, 1.1x sell trade goods

4. **NWMP Post Actions**
   - Pay Fines, Get Permits, Report for Duty, Buy Ammo, Rest
   - Price multiplier: 1.2x supplies, 0.8x ammo

5. **Mission Actions**
   - Heal Crew, Free Rest+Blessing, Get Blessing, Limited Trade
   - Price multiplier: 0.8x buy, 1.5x sell

6. **Settlement Data** (`src/data/nodes.js`)
   - Add `settlementType`, `settlementName`, `settlementDescription`, `priceMultiplier` per node
   - Carlton Trail: Fort Garry=HBC, St. François Xavier=Métis, Fort Ellice=HBC, Fort Pelly=HBC, Fort Carlton=HBC/NWMP, Fort Battleford=NWMP, Fort Edmonton=HBC

7. **Hunting Events** (`src/data/events.js`)
   - Terrain-specific triggered by `campAction('hunt')`
   - Plains (Bison): DC 12, 1-2 Bison Hide (1.25 ₥)
   - River Valley (Beaver): DC 14, 1 Beaver Pelt (3.0 ₥)
   - Uplands (Elk): DC 15, 1 Elk Hide (2.5 ₥)
   - Wooded (Deer): DC 13, 1 Deer Hide (1.8 ₥)
   - Critical fail (roll 1): lose ammo + morale -2

8. **Price Variation by Location**
   - Formula: `basePrice * settlementMultiplier * categoryMultiplier * (1 + distanceFactor * 0.15)`

9. **Endgame Scoring Screen** (`src/main.js`, `src/template.html`)
   - Base 500 + ₥×80 + Food×12 (max 300) + Crew + Days(-8) + Wear(-40)
   - Tiers: <500 Barely Survived, 500-1200 Solid Profit, 1200+ Legendary Haul
   - Narrative ending per tier, Hall of Fame button

10. **Engine API Additions** (`src/systems/engine.js`)
    - `getSettlementActions(settlementType)`
    - `settlementAction(type, params)`
    - `getTradeEstimate(itemId, quantity, settlementType)`
    - `getEndgameScore()`
    - `getSettlementData(nodeId)`

## Sprint 4: Visual Unification (After Sprint 3)
- Color palette via CSS custom properties in theme.js
- Unified `.overlay-panel` base class for all 7 overlays
- Status bar: two clusters with brass separator
- Map: sepia, dotted trail, typed settlement markers, cart SVG
- Button hierarchy: primary/secondary/ghost, 44px touch targets
- Journal: collapse chevrons, dice/mechanical consistency
- Dice: wooden block, settle animation, ink-stamp results

## Key Files

- `src/main.js` — Main game logic, UI handlers, shop, journal, camp, settlements
- `src/systems/engine.js` — Game engine, camp actions, settlement actions, trade
- `src/template.html` — HTML structure, CSS
- `src/ui/renderer.js` — Journal logging, status bar, map, theme
- `src/data/events.js` — Event definitions
- `src/data/nodes.js` — Trail nodes, settlement types
- `src/data/items.js` — Item definitions (wt, prices, categories)
- `DESIGN.md` — Full design document (source of truth)
- `HANDOFF.md` — This file

## Conventions

- Build: `bun scripts/build.mjs`
- Commit: conventional commits (feat/fix/chore/docs/balance)
- Do NOT edit `dist/` files directly
- Sync `src/template.html` version with `dist/index.html` after each build
- Update DESIGN.md as work progresses
- Update HANDOFF.md with each session

## Known Issues

- Cart shows empty on returning players (old save data) — clear localStorage
- Audio 404 in browser cache — users must hard refresh (Ctrl+Shift+R)
- Journal entry density — consider pagination or compact mode for long games

## GitHub Issues to Reference

Always load at session start: `gh issue list --repo Bayarddevries/metis-trail-v2 --state open --limit 50`

Key open issues:
- #70 — High score menu pops up and erases end-game score details
- #41 — DC clarity (now "Need X+" but verify everywhere)
- #10 — Basic icons / map markers
- #26 — Location/node markers on map
- #25 — Cultural review

## Test Server

Running on Tailscale: `http://100.108.183.33:8081/index.html`

Start server: `cd /home/bayarddevries/metis-trail-v2-repo && npx serve dist -p 8081 -l 0.0.0.0`

## Agent Prompt for Sprint 3

```
You are working on Metis Trail V2, a historical Métis trail simulation game. Repo: /home/bayarddevries/metis-trail-v2-repo

FIRST ACTIONS:
1. Read HANDOFF.md for current state
2. Read DESIGN.md sections 12-14 (Sprint 3-5 details)
3. Run git log --oneline -10 to see recent commits
4. Run git status to check for uncommitted changes

YOUR TASK: Begin Sprint 3 — Settlements & Economy

Start with Section 3.1: Settlement Overlay Redesign
- Replace generic #settlement-overlay with type-specific overlays in src/main.js showSettlement()
- Each settlement type (hbc, metis, nwmp, mission) shows unique action cards
- Action cards follow same pattern as camp: name, cost, risk, flavor, button
- Settlement header: name, type badge, distance from Fort Garry, description

Then implement HBC Fort Actions (3.2) and engine API additions (3.10) in parallel.
```
