# App Name

App description


---

# Build & Deployment Versioning

This template supports automatic version injection via `APP_VERSION`.

## How It Works

`meta.ts` returns:

{
  "name": "...",
  "version": "APP_VERSION",
  "status": "ok"
}

If `APP_VERSION` is not set, it defaults to `"dev"`.

---

# Local Development

No setup required.

`.env` does NOT need `APP_VERSION`.

Version will default to:

dev

---

# CI (GitHub Actions)

CI injects the commit SHA:

- name: Set APP_VERSION
  run: echo "APP_VERSION=${{ github.sha }}" >> $GITHUB_ENV

This makes `APP_VERSION` available during `bun run build`.

---

# Fly Deployment

To bake the version into the Docker image:

fly deploy \
  --build-arg APP_VERSION=$(git rev-parse --short HEAD)

Your `server/Dockerfile` must include in the runner stage:

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

---

# Optional: Runtime Version via Fly Secrets

If you prefer runtime injection instead of build-time:

fly secrets set APP_VERSION=$(git rev-parse --short HEAD) -a <app-name>

This does not require `--build-arg`.

---

# Recommended Strategy

• CI builds the image  
• CI injects commit SHA  
• Fly deploy passes `--build-arg`  
• `/` and `/__info` return the exact deployed version  

---

This provides:

• Traceable deployments  
• Debuggable production  
• Zero manual version bumps  
• SaaS-grade observability  

---

## License

MIT License
