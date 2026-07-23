import base64
import json
import logging
import os

from openai import OpenAI

from apps.ai.observability import log_latency
from apps.ai.providers.base import AIProvider, ProviderError

logger = logging.getLogger(__name__)


class LocalProvider(AIProvider):
    """
    Talks to a self-hosted, OpenAI-compatible endpoint (Ollama / LM Studio / vLLM)
    at LOCAL_BASE_URL. In the default setup its job is embed() via BGE-M3; chat and
    describe_image are implemented too so the whole RAG pipeline can run offline
    (e.g. llama3.2 + llava) with no paid keys.

    "OpenAI-compatible" = same request/response shape as OpenAI, so we reuse the
    `openai` SDK and just point base_url at the local server.
    """

    def __init__(self) -> None:
        self.client = OpenAI(
            base_url=os.environ.get("LOCAL_BASE_URL", "http://ollama:11434/v1"),
            # Ollama ignores the key but the SDK requires a non-empty string.
            api_key=os.environ.get("OPENAI_API_KEY") or "ollama",
        )
        self.embedding_model = os.environ.get("EMBEDDING_MODEL", "bge-m3")
        # Separate local model ids so a claude-* CHAT_MODEL never leaks to Ollama.
        self.chat_model = os.environ.get("LOCAL_CHAT_MODEL", "llama3.2")
        self.vision_model = os.environ.get("LOCAL_VISION_MODEL", "llava")

    def embed(self, texts: list[str]) -> list[list[float]]:
        try:
            with log_latency("embed", self.embedding_model):
                resp = self.client.embeddings.create(model=self.embedding_model, input=texts)
        except Exception as exc:
            logger.exception("Local embed call failed")
            raise ProviderError("Local embed call failed") from exc
        # data comes back in input order; keep it that way (texts[i] -> vectors[i]).
        return [d.embedding for d in resp.data]

    def chat(self, messages: list[dict], system: str | None = None) -> str:
        # OpenAI-compatible chat has no separate `system` param — it's a message
        # with role "system" prepended to the list.
        full = ([{"role": "system", "content": system}] if system else []) + messages
        try:
            with log_latency("chat", self.chat_model):
                resp = self.client.chat.completions.create(model=self.chat_model, messages=full)
        except Exception as exc:
            logger.exception("Local chat call failed")
            raise ProviderError("Local chat call failed") from exc
        return resp.choices[0].message.content or ""

    def describe_image(self, image: bytes | str, prompt: str) -> dict:
        # OpenAI-compatible vision: an image_url content part. bytes -> data URI.
        if isinstance(image, bytes):
            b64 = base64.standard_b64encode(image).decode("utf-8")
            url = f"data:image/jpeg;base64,{b64}"
        else:
            url = image

        try:
            with log_latency("vision", self.vision_model):
                resp = self.client.chat.completions.create(
                    model=self.vision_model,
                    messages=[{
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": url}},
                            {"type": "text", "text": prompt},
                        ],
                    }],
                )
        except Exception as exc:
            logger.exception("Local vision call failed")
            raise ProviderError("Local vision call failed") from exc
        text = resp.choices[0].message.content or ""
        # STUB until Step 3 (structured schema). Try JSON, else return raw text.
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return {"raw": text}
