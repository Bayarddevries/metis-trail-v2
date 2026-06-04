# PHASE C1b — Buffalo Hunt events to add to EVENTS.plains

Add these 4 events to the END of the EVENTS.plains array (before the closing `],` at line ~869).

The plains array currently ends with the `nwmp_patrol` event. Add a comma after nwmp_patrol's closing `}`, then add these 4 events.

## Event 1: buffalo_hunt_council

```javascript
{
  id: 'buffalo_hunt_council',
  text: "The prairie ahead is dark with carts. From every direction — the Settlement, the river lots, the missions — they have come. Red River carts by the hundreds, stretching five or six miles across the grass.\n\nThis is the great spring hunt. The council fire burns at the center. Ten captains will be chosen, each with ten soldiers. Ten guides. A chaplain. A camp flag to regulate the march.\n\nThe rules are strict: no hunting on the Sabbath. No straying from camp. Theft means your name called three times in the center of the camp, with the word 'thief' after it.\n\nThe chief of the expedition calls for volunteers.",
  choices: [
    { text: 'Volunteer as a Hunter — you will ride with the hunting party', dc: null, ok: '', bad: '', always: 'You step forward as a hunter. The captain nods. You will ride with the hunting party when the herd is found. Your skill with the rifle will matter.', setRole: 'hunter' },
    { text: 'Volunteer as a Soldier — you will guard the camp and maintain order', dc: null, ok: '', bad: '', always: 'You step forward as a soldier. Ten soldiers under each captain, keeping order, guarding the camp, enforcing the rules. It is not glory, but it is necessary.', setRole: 'soldier' },
    { text: 'Volunteer as a Guide — you know the prairie (DC 12)', dc: 12, ok: 'The council accepts you as a guide. You will ride ahead, reading the grass and the wind, finding the herds. When the flag flies, you will be chief of the expedition.', bad: 'The council has enough guides. They thank you and ask you to serve as a soldier instead. You accept.', setRole: 'guide' }
  ]
},
```

## Event 2: buffalo_hunt_march

```javascript
{
  id: 'buffalo_hunt_march',
  text: "June 15th. The procession moves west.\n\nThe carts stretch five or six miles — a picturesque army of wood and hide. The camp flag flies. When it rises, the guide is chief. When it lowers, the captains govern the camp.\n\nYou are <ROLE_TEXT>. The prairie opens before you. The scouts ride ahead. Somewhere beyond the horizon, the buffalo wait.",
  choices: [
    { text: 'Keep the pace steady — the herd will come', dc: null, ok: '', bad: '', always: 'The march continues. Days pass. The carts creak. The oxen plod. The flag flies and lowers, flies and lowers. The rhythm of the hunt settles into your bones.', advanceHunt: 2 },
    { text: 'Push ahead with the scouts — find the herd faster (DC 13)', dc: 13, ok: 'You ride ahead with the scouts. On the third day, you see them — a dark mass on the northern horizon. The signal fire is lit. The hunt is close.', bad: 'You ride ahead but find nothing. The herd has moved further west. You return to the column empty-handed.', advanceHunt: 2 }
  ]
},
```

## Event 3: buffalo_hunt_chase

```javascript
{
  id: 'buffalo_hunt_chase',
  text: "The herd is here. Thousands of buffalo, darkening the prairie to the north.\n\nThe signal fires have been lit. The hunters mount. The rules are clear: no firing until the charge begins. No straying. The Sabbath is sacred.\n\nThe chief gives the signal. The hunters surge forward.",
  choices: [
    { text: 'Ride hard into the herd — maximum yield, maximum risk (DC 12)', dc: 12, ok: 'You ride into the thundering mass. Your rifle cracks again and again. Three cows go down. The meat will feed the camp for days.', bad: 'Too close. A bull charges. Your horse shies. You fire wild and barely escape. You return to camp with nothing but a story.', huntYield: 'high' },
    { text: 'Hunt the edges — safer, steady yield (DC 10)', dc: 10, ok: 'You work the edges of the herd, picking your shots. Two cows and a young bull. Clean kills, no waste.', bad: 'The edge of the herd is chaos. You fire twice and miss both times. The herd moves on.', huntYield: 'medium' },
    { text: 'Guard the camp — keep order, let the hunters hunt (DC 9)', dc: 9, ok: 'You hold the camp. A soldier tries to sneak out — you stop him. The hunt returns successful and the camp is orderly.', bad: 'A fight breaks out over hunting territory. You try to intervene and take a fist to the jaw. The captains sort it out.', huntYield: 'low' }
  ]
},
```

## Event 4: buffalo_hunt_return

```javascript
{
  id: 'buffalo_hunt_return',
  text: "The hunt is over. The meat is cut, dried, packed onto the carts. A total of 1,089,000 pounds — enough to feed the Settlement for months.\n\nBut the meat is heavy. The carts groan. The journey back is slower than the journey out. And the meat will spoil if you delay.\n\nThe captains call for order. The flag rises. The return march begins.",
  choices: [
    { text: 'Push hard — get the meat home before it spoils (DC 11)', dc: 11, ok: 'You drive the column hard. The carts creak and groan but hold. The meat is hung to dry at every camp. By the time you reach the Settlement, the pemmican is packed and the carts are full.', bad: 'A wheel breaks under the weight. A cart overturns. Meat spills across the prairie. You salvage what you can, but the loss is felt.', huntComplete: 'partial' },
    { text: 'Steady pace — preserve the carts, accept some loss', dc: null, ok: '', bad: '', always: 'You keep a steady pace. The carts hold. Some meat is lost to the heat, but the carts arrive intact. The Settlement will eat well this winter.', huntComplete: 'full' }
  ]
}
```

## Steps to Implement

1. Read the file at `/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html`
2. Find the end of the EVENTS.plains array (around line 868-869, after the `nwmp_patrol` event's closing `}`). Add a comma then the 4 events above.
3. In `resolveChoice()` (find the function, around line 1128), at the END of the function (before the `return result;` line), add these handlers:

```javascript
    if (ch.setRole) { S.buffaloHuntRole = ch.setRole; S.buffaloHuntStage = 1; }
    if (ch.advanceHunt) { S.buffaloHuntStage = ch.advanceHunt; }
    if (ch.huntYield) {
      const yieldAmt = ch.huntYield === 'high' ? 50 : ch.huntYield === 'medium' ? 30 : 15;
      S.food += yieldAmt;
      result.effects.push(`+${yieldAmt} Food (buffalo hunt)`);
      S.buffaloHuntYield = yieldAmt;
    }
    if (ch.huntComplete) {
      S.buffaloHuntStage = 4;
      if (ch.huntComplete === 'partial') { S.food = Math.max(0, S.food - 10); result.effects.push('-10 Food (spoilage)'); }
    }
```

4. In `pickEvent()` (around line 1140), replace the function with:

```javascript
function pickEvent() {
    if (S.buffaloHuntStage > 0 && S.buffaloHuntStage < 4 && NODES[S.node].terrain === 'plains') {
      const stageNames = ['council', 'march', 'chase', 'return'];
      const huntEventId = 'buffalo_hunt_' + stageNames[S.buffaloHuntStage - 1];
      const pool = getEventsForTerrain('plains');
      const huntEv = pool.find(e => e.id === huntEventId);
      if (huntEv) return huntEv;
    }
    if (rand() > 0.35) return null;
    const pool = getEventsForTerrain(NODES[S.node].terrain);
    return pool[Math.floor(rand() * pool.length)];
}
```

5. In `presentEvent()` (around line 1370), after the event text is set, add:

```javascript
    // Replace role placeholder in buffalo hunt events
    if (ev.id && ev.id.startsWith('buffalo_hunt') && S.buffaloHuntRole) {
      const roleText = { hunter: 'a hunter — you will ride with the hunting party', soldier: 'a soldier — you guard the camp and maintain order', guide: 'a guide — you read the prairie and find the herds' };
      ev.text = ev.text.replace('<ROLE_TEXT>', roleText[S.buffaloHuntRole] || 'a member of the brigade');
    }
```

5. Write the file
6. Deploy:
```bash
cd /home/bayarddevries/.hermes/projects/metis-trail
git add dist/
git commit -m "Phase C1: Buffalo Hunt multi-step event chain"
git subtree split --prefix dist -b gh-pages
git push origin gh-pages --force
```

## Constraints
- ONLY add buffalo hunt events and modify resolveChoice, pickEvent, presentEvent
- Do NOT modify other events or game logic
- The state fields (buffaloHuntStage, buffaloHuntRole, buffaloHuntYield) were ALREADY added by a previous agent — they should be in the state object already. If they're not, add them.

## Report
Events added, functions modified, line count change, deploy status.
