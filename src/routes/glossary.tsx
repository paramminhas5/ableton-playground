import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type Term = { term: string; def: string; cat: "Workflow" | "Devices" | "Audio" | "MIDI" | "Performance" | "Files" | "Live 12" };

const TERMS: Term[] = [
  // Workflow
  { cat: "Workflow", term: "Arrangement View", def: "Live's linear timeline view for composing full songs end-to-end. Tracks stack vertically, time runs left-to-right." },
  { cat: "Workflow", term: "Session View", def: "Live's clip grid for non-linear performance and ideation. Tracks vertical, scenes horizontal." },
  { cat: "Workflow", term: "Clip", def: "A single piece of musical content. MIDI clips contain note instructions; audio clips contain a referenced sample." },
  { cat: "Workflow", term: "Scene", def: "A row in Session View. Launching the scene fires every clip on that row simultaneously." },
  { cat: "Workflow", term: "Locator", def: "A bookmark on the Arrangement timeline (Intro, Verse, Drop). Click to jump." },
  { cat: "Workflow", term: "Loop Brace", def: "The grey bar above the Arrangement that defines the loop region." },
  { cat: "Workflow", term: "Browser", def: "Left sidebar containing Sounds, Drums, Instruments, Audio Effects, MIDI Effects, Samples, Packs and your User Library." },
  { cat: "Workflow", term: "Detail View", def: "Bottom panel that opens when you double-click a clip or device — the editor for whatever you've selected." },
  { cat: "Workflow", term: "Control Bar", def: "Top strip with tempo, transport, metronome, follow, and global quantize controls." },
  { cat: "Workflow", term: "Info View", def: "Bottom-left panel that describes whatever you're hovering — the in-app help." },
  { cat: "Workflow", term: "Crossfader", def: "DJ-style A/B blender at the bottom of the mixer; assign tracks to A or B." },
  { cat: "Workflow", term: "Cue", def: "Headphone monitor send for pre-listening before bringing into the main mix." },
  { cat: "Workflow", term: "Take Lane", def: "Multiple recording passes stacked under a track for comping (Live 11+)." },
  { cat: "Workflow", term: "Comping", def: "Stitching the best moments from multiple takes into a single performance." },
  { cat: "Workflow", term: "Group Track", def: "A folder + audio bus combining multiple child tracks. Press Cmd/Ctrl+G." },
  { cat: "Workflow", term: "Return Track", def: "Destination track for sends; usually hosts shared effects like reverb or delay." },
  { cat: "Workflow", term: "Send / Pre / Post", def: "Pre-fader send is independent of track volume; post-fader follows it." },
  { cat: "Workflow", term: "Macro", def: "One of 16 knobs on a Rack. Map any inner parameter (or many) to one knob." },
  { cat: "Workflow", term: "Macro Variation", def: "A snapshot of all 16 macro values, recallable instantly. Great for live morphing." },
  { cat: "Workflow", term: "Quantize", def: "Snap notes, clips or recordings to a rhythmic grid (1 bar, 1/4, 1/16…)." },
  { cat: "Workflow", term: "Global Quantize", def: "Default launch quantize for all clips — usually 1 Bar so launches stay in time." },
  { cat: "Workflow", term: "Follow Action", def: "Rule for what a clip does after it ends: Stop, Play Again, Next, Previous, Other, Random, etc." },
  { cat: "Workflow", term: "Freeze", def: "Render a track temporarily to audio to save CPU; can be unfrozen anytime." },
  { cat: "Workflow", term: "Bounce in Place", def: "Render a track to audio, replacing the source. Destructive but lighter on CPU." },
  { cat: "Workflow", term: "Resampling", def: "Routing the master output back into a track input to record what you hear." },
  { cat: "Workflow", term: "Ableton Link", def: "Network protocol that keeps multiple apps and devices in tempo sync." },
  { cat: "Workflow", term: "Tempo Follower", def: "Tracks the tempo of an audio input and adjusts the project tempo to match (Live 11+)." },

  // Audio
  { cat: "Audio", term: "Warp", def: "Time-stretching that locks any audio sample to the project tempo without changing pitch." },
  { cat: "Audio", term: "Warp Marker", def: "A pin on the waveform telling Live where a transient lives so it can stretch around it." },
  { cat: "Audio", term: "Beats Mode", def: "Warp algorithm for percussive material — slices around transients." },
  { cat: "Audio", term: "Tones Mode", def: "Warp algorithm for monophonic melodic material like vocals or bass." },
  { cat: "Audio", term: "Texture Mode", def: "Warp algorithm for pads, ambience, polyphonic material." },
  { cat: "Audio", term: "Re-Pitch", def: "Tape-style stretch where pitch follows speed (faster = higher)." },
  { cat: "Audio", term: "Complex / Complex Pro", def: "CPU-heavy warp modes for full mixes. Pro adds formant control." },
  { cat: "Audio", term: "Sample Rate", def: "How many amplitude samples per second a digital recording stores. CD quality = 44.1 kHz." },
  { cat: "Audio", term: "Bit Depth", def: "How many bits per sample. 16-bit = CD; 24-bit = production standard." },
  { cat: "Audio", term: "Buffer Size", def: "How many samples Live processes at a time. Lower = less latency, more CPU strain." },
  { cat: "Audio", term: "Latency", def: "Delay between an action and hearing the result. Mostly determined by buffer size." },
  { cat: "Audio", term: "Headroom", def: "Distance between your loudest peak and 0 dBFS. Aim for 6 dB to leave room for mastering." },
  { cat: "Audio", term: "Transient", def: "The sharp attack at the start of a sound (kick thud, snare crack). What punch is made of." },
  { cat: "Audio", term: "EQ", def: "Equaliser. Cuts or boosts specific frequency ranges to shape tone." },
  { cat: "Audio", term: "High-pass", def: "Filter that removes frequencies below the cutoff. Used to clean low rumble off vocals, hats." },
  { cat: "Audio", term: "Low-pass", def: "Filter that removes frequencies above the cutoff. Makes things darker." },
  { cat: "Audio", term: "Resonance / Q", def: "Boost at the cutoff frequency. High Q = ringy, acid-bass character." },
  { cat: "Audio", term: "Compression", def: "Turning down anything above a threshold to even out dynamics." },
  { cat: "Audio", term: "Threshold", def: "The level at which a compressor or gate starts working." },
  { cat: "Audio", term: "Ratio", def: "How aggressively a compressor squashes signal above the threshold (4:1, 10:1…)." },
  { cat: "Audio", term: "Attack (Comp)", def: "How fast the compressor clamps after threshold is crossed." },
  { cat: "Audio", term: "Release (Comp)", def: "How fast the compressor lets go after the signal drops back below threshold." },
  { cat: "Audio", term: "Knee", def: "How smoothly compression engages around the threshold. Soft = gentle." },
  { cat: "Audio", term: "Makeup Gain", def: "Boost after compression to restore the level you reduced." },
  { cat: "Audio", term: "Sidechain", def: "Use one signal as the trigger that controls processing on another. Classic kick→bass duck." },
  { cat: "Audio", term: "Saturation", def: "Generating harmonics by reshaping the waveform. Adds warmth, grit, or distortion." },
  { cat: "Audio", term: "Reverb", def: "Simulation of how sound decays in a real or imagined space." },
  { cat: "Audio", term: "Predelay", def: "Gap between dry signal and the start of the reverb tail. Keeps vocals upfront." },
  { cat: "Audio", term: "Convolution", def: "Multiplying your signal against an impulse response of a real space." },
  { cat: "Audio", term: "Impulse Response (IR)", def: "A recording of how a space (or hardware) responds to a single click." },
  { cat: "Audio", term: "Delay", def: "Echoes — a delayed copy of the input, optionally feeding back for repeats." },
  { cat: "Audio", term: "Feedback (Delay)", def: "How much of each delay echo gets fed back to create more echoes. >0.9 self-oscillates." },
  { cat: "Audio", term: "Chorus", def: "Modulated short delay summed with dry signal to create width and lushness." },
  { cat: "Audio", term: "Phaser", def: "Notch filters swept by an LFO. The classic 'whoosh'." },
  { cat: "Audio", term: "Flanger", def: "Like chorus but with shorter delay and feedback — jet-engine sweep." },
  { cat: "Audio", term: "LFO", def: "Low-Frequency Oscillator — a slow waveform used to modulate parameters." },
  { cat: "Audio", term: "Stereo Field", def: "The space between your left and right speakers. Pan + width + delay live here." },
  { cat: "Audio", term: "Phase", def: "How two waveforms align in time. Cancellation happens when they're inverted." },
  { cat: "Audio", term: "Limiter", def: "An extreme compressor that prevents signal from passing a ceiling. Used on the master." },
  { cat: "Audio", term: "True Peak", def: "Inter-sample peak measurement. More accurate than sample-peak for digital ceilings." },

  // MIDI
  { cat: "MIDI", term: "MIDI", def: "Musical Instrument Digital Interface. A protocol for sending note and controller data — not audio." },
  { cat: "MIDI", term: "Velocity", def: "How hard a MIDI note is hit. Most instruments map velocity to volume and tone." },
  { cat: "MIDI", term: "Note On / Off", def: "The two MIDI messages that start and stop a note." },
  { cat: "MIDI", term: "CC", def: "Control Change — a MIDI controller value (0–127) for things like mod wheel or filter cutoff." },
  { cat: "MIDI", term: "Aftertouch", def: "MIDI message generated by pressing harder on a key after the initial strike." },
  { cat: "MIDI", term: "MPE", def: "MIDI Polyphonic Expression — per-note pitch, glide, slide, pressure. Meld is MPE-first." },
  { cat: "MIDI", term: "Pencil Mode", def: "Draw notes/automation freely. Toggle with B." },
  { cat: "MIDI", term: "Piano Roll", def: "The MIDI editor — pitches up the side, time across the top." },
  { cat: "MIDI", term: "MIDI Effect", def: "Processes MIDI before it reaches the instrument (Arpeggiator, Chord, Scale)." },
  { cat: "MIDI", term: "MIDI Map", def: "Per-set assignment of a hardware control to a Live parameter (Cmd/Ctrl + M)." },
  { cat: "MIDI", term: "Note Transformations", def: "Live 12 generative MIDI tools: Stacks, Rhythm, Shape, Recombine, Connect, Seed." },
  { cat: "MIDI", term: "Generative MIDI", def: "Algorithms that create or modify note patterns rather than you drawing them." },
  { cat: "MIDI", term: "Quantize (MIDI)", def: "Snap selected notes to a grid value." },
  { cat: "MIDI", term: "Strength (Quantize)", def: "Partial quantize — 50% pulls notes halfway to the grid for a humanised feel." },

  // Devices
  { cat: "Devices", term: "Operator", def: "Live's 4-operator FM synth. Carriers output, modulators warp the carriers' frequency." },
  { cat: "Devices", term: "Wavetable", def: "Live's modern workhorse synth — two oscillators scanning through wavetables." },
  { cat: "Devices", term: "Drift", def: "Analog-modelled mono/poly synth with character (Live 11+)." },
  { cat: "Devices", term: "Meld", def: "MPE-first dual-engine synth in Live 12." },
  { cat: "Devices", term: "Sampler", def: "Multi-sample instrument with key/velocity zones. For full sampled instruments." },
  { cat: "Devices", term: "Simpler", def: "Single-sample instrument with three modes: Classic, One-Shot, Slice." },
  { cat: "Devices", term: "Drum Rack", def: "Container of 16+ pads, each hosting a Simpler or full chain on its own MIDI note." },
  { cat: "Devices", term: "Choke Group", def: "Pads in the same group cut each other off — perfect for hi-hats." },
  { cat: "Devices", term: "Rack", def: "Container of devices with Macros and parallel Chains. Instrument/Audio/MIDI/Drum." },
  { cat: "Devices", term: "Chain Selector", def: "Splits which of a rack's chains receive input by velocity, key, or chain zone." },
  { cat: "Devices", term: "EQ Eight", def: "Live's main EQ — eight parametric bands with multiple shapes per band." },
  { cat: "Devices", term: "Compressor", def: "Live's main dynamics processor with Peak, RMS, and Expand modes." },
  { cat: "Devices", term: "Glue Compressor", def: "SSL-style bus compressor — used on groups and the master to glue a mix." },
  { cat: "Devices", term: "Saturator", def: "Waveshaper with soft, hard, tube, digital and other curves." },
  { cat: "Devices", term: "Roar", def: "Multi-band saturator/distortion in Live 12 with parallel paths and feedback." },
  { cat: "Devices", term: "Hybrid Reverb", def: "Reverb combining convolution + algorithmic engines (Live 11+)." },
  { cat: "Devices", term: "Echo", def: "Analog-flavoured delay with character, modulation and stereo width." },
  { cat: "Devices", term: "Auto Filter", def: "Filter with LFO + envelope follower — classic dub and acid sweeps." },
  { cat: "Devices", term: "Auto Pan", def: "LFO-driven panning for stereo width and rhythm." },
  { cat: "Devices", term: "Vocoder", def: "Imposes the spectrum of one signal (modulator) onto another (carrier)." },
  { cat: "Devices", term: "Max for Live (M4L)", def: "Visual coding environment baked into Live Suite for building custom devices." },

  // Live 12
  { cat: "Live 12", term: "Modulation Lanes", def: "Offset-based parameter movement on top of automation, new in Live 12." },
  { cat: "Live 12", term: "Sound Similarity Search", def: "Browser feature that finds samples sonically similar to a chosen one." },
  { cat: "Live 12", term: "Tags / Categories", def: "Live 12 tagging system that classifies sounds across all your packs." },
  { cat: "Live 12", term: "MIDI Stacks", def: "Generative tool that builds chord stacks from a single note." },
  { cat: "Live 12", term: "Performance Pack", def: "Live 12 system for organising live performances with scenes & macros." },

  // Performance
  { cat: "Performance", term: "Push 3", def: "Ableton's hardware controller; can run Live standalone, no laptop required." },
  { cat: "Performance", term: "Scene Launch", def: "The triangle button that fires an entire row of clips." },
  { cat: "Performance", term: "Capture MIDI", def: "Retroactively grabs the last few bars you played, even without recording armed." },
  { cat: "Performance", term: "Session Record", def: "The bottom-bar record button that captures launched clips into Arrangement." },
  { cat: "Performance", term: "CV Tools", def: "Max for Live devices that send/receive control voltage to modular synths." },
  { cat: "Performance", term: "Aggregate Device", def: "macOS combined audio interface across multiple devices." },

  // Files
  { cat: "Files", term: "Live Set (.als)", def: "A single Live project file." },
  { cat: "Files", term: "Live Pack (.alp)", def: "A bundled, distributable project (often instructional)." },
  { cat: "Files", term: "Live Clip (.alc)", def: "A single saved clip with all its settings, devices, and warp markers." },
  { cat: "Files", term: "Live Device (.adv)", def: "A single saved device preset." },
  { cat: "Files", term: "Analysis File (.asd)", def: "Per-sample metadata Live writes alongside audio (warp markers, etc.)." },
  { cat: "Files", term: "Collect All & Save", def: "Copies every external sample into the project folder so it's portable." },
  { cat: "Files", term: "Auto-Save", def: "Background project snapshot in the Backup folder. Turn it on." },
  { cat: "Files", term: "Library", def: "The folder where Packs install. Set its location in Preferences." },
];

const CATS: Term["cat"][] = ["Workflow", "Devices", "Audio", "MIDI", "Performance", "Live 12", "Files"];

export const Route = createFileRoute("/glossary")({
  head: () => ({ meta: [
    { title: "Glossary — ABLETON.SCHOOL" },
    { name: "description", content: "A–Z of every Ableton Live concept, organised by category, with search." },
  ]}),
  component: Glossary,
});

function Glossary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Term["cat"] | "All">("All");
  const filtered = useMemo(() => {
    return TERMS
      .filter((t) => cat === "All" || t.cat === cat)
      .filter((t) => !q || t.term.toLowerCase().includes(q.toLowerCase()) || t.def.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [q, cat]);
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-4">
      <header className="brutal-border bg-sun p-6 brutal-shadow">
        <div className="font-mono text-xs uppercase">// KNOWLEDGE BASE</div>
        <h1 className="text-5xl md:text-7xl mt-2">GLOSSARY</h1>
        <p className="font-mono mt-2">{TERMS.length} terms. Every concept from the Ableton Live 12 manual, defined.</p>
      </header>
      <div className="brutal-border bg-card p-3 flex flex-wrap gap-2 items-center sticky top-0 z-30">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH…"
          className="brutal-border bg-bone px-3 py-2 font-mono text-sm uppercase flex-1 min-w-[200px]" />
        <button onClick={() => setCat("All")} className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${cat === "All" ? "bg-acid" : "bg-bone"}`}>ALL</button>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`brutal-border px-2 py-1 font-mono text-xs uppercase ${cat === c ? "bg-acid" : "bg-bone"}`}>{c}</button>
        ))}
        <span className="font-mono text-xs uppercase ml-auto">{filtered.length} results</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((t) => (
          <div key={t.term} className="brutal-border bg-card p-4 brutal-shadow-sm">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-display text-xl">{t.term}</div>
              <span className="brutal-border bg-volt text-bone px-2 py-0.5 font-mono text-[10px] uppercase">{t.cat}</span>
            </div>
            <div className="font-mono text-sm mt-1">{t.def}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="brutal-border bg-hot text-bone p-4 font-mono">No matches. Try a different term.</div>
        )}
      </div>
      <Link to="/worlds" className="brutal-border bg-acid px-4 py-2 font-mono text-xs uppercase brutal-press inline-block">← BACK TO WORLDS</Link>
    </div>
  );
}
