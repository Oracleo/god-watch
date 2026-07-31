"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { HeatmapCell } from "@/types";

/** GitHub-style contribution heatmap. */
export function Heatmap({ data }: { data: HeatmapCell[] }) {
  // Group into weeks (columns) of 7 days
  const weeks = React.useMemo(() => {
    const result: HeatmapCell[][] = [];
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    return result;
  }, [data]);

  const maxRate = Math.max(...data.map((d) => d.rate), 1);

  return (
    <div className="custom-scrollbar overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => {
              const intensity = cell.rate > 0 ? Math.ceil((cell.rate / maxRate) * 4) : 0;
              return (
                <motion.div
                  key={cell.date}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: wi * 0.005 }}
                  title={`${cell.date}: ${cell.count} completed (${cell.rate}%)`}
                  className={cn(
                    "h-3 w-3 rounded-[3px]",
                    intensity === 0 && "bg-muted/40",
                    intensity === 1 && "bg-success/30",
                    intensity === 2 && "bg-success/50",
                    intensity === 3 && "bg-success/70",
                    intensity === 4 && "bg-success"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-3 w-3 rounded-[3px]",
              i === 0 && "bg-muted/40",
              i === 1 && "bg-success/30",
              i === 2 && "bg-success/50",
              i === 3 && "bg-success/70",
              i === 4 && "bg-success"
            )}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

