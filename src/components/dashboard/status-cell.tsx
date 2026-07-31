"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusValue } from "@/types";

const STATUS_STYLES: Record<
  StatusValue,
  { label: string; className: string; icon?: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-muted text-muted-foreground",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-success/15 text-success ring-1 ring-success/30",
    icon: <Check className="h-4 w-4" />,
  },
  FAILED: {
    label: "Failed",
    className: "bg-danger/15 text-danger ring-1 ring-danger/30",
    icon: <X className="h-4 w-4" />,
  },
  MISSED: {
    label: "Missed",
    className: "bg-warning/15 text-warning ring-1 ring-warning/30",
    icon: <Minus className="h-4 w-4" />,
  },
};

interface StatusCellProps {
  status: StatusValue;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  "aria-label"?: string;
}

/**
 * A single grid cell. Shows the task status for a given date.
 * Clicking cycles through states (confirmation handled by parent).
 */
export const StatusCell = React.forwardRef<HTMLButtonElement, StatusCellProps>(
  ({ status, onClick, onKeyDown, ...props }, ref) => {
    const style = STATUS_STYLES[status];

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label={props["aria-label"] ?? `Status: ${style.label}`}
        title={style.label}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          style.className
        )}
      >
        {style.icon ?? <span className="text-xs">·</span>}
      </motion.button>
    );
  }
);

StatusCell.displayName = "StatusCell";

export { STATUS_STYLES };

