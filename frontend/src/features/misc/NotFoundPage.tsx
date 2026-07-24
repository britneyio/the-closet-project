import { Link } from "react-router-dom";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { Button } from "../../ui";

export default function NotFoundPage() {
  return (
    <Wrap>
      <h1>404</h1>
      <p>This page doesn't exist.</p>
      <Button as={Link} to="/">
        Back home
      </Button>
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100dvh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  text-align: center;
  h1 {
    font-family: ${tokens.font.heading};
    font-size: 72px;
    margin: 0;
    color: ${tokens.color.primary};
  }
  p {
    color: ${tokens.color.textSoft};
    margin: 0 0 8px;
  }
`;
