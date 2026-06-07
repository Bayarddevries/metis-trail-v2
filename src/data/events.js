import { NODES } from './nodes.js';
import { getSource } from '../data/sources/index.js';

export const EVENT_POOLS = {
  plains: [
    {
      id: 'plains_trader',
      text: 'A Métis freighter catches up to your cart, his own load shifting and groaning with every rut. He eyes your cargo and offers a short-term deal — he knows a shortcut to the next post, one that saves a day if the weather holds. The trail has its own economy, and information is worth as much as pemmican.',
      classification: 'Freight & Trade',
      source: getSource('MMF_COMMUNITIES'),
      choices: [
        { text: 'Hire him as a scout', dc: 11, ok: 'He rides ahead and spots a safer campsite.', bad: 'He takes the easy path and you lose a day.', wear: 0, time: -1, addsRep: { key: 'metis', delta: 1 }, branch: {
          id: 'plains_scout_return',
          text: 'The scout returns with news: a lone HBC clerk is stranded with a broken cart ahead.',
          choices: [
            { text: 'Help tow them to the next post', dc: 10, ok: 'They are grateful. The clerk gives you trade goods.', bad: 'The axle breaks under the strain.', wear: 1, food: 4, setsFlag: 'helped_hbc', addsRep: { key: 'hbc', delta: 1 } },
            { text: 'Tip your hat and press on', dc: null, always: 'You do not have time for strangers.' }
          ]
        } },
        { text: 'Refuse', dc: null, always: 'You keep to your own pace.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_wind',
      text: 'A hot wind pushes at your back, carrying the smell of sun-baked grass and distant smoke. The prairie grass ripples in long waves like a green sea, and the oxen lean into their traces with new energy. Your cart groans but the wheels turn faster — the wind is a gift, but the prairie gives nothing without a price.',
      source: getSource('LACOMBE_JOURNALS'),
      choices: [
        { text: 'Run with it', dc: 10, ok: 'You make excellent time.', bad: 'A hidden rut jolts the cart. Repairs are needed after crossing.', wear: 1, time: -1 },
        { text: 'Hunker down', dc: null, always: 'You wrap the load and keep moving. No rain comes.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_camp_cookery',
      text: 'Midday halt by a cattail slough. Pemmican is passed around; bannock is frying in a cast-iron pan, the smell of grease and onions drifting across the camp. A Métis campsite nearby offers company — strangers become friends over shared food and stories of the trail behind.',
      source: getSource('FONSECA_CAMP'),
      choices: [
        { text: 'Share rubaboo and trade stories', dc: 8, ok: 'The circle of travellers is warm. Morale rises.', bad: 'You are too guarded to connect fully.', morale: 8, addsRep: { key: 'metis', delta: 1 }, setsFlag: 'shared_camp_meal' },
        { text: 'Eat quickly and move on', dc: null, always: 'Hunger is satisfied, but nothing more.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_night_camp',
      text: 'Moonlight spills across the prairie, turning the grass to silver. Somewhere nearby a fiddle begins a Red River jig, the notes carrying clean and sharp through the still air. Voices rise in song — French and Michif, old tunes from the Red River settlements. The crew listens, and for a moment the trail feels like home.',
      source: getSource('FONSECA_DANCE'),
      choices: [
        { text: 'Dance until your boots throw dust', dc: 10, ok: 'Laughter drowns out the dark.', bad: 'You strain a shoulder and sleep poorly.', morale: 12, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Turn in early; tomorrow is long', dc: null, always: 'Rest restores you in small measure.', morale: 4 }
      ]
    },
    {
      id: 'plains_ox_scatter',
      text: 'The oxen have scattered after drinking — a chaos of traces and running hooves across the mid-day camp. Ropes tangle, carts shift, and the air fills with shouting. To drive the refractory animals among the carts is a last resort, but sometimes the only one.',
      source: getSource('FONSECA_OX_SCATTER'),
      choices: [
        { text: 'Call and whistle them back', dc: 11, ok: 'The animals respond to the familiar sounds.', bad: 'You lose an hour rounding them up.', time: 1, morale: -4 },
        { text: 'Send someone ahead', dc: 9, ok: 'Your crew brings them in quietly and quickly.', bad: 'One runner turns an ankle.', crew: 'tired', addsRep: { key: 'metis', delta: 1 } }
      ]
    },
    {
      id: 'plains_squeal',
      text: 'The dry wood of the hub screams against the axle — a blood-curdling sound that carries for miles across the open prairie. Every traveller on the trail knows that squeal. It means a loaded cart is coming, and the sound alone is enough to make oxen nervous and strangers take notice.',
      source: getSource('BREHAUT_CART'),
      choices: [
        { text: 'Apply shaganappi before it worsens', dc: 7, ok: 'The scream quiets. The trail is kinder.', bad: 'Insufficient grease; the noise persists.', morale: -3, squeal: 0, branch: {
          id: 'plains_squeal_draw_attention',
          text: 'Your squealing cart draws a mounted rider from a nearby coulée.',
          choices: [
            { text: 'Stand your ground', dc: 10, ok: 'He is a Métis trader simply curious.', bad: 'He is a rough type; you hand over a small toll.', food: -2, addsRep: { key: 'metis', delta: -1 } },
            { text: 'Offer a quiet trade', dc: 9, ok: 'He tips his hat and moves on.', bad: 'He senses weakness and haggles hard.', food: -1 }
          ]
        } },
        { text: 'Ignore the noise', dc: null, always: 'The day\'s miles do not lessen the complaint.', alwaysWear: 0, squeal: 25 }
      ]
    },
    {
      id: 'plains_buffalo_hunt_camp',
      text: 'You crest a rise and the world opens below — a massive buffalo hunt camp spreads across the valley, hundreds of carts in a great circle. The air is thick with dust and the sound of running horses. Four hundred mounted huntsmen await the signal, and the earth trembles beneath the hooves of the herd beyond.',
      source: getSource('GOULET_HUNT'),
      choices: [
        { text: 'Join the hunt', dc: 12, ok: 'The hunt captain nods. You take a share of the meat.', bad: 'You are slow to position. You earn only a strip.', food: 8, addsRep: { key: 'metis', delta: 2 }, itemBonus: { name: 'Ammunition Belt', dcBonus: 3 } },
        { text: 'Observe and move on', dc: null, always: 'You watch from a respectful distance. The hunt is spectacular.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_prairie_fire',
      text: 'Smoke on the horizon, thick and brown against the blue sky. Then the wind shifts and the smell hits you — dry grass, pine, and the acrid bite of a prairie fire racing toward you. The dry grass crackles at its edge, and the wall of flame moves faster than a man can run.',
      source: getSource('LACOMBE_FIRE'),
      choices: [
        { text: 'Ride for the river bottom', dc: 14, ok: 'The fire edge passes. You lose only an afternoon\'s travel.', bad: 'The wind shifts. You lose supplies and the cart is singed.', food: -3, wear: 1, morale: -12 },
        { text: 'Light a backfire and wait it out', dc: 11, ok: 'A practised escape. The backfire draws the main blaze away.', bad: 'The flames jump. Your cart is spared but the oxen panic.', morale: -8, time: -1 }
      ]
    },
    {
      id: 'plains_sayer_trial',
      text: 'A Métis settlement celebrates the anniversary of the Sayer trial — the day free trade became a right, not a privilege. The air is thick with pride and the smell of roasting meat. Folk cheer for independent carters, and your cart is a symbol of that freedom.',
      source: getSource('SAWYER_TRIAL'),
      choices: [
        { text: 'Display independent freight proudly', dc: 9, ok: 'The folk cheer. Prices are better here.', bad: 'You are taken for a Company man. Prices are unkind.', food: 5, addsRep: { key: 'metis', delta: 2 } },
        { text: 'Stay quiet and keep moving', dc: null, always: 'Circumspection keeps your goods and your secrets.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_burnt_prairie',
      text: 'The prairie here has been burnt black — no grass, no water, and the sun is relentless. The ground is ash underfoot, and the air shimmers with heat. Bichon, the patient ox, would do his best and, failing, would lie down in the one. You must decide whether to push through or find a way around.',
      source: getSource('SCHULTZ_BURNT'),
      choices: [
        { text: 'Push through to the next water', dc: 12, ok: 'You make the crossing with grit.', bad: 'The oxen lag. You are forced to camp on burnt ground.', food: -2, crew: 'tired' },
        { text: 'Detour to a shaded coulee', dc: null, always: 'A slower, safer day. Grass and water restore the animals.', time: 1 }
      ]
    },
    {
      id: 'plains_sand_hills',
      text: 'The ground turns treacherous — old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of these stumps and coulees. The cart lurches and groans with every hidden obstacle.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Hug the ridge line to avoid low ground', dc: 11, ok: 'Clear ground saves the cart.', bad: 'A hidden stump catches the wheel hub.', wear: 1, morale: -4 },
        { text: 'Take the direct trail', dc: null, always: 'The going is rough but quick.', alwaysWear: 0 }
      ]
    },
    {
      id: 'wooded_windfall',
      text: 'A great elm has fallen across the trail — branches splayed like fingers blocking the path. The trunk is too heavy to move, and the bush on either side is thick with undergrowth. You will need to cut your way through or find another route entirely.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Cut a way through', dc: 10, ok: 'The path opens. Useful firewood goes on the cart.', bad: 'The work is harder than expected.', time: 1 },
        { text: 'Bypass through the bush', dc: 11, ok: 'The bush breaks open onto the old trail.', bad: 'A branch catches the canvas cover.', wear: 1 },
        { text: 'Backtrack to the ford', dc: null, always: 'A long, slow re-route. But safe.', time: 2 }
      ]
    },
    {
      id: 'plains_axle_snap',
      text: 'A sickening crack — the right axle shears against a hidden stone half-buried in yesterday\'s washout. The cart lurches and the load shifts. You are miles from the nearest post, and the tools for a proper repair are back at the settlement. A jury-rig will have to hold.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Set a splice with rope and wedges', dc: 11, ok: 'A jury-rig holds. Progress is slow, but the cart is rolling again.', bad: 'The splice splits by noon.', wear: 1, time: 1, morale: -4 },
        { text: 'Cache the load and press on light', dc: null, always: 'You bury the crated freight and mark the spot. The cart is light, but you return poorer.', time: -1, food: -4 }
      ]
    },
    {
      id: 'plains_bear_camp',
      text: 'Dawn finds a cinnamon bear rooting through your bread sack at the edge of camp. The bears along the Carlton were a constant threat to unprotected provisions. This one is bold — it has smelled the pemmican and it is not leaving without a fight.',
      source: getSource('LACOMBE_BEAR'),
      choices: [
        { text: 'Beat the pan and drive it off', dc: 11, ok: 'The bear lumbers away with a swat at its nose.', bad: 'It turns. A strap snaps and half the flour is gone.', food: -3, morale: -6, wear: 1, itemBonus: { name: 'Ammunition Belt', dcBonus: 4 } },
        { text: 'Climb for height and wait', dc: null, always: 'The bear eventually loses interest. You lose the morning, not the flour.', time: 1 }
      ]
    },
    {
      id: 'plains_hail',
      text: 'The sky turns green and the air goes still — then the hail comes. Stones the size of walnuts hammer the canvas cover and bounce off the cart bed. The oxen bellow and strain at their traces. There is no shelter on the open prairie, only the cart and whatever you can do to protect it.',
      source: getSource('LACOMBE_HAIL'),
      choices: [
        { text: 'Cover the canvas and ride it out', dc: 10, ok: 'The wagon top holds. The oxen are skittish but unhurt.', bad: 'Canvas tears and two rounds of cheese are spoiled.', food: -2, morale: -4, itemBonus: { name: 'Canvas Tarp', dcBonus: 4 } },
        { text: 'Scramble to the nearest coulee', dc: 9, ok: 'Natural shelter saves the load.', bad: 'A slipped wheel in the rush.', wear: 1 }
      ]
    },
    {
      id: 'plains_theft',
      text: 'Camp is crowded — too many carts, too many strangers. You wake to find a small bundle of trade goods missing from the cart pole. Thefts at rendezvous camps were usually petty and punished by the trail\'s own informal courts, but finding the thief among fifty families is another matter.',
      source: getSource('MMF_TRAIL_JUSTICE'),
      choices: [
        { text: 'Tell the camp overseer and help search', dc: 9, ok: 'The goods are returned. The thief is ordered to pay in labour.', addsRep: { key: 'metis', delta: 1 } },
        { text: 'Write it off and tighten watch', dc: null, always: 'Pragmatic. The trail teaches scarcity.', alwaysWear: 0, morale: -2 }
      ]
    }
  ],
  river_valley: [
    {
      id: 'river_valley_sudden_rain',
      text: 'The heavy cloud bursts without warning. The trail turns to a slurry and the cart sinks to the naves — the wheels disappearing into mud that grabs and holds. Sudden storms of rain turned the valley trail into a bog that could trap a loaded cart for hours.',
      source: getSource('LACOMBE_HAIL'),
      choices: [
        { text: 'Unhitch and pole the cart through', dc: 12, ok: 'The oxen respond; you keep moving, soaked.', bad: 'A wheel hub sinks axle-deep.', wear: 1, morale: -4, itemBonus: { name: 'Rope (50ft)', dcBonus: 3 } },
        { text: 'Wait it out on dry ground', dc: null, always: 'Two hours of rain. The mud thickens.', time: 1 }
      ]
    },
    {
      id: 'river_valley_broken_axle',
      text: 'A hidden washout has eaten into the bank. The cart slews and the axle groans — a sound that makes every carter\'s stomach drop. The ground gives way beneath the wheel, and the cart tilts toward the river. You need a repair, and you need it before the bank collapses further.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Set a temporary truss with canvas and rope', dc: 11, ok: 'A crude repair holds for the remaining miles.', bad: 'The truss fails in the next gully.', wear: 1, time: 1 },
        { text: 'Spike the wheel and coast downhill', dc: null, always: 'You save time but the wheel wobbles loose.', alwaysWear: 1, morale: -4 }
      ]
    },
    {
      id: 'river_high',
      text: 'The river is running high and fast, brown with spring melt. The bank trail is muddy and narrow — one wrong step and the cart slides toward the water. The carts had indeed entered straight into the water, turned upstream to make the crossing in a horse-shoe fashion. You must decide: risk the ford or wait for calmer water.',
      source: getSource('FONSECA_FORD'),
      choices: [
        { text: 'Ford carefully', dc: 13, ok: 'The ox keeps footing and you stay dry enough.', bad: 'The cart tilts in the current. Repairs are needed after crossing.', wear: 1 },
        { text: 'Wait for afternoon', dc: null, always: 'You camp and cross later when the water drops.', time: 1 },
        { text: 'Scout for the horse-shoe ford upstream', dc: 11, ok: 'You find the concealed path and cross safely.', bad: 'The scouting costs precious daylight and energy.', morale: -4, time: -1 }
      ]
    },
    {
      id: 'river_mp_check',
      text: 'An NWMP patrol stops you just above the ferry landing. Red coats inspect the carts with scrupulous care — duty is collected in cash or goods, and every cart is subject to inspection. The mounted police established posts along the trail to enforce Ottawa\'s regulations.',
      source: getSource('MACLEOD_NWMP'),
      choices: [
        { text: 'Show your papers', dc: 9, ok: 'The permits read clearly. They let you pass.', bad: 'A signature mismatch. You are delayed.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
        { text: 'Talk your way past', dc: 12, ok: 'They accept your story.', bad: 'They insist on a spot inspection. Wear is likely.', wear: 1, addsRep: { key: 'nwmp', delta: -1 }, branch: () => ({
          id: 'nwmp_detain',
          text: 'The inspection turns up a loose rivet in your axle. The sergeant orders you to make camp until morning.',
          choices: [
            { text: 'Comply and camp for the night', dc: null, always: 'The sergeant inspects in the morning and lets you go.', time: 1, addsRep: { key: 'nwmp', delta: 1 } },
            { text: 'Argue your case', dc: 10, ok: 'The sergeant relents, but writes your name in the ledger.', bad: 'You are held another full day.', time: 2, wear: 1 }
          ]
        })}
      ]
    },
    {
      id: 'river_valley_bank_descent',
      text: 'The opposite bank is steep — eight feet of loose earth down to the water. A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank. The cart must be lowered carefully, or the whole thing slides into the river.',
      source: getSource('FONSECA_BANK'),
      choices: [
        { text: 'Lower the cart with a line tied to a tree', dc: 10, ok: 'A careful descent protects the load.', bad: 'The knot slips at the last moment; the cart jars.', wear: 1 },
        { text: 'Free descent', dc: null, always: 'The cart slides hard; the contents shift dangerously.', alwaysWear: 1 }
      ]
    },
    {
      id: 'river_boat',
      text: 'At a wide crossing the captain offers passage — but he is clearly understaffed and the ferry rocks with every wave. The current is heavy and the oarsman strains. You must decide whether to trust the ferry or find another way across.',
      source: getSource('FONSECA_FORD'),
      choices: [
        { text: 'Board and keep the load centred', dc: 11, ok: 'You ride the swell and land clean.', bad: 'A barrel breaks loose and damages a wheel.', wear: 1, food: -2, itemBonus: { name: 'Rope (50ft)', dcBonus: 3 } },
        { text: 'Wait for a larger brigade', dc: null, always: 'A safer but slower choice.', time: 2 }
      ]
    },
    {
      id: 'river_cholera_camp',
      text: 'A member of your crew wakes shaking and cold — by midday they cannot stand. The river water was contaminated, a waterborne bacteria that thrived in the stagnant water of common camping grounds. The trail has seen this before, and it is never gentle.',
      source: getSource('HBC_DISEASE'),
      choices: [
        { text: 'Use the medicine pouch and rest the day', dc: 14, ok: 'The crisis passes. One day lost, but the crew recovers.', bad: 'The fever breaks but the crew is weak for days.', crew: 'tired', morale: -8, consumesItem: 'Medicine Pouch' },
        { text: 'Push through without rest', dc: null, always: 'The worst passes but the toll is steep.', morale: -20, crew: 'exhausted' }
      ]
    },
    {
      id: 'river_mosquito_camp',
      text: 'The mosquitoes rise in clouds from the riverbank — a living fog that descends on man and beast alike. The oxen stampede; the cooking fire smoulders and dies. Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud, the cart trains made their way westward.',
      source: getSource('FONSECA_MOSQUITOES'),
      choices: [
        { text: 'Move camp to high ground before dark', dc: 9, ok: 'The move is miserable but the night is quieter.', bad: 'A wheel is twisted in the dark.', wear: 1 },
        { text: 'Use canvas tarps and tough it out', dc: 11, ok: 'You hunker down. Morning comes.', bad: 'The insects are relentless. Morale falls hard.', morale: -10, itemBonus: { name: 'Canvas Tarp', dcBonus: 4 } }
      ]
    },
    {
      id: 'river_cart_raft',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart — enough to build a raft, if you know how. Four cart wheels were taken and placed dish upwards on the surface of the water. The boat was launched, and floated like a duck.',
      source: getSource('FONSECA_RAFT'),
      choices: [
        { text: 'Build a cart-raft with 2 bison hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river; cargo gets wet.', morale: -6, setsFlag: 'built_rafts', requiresItem: { name: 'Bison Hide', count: 2 }, branch: {
          id: 'river_raft_wash',
          text: 'On the far bank, an elder watches your landing and nods slowly.',
          choices: [
            { text: 'Greet him respectfully', dc: 10, ok: 'He shares drying hides and directions for the next leg.', bad: 'He is suspicious and leaves without speaking.', addsRep: { key: 'cree', delta: 1 }, morale: 8 },
            { text: 'Get moving without conversation', dc: null, always: 'Pragmatic. The crossing cost enough time.', alwaysWear: 0 }
          ]
        } },
        { text: 'Ford the cart carefully', dc: 13, ok: 'The ox swims straight and true; the bed stays high.', bad: 'The current turns the cart. Wet freight and one damaged wheel.', wear: 2, food: -2 }
      ]
    },
    {
      id: 'ferry_gabriel',
      text: 'Gabriel Dumont is at the crossing, his ferry moored to the bank. His fee is fair, but the current is heavy today — the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.',
      source: getSource('DUMONT_ACCOUNTS'),
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
      ]
    },
    {
      id: 'river_valley_flood_crossing',
      text: 'The spring flood has turned the river into a brown, churning torrent. Debris spins in the current — branches, logs, the remains of last year\'s ice. The ford is barely visible, marked by two willow sticks driven into the bank. The oxen smell the water and balk.',
      source: getSource('FONSECA_FORD'),
      choices: [
        { text: 'Ford now while you can see the markers', dc: 14, ok: 'The oxen find their footing. The cart tilts but holds. You reach the far bank soaked but whole.', bad: 'A submerged log catches the axle. The cart spins in the current.', wear: 2, food: -2 },
        { text: 'Wait for the water to drop', dc: null, always: 'You camp on the high bank and wait. The river drops by morning.', time: 1 },
        { text: 'Build a cart-raft with 2 Bison Hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river. Cargo gets wet.', morale: -6, requiresItem: { name: 'Bison Hide', count: 2 } }
      ]
    },
    {
      id: 'river_valley_trader_encounter',
      text: 'A lone trader crests the rise ahead, his cart loaded with bundles wrapped in oilcloth. He waves — a free trader, independent of the Company, carrying goods from settlement to settlement. His prices are his own, and his news is fresh.',
      source: getSource('SAWYER_TRIAL'),
      choices: [
        { text: 'Trade with him', dc: null, always: 'You exchange one of his goods for one of yours. Fair value, no questions asked.', morale: 5 },
        { text: 'Buy information about the trail ahead', dc: 8, ok: 'He shares what he knows — which posts have supplies, which trails are washed out.', bad: 'He is close-mouth about conditions ahead. You learn little.', morale: 3 },
        { text: 'Refuse and keep moving', dc: null, always: 'You tip your hat and press on. Not all strangers are friends.' }
      ]
    },
    {
      id: 'river_valley_mission_garden',
      text: 'A small mission sits in the river valley, its garden a shock of green against the brown prairie. Rows of potatoes, turnips, and beans grow behind a wooden fence. The missionary offers freely — the garden is God\'s, and God\'s gifts are for all.',
      source: getSource('GREY_NUNS'),
      choices: [
        { text: 'Accept the offering gratefully', dc: null, always: 'Fresh food after weeks of pemmican. The crew eats like kings.', food: 4, morale: 10 },
        { text: 'Trade labor for extra supplies', dc: null, always: 'You help with the harvest in exchange for a full basket. The missionary is grateful.', food: 6, time: 1 },
        { text: 'Move on — you cannot spare the time', dc: null, always: 'The trail waits for no one. You press west.' }
      ]
    }
  ],
  wooded: [
    {
      id: 'wooded_cree',
      text: 'A Cree hunter steps onto the trail ahead, his rifle resting easy in the crook of his arm. He studies your cart and nods at the pemmican sacks — a gesture of recognition between peoples who know the same hunger. The wooded corridors of the Carlton Trail were meeting places, where Métis and Cree traded goods and news.',
      source: getSource('MMF_COMMUNITIES'),
      choices: [
        { text: 'Offer a trade', dc: 11, ok: 'He swaps fresh meat for part of your load.', bad: 'He senses you are short on food. The deal goes poorly.', food: 3, addsRep: { key: 'cree', delta: 1 }, itemBonus: { name: 'Ammunition Belt', dcBonus: 2 } },
        { text: 'Keep moving', dc: null, always: 'He watches but does not interfere.', alwaysWear: 0 }
      ]
    },
    {
      id: 'wooded_ambush_ravine',
      text: 'A hidden rut drops one wheel into a creek bed — the cart tilts dangerously, and the load shifts toward the ditch. Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails. Quick hands are needed now.',
      source: getSource('BREHAUT_CART'),
      choices: [
        { text: 'Catch the weight and right it', dc: 12, ok: 'Quick hands save the day.', bad: 'The cart upsets. One food item is lost.', food: -1, wear: 1, itemBonus: { name: 'Rope (50ft)', dcBonus: 3 } },
        { text: 'Call for help', dc: 9, ok: 'A nearby Métis party rights the cart swiftly.', bad: 'Helpers arrive slow and grumpy.', morale: -5, time: 1 }
      ]
    },
    {
      id: 'wooded_stung_by_flies',
      text: 'The mosquitoes and biting flies rise from the slough in a living cloud. The animals spook and the crew wants to run. Bound away to the water, into which they plunged neck deep, remaining there safe from the tormenting flies and mosquitoes.',
      source: getSource('FONSECA_MOSQUITOES'),
      choices: [
        { text: 'Drive through to firmer ground', dc: 11, ok: 'You outpace the worst of the cloud.', bad: 'The animals bolt; a strap snaps.', wear: 1, crew: 'tired' },
        { text: 'Let the oxen cool in the water', dc: null, always: 'The delay costs time but saves nerves.', time: 1 }
      ]
    },
    {
      id: 'wooded_black_bear',
      text: 'A black bear crosses the trail thirty yards ahead, then stops and turns, taking the measure of the party. Bears were common along the wooded corridors of the Carlton Trail and could be dangerous when surprised at close range. This one is calm — for now.',
      source: getSource('LACOMBE_BEAR'),
      choices: [
        { text: 'Stand your ground and make noise', dc: 12, ok: 'The bear veers away.', bad: 'It charges and the oxen bolt.', wear: 1, morale: -6, crew: 'tired' },
        { text: 'Back away quietly with the cart', dc: null, always: 'The bear waits until you are clear, then moves on.', time: 1 }
      ]
    },
    {
      id: 'wooded_rattlesnake',
      text: 'A rattlesnake hums in the grass beside the trail, still as a root until you are almost on it. Rattlesnakes were common on the southern stretches of the trail and caused many a nervous night. The lead ox smells it first and refuses to move.',
      source: getSource('SCHULTZ_RATTLESNAKE'),
      choices: [
        { text: 'Hook it clear with a pole and move on', dc: 10, ok: 'The snake disappears into the brush.', bad: 'It strikes at the lead ox.', wear: 1, morale: -2 },
        { text: 'Backtrack to a wider crossing', dc: null, always: 'A slow detour, but nerves settle.', time: 1 }
      ]
    },
    {
      id: 'wooded_axle_rut',
      text: 'A hidden washout drops the front wheel axle-deep. The cart tilts dangerously toward the ditch. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. You need to free the cart before the soil gives way completely.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Spade and block the wheel', dc: 11, ok: 'You free the cart without damage.', bad: 'The soil gives way twice.', time: 1, morale: -3 },
        { text: 'Lighten and rock it free', dc: 9, ok: 'A quick heave gets you out clean.', bad: 'A crate lands in the muck.', food: -2, wear: 1 }
      ]
    },
    {
      id: 'wooded_cree_elder',
      text: 'An old Cree man sits on a fallen log beside the trail, his pipe sending thin smoke into the still air. He watches your cart approach with calm eyes. When you stop, he speaks — not in English, but in gestures and a few French words. He knows these woods. He knows what lies ahead.',
      source: getSource('MMF_COMMUNITIES'),
      choices: [
        { text: 'Listen to what he has to say', dc: null, always: 'He points to the trail ahead, then draws a line in the dust. Warning or welcome — you cannot be sure, but the gesture is clear.', morale: 5 },
        { text: 'Offer a gift and trade words', dc: 9, ok: 'He accepts your offering and shares what he knows about the trail. His directions save you a day.', bad: 'He takes the gift but says little. Some knowledge is not for strangers.', morale: 3 },
        { text: 'Nod respectfully and move on', dc: null, always: 'You tip your hat and press west. The old man watches you go.' }
      ]
    },
    {
      id: 'wooded_bee_tree',
      text: 'A hollow oak, its trunk scarred by fire, hums with life. Wild bees stream in and out of a knot near the crown — a bee tree, full of honey. The air smells of wax and sweetness. It is a rare find on the open prairie, where sugar is worth its weight in trade goods.',
      source: getSource('GOULET_BEE_TREE'),
      choices: [
        { text: 'Harvest the honey', dc: 10, ok: 'Smoke calms the bees. You fill a pail with golden honey — enough to trade or eat for days.', bad: 'The bees are not pleased. Stings and smoke, but you get a little honey.', food: 3, time: 1 },
        { text: 'Mark the tree for the return journey', dc: null, always: 'You notch the bark and remember the spot. The honey will keep.', morale: 3 },
        { text: 'Leave it — you cannot spare the time', dc: null, always: 'The trail waits. The bees keep their treasure.' }
      ]
    },
    {
      id: 'wooded_forest_fire',
      text: 'Smoke on the horizon. Then the wind shifts and the smell hits you — dry wood, pine resin, and the acrid bite of a forest fire pushing toward you. The treeline ahead glows orange. The oxen smell it too and pull at their traces. The prairie burned every afternoon, but this is different — this fire is coming for you.',
      source: getSource('LACOMBE_FIRE'),
      choices: [
        { text: 'Ride for the river bottom', dc: 12, ok: 'The fire edge passes. You lose only an afternoon.', bad: 'The wind shifts. You lose supplies and the cart is singed.', food: -3, wear: 1, morale: -12 },
        { text: 'Light a backfire and wait it out', dc: 10, ok: 'A practised escape. The backfire draws the main blaze away from your position.', bad: 'The flames jump. Your cart is spared but the oxen panic.', morale: -8, time: -1 },
        { text: 'Use water from the slough to wet the canvas', dc: 11, ok: 'The wet tarp protects the load. You wait in the smoke until the fire passes.', bad: 'There is not enough water. The canvas smolders.', morale: -6, itemBonus: { name: 'Canvas Tarp', dcBonus: 3 } }
      ]
    }
  ],
  uplands: [
    {
      id: 'upland_high_pass',
      text: 'The trail climbs onto a windy upland bench, the prairie falling away on all sides. Rain draws near — you can smell it in the air, feel it in the drop of temperature. The ridge offers no shelter, and the cart is exposed to whatever the sky decides to deliver.',
      source: getSource('LACOMBE_HAIL'),
      choices: [
        { text: 'Press through before the storm', dc: 11, ok: 'You gain the far shelter with minutes to spare.', bad: 'The rain catches you on exposed ground.', wear: 1, morale: -6 },
        { text: 'Hike to a rocky ledge and wait', dc: null, always: 'Cold, but the cart and crew are intact.', time: 1 }
      ]
    },
    {
      id: 'upland_sand_hill',
      text: 'The ground turns treacherous — old stumps hidden in tall grass, narrow coulees cutting across the path without warning. Many a worn-out axle and broken wheel attest the power of its stumps and coulees. The cart lurches and groans with every hidden obstacle.',
      source: getSource('SCHULTZ_STUMPS'),
      choices: [
        { text: 'Hug the ridge line to avoid low ground', dc: 11, ok: 'Clear ground saves the cart.', bad: 'A hidden stump catches the wheel hub.', wear: 1 },
        { text: 'Take the direct trail', dc: null, always: 'The going is rough but quick.', alwaysWear: 0 }
      ]
    },
    {
      id: 'upland_thunderstorm',
      text: 'The ridge offers no shelter. Lightning finds the highest point and the rain comes down in sheets. Sudden storms of hail and sleet were not uncommon on the uplands in late spring. The oxen bellow and strain at their traces, and the cart slides on the wet grass.',
      source: getSource('LACOMBE_HAIL'),
      choices: [
        { text: 'Hobble the oxen and weather it under the cart', dc: 11, ok: 'The canvas holds. You are soaked but intact.', bad: 'A lightning-struck tree falls nearby.', morale: -6, time: -1, itemBonus: { name: 'Canvas Tarp', dcBonus: 4 } },
        { text: 'Run for the coulee bottom', dc: 9, ok: 'Lower ground is safer.', bad: 'A slipped wheel in the mud.', wear: 1 }
      ]
    },
    {
      id: 'upland_bison_herd',
      text: 'The trail vanishes beneath a sea of brown backs. A buffalo herd — thousands strong — blocks the path ahead, the earth trembling beneath their hooves. The oxen low and pull at their traces, eyes rolling white. You cannot go around; the herd stretches to the horizon on both sides.',
      source: getSource('GOULET_HUNT'),
      choices: [
        { text: 'Wait for the herd to pass', dc: null, always: 'You make camp and wait. The herd takes half a day to pass. The ground is churned to dust.', time: 1 },
        { text: 'Drive through the edge of the herd', dc: 13, ok: 'The oxen plunge in. The herd parts just enough. You emerge on the other side, hearts pounding.', bad: 'A bull takes offense. The oxen bolt. Cart tips and supplies scatter.', wear: 2, morale: -8 },
        { text: 'Hunt a straggler for food', dc: 11, ok: 'A young bull is separated from the herd. The crew brings it down and butchers it on the spot.', bad: 'The shot scatters the herd toward you. The oxen stampede.', food: 6, itemBonus: { name: 'Ammunition Belt', dcBonus: 3 } }
      ]
    },
    {
      id: 'upland_storm_shelter',
      text: 'The sky turns green and the air goes still — then the hail comes. Stones the size of walnuts hammer the canvas cover. Lightning finds the highest point, and the ridge offers no shelter. The oxen bellow and strain against their traces.',
      source: getSource('LACOMBE_HAIL'),
      choices: [
        { text: 'Hobble the oxen and wait it out', dc: null, always: 'You huddle under the cart. The storm passes in twenty minutes. Everyone is soaked but alive.', morale: -4 },
        { text: 'Push for the coulee bottom', dc: 10, ok: 'Lower ground is safer. The hail lessens as you descend.', bad: 'A slipped wheel in the mud. The cart tilts but holds.', wear: 1 },
        { text: 'Use the Canvas Tarp as shelter', dc: 9, ok: 'The tarp holds against the worst of it. The crew stays dry enough.', bad: 'The wind tears at the canvas. A pole snaps.', morale: -3, itemBonus: { name: 'Canvas Tarp', dcBonus: 3 } }
      ]
    },
    {
      id: 'upland_metis_scout',
      text: 'A lone rider appears on the ridge ahead — a Métis scout, his cart painted red and blue, his sash bright against the brown grass. He knows these hills. He offers to guide you through the uplands for a price.',
      source: getSource('MMF_COMMUNITIES'),
      choices: [
        { text: 'Hire him as a guide', dc: null, always: 'He rides ahead and finds the best path. You save a day of wandering.', food: -3, extraProgress: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Trade for information instead', dc: 8, ok: 'He shares what he knows about the trail ahead in exchange for news from the settlements.', bad: 'He is polite but reveals little. You part ways no wiser.', morale: 5 },
        { text: 'Decline and rely on your own sense', dc: null, always: 'You nod respectfully and press on alone. The trail is harder to find than expected.', time: 1 }
      ]
    },
    {
      id: 'upland_water_hole',
      text: 'The oxen refuse to drink. The water hole ahead is alkaline — white crust rings the edge, and the smell of alkali rides the wind. The animals know before you do: this water will sicken them.',
      source: getSource('SCHULTZ_ALKALI'),
      choices: [
        { text: 'Force the oxen through to clean water beyond', dc: 11, ok: 'The oxen drink reluctantly and you push on. They recover by evening.', bad: 'One ox goes lame from the bad water. Progress slows to a crawl.', crew: 'tired', morale: -6 },
        { text: 'Detour to find a clean spring', dc: null, always: 'A longer route, but the water is sweet. The oxen drink deeply and press on with new energy.', time: 1, morale: 5 },
        { text: 'Ration Pemmican Rations to sustain the crew', dc: null, always: 'You stretch your food and wait for the oxen to adjust. A hungry day, but no one falls ill.', food: -3 }
      ]
    },
    {
      id: 'upland_night_frost',
      text: 'The temperature drops after sunset. By morning, a thin crust of ice covers the water barrels and the oxen\'s breath rises in white plumes. The ground is too hard to drive tent pegs. The crew huddles together for warmth, and the firewood burns faster than you planned.',
      source: getSource('SCHULTZ_FROST'),
      choices: [
        { text: 'Burn extra Firewood Bundle to keep warm', dc: null, always: 'The fire holds back the cold. The crew sleeps, but your fuel reserves are thinner now.', morale: 5 },
        { text: 'Push through without extra fire', dc: 9, ok: 'Grit and determination. The crew complains but holds together.', bad: 'Fingers go numb. One crew member cannot feel their feet by morning.', crew: 'tired', morale: -10 },
        { text: 'Make camp and wait for the thaw', dc: null, always: 'You wait for the sun to warm the ground. A lost day, but the crew is intact.', time: 1 }
      ]
    }
  ],
  river: [
    {
      id: 'river_cart_raft',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart. Four cart wheels were taken and placed dish upwards on the surface of the water. The boat was launched, and floated like a duck.',
      source: getSource('FONSECA_RAFT'),
      choices: [
        { text: 'Build a cart-raft with 2 bison hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river; cargo gets wet.', morale: -6, setsFlag: 'built_rafts', requiresItem: { name: 'Bison Hide', count: 2 }, branch: {
          id: 'river_raft_wash',
          text: 'On the far bank, an elder watches your landing and nods slowly.',
          choices: [
            { text: 'Greet him respectfully', dc: 10, ok: 'He shares drying hides and directions for the next leg.', bad: 'He is suspicious and leaves without speaking.', addsRep: { key: 'cree', delta: 1 }, morale: 8 },
            { text: 'Get moving without conversation', dc: null, always: 'Pragmatic. The crossing cost enough time.', alwaysWear: 0 }
          ]
        } },
        { text: 'Ford the cart carefully', dc: 13, ok: 'The ox swims straight and true; the bed stays high.', bad: 'The current turns the cart. Wet freight and one damaged wheel.', wear: 2, food: -2 }
      ]
    },
    {
      id: 'river_nwmp_duty',
      text: 'At the crossing, red coats inspect the carts with scrupulous care. Duty is collected in cash or goods. The mounted police established posts along the trail to enforce Ottawa\'s regulations, and every cart is subject to inspection.',
      source: getSource('MACLEOD_NWMP'),
      choices: [
        { text: 'Declare your goods and pay duty', dc: null, always: 'The paperwork is tedious but fair. You keep your peace.', food: -2, addsRep: { key: 'nwmp', delta: 1 } },
        { text: 'Attempt to pass quietly', dc: 13, ok: 'They are busy and let you slip through.', bad: 'Caught concealing cargo. Goods are confiscated.', morale: -15, addsRep: { key: 'nwmp', delta: -2 } }
      ]
    },
    {
      id: 'river_lawrence_barkwell_boats',
      text: 'You meet a crew of boatmen heading for the Portage La Loche. Their faces are lean, their hands calloused, but their eyes are sharp. This famous brigade traveled 4000 miles every year, and the men who crewed it knew every river from the Red to the Athabasca.',
      source: getSource('BARKWELL_BRIGADE'),
      choices: [
        { text: 'Exchange dried fish and route talk', dc: 8, ok: 'They share intelligence on the next water crossings.', bad: 'The conversation is brief and businesslike.', morale: 6 },
        { text: 'Hire a guide for the hard water ahead', dc: 10, ok: 'A steady hand joins your crew for three days.', bad: 'The boatman is competent but expensive.', food: -3, extraProgress: 2, addsRep: { key: 'metis', delta: 1 } }
      ]
    },
    {
      id: 'river_ice_breakup',
      text: 'The river is in breakup. Great slabs of ice grind and tumble in the brown water, crashing against the banks with a sound like cannon fire. The crossing is impassable today — perhaps tomorrow, if the cold holds. The crew watches the ice flow past and wonders how long the wait will be.',
      source: getSource('FONSECA_ICE'),
      choices: [
        { text: 'Wait for the ice to clear', dc: null, always: 'You camp and watch the river. By morning, the channel is clear enough.', time: 1 },
        { text: 'Find an alternate crossing upstream', dc: 11, ok: 'A narrower point, but the ice has passed. You cross carefully.', bad: 'The bank is steep. The cart slips but holds.', wear: 1 },
        { text: 'Risk the crossing now', dc: 15, ok: 'The oxen are strong swimmers. You make it across, ice grinding at the cart sides.', bad: 'A slab of ice catches the axle. The cart tips. Cargo lost to the current.', wear: 2, food: -4 }
      ]
    },
    {
      id: 'river_supply_boat',
      text: 'A York boat rounds the bend, its oars flashing in the sun. HBC markings on the hull — a supply boat heading downstream from the northern posts. The crew waves. They have news, and they have trade goods that have not seen a settlement in months.',
      source: getSource('HBC_JOURNAL'),
      choices: [
        { text: 'Trade with the boat crew', dc: null, always: 'You exchange news and goods. The boatmen are glad for fresh supplies from the south.', morale: 5 },
        { text: 'Ask for news of the trail ahead', dc: 8, ok: 'They tell you which posts are well-stocked and which trails have washed out. Valuable intelligence.', bad: 'They are close-mouth about Company business. You learn little.', morale: 3 },
        { text: 'Wave and continue on your way', dc: null, always: 'You are heading west, they are heading east. Your paths cross and diverge.' }
      ]
    },
    {
      id: 'river_sandbar_trap',
      text: 'The oxen are halfway across when the cart lurches and stops. The front wheels have dropped into a hidden sandbar, and the current is pushing against the cart bed. The oxen strain but cannot pull free. The water is rising.',
      source: getSource('BREHAUT_SANDBAR'),
      choices: [
        { text: 'Unload and float the cart free', dc: 11, ok: 'You lighten the load and the oxen pull clear. Wet cargo, but the cart is safe.', bad: 'The current shifts the cart. A barrel is swept away.', food: -2, wear: 1 },
        { text: 'Use Rope (50ft) to anchor and pull from bank', dc: 10, ok: 'The rope holds. The crew on the bank heaves. The cart grinds free.', bad: 'The rope slips. The cart settles deeper.', wear: 1, itemBonus: { name: 'Rope (50ft)', dcBonus: 3 } },
        { text: 'Wait for the water level to drop', dc: null, always: 'You wait. The current lessens by afternoon and the oxen pull free.', time: 1, morale: -5 }
      ]
    },
    {
      id: 'river_ferry_dumont',
      text: 'Gabriel Dumont is at the crossing, his ferry moored to the bank. His fee is fair, but the current is heavy today — the ferry rocks and the oarsman strains. Dumont watches the river with the calm of a man who has crossed it a thousand times.',
      source: getSource('DUMONT_ACCOUNTS'),
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
      ]
    },
    {
      id: 'river_cart_raft_crossing',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart — enough to build a raft, if you know how. The river is wide and the current steady. On the far bank, the trail continues west.',
      source: getSource('FONSECA_RAFT'),
      choices: [
        { text: 'Build a cart-raft with 2 Bison Hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river. Cargo gets wet.', morale: -6, requiresItem: { name: 'Bison Hide', count: 2 } },
        { text: 'Ford the cart carefully', dc: 13, ok: 'The ox swims straight and true; the bed stays high.', bad: 'The current turns the cart. Wet freight and one damaged wheel.', wear: 2, food: -2 }
      ]
    }
  ]
};

export function getEventsForTerrain(terrain) {
  return EVENT_POOLS[terrain] || EVENT_POOLS.plains;
}

export function pickEventForTerrain(terrain, rng) {
  const pool = getEventsForTerrain(terrain);
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}

export function pickBranchEvent() {
  const keys = Object.keys(EVENT_POOLS);
  const terrain = keys[Math.floor(Math.random() * keys.length)];
  return pickEventForTerrain(terrain, Math.random);
}
