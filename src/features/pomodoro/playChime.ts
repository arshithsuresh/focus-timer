let ctx: AudioContext | null = null;

/**
 * Plays a soft two-note bell chime via the Web Audio API (standard HTML5
 * audio). Safe to call anywhere: failures are swallowed so a blocked audio
 * context never breaks the timer.
 */
export function playChime() {
  try {
    const AudioContextCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextCtor) return;

    ctx ??= new AudioContextCtor();
    if (ctx.state === "suspended") void ctx.resume();

    const start = ctx.currentTime + 0.05;
    // A5 then E6 — a gentle, rising two-note bell.
    const notes: Array<{ freq: number; at: number; peak: number }> = [
      { freq: 880, at: 0, peak: 0.2 },
      { freq: 1318.51, at: 0.18, peak: 0.16 },
    ];

    for (const note of notes) {
      const t0 = start + note.at;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = note.freq;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(note.peak, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 1.2);
    }
  } catch {
    // Audio unavailable (e.g. no user interaction yet) — ignore.
  }
}
