// Domain types — the API contract, mirroring the Django REST serializers.
// Shared by both apps so a backend shape change surfaces as a compile error
// everywhere rather than a silent runtime bug.

/** apps/closet :: ClothingTypeSerializer */
export interface ClothingType {
  id: number;
  name: string;
}

/** apps/closet :: ClothingItemSerializer. `ctype` is the type's id
    (PrimaryKeyRelatedField); resolve the name from the loaded types list. */
export interface ClothingItem {
  id: number;
  name: string;
  worn: string;
  ctype: number | null;
  location: string | null;
  cover_file: string | null;
  price: string | null;
  // AI-enriched, read-only
  color: string | null;
  style: string | null;
  formality: string | null;
  season: string | null;
  pattern: string | null;
  material: string | null;
  ai_description: string | null;
  attributes: Record<string, unknown> | null;
  enriched_at: string | null;
}

/** Payload for creating/updating an item (multipart on the wire). The type is
    referenced by its id (`ctype`), matching the serializer. */
export interface ClothingItemInput {
  name: string;
  ctype: number;
  location?: string;
  price?: string;
  cover_file?: File | Blob;
  worn?: number;
}

/** apps/closet :: OutfitSerializer */
export interface Outfit {
  id: number;
  name: string;
  about: string;
  worn: number;
  items: ClothingItem[];
}

export interface OutfitInput {
  name: string;
  about?: string;
  items_id: number[];
}

/** apps/ai :: ReferencedItemSerializer (thumbnail shape used in chat/recommend) */
export interface ReferencedItem {
  id: number;
  name: string;
  cover_file: string | null;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  referenced_items?: ReferencedItem[];
}

/** Response of POST /api/v1/ai/chat/ (ChatView). */
export interface ChatResponse {
  reply: string;
  conversation_id: number;
  referenced_items: ReferencedItem[];
}

/** One composed outfit from POST /api/v1/ai/recommend/ (RecommendView). */
export interface RecommendedOutfit {
  name: string;
  reasoning: string;
  items: ReferencedItem[];
  id?: number; // present only when persist=true
}

export interface RecommendResponse {
  outfits: RecommendedOutfit[];
}

/** Djoser current user (auth/users/me/). */
export interface User {
  id: number;
  username: string;
  email: string;
}

/** apps/accounts :: UserProfileSerializer */
export interface UserProfile {
  body_photo: string | null;
  location: string | null;
  remove_background: boolean;
  has_onboarded: boolean;
  email_recommendations: boolean;
  email_updates: boolean;
  sms_opt_in: boolean;
  phone_number: string | null;
}

/** apps/notifications :: NotificationSerializer */
export interface AppNotification {
  id: number;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

/** DRF paginated list envelope. */
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
