// Icon definitions for all inventory items
// Uses double-char emoji strings that render well inline at text size

const ICONS = {
  'Pemmican Rations': '🥩',
  'Spare Axle': '🪵',
  'Shaganappi': '🪢',
  'Tool Kit': '⚒️',
  'Bison Hide': '🦬',
  'Canvas Tarp': '⛺',
  'Firewood Bundle': '🔥',
  'Rope (50ft)': '🪢',
  'Ammunition Belt': '🎯',
  'Medicine Pouch': '💊',
  'Blanket': '🧣',
  'Beaver Pelts': '🦫',
  // Crafted items
  'Finished Hides': '🦬',
  'Travois Kit': '🛒',
  'Gunpowder Pack': '💣',
};

export function getItemIcon(name) {
  return ICONS[name] || '•';
}
