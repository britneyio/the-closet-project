import { test, expect } from "@playwright/test";
import { signUp, dismissTour } from "./helpers";

test.describe("profile", () => {
  test("edits location", async ({ page }) => {
    await signUp(page);
    await dismissTour(page);

    await page.goto("/profile");
    await page.getByRole("button", { name: /location/i }).click();
    await page.getByLabel("Location").fill("Boston, USA");
    await page.getByRole("button", { name: /save location/i }).click();

    await expect(page.getByText("Boston, USA")).toBeVisible();
  });

  test("deletes the account and returns to the landing page", async ({ page }) => {
    const user = await signUp(page);
    await dismissTour(page);

    await page.goto("/profile");
    await page.getByRole("button", { name: /delete account/i }).click();
    await page.getByLabel(/confirm your password/i).fill(user.password);
    await page.getByRole("button", { name: /delete my account/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });
});
