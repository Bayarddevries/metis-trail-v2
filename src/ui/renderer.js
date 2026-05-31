import { NODES } from '../data/nodes.js';
import { applyTheme } from './theme.js';

export function renderStatusBar(state) {
  const node = NODES[state.node];
  const next = NODES[state.node + 1];
  const dayEl = document.getElementById('s-day');
  const monthEl = document.getElementById('s-month');
  const seasonEl = document.getElementById('s-season');
  const segEl = document.getElementById('s-segment');
  const foodEl = document.getElementById('s-food');
  const wearEl = document.getElementById('s-wear');
  const crewEl = document.getElementById('s-crew');

  dayEl.innerHTML = `<span class="stat-label">Day </span><span class="stat-value">${state.day}</span>`;
  monthEl.textContent = `${state.month}/${state.date?.day ?? state.day}`;
  seasonEl.textContent = state.season.replace('_', ' ');

  if (state.pendingSettlement) {
    segEl.textContent = `${node.name} — you have arrived`;
  } else if (next) {
    segEl.textContent = `${node.name} → ${next.name}`;
  } else {
    segEl.textContent = node.name;
  }

  foodEl.innerHTML = `<span class="stat-label">Food </span><span class="stat-value${state.food <= 5 ? ' food-low' : ''}">${state.food}</span>`;
  wearEl.innerHTML = `<span class="stat-label">Wear </span><span class="stat-value${state.wear >= 4 ? ' wear-high' : ''}">${state.wear}</span>`;
  crewEl.innerHTML = `<span class="stat-label">Crew </span><span class="stat-value">${state.crew}</span>`;
}

export function renderNarrative(lines) {
  const el = document.getElementById('narrative');
  el.innerHTML = lines.map((t) => `<div class="scene-text">${t}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}
