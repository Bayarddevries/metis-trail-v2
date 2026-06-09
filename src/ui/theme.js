export function applyTheme(root) {
  // Base palette — all colors defined here as CSS custom properties
  // Semantic naming: --clr-<role>[-<variant>]
  root.style.setProperty('--clr-bg', '#CFC1A4');
  root.style.setProperty('--clr-bg-dark', '#B8AA8A');
  root.style.setProperty('--clr-ink', '#1A1A18');
  root.style.setProperty('--clr-accent', '#8C6A2A');
  root.style.setProperty('--clr-border', '#4A5D55');
  root.style.setProperty('--clr-status-bg', '#243B32');
  root.style.setProperty('--clr-status-text', '#F2E9D8');
  root.style.setProperty('--clr-status-accent', '#C99A3B');
  root.style.setProperty('--clr-status-bar-bg', '#1a2922');
  root.style.setProperty('--clr-overlay-bg', 'rgba(22,28,24,0.94)');
  root.style.setProperty('--clr-card-bg', '#E6DBC4');
  root.style.setProperty('--clr-btn-bg', '#2D4A3E');
  root.style.setProperty('--clr-btn-text', '#F2E9D8');
  root.style.setProperty('--clr-btn-hover', '#1E2B26');

  // Status-state colors
  root.style.setProperty('--clr-food-low', '#e63946');
  root.style.setProperty('--clr-warn', '#f4a261');
  root.style.setProperty('--clr-ok', '#8ab17d');
  root.style.setProperty('--clr-weather-rain', '#6B8E9B');
  root.style.setProperty('--clr-danger', '#8B2500');
  root.style.setProperty('--clr-weather-snow', '#B8C4D0');
  root.style.setProperty('--clr-success', '#2e7d32');

  // Map
  root.style.setProperty('--clr-map-bg', '#BFB195');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(26,20,16,0.85)');
  root.style.setProperty('--clr-tooltip-text', '#E8DCC8');
  root.style.setProperty('--clr-tooltip-border', 'rgba(232,220,200,0.3)');
  root.style.setProperty('--clr-map-frame-shadow', 'rgba(26,20,16,0.12)');

  // Narrative paper texture
  root.style.setProperty('--clr-narrative-text', '#3a3025');
  root.style.setProperty('--clr-ruled-line', 'rgba(26,20,16,0.08)');
  root.style.setProperty('--clr-ledger-border', 'rgba(26,20,16,0.15)');
  root.style.setProperty('--clr-ledger-margin', '#8C6A2A');
  // Subtle paper noise texture as base64 SVG
  root.style.setProperty('--clr-paper-texture', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")");

  // Event overlay
  root.style.setProperty('--clr-event-border', '#7a5a32');
  root.style.setProperty('--clr-event-accent-bar', '#6e4524');
  root.style.setProperty('--clr-overlay-pattern-1', 'rgba(60,40,10,0.08)');
  root.style.setProperty('--clr-overlay-pattern-2', 'rgba(60,40,10,0.10)');
  root.style.setProperty('--clr-overlay-pattern-3', 'rgba(60,40,10,0.07)');
  root.style.setProperty('--clr-overlay-pattern-4', 'rgba(80,60,20,0.12)');
  root.style.setProperty('--clr-overlay-pattern-5', 'rgba(80,60,20,0.09)');

  // Pre-departure weight states
  root.style.setProperty('--clr-over-bg', 'rgba(180,60,60,0.15)');
  root.style.setProperty('--clr-over-border', 'rgba(180,60,60,0.4)');
  root.style.setProperty('--clr-over-text', '#8B0000');
  root.style.setProperty('--clr-warn-bg', 'rgba(184,134,11,0.15)');
  root.style.setProperty('--clr-warn-border', 'rgba(184,134,11,0.4)');
  root.style.setProperty('--clr-gold', '#B8860B');
  root.style.setProperty('--clr-ok-bg', 'rgba(46,90,62,0.12)');
  root.style.setProperty('--clr-ok-border', 'rgba(46,90,62,0.3)');
  root.style.setProperty('--clr-ok-text', '#2D4A3E');

  // Category legend / item rows
  root.style.setProperty('--clr-catitem-bg', 'rgba(255,255,255,0.6)');
  root.style.setProperty('--clr-catitem-border', 'rgba(0,0,0,0.06)');
  root.style.setProperty('--clr-muted', '#6b5c4a');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(255,255,255,0.5)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(0,0,0,0.06)');

  // Camp overlay
  root.style.setProperty('--clr-camp-border', '#4a6741');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(255,255,255,0.65)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(0,0,0,0.08)');
  root.style.setProperty('--clr-camp-btn-hover', '#e3d6bc');

  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(46,125,50,0.3)');
  root.style.setProperty('--clr-danger-glow', 'rgba(139,37,0,0.3)');
  root.style.setProperty('--clr-choice-cost', '#5e4b35');
  root.style.setProperty('--clr-source-text', '#5a4a3a');
  root.style.setProperty('--clr-source-context', '#8a7a6a');
  root.style.setProperty('--clr-placeholder', '#9a8a7a');
  root.style.setProperty('--clr-input-bg', 'rgba(255,255,255,0.7)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(255,255,255,0.9)');

  // Leaderboard
  root.style.setProperty('--clr-silver', '#8a8a8a');
  root.style.setProperty('--clr-bronze', '#8B5E3C');
  root.style.setProperty('--clr-gold-faint', 'rgba(184,134,11,0.08)');
  root.style.setProperty('--clr-gold-light', 'rgba(184,134,11,0.2)');
  root.style.setProperty('--clr-intel-border', 'rgba(0,0,0,0.08)');

  // Typography
  root.style.setProperty('--font-heading', "'Playfair Display', 'Georgia', serif");
  root.style.setProperty('--font-body', "'Crimson Text', 'Georgia', serif");
}