from django.db import migrations


class Migration(migrations.Migration):
    """Enforce non-blank email at the database level.

    auth_user.email is NOT NULL DEFAULT '' (owned by django.contrib.auth), so
    NOT NULL buys us nothing — a blank email is the empty string, not NULL. A
    CHECK constraint is the only way to forbid '' on a table we don't own, and it
    holds for every entry point (ORM, shell, admin, raw SQL), not just the API.
    The registration serializer still rejects blanks first with a clean 400; this
    is the backstop behind it.
    """

    dependencies = [
        ("accounts", "0002_email_unique_index"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE auth_user ADD CONSTRAINT auth_user_email_not_blank "
                "CHECK (email <> '');"
            ),
            reverse_sql="ALTER TABLE auth_user DROP CONSTRAINT IF EXISTS auth_user_email_not_blank;",
        ),
    ]
