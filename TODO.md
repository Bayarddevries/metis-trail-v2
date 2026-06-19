# TODO — Metis Trail V2

## Active: V13 UI Overhaul

See `docs/V13_UI_OVERHAUL.md` for the full plan with checkboxes and session breakdown.

### Completed: Session 1
_Layout Shell + Bug Fixes_ — Done 2026-06-18
- New status bar (single-line, stat-tap, settings button)
- Two contextual buttons (Travel West / Make Camp)
- Stat-tap overlays (Food→Cart, Crew→Crew)
- Settings menu (⚙ button)
- Journal area expanded (30vh, collapsible, empty state)
- Map filter (warmer, sepia)
- Pre-departure item list rendering fix
- FOOD hardcoded 30 → 0
- Settlement/camp "Risk:" → "Receive:"
- "any_fur" → "Any Fur/Pelt" display fix
- Save-game version migration (v2)
- Build verified, full playtest passed

### Current: Session 2
_Narrative Wiring_ — journalNarrative.js → journalLog calls

Key tasks:
- Import all narrative functions from journalNarrative.js
- Replace inline buildTravelJournalEntry/buildEventJournalEntry
- Wire travel, event, camp, settlement narrative templates
- Remove unused inline functions
- Build + verify narrative prose renders correctly

## Deferred / Backlog
- Session 3: Mobile responsive + integration test
- Session 4: Polish + edge cases
- Session 5: Balance pass + content
- Hall of Fame fix (#73)
- Cultural review of narrative content
