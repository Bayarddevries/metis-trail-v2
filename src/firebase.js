import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA1F98nBAKviNgpDNP3SaD9dN1w0bsyDTI',
  authDomain: 'metis-trail.firebaseapp.com',
  projectId: 'metis-trail',
  storageBucket: 'metis-trail.firebasestorage.app',
  messagingSenderId: '518851271945',
  appId: '1:518851271945:web:0793b124677177bed947d8',
  measurementId: 'G-M7BEXL4QY0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const LOCAL_KEY = 'metisLocalScores';
const SYNC_KEY = 'metisSyncedLocalScores';

/**
 * Save a score document to Firestore.
 * Falls back to localStorage if Firestore is unreachable.
 * @param {Object} scoreData - All score fields from engine.getScoreData()
 * @param {string} playerName - Name from intro overlay
 * @returns {Promise<{id: string|null, local: boolean}>}
 */
export async function saveScore(scoreData, playerName) {
  const doc = {
    name: playerName || 'Traveller',
    ...scoreData,
    date: serverTimestamp(),
  };

  try {
    const ref = await addDoc(collection(db, 'scores'), doc);
    return { id: ref.id, local: false };
  } catch (err) {
    console.warn('[Metis] Firestore save failed, storing locally:', err.message);
    saveLocal(doc);
    return { id: null, local: true };
  }
}

/**
 * Get top 10 scores from Firestore.
 * @returns {Promise<Array>} Array of score docs
 */
export async function getTopScores() {
  try {
    const q = query(collection(db, 'scores'), orderBy('score', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('[Metis] Firestore top scores unavailable:', err.message);
    return null;
  }
}

/**
 * Get personal scores matching a name.
 * @param {string} name - Player name to filter by
 * @returns {Promise<Array>} Array of score docs
 */
export async function getMyScores(name) {
  if (!name) return [];
  try {
    const q = query(
      collection(db, 'scores'),
      where('name', '==', name),
      orderBy('date', 'desc'),
      limit(20),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('[Metis] Firestore personal scores unavailable:', err.message);
    return null;
  }
}

/**
 * Try to sync locally-stored scores to Firestore.
 * Called on page load.
 */
export async function syncLocalScores() {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return;
  const scores = JSON.parse(raw);
  if (!scores.length) return;

  const syncedIds = JSON.parse(localStorage.getItem(SYNC_KEY) || '[]');
  const stillLocal = [];

  for (const s of scores) {
    if (syncedIds.includes(s._localId)) continue;
    try {
      await addDoc(collection(db, 'scores'), { ...s, date: serverTimestamp() });
      syncedIds.push(s._localId);
    } catch {
      stillLocal.push(s);
    }
  }

  localStorage.setItem(SYNC_KEY, JSON.stringify(syncedIds));
  if (stillLocal.length) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(stillLocal));
  } else {
    localStorage.removeItem(LOCAL_KEY);
  }
}

// ── Local fallback helpers ──────────────────────────────────────────

function saveLocal(doc) {
  const raw = localStorage.getItem(LOCAL_KEY);
  const scores = raw ? JSON.parse(raw) : [];
  doc._localId = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  scores.push(doc);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(scores));
}
