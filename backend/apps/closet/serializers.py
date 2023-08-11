from rest_framework import serializers
from apps.closet.models import ClothingItem, ClothingType, Outfit

class ClothingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingType
        fields = ('id', 'name')

class ClothingItemSerializer(serializers.ModelSerializer):
    # def __init__(self, *args, **kwargs):
    #     super(ClothingItemSerializer, self).__init__(*args, **kwargs)
    #     user = self.context['request'].user
    #     self.fields['ctype'] = serializers.SlugRelatedField(slug_field='name',queryset=ClothingType.objects.filter(user=user))
    ctype =serializers.SlugRelatedField(slug_field='name',queryset=ClothingType.objects.all())
    cover = serializers.ImageField()
    class Meta:
        model = ClothingItem
        fields = ('id', 'name', 'worn', 'ctype', 'location', 'cover')

    # def create(self, validated_data):
    #     types_data = validated_data.pop('ctype')
    #     item = ClothingItem.objects.create(**validated_data)
    #     for type_data in types_data:
    #         ClothingType.objects.create()

class OutfitSerializer(serializers.ModelSerializer):
    items = ClothingItemSerializer(many=True)

    class Meta:
        model = Outfit
        fields = ('id', 'name','about','worn','items')

