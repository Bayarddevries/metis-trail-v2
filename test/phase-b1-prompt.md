# PHASE B1 GOAL PROMPT — Environment Events

You are implementing Phase B1 of Sprint 2 for the Cart Trail game. Your ONLY job is to add 3 new environment events to the game engine. Nothing else.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`

This is a single HTML file containing all game CSS, JS engine, and data. It is ~1536 lines.

## Current State of the File
- Line 709-861: `const EVENTS = { ... }` — terrain-keyed event arrays (plains, river_valley, wooded, uplands, river)
- Line 863-896: `const TRAIL_FLAVOR = { ... }` — flavor text arrays per terrain
- Line 898: `function getEventsForTerrain(t)` — returns events for a terrain type

The terrain types are: `plains`, `river_valley`, `wooded`, `uplands`, `river`

## What You Need to Add

### 1. Mosquito Siege + Alkaline Water Event (river_valley terrain)

Source: Marbot (1875) — "'Our mosquito and gnat misgies culminated. Alkaline water in the swamps... ruined the flavor of our tea, and gave all our horses and mules what Joseph called an elementary canal enlargement.'"

Event structure:
```javascript
{
  id: 'mosquito_siege',
  text: "The air turns thick with mosquitoes. Not the usual nuisance — a living cloud that rises from the alkaline shallows with every step. Your ox stamps and twists. You can barely draw breath without swallowing them.\n\nThe water here has a bitter, salty taste. Ruined the tea this morning. You can see the white alkali crust along the marsh edge. The mules — everyone's developing what Joseph darkly calls 'an elementary canal enlargement.'",
  choices: [
    { text: 'Burn green wood for smoke (risk: prairie fire)', dc: 12, ok: 'The smoke drives them back. You camp in a haze of green-willow smoke, coughing but unbitten. The horses settle.', bad: 'The smoke works too well — a spark catches the dry grass upwind. You scramble to beat it out before it spreads. The mosquitoes return the moment the smoke clears.', crew: 'tired', time: 1 },
    { text: 'Apply mud and grease, push through', dc: null, ok: '', bad: '', always: 'You smear your face and hands with river mud mixed with axle grease. It is not dignified. It works. The mosquitoes can't bite through the paste. You march through the worst of it, a greased phantom on the prairie.', crew: 'tired' },
    { text: 'Move camp to higher ground immediately', dc: null, ok: '', bad: '', always: 'You abandon the marsh-side camp and haul everything uphill. A quarter mile from the water, the mosquitoes thin. You lose half a day but save your sanity.', time: 1 }
  ]
}
```

### 2. Prairie Fire Event — Improved (plains terrain)

Source: Marbot — "'Away to the right was a column of smoke, where the careless dropping of a match had set the prairie on fire.'"

Replace the existing `prairie_fire` event in the plains array with this improved version:

```javascript
{
  id: 'prairie_fire',
  text: "A column of smoke rises from the south. Not a campfire — too wide, too grey. The careless dropping of a match, perhaps. The wind carries it toward the trail.\n\nThe grass here is dry as bone. If the fire reaches the trail ahead, you'll be forced to choose between waiting and detour. Either way, you lose time. But if it reaches the cart...",
  choices: [
    { text: 'Burn a firebreak now — clear the grass ahead of you', dc: 13, ok: 'You light a careful backfire and watch it eat toward the oncoming blaze. The two fires meet and die. You stand in the smoke, coughing, surrounded by ash. But the cart is safe.', bad: 'The firebreak catches wrong. You're now fighting two fires. You barely contain it. Your eyebrows are singed and you lost an hour.', time: 1, crew: 'tired' },
    { text: 'Flee at speed — outrun the fire', dc: 12, ok: 'You whip the ox forward and run. The smoke thickens behind you. You reach a creek bed just as the flames crest the ridge. You watch the fire sweep past, close enough to feel the heat.', bad: 'The fire is faster than it looks. The cart catches sparks. You beat out a smolder on the canvas tarp. The cart took damage and you lost supplies to the haste.', wear: 1, food: -1 },
    { text: 'Turn back and find a detour', dc: null, ok: '', bad: '', always: 'You reverse course and find a route around the fire's path. It costs you a full day of backtracking. The fire passes to your north. You breathe ash for hours.', time: 1 }
  ]
}
```

### 3. River Crossing — Expanded (river terrain)

Source: Brehaut documents: ford (risky), cajeux/ferry (costs goods), wheel-raft (remove wheels, lash concave-up, ferry across).

Replace the existing `major_crossing` event in the river array with this expanded version:

```javascript
{
  id: 'major_crossing',
  text: "The river stretches wide before you. The current is steady — not fast, but you can see debris moving below the surface. The ford is marked by willow poles on both banks, but the water is higher than when they were planted.\n\nYou have options. The ford is passable — probably. The cajeux rope-ferry is here but it'll cost you. Or you can do what some of the old hands do: take the wheels off, lash them together concave side up, and float the cart across on its own wheels.",
  choices: [
    { text: 'Ford the river (Survival DC 12)', dc: 12, ok: 'The ox finds the shallow channel. Water laps at the cart bed but nothing shifts. You reach the far bank soaked but whole.', bad: 'Midway across, a wheel drops into a hole. The cart tilts. You wrestle it level but the axle cracks. Some supplies get wet.', wear: 1, food: -2 },
    { text: 'Take the cajeux/ferry — costs supplies', dc: null, ok: '', bad: '', always: 'The ferry operator poles you across for a price. He takes a bison hide and some pemmican for his trouble. Three hours and you're across with a dry cart.', food: -3 },
    { text: 'Build a wheel-raft (Survival DC 14, 2 hours)', dc: 14, ok: "You remove the wheels — an hour of work — then lash them together concave side up. The cart body goes on top. You pole across on your own invention, dry and proud. Four hours total, but nothing is wet.", bad: "The raft is clumsy. Mid-river the wheels shift. You get wet getting everything re-lashed on the far bank. It works, but not the way you planned.", food: -1, time: 2 }
  ]
}
```

## Exact Steps to Implement

1. Read the file at `/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`
2. Find the existing `prairie_fire` event in the `EVENTS.plains` array (around line 715). Replace it with the new version.
3. Find the existing `mosquito_plague` event in the `EVENTS.river_valley` array (around line 785). Replace it with the new `mosquito_siege` event.
4. Find the existing `major_crossing` event in the `EVENTS.river` array (around line 856). Replace it with the new expanded version.
5. Write the file.
6. Deploy:
   ```bash
   cd /home/bayarddevries/.hermes/projects/metis-trail
   cp dist/index.html dist/index.html.backup
   git add dist/
   git commit -m "Phase B1: Improved environment events (mosquito siege, prairie fire, river crossing)"
   git subtree split --prefix dist -b gh-pages
   git push origin gh-pages --force
   ```

## Rules
- ONLY modify the three events listed above. Do NOT touch any other events, game logic, CSS, or HTML.
- Each event goes in the terrain array specified (plains, river_valley, river).
- Preserve the exact JavaScript syntax. The file must remain valid.
- After editing, verify the file has no syntax errors by running: `node -c /home/bayarddevries/.hermes/projects/metis-trail/dist/index.html/index.html` — actually, just check it's valid JS structure with grep for brackets.
- Keep each event's `choices` array properly closed.
- Test: open the file in a browser after deployment to verify no JS errors.

## Verification
After deploying:
1. Visit https://bayarddevries.github.io/metis-trail/
2. Open browser console (F12) — check for JS errors
3. Play a few turns — verify the game still works normally
4. Report back: "Phase B1 complete — [3 events added/replaced successfully] [or list any issues]"
