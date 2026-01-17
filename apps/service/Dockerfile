# Multi-stage build for Service (Next.js)
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
COPY apps/service ./apps/service

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# Build Next.js app (from monorepo root to respect outputFileTracingRoot)
WORKDIR /app
RUN pnpm build --filter @pacepard/service

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
COPY --from=base /app/apps/service/package.json ./apps/service/
COPY --from=base /app/apps/service/next.config.* ./apps/service/
COPY --from=base /app/apps/service/postcss.config.* ./apps/service/
COPY --from=base /app/apps/service/tsconfig.json ./apps/service/

# Set pnpm store directory to a consistent location (fixes store mismatch issues)
# This ensures pnpm uses the same store regardless of user
ENV PNPM_STORE_DIR=/app/.pnpm-store
ENV PNPM_HOME=/app/.local/share/pnpm
# Set temp directory to a writable location within /app
ENV TMPDIR=/app/.tmp

# Create store directory and temp directory, ensure /app is owned by nodejs BEFORE switching users
RUN mkdir -p /app/.pnpm-store /app/.local/share/pnpm /app/.tmp && \
    chown -R nodejs:nodejs /app

# Switch to nodejs user BEFORE installing to avoid store path conflicts
USER nodejs

# Install all dependencies (needed for TypeScript to load next.config.ts)
# Next.js requires TypeScript at runtime to load next.config.ts
# We need to install for the entire workspace to resolve workspace:* dependencies
# Clear any potential pnpm cache/store issues first, then install fresh
RUN rm -rf /app/.pnpm-store /app/.local/share/pnpm node_modules 2>/dev/null || true && \
    mkdir -p /app/.pnpm-store /app/.local/share/pnpm && \
    pnpm install --frozen-lockfile

# Copy built Next.js app and source files (needed for server components at runtime)
USER root
COPY --from=base /app/apps/service/.next ./apps/service/.next
COPY --from=base /app/apps/service/public ./apps/service/public
COPY --from=base /app/apps/service/src ./apps/service/src

# Ensure all files are owned by nodejs user (especially the newly copied files)
RUN chown -R nodejs:nodejs /app

# Switch back to nodejs user for runtime
USER nodejs

# Expose port (default 3000, can be overridden via PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start Next.js in production mode from workspace root using pnpm filter
# This ensures binaries are found correctly in the workspace structure
# Set environment variables to prevent Next.js from trying to install dependencies
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true
WORKDIR /app
CMD ["pnpm", "--filter", "@pacepard/service", "start"]
