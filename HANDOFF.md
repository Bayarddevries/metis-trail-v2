# HANDOFF — Metis Trail V2

- Last updated: 2026-06-10
- Branch: main
- Latest commit: 362f7e4
- Remote: origin https://github.com/Bayarddevries/metis-trail-v2.git
- Working tree: clean

## Verified state

- https://bayarddevries.github.io/metis-trail-v2/ is serving the latest deployed build.
- Confirmed live asset version: `app.js?v=106`.
- Local built source version in `src/template.html`: `app.js?v=106`.
- GitHub Actions Pages deploy is working.
- Local test server: `http://100.108.183.33:8081/index.html`

## Commits in this session

- `362f7e4` — feat(ui): dice clarity, camp fix, party name, status bar, weather text, die restyle, ink-stamp, end-screen lb

## What changed in v83

### Dice Clarity & Camp Fix
- DC display changed from "DC 12" to "Need 12+" everywhere (event choices, camp dice, outcome text)
- Camp dice uses per-action DC thresholds from engine instead of hardcoded 10
- Camp dice shows "Need X+ ✓/✗" instead of raw total
- Camp roll display resets on each camp open (was persisting)
- Event choice buttons requiring items are disabled when player lacks the item

### End Screen / Leaderboard (#70)
- Removed auto-popup of leaderboard after game over
- Added "🏆 View Hall of Fame" button to end-screen overlay

### Party Name (#40)
- Intro text: "What is your party's name, traveller?" / "Enter party name..."
- Profanity filter: common slurs → asterisks; no-letter names → "Traveller"
- Leaderboard messages reference "party name"

### UI Polish
- #53: Die restyled as wooden block with grain texture
- #54: .event-stamp.success (green) and .event-stamp.fail (fail, opposite tilt) CSS
- #56: Status bar grouped into Journey + Cart clusters with brass separator
- #57: Weather display changed from emoji to period text ("Clear" not "☀ Clear")
- MB status bar symbol: "💎 0 MB" → "0 ₥" (mill sign)

## Known issues

- `gh-pages` branch is in inconsistent state from earlier manual deploy attempts and should not be used.
- `Bun` is the local build tool (`bun scripts/build.mjs`); npm is broken in this environment.
- Playwright browser launch is broken here due to a headless Chrome/DBus issue; use local manual verification for UI.
- `gh` auth token expired — cannot auto-close GitHub issues. Re-auth with `gh auth login`.

## Next recommended work

### Sprint A — Audio & Haptics (2 issues, ~130 lines)
- #59 — Haptics module (35 lines + 10 wiring)
- #60 — Web Audio ambient engine (90 lines + 15 wiring)
- Both are self-contained new files, no engine changes needed

### Sprint B — Content Expansion (new work, no issues yet)
- Phase 9 items from TODO: unauthored events, historical gaps, French dialogue, gossip trail
- Add second half of Carlton Trail nodes (#43)
- Reformat secondary sources to period voices (#42)

### Sprint C — Balance & Difficulty (design-needed)
- Win rate normalization (currently 66.5%, target 25-40%)
- Weather effects in travel engine (#61)
- Recommended action highlight in settlements (#62)

### Backlog
- #10 — Basic icons for items
- #6 — AI writing trend review (doc complete, partial implementation)
- #25 — Cultural review (doc complete, partial implementation)
