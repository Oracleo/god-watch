import { z } from "zod";

/**
 * Central validation schemas (Zod) — single source of truth shared
 * between client components and API route handlers / server actions.
 * Prevents invalid payloads and provides defense-in-depth input validation.
 */

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const isoDateSchema = z
  .string()
  .regex(ISO_DATE_REGEX, "Date must be in yyyy-MM-dd format")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime());
  }, "Invalid date");

export const taskCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(100, "Task name must be 100 characters or less"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex code")
    .default("#6366f1"),
});

export const taskUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(100, "Task name must be 100 characters or less")
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex code")
    .optional(),
  archived: z.boolean().optional(),
});

export const taskReorderSchema = z.object({
  orderedIds: z.array(z.string().cuid()).min(1),
});

export const statusUpdateSchema = z.object({
  taskId: z.string().cuid(),
  date: isoDateSchema,
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "MISSED"]),
});

export const noteUpdateSchema = z.object({
  date: isoDateSchema,
  content: z.string().max(5000, "Note is too long (max 5000 characters)"),
});

export const settingsUpdateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  dailyReminderEnabled: z.boolean().optional(),
  dailyReminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format")
    .optional(),
  dailyReminderChannel: z.enum(["browser", "email"]).optional(),
  defaultTaskColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a valid hex code")
    .optional(),
});

export const searchSchema = z.object({
  q: z.string().trim().max(200).default(""),
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
export type NoteUpdateInput = z.infer<typeof noteUpdateSchema>;
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

