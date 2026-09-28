import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SETTINGS, MAX_MINUTES, MIN_MINUTES } from "./constants";
import { playChime } from "./playChime";
import type { Phase, PomodoroSettings } from "./types";

export function clampMinutes(value: number): number {
  if (!Number.isFinite(value)) return MIN_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
}

export function clampSettings(settings: PomodoroSettings): PomodoroSettings {
  return {
    ...settings,
    focusMinutes: clampMinutes(settings.focusMinutes),
    shortBreakMinutes: clampMinutes(settings.shortBreakMinutes),
    longBreakMinutes: clampMinutes(settings.longBreakMinutes),
  };
}

export function durationFor(phase: Phase, settings: PomodoroSettings): number {
  const minutes =
    phase === "focus"
      ? settings.focusMinutes
      : phase === "short"
        ? settings.shortBreakMinutes
        : settings.longBreakMinutes;
  return minutes * 60;
}

/**
 * All Pomodoro state and timer logic lives here so the UI components stay
 * presentational. The countdown derives remaining time from a deadline
 * timestamp, so tab throttling never slows the clock.
 */
export function usePomodoro() {
  const [phase, setPhase] = useState<Phase>("focus");
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    durationFor("focus", DEFAULT_SETTINGS),
  );

  const phaseRef = useRef(phase);
  const settingsRef = useRef(settings);
  const completedRef = useRef(completedFocusSessions);
  const secondsRef = useRef(secondsRemaining);
  const isRunningRef = useRef(isRunning);
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
    settingsRef.current = settings;
    completedRef.current = completedFocusSessions;
    secondsRef.current = secondsRemaining;
    isRunningRef.current = isRunning;
  }, [phase, settings, completedFocusSessions, secondsRemaining, isRunning]);

  const advancePhase = useCallback(() => {
    const prev = phaseRef.current;
    const nextCompleted =
      prev === "focus" ? completedRef.current + 1 : completedRef.current;
    const next: Phase =
      prev === "focus"
        ? nextCompleted % settingsRef.current.longBreakInterval === 0
          ? "long"
          : "short"
        : "focus";
    setCompletedFocusSessions(nextCompleted);
    setPhase(next);
    setSecondsRemaining(durationFor(next, settingsRef.current));
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (deadlineRef.current === null) {
      deadlineRef.current = Date.now() + secondsRef.current * 1000;
    }
    const id = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil(((deadlineRef.current ?? 0) - Date.now()) / 1000),
      );
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        deadlineRef.current = null;
        setIsRunning(false);
        playChime();
        advancePhase();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [isRunning, advancePhase]);

  const start = useCallback(() => {
    if (secondsRef.current <= 0) {
      setSecondsRemaining(durationFor(phaseRef.current, settingsRef.current));
    }
    deadlineRef.current = Date.now() + secondsRef.current * 1000;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    deadlineRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setIsRunning(false);
    setSecondsRemaining(durationFor(phaseRef.current, settingsRef.current));
  }, []);

  const updateSettings = useCallback((next: PomodoroSettings) => {
    const clamped = clampSettings(next);
    setSettings(clamped);
    if (!isRunningRef.current) {
      setSecondsRemaining(durationFor(phaseRef.current, clamped));
    }
  }, []);

  return {
    phase,
    settings,
    completedFocusSessions,
    secondsRemaining,
    totalSeconds: durationFor(phase, settings),
    isRunning,
    start,
    pause,
    reset,
    updateSettings,
  };
}
