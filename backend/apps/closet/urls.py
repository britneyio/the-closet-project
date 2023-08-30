from xml.etree.ElementInclude import include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.closet.views import ClothingItemViewSet, ClothingTypeViewSet, OutfitViewSet

router = DefaultRouter()
router.register('clothing', ClothingItemViewSet, basename='clothing')
router.register('clothingtype', ClothingTypeViewSet, basename='types')
router.register('outfit', OutfitViewSet, basename='outfit')
router.register('outfit/<int:pk>/', OutfitViewSet, basename='outfit')


clothing_urlpatterns = [path(r'api/v1/', include(router.urls))]