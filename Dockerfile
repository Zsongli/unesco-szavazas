FROM node:18-alpine as builder

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

CMD ["pnpx", "prisma", "migrate", "deploy"]
CMD ["node", "."]