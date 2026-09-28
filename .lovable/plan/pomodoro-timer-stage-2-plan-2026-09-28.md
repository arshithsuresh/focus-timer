# Pomodoro Timer — Stage 2 Plan

## Goal
Extend the existing timer with theme controls, custom image/video backgrounds, and a collapsible todo list while keeping the countdown, phase transitions, settings validation, and audio chime behavior unchanged.

## User experience
- Add a compact top-right control area with the existing settings action and a new sun/moon theme toggle.
- Place the centered timer inside a restrained frosted-glass surface that remains readable in light mode, dark mode, and over custom media.
- Add a fixed left-center todo panel with an edge-mounted chevron. Expanding it overlays the page rather than moving the timer.
- Keep the todo treatment lightweight: title, text-only rows with custom checkboxes, struck-through completed tasks, and a subtle plus action that reveals a borderless Enter-to-add input.
- On narrow screens, keep the timer centered while allowing the todo panel to overlay safely within the viewport.

## Modular implementation
- `ThemeToggle.tsx`: accessible sun/moon icon control that toggles the existing `.dark` token theme.
- `BackgroundManager.tsx`: render a full-screen image or muted looping video behind the app. Determine video media from common video URL extensions while tolerating query strings; all other URLs render as images.
- `TodoList.tsx`: own todo presentation and interactions, receiving React-managed items and callbacks.
- Extend timer settings with `backgroundUrl`, retaining the current duration fields and validation behavior.
- Compose theme state, background rendering, todo state, and existing Pomodoro components in the home page without changing `usePomodoro` or `playChime`.

## Styling and accessibility
- Extend semantic light/dark tokens with reusable glass-surface roles; use Tailwind utilities and standard `backdrop-filter` behavior.
- Keep media cover-sized and non-interactive beneath the application, with a subtle theme-aware wash for contrast.
- Give icon-only controls labels and tooltips, preserve keyboard focus states, and keep the todo input and checkboxes keyboard accessible.
- Use React state only for theme, background preference, and todos; no persistence or backend is added.

## Project structure and verification
- Record the new presentation-module boundary in `AGENTS.md`.
- Preserve the existing route metadata and add no new routes.
- Verify the build, inspect the finished page in a browser at desktop and narrow widths, and test theme toggling, image/video switching, settings save/cancel, todo add/complete/collapse, and the unchanged timer controls.
