"use client";

/**
 * PWA helpers: service worker registration, manifest, install prompt, and
 * browser notifications.
 */

/** Register the service worker (only in production for stability). */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch (error) {
    console.warn("[pwa] Service worker registration failed:", error);
  }
}

/** Check if we're online. */
export function isOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

/** Subscribe to online/offline events. */
export function onNetworkChange(cb: (online: boolean) => void) {
  const handle = () => cb(isOnline());
  window.addEventListener("online", handle);
  window.addEventListener("offline", handle);
  return () => {
    window.removeEventListener("online", handle);
    window.removeEventListener("offline", handle);
  };
}

/** Request notification permission. Returns granted state. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

/** Show a browser notification (falls back silently). */
export function showNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      ...options,
    });
  } catch (error) {
    console.warn("[pwa] Notification failed:", error);
  }
}

/** Queue a list of offline mutations in localStorage for later sync. */
export interface QueuedMutation {
  id: string;
  action: "updateStatus" | "saveNote" | "createTask" | "updateTask" | "deleteTask";
  payload: unknown;
  createdAt: string;
}

const QUEUE_KEY = "godwatch-offline-queue";

export function getOfflineQueue(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(mutation: Omit<QueuedMutation, "id" | "createdAt">) {
  const queue = getOfflineQueue();
  queue.push({ ...mutation, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

