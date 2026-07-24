import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { reducers } from "shared/store/rootReducer";

/** Render a component inside a fresh store + router — the two providers every
    connected screen needs. Keeps component tests isolated from real state. */
export function renderWithProviders(ui: ReactElement, { route = "/" } = {}) {
  const store = configureStore({ reducer: reducers });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
