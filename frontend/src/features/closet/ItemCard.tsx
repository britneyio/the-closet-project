import { useState } from "react";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import type { ClothingItem } from "shared/domain";
import { Card, Pill } from "../../ui";

const color = tokens.color;

interface Props {
  item: ClothingItem;
  typeName?: string;
  onOpen: (mode: "info" | "edit") => void;
  onDelete: () => void;
}

export default function ItemCard({ item, typeName, onOpen, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tags = [item.color, item.season, item.formality].filter(Boolean) as string[];

  const choose = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <StyledCard>
      <Menu>
        <button
          className="dots"
          type="button"
          aria-label="Item actions"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ⋯
        </button>
        {menuOpen && (
          <div className="sheet" role="menu">
            <button type="button" role="menuitem" onClick={() => choose(() => onOpen("info"))}>
              Info
            </button>
            <button type="button" role="menuitem" onClick={() => choose(() => onOpen("edit"))}>
              Edit
            </button>
            <button type="button" role="menuitem" className="danger" onClick={() => choose(onDelete)}>
              Delete
            </button>
          </div>
        )}
      </Menu>

      <Thumb type="button" onClick={() => onOpen("info")} aria-label={`Open ${item.name}`}>
        {item.cover_file ? <img src={item.cover_file} alt={item.name} /> : <span>{item.name}</span>}
      </Thumb>
      <Body>
        <h4>{item.name}</h4>
        <div className="tags">
          {typeName && <Pill>{typeName}</Pill>}
          {tags.slice(0, 2).map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </Body>
    </StyledCard>
  );
}

const StyledCard = styled(Card)`
  position: relative;
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 44px -26px rgba(23, 19, 20, 0.5);
  }
`;
const Menu = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  .dots {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: ${color.textStrong};
    background: ${color.background};
    box-shadow: 0 2px 8px -2px rgba(23, 19, 20, 0.4);
  }
  .sheet {
    position: absolute;
    top: 34px;
    right: 0;
    display: flex;
    flex-direction: column;
    min-width: 120px;
    background: ${color.background};
    border: 1px solid ${color.border};
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 12px 30px -12px rgba(23, 19, 20, 0.4);
  }
  .sheet button {
    border: 0;
    background: none;
    text-align: left;
    padding: 10px 14px;
    font-size: 14px;
    cursor: pointer;
    color: ${color.textStrong};
  }
  .sheet button:hover {
    background: ${color.surface};
  }
  .sheet button.danger {
    color: ${color.danger};
  }
`;
const Thumb = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  aspect-ratio: 4 / 5;
  background: ${color.surface};
  display: grid;
  place-items: center;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  span {
    font-family: ${tokens.font.mono};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${color.textSoft};
  }
`;
const Body = styled.div`
  padding: 14px 16px 17px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  h4 {
    font-family: ${tokens.font.heading};
    font-weight: 700;
    font-size: 16px;
    margin: 0;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
`;
