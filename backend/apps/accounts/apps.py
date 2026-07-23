from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'

    def ready(self):
        # Wire user lifecycle side effects. dispatch_uid makes the connections
        # idempotent, so a double import (e.g. under autoreload) can't register
        # the same receiver twice.
        from django.contrib.auth.models import User
        from django.db.models.signals import post_delete, post_save

        from apps.accounts.signals import create_user_profile, notify_account_deleted

        post_save.connect(
            create_user_profile, sender=User, dispatch_uid="accounts.create_user_profile"
        )
        post_delete.connect(
            notify_account_deleted, sender=User, dispatch_uid="accounts.notify_account_deleted"
        )
