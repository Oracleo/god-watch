"use client";

import * as React from "react";
import { registerServiceWorker } from "@/lib/pwa";

/** Register the service worker on mount (production only). */
export function usePwaRegistration() {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      void registerServiceWorker();
    }
  }, []);
}

/** Capture the PWA install prompt and expose it for custom UI. */
export function useInstallPrompt() {
  const [prompt, setPrompt] = React.useState<Event | null>(null);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    const handleInstalled = () => {
      setPrompt(null);
      setInstalled(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const install = React.useCallback(async () => {
    if (!prompt) return false;
    const event = prompt as Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: string }> };
    await event.prompt();
    await event.userChoice?.catch(() => undefined);
    setPrompt(null);
    return true;
  }, [prompt]);

  return { canInstall: !!prompt, installed, install };
}

