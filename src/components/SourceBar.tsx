// Reusable transport+source picker pinned above any device sim.
import { useEffect, useRef, useState } from "react";
import { createSource, type SourceHandle } from "@/lib/source";
import { getCtx } from "@/lib/audio";
import type { SampleName } from "@/lib/audio";

const SAMPLES: { id: SampleName; label: string }[] = [
  { id: "drum-loop", label: "DRUMS" },
  { id: "bass-loop", label: "BASS" },
  { id: "chord-pad", label: "CHORDS" },
  { id: "vox-chop", label: "VOX" },
  { id: "full-mix", label: "FULL MIX" },
];

export function SourceBar({ onReady, defaultSample = "drum-loop" }: { onReady: (src: SourceHandle) => void; defaultSample?: SampleName }) {
  const [sample, setSample] = useState<SampleName>(defaultSample);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const srcRef = useRef<SourceHandle | null>(null);

  useEffect(() => {
    getCtx();
    const s = createSource(defaultSample, 100);
    srcRef.current = s;
    onReady(s);
    return () => s.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const s = srcRef.current!;
    if (playing) { s.stop(); setPlaying(false); }
    else { getCtx(); s.start(); setPlaying(true); }
  };

  return (
    <div className="brutal-border bg-ink text-bone p-3 flex flex-wrap gap-3 items-center">
      <button onClick={toggle} className={`brutal-border px-4 py-2 font-display text-lg brutal-press ${playing ? "bg-hot text-bone" : "bg-acid text-ink"}`}>
        {playing ? "■ STOP" : "▶ PLAY"}
      </button>
      <div className="flex gap-1 flex-wrap">
        {SAMPLES.map((s) => (
          <button key={s.id} onClick={() => { setSample(s.id); srcRef.current?.setSample(s.id); }}
            className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${sample === s.id ? "bg-acid text-ink" : "bg-bone text-ink"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <label className="font-mono text-xs uppercase flex items-center gap-2 ml-auto">
        BPM
        <input type="range" min={60} max={180} value={bpm} onChange={(e) => { setBpm(+e.target.value); srcRef.current?.setBpm(+e.target.value); }} />
        <span className="brutal-border bg-bone text-ink px-2 py-1">{bpm}</span>
      </label>
    </div>
  );
}
