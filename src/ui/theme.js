export function applyTheme(root) {
  // Darker Period Palette — IM Fell fonts, deep tones (#1a1410 bg, #2d241a panels, #e8dcc8 ink, #c8a81a accent)
  // Semantic naming: --clr-<role>[-<variant>]

  // Base palette — Phase 0.10
  root.style.setProperty('--clr-bg', '#1a1410');              // Deep charcoal-brown background
  root.style.setProperty('--clr-panel-bg', '#2d241a');        // Dark parchment panels — overlays, cards
  root.style.setProperty('--clr-journal-bg', '#2d241a');      // Journal bg — same as panels
  root.style.setProperty('--clr-ink-on-dark', '#e8dcc8');     // Text on dark bg (warm parchment)
  root.style.setProperty('--clr-ink-on-light', '#e8dcc8');    // Text on panels (same warm parchment)
  root.style.setProperty('--clr-ink-light', '#b8a890');       // Secondary text on dark (muted warm)
  root.style.setProperty('--clr-ink-dark', '#e8dcc8');        // Journal body text (warm parchment)
  root.style.setProperty('--clr-accent', '#c8a81a');          // Brass gold — borders, headers, highlights
  root.style.setProperty('--clr-success', '#7aa85a');         // Readable green — success states
  root.style.setProperty('--clr-danger', '#c85040');          // Brighter red — danger states
  root.style.setProperty('--clr-blessing', '#c8a81a');        // Brass gold — blessing active

  // Legacy mappings (for backward compatibility)
  root.style.setProperty('--clr-ink', 'var(--clr-ink-on-dark)');         // Body text on dark
  root.style.setProperty('--clr-ink-panel', 'var(--clr-ink-on-light)');   // Text on panels
  root.style.setProperty('--clr-bg-dark', '#0f0c08');
  root.style.setProperty('--clr-card-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-bg', 'var(--clr-accent)');
  root.style.setProperty('--clr-btn-text', '#1a1410');
  root.style.setProperty('--clr-btn-hover', '#e0c030');
  root.style.setProperty('--clr-status-bar-bg', 'var(--clr-bg)');
  root.style.setProperty('--clr-status-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-status-accent', 'var(--clr-accent)');
  root.style.setProperty('--clr-overlay-bg', 'rgba(20,18,14,0.95)');
  root.style.setProperty('--clr-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-bg', '#1a1410');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(20,18,14,0.95)');
  root.style.setProperty('--clr-tooltip-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-tooltip-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-frame-shadow', 'rgba(0,0,0,0.5)');
  root.style.setProperty('--clr-narrative-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-ruled-line', 'rgba(200,168,26,0.15)');
  root.style.setProperty('--clr-ledger-border', 'rgba(200,168,26,0.18)');
  root.style.setProperty('--clr-ledger-margin', 'var(--clr-accent)');
  root.style.setProperty('--clr-paper-texture', 'none');
  root.style.setProperty('--clr-event-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-event-accent-bar', 'var(--clr-accent)');

  // Settlement type colors
  root.style.setProperty('--clr-settlement-hbc', '#c85050');
  root.style.setProperty('--clr-settlement-metis', '#5a9cff');
  root.style.setProperty('--clr-settlement-nwmp', '#4ab86a');
  root.style.setProperty('--clr-settlement-mission', '#d8b840');
  root.style.setProperty('--clr-settlement-trading', '#d8b840');

  // Status-state colors
  root.style.setProperty('--clr-food-low', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn', '#e0c030');
  root.style.setProperty('--clr-ok', 'var(--clr-success)');
  root.style.setProperty('--clr-weather-rain', '#8abce0');
  root.style.setProperty('--clr-weather-snow', '#b8c8e0');

  // Pre-departure weight states
  root.style.setProperty('--clr-over-bg', 'rgba(200,80,64,0.15)');
  root.style.setProperty('--clr-over-border', '#c85040');
  root.style.setProperty('--clr-over-text', '#e07060');
  root.style.setProperty('--clr-warn-bg', 'rgba(224,192,48,0.15)');
  root.style.setProperty('--clr-warn-border', '#e0c030');
  root.style.setProperty('--clr-gold', '#e0c030');
  root.style.setProperty('--clr-ok-bg', 'rgba(122,168,90,0.15)');
  root.style.setProperty('--clr-ok-border', '#7aa85a');
  root.style.setProperty('--clr-ok-text', '#7aa85a');

  // Category legend / item rows
  root.style.setProperty('--clr-catitem-bg', 'rgba(200,168,26,0.08)');
  root.style.setProperty('--clr-catitem-border', 'rgba(200,168,26,0.18)');
  root.style.setProperty('--clr-muted', '#8a7a60');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(200,168,26,0.06)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(200,168,26,0.12)');

  // Camp overlay - evening campfire
  root.style.setProperty('--clr-camp-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(200,168,26,0.1)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(200,168,26,0.25)');
  root.style.setProperty('--clr-camp-btn-hover', '#2a2015');
  root.style.setProperty('--clr-campfire-glow', 'radial-gradient(ellipse at 50% 100%, rgba(180,130,20,0.4) 0%, rgba(200,168,26,0.25) 35%, transparent 70%)');
  root.style.setProperty('--clr-campfire-embers', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.1'/%3E%3C/svg%3E\")")
  root.style.setProperty('--clr-campfire-flicker', 'radial-gradient(circle at 45% 75%, rgba(255,140,40,0.18) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.15) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.12) 0%, transparent 30%)');

  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(122,168,90,0.35)');
  root.style.setProperty('--clr-danger-glow', 'rgba(200,80,64,0.35)');
  root.style.setProperty('--clr-choice-cost', '#a89878');
  root.style.setProperty('--clr-source-text', '#b8a890');
  root.style.setProperty('--clr-source-context', '#988870');
  root.style.setProperty('--clr-placeholder', '#6a5a40');
  root.style.setProperty('--clr-input-bg', 'rgba(232,220,200,0.1)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(232,220,200,0.15)');

  // Leaderboard
  root.style.setProperty('--clr-silver', '#b8b8b8');
  root.style.setProperty('--clr-bronze', '#d8a060');
  root.style.setProperty('--clr-gold-faint', 'rgba(200,168,26,0.1)');
  root.style.setProperty('--clr-gold-light', 'rgba(200,168,26,0.18)');
  root.style.setProperty('--clr-intel-border', 'rgba(200,168,26,0.15)');

  // Typography — IM Fell (self-hosted)
  root.style.setProperty('--font-heading', "'IM Fell Double Pica', 'Georgia', serif");
  root.style.setProperty('--font-body', "'IM Fell English', 'Georgia', serif");
  root.style.setProperty('--font-italic', "'IM Fell English', 'Georgia', serif");
}