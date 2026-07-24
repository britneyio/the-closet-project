from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.ai.views import ChatView, ConversationViewSet, RecommendView

router = DefaultRouter()
router.register("conversations", ConversationViewSet, basename="conversation")

ai_urlpatterns = [
    path("api/v1/ai/chat/", ChatView.as_view(), name="chat"),
    path("api/v1/ai/recommend/", RecommendView.as_view(), name="recommend"),
    path("api/v1/ai/", include(router.urls)),
]
