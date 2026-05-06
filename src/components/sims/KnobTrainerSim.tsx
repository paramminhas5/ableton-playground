import { useEffect, useRef, useState } from "react";
import { playTone, midiToFreq } from "@/lib/audio";

// Generic knob trainer — hit a target value within tolerance.
export function KnobTrainerSim({ preset }: { preset?: Record<string, unknown> }) {
  const mode = (preset?.mode as string) || "freq";
  const target = useRef<number>(0);
  const [val, setVal] = useState(0);
  const [hit, setHit] = useState(false);
  const [tries, setTries] = useState(0);

  const reset = () => {
    target.current = Math.round(Math.random() * 100);
    setVal(50); setHit(false);
  };
  useEffect(() => { reset(); }, []);

  const diff = Math.abs(val - target.current);
  useEffect(() => {
    if (diff < 4 && !hit) { setHit(true); setTries((t) => t + 1); playTone(midiToFreq(72), 0, 0.3, "sine", 0.3); }
  }, [diff, hit]);

  const label = mode === "buffer" ? "BUFFER SIZE" : mode === "comp" ? "ATTACK" : "FREQUENCY";

  return (
    <div className="space-y-4">
      <div className="brutal-border bg-card p-6 grid grid-cols-2 gap-6 items-center">
        <Knob label={`TARGET ${label}`} value={target.current} color="bg-hot" />
        <Knob label={`YOUR ${label}`} value={val} color="bg-acid" />
      </div>
      <input type="range" min={0} max={100} value={val} onChange={(e) => setVal(+e.target.value)} className="w-full" />
      <div className="flex items-center gap-3">
        <button onClick={reset} className="brutal-border bg-bone px-3 py-2 font-mono uppercase brutal-press">New Target</button>
        <span className={`brutal-border px-3 py-1 font-mono uppercase ${hit ? "bg-acid" : diff < 15 ? "bg-sun" : "bg-bone"}`}>
          {hit ? "MATCHED" : diff < 15 ? "WARMER" : "FAR"} · ±{diff}
        </span>
        <span className="font-mono text-xs">Hits: {tries}</span>
      </div>
    </div>
  );
}

function Knob({ label, value, color }: { label: string; value: number; color: string }) {
  const angle = -135 + (value / 100) * 270;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${color} brutal-border w-32 h-32 rounded-full relative`}>
        <div className="absolute left-1/2 top-1/2 origin-bottom h-14 w-1 bg-ink"
          style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)`, transformOrigin: "50% 100%" }} />
      </div>
      <span className="font-mono text-xs uppercase">{label}: {value}</span>
    </div>
  );
}
