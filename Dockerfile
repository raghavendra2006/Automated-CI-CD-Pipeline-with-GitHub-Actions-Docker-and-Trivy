# STAGE 1: Build & Dependencies
# Use a specific, slim version of Node for consistency
FROM node:18-alpine AS builder
WORKDIR /app

# Update Alpine packages to patch known CVEs (e.g., OpenSSL vulnerabilities)
RUN apk update && apk upgrade --no-cache

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies if needed for build steps)
# npm ci is preferred in automated environments for deterministic installs
RUN npm ci

# Copy application source code
COPY src/ ./src/

# STAGE 2: Production Runtime
# Start fresh from a slim alpine image
FROM node:18-alpine AS production

# Update Alpine packages to patch known CVEs (e.g., OpenSSL vulnerabilities)
# This ensures libcrypto3 and libssl3 are updated to their latest patched versions
RUN apk update && apk upgrade --no-cache

# Set node environment to production
ENV NODE_ENV=production
WORKDIR /app

# Copy only package files to install production dependencies
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# REMOVE npm and npx to eliminate internal vulnerabilities and reduce attack surface
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy the source code from the builder stage
COPY --from=builder /app/src ./src

# Create a non-root user for enhanced security
# Running applications as root in a container is a major security risk
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

# Run the application directly with node instead of npm
CMD ["node", "src/index.js"]
