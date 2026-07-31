import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth v5 instance (Node runtime only).
 * Exports the route handlers, server-side auth helper, and sign in/out helpers.
 *
 * CRITICAL: The PrismaAdapter is wired HERE (not in `authConfig`) because
 * `authConfig` is also consumed by middleware.ts on the Edge Runtime,
 * which cannot load Prisma. With the adapter active, Google OAuth users
 * are persisted as `User` rows in Supabase, making the JWT `user.id`
 * match the real DB row id. Every per-user Prisma action then passes
 * the foreign-key check — fixing the "Something went wrong" errors.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});

