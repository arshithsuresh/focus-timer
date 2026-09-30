import type { Phase, PomodoroSettings } from "./types";

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 45,
  shortBreakMinutes: 8,
  longBreakMinutes: 15,
  backgroundUrl: "",
  longBreakInterval: 4,
  showNotesAndTasks: true,
  youtubeUrl: "",
};

export const PHASE_LABELS: Record<Phase, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};

export const MIN_MINUTES = 1;
export const MAX_MINUTES = 120;
