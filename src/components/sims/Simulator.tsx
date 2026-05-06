import type { SimType } from "@/content/types";
import { DrumPadSim } from "./DrumPadSim";
import { PianoRollSim } from "./PianoRollSim";
import { MixerSim } from "./MixerSim";
import { DeviceChainSim } from "./DeviceChainSim";
import { WarpLabSim } from "./WarpLabSim";
import { KnobTrainerSim } from "./KnobTrainerSim";
import { SessionGridSim } from "./SessionGridSim";
import { ArrangementSim } from "./ArrangementSim";
import { RoutingPuzzleSim } from "./RoutingPuzzleSim";
import { MidiMapSim } from "./MidiMapSim";
import { EarTrainingSim } from "./EarTrainingSim";
import { InterfaceTourSim } from "./InterfaceTourSim";
import { BrowserTourSim } from "./BrowserTourSim";

export function Simulator({ type, preset }: { type: SimType; preset?: Record<string, unknown> }) {
  switch (type) {
    case "drum-pad": return <DrumPadSim />;
    case "piano-roll": return <PianoRollSim />;
    case "mixer": return <MixerSim />;
    case "device-chain": return <DeviceChainSim />;
    case "warp-lab": return <WarpLabSim />;
    case "knob-trainer": return <KnobTrainerSim preset={preset} />;
    case "session-grid": return <SessionGridSim />;
    case "arrangement": return <ArrangementSim />;
    case "routing-puzzle": return <RoutingPuzzleSim />;
    case "midi-map": return <MidiMapSim />;
    case "ear-training": return <EarTrainingSim preset={preset} />;
    case "interface-tour": return <InterfaceTourSim />;
    case "browser-tour": return <BrowserTourSim />;
    default: return <div className="brutal-border bg-bone p-6 font-mono text-xs uppercase">No simulator for this mission — read & quiz only.</div>;
  }
}

export const SIM_LIST: { type: SimType; label: string; color: string }[] = [
  { type: "drum-pad", label: "Drum Rack", color: "bg-acid" },
  { type: "piano-roll", label: "Piano Roll", color: "bg-hot text-bone" },
  { type: "mixer", label: "Mixer", color: "bg-volt text-bone" },
  { type: "device-chain", label: "Device Chain", color: "bg-sun" },
  { type: "warp-lab", label: "Warp Lab", color: "bg-acid" },
  { type: "knob-trainer", label: "Knob Trainer", color: "bg-hot text-bone" },
  { type: "session-grid", label: "Session Grid", color: "bg-volt text-bone" },
  { type: "arrangement", label: "Arrangement", color: "bg-sun" },
  { type: "routing-puzzle", label: "Routing", color: "bg-acid" },
  { type: "midi-map", label: "MIDI Map", color: "bg-hot text-bone" },
  { type: "ear-training", label: "Ear Training", color: "bg-volt text-bone" },
  { type: "interface-tour", label: "Interface Tour", color: "bg-sun" },
  { type: "browser-tour", label: "Browser", color: "bg-acid" },
];
