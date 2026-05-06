import { useState } from "react";

type Track = { name: string; color: string; vol: number; pan: number; mute: boolean; solo: boolean };

const init: Track[] = [
  { name: "DRUMS", color: "bg-acid", vol: 0.8, pan: 0, mute: false, solo: false },
  { name: "BASS", color: "bg-hot text-bone", vol: 0.7, pan: -0.1, mute: false, solo: false },
  { name: "SYNTH", color: "bg-volt text-bone", vol: 0.6, pan: 0.2, mute: false, solo: false },
  { name: "PAD", color: "bg-sun", vol: 0.5, pan: 0, mute: false, solo: false },
  { name: "VOX", color: "bg-bone", vol: 0.65, pan: 0, mute: false, solo: false },
];

export function MixerSim() {
  const [tracks, setTracks] = useState<Track[]>(init);
  const upd = (i: number, patch: Partial<Track>) => setTracks((t) => t.map((tr, idx) => idx === i ? { ...tr, ...patch } : tr));
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {tracks.map((t, i) => (
          <div key={t.name} className="brutal-border bg-card p-3 flex flex-col items-stretch gap-2">
            <div className={`${t.color} brutal-border font-display text-center py-1`}>{t.name}</div>
            <div className="flex gap-1">
              <button onClick={() => upd(i, { mute: !t.mute })} className={`flex-1 brutal-border font-mono text-xs py-1 ${t.mute ? "bg-hot text-bone" : "bg-bone"}`}>M</button>
              <button onClick={() => upd(i, { solo: !t.solo })} className={`flex-1 brutal-border font-mono text-xs py-1 ${t.solo ? "bg-acid" : "bg-bone"}`}>S</button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <input type="range" min={0} max={1} step={0.01} value={t.vol} onChange={(e) => upd(i, { vol: +e.target.value })}
                className="w-full" style={{ writingMode: "vertical-lr" as any, WebkitAppearance: "slider-vertical", height: 140 }} />
              <span className="font-mono text-[10px]">{Math.round(t.vol * 100)}</span>
            </div>
            <label className="font-mono text-[10px] flex flex-col">
              PAN {t.pan.toFixed(1)}
              <input type="range" min={-1} max={1} step={0.05} value={t.pan} onChange={(e) => upd(i, { pan: +e.target.value })} />
            </label>
            <Meter active={!t.mute} level={t.vol} />
          </div>
        ))}
        <div className="brutal-border bg-ink text-bone p-3 flex flex-col items-center gap-2">
          <div className="brutal-border bg-acid text-ink font-display py-1 px-3">MASTER</div>
          <Meter active level={tracks.reduce((s, t) => s + (t.mute ? 0 : t.vol), 0) / tracks.length} big />
          <div className="font-mono text-xs">0.0 dB</div>
        </div>
      </div>
    </div>
  );
}

function Meter({ active, level, big = false }: { active: boolean; level: number; big?: boolean }) {
  const segs = big ? 16 : 10;
  const lit = active ? Math.floor(level * segs) : 0;
  return (
    <div className="flex flex-col-reverse gap-[2px] w-full">
      {Array.from({ length: segs }).map((_, i) => (
        <div key={i} className={`h-2 brutal-border ${i < lit ? (i > segs * 0.8 ? "bg-hot" : i > segs * 0.6 ? "bg-sun" : "bg-acid") : "bg-bone"}`} />
      ))}
    </div>
  );
}
