# Multi-stage build for API (Express server)
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files for dependency resolution (copy entire directories)
COPY packages ./packages
COPY configs ./configs
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN pnpm build --filter './packages/*' --filter './configs/*'

# Build API (from monorepo root to ensure workspace dependencies are available)
# Note: tsc-alias and copyfiles are used in the build script and should be available
# via pnpm install (they may be hoisted from root or other packages)
WORKDIR /app
RUN pnpm build --filter @pacepard/api

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy only production dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/configs ./configs

# Copy built API (including _data and views folders copied by build script)
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/package.json ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Expose port (default 3000, can be overridden via PORT env var)
EXPOSE 3000

# Health check (optional - uncomment if /health endpoint exists)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "dist/server.js"]
