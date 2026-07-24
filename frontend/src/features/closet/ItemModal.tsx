import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { tokens } from "shared/tokens";
import { useAppDispatch } from "shared/store/hooks";
import { updateItem } from "shared/store/closetSlice";
import { errorMessage } from "shared/errors";
import type { ClothingItem, ClothingType } from "shared/domain";
import Modal from "../../ui/Modal";
import { Button, Field } from "../../ui";

const color = tokens.color;

// AI-enriched attributes, shown read-only (set by vision enrichment).
const AI_FIELDS: { key: keyof ClothingItem; label: string }[] = [
  { key: "color", label: "Color" },
  { key: "style", label: "Style" },
  { key: "formality", label: "Formality" },
  { key: "season", label: "Season" },
  { key: "pattern", label: "Pattern" },
  { key: "material", label: "Material" },
];

interface Props {
  item: ClothingItem;
  types: ClothingType[];
  mode: "info" | "edit";
  onClose: () => void;
}

/** Item detail: shows the user's own details + the AI-defined tags (info), or an
    inline form to edit the user-defined fields (edit). AI fields are read-only. */
export default function ItemModal({ item, types, mode, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(mode === "edit");
  const [name, setName] = useState(item.name);
  const [ctypeId, setCtypeId] = useState(String(item.ctype ?? ""));
  const [location, setLocation] = useState(item.location ?? "");
  const [price, setPrice] = useState(item.price ?? "");
  const [busy, setBusy] = useState(false);

  const typeName = types.find((type) => type.id === item.ctype)?.name;
  const aiTags = AI_FIELDS.map((field) => ({
    label: field.label,
    value: item[field.key] as string | null,
  })).filter((tag) => tag.value);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await dispatch(
        updateItem({
          id: item.id,
          input: {
            name,
            ctype: Number(ctypeId),
            location: location || undefined,
            price: price || undefined,
          },
        })
      );
      if (updateItem.fulfilled.match(result)) {
        toast.success("Saved.");
        onClose();
      } else {
        toast.error("Could not save changes.");
      }
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={editing ? "Edit item" : item.name}>
      {editing ? (
        <Form onSubmit={(event) => void save(event)}>
          <Field>
            <span className="label">Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </Field>
          <Field>
            <span className="label">Type</span>
            <select value={ctypeId} onChange={(event) => setCtypeId(event.target.value)} required>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <span className="label">Location</span>
            <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Where you keep it" />
          </Field>
          <Field>
            <span className="label">Price</span>
            <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" placeholder="e.g. 49.99" />
          </Field>
          <Button type="submit" $block disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </Form>
      ) : (
        <Info>
          {item.cover_file && <img src={item.cover_file} alt={item.name} />}
          <Group>Your details</Group>
          <dl>
            <div>
              <dt>Type</dt>
              <dd>{typeName ?? "—"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{item.location || "—"}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{item.price ? `$${item.price}` : "—"}</dd>
            </div>
            <div>
              <dt>Last worn</dt>
              <dd>{item.worn ?? "—"}</dd>
            </div>
          </dl>
          <Group>AI tags</Group>
          {aiTags.length === 0 ? (
            <Empty>Not tagged yet — auto-tagging runs when an AI key is configured.</Empty>
          ) : (
            <dl>
              {aiTags.map((tag) => (
                <div key={tag.label}>
                  <dt>{tag.label}</dt>
                  <dd>{tag.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {item.ai_description && <p className="desc">{item.ai_description}</p>}
          <Button $block onClick={() => setEditing(true)}>
            Edit
          </Button>
        </Info>
      )}
    </Modal>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  img {
    width: 100%;
    max-height: 260px;
    object-fit: cover;
    border-radius: 12px;
  }
  dl {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  dl > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 14px;
  }
  dt {
    color: ${color.textSoft};
  }
  dd {
    margin: 0;
    color: ${color.textStrong};
    text-align: right;
  }
  .desc {
    margin: 0;
    font-size: 14px;
    color: ${color.textSoft};
    font-style: italic;
  }
`;
const Group = styled.h4`
  font-family: ${tokens.font.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${color.textSoft};
  margin: 8px 0 0;
`;
const Empty = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${color.textSoft};
`;
