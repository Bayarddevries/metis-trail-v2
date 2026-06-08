# Next Session Prompt — Metis Trail V2

Pick up from the current local repo state. Do not start with assumptions.

**Repo**: `/home/bayarddevries/metis-trail-v2-repo`
**Branch**: `main` on top of `0bda15e`
**Local server** already running on Tailscale at: `http://100.108.183.33:8081/index.html`

---

## Step 1 — Read repo state before changing anything

1. Read `HANDOFF.md`, `TODO.md`, `AGENTS.md`, `CHANGELOG.md`, `ISSUES.md`
2. Run `git status` and `git diff` to review current local changes
3. Read `src/systems/engine.js` and `src/main.js`
4. Confirm what is staged vs unstaged and whether built `dist/` matches checked-in state

---

## Step 2 — Build and verify

- Build with `bun scripts/build.mjs`
- Confirm local server by reloading `http://100.108.183.33:8081/index.html`
- Verify that `src/template.html` version matches `dist/index.html`
- If browser verification finds a problem, stop and report it rather than retrying

---

## Step 3 — Review current v41 work for gaps

The last set of local edits was supposed to close Issue #31 plus remove MB display and expose crafting. You must verify:

1. **Cart UX audit**: starting cart weight change is reflected in code and docs; category hints (`getCategoryHint`) actually appear in the rendered cart overlay
2. **Crafting exposure audit**: `'craft'` appears in `availableSettlementActions()` for the correct settlement types and the crafting panel actually renders
3. **MB removal audit**: no MB text remains in `dist/app.js` or rendered UI; `mbValue` still exists in data files for future economy work
4. **Docs sync audit**: `CHANGELOG.md`, `HANDOFF.md`, and `TODO.md` reflect v41 consistently

If any gap is found, fix it, document it in `HANDELOFF.md` and `CHANGELOG.md`, and list it in this file.

---

## Step 4 — Update docs to reflect v41 exactly

Docs currently lag behind code. Before choosing the next sprint, bring docs up to date:

- Update `TODO.md` so Phase 6 accurately reflects completed balance pass and remaining open items
- Update `HANDOFF.md` to clear stale v38 Claims and accurately describe v41 verified state
- Close Issue #31 in `ISSUES.md` as resolved in v41

Use concise factual updates. Do not invent new features.

---

## Step 5 — Next sprint selection

After docs are clean, review the highest-value remaining work from `TODO.md` / `ISSUES.md`:

Likely candidates:
- **MB data cleanup** (#15 pre-departure packing also qualifies as gameplay impact)
- **Issue #15**: Pre-departure cart packing
- **Issue #13**: Weather system
- **Issue #12**: Highscore/leaderboard
- **Win rate tuning first**: balance/world difficulty is the strongest blocker before new content

Recommend the next sprint as a 1–2 item plan with rationale, then ask for confirmation before executing.

---

## Hard constraints

- Do not push to remote
- Do not edit `dist/` directly
- Do not break the local server
- Always verify in browser when UI code is touched
- Document in `CHANGELOG.md` and `HANDOFF.md` before finishing
