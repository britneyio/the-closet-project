from rest_framework import generics

from apps.accounts.serializers import UserProfileSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET / PATCH the current user's profile.

    No create (auto-created with the User via signal) and no delete (cascades
    when the User is deleted). Scoped to request.user by construction, so there
    is no object-level access to another user's profile.
    """
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.profile
