# HANDOFF — Metis Trail V2

- Last updated: 2026-06-10
- Branch: main
- Latest commit: 85abf15
- Remote: origin https://github.com/Bayarddevries/metis-trail-v2.git
- Working tree: clean

## Verified state

- https://bayarddevries.github.io/metis-trail-v2/ is serving the latest deployed build.
- Confirmed live asset version: `app.js?v=106`.
- Local built source version in `src/template.html`: `app.js?v=105`.
- GitHub Actions Pages deploy is working.
- Root cause of prior Pages outage: `npm ci` failed on lockfile mismatch; fixed by switching workflow install step to `npm install --no-audit --no-fund`.

## Commits in this session

- `19e43d6` — docs sync: align TODO/HANDOFF/ISSUES with current v82 state
- `c7252c0` — chore: force rebuild trigger
- `85abf15` — chore(pages): use npm install instead of npm ci

## Known issues

- `gh-pages` branch is in an inconsistent state from earlier manual deploy attempts and should not be used unless you decide to restore/deploy from it.
- `Bun` is the local build tool (`bun scripts/build.mjs`); npm is broken in this environment.
- Playwright browser launch is broken here due to a headless Chrome/DBus issue; use local manual verification for UI.

## Next recommended work

- Trail expansion (#43)
- Source reformatting (#42)
- Icon integration (#10)
