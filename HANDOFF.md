# HANDOFF — Metis Trail V2

- Last updated: 2026-06-10
- Branch: main
- Latest commit: 5662be0
- Remote: origin https://github.com/Bayarddevries/metis-trail-v2.git
- Working tree: clean (DESIGN.md uncommitted)

## Verified state

- https://bayarddevries.github.io/metis-trail-v2/ serving latest build
- Local test server: http://100.108.183.33:8081/index.html
- Build command: `bun scripts/build.mjs`
- Audio module DELETED (was causing console errors)

## DESIGN DOCUMENT

**READ `DESIGN.md` BEFORE DOING ANY WORK.** It contains the complete redesign plan.
All future work should follow that document. Update it as decisions are made.

## What was done today

### v83 — Dice clarity, camp fix, party name, UI polish
- DC display: "DC 12" → "Need 12+" everywhere
- Camp dice: per-action DC thresholds, reset on reopen
- End-screen: no auto-popup, "View Hall of Fame" button
- Party name + profanity filter
- Status bar: Journey + Cart clusters
- Weather: emoji → text
- Die: wooden block CSS
- Ink-stamp: success/fail CSS
- MB symbol: 💎 → ₥

### v84 — Haptics, audio, sources, icons
- Haptics module created and wired
- Audio module created (then DELETED — too fragile)
- Secondary sources rewritten as period voices
- SVG icons created (then reverted to emoji — SVG too small)

### v85 — Bug fixes
- Audio removed entirely
- Cart overlay: always shows unload buttons, detailed descriptions
- Category hints: more informative ("1 food/day keeps the crew alive...")
- Lined paper: simplified CSS
- Hunt/repair fix: use game.getCart() instead of state.cart (was undefined)

## Known bugs (from GitHub issues)

- #71 — Final score shows decimal points
- #72 — End-game buttons different sizes
- #73 — Hall of Fame doesn't load
- Hunt/repair "missing items" — FIXED in v85 (state.cart was undefined)

## Next work (from DESIGN.md Sprint 1)

1. Fix #71, #72, #73
2. Build starting shop screen
3. Build narrative journal
4. Unify visual style

## Files modified recently

- `src/main.js` — main game logic, UI handlers
- `src/template.html` — HTML structure, CSS
- `src/ui/haptics.js` — haptic feedback (keep)
- `src/ui/audio.js` — DELETED
- `src/ui/icons.js` — emoji icons (keep)
- `src/ui/renderer.js` — status bar, map rendering
- `src/data/sources/index.js` — rewritten period voices
- `src/data/items.js` — icon fields removed
- `DESIGN.md` — NEW, comprehensive redesign plan

## Conventions

- Build: `bun scripts/build.mjs`
- Commit: conventional commits (feat/fix/chore/docs/balance)
- Do NOT edit `dist/` files directly
- Sync `src/template.html` version with `dist/index.html` after each build
- Update DESIGN.md as work progresses
- Update HANDOFF.md with each session
