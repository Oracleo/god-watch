"use client";

import { useEffect } from "react";
import type { StatusValue } from "@/types";

const STATUS_KEY_MAP: Record<string, StatusValue> = {
  "1": "COMPLETED",
  "2": "FAILED",
  "3": "MISSED",
  "0": "PENDING",
};

/**
 * Keyboard shortcut hook.
 * When a cell is focused, 1/2/3/0 sets its status.
 * Cmd/Ctrl+Z triggers undo.
 * Cmd/Ctrl+K opens search (callback).
 */
export function useKeyboardShortcuts(params: {
  focusedCell: { taskId: string; date: string } | null;
  onSetStatus: (taskId: string, date: string, status: StatusValue) => void;
  onUndo?: () => void;
  onSearch?: () => void;
  enabled?: boolean;
}) {
  const {
    focusedCell,
    onSetStatus,
    onUndo,
    onSearch,
    enabled = true,
  } = params;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Cmd/Ctrl + K -> search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Cmd/Ctrl + Z -> undo
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Status shortcuts require a focused cell
      if (focusedCell && e.key in STATUS_KEY_MAP) {
        e.preventDefault();
        onSetStatus(focusedCell.taskId, focusedCell.date, STATUS_KEY_MAP[e.key]!);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedCell, onSetStatus, onUndo, onSearch, enabled]);
}

