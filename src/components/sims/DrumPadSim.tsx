import { useEffect, useRef, useState } from "react";
import { playKick, playSnare, playHat, playClap, midiToFreq, playTone } from "@/lib/audio";

const PADS: { name: string; color: string; play: () => void }[] = [
  { name: "KICK", color: "bg-acid", play: () => playKick() },
  { name: "SNARE", color: "bg-hot text-bone", play: () => playSnare() },
  { name: "HAT", color: "bg-volt text-bone", play: () => playHat() },
  { name: "OPEN", color: "bg-sun", play: () => playHat(0, true) },
  { name: "CLAP", color: "bg-bone", play: () => playClap() },
  { name: "TOM", color: "bg-acid", play: () => playTone(120, 0, 0.25, "sine", 0.4) },
  { name: "BASS", color: "bg-hot text-bone", play: () => playTone(midiToFreq(36), 0, 0.4, "sawtooth", 0.3) },
  { name: "BLEEP", color: "bg-volt text-bone", play: () => playTone(midiToFreq(76), 0, 0.2, "square", 0.2) },
];

export function DrumPadSim() {
  const [steps, setSteps] = useState<boolean[][]>(() => Array.from({ length: 4 }, () => Array(16).fill(false)));
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  useEffect(() => {
    if (!playing) return;
    const interval = (60 / bpm) * 1000 / 4;
    const id = window.setInterval(() => {
      const s = stepRef.current;
      const row = stepsRef.current;
      if (row[0][s]) playKick();
      if (row[1][s]) playSnare();
      if (row[2][s]) playHat();
      if (row[3][s]) playClap();
      stepRef.current = (s + 1) % 16;
      setStep(stepRef.current);
    }, interval);
    return () => clearInterval(id);
  }, [playing, bpm]);

  const toggle = (r: number, c: number) => {
    setSteps((prev) => prev.map((row, i) => i === r ? row.map((v, j) => j === c ? !v : v) : row));
  };

  const labels = ["KICK", "SNARE", "HAT", "CLAP"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={() => setPlaying((p) => !p)} className="brutal-border bg-acid px-4 py-2 font-mono uppercase brutal-press">
          {playing ? "■ Stop" : "▶ Play"}
        </button>
        <label className="font-mono text-xs uppercase flex items-center gap-2">BPM
          <input type="range" min={60} max={180} value={bpm} onChange={(e) => setBpm(+e.target.value)} className="accent-ink" />
          <span className="brutal-border bg-bone px-2 py-1">{bpm}</span>
        </label>
        <button onClick={() => setSteps(Array.from({ length: 4 }, () => Array(16).fill(false)))} className="brutal-border bg-bone px-3 py-2 font-mono uppercase brutal-press">Clear</button>
      </div>

      <div className="space-y-1">
        {labels.map((l, r) => (
          <div key={l} className="flex gap-1 items-center">
            <div className="w-20 brutal-border bg-ink text-bone font-mono text-xs uppercase px-2 py-2">{l}</div>
            {steps[r].map((on, c) => (
              <button
                key={c}
                onClick={() => toggle(r, c)}
                className={`flex-1 h-10 brutal-border ${on ? (r === 0 ? "bg-acid" : r === 1 ? "bg-hot" : r === 2 ? "bg-volt" : "bg-sun") : "bg-card"} ${step === c && playing ? "outline outline-4 outline-ink" : ""}`}
                aria-label={`${l} step ${c+1}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-display text-xl mb-2">DRUM RACK PADS</h4>
        <div className="grid grid-cols-4 gap-2">
          {PADS.map((p) => (
            <button key={p.name} onClick={p.play} className={`${p.color} brutal-border h-20 font-display text-lg brutal-press`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
