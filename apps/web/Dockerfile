# =========================
# Builder
# =========================
FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1

RUN corepack enable \
  && corepack prepare pnpm@10.33.0 --activate \
  && apk add --no-cache python3 make g++ bash

WORKDIR /app

# Remote cache (optional): pass as build args from CI / Coolify.
ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM \
    PNPM_STORE_DIR=/root/.local/share/pnpm/store \
    TURBO_CACHE_DIR=/app/.turbo \
    PNPM_NETWORK_CONCURRENCY=16 \
    NODE_OPTIONS="--max-old-space-size=4096"

# Workspace root (invalidates only when root config or lockfile changes)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Package manifests only — keeps `pnpm install` cached when only source changes
COPY packages/ui/package.json packages/ui/
COPY configs/typescript/package.json configs/typescript/
COPY configs/eslint/package.json configs/eslint/
COPY apps/web/package.json apps/web/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web...

# Full source (frequent changes)
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    --mount=type=cache,target=/app/.turbo \
    --mount=type=cache,target=/app/apps/web/.next/cache \
    pnpm build --filter @pacepard/web

# =========================
# Production (Next.js standalone — no pnpm at runtime)
# =========================
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001 \
  && apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NODE_OPTIONS="--max-old-space-size=4096"

# outputFileTracingRoot is the monorepo root — standalone includes apps/web/server.js
COPY --from=base --chown=nodejs:nodejs /app/apps/web/.next/standalone ./
COPY --from=base --chown=nodejs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "const p=process.env.PORT||3000;require('http').get('http://127.0.0.1:'+p,r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "apps/web/server.js"]

# Build from repo root:
#   DOCKER_BUILDKIT=1 docker build -f apps/web/Dockerfile -t pacepard-web .
#
# Turborepo remote cache (optional build args):
#   --build-arg TURBO_TOKEN=... --build-arg TURBO_TEAM=...
#
# Ephemeral builders: persist cache with buildx (example — replace registry image):
#   docker buildx build -f apps/web/Dockerfile \
#     --cache-to type=registry,ref=ghcr.io/ORG/pacepard-web:buildcache,mode=max \
#     --cache-from type=registry,ref=ghcr.io/ORG/pacepard-web:buildcache \
#     -t pacepard-web .
#
# Without BuildKit, RUN --mount=type=cache is ignored and builds stay cold.
#
# Coolify: use valid https:// URLs in FQDN fields (not https//).
