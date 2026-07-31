"use client";

import { Toaster } from "sonner";

/** Global toast provider with a premium look. */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: "0.75rem",
          backdropFilter: "blur(8px)",
        },
      }}
    />
  );
}

