# Multi-stage build for Service (Next.js)
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

# Build Next.js app (from monorepo root)
WORKDIR /app
RUN pnpm build --filter @pacepard/service

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

# Copy built Next.js app
COPY --from=base /app/apps/service/package.json ./apps/service/
COPY --from=base /app/apps/service/.next ./apps/service/.next
COPY --from=base /app/apps/service/public ./apps/service/public
COPY --from=base /app/apps/service/next.config.* ./apps/service/ 2>/dev/null || true
COPY --from=base /app/apps/service/markdown ./apps/service/markdown 2>/dev/null || true
COPY --from=base /app/apps/service/package-lock.json ./apps/service/ 2>/dev/null || true

# Set working directory to Service
WORKDIR /app/apps/service

# Expose port (default 3000, can be overridden via PORT env var)
EXPOSE 3000

# Health check (optional - uncomment if /api/health endpoint exists)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start Next.js in production mode
ENV NODE_ENV=production
CMD ["pnpm", "start"]
