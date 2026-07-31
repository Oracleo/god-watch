import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 * Prevents exhausting database connections during dev hot-reloads.
 * Using "pooler" friendly config for serverless (Supabase).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

