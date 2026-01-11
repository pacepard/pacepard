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

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# Build Vite app
WORKDIR /app
RUN pnpm build --filter @pacepard/app

# Production stage - use nginx to serve static files
FROM nginx:alpine AS production

# Copy built static files
COPY --from=base /app/apps/main/dist /usr/share/nginx/html

# Copy nginx configuration (optional - uses default if not present)
# COPY apps/main/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
