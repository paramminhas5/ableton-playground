import { useState } from "react";

const TRACKS = ["KICK", "SNARE", "VOX", "SYNTH"];
const RETURNS = [
  { id: "A", name: "RETURN A · REVERB", color: "bg-volt text-bone" },
  { id: "B", name: "RETURN B · DELAY", color: "bg-hot text-bone" },
];

export function RoutingPuzzleSim() {
  const [sends, setSends] = useState<Record<string, Record<string, number>>>(() => {
    const o: any = {};
    TRACKS.forEach((t) => { o[t] = { A: 0, B: 0 }; });
    return o;
  });
  const set = (t: string, r: string, v: number) => setSends((s) => ({ ...s, [t]: { ...s[t], [r]: v } }));

  // Goal: VOX → Reverb high, SNARE → Delay medium, others 0
  const score = (() => {
    let s = 0;
    s += Math.abs(sends.VOX.A - 0.7);
    s += Math.abs(sends.SNARE.B - 0.4);
    s += sends.KICK.A + sends.KICK.B + sends.SYNTH.A + sends.SYNTH.B;
    return s;
  })();
  const solved = score < 0.4;

  return (
    <div className="space-y-3">
      <div className="brutal-border bg-card p-3 font-mono text-xs uppercase">
        GOAL: Send VOX heavy to Reverb, Snare medium to Delay, Kick & Synth dry.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TRACKS.map((t) => (
          <div key={t} className="brutal-border bg-card p-3">
            <div className="font-display text-lg mb-2">{t}</div>
            {RETURNS.map((r) => (
              <label key={r.id} className="flex items-center gap-2 mb-2 font-mono text-xs uppercase">
                <span className={`${r.color} brutal-border px-2 py-1 w-40`}>{r.name}</span>
                <input type="range" min={0} max={1} step={0.05} value={sends[t][r.id]} onChange={(e) => set(t, r.id, +e.target.value)} className="flex-1" />
                <span className="brutal-border bg-bone px-2 py-1 w-12 text-center">{Math.round(sends[t][r.id] * 100)}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className={`brutal-border px-3 py-2 font-mono uppercase inline-block ${solved ? "bg-acid" : "bg-hot text-bone"}`}>
        {solved ? "ROUTING SOLVED" : "KEEP TWEAKING"} · score {score.toFixed(2)}
      </div>
    </div>
  );
}
