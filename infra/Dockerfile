FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile=false
RUN pnpm turbo run build --filter=web

FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/package.json ./package.json
EXPOSE 3000
CMD ["npx", "next", "start"]
