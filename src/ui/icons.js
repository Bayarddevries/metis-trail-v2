// SVG icon definitions for all 12 inventory items
// Each icon is 24x24 viewBox, line-art style (stroke only, no fill)

const ICONS = {
  'Pemmican Rations': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Pemmican Rations">
    <path d="M6 12 C6 8 10 6 12 6 C14 6 18 8 18 12 C18 16 14 18 12 18 C10 18 6 16 6 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M9 10 C10 11 14 11 15 10" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M9 13 C10 14 14 14 15 13" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M9 16 C10 17 14 17 15 16" fill="none" stroke="currentColor" stroke-width="1"/>
  </svg>`,

  'Spare Axle': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Spare Axle">
    <rect x="3" y="8" width="18" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="3" y1="10" x2="4" y2="10" stroke="currentColor" stroke-width="0.8"/>
    <line x1="3" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="0.8"/>
    <line x1="3" y1="14" x2="4" y2="14" stroke="currentColor" stroke-width="0.8"/>
    <line x1="20" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="0.8"/>
    <line x1="20" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="0.8"/>
    <line x1="20" y1="14" x2="21" y2="14" stroke="currentColor" stroke-width="0.8"/>
    <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
  </svg>`,

  'Shaganappi': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Shaganappi">
    <path d="M4 6 C8 4 16 4 20 6 C22 8 18 12 20 14 C22 16 22 18 18 20 C14 22 8 20 6 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M6 8 C10 6 18 8 20 10" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M6 16 C10 14 18 16 20 18" fill="none" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,

  'Tool Kit': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Tool Kit">
    <path d="M6 6 L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <rect x="4" y="3" width="4" height="5" rx="1" transform="rotate(-45 6 6)" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M16 16 L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="18" cy="14" r="2" fill="none" stroke="currentColor" stroke-width="1.2"/>
  </svg>`,

  'Bison Hide': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Bison Hide">
    <path d="M5 7 C5 5 7 4 9 4 C11 4 12 5 12 7 C12 5 13 4 15 4 C17 4 19 5 19 7 C19 11 17 17 12 19 C7 17 5 11 5 7Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 8 C9 9 11 9 12 8" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M8 12 C9 13 11 13 12 12" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M8 16 C9 17 11 17 12 16" fill="none" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,

  'Canvas Tarp': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Canvas Tarp">
    <path d="M12 4 L4 20 L20 20 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/>
    <path d="M8 14 L12 8 L16 14" fill="none" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,

  'Firewood Bundle': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Firewood Bundle">
    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="6" y1="16" x2="18" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M11 6 C11 6 12 7 12 8" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    <path d="M12 8 C12 9 13 10 14 9 C15 8 15 6 16 7 C17 8 17 10 18 9" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  </svg>`,

  'Rope (50ft)': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Rope">
    <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M12 5 L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  'Ammunition Belt': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Ammunition Belt">
    <path d="M4 10 C4 8 6 7 10 7 C14 7 18 7 20 8 C21 9 21 11 20 12 C18 13 14 13 10 13 C6 13 4 12 4 10Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="8" cy="10" r="1.2" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="12" cy="10" r="1.2" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="16" cy="10" r="1.2" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M4 10 L3 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M20 10 L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  'Medicine Pouch': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Medicine Pouch">
    <path d="M7 8 C7 6 9 5 12 5 C15 5 17 6 17 8 L17 18 C17 20 15 21 12 21 C9 21 7 20 7 18Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M7 9 L17 9" stroke="currentColor" stroke-width="1.2"/>
    <path d="M12 5 L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 13 L14 13" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
    <path d="M12 11 L12 15" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
  </svg>`,

  'Blanket': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Blanket">
    <rect x="4" y="5" width="16" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="1.2"/>
    <line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" stroke-width="1.2"/>
    <path d="M8 5 L8 19" stroke="currentColor" stroke-width="0.8"/>
    <path d="M16 5 L16 19" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,

  'Beaver Pelts': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Beaver Pelts">
    <path d="M12 5 C9 5 6 7 6 10 C6 13 8 16 12 19 C16 16 18 13 18 10 C18 7 15 5 12 5Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="10" cy="9" r="1" fill="none" stroke="currentColor" stroke-width="1"/>
    <circle cx="14" cy="9" r="1" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M11 11 C11.5 12 12.5 12 13 11" fill="none" stroke="currentColor" stroke-width="0.8"/>
    <path d="M12 19 L12 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  // Crafted items (recipe outputs)
  'Finished Hides': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Finished Hides">
    <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 9 L19 9" stroke="currentColor" stroke-width="0.8"/>
    <path d="M5 13 L19 13" stroke="currentColor" stroke-width="0.8"/>
    <path d="M9 5 L9 19" stroke="currentColor" stroke-width="0.8"/>
    <path d="M15 5 L15 19" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,

  'Travois Kit': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Travois Kit">
    <line x1="4" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="6" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1.2"/>
    <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.2"/>
    <circle cx="12" cy="18" r="1.5" fill="none" stroke="currentColor" stroke-width="1"/>
  </svg>`,

  'Gunpowder Pack': `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" aria-label="Gunpowder Pack">
    <rect x="7" y="6" width="10" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M10 6 L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M14 6 L14 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
    <path d="M12 14 L12 16" stroke="currentColor" stroke-width="0.8"/>
    <path d="M10 16 L14 16" stroke="currentColor" stroke-width="0.8"/>
  </svg>`,
};

/**
 * Return an inline SVG string for the given item name.
 * Falls back to a simple circle if name is not found.
 */
export function getItemIcon(name) {
  if (ICONS[name]) return ICONS[name];
  // Fallback: generic circle
  return `<svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
}
