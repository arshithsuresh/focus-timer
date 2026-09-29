import { Plus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export interface NoteItem {
  id: number;
  text: string;
}

export const NOTES_STORAGE_KEY = "zen_timer_notes";
export const MAX_NOTES = 8;

export function isValidNoteItem(item: unknown): item is NoteItem {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof (item as NoteItem).id === "number" &&
    typeof (item as NoteItem).text === "string"
  );
}

export function loadStoredNotes(key: string = NOTES_STORAGE_KEY): NoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(isValidNoteItem).slice(0, MAX_NOTES);
    }
  } catch (error) {
    console.error("Failed to load notes from localStorage:", error);
  }
  return [];
}

export function saveStoredNotes(
  notes: NoteItem[],
  key: string = NOTES_STORAGE_KEY,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(notes.slice(0, MAX_NOTES)));
  } catch (error) {
    console.error("Failed to save notes to localStorage:", error);
  }
}

export interface NotesProps {
  items?: NoteItem[];
  adding?: boolean;
  draft?: string;
  onAdd?: (text: string) => void;
  onDelete?: (id: number) => void;
  onAddingChange?: (adding: boolean) => void;
  onDraftChange?: (draft: string) => void;
  storageKey?: string;
}

export function Notes({
  items: externalItems,
  adding: externalAdding,
  draft: externalDraft,
  onAdd: externalOnAdd,
  onDelete: externalOnDelete,
  onAddingChange: externalOnAddingChange,
  onDraftChange: externalOnDraftChange,
  storageKey = NOTES_STORAGE_KEY,
}: NotesProps = {}) {
  const [internalItems, setInternalItems] = useState<NoteItem[]>(() =>
    externalItems === undefined ? loadStoredNotes(storageKey) : [],
  );

  useEffect(() => {
    if (externalItems === undefined) {
      saveStoredNotes(internalItems, storageKey);
    }
  }, [internalItems, externalItems, storageKey]);

  useEffect(() => {
    if (externalItems !== undefined) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        setInternalItems(loadStoredNotes(storageKey));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [externalItems, storageKey]);

  const items = externalItems ?? internalItems;

  const onAdd =
    externalOnAdd ??
    ((text: string) => {
      setInternalItems((curr) => {
        if (curr.length >= MAX_NOTES) return curr;
        return [
          ...curr,
          { id: Date.now(), text },
        ];
      });
    });

  const onDelete =
    externalOnDelete ??
    ((id: number) => {
      setInternalItems((curr) => curr.filter((item) => item.id !== id));
    });

  const [internalAdding, setInternalAdding] = useState(false);
  const [internalDraft, setInternalDraft] = useState("");

  const adding = externalAdding ?? internalAdding;
  const onAddingChange = externalOnAddingChange ?? setInternalAdding;
  const draft = externalDraft ?? internalDraft;
  const onDraftChange = externalOnDraftChange ?? setInternalDraft;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || items.length >= MAX_NOTES) return;
    onAdd(text);
    onDraftChange("");
    onAddingChange(false);
  };

  return (
    <aside className="w-full max-w-xs" aria-label="Notes">
      <div className="w-full py-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">Notes</h2>
          <button
            type="button"
            aria-label={items.length >= MAX_NOTES ? "Maximum 8 notes reached" : "Add note"}
            title={items.length >= MAX_NOTES ? "Maximum 8 notes reached" : "Add note"}
            disabled={items.length >= MAX_NOTES}
            onClick={() => {
              if (items.length < MAX_NOTES) {
                onAddingChange(true);
              }
            }}
            className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              items.length >= MAX_NOTES
                ? "cursor-not-allowed opacity-30 text-muted-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Plus size={17} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="group flex items-start gap-2 text-sm">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
              <span className="min-w-0 flex-1 break-words text-foreground">
                {item.text}
              </span>
              <button
                type="button"
                aria-label={`Remove note: ${item.text}`}
                title="Remove note"
                onClick={() => onDelete(item.id)}
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground opacity-40 transition-opacity hover:bg-accent hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        {adding && items.length < MAX_NOTES && (
          <form onSubmit={submit} className="mt-4">
            <input
              autoFocus
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              onBlur={() => {
                if (!draft.trim()) onAddingChange(false);
              }}
              aria-label="New note"
              placeholder="New note"
              className="w-full border-0 border-b border-muted-foreground/40 bg-transparent px-0 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
            />
          </form>
        )}

        {!items.length && !adding && (
          <p className="mt-4 text-xs text-muted-foreground">No notes yet</p>
        )}
      </div>
    </aside>
  );
}
