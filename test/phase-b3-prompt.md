# PHASE B3 GOAL PROMPT — Sunday Rest Mechanic

You are implementing Phase B3 of Sprint 2 for the Cart Trail game. Your ONLY job is to add the Sunday Rest mechanic and its overlay to the game. Nothing else.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html` (~1590 lines after Phase B2)

## What is Sunday Rest?

Source: Marbot (1875) — "'We used to rest in camp one day in seven, Sunday the day... Then our trousers and morals were mended, the emigrants greased afresh their cart-wheels and their good resolutions, and washed away their sweat... The man of science divided his time between Paul's Epistles and the compound microscope... and all of us ended the day generally by gathering about the camp-fire after supper and singing Old Hundred, Balerma, Dundee, Ward.'"

Every 7th day (day 7, 14, 21, 28...), if the player is NOT at a settlement, a Sunday Rest overlay appears automatically. This is a FREE rest day — no food cost, and the player gets to choose activities.

## What You Need to Implement

### Step 1: Add Sunday Rest state to the engine

In the game state object `S` (around line 970), add a `sundayRest` field:

```javascript
const S = {
    day: 1, month: 6, season: 'summer', crew: 'rested',
    food: 30, wear: 0, squealLevel: 0, node: 0, segmentDay: 0, travelDaysWithoutRest: 0,
    over: false, won: false, pendingEvent: null, pendingSettlement: null, pendingSundayRest: false,
    score: 0, camps: 0, eventsResolved: 0, tradesMade: 0
};
```

### Step 2: Add Sunday Rest trigger in travelOneDay()

In the `travelOneDay()` function (around line 1109), at the END of the function (after all travel logic, before the closing `}`), add:

```javascript
    // Sunday Rest: every 7th day, if not at a settlement
    if (S.day % 7 === 0 && !S.pendingSettlement && !S.over) {
      S.pendingSundayRest = true;
      stepLog.push({ action: 'sundayRest' });
    }

    checkGameOver();
    return stepLog;
```

IMPORTANT: The travelOneDay function currently returns `[]` at various points. The SundayRest check and `checkGameOver()` should be at the very end of the function, right before the final `return stepLog;`. Look at the structure carefully.

Actually, looking more carefully at the travelOneDay function, it logs the travel narrative before the Sunday check and then checks for events. The Sunday check should go AFTER the event check but BEFORE the final return. Place it right before `checkGameOver()` if that's at the end, or right before the final `return stepLog;`.

### Step 3: Add Sunday Rest overlay HTML

Add the Sunday Rest overlay HTML right after the Crew Overlay (around line 606), before the closing `</div>` of the overlays container:

```html
    <!-- Sunday Rest Overlay -->
    <div class="overlay" id="sunday-overlay">
      <div class="overlay-card">
        <div class="day-header">⛪ Sunday Rest</div>
        <h2 id="sunday-title">Day <span id="sunday-day"></span> — The Lord's Day</h2>
        <div class="settlement-desc" id="sunday-desc">
          The rhythm of the trail gives way to rest. One day in seven, the brigade stops.<br><br>
          Trousers and morals are mended. Cart-wheels are greased afresh — along with good resolutions. The sweat of the trail washes away in the nearest creek.<br><br>
          What will you do with your Sunday?
        </div>
        <div class="settlement-actions" id="sunday-actions"></div>
      </div>
    </div>
```

### Step 4: Add Sunday Rest action handler

Add a new function `sundayAction(action)` after the `settlementAction()` function (around line 1067):

```javascript
  function sundayAction(action) {
    S.pendingSundayRest = null;
    // Sunday is free — no food cost for resting this day
    if (action === 'mend') {
      S.wear = Math.max(0, S.wear - 1);
      say("You mend trousers, patch the canvas, bind a cracked spoke with shaganappi. The cart wear decreases. Small repairs, carefully done.");
    }
    if (action === 'grease') {
      S.squealLevel = 0;
      say("You grease the cart-wheels afresh. The terrible squealing stops. The prairie is quiet again — at least until Monday.");
    }
    if (action === 'bathe') {
      S.crew = 'rested';
      say("You wash away the sweat of the trail in the nearest creek. The water is cold. The crew feels renewed.");
    }
    if (action === 'theology') {
      say("The man of science divides his time between Paul's Epistles and the compound microscope. Joseph offers a theological disputation on the nature of grace. You are not sure who wins, but the day is passed in good company.");
    }
    if (action === 'hymns') {
      S.crew = 'rested';
      S.travelDaysWithoutRest = 0;
      say("After supper, the crew gathers about the camp-fire. Old Hundred. Balerma. Dundee. Ward. The voices carry across the prairie into the vast, indifferent sky. For a moment, the trail feels like home.");
    }
    if (action === 'skip') {
      say("You push on. The trail does not rest, and neither will you. The crew murmurs but obeys.");
    }
  }
```

### Step 5: Add Sunday Rest to getPendingOverlay()

In the `getPendingOverlay()` function (around line 1161), add Sunday Rest as a pending overlay type. Look for the pattern:

```javascript
getPendingOverlay() {
    if (S.pendingEvent) return { type: 'event', ... };
    if (S.pendingSettlement) return { type: 'settlement', ... };
    // Add this:
    if (S.pendingSundayRest) return { type: 'sunday' };
    return null;
}
```

### Step 6: Add Sunday Rest to hasPendingOverlay()

If there's a `hasPendingOverlay()` function, add `S.pendingSundayRest` to it.

### Step 7: Add Sunday Rest UI presentation

Add a `presentSundayRest()` function after the `presentSettlement()` function in the UI code (around line 1270+). Look for the pattern of how other overlays are presented:

```javascript
function presentSundayRest() {
  document.getElementById('sunday-day').textContent = S.day;
  const actions = document.getElementById('sunday-actions');
  actions.innerHTML = '';
  const acts = [
    { id: 'mend', label: '🔧 Mend Clothes & Cart', desc: 'Repair wear (-1 wear)' },
    { id: 'grease', label: '🛞 Grease Wheels', desc: 'Remove squeal (free)' },
    { id: 'bathe', label: '🛀 Bathe in Creek', desc: 'Crew: Restored' },
    { id: 'theology', label: '📖 Theology & Science', desc: 'Pass the time' },
    { id: 'hymns', label: '🎵 Evening Hymns', desc: 'Crew: Rested, reset travel fatigue' },
    { id: 'skip', label: '⏭️ Skip Rest', desc: 'Push on (no benefit)' }
  ];
  acts.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'ctrl-btn';
    btn.innerHTML = `<strong>${a.label}</strong><br><span style="font-size:11px;color:var(--clr-status-accent)">${a.desc}</span>`;
    btn.onclick = () => { game.sundayAction(a.id); hideAllOverlays(); updateUI(); };
    actions.appendChild(btn);
  });
}
```

### Step 8: Add case to showOverlay() switch

In the `showOverlay()` function (the main overlay display switch), add a case for 'sunday':

```javascript
case 'sunday':
  presentSundayRest();
  break;
```

## Steps to Implement

1. Read the file fully to understand the current structure
2. Make all the changes listed above
3. Write the file
4. Deploy:
   ```bash
   cd /home/bayarddevries/.hermes/projects/metis-trail
   git add dist/
   git commit -m "Phase B3: Sunday Rest mechanic"
   git subtree split --prefix dist -b gh-pages
   git push origin gh-pages --force
   ```

## Rules
- ONLY add the Sunday Rest mechanic. Do NOT modify existing events, settlement actions, or other game logic.
- The Sunday Rest triggers every 7th day (day % 7 === 0) when NOT at a settlement
- Sunday Rest is FREE — no food consumed
- The player chooses ONE activity from: mend, grease, bathe, theology, hymns, skip
- `hymns` resets travelDaysWithoutRest to 0 (prevents exhaustion)
- `grease` sets squealLevel to 0
- `mend` reduces wear by 1
- `bathe` sets crew to 'rested'
- `skip' does nothing but advance

## Verification
After deploying, report:
1. Which functions were modified vs added
2. Deploy status
3. Any issues encountered
