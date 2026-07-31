"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

/** Wraps the app with the Auth.js session provider for client-side auth access. */
export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

