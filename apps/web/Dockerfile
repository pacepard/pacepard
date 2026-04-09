# Multi-stage build for Web (Next.js)
FROM node:20-alpine AS base

# Install pnpm (match root package.json packageManager)
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Install build dependencies (for native modules)
RUN apk add --no-cache python3 make g++

WORKDIR /web

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files for dependency resolution
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

# Install only @pacepard/web and its dependency graph (avoids private @tiptap-pro
# packages used by other workspace apps; full monorepo install needs TIPTAP_PRO_TOKEN).
RUN pnpm install --frozen-lockfile --filter @pacepard/web...

# Build Next.js app (from monorepo root to respect outputFileTracingRoot)
WORKDIR /web
RUN pnpm build --filter @pacepard/web

# Production stage
FROM node:20-alpine AS production

# Install pnpm (match root package.json packageManager)
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /web

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY .npmrc* ./

# Copy package.json files and source code for workspace dependencies
# Note: packages use source files directly (no dist), so we need their src directories
COPY --from=base /web/packages ./packages
COPY --from=base /web/configs ./configs
COPY --from=base /web/apps/web/package.json ./apps/web/
COPY --from=base /web/apps/web/next.config.* ./apps/web/
COPY --from=base /web/apps/web/postcss.config.* ./apps/web/
COPY --from=base /web/apps/web/tsconfig.json ./apps/web/

# Set pnpm store directory to a consistent location (fixes store mismatch issues)
# This ensures pnpm uses the same store regardless of user
ENV PNPM_STORE_DIR=/web/.pnpm-store
ENV PNPM_HOME=/web/.local/share/pnpm
# Set temp directory to a writable location within /web
ENV TMPDIR=/web/.tmp

# Create store directory and temp directory; ensure /web is owned by nodejs before switching users
RUN mkdir -p /web/.pnpm-store /web/.local/share/pnpm /web/.tmp && \
    chown -R nodejs:nodejs /web

# Switch to nodejs user BEFORE installing to avoid store path conflicts
USER nodejs

# Same filtered install as build stage (workspace:* to @pacepard/ui only; no full monorepo)
RUN rm -rf /web/.pnpm-store /web/.local/share/pnpm node_modules 2>/dev/null || true && \
    mkdir -p /web/.pnpm-store /web/.local/share/pnpm && \
    pnpm install --frozen-lockfile --filter @pacepard/web...

# Copy built Next.js app and source files (needed for server components at runtime)
USER root
COPY --from=base /web/apps/web/.next ./apps/web/.next
COPY --from=base /web/apps/web/public ./apps/web/public
COPY --from=base /web/apps/web/src ./apps/web/src

# Ensure all files are owned by nodejs user (especially the newly copied files)
RUN chown -R nodejs:nodejs /web

# Switch back to nodejs user for runtime
USER nodejs

# Expose port (default 3000; Next honors PORT at runtime)
EXPOSE 3000

# Health check uses PORT when set (default 3000)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c 'node -e "const p=process.env.PORT||3000;require(\"http\").get(\"http://127.0.0.1:\"+p,r=>process.exit(r.statusCode===200?0:1)).on(\"error\",()=>process.exit(1))"'

# Start Next.js in production mode from workspace root using pnpm filter
# This ensures binaries are found correctly in the workspace structure
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true
WORKDIR /web
CMD ["pnpm", "--filter", "@pacepard/web", "start"]
