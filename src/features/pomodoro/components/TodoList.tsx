import type { FormEvent } from "react";
import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  items: TodoItem[];
  expanded: boolean;
  adding: boolean;
  draft: string;
  onAdd: (text: string) => void;
  onToggle: (id: number) => void;
  onExpandedChange: (expanded: boolean) => void;
  onAddingChange: (adding: boolean) => void;
  onDraftChange: (draft: string) => void;
}

export function TodoList({
  items,
  expanded,
  adding,
  draft,
  onAdd,
  onToggle,
  onExpandedChange,
  onAddingChange,
  onDraftChange,
}: TodoListProps) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onAdd(text);
    onDraftChange("");
    onAddingChange(false);
  };

  return (
    <aside
      className={`fixed bottom-4 left-0 z-30 flex items-center transition-transform duration-300 ease-out md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${
        expanded ? "translate-x-0" : "-translate-x-[calc(100%-2.5rem)]"
      }`}
      aria-label="Todo list"
    >
      <div className="glass-surface w-[min(18rem,calc(100vw-3.5rem))] rounded-r-lg border border-l-0 border-glass-border px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">Tasks</h2>
          <button
            type="button"
            aria-label="Add task"
            title="Add task"
            onClick={() => onAddingChange(true)}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus size={17} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="peer sr-only"
              />
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-sm border border-muted-foreground/60 text-transparent transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
                <Check size={11} strokeWidth={2} />
              </span>
              <span
                className={`min-w-0 break-words text-foreground transition-opacity ${
                  item.completed ? "line-through opacity-45" : ""
                }`}
              >
                {item.text}
              </span>
            </label>
          ))}
        </div>

        {adding && (
          <form onSubmit={submit} className="mt-4">
            <input
              autoFocus
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              onBlur={() => {
                if (!draft.trim()) onAddingChange(false);
              }}
              aria-label="New task"
              placeholder="New task"
              className="w-full border-0 border-b border-border bg-transparent px-0 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
            />
          </form>
        )}

        {!items.length && !adding && (
          <p className="mt-4 text-xs text-muted-foreground">No tasks yet</p>
        )}
      </div>

      <button
        type="button"
        aria-label={expanded ? "Collapse todo list" : "Expand todo list"}
        title={expanded ? "Collapse todo list" : "Expand todo list"}
        aria-expanded={expanded}
        onClick={() => onExpandedChange(!expanded)}
        className="glass-surface grid size-10 shrink-0 place-items-center rounded-r-md border border-l-0 border-glass-border text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {expanded ? (
          <ChevronLeft size={18} strokeWidth={1.5} />
        ) : (
          <ChevronRight size={18} strokeWidth={1.5} />
        )}
      </button>
    </aside>
  );
}