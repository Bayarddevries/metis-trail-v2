# Deployment Issue: Repeated GitHub Pages 404s

**First**: `2026-06-05`  
**Status**: resolved, but the underlying gaps need guarding  
**Build system**: GitHub Actions workflow `deploy.yml` + manual commit  
**Error**: blank / unstyled page after deploy; console 404s for `leaflet.css` and `leaflet.js`

## Symptoms

- Page renders without Leaflet styling or JS
- Browser console has 404s for `leaflet.css`, `leaflet.js`
- Often looks like a totally blank/stripped page
- Reproduces on `main` and `gh-pages` alike after fresh deploy

## Root cause

1. **Build script never put Leaflet into `dist/`**  
   Every build copied bundled app + assets, but skipped the two Leaflet files even though the local template references them inline.

2. **Fix was being applied ad-hoc on `main` only**  
   Adding `dist/leaflet.*` by hand to the branch Worktree “fixed” local preview, but CI run still rebuilt the broken template because the script itself didn’t fetch Leaflet.

3. **Version field drift between template and output**  
   Cache-bust query wasn’t bumped consistently when the template was edited, so cached broken builds could stick around.

## What actually deploys

`.github/workflows/deploy.yml`
- Trigger: push to `main`
- Build: `npm ci` then `npm run build` (`scripts/build.mjs`)
- Publish: Upload `dist/` to `gh-pages` via `upload-pages-artifact` + `deploy-pages`
- No separate `pages.yml` / `pages-dev.yml` anymore.

Local deploy shortcut:
```bash
bun scripts/build.mjs
bash scripts/pages-deploy.sh
```
`pages-deploy.sh` does an isolated worktree build, removes stale `dist/`, commits fresh output to `gh-pages`, and pushes.

## Permanent fixes (already applied)

| # | Fix |
|---|-----|
| 1 | `scripts/build.mjs` now downloads `leaflet.css` and `leaflet.js` from unpkg into `dist/` on every build |
| 2 | `pages-deploy.sh` builds in an isolated worktree so branches can’t leak broken templates |
| 3 | Build script auto-bumps the `app.js?v=N` cache-bust query |

## How to verify clean
```bash
cd ~/metis-trail-v2-repo
git checkout main
git pull
rm -rf dist/
bun scripts/build.mjs
grep 'leaflet' dist/index.html
ls dist/leaflet.css dist/leaflet.js
```
Expected: both files present and referenced.

## Recovery checklist if it breaks again
1. `grep leaflet dist/index.html` → if missing, read `src/template.html`
2. Re-run `bun scripts/build.mjs`
3. If still broken, run `bash scripts/pages-deploy.sh`
4. Hard refresh the deployed site
