from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from djoser.views import TokenCreateView, TokenDestroyView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import UserProfile
from apps.accounts.serializers import UserProfileSerializer


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        settings.AUTH_COOKIE_NAME,
        token,
        max_age=settings.AUTH_COOKIE_MAX_AGE,
        httponly=True,  # JS cannot read it -> not stealable via XSS
        secure=settings.AUTH_COOKIE_SECURE,  # HTTPS-only in prod
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path="/",
    )


class CookieTokenCreateView(TokenCreateView):
    """Djoser login that also drops the token into an httpOnly cookie for the
    web client. The token is still returned in the body so mobile can store it
    in the device secure enclave."""

    def _action(self, serializer):
        response = super()._action(serializer)
        token = response.data.get("auth_token")
        if token:
            _set_auth_cookie(response, token)
        return response


class CookieTokenDestroyView(TokenDestroyView):
    """Logout: invalidate the token server-side (djoser) and clear the cookie."""

    def post(self, request: Request) -> Response:
        response = super().post(request)
        response.delete_cookie(settings.AUTH_COOKIE_NAME, path="/")
        return response


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFCookieView(APIView):
    """GET to receive the (non-httpOnly) csrftoken cookie before the first
    state-changing request. Public and unauthenticated by design."""

    authentication_classes: list = []
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        return Response({"detail": "CSRF cookie set."})


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET / PATCH the current user's profile.

    No create (auto-created with the User via signal) and no delete (cascades
    when the User is deleted). Scoped to request.user by construction, so there
    is no object-level access to another user's profile.
    """
    serializer_class = UserProfileSerializer

    def get_object(self) -> UserProfile:
        return self.request.user.profile
