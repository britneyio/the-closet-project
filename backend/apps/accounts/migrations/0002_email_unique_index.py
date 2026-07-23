from django.db import migrations


class Migration(migrations.Migration):
    """Enforce email uniqueness on the built-in auth_user table with a real
    database constraint.

    We can't add a Django field constraint to auth.User from this app (the model
    lives in django.contrib.auth), so we create the index in raw SQL. It is
    case-insensitive — LOWER(email) — so 'A@x.com' and 'a@x.com' collide. The
    index covers every row (no partial WHERE): email is required and non-blank
    (rejected by the registration serializer), so blank emails never reach the DB.
    """

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "CREATE UNIQUE INDEX IF NOT EXISTS uniq_auth_user_email_ci "
                "ON auth_user (LOWER(email));"
            ),
            reverse_sql="DROP INDEX IF EXISTS uniq_auth_user_email_ci;",
        ),
    ]
