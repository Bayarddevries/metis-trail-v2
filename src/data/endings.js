import { getSource } from './sources/index.js';

export const ENDINGS = {
  victory: {
    id: 'victory',
    title: 'Fort Edmonton at Last!',
    narrative: {
      high: "You crest the final ridge and the palisade walls of Fort Edmonton rise from the riverbank below. Your cart has held. Your crew stands strong behind you. The trade goods in your load — furs, hides, crafted wares — will fetch fair prices at the post. You made the Carlton Trail in good order, and the West will remember your name.",
      humble: "You reach Fort Edmonton with nothing left to give but your word. The cart groans as you roll through the gate — held together by rope and stubbornness. The crew is hollow-eyed but standing. You have no trade goods to sell, no extra food to spare. But you arrived. Against the prairie, the weather, and every broken trail between Garry and Edmonton, you arrived.",
    },
    quote: getSource('FORT_EDMONTON'),
    quoteHigh: getSource('SAWYER_TRIAL'),
    tip: "Tip: Trade goods are the key to a high score. Keep at least one fur or hide in your cart when you reach Edmonton. Repair wear early — letting the cart degrade costs points fast.",
  },

  no_trade: {
    id: 'no_trade',
    title: 'Empty-Handed at Edmonton',
    narrative: {
      high: "You reach Fort Edmonton, but your cart is empty of trade goods. Every fur and hide was sold or traded along the way to survive. You made the journey, but the Company men at the post look at your bare cart and shake their heads. A trip without profit is just a long walk.",
      humble: "The gates of Fort Edmonton are open before you, but there is nothing to show for the journey. No furs, no hides, no trade goods. You sold everything to keep the crew alive through the hardest stretches. You survived — but the ledger will not remember this trip.",
    },
    quote: getSource('HBC_JOURNAL'),
    tip: "Tip: Don't trade away all your furs and hides for food. Keep at least one trade good in your cart for the final score. Balance survival with profit — forage and hunt to supplement food instead of liquidating cargo.",
  },

  starvation: {
    id: 'starvation',
    title: 'Gone to Hunger',
    narrative: {
      high: "The food ran out on the open prairie. No amount of foraging could stretch the rations far enough. The crew weakened day by day until the oxen could no longer pull the loaded cart. You were forced to camp and wait for rescue that might never come. The Carlton Trail gives nothing for free.",
      humble: "You count the last of the pemmican and divide it into portions too small to matter. Three days later, there is nothing. The crew sits by the cart, too weak to walk. The prairie stretches in every direction, indifferent to your hunger. The trail has claimed another party.",
    },
    quote: getSource('PEMMICAN_FAMINE'),
    tip: "Tip: Food is your most critical resource. Trade for it at every settlement. Forage when the crew is rested. Never let your food drop below 5 — the trail between settlements is longer than you think.",
  },

  cart_failure: {
    id: 'cart_failure',
    title: 'Axle Broken, Journey Over',
    narrative: {
      high: "The axle splinters with a crack that echoes across the prairie. The cart lurches and the load shifts — irreparable damage. Without a spare axle and proper tools, you cannot continue. The nearest post is days away on foot. The journey ends here, stranded on the open trail with a broken cart and fading hope.",
      humble: "You knew the cart was failing. The squeal grew louder each day, the wheels wobbled, the frame groaned. But you pushed on, hoping to reach the next settlement. The axle finally gives out on open prairie, miles from anywhere. The cart will not roll again.",
    },
    quote: getSource('BREHAUT_CART'),
    tip: "Tip: Repair wear at every settlement. Use shaganappi to reduce wear before it reaches critical levels. If your cart squeals, stop and fix it — ignoring wear is the fastest way to end up stranded. A spare axle weighs 15 kg but could save your journey.",
  },

  winter: {
    id: 'winter',
    title: 'Caught by Winter',
    narrative: {
      high: "The first snow falls soft and silent, covering the trail ahead. You know what it means — the Carlton Trail will soon disappear under deep snow, impassable until spring. Edmonton is still days away. The cold seeps into the cart, into the crew, into the oxen. This is as far as you go.",
      humble: "October winds carry the first frost, and the sky turns the color of old iron. Winter is coming, and you are still on the open prairie between posts. The trail ahead will soon be buried. There is no outrunning the season. You make camp for the last time, knowing the journey ends here.",
    },
    quote: getSource('WINTER_TRAIL'),
    tip: "Tip: Speed matters. Every day on the trail brings winter closer. Don't linger too long at settlements — rest and repair quickly, then move. The trail from Fort Garry to Fort Edmonton takes roughly 35-50 days. Leave early and keep moving.",
  },

  abandoned: {
    id: 'abandoned',
    title: 'The Crew Has Had Enough',
    narrative: {
      high: "The crew stops at the next rise and refuses to go further. Too many broken wheels, too many nights without food, too many miles of empty prairie. The morale that held them together has finally broken. You cannot force them. The trail before you remains unrolled, but the will to follow it is gone.",
      humble: "One morning, the crew simply will not rise. They sit by the dead fire and stare at the horizon. No amount of encouragement can move them. The journey has ground them down to nothing. You are alone on the Carlton Trail with a cart full of goods and no one willing to pull it.",
    },
    quote: getSource('MORALE'),
    tip: "Tip: Keep your crew's morale up. Make camp to rest when tired. Share meals at settlements. Don't push through exhaustion — a rested crew travels faster and survives longer. Morale is invisible until it's gone.",
  },
};
