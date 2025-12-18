# Multi-stage Dockerfile for Adunni Foods API

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
COPY openapi.yaml ./
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/openapi.yaml ./openapi.yaml
COPY package.json ./
EXPOSE 5000
CMD ["node", "dist/server.js"]
