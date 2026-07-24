import { test, expect } from "@playwright/test";
import { signUp, dismissTour } from "./helpers";

// A 1x1 PNG — smallest valid upload that passes the image guard.
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

test.describe("closet", () => {
  test("adds a new clothing type", async ({ page }) => {
    await signUp(page);
    await dismissTour(page);

    await page.getByRole("button", { name: /manage types/i }).click();
    await page.getByLabel(/new type/i).fill("Activewear");
    await page.getByRole("button", { name: /^add$/i }).click();

    // New type shows in the modal list and, after closing, in the sidebar.
    await expect(page.getByRole("listitem").filter({ hasText: "Activewear" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Activewear", exact: true })).toBeVisible();
  });

  test("adds an item with a photo", async ({ page }) => {
    await signUp(page);
    await dismissTour(page);

    await page.getByRole("button", { name: /add item/i }).click();
    await page.getByLabel("Name").fill("E2E Blue Shirt");
    await page.getByLabel("Type").selectOption({ label: "Tops" });
    await page.getByLabel("Photo").setInputFiles({
      name: "shirt.png",
      mimeType: "image/png",
      buffer: PNG_1X1,
    });
    await page.getByRole("button", { name: /add to closet/i }).click();

    // Modal closes and the item appears in the grid.
    await expect(page.getByText("E2E Blue Shirt")).toBeVisible();
  });
});
