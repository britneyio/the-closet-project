from django.urls import include, path

from apps.accounts.views import ProfileView

# adds endpoints to our application
accounts_urlpatterns = [
    path(r'api/v1/', include('djoser.urls')),
    path(r'api/v1/', include('djoser.urls.authtoken')),
    path(r'api/v1/profile/', ProfileView.as_view(), name='profile'),
]
