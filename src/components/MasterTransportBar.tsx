// Master Transport Bar - sticky footer with global play/stop/BPM control
import { useTransport } from '@/lib/transport-context';
import type { SampleName } from '@/lib/audio';

const SAMPLES: { id: SampleName; label: string }[] = [
  { id: 'drum-loop', label: 'DRUMS' },
  { id: 'bass-loop', label: 'BASS' },
  { id: 'chord-pad', label: 'CHORDS' },
  { id: 'vox-chop', label: 'VOX' },
  { id: 'full-mix', label: 'FULL MIX' },
];

export function MasterTransportBar() {
  const { playing, bpm, sample, togglePlay, setBpm, setSample } = useTransport();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 brutal-border-t bg-ink text-bone p-3 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={togglePlay}
          className={`brutal-border px-4 py-2 font-display text-lg brutal-press ${
            playing ? 'bg-hot text-bone' : 'bg-acid text-ink'
          }`}
        >
          {playing ? '■ STOP' : '▶ PLAY'}
        </button>

        <div className="flex gap-1 flex-wrap">
          {SAMPLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSample(s.id)}
              className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${
                sample === s.id ? 'bg-acid text-ink' : 'bg-bone text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <label className="font-mono text-xs uppercase flex items-center gap-2">
        BPM
        <input
          type="range"
          min={60}
          max={180}
          value={bpm}
          onChange={(e) => setBpm(+e.target.value)}
          className="w-24"
        />
        <span className="brutal-border bg-bone text-ink px-2 py-1 min-w-12 text-center">{bpm}</span>
      </label>
    </div>
  );
}
