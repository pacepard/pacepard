# syntax=docker/dockerfile:1
#
# Build from repo root:  docker build -f apps/web/Dockerfile -t pacepard-web .
#
# Coolify: DOCKER_BUILDKIT=1. Optional build args: TURBO_TOKEN, TURBO_TEAM (Turborepo remote cache).
# Use valid https:// URLs in FQDN fields (not https//).
#
# Layout matches the Coolify-proven flow: default pnpm store + Turbo dir on BuildKit cache mounts,
# full source build, production stage reinstalls @pacepard/web and runs `pnpm start` (not standalone).
#
# Coolify injects COOLIFY_* ARGs here. Fix UI typos: use https:// (not https//) and one FQDN per field
# so COOLIFY_FQDN is not parsed as "domain,https". If the build dies during "apk add", raise builder
# RAM/swap or the deployment build timeout; exit 255 is often OOM or a killed build step.

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT=1

RUN corepack enable \
    && corepack prepare pnpm@10.33.0 --activate \
    && apk add --no-cache python3 build-base

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/web/docker.npmrc ./.npmrc

COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM

ARG NODE_MEMORY_LIMIT=3072

ENV PNPM_STORE_DIR=/root/.local/share/pnpm/store \
    TURBO_CACHE_DIR=/app/.turbo \
    PNPM_NETWORK_CONCURRENCY=16 \
    NODE_OPTIONS=--max-old-space-size=${NODE_MEMORY_LIMIT}

# tooling/ is dockerignored but listed in the workspace; use a filter (not a full root install).
RUN --mount=type=cache,id=pacepard-pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm config set package-import-method copy && \
    pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web...

RUN --mount=type=cache,id=pacepard-pnpm-store,target=/root/.local/share/pnpm/store \
    --mount=type=cache,id=pacepard-turbo-cache,target=/app/.turbo \
    pnpm build --filter @pacepard/web

FROM node:20-alpine AS production

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable \
    && corepack prepare pnpm@10.33.0 --activate \
    && apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PNPM_STORE_DIR=/app/.pnpm-store \
    NODE_OPTIONS=--max-old-space-size=3072

RUN mkdir -p /app/.pnpm-store && chmod 777 /app/.pnpm-store

COPY --from=base --chown=root:root /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/turbo.json ./
COPY --from=base --chown=root:root /app/.npmrc ./
COPY --from=base --chown=root:root /app/packages ./packages
COPY --from=base --chown=root:root /app/configs ./configs

COPY --from=base --chown=root:root /app/apps/web/package.json ./apps/web/
COPY --from=base --chown=root:root /app/apps/web/next.config.ts ./apps/web/
COPY --from=base --chown=root:root /app/apps/web/tsconfig.json ./apps/web/
COPY --from=base --chown=root:root /app/apps/web/postcss.config.mjs ./apps/web/
COPY --from=base --chown=root:root /app/apps/web/components.json ./apps/web/
COPY --from=base --chown=root:root /app/apps/web/.next ./apps/web/.next
COPY --from=base --chown=root:root /app/apps/web/public ./apps/web/public
COPY --from=base --chown=root:root /app/apps/web/src ./apps/web/src

RUN --mount=type=cache,id=pacepard-prod-pnpm-store,target=/app/.pnpm-store \
    sh -c 'unset NODE_ENV && pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web'

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "const p=process.env.PORT||3000;require('http').get('http://127.0.0.1:'+p,r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["pnpm", "--filter", "@pacepard/web", "start"]
