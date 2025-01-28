ARG NODE_VERSION=20.11.1
ARG PNPM_VERSION=9.9.0

FROM node:${NODE_VERSION}-slim AS base

ARG PNPM_VERSION

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION}

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json prisma ./

RUN pnpm fetch && pnpm install --frozen-lockfile && pnpm prisma generate

COPY . .

RUN pnpm build

FROM node:${NODE_VERSION}-slim AS runtime

ARG PNPM_VERSION

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION}

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./
COPY --from=base /app/tsconfig.json ./

EXPOSE 5001

CMD ["pnpm", "start:migrate:prod"]