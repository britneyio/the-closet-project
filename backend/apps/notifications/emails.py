"""Email delivery via Resend.

The notifications app owns delivery mechanics; callers use the templated helpers
(send_welcome_email, send_account_deleted_email) rather than send_email directly.

Delivery is best-effort and never raises: a mail failure must not break the
request that triggered it (account creation, deletion). When RESEND_API_KEY is
unset — local dev, CI — we log and no-op, so nothing external is required to run
the app or the tests.
"""
import logging
import os

logger = logging.getLogger(__name__)


def _from_email():
    return os.environ.get("RESEND_FROM_EMAIL", "The Closet Project <onboarding@resend.dev>")


def send_email(to, subject, html):
    """Send one HTML email. Returns Resend's response dict, or None if delivery
    was skipped (no API key) or failed. Import of the resend SDK is deferred so
    the package is only needed when a key is actually configured."""
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        logger.info("RESEND_API_KEY unset; skipping email to %s: %r", to, subject)
        return None

    import resend

    resend.api_key = api_key
    try:
        return resend.Emails.send(
            {"from": _from_email(), "to": [to], "subject": subject, "html": html}
        )
    except Exception:  # best-effort delivery: log and move on, never break the caller
        logger.exception("Failed to send email to %s", to)
        return None


def send_welcome_email(user):
    """Account-creation transactional email."""
    if not user.email:
        return None
    return send_email(
        user.email,
        "Welcome to The Closet Project",
        f"<p>Hi {user.username},</p>"
        "<p>Your closet is ready. Add a few items and I'll start suggesting "
        "outfits from what you already own.</p>",
    )


def send_account_deleted_email(email, username):
    """Account-deletion transactional email."""
    return send_email(
        email,
        "Your Closet Project account was deleted",
        f"<p>Hi {username},</p>"
        "<p>Your account and wardrobe data have been removed. If this wasn't "
        "you, reply to this email.</p>",
    )
