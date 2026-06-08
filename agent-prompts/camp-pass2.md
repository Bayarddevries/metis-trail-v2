# Scoped Camp Pass 2

## Goal
Make camp a true one-action-at-a-time decision point with dice variance.

## Required changes
1. main.js showCamp(): result text -> clear continue button required before returning; close overlay continue-west only.
2. engine.js: add `d20()` and use it in campAction for forage/hunt/scout/rest to produce noisy gains/losses instead of fixed numbers.

## Acceptance criteria
- Click a camp action: state updates, result text shows, Continue button visible.
- Continue closes camp, returns to map/trail.
- No way to chain multiple camp actions without pressing Continue.
- Readings vary when rerolled (not deterministic).

## Constraints
- No carnage to build chain; v46 logic
