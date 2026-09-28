import { BackgroundManager } from "@/features/pomodoro/components/BackgroundManager";
import { Controls } from "@/features/pomodoro/components/Controls";
import { GearIcon } from "@/features/pomodoro/components/GearIcon";
import { SettingsModal } from "@/features/pomodoro/components/SettingsModal";
import { ThemeToggle } from "@/features/pomodoro/components/ThemeToggle";
import { TimerDisplay } from "@/features/pomodoro/components/TimerDisplay";
import { TodoList, type TodoItem } from "@/features/pomodoro/components/TodoList";
import { usePomodoro } from "@/features/pomodoro/usePomodoro";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  const [todoExpanded, setTodoExpanded] = useState(false);
  const [todoAdding, setTodoAdding] = useState(false);
  const [todoDraft, setTodoDraft] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  const addTodo = (text: string) => {
    setTodos((current) => [...current, { id: nextTodoId, text, completed: false }]);
    setNextTodoId((current) => current + 1);
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 transition-colors sm:px-6">
      <BackgroundManager url={pomodoro.settings.backgroundUrl} />

      <div className="glass-surface fixed right-4 top-4 z-30 flex items-center rounded-full border border-glass-border p-1 shadow-sm sm:right-6 sm:top-6">
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((value) => !value)} />
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
        expanded={todoExpanded}
        adding={todoAdding}
        draft={todoDraft}
        onAdd={addTodo}
        onExpandedChange={setTodoExpanded}
        onAddingChange={setTodoAdding}
        onDraftChange={setTodoDraft}
        onToggle={(id) =>
          setTodos((current) =>
            current.map((item) =>
              item.id === id ? { ...item, completed: !item.completed } : item,
            ),
          )
        }
        onDelete={(id) => setTodos((current) => current.filter((item) => item.id !== id))}
      />

      <main className="relative z-10 flex flex-col items-center rounded-2xl px-3 py-8 sm:px-10 sm:py-10">
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
