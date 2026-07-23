from django.contrib.auth.models import User
from django.db.models import QuerySet
from pgvector.django import CosineDistance

from apps.ai.providers.factory import get_embedding_provider
from apps.closet.models import ClothingItem


class VectorStore:
    """User specific semantic retrieval over ClothingItem embeddings. Bind to a
    user once and every query is filtered to that user."""

    def __init__(self, user: User) -> None:
        self.user = user

    def retrieve(
        self, query_vector: list[float], k: int = 5
    ) -> QuerySet[ClothingItem]:
        """Return the k ClothingItems whose embedding is closest to query_vector
        (a list of floats)."""
        return (
            ClothingItem.objects.filter(user=self.user, embedding__isnull=False)
            .annotate(distance=CosineDistance("embedding", query_vector))
            .order_by("distance")[:k]
        )

    def search(self, query_text: str, k: int = 5) -> QuerySet[ClothingItem]:
        """Embed query_text and return the k closest items for this user by
        cosine similarity."""
        return self.retrieve(get_embedding_provider().embed([query_text])[0], k)
