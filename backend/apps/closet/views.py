from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer

from apps.ai.enrichment import enrich_item
from apps.closet.models import ClothingItem, ClothingType, Outfit
from apps.closet.pagination import StandardResultsSetPagination
from apps.closet.serializers import ClothingItemSerializer, ClothingTypeSerializer, OutfitSerializer

# Create your views here.


class ClothingTypeViewSet(viewsets.ModelViewSet, LoginRequiredMixin):
    """
    Displays all of the clothing types
    """
    serializer_class = ClothingTypeSerializer
    queryset = ClothingType.objects.all()
    # Overwrites the create function to save information about the creator of the type
    def perform_create(self, serializer: BaseSerializer) -> None:
        serializer.save(user=self.request.user)
    # Overwrites the queryset to only return types created by the owner
    def get_queryset(self) -> QuerySet[ClothingType]:
        return self.queryset.filter(user=self.request.user)

class ClothingItemViewSet(viewsets.ModelViewSet):
    """
    Displays all of the clothing items
    """
    serializer_class = ClothingItemSerializer
    queryset = ClothingItem.objects.all()
    pagination_class = StandardResultsSetPagination

    # Overwrites the create function to save information about the creator of the items
    def perform_create(self, serializer: BaseSerializer) -> None:
        item = serializer.save(user=self.request.user)
        # Auto-enrich the new item (vision attributes + embedding). enrich_item is
        # best-effort and never raises, so a provider/key error can't block the
        # create response — the item is saved either way and can be backfilled
        # later via `manage.py enrich_closet`. (Synchronous for now; a background-
        # job candidate once we add the queue.)
        enrich_item(item)

    # Overwrites the queryset to only return items created by the owner
    def get_queryset(self) -> QuerySet[ClothingItem]:
        return self.queryset.filter(user=self.request.user)


class OutfitViewSet(viewsets.ModelViewSet):
    """
    Displays all of the outfits
    """
    serializer_class = OutfitSerializer
    queryset = Outfit.objects.all()

    # Overwrites the create function to save information about the creator of the outfit
    def perform_create(self, serializer: BaseSerializer) -> None:
        serializer.save(user=self.request.user)

    # Overwrites the queryset to only return outfits created by the owner
    def get_queryset(self) -> QuerySet[Outfit]:
        return self.queryset.filter(user=self.request.user)

    def retrieve(self, request: Request, pk: int | None = None) -> Response:
        outfit = get_object_or_404(self.queryset, pk=pk)
        serializer = OutfitSerializer(outfit)
        return Response(serializer.data)




