"""Tests for the closet app.

Starter suite focused on the security invariant that matters most here:
every closet endpoint must require authentication. We'll grow this into full
per-user tenant-isolation tests once the AI features add cross-user surface area.
"""
import pytest
from rest_framework.test import APIClient

# These endpoints are all registered under /api/v1/ and use IsAuthenticated globally.
PROTECTED_ENDPOINTS = [
    "/api/v1/clothing/",
    "/api/v1/clothingtype/",
    "/api/v1/outfit/",
]


@pytest.mark.django_db
@pytest.mark.parametrize("url", PROTECTED_ENDPOINTS)
def test_endpoint_requires_authentication(url):
    """An anonymous request must be rejected (401 unauthorized or 403 forbidden)."""
    client = APIClient()  # no credentials set
    response = client.get(url)
    assert response.status_code in (401, 403), (
        f"{url} should require auth, got {response.status_code}"
    )
