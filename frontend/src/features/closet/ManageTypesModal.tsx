import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { addType, removeType } from "shared/store/clothingTypesSlice";
import Modal from "../../ui/Modal";
import { Button, Field } from "../../ui";

const color = tokens.color;

/** Add or remove the user's clothing types. Types are user-owned; deleting one
    cascades to its items on the backend, so removal is confirmed first. */
export default function ManageTypesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const types = useAppSelector((state) => state.clothingTypes.types);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const add = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    if (types.some((type) => type.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" already exists.`);
      return;
    }
    setBusy(true);
    const result = await dispatch(addType(trimmed));
    setBusy(false);
    if (addType.fulfilled.match(result)) {
      setName("");
    } else {
      toast.error("Could not add that type.");
    }
  };

  const remove = async (id: number, typeName: string) => {
    if (!window.confirm(`Delete "${typeName}"? Items of this type will also be removed.`)) return;
    const result = await dispatch(removeType(id));
    if (!removeType.fulfilled.match(result)) toast.error("Could not delete that type.");
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage clothing types">
      <Form onSubmit={(event) => void add(event)}>
        <Field>
          <span className="label">New type</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Activewear"
            aria-label="New clothing type name"
          />
        </Field>
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add"}
        </Button>
      </Form>

      <List>
        {types.length === 0 ? (
          <Empty>No types yet. Add your first above.</Empty>
        ) : (
          types.map((type) => (
            <li key={type.id}>
              <span>{type.name}</span>
              <button type="button" onClick={() => void remove(type.id, type.name)} aria-label={`Delete ${type.name}`}>
                Remove
              </button>
            </li>
          ))
        )}
      </List>
    </Modal>
  );
}

const Form = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 18px;
  > div {
    flex: 1;
  }
`;
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border: 1px solid ${color.border};
    border-radius: 10px;
    font-size: 14px;
  }
  li button {
    border: 0;
    background: none;
    color: ${color.danger};
    font-family: ${tokens.font.mono};
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
  }
`;
const Empty = styled.p`
  color: ${color.textSoft};
  text-align: center;
  padding: 20px;
  margin: 0;
`;
