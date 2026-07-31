"use client";

import { Check, X, Minus, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "@/lib/constants";
import type { StatusValue } from "@/types";

const STATUS_META: Record<
  StatusValue,
  { icon: React.ReactNode; className: string; hint: string }
> = {
  PENDING: {
    icon: <RotateCcw className="h-5 w-5" />,
    className: "text-muted-foreground",
    hint: "Mark this task as not yet started for the day.",
  },
  COMPLETED: {
    icon: <Check className="h-5 w-5" />,
    className: "text-success",
    hint: "You did it! This will count toward your streak and completion rate.",
  },
  FAILED: {
    icon: <X className="h-5 w-5" />,
    className: "text-danger",
    hint: "You attempted it but didn't finish. Honest data builds honest habits.",
  },
  MISSED: {
    icon: <Minus className="h-5 w-5" />,
    className: "text-warning",
    hint: "You didn't do this today. That's okay — record it and move forward.",
  },
};

/** Confirmation dialog shown before applying a status change. */
export function StatusConfirmDialog({
  open,
  onOpenChange,
  taskName,
  dateLabel,
  nextStatus,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  dateLabel: string;
  nextStatus: StatusValue;
  onConfirm: () => void;
}) {
  const meta = STATUS_META[nextStatus];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className={meta.className}>{meta.icon}</span>
            Mark as {STATUS_LABELS[nextStatus]}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{taskName}</span> on{" "}
            <span className="font-medium text-foreground">{dateLabel}</span>.{" "}
            {meta.hint}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className={nextStatus === "COMPLETED" ? "bg-success" : nextStatus === "FAILED" ? "bg-danger" : nextStatus === "MISSED" ? "bg-warning" : undefined}
            onClick={onConfirm}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

