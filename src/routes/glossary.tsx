import { createFileRoute } from "@tanstack/react-router";

const TERMS: { term: string; def: string }[] = [
  { term: "Arrangement View", def: "Live's linear timeline view for composing full songs." },
  { term: "Audio Effect", def: "A device that processes audio (EQ, Comp, Reverb…)." },
  { term: "Auto-Save", def: "Background project snapshot in the Backup folder." },
  { term: "Browser", def: "Left-side library of sounds, samples, devices and presets." },
  { term: "Bounce in Place", def: "Render a track to audio, replacing the source." },
  { term: "Clip", def: "A single piece of musical content — MIDI or audio." },
  { term: "Clip Envelope", def: "Automation that lives inside a single clip." },
  { term: "Compressor", def: "Reduces dynamic range — squashes peaks." },
  { term: "Control Bar", def: "Top strip with tempo, transport, metronome, quantization." },
  { term: "Crossfader", def: "DJ-style A/B blend across tracks." },
  { term: "CV Tools", def: "Devices that send/receive analog control voltage to modular gear." },
  { term: "Detail View", def: "Clip & device editor at the bottom of the window." },
  { term: "Device", def: "Any instrument or effect, built-in or plugin." },
  { term: "Drift", def: "Analog-style synth added in Live 11." },
  { term: "Drum Rack", def: "Container of 16+ pads, each hosting a chain or Simpler." },
  { term: "Envelope Follower", def: "M4L device that converts an audio level into modulation." },
  { term: "Follow Action", def: "Instruction for what a clip does when it ends." },
  { term: "Freeze", def: "Render a track temporarily to save CPU." },
  { term: "Group Track", def: "A folder + audio bus combining multiple tracks." },
  { term: "Hybrid Reverb", def: "Reverb combining convolution and algorithmic engines (Live 11+)." },
  { term: "Live Pack (.alp)", def: "A bundled, distributable Live project." },
  { term: "Live Set (.als)", def: "A single Live project file." },
  { term: "Locator", def: "Section bookmark in Arrangement (intro, verse, drop)." },
  { term: "Macro", def: "One of 16 knobs in a Rack mappable to any inner parameter." },
  { term: "Macro Variation", def: "A snapshot of all macro values, recallable instantly." },
  { term: "Max for Live (M4L)", def: "Visual coding environment baked into Live Suite." },
  { term: "Meld", def: "MPE-first dual-engine synth, Live 12." },
  { term: "MIDI Effect", def: "Processes MIDI before it reaches an instrument." },
  { term: "MIDI Map", def: "Per-set mapping of a hardware control to a parameter." },
  { term: "Modulation Lane", def: "Live 12 offset-based parameter movement on top of automation." },
  { term: "Operator", def: "Live's 4-operator FM synth." },
  { term: "Pencil Mode", def: "Draw notes/automation freely (B key)." },
  { term: "Push", def: "Ableton's hardware controller; Push 3 runs Live standalone." },
  { term: "Quantize", def: "Snap notes/clips to a grid value." },
  { term: "Rack", def: "Container of devices with Macros and Chains." },
  { term: "Re-Pitch", def: "Warp mode that changes pitch with tempo (tape-style)." },
  { term: "Resampling", def: "Routing the master output back into a track input." },
  { term: "Return Track", def: "Destination for sends; usually hosts reverb/delay." },
  { term: "Roar", def: "Multi-band saturator/distortion in Live 12." },
  { term: "Sampler / Simpler", def: "Live's sample-based instruments (multi vs single)." },
  { term: "Scene", def: "A row in Session View; launches all clips on that row." },
  { term: "Send / Pre / Post", def: "Pre = before the fader, Post = after." },
  { term: "Session View", def: "Live's clip grid for non-linear performance." },
  { term: "Sidechain", def: "Use one signal to trigger compression on another (the pump)." },
  { term: "Slice to MIDI", def: "Chop a clip onto Drum Rack pads." },
  { term: "Take Lane", def: "Multiple recording passes for comping (Live 11+)." },
  { term: "Tempo Follower", def: "Tracks tempo from an audio input (Live 11+)." },
  { term: "Warp", def: "Time-stretch audio without changing pitch." },
  { term: "Wavetable", def: "Modern wavetable synth, Live's main synth workhorse." },
];

export const Route = createFileRoute("/glossary")({
  head: () => ({ meta: [{ title: "Glossary — ABLETON.SCHOOL" }, { name: "description", content: "A–Z of every Ableton Live term." }]}),
  component: Glossary,
});

function Glossary() {
  const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <h1 className="text-5xl md:text-7xl mb-6">// GLOSSARY</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {sorted.map((t) => (
          <div key={t.term} className="brutal-border bg-card p-4 brutal-shadow-sm">
            <div className="font-display text-xl">{t.term}</div>
            <div className="font-mono text-sm mt-1">{t.def}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
