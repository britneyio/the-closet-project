from rest_framework import serializers

from apps.ai.models import ChatMessage, Conversation
from apps.closet.models import ClothingItem


class ChatRequestSerializer(serializers.Serializer):
    """Inbound chat payload. conversation_id is optional, without it starts a new
    conversation."""

    message = serializers.CharField(max_length=2000, trim_whitespace=True)
    conversation_id = serializers.IntegerField(required=False)


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
