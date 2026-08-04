FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.16.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/cli/package.json packages/cli/package.json
COPY packages/mcp/package.json packages/mcp/package.json
COPY apps/apify-actor/package.json apps/apify-actor/package.json
RUN pnpm install --frozen-lockfile --prod --filter linkglimpse-apify-actor...

COPY packages/cli packages/cli
COPY apps/apify-actor apps/apify-actor

CMD ["node", "apps/apify-actor/src/main.mjs"]
