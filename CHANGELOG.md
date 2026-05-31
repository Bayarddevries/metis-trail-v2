# Changelog

All notable changes are documented here. Format loosely follows Keep a Changelog.

## Unreleased

### Added
- Repo scaffold with `src/core`, `src/data`, `src/systems`, `src/ui`
- Core modules: `constants`, `calendar`, `seed` (PRNG + d20), `schema` types
- Data files: `nodes.js`, `items.js`, `sources/index.js`
- Systems scaffold: `engine.js`, `events.js`, `scoring.js`, `travel.js`
- UI scaffold: `shell.js`, `renderer.js`, `theme.js`, `debug.js`
- esbuild bundler in `scripts/build.mjs`
- GitHub Actions Pages deploy workflow

### Fixed
- package-lock regenerated (dev dependency mismatch)

### Docs
- README.md
- TODO.md
- CHANGELOG.md
- ISSUES.md
- AGENTS.md
- RULES.md
- docs/pitfalls.md

## Notes
- v1 site baseline: https://bayarddevries.github.io/metis-trail/
