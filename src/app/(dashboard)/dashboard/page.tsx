import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import {
  getDashboardSummary,
  getNotes,
  getStatuses,
  getTasks,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const [tasks, statuses, notes, summary] = await Promise.all([
    getTasks(userId),
    getStatuses(userId),
    getNotes(userId),
    getDashboardSummary(userId),
  ]);

  return (
    <DashboardView
      initialTasks={tasks}
      initialStatuses={statuses}
      initialNotes={notes}
      summary={summary}
    />
  );
}

