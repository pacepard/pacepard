# =========================
# Base build stage
# =========================
FROM node:20-alpine AS base

# Install pnpm + native deps in one layer
RUN corepack enable \
  && corepack prepare pnpm@9.0.0 --activate \
  && apk add --no-cache python3 make g++ bash git

WORKDIR /app

# Copy workspace configuration files (for caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
# Web does not depend on @pacepard/blocs — skip TipTap Pro registry (see apps/web/docker.npmrc)
COPY apps/web/docker.npmrc ./.npmrc

# Only workspace packages required by @pacepard/web (avoids @tiptap-pro/* from blocs/main)
COPY packages/ui ./packages/ui
COPY configs ./configs
COPY apps/web ./apps/web

# Optional: Turborepo remote cache in CI (pass --build-arg TURBO_*)
ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM \
    TURBO_TELEMETRY_DISABLED=1

ENV PNPM_STORE_DIR=/root/.local/share/pnpm/store \
    TURBO_CACHE_DIR=/app/.turbo \
    NEXT_TELEMETRY_DISABLED=1 \
    PNPM_NETWORK_CONCURRENCY=16 \
    NODE_OPTIONS="--max-old-space-size=4096"

# Install only @pacepard/web and its workspace dependency tree (no blocs / tiptap-pro)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web...

RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter @pacepard/web


# =========================
# Production stage
# =========================
FROM node:20-alpine AS production

RUN corepack enable \
  && corepack prepare pnpm@9.0.0 --activate \
  && apk add --no-cache curl bash

RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=true \
    PNPM_STORE_DIR=/app/.pnpm-store \
    NODE_OPTIONS="--max-old-space-size=4096"

RUN mkdir -p /app/.pnpm-store && \
    chmod 777 /app/.pnpm-store

COPY --chown=nodejs:nodejs --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs --from=base /app/.npmrc ./.npmrc
COPY --chown=nodejs:nodejs --from=base /app/packages/ui ./packages/ui
COPY --chown=nodejs:nodejs --from=base /app/configs ./configs
COPY --chown=nodejs:nodejs --from=base /app/apps/web/package.json ./apps/web/
COPY --chown=nodejs:nodejs --from=base /app/apps/web/next.config.* ./apps/web/
COPY --chown=nodejs:nodejs --from=base /app/apps/web/tsconfig.json ./apps/web/

COPY --chown=nodejs:nodejs --from=base /app/apps/web/.next ./apps/web/.next
COPY --chown=nodejs:nodejs --from=base /app/apps/web/public ./apps/web/public
COPY --chown=nodejs:nodejs --from=base /app/apps/web/src ./apps/web/src

RUN echo "store-dir=/app/.pnpm-store" >> /app/.npmrc

RUN --mount=type=cache,target=/app/.pnpm-store \
    sh -c 'unset NODE_ENV && pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web...'

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["pnpm", "--filter", "@pacepard/web", "start"]
