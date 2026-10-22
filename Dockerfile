# =================================================================
# Induktr Studio v2.0 — Canonical High-Performance Bun Dockerfile
# Target: oven/bun:1.2-alpine (< 95MB footprint, non-root user)
# =================================================================

FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# 1. Install workspace dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/contracts/package.json ./packages/contracts/
RUN bun install --frozen-lockfile

# 2. Build backend and contracts
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run --filter @induktr/contracts build
RUN bun run --filter @induktr/api prisma:generate
RUN bun run --filter @induktr/api build

# 3. Production runner (Non-root security perimeter)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Security: Non-root user execution
USER bun

COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/apps/api ./apps/api
COPY --from=builder --chown=bun:bun /app/packages/contracts ./packages/contracts
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

EXPOSE 4000

CMD ["bun", "run", "apps/api/src/main.ts"]
