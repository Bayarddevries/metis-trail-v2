const ITEMS = [
  {
    name: 'Pemmican Rations',
    wt: 15,
    count: 30,
    type: 'food',
    desc: 'Dried meat and fat. The staple of the prairie. Never truly spoils.',
    icon: '🥩',
    source: {
      quote: 'Pemmican... composed of pounded dried meat, melted fat, and berries.',
      author: 'Ernest C. N. Acheson',
      work: 'The Buffalo and the Prairie',
      year: 1910,
      url: 'https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt',
    },
  },
  {
    name: 'Spare Axle',
    wt: 40,
    count: 1,
    type: 'repair',
    desc: 'Hard maple. Heavy but essential for a Red River cart.',
    icon: '🪵',
  },
  {
    name: 'Shaganappi',
    wt: 5,
    count: 3,
    type: 'repair',
    desc: 'Rawhide strips. Binding, lashing, and cart repair.',
    icon: '🪒',
    source: {
      quote: 'Shaganappi... raw-hide thongs, much used by the half-breeds for binding their cart-wheels.',
      author: 'R. G. McConnell',
      work: 'The North-West of Canada',
      year: 1885,
      url: 'https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt',
    },
  },
  {
    name: 'Tool Kit',
    wt: 10,
    count: 1,
    type: 'tool',
    desc: 'Axe, auger, drawknife. Required for major repairs.',
    icon: '🛠️',
  },
  {
    name: 'Bison Hide',
    wt: 8,
    count: 2,
    type: 'trade',
    desc: 'Folded. Trade value: ~1.25 MB each at Edmonton.',
    icon: '🦬',
  },
  {
    name: 'Canvas Tarp',
    wt: 6,
    count: 1,
    type: 'shelter',
    desc: 'Waterproof. Shelter and cart-raft conversion.',
    icon: '⛺',
  },
  {
    name: 'Firewood Bundle',
    wt: 10,
    count: 2,
    type: 'fuel',
    desc: 'Dried poplar. Required for cold nights.',
    icon: '🪵',
  },
  {
    name: 'Rope (50ft)',
    wt: 3,
    count: 1,
    type: 'tool',
    desc: 'Hemp. Crossings, repairs, binding.',
    icon: '🪢',
  },
  {
    name: 'Ammunition Belt',
    wt: 2,
    count: 0,
    type: 'ammo',
    desc: 'Shot and ball. For hunting and defence.',
    icon: '🎯',
  },
  {
    name: 'Medicine Pouch',
    wt: 2,
    count: 1,
    type: 'medical',
    desc: 'Herbal remedies and bandages.',
    icon: '🫙',
  },
  {
    name: 'Blanket',
    wt: 3,
    count: 1,
    type: 'shelter',
    desc: 'Wool. Winter survival.',
    icon: '🛏️',
  },
  {
    name: 'Beaver Pelts',
    wt: 5,
    count: 1,
    type: 'trade',
    desc: 'Prime bundle. Trade value: ~3 MB.',
    icon: '🦫',
    source: {
      quote: 'Beaver... the very foundation of the northern trade.',
      author: 'HBC Archives',
      work: 'Fort Edmonton Post Journal, 1878',
      url: 'https://archive.org/stream/P000279/P000279_djvu.txt',
    },
  },
];

export function startingCart() {
  return JSON.parse(JSON.stringify(ITEMS));
}

export function totalWeight(cart) {
  return cart.reduce((s, i) => s + i.wt * i.count, 0);
}
