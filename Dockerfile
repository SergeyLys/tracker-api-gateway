FROM node:20-alpine AS dev
WORKDIR /app

# Install the repository's pnpm version and Nest CLI globally
RUN npm install -g pnpm@10.21.0 @nestjs/cli

# Copy the standalone shared packages and service project.
COPY shared/logger ./shared/logger
COPY shared/types ./shared/types
COPY backend/api-gateway ./backend/api-gateway

# Build shared packages before installing the service.
RUN cd /app/shared/logger && pnpm install --frozen-lockfile && pnpm run build
RUN cd /app/shared/types && pnpm install --frozen-lockfile && pnpm run build
RUN cd /app/backend/api-gateway && pnpm install --frozen-lockfile

# Set working directory to service
WORKDIR /app/backend/api-gateway

# Expose gRPC port
EXPOSE 50050

# Start in watch mode
CMD ["pnpm", "run", "start:dev"]
