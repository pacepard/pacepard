# syntax=docker/dockerfile:1
#
# Build from repo root:  docker build -f apps/web/Dockerfile -t pacepard-web .
#
# Coolify: If "ApplicationDeploymentJob has timed out", increase the deployment timeout in
# Server or Application settings. This Dockerfile is tuned so cold builds are usually a few
# minutes (vs 30–60+ min when Alpine was compiling gcc on a slow mirror).
# Optional: TURBO_TOKEN / TURBO_TEAM build args for remote cache on repeat deploys.
#
# Native toolchain (python3/make/g++) was removed: it often added 10–30+ minutes on Alpine
# mirrors; this app has no node-gyp dependencies in the web filter tree.

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT=1

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /web

# 1) Manifests only so `pnpm install` stays cached when only source changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/web/docker.npmrc ./.npmrc
COPY apps/web/package.json ./apps/web/package.json
COPY packages/ui/package.json ./packages/ui/package.json
COPY configs/eslint/package.json ./configs/eslint/package.json
COPY configs/typescript/package.json ./configs/typescript/package.json

ARG TURBO_TOKEN=""
ARG TURBO_TEAM=""
ENV TURBO_TOKEN=$TURBO_TOKEN \
    TURBO_TEAM=$TURBO_TEAM

RUN --mount=type=cache,id=pnpm-store-pacepard-web,target=/pnpm/store \
    PNPM_STORE_DIR=/pnpm/store \
    pnpm config set package-import-method copy && \
    pnpm install --frozen-lockfile --filter @pacepard/web...

# 2) Source (invalidates from here on code edits).
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

ENV NODE_OPTIONS=--max-old-space-size=6144

RUN pnpm build --filter @pacepard/web

# Production: reuse workspace from base (no second install).
FROM node:20-alpine AS production

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1

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

CMD ["pnpm", "--filter", "@pacepard/web", "exec", "next", "start"]
