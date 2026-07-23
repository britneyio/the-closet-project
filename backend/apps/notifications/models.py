from django.contrib.auth.models import User
from django.db import models


class Notification(models.Model):
    """An in-app notification for a user, and the record of what was (or will be)
    delivered on other channels (email/SMS).

    Notifications are created EXPLICITLY by the code that knows an event is
    legitimate (e.g. the recommend view), never via a signal — so user-facing
    side effects stay traceable and testable.
    """

    RECOMMENDATION = "recommendation"
    UPDATE = "update"
    SYSTEM = "system"
    TYPE_CHOICES = [
        (RECOMMENDATION, "recommendation"),
        (UPDATE, "update"),
        (SYSTEM, "system"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=32, choices=TYPE_CHOICES, default=SYSTEM)
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    link = models.CharField(max_length=500, null=True, blank=True)
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.type}: {self.title}"
