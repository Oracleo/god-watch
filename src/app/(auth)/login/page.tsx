import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";
import { APP_FOOTER, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign in · God Watch",
  description: "Sign in to God Watch with your Google account.",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      {/* Decorative background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <LoginForm />

      <footer className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>{APP_TAGLINE}</p>
        <p className="mt-1">{APP_FOOTER}</p>
      </footer>
    </main>
  );
}

