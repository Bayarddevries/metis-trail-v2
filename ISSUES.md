# Issues

Use this file to log bugs, blockers, and known gaps during work sessions. Each item should be short, searchable, and include a short reproduction or evidence note.

**Note:** GitHub issues are the source of truth. This file is for local-only items and session notes. Run `gh issue list` for the canonical open list.

## Active (Local Only)

### 42. MCP Playwright click selector resolution fails
- Opened: 2026-06-08
- Labels: tooling, qa, blocked
- Summary: Playwright navigation works, but click targeting via button text/ref/@id forms does not resolve. Blocks browser verification of UI changes.
- Workaround: Verify via source inspection and local server checks instead of automated clicks.
- Impact: Cannot complete browser QA steps reliably. Manual device testing still works.

---

## Resolved

### 29. Pass/fail should appear after dice settle
- Opened: 2026-06-08
- Resolved: 2026-06-08 (v50, v51)
- Fix: Removed pass/fail pill from renderDicePill(). Outcome reveals after dice-settle animation completes (animationend event).

### 30. Food is showing in decimal places
- Opened: 2026-06-08
- Resolved: 2026-06-08 (v50)
- Fix: Round to 1 decimal after DAILY_FOOD subtraction; Math.floor() on display in status bar and camp overlay.

### 31. Prune redundant settlement/camp actions
- Opened: 2026-06-07
- Resolved: 2026-06-08 (v52)
- Fix: Removed `recruit` (dominated by `rest`), `forage` (camp version better), `rumours` (no mechanical effect) from all settlement types. Removed dead settlementAction() handlers.

### 32. Overlay sequence broken — pre-departure shows before intro
- Opened: 2026-06-07
- Resolved: 2026-06-07 (v44 per TODO.md)
- Fix: bootstrap() always shows intro first. Pre-departure activates after "Begin Journey" click.

### 33. HBC crafting recipe unreachable
- Opened: 2026-06-07
- Resolved: 2026-06-07 (v41 — 'craft' added to HBC actions)
- Note: HBC `availableSettlementActions()` now includes 'craft'. Recipe `finished_hides` with `settlement: 'hbc'` is reachable.

### 34. Camp overlay loses action panel on reopen
- Opened: 2026-06-07
- Resolved: 2026-06-07 (v47)
- Fix: `showCamp()` now resets `actionsEl.style.display = 'grid'` before rebuilding.

### 36. Day 1 first travel resolves to settlement overlay
- Opened: 2026-06-08
- Resolved: 2026-06-08 (v50)
- Fix: Skip `pendingSettlement` when `S.node <= 1` (first arrival after start).

### 37. Gabriel Dumont cannot be at all ferry crossings
- Opened: 2026-06-08
- Resolved: 2026-06-08 (v50)
- Fix: Removed duplicate `river_ferry_dumont` event. Only `ferry_gabriel` (river_valley pool) remains.

### 43. Duplicate stat headings in status bar
- Opened: 2026-06-08
- Resolved: 2026-06-08 (v49)
- Fix: Replaced `innerHTML` with `textContent` + `className` on stat-value spans in `renderStatusBar()`.
