// Reusable transport+source picker pinned above any device sim.
// FIXED: Ensures audio context is ready, audio actually plays, provides feedback
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
  const [audioReady, setAudioReady] = useState(false);
  const srcRef = useRef<SourceHandle | null>(null);

  useEffect(() => {
    try {
      // Initialize audio context
      const ctx = getCtx();
      if (ctx) {
        // Resume audio context (required for user interaction on some browsers)
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        setAudioReady(true);
      }

      // Create source
      const s = createSource(defaultSample, 100);
      srcRef.current = s;
      onReady(s);

      return () => {
        if (s.isPlaying && s.isPlaying()) {
          s.stop();
        }
      };
    } catch (err) {
      console.error('Failed to initialize audio:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    const s = srcRef.current;
    if (!s) return;

    try {
      // Ensure audio context is running
      const ctx = getCtx();
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (playing) {
        s.stop();
        setPlaying(false);
      } else {
        s.start();
        setPlaying(true);
      }
    } catch (err) {
      console.error('Audio toggle failed:', err);
    }
  };

  const changeSample = (newSample: SampleName) => {
    setSample(newSample);
    const s = srcRef.current;
    if (s) {
      s.setSample(newSample);
    }
  };

  const changeBpm = (newBpm: number) => {
    setBpm(newBpm);
    const s = srcRef.current;
    if (s) {
      s.setBpm(newBpm);
    }
  };

  return (
    <div className="brutal-border bg-ink text-bone p-4 flex flex-wrap gap-4 items-center">
      {/* Play Button */}
      <button
        onClick={toggle}
        className={`brutal-border px-4 py-3 font-display text-lg brutal-press transition-colors ${
          playing ? "bg-hot text-bone" : "bg-acid text-ink hover:bg-sun"
        }`}
        title="Click to play/stop audio loop"
      >
        {playing ? "■ STOP" : "▶ PLAY"}
      </button>

      {/* Sample Selector */}
      <div className="flex gap-1 flex-wrap">
        {SAMPLES.map((s) => (
          <button
            key={s.id}
            onClick={() => changeSample(s.id)}
            className={`brutal-border px-3 py-2 font-mono text-xs uppercase transition-colors ${
              sample === s.id ? "bg-acid text-ink" : "bg-bone text-ink hover:bg-volt"
            }`}
            title={`Play ${s.label}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* BPM Control */}
      <label className="font-mono text-xs uppercase flex items-center gap-3 ml-auto">
        <span>BPM</span>
        <input
          type="range"
          min={60}
          max={180}
          step={1}
          value={bpm}
          onChange={(e) => changeBpm(+e.target.value)}
          className="w-32"
          title="Adjust tempo (60-180 BPM)"
        />
        <span className="brutal-border bg-bone text-ink px-3 py-1 font-display min-w-max">{bpm}</span>
      </label>

      {/* Status Indicator */}
      {!audioReady && (
        <div className="font-mono text-xs text-hot animate-pulse">
          ⚠ Initializing Audio...
        </div>
      )}
      {audioReady && playing && (
        <div className="font-mono text-xs text-acid">
          ◆ PLAYING
        </div>
      )}
    </div>
  );
}
