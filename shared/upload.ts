// Client-side image upload guard. This is a UX + abuse-reduction layer, NOT a
// security boundary — the backend must still validate (it re-encodes via the
// vision resize step). Allow-list by extension AND MIME so a renamed file is
// caught. HEIC often has an empty MIME in browsers, so extension is the fallback.

export const ALLOWED_IMAGE_EXT = ["jpg", "jpeg", "png", "heic", "heif"] as const;
export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
];
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB

export interface UploadCandidate {
  name: string;
  size: number;
  type: string;
}

/** Returns an error message if the file is not an allowed image, else null. */
export function validateImage(file: UploadCandidate): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const extOk = (ALLOWED_IMAGE_EXT as readonly string[]).includes(ext);
  // Some platforms report "" for HEIC; accept when the extension vouches for it.
  const mimeOk = file.type === "" ? extOk : ALLOWED_IMAGE_MIME.includes(file.type);

  if (!extOk || !mimeOk) return "Please choose a JPEG, PNG, or HEIC image.";
  if (file.size > MAX_IMAGE_BYTES) return "That image is larger than 15 MB.";
  return null;
}
