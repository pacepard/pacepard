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
# Exclude node_modules as they'll be installed fresh in production
COPY --from=base /app/packages ./packages
COPY --from=base /app/configs ./configs
COPY --from=base /app/apps/web/package.json ./apps/web/

# Install production dependencies only (this creates proper node_modules for workspace)
# We need to install for the entire workspace to resolve workspace:* dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built Next.js app
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/next.config.* ./apps/web/

# Change ownership of all files to nodejs user before switching
RUN chown -R nodejs:nodejs /app

# Set working directory to Web
WORKDIR /app/apps/web

# Switch to non-root user
USER nodejs

# Expose port (default 3000, can be overridden via PORT env var)
EXPOSE 3000

# Start Next.js in production mode
ENV NODE_ENV=production
CMD ["pnpm", "start"]
