import { expect, type Page } from "@playwright/test";

export interface TestUser {
  email: string;
  username: string;
  password: string;
}

let counter = 0;

/** A unique user per call so tests never collide on the shared dev database. */
export function makeUser(): TestUser {
  counter += 1;
  const unique = `${Date.now().toString(36)}${counter}`;
  return {
    email: `e2e_${unique}@example.com`,
    username: `e2e_${unique}`,
    password: "closet-Rocks-2026",
  };
}

/** Register a fresh user through the signup UI and wait for the closet. */
export async function signUp(page: Page, user: TestUser = makeUser()): Promise<TestUser> {
  await page.goto("/signup");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Username").fill(user.username);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: /start free/i }).click();
  await expect(page).toHaveURL(/\/closet/);
  return user;
}

/** The onboarding tour auto-opens for new users and overlays the page; dismiss
    it (Escape closes driver.js) so subsequent clicks aren't intercepted. */
export async function dismissTour(page: Page): Promise<void> {
  const popover = page.locator(".driver-popover");
  await popover.waitFor({ state: "visible", timeout: 4000 }).catch(() => undefined);
  if (await popover.count()) {
    await page.keyboard.press("Escape");
    await expect(popover).toHaveCount(0);
  }
}
