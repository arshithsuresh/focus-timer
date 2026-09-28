import { PHASE_LABELS } from "../constants";
import type { Phase } from "../types";

interface TimerDisplayProps {
  phase: Phase;
  secondsRemaining: number;
  totalSeconds: number;
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const RADIUS = 150;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerDisplay({ phase, secondsRemaining, totalSeconds }: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? 1 - secondsRemaining / totalSeconds : 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="340" height="340" viewBox="0 0 340 340" className="-rotate-90" aria-hidden="true">
        <circle
          cx="170"
          cy="170"
          r={RADIUS}
          fill="none"
          strokeWidth="8"
          className="stroke-border"
        />
        <circle
          cx="170"
          cy="170"
          r={RADIUS}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className="stroke-foreground transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {PHASE_LABELS[phase]}
        </p>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="mt-4 text-7xl font-medium tabular-nums tracking-tight text-foreground sm:text-8xl"
        >
          {formatClock(secondsRemaining)}
        </p>
      </div>
    </div>
  );
}
