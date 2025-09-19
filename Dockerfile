# Multi-stage Dockerfile for Production
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies for Prisma and native modules
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (use npm install if no package-lock.json exists)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Install all dependencies including dev dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy only package files, prisma, and config files (source code will be mounted)
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start development server
CMD ["npm", "run", "start:dev"]

# Production build stage
FROM base AS build
WORKDIR /app

# Install all dependencies for building
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

# Install system dependencies for Prisma and native modules
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    curl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi && npm cache clean --force

# Copy built application from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/v1/health || exit 1

# Start the application
CMD ["npm", "start"]
