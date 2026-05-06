export type WorldSlug = "first-contact" | "two-views" | "midi-audio" | "devices" | "mixing" | "performance";

export type SimType =
  | "drum-pad"
  | "piano-roll"
  | "mixer"
  | "device-chain"
  | "warp-lab"
  | "knob-trainer"
  | "session-grid"
  | "arrangement"
  | "routing-puzzle"
  | "midi-map"
  | "ear-training"
  | "interface-tour"
  | "browser-tour"
  | "midi-vs-audio"
  | "device-lab"
  | "none";

export type QuizQ = {
  q: string;
  options: string[];
  answer: number; // index
  explain?: string;
};

export type ExplainerBlock =
  | { kind: "lead"; text: string }
  | { kind: "para"; text: string }
  | { kind: "callout"; tone: "tip" | "warn" | "key"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "diagram"; id: string; caption?: string }
  | { kind: "link"; to: "mission" | "device" | "glossary"; slug: string; label: string };

export type Mission = {
  slug: string;
  world: WorldSlug;
  number: number;          // global mission number
  title: string;
  tagline: string;
  xp: number;
  badge?: { slug: string; name: string };
  explainer: ExplainerBlock[];
  sim: { type: SimType; preset?: Record<string, unknown> };
  quiz: QuizQ[];
};

export type World = {
  slug: WorldSlug;
  number: number;
  title: string;
  tagline: string;
  color: "acid" | "hot" | "volt" | "sun" | "bone" | "ink";
  description: string;
};
