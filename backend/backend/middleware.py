"""Project-wide request logging.

One log line per HTTP request — method, path, status, duration, and user id when
one is available — so every endpoint is observable from a single place instead of
per-view logging. Level reflects the outcome: 5xx -> ERROR, 4xx -> WARNING,
otherwise INFO.

Note on user attribution: this app uses DRF token auth, which authenticates
inside the view, so `request.user` here is often AnonymousUser. We log the id
only when it's a real authenticated user and omit it otherwise, rather than
logging misleading data.
"""
import logging
import time
from collections.abc import Callable

from django.http import HttpRequest, HttpResponse

logger = logging.getLogger("request")


class RequestLoggingMiddleware:
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = (time.monotonic() - start) * 1000

        user = getattr(request, "user", None)
        user_id = user.id if getattr(user, "is_authenticated", False) else "anon"

        if response.status_code >= 500:
            level = logging.ERROR
        elif response.status_code >= 400:
            level = logging.WARNING
        else:
            level = logging.INFO

        logger.log(
            level,
            "%s %s -> %s (%.0fms) user=%s",
            request.method, request.path, response.status_code, duration_ms, user_id,
        )
        return response
