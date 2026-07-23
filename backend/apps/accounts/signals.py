"""User lifecycle side effects. These are plain functions; they're wired to the
post_save / post_delete signals in AccountsConfig.ready() so there is no unused
module-level import to suppress."""
from apps.accounts.models import UserProfile
from apps.notifications.emails import send_account_deleted_email, send_welcome_email


def create_user_profile(sender, instance, created, **kwargs):
    """Guarantee every User has exactly one UserProfile, however it was created
    (djoser registration, admin, shell, tests), then send the transactional
    welcome email. Only fires on insert."""
    if created:
        UserProfile.objects.create(user=instance)
        send_welcome_email(instance)


def notify_account_deleted(sender, instance, **kwargs):
    """Transactional goodbye email after a User row is deleted."""
    if instance.email:
        send_account_deleted_email(instance.email, instance.username)
