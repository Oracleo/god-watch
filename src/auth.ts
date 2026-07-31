import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * NextAuth v5 instance.
 * Exports the route handlers, server-side auth helper, and sign in/out helpers.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

