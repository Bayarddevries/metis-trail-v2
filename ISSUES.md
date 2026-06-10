# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

**Note:** GitHub issues are the source of truth. This file is for local-only items and session notes.

---

## Active (Local Only)

### 42. Playwright click resolution blocked
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve. Blocks browser verification of UI changes.
- Workaround: Verify via source inspection and local server checks instead of automated clicks.

---

## Resolved

### #49 — JSDoc comments on exported engine.js functions
- Status: Done (v71)
- Note: JSDoc comments added to all public engine methods.

### #48 — Standardize conventional commit messages
- Status: Done (v71)
- Note: Commit conventions added to AGENTS.md.

### #47 — mountDebugUI behind ?debug=1
- Status: Done (v71)

### #46 — Save/load validation and schema version
- Status: Done (v81)

### #45 — Unit tests for calendar and PRNG
- Status: Done (v81)

### #44 — Pre-departure cart packing overlay
- Status: Done (v80)

### #43 — Duplicate stat headings in status bar
- Status: Done (v50/v61)

### #42 — Playwright click resolution blocked (local)
- Status: Open
- Summary: Playwright cannot resolve button text/ref/@id click selectors. Workaround: manual source inspection + local server checks.

### #41 — Remove dead code / convention cleanup
- Status: Done (v81)

### #40 — Trace invisible render failures after engine changes
- Status: Done (v80)

### #39 — More actions toggle empty states
- Status: Done (v67)

### #38 — Camp events need dice rolls and more flavor text
- Status: Done (v67)

### #37 — Gabriel Dumont cannot be at all ferry crossings
- Status: Done (v50)

### #36 — Day 1 first travel resolves to settlement overlay
- Status: Done (v50)

### #35 — Reduce action-dense screens by grouping secondary actions
- Status: Done (v54)

### #34 — Audit and consolidate primary/secondary action verbs
- Status: Done (v53)

### #33 — Crafting discoverability in settlement UI
- Status: Done (v56)

### #32 — Overlay sequence broken — pre-departure shows before intro
- Status: Done (v44)

### #31 — Prune redundant settlement/camp actions
- Status: Done (v52)

### #30 — Food showing in decimal places
- Status: Done (v50)

### #29 — Dice timing: pass/fail pill shown before settle
- Status: Done (v50/v51)

### #27 — Duplicate texture/dep files
- Status: Done (v69)

### #26 — Add location/node markers on map
- Status: Done (v55)

### #25 — Cultural/peer review (women/children presence)
- Status: Done (v70)

### #12 — Highscore/leaderboard
- Status: Done (v69)

### #13 — Weather system
- Status: Done (v65)

---

## External (docs completed 2026-06-09, implementation in progress)

### #25 — Cultural/peer review
- Status: Review doc complete, implementation in progress
- Deliverable: [docs/cultural-review.md](docs/cultural-review.md)
- Implemented in v70: Women/children presence (4 new events, 4 new sources, camp action, settlement descriptions, Batoche foreshadowing, dog reference)
- Remaining: Secondary source reformatting → tracked as GitHub #42

### #6 — AI writing trend review
- Status: Review doc complete, implementation done
- Deliverable: [docs/writing-review.md](docs/writing-review.md)
- Implemented in v70: All 16 rewrite recommendations applied (12 events, 4 endings, travel fragments, camp flavor, intro text, source context UI)

---

## Tracked on GitHub (open)

### #42 — Reformat secondary sources to period voices
- Labels: enhancement
- MMF_COMMUNITIES, CARLTON_TRAIL, NWMP_HISTORY read as Wikipedia; replace with period excerpts or reformat as historical notes

### #43 — Add second half of Carlton Trail nodes
- Labels: enhancement
- Western portion of trail not yet implemented

### #44 — Pre-departure cart packing overlay
- Labels: enhancement
- Player configures starting cart before journey; blocked by overlay sequence bug
- Note: API exists; UI exists; overlay sequence fixed in v44.

### #45 — Unit tests for calendar and PRNG
- Labels: enhancement
- Test date advancement, season changes, PRNG reproducibility

### #46 — Save/load validation and schema version
- Labels: bug
- Add schema version to saves, validate on load, reject/migrate corrupted saves

### #47 — mountDebugUI behind ?debug=1
- Labels: enhancement
- Debug panel should only mount with URL flag

### #48 — Standardize conventional commit messages
- Labels: documentation
- Establish commit message conventions in AGENTS.md

### #49 — Add doc comments to exported engine.js functions
- Labels: documentation
- JSDoc/JS comments on all public engine methods for reliability

### #71 — End-game scores show decimal points
- Labels: bug
- Final score and some end-game scores display with decimal points instead of whole numbers

### #72 — End-game buttons are different sizes
- Labels: bug
- "Play Again" and "View Hall of Fame" buttons on the end-game screen are visually mismatched in size

### #73 — Hall of Fame does not load
- Labels: bug, needs-investigation
- Opening Hall of Fame results in a blank/failed view
- Likely cause: Firebase-dependent path not resolving in the current hosted/local environment; needs verification on the live Pages build
