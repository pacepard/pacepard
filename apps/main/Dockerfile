# Multi-stage build for Main App (Vite/React)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files for dependency resolution
COPY packages ./packages
COPY configs ./configs
COPY apps/main ./apps/main

# Optional: Turborepo remote cache in CI (pass --build-arg TURBO_TOKEN / TURBO_TEAM)
ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ARG TIPTAP_PRO_TOKEN=""
ARG VITE_APP_API_URL=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM \
    TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN \
    VITE_APP_API_URL=$VITE_APP_API_URL \
    TURBO_TELEMETRY_DISABLED=1 \
    TURBO_CACHE_DIR=/app/.turbo

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter './packages/*' --filter './configs/*' || true

# Build Vite app
WORKDIR /app
RUN --mount=type=cache,target=/app/.turbo \
    pnpm build --filter @pacepard/app

# Production stage - use Caddy to serve static files (lightweight, fast, SPA-friendly)
FROM caddy:2-alpine AS production

# Copy built static files
COPY --from=base /app/apps/main/dist /usr/share/caddy

# Copy Caddyfile for SPA routing and configuration
COPY --from=base /app/apps/main/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

# Start Caddy (runs as non-root by default)
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
