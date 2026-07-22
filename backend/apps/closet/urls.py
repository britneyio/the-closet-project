from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.closet.views import ClothingItemViewSet, ClothingTypeViewSet, OutfitViewSet

# DefaultRouter auto-generates both list (/outfit/) and detail (/outfit/<pk>/) routes
# for each viewset, so each viewset is registered exactly once.
router = DefaultRouter()
router.register('clothing', ClothingItemViewSet, basename='clothing')
router.register('clothingtype', ClothingTypeViewSet, basename='types')
router.register('outfit', OutfitViewSet, basename='outfit')


clothing_urlpatterns = [path(r'api/v1/', include(router.urls))]
