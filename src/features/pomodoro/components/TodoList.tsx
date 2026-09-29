import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export const TODOS_STORAGE_KEY = "zen_timer_todos";

export function isValidTodoItem(item: unknown): item is TodoItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as TodoItem).id === "number" &&
    typeof (item as TodoItem).text === "string" &&
    typeof (item as TodoItem).completed === "boolean"
  );
}

export function loadStoredTodos(key: string = TODOS_STORAGE_KEY): TodoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidTodoItem);
    }
  } catch (error) {
    console.error("Failed to load todos from localStorage:", error);
  }
  return [];
}

export function saveStoredTodos(
  todos: TodoItem[],
  key: string = TODOS_STORAGE_KEY,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos to localStorage:", error);
  }
}

export interface TodoListProps {
  items?: TodoItem[];
  expanded?: boolean;
  adding?: boolean;
  draft?: string;
  onAdd?: (text: string) => void;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
  onExpandedChange?: (expanded: boolean) => void;
  onAddingChange?: (adding: boolean) => void;
  onDraftChange?: (draft: string) => void;
  storageKey?: string;
}

export function TodoList({
  items: externalItems,
  expanded: externalExpanded,
  adding: externalAdding,
  draft: externalDraft,
  onAdd: externalOnAdd,
  onToggle: externalOnToggle,
  onDelete: externalOnDelete,
  onExpandedChange: externalOnExpandedChange,
  onAddingChange: externalOnAddingChange,
  onDraftChange: externalOnDraftChange,
  storageKey = TODOS_STORAGE_KEY,
}: TodoListProps = {}) {
  const [internalItems, setInternalItems] = useState<TodoItem[]>(() =>
    externalItems === undefined ? loadStoredTodos(storageKey) : [],
  );

  useEffect(() => {
    if (externalItems === undefined) {
      saveStoredTodos(internalItems, storageKey);
    }
  }, [internalItems, externalItems, storageKey]);

  useEffect(() => {
    if (externalItems !== undefined) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setInternalItems(loadStoredTodos(storageKey));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [externalItems, storageKey]);

  const items = externalItems ?? internalItems;

  const onAdd =
    externalOnAdd ??
    ((text: string) => {
      setInternalItems((curr) => [
        ...curr,
        { id: Date.now(), text, completed: false },
      ]);
    });

  const onToggle =
    externalOnToggle ??
    ((id: number) => {
      setInternalItems((curr) =>
        curr.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item,
        ),
      );
    });

  const onDelete =
    externalOnDelete ??
    ((id: number) => {
      setInternalItems((curr) => curr.filter((item) => item.id !== id));
    });

  const [internalExpanded, setInternalExpanded] = useState(false);
  const [internalAdding, setInternalAdding] = useState(false);
  const [internalDraft, setInternalDraft] = useState("");

  const expanded = externalExpanded ?? internalExpanded;
  const onExpandedChange = externalOnExpandedChange ?? setInternalExpanded;
  const adding = externalAdding ?? internalAdding;
  const onAddingChange = externalOnAddingChange ?? setInternalAdding;
  const draft = externalDraft ?? internalDraft;
  const onDraftChange = externalOnDraftChange ?? setInternalDraft;

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
      <div className="glass-surface dark:bg-background/50 w-[min(24rem,calc(100vw-3.5rem))] rounded-r-lg  border-glass-border px-6 py-5 shadow-sm">
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
            <div key={item.id} className="group flex items-start gap-2 text-sm">
              <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
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
              <button
                type="button"
                aria-label={`Remove task: ${item.text}`}
                title="Remove task"
                onClick={() => onDelete(item.id)}
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground opacity-40 transition-opacity hover:bg-accent hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
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
              className="w-full border-0 border-b-1  bg-transparent px-0 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-white"
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
        className="glass-surface grid size-10 shrink-0 place-items-center rounded-r-md  border-glass-border text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
