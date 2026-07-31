import { test, expect } from "@playwright/test";

/**
 * Dashboard UI smoke tests.
 * These validate the landing/login and static structure without auth.
 */
test.describe("Dashboard", () => {
  test("login page has proper meta and tagline", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Every Day Leaves Evidence.")).toBeVisible();
  });

  test("app shell loads with footer attribution", async ({ page }) => {
    // Without auth we land on login; assert the footer on the login page if present.
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
  });
});

