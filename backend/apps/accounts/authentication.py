"""Cookie-or-header token authentication.

Web clients authenticate with an httpOnly cookie the browser attaches
automatically. Mobile clients keep the
classic ``Authorization: Token <key>`` header (the token lives in the device
secure enclave, not a cookie).

When a request is authenticated via the cookie we ALSO enforce CSRF (a cookie is
sent automatically by the browser, so without CSRF it would be forgeable). Header
auth is not CSRF-exposed.
"""
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import CSRFCheck, TokenAuthentication


def _enforce_csrf(request) -> None:
    def dummy_get_response(_request):  # pragma: no cover - required by CSRFCheck
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        # 1. Header token (mobile / API clients) — standard DRF behavior.
        header_auth = super().authenticate(request)
        if header_auth is not None:
            return header_auth

        # 2. httpOnly cookie (web).
        key = request.COOKIES.get(settings.AUTH_COOKIE_NAME)
        if not key:
            return None
        user, token = self.authenticate_credentials(key)
        _enforce_csrf(request)
        return (user, token)
