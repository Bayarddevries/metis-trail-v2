export function applyTheme(root) {
  // Prairie Broad Palette — light ink-on-rag base, prairie green + dusk purple accents
  root.style.setProperty('--clr-bg', '#efe6d3');              // Light rag-paper surface
  root.style.setProperty('--clr-panel-bg', '#e3d8b8');        // Warm off-white panels
  root.style.setProperty('--clr-journal-bg', '#e3d8b8');      // Journal surface
  root.style.setProperty('--clr-ink-on-dark', '#1f1811');     // Dark text on light
  root.style.setProperty('--clr-ink-on-light', '#1f1811');    // Dark text on light panels
  root.style.setProperty('--clr-ink-light', '#6b5d48');       // Muted secondary text
  root.style.setProperty('--clr-ink-dark', '#1f1811');        // Journal body text
  root.style.setProperty('--clr-accent', '#4a6b4a');          // Prairie green
  root.style.setProperty('--clr-accent-alt', '#6b4c7a');     // Dusk purple
  root.style.setProperty('--clr-success', '#4a6b4a');         // Green success
  root.style.setProperty('--clr-danger', '#8a3324');          // Warm red
  root.style.setProperty('--clr-warn', '#9a7b2e');            // Warm amber
  root.style.setProperty('--clr-blessing', '#4a6b4a');        // Prairie green blessing

  // Legacy mappings
  root.style.setProperty('--clr-ink', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-ink-panel', 'var(--clr-ink-on-light)');
  root.style.setProperty('--clr-bg-dark', '#3f3529');         // Darker panel depth
  root.style.setProperty('--clr-card-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-text', '#1f1811');
  root.style.setProperty('--clr-btn-hover', 'var(--clr-panel-bg-2)');
  root.style.setProperty('--clr-status-bar-bg', 'var(--clr-bg)');
  root.style.setProperty('--clr-status-text', 'var(--clr-ink-on-dark)');
  root.style.setProperty('--clr-status-accent', 'var(--clr-accent)');
  root.style.setProperty('--clr-overlay-bg', 'rgba(31,24,17,0.95)');
  root.style.setProperty('--clr-border', 'rgba(107,76,122,0.28)');
  root.style.setProperty('--clr-map-bg', '#1a1410');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(31,24,17,0.95)');
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
  root.style.setProperty('--clr-catitem-bg', 'rgba(74,107,74,0.08)');
  root.style.setProperty('--clr-catitem-border', 'rgba(74,107,74,0.18)');
  root.style.setProperty('--clr-muted', '#6b5d48');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(74,107,74,0.06)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(74,107,74,0.12)');

  // Camp overlay
  root.style.setProperty('--clr-camp-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(74,107,74,0.08)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(74,107,74,0.2)');
  root.style.setProperty('--clr-camp-btn-hover', 'var(--clr-panel-bg-2)');
  root.style.setProperty('--clr-campfire-glow', 'radial-gradient(ellipse at 50% 100%, rgba(180,130,20,0.4) 0%, rgba(200,168,26,0.25) 35%, transparent 70%)');
  root.style.setProperty('--clr-campfire-embers', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.1'/%3E%3C/svg%3E\")");
  root.style.setProperty('--clr-campfire-flicker', 'radial-gradient(circle at 45% 75%, rgba(255,140,40,0.18) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.15) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.12) 0%, transparent 30%)');

  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(74,107,74,0.35)');
  root.style.setProperty('--clr-danger-glow', 'rgba(138,51,36,0.35)');
  root.style.setProperty('--clr-choice-cost', '#6b5d48');
  root.style.setProperty('--clr-source-text', '#6b5d48');
  root.style.setProperty('--clr-source-context', '#6b5d48');
  root.style.setProperty('--clr-placeholder', '#6b5d48');
  root.style.setProperty('--clr-input-bg', 'rgba(31,24,17,0.08)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(31,24,17,0.12)');

  // Leaderboard
  root.style.setProperty('--clr-silver', '#b8b8b8');
  root.style.setProperty('--clr-bronze', '#d8a060');
  root.style.setProperty('--clr-gold-faint', 'rgba(200,168,26,0.12)');
  root.style.setProperty('--clr-gold-light', 'rgba(200,168,26,0.18)');
  root.style.setProperty('--clr-intel-border', 'rgba(107,76,122,0.22)');

  // Typography — Cormorant Garamond + Lora (self-hosted variable)
  root.style.setProperty('--font-heading', "'Cormorant Garamond', Georgia, 'Times New Roman', serif");
  root.style.setProperty('--font-body', "'Lora', Georgia, 'Times New Roman', serif");
  root.style.setProperty('--font-italic', "'Lora', Georgia, 'Times New Roman', serif");
}
