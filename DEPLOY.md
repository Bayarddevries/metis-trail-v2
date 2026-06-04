# Deploy contract: metis-trail-v2

## Live site
https://bayarddevries.github.io/metis-trail-v2/

## How it deploys
GitHub Actions: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Build: `npm run build`
- Input: `BUILDVER=${{ github.run_number }}`
- Output: `dist/app.v${BUILDVER}.js` + `dist/index.html`
- Publish: GitHub Pages from `dist/`

## Local preview
```
npm run build
open dist/index.html
```

## Current release
- `v0.5.1-marker-fix` (commit `a15b619`) — cart marker icon + aspect ratio fix
- Previous: `v0.5-playable` (commit `4977e31`)
- Do not edit files under `dist/` manually.
- Do not commit built artifacts.
- `src/template.html` must reference `app.v${BUILDVER}.js`.

## Rollback
Identify the last successful GitHub Actions run, copy the artifact's `app.vX.js` back into `dist/`, then redeploy.
