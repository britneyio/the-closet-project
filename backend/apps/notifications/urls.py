from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.notifications.views import NotificationViewSet

router = DefaultRouter()
router.register('notifications', NotificationViewSet, basename='notification')

notifications_urlpatterns = [path(r'api/v1/', include(router.urls))]
