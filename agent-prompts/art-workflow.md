# Agent Prompt: Audit Manny Morr Art Files and Create Repo Assets Plan

## Context
We're working on `/home/bayarddevries/metis-trail-v2-repo`, an offline-first browser game. We have Google Drive art assets (Google Drive folder `18BIjiLG2cdiTLOuh3lBqMY3x-u7nAIW8`) from artist Manny Morr.

## Background
- Manny created 3 pixel art images: Fort Garry, Fort Edmonton, Fort Ellice (currently labeled as "arrival cards")
- We need these as map markers, not arrival cards
- One image_generate tool is unavailable (bad credentials), so asset creation must be manual or via available local tools
- We want a clear plan for where art files live and what format/size they need

## Your Task

### 1. Inspect the repo's current asset setup
Find where art files are referenced:
- Search `src/` for `.png`, `.jpg`, `/art/`, `assets/`, image paths
- Read `src/template.html` and `src/main.js` for image/link references
- Check `dist/` for a bundled `art/` or `assets/` folder (list files)
- Look for any `README`, `docs/`, or `CONTRIBUTING` that mentions art workflow

### 2. Document the current state
Output a short text block answering:
- Where are art assets currently stored?
- What formats/sizes are expected for map markers?
- Are images bundled at build time or copied?
- Is there an existing `src/assets/` or `art/` directory?

### 3. Propose a plan
Write a `docs/art-workflow.md` file with:
- Target directory structure (e.g., `src/assets/markers/`, `src/assets/icons/`, `src/assets/locations/`)
- File naming convention (e.g., `fort-garry.png`, `fort-edmonton.png`)
- Recommended sizes for each role (map marker 32×32, location card 300×400, UI icon 24×24)
- How Manny Morr's 3 existing images fit into this plan
- Whether build script needs to copy asset folders into `dist/`

### 4. Commit
```bash
git add -A
git commit -m "docs: add art asset workflow plan for Manny Morr images"
```

## Constraints
- Do NOT move, rename, or delete any existing files yet — this is a planning pass only
- Do not edit `dist/`
- Document only; no implementation unless clearly scoped
- Conventional commit only
