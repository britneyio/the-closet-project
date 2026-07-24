// Named endpoint functions mapping 1:1 to the Django REST routes, typed against
// the domain contract. Both apps call these — URLs and payload shapes live here.
import api from "./client";
import type {
  AppNotification,
  ChatResponse,
  ClothingItem,
  ClothingItemInput,
  ClothingType,
  Outfit,
  OutfitInput,
  Paginated,
  RecommendResponse,
  User,
  UserProfile,
} from "../domain";

// --- Auth (Djoser; LOGIN_FIELD is email) ---
// Web only: fetch the csrftoken cookie before the first state-changing request.
export const fetchCsrf = () => api.get<void>("/api/v1/auth/csrf/");
export const login = (email: string, password: string) =>
  api.post<{ auth_token: string }>("/api/v1/token/login/", { email, password });
export const logout = () => api.post<void>("/api/v1/token/logout/");
export const register = (email: string, username: string, password: string) =>
  api.post<User>("/api/v1/auth/users/", { email, username, password });
export const currentUser = () => api.get<User>("/api/v1/auth/users/me/");

// --- Account (djoser user management, mounted under /auth/) ---
export const changePassword = (currentPassword: string, newPassword: string) =>
  api.post<void>("/api/v1/auth/users/set_password/", {
    current_password: currentPassword,
    new_password: newPassword,
  });
export const deleteAccount = (currentPassword: string) =>
  api.del<void>("/api/v1/auth/users/me/", { current_password: currentPassword });

// --- Profile ---
export const getProfile = () => api.get<UserProfile>("/api/v1/profile/");
export const updateProfile = (patch: Partial<UserProfile>) =>
  api.patch<UserProfile>("/api/v1/profile/", patch);

// --- Clothing types ---
export const listTypes = () =>
  api.get<Paginated<ClothingType> | ClothingType[]>("/api/v1/clothingtype/");
export const createType = (name: string) =>
  api.post<ClothingType>("/api/v1/clothingtype/", { name });
export const updateType = (id: number, name: string) =>
  api.patch<ClothingType>(`/api/v1/clothingtype/${id}/`, { name });
export const deleteType = (id: number) => api.del<void>(`/api/v1/clothingtype/${id}/`);

// --- Clothing items ---
export const listClothing = (page = 1) =>
  api.get<Paginated<ClothingItem>>(`/api/v1/clothing/?page=${page}`);

function itemToForm(input: ClothingItemInput): FormData {
  const form = new FormData();
  form.append("name", input.name);
  if (input.ctype != null) form.append("ctype", String(input.ctype));
  if (input.location != null) form.append("location", input.location);
  if (input.price != null) form.append("price", input.price);
  if (input.worn != null) form.append("worn", String(input.worn));
  if (input.cover_file) form.append("cover_file", input.cover_file as Blob);
  return form;
}

export const createClothing = (input: ClothingItemInput) =>
  api.postForm<ClothingItem>("/api/v1/clothing/", itemToForm(input));
export const updateClothing = (id: number, input: Partial<ClothingItemInput>) =>
  api.patchForm<ClothingItem>(`/api/v1/clothing/${id}/`, itemToForm(input as ClothingItemInput));
export const deleteClothing = (id: number) => api.del<void>(`/api/v1/clothing/${id}/`);

// --- Outfits ---
export const listOutfits = () =>
  api.get<Paginated<Outfit> | Outfit[]>("/api/v1/outfit/");
export const createOutfit = (input: OutfitInput) =>
  api.post<Outfit>("/api/v1/outfit/", input);
export const updateOutfit = (id: number, input: Partial<OutfitInput>) =>
  api.patch<Outfit>(`/api/v1/outfit/${id}/`, input);
export const deleteOutfit = (id: number) => api.del<void>(`/api/v1/outfit/${id}/`);

// --- Notifications ---
export const listNotifications = () =>
  api.get<Paginated<AppNotification> | AppNotification[]>("/api/v1/notifications/");
export const markNotificationRead = (id: number, read = true) =>
  api.patch<AppNotification>(`/api/v1/notifications/${id}/`, { read });
export const markAllNotificationsRead = () =>
  api.post<void>("/api/v1/notifications/mark_all_read/");

// --- AI: Stylist chat (Step 5) ---
export const sendChat = (message: string, conversationId?: number | null) =>
  api.post<ChatResponse>("/api/v1/ai/chat/", {
    message,
    ...(conversationId ? { conversation_id: conversationId } : {}),
  });

// --- AI: Outfit recommender (Step 6) ---
export const recommend = (
  query: string,
  opts: { persist?: boolean; maxOutfits?: number } = {}
) =>
  api.post<RecommendResponse>("/api/v1/ai/recommend/", {
    query,
    persist: opts.persist ?? false,
    max_outfits: opts.maxOutfits ?? 3,
  });

// Helper: unwrap a DRF list that may or may not be paginated.
export function unwrapList<T>(data: Paginated<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}
