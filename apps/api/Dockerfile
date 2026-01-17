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
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# Build API app
WORKDIR /app
RUN pnpm build --filter @pacepard/api

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy production dependencies (excluding dev dependencies)
COPY --from=base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=base --chown=nodejs:nodejs /app/configs ./configs

# Copy built API app
COPY --from=base --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=base --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist

# Set working directory to API
WORKDIR /app/apps/api

# Switch to non-root user
USER nodejs

# Expose port (Coolify uses dynamic port assignment via $PORT env var)
# Standard port is 3000, but Coolify will map dynamically
EXPOSE 3000

# Health check (uses APP_PORT or PORT env var, defaults to 3000)
# Note: Server uses APP_PORT, but Coolify sets PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.APP_PORT || process.env.PORT || 3000; require('http').get(`http://localhost:${port}/health`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start API in production mode
# ⚠️ IMPORTANT: Do NOT set NODE_ENV here if using Coolify!
# NODE_ENV should be set in Coolify as Runtime only (not buildtime)
# This allows devDependencies to be installed during build

# Coolify automatically sets PORT, which should map to APP_PORT
# Set APP_PORT=PORT in Coolify environment variables if server only reads APP_PORT
# Or update server code to use: process.env.PORT || process.env.APP_PORT || 3000

CMD ["node", "dist/server.js"]
