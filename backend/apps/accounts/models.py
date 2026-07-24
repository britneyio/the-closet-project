from django.contrib.auth.models import User
from django.db import models

# We deliberately avoid a custom User model so djoser's out-of-the-box auth keeps
# working, and leave auth.User's field definitions untouched (patching them would
# force an unwritable migration into django.contrib.auth). Email requirements are
# enforced where they belong instead:
#   - required + non-blank: the registration serializer (UserCreateSerializer);
#   - case-insensitive UNIQUENESS: a real DB index added in migration 0002.


class UserProfile(models.Model):
    """One profile per User, auto-created via a post_save signal (see signals.py).

    Holds account-level data that isn't authentication:
      - body_photo: the backdrop for the mannequin outfit builder.
      - location:   used for weather/occasion-aware suggestions.
      - notification preferences: opt-in for engagement email/SMS. Transactional
        email (account created/deleted, password reset) is always sent, so it has
        no opt-out flag.
      - phone_number: reserved for future SMS; collected but not yet used.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    body_photo = models.ImageField(upload_to="body/", null=True, blank=True)
    location = models.CharField(max_length=200, null=True, blank=True)

    # When on, uploaded item photos have their background removed during
    # enrichment (cleaner closet tiles). User-toggleable; defaults on.
    remove_background = models.BooleanField(default=True)

    # Set true once the user has completed (or skipped) the first-run product
    # tour, so it only shows to genuinely new users. Defaults false.
    has_onboarded = models.BooleanField(default=False)

    email_recommendations = models.BooleanField(default=True)
    email_updates = models.BooleanField(default=True)
    sms_opt_in = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=32, null=True, blank=True)

    def __str__(self) -> str:
        return f"Profile<{self.user.username}>"
