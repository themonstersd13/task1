FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm AS build
WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:4000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD ["http-server", "dist", "-p", "80", "-a", "0.0.0.0"]
