// Design-system primitives — the shared vocabulary every screen is built from.
// All values come from shared/tokens (never hardcoded), so web + RN stay in
// sync and the whole app restyles from one place.
import styled, { css } from "styled-components";
import { tokens } from "shared/tokens";

const color = tokens.color;

/** Uppercase mono label used above section headings. */
export const Eyebrow = styled.span`
  font-family: ${tokens.font.mono};
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${color.primary};
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger"; $block?: boolean }>`
  font-family: ${tokens.font.body};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border-radius: ${tokens.radius.pill}px;
  padding: 12px 22px;
  border: 1.5px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.12s ease, background 0.12s ease, border-color 0.12s ease;
  width: ${(props) => (props.$block ? "100%" : "auto")};

  ${(props) =>
    props.$variant === "ghost"
      ? css`
          background: ${color.background};
          color: ${color.textStrong};
          border-color: ${color.border};
          &:hover:not(:disabled) {
            border-color: ${color.primary};
            color: ${color.primary};
          }
        `
      : props.$variant === "danger"
        ? css`
            background: ${color.danger};
            color: #fff;
            &:hover:not(:disabled) {
              filter: brightness(0.94);
            }
          `
        : css`
            background: ${color.primary};
            color: ${color.onPrimary};
            &:hover:not(:disabled) {
              background: ${color.primaryStrong};
              transform: translateY(-1px);
            }
          `}

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Card = styled.div`
  background: ${color.background};
  border: 1px solid ${color.border};
  border-radius: ${tokens.radius.card}px;
  overflow: hidden;
`;

export const Pill = styled.span`
  font-family: ${tokens.font.mono};
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${color.primarySoft};
  color: ${color.primaryStrong};
`;

export const Chip = styled.button<{ $active?: boolean }>`
  white-space: nowrap;
  cursor: pointer;
  font-family: ${tokens.font.mono};
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.$active ? color.primary : color.border)};
  background: ${(props) => (props.$active ? color.primary : color.background)};
  color: ${(props) => (props.$active ? "#fff" : color.textSoft)};
  &:hover:not(:disabled) {
    border-color: ${color.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${color.textSoft};
  span.label {
    font-family: ${tokens.font.mono};
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  input,
  select,
  textarea {
    border: 1px solid ${color.border};
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 16px; /* >=16px avoids iOS zoom-on-focus */
    color: ${color.textStrong};
    background: ${color.background};
    outline: none;
  }
  input:focus,
  select:focus,
  textarea:focus {
    border-color: ${color.primary};
  }
`;

export const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${color.border};
  background: ${color.background};
  color: ${color.textStrong};
  display: grid;
  place-items: center;
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: ${color.primary};
    color: ${color.primary};
  }
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${color.border};
  border-top-color: ${color.primary};
  animation: spin 0.7s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/** Section heading in the display face. */
export const Heading = styled.h2`
  font-family: ${tokens.font.heading};
  font-weight: 700;
  font-size: 24px;
  letter-spacing: -0.01em;
  margin: 0;
  text-wrap: balance;
`;
