interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Controls({ isRunning, onStart, onPause, onReset }: ControlsProps) {
  return (
    <div className="mt-10 flex items-center gap-4">
      <button
        type="button"
        onClick={isRunning ? onPause : onStart}
        className="rounded-full glass-soft-edge bg-primary px-10 py-3 text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full px-6 py-3 text-sm text-white transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Reset
      </button>
    </div>
  );
}
