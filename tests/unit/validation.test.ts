import { describe, expect, it } from "vitest";
import {
  isoDateSchema,
  noteUpdateSchema,
  statusUpdateSchema,
  taskCreateSchema,
  taskUpdateSchema,
} from "@/lib/validation";

describe("validation schemas", () => {
  it("accepts valid ISO dates", () => {
    expect(isoDateSchema.safeParse("2024-01-05").success).toBe(true);
  });

  it("rejects invalid ISO dates", () => {
    expect(isoDateSchema.safeParse("2024-13-45").success).toBe(false);
    expect(isoDateSchema.safeParse("hello").success).toBe(false);
  });

  it("validates task creation", () => {
    expect(taskCreateSchema.safeParse({ name: "Reading" }).success).toBe(true);
    expect(taskCreateSchema.safeParse({ name: "" }).success).toBe(false);
    expect(taskCreateSchema.safeParse({ name: "x".repeat(200) }).success).toBe(false);
  });

  it("validates task updates", () => {
    expect(taskUpdateSchema.safeParse({ name: "Gym" }).success).toBe(true);
    expect(taskUpdateSchema.safeParse({ color: "red" }).success).toBe(false);
    expect(taskUpdateSchema.safeParse({ archived: true }).success).toBe(true);
  });

it("validates status updates", () => {
    const valid = { taskId: "clfnq7x1a0000kz5p8e1h3abc", date: "2024-01-05", status: "COMPLETED" };
    expect(statusUpdateSchema.safeParse(valid).success).toBe(true);
    expect(statusUpdateSchema.safeParse({ ...valid, status: "BOGUS" }).success).toBe(false);
    expect(statusUpdateSchema.safeParse({ ...valid, date: "bad" }).success).toBe(false);
  });

  it("validates note updates", () => {
    expect(noteUpdateSchema.safeParse({ date: "2024-01-05", content: "hi" }).success).toBe(true);
    expect(noteUpdateSchema.safeParse({ date: "bad", content: "hi" }).success).toBe(false);
  });
});

