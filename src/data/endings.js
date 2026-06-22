import { getSource } from './sources/index.js';

export const ENDINGS = {
  victory: {
    id: 'victory',
    title: 'Fort Edmonton at Last!',
    narrative: {
      high: "The palisade walls at Edmonton. We made it — axle held, wheels still on the hubs. The crew's behind us, hollow-eyed but standing. Our holds are full of pelts and hides. The Company men at the gate will pay well, and the ledger will remember this trip.",
      humble: "We reach Fort Edmonton with nothing left to give but our word. The cart groans as we roll through the gate — held together by rope and stubbornness. The crew is hollow-eyed but standing. Our cart is bare, but we arrived. Against the prairie, the weather, and every broken trail between Garry and Edmonton, we arrived.",
    },
    quote: getSource('FORT_EDMONTON'),
    quoteHigh: getSource('SAWYER_TRIAL'),
    tip: "Tip: Trade goods (furs, hides) at settlements for food and repairs. Keep your trade goods count high when you reach Edmonton — each is worth 50 points. Repair wear early — letting the cart degrade costs points fast.",
  },

  no_trade: {
    id: 'no_trade',
    title: 'Empty-Handed at Edmonton',
    narrative: {
      high: "We reach Fort Edmonton, but our cart holds no trade goods. Every fur and hide was bartered away to survive — food, repairs, medicine. We made the journey, but the Company men at the post look at our bare cart and shake their heads. A trip without profit is just a long walk.",
      humble: "The gates of Fort Edmonton are open before us, but there is nothing to show for the journey. No furs, no hides, no trade goods to our name. We spent everything to keep the crew alive through the hardest stretches. We survived — but the ledger will not remember this trip.",
    },
    quote: getSource('HBC_JOURNAL'),
    tip: "Tip: Barter goods for supplies at settlements, then hold onto trade goods (furs, hides) for the end score. Keep your trade goods count above 5 when you reach Edmonton. Balance survival with profit — forage and hunt to supplement food instead of bartering away all your cargo.",
  },

  starvation: {
    id: 'starvation',
    title: 'Gone to Hunger',
    narrative: {
      high: "Food's gone. Three days of foraging turned up nothing but bitter roots. The oxen can't pull anymore. We make camp and wait. The nearest post is days away on foot, and we are not walking.",
      humble: "We count the last of the pemmican and divide it into portions too small to matter. Three days later, there is nothing. The crew sits by the cart, too weak to walk. The prairie stretches in every direction, indifferent to our hunger. The trail has claimed another party.",
    },
    quote: getSource('PEMMICAN_FAMINE'),
    tip: "Tip: Food is your most critical resource. Trade for it at every settlement. Forage when the crew is rested. Never let your food drop below 5 — the trail between settlements is longer than you think.",
  },

  cart_failure: {
    id: 'cart_failure',
    title: 'Axle Broken, Journey Over',
    narrative: {
      high: "The axle splinters with a crack that echoes across the prairie. The cart lurches and the load shifts — irreparable damage. Without a spare axle and proper tools, we cannot continue. The nearest post is days away on foot. The journey ends here, stranded on the open trail with a broken cart and fading hope.",
      humble: "We knew the cart was failing. The squeal grew louder each day, the wheels wobbled, the frame groaned. But we pushed on, hoping to reach the next settlement. The axle finally gives out on open prairie, miles from anywhere. The cart will not roll again.",
    },
    quote: getSource('BREHAUT_CART'),
    tip: "Tip: Repair wear at every settlement. Use shaganappi to reduce wear before it reaches critical levels. If your cart squeals, stop and fix it — ignoring wear is the fastest way to end up stranded. A spare axle weighs 15 kg but could save your journey.",
  },

  winter: {
    id: 'winter',
    title: 'Caught by Winter',
    narrative: {
      high: "First snow. Soft enough, but we know what it means. The trail will be gone by morning — snow-filled ruts, white ground, no way to follow the track. Edmonton's still four days west. The cold goes right through the cart boards. We're done.",
      humble: "October winds carry the first frost, and the sky turns the color of old iron. Winter is coming, and we are still on the open prairie between posts. The trail ahead will soon be buried. We make camp for the last time, knowing the journey ends here.",
    },
    quote: getSource('WINTER_TRAIL'),
    tip: "Tip: Speed matters. Every day on the trail brings winter closer. Don't linger too long at settlements — rest and repair quickly, then move. The trail from Fort Garry to Fort Edmonton takes roughly 35-50 days. Leave early and keep moving.",
  },

  abandoned: {
    id: 'abandoned',
    title: 'The Crew Has Had Enough',
    narrative: {
      high: "The crew stops at the rise. Won't go further. Three broken wheels in two weeks. Six nights without enough food. One of them sits down in the grass and stares. The others follow. We can't force them. The trail goes on. They don't.",
      humble: "One morning, the crew simply will not rise. They sit by the dead fire and stare at the horizon. No amount of encouragement can move them. The journey has ground them down to nothing. We are alone on the Carlton Trail with a cart full of goods and no one willing to pull it.",
    },
    quote: getSource('MORALE'),
    tip: "Tip: Keep your crew's morale up. Make camp to rest when tired. Share meals at settlements. Don't push through exhaustion — a rested crew travels faster and survives longer. Morale is invisible until it's gone.",
  },
};
