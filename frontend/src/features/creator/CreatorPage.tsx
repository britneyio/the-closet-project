import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchClothing } from "shared/store/closetSlice";
import { addOutfit } from "shared/store/outfitsSlice";
import type { ClothingItem } from "shared/domain";
import { Button, Chip } from "../../ui";

const color = tokens.color;

interface Placed {
  key: string;
  item: ClothingItem;
  x: number;
  y: number;
}

export default function CreatorPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.closet.items);
  const [mode, setMode] = useState<"mannequin" | "photo">("mannequin");
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("New outfit");
  const canvasRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ key: string; dx: number; dy: number } | null>(null);

  useEffect(() => {
    if (items.length === 0) void dispatch(fetchClothing(1));
  }, [dispatch, items.length]);

  const tray = items.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()));

  const add = (item: ClothingItem) =>
    setPlaced((prev) => [...prev, { key: `${item.id}-${prev.length}`, item, x: 60, y: 60 }]);

  const onPointerDown = (event: React.PointerEvent, key: string) => {
    const piece = placed.find((candidate) => candidate.key === key);
    if (!piece) return;
    drag.current = { key, dx: event.clientX - piece.x, dy: event.clientY - piece.y };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const dragState = drag.current;
    if (!dragState) return;
    setPlaced((prev) =>
      prev.map((piece) =>
        piece.key === dragState.key
          ? { ...piece, x: event.clientX - dragState.dx, y: event.clientY - dragState.dy }
          : piece
      )
    );
  };
  const onPointerUp = () => (drag.current = null);

  const save = async () => {
    if (placed.length === 0) {
      toast.info("Add a few items first.");
      return;
    }
    const items_id = [...new Set(placed.map((piece) => piece.item.id))];
    const result = await dispatch(addOutfit({ name: name || "New outfit", items_id }));
    if (addOutfit.fulfilled.match(result)) {
      toast.success("Outfit saved.");
      setPlaced([]);
    } else {
      toast.error("Could not save the outfit.");
    }
  };

  return (
    <Layout>
      <Main>
        <Canvas
          ref={canvasRef}
          $mode={mode}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {mode === "mannequin" && <Figure />}
          {placed.length === 0 && <Hint>Add items from the panel, then drag to arrange.</Hint>}
          {placed.map((piece) => (
            <Piece
              key={piece.key}
              style={{ left: piece.x, top: piece.y }}
              onPointerDown={(event) => onPointerDown(event, piece.key)}
            >
              {piece.item.cover_file ? <img src={piece.item.cover_file} alt={piece.item.name} /> : <span>{piece.item.name}</span>}
            </Piece>
          ))}
        </Canvas>
      </Main>

      <Side aria-label="Outfit controls and items">
        <Tools>
          <Chip $active={mode === "mannequin"} onClick={() => setMode("mannequin")}>
            Mannequin
          </Chip>
          <Chip $active={mode === "photo"} onClick={() => setMode("photo")}>
            My photo
          </Chip>
        </Tools>
        <input
          className="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="Outfit name"
          placeholder="Outfit name"
        />
        <Button $block onClick={() => void save()}>
          Save outfit
        </Button>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search items…"
          aria-label="Search your items"
        />
        <div className="grid">
          {tray.map((item) => (
            <button key={item.id} onClick={() => add(item)} title={`Add ${item.name}`} aria-label={`Add ${item.name}`}>
              {item.cover_file ? <img src={item.cover_file} alt="" /> : <span>{item.name}</span>}
            </button>
          ))}
        </div>
      </Side>
    </Layout>
  );
}

// Canvas-first layout: the creating space fills the viewport (below the 68px
// app header) and never scrolls the page; only the item grid in the right panel
// scrolls. On phones it stacks: canvas on top, controls below.
const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100dvh - 68px);
  overflow: hidden;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    height: auto;
    overflow: visible;
  }
`;
const Main = styled.div`
  order: 2; /* canvas on the right */
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 18px 22px;
  @media (max-width: 800px) {
    order: 1; /* canvas on top when stacked */
    height: 62vh;
  }
`;
const Side = styled.div`
  order: 1; /* controls panel on the left */
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 10px;
  padding: 18px 16px;
  border-right: 1px solid ${color.border};
  input {
    width: 100%;
    border: 1px solid ${color.border};
    border-radius: 10px;
    padding: 10px 12px;
    font-size: 15px;
    outline: none;
  }
  input:focus {
    border-color: ${color.primary};
  }
  /* Only the item grid scrolls, so the page itself never does. */
  .grid {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    align-content: start;
  }
  .grid button {
    aspect-ratio: 4 / 5;
    border-radius: 10px;
    border: 1px solid ${color.border};
    background: ${color.surface};
    cursor: pointer;
    overflow: hidden;
    padding: 0;
  }
  .grid button img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .grid button span {
    font-family: ${tokens.font.mono};
    font-size: 9px;
    text-transform: uppercase;
    color: ${color.textSoft};
  }
  @media (max-width: 800px) {
    order: 2; /* controls below the canvas when stacked */
    border-right: 0;
    border-top: 1px solid ${color.border};
  }
`;
const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
const Canvas = styled.div<{ $mode: string }>`
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 16px;
  border: 1px solid ${color.border};
  overflow: hidden;
  background: ${(props) => (props.$mode === "photo" ? color.surface : "#F7F4F3")};
  touch-action: none;
`;
const Figure = styled.div`
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translateX(-50%);
  width: 150px;
  height: 330px;
  border-radius: 75px 75px 36px 36px;
  background: color-mix(in srgb, ${color.textSoft} 18%, transparent);
`;
const Hint = styled.div`
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${tokens.font.mono};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${color.textSoft};
  background: ${color.background};
  border: 1px dashed ${color.border};
  border-radius: 8px;
  padding: 6px 12px;
  text-align: center;
`;
const Piece = styled.div`
  position: absolute;
  width: 92px;
  height: 108px;
  border-radius: 12px;
  border: 2px solid ${color.background};
  box-shadow: 0 18px 44px -26px rgba(23, 19, 20, 0.6);
  cursor: grab;
  overflow: hidden;
  background: ${color.surface};
  display: grid;
  place-items: center;
  touch-action: none;
  &:active {
    cursor: grabbing;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
  span {
    font-family: ${tokens.font.mono};
    font-size: 9px;
    text-transform: uppercase;
    color: ${color.textSoft};
    pointer-events: none;
  }
`;
