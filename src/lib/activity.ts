import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@prisma/client";

/**
 * Audit-trail helper.
 * Records every meaningful user action. Used across server actions and
 * API routes. Never throws — logging failures must not break UX.
 */
export async function logActivity(params: {
  userId: string;
  type: ActivityType;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        type: params.type,
        metadata: (params.metadata ?? {}) as object,
        ip: params.ip,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    console.error("[activity] Failed to log activity:", error);
  }
}

