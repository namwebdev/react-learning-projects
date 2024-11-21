# Stage 1: Base Image with pnpm
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Stage 2: Install Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN pnpm install

# Stage 3: Build the Application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Run Prisma client generation and build the Next.js application
RUN pnpm prisma generate
RUN pnpm build

# Stage 4: Production Server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary files for the production environment
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js will use
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]