from rest_framework import serializers
from .models import ClothingItem, ClothingType, Outfit


class ClothingItemSerializer(serializers.ModelSerializer):
    ctype = serializers.SlugRelatedField(slug_field='name', read_only=True)
    class Meta:
        model = ClothingItem
        fields = ('id', 'name', 'worn', 'ctype', 'location', 'cover')
class ClothingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingType
        fields = ('id', 'name')
class OutfitSerializer(serializers.ModelSerializer):
    items = serializers.SlugRelatedField(many=True, slug_field='name', read_only=True)
    class Meta:
        model = Outfit
        fields = ('id', 'name','about','worn','items')
