import { BackgroundManager } from "@/features/pomodoro/components/BackgroundManager";
import { Controls } from "@/features/pomodoro/components/Controls";
import { GearIcon } from "@/features/pomodoro/components/GearIcon";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/features/pomodoro/components/MusicPlayer";
import {
  loadStoredNotes,
  MAX_NOTES,
  Notes,
  NOTES_STORAGE_KEY,
  saveStoredNotes,
  type NoteItem,
} from "@/features/pomodoro/components/Notes";
import { SettingsModal } from "@/features/pomodoro/components/SettingsModal";
import { ThemeToggle } from "@/features/pomodoro/components/ThemeToggle";
import { TimerDisplay } from "@/features/pomodoro/components/TimerDisplay";
import {
  loadStoredTodos,
  MAX_TODOS,
  saveStoredTodos,
  TodoList,
  TODOS_STORAGE_KEY,
  type TodoItem,
} from "@/features/pomodoro/components/TodoList";
import { usePomodoro } from "@/features/pomodoro/usePomodoro";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const pomodoro = usePomodoro();
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Todo list state
  const [todos, setTodos] = useState<TodoItem[]>(() => loadStoredTodos());
  const [todoAdding, setTodoAdding] = useState(false);
  const [todoDraft, setTodoDraft] = useState("");

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => loadStoredNotes());
  const [noteAdding, setNoteAdding] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const handleStart = () => {
    pomodoro.start();
    musicPlayerRef.current?.play();
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    return () => document.documentElement.classList.remove("dark");
  }, [isDark]);

  // Persist todos to localStorage
  useEffect(() => {
    saveStoredTodos(todos);
  }, [todos]);

  useEffect(() => {
    const handleTodosStorage = (event: StorageEvent) => {
      if (event.key === TODOS_STORAGE_KEY) {
        setTodos(loadStoredTodos());
      }
    };
    window.addEventListener("storage", handleTodosStorage);
    return () => window.removeEventListener("storage", handleTodosStorage);
  }, []);

  // Persist notes to localStorage
  useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  useEffect(() => {
    const handleNotesStorage = (event: StorageEvent) => {
      if (event.key === NOTES_STORAGE_KEY) {
        setNotes(loadStoredNotes());
      }
    };
    window.addEventListener("storage", handleNotesStorage);
    return () => window.removeEventListener("storage", handleNotesStorage);
  }, []);

  const addTodo = (text: string) => {
    setTodos((current) => {
      if (current.length >= MAX_TODOS) return current;
      return [...current, { id: Date.now(), text, completed: false }];
    });
  };

  const addNote = (text: string) => {
    setNotes((current) => {
      if (current.length >= MAX_NOTES) return current;
      return [...current, { id: Date.now(), text }];
    });
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

      {pomodoro.settings.showNotesAndTasks ? (
        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center gap-10 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 xl:gap-12">
          {/* Left side: Notes */}
          <div className="order-2 w-full max-w-xs justify-self-center lg:order-1 lg:justify-self-end">
            <Notes
              items={notes}
              adding={noteAdding}
              draft={noteDraft}
              onAdd={addNote}
              onAddingChange={setNoteAdding}
              onDraftChange={setNoteDraft}
              onDelete={(id) => setNotes((current) => current.filter((item) => item.id !== id))}
            />
          </div>

          {/* Center: Timer */}
          <main className="order-1 flex flex-col items-center rounded-2xl px-3 py-8 sm:px-10 sm:py-10 lg:order-2">
            <TimerDisplay
              phase={pomodoro.phase}
              secondsRemaining={pomodoro.secondsRemaining}
              totalSeconds={pomodoro.totalSeconds}
            />
            <Controls
              isRunning={pomodoro.isRunning}
              onStart={handleStart}
              onPause={pomodoro.pause}
              onReset={pomodoro.reset}
            />
          </main>

          {/* Right side: TodoList */}
          <div className="order-3 w-full max-w-xs justify-self-center lg:order-3 lg:justify-self-start">
            <TodoList
              items={todos}
              adding={todoAdding}
              draft={todoDraft}
              onAdd={addTodo}
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
          </div>
        </div>
      ) : (
        <main className="relative z-10 flex flex-col items-center rounded-2xl px-3 py-8 sm:px-10 sm:py-10">
          <TimerDisplay
            phase={pomodoro.phase}
            secondsRemaining={pomodoro.secondsRemaining}
            totalSeconds={pomodoro.totalSeconds}
          />
          <Controls
            isRunning={pomodoro.isRunning}
            onStart={handleStart}
            onPause={pomodoro.pause}
            onReset={pomodoro.reset}
          />
        </main>
      )}

      <MusicPlayer
        ref={musicPlayerRef}
        url={pomodoro.settings.youtubeUrl}
        onOpenSettings={() => setSettingsOpen(true)}
      />

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
