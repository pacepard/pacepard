# Multi-stage build for API (Express/Node.js)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files for dependency resolution
COPY packages ./packages
COPY configs ./configs
COPY apps/api ./apps/api

# Optional: Turborepo remote cache in CI (pass --build-arg TURBO_TOKEN / TURBO_TEAM)
ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ARG TIPTAP_PRO_TOKEN=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM \
    TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN \
    TURBO_TELEMETRY_DISABLED=1 \
    TURBO_CACHE_DIR=/app/.turbo

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
# Note: || true allows packages/configs without build scripts to skip
RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter './packages/*' --filter './configs/*' || true

# Build API app
RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter @pacepard/api

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration files for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc* ./

# Copy workspace packages/configs (needed for runtime resolution)
COPY --from=base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=base --chown=nodejs:nodejs /app/configs ./configs

# Copy API package.json BEFORE install (required for pnpm workspace resolution)
COPY --from=base --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/

# Same build-arg as base: pnpm reads ${TIPTAP_PRO_TOKEN} from .npmrc for @tiptap-pro/* (workspace packages).
ARG TIPTAP_PRO_TOKEN=""
ENV TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN

# Install only production dependencies (pnpm needs all package.json files present)
RUN pnpm install --frozen-lockfile --prod

# Copy built API app dist folder
COPY --from=base --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist

# Set working directory to API
WORKDIR /app/apps/api

# Switch to non-root user
USER nodejs

# Expose port (Coolify uses dynamic port assignment via $PORT env var)
# Standard port is 5015, but Coolify will map dynamically
EXPOSE 5015

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${APP_PORT:-5015}/api/v1/me || exit 1

# Start API in production mode
# ⚠️ IMPORTANT: Do NOT set NODE_ENV here if using Coolify!
# NODE_ENV should be set in Coolify as Runtime only (not buildtime)
# This allows devDependencies to be installed during build

# Coolify automatically sets PORT, which should map to APP_PORT
# Set APP_PORT=PORT in Coolify environment variables if server only reads APP_PORT
# Or update server code to use: process.env.PORT || process.env.APP_PORT || 5015

CMD ["node", "dist/server.js"]
