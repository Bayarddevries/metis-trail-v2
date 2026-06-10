// Web Audio ambient engine + one-shot SFX for Metis Trail V2
// All functions are safe to call before user gesture — they no-op if no context.

let ctx = null;
let masterGain = null;
const ambientNodes = [];

function ensureCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(ctx.destination);
    } catch (_) {
      return null;
    }
  }
  return { ctx, masterGain };
}

// ── Ambient layers ──────────────────────────────────────────────────

export async function startAmbient() {
  const audio = ensureCtx();
  if (!audio) return;
  const { ctx: c, master } = audio;

  // Resume if suspended (autoplay policy)
  if (c.state === 'suspended') {
    try { await c.resume(); } catch (_) { return; }
  }

  // Wind: white noise → lowpass 400Hz → LFO on gain
  const windBufferSize = c.sampleRate * 2;
  const windBuffer = c.createBuffer(1, windBufferSize, c.sampleRate);
  const windData = windBuffer.getChannelData(0);
  for (let i = 0; i < windBufferSize; i++) {
    windData[i] = Math.random() * 2 - 1;
  }
  const windSource = c.createBufferSource();
  windSource.buffer = windBuffer;
  windSource.loop = true;

  const windFilter = c.createBiquadFilter();
  windFilter.type = 'lowpass';
  windFilter.frequency.value = 400;

  const windGain = c.createGain();
  windGain.gain.value = 0.12;

  const windLFO = c.createOscillator();
  windLFO.type = 'sine';
  windLFO.frequency.value = 0.15;
  const windLFOGain = c.createGain();
  windLFOGain.gain.value = 0.06;
  windLFO.connect(windLFOGain);
  windLFOGain.connect(windGain.gain);
  windLFO.start();

  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(master);
  windSource.start();

  ambientNodes.push(windSource, windLFO);

  // Ox hooves: sine 80Hz → gain pulsed at ~1Hz
  const hoofOsc = c.createOscillator();
  hoofOsc.type = 'sine';
  hoofOsc.frequency.value = 80;

  const hoofGain = c.createGain();
  hoofGain.gain.value = 0;

  const hoofLFO = c.createOscillator();
  hoofLFO.type = 'square';
  hoofLFO.frequency.value = 1;
  const hoofLFOGain = c.createGain();
  hoofLFOGain.gain.value = 0.04;
  hoofLFO.connect(hoofLFOGain);
  hoofLFOGain.connect(hoofGain.gain);
  hoofLFO.start();

  hoofOsc.connect(hoofGain);
  hoofGain.connect(master);
  hoofOsc.start();

  ambientNodes.push(hoofOsc, hoofLFO);

  // Bird chirp: random high-freq sine sweep, triggered every 5-15s
  function scheduleBirdChirp() {
    if (!ctx || ctx.state === 'closed') return;
    const delay = 5000 + Math.random() * 10000;
    setTimeout(() => {
      if (!ctx || ctx.state === 'closed') return;
      try {
        const now = c.currentTime;
        const chirpOsc = c.createOscillator();
        chirpOsc.type = 'sine';
        chirpOsc.frequency.setValueAtTime(2200, now);
        chirpOsc.frequency.linearRampToValueAtTime(2800, now + 0.1);
        chirpOsc.frequency.linearRampToValueAtTime(1800, now + 0.2);

        const chirpGain = c.createGain();
        chirpGain.gain.setValueAtTime(0.08, now);
        chirpGain.gain.linearRampToValueAtTime(0, now + 0.2);

        chirpOsc.connect(chirpGain);
        chirpGain.connect(master);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.25);
      } catch (_) {}
      scheduleBirdChirp();
    }, delay);
  }
  scheduleBirdChirp();
}

export function stopAmbient() {
  ambientNodes.forEach((node) => {
    try { node.stop(); } catch (_) {}
  });
  ambientNodes.length = 0;
  if (ctx) {
    try { ctx.close(); } catch (_) {}
    ctx = null;
    masterGain = null;
  }
}

// ── One-shot SFX ───────────────────────────────────────────────────

function playTone(freq, type, duration, volume = 0.3, endFreq = null) {
  const audio = ensureCtx();
  if (!audio) return;
  const { ctx: c, master } = audio;
  if (c.state === 'suspended') return; // no user gesture yet

  try {
    const now = c.currentTime;
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null) {
      osc.frequency.linearRampToValueAtTime(endFreq, now + duration);
    }

    const g = c.createGain();
    g.gain.setValueAtTime(volume, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (_) {}
}

export function sfxDiceRoll() {
  const audio = ensureCtx();
  if (!audio) return;
  const { ctx: c, master } = audio;
  if (c.state === 'suspended') return;

  try {
    const now = c.currentTime;
    const count = 8 + Math.floor(Math.random() * 5);
    let t = now;
    for (let i = 0; i < count; i++) {
      const freq = 300 + Math.random() * 200;
      const dur = 0.03 + Math.random() * 0.05;
      const osc = c.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;
      const g = c.createGain();
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + dur + 0.01);
      t += 0.03 + Math.random() * 0.05;
    }
  } catch (_) {}
}

export function sfxWearDamage() {
  playTone(120, 'sawtooth', 0.3, 0.25);
}

export function sfxStamp() {
  playTone(600, 'sine', 0.1, 0.3);
}

export function sfxGameOver() {
  const audio = ensureCtx();
  if (!audio) return;
  const { ctx: c, master } = audio;
  if (c.state === 'suspended') return;

  try {
    const now = c.currentTime;

    // Wood crack
    const crackLen = 0.15;
    const crackBuf = c.createBuffer(1, c.sampleRate * crackLen, c.sampleRate);
    const crackData = crackBuf.getChannelData(0);
    for (let i = 0; i < crackData.length; i++) {
      crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.03));
    }
    const crackSrc = c.createBufferSource();
    crackSrc.buffer = crackBuf;
    const crackGain = c.createGain();
    crackGain.gain.value = 0.4;
    crackSrc.connect(crackGain);
    crackGain.connect(master);
    crackSrc.start(now);

    // Low thump
    const thump = c.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(80, now);
    thump.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    const thumpGain = c.createGain();
    thumpGain.gain.setValueAtTime(0.35, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    thump.connect(thumpGain);
    thumpGain.connect(master);
    thump.start(now);
    thump.stop(now + 0.35);

    // 3s noise fade-out
    const fadeLen = 3;
    const fadeBuf = c.createBuffer(1, c.sampleRate * fadeLen, c.sampleRate);
    const fadeData = fadeBuf.getChannelData(0);
    for (let i = 0; i < fadeData.length; i++) {
      fadeData[i] = Math.random() * 2 - 1;
    }
    const fadeSrc = c.createBufferSource();
    fadeSrc.buffer = fadeBuf;
    const fadeGain = c.createGain();
    fadeGain.gain.setValueAtTime(0.2, now);
    fadeGain.gain.linearRampToValueAtTime(0, now + fadeLen);
    const fadeFilter = c.createBiquadFilter();
    fadeFilter.type = 'lowpass';
    fadeFilter.frequency.setValueAtTime(800, now);
    fadeFilter.frequency.linearRampToValueAtTime(100, now + fadeLen);
    fadeSrc.connect(fadeFilter);
    fadeFilter.connect(fadeGain);
    fadeGain.connect(master);
    fadeSrc.start(now);
    fadeSrc.stop(now + fadeLen + 0.1);
  } catch (_) {}
}

export default {
  startAmbient,
  stopAmbient,
  sfxDiceRoll,
  sfxWearDamage,
  sfxStamp,
  sfxGameOver,
};
