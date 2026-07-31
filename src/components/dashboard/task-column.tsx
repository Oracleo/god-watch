"use client";

import * as React from "react";
import { Pencil, Trash2, Archive, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { TaskDTO } from "@/types";

interface TaskColumnProps {
  task: TaskDTO;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
  children: React.ReactNode;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  dragging: boolean;
}

/** Task column header with management controls. Native HTML5 drag-and-drop. */
export function TaskColumn({
  task,
  onRename,
  onDelete,
  onArchive,
  onColorChange,
  children,
  onDragStart,
  onDragOver,
  onDrop,
  dragging,
}: TaskColumnProps) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(task.name);

  const commitRename = () => {
    setEditing(false);
    const trimmed = name.trim();
    if (trimmed && trimmed !== task.name) {
      onRename(task.id, trimmed);
    } else {
      setName(task.name);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      className={cn(
        "flex w-36 shrink-0 flex-col gap-1 rounded-xl border bg-card p-2 shadow-sm transition-shadow hover:shadow-md",
        dragging && "opacity-50"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/50" />
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: task.color }}
          aria-hidden
        />
        {editing ? (
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setName(task.name);
                setEditing(false);
              }
            }}
            className="h-6 px-1.5 text-xs"
          />
        ) : (
          <button
            onClick={() => {
              setName(task.name);
              setEditing(true);
            }}
            className="min-w-0 flex-1 truncate text-left text-xs font-semibold hover:underline"
            title={task.name}
          >
            {task.name}
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
              aria-label={`Manage ${task.name}`}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(task.id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Color picker row */}
      <div className="flex flex-wrap gap-1 px-1 pb-1">
        {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"].map(
          (c) => (
            <button
              key={c}
              aria-label={`Set color ${c}`}
              onClick={() => onColorChange(task.id, c)}
              className={cn(
                "h-3 w-3 rounded-full transition-transform hover:scale-125",
                task.color === c && "ring-2 ring-ring ring-offset-1"
              )}
              style={{ backgroundColor: c }}
            />
          )
        )}
      </div>

      {/* Cells */}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

