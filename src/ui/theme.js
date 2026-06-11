export function applyTheme(root) {
  // Green & Parchment palette — period map aesthetic
  // Semantic naming: --clr-<role>[-<variant>]

  // Base palette
  root.style.setProperty('--clr-bg', '#0d2b0d');           // Dark green bg - body, status bar
  root.style.setProperty('--clr-panel-bg', '#f5e6c8');     // Parchment panels - all overlays, cards
  root.style.setProperty('--clr-journal-bg', '#f5e6c8');   // Journal bg - same as panels
  root.style.setProperty('--clr-ink-on-dark', '#f5e6c8');  // Text on dark green (parchment)
  root.style.setProperty('--clr-ink-on-light', '#1a3a1a'); // Text on parchment (dark green)
  root.style.setProperty('--clr-accent', '#c8a81a');       // Gold/brass - borders, headers, highlights
  root.style.setProperty('--clr-success', '#4a7a3a');      // Muted green - success states
  root.style.setProperty('--clr-danger', '#8b2500');       // Muted red - danger states

  // Legacy mappings (for backward compatibility)
  root.style.setProperty('--clr-ink', 'var(--clr-ink-on-dark)');        // Body text on dark green
  root.style.setProperty('--clr-ink-panel', 'var(--clr-ink-on-light)');  // Text on parchment panels
  root.style.setProperty('--clr-bg-dark', '#0d2b0d');
  root.style.setProperty('--clr-card-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-bg', 'var(--clr-accent)');
  root.style.setProperty('--clr-btn-text', '#0d2b0d');
  root.style.setProperty('--clr-btn-hover', '#a68814');
  root.style.setProperty('--clr-status-bar-bg', 'var(--clr-bg)');
  root.style.setProperty('--clr-status-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-status-accent', 'var(--clr-accent)');
  root.style.setProperty('--clr-overlay-bg', 'rgba(13,43,13,0.96)');
  root.style.setProperty('--clr-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-bg', '#0d2b0d');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(13,43,13,0.9)');
  root.style.setProperty('--clr-tooltip-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-tooltip-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-frame-shadow', 'rgba(0,0,0,0.4)');
  root.style.setProperty('--clr-narrative-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-ruled-line', 'rgba(200,168,26,0.15)');
  root.style.setProperty('--clr-ledger-border', 'rgba(200,168,26,0.2)');
  root.style.setProperty('--clr-ledger-margin', 'var(--clr-accent)');
  root.style.setProperty('--clr-paper-texture', 'none');
  root.style.setProperty('--clr-event-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-event-accent-bar', 'var(--clr-accent)');

  // Settlement type colors
  root.style.setProperty('--clr-settlement-hbc', '#8b2500');
  root.style.setProperty('--clr-settlement-metis', '#2a5c8a');
  root.style.setProperty('--clr-settlement-nwmp', '#1a6b3a');
  root.style.setProperty('--clr-settlement-mission', '#8b6914');
  root.style.setProperty('--clr-settlement-trading', '#8b6914');

  // Status-state colors
  root.style.setProperty('--clr-food-low', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn', '#d4a012');
  root.style.setProperty('--clr-ok', 'var(--clr-success)');
  root.style.setProperty('--clr-weather-rain', '#8aadbd');
  root.style.setProperty('--clr-weather-snow', '#c8d4e0');

  // Pre-departure weight states
  root.style.setProperty('--clr-over-bg', 'rgba(139,37,0,0.15)');
  root.style.setProperty('--clr-over-border', 'var(--clr-danger)');
  root.style.setProperty('--clr-over-text', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn-bg', 'rgba(212,160,18,0.15)');
  root.style.setProperty('--clr-warn-border', 'var(--clr-warn)');
  root.style.setProperty('--clr-gold', '#D4A012');
  root.style.setProperty('--clr-ok-bg', 'rgba(74,122,58,0.15)');
  root.style.setProperty('--clr-ok-border', 'var(--clr-success)');
  root.style.setProperty('--clr-ok-text', 'var(--clr-success)');

  // Category legend / item rows
  root.style.setProperty('--clr-catitem-bg', 'rgba(26,58,26,0.05)');
  root.style.setProperty('--clr-catitem-border', 'rgba(200,168,26,0.15)');
  root.style.setProperty('--clr-muted', '#6a8a5a');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(26,58,26,0.03)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(200,168,26,0.1)');

  // Camp overlay - evening campfire
  root.style.setProperty('--clr-camp-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(26,58,26,0.05)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(200,168,26,0.15)');
  root.style.setProperty('--clr-camp-btn-hover', '#1a3a1a');
  root.style.setProperty('--clr-campfire-glow', 'radial-gradient(ellipse at 50% 100%, rgba(190,130,20,0.35) 0%, rgba(200,168,26,0.22) 35%, transparent 70%)');
  root.style.setProperty('--clr-campfire-embers', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.08'/%3E%3C/svg%3E\")");
  root.style.setProperty('--clr-campfire-flicker', 'radial-gradient(circle at 45% 75%, rgba(255,140,40,0.15) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.12) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.1) 0%, transparent 30%)');

  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(74,122,58,0.3)');
  root.style.setProperty('--clr-danger-glow', 'rgba(139,37,0,0.3)');
  root.style.setProperty('--clr-choice-cost', '#6a8a5a');
  root.style.setProperty('--clr-source-text', '#6a8a5a');
  root.style.setProperty('--clr-source-context', '#8a9a7a');
  root.style.setProperty('--clr-placeholder', '#5a7a4a');
  root.style.setProperty('--clr-input-bg', 'rgba(26,58,26,0.1)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(26,58,26,0.15)');

  // Leaderboard
  root.style.setProperty('--clr-silver', '#9a9a9a');
  root.style.setProperty('--clr-bronze', '#A6784C');
  root.style.setProperty('--clr-gold-faint', 'rgba(200,168,26,0.08)');
  root.style.setProperty('--clr-gold-light', 'rgba(200,168,26,0.15)');
  root.style.setProperty('--clr-intel-border', 'rgba(200,168,26,0.1)');

  // Typography
  root.style.setProperty('--font-heading', "'Playfair Display', 'Georgia', serif");
  root.style.setProperty('--font-body', "'Crimson Text', 'Georgia', serif");
}