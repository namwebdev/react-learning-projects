FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 8000

CMD ["pnpm", "start"] 