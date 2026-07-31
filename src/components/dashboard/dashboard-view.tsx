"use client";

import * as React from "react";
import { toast } from "sonner";
import { Undo2, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/task-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DateRail } from "@/components/dashboard/date-rail";
import { TaskColumn } from "@/components/dashboard/task-column";
import { StatusCell } from "@/components/dashboard/status-cell";
import { StatusConfirmDialog } from "@/components/dashboard/status-confirm-dialog";
import { MonthSeparator } from "@/components/dashboard/month-separator";
import { NotesPanel } from "@/components/dashboard/notes-panel";
import { AddTask } from "@/components/dashboard/add-task";
import { Button } from "@/components/ui/button";
import { rangeISODates, toISODate, formatDateShort } from "@/lib/utils";
import { STATUS_CYCLE, STATUS_TOASTS } from "@/lib/constants";
import type { StatusValue, TaskDTO } from "@/types";
import {
  createTask,
  deleteTask,
  reorderTasks,
  saveNote,
  updateStatus,
  updateTask,
} from "@/lib/actions";

interface DashboardViewProps {
  initialTasks: TaskDTO[];
  initialStatuses: Record<string, Record<string, StatusValue>>;
  initialNotes: Record<string, string>;
  summary: {
    todayCompleted: number;
    todayTotal: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
}

const DAY_RANGE_DAYS = 90; // 3 months of history + today

export function DashboardView({
  initialTasks,
  initialStatuses,
  initialNotes,
  summary,
}: DashboardViewProps) {
  const {
    tasks,
    statuses,
    notes,
    selectedDate,
    setTasks,
    setStatuses,
    setNote,
    setSelectedDate,
    cycleStatus,
    undoStatus,
    addTask: storeAddTask,
    updateTask: storeUpdateTask,
    removeTask: storeRemoveTask,
    pushUndo,
    popUndo,
    focusedCell,
    offline,
    setOffline,
  } = useTaskStore();

  // Hydrate the store once from server data
  const hydrated = React.useRef(false);
  React.useEffect(() => {
    if (!hydrated.current) {
      setTasks(initialTasks);
      setStatuses(initialStatuses);
      for (const [date, content] of Object.entries(initialNotes)) {
        setNote(date, content);
      }
      hydrated.current = true;
    }
  }, [initialTasks, initialStatuses, initialNotes, setTasks, setStatuses, setNote]);

  // Day range for the date rail
  const days = React.useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (DAY_RANGE_DAYS - 1));
    return rangeISODates(start, end);
  }, []);

  // Auto-scroll to today on mount
  const railRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const todayStr = toISODate(new Date());
    const container = railRef.current;
    if (container) {
      const todayEl = container.querySelector<HTMLElement>(`[data-date="${todayStr}"]`);
      if (todayEl) {
        todayEl.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    setSelectedDate(todayStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Confirmation dialog state
  const [confirmState, setConfirmState] = React.useState<{
    taskId: string;
    date: string;
    taskName: string;
    nextStatus: StatusValue;
  } | null>(null);

  // Track drag state
  const [dragId, setDragId] = React.useState<string | null>(null);

  const handleCellClick = (taskId: string, date: string, taskName: string) => {
    const current = statuses[taskId]?.[date] ?? "PENDING";
    const idx = STATUS_CYCLE.indexOf(current as (typeof STATUS_CYCLE)[number]);
    const nextStatus = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]!;
    setConfirmState({ taskId, date, taskName, nextStatus });
  };

  const applyStatus = async (
    taskId: string,
    date: string,
    nextStatus: StatusValue,
    showToast = true
  ) => {
    const prev = statuses[taskId]?.[date] ?? "PENDING";
    cycleStatus(taskId, date, nextStatus);

    // Register undo
    pushUndo({
      id: crypto.randomUUID(),
      description: `Reverted ${formatDateShort(date)}`,
      undo: () => undoStatus(taskId, date, prev),
    });

    if (showToast) {
      toast.success(nextStatus, {
        description: STATUS_TOASTS[nextStatus],
        action: {
          label: "Undo",
          onClick: () => undoStatus(taskId, date, prev),
        },
      });
    }

    // Persist (offline-safe)
    try {
      const res = await updateStatus({ taskId, date, status: nextStatus });
      if (!res.ok) throw new Error(res.message);
    } catch {
      toast.error("Saved offline — will sync when back online.");
      setOffline(true);
    }
  };

  const handleConfirm = () => {
    if (!confirmState) return;
    const { taskId, date, nextStatus } = confirmState;
    setConfirmState(null);
    void applyStatus(taskId, date, nextStatus);
  };

  // Keyboard shortcuts (1/2/3/0, Ctrl+Z, Ctrl+K)
  const handleShortcutStatus = (taskId: string, date: string, status: StatusValue) => {
    void applyStatus(taskId, date, status);
  };
  const handleUndo = () => {
    const entry = popUndo();
    if (entry) {
      entry.undo();
      toast.info("Action undone");
    }
  };
  useKeyboardShortcuts({
    focusedCell,
    onSetStatus: handleShortcutStatus,
    onUndo: handleUndo,
    enabled: true,
  });

  // Offline status
  useOnlineStatus();

  // --- Task CRUD handlers ---
  const handleAddTask = async (name: string, color: string) => {
    const res = await createTask({ name, color });
    if (res.ok && res.data) {
      const task = res.data as TaskDTO;
      storeAddTask(task);
      toast.success("Task added", { description: `“${name}” is ready to track.` });
    } else {
      toast.error(res.message ?? "Failed to add task");
    }
  };

  const handleRename = async (taskId: string, name: string) => {
    storeUpdateTask(taskId, { name });
    const res = await updateTask(taskId, { name });
    if (!res.ok) toast.error(res.message ?? "Failed to rename task");
    else toast.success("Task renamed");
  };

  const handleDelete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    storeRemoveTask(taskId);
    const res = await deleteTask(taskId);
    if (res.ok) {
      toast.success("Task deleted", {
        description: task ? `“${task.name}” was removed.` : undefined,
      });
    } else {
      toast.error(res.message ?? "Failed to delete task");
    }
  };

  const handleArchive = async (taskId: string) => {
    const res = await updateTask(taskId, { archived: true });
    if (res.ok) {
      storeRemoveTask(taskId);
      toast.success("Task archived", {
        description: "You can restore it later from settings.",
      });
    } else {
      toast.error(res.message ?? "Failed to archive task");
    }
  };

  const handleColorChange = async (taskId: string, color: string) => {
    storeUpdateTask(taskId, { color });
    const res = await updateTask(taskId, { color });
    if (!res.ok) toast.error(res.message ?? "Failed to update color");
  };

  // Drag & drop reorder
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = dragId ?? e.dataTransfer.getData("text/plain");
    setDragId(null);
    if (!sourceId || sourceId === targetId) return;

    const reordered = [...tasks];
    const from = reordered.findIndex((t) => t.id === sourceId);
    const to = reordered.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved!);
    setTasks(reordered);

    void reorderTasks({
      orderedIds: reordered.map((t) => t.id),
    }).then((res) => {
      if (!res.ok) toast.error(res.message ?? "Failed to reorder");
      else toast.success("Order updated");
    });
  };

  // Notes autosave
  const handleSaveNote = async (date: string, content: string) => {
    setNote(date, content);
    const res = await saveNote({ date, content });
    if (!res.ok) throw new Error(res.message);
  };

  // Group days by month for separators
  const monthGroups = React.useMemo(() => {
    const groups: { month: string; date: string }[] = [];
    let lastMonth = "";
    for (const date of days) {
      const month = date.slice(0, 7);
      if (month !== lastMonth) {
        const d = new Date(`${date}T00:00:00Z`);
        groups.push({
          month: d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
          date,
        });
        lastMonth = month;
      }
    }
    return groups;
  }, [days]);

  const todayStr = toISODate(new Date());

  return (
    <div className="container pb-16">
      <DashboardHeader completion={summary.completionRate} streak={summary.currentStreak} />

      {/* Offline banner */}
      {offline && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-warning">
          <WifiOff className="h-4 w-4" />
          You&apos;re offline. Changes will sync automatically when you reconnect.
        </div>
      )}

      <div className="flex gap-4">
        {/* Date rail */}
        <DateRail ref={railRef} days={days} selected={selectedDate} onSelect={setSelectedDate} />

        {/* Task columns */}
        <div className="custom-scrollbar flex-1 overflow-x-auto pb-4">
          <div className="flex gap-3">
            {monthGroups.map(({ month, date }) => (
              <div key={month} className="contents">
                <div className="contents" data-month={month}>
                  <MonthSeparator month={month} date={date} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3">
            {tasks.length === 0 && (
              <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center text-sm text-muted-foreground">
                <p className="font-medium text-foreground">No tasks yet</p>
                <p>Add your first habit to start tracking.</p>
              </div>
            )}

            {tasks.map((task) => (
              <TaskColumn
                key={task.id}
                task={task}
                dragging={dragId === task.id}
                onRename={handleRename}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onColorChange={handleColorChange}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {days.map((date) => {
                  const status = statuses[task.id]?.[date] ?? "PENDING";
                  const isToday = date === todayStr;
                  return (
                    <div key={date} data-date={date} className="flex items-center gap-1">
                      {isToday && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                      <StatusCell
                        status={status}
                        onClick={() => handleCellClick(task.id, date, task.name)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCellClick(task.id, date, task.name);
                          }
                        }}
                        aria-label={`${task.name} on ${formatDateShort(date)}: ${status}`}
                      />
                    </div>
                  );
                })}
              </TaskColumn>
            ))}

            <AddTask onAdd={handleAddTask} />
          </div>

          {/* Notes for selected date */}
          <div className="mt-6 max-w-md">
            <NotesPanel
              date={selectedDate}
              initialContent={notes[selectedDate] ?? ""}
              onSave={handleSaveNote}
            />
          </div>
        </div>
      </div>

      {/* Status confirmation dialog */}
      <StatusConfirmDialog
        open={!!confirmState}
        onOpenChange={(open) => {
          if (!open) setConfirmState(null);
        }}
        taskName={confirmState?.taskName ?? ""}
        dateLabel={confirmState ? formatDateShort(confirmState.date) : ""}
        nextStatus={confirmState?.nextStatus ?? "PENDING"}
        onConfirm={handleConfirm}
      />

      {/* Undo floating action */}
      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2">
        <motion.div
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <Button
            variant="secondary"
            className="gap-2 rounded-full shadow-lg"
            onClick={handleUndo}
          >
            <Undo2 className="h-4 w-4" />
            Undo
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

