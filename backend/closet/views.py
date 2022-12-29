from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import ClothingItemSerializer, ClothingTypeSerializer, OutfitSerializer
from .models import ClothingType, ClothingItem, Outfit
from django.contrib.auth.mixins import LoginRequiredMixin
# Create your views here.


class ClothingTypeView(viewsets.ModelViewSet, LoginRequiredMixin):
    serializer_class = ClothingTypeSerializer
    def get_queryset(self):
        return ClothingType.objects.filter(user=self.request.user)

class ClothingItemView(viewsets.ModelViewSet):
    serializer_class = ClothingItemSerializer
    queryset = ClothingItem.objects.all()

class OutfitView(viewsets.ModelViewSet):
    serializer_class = OutfitSerializer
    queryset = Outfit.objects.all()


    
