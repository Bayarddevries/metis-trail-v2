import { NODES } from '../data/nodes.js';
import { applyTheme } from './theme.js';
import cartMarkerUrl from '../../art/cart_marker.png';

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function monthName(month) {
  return MONTH_NAMES[month] || String(month);
}

let map = null;
let tileLayer = null;
let markerGroup = null;
let fullTrailLine = null;

const cartIcon = L.icon({
  iconUrl: cartMarkerUrl,
  iconSize: [100, 48],
  iconAnchor: [50, 24],
  popupAnchor: [0, -24],
});

// #23: Calculate initial view centered on the first few nodes
function getInitialView() {
  const initialNodes = NODES.slice(0, 4);
  const lats = initialNodes.map(n => n.lat);
  const lons = initialNodes.map(n => n.lon);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
  return { center: [centerLat, centerLon], zoom: 9 };
}

export function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  if (map) return;
  if (!window.__METIS_READY__) return;

  applyTheme(el);

  const { center, zoom } = getInitialView();

  map = L.map('map', {
    center,
    zoom,
    zoomControl: true,
  });

  tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM contributors',
    maxZoom: 18,
  }).addTo(map);

  markerGroup = L.featureGroup().addTo(map);

  // #9: Draw full trail as faint dashed line
  const allCoords = NODES.map(n => [n.lat, n.lon]);
  fullTrailLine = L.polyline(allCoords, {
    color: '#8B2500',
    weight: 2,
    opacity: 0.2,
    dashArray: '6 4',
  }).addTo(markerGroup);

  updateMap({ node: 0 });
}

export function updateMap(state) {
  if (!map) return;
  const here = NODES[state.node];
  if (!here) return;

  const next = NODES[state.node + 1];
  const visited = NODES.slice(0, state.node + 1).map((n) => [n.lat, n.lon]);

  // #8: Interpolate cart position between current and next node
  let cartLat = here.lat;
  let cartLon = here.lon;
  let viewLat = cartLat;
  let viewLon = cartLon;

  if (next && next.dist > 0) {
    const progress = Math.min((state.segmentDay || 0) / next.dist, 1);
    cartLat = here.lat + (next.lat - here.lat) * progress;
    cartLon = here.lon + (next.lon - here.lon) * progress;
    viewLat = cartLat;
    viewLon = cartLon;
  }

  // Smooth pan to follow cart
  map.panTo([viewLat, viewLon], { animate: true, duration: 0.3 });

  if (!markerGroup) markerGroup = L.featureGroup().addTo(map);
  markerGroup.clearLayers();

  // Re-draw full trail faint line (#9)
  if (fullTrailLine) {
    fullTrailLine.addTo(markerGroup);
  } else {
    const allCoords = NODES.map(n => [n.lat, n.lon]);
    L.polyline(allCoords, {
      color: '#8B2500',
      weight: 2,
      opacity: 0.2,
      dashArray: '6 4',
    }).addTo(markerGroup);
  }

  // Draw visited trail as solid line
  if (visited.length > 1) {
    L.polyline(visited, { color: '#8B2500', weight: 3, opacity: 0.7 }).addTo(markerGroup);
  }

  // Next node marker
  if (next) {
    L.circleMarker([next.lat, next.lon], {
      radius: 6,
      color: '#1A1410',
      fillColor: '#E8DCC8',
      fillOpacity: 1,
    }).addTo(markerGroup);
  }

  // Cart marker at interpolated position (#8)
  L.marker([cartLat, cartLon], { icon: cartIcon }).addTo(markerGroup);
}

export function renderTravelLinesView(state, gameRef, result) {
  const here = gameRef?.getCurrentNode?.();
  const next = gameRef?.getNextNode?.();
  const lines = [];
  if (here) {
    lines.push(`${here.name} — Day ${state.day}`);
    if (here.desc) lines.push(here.desc);
  }
  if (next) lines.push(`Next: ${next.name}`);
  if (result) lines.push(result);
  if (!lines.length) lines.push('On the trail...');
  renderNarrative(lines);
}

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

  if (dayEl) dayEl.textContent = String(state.day);
  if (monthEl) monthEl.textContent = monthName(state.month);
  if (seasonEl) seasonEl.textContent = state.season;

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
  foodEl.innerHTML = `<span class="stat-label">Food </span><span class="stat-value${state.food <= 5 ? ' food-low' : ''}">${state.food}</span>`;
  wearEl.innerHTML = `<span class="stat-label">Wear </span><span class="stat-value${state.wear >= 4 ? ' wear-high' : ''}">${state.wear}</span>`;

  if (!window.__METIS_PENDING_RESULT__) window.__METIS_PENDING_RESULT__ = null;
  renderTravelLinesView(state, window._metisGame, window.__METIS_PENDING_RESULT__);
}

export function renderNarrative(lines) {
  const el = document.getElementById('narrative');
  el.innerHTML = lines.map((t) => `<div class="scene-text">${t}</div>`).join('');
  el.scrollTop = el.scrollHeight;
}
