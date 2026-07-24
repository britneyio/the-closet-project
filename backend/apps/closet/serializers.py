
from rest_framework import serializers

from apps.closet.models import ClothingItem, ClothingType, Outfit


class ClothingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingType
        fields = ('id', 'name')


class ClothingItemSerializer(serializers.ModelSerializer):
    cover_file = serializers.ImageField()
    # A type is referenced by its id (read and write). Scoped to the requesting
    # user's own types in __init__ so you can only attach your own (tenant
    # isolation) and a name shared across users can't collide.
    ctype = serializers.PrimaryKeyRelatedField(queryset=ClothingType.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # The endpoint requires authentication, so request.user is the owner.
        request = self.context.get('request')
        if request is not None:
            self.fields['ctype'].queryset = ClothingType.objects.filter(user=request.user)

    class Meta:
        model = ClothingItem
        # AI fields are additive + read-only (set by enrichment, never by the client).
        # `embedding` is intentionally NOT exposed: a 1024-float vector is heavy and
        # useless to the frontend.
        fields = (
            'id', 'name', 'worn', 'ctype', 'location', 'cover_file', 'price',
            'color', 'style', 'formality', 'season', 'pattern', 'material',
            'ai_description', 'attributes', 'enriched_at',
        )
        read_only_fields = (
            'color', 'style', 'formality', 'season', 'pattern', 'material',
            'ai_description', 'attributes', 'enriched_at',
        )




class OutfitSerializer(serializers.ModelSerializer):
    items = ClothingItemSerializer(read_only=True, many=True)
    items_id = serializers.PrimaryKeyRelatedField(
        queryset=ClothingItem.objects.all(),
        source='items',
        read_only=False,
        many=True,
    )

    class Meta:
        model = Outfit
        fields = ('id', 'name','about','worn','items', 'items_id')
        read_only_fields = ('items',)

