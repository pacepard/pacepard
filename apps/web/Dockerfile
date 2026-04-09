# syntax=docker/dockerfile:1
# Coolify / self-hosted: ensure BuildKit (DOCKER_BUILDKIT=1). If `next build` is killed
# with exit 255, raise the build container memory limit and check debug logs for OOM.
#
# Optional build args for Turborepo remote cache (repeat builds):
#   docker build --build-arg TURBO_TOKEN=... --build-arg TURBO_TEAM=...
# Pass the same from Coolify as Docker Build Arguments / environment.

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

RUN apk add --no-cache python3 make g++

WORKDIR /web

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/web/docker.npmrc ./.npmrc

COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM

# BuildKit cache: reuses tarballs between builds. `package-import-method=copy`
# materializes files into the layer (hardlinks from the cache mount can break in the image).
RUN --mount=type=cache,id=pnpm-store-pacepard-web,target=/pnpm/store \
    PNPM_STORE_DIR=/pnpm/store \
    pnpm config set package-import-method copy && \
    pnpm install --frozen-lockfile --filter @pacepard/web...

# Reduce OOM risk during Next.js compile on small build VMs.
ENV NODE_OPTIONS=--max-old-space-size=6144

WORKDIR /web
RUN pnpm build --filter @pacepard/web

# Production: reuse the full workspace tree from base (no second pnpm install).
FROM node:20-alpine AS production

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /web

COPY --from=base --chown=nodejs:nodejs /web /web

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c 'node -e "const p=process.env.PORT||3000;require(\"http\").get(\"http://127.0.0.1:\"+p,r=>process.exit(r.statusCode===200?0:1)).on(\"error\",()=>process.exit(1))"'

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

WORKDIR /web
# `exec` ensures pnpm resolves `next` from the filtered workspace (avoids missing PATH to .bin).
CMD ["pnpm", "--filter", "@pacepard/web", "exec", "next", "start"]
