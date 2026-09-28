import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePomodoro } from "@/features/pomodoro/usePomodoro";
import { TimerDisplay } from "@/features/pomodoro/components/TimerDisplay";
import { Controls } from "@/features/pomodoro/components/Controls";
import { SettingsModal } from "@/features/pomodoro/components/SettingsModal";
import { GearIcon } from "@/features/pomodoro/components/GearIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pomodoro — Minimal Focus Timer" },
      {
        name: "description",
        content:
          "A minimalist Pomodoro timer: focus sessions with short and long breaks, gentle chimes, and automatic phase switching.",
      },
      { property: "og:title", content: "Pomodoro — Minimal Focus Timer" },
      {
        property: "og:description",
        content:
          "A minimalist Pomodoro timer for focused work — focus, short breaks, and long breaks with automatic switching.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const pomodoro = usePomodoro();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <button
        type="button"
        aria-label="Open settings"
        onClick={() => setSettingsOpen(true)}
        className="absolute right-6 top-6 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <GearIcon />
      </button>

      <main className="flex flex-col items-center">
        <TimerDisplay
          phase={pomodoro.phase}
          secondsRemaining={pomodoro.secondsRemaining}
          totalSeconds={pomodoro.totalSeconds}
        />
        <Controls
          isRunning={pomodoro.isRunning}
          onStart={pomodoro.start}
          onPause={pomodoro.pause}
          onReset={pomodoro.reset}
        />
      </main>

      <SettingsModal
        open={settingsOpen}
        settings={pomodoro.settings}
        onSave={(next) => {
          pomodoro.updateSettings(next);
          setSettingsOpen(false);
        }}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
