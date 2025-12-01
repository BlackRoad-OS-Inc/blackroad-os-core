FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema for generation
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm db:generate

# Copy source files
COPY . .

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm for tsx
RUN corepack enable && corepack prepare pnpm@8.15.8 --activate

ENV NODE_ENV=production

# Copy everything from builder
COPY --from=builder /app ./

EXPOSE 4000

# Start the API server
CMD ["pnpm", "dev:api"]
