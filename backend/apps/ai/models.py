from django.contrib.auth.models import User
from django.db import models

from apps.closet.models import ClothingItem


class Conversation(models.Model):
    """A chat thread between a user and the stylist. User-scoped like the closet models."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title or f"Conversation {self.pk}"


class ChatMessage(models.Model):
    """One turn in a conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    ROLE_CHOICES = [(USER, "user"), (ASSISTANT, "assistant")]

    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    role = models.CharField(max_length=16, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # Which closet items RAG retrieved for this message — traceability + UI thumbnails.
    referenced_items = models.ManyToManyField(ClothingItem, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.role}: {self.content[:40]}"
