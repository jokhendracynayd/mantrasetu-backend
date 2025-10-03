# Use Node.js 18 LTS
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Verify build output
RUN ls -la dist/

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3035

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3035/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/src/main.js"]