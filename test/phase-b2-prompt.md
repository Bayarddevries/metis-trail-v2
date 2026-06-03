# PHASE B2 GOAL PROMPT — Animal Events (Mule + Hunts)

You are implementing Phase B2 of Sprint 2 for the Cart Trail game. Your ONLY job is to add/replace animal events (mule behavior + hunt events). Nothing else.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`

This is a single HTML file containing all game CSS, JS engine, and data. It is now ~1539 lines (after Phase B1).

## Current State
- Line 709+: `const EVENTS = { ... }` — terrain-keyed event arrays
- Terrain types: `plains`, `river_valley`, `wooded`, `uplands`, `river`
- Existing animal-related events: `buffalo_herd` (plains), `game_sighted` (plains), `ox_injury` (plains), `bear_encounter` (wooded), `deer_crossing` (wooded)

## What You Need to Add/Replace

### 1. The Geometry Lesson — Mule Behavior Event (plains terrain)

Source: Marbot (1875) — "'Essaying to remount Mule, into whom must have transmigrated the crazy soul of some defunct geometer, he suddenly seemed to behold in me his centre, conceived himself a radius, and proposed to pass the rest of his life in describing a complimentary circumference, his tail doing the tangents.'"

Add this as a NEW event in the EVENTS.plains array:

```javascript
{
  id: 'geometry_lesson',
  text: "The mule stops dead. It eyes you with something that can only be described as mathematical malice.\n\nYou approach. The animal seems to behold in you its centre, conceives itself a radius, and proposes to pass the rest of its life in describing a complimentary circumference — its tail doing the tangents. It whirls. You lunge for the stirrup, catch one toe, and are dragged in a half-mile gallop that would put circus Mazeppas to shame.\n\nEventually this becomes tedious. You jump off, landing on all fours in the dust. The mule trots back, looking pleased with itself.",
  choices: [
    { text: 'Try to remount — you will master this beast (DC 12)', dc: 12, ok: 'Spur, bit, and will against mule, its heels and its knees. After a struggle, the animal submits. You ride west, victorious and slightly bruised.', bad: 'The mule wins. Again. You spend another hour fighting it. By the time you remount, half the day is gone and your crew is trying very hard not to laugh.', time: 1, crew: 'tired' },
    { text: 'Lead it on foot — dignity is overrated', dc: null, ok: '', bad: '', always: 'You take the reins and walk. The mule follows, docile as a lamb now that it has made its point. Your crew says nothing. Their faces say everything.', crew: 'tired' }
  ]
}
```

### 2. Sick Mule Event (plains terrain)

Source: Marbot — "'Poor brute! on our return he fell sick. We dragged him along behind the cart for a day or two, and since he got no better, but only worse, and could hardly walk, we left him on the open prairie, cutting a heap of green grass for his bed and board, clipping his ear for a property-mark, and praying that the wolves might spare him.'"

Add this as a NEW event in the EVENTS.plains array:

```javascript
{
  id: 'sick_mule',
  text: "The mule is sick. Not tired — sick. Its head hangs low and its breathing is labored.\n\nYou dragged it behind the cart yesterday. It got worse. The animal can barely stand now. You're miles from the next settlement. There's green grass here, and water in the creek bed. But the wolves will come at night.",
  choices: [
    { text: 'Leave it here with grass and water — clip its ear as a property mark', dc: null, ok: '', bad: '', always: 'You cut a heap of green grass for its bed and board. Clip its ear for a property mark — someone may find it, or you may come back this way. The mule watches you leave with its long neck stretched out, loth to believe you would desert it. You cannot look back.', crew: 'tired', food: -1 },
    { text: 'Try to nurse it for a day (Survival DC 13)', dc: 13, ok: 'You rest for a day, keeping the mule warm and watered. By morning it can stand. Not well, but well enough. You hitch up and move on, slower than before.', bad: 'A day of rest and the mule is no better. You have to leave it anyway — and now you have lost the time.', time: 2, crew: 'tired' }
  ]
}
```

### 3. Elk Hunt Event (plains terrain)

Source: Marbot — "'The prospect of killing an elk was no more to be resisted... we capped our rifles and cantered along in the track of his great leaps... till we saw him shake his antlers proudly and plunge into an alder swamp two or three miles away.'"

Add this as a NEW event in the EVENTS.plains array:

```javascript
{
  id: 'elk_hunt',
  text: "Movement in the poplar line to the south. A bull elk — massive, antlers like a crown — breaks cover and runs.\n\nThe prospect of killing an elk is no more to be resisted than the glimpse of office flashed upon a hopeless nominee. Your rifle is in the cart. The elk's great leaps carry it through the poplar clumps with a grace that seems to mock your heavy boots.",
  choices: [
    { text: 'Chase on foot through the poplars (DC 13)', dc: 13, ok: 'You track his leaps through two miles of poplar. He shakes his antlers at you once — proud, defiant — then plunges into an alder swamp. You follow. The shot is clean. By evening the meat is cut and packed.', bad: 'You track him for miles. He shakes his antlers proudly and plunges into an alder swamp two miles out. You lose him in the thicket. You walk back to the cart empty-handed and aching.', food: 5, time: 1 },
    { text: 'Take a long shot from here (DC 15)', dc: 15, ok: 'You steady the rifle against a poplar trunk. The crack echoes across the prairie. The elk stumbles, then drops. A clean kill at range. The crew whoops.', bad: 'The shot goes wide. The elk bounds away, antlers high, and vanishes into the trees. You reload and try again but he is long gone.', food: 5 },
    { text: 'Let him go — you cannot spare the time', dc: null, ok: '', bad: '', always: 'You watch the elk disappear into the poplar line. There will be other chances. Maybe.' }
  ]
}
```

### 4. Eagle Encounter (uplands terrain)

Source: Marbot — "'A large gray eagle came sailing along the air, and hovered high above us. I fired with my rifle and hit him, knocking out a few tail-feathers; but not fatally... he only tumbled, fluttering three or four times his own wing-spread, and then recovered himself and flew off into upper air.'"

Add this as a NEW event in the EVENTS.uplands array:

```javascript
{
  id: 'eagle_encounter',
  text: "A large grey eagle sails along the air and hovers high above you — riding the thermals from the coulee below, wings motionless. It watches with ancient eyes.\n\nThe uplands stretch in every direction. The eagle hangs in the sky like a living thing carved from stone. Your rifle is in the cart. The bird is far — but not impossible.",
  choices: [
    { text: 'Take the shot (DC 14)', dc: 14, ok: 'The rifle cracks. The eagle tumbles, fluttering three or four times its own wing-spread — then recovers and flies off into upper air. You see it hanging over the river later, without an apparent stroke of its pinions, steadily poised in the same spot. A near thing. The crew is impressed.', bad: 'The ball goes wide. The eagle doesn\'t even flinch. It circles once more, then rides the wind west. You reload and watch it go.', crew: 'rested' },
    { text: 'Watch it — some things are not meant to be shot', dc: null, ok: '', bad: '', always: 'You stand and watch the eagle circle. It hangs in the air without a stroke of its pinions, balanced against the wind. Then it rides the thermals west, toward the mountains. The crew is quiet. Some moments on the trail are worth more than meat.', crew: 'rested' }
  ]
}
```

### 5. Sandhill Crane Hunt (river_valley terrain)

Source: Marbot — "'Sandhill cranes — huge birds, delicious to eat, and worth creeping a hundred rods to shoot — would start from many hollows as we came up over the nearest hill... mocking us with their clanging cry till their white, van-like wings were faint white specks in the distant air.'"

Add this as a NEW event in the EVENTS.river_valley array:

```javascript
{
  id: 'crane_hunt',
  text: "Sandhill cranes — huge birds, their grey bodies rising from the hollows as you come up over the nearest hill. They are delicious to eat and worth creeping a hundred rods to shoot.\n\nBut they see you. The ungainly majesties put on airs and stalk about on distant sand-hills, mocking you with their clanging cry. Their white, van-like wings grow fainter in the distance.",
  choices: [
    { text: 'Creep a hundred rods through the grass (DC 12 Stealth)', dc: 12, ok: 'You belly-crawl through the grass, inch by inch. The cranes stalk and preen, unaware. At last you are in range. The shot echoes across the valley. One bird drops. The rest clang and scatter. By evening you are eating well.', bad: 'A careless step. The cranes explode from the grass with a clanging cry that echoes off the hills. You fire wild. They are gone — white specks in the distant air. You walk back to the cart covered in grass stains and shame.', food: 3, time: 1 },
    { text: 'Try a long shot (DC 15)', dc: 15, ok: 'You steady your aim at the very edge of range. The crack sends the cranes scattering — but one tumbles. Clean hit. The crew cheers from the cart.', bad: 'The shot falls short. The cranes mock you with their clanging cry as they wheel away. Faint white specks in the distance.', food: 3 },
    { text: 'Let them be — you have other concerns', dc: null, ok: '', bad: '', always: 'You watch the cranes stalk on their distant hill. Their clanging cry carries across the valley. There will be other chances.' }
  ]
}
```

### 6. Antelope Hunt (plains terrain)

Source: Marbot — "'Here, too, after a long chase and considerable circumvention, we shot at the first antelopes seen by us. Their quick, long jumps took them out of rifle-range too soon to give us a second chance.'"

Add this as a NEW event in the EVENTS.plains array:

```javascript
{
  id: 'antelope_hunt',
  text: "Pronghorn on the horizon — a small herd, maybe two hundred yards south. They haven't seen you yet. Their white rumps catch the sun.\n\nAntelope are fast. Their quick, long jumps take them out of rifle-range before you can blink. You'll need to get close — or get lucky.",
  choices: [
    { text: 'Stalk closer through the grass (DC 14, costs time)', dc: 14, ok: 'You circle downwind, using every fold in the grass. The antelope graze, unaware. At last you are in range. The shot drops one. The herd explodes away, white rumps flashing. You dress the meat and return to the cart richer.', bad: 'They spot you at the last moment. Their quick, long jumps take them out of range before you can fire. You watch them bound across the prairie, out of reach and out of range. A long walk back to the cart.', food: 3, time: 1 },
    { text: 'Take the shot from here (DC 16)', dc: 16, ok: 'A miracle of marksmanship. The antelope drops at extreme range. The crew stares. You try to look like you meant to do that.', bad: 'The ball falls short. The antelope bound away, white rumps flashing, and are gone before you can reload.', food: 3 },
    { text: 'Let them run — too much effort', dc: null, ok: '', bad: '', always: 'You watch the pronghorn bound across the prairie. They are the fastest things on the grass. You have neither the time nor the patience today.' }
  ]
}
```

## Exact Steps to Implement

1. Read the file at `/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`
2. Find the EVENTS.plains array. Add these 4 new events to it: `geometry_lesson`, `sick_mule`, `elk_hunt`, `antelope_hunt`
3. Find the EVENTS.uplands array. Add the `eagle_encounter` event to it.
4. Find the EVENTS.river_valley array. Add the `crane_hunt` event to it.
5. Write the file.
6. Deploy:
   ```bash
   cd /home/bayarddevries/.hermes/projects/metis-trail
   git add dist/
   git commit -m "Phase B2: Animal events (Geometry Lesson, sick mule, elk/eagle/crane/antelope hunts)"
   git subtree split --prefix dist -b gh-pages
   git push origin gh-pages --force
   ```

## Rules
- ONLY add the 6 new events listed above. Do NOT modify any existing events, game logic, CSS, or HTML.
- Add each event to the correct terrain array as specified.
- Preserve the exact JavaScript syntax. The file must remain valid.
- Place new events at the END of each terrain's event array (before the closing `]`).
- After editing, verify bracket balance: count `[` and `]` in the EVENTS block.

## Verification
After deploying:
1. Visit https://bayarddevries.github.io/metis-trail/
2. Open browser console (F12) — check for JS errors
3. Play a few turns — verify the game still works normally
4. Report back: "Phase B2 complete — [6 events added successfully] [or list any issues]"
