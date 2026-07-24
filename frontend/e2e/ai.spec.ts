import { test, expect } from "@playwright/test";
import { signUp, dismissTour } from "./helpers";

// The stylist calls the real AI provider. These tests only run when a key is
// configured (ANTHROPIC_API_KEY); otherwise they're skipped so the suite stays
// green. Pass the flag through to the Playwright process to enable them.
const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);

test.describe("AI stylist", () => {
  test.skip(!hasKey, "requires ANTHROPIC_API_KEY to be set");

  test("replies to a message using the user's closet", async ({ page }) => {
    await signUp(page);
    await dismissTour(page);

    await page.goto("/stylist");
    await page.getByLabel(/message the stylist/i).fill("What can I wear to a warm dinner?");
    await page.getByRole("button", { name: /send/i }).click();

    // An assistant bubble appears and no error is shown.
    await expect(page.locator("text=Styling…")).toBeHidden({ timeout: 30_000 });
    await expect(page.getByRole("alert")).toHaveCount(0);
  });
});
