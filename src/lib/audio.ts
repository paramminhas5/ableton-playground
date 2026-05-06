// Web Audio engine — synthesised sources, no asset files.
let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;

export const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

export const getMaster = (): AudioNode => {
  getCtx();
  return masterGain!;
};

export const setMasterVolume = (v: number) => {
  getCtx();
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
};

const env = (g: GainNode, t: number, attack: number, decay: number, peak = 1) => {
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
};

export const playKick = (when = 0, dest?: AudioNode) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(); const g = c.createGain();
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  env(g, t, 0.005, 0.4, 1);
  o.connect(g).connect(dest ?? getMaster()); o.start(t); o.stop(t + 0.5);
};

export const playSnare = (when = 0, dest?: AudioNode) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1500;
  const g = c.createGain(); env(g, t, 0.002, 0.18, 0.6);
  noise.connect(hp).connect(g).connect(dest ?? getMaster()); noise.start(t); noise.stop(t + 0.25);
};

export const playHat = (when = 0, open = false, dest?: AudioNode) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
  const g = c.createGain(); env(g, t, 0.001, open ? 0.25 : 0.05, 0.3);
  noise.connect(hp).connect(g).connect(dest ?? getMaster()); noise.start(t); noise.stop(t + 0.3);
};

export const playClap = (when = 0, dest?: AudioNode) => {
  for (let i = 0; i < 3; i++) playSnare(when + i * 0.012, dest);
};

export const playTone = (freq: number, when = 0, dur = 0.5, type: OscillatorType = "sawtooth", peak = 0.2, dest?: AudioNode) => {
  const c = getCtx(); if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator(); const g = c.createGain(); const f = c.createBiquadFilter();
  o.type = type; o.frequency.value = freq;
  f.type = "lowpass"; f.frequency.value = 2000; f.Q.value = 4;
  env(g, t, 0.01, dur, peak);
  o.connect(f).connect(g).connect(dest ?? getMaster());
  o.start(t); o.stop(t + dur + 0.1);
};

export const midiToFreq = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// --- Looping sources for simulators -----------------------------------------
// Each returns a "stop" function. They schedule events on the running ctx clock.

export type LoopHandle = { stop: () => void; bpm: number };

const noteNames: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6,
  G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};
export const noteToMidi = (n: string) => {
  const m = n.match(/^([A-G][#b]?)(-?\d)$/); if (!m) return 60;
  return (parseInt(m[2]) + 1) * 12 + noteNames[m[1]];
};

// Schedules drum+bass+chord loop at given bpm. dest is where audio goes.
export type SampleName = "drum-loop" | "bass-loop" | "chord-pad" | "vox-chop" | "full-mix";

export const startLoop = (name: SampleName, bpm = 100, dest?: AudioNode): LoopHandle => {
  const c = getCtx(); if (!c) return { stop: () => {}, bpm };
  const out = dest ?? getMaster();
  const beat = 60 / bpm; // sec per beat
  const bar = beat * 4;
  let stopped = false;
  let nextBar = c.currentTime + 0.05;
  const chordNotes = [60, 64, 67, 72]; // Cmaj
  const bassPattern = [36, 36, 43, 41]; // C C G F
  const voxPattern = [72, 74, 76, 79];

  const scheduleBar = (t: number) => {
    if (name === "drum-loop" || name === "full-mix") {
      // 4-on-the-floor + offbeat hats + snare on 2&4
      for (let b = 0; b < 4; b++) {
        playKick(t + b * beat - c.currentTime, out);
        playHat(t + b * beat + beat / 2 - c.currentTime, false, out);
      }
      playSnare(t + beat - c.currentTime, out);
      playSnare(t + 3 * beat - c.currentTime, out);
    }
    if (name === "bass-loop" || name === "full-mix") {
      bassPattern.forEach((n, i) => {
        playTone(midiToFreq(n), t + i * beat - c.currentTime, beat * 0.9, "sawtooth", 0.18, out);
      });
    }
    if (name === "chord-pad" || name === "full-mix") {
      chordNotes.forEach((n) => {
        playTone(midiToFreq(n), t - c.currentTime, bar * 0.95, "triangle", 0.06, out);
      });
    }
    if (name === "vox-chop") {
      voxPattern.forEach((n, i) => {
        playTone(midiToFreq(n), t + i * beat - c.currentTime, beat * 0.6, "sine", 0.18, out);
      });
    }
  };

  const tick = () => {
    if (stopped) return;
    while (nextBar < c.currentTime + 0.25) {
      scheduleBar(nextBar);
      nextBar += bar;
    }
    setTimeout(tick, 60);
  };
  tick();

  return { stop: () => { stopped = true; }, bpm };
};
