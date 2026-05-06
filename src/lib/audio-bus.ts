// AudioBus — composable processing chain for device sims.
// Lets a sim wire: source -> [eq, comp, sat, reverb, delay, filter, chorus] -> meter -> master
// with per-node bypass and wet/dry. All nodes are real Web Audio.

import { getCtx, getMaster } from "./audio";

export type DeviceKind =
  | "eq3" | "comp" | "sat" | "reverb" | "delay" | "filter" | "chorus" | "phaser" | "glue";

export interface DeviceNode {
  kind: DeviceKind;
  input: AudioNode;
  output: AudioNode;
  bypass(b: boolean): void;
  set(param: string, value: number | string): void;
  meta(): Record<string, unknown>;
  dispose(): void;
}

const ctxOrThrow = () => {
  const c = getCtx();
  if (!c) throw new Error("AudioContext not available");
  return c;
};

// ---- EQ3 (low/mid/high shelves+peak) ---------------------------------------
export const makeEQ3 = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0;
  const wet = c.createGain(); wet.gain.value = 1;
  const out = c.createGain();
  const low = c.createBiquadFilter(); low.type = "lowshelf"; low.frequency.value = 120; low.gain.value = 0;
  const mid = c.createBiquadFilter(); mid.type = "peaking"; mid.frequency.value = 1000; mid.Q.value = 1; mid.gain.value = 0;
  const hi = c.createBiquadFilter(); hi.type = "highshelf"; hi.frequency.value = 6000; hi.gain.value = 0;
  input.connect(low).connect(mid).connect(hi).connect(wet).connect(out);
  input.connect(dry).connect(out);
  return {
    kind: "eq3", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 1; dry.gain.value = b ? 1 : 0; },
    set(p, v) {
      const n = +v;
      if (p === "low") low.gain.value = n;
      else if (p === "mid") mid.gain.value = n;
      else if (p === "hi" || p === "high") hi.gain.value = n;
      else if (p === "midFreq") mid.frequency.value = n;
      else if (p === "midQ") mid.Q.value = n;
    },
    meta: () => ({ low: low.gain.value, mid: mid.gain.value, hi: hi.gain.value }),
    dispose() {},
  };
};

// ---- Compressor ------------------------------------------------------------
export const makeComp = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0;
  const wet = c.createGain(); wet.gain.value = 1;
  const comp = c.createDynamicsCompressor();
  const makeup = c.createGain(); makeup.gain.value = 1.2;
  input.connect(comp).connect(makeup).connect(wet).connect(out);
  input.connect(dry).connect(out);
  return {
    kind: "comp", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 1; dry.gain.value = b ? 1 : 0; },
    set(p, v) {
      const n = +v;
      if (p === "threshold") comp.threshold.value = n;
      else if (p === "ratio") comp.ratio.value = n;
      else if (p === "attack") comp.attack.value = n;
      else if (p === "release") comp.release.value = n;
      else if (p === "knee") comp.knee.value = n;
      else if (p === "makeup") makeup.gain.value = n;
    },
    meta: () => ({ reduction: comp.reduction }),
    dispose() {},
  };
};

// ---- Saturator (waveshaper) ------------------------------------------------
const makeShaperCurve = (drive: number, type: "soft" | "hard" | "tube" | "digital" = "soft") => {
  const samples = 4096;
  const curve = new Float32Array(samples);
  const k = Math.max(0.001, drive);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    let y = x;
    if (type === "soft") y = Math.tanh(x * (1 + k * 8));
    else if (type === "hard") y = Math.max(-1, Math.min(1, x * (1 + k * 12)));
    else if (type === "tube") {
      const xv = x * (1 + k * 6);
      y = xv / (1 + Math.abs(xv)) + 0.05 * Math.sin(xv * 2);
    } else if (type === "digital") {
      const steps = Math.max(2, 32 - Math.floor(k * 28));
      y = Math.round(x * steps) / steps;
    }
    curve[i] = y;
  }
  return curve;
};

export const makeSat = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0;
  const wet = c.createGain(); wet.gain.value = 1;
  const pre = c.createGain(); pre.gain.value = 1;
  const shape = c.createWaveShaper();
  shape.curve = makeShaperCurve(0.1, "soft");
  shape.oversample = "4x";
  const post = c.createGain(); post.gain.value = 0.7;
  input.connect(pre).connect(shape).connect(post).connect(wet).connect(out);
  input.connect(dry).connect(out);
  let drive = 0.1; let type: "soft" | "hard" | "tube" | "digital" = "soft";
  return {
    kind: "sat", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 1; dry.gain.value = b ? 1 : 0; },
    set(p, v) {
      if (p === "drive") { drive = +v; pre.gain.value = 1 + drive * 4; shape.curve = makeShaperCurve(drive, type); }
      else if (p === "type") { type = v as any; shape.curve = makeShaperCurve(drive, type); }
      else if (p === "output") post.gain.value = +v;
    },
    meta: () => ({ drive, type, curve: shape.curve }),
    dispose() {},
  };
};

// ---- Reverb (algorithmic via convolver with synthesised IR) ----------------
const makeIR = (c: AudioContext, seconds = 2, decay = 2) => {
  const rate = c.sampleRate;
  const len = Math.max(1, Math.floor(rate * seconds));
  const buf = c.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
};

export const makeReverb = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0.6;
  const wet = c.createGain(); wet.gain.value = 0.4;
  const conv = c.createConvolver();
  let size = 2; let decay = 2;
  conv.buffer = makeIR(c, size, decay);
  const pre = c.createDelay(); pre.delayTime.value = 0.01;
  input.connect(dry).connect(out);
  input.connect(pre).connect(conv).connect(wet).connect(out);
  return {
    kind: "reverb", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 0.4; dry.gain.value = b ? 1 : 0.6; },
    set(p, v) {
      const n = +v;
      if (p === "size") { size = Math.max(0.1, n); conv.buffer = makeIR(c, size, decay); }
      else if (p === "decay") { decay = Math.max(0.5, n); conv.buffer = makeIR(c, size, decay); }
      else if (p === "predelay") pre.delayTime.value = Math.max(0, n / 1000);
      else if (p === "wet") wet.gain.value = n;
      else if (p === "dry") dry.gain.value = n;
    },
    meta: () => ({ size, decay }),
    dispose() {},
  };
};

// ---- Delay (with feedback + filter) ----------------------------------------
export const makeDelay = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 1;
  const wet = c.createGain(); wet.gain.value = 0.4;
  const delay = c.createDelay(2); delay.delayTime.value = 0.375;
  const fb = c.createGain(); fb.gain.value = 0.4;
  const fbFilter = c.createBiquadFilter(); fbFilter.type = "lowpass"; fbFilter.frequency.value = 4000;
  input.connect(dry).connect(out);
  input.connect(delay);
  delay.connect(fbFilter).connect(fb).connect(delay);
  delay.connect(wet).connect(out);
  return {
    kind: "delay", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 0.4; },
    set(p, v) {
      const n = +v;
      if (p === "time") delay.delayTime.value = Math.max(0.001, n);
      else if (p === "feedback") fb.gain.value = Math.max(0, Math.min(0.95, n));
      else if (p === "tone") fbFilter.frequency.value = n;
      else if (p === "wet") wet.gain.value = n;
    },
    meta: () => ({ time: delay.delayTime.value, feedback: fb.gain.value }),
    dispose() {},
  };
};

// ---- Auto Filter -----------------------------------------------------------
export const makeAutoFilter = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const filt = c.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = 2000; filt.Q.value = 1;
  const lfo = c.createOscillator(); lfo.frequency.value = 1; lfo.type = "sine";
  const lfoAmt = c.createGain(); lfoAmt.gain.value = 0;
  lfo.connect(lfoAmt).connect(filt.frequency); lfo.start();
  const dry = c.createGain(); dry.gain.value = 0;
  const wet = c.createGain(); wet.gain.value = 1;
  input.connect(filt).connect(wet).connect(out);
  input.connect(dry).connect(out);
  return {
    kind: "filter", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 1; dry.gain.value = b ? 1 : 0; },
    set(p, v) {
      const n = +v;
      if (p === "cutoff") filt.frequency.value = n;
      else if (p === "Q") filt.Q.value = n;
      else if (p === "lfoRate") lfo.frequency.value = n;
      else if (p === "lfoDepth") lfoAmt.gain.value = n;
      else if (p === "type") filt.type = v as BiquadFilterType;
    },
    meta: () => ({ cutoff: filt.frequency.value }),
    dispose() { try { lfo.stop(); } catch {} },
  };
};

// ---- Chorus ----------------------------------------------------------------
export const makeChorus = (): DeviceNode => {
  const c = ctxOrThrow();
  const input = c.createGain();
  const out = c.createGain();
  const dry = c.createGain(); dry.gain.value = 0.7;
  const wet = c.createGain(); wet.gain.value = 0.5;
  const delay = c.createDelay(); delay.delayTime.value = 0.025;
  const lfo = c.createOscillator(); lfo.frequency.value = 1.2; lfo.type = "sine";
  const depth = c.createGain(); depth.gain.value = 0.005;
  lfo.connect(depth).connect(delay.delayTime); lfo.start();
  input.connect(dry).connect(out);
  input.connect(delay).connect(wet).connect(out);
  return {
    kind: "chorus", input, output: out,
    bypass(b) { wet.gain.value = b ? 0 : 0.5; dry.gain.value = b ? 1 : 0.7; },
    set(p, v) {
      const n = +v;
      if (p === "rate") lfo.frequency.value = n;
      else if (p === "depth") depth.gain.value = n / 1000;
      else if (p === "wet") wet.gain.value = n;
    },
    meta: () => ({ rate: lfo.frequency.value }),
    dispose() { try { lfo.stop(); } catch {} },
  };
};

// ---- Bus: chain of devices, with meter -------------------------------------
export class Bus {
  ctx: AudioContext;
  input: GainNode;
  output: GainNode;
  analyser: AnalyserNode;
  devices: DeviceNode[] = [];
  constructor() {
    this.ctx = ctxOrThrow();
    this.input = this.ctx.createGain();
    this.output = this.ctx.createGain();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.input.connect(this.output);
    this.output.connect(this.analyser);
    this.output.connect(getMaster());
  }
  rewire() {
    try { this.input.disconnect(); } catch {}
    this.devices.forEach((d) => { try { d.input.disconnect(); d.output.disconnect(); } catch {} });
    let cursor: AudioNode = this.input;
    this.devices.forEach((d) => { cursor.connect(d.input); cursor = d.output; });
    cursor.connect(this.output);
  }
  add(d: DeviceNode) { this.devices.push(d); this.rewire(); }
  remove(i: number) { const [d] = this.devices.splice(i, 1); d?.dispose(); this.rewire(); }
  reorder(from: number, to: number) {
    const [d] = this.devices.splice(from, 1);
    this.devices.splice(to, 0, d);
    this.rewire();
  }
  bypassAll(b: boolean) { this.devices.forEach((d) => d.bypass(b)); }
  dispose() {
    try { this.input.disconnect(); this.output.disconnect(); } catch {}
    this.devices.forEach((d) => d.dispose());
  }
}

export const DEVICE_FACTORY: Record<DeviceKind, () => DeviceNode> = {
  eq3: makeEQ3, comp: makeComp, sat: makeSat, reverb: makeReverb,
  delay: makeDelay, filter: makeAutoFilter, chorus: makeChorus,
  phaser: makeChorus, glue: makeComp,
};

export const DEVICE_LABELS: Record<DeviceKind, string> = {
  eq3: "EQ THREE", comp: "COMPRESSOR", sat: "SATURATOR", reverb: "REVERB",
  delay: "DELAY", filter: "AUTO FILTER", chorus: "CHORUS",
  phaser: "PHASER", glue: "GLUE COMP",
};
