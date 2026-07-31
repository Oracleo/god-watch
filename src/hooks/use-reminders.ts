"use client";

import * as React from "react";
import { requestNotificationPermission, showNotification } from "@/lib/pwa";

/**
 * Daily reminder hook.
 * Uses a 30-second interval to detect when the configured time is reached
 * without requiring a server (works as an installed PWA / open tab).
 */
export function useDailyReminder(enabled: boolean, time: string) {
  const lastNotified = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!enabled) return;
    let granted = false;

    const check = async () => {
      if (!granted) {
        granted = await requestNotificationPermission();
        if (!granted) return;
      }
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [h, m] = time.split(":").map(Number);
      const targetMinutes = (h ?? 20) * 60 + (m ?? 0);

      // Fire once within the minute window.
      if (
        currentMinutes >= targetMinutes &&
        currentMinutes < targetMinutes + 1 &&
        lastNotified.current !== todayKey
      ) {
        lastNotified.current = todayKey;
        showNotification("God Watch — Daily check-in", {
          body: "Every day leaves evidence. How did today go?",
          tag: "godwatch-daily",
        });
      }
    };

    const interval = setInterval(() => void check(), 30_000);
    void check();
    return () => clearInterval(interval);
  }, [enabled, time]);
}

