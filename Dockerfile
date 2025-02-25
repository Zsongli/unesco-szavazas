FROM node:22-alpine AS base
RUN apk add --no-cache openssl && npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./


FROM base AS deps
# do not install devdependencies, as those will be bundled by vite
# this is run here separately so the pnpm cache will not be in the final build
RUN pnpm install --frozen-lockfile --prod


FROM base AS builder

# For some reason building uses the db url, so set it to a valid dummy value
ENV DATABASE_URL="postgresql://"

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build


FROM base AS final

COPY --from=deps /app/node_modules ./node_modules
COPY ./prisma ./prisma
RUN pnpm prisma generate
COPY --from=builder /app/build .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node ."]
