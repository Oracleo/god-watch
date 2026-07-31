import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Root route.
 * Redirects authenticated users to the dashboard and guests to login.
 */
export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  redirect("/login");
}

