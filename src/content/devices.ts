// Catalogue of devices for the Device Lab route.
import type { ParamSpec, DevicePreset } from "@/components/DeviceLab";
import {
  makeEQ3, makeComp, makeSat, makeReverb, makeDelay, makeAutoFilter, makeChorus,
  type DeviceNode,
} from "@/lib/audio-bus";

export type DeviceDef = {
  slug: string;
  name: string;
  category: "EQ" | "DYNAMICS" | "TIME" | "MOD" | "FILTER" | "DRIVE";
  tagline: string;
  what: string;
  how: string;
  factory: () => DeviceNode;
  params: ParamSpec[];
  presets: DevicePreset[];
  listenFor: string[];
  signalFlow: string;
};

export const DEVICES: DeviceDef[] = [
  {
    slug: "eq",
    name: "EQ Three",
    category: "EQ",
    tagline: "Cut & boost frequency ranges to shape tone.",
    what: "An equaliser splits sound into frequency bands (lows, mids, highs) and lets you make each louder or quieter. Every mix decision starts here: too boomy → cut lows; too dull → boost highs; vocal masked → cut a hole in the mids of the synth.",
    how: "Three filters in series — a low shelf at 120 Hz, a peaking band centred on the mids, and a high shelf at 6 kHz. Boosting +6 dB doubles loudness in that band; cutting -12 dB nearly removes it. Use cuts more than boosts: subtractive EQ leaves more headroom.",
    factory: makeEQ3,
    params: [
      { kind: "knob", id: "low", label: "LOW", min: -18, max: 18, default: 0, unit: "dB", explain: "Below 120 Hz — kick body, bass weight." },
      { kind: "knob", id: "mid", label: "MID", min: -18, max: 18, default: 0, unit: "dB", explain: "Vocals, snare, guitar — most musical info lives here." },
      { kind: "knob", id: "midFreq", label: "MID FREQ", min: 200, max: 6000, default: 1000, unit: "Hz", explain: "Move the mid band to where the problem is." },
      { kind: "knob", id: "midQ", label: "MID Q", min: 0.3, max: 8, default: 1, explain: "Wider Q = musical. Narrow Q = surgical fix." },
      { kind: "knob", id: "hi", label: "HIGH", min: -18, max: 18, default: 0, unit: "dB", explain: "Above 6 kHz — air, sparkle, hi-hats." },
    ],
    presets: [
      { name: "TOO BOOMY", values: { low: -8, mid: 0, hi: 0 } },
      { name: "AIR & SPARKLE", values: { low: 0, mid: 0, hi: 6 } },
      { name: "VOCAL CARVE", values: { low: 0, mid: -6, midFreq: 700, midQ: 4, hi: 0 } },
      { name: "FLAT", values: { low: 0, mid: 0, hi: 0, midFreq: 1000, midQ: 1 } },
    ],
    listenFor: [
      "Sweep MID FREQ with +12 dB Q=8 — that screech reveals problem frequencies.",
      "A/B with B button: subtractive EQ should make the source clearer, not louder.",
      "Boomy lows on chord pad? Cut LOW -8 dB.",
    ],
    signalFlow: "SOURCE → LOW SHELF → MID PEAK → HIGH SHELF → OUT",
  },
  {
    slug: "compressor",
    name: "Compressor",
    category: "DYNAMICS",
    tagline: "Tame peaks. Glue energy. Add punch.",
    what: "A compressor automatically turns down anything above a threshold, then optionally boosts everything back up. Result: quiet parts feel louder, loud parts don't poke out. Used on vocals to keep them present, on drums to add punch, on a mix bus to glue everything together.",
    how: "Threshold = the volume above which compression starts. Ratio = how aggressively (4:1 means 4 dB above becomes 1 dB above). Attack = how fast it grabs (slow attack lets transients through → punch). Release = how fast it lets go (long release = pumping). Makeup = post-gain.",
    factory: makeComp,
    params: [
      { kind: "knob", id: "threshold", label: "THRESHOLD", min: -60, max: 0, default: -20, unit: "dB", explain: "Lower = more compression. Watch the gain reduction." },
      { kind: "knob", id: "ratio", label: "RATIO", min: 1, max: 20, default: 4, unit: ":1", explain: "1=off, 4=mix glue, 10+=limiter territory." },
      { kind: "knob", id: "attack", label: "ATTACK", min: 0, max: 1, step: 0.005, default: 0.01, unit: "s", explain: "Slow attack preserves transient punch. Fast attack tames peaks." },
      { kind: "knob", id: "release", label: "RELEASE", min: 0.01, max: 1, step: 0.01, default: 0.25, unit: "s", explain: "Match release to the song's pulse for natural pump." },
      { kind: "knob", id: "knee", label: "KNEE", min: 0, max: 40, default: 6, unit: "dB", explain: "Soft knee = gentle, transparent. Hard knee = aggressive." },
      { kind: "knob", id: "makeup", label: "MAKEUP", min: 0.5, max: 4, step: 0.05, default: 1.4, unit: "x", explain: "Compensate for the gain reduction. A/B should match loudness." },
    ],
    presets: [
      { name: "DRUM PUNCH", values: { threshold: -18, ratio: 4, attack: 0.02, release: 0.15, knee: 4, makeup: 1.6 } },
      { name: "VOCAL GLUE", values: { threshold: -22, ratio: 3, attack: 0.005, release: 0.2, knee: 12, makeup: 1.5 } },
      { name: "MIX BUS", values: { threshold: -12, ratio: 2, attack: 0.03, release: 0.3, knee: 12, makeup: 1.2 } },
      { name: "PUMP", values: { threshold: -30, ratio: 10, attack: 0.001, release: 0.5, knee: 0, makeup: 2 } },
    ],
    listenFor: [
      "Toggle A/B — compressed should feel more even, not just louder.",
      "Crank the threshold down, listen for breathing/pumping artefacts.",
      "Slow the attack to ~30 ms on drums to let transients punch through.",
    ],
    signalFlow: "SOURCE → DETECTOR(threshold) → GAIN REDUCTION → MAKEUP → OUT",
  },
  {
    slug: "saturator",
    name: "Saturator",
    category: "DRIVE",
    tagline: "Add harmonic warmth, grit, or destruction.",
    what: "Saturation reshapes the waveform, generating harmonics that weren't in the source. A touch warms a vocal or thickens a synth. Pushed hard it becomes distortion. Different curves model tape, tubes, transistors, or digital quantisation.",
    how: "A waveshaper applies a curve to every sample. Soft (tanh) = analog warmth. Hard = clipping. Tube = asymmetric, vocal-friendly. Digital = bitcrush stair-stepping. Pre-gain pushes harder into the curve; post-gain compensates.",
    factory: makeSat,
    params: [
      { kind: "knob", id: "drive", label: "DRIVE", min: 0, max: 1, step: 0.01, default: 0.2, explain: "Push the signal into the shaping curve." },
      { kind: "select", id: "type", label: "TYPE", options: [
        { value: "soft", label: "SOFT" }, { value: "hard", label: "HARD" },
        { value: "tube", label: "TUBE" }, { value: "digital", label: "DIGITAL" },
      ], default: "soft", explain: "Soft=warm. Hard=clip. Tube=vocal. Digital=crush." },
      { kind: "knob", id: "output", label: "OUTPUT", min: 0, max: 2, step: 0.01, default: 0.7, explain: "Tame post-saturation level so A/B is fair." },
    ],
    presets: [
      { name: "WARM GLUE", values: { drive: 0.15, type: "soft", output: 0.7 } },
      { name: "TAPE COLOUR", values: { drive: 0.35, type: "tube", output: 0.6 } },
      { name: "BROKEN", values: { drive: 0.9, type: "hard", output: 0.3 } },
      { name: "BITCRUSH", values: { drive: 0.7, type: "digital", output: 0.5 } },
    ],
    listenFor: [
      "On chords: SOFT @ 0.2 thickens. SOFT @ 0.8 gets fuzzy and loud.",
      "On drums: HARD @ 0.5 adds aggression, attitude.",
      "DIGITAL collapses the bit depth — listen for stair-step grit.",
      "Always A/B match loudness with OUTPUT before judging.",
    ],
    signalFlow: "SOURCE → PRE-GAIN → WAVESHAPER → POST-GAIN → OUT",
  },
  {
    slug: "reverb",
    name: "Reverb",
    category: "TIME",
    tagline: "Place sounds in a room — small to cathedral.",
    what: "Reverb is the sound of a space: thousands of overlapping reflections fading away. It glues elements, adds depth, sets emotion. A short room makes things feel real. A long hall makes them feel epic. Predelay creates the illusion of a near sound in a far space.",
    how: "Convolution multiplies your sound against an impulse response (IR) — a recording of how a real space responds to a click. Synthetic IRs are noise shaped by an exponential decay. Larger size = bigger room. Longer decay = more tail. Predelay = milliseconds before the tail starts.",
    factory: makeReverb,
    params: [
      { kind: "knob", id: "size", label: "SIZE", min: 0.1, max: 5, step: 0.05, default: 1.5, unit: "s", explain: "Length of the impulse — bigger room." },
      { kind: "knob", id: "decay", label: "DECAY", min: 0.5, max: 6, step: 0.1, default: 2, explain: "How fast the tail fades." },
      { kind: "knob", id: "predelay", label: "PREDELAY", min: 0, max: 200, step: 1, default: 10, unit: "ms", explain: "Gap before reverb starts — keeps the dry signal clear." },
      { kind: "knob", id: "wet", label: "WET", min: 0, max: 1, step: 0.01, default: 0.4, explain: "How much reverb you hear." },
      { kind: "knob", id: "dry", label: "DRY", min: 0, max: 1, step: 0.01, default: 0.6, explain: "How much original you hear." },
    ],
    presets: [
      { name: "TIGHT ROOM", values: { size: 0.4, decay: 1, predelay: 5, wet: 0.3, dry: 0.7 } },
      { name: "VOCAL HALL", values: { size: 2.5, decay: 3, predelay: 30, wet: 0.35, dry: 0.7 } },
      { name: "INFINITE PAD", values: { size: 5, decay: 6, predelay: 50, wet: 0.7, dry: 0.4 } },
      { name: "SLAP", values: { size: 0.15, decay: 0.7, predelay: 80, wet: 0.5, dry: 0.7 } },
    ],
    listenFor: [
      "Use predelay to keep vocals upfront even with long decay.",
      "Sends > inserts: put reverb on a return so multiple tracks share the same space.",
      "Pre-EQ the send (cut lows under 200 Hz) to stop muddy reverb.",
    ],
    signalFlow: "SOURCE → PREDELAY → CONVOLVER(IR) → WET MIX → OUT",
  },
  {
    slug: "delay",
    name: "Delay",
    category: "TIME",
    tagline: "Echoes — synced, filtered, feeding back.",
    what: "A delay records the input, plays it back N milliseconds later, and optionally feeds the result back in for repeats. Synced to BPM it becomes rhythmic (1/8, dotted 1/8, 1/4 triplet are the classics). Filtered feedback creates dub-style fading echoes.",
    how: "A delay line stores samples; the read tap is offset from the write tap by your time setting. The output is sent back through a low-pass filter and multiplied by feedback (0.4 = each repeat is 40% of the previous), then summed with new input.",
    factory: makeDelay,
    params: [
      { kind: "knob", id: "time", label: "TIME", min: 0.05, max: 1.5, step: 0.005, default: 0.375, unit: "s", explain: "0.375s = dotted 1/8 at 120 BPM. The classic." },
      { kind: "knob", id: "feedback", label: "FEEDBACK", min: 0, max: 0.95, step: 0.01, default: 0.4, explain: "How many repeats. >0.7 = self-oscillation territory." },
      { kind: "knob", id: "tone", label: "TONE", min: 200, max: 12000, step: 50, default: 4000, unit: "Hz", explain: "Lowpass on feedback — each repeat gets darker. Dub trick." },
      { kind: "knob", id: "wet", label: "WET", min: 0, max: 1, step: 0.01, default: 0.4, explain: "How loud the echoes are vs dry." },
    ],
    presets: [
      { name: "DOTTED 1/8", values: { time: 0.375, feedback: 0.45, tone: 5000, wet: 0.4 } },
      { name: "DUB ECHO", values: { time: 0.5, feedback: 0.7, tone: 1500, wet: 0.5 } },
      { name: "SLAPBACK", values: { time: 0.12, feedback: 0.1, tone: 8000, wet: 0.35 } },
      { name: "SELF-OSC", values: { time: 0.2, feedback: 0.92, tone: 3000, wet: 0.5 } },
    ],
    listenFor: [
      "Set feedback >0.9 then twist time — that's the dub-siren sound.",
      "Drop tone to 1.5 kHz: each echo gets warmer and further away.",
      "On vocals: short slapback (~120 ms) adds depth without muddying.",
    ],
    signalFlow: "SOURCE → DELAY LINE → LOWPASS → FEEDBACK ↻ → WET MIX → OUT",
  },
  {
    slug: "auto-filter",
    name: "Auto Filter",
    category: "FILTER",
    tagline: "Sweepable filter with LFO modulation.",
    what: "A filter cuts frequencies above (lowpass) or below (highpass) a cutoff point. With resonance, the cutoff frequency is emphasised — that classic 'wah' or acid-bass sound. An LFO can sweep the cutoff back and forth automatically.",
    how: "Biquad lowpass at cutoff with adjustable Q (resonance). The LFO is a low-frequency oscillator whose output is added to the cutoff frequency, modulated by depth. Rate sets how fast the sweep cycles.",
    factory: makeAutoFilter,
    params: [
      { kind: "knob", id: "cutoff", label: "CUTOFF", min: 80, max: 12000, step: 10, default: 2000, unit: "Hz", explain: "Frequencies above this get cut." },
      { kind: "knob", id: "Q", label: "RESONANCE", min: 0.3, max: 20, step: 0.1, default: 1, explain: "Boost at the cutoff — wah/acid sound." },
      { kind: "knob", id: "lfoRate", label: "LFO RATE", min: 0.05, max: 10, step: 0.05, default: 1, unit: "Hz", explain: "How fast the cutoff sweeps." },
      { kind: "knob", id: "lfoDepth", label: "LFO DEPTH", min: 0, max: 4000, step: 10, default: 0, unit: "Hz", explain: "How wide the sweep is." },
      { kind: "select", id: "type", label: "TYPE", options: [
        { value: "lowpass", label: "LOW-PASS" }, { value: "highpass", label: "HIGH-PASS" },
        { value: "bandpass", label: "BAND-PASS" }, { value: "notch", label: "NOTCH" },
      ], default: "lowpass", explain: "What part of the spectrum survives." },
    ],
    presets: [
      { name: "ACID", values: { cutoff: 800, Q: 14, lfoRate: 2, lfoDepth: 1500, type: "lowpass" } },
      { name: "DUB CHORDS", values: { cutoff: 1200, Q: 1, lfoRate: 0.25, lfoDepth: 800, type: "lowpass" } },
      { name: "TELEPHONE", values: { cutoff: 2500, Q: 1, lfoRate: 0, lfoDepth: 0, type: "bandpass" } },
      { name: "OPEN", values: { cutoff: 12000, Q: 0.7, lfoRate: 0, lfoDepth: 0, type: "lowpass" } },
    ],
    listenFor: [
      "Crank Q to 14, sweep cutoff slowly — you can almost play notes.",
      "Slow LFO + wide depth = breathing dub chords.",
      "Highpass on a kick removes weight; useful before reverb sends.",
    ],
    signalFlow: "SOURCE → BIQUAD(cutoff,Q) → OUT  (LFO → cutoff)",
  },
  {
    slug: "chorus",
    name: "Chorus",
    category: "MOD",
    tagline: "Doubled, detuned, lush — width without reverb.",
    what: "Chorus mixes the dry signal with a delayed copy whose delay time is constantly modulated by an LFO. The shifting delay creates pitch wobble (Doppler) — your ear hears it as multiple performers playing the same part, slightly out of tune.",
    how: "A short delay (~25 ms) modulated ±5 ms by a slow LFO. Sum with dry. Two LFOs in opposite phase per channel = stereo width.",
    factory: makeChorus,
    params: [
      { kind: "knob", id: "rate", label: "RATE", min: 0.1, max: 5, step: 0.05, default: 1.2, unit: "Hz", explain: "How fast the wobble cycles." },
      { kind: "knob", id: "depth", label: "DEPTH", min: 0, max: 20, step: 0.1, default: 5, unit: "ms", explain: "How wide the pitch wobble." },
      { kind: "knob", id: "wet", label: "WET", min: 0, max: 1, step: 0.01, default: 0.5, explain: "How much chorused signal." },
    ],
    presets: [
      { name: "SUBTLE WIDEN", values: { rate: 0.6, depth: 2, wet: 0.35 } },
      { name: "80s LUSH", values: { rate: 1.2, depth: 8, wet: 0.6 } },
      { name: "SEASICK", values: { rate: 4, depth: 18, wet: 0.7 } },
    ],
    listenFor: [
      "Compare A/B — chorus widens but can blur transients.",
      "Slow rate + small depth = thickening. Fast rate = wobble.",
    ],
    signalFlow: "SOURCE → MOD-DELAY → SUM(dry) → OUT  (LFO → delay time)",
  },
];

export const deviceBySlug = (s: string) => DEVICES.find((d) => d.slug === s);
