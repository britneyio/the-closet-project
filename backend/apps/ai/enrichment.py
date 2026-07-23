"""Vision enrichment: turn a clothing item's photo into structured attributes and
a retrieval embedding.

This is the write half of the RAG pipeline (Step 3). It is provider-agnostic —
it goes through the AIProvider factory, so which vision/embedding model runs is a
pure env-config choice. The viewset (auto-enrich on upload) and the enrich_closet
management command (backfill / re-enrich) both call enrich_item(); neither knows
the concrete provider.

Design invariants:
  - Non-destructive: we write the AI columns + `attributes`, never `user_attributes`.
  - Idempotent: items with `enriched_at` are skipped unless force=True.
  - Best-effort: any failure logs and returns False; it must never break item CRUD
    or abort a batch mid-run.
"""
import logging
import os
from io import BytesIO

from django.utils import timezone
from PIL import Image, UnidentifiedImageError

from apps.ai.providers.factory import get_embedding_provider, get_provider
from apps.closet.models import ClothingItem

logger = logging.getLogger(__name__)

# Longest-side pixel cap for the transient copy sent to the vision model. Caps
# image-token cost and doubles as an upload sanity bound.
IMAGE_MAX_PX = int(os.environ.get("IMAGE_MAX_PX", "1024"))

# The columns on ClothingItem that the vision model fills directly. Any key the
# model returns outside this set lands in the `attributes` JSON catch-all.
ATTRIBUTE_COLUMNS = ("color", "style", "formality", "season", "pattern", "material")

# Instruction sent with the image. We ask for a strict JSON object with exactly
# these keys so the output maps cleanly onto the columns above (+ description).
# Values stay short and lowercase for consistent retrieval text.
VISION_PROMPT = (
    "You are tagging a single clothing item for a personal wardrobe app. "
    "Look at the image and respond with ONLY a JSON object, no prose, with these keys:\n"
    '  "color": dominant color(s), short phrase\n'
    '  "style": e.g. casual, formal, sporty, business-casual\n'
    '  "formality": one of casual, smart-casual, business, formal\n'
    '  "season": best season(s): spring, summer, fall, winter, or all-season\n'
    '  "pattern": e.g. solid, striped, plaid, floral, graphic\n'
    '  "material": best guess of the fabric, e.g. cotton, denim, wool, leather\n'
    '  "description": one natural sentence describing the item\n'
    "Use lowercase short values. If something is not visible, use your best guess. "
    "Return the JSON object only."
)


def resize_for_vision(image_bytes: bytes) -> bytes:
    """Downscale a copy of the image to IMAGE_MAX_PX on its longest side and
    re-encode as JPEG. Transient — the caller never persists this; the full-res
    original stays on disk. Raises ValueError if the bytes aren't a valid image
    (this doubles as upload validation)."""
    try:
        img = Image.open(BytesIO(image_bytes))
        img.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("cover_file is not a readable image") from exc

    # Flatten transparency/palette to RGB so JPEG encoding is always valid.
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")

    img.thumbnail((IMAGE_MAX_PX, IMAGE_MAX_PX))  # preserves aspect ratio, only shrinks

    out = BytesIO()
    img.save(out, format="JPEG", quality=85)
    return out.getvalue()


def build_enrichment_text(item: ClothingItem, attrs: dict) -> str:
    """The canonical string we embed — the item's retrieval surface. Built from
    the item name plus the vision attributes, so semantic search matches on
    meaning ('casual warm-weather top') rather than the raw filename."""
    parts = [item.name]
    for key in ATTRIBUTE_COLUMNS:
        value = attrs.get(key)
        if value:
            parts.append(f"{key}: {value}")
    description = attrs.get("description")
    if description:
        parts.append(str(description))
    return ". ".join(str(p) for p in parts if p)


def enrich_item(item: ClothingItem, *, force: bool = False) -> bool:
    """Enrich one ClothingItem in place: vision attributes + embedding + enriched_at.

    Returns True if the item was (re-)enriched and saved, False if it was skipped
    (already enriched, no photo) or a provider/parse error was swallowed. Never
    raises — callers rely on that to keep CRUD and batch runs alive.
    """
    if item.enriched_at and not force:
        return False
    if not item.cover_file:
        # cover_file is required at the model level, so its absence is anomalous.
        logger.warning("Item %s has no cover_file; skipping enrichment", item.pk)
        return False

    try:
        with item.cover_file.open("rb") as fh:
            original = fh.read()
        resized = resize_for_vision(original)

        attrs = get_provider().describe_image(resized, VISION_PROMPT)
        if not isinstance(attrs, dict):
            logger.warning("Item %s: vision output was not a dict; skipping", item.pk)
            return False

        # Map known keys onto columns; keep the rest in the JSON catch-all.
        for key in ATTRIBUTE_COLUMNS:
            if attrs.get(key):
                setattr(item, key, str(attrs[key])[:100])
        if attrs.get("description"):
            item.ai_description = str(attrs["description"])
        extra = {k: v for k, v in attrs.items()
                 if k not in ATTRIBUTE_COLUMNS and k != "description"}
        item.attributes = extra or None

        text = build_enrichment_text(item, attrs)
        item.embedding = get_embedding_provider().embed([text])[0]
        item.enriched_at = timezone.now()

        item.save(update_fields=[
            *ATTRIBUTE_COLUMNS, "ai_description", "attributes", "embedding", "enriched_at",
        ])
        return True
    except Exception:  # best-effort: never let enrichment break the caller
        logger.exception("Enrichment failed for item %s", item.pk)
        return False
