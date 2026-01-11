# Multi-stage build for App (Vite/React SPA)
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

# Build Vite app (from monorepo root to ensure workspace dependencies)
WORKDIR /app
RUN pnpm build --filter @pacepard/app

# Production stage with nginx for static files
FROM nginx:alpine AS production

# Copy built static files (Vite outputs to dist/)
COPY --from=base /app/apps/main/dist /usr/share/nginx/html

# Copy nginx configuration (optional, for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
