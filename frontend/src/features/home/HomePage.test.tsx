import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/renderWithProviders";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("shows the value-prop headline and a primary sign-up call to action", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/only closet app you can/i)).toBeInTheDocument();
    // The primary CTA appears (hero + closing section).
    expect(screen.getAllByRole("link", { name: /start free/i }).length).toBeGreaterThan(0);
  });

  it("offers a sign-in path for returning users", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole("link", { name: /^sign in$/i })).toBeInTheDocument();
  });
});
