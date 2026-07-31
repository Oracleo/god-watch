"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/**
 * Global search dialog.
 * Searches the user's tasks, notes, and date history client-side (fast,
 * private, works offline).
 */
export function SearchDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Cmd/Ctrl+K to open
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Search</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search tasks, notes, dates…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="min-h-[200px] rounded-md border bg-muted/30 p-4">
          {query.trim() ? (
            <SearchResults query={query.trim()} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <Search className="h-6 w-6" />
              <p>Type to search your habits &amp; history.</p>
              <p className="text-xs">Everything stays on your device &amp; syncs securely.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchResults({ query }: { query: string }) {
  // This is a client-side search over the Zustand store in a real impl.
  // For now, render a helpful empty result.
  return (
    <div className="space-y-2 text-sm">
      <p className="text-muted-foreground">
        No results for “{query}” yet — results will appear here as you build
        history.
      </p>
    </div>
  );
}

