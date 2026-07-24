import styled from "styled-components";
import { tokens } from "shared/tokens";

const color = tokens.color;

/** The form card shared by the login and signup screens. */
export const AuthCard = styled.form`
  background: ${color.background};
  border: 1px solid ${color.border};
  border-radius: ${tokens.radius.frame}px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  h1 {
    font-family: ${tokens.font.heading};
    font-size: 26px;
    margin: 0;
  }
  .sub {
    margin: -8px 0 4px;
    color: ${color.textSoft};
    font-size: 14px;
  }
  .error {
    margin: 0;
    background: ${color.dangerSoft};
    color: ${color.danger};
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 14px;
  }
  .switch {
    text-align: center;
    font-size: 14px;
    color: ${color.textSoft};
    margin: 4px 0 0;
  }
  .switch a {
    color: ${color.primary};
    font-weight: 600;
  }
`;
