export function applyTheme(root) {
  // Sprint 4: Gritty period-accurate palette
  // Semantic naming: --clr-<role>[-<variant>]
  
  // Base palette
  root.style.setProperty('--clr-bg', '#1a1208');           // Dark bg - body, status bar, overlays
  root.style.setProperty('--clr-panel-bg', '#2a1f10');     // Panel bg - all overlay backgrounds
  root.style.setProperty('--clr-journal-bg', '#f5e6c8');   // Journal bg - #journal only
  root.style.setProperty('--clr-ink-dark', '#3a2f1f');     // Ink dark - text on cream
  root.style.setProperty('--clr-ink-light', '#c4b69a');    // Ink light - text on dark
  root.style.setProperty('--clr-accent', '#8b6914');       // Accent brass - borders, headers, highlights
  root.style.setProperty('--clr-success', '#4a7a3a');      // Success - muted green
  root.style.setProperty('--clr-danger', '#8b2500');       // Danger - muted red
  
  // Legacy mappings (for backward compatibility during transition)
  root.style.setProperty('--clr-ink', 'var(--clr-ink-dark)');
  root.style.setProperty('--clr-bg-dark', '#1a1208');
  root.style.setProperty('--clr-card-bg', 'var(--clr-panel-bg)');
  root.style.setProperty('--clr-btn-bg', 'var(--clr-accent)');
  root.style.setProperty('--clr-btn-text', '#1a1208');
  root.style.setProperty('--clr-btn-hover', '#7a5a20');
  root.style.setProperty('--clr-status-bar-bg', 'var(--clr-bg)');
  root.style.setProperty('--clr-status-text', 'var(--clr-ink-light)');
  root.style.setProperty('--clr-status-accent', 'var(--clr-accent)');
  root.style.setProperty('--clr-overlay-bg', 'rgba(26,18,8,0.96)');
  root.style.setProperty('--clr-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-bg', '#1a1208');
  root.style.setProperty('--clr-tooltip-bg', 'rgba(26,18,8,0.9)');
  root.style.setProperty('--clr-tooltip-text', 'var(--clr-ink-light)');
  root.style.setProperty('--clr-tooltip-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-map-frame-shadow', 'rgba(0,0,0,0.3)');
  root.style.setProperty('--clr-narrative-text', 'var(--clr-ink-dark)');
  root.style.setProperty('--clr-ruled-line', 'rgba(139,105,20,0.15)');
  root.style.setProperty('--clr-ledger-border', 'rgba(139,105,20,0.2)');
  root.style.setProperty('--clr-ledger-margin', 'var(--clr-accent)');
  root.style.setProperty('--clr-paper-texture', 'none');  // Remove noise texture
  root.style.setProperty('--clr-event-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-event-accent-bar', 'var(--clr-accent)');
  
  // Status-state colors
  root.style.setProperty('--clr-food-low', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn', '#b8860b');
  root.style.setProperty('--clr-ok', 'var(--clr-success)');
  root.style.setProperty('--clr-weather-rain', '#6b8e9b');
  root.style.setProperty('--clr-weather-snow', '#b8c4d0');
  
  // Pre-departure weight states
  root.style.setProperty('--clr-over-bg', 'rgba(139,37,0,0.15)');
  root.style.setProperty('--clr-over-border', 'var(--clr-danger)');
  root.style.setProperty('--clr-over-text', 'var(--clr-danger)');
  root.style.setProperty('--clr-warn-bg', 'rgba(184,134,11,0.15)');
  root.style.setProperty('--clr-warn-border', 'var(--clr-warn)');
  root.style.setProperty('--clr-gold', '#B8860B');
  root.style.setProperty('--clr-ok-bg', 'rgba(74,122,58,0.15)');
  root.style.setProperty('--clr-ok-border', 'var(--clr-success)');
  root.style.setProperty('--clr-ok-text', 'var(--clr-success)');
  
  // Category legend / item rows
  root.style.setProperty('--clr-catitem-bg', 'rgba(255,255,255,0.05)');
  root.style.setProperty('--clr-catitem-border', 'rgba(139,105,20,0.15)');
  root.style.setProperty('--clr-muted', '#8a7a6a');
  root.style.setProperty('--clr-pdrow-bg', 'rgba(255,255,255,0.03)');
  root.style.setProperty('--clr-pdrow-border', 'rgba(139,105,20,0.1)');
  
  // Camp overlay - evening campfire
  root.style.setProperty('--clr-camp-border', 'var(--clr-accent)');
  root.style.setProperty('--clr-camp-pill-bg', 'rgba(255,255,255,0.05)');
  root.style.setProperty('--clr-camp-pill-border', 'rgba(139,105,20,0.15)');
  root.style.setProperty('--clr-camp-btn-hover', '#3a2f1f');
  root.style.setProperty('--clr-campfire-glow', 'radial-gradient(ellipse at 50% 100%, rgba(180,110,20,0.35) 0%, rgba(139,105,20,0.22) 35%, transparent 70%)');
  root.style.setProperty('--clr-campfire-embers', "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='campNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.025' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23campNoise)' opacity='0.08'/%3E%3C/svg%3E\")");
  root.style.setProperty('--clr-campfire-flicker', 'radial-gradient(circle at 45% 75%, rgba(255,140,40,0.15) 0%, transparent 40%), radial-gradient(circle at 55% 65%, rgba(255,110,30,0.12) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(255,80,20,0.1) 0%, transparent 30%)');
  
  // Dice / outcome colors
  root.style.setProperty('--clr-success-glow', 'rgba(74,122,58,0.3)');
  root.style.setProperty('--clr-danger-glow', 'rgba(139,37,0,0.3)');
  root.style.setProperty('--clr-choice-cost', '#8a7a6a');
  root.style.setProperty('--clr-source-text', '#8a7a6a');
  root.style.setProperty('--clr-source-context', '#9a8a7a');
  root.style.setProperty('--clr-placeholder', '#6a5a4a');
  root.style.setProperty('--clr-input-bg', 'rgba(255,255,255,0.05)');
  root.style.setProperty('--clr-input-bg-focus', 'rgba(255,255,255,0.1)');
  
  // Leaderboard
  root.style.setProperty('--clr-silver', '#8a8a8a');
  root.style.setProperty('--clr-bronze', '#8B5E3C');
  root.style.setProperty('--clr-gold-faint', 'rgba(139,105,20,0.08)');
  root.style.setProperty('--clr-gold-light', 'rgba(139,105,20,0.15)');
  root.style.setProperty('--clr-intel-border', 'rgba(139,105,20,0.1)');
  
  // Typography
  root.style.setProperty('--font-heading', "'Playfair Display', 'Georgia', serif");
  root.style.setProperty('--font-body', "'Crimson Text', 'Georgia', serif");
}