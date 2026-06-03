# PHASE C3 GOAL PROMPT — Crew Morale/Bonus/Death System

You are implementing Phase C3 of Sprint 2 for the Cart Trail game. This is a system-level change that adds crew personalities, morale states, and death mechanics.

## File to Edit
`/home/bayarddevries/.hermes/projects/metis-trail/dist/index.html` (~1770 lines)

## Source Material

From CHARACTERS.md (in project root):
- **Emile Laroque** (Hunter): Survival +2 bonus near Métis settlements. Personal quest: find brother Marcel.
- **Josette Fontaine** (Trader): Better trade prices. Personal quest: deliver letter proving HBC sold contaminated provisions.
- **Marie-Celeste Morin** (Elder): +1 Spirit to all. Can tell stories to restore morale. Dying — giving knowledge costs health.
- **Jean-Baptiste Bruyere** (Scout): Navigation bonus. Restless.

From Ross/Dumont sources:
- Brigade structure: 10 carts, 3 drivers, overseer, flag system, penalties
- Dumont personality: pragmatic, skeptical, "I have something you don't — a backbone"

## What You Need to Add

### Step 1: Add crew state to S

In the state object, replace `crew: 'rested'` with a crew object:

```javascript
const S = {
    day: 1, month: 6, season: 'summer',
    crew: { morale: 'steady', members: [], bonuses: {} },
    food: 30, wear: 0, squealLevel: 0, node: 0, segmentDay: 0, travelDaysWithoutRest: 0,
    ...
```

Wait — this would break the existing crew system (crewMod(), tired/rested checks). Instead, keep the simple crew state AND add a parallel crewDetail object:

Actually, the simplest approach: keep `crew: 'rested'` as-is for the basic system, and add a NEW field `crewMembers` for the detailed system. The existing crewMod() function still works.

### Step 1 (revised): Add crew detail state

Add to state S:
```javascript
    crewDetail: {
      members: [],      // array of {id, name, health, morale, skills, alive}
      brigadeBonus: false
    },
```

### Step 2: Add crew recruitment event

Add a new event `crew_recruitment` to EVENTS.plains:

```javascript
{
  id: 'crew_recruitment',
  text: "A figure sits alone at a campfire by the trail — apart from the other travellers, cooking something that smells of wild game and prairie herbs.\n\nAs you approach, the figure looks up. Sharp eyes. Weathered face. A hunter, by the look of the rifle leaning against the saddle.\n\n\"You're heading west?\" the hunter asks. \"So am I. Travel is safer with company.\"",
  choices: [
    { text: 'Invite them to join your crew', dc: 11, ok: '"Wise choice." The hunter stands, extends a hand. "Emile. I know every trail between here and the Saskatchewan. The prairie talks — you just have to listen." You gain a skilled hunter. (+2 Survival near Métis settlements)', bad: 'The hunter considers, then shakes their head. "I work alone. But I wish you safe travel." They return to their fire. You move on alone.', recruitCrew: 'emile' },
    { text: 'Nod politely and move on — you travel alone', dc: null, ok: '', bad: '', always: 'You tip your hat and keep walking. The hunter watches you go. The trail is long, and not everyone shares the same destination.' },
    { text: 'Ask if they know the trail ahead (no recruitment)', dc: 9, ok: 'The hunter tells you about the next stretch — good water at the crossing, but watch for mud after the hills. "There is trouble between here and there," they say. "But you look like you can handle trouble." Helpful information.', bad: 'The hunter shrugs. "The trail is the trail. You will find out." They return to their fire.', crew: 'rested' }
  ]
}
```

### Step 3: Add recruitCrew handler in resolveChoice

In resolveChoice(), add:
```javascript
    if (ch.recruitCrew) {
      const crewData = {
        emile: { name: 'Emile Laroque', role: 'Hunter', health: 3, morale: 'steady', skills: { survival: 2 }, alive: true, bonus: 'survival_metis' },
        josette: { name: 'Josette Fontaine', role: 'Trader', health: 3, morale: 'sharp', skills: { trade: 2 }, alive: true, bonus: 'trade_prices' },
        celeste: { name: 'Marie-Celeste Morin', role: 'Elder', health: 2, morale: 'deep', skills: { spirit: 2 }, alive: true, bonus: 'morale_restore' },
        jb: { name: 'JB Bruyere', role: 'Scout', health: 3, morale: 'restless', skills: { navigation: 2 }, alive: true, bonus: 'navigation' }
      };
      const newCrew = crewData[ch.recruitCrew];
      if (newCrew && !S.crewDetail.members.some(m => m.name === newCrew.name)) {
        S.crewDetail.members.push(newCrew);
        result.effects.push(`+ Crew member: ${newCrew.name} (${newCrew.role})`);
      }
    }
```

### Step 4: Add crew death event

Add `crew_death` to EVENTS.plains:

```javascript
{
  id: 'crew_death',
  text: "<CREW_NAME> has been getting worse. The fever that started three days ago has not broken. This morning, they cannot stand.\n\nThe trail offers no mercy — no surgeon, no priest, no settlement within days. Just the prairie and the sun and the slow, terrible arithmetic of infection.",
  choices: [
    { text: 'Stay and care for them (Survival DC 13)', dc: 13, ok: 'You stay. Day and night, you keep them cool, keep them hydrated, keep them breathing. On the fourth day, the fever breaks. They will live. But you have lost four days.', bad: 'You do everything you can. It is not enough. On the third night, <CREW_NAME> dies quietly while you sleep. You bury them in the morning — a cairn of prairie stones, a prayer you half-remember. The trail stretches ahead, emptier than before.', crewDeath: true, time: 4 },
    { text: 'Make them as comfortable as possible and keep moving', dc: null, ok: '', bad: '', always: 'You wrap them in blankets, place them in the cart, and keep moving. Every bump in the trail is an agony. On the second day, they die. You bury them by the trail and stand for a long time before hitching the ox.', crewDeath: true }
  ]
}
```

### Step 5: Add crewDeath handler in resolveChoice

```javascript
    if (ch.crewDeath) {
      // Find the sickest crew member (lowest health, not already dead)
      const sickest = S.crewDetail.members.filter(m => m.alive).sort((a, b) => a.health - b.health)[0];
      if (sickest && ch.dc !== null && !result.success) {
        // Failed DC = crew member dies
        sickest.alive = false;
        sickest.health = 0;
        result.effects.push(`${sickest.name} has died.`);
      } else if (sickest && ch.dc === null) {
        // Always outcome = death after delay
        sickest.alive = false;
        sickest.health = 0;
        result.effects.push(`${sickest.name} has died.`);
      }
    }
```

### Step 6: Add crew display to getCrewStatus()

Add a function that returns crew status text:

```javascript
function getCrewStatusText() {
  if (!S.crewDetail.members.length) return 'Traveling alone';
  const alive = S.crewDetail.members.filter(m => m.alive);
  if (!alive.length) return 'All crew lost';
  return alive.map(m => `${m.name} [${m.role}] — ${m.morale}`).join('\n');
}
```

### Step 7: Export crew in stateSummary()

In stateSummary(), add crew info to the returned object.

## This is too complex for one agent pass. Break it into smaller chunks.

## Steps (do in order)

1. Read file
2. Add `crewDetail: { members: [], brigadeBonus: false }` to state S
3. Add `recruitCrew` and `crewDeath` handlers to resolveChoice()
4. Add `crew_recruitment` and `crew_death` events to EVENTS.plains
5. Add emoji for crew events
6. Write and deploy

## Deploy
```bash
cd /home/bayarddevries/.hermes/projects/metis-trail
git add dist/
git commit -m "Phase C3: Crew morale/bonus/death system"
git subtree split --prefix dist -b gh-pages
git push origin gh-pages --force
```
