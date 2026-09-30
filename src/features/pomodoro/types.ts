export type Phase = "focus" | "short" | "long";

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  backgroundUrl: string;
  /** Number of completed focus sessions before a long break. */
  longBreakInterval: number;
  showNotesAndTasks: boolean;
  youtubeUrl: string;
}
