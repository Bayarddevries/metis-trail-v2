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

## What's NEXT — Sprint 2 Remaining

1. **Camp action cards** — Redesign from grouped layout to individual cards showing: name, cost, risk, flavor text, button
2. **Critical failures** — Roll 1 on camp actions triggers extra consequences (see DESIGN.md section 7)
3. **Journal logging** — Add event outcomes, camp actions, and settlement visits to the journal (currently only logs travel)

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
