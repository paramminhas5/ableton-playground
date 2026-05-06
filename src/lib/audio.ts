// Tiny Web Audio engine — synthesised drum & tonal sounds, no asset files.
let ctx: AudioContext | null = null;

export const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

const env = (g: GainNode, t: number, attack: number, decay: number, peak = 1) => {
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
};

export const playKick = (when = 0) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(); const g = c.createGain();
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  env(g, t, 0.005, 0.4, 1);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.5);
};

export const playSnare = (when = 0) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1500;
  const g = c.createGain(); env(g, t, 0.002, 0.18, 0.6);
  noise.connect(hp).connect(g).connect(c.destination); noise.start(t); noise.stop(t + 0.25);
};

export const playHat = (when = 0, open = false) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
  const g = c.createGain(); env(g, t, 0.001, open ? 0.25 : 0.05, 0.3);
  noise.connect(hp).connect(g).connect(c.destination); noise.start(t); noise.stop(t + 0.3);
};

export const playClap = (when = 0) => {
  const c = getCtx(); if (!c) return;
  for (let i = 0; i < 3; i++) playSnare(when + i * 0.012);
};

export const playTone = (freq: number, when = 0, dur = 0.5, type: OscillatorType = "sawtooth", peak = 0.2) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.type = type; o.frequency.value = freq;
  f.type = "lowpass"; f.frequency.value = 2000; f.Q.value = 4;
  env(g, t, 0.01, dur, peak);
  o.connect(f).connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.1);
};

export const midiToFreq = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
