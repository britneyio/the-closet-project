import base64
import json
import logging
import os

from anthropic import Anthropic

from apps.ai.observability import log_latency
from apps.ai.providers.base import AIProvider, ProviderError

logger = logging.getLogger(__name__)


class AnthropicProvider(AIProvider):
    """
    Wraps the Anthropic SDK client to implement the AIProvider interface.

    Implements chat + describe_image. embed() is intentionally unsupported —
    Anthropic has no first-party embeddings API, so embeddings are routed to
    EMBEDDING_PROVIDER (openai / local) via the factory.
    """

    def __init__(self) -> None:
        # Zero-arg would also work (the SDK reads ANTHROPIC_API_KEY itself);
        # passing it explicitly matches the official docs example.
        self.client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

        self.chat_model = os.environ.get("CHAT_MODEL", "claude-opus-4-8")
        self.vision_model = os.environ.get("VISION_MODEL", "claude-haiku-4-5")

    def chat(self, messages: list[dict], system: str | None = None) -> str:
        try:
            with log_latency("chat", self.chat_model):
                message = self.client.messages.create(
                    model=self.chat_model,
                    max_tokens=2048,
                    system=system,        # trusted operator prompt; None is fine
                    messages=messages,
                )
        except Exception as exc:  # SDK/network/rate-limit failure -> typed upstream error
            logger.exception("Anthropic chat call failed")
            raise ProviderError("Anthropic chat call failed") from exc
        # Return the first text block's text ("" if none) — the interface
        # returns a string to the caller; it does not print.
        return next((b.text for b in message.content if b.type == "text"), "")

    def embed(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError(
            "Anthropic has no embeddings; set EMBEDDING_PROVIDER=openai or local"
        )

    def describe_image(self, image: bytes | str, prompt: str) -> dict:
        # One user message whose content is a LIST of blocks: the image, then
        # the instruction. bytes -> base64 source; str -> treat as a URL.
        if isinstance(image, bytes):
            image_block = {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": base64.standard_b64encode(image).decode("utf-8"),
                },
            }
        else:
            image_block = {"type": "image", "source": {"type": "url", "url": image}}

        try:
            with log_latency("vision", self.vision_model):
                message = self.client.messages.create(
                    model=self.vision_model,
                    max_tokens=1024,
                    messages=[{
                        "role": "user",
                        "content": [image_block, {"type": "text", "text": prompt}],
                    }],
                )
        except Exception as exc:
            logger.exception("Anthropic vision call failed")
            raise ProviderError("Anthropic vision call failed") from exc

        text = next((b.text for b in message.content if b.type == "text"), "")
        # STUB until Step 3: we'll enforce a JSON schema (structured outputs)
        # then. For now, try to parse JSON, else return the raw text.
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"raw": text}
