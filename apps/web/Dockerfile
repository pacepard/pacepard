# Build from repo root:  docker build -f apps/web/Dockerfile -t pacepard-web .
#
# Coolify: Optional build args: TURBO_TOKEN, TURBO_TEAM (Turborepo remote cache).
# Use valid https:// URLs in FQDN fields (not https//).
#
# Standalone output (next.config.ts output:"standalone") means the production stage
# only copies .next/standalone — no pnpm install at runtime. This is the biggest
# speed win: eliminates a cold full pnpm install on every deploy.
#
# Coolify injects COOLIFY_* ARGs here. Fix UI typos: use https:// (not https//) and one FQDN per field.

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT=1 \
    NEXT_DISABLE_TYPECHECK=1

RUN apk add --no-cache python3 build-base

RUN corepack enable \
    && corepack prepare pnpm@10.33.0 --activate

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

RUN pnpm install --frozen-lockfile --prefer-offline --ignore-scripts --filter @pacepard/web...

RUN pnpm build --filter @pacepard/web

# ── Production ────────────────────────────────────────────────────────────────
# Standalone output already bundles the minimal node_modules needed to run.
# No pnpm install required — just copy three directories.
FROM node:20-alpine AS production

RUN apk add --no-cache curl

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    NODE_OPTIONS=--max-old-space-size=3072

# .next/standalone contains server.js + traced node_modules (monorepo-aware via outputFileTracingRoot).
# .next/static and public/ must be copied separately — standalone doesn't include them.
COPY --from=base --chown=nodejs:nodejs /app/apps/web/.next/standalone ./
COPY --from=base --chown=nodejs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=base --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD node -e "const p=process.env.PORT||3000;require('http').get('http://127.0.0.1:'+p,r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "apps/web/server.js"]
