FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env.example ./.env.example

RUN npx prisma generate
RUN npm run build

EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push && npm run start"]
