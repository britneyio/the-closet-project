import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "shared/store/hooks";
import { addItem } from "shared/store/closetSlice";
import { validateImage } from "shared/upload";
import Modal from "../../ui/Modal";
import { Button, Field } from "../../ui";

export default function AddItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const types = useAppSelector((state) => state.clothingTypes.types);
  const [name, setName] = useState("");
  const [ctypeId, setCtypeId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !ctypeId) return;
    setSaving(true);
    const result = await dispatch(
      addItem({ name, ctype: Number(ctypeId), cover_file: file ?? undefined })
    );
    setSaving(false);
    if (addItem.fulfilled.match(result)) {
      toast.success("Item added — tagging in the background.");
      setName("");
      setCtypeId("");
      setFile(null);
      onClose();
    } else {
      toast.error("Could not add the item.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add an item">
      <form onSubmit={(event) => void submit(event)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field>
          <span className="label">Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </Field>
        <Field>
          <span className="label">Type</span>
          <select value={ctypeId} onChange={(event) => setCtypeId(event.target.value)} required>
            <option value="" disabled>
              Choose a type…
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <span className="label">Photo</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
            onChange={(event) => {
              const picked = event.target.files?.[0] ?? null;
              if (picked) {
                const problem = validateImage(picked);
                if (problem) {
                  toast.error(problem);
                  event.target.value = "";
                  setFile(null);
                  return;
                }
              }
              setFile(picked);
            }}
          />
        </Field>
        <Button type="submit" $block disabled={saving}>
          {saving ? "Adding…" : "Add to closet"}
        </Button>
      </form>
    </Modal>
  );
}
