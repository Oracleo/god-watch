"use client";

import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { getQuoteForDate } from "@/lib/quotes";

/**
 * Beautiful month separator card between months in the date rail.
 * Shows an inspirational quote tied to the month.
 */
export function MonthSeparator({ month, date }: { month: string; date: string }) {
  const quote = getQuoteForDate(date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="my-3 rounded-xl border bg-gradient-to-br from-primary/5 via-card to-primary/5 p-3 text-center shadow-sm"
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
        {month}
      </p>
      <div className="mt-2 flex items-start gap-1.5 text-left">
        <QuoteIcon className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <p className="text-[10px] italic leading-snug text-muted-foreground">
          “{quote.text}”
        </p>
      </div>
    </motion.div>
  );
}

