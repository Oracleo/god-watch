"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StatusValue, TaskDTO } from "@/types";

/**
 * Zustand store for dashboard state.
 * - Optimistic status updates with undo support
 * - Task CRUD (local mirror of server)
 * - Offline sync queue
 */

export interface StatusCell {
  taskId: string;
  date: string;
  status: StatusValue;
}

interface PendingAction {
  id: string;
  type: "STATUS_UPDATE" | "TASK_CREATE" | "TASK_UPDATE" | "NOTE_UPDATE";
  payload: Record<string, unknown>;
}

interface UndoEntry {
  id: string;
  description: string;
  undo: () => void;
}

interface TaskStore {
  tasks: TaskDTO[];
  statuses: Record<string, Record<string, StatusValue>>; // taskId -> date -> status
  notes: Record<string, string>; // date -> content
  selectedDate: string;
  focusedCell: { taskId: string; date: string } | null;
  pendingQueue: PendingAction[];
  undoStack: UndoEntry[];
  offline: boolean;
  setTasks: (tasks: TaskDTO[]) => void;
  setStatuses: (statuses: Record<string, Record<string, StatusValue>>) => void;
  setNote: (date: string, content: string) => void;
  setSelectedDate: (date: string) => void;
  setFocusedCell: (cell: { taskId: string; date: string } | null) => void;
  setOffline: (offline: boolean) => void;
  cycleStatus: (
    taskId: string,
    date: string,
    next: StatusValue,
    optimisticApply?: () => void
  ) => void;
  undoStatus: (taskId: string, date: string, prev: StatusValue) => void;
  addTask: (task: TaskDTO) => void;
  updateTask: (taskId: string, patch: Partial<TaskDTO>) => void;
  removeTask: (taskId: string) => void;
  enqueue: (action: PendingAction) => void;
  dequeue: (id: string) => void;
  pushUndo: (entry: UndoEntry) => void;
  popUndo: () => UndoEntry | undefined;
  clearUndo: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      statuses: {},
      notes: {},
      selectedDate: new Date().toISOString().slice(0, 10),
      focusedCell: null,
      pendingQueue: [],
      undoStack: [],
      offline: false,

      setTasks: (tasks) => set({ tasks }),
      setStatuses: (statuses) => set({ statuses }),
      setNote: (date, content) =>
        set((s) => ({ notes: { ...s.notes, [date]: content } })),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setFocusedCell: (cell) => set({ focusedCell: cell }),
      setOffline: (offline) => set({ offline }),

      cycleStatus: (taskId, date, next, optimisticApply) => {
        const _prev =
          get().statuses[taskId]?.[date] ?? ("PENDING" as StatusValue);
        set((s) => ({
          statuses: {
            ...s.statuses,
            [taskId]: {
              ...(s.statuses[taskId] ?? {}),
              [date]: next,
            },
          },
        }));
        optimisticApply?.();
      },

      undoStatus: (taskId, date, prev) => {
        set((s) => ({
          statuses: {
            ...s.statuses,
            [taskId]: {
              ...(s.statuses[taskId] ?? {}),
              [date]: prev,
            },
          },
        }));
      },

      addTask: (task) =>
        set((s) => ({ tasks: [...s.tasks, task] })),
      updateTask: (taskId, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        })),
      removeTask: (taskId) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) })),

      enqueue: (action) =>
        set((s) => ({ pendingQueue: [...s.pendingQueue, action] })),
      dequeue: (id) =>
        set((s) => ({
          pendingQueue: s.pendingQueue.filter((a) => a.id !== id),
        })),

      pushUndo: (entry) =>
        set((s) => ({ undoStack: [...s.undoStack, entry].slice(-50) })),
      popUndo: () => {
        const stack = get().undoStack;
        if (stack.length === 0) return undefined;
        const entry = stack[stack.length - 1]!;
        set({ undoStack: stack.slice(0, -1) });
        return entry;
      },
      clearUndo: () => set({ undoStack: [] }),
    }),
    {
      name: "god-watch-store",
      partialize: (state) => ({
        statuses: state.statuses,
        notes: state.notes,
        tasks: state.tasks,
        pendingQueue: state.pendingQueue,
      }),
    }
  )
);

