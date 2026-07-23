from django.contrib.auth import authenticate, get_user_model
from djoser.conf import settings
from djoser.serializers import TokenCreateSerializer
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers

from apps.accounts.models import UserProfile

User = get_user_model()


class UserCreateSerializer(BaseUserCreateSerializer):
    """Registration serializer. Email is our login field, so it's required and
    must be non-blank and unique (case-insensitively — enforced by the DB index
    in accounts migration 0002; we surface a clean 400 here before it hits it)."""

    email = serializers.EmailField(required=True, allow_blank=False)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    """The current user's profile. `user` is implicit (request.user), so it's
    neither exposed nor writable here."""

    class Meta:
        model = UserProfile
        fields = (
            "body_photo", "location",
            "email_recommendations", "email_updates", "sms_opt_in", "phone_number",
        )

class CustomTokenCreateSerializer(TokenCreateSerializer):
    def validate(self, attrs):
        password = attrs.get('password')
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
        request=self.context.get('request'), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail('invalid_credentials')

        if self.user:
            return attrs
        self.fail('invalid_credentials')
