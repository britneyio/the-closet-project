import React, { useEffect } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";

const color = tokens.color;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/** Accessible dialog: closes on Escape / backdrop click, labelled by its title. */
export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Backdrop onClick={onClose}>
      <Panel
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <h3>{title}</h3>
          <Close type="button" onClick={onClose} aria-label="Close dialog">
            &times;
          </Close>
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(36, 28, 23, 0.4);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 100;
`;
const Panel = styled.div`
  background: ${color.background};
  border-radius: ${tokens.radius.frame}px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 70px -30px rgba(36, 28, 23, 0.5);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid ${color.border};
  h3 {
    margin: 0;
    font-family: ${tokens.font.heading};
    font-size: 18px;
  }
`;
const Close = styled.button`
  border: 0;
  background: none;
  font-size: 26px;
  line-height: 1;
  color: ${color.textSoft};
  cursor: pointer;
`;
const Body = styled.div`
  padding: 20px;
`;
