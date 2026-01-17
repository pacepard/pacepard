# Multi-stage build for Web (Next.js)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install build dependencies (for native modules)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files for dependency resolution
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# Build Next.js app (from monorepo root to respect outputFileTracingRoot)
WORKDIR /app
RUN pnpm build --filter @pacepard/web

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files and source code for workspace dependencies
# Note: packages use source files directly (no dist), so we need their src directories
COPY --from=base /app/packages ./packages
COPY --from=base /app/configs ./configs
COPY --from=base /app/apps/web/package.json ./apps/web/
COPY --from=base /app/apps/web/next.config.* ./apps/web/
COPY --from=base /app/apps/web/postcss.config.* ./apps/web/
COPY --from=base /app/apps/web/tsconfig.json ./apps/web/

# Set pnpm store directory to a consistent location (fixes store mismatch issues)
# This ensures pnpm uses the same store regardless of user
ENV PNPM_STORE_DIR=/app/.pnpm-store
ENV PNPM_HOME=/app/.local/share/pnpm

# Create store directory and ensure /app is owned by nodejs BEFORE switching users
RUN mkdir -p /app/.pnpm-store /app/.local/share/pnpm && \
    chown -R nodejs:nodejs /app

# Switch to nodejs user BEFORE installing to avoid store path conflicts
USER nodejs

# Install production dependencies only (this creates proper node_modules for workspace)
# We need to install for the entire workspace to resolve workspace:* dependencies
# Note: Installing as nodejs user ensures correct store path and permissions
RUN pnpm install --frozen-lockfile --prod

# Copy built Next.js app (as root temporarily for file operations)
USER root
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public

# Ensure all files are owned by nodejs user (especially the newly copied files)
RUN chown -R nodejs:nodejs /app

# Switch back to nodejs user for runtime
USER nodejs

# Expose port (default 3000, can be overridden via PORT env var)
EXPOSE 3000

# Start Next.js in production mode from workspace root using pnpm filter
# This ensures binaries are found correctly in the workspace structure
# Set environment variables to prevent Next.js from trying to install dependencies
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true
WORKDIR /app
CMD ["pnpm", "--filter", "@pacepard/web", "start"]
