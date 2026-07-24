from rest_framework import serializers

from apps.ai.models import ChatMessage, Conversation
from apps.closet.models import ClothingItem


class ChatRequestSerializer(serializers.Serializer):
    """Inbound chat payload. conversation_id is optional, without it starts a new
    conversation."""

    message = serializers.CharField(max_length=2000, trim_whitespace=True)
    conversation_id = serializers.IntegerField(required=False)


class RecommendRequestSerializer(serializers.Serializer):
    """Inbound recommender payload. `persist` saves the proposals as Outfit rows;
    `max_outfits` caps how many the model composes (1-3)."""

    query = serializers.CharField(max_length=2000, trim_whitespace=True)
    persist = serializers.BooleanField(required=False, default=False)
    max_outfits = serializers.IntegerField(required=False, default=3, min_value=1, max_value=7)


class ReferencedItemSerializer(serializers.ModelSerializer):
    """Minimal item shape for chat responses / item thumbnails, excludes
    the embedding and other heavy fields."""

    class Meta:
        model = ClothingItem
        fields = ("id", "name", "cover_file")


class ChatMessageSerializer(serializers.ModelSerializer):
    referenced_items = ReferencedItemSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = ("id", "role", "content", "created_at", "referenced_items")


class ConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ("id", "title", "created_at", "messages")
