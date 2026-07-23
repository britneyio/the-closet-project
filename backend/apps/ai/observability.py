"""Lightweight observability helpers for AI calls.

Provider calls to Anthropic/Ollama are the slowest and only paid operations in
the app, so their latency is the thing worth measuring. `log_latency` is a
context manager wrapping a single provider call; it logs duration even when the
call raises (the failure path is exactly when timing matters), and the record
doubles as a Sentry breadcrumb when Sentry is enabled.
"""
import logging
import time
from collections.abc import Iterator
from contextlib import contextmanager

logger = logging.getLogger("apps.ai.latency")


@contextmanager
def log_latency(operation: str, model: str) -> Iterator[None]:
    """Time and log one AI call, e.g. log_latency("chat", self.chat_model)."""
    start = time.monotonic()
    try:
        yield
    finally:
        duration_ms = (time.monotonic() - start) * 1000
        logger.info("ai call %s model=%s %.0fms", operation, model, duration_ms)
