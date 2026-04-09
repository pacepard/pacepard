# syntax=docker/dockerfile:1
#
# Build from repo root:  docker build -f apps/web/Dockerfile -t pacepard-web .
#
# Coolify: pass TURBO_TOKEN / TURBO_TEAM as build args for remote cache. If builds are still
# slow, enable persistent Docker BuildKit cache on the server and/or raise the deploy timeout.
#
# Root install graph is slim: mintlify/changesets/del/rimraf live in tooling/devtools (excluded
# from context via .dockerignore). Runtime image uses Next "standalone" (no pnpm in prod).

FROM node:20-alpine AS base

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT=1

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /web

# 1) Manifests only (keeps `pnpm install` cached when app source changes).
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

# Smaller default avoids swap thrash on 2–4GB build VMs; override: --build-arg NODE_MEMORY_LIMIT=6144
ARG NODE_MEMORY_LIMIT=4096

RUN --mount=type=cache,id=pnpm-store-pacepard-web,target=/pnpm/store \
    PNPM_STORE_DIR=/pnpm/store \
    pnpm config set package-import-method copy && \
    pnpm config set network-concurrency 24 && \
    pnpm install --frozen-lockfile --filter @pacepard/web...

# 2) Sources (invalidates from here on code edits).
COPY packages ./packages
COPY configs ./configs
COPY apps/web ./apps/web

ENV NODE_OPTIONS=--max-old-space-size=${NODE_MEMORY_LIMIT}
RUN pnpm build --filter @pacepard/web

# Runtime: traced bundle only (see next.config.ts output: "standalone").
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=base --chown=nodejs:nodejs /web/apps/web/.next/standalone ./
COPY --from=base --chown=nodejs:nodejs /web/apps/web/.next/static ./apps/web/.next/static
COPY --from=base --chown=nodejs:nodejs /web/apps/web/public ./apps/web/public

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD sh -c 'node -e "const p=process.env.PORT||3000;require(\"http\").get(\"http://127.0.0.1:\"+p,r=>process.exit(r.statusCode===200?0:1)).on(\"error\",()=>process.exit(1))"'

CMD ["node", "apps/web/server.js"]
