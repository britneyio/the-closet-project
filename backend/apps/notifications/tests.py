"""Tests for the notifications app: per-user isolation and the read/mark-read
surface. Notifications are server-produced, so there is no client create/delete."""
import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from apps.notifications.models import Notification


@pytest.fixture
def two_users(db):
    a = User.objects.create_user(username="a", email="a@example.com", password="pw")
    b = User.objects.create_user(username="b", email="b@example.com", password="pw")
    return a, b


@pytest.mark.django_db
def test_list_returns_only_own_notifications(two_users):
    a, b = two_users
    Notification.objects.create(user=a, title="for A")
    Notification.objects.create(user=b, title="for B")

    client = APIClient()
    client.force_authenticate(user=a)
    resp = client.get("/api/v1/notifications/")

    assert resp.status_code == 200
    assert [n["title"] for n in resp.data] == ["for A"]


@pytest.mark.django_db
def test_mark_single_read(two_users):
    a, _ = two_users
    n = Notification.objects.create(user=a, title="hi")

    client = APIClient()
    client.force_authenticate(user=a)
    resp = client.patch(f"/api/v1/notifications/{n.id}/", {"read": True}, format="json")

    assert resp.status_code == 200
    n.refresh_from_db()
    assert n.read is True


@pytest.mark.django_db
def test_mark_all_read(two_users):
    a, _ = two_users
    Notification.objects.create(user=a, title="1")
    Notification.objects.create(user=a, title="2")

    client = APIClient()
    client.force_authenticate(user=a)
    resp = client.post("/api/v1/notifications/mark_all_read/")

    assert resp.status_code == 200
    assert resp.data["marked_read"] == 2
    assert Notification.objects.filter(user=a, read=False).count() == 0


@pytest.mark.django_db
def test_cannot_touch_another_users_notification(two_users):
    a, b = two_users
    n = Notification.objects.create(user=b, title="b's")

    client = APIClient()
    client.force_authenticate(user=a)
    resp = client.patch(f"/api/v1/notifications/{n.id}/", {"read": True}, format="json")

    assert resp.status_code == 404  # not in a's queryset — invisible, not just forbidden


@pytest.mark.django_db
def test_requires_authentication():
    resp = APIClient().get("/api/v1/notifications/")
    assert resp.status_code in (401, 403)
