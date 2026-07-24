import logging

from django.db.models import QuerySet
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai.chat import run_chat
from apps.ai.models import Conversation
from apps.ai.providers.base import ProviderError
from apps.ai.recommend import recommend_outfits
from apps.ai.serializers import (
    ChatRequestSerializer,
    ConversationSerializer,
    RecommendRequestSerializer,
    ReferencedItemSerializer,
)

logger = logging.getLogger(__name__)


class ChatView(APIView):
    """POST a message; get a stylist reply grounded in the user's own closet.

    Response: { reply, conversation_id, referenced_items }. A provider/LLM failure
    returns 502 (not a 500) so the client can distinguish "the AI is down" from a
    bug — the user's message is already persisted and the turn can be retried.
    """

    def post(self, request: Request) -> Response:
        payload = ChatRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)

        try:
            result = run_chat(
                user=request.user,
                message=payload.validated_data["message"],
                conversation_id=payload.validated_data.get("conversation_id"),
            )
        except ProviderError:
            # Upstream LLM/network failure: retryable, and the user message is
            # already persisted. NotFound/other APIExceptions are NOT caught here
            # (DRF maps them, e.g. bad conversation_id -> 404), and unexpected
            # exceptions bubble to Django's 500 so real bugs aren't masked as 502.
            logger.exception("Chat generation failed: provider unavailable")
            return Response(
                {"detail": "The stylist is unavailable right now. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({
            "reply": result["reply"],
            "conversation_id": result["conversation_id"],
            "referenced_items": ReferencedItemSerializer(
                result["referenced_items"], many=True, context={"request": request}
            ).data,
        })


class RecommendView(APIView):
    """POST an occasion/request; get 1-3 outfits composed from the user's own
    closet. Every returned item is guaranteed owned by the user (ID-ownership
    guard in the service). persist=true also saves them as Outfit rows.

    Error mapping matches ChatView: ProviderError (incl. malformed model output)
    -> 502; unexpected -> 500.
    """

    def post(self, request: Request) -> Response:
        payload = RecommendRequestSerializer(data=request.data)
        payload.is_valid(raise_exception=True)

        try:
            result = recommend_outfits(
                user=request.user,
                query=payload.validated_data["query"],
                persist=payload.validated_data["persist"],
                max_outfits=payload.validated_data["max_outfits"],
            )
        except ProviderError:
            logger.exception("Recommendation failed: provider unavailable")
            return Response(
                {"detail": "The stylist is unavailable right now. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        outfits = [
            {
                "name": o["name"],
                "reasoning": o["reasoning"],
                "items": ReferencedItemSerializer(
                    o["items"], many=True, context={"request": request}
                ).data,
                **({"id": o["id"]} if "id" in o else {}),
            }
            for o in result["outfits"]
        ]
        return Response({"outfits": outfits})


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only chat history, scoped to the current user (tenant isolation).
    Conversations are created through the chat endpoint, not here."""

    serializer_class = ConversationSerializer

    def get_queryset(self) -> QuerySet[Conversation]:
        return Conversation.objects.filter(user=self.request.user)
