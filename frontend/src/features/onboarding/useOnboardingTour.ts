import { useEffect } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { getProfile, updateProfile } from "shared/api/endpoints";

// Candidate steps, in order. Each targets a [data-tour] element; steps whose
// element isn't currently visible (e.g. the desktop nav while on a phone) are
// skipped so the tour adapts to the viewport instead of pointing at nothing.
const STEPS: DriveStep[] = [
  {
    element: '[data-tour="search"]',
    popover: {
      title: "Find anything",
      description: "Search your closet by name once it starts filling up.",
    },
  },
  {
    element: '[data-tour="add-item"]',
    popover: {
      title: "Add your clothes",
      description:
        "Upload a photo and each item gets auto-tagged — color, fabric, formality, and season.",
    },
  },
  {
    element: '[data-tour="manage-types"]',
    popover: {
      title: "Organize by type",
      description: "You start with a few categories. Add or remove your own anytime.",
    },
  },
  {
    element: '[data-tour="nav"]',
    popover: {
      title: "Get around",
      description: "Switch between your Closet, saved Outfits, and the outfit Creator here.",
    },
  },
  {
    element: '[data-tour="nav-stylist"]',
    popover: {
      title: "Your AI stylist",
      description:
        "The heart of the app — ask for outfits in plain language and it answers using only the clothes you own.",
    },
  },
  {
    element: '[data-tour="notifications"]',
    popover: { title: "Notifications", description: "Nudges and updates land here." },
  },
  {
    element: '[data-tour="profile"]',
    popover: {
      title: "Your account",
      description: "Manage your password, location, and preferences from your profile.",
    },
  },
];

function isVisible(selector: string): boolean {
  const element = document.querySelector(selector);
  return element instanceof HTMLElement && element.offsetParent !== null;
}

// Module-level guard so the tour initializes at most once per page load, even
// under React StrictMode's double-mount in development.
let hasRun = false;

/** First-run product tour. Runs once for users whose profile.has_onboarded is
    false, then persists the flag so it never shows again. Web only (it spotlights
    live DOM elements); the mobile app can get an equivalent later. */
export function useOnboardingTour(): void {
  useEffect(() => {
    if (hasRun) return;
    hasRun = true;

    void (async () => {
      try {
        const profile = await getProfile();
        if (profile.has_onboarded) return;

        const steps = STEPS.filter(
          (step) => typeof step.element === "string" && isVisible(step.element)
        );
        if (steps.length === 0) return;

        driver({
          showProgress: true,
          nextBtnText: "Next",
          prevBtnText: "Back",
          doneBtnText: "Done",
          steps,
          // Fires on finish AND on skip/close — persist either way.
          onDestroyed: () => void updateProfile({ has_onboarded: true }).catch(() => undefined),
        }).drive();
      } catch {
        // No profile or a network hiccup — never block the app on the tour.
      }
    })();
  }, []);
}
