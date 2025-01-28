ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

RUN corepack enable

FROM base AS deps
WORKDIR /frontend

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /frontend

COPY --from=deps /frontend/node_modules ./node_modules

COPY . .

RUN pnpm build

FROM base AS runner
WORKDIR /frontend

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /frontend/.next/static ./.next/static

RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]