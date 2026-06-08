# Agent Prompt: Sync Build Version Drift

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, a vanilla JS game built with esbuild. The current uncommitted state is v44.

## Bug
`src/template.html` version string is out of sync with `dist/index.html`. The build script bumps `?v=N` in `dist/index.html` but NOT in `src/template.html`. Every build must re-sync these manually or version drift accumulates.

## Current state (verify before editing)
- `src/template.html` — likely `?v=43`
- `dist/index.html` — likely `?v=44`

## Your Task

### 1. Read both files
Find the version string in `src/template.html` and `dist/index.html`. Confirm which is lower.

### 2. Fix
Update `src/template.html` version to match `dist/index.html`. Use `patch` or `search_files` to find the exact line.

### 3. Verify
```bash
grep -n '?v=' src/template.html dist/index.html
```
Both should show the same version number.

### 4. Commit (alongside other v44 changes)
```bash
git add -A
git commit -m "chore: sync version drift — src/template.html matches dist"
```

## Constraints
- Do NOT edit `dist/` directly
- Do NOT bump the version — just sync to match dist
