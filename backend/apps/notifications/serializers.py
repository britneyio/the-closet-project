from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Read-only except `read` — clients may mark a notification read/unread,
    but content is produced server-side."""

    class Meta:
        model = Notification
        fields = ("id", "type", "title", "body", "link", "read", "created_at")
        read_only_fields = ("id", "type", "title", "body", "link", "created_at")
