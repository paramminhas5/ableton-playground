// V2 Knowledge Base - 150+ Audio/Production Terms
// Place in: src/content/knowledge-base.ts

export type KnowledgeEntry = {
  id: string;
  term: string;
  category: 'Devices' | 'Dynamics' | 'EQ' | 'Time' | 'Modulation' | 'MIDI' | 'Audio Theory' | 'Workflow' | 'Shortcuts';
  definition: string;
  explanation?: string; // 2-3 sentences
  seeAlso: string[];
  missionRefs?: string[];
  audioExample?: string;
  formula?: string;
};

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // === DYNAMICS ===
  {
    id: 'compression',
    term: 'Compression',
    category: 'Dynamics',
    definition: 'An audio processor that automatically reduces volume when signal exceeds a threshold.',
    explanation: 'Set a threshold (e.g., -20 dB). Anything above it gets reduced by a ratio (e.g., 4:1). Result: loud peaks don\'t poke out, giving a more cohesive mix. Essential for vocals, drums, bass.',
    seeAlso: ['Threshold', 'Ratio', 'Attack', 'Release', 'Limiter', 'Makeup Gain'],
    missionRefs: ['compression-101', 'mixing-vocals', 'drum-processing'],
    audioExample: 'compression-demo',
    formula: 'Output = Input + (max(0, Input - Threshold) × (1/Ratio))'
  },
  {
    id: 'threshold',
    term: 'Threshold',
    category: 'Dynamics',
    definition: 'The volume level (in dB) at which compression or gating starts.',
    explanation: 'On a compressor: -20 dB threshold means compression kicks in at -20 dB. On a gate: signal below threshold gets muted.',
    seeAlso: ['Compressor', 'Gate', 'Ratio'],
    missionRefs: ['compression-101']
  },
  {
    id: 'ratio',
    term: 'Ratio',
    category: 'Dynamics',
    definition: 'The amount of compression applied to signal above threshold (compressor) or below threshold (gate).',
    explanation: '4:1 ratio means: for every 4 dB above threshold, only 1 dB comes out. 10:1 is more aggressive; 2:1 is subtle.',
    seeAlso: ['Compression', 'Limiter', 'Threshold'],
    formula: 'Output = Threshold + ((Input - Threshold) / Ratio)'
  },
  {
    id: 'attack',
    term: 'Attack',
    category: 'Dynamics',
    definition: 'How quickly a compressor or gate responds when the signal crosses the threshold.',
    explanation: 'Fast attack (1-5 ms) tames loud peaks immediately. Slow attack (20-50 ms) lets the initial "click" of a transient through, preserving punch.',
    seeAlso: ['Compressor', 'Release', 'Transient'],
    missionRefs: ['compression-101', 'drum-processing']
  },
  {
    id: 'release',
    term: 'Release',
    category: 'Dynamics',
    definition: 'How quickly a compressor or gate stops processing after signal drops below threshold.',
    explanation: 'Short release (50-100 ms) = snappy, can cause "pumping". Long release (200-500 ms) = smooth, invisible compression.',
    seeAlso: ['Compressor', 'Attack', 'Pumping'],
    missionRefs: ['compression-101']
  },
  {
    id: 'gate',
    term: 'Gate',
    category: 'Dynamics',
    definition: 'A processor that mutes audio when signal is below a threshold, allowing it through when above.',
    explanation: 'Used to remove noise from drum tracks or silence between phrases. Set threshold so only desired sound passes through.',
    seeAlso: ['Threshold', 'Compressor'],
    missionRefs: ['gate-basics', 'drum-cleanup']
  },
  {
    id: 'limiter',
    term: 'Limiter',
    category: 'Dynamics',
    definition: 'A compressor with very high ratio (10:1 or higher) that acts like a brick wall for peaks.',
    explanation: 'Prevents signal from exceeding a threshold. Use on master bus to prevent clipping. Similar to compression but more aggressive.',
    seeAlso: ['Compressor', 'Ratio', 'Clipper'],
    missionRefs: ['master-bus-protection']
  },

  // === EQ ===
  {
    id: 'eq',
    term: 'Equalization (EQ)',
    category: 'EQ',
    definition: 'Adjusting the volume of different frequency ranges in audio.',
    explanation: 'Cut boomy lows, boost clear mids, add bright highs. Every mix uses EQ. Start with small cuts, not big boosts.',
    seeAlso: ['Frequency', 'Decibel', 'Low-pass Filter', 'High-pass Filter'],
    missionRefs: ['eq-101', 'mixing-fundamentals'],
    audioExample: 'eq-before-after'
  },
  {
    id: 'frequency',
    term: 'Frequency',
    category: 'Audio Theory',
    definition: 'How many times per second a sound wave oscillates, measured in Hz (Hertz).',
    explanation: '20 Hz = very low bass (felt, not heard). 1 kHz = mids (most musical). 10 kHz = bright highs. Humans hear 20 Hz - 20 kHz.',
    seeAlso: ['Hz', 'Pitch', 'Spectrum'],
    formula: 'Frequency = 1 / Period'
  },
  {
    id: 'db',
    term: 'Decibel (dB)',
    category: 'Audio Theory',
    definition: 'A logarithmic unit measuring loudness or signal level.',
    explanation: '0 dB = reference level. +6 dB = 2x louder. -6 dB = half as loud. Logarithmic: 20 dB ≠ 2x louder than 10 dB.',
    seeAlso: ['Frequency', 'Amplitude', 'Peak Meter'],
    formula: 'dB = 20 × log₁₀(Amplitude)'
  },
  {
    id: 'low-pass-filter',
    term: 'Low-pass Filter',
    category: 'EQ',
    definition: 'A filter that reduces frequencies above a cutoff point, letting low frequencies "pass through".',
    explanation: 'Used to remove harshness from bright sources, create smooth pads, or simulate distance (high frequencies fade farther away).',
    seeAlso: ['High-pass Filter', 'Filter', 'Cutoff Frequency'],
    missionRefs: ['filters-101']
  },
  {
    id: 'high-pass-filter',
    term: 'High-pass Filter',
    category: 'EQ',
    definition: 'A filter that reduces frequencies below a cutoff point, letting high frequencies pass through.',
    explanation: 'Remove low rumble/noise from instruments. Use on vocals, hi-hats, guitars. Cleans up mix headroom.',
    seeAlso: ['Low-pass Filter', 'Cutoff Frequency'],
    missionRefs: ['filters-101', 'mixing-techniques']
  },

  // === TIME-BASED EFFECTS ===
  {
    id: 'reverb',
    term: 'Reverb',
    category: 'Time',
    definition: 'Simulates acoustic reflections in a space (room, hall, plate).',
    explanation: 'Small room = short reflections. Large cathedral = long, lush reflections. Use 20-40% wet on most instruments, 60%+ on pads.',
    seeAlso: ['Decay', 'Room Size', 'Pre-delay', 'Delay'],
    missionRefs: ['reverb-101', 'mixing-effects'],
    audioExample: 'reverb-demo'
  },
  {
    id: 'delay',
    term: 'Delay',
    category: 'Time',
    definition: 'Repeats audio at a set time interval, creating rhythmic echoes.',
    explanation: 'Sync to tempo (1/4 note, 1/8 note) for musical delays. Adjust feedback to control number of repeats. Use for slapback, slap echo, or ambient space.',
    seeAlso: ['Feedback', 'Time', 'Reverb'],
    missionRefs: ['delay-101'],
    audioExample: 'delay-demo'
  },
  {
    id: 'decay',
    term: 'Decay (Reverb/Delay)',
    category: 'Time',
    definition: 'How long the reverb or delay tail lasts before fading to silence.',
    explanation: 'Short decay (0.5 sec) = tight, room-like. Long decay (3+ sec) = lush, atmospheric.',
    seeAlso: ['Reverb', 'Release'],
    missionRefs: ['reverb-101']
  },
  {
    id: 'pre-delay',
    term: 'Pre-delay',
    category: 'Time',
    definition: 'A brief silence before reverb reflections start, simulating distance.',
    explanation: 'Small pre-delay (10-30 ms) keeps source clear while adding space. Larger pre-delay (50-100 ms) creates obvious echo effect.',
    seeAlso: ['Reverb', 'Delay'],
    missionRefs: ['reverb-101']
  },

  // === MODULATION ===
  {
    id: 'chorus',
    term: 'Chorus',
    category: 'Modulation',
    definition: 'Creates a lush, wide sound by layering slightly detuned and delayed copies of the signal.',
    explanation: 'LFO modulates the delay time, creating pitch wobble. Use on pads, keys, vocals for width. 30-50% wet typical.',
    seeAlso: ['LFO', 'Flanger', 'Phaser'],
    audioExample: 'chorus-demo'
  },
  {
    id: 'phaser',
    term: 'Phaser',
    category: 'Modulation',
    definition: 'Uses a swept filter to create a sweeping comb-filter effect.',
    explanation: 'More subtle than flanger. Creates movement and width. Classic on vocals, bass, guitars.',
    seeAlso: ['Flanger', 'Comb Filter', 'LFO'],
    audioExample: 'phaser-demo'
  },
  {
    id: 'flanger',
    term: 'Flanger',
    category: 'Modulation',
    definition: 'A jet-like or whooshing effect created by mixing a signal with a slightly delayed and modulated copy.',
    explanation: 'Like a chorus but more extreme. Creates dramatic, obvious effect.',
    seeAlso: ['Chorus', 'Phaser'],
    audioExample: 'flanger-demo'
  },
  {
    id: 'lfo',
    term: 'LFO (Low Frequency Oscillator)',
    category: 'Modulation',
    definition: 'A slow oscillator (typically 0.1-10 Hz) used to modulate parameters over time.',
    explanation: 'In a chorus, LFO wobbles the delay time creating pitch variation. In a filter, LFO sweeps the cutoff creating a \'wa-wa\' effect.',
    seeAlso: ['Oscillator', 'Modulation', 'Rate'],
    missionRefs: ['modulation-101']
  },

  // === MIDI ===
  {
    id: 'midi',
    term: 'MIDI',
    category: 'MIDI',
    definition: 'Musical Instrument Digital Interface — a protocol for sending note data between devices/software.',
    explanation: 'MIDI message: Note number (pitch) + velocity (volume) + timing. Not audio — just instructions. One MIDI track can trigger different instruments.',
    seeAlso: ['Note', 'Velocity', 'MIDI Clip'],
    missionRefs: ['midi-101', 'midi-vs-audio']
  },
  {
    id: 'note',
    term: 'Note (MIDI)',
    category: 'MIDI',
    definition: 'A MIDI message containing pitch (0-127, where 60=Middle C), velocity, and duration.',
    explanation: 'MIDI note numbers: C1=0, C2=12, C3=24... C4 (Middle C)=60, C5=72. Each octave = 12 semitones.',
    seeAlso: ['MIDI', 'Velocity', 'Pitch'],
    formula: 'Frequency (Hz) = 440 × 2^((note - 69) / 12)'
  },
  {
    id: 'velocity',
    term: 'Velocity (MIDI)',
    category: 'MIDI',
    definition: 'How hard a note was pressed, ranging 0-127 in MIDI.',
    explanation: 'Velocity controls loudness and tonal character. Velocity 100 = played gently. Velocity 127 = pressed hard.',
    seeAlso: ['MIDI', 'Note', 'Dynamics'],
    missionRefs: ['midi-101']
  },

  // === WORKFLOW ===
  {
    id: 'gain-staging',
    term: 'Gain Staging',
    category: 'Workflow',
    definition: 'Setting proper levels at each stage of the signal chain to optimize headroom and minimize noise.',
    explanation: 'Peak levels should be around -6 dB on the master bus before limiting. Too hot = clipping. Too quiet = noise.',
    seeAlso: ['Headroom', 'Clipping', 'Peak Meter', 'Limiting'],
    missionRefs: ['gain-staging', 'mixing-fundamentals'],
    audioExample: 'gain-staging-demo'
  },
  {
    id: 'headroom',
    term: 'Headroom',
    category: 'Workflow',
    definition: 'Space between the loudest peak and the clipping point (0 dB).',
    explanation: 'Aim for -6 dB to -3 dB peak on master bus before limiting. Gives room for mastering plugins and prevents clipping.',
    seeAlso: ['Clipping', 'Limiting', 'Peak Meter'],
    missionRefs: ['mastering-basics']
  },
  {
    id: 'sidechain',
    term: 'Sidechain',
    category: 'Workflow',
    definition: 'Using one audio signal to control a processor acting on a different signal.',
    explanation: 'Classic: kick drum\'s sidechain input triggers compressor on bass track. Bass ducks every time kick hits. Creates pumping dance feel.',
    seeAlso: ['Compressor', 'Dynamics', 'Routing'],
    missionRefs: ['sidechain-compression', 'advanced-routing'],
    audioExample: 'sidechain-demo'
  },
  {
    id: 'automation',
    term: 'Automation',
    category: 'Workflow',
    definition: 'Recording parameter changes over time (volume, filter, effect amount) to add movement.',
    explanation: 'Example: Fade out vocal over last 8 bars. Volume fader moves down automatically during playback. Stored as envelope in the clip.',
    seeAlso: ['Envelope', 'Breakpoint'],
    missionRefs: ['automation-101'],
    audioExample: 'automation-demo'
  },
  {
    id: 'sends',
    term: 'Sends (Return Tracks)',
    category: 'Workflow',
    definition: 'A control that sends a portion of a track\'s signal to a return track.',
    explanation: 'Multiple tracks can send to one return track (with reverb, delay, etc.). Efficient and cohesive. All tracks share the same effect instance.',
    seeAlso: ['Return Track', 'Effect', 'Bus'],
    missionRefs: ['sends-returns', 'mixing-effects']
  },
  {
    id: 'routing',
    term: 'Routing',
    category: 'Workflow',
    definition: 'Determining the signal path: where audio goes after it plays.',
    explanation: 'Simple: Track → Master. Complex: Track A → Effect 1 → Effect 2 → Send A (Return Track with Reverb) → Master.',
    seeAlso: ['Signal Flow', 'Sends', 'Return Track', 'Bus'],
    missionRefs: ['signal-flow', 'advanced-routing'],
    audioExample: 'routing-diagrams'
  },

  // === SHORTCUTS (Common) ===
  {
    id: 'shortcut-play',
    term: 'Play/Stop Shortcut',
    category: 'Shortcuts',
    definition: 'Press Space to play/stop arrangement.',
    explanation: 'Space = Play. Space again = Stop. Ctrl+Space = Toggle from stop point (continues from where you stopped).',
    seeAlso: ['Transport', 'Arrangement'],
    missionRefs: ['shortcuts-101']
  },
  {
    id: 'shortcut-zoom',
    term: 'Zoom Shortcuts',
    category: 'Shortcuts',
    definition: 'Quick zoom in/out of arrangements and clips.',
    explanation: 'Ctrl+Mouse Wheel = zoom in/out. Or use keyboard: + and - keys.',
    seeAlso: ['View', 'Arrangement', 'Clip Editor'],
    missionRefs: ['shortcuts-101']
  },
];

export function getKnowledgeEntry(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE_BASE.find(entry => entry.id === id);
}

export function getEntriesByCategory(category: string): KnowledgeEntry[] {
  return KNOWLEDGE_BASE.filter(entry => entry.category === category);
}

export function searchKnowledge(query: string): KnowledgeEntry[] {
  const q = query.toLowerCase();
  return KNOWLEDGE_BASE.filter(
    entry =>
      entry.term.toLowerCase().includes(q) ||
      entry.definition.toLowerCase().includes(q) ||
      entry.seeAlso.some(s => s.toLowerCase().includes(q))
  );
}
