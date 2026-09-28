# Pomodoro Timer — Implementation Plan

## Overview
A minimalist Pomodoro web app at `/` with a centered timer, Start/Pause/Reset controls, a settings modal for durations, and an audio chime with automatic phase advance. Built as a modular feature so future additions (task lists, session stats, long-break rules) plug in cleanly.

## Design direction
- Ultra-minimalist: centered single container, generous whitespace, no decorative chrome.
- Monochromatic muted palette: near-white background, soft gray text, one near-black ink accent for the active state. All colors as semantic tokens in `src/styles.css` (oklch), light mode only.
- Typography: one modern sans-serif (Space Grotesk) loaded via `<link>` in `src/routes/__root.tsx` head — never `@import` in styles.css. Huge tabular-numeral clock (MM:SS).
- Dark-friendly tokens kept in sync so dark mode works if enabled later.

## File structure (new module: `src/features/pomodoro/`)
```text
src/features/pomodoro/
  types.ts            # Phase, PomodoroSettings types
  constants.ts        # Default settings (25/5/15), phase labels, long-break interval
  usePomodoro.ts      # All timer state + logic (custom hook)
  playChime.ts        # Audio chime helper
  components/
    TimerDisplay.tsx  # Phase label + MM:SS clock + progress ring/bar
    Controls.tsx      # Start / Pause / Reset buttons
    SettingsModal.tsx # Gear-triggered modal with duration inputs + Save
src/routes/index.tsx   # Page: composes the above, unique head() metadata
src/routes/__root.tsx  # Font <link> added to head
src/styles.css         # New semantic tokens
```

## Timer logic (`usePomodoro.ts`)
- State: `phase` (focus | short | long), `secondsRemaining`, `isRunning`, `settings`, `completedFocusSessions`.
- Drift-free countdown: when running, store a `deadline` timestamp and tick with a 250 ms interval that recomputes remaining time from `Date.now()`; tab throttling can't slow the clock.
- At zero: play chime, stop, and advance phase — focus → short break (long break after every 4th focus), break → focus. New phase waits for "Start".
- Actions: `start`, `pause`, `reset` (back to current phase's full duration), `updateSettings` (applies durations; if idle, resets the current phase to its new duration).
- Settings live in React state only (per spec); durations clamped to 1–120 minutes.

## Audio chime (`playChime.ts`)
- Synthesized with the Web Audio API (two-note soft bell, short decay) — no asset file needed, plays on zero without any user-audio issues since it fires from the click-initiated session. Web Audio is the modern standard for HTML5 audio playback.

## UI composition
- `index.tsx`: gear button (top-right of the container) → `SettingsModal`; centered `TimerDisplay` above `Controls`.
- `SettingsModal`: accessible dialog (Escape closes, backdrop click closes, focus trap), three number inputs (Focus / Short Break / Long Break), Save applies and closes, Cancel discards.
- Subtle progress indication (thin ring or bar) around/above the clock showing phase completion.

## Metadata
- `index.tsx` gets its own `head()`: unique title ("Pomodoro — Minimal Focus Timer"), description, og:title, og:description, og:type, twitter:card. No og:image (no absolute hero image).

## Verification
- Build passes (check `/tmp/observability/build-errors.log`).
- Browser check via Playwright: timer counts down, phase transitions at zero, chime scheduling, settings modal save/cancel, keyboard Escape.
