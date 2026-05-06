import { useState } from "react";

const POOL = [
  { id: "eq", label: "EQ EIGHT", desc: "Cut & boost frequencies", color: "bg-acid" },
  { id: "comp", label: "COMPRESSOR", desc: "Tame dynamics", color: "bg-hot text-bone" },
  { id: "reverb", label: "REVERB", desc: "Add space", color: "bg-volt text-bone" },
  { id: "delay", label: "DELAY", desc: "Echoes", color: "bg-sun" },
  { id: "sat", label: "SATURATOR", desc: "Add grit", color: "bg-bone" },
];

export function DeviceChainSim() {
  const [chain, setChain] = useState<string[]>([]);
  const add = (id: string) => setChain((c) => [...c, id]);
  const rm = (i: number) => setChain((c) => c.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-display text-xl mb-2">DEVICE POOL</h4>
        <div className="flex flex-wrap gap-2">
          {POOL.map((d) => (
            <button key={d.id} onClick={() => add(d.id)} className={`${d.color} brutal-border px-3 py-2 font-mono text-xs uppercase brutal-press`}>
              + {d.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-display text-xl mb-2">SIGNAL CHAIN (LEFT → RIGHT)</h4>
        <div className="brutal-border bg-card p-3 min-h-[120px] flex items-center gap-2 overflow-x-auto">
          <div className="brutal-border bg-ink text-bone px-3 py-2 font-mono text-xs">IN</div>
          {chain.length === 0 && <div className="font-mono text-xs opacity-60">drop devices…</div>}
          {chain.map((id, i) => {
            const d = POOL.find((p) => p.id === id)!;
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="font-mono">→</span>
                <button onClick={() => rm(i)} className={`${d.color} brutal-border px-3 py-2 font-mono text-xs uppercase`}>{d.label} ✕</button>
              </div>
            );
          })}
          <span className="font-mono">→</span>
          <div className="brutal-border bg-ink text-bone px-3 py-2 font-mono text-xs">OUT</div>
        </div>
        <p className="font-mono text-xs uppercase opacity-70 mt-2">Order matters: EQ → Comp is different than Comp → EQ.</p>
      </div>
    </div>
  );
}
