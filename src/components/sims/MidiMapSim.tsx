import { useState } from "react";

export function MidiMapSim() {
  const [mapping, setMapping] = useState<{ param: string | null; min: number; max: number; cc: number }>({ param: null, min: 0, max: 100, cc: 0 });
  const [knob, setKnob] = useState(0);
  const params = ["Filter Cutoff", "Reverb Wet", "Delay Feedback", "Volume"];
  const value = mapping.param ? mapping.min + (knob / 127) * (mapping.max - mapping.min) : null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="brutal-border bg-card p-4 space-y-3">
        <h4 className="font-display text-xl">MIDI CONTROLLER</h4>
        <input type="range" min={0} max={127} value={knob} onChange={(e) => setKnob(+e.target.value)} className="w-full" />
        <div className="font-mono text-xs">CC #{mapping.cc} VALUE: {knob}</div>
      </div>
      <div className="brutal-border bg-card p-4 space-y-3">
        <h4 className="font-display text-xl">PARAMETERS</h4>
        <div className="flex flex-wrap gap-2">
          {params.map((p) => (
            <button key={p} onClick={() => setMapping({ ...mapping, param: p })}
              className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${mapping.param === p ? "bg-acid" : "bg-bone"}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase block">MIN
            <input type="range" min={0} max={100} value={mapping.min} onChange={(e) => setMapping({ ...mapping, min: +e.target.value })} className="w-full" />
            <span>{mapping.min}</span>
          </label>
          <label className="font-mono text-xs uppercase block">MAX
            <input type="range" min={0} max={100} value={mapping.max} onChange={(e) => setMapping({ ...mapping, max: +e.target.value })} className="w-full" />
            <span>{mapping.max}</span>
          </label>
        </div>
        {mapping.param && (
          <div className="brutal-border bg-acid p-2 font-mono text-xs uppercase">
            {mapping.param} = {value!.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
}
