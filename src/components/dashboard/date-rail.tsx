"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { rangeISODates, toISODate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

interface DateRailProps {
  days: string[]; // ISO dates
  selected: string;
  onSelect: (date: string) => void;
}

/**
 * Sticky scrollable date column on the left of the dashboard.
 * Automatically scrolls to "today" on mount (parent controls via ref).
 */
export const DateRail = React.forwardRef<HTMLDivElement, DateRailProps>(
  ({ days, selected, onSelect }, ref) => {
    const todayStr = toISODate(new Date());

    return (
      <div
        ref={ref}
        className="custom-scrollbar sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-r pr-2"
        aria-label="Date navigation"
      >
        <div className="sticky top-0 z-10 bg-background/90 py-2 text-center backdrop-blur">
          <CalendarDays className="mx-auto h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          {days.map((date) => {
            const d = new Date(`${date}T00:00:00Z`);
            const isToday = date === todayStr;
            const isSelected = date === selected;
            const day = d.toLocaleDateString("en-US", { weekday: "short" });
            const num = d.getDate();
            const month = d.toLocaleDateString("en-US", { month: "short" });

            return (
              <Button
                key={date}
                variant="ghost"
                onClick={() => onSelect(date)}
                aria-pressed={isSelected}
                className={cn(
                  "flex h-auto flex-col items-center gap-0.5 rounded-lg px-2 py-1.5",
                  isToday && "ring-1 ring-primary/50",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] uppercase",
                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {day}
                </span>
                <span className="text-sm font-semibold">{num}</span>
                <span
                  className={cn(
                    "text-[10px]",
                    isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {month}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
);

DateRail.displayName = "DateRail";

/** Convenience: build a contiguous range from start to today. */
export function buildDayRange(start: Date, end: Date): string[] {
  return rangeISODates(start, end);
}

