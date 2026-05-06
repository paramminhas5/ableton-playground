// Generic Device Lab — one component drives all device pages.
// Accepts a device factory and a parameter spec; wires source -> device -> meter.
import { useEffect, useRef, useState } from "react";
import { Bus, type DeviceNode } from "@/lib/audio-bus";
import { SourceBar } from "@/components/SourceBar";
import { SpectrumMeter } from "@/components/SpectrumMeter";
import { ABCompare } from "@/components/ABCompare";
import type { SourceHandle } from "@/lib/source";

export type ParamSpec =
  | { kind: "knob"; id: string; label: string; min: number; max: number; step?: number; default: number; unit?: string; explain: string }
  | { kind: "select"; id: string; label: string; options: { value: string; label: string }[]; default: string; explain: string };

export type DevicePreset = { name: string; values: Record<string, number | string> };

export function DeviceLab({
  title, subtitle, factory, params, presets, listenFor, signalFlow, deviceLabel,
}: {
  title: string;
  subtitle: string;
  deviceLabel: string;
  factory: () => DeviceNode;
  params: ParamSpec[];
  presets?: DevicePreset[];
  listenFor: string[];
  signalFlow: string;
}) {
  const busRef = useRef<Bus | null>(null);
  const deviceRef = useRef<DeviceNode | null>(null);
  const [, force] = useState(0);
  const rerender = () => force((x) => x + 1);
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const v: Record<string, number | string> = {};
    params.forEach((p) => v[p.id] = p.default);
    return v;
  });

  const onSourceReady = (s: SourceHandle) => {
    if (!busRef.current) {
      const bus = new Bus();
      busRef.current = bus;
      const d = factory();
      deviceRef.current = d;
      bus.add(d);
      // Apply initial values
      params.forEach((p) => d.set(p.id, values[p.id]));
      s.source.connect(bus.input);
      rerender();
    } else {
      s.source.connect(busRef.current.input);
    }
  };

  useEffect(() => () => busRef.current?.dispose(), []);

  const setParam = (id: string, v: number | string) => {
    setValues((cur) => ({ ...cur, [id]: v }));
    deviceRef.current?.set(id, v);
  };

  const applyPreset = (preset: DevicePreset) => {
    Object.entries(preset.values).forEach(([k, v]) => setParam(k, v));
  };

  return (
    <div className="space-y-4">
      <div className="brutal-border bg-card p-4 brutal-shadow-sm">
        <div className="font-mono text-xs uppercase">DEVICE LAB</div>
        <div className="font-display text-3xl">{title}</div>
        <div className="font-mono text-sm">{subtitle}</div>
      </div>

      <SourceBar onReady={onSourceReady} />

      <div className="brutal-border bg-bone p-3 font-mono text-xs uppercase">
        SIGNAL FLOW: {signalFlow}
      </div>

      <div className="grid md:grid-cols-[2fr,1fr] gap-4">
        <div className="brutal-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-display text-2xl">{deviceLabel}</div>
            <ABCompare onBypass={(b) => deviceRef.current?.bypass(b)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {params.map((p) => (
              <ParamControl key={p.id} param={p} value={values[p.id]} onChange={(v) => setParam(p.id, v)} />
            ))}
          </div>

          {presets && presets.length > 0 && (
            <div>
              <div className="font-mono text-xs uppercase mb-2">PRESETS</div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button key={p.name} onClick={() => applyPreset(p)}
                    className="brutal-border bg-sun px-3 py-1 font-mono text-xs uppercase brutal-press">
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <SpectrumMeter analyser={busRef.current?.analyser ?? null} height={120} />
          <div className="brutal-border bg-volt text-bone p-4">
            <div className="font-mono text-xs uppercase mb-2">WHAT TO LISTEN FOR</div>
            <ul className="space-y-1 font-mono text-sm">
              {listenFor.map((l, i) => <li key={i}>▸ {l}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParamControl({ param, value, onChange }: { param: ParamSpec; value: number | string; onChange: (v: number | string) => void }) {
  if (param.kind === "select") {
    return (
      <div className="brutal-border bg-bone p-3">
        <div className="font-mono text-xs uppercase mb-1">{param.label}</div>
        <div className="flex flex-wrap gap-1 mb-1">
          {param.options.map((o) => (
            <button key={o.value} onClick={() => onChange(o.value)}
              className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${value === o.value ? "bg-acid" : "bg-card"}`}>
              {o.label}
            </button>
          ))}
        </div>
        <div className="font-mono text-[10px] opacity-70">{param.explain}</div>
      </div>
    );
  }
  const v = +value;
  const pct = ((v - param.min) / (param.max - param.min)) * 100;
  const angle = -135 + (pct / 100) * 270;
  return (
    <div className="brutal-border bg-bone p-3 flex flex-col items-center gap-2">
      <div className="font-mono text-xs uppercase">{param.label}</div>
      <div className="bg-acid brutal-border w-20 h-20 rounded-full relative">
        <div className="absolute left-1/2 top-1/2 origin-bottom h-9 w-1 bg-ink"
          style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)`, transformOrigin: "50% 100%" }} />
      </div>
      <input type="range" min={param.min} max={param.max} step={param.step ?? (param.max - param.min) / 100}
        value={v} onChange={(e) => onChange(+e.target.value)} className="w-full" />
      <div className="font-mono text-xs">{v.toFixed(2)} {param.unit ?? ""}</div>
      <div className="font-mono text-[10px] opacity-70 text-center">{param.explain}</div>
    </div>
  );
}
