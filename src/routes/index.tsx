import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePomodoro } from "@/features/pomodoro/usePomodoro";
import { BackgroundManager } from "@/features/pomodoro/components/BackgroundManager";
import { TimerDisplay } from "@/features/pomodoro/components/TimerDisplay";
import { Controls } from "@/features/pomodoro/components/Controls";
import { SettingsModal } from "@/features/pomodoro/components/SettingsModal";
import { GearIcon } from "@/features/pomodoro/components/GearIcon";
import { ThemeToggle } from "@/features/pomodoro/components/ThemeToggle";
import {
  TodoList,
  type TodoItem,
} from "@/features/pomodoro/components/TodoList";

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
  const [isDark, setIsDark] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [nextTodoId, setNextTodoId] = useState(1);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  const addTodo = (text: string) => {
    setTodos((current) => [
      ...current,
      { id: nextTodoId, text, completed: false },
    ]);
    setNextTodoId((current) => current + 1);
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 transition-colors sm:px-6">
      <BackgroundManager url={pomodoro.settings.backgroundUrl} />

      <div className="glass-surface fixed right-4 top-4 z-30 flex items-center rounded-full border border-glass-border p-1 shadow-sm sm:right-6 sm:top-6">
        <ThemeToggle
          isDark={isDark}
          onToggle={() => setIsDark((value) => !value)}
        />
        <button
          type="button"
          aria-label="Open settings"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <GearIcon />
        </button>
      </div>

      <TodoList
        items={todos}
        onAdd={addTodo}
        onToggle={(id) =>
          setTodos((current) =>
            current.map((item) =>
              item.id === id ? { ...item, completed: !item.completed } : item,
            ),
          )
        }
      />

      <main className="glass-surface relative z-10 flex flex-col items-center rounded-lg border border-glass-border px-3 py-8 shadow-sm sm:px-10 sm:py-10">
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
