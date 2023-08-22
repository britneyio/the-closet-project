from rest_framework import serializers
from apps.closet.models import ClothingItem, ClothingType, Outfit
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from urllib.request import urlopen



class ClothingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingType
        fields = ('id', 'name')

class ClothingItemSerializer(serializers.ModelSerializer):
    cover_file = serializers.ImageField(use_url=True)
    ctype =serializers.SlugRelatedField(slug_field='name',queryset=ClothingType.objects.all())

    cover_url = serializers.URLField()
    class Meta:
        model = ClothingItem
        fields = ('id', 'name', 'worn', 'ctype', 'location', 'cover_file', 'cover_url')




class OutfitSerializer(serializers.ModelSerializer):
    items = ClothingItemSerializer(read_only=True, many=True)
    items_id = serializers.PrimaryKeyRelatedField(queryset=ClothingItem.objects.all(), source='items', read_only=False, many=True)

    class Meta:
        model = Outfit
        fields = ('id', 'name','about','worn','items', 'items_id')
        read_only_fields = ('items',)

