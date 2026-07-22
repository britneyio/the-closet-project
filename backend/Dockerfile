# 1. Base image: Python 3.12 on slim Debian. 3.12 = newest version all our deps support
#    (djoser caps at 3.12). "slim" keeps the image small.
FROM python:3.12-slim

# 2. Python-in-Docker tuning:
#    - DONTWRITEBYTECODE: skip .pyc files (pointless in an ephemeral container)
#    - UNBUFFERED: stream stdout/stderr straight to `docker logs` (no buffering)
#    - PIP_NO_CACHE_DIR: don't cache wheels we won't reuse -> smaller image
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# 3. Security: apply OS security patches released since this base image was built.
#    This clears most "critical/high" CVEs a scanner flags (they live in Debian
#    packages, not Python). Clean up apt lists afterward to keep the image small.
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# 4. All following commands run relative to /app inside the image.
WORKDIR /app

# 5. Install pipenv (the tool that reads Pipfile.lock).
RUN pip install pipenv

# 6. Copy ONLY dependency manifests first -> Docker caches the slow install layer
#    below and reuses it as long as these two files are unchanged.
COPY Pipfile Pipfile.lock ./

# 7. Install locked deps into the container's system Python. --deploy fails if Pipfile.lock is stale.
RUN pipenv install --deploy --system

# 8. NOW copy the app code. Code edits invalidate only this layer, not deps above.
COPY . .

# 9. Security: create an unprivileged user and drop root before running the app.
RUN useradd --create-home appuser && chown -R appuser /app
USER appuser

# 10. Document the port the app serves on.
EXPOSE 8000

# 11. Default is toserve Django via gunicorn.
#     docker-compose will override this with runserver for dev auto-reload.
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]