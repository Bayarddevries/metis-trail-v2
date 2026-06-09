# Plan: Audit P0 UI Polish (#50-52, #55)

## Context
Per the 2026-06-09 design audit, four P0 items need implementation for period-accurate sharp-corner aesthetic and mobile responsiveness.

## Current State
- Many `border-radius` and `box-shadow` declarations throughout `src/template.html`
- Map tiles have `filter: sepia(0.6) saturate(0.4) contrast(0.9) brightness(0.95)`
- Narrative panel (`#narrative`) has minimal styling — no paper texture or ruled lines
- Mobile breakpoints exist at 768px and 520px; need 420px + landscape; touch targets need 44px minimum audit

## Scope
All changes in `src/template.html` CSS block and `src/ui/theme.js` (for new color variables). No JS logic changes.

---

## Task 1: #50 — Strip border-radius and box-shadow (sharp corners)
**Files:** `src/template.html`, `src/ui/theme.js`

### CSS variables to add in theme.js:
```js
// Sharp-corner mode (all border-radius = 0, box-shadow = none)
// Controlled via --corner-radius: 0; --shadow: none;
// But we'll just set all radii to 0px and shadows to none directly in template
```

### Elements to update (remove `border-radius` and `box-shadow`):
| Selector | Current `border-radius` | Current `box-shadow` |
|----------|------------------------|---------------------|
| `#map .node-tooltip` | 4px | `0 2px 6px rgba(0,0,0,0.3)` |
| `.map-frame` | — | `inset 0 0 0 3px var(--clr-map-frame-shadow)` |
| `.ctrl-btn` | 8px | — |
| `.overlay-card` | 10px | `0 12px 28px rgba(0,0,0,0.22)` |
| `.close-btn` | 6px | — |
| `.start-btn`, `.restart-btn` | 6px | — |
| `#predeparture-weight` | 6px | — |
| `.cat-item` | 4px | — |
| `.pd-row` | 6px | — |
| `.pd-minus`, `.pd-plus` | 6px | — |
| `.predeparture-actions` buttons | — | (none) |
| `.settlement-action-btn` | (from .ctrl-btn) | — |
| `.choice-btn` | 4px | — |
| `.dice-result` | 4px | — |
| `.die` | 6px | `0 2px 0 rgba(0,0,0,0.25)` |
| `.die.small` | 6px | — |
| `.dice-outcome` | 6px | — |
| `.outcome-flavor` | 6px | — |
| `.end-stats` | 6px | — |
| `.camp-pill` | 999px (pill) | — |
| `.camp-action-btn` | 6px | — |
| `.camp-result` | 6px | — |
| `.camp-roll-display` | 8px | — |
| `.camp-roll-display .die` | 5px | `0 2px 0 rgba(0,0,0,0.25)` |
| `.camp-roll-display .die.pass/fail` | — | glow shadows |
| `.intro-name-input` | 6px | — |
| `.lb-sort-select` | 4px | — |
| `.lb-error` | 6px | — |
| `.lb-sync-notice` | 4px | — |
| `@media (max-width: 768px) .ctrl-btn` | 8px | — |
| `@media (max-width: 768px) .overlay-card` | 12px | — |

### Action:
- Set all `border-radius: 0` (or `border-radius: 0 !important` where needed)
- Set all `box-shadow: none` (or remove)
- Keep `.camp-pill` as pill? Decision: audit says strip ALL, so make it square too (0)
- Animation keyframes referencing box-shadow (`.continue-glow`) → remove or set to `none`

---

## Task 2: #51 — Desaturate map tiles and hide OSM attribution
**Files:** `src/template.html`, `src/main.js` (or `renderer.js`)

### Current map tile filter:
```css
#map .leaflet-tile-pane {
  filter: sepia(0.6) saturate(0.4) contrast(0.9) brightness(0.95);
}
```

### Target: grayscale desaturated tiles
```css
#map .leaflet-tile-pane {
  filter: grayscale(1) contrast(1.1) brightness(0.9);
}
```

### Hide OSM attribution:
In `src/main.js` or `src/ui/renderer.js` `initMap()`:
```js
map.attributionControl.setPrefix(''); // removes "Leaflet" text
// OR
map.attributionControl.addAttribution(' '); // minimal
// OR style via CSS:
.leaflet-control-attribution { display: none; }
```

### Action:
- Update tile filter in template.html
- Add CSS to hide attribution (cleanest: `.leaflet-control-attribution { display: none; }`)

---

## Task 3: #52 — Paper texture with ruled lines and ledger margin to narrative panel
**Files:** `src/template.html`, `src/ui/theme.js` (new variables)

### Current `#narrative`:
```css
#narrative {
  flex: 1;
  padding: 10px 18px;
  overflow-y: auto;
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.65;
  background: rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.08);
  color: var(--clr-narrative-text);
}
```

### Target paper-like styling:
```css
#narrative {
  flex: 1;
  padding: 10px 18px;
  overflow-y: auto;
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.65;
  background: 
    /* Ruled lines */
    repeating-linear-gradient(
      transparent,
      transparent calc(1.65em - 1px),
      var(--clr-ruled-line) calc(1.65em - 1px),
      var(--clr-ruled-line) 1.65em
    ),
    /* Paper texture (subtle noise) */
    var(--clr-paper-texture);
  border-top: 1px solid var(--clr-ledger-border);
  color: var(--clr-narrative-text);
  /* Ledger margin on left */
  border-left: 4px solid var(--clr-ledger-margin);
  padding-left: 28px;
}
```

### New CSS variables for theme.js:
```js
root.style.setProperty('--clr-ruled-line', 'rgba(26,20,16,0.08)');
root.style.setProperty('--clr-paper-texture', 'none'); // or data URL for subtle noise
root.style.setProperty('--clr-ledger-border', 'rgba(26,20,16,0.15)');
root.style.setProperty('--clr-ledger-margin', '#8C6A2A'); // accent color
```

### Alternative: Use a subtle repeating background image for paper texture (base64 SVG noise)
- More performant than generating via CSS
- Can embed as data URL in theme.js

---

## Task 4: #55 — Mobile breakpoints (768px, 420px, landscape) and 44px touch targets
**Files:** `src/template.html`

### Current breakpoints:
- `@media (max-width: 768px)` — general mobile
- `@media (max-width: 520px)` — `.secondary-btns` stack

### Required additions:
1. **420px breakpoint** — smaller phones
2. **Landscape orientation** — `@media (max-height: 500px) and (orientation: landscape)`
3. **44px minimum touch targets** — audit all interactive elements

### Touch target audit (minimum 44px height × 44px width):
| Element | Current | Fix |
|---------|---------|-----|
| `.ctrl-btn` | `min-height: 44px` ✓ | Ensure `min-width: 44px` on mobile |
| `.ctrl-btn.primary/secondary/ghost` | 44px ✓ | OK |
| `.secondary-btns` buttons | 44px? | Check |
| `.choice-btn` | padding only | Add `min-height: 44px` |
| `.camp-action-btn` | padding only | Add `min-height: 44px` |
| `.settlement-action-btn` | `min-height: 44px` ✓ | OK |
| `.pd-minus`, `.pd-plus` | 32×32px | Increase to 44×44px |
| `.die` | 40×40px / 42×42px | OK (close enough, but bump to 44) |
| `.close-btn` | `min-height: 44px` ✓ | OK |
| `.start-btn`, `.restart-btn` | padding only | Add `min-height: 44px` |
| `.intro-name-input` | padding only | Add `min-height: 44px` |
| `.lb-tab` | padding only | Add `min-height: 44px` |
| `.lb-sort-select` | padding only | Add `min-height: 44px` |

### Breakpoint specifics:
- **420px**: Further reduce padding, font sizes, stack more elements
- **Landscape**: Reduce vertical padding, make overlays fit in shorter viewport, stack side-by-side where possible

---

## Implementation Order
1. **Task 1** — Strip border-radius/box-shadow (most pervasive, do first)
2. **Task 2** — Map tiles + OSM attribution (quick, isolated)
3. **Task 3** — Narrative paper texture (new variables + CSS)
4. **Task 4** — Mobile breakpoints + touch targets (media queries)

---

## Verification
- `bun scripts/build.mjs` — build passes
- Open `dist/index.html` — visual check:
  - All corners sharp (no rounded corners anywhere)
  - No box-shadows visible
  - Map tiles grayscale/desaturated, no OSM attribution
  - Narrative panel has ruled lines, left ledger margin, paper feel
  - Mobile: resize browser to 420px, 768px, landscape — no overflow, touch targets ≥44px
- Update `TODO.md` and `CHANGELOG.md`
- Commit with conventional message

---

## Risk Notes
- `.camp-pill` becoming square may look odd — accept per audit direction
- Dice animation `.continue-glow` keyframes use box-shadow — remove animation or set to `none`
- Paper texture: test performance of `repeating-linear-gradient` on mobile; fallback to solid if laggy
- Touch targets: some inline elements (`.pd-minus`, `.pd-plus`) need explicit sizing