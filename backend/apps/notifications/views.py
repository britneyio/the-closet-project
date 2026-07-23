from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer


class NotificationViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """List the current user's notifications and mark them read (PATCH read=true).

    No create/destroy from the client — notifications are produced server-side.
    The queryset is scoped to request.user, so a user can never see or modify
    another user's notifications (tenant isolation).
    """
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        """Mark every unread notification for the current user as read."""
        updated = self.get_queryset().filter(read=False).update(read=True)
        return Response({"marked_read": updated})
