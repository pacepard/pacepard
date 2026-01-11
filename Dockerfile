# Multi-service Dockerfile for Pacepard Monorepo
# Build specific services using: docker build --target <service> -t <name> .
# Available targets: base, web, api, service, main

# ============================================================================
# Base stage - shared dependencies and build setup
# ============================================================================
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
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages first (they're dependencies)
RUN pnpm build --filter './packages/*' --filter './configs/*' || true

# ============================================================================
# Web Service (Next.js)
# ============================================================================
FROM base AS web-base

# Build Next.js app (from monorepo root to respect outputFileTracingRoot)
WORKDIR /app
RUN pnpm build --filter @pacepard/web

FROM node:20-alpine AS web

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy production dependencies
COPY --from=web-base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=web-base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=web-base --chown=nodejs:nodejs /app/configs ./configs

# Copy built Next.js app
COPY --from=web-base --chown=nodejs:nodejs /app/apps/web/package.json ./apps/web/
COPY --from=web-base --chown=nodejs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=web-base --chown=nodejs:nodejs /app/apps/web/public ./apps/web/public
COPY --from=web-base --chown=nodejs:nodejs /app/apps/web/next.config.* ./apps/web/

WORKDIR /app/apps/web
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

ENV NODE_ENV=production
CMD ["pnpm", "start"]

# ============================================================================
# API Service (Express/Node.js)
# ============================================================================
FROM base AS api-base

# Build API app
WORKDIR /app
RUN pnpm build --filter @pacepard/api

FROM node:20-alpine AS api

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy production dependencies
COPY --from=api-base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=api-base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=api-base --chown=nodejs:nodejs /app/configs ./configs

# Copy built API app
COPY --from=api-base --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=api-base --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
USER nodejs

EXPOSE 5015

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5015/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

ENV NODE_ENV=production
ENV APP_PORT=5015

CMD ["node", "dist/server.js"]

# ============================================================================
# Service Application (Next.js)
# ============================================================================
FROM base AS service-base

# Build Next.js app
WORKDIR /app
RUN pnpm build --filter @pacepard/service

FROM node:20-alpine AS service

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy production dependencies
COPY --from=service-base --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=service-base --chown=nodejs:nodejs /app/packages ./packages
COPY --from=service-base --chown=nodejs:nodejs /app/configs ./configs

# Copy built Next.js app
COPY --from=service-base --chown=nodejs:nodejs /app/apps/service/package.json ./apps/service/
COPY --from=service-base --chown=nodejs:nodejs /app/apps/service/.next ./apps/service/.next
COPY --from=service-base --chown=nodejs:nodejs /app/apps/service/public ./apps/service/public
COPY --from=service-base --chown=nodejs:nodejs /app/apps/service/next.config.* ./apps/service/

WORKDIR /app/apps/service
USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

ENV NODE_ENV=production
CMD ["pnpm", "start"]

# ============================================================================
# Main Application (Vite/React with Nginx)
# ============================================================================
FROM base AS main-base

# Build Vite app
WORKDIR /app
RUN pnpm build --filter @pacepard/app

FROM nginx:alpine AS main

# Copy built static files
COPY --from=main-base /app/apps/main/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
