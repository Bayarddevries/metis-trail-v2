# AI Writing Review — Metis Trail V2

**Date:** 2026-06-09
**Scope:** All narrative content across events, endings, travel fragments, camp flavor, source quotes, and UI/intro text
**Approach:** Flag passages that exhibit common AI writing patterns. For each, provide a specific rewrite that adds voice, historical specificity, or roughness. Prioritized: event text > endings > travel fragments > camp flavor > UI text.

---

## Summary of Findings

The writing is **competent and period-appropriate** overall, but shows several patterns consistent with AI-generated prose:

1. **Overly smooth/polished sentences** — too many perfectly balanced clauses
2. **Generic sensory descriptions** — "the air is thick," "the wind cuts through," "the earth trembles"
3. **Emotional telling** — "morale rises," "for a moment the trail feels like home" rather than showing
4. **Overused intensifiers** — relentless, brutal, merciless, piercing, blood-curdling
5. **Repetitive sentence structures** — especially "The [noun] [verb] [prepositional phrase]" openings
6. **Lack of sentence-length variation** — too many medium-length sentences

This review focuses on the worst offenders and provides rewrites. Not every flagged passage needs changing — some are fine as-is.

---

## 1. Event Text

### 1.1 `plains_wind` (events.js:25)
**Current:**
> "A hot wind pushes at your back, carrying the smell of sun-baked grass and distant smoke. The prairie grass ripples in long waves like a green sea, and the oxen lean into their traces with new energy. Your cart groans but the wheels turn faster — the wind is a gift, but the prairie gives nothing without a price."

**Problems:**
- "green sea" — stocksimile, appears in hundreds of trail narratives
- "the prairie gives nothing without a price" — fortune cookie wisdom, tells rather than shows
- Three sentences, all same length, all "[subject] [verb] [prepositional phrase]"

**Rewrite:**
> "A hot wind at your back. The grass goes flat in waves and the oxen lean in, pulling harder than they did at dawn. Cart lurches forward — a free mile, maybe two. But the wind's been pushing smoke all morning and smoke means fire somewhere west."

*(Shorter sentences. Specific consequence. Removes fortune-cookie line, implies danger.)*

---

### 1.2 `plains_buffalo_hunt_camp` (events.js:77)
**Current:**
> "You crest a rise and the world opens below — a massive buffalo hunt camp spreads across the valley, hundreds of carts in a great circle. The air is thick with dust and the sound of running horses. Four hundred mounted huntsmen await the signal, and the earth trembles beneath the hooves of the herd beyond."

**Problems:**
- "the world opens below" — stock phrase
- "the air is thick with dust" — generic sensory
- "the earth trembles" — cliché
- Two sentences start with "The"

**Rewrite:**
> "Cart crests the rise and you pull the ox up short. Below: a hundred carts in a circle, horses everywhere, dust so thick you can taste it. Four hundred hunters sitting quiet, waiting for the sign. Beyond them the herd — you feel the hooves through the ground before you hear them."

*(Point-of-view shift — "Cart crests" not "You crest." Breaks sentence patterns. Removes "world opens," "air is thick," "earth trembles.")*

---

### 1.3 `plains_night_camp` (events.js:43)
**Current:**
> "Moonlight spills across the prairie, turning the grass to silver. Somewhere nearby a fiddle begins a Red River jig, the notes carrying clean and sharp through the still air. Voices rise in song — French and Michif, old tunes from the Red River settlements. The crew listens, and for a moment the trail feels like home."

**Problems:**
- "turning the grass to silver" — AI poetry, not how a carter thinks
- "the trail feels like home" — emotional telling
- Every sentence is ~15 words
- "Moonlight spills" is the most AI sentence in the entire game

**Rewrite:**
> "Moon on the grass. A fiddle starts up somewhere down the line — a Red River jig, sharp enough to cut. French and Michif voices carry across the dark. One of the crew starts humming along."

*(Removes poetry. Shows effect on crew rather than assigning emotion. Shorter sentences.)*

---

### 1.4 `plains_squeal` (events.js:61)
**Current:**
> "The dry wood of the hub screams against the axle — a blood-curdling sound that carries for miles across the open prairie. Every traveller on the trail knows that squeal. It means a loaded cart is coming, and the sound alone is enough to make oxen nervous and strangers take notice."

**Problems:**
- "blood-curdling" is the game's favorite adjective (used 2x, both for cart sounds) — overused
- "Every traveller on the trail knows" — telling
- Second sentence is info-dumping

This one is actually *well-written* for being sourced directly from Brehaut. The issue is the game uses "blood-curdling" again in endings. **Suggestion:** Change one of them to something else — "unnecessary" or "shrill" or "enough to curl your teeth."

---

### 1.5 `plains_hail` (events.js:150)
**Current:**
> "The sky turns green and the air goes still — then the hail comes. Stones the size of walnuts hammer the canvas cover and bounce off the cart bed. The oxen bellow and strain at their traces. There is no shelter on the open prairie, only the cart and whatever you can do to protect it."

**Problems:**
- "There is no shelter on the open prairie" — stands out as narration-as-lesson
- "whatever you can do to protect it" — passive, generic

**Rewrite:**
> "Green sky. Dead still. Then the hail — walnut stones hammering the canvas, bouncing off the cart bed. The oxen bellow and pull sideways. On the open prairie the cart is all you've got."

*(Shorter sentences. Removes narrator voice. "Green sky. Dead still." — period carter terseness.)*

---

### 1.6 `river_mosquito_camp` (events.js:301)
**Current:**
> "The mosquitoes rise in clouds from the riverbank — a living fog that descends on man and beast alike. The oxen stampede; the cooking fire smoulders and dies. Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud, the cart trains made their way westward."

**Problems:**
- "man and beast alike" — formal, written-speak (Fonseca's voice bleeding through)
- "all prairie annoyances, including mud" — Fonseca's humor, but reads as AI list-making
- Last sentence switches to past tense / historical summary mid-event

**Rewrite:**
> "Mosquitoes rise from the riverbank in a cloud — you breathe them, they're in your eyes. The oxen stampede. The fire dies under the smoke. Sand flies after. Mud everywhere. The carts keep moving west because stopping is worse."

*(Present tense throughout. Specific physical details. Cuts the "man and beast alike.")*

---

### 1.7 `river_cholera_camp` (events.js:292)
**Current:**
> "A member of your crew wakes shaking and cold — by midday they cannot stand. The river water was contaminated, a waterborne bacteria that thrived in the stagnant water of common camping grounds. The trail has seen this before, and it is never gentle."

**Problems:**
- "waterborne bacteria" — anachronistic scientific language (a carter wouldn't say this in 1878)
- "The trail has seen this before, and it is never gentle" — fortune cookie narrator voice

**Rewrite:**
> "One of your crew wakes shaking. By noon they can't stand. The river water — you knew better, but the casks were low. The trail's seen this before. It doesn't get easier."

*(Removes anachronistic "bacteria." Shortens. "You knew better" adds culpability.)*

---

### 1.8 `upland_bison_herd` (events.js:530)
**Current:**
> "The trail vanishes beneath a sea of brown backs. A buffalo herd — thousands strong — blocks the path ahead, the earth trembling beneath their hooves. The oxen low and pull at their traces, eyes rolling white. You cannot go around; the herd stretches to the horizon on both sides."

**Problems:**
- "sea of brown backs" — stock phrase
- "the earth trembling" — same cliché as the hunt camp
- "eyes rolling white" — AI horse/battle description cliché
- "You cannot go around" — narrator telling player what's obvious

**Rewrite:**
> "The trail's gone. Buffalo everywhere — thousands, maybe ten thousand, brown humps to the horizon on both sides. The ground shakes. Your ox won't go forward, eyes white, pulling sideways."

*(Removes "sea." Removes "cannot go around." Uses "Your ox" for immediacy. Fewer words.)*

---

### 1.9 `upland_storm_shelter` (events.js:540)
**Current:**
> "The sky turns green and the air goes still — then the hail comes. Stones the size of walnuts hammer the canvas cover. Lightning finds the highest point, and the ridge offers no shelter. The oxen bellow and strain against their traces."

**Problems:**
- Identical opening to `plains_hail` ("The sky turns green and the air goes still") — repetition across terrain pools
- Same walnut-sized hail

**Rewrite:**
> "Green sky. Then the hail starts — stones hammering the canvas. Lightning hits the ridge above. No up there, no cover here. The oxen bellow and sit down."

*(Different from plains_hail. "Sit down" is specific behavioral detail.)*

---

## 2. Endings

### 2.1 `victory` high (ENDINGS.js:8)
**Current:**
> "You crest the final ridge and the palisade walls of Fort Edmonton rise from the riverbank below. Your cart has held. Your crew stands strong behind you. The trade goods in your load — furs, hides, crafted wares — will fetch fair prices at the post. You made the Carlton Trail in good order, and the West will remember your name."

**Problems:**
- "The West will remember your name" — wildly grandiose for a cart trip
- Three sentences of "[subject] has [past participle]" structure
- "in good order" — formal, written

**Rewrite:**
> "The palisade walls at Edmonton. Your cart made it — axle held, wheels still on. The crew's behind you, hollow-eyed but standing. You've still got furs in the cart. They'll fetch something."

*(Shorter. Grounded. Removes "West will remember your name." Crew description more specific.)*

---

### 2.2 `starvation` high (ENDINGS.js:31)
**Current:**
> "The food ran out on the open prairie. No amount of foraging could stretch the rations far enough. The crew weakened day by day until the oxen could no longer pull the loaded cart. You were forced to camp and wait for rescue that might never come. The Carlton Trail gives nothing for free."

**Problems:**
- "The Carlton Trail gives nothing for free" — same structure as "the prairie gives nothing without a price" in plains_wind. The game loves this pattern.
- Passive voice: "You were forced," "could no longer pull"
- "rescue that might never come" — weak ending line

**Rewrite:**
> "Food's gone. Three days of foraging turned up nothing but bitter roots. The oxen can't pull anymore. You make camp and wait. The nearest post is days away on foot, and you're not walking."

*(Active. Specific. Removes fortune-cookie trail quote.)*

---

### 2.3 `abandoned` high (ENDINGS.js:64)
**Current:**
> "The crew stops at the next rise and refuses to go further. Too many broken wheels, too many nights without food, too many miles of empty prairie. The morale that held them together has finally broken. You cannot force them. The trail before you remains unrolled, but the will to follow it is gone."

**Problems:**
- "Too many broken wheels, too many nights…" — anaphora, AI loves this
- "The morale that held them together has finally broken" — mechanical language in narrative
- "remains unrolled" — poetic but wrong metaphor

**Rewrite:**
> "The crew stops at the rise. Won't go further. Three broken wheels in two weeks. Six nights without enough food. One of them sits down in the grass and stares. The others follow. You can't force them. The trail goes on. They don't."

*(Shatters sentence structure. Removes mechanical "morale" language. "The trail goes on. They don't." is the emotional punch.)*

---

### 2.4 `winter` high (ENDINGS.js:53)
**Current:**
> "The first snow falls soft and silent, covering the trail ahead. You know what it means — the Carlton Trail will soon disappear under deep snow, impassable until spring. Edmonton is still days away. The cold seeps into the cart, into the crew, into the oxen. This is as far as you go."

**Problems:**
- "falls soft and silent" — AI poetry
- "seeps into X, into Y, into Z" — anaphora again
- Last line is too narrator-voice

**Rewrite:**
> "First snow. Soft enough, but you know what it means. The trail will be gone by morning — snow-filled ruts, white ground, no way to follow the track. Edmonton's still four days west. The cold goes right through the cart boards. You're done."

*(Removes poetry. Adds specific number ("four days.") "You're done" closer to how a carter would think it.)*

---

## 3. Travel Fragments

Travel fragments are the most repetitive section — they need the most work but also have the lowest individual impact since players see only one per terrain per crew state.

### 3.1 Structural issue

Most fragments follow the same pattern:
> "The [terrain feature] [verb] [prepositional phrase]. The [crew/animal] [verb] [description]."

Example batch from `plains/rested` (`main.js:176-180`):
- "The prairie stretches flat and endless. The ox leans into the traces, steady as the sunrise."
- "A warm wind pushes at your back. The grass ripples like a green sea beneath the sky."
- "The cart rolls smooth over open ground. Hawks circle high above, riding thermals."
- "Miles of unbroken prairie. The ox knows the rhythm — step, pull, breathe, repeat."

**Problems:**
- #1 and #3 are generic scenic description — could be any trail
- #2: "green sea" again
- #4 is the best — specific to this trail, this animal, this motion

**Suggestion:** Rewrite plains/rested to be more specific:
- "Flat prairie, no trees, no hills. Just the ox and the cart and the sky." (removes scenic beauty, adds monotony)
- "Wind at your back. Good day for miles." (period-carter voice)
- "The ox knows the rhythm. Step, pull, breathe. Step, pull, breathe." (keep #4 — it's good)
- "Ruts deep enough to guide the wheels. Someone came through here yesterday." (trail-specific detail)

### 3.2 Weather fragments

The weather fragments (`main.js:194-218`) are better than the crew-state ones — more specific imagery. But they still fall into patterns:
- Rain: "drums," "streams," "drip," "sodden" — all expected
- Storm: "thunder," "lightning," "wind," "hail" — no surprises
- Snow: "white," "cold," "ice" — generic

**Suggestion:** Add 1 unexpected detail per weather type. Rain that smells like sage. Storm lightning that makes the cart's metal parts ring. Snow so dry it doesn't stick.

---

## 4. Camp Flavor

Camp flavor (`main.js:1141-1248`) is generally the best-written section — more specific, less poetic, more grounded.

### 4.1 What works

- "Berry bushes heavy with saskatoon fruit, and a patch of wild turnips beside a creek." (`main.js:1161`) — specific plants, specific place
- "A young bull, separated from the herd. The shot is clean and the butchering efficient." (`main.js:1178`) — gunner's language, not poet's
- "The ground is too hard to drive tent pegs." (`main.js:570`, upland_night_frost via source) — concrete detail

### 4.2 What needs work

**Dance high tier** (`main.js:1222`):
> "The fiddle starts and the crew dances until the fire burns low. Laughter echoes across the prairie. Tomorrow feels lighter."

- "Laughter echoes across the prairie" — AI generic
- "Tomorrow feels lighter" — emotional telling

**Rewrite:**
> "The fiddle starts and the crew dances until the fire burns low. Someone's boots throw sparks. A Red River jig, then a reel. Nobody talks about tomorrow."

**Dance mid tier** (`main.js:1231`):
> "Some dancing, some songs. The crew enjoys themselves well enough. Morale improves."

- This is filler. "Morale improves" is mechanical, not narrative.
- "enjoys themselves well enough" — faint praise

**Rewrite:**
> "A few songs. Some half-hearted dancing. Nobody's heart's in it, but the fire's warm and the night passes."

**Forage low tier** (`main.js:1172-1174`):
- "The land is stingy" — personification, minor
- "A wasted afternoon" — repetitive (also used in forage low #2)

**Scout low tier** (`main.js:1199-1201`):
All three use some form of "returns with nothing useful." Repetitive.

---

## 5. Source Quotes

### 5.1 Overuse of specific words across quotes

The word "blood-curdling" appears in `BREHAUT_CART` and is referenced/shaped the cart squeal events. It's the right word for the source — but the game also uses similar "intense sensation" language in original text. **Not a source issue, but a style bleed.**

### 5.2 Source quotes that break immersion when displayed

`MMF_COMMUNITIES` (`sources.js:180-185`): "The Métis communities along the Carlton Trail were bound together by kinship, the French language, and the Catholic faith."

- This is written in the style of a museum plaque, not a primary source. When displayed in-game as a "source quote," it reads as Wikipedia, not history.
- Same issue with `CARLTON_TRAIL` and `NWMP_HISTORY` — these are secondary summaries, not period voices.

**Suggestion:** Either reformat these as "historical note" vs "source quote," or replace with actual period excerpts that have a voice.

---

## 6. Intro/UI Text

### 6.1 Intro flavor text (template.html:1258-1265)
**Current:**
> "It is June 15th, 1878. You stand at Fort Garry with a loaded Red River cart, a strong ox, and a long road ahead.
> Five hundred and sixty-seven miles of prairie, river crossings, and rough trail stretch between you and Fort Edmonton. You have until November — before the snow flies and the Carlton Trail disappears under winter.
> Your cart is loaded with pemmican, tools, and trade goods. The bison hides and beaver pelts in your cart are worth good money at Edmonton — if you can get them there in one piece.
> The trail is unforgiving. Rivers run high. The cart wears down. Your crew tires. Every day on the trail costs food, and food doesn't grow on the prairie."

**Problems:**
- "The trail is unforgiving" — repeats the same line used across the game
- "food doesn't grow on the prairie" — AI writer's voice, not carter's
- Last three sentences are all "[subject] [verb] [adjective]" — same rhythm

**Rewrite:**
> "June 15th, 1878. Fort Garry behind you. Five hundred and sixty-seven miles ahead.
> The Carlton Trail to Edmonton runs through prairie, river crossings, and rough ground. You've got until November before the snow comes and the trail disappears.
> Your cart's loaded: pemmican, tools, bison hides, beaver pelts. Good money at Edmonton if you get there.
> One food per day. Cart wears down every mile. The rivers run high in June and the prairie doesn't give anything back."

*(Shorter. More mechanical — a carter would think in costs and distances.)*

### 6.2 Trail Intel UI

The trail intel freshness indicators (🟢🟡🔴) are good UX. No writing issues.

### 6.3 Pre-departure briefing (template.html:1292)
> "\"Five hundred and sixty-seven miles to Fort Edmonton. You've got until November before the snow buries the Carlton Trail. Your Red River cart carries 100 kg max — every kilogram counts.\""

This is the best VOICE in the entire game. Contradictory, specific, spoken by a character. **This is the model for how all the text should sound.**

---

## 7. The "Prairie Gives Nothing" Problem

The most pervasive AIism in this game is the **sententious closing line** — a short, wise-sounding sentence that closes an event or fragment:

| Location | Line |
|---|---|
| events.js:25 (plains_wind) | "the prairie gives nothing without a price" |
| events.js:72 (plains_squeal) | "The day's miles do not lessen the complaint" |
| events.js:89 (plains_prairie_fire) | "The dry grass crackles at its edge" — ok, atmospheric |
| events.js:136 (plains_axle_snap) | "You bury the crated freight and mark the spot" — good, specific |
| ENDINGS.js:34 (starvation) | "The Carlton Trail gives nothing for free" |
| ENDINGS.js:57 (winter) | "There is no outrunning the season" |

**The pattern:** X gives nothing / Y does not Z / there is no W.

**Suggestion:** Delete 3 of these 4. Keep the one that's most specific to its context. The closing-ism is an AI tic — real period writing tended to end on action or detail, not wisdom.

---

## 8. Priority Rewrite List

**High impact (change these first):**

1. `plains_night_camp` — remove "turning the grass to silver" and "trail feels like home" 
2. `plains_buffalo_hunt_camp` — remove "the world opens below" and "earth trembles"
3. `intro flavor text` — shorten last three sentences, remove "food doesn't grow on the prairie"
4. `victory high ending` — remove "the West will remember your name"
5. `river_cholera_camp` — remove "waterborne bacteria"
6. `abandoned high ending` — rewrite anaphora
7. `winter high ending` — remove "falls soft and silent" and "seeps into" anaphora
8. Upland storm / plains hail — differentiate the two "green sky" openings

**Medium impact:**
9. `upland_bison_herd` — remove "sea of brown backs" and "earth trembling"
10. `river_mosquito_camp` — fix tense switch
11. Plains/rested travel fragments — add specific trail details
12. Scout low-tier flavor — remove repetitive "returns with nothing"
13. Dance mid-tier flavor — replace "morale improves"

**Low impact:**
14. Remove 3 of 4 sententious closing lines
15. Differentiate "blood-curdling" usage between squeal and endings
16. Forage low — remove "The land is stingy" personification

---

## 9. General Anti-AI Writing Rules for This Project

Based on findings, these should guide future text additions:

1. **No anaphora** (no "The X… The Y… The Z…" sentence openings)
2. **No fortune cookie closings** (no "the [place] [verbs] [abstract noun]")
3. **limit generic sensory** (no "the air is thick," "the wind cuts," "the earth trembles")
4. **Max 2 sentences of same length in a row**
5. **End on detail, not wisdom**
6. **Use carter's voice** — short, specific, material-cost-aware (the pre-departure briefing is the model)
7. **Every sentence should contain one specific, concrete detail** — if it could appear on any trail in any century, rewrite it
8. **Prefer "Your [thing]" over "The [thing]"** — point-of-view grounding

---

*Review based on close reading of `src/data/events.js` (700 lines), `src/data/endings.js` (70 lines), `src/data/sources/index.js` (405 lines), `src/main.js` (1636 lines), `src/template.html` (1461 lines), and `src/data/nodes.js` (232 lines). Line numbers refer to the source files as committed on 2026-06-09.*
