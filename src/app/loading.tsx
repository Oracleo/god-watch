import { Loader2 } from "lucide-react";

/** Global loading state. */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading God Watch…</p>
      </div>
    </div>
  );
}

