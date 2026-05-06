# V2: From Demo to Production-Grade Learning Platform

You flagged the right things — current build is a skeleton. Explainers are too thin, sims don't make sound, devices don't actually do anything, and there's no felt sense of journey. This pass turns it into a serious, audio-first learning platform while keeping the brutalist look.

---

## 1. Journey & Timeline

A real path through the course, not just a grid.

- **New `JourneyMap` component** on the home page and `/worlds`: a horizontal/vertical brutalist "subway map" showing all 6 worlds and ~60 missions as connected stops. Completed = filled, current = pulsing, locked = hatched.
- **Mission breadcrumb header**: `World 3 · Mission 14 of 60 · 23% complete · ~6 min` on every mission page.
- **Prev / Next rail** at top and bottom of every mission with mission titles, not just arrows.
- **Time estimates** per mission (read + play + quiz) and per world.
- **Per-world progress ring** + cumulative XP-to-next-level bar in the header.
- **"Resume where you left off"** CTA on home, plus a `Continue` shortcut in the header marquee.

---

## 2. Audio Everywhere

Every interactive demo gets real, comparable sound built on the existing Web Audio engine — no asset files, all synthesised, instant.

New shared primitives (`src/lib/audio.ts` extension):
- `playSample(name)` — synthesised loops: `drum-loop`, `bass-loop`, `chord-pad`, `vox-chop`, `full-mix`.
- `AudioBus` class: chainable nodes (EQ, Comp, Reverb, Delay, Saturator, Filter, Chorus, Phaser) with bypass + wet/dry, so any sim can route a source through real DSP.
- `useTransport()` hook: shared play/stop/BPM, a global transport bar pinned to the bottom on simulator pages.
- **A/B compare button** on every device sim: hold to bypass, release to engage — instant before/after.
- **Spectrum + level meter** component (bar-style, not FFT noise) reused across sims.

---

## 3. Real Device Lab (replaces toy DeviceChainSim)

A dedicated `/devices` route + per-device deep-dive pages. Each device is a real working processor on a looping source you choose (drums / bass / chord / vox / full mix).

Devices covered with working DSP:
1. **EQ Eight** — 8 draggable bands on a frequency response curve, hear cuts/boosts live.
2. **Compressor** — threshold/ratio/attack/release/knee with gain-reduction meter and waveform before/after.
3. **Saturator** — drive + waveshape select (soft/hard/tube/digital) with visible transfer curve and audible grit (fixes the "saturator does nothing" bug — currently it has no audio node at all).
4. **Reverb (Hybrid-style)** — size, decay, predelay, wet/dry on a convolution-ish impulse.
5. **Delay** — time (ms or sync), feedback, ping-pong, filter.
6. **Auto Filter** — cutoff, resonance, LFO rate/depth, envelope follow.
7. **Chorus / Phaser / Flanger** — rate, depth, feedback.
8. **Glue Compressor** — bus compression on the full mix.
9. **Operator (FM mini)** — 2-op FM with ratio + mod index.
10. **Wavetable (mini)** — wavetable position, filter, amp env.

Each device page has: animated signal-flow diagram, parameter cards explaining *what each knob actually does to the sound*, A/B button, preset chips ("subtle", "extreme", "broken"), and a "what to listen for" checklist.

Device chain builder gets rebuilt on top of these real nodes — chain order actually changes the sound.

---

## 4. Deeper Explainers (the big content pass)

Every mission's `explainer` array gets expanded from ~3 blocks to 8–15 blocks, with this required structure:

1. **Why this matters** (lead)
2. **The concept** (2–3 paragraphs)
3. **How it works under the hood** (key callout)
4. **Concrete examples** with audio playback buttons inline
5. **Where you'll see it in Live** (with annotated diagram)
6. **Common mistakes** (warn callout)
7. **Pro workflow tip** (tip callout)
8. **Connections** — explicit "this links to: [Mission X], [Mission Y]" cross-references rendered as clickable chips. New `explainer` block kind: `link`.

Specific fixes you called out:
- **Mission "Clip 101 / MIDI vs Audio"**: rebuilt sim — side-by-side MIDI clip (notes you can edit, re-pitch instantly, change instrument) vs Audio clip (waveform, warp markers, pitch shift artifacts) playing the *same melody* so the difference is audible. Explainer goes from 4 lines to a full breakdown of sample rate, bit depth, MIDI messages, why MIDI is editable and audio isn't, and when to use each.
- **Arrangement view**: now plays a real 16-bar arrangement with the four tracks (drums/bass/synth/vox) you can mute/solo, scrub, and loop. Automation lane actually controls volume on playback.
- **Every quiz question**: pre-quiz "recap card" summarising the answer's concept so questions are never asked about something not explained. Wrong answers show the explanation inline, not just "incorrect".

---

## 5. Glossary → Knowledge Base

Current 50 terms is a stub. Rebuilt as a real reference:
- **150+ terms** covering every concept from the manual (warping algorithms, every device, every view, every workflow, MIDI spec terms, audio terms, performance terms, M4L, CV, Push, file types, etc.).
- **Categories + filter chips**: Devices, Workflow, Audio Theory, MIDI, Performance, File System, Shortcuts.
- **Search bar** with instant fuzzy filter.
- **Each term card**: definition, "see also" links, link to the mission(s) that teach it, optional mini audio example or diagram.
- **Keyboard shortcut trainer**: dedicated section with flashcard mode (shows action, you press the key, it validates).

---

## 6. Signal Flow Visualizer

New `/signal-flow` route plus embedded diagrams in routing/mixing missions:
- SVG diagrams for: track signal path, send/return, sidechain, group bus, external routing, resampling, MIDI → instrument → audio.
- Hover any node → highlights the path, shows a tooltip with the explanation.
- Click → opens a side panel with the full breakdown and a "play this routing" button.

---

## 7. Interactive Challenges Layer

On top of the existing quiz: each mission gets 1 mini-challenge with visual validation.
Examples: "Make this drum loop pump — set sidechain compressor threshold below -12dB", "EQ out the boomy 200Hz", "Warp this clip so the transient lands on beat 1". Pass = checkmark + bonus XP. Fail = inline hint.

---

## 8. Polish

- Dark/light brutalist toggle (stays brutalist either way).
- Smooth keyframe animations on transitions, mission complete celebration.
- Keyboard nav across mission pages (J/K next/prev, space to play, A/B for compare).
- Mobile audio unlock prompt; transport bar collapses to a sticky button on mobile.
- Accessibility pass: focus rings, aria labels on all sim controls, contrast check on every color combo.

---

## Build phases (each shippable)

1. **Audio engine + transport bar + A/B + sample loops** (foundation everything else depends on).
2. **Real Device Lab** (10 devices working with audio) + rebuilt device-chain sim.
3. **Content pass**: expand all 42 missions' explainers, add `link` cross-refs, fix Clip 101 + Arrangement sims, add per-mission challenges.
4. **Journey map + breadcrumb + prev/next rail + time estimates**.
5. **Knowledge Base rebuild** (150+ terms, search, filter, shortcut trainer) + Signal Flow visualizer route.
6. **Polish**: theme toggle, animations, keyboard nav, accessibility, mobile transport.

## Technical notes

- All audio synthesised via Web Audio — no asset downloads, works offline, instant.
- New files: `src/lib/audio-bus.ts`, `src/lib/transport.ts`, `src/components/Transport.tsx`, `src/components/JourneyMap.tsx`, `src/components/SpectrumMeter.tsx`, `src/components/sims/devices/*` (one per device), `src/routes/devices.tsx`, `src/routes/devices.$slug.tsx`, `src/routes/signal-flow.tsx`, expanded `src/content/glossary.ts`.
- Existing simulators kept and upgraded, not replaced — progress survives.
- No new dependencies required.

Approve and I'll start with phase 1 (audio engine + transport) so the rest has something to plug into.
