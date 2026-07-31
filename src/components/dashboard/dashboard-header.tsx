"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getRandomQuote } from "@/lib/quotes";

/** Center title, completion percentage, streak, and a motivational quote. */
export function DashboardHeader({
  completion,
  streak,
}: {
  completion: number;
  streak: number;
}) {
  const quote = getRandomQuote();

  return (
    <section className="container flex flex-col items-center gap-4 py-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          God Watch
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every Day Leaves Evidence
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm shadow-sm">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-semibold">{completion}%</span>
          <span className="text-muted-foreground">today</span>
          <div className="w-16">
            <Progress value={completion} className="h-1.5" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm shadow-sm">
          <Flame className="h-4 w-4 text-warning" />
          <span className="font-semibold">{streak}</span>
          <span className="text-muted-foreground">
            {streak === 1 ? "day streak" : "day streak"}
          </span>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex max-w-xl items-start gap-2 text-sm italic text-muted-foreground"
      >
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          “{quote.text}”
          <span className="mt-0.5 block text-xs not-italic text-muted-foreground/70">
            — {quote.author}
          </span>
        </p>
      </motion.blockquote>
    </section>
  );
}

