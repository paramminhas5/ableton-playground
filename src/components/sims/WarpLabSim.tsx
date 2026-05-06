import { useEffect, useRef, useState } from "react";

// Drag warp markers along a "waveform" so transients (peaks) align to grid (vertical bars).
export function WarpLabSim() {
  const W = 800, H = 140;
  const peaks = [0.05, 0.21, 0.41, 0.7, 0.95]; // transients (fractions of width)
  const [markers, setMarkers] = useState<number[]>([0, 0.25, 0.5, 0.75, 1]);
  const drag = useRef<number | null>(null);
  const ref = useRef<SVGSVGElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    if (drag.current == null || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setMarkers((m) => m.map((v, i) => i === drag.current ? x : v));
  };
  const stop = () => { drag.current = null; };
  useEffect(() => {
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  // score: distance peaks → nearest marker (lower = better)
  const score = peaks.reduce((s, p) => {
    const targets = [0, 0.25, 0.5, 0.75, 1]; // grid
    const idx = markers.reduce((best, m, i) => Math.abs(m - p) < Math.abs(markers[best] - p) ? i : best, 0);
    return s + Math.abs(targets[idx] - p);
  }, 0);
  const aligned = score < 0.25;

  return (
    <div className="space-y-3">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full brutal-border bg-card cursor-grab" onMouseMove={onMove}>
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((g, i) => (
          <line key={i} x1={g * W} x2={g * W} y1={0} y2={H} stroke="black" strokeDasharray="4 4" />
        ))}
        {/* waveform */}
        {Array.from({ length: 200 }).map((_, i) => {
          const x = (i / 200) * W;
          const peakNear = peaks.reduce((m, p) => Math.max(m, Math.exp(-((x / W - p) ** 2) * 800)), 0);
          const h = 4 + peakNear * (H - 12) + Math.random() * 6;
          return <line key={i} x1={x} x2={x} y1={H/2 - h/2} y2={H/2 + h/2} stroke="#000" strokeWidth={2} />;
        })}
        {/* markers */}
        {markers.map((m, i) => (
          <g key={i} onMouseDown={() => (drag.current = i)} style={{ cursor: "grab" }}>
            <line x1={m * W} x2={m * W} y1={0} y2={H} stroke="#FF2E88" strokeWidth={3} />
            <rect x={m * W - 8} y={0} width={16} height={14} fill="#FF2E88" />
            <text x={m * W} y={11} textAnchor="middle" fontSize="10" fill="white" fontFamily="monospace">{i+1}</text>
          </g>
        ))}
      </svg>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase">Alignment:</span>
        <span className={`brutal-border px-3 py-1 font-mono uppercase ${aligned ? "bg-acid" : "bg-hot text-bone"}`}>
          {aligned ? "LOCKED" : "DRIFTING"} ({score.toFixed(2)})
        </span>
      </div>
      <p className="font-mono text-xs opacity-70">Drag the pink warp markers onto the transient peaks (the dashed lines are the grid).</p>
    </div>
  );
}
