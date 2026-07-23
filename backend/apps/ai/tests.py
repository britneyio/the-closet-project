"""Tests for the vision-enrichment service. A fake provider stands in for the
real vision/embedding models, so these run offline and deterministically."""
from io import BytesIO

import pytest
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from apps.ai import enrichment
from apps.ai.enrichment import build_enrichment_text, enrich_item, resize_for_vision
from apps.closet.models import ClothingItem, ClothingType

EMBED_DIM = 1024


def _png_bytes(size=(50, 50), color=(120, 30, 200)):
    buf = BytesIO()
    Image.new("RGB", size, color).save(buf, format="PNG")
    return buf.getvalue()


class FakeProvider:
    """Stands in for both the vision provider and the embedding provider."""

    def __init__(self, attrs):
        self._attrs = attrs

    def describe_image(self, image, prompt):
        return self._attrs

    def embed(self, texts):
        return [[0.1] * EMBED_DIM for _ in texts]


@pytest.fixture
def item(db):
    user = User.objects.create_user(username="alice", email="a@example.com", password="pw")
    ctype = ClothingType.objects.create(user=user, name="Tops")
    return ClothingItem.objects.create(
        user=user, name="Blue Shirt", ctype=ctype,
        cover_file=SimpleUploadedFile("shirt.png", _png_bytes(), content_type="image/png"),
    )


@pytest.fixture
def fake_ai(monkeypatch):
    """Point enrich_item at a fake provider returning known attributes."""
    provider = FakeProvider({
        "color": "blue", "style": "casual", "formality": "casual",
        "season": "all-season", "pattern": "solid", "material": "cotton",
        "description": "a plain blue cotton t-shirt",
        "sleeve": "short",  # extra key -> lands in attributes JSON
    })
    monkeypatch.setattr(enrichment, "get_provider", lambda: provider)
    monkeypatch.setattr(enrichment, "get_embedding_provider", lambda: provider)
    return provider


def test_resize_shrinks_large_image_and_returns_jpeg():
    out = resize_for_vision(_png_bytes(size=(4000, 2000)))
    img = Image.open(BytesIO(out))
    assert img.format == "JPEG"
    assert max(img.size) <= enrichment.IMAGE_MAX_PX


def test_resize_rejects_non_image():
    with pytest.raises(ValueError):
        resize_for_vision(b"this is not an image")


def test_build_enrichment_text_includes_name_and_attrs():
    class Stub:
        name = "Blue Shirt"
    text = build_enrichment_text(Stub(), {"color": "blue", "description": "a tee"})
    assert "Blue Shirt" in text
    assert "color: blue" in text
    assert "a tee" in text


@pytest.mark.django_db
def test_enrich_item_maps_columns_extras_and_embedding(item, fake_ai):
    assert enrich_item(item) is True
    item.refresh_from_db()
    assert item.color == "blue"
    assert item.material == "cotton"
    assert item.ai_description == "a plain blue cotton t-shirt"
    assert item.attributes == {"sleeve": "short"}  # unknown key -> catch-all
    assert item.enriched_at is not None
    assert len(item.embedding) == EMBED_DIM


@pytest.mark.django_db
def test_enrich_item_is_idempotent_unless_forced(item, fake_ai):
    assert enrich_item(item) is True
    stamp = ClothingItem.objects.get(pk=item.pk).enriched_at
    fresh = ClothingItem.objects.get(pk=item.pk)
    assert enrich_item(fresh) is False          # already enriched -> skip
    assert enrich_item(fresh, force=True) is True  # force re-runs
    assert ClothingItem.objects.get(pk=item.pk).enriched_at >= stamp


@pytest.mark.django_db
def test_enrich_item_never_leaves_user_attributes_touched(item, fake_ai):
    item.user_attributes = {"fit": "slim"}
    item.save(update_fields=["user_attributes"])
    enrich_item(item, force=True)
    item.refresh_from_db()
    assert item.user_attributes == {"fit": "slim"}  # manual edits preserved


@pytest.mark.django_db
def test_enrich_item_swallows_provider_errors(item, monkeypatch):
    def boom():
        raise RuntimeError("provider down")
    monkeypatch.setattr(enrichment, "get_provider", boom)
    assert enrich_item(item) is False           # error swallowed
    item.refresh_from_db()
    assert item.enriched_at is None             # nothing persisted
