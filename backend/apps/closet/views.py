from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from apps.closet.serializers import ClothingItemSerializer, ClothingTypeSerializer, OutfitSerializer
from apps.closet.models import ClothingType, ClothingItem, Outfit
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.


class ClothingTypeViewSet(viewsets.ModelViewSet, LoginRequiredMixin):
    """
    Displays all of the clothing types
    """
    serializer_class = ClothingTypeSerializer
    queryset = ClothingType.objects.all()
    # Overwrites the create function to save information about the creator of the type
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    # Overwrites the queryset to only return types created by the owner
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class ClothingItemViewSet(viewsets.ModelViewSet):
    """
    Displays all of the clothing items
    """
    serializer_class = ClothingItemSerializer
    queryset = ClothingItem.objects.all()

    # Overwrites the create function to save information about the creator of the items
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Overwrites the queryset to only return items created by the owner
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class OutfitViewSet(viewsets.ModelViewSet):
    """
    Displays all of the outfits
    """
    serializer_class = OutfitSerializer
    queryset = Outfit.objects.all()
    
    # Overwrites the create function to save information about the creator of the outfit
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Overwrites the queryset to only return outfits created by the owner
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


    
