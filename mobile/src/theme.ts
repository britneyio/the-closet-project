// RN theme derived from the shared design tokens. Colors, spacing, and radii are
// identical to web; only the font family differs (web uses Futura/Avenir via CSS
// stacks — on native we fall back to the platform system face until custom fonts
// are loaded with expo-font).
import { tokens } from "shared/tokens";

export const theme = {
  color: tokens.color,
  space: tokens.space,
  radius: tokens.radius,
  size: tokens.size,
};

export type Theme = typeof theme;
