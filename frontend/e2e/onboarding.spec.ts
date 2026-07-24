import { test, expect } from "@playwright/test";
import { signUp } from "./helpers";

test.describe("onboarding tour", () => {
  test("shows to a new user then never again after it's dismissed", async ({ page }) => {
    await signUp(page);

    // The spotlight tour opens automatically with its first step.
    const popover = page.locator(".driver-popover");
    await expect(popover).toBeVisible();
    await expect(popover).toContainText(/find anything/i);

    // Dismiss (Escape) — this persists has_onboarded on the server.
    await page.keyboard.press("Escape");
    await expect(popover).toHaveCount(0);

    // Reload the closet: the tour must not reappear for this user.
    await page.goto("/closet");
    await expect(page.locator(".driver-popover")).toHaveCount(0);
  });
});
