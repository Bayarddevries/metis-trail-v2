# AGENTS.md

This file is the contract for any agent or contributor working on `metis-trail-v2`.

## Your job
- Advance the TODO without creating ambiguity for the next agent.
- Do not ship undocumented history; prefer a TODO over invented content.

## First actions
1. Read `README.md`, `TODO.md`, `ISSUES.md`, and `CHANGELOG.md` before editing code.
2. Run `npm run build` and confirm `dist/` contents before attempting to open any URL.

## Code rules
- Keep changes minimal and contained to `src/`.
- Do not edit generated files in `dist/`.
- Follow conventional commits.
- Any historical narrative must cite `src/data/sources/index.js` or leave a clear placeholder.

## Permissions and limits
- Do not run destructive commands without explicit user approval.
- Do not make claims about public URLs without verified evidence from the workflow or a local file check.
- If blocked by an environment issue, log it in `ISSUES.md` with evidence and stop.

## Handoff expectations
- Update `TODO.md` status.
- Append a dated note to `CHANGELOG.md`.
- If you made any architectural decision or discovered a pitfall, update `AGENTS.md` if it affects future runs.
