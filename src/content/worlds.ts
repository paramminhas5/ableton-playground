import type { World } from "./types";

export const WORLDS: World[] = [
  {
    slug: "first-contact",
    number: 1,
    title: "First Contact",
    tagline: "Boot up. Learn the room.",
    color: "acid",
    description: "What Live is, the interface, the browser, preferences, files.",
  },
  {
    slug: "two-views",
    number: 2,
    title: "The Two Views",
    tagline: "Session vs Arrangement. Clips. Scenes.",
    color: "hot",
    description: "Live's twin workflows for jamming and composing.",
  },
  {
    slug: "midi-audio",
    number: 3,
    title: "MIDI & Audio",
    tagline: "Notes. Samples. Warping. Recording.",
    color: "volt",
    description: "Get sound in. Get sound right.",
  },
  {
    slug: "devices",
    number: 4,
    title: "Devices",
    tagline: "Synths, samplers, effects, racks.",
    color: "sun",
    description: "Make sound. Bend sound. Stack sound.",
  },
  {
    slug: "mixing",
    number: 5,
    title: "Mixing & Routing",
    tagline: "Faders. Sends. Automation. Sidechain.",
    color: "acid",
    description: "Glue the track. Move the parts. Hit hard.",
  },
  {
    slug: "performance",
    number: 6,
    title: "Performance",
    tagline: "Push, MIDI, Link, CV, Export.",
    color: "hot",
    description: "Take it out of the box. Play it live. Ship it.",
  },
];
