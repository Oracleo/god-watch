import { auth as middleware } from "@/auth";

/**
 * Route protection middleware.
 * Uses the `authorized` callback in authConfig to gate protected routes.
 * Public: /login, /api/auth/*, static assets.
 */

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.webmanifest|icons/|offline).*)"],
};

