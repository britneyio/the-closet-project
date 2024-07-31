from django.urls import path, include

# adds enpoints to our applicatoin
accounts_urlpatterns = [
    path(r'api/v1/', include('djoser.urls')),
    path(r'api/v1/', include('djoser.urls.authtoken'))
]