import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { fetchClothing, removeItem } from "shared/store/closetSlice";
import { fetchTypes } from "shared/store/clothingTypesSlice";
import type { ClothingItem } from "shared/domain";
import ItemCard from "./ItemCard";
import ItemModal from "./ItemModal";
import AddItemModal from "./AddItemModal";
import ManageTypesModal from "./ManageTypesModal";
import { useOnboardingTour } from "../onboarding/useOnboardingTour";
import { Button, Heading, Spinner } from "../../ui";

const color = tokens.color;

export default function ClosetPage() {
  useOnboardingTour();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.closet);
  const types = useAppSelector((state) => state.clothingTypes.types);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [selected, setSelected] = useState<{ item: ClothingItem; mode: "info" | "edit" } | null>(null);

  const deleteItem = async (item: ClothingItem) => {
    if (!window.confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    const result = await dispatch(removeItem(item.id));
    if (!removeItem.fulfilled.match(result)) toast.error("Could not delete the item.");
  };

  useEffect(() => {
    void dispatch(fetchClothing(1));
    void dispatch(fetchTypes());
  }, [dispatch]);

  const visible = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (activeType === null || item.ctype === activeType) &&
        (!searchTerm || item.name.toLowerCase().includes(searchTerm))
    );
  }, [items, query, activeType]);

  return (
    <Layout>
      <Sidebar aria-label="Clothing types">
        <h3>Clothing Types</h3>
        <button className={activeType === null ? "on" : ""} onClick={() => setActiveType(null)}>
          All items
        </button>
        {types.map((type) => (
          <button
            key={type.id}
            className={activeType === type.id ? "on" : ""}
            onClick={() => setActiveType(type.id)}
          >
            {type.name}
          </button>
        ))}
        <button className="add" data-tour="manage-types" onClick={() => setManageOpen(true)}>
          + Manage types
        </button>
      </Sidebar>

      <Content>
        <Search>
          <input
            data-tour="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your closet by name…"
            aria-label="Search closet"
          />
        </Search>

        <Nudge>
          <p>Do you need help deciding what to wear?</p>
          <Link to="/stylist">Ask your stylist</Link>
        </Nudge>

        <SectionHead>
          <Heading>My Closet</Heading>
          <Button data-tour="add-item" onClick={() => setAddOpen(true)}>Add item</Button>
        </SectionHead>

        {status === "loading" && items.length === 0 ? (
          <Center>
            <Spinner />
          </Center>
        ) : visible.length === 0 ? (
          <Empty>No items match. Try a different type or search.</Empty>
        ) : (
          <Grid>
            {visible.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                typeName={types.find((type) => type.id === item.ctype)?.name}
                onOpen={(mode) => setSelected({ item, mode })}
                onDelete={() => void deleteItem(item)}
              />
            ))}
          </Grid>
        )}
      </Content>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ManageTypesModal open={manageOpen} onClose={() => setManageOpen(false)} />
      {selected && (
        <ItemModal
          item={selected.item}
          types={types}
          mode={selected.mode}
          onClose={() => setSelected(null)}
        />
      )}
    </Layout>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: calc(100dvh - 68px);
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Sidebar = styled.nav`
  border-right: 1px solid ${color.border};
  padding: 24px 16px;
  h3 {
    font-family: ${tokens.font.heading};
    font-size: 15px;
    margin: 0 0 14px;
  }
  button {
    display: block;
    width: 100%;
    text-align: left;
    border: 1px solid ${color.border};
    background: ${color.background};
    color: ${color.textSoft};
    font-family: ${tokens.font.mono};
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 9px 12px;
    border-radius: 10px;
    margin-bottom: 6px;
    cursor: pointer;
  }
  button.on {
    background: ${color.primary};
    border-color: ${color.primary};
    color: #fff;
  }
  button.add {
    border-style: dashed;
    color: ${color.primary};
    border-color: ${color.primary};
    background: ${color.background};
    margin-top: 8px;
  }
  @media (max-width: 800px) {
    border-right: 0;
    border-bottom: 1px solid ${color.border};
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 12px 16px;
    h3 {
      display: none;
    }
    button {
      width: auto;
      white-space: nowrap;
      margin: 0;
    }
  }
`;
const Content = styled.div`
  padding: 26px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;
const Search = styled.div`
  input {
    width: 100%;
    border: 2px solid ${color.textStrong};
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 16px;
    outline: none;
    color: ${color.textStrong};
  }
`;
const Nudge = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 0 24px;
  padding: 15px 18px;
  background: ${color.primarySoft};
  border-left: 3px solid ${color.primary};
  border-radius: 10px;
  p {
    margin: 0;
    font-size: 14px;
    flex: 1;
  }
  a {
    white-space: nowrap;
    font-family: ${tokens.font.mono};
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: ${color.textStrong};
    color: #fff;
    padding: 9px 14px;
    border-radius: 9px;
    text-decoration: none;
  }
`;
const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 6px 0 16px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const Center = styled.div`
  display: grid;
  place-items: center;
  padding: 60px;
`;
const Empty = styled.p`
  color: ${color.textSoft};
  text-align: center;
  padding: 40px;
`;
