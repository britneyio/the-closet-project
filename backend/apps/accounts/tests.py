"""Tests for the accounts app: profile auto-creation, the email uniqueness
constraint, and the /profile/ endpoint."""
import pytest
from django.contrib.auth.models import User
from django.db import IntegrityError, transaction
from rest_framework.test import APIClient

from apps.accounts.models import UserProfile


@pytest.mark.django_db
def test_profile_auto_created_with_user():
    """The post_save signal creates exactly one profile, with sensible defaults."""
    user = User.objects.create_user(username="alice", email="alice@example.com", password="pw")
    assert UserProfile.objects.filter(user=user).count() == 1
    assert user.profile.email_recommendations is True
    assert user.profile.sms_opt_in is False


@pytest.mark.django_db
def test_email_unique_constraint_is_case_insensitive():
    """The DB index rejects a duplicate email differing only in case."""
    User.objects.create_user(username="a", email="dup@example.com", password="pw")
    with pytest.raises(IntegrityError):
        with transaction.atomic():  # keep the outer test transaction usable
            User.objects.create_user(username="b", email="DUP@example.com", password="pw")


@pytest.mark.django_db
def test_registration_rejects_blank_email():
    """Email is required for account creation: the registration endpoint rejects
    a blank email with a 400 rather than creating a user."""
    resp = APIClient().post(
        "/api/v1/users/",
        {"username": "noemail", "email": "", "password": "sup3rSecret!"},
        format="json",
    )
    assert resp.status_code == 400
    assert "email" in resp.data
    assert not User.objects.filter(username="noemail").exists()


@pytest.mark.django_db
def test_blank_email_rejected_at_db_level():
    """The CHECK constraint forbids a blank email even outside the API — e.g. a
    shell/admin create_user call — not just at the serializer."""
    with pytest.raises(IntegrityError):
        with transaction.atomic():  # keep the outer test transaction usable
            User.objects.create_user(username="blank", email="", password="pw")


@pytest.mark.django_db
def test_registration_rejects_duplicate_email_case_insensitively():
    """Registering an email that already exists (ignoring case) returns a 400."""
    User.objects.create_user(username="a", email="dup@example.com", password="pw")
    resp = APIClient().post(
        "/api/v1/users/",
        {"username": "b", "email": "DUP@example.com", "password": "sup3rSecret!"},
        format="json",
    )
    assert resp.status_code == 400
    assert "email" in resp.data


@pytest.mark.django_db
def test_profile_endpoint_reads_and_updates_own_profile():
    user = User.objects.create_user(username="alice", email="alice@example.com", password="pw")
    client = APIClient()
    client.force_authenticate(user=user)

    resp = client.get("/api/v1/profile/")
    assert resp.status_code == 200
    assert resp.data["email_updates"] is True

    resp = client.patch(
        "/api/v1/profile/", {"location": "Boston", "sms_opt_in": True}, format="json"
    )
    assert resp.status_code == 200
    user.profile.refresh_from_db()
    assert user.profile.location == "Boston"
    assert user.profile.sms_opt_in is True


@pytest.mark.django_db
def test_profile_endpoint_requires_authentication():
    resp = APIClient().get("/api/v1/profile/")
    assert resp.status_code in (401, 403)
