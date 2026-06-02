import { NODES } from '../data/nodes.js';
import { applyTheme } from './theme.js';

let map = null;
let tileLayer = null;
let markerGroup = null;

export function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  if (map) return;

  applyTheme(el);

  map = L.map('map', {
    center: [NODES[0].lat, NODES[0].lon],
    zoom: 6,
    zoomControl: true,
  });

  tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM contributors',
    maxZoom: 18,
  }).addTo(map);

  markerGroup = L.featureGroup().addTo(map);
  updateMap({ node: 0 });
}

export function updateMap(state) {
  if (!map) return;
  const here = NODES[state.node];
  if (!here) return;

  const visited = NODES.slice(0, state.node + 1).map((n) => [n.lat, n.lon]);
  const next = NODES[state.node + 1];

  map.setView([here.lat, here.lon], Math.max(map.getZoom(), 6));

  if (!markerGroup) markerGroup = L.featureGroup().addTo(map);
  markerGroup.clearLayers();

  if (visited.length > 1) {
    L.polyline(visited, { color: '#8B2500', weight: 3, opacity: 0.7 }).addTo(markerGroup);
  }

  if (next) {
    L.circleMarker([next.lat, next.lon], {
      radius: 6,
      color: '#1A1410',
      fillColor: '#E8DCC8',
      fillOpacity: 1,
    }).addTo(markerGroup);
  }

  L.circleMarker([here.lat, here.lon], {
    radius: 8,
    color: '#1A1410',
    fillColor: '#8B2500',
    fillOpacity: 1,
  }).addTo(markerGroup);
}

export function renderTravelLines2(state, gameRef, result) {
  const here = gameRef?.getCurrentNode?.();
  const next = gameRef?.getNextNode?.();
  const lines = [];
  if (here) {
    lines.push(`${here.name} — Day ${state.day}`);
    if (here.desc) lines.push(here.desc);
  }
  if (next) {
    lines.push(`Next: ${next.name}`);
    if (next.desc) lines.push(next.desc);
  }
  if (result) lines.push(result);
  if (!lines.length) lines.push('On the trail...');
  renderNarrative(lines);
}

export function renderStatusBar(state) {
  const node = NODES[state.node];
  const next = NODES[state.node + 1];
  const segEl = document.getElementById('s-segment');
  const foodEl = document.getElementById('s-food');
  const wearEl = document.getElementById('s-wear');
  const crewEl = document.getElementById('s-crew');

  if (segEl) {
    if (state.pendingSettlement) {
      segEl.textContent = `At: ${node?.name || 'camp'}`;
    } else if (next) {
      segEl.textContent = `Next: ${next.name} (${next.dist} day segment)`;
    } else {
      segEl.textContent = node?.name || 'Arrived';
    }
  }

  const crewState = (window._metisGame?.getCrew?.()?.state) || '';
  let crewCls = 'stat-value';
  if (crewState === 'tired') crewCls += ' crew-tired';
  else if (crewState === 'exhausted') crewCls += ' crew-exhausted';
  else if (crewState === 'rested') crewCls += ' crew-rested';
  crewEl.innerHTML = `<span class="stat-label">Crew </span><span class="${crewCls}">${state.crew}</span>`;
  foodEl.innerHTML = `<span class="stat-label">Food </span><span class="stat-value${state.food <= 4 ? ' food-low' : ''}">${state.food}</span>`;
  wearEl.innerHTML = `<span class="stat-label">Wear </span><span class="stat-value${state.wear >= 4 ? ' wear-high' : ''}">${state.wear}</span>`;

  renderTravelLines2(state, window._metisGame, pendingResult);
}

export function renderNarrative(lines) {
  const el = document.getElementById('narrative');
  el.innerHTML = lines.map((t) => `<div class="scene-text">${t}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}
