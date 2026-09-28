import { useEffect, useState } from "react";
import { MAX_MINUTES, MIN_MINUTES, PHASE_LABELS } from "../constants";
import { clampSettings } from "../usePomodoro";
import type { PomodoroSettings } from "../types";

interface SettingsModalProps {
  open: boolean;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  onClose: () => void;
}

type EditableField = Extract<
  keyof PomodoroSettings,
  "focusMinutes" | "shortBreakMinutes" | "longBreakMinutes"
>;

const FIELDS: Array<{ key: EditableField; label: string }> = [
  { key: "focusMinutes", label: PHASE_LABELS.focus },
  { key: "shortBreakMinutes", label: PHASE_LABELS.short },
  { key: "longBreakMinutes", label: PHASE_LABELS.long },
];

function sanitizeDraft(draft: PomodoroSettings, current: PomodoroSettings) {
  const parse = (value: string, fallback: number) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  };
  return clampSettings({
    ...current,
    focusMinutes: parse(draft.focusMinutes as unknown as string, current.focusMinutes),
    shortBreakMinutes: parse(
      draft.shortBreakMinutes as unknown as string,
      current.shortBreakMinutes,
    ),
    longBreakMinutes: parse(
      draft.longBreakMinutes as unknown as string,
      current.longBreakMinutes,
    ),
  });
}

export function SettingsModal({
  open,
  settings,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [draft, setDraft] = useState(settings);

  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Timer settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <div className="mt-6 space-y-5">
          {FIELDS.map((field, index) => (
            <div key={field.key}>
              <label
                htmlFor={`settings-${field.key}`}
                className="text-sm text-muted-foreground"
              >
                {field.label} (minutes)
              </label>
              <input
                id={`settings-${field.key}`}
                type="number"
                inputMode="numeric"
                min={MIN_MINUTES}
                max={MAX_MINUTES}
                autoFocus={index === 0}
                value={draft[field.key]}
                onChange={(event) =>
                  setDraft({ ...draft, [field.key]: event.target.valueAsNumber })
                }
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm tabular-nums text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <div>
            <label
              htmlFor="settings-background-url"
              className="text-sm text-muted-foreground"
            >
              Custom background URL
            </label>
            <input
              id="settings-background-url"
              type="url"
              value={draft.backgroundUrl}
              onChange={(event) =>
                setDraft({ ...draft, backgroundUrl: event.target.value })
              }
              placeholder="Image or video URL"
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(sanitizeDraft(draft, settings))}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
