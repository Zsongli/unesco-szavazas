FROM node:18-alpine as builder

# For some reason building uses the db url, so set it to a valid dummy value
ENV DATABASE_URL="postgresql://"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpx prisma generate
RUN pnpm build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/build .
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node ."]
