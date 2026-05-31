export function applyTheme(root) {
  const isDark = false;
  root.style.setProperty('--clr-bg', '#E8DCC8');
  root.style.setProperty('--clr-bg-dark', '#D6C8A8');
  root.style.setProperty('--clr-ink', '#1A1410');
  root.style.setProperty('--clr-accent', '#8B2500');
  root.style.setProperty('--clr-forest', '#2C4A1E');
  root.style.setProperty('--clr-brass', '#A67C29');
  root.style.setProperty('--clr-border', '#B8A478');
  root.style.setProperty('--clr-status-bg', '#1A1410');
  root.style.setProperty('--clr-status-text', '#E8DCC8');
  root.style.setProperty('--clr-overlay-bg', 'rgba(26,20,16,0.92)');
  root.style.setProperty('--font-heading', "'Rye', 'Georgia', serif");
  root.style.setProperty('--font-body', "'Alegreya', 'Georgia', serif");
}
