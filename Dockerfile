# Stage 1: Build
FROM node:20-bullseye-slim AS build
WORKDIR /app

# NEXT_PUBLIC_* vars must be present during `next build`, not just at runtime —
# Next.js bakes them into the client bundle here.
ARG NEXT_PUBLIC_RESTAURANT_ID
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_RESTAURANT_ID=$NEXT_PUBLIC_RESTAURANT_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-bullseye-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Only prod deps — next/react/mui/node-fetch are in "dependencies",
# so `next start` works. Drops eslint/typescript/tailwind/prettier.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/next.config.* ./

USER node
EXPOSE 3000
CMD ["sh", "-c", "npm run start -- -p ${PORT:-3000}"]
