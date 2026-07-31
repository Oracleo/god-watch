"use client";

import * as React from "react";
import { StickyNote, Loader2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  date: string;
  initialContent: string;
  onSave: (date: string, content: string) => Promise<void>;
}

/** Autosave notes for the selected date. */
export function NotesPanel({ date, initialContent, onSave }: NotesPanelProps) {
  const [content, setContent] = React.useState(initialContent);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when switching dates
  React.useEffect(() => {
    setContent(initialContent);
    setSaved(false);
  }, [date, initialContent]);

  const handleChange = (value: string) => {
    setContent(value);
    setSaving(true);
    setSaved(false);

    // Debounce autosave
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        await onSave(date, value);
        setSaved(true);
      } catch {
        // Keep text, show unsaved state
        setSaved(false);
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const dateLabel = new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <StickyNote className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold">Notes · {dateLabel}</h3>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            saved ? "text-success" : "text-muted-foreground"
          )}
        >
          {saving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <Check className="h-3 w-3" />
              Saved
            </>
          ) : (
            "Type to add a note"
          )}
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write a note for this day… (autosaves)"
        className="min-h-[72px] resize-none text-sm"
        aria-label={`Notes for ${dateLabel}`}
      />
    </div>
  );
}

