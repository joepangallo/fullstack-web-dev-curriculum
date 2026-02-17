# ============================================
# Backend Dockerfile
# ============================================
# A Dockerfile is a recipe for building a Docker "image" -
# a portable, self-contained package that includes your
# app code, dependencies, and runtime environment.
#
# Docker ensures your app runs the same way everywhere:
# your laptop, your teammate's laptop, and production servers.
#
# Key Dockerfile concepts:
#   FROM     - Base image to build on top of
#   WORKDIR  - Set the working directory inside the container
#   COPY     - Copy files from your machine into the container
#   RUN      - Execute a command during the build
#   EXPOSE   - Document which port the app uses
#   CMD      - Command to run when the container starts
# ============================================

# Start from the official Node.js 20 image (slim = smaller size)
# "slim" removes unnecessary OS packages to reduce image size
# from ~1GB to ~200MB. Use "alpine" for even smaller (~100MB).
FROM node:20-slim

# Set the working directory inside the container
# All subsequent commands will run from /app
WORKDIR /app

# Copy package files FIRST (for better caching)
# Docker caches each layer. If package.json hasn't changed,
# Docker skips the npm install step (which is slow).
# This is called "layer caching" and speeds up builds.
COPY package*.json ./

# Install ONLY production dependencies (no devDependencies)
# npm ci = "clean install" - faster and more reliable than npm install
# --production = skip devDependencies (jest, nodemon, etc.)
RUN npm ci --production

# Now copy the rest of the application code
# This is AFTER npm install so that code changes don't
# invalidate the npm install cache layer
COPY . .

# Generate the Prisma client
# Prisma needs to generate its client library before the app can run
# This reads the schema.prisma file and creates the client code
RUN npx prisma generate

# Document the port this app listens on
# EXPOSE doesn't actually publish the port - it's documentation
# for other developers. The actual port mapping happens in
# docker-compose.yml or the docker run command.
EXPOSE 3001

# Command to run when the container starts
# This is the same as running "node src/app.js" in your terminal
# Use JSON array syntax (exec form) instead of shell form
# for proper signal handling (important for graceful shutdown)
CMD ["node", "src/app.js"]
