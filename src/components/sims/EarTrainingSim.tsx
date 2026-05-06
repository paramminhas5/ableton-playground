import { useEffect, useRef, useState } from "react";
import { getCtx } from "@/lib/audio";

// Ear training: pick the cut frequency / compression / reverb that matches.
export function EarTrainingSim({ preset }: { preset?: Record<string, unknown> }) {
  const mode = (preset?.mode as string) || "eq";
  const target = useRef<number>(0);
  const choices = useRef<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const setup = () => {
    const opts = mode === "eq" ? [200, 800, 2500, 6000] : mode === "comp" ? [1, 4, 8, 20] : mode === "reverb" ? [0.3, 1.0, 2.5, 5.0] : mode === "sat" ? [0, 0.3, 0.6, 0.9] : [0, 0.3, 0.6, 0.9];
    choices.current = opts;
    target.current = opts[Math.floor(Math.random() * opts.length)];
    setPicked(null);
  };
  useEffect(setup, [mode]);

  const playWith = (val: number) => {
    const ctx = getCtx(); if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = 220;
    const g = ctx.createGain(); g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    let chain: AudioNode = osc;
    if (mode === "eq") {
      const f = ctx.createBiquadFilter(); f.type = "peaking"; f.frequency.value = val; f.Q.value = 4; f.gain.value = -18;
      chain.connect(f); chain = f;
    } else if (mode === "comp") {
      const c = ctx.createDynamicsCompressor(); c.threshold.value = -30; c.ratio.value = val; c.attack.value = 0.01; c.release.value = 0.2;
      chain.connect(c); chain = c;
    } else if (mode === "reverb") {
      const conv = ctx.createConvolver();
      const len = Math.max(0.1, val) * ctx.sampleRate;
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      }
      conv.buffer = ir; chain.connect(conv); chain = conv;
    } else if (mode === "sat" || mode === "sidechain") {
      const ws = ctx.createWaveShaper();
      const k = val * 50 + 1;
      const curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x)); }
      ws.curve = curve; chain.connect(ws); chain = ws;
    }
    chain.connect(g).connect(ctx.destination);
    osc.start(t); osc.stop(t + 1.3);
  };

  const pick = (v: number) => {
    setPicked(v);
    if (v === target.current) setStreak((s) => s + 1); else setStreak(0);
  };

  const fmt = (v: number) => mode === "eq" ? `${v} Hz` : mode === "comp" ? `${v}:1` : mode === "reverb" ? `${v}s` : `${Math.round(v * 100)}%`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={() => playWith(target.current)} className="brutal-border bg-hot text-bone px-3 py-2 font-mono uppercase brutal-press">▶ Play TARGET</button>
        <button onClick={setup} className="brutal-border bg-bone px-3 py-2 font-mono uppercase brutal-press">New Round</button>
        <span className="brutal-border bg-acid px-3 py-1 font-mono uppercase">Streak {streak}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {choices.current.map((v) => (
          <button key={v} onClick={() => { playWith(v); pick(v); }}
            className={`brutal-border p-3 font-mono uppercase brutal-press ${picked === v ? (v === target.current ? "bg-acid" : "bg-hot text-bone") : "bg-card"}`}>
            {fmt(v)}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="font-mono text-xs uppercase">
          {picked === target.current ? "✓ Correct" : `✗ Was ${fmt(target.current)}`}
        </div>
      )}
    </div>
  );
}
