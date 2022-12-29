from django.contrib import admin
from .models import ClothingItem, ClothingType, Outfit
# Register your models here.

admin.site.register(ClothingType)
admin.site.register(ClothingItem)
admin.site.register(Outfit)