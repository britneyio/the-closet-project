"""Backfill / re-enrich clothing items.

Usage:
    python manage.py enrich_closet                # enrich items not yet enriched
    python manage.py enrich_closet --force        # re-enrich everything
    python manage.py enrich_closet --user alice   # limit to one user's closet

Idempotent by default (skips items with enriched_at). Best-effort per item: one
item's failure is logged by enrich_item() and the batch continues.
"""
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.ai.enrichment import enrich_item
from apps.closet.models import ClothingItem


class Command(BaseCommand):
    help = "Enrich clothing items with vision attributes + embeddings."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force", action="store_true",
            help="Re-enrich items that already have enriched_at.",
        )
        parser.add_argument(
            "--user", type=str, default=None,
            help="Limit to a single user (by username).",
        )

    def handle(self, *args, **options):
        items = ClothingItem.objects.all()
        if options["user"]:
            user = User.objects.filter(username=options["user"]).first()
            if not user:
                self.stderr.write(f"No user named {options['user']!r}")
                return
            items = items.filter(user=user)
        if not options["force"]:
            items = items.filter(enriched_at__isnull=True)

        total = items.count()
        self.stdout.write(f"Enriching {total} item(s)...")

        enriched = 0
        for item in items.iterator():
            if enrich_item(item, force=options["force"]):
                enriched += 1
                self.stdout.write(f"  ✓ {item.pk} {item.name}")
            else:
                self.stdout.write(f"  – {item.pk} {item.name} (skipped/failed)")

        self.stdout.write(self.style.SUCCESS(f"Done: {enriched}/{total} enriched."))
