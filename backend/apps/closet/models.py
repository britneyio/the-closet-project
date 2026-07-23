
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from pgvector.django import VectorField  # Django glue for the Postgres `vector` column type

# Create your models here.


class ClothingType(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class ClothingItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200)
    worn = models.DateField(default=timezone.now, null=False)
    ctype = models.ForeignKey(ClothingType, on_delete=models.CASCADE)
    location = models.CharField(max_length=200, null=True, blank=True)
    cover_file = models.ImageField(upload_to='images/')
    # Optional purchase price — powers cost-per-wear and (later) closet valuation.
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # ── AI enrichment fields (all nullable: existing rows + current API stay valid) ──
    # Structured attributes extracted from the photo by the vision model.
    color = models.CharField(max_length=100, null=True, blank=True)
    style = models.CharField(max_length=100, null=True, blank=True)
    formality = models.CharField(max_length=100, null=True, blank=True)
    season = models.CharField(max_length=100, null=True, blank=True)
    pattern = models.CharField(max_length=100, null=True, blank=True)
    material = models.CharField(max_length=100, null=True, blank=True)
    ai_description = models.TextField(null=True, blank=True)
    # Catch-all for any extra attributes the model returns beyond the columns above.
    attributes = models.JSONField(null=True, blank=True)
    # User-provided attribute overrides/additions, kept SEPARATE from the AI values
    # so re-enrichment (enrich_closet --force) never clobbers manual edits. Which
    # source wins is a later, non-destructive resolution decision.
    user_attributes = models.JSONField(null=True, blank=True)
    # The embedding of the enriched text. Fixed dimension = BGE-M3 dense (1024);
    # changing embedders means changing this + re-embedding (enrich_closet --force).
    embedding = VectorField(dimensions=1024, null=True, blank=True)
    # When enrichment last succeeded; null = not yet enriched (drives idempotency).
    enriched_at = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name
    class Meta:
        ordering = ['name']

class Outfit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    about = models.TextField(null=True, blank=True)
    worn = models.DateField(default=timezone.now, null=False)
    items = models.ManyToManyField(ClothingItem)

    # ── Mannequin outfit builder (2D compositing — NOT 3D try-on) ──
    # Drag-and-drop placement of items over the backdrop: positions / z-order /
    # scale per item, so a saved look can be reloaded and edited.
    layout = models.JSONField(null=True, blank=True)
    # The user photo used as the drag-and-drop backdrop for THIS outfit. Defaults
    # to UserProfile.body_photo in the UI, but stored per-outfit so a look is
    # reproducible even if the profile photo later changes.
    base_photo = models.ImageField(upload_to='outfits/base/', null=True, blank=True)
    # The rendered composite (for thumbnails / sharing).
    composite_image = models.ImageField(upload_to='outfits/', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class WearLog(models.Model):
    """One record each time an item is worn. Single source of truth for
    cost-per-wear, dead-item detection, and calendar analytics (derive counts and
    last-worn from here rather than storing a counter that can drift)."""
    item = models.ForeignKey(ClothingItem, on_delete=models.CASCADE, related_name='wear_logs')
    worn_on = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-worn_on']

    def __str__(self):
        return f"{self.item.name} worn {self.worn_on}"


class PlannedOutfit(models.Model):
    """An outfit scheduled for a FUTURE date (calendar / weekly planning).
    Distinct from WearLog, which records outfits actually worn."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='planned_outfits')
    date = models.DateField()
    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE)
    note = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.outfit.name} on {self.date}"


class PackingList(models.Model):
    """A trip packing list. Usually AI-generated from trip context, then saved."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='packing_lists')
    title = models.CharField(max_length=200)
    destination = models.CharField(max_length=200, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    items = models.ManyToManyField(ClothingItem, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Capsule(models.Model):
    """A capsule wardrobe — a small, mix-and-match set of items. Usually
    AI-proposed from the user's closet, then saved."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='capsules')
    name = models.CharField(max_length=200)
    items = models.ManyToManyField(ClothingItem, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


