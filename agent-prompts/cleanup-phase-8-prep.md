# Agent Prompt: Clean Uncommitted State and Prepare for Phase 8

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. We are on main branch, with uncommitted changes from v41-v44 work.

## Known Issues with Current State
- Version drift between `src/template.html` and `dist/index.html`
- Modified files sitting uncommitted: `src/main.js`, `src/systems/engine.js`, `src/data/items.js`, `src/template.html`, `dist/app.js`, `dist/index.html`
- TODO.md, HANDOFF.md, ISSUES.md, CHANGELOG.md are all out of sync with current state
- Pre-departure overlay sequence bug (#32) blocking testing
- HBC crafting bug (#33) — data exists but unreachable
- Cart unload buttons missing item names

## Your Task

### 1. Read and review
Read `TODO.md`, `HANDOFF.md`, `ISSUES.md`, `CHANGELOG.md`, and run `git status`.

### 2. Update markdown files to match current state
Make these consistent with the actual uncommitted changes:

**TODO.md**
- Mark #32 (overlay sequence) and #33 (HBC crafting) as `in_progress` (or `pending` if they're not being fixed in this run)
- Ensure Phase 7 status is accurate

**HANDOFF.md**
- Update "Current State" version to v44
- Ensure Known Bugs section reflects the two open bugs

**ISSUES.md**
- Confirm #32 and #33 are in the Active section (they should already be there — if missing, add them)

**CHANGELOG.md**
- If entries for v41/v42/v43/v44 are missing, append them based on the current file diffs

### 3. Run build
```bash
bun scripts/build.mjs
```
Confirm exit 0. Check that `dist/app.js` and `dist/index.html` exist.

### 4. Commit
```bash
git add -A
git commit -m "chore: sync handoff docs and prepare for Phase 8 (balance)"
```

## Constraints
- Do not fix #32 or #33 in this run unless explicitly asked — this prompt is about housekeeping
- Do not change game logic
- Do not edit `dist/` except to commit the build output as-is
- If `dist/` is in `.gitignore` and already tracked, commit it; if it's ignored entirely, skip it
