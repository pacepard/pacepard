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

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
# Note: || true allows packages/configs without build scripts to skip
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# Build API app
RUN pnpm build --filter @pacepard/api

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

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built API app
COPY --from=base --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=base --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist

# Set working directory to API
WORKDIR /app/apps/api

# Switch to non-root user
USER nodejs

# Expose port (Coolify uses dynamic port assignment via $PORT env var)
# Standard port is 5015, but Coolify will map dynamically
EXPOSE 5015

# Health check (uses APP_PORT or PORT env var, defaults to 5015)
# Endpoint: /api/v1/ returns health status (renders health-check view)
# Note: localhost is correct here - HEALTHCHECK runs inside the container
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.APP_PORT || process.env.PORT || 5015; require('http').get(`http://localhost:${port}/api/v1/`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start API in production mode
# ⚠️ IMPORTANT: Do NOT set NODE_ENV here if using Coolify!
# NODE_ENV should be set in Coolify as Runtime only (not buildtime)
# This allows devDependencies to be installed during build

# Coolify automatically sets PORT, which should map to APP_PORT
# Set APP_PORT=PORT in Coolify environment variables if server only reads APP_PORT
# Or update server code to use: process.env.PORT || process.env.APP_PORT || 5015

CMD ["node", "dist/server.js"]
