import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js (NextAuth v5) configuration.
 * Google OAuth only. Prisma adapter for persistent accounts/sessions.
 * JWT session strategy for edge-compatible, zero-DB hot-path auth.
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

