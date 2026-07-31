import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * Route protection middleware.
 * Uses the `authorized` callback in authConfig to gate protected routes.
 * Public: /login, /api/auth/*, static assets.
 *
 * IMPORTANT: This builds a SEPARATE edge-safe NextAuth instance directly
 * from `authConfig` (which contains no Prisma import). We must NOT import
 * from `@/auth`, because that instance wires the PrismaAdapter (Node-only)
 * and would crash on the Edge Runtime.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/|offline).*)"],
};

