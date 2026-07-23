"""Tests for the vision-enrichment service. A fake provider stands in for the
real vision/embedding models, so these run offline and deterministically."""
from io import BytesIO

import pytest
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient

from apps.ai import chat as chat_module
from apps.ai import enrichment
from apps.ai import vectorstore as vs_module
from apps.ai.chat import SYSTEM_PROMPT
from apps.ai.enrichment import build_enrichment_text, enrich_item, resize_for_vision
from apps.ai.models import ChatMessage, Conversation
from apps.ai.providers.base import ProviderError
from apps.ai.vectorstore import VectorStore
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


# ── VectorStore: real pgvector cosine retrieval (Step 4) ──────────────────────
# Hand-set embeddings so ranking is deterministic and no embedding model is called.

def make_unit_vector(axis):
    """A 1024-dim one-hot vector along `axis`. One-hot vectors on different axes
    are orthogonal, so cosine distance cleanly separates them."""
    v = [0.0] * EMBED_DIM
    v[axis] = 1.0
    return v


def make_item(owner, name, embedding):
    ctype = ClothingType.objects.create(user=owner, name="Tops")
    return ClothingItem.objects.create(
        user=owner, name=name, ctype=ctype, cover_file="x.jpg", embedding=embedding,
    )


@pytest.fixture
def alice(db):
    return User.objects.create_user(username="alice", email="a@example.com", password="pw")


@pytest.mark.django_db
def test_retrieve_ranks_by_cosine_distance(alice):
    near = make_item(alice, "near", make_unit_vector(0))
    far = make_item(alice, "far", make_unit_vector(1))

    results = list(VectorStore(alice).retrieve(make_unit_vector(0), k=5))

    assert [i.name for i in results] == ["near", "far"]  # closest first
    assert results[0].pk == near.pk and results[1].pk == far.pk


@pytest.mark.django_db
def test_retrieve_is_user_scoped(alice):
    bob = User.objects.create_user(username="bob", email="b@example.com", password="pw")
    make_item(alice, "mine", make_unit_vector(0))
    make_item(bob, "theirs", make_unit_vector(0))  # identical embedding, different owner

    results = list(VectorStore(alice).retrieve(make_unit_vector(0), k=5))

    assert [i.name for i in results] == ["mine"]  # never leaks another user's item


@pytest.mark.django_db
def test_retrieve_excludes_unenriched_items(alice):
    make_item(alice, "enriched", make_unit_vector(0))
    make_item(alice, "no_embedding", None)  # not yet enriched

    results = list(VectorStore(alice).retrieve(make_unit_vector(0), k=5))

    assert [i.name for i in results] == ["enriched"]


@pytest.mark.django_db
def test_retrieve_respects_k(alice):
    for i in range(5):
        make_item(alice, f"item{i}", make_unit_vector(i))

    assert len(list(VectorStore(alice).retrieve(make_unit_vector(0), k=3))) == 3


@pytest.mark.django_db
def test_search_embeds_query_then_retrieves(alice, monkeypatch):
    """search() embeds the text with the provider, then delegates to retrieve()."""
    make_item(alice, "target", make_unit_vector(7))

    class FakeEmbedder:
        def embed(self, texts):
            return [make_unit_vector(7) for _ in texts]

    monkeypatch.setattr(vs_module, "get_embedding_provider", lambda: FakeEmbedder())

    results = list(VectorStore(alice).search("anything", k=1))

    assert results[0].name == "target"


# ── Chat service + endpoint (Step 5) ──────────────────────────────────────────
# Fake chat provider + fake retriever so no network / embedding model is called.

class RecordingProvider:
    """Captures the last chat() call so tests can assert on prompt assembly."""

    def __init__(self, reply="Here's an outfit idea."):
        self.reply = reply
        self.last_messages = None
        self.last_system = None

    def chat(self, messages, system=None):
        self.last_messages = messages
        self.last_system = system
        return self.reply


def _patch_chat(monkeypatch, provider, items):
    """Wire chat.run_chat to a fake provider and a fake retriever returning `items`."""
    class FakeVectorStore:
        def __init__(self, user):
            pass

        def search(self, query_text, k=5):
            return items

    monkeypatch.setattr(chat_module, "get_provider", lambda: provider)
    monkeypatch.setattr(chat_module, "VectorStore", FakeVectorStore)


@pytest.mark.django_db
def test_chat_persists_both_turns_and_links_items(alice, monkeypatch):
    item = make_item(alice, "Blue Shirt", make_unit_vector(0))
    _patch_chat(monkeypatch, RecordingProvider(), [item])

    client = APIClient()
    client.force_authenticate(user=alice)
    resp = client.post("/api/v1/ai/chat/", {"message": "what can I wear?"}, format="json")

    assert resp.status_code == 200
    assert resp.data["reply"] == "Here's an outfit idea."
    conv = Conversation.objects.get(id=resp.data["conversation_id"])
    roles = list(conv.messages.order_by("created_at").values_list("role", flat=True))
    assert roles == ["user", "assistant"]
    assistant = conv.messages.get(role="assistant")
    assert list(assistant.referenced_items.all()) == [item]
    assert resp.data["referenced_items"][0]["name"] == "Blue Shirt"


@pytest.mark.django_db
def test_chat_grounds_user_block_and_keeps_system_trusted(alice, monkeypatch):
    item = make_item(alice, "Red Dress", make_unit_vector(1))
    provider = RecordingProvider()
    _patch_chat(monkeypatch, provider, [item])

    client = APIClient()
    client.force_authenticate(user=alice)
    client.post("/api/v1/ai/chat/", {"message": "dinner outfit?"}, format="json")

    # System prompt is the fixed trusted one — item data never rides in it.
    assert provider.last_system == SYSTEM_PROMPT
    assert "Red Dress" not in provider.last_system
    # Retrieved item lands in the final user-role block (the injection boundary).
    last = provider.last_messages[-1]
    assert last["role"] == "user"
    assert f"#{item.id}" in last["content"]
    assert "dinner outfit?" in last["content"]


@pytest.mark.django_db
def test_chat_continues_existing_conversation(alice, monkeypatch):
    provider = RecordingProvider()
    _patch_chat(monkeypatch, provider, [])
    conv = Conversation.objects.create(user=alice)
    ChatMessage.objects.create(conversation=conv, role="user", content="earlier question")
    ChatMessage.objects.create(conversation=conv, role="assistant", content="earlier answer")

    client = APIClient()
    client.force_authenticate(user=alice)
    resp = client.post(
        "/api/v1/ai/chat/",
        {"message": "follow-up", "conversation_id": conv.id},
        format="json",
    )

    assert resp.status_code == 200
    assert resp.data["conversation_id"] == conv.id
    # Prior turns are included as history before the grounded final turn.
    contents = [m["content"] for m in provider.last_messages]
    assert "earlier question" in contents
    assert "earlier answer" in contents


@pytest.mark.django_db
def test_chat_rejects_other_users_conversation(alice, monkeypatch):
    _patch_chat(monkeypatch, RecordingProvider(), [])
    bob = User.objects.create_user(username="bob", email="b@example.com", password="pw")
    bobs_conv = Conversation.objects.create(user=bob)

    client = APIClient()
    client.force_authenticate(user=alice)
    resp = client.post(
        "/api/v1/ai/chat/",
        {"message": "hi", "conversation_id": bobs_conv.id},
        format="json",
    )

    assert resp.status_code == 404  # not in alice's scope -> not found, not 502


@pytest.mark.django_db
def test_chat_provider_error_returns_502(alice, monkeypatch):
    class BrokenProvider:
        def chat(self, messages, system=None):
            raise ProviderError("model down")

    _patch_chat(monkeypatch, BrokenProvider(), [])

    client = APIClient()
    client.force_authenticate(user=alice)
    resp = client.post("/api/v1/ai/chat/", {"message": "hi"}, format="json")

    assert resp.status_code == 502
    # The user's message is still persisted (retryable).
    assert ChatMessage.objects.filter(role="user", content="hi").exists()


@pytest.mark.django_db
def test_chat_requires_authentication():
    resp = APIClient().post("/api/v1/ai/chat/", {"message": "hi"}, format="json")
    assert resp.status_code in (401, 403)


@pytest.mark.django_db
def test_conversation_history_is_user_scoped(alice):
    bob = User.objects.create_user(username="bob", email="b@example.com", password="pw")
    Conversation.objects.create(user=alice, title="mine")
    Conversation.objects.create(user=bob, title="theirs")

    client = APIClient()
    client.force_authenticate(user=alice)
    resp = client.get("/api/v1/ai/conversations/")

    assert resp.status_code == 200
    titles = [c["title"] for c in resp.data]
    assert titles == ["mine"]
