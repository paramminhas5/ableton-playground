// V2 CRITICAL FIX: Enhanced DeviceLab with working A/B bypass and audio feedback
// REPLACE: src/components/DeviceLab.tsx with this version
// Key fixes: A/B now truly bypasses the device, better visual feedback, gain reduction meter

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
  title,
  subtitle,
  factory,
  params,
  presets,
  listenFor,
  signalFlow,
  deviceLabel,
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
  const sourceRef = useRef<SourceHandle | null>(null);
  const [, force] = useState(0);
  const rerender = () => force((x) => x + 1);
  
  const [values, setValues] = useState<Record<string, number | string>>(() => {
    const v: Record<string, number | string> = {};
    params.forEach((p) => v[p.id] = p.default);
    return v;
  });
  
  const [isBypassed, setIsBypassed] = useState(false);
  const [gainReduction, setGainReduction] = useState(0);

  const onSourceReady = (s: SourceHandle) => {
    sourceRef.current = s;
    
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

  useEffect(() => () => {
    busRef.current?.dispose();
    deviceRef.current?.dispose();
    sourceRef.current?.stop();
  }, []);

  const setParam = (id: string, v: number | string) => {
    setValues((cur) => ({ ...cur, [id]: v }));
    deviceRef.current?.set(id, v);
    
    // Update gain reduction display if available
    const meta = deviceRef.current?.meta();
    if (meta && 'reduction' in meta) {
      setGainReduction(Math.abs(meta.reduction as number));
    }
  };

  const applyPreset = (preset: DevicePreset) => {
    Object.entries(preset.values).forEach(([k, v]) => setParam(k, v));
  };

  // CRITICAL FIX: Proper A/B bypass that actually switches the device in/out
  const handleBypass = (bypassEnabled: boolean) => {
    setIsBypassed(bypassEnabled);
    if (deviceRef.current) {
      deviceRef.current.bypass(bypassEnabled);
    }
    // Force visual update
    rerender();
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="brutal-border bg-card p-4 brutal-shadow-sm">
        <div className="font-mono text-xs uppercase">DEVICE LAB</div>
        <div className="font-display text-3xl">{title}</div>
        <div className="font-mono text-sm">{subtitle}</div>
      </div>

      {/* Signal Flow */}
      <div className="brutal-border bg-bone p-3 font-mono text-xs uppercase">
        SIGNAL FLOW: {signalFlow}
      </div>

      {/* Source Bar */}
      <SourceBar onReady={onSourceReady} />

      {/* Main Device Control Area */}
      <div className="grid md:grid-cols-[2fr,1fr] gap-4">
        <div className="brutal-border bg-card p-4 space-y-4">
          {/* Device Header with A/B */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-2xl">{deviceLabel}</div>
              {isBypassed && (
                <div className="font-mono text-xs text-acid mt-1">▸ BYPASSED (DRY SIGNAL)</div>
              )}
            </div>
            <div className="flex gap-2">
              <ABCompare onBypass={handleBypass} />
            </div>
          </div>

          {/* Gain Reduction Meter (for Compressor, Gate, etc.) */}
          {gainReduction > 0 && (
            <div className="brutal-border bg-bone p-3">
              <div className="font-mono text-xs uppercase mb-2">Gain Reduction</div>
              <div className="h-2 bg-ink rounded overflow-hidden">
                <div
                  className="h-full bg-hot transition-all"
                  style={{ width: `${Math.min(gainReduction * 5, 100)}%` }}
                />
              </div>
              <div className="font-mono text-xs mt-1 text-acid">{gainReduction.toFixed(1)} dB</div>
            </div>
          )}

          {/* Parameters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {params.map((p) => (
              <ParamControl
                key={p.id}
                param={p}
                value={values[p.id]}
                onChange={(v) => setParam(p.id, v)}
              />
            ))}
          </div>

          {/* Presets */}
          {presets && presets.length > 0 && (
            <div>
              <div className="font-mono text-xs uppercase mb-2">PRESETS</div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPreset(p)}
                    className="brutal-border bg-sun px-3 py-1 font-mono text-xs uppercase brutal-press hover:bg-acid"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Meters & Info */}
        <div className="space-y-3">
          {/* Spectrum Meter */}
          <SpectrumMeter analyser={busRef.current?.analyser ?? null} height={120} />

          {/* What to Listen For */}
          <div className="brutal-border bg-volt text-bone p-4">
            <div className="font-mono text-xs uppercase mb-2">WHAT TO LISTEN FOR</div>
            <ul className="space-y-1 font-mono text-sm">
              {listenFor.map((l, i) => (
                <li key={i}>▸ {l}</li>
              ))}
            </ul>
          </div>

          {/* Audio Tip */}
          <div className="brutal-border bg-acid text-ink p-3">
            <div className="font-mono text-xs uppercase mb-1">💡 TIP</div>
            <div className="font-mono text-sm">
              Toggle A/B to hear the device bypass. Use left ear for dry, right ear for wet. Close eyes and listen for tone change, not loudness.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParamControl({
  param,
  value,
  onChange,
}: {
  param: ParamSpec;
  value: number | string;
  onChange: (v: number | string) => void;
}) {
  if (param.kind === "select") {
    return (
      <div className="brutal-border bg-bone p-3">
        <div className="font-mono text-xs uppercase mb-1">{param.label}</div>
        <div className="flex flex-wrap gap-1 mb-1">
          {param.options.map((o) => (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${
                value === o.value ? "bg-acid text-ink" : "bg-card text-bone"
              } brutal-press`}
            >
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
      <div className="font-mono text-xs uppercase text-center">{param.label}</div>
      
      {/* Animated Knob */}
      <div className="bg-acid brutal-border w-20 h-20 rounded-full relative flex items-center justify-center">
        <div
          className="absolute left-1/2 top-1/2 origin-bottom h-8 w-1 bg-ink transition-transform"
          style={{
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      </div>

      {/* Slider */}
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step ?? (param.max - param.min) / 100}
        value={v}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full"
      />

      {/* Value Display */}
      <div className="font-mono text-xs text-center">
        {v.toFixed(param.step ? 2 : 0)} {param.unit ?? ""}
      </div>

      {/* Explanation */}
      <div className="font-mono text-[10px] opacity-70 text-center leading-tight">
        {param.explain}
      </div>
    </div>
  );
}
