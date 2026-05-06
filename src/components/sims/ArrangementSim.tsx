import { useState } from "react";

type Clip = { id: string; track: number; start: number; len: number; color: string; label: string };
const TRACKS = ["DRUMS", "BASS", "SYNTH", "VOX"];
const COLORS = ["bg-acid", "bg-hot text-bone", "bg-volt text-bone", "bg-sun"];

export function ArrangementSim() {
  const [clips, setClips] = useState<Clip[]>([
    { id: "1", track: 0, start: 0, len: 16, color: COLORS[0], label: "Intro Drums" },
    { id: "2", track: 1, start: 4, len: 12, color: COLORS[1], label: "Bass" },
    { id: "3", track: 2, start: 8, len: 8, color: COLORS[2], label: "Lead" },
    { id: "4", track: 3, start: 12, len: 4, color: COLORS[3], label: "Vox Hook" },
  ]);
  const [auto, setAuto] = useState<number[]>(Array(32).fill(50));
  const [draw, setDraw] = useState(false);
  const move = (id: string, dx: number) => setClips((cs) => cs.map((c) => c.id === id ? { ...c, start: Math.max(0, c.start + dx) } : c));

  return (
    <div className="space-y-3">
      <div className="brutal-border bg-card overflow-x-auto">
        {TRACKS.map((t, ti) => (
          <div key={t} className="flex brutal-border border-x-0 border-t-0 last:border-b-0">
            <div className="w-24 brutal-border border-y-0 border-l-0 bg-ink text-bone font-mono text-xs uppercase p-2 flex items-center">{t}</div>
            <div className="flex-1 relative h-12 grid-bg">
              {clips.filter((c) => c.track === ti).map((c) => (
                <div key={c.id} className={`${c.color} brutal-border absolute top-1 bottom-1 font-mono text-[10px] uppercase px-1 flex items-center justify-between`}
                  style={{ left: `${(c.start / 32) * 100}%`, width: `${(c.len / 32) * 100}%` }}>
                  <span>{c.label}</span>
                  <span className="flex gap-1">
                    <button onClick={() => move(c.id, -1)} className="brutal-border bg-bone text-ink px-1">◀</button>
                    <button onClick={() => move(c.id, 1)} className="brutal-border bg-bone text-ink px-1">▶</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Automation lane */}
        <div className="flex">
          <div className="w-24 brutal-border border-y-0 border-l-0 bg-hot text-bone font-mono text-xs uppercase p-2 flex items-center">VOL AUTO</div>
          <svg viewBox="0 0 320 60" className="flex-1 h-16 bg-bone cursor-crosshair"
            onMouseMove={(e) => {
              if (!draw) return;
              const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
              const i = Math.floor(((e.clientX - rect.left) / rect.width) * 32);
              const v = 100 - ((e.clientY - rect.top) / rect.height) * 100;
              setAuto((a) => a.map((x, idx) => idx === i ? Math.max(0, Math.min(100, v)) : x));
            }}
            onMouseDown={() => setDraw(true)} onMouseUp={() => setDraw(false)} onMouseLeave={() => setDraw(false)}>
            <polyline fill="none" stroke="#000" strokeWidth="2" points={auto.map((v, i) => `${i * 10 + 5},${60 - (v / 100) * 56 - 2}`).join(" ")} />
            {auto.map((v, i) => (<circle key={i} cx={i * 10 + 5} cy={60 - (v / 100) * 56 - 2} r="3" fill="#FF2E88" />))}
          </svg>
        </div>
      </div>
      <p className="font-mono text-xs uppercase opacity-70">Click & drag the bottom lane to draw automation. ◀/▶ shifts clips.</p>
    </div>
  );
}
