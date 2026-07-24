import { describe, it, expect } from "vitest";
import reducer, { fetchClothing, addItem, removeItem, type ClosetState } from "./closetSlice";
import type { ClothingItem } from "../domain";

const item = (id: number, name: string): ClothingItem => ({
  id,
  name,
  worn: "2026-01-01",
  ctype: 1,
  location: null,
  cover_file: null,
  price: null,
  color: null,
  style: null,
  formality: null,
  season: null,
  pattern: null,
  material: null,
  ai_description: null,
  attributes: null,
  enriched_at: null,
});

const initial: ClosetState = { items: [], count: 0, status: "idle", error: null };

describe("closet reducer", () => {
  it("starts empty", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  it("loads a page of items and the total count", () => {
    const page = { count: 2, next: null, previous: null, results: [item(1, "Shirt"), item(2, "Jeans")] };
    const next = reducer(initial, fetchClothing.fulfilled(page, "rid", 1));
    expect(next.status).toBe("succeeded");
    expect(next.items).toHaveLength(2);
    expect(next.count).toBe(2);
  });

  it("prepends a newly added item and bumps the count", () => {
    const start = { ...initial, items: [item(1, "Shirt")], count: 1 };
    const next = reducer(start, addItem.fulfilled(item(2, "Coat"), "rid", { name: "Coat", ctype: 4 }));
    expect(next.items[0].name).toBe("Coat");
    expect(next.count).toBe(2);
  });

  it("removes an item and decrements the count", () => {
    const start = { ...initial, items: [item(1, "Shirt"), item(2, "Coat")], count: 2 };
    const next = reducer(start, removeItem.fulfilled(1, "rid", 1));
    expect(next.items.map((item) => item.id)).toEqual([2]);
    expect(next.count).toBe(1);
  });

  it("records a fetch failure", () => {
    const next = reducer(initial, {
      type: fetchClothing.rejected.type,
      payload: "Network down",
    });
    expect(next.status).toBe("failed");
    expect(next.error).toBe("Network down");
  });
});
