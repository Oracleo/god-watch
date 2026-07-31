"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Inline "Add task" input at the end of the task columns. */
export function AddTask({ onAdd }: { onAdd: (name: string, color: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#6366f1");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    setName("");
    setOpen(false);
  };

  return (
    <div className="w-36 shrink-0">
      {open ? (
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-2 shadow-sm">
          <Input
            autoFocus
            placeholder="Task name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setOpen(false);
            }}
            className="h-7 text-xs"
          />
          <div className="flex items-center gap-1">
            {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-3 w-3 rounded-full transition-transform hover:scale-125",
                    color === c && "ring-2 ring-ring ring-offset-1"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              )
            )}
          </div>
          <div className="flex gap-1">
            <Button size="sm" className="h-7 flex-1 text-xs" onClick={submit}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="flex h-10 w-full items-center gap-2 rounded-xl border-dashed text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      )}
    </div>
  );
}

