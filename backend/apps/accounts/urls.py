from django.urls import include, path

from apps.accounts.views import (
    CookieTokenCreateView,
    CookieTokenDestroyView,
    CSRFCookieView,
    ProfileView,
)

# Our cookie-aware login/logout must be declared BEFORE djoser's authtoken
# include so they win at the same paths. djoser.urls (user management) is
# mounted under api/v1/auth/ so its endpoints are /api/v1/auth/users/ and
# /api/v1/auth/users/me/ — matching the frontend client and consistent with the
# other auth routes (/api/v1/auth/csrf/).
accounts_urlpatterns = [
    path("api/v1/auth/csrf/", CSRFCookieView.as_view(), name="csrf"),
    path("api/v1/token/login/", CookieTokenCreateView.as_view(), name="login"),
    path("api/v1/token/logout/", CookieTokenDestroyView.as_view(), name="logout"),
    path("api/v1/auth/", include("djoser.urls")),
    path("api/v1/profile/", ProfileView.as_view(), name="profile"),
]
