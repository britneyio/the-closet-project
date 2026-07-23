"""
Provider factory: reads env config and returns the active AIProvider.

The customer never chooses a model — selection is 100% server-side env config.
Chat and embeddings are resolved SEPARATELY (AI_PROVIDER vs EMBEDDING_PROVIDER)
because Anthropic has no first-party embeddings API, so a common setup is
Claude chat + OpenAI/local embeddings.
"""

import os
from functools import cache

from apps.ai.providers.base import AIProvider


def _make_provider(kind: str) -> AIProvider:
    """
    Instantiate a concrete provider by name.

    Imports are LAZY (inside each branch) on purpose:
      1. Incremental build — this module imports cleanly even before every
         provider file exists (a top-level import of a missing file would crash
         Django at startup).
      2. Optional SDKs stay optional — you only need the `anthropic` / `openai`
         package for the provider you actually select. A top-level `import openai`
         would take the app down even when AI_PROVIDER=anthropic.
    """
    if kind == "anthropic":
        from apps.ai.providers.anthropic_provider import AnthropicProvider
        return AnthropicProvider()
    if kind == "openai":
        from apps.ai.providers.openai_provider import OpenAIProvider
        return OpenAIProvider()
    if kind == "local":
        from apps.ai.providers.local_provider import LocalProvider
        return LocalProvider()
    raise ValueError(
        f"Unknown provider {kind!r}. "
        "Set AI_PROVIDER/EMBEDDING_PROVIDER to anthropic|openai|local."
    )


# Memoize so each provider (and its SDK client) is built once per process.
# Safe to leave unbounded: `kind` only ever takes the 3 valid values above
# (from env, not per-request input), and @cache never stores calls that raise —
# so an invalid kind is rejected, not cached. Max 3 entries, ever.
@cache
def _cached_provider(kind: str) -> AIProvider:
    return _make_provider(kind)


def get_provider() -> AIProvider:
    """The provider used for chat + vision (AI_PROVIDER, default anthropic)."""
    return _cached_provider(os.environ.get("AI_PROVIDER", "anthropic"))


def get_embedding_provider() -> AIProvider:
    """
    The provider used for embeddings (EMBEDDING_PROVIDER, default local).
    May differ from get_provider() — e.g. Claude chat + local BGE-M3 embeddings.
    """
    return _cached_provider(os.environ.get("EMBEDDING_PROVIDER", "local"))
