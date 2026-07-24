// Design tokens — single source of truth for the visual system (locked
// 2026-07-23). Framework-agnostic so both the React web app and the Expo React
// Native app import the exact same values.
//   - Web turns `cssVariables()` into a :root stylesheet (or reads the object
//     directly in styled-components).
//   - RN imports `tokens` into StyleSheet objects.
//
// Names are semantic and human-readable (what the color is FOR, not its hue):
// e.g. `primary` not `accent`, `textStrong` not `ink`, `surface` not `tile`.

export const tokens = {
  color: {
    // Backgrounds (the 60%)
    background: "#FFFFFF", // main page background
    surface: "#F7F2F0", // subtle raised/inset panels (warm neutral)
    // Text & structure (the 30%)
    textStrong: "#241C17", // primary text (warm near-black)
    textSoft: "#6E6560", // secondary/muted text
    border: "#ECE6E1", // hairlines and dividers
    // Brand (the 10%) — spent only on the click target / active state
    primary: "#C4285C", // red-pink brand color
    primaryStrong: "#A81E4C", // hover / pressed
    primarySoft: "#FCE3EC", // tinted fills, chips, highlights
    onPrimary: "#FFFFFF", // text/icons on a primary background
    // Companion — illustration only, used sparingly
    lilac: "#B9A3D6",
    // Semantic — separate from brand so "error" never reads as "click me"
    danger: "#B3261E",
    dangerSoft: "#FBEEEC",
  },
  font: {
    heading: '"Futura", "Century Gothic", "Avenir Next", sans-serif',
    body: '"Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"SF Mono", "Menlo", ui-monospace, monospace',
  },
  size: { xs: 12, sm: 14, base: 16, md: 19, lg: 24, xl: 38, xxl: 60 },
  weight: { regular: "400", semibold: "600", bold: "700" },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64 },
  radius: { card: 16, pill: 999, frame: 24 },
} as const;

export type Tokens = typeof tokens;
export type ColorToken = keyof Tokens["color"];

/** Web helper: emit the palette as CSS custom properties for a :root block. */
export function cssVariables(): string {
  const color = tokens.color;
  return [
    `--background:${color.background}`, `--surface:${color.surface}`,
    `--text-strong:${color.textStrong}`, `--text-soft:${color.textSoft}`,
    `--border:${color.border}`,
    `--primary:${color.primary}`, `--primary-strong:${color.primaryStrong}`,
    `--primary-soft:${color.primarySoft}`, `--on-primary:${color.onPrimary}`,
    `--lilac:${color.lilac}`,
    `--danger:${color.danger}`, `--danger-soft:${color.dangerSoft}`,
    `--font-heading:${tokens.font.heading}`,
    `--font-body:${tokens.font.body}`,
    `--font-mono:${tokens.font.mono}`,
  ].join(";");
}

export default tokens;
