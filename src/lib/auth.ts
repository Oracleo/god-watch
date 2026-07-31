import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js (NextAuth v5) EDGE-SAFE configuration.
 * Google OAuth only.
 *
 * IMPORTANT: This file MUST NOT import Prisma / @/lib/prisma.
 * Next.js middleware runs on the Edge Runtime, which cannot load
 * PrismaClient. The PrismaAdapter is attached in `src/auth.ts`
 * (Node runtime) by spreading `...authConfig` into the real instance.
 *
 * CRITICAL FIX for "Something went wrong" errors: the server instance
 * in `src/auth.ts` now wires PrismaAdapter(prisma), so Google OAuth
 * users are persisted as `User` rows in Supabase. The JWT `user.id`
 * then matches the real DB row id, and every per-user Prisma action
 * (createTask, updateStatus, saveNote, updateSettings, ...) passes the
 * foreign-key check. Without the adapter, users had no DB row and all
 * writes failed with P2003 (FK violation) — surfacing as the generic
 * error boundary.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id into the JWT for easy access in server code.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname !== "/login" && !pathname.startsWith("/api/auth");
      // Allow access to public assets & auth endpoints.
      if (!isProtected) return true;
      if (!isLoggedIn) {
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

