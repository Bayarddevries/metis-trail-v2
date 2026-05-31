import { NODES } from './nodes.js';

export const EVENT_POOLS = {
  plains: [
    {
      id: 'plains_trader',
      text: 'A Metis freighter catches up to your cart. He eyes your load and offers a short-term deal.',
      classification: 'Freight & Trade',
      source: { quote: 'The freighting trade along the Carlton Trail was dominated by Metis independent carters.', author: 'MMF Research', work: 'Research Vault' },
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
      text: 'A hot wind pushes at your back. The prairie grass ripples like water.',
      choices: [
        { text: 'Run with it', dc: 10, ok: 'You make excellent time.', bad: 'A hidden rut jolts the cart. Repairs are needed after crossing.', wear: 1, time: -1 },
        { text: 'Hunker down', dc: null, always: 'You wrap the load and keep moving. No rain comes.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_camp_cookery',
      text: 'Midday halt by a cattail slough. Pemmican is passed around; bannock is frying. A Métis campsite nearby offers company.',
      source: { quote: 'Pemmican cooked in a frying-pan, a little grease, pepper, salt, with a trace of onions and potatoes added, constituted this, a dish to set before a king.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Share rubaboo and trade stories', dc: 8, ok: 'The circle of travellers is warm. Morale rises.', bad: 'You are too guarded to connect fully.', morale: 8, addsRep: { key: 'metis', delta: 1 }, setsFlag: 'shared_camp_meal' },
        { text: 'Eat quickly and move on', dc: null, always: 'Hunger is satisfied, but nothing more.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_night_camp',
      text: 'Moonlight spills across the prairie. Somewhere nearby a fiddle begins a Red River jig.',
      source: { quote: 'The Red River jig was struck up, and one after another exercised himself to his heart\'s content.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Dance until your boots throw dust', dc: 10, ok: 'Laughter drowns out the dark.', bad: 'You strain a shoulder and sleep poorly.', morale: 12, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Turn in early; tomorrow is long', dc: null, always: 'Rest restores you in small measure.', morale: 4 }
      ]
    },
    {
      id: 'plains_ox_scatter',
      text: 'The oxen have scattered after drinking. The mid-day camp is a chaos of traces and running hooves.',
      source: { quote: 'To drive the refractory animals among the carts was a last resort.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Call and whistle them back', dc: 11, ok: 'The animals respond to the familiar sounds.', bad: 'You lose an hour rounding them up.', time: 1, morale: -4 },
        { text: 'Send someone ahead', dc: 9, ok: 'Your crew brings them in quietly and quickly.', bad: 'One runner turns an ankle.', crew: 'tired', addsRep: { key: 'metis', delta: 1 } }
      ]
    },
    {
      id: 'plains_squeal',
      text: 'The dry wood of the hub screams against the axle — a sound that carries for miles.',
      source: { quote: 'When loaded it gave forth a blood-curdling squeal which could be heard for miles and which came to be associated with it.', author: 'Harry Baker Brehaut', work: 'The Red River Cart and Trails, MHS Transactions, 1971-72' },
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
      text: 'You encounter a massive buffalo hunt camp — hundreds of carts in a great circle, the air thick with dust and the sound of running horses.',
      source: { quote: 'Four hundred mounted huntsmen await the signal... the earth trembles.', author: 'Brehaut, citing Alexander Ross', work: 'MHS Transactions, 1971-72' },
      choices: [
        { text: 'Join the hunt', dc: 12, ok: 'The hunt captain nods. You take a share of the meat.', bad: 'You are slow to position. You earn only a strip.', food: 8, addsRep: { key: 'metis', delta: 2 } },
        { text: 'Observe and move on', dc: null, always: 'You watch from a respectful distance. The hunt is spectacular.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_prairie_fire',
      text: 'Smoke on the horizon. The dry grass crackles — a wall of flame races toward you.',
      source: { quote: 'The prairie burned every afternoon... the oxen grew restless in the smoke.', author: 'Father Albert Lacombe', work: 'Missionary Journals, 1878' },
      choices: [
        { text: 'Ride for the river bottom', dc: 14, ok: 'The fire edge passes. You lose only a afternoon\'s travel.', bad: 'The wind shifts. You lose supplies and the cart is singed.', food: -3, wear: 1, morale: -12 },
        { text: 'Light a backfire and wait it out', dc: 11, ok: 'A practised escape. The backfire draws the main blaze away.', bad: 'The flames jump. Your cart is spared but the oxen panic.', morale: -8, time: -1 }
      ]
    },
    {
      id: 'plains_sayer_trial',
      text: 'A Métis settlement celebrates the anniversary of the Sayer trial. Free trade pride fills the air — and your cart.',
      source: { quote: 'The trial of Pierre Guillaume Sayer marked the beginning of free trade in the West.', author: 'MMF Historical Research', work: 'metis-research-vault' },
      choices: [
        { text: 'Display independent freight proudly', dc: 9, ok: 'The folk cheer. Prices are better here.', bad: 'You are taken for a Company man. Prices are unkind.', food: 5, addsRep: { key: 'metis', delta: 2 } },
        { text: 'Stay quiet and keep moving', dc: null, always: 'Circumspection keeps your goods and your secrets.', alwaysWear: 0 }
      ]
    },
    {
      id: 'plains_burnt_prairie',
      text: 'The prairie here has been burnt black. No grass, no water, and the sun is relentless.',
      source: { quote: 'Bichon, the patient, would do his best and, failing, would lie down in the one.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Push through to the next water', dc: 12, ok: 'You make the crossing with grit.', bad: 'The oxen lag. You are forced to camp on burnt ground.', food: -2, crew: 'tired' },
        { text: 'Detour to a shaded coulee', dc: null, always: 'A slower, safer day. Grass and water restore the animals.', time: 1 }
      ]
    },
    {
      id: 'plains_sand_hills',
      text: 'The ground turns treacherous — old stumps hidden in tall grass, narrow coulees cutting across the path.',
      source: { quote: 'Many a worn-out axle and broken wheel attest the power of its stumps and coulees.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Hug the ridge line to avoid low ground', dc: 11, ok: 'Clear ground saves the cart.', bad: 'A hidden stump catches the wheel hub.', wear: 1, morale: -4 },
        { text: 'Take the direct trail', dc: null, always: 'The going is rough but quick.', alwaysWear: 0 }
      ]
    },
    {
      id: 'wooded_windfall',
      text: 'A great elm has fallen across the trail — branches splayed like fingers blocking the path.',
      source: { quote: 'A great elm has fallen across the trail.', author: 'Schultz (1894)' },
      choices: [
        { text: 'Cut a way through', dc: 10, ok: 'The path opens. Useful firewood goes on the cart.', bad: 'The work is harder than expected.', time: 1 },
        { text: 'Bypass through the bush', dc: 11, ok: 'The bush breaks open onto the old trail.', bad: 'A branch catches the canvas cover.', wear: 1 },
        { text: 'Backtrack to the ford', dc: null, always: 'A long, slow re-route. But safe.', time: 2 }
      ]
    },
    {
      id: 'plains_axle_snap',
      text: 'A sickening crack — the right axle shears against a hidden stone half-buried in yesterday\'s washout.',
      source: { quote: 'Many a worn-out axle and broken wheel attest the power of its stumps and coulees.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Set a splice with rope and wedges', dc: 11, ok: 'A jury-rig holds. Progress is slow, but the cart is rolling again.', bad: 'The splice splits by noon.', wear: 1, time: 1, morale: -4 },
        { text: 'Cache the load and press on light', dc: null, always: 'You bury the crated freight and mark the spot. The cart is light, but you return poorer.', time: -1, food: -4 }
      ]
    },
    {
      id: 'plains_bear_camp',
      text: 'Dawn finds a cinnamon bear rooting through your bread sack at the edge of camp.',
      source: { quote: 'The bears along the Carlton were a constant threat to unprotected provisions.', author: 'Brehaut, citing Fort Qu\'Appelle accounts', work: 'MHS Transactions, 1971-72' },
      choices: [
        { text: 'Beat the pan and drive it off', dc: 11, ok: 'The bear lumbers away with a swat at its nose.', bad: 'It turns. A strap snaps and half the flour is gone.', food: -3, morale: -6, wear: 1 },
        { text: 'Climb for height and wait', dc: null, always: 'The bear eventually loses interest. You lose the morning, not the flour.', time: 1 }
      ]
    },
    {
      id: 'plains_hail',
      text: 'The sky turns green and the air goes still. Then the hail comes — stones the size of walnuts.',
      source: { quote: 'Sudden storms of hail and sleet were not uncommon on the open prairie in late spring.', author: 'Lacombe missionary journals, 1878' },
      choices: [
        { text: 'Cover the canvas and ride it out', dc: 10, ok: 'The wagon top holds. The oxen are skittish but unhurt.', bad: 'Canvas tears and two rounds of cheese are spoiled.', food: -2, morale: -4 },
        { text: 'Scramble to the nearest coulee', dc: 9, ok: 'Natural shelter saves the load.', bad: 'A slipped wheel in the rush.', wear: 1 }
      ]
    },
    {
      id: 'plains_theft',
      text: 'Camp is crowded. You wake to find a small bundle of trade goods missing from the cart pole.',
      source: { quote: 'Thefts at rendezvous camps were usually petty and punished by the trail\'s own informal courts.', author: 'MMF Historical Research' },
      choices: [
        { text: 'Tell the camp overseer and help search', dc: 9, ok: 'The goods are returned. The thief is ordered to pay in labour.', addsRep: { key: 'metis', delta: 1 } },
        { text: 'Write it off and tighten watch', dc: null, always: 'Pragmatic. The trail teaches scarcity.', alwaysWear: 0, morale: -2 }
      ]
    }
  ],
  river_valley: [
    {
      id: 'river_high',
      text: 'The river is running high and fast. The bank trail is muddy and narrow.',
      source: { quote: 'The carts had indeed entered straight into the water... turned upstream to make the crossing in a horse shoe fashion.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Ford carefully', dc: 13, ok: 'The ox keeps footing and you stay dry enough.', bad: 'The cart tilts in the current. Repairs are needed after crossing.', wear: 1 },
        { text: 'Wait for afternoon', dc: null, always: 'You camp and cross later when the water drops.', time: 1 },
        { text: 'Scout for the horse-shoe ford upstream', dc: 11, ok: 'You find the concealed path and cross safely.', bad: 'The scouting costs precious daylight and energy.', morale: -4, time: -1 }
      ]
    },
    {
      id: 'river_mp_check',
      text: 'An NWMP patrol stops you just above the ferry landing.',
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
      text: 'The opposite bank is steep — eight feet of loose earth down to the water.',
      source: { quote: 'A line was tied to the middle of the axle of the cart, and a turn of the line made around the trunk of a tree on the bank.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Lower the cart with a line tied to a tree', dc: 10, ok: 'A careful descent protects the load.', bad: 'The knot slips at the last moment; the cart jars.', wear: 1 },
        { text: 'Free descent', dc: null, always: 'The cart slides hard; the contents shift dangerously.', alwaysWear: 1 }
      ]
    },
    {
      id: 'river_boat',
      text: 'At a wide crossing the captain offers passage — but he is clearly understaffed and the ferry rocks.',
      choices: [
        { text: 'Board and keep the load centred', dc: 11, ok: 'You ride the swell and land clean.', bad: 'A barrel breaks loose and damages a wheel.', wear: 1, food: -2 },
        { text: 'Wait for a larger brigade', dc: null, always: 'A safer but slower choice.', time: 2 }
      ]
    },
    {
      id: 'river_cholera_camp',
      text: 'A member of your crew wakes shaking and cold — by midday they cannot stand. The river water was contaminated.',
      source: { quote: 'A waterborne bacteria that thrived in the stagnant water of common camping grounds.', author: 'Cart Trail Game Research (2025)' },
      choices: [
        { text: 'Use the medicine pouch and rest the day', dc: 14, ok: 'The crisis passes. One day lost, but the crew recovers.', bad: 'The fever breaks but the crew is weak for days.', crew: 'tired', morale: -8 },
        { text: 'Push through without rest', dc: null, always: 'The worst passes but the toll is steep.', morale: -20, crew: 'exhausted' }
      ]
    },
    {
      id: 'river_mosquito_camp',
      text: 'The mosquitoes rise in clouds from the riverbank. The oxen stampede; the cooking fire smoulders.',
      source: { quote: 'Amidst a cloud of mosquitoes, sand flies, and all prairie annoyances, including mud.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Move camp to high ground before dark', dc: 9, ok: 'The move is miserable but the night is quieter.', bad: 'A wheel is twisted in the dark.', wear: 1 },
        { text: 'Use canvas tarps and tough it out', dc: 11, ok: 'You hunker down. Morning comes.', bad: 'The insects are relentless. Morale falls hard.', morale: -10 }
      ]
    },
    {
      id: 'river_cart_raft',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart.',
      source: { quote: 'Four cart wheels were taken and placed dish upwards... The boat was launched, and floated like a duck.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Build a cart-raft with 4 bison hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river; cargo gets wet.', morale: -6, setsFlag: 'built_rafts', requiresFlag: 'has_hides', branch: {
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
      text: 'Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.',
      source: { quote: 'Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.', author: 'Dumont Family Accounts', work: 'MMF Research Vault' },
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
      ]
    }
  ],
  wooded: [
    {
      id: 'wooded_cree',
      text: 'A Cree hunter steps onto the trail ahead. He studies your cart and nods at the pemmican sacks.',
      choices: [
        { text: 'Offer a trade', dc: 11, ok: 'He swaps fresh meat for part of your load.', bad: 'He senses you are short on food. The deal goes poorly.', food: 3, addsRep: { key: 'cree', delta: 1 } },
        { text: 'Keep moving', dc: null, always: 'He watches but does not interfere.', alwaysWear: 0 }
      ]
    },
    {
      id: 'wooded_ambush_ravine',
      text: 'A hidden rut drops one wheel into a creek bed — the cart tilts dangerously.',
      source: { quote: 'Being run over by the heavy wooden wheels of a Red River cart was the leading cause of death on the trails.', author: 'Cart Trail Game Research', work: 'Research Vault' },
      choices: [
        { text: 'Catch the weight and right it', dc: 12, ok: 'Quick hands save the day.', bad: 'The cart upsets. One food item is lost.', food: -1, wear: 1 },
        { text: 'Call for help', dc: 9, ok: 'A nearby Métis party rights the cart swiftly.', bad: 'Helpers arrive slow and grumpy.', morale: -5, time: 1 }
      ]
    },
    {
      id: 'wooded_stung_by_flies',
      text: 'The mosquitoes and biting flies rise from the slough. The animals spook and the crew wants to run.',
      source: { quote: 'Bound away to the water, into which they plunged neck deep, remaining there safe from the tormenting flies and mosquitoes.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Drive through to firmer ground', dc: 11, ok: 'You outpace the worst of the cloud.', bad: 'The animals bolt; a strap snaps.', wear: 1, crew: 'tired' },
        { text: 'Let the oxen cool in the water', dc: null, always: 'The delay costs time but saves nerves.', time: 1 }
      ]
    }
  ],
  uplands: [
    {
      id: 'upland_high_pass',
      text: 'The trail climbs onto a windy upland bench. Rain draws near.',
      choices: [
        { text: 'Press through before the storm', dc: 11, ok: 'You gain the far shelter with minutes to spare.', bad: 'The rain catches you on exposed ground.', wear: 1, morale: -6 },
        { text: 'Hike to a rocky ledge and wait', dc: null, always: 'Cold, but the cart and crew are intact.', time: 1 }
      ]
    },
    {
      id: 'upland_sand_hill',
      text: 'The ground turns treacherous — old stumps hidden in tall grass, narrow coulees cutting across the path.',
      source: { quote: 'Many a worn-out axle and broken wheel attest the power of its stumps and coulees.', author: 'John C. Schultz', work: 'The Old Crow Wing Trail, MHS Transactions, 1894' },
      choices: [
        { text: 'Hug the ridge line to avoid low ground', dc: 11, ok: 'Clear ground saves the cart.', bad: 'A hidden stump catches the wheel hub.', wear: 1 },
        { text: 'Take the direct trail', dc: null, always: 'The going is rough but quick.', alwaysWear: 0 }
      ]
    }
  ],
  river: [
    {
      id: 'ferry_gabriel',
      text: 'Gabriel Dumont is at the crossing. His ferry is ready, but the current is heavy today.',
      source: { quote: 'Gabriel Dumont... ferryman, guide, and later military leader of the Metis forces.', author: 'Dumont Family Accounts', work: 'MMF Research Vault' },
      choices: [
        { text: 'Take the ferry now', dc: 10, ok: 'He rows hard and gets you across cleanly.', bad: 'The ferry lurches. Cargo shifts and one wheel takes damage.', wear: 1, addsRep: { key: 'metis', delta: 1 } },
        { text: 'Wait out the current', dc: null, always: 'You wait one day for calmer water.', time: 1 }
      ]
    },
    {
      id: 'river_cart_raft',
      text: 'The crossing here is too deep to ford. You eye the spare hides in the cart.',
      source: { quote: 'Four cart wheels were taken and placed dish upwards... The boat was launched, and floated like a duck.', author: 'William G. Fonseca', work: 'On the St. Paul Trail in the Sixties, MHS Transactions, 1900' },
      choices: [
        { text: 'Build a cart-raft with 4 bison hides', dc: 12, ok: 'The improvised ferry floats. The crew swims the line across.', bad: 'One hide splits mid-river; cargo gets wet.', morale: -6, setsFlag: 'built_rafts', requiresFlag: 'has_hides', branch: {
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
      text: 'At the crossing, red coats inspect the carts with scrupulous care. Duty is collected in cash or goods.',
      source: { quote: 'The mounted police established posts along the trail to enforce Ottawa\'s regulations.', author: 'R. C. Macleod', work: 'The North-West Mounted Police and Law Enforcement, 1873-1905' },
      choices: [
        { text: 'Declare your goods and pay duty', dc: null, always: 'The paperwork is tedious but fair. You keep your peace.', food: -2, addsRep: { key: 'nwmp', delta: 1 } },
        { text: 'Attempt to pass quietly', dc: 13, ok: 'They are busy and let you slip through.', bad: 'Caught concealing cargo. Goods are confiscated.', morale: -15, addsRep: { key: 'nwmp', delta: -2 } }
      ]
    },
    {
      id: 'river_lawrence_barkwell_boats',
      text: 'You meet a crew of boatmen heading for the Portage La Loche. Their faces are lean, their hands calloused, but their eyes are sharp.',
      source: { quote: 'This famous brigade traveled 4000 miles every year... the pay of a guide for the entire trip occupying the four summer months has been £35.', author: 'Lawrence Barkwell', work: 'Portage La Loche Brigade, Louis Riel Institute' },
      choices: [
        { text: 'Exchange dried fish and route talk', dc: 8, ok: 'They share intelligence on the next water crossings.', bad: 'The conversation is brief and businesslike.', morale: 6 },
        { text: 'Hire a guide for the hard water ahead', dc: 10, ok: 'A steady hand joins your crew for three days.', bad: 'The boatman is competent but expensive.', food: -3, extraProgress: 2, addsRep: { key: 'metis', delta: 1 } }
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
