import { test, expect } from "@playwright/test";
import { makeUser, signUp, dismissTour } from "./helpers";

test.describe("authentication", () => {
  test("signs up, lands on the closet, and is seeded with starter types", async ({ page }) => {
    await signUp(page);
    await dismissTour(page);
    // The starter taxonomy should be present in the sidebar.
    await expect(page.getByRole("button", { name: "Tops", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Shoes", exact: true })).toBeVisible();
  });

  test("rejects a weak password with a readable message", async ({ page }) => {
    const user = makeUser();
    await page.goto("/signup");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: /start free/i }).click();
    // Field-level error surfaces (not a generic "Request failed").
    await expect(page.getByRole("alert")).toContainText(/password/i);
  });

  test("signs out and back in", async ({ page }) => {
    const user = await signUp(page);
    await dismissTour(page);

    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/closet/);
  });
});
