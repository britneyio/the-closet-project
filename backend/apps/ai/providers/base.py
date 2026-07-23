from abc import ABC, abstractmethod


class AIProvider(ABC):
    """
    The single interface every AI backend implements (Anthropic, OpenAI, local).

    Views and services depend on THIS abstract class, never on a concrete SDK,
    so swapping providers is a pure server-side env-config change
    (AI_PROVIDER / EMBEDDING_PROVIDER) with no client-visible effect.

    The three methods map to the three verbs the RAG pipeline needs:
      describe_image -> enrichment (photo -> attributes)
      embed          -> enrichment + retrieval (text -> vector)
      chat           -> chat + recommend (generation)
    """

    @abstractmethod
    def chat(self, messages: list[dict], system: str | None = None) -> str:
        """
        Generate an assistant reply.

        `messages` is an ordered list of {"role": "user"|"assistant", "content": str}.
        `system` is the fixed, trusted operator prompt (persona + rules). Keep it
        separate from `messages` so untrusted closet data lives only in user-role
        blocks and can never inherit system authority (the §11 prompt-injection
        boundary). Returns the assistant's reply text only — no provider objects leak out.
        """
        ...

    @abstractmethod
    def embed(self, texts: list[str]) -> list[list[float]]:
        """
        Embed each input text into a fixed-dimension vector.

        Output order matches input order (texts[i] -> vectors[i]). Every vector has
        the same length, fixed by the active embedding model (EMBEDDING_DIM). The
        SAME provider must embed both stored items and query text, or cosine
        distance between them is meaningless.
        """
        ...

    @abstractmethod
    def describe_image(self, image: bytes | str, prompt: str) -> dict:
        """
        Vision: given an image (raw bytes or a URL) and an instruction prompt,
        return a dict of structured attributes for a clothing item
        (color, style, formality, season, pattern, material, description).

        Callers pass a transient resized copy (IMAGE_MAX_PX, default 1024) — never
        the stored original — which controls image-token cost and doubles as
        upload-safety validation. The original stays full-res on disk so items can
        be re-enriched at any resolution later.
        """
        ...
