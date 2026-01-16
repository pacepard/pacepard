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
COPY .npmrc* ./

# Copy source code
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

# Optional: Turborepo remote cache + Tiptap registry (CI: --build-arg TURBO_* , TIPTAP_PRO_TOKEN)
ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ARG TIPTAP_PRO_TOKEN=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM \
    TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN \
    TURBO_TELEMETRY_DISABLED=1

# Set environment variables
ENV PNPM_STORE_DIR=/root/.local/share/pnpm/store \
    TURBO_CACHE_DIR=/app/.turbo \
    NEXT_TELEMETRY_DISABLED=1 \
    PNPM_NETWORK_CONCURRENCY=16 \
    NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# Build shared packages and Next.js app
RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter './packages/*' --filter './configs/*'

RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter @pacepard/web


# =========================
# Production stage
# =========================
FROM node:20-alpine AS production

# Install pnpm + runtime deps
RUN corepack enable \
  && corepack prepare pnpm@9.0.0 --activate \
  && apk add --no-cache curl bash

# Non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nodejs -u 1001

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    CI=true \
    PNPM_STORE_DIR=/app/.pnpm-store \
    NODE_OPTIONS="--max-old-space-size=4096"

# Create directories with proper permissions for cache mount
RUN mkdir -p /app/.pnpm-store && \
    chmod 777 /app/.pnpm-store

# Copy workspace files needed for pnpm install
COPY --chown=nodejs:nodejs --from=base /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs --from=base /app/.npmrc* ./
COPY --chown=nodejs:nodejs --from=base /app/packages ./packages
COPY --chown=nodejs:nodejs --from=base /app/configs ./configs
COPY --chown=nodejs:nodejs --from=base /app/apps/web/package.json ./apps/web/
COPY --chown=nodejs:nodejs --from=base /app/apps/web/next.config.* ./apps/web/
COPY --chown=nodejs:nodejs --from=base /app/apps/web/tsconfig.json ./apps/web/

# Copy built artifacts
COPY --chown=nodejs:nodejs --from=base /app/apps/web/.next ./apps/web/.next
COPY --chown=nodejs:nodejs --from=base /app/apps/web/public ./apps/web/public
COPY --chown=nodejs:nodejs --from=base /app/apps/web/src ./apps/web/src

# TipTap Pro + scoped registries live in the root .npmrc copied above — do not overwrite it.
# Append store-dir only (pnpm reads ${TIPTAP_PRO_TOKEN} from env at install time).
RUN echo "store-dir=/app/.pnpm-store" >> /app/.npmrc

# Same build-arg as base so pnpm can resolve @tiptap-pro/* during this stage's install.
ARG TIPTAP_PRO_TOKEN=""
ENV TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN

# Install dependencies as root (before switching to nodejs user)
# BuildKit cache mounts don't respect filesystem permissions, so we must install as root
# TypeScript is needed for next.config.ts, so we install all dependencies (including devDependencies)
# Temporarily unset NODE_ENV to ensure devDependencies are installed
RUN --mount=type=cache,target=/app/.pnpm-store \
    sh -c 'unset NODE_ENV && pnpm install --frozen-lockfile --prefer-offline --filter @pacepard/web'

# Fix ownership after installation (cache mount may have created files as root)
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user for runtime
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start Next.js in production (run from workspace root)
CMD ["pnpm", "--filter", "@pacepard/web", "start"]
ENV PORT=3000
# Use the direct path to next in pnpm workspace
CMD ["/app/node_modules/.pnpm/node_modules/.bin/next", "start"]
