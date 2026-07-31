import { test, expect } from "@playwright/test";

/**
 * E2E auth flow tests.
 * Note: Google OAuth requires real credentials; these tests assert the
 * login page renders and redirects unauthenticated users to /login.
 */
test.describe("Authentication", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page shows Google sign-in", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /god watch/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i }).first()).toBeVisible();
  });
});

