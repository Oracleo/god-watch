"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/store/task-store";

/**
 * Tracks online/offline status and triggers the sync queue flush
 * when connectivity is restored.
 */
export function useOnlineStatus(onReconnect?: () => void) {
  const setOffline = useTaskStore((s) => s.setOffline);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      onReconnect?.();
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setOffline(!navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOffline, onReconnect]);
}

