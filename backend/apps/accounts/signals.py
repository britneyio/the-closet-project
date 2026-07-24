"""User lifecycle side effects. These are plain functions; they're wired to the
post_save / post_delete signals in AccountsConfig.ready() so there is no unused
module-level import to suppress."""
import logging

from django.contrib.auth.models import User

from apps.accounts.models import UserProfile
from apps.closet.models import ClothingType
from apps.notifications.emails import send_account_deleted_email, send_welcome_email

logger = logging.getLogger(__name__)

# Starter clothing types every new user gets, so the closet is usable immediately
# (the "Add item" type picker is never empty). These are broad, curated buckets —
# users rename/add/remove them freely; the AI never creates types (keeps the
# taxonomy from sprawling into pants/trousers/bottoms duplicates).
DEFAULT_CLOTHING_TYPES = (
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Accessories",
)


def seed_default_clothing_types(user: User) -> None:
    """Give a new user the starter taxonomy. Idempotent-friendly: skips any type
    names the user already owns, so re-running (e.g. a backfill) never duplicates."""
    existing = set(
        ClothingType.objects.filter(user=user).values_list("name", flat=True)
    )
    missing = [name for name in DEFAULT_CLOTHING_TYPES if name not in existing]
    if missing:
        ClothingType.objects.bulk_create(
            [ClothingType(user=user, name=name) for name in missing]
        )
        logger.info("seeded %d default clothing types for user=%s", len(missing), user.id)


def create_user_profile(sender: type[User], instance: User, created: bool, **kwargs) -> None:
    """Guarantee every User has exactly one UserProfile, however it was created
    (djoser registration, admin, shell, tests), seed the starter clothing types,
    then send the transactional welcome email. Only fires on insert."""
    if created:
        UserProfile.objects.create(user=instance)
        seed_default_clothing_types(instance)
        logger.info("created profile for user=%s", instance.id)
        send_welcome_email(instance)


def notify_account_deleted(sender: type[User], instance: User, **kwargs) -> None:
    """Transactional goodbye email after a User row is deleted."""
    if instance.email:
        logger.info("account deleted, sending goodbye email for user=%s", instance.id)
        send_account_deleted_email(instance.email, instance.username)
