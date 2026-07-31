import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TopNav } from "@/components/navigation/top-nav";
import { Footer } from "@/components/shared/footer";
import { PwaClient } from "@/components/shared/pwa-client";

/** Dashboard layout — wraps all dashboard pages with the top navigation. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <TopNav session={session} />
      <PwaClient />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

