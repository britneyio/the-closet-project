import { createGlobalStyle } from "styled-components";
import { cssVariables } from "shared/tokens";

// Injects the design tokens as CSS custom properties on :root so both
// styled-components and plain CSS can read them, plus global focus visibility.
export const GlobalStyle = createGlobalStyle`
  :root { ${cssVariables()}; }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  [tabindex]:focus-visible {
    outline: 3px solid var(--primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  ::selection {
    background: var(--primary-soft);
  }
`;
