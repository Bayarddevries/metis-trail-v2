export function applyTheme(root) {
  // Green & Parchment palette — period map aesthetic
  // Semantic naming: --clr-<role>[-<variant>]

  // Base palette
  root.style.setProperty('--clr-bg', '#0d2b0d');              // Dark green bg — body, status bar
  root.style.setProperty('--clr-panel-bg', '#f5e6c8');        // Parchment panels — all overlays, cards
  root.style.setProperty('--clr-journal-bg', '#f5e6c8');      // Journal bg — same as panels
  root.style.setProperty('--clr-ink-on-dark', '#e8d5a8');     // Text on dark green (warm parchment)
  root.style.setProperty('--clr-ink-on-light', '#1a3a1a');    // Text on parchment (dark green)
  root.style.setProperty('--clr-ink-light', '#c4b080');       // Secondary text on dark (muted gold)
  root.style.setProperty('--clr-ink-dark', '#2c1a0a');        // Rich brown — journal body text
  root.style.setProperty('--clr-accent', '#d4a820');          // Gold/brass — borders, headers, highlights
  root.style.setProperty('--clr-success', '#5a9a4a');         // Readable green — success states
  root.style.setProperty('--clr-danger', '#b83030');          // Brighter red — danger states
  root.style.setProperty('--clr-blessing', '#B8860B');        // Brass gold — blessing active

  // Legacy mappings (for backward compatibility)
  root.style.setProperty('--clr-ink', 'var(--clr-ink-on-dark)');         // Body text on dark green
  root.style.setProperty('--clr-ink-panel', 'var(--clr-ink-on-light)');   // Text on parchment panels
  root.style.setProperty('--clr-bg-dark', '#0a1f0a');
  root.style.setProperty('--clr-card-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-bg', 'var(--clr-accent)');
  root.style.setProperty('--clr-btn-text', '#0d2b0d');
  root.style.setProperty('--clr-btn-hover', '#e0b830');
  root.style.setProperty('--clr-status-bar-bg', 'var(--clr-bg)');
  root.style.setProperty('--clr-status-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-status-accent', 'var(--clr-accent)');
  root.style.setProperty('--clr-overlay-bg', 'rgba(10,25,10,0.92)');
  root.style.setProperty('--clr-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-bg', '#0d2b0d');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(10,25,10,0.92)');
  root.style.setProperty('--clr-tooltip-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-tooltip-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-frame-shadow', 'rgba(0,0,0,0.4)');
  root.style.setProperty('--clr-narrative-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-ruled-line', 'rgba(212,168,32,0.12)');
  root.style.setProperty('--clr-ledger-border', 'rgba(212,168,32,0.15)');
  root.style.setProperty('--clr-ledger-margin', 'var(--clr-accent)');
  root.style.setProperty('--clr-paper-texture', 'none');
  root.style.setProperty('--clr-event-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-event-accent-bar', 'var(--clr-accent)');

  // Settlement type colors
  root.style.setProperty('--clr-settlement-hbc', '#c84040');
  root.style.setProperty('--clr-settlement-metis', '#4a8cc8');
  root.style.setProperty('--clr-settlement-nwmp', '#3a9a5a');
  root.style.setProperty('--clr-settlement-mission', '#c8a030');
  root.style.setProperty('--clr-settlement-trading', '#c8a030');

  // Status-state colors
  root.style.setProperty('--clr-food-low', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn', '#e0b830');
  root.style.setProperty('--clr-ok', 'var(--clr-success)');
  root.style.setProperty('--clr-weather-rain', '#7ab0d0');
  root.style.setProperty('--clr-weather-snow', '#d0dce8');

  // Pre-departure weight states
  root.style.setProperty('--clr-over-bg', 'rgba(184,48,48,0.12)');
  root.style.setProperty('--clr-over-border', '#c84040');
  root.style.setProperty('--clr-over-text', '#e06060');
  root.style.setProperty('--clr-warn-bg', 'rgba(224,184,48,0.12)');
  root.style.setProperty('--clr-warn-border', '#e0b830');
  root.style.setProperty('--clr-gold', '#e0b830');
  root.style.setProperty('--clr-ok-bg', 'rgba(90,154,74,0.12)');
  root.style.setProperty('--clr-ok-border', '#5a9a4a');
  root.style.setProperty('--clr-ok-text', '#5a9a4a');

  // Category legend / item rows
  root.style.setProperty('--clr-catitem-bg', 'rgba(212,168,32,0.06)');
  root.style.setProperty('--clr-catitem-border', 'rgba(212,168,32,0.15)');
  root.style.setProperty('--clr-muted', '#6b5740');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(212,168,32,0.04)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(212,168,32,0.1)');

  // Camp overlay - evening campfire
  root.style.setProperty('--clr-camp-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(212,168,32,0.08)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(212,168,32,0.2)');
  root.style.setProperty('--clr-camp-btn-hover', '#1a3a1a');
  root.style.setProperty('--clr-campfire-glow', 'radial-gradient(ellipse at 50% 100%, rgba(190,130,20,0.35) 0%, rgba(200,168,26,0.22) 35%, transparent 70%)');
  root.style.setProperty('--clr-campfire-embers', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.08'/%3E%3C/svg%3E\")")
  root.style.setProperty('--clr-campfire-flicker', 'radial-gradient(circle at 45% 75%, rgba(255,140,40,0.15) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.12) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.1) 0%, transparent 30%)');

  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(90,154,74,0.3)');
  root.style.setProperty('--clr-danger-glow', 'rgba(184,48,48,0.3)');
  root.style.setProperty('--clr-choice-cost', '#9a8a6a');
  root.style.setProperty('--clr-source-text', '#c4b080');
  root.style.setProperty('--clr-source-context', '#a09070');
  root.style.setProperty('--clr-placeholder', '#5a4a35');
  root.style.setProperty('--clr-input-bg', 'rgba(255,245,230,0.08)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(255,245,230,0.12)');

  // Leaderboard
  root.style.setProperty('--clr-silver', '#b0b0b0');
  root.style.setProperty('--clr-bronze', '#c89050');
  root.style.setProperty('--clr-gold-faint', 'rgba(212,168,32,0.08)');
  root.style.setProperty('--clr-gold-light', 'rgba(212,168,32,0.15)');
  root.style.setProperty('--clr-intel-border', 'rgba(212,168,32,0.12)');

  // Typography
  root.style.setProperty('--font-heading', "'Playfair Display', 'Georgia', serif")
  root.style.setProperty('--font-body', "'Crimson Text', 'Georgia', serif");
}