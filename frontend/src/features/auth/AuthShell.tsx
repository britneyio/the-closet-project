import { Link } from "react-router-dom";
import styled from "styled-components";
import { tokens } from "shared/tokens";

const color = tokens.color;

/** Shared centered layout + form card for the login and signup screens. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <Wrap>
      <Brand to="/">
        The Closet <b>Project</b>
      </Brand>
      {children}
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 24px;
  background: ${color.surface};
`;
const Brand = styled(Link)`
  font-family: ${tokens.font.heading};
  font-weight: 700;
  font-size: 22px;
  text-decoration: none;
  color: ${color.textStrong};
  b {
    color: ${color.primary};
  }
`;
