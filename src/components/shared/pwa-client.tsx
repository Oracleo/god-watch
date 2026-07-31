"use client";

import { usePwaRegistration } from "@/hooks/use-pwa";

/** Registers the PWA service worker in production. */
export function PwaClient() {
  usePwaRegistration();
  return null;
}

