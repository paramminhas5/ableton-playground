
# ABLETON.SCHOOL — Brutalist Interactive Learn-Ableton

A full-coverage, gamified web companion to the Ableton Live 12 manual. Catscandance-flavored brutalism: black/white base, loud swatches (acid green, hot pink, electric blue), oversized mono type, raw borders, glitchy motion. Every chapter of the manual becomes a "Mission" with explainers, simulators, and a quiz.

## What gets built (v1)

A site with a left brutalist sidebar of all manual chapters grouped into 6 "Worlds", a home/overview page, a per-mission interactive lesson template, a sandbox playground, and an XP/profile system. Optional Lovable Cloud login syncs progress; otherwise localStorage.

### Worlds & missions (mirrors the manual)

1. **World 1 — First Contact**: What is Live, Interface tour, Browser, Preferences, File management.
2. **World 2 — The Two Views**: Session View, Arrangement View, Clip basics, Tracks, Scenes, Follow Actions.
3. **World 3 — MIDI & Audio**: MIDI clips & piano roll, Audio clips, Warping, Comping, Slicing, Recording.
4. **World 4 — Devices & Sound Design**: Instruments (Operator, Wavetable, Drift, Sampler, Drum Rack, Meld), Audio effects (EQ, Compressor, Reverb, Delay, Saturator, Hybrid Reverb, Spectral tools), MIDI effects, Racks & Macros.
5. **World 5 — Mixing, Routing, Automation**: Mixer, Sends/Returns, Groups, Routing, Automation & Modulation, Sidechaining, Max for Live overview.
6. **World 6 — Performance & Beyond**: Push/controllers, MIDI mapping, Tempo Following, CV tools, Link, Exporting, Live sets & projects, Troubleshooting.

Each manual chapter = one Mission card. ~60 missions total, generated from one reusable lesson template so scope stays controllable.

### Mission anatomy (one template, content varies)

```text
[ HEADER: world tag + mission # + title + XP reward ]
[ SCROLL EXPLAINER: animated diagrams, hotspots, captions ]
[ SIMULATOR: the interactive toy for this concept ]
[ QUIZ: 3–5 questions, instant feedback ]
[ COMPLETE → grants XP, badge, unlocks next mission ]
```

### Interactive simulators (reused across missions)

A small library of fake-Ableton mini-apps powered by the Web Audio API:

- **Drum Pad / Drum Rack**: 4×4 pads, sample triggers, step sequencer toy.
- **Piano Roll**: click-to-place MIDI notes, playback, velocity, quantize challenge.
- **Mixer**: faders, pan, mute/solo, meters; gamified "match the target mix" levels.
- **Warp Lab**: drag warp markers on a waveform to lock a loop to grid.
- **Device Chain Builder**: drag EQ/Compressor/Reverb/Delay onto a track; toggle bypass; hear A/B.
- **Knob Trainer**: turn macros to hit a target sound (frequency-match, attack/release race).
- **Session Grid**: launch clips into scenes, learn quantization & follow actions.
- **Arrangement Timeline**: drag clips on a timeline, draw automation lanes.
- **Routing Puzzle**: connect tracks via sends/returns to solve a signal-flow puzzle.
- **MIDI Mapping Range**: map a "knob" to a parameter, set min/max.
- **Ear Training**: identify EQ cuts, compression amounts, reverb sizes (gamified).

Each simulator is a self-contained React component reused by multiple missions with different presets/targets.

### Gamification

- XP per mission + bonus for quiz perfect score and simulator targets.
- Badges (e.g. "Warp Wizard", "Sidechain Sniper", "Macro Maxxer").
- Daily streak counter.
- Per-world progress bar; unlock next world at 80% completion.
- Global leaderboard (only when logged in).
- Profile page with badges, XP, completion %, current streak.

### Pages / routes

```text
/                  Home — manifesto, "Start Mission 1", world grid
/worlds            All 6 worlds overview
/world/$slug       World page: list of missions, progress
/mission/$slug     Mission lesson (uses template)
/playground       Free-play sandbox: pick any simulator
/glossary         A–Z brutalist glossary of every Ableton term
/profile          XP, badges, streak, completed missions
/leaderboard      Top learners (login required)
/login, /signup   Optional Lovable Cloud auth
```

### Visual system

- Palette: `#000`, `#F5F1E8` off-white, `#C6FF00` acid green (primary), `#FF2E88` hot pink, `#2962FF` electric blue. Black borders 2–4px everywhere.
- Type: oversized mono headlines (e.g. JetBrains Mono / Space Mono), tight tracking, ALL CAPS labels; body in clean grotesk.
- Motion: marquee tickers, hard cuts, glitch hover, no soft fades; cursor changes to crosshair over interactive zones.
- Layout: hard-edged grid, asymmetric blocks, swatch-color backgrounds for each world.

### Data model (Lovable Cloud, optional login)

- `profiles` — user, display name, xp, streak.
- `mission_progress` — user_id, mission_slug, status, score, completed_at.
- `badges_earned` — user_id, badge_slug, earned_at.
- `user_roles` table per security best-practice (admin badge mgmt later).
- RLS on all; anonymous users use localStorage with a "sync to account" CTA.

### Technical notes

- TanStack Start file routes; one mission template route `/mission/$slug` with content driven by a typed mission registry (TS file per world).
- Web Audio API for all sound; small WAV/MP3 samples in `public/audio/`.
- All simulators are framework-agnostic React components in `src/components/sims/`.
- Manual content distilled into JSON: `src/content/missions/*.ts` — title, summary, explainer blocks, sim preset, quiz questions, XP, badges. I'll seed the full ~60 missions from the uploaded PDF.
- Optional auth via Lovable Cloud; same UI works signed-out via local progress store.

### Build phases (each shippable)

1. **Foundations**: routing, brutalist design system, sidebar, home, world grid, mission template shell, local progress store.
2. **Core simulators**: Drum Pad, Piano Roll, Mixer, Device Chain, Warp Lab + Web Audio engine.
3. **World 1–3 missions**: ~25 missions wired with explainers, sims, quizzes, XP/badges.
4. **World 4–6 missions + remaining sims**: Routing Puzzle, Ear Training, Knob Trainer, MIDI Map, Arrangement.
5. **Cloud + profile + leaderboard**: optional login, sync, badges page.
6. **Polish**: glossary, playground, motion pass, audio QA, accessibility.

We'll do phase 1 first after you approve, then iterate.
