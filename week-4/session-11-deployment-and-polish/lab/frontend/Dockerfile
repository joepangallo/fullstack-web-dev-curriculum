# ============================================
# Frontend Dockerfile (Multi-Stage Build)
# ============================================
# This Dockerfile uses a "multi-stage build" pattern:
#
# Stage 1 (build): Install dependencies, build the React app
# Stage 2 (serve): Copy the built files into a lightweight Nginx server
#
# Why multi-stage?
# - The build stage needs Node.js, npm, and all dev dependencies (~1GB)
# - The final image only needs the static HTML/CSS/JS files (~25MB)
# - Multi-stage keeps the final image small and secure
#
# Think of it like baking a cake:
#   Stage 1 = the kitchen (messy, lots of tools)
#   Stage 2 = the plate (clean, just the finished product)
# ============================================

# ---- STAGE 1: Build the React application ----
# "AS build" names this stage so we can reference it later
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install ALL dependencies
# (including devDependencies like Vite, which we need to build)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .

# Run the Vite build command
# This creates optimized static files in the /app/dist directory
# Vite minifies JS, optimizes CSS, and hashes file names for caching
RUN npm run build

# ---- STAGE 2: Serve with Nginx ----
# Start fresh with a tiny Nginx image (~25MB)
# nginx:alpine uses Alpine Linux (minimal OS)
FROM nginx:alpine

# Copy the built files from Stage 1 into Nginx's web directory
# --from=build references the first stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config for SPA routing
# Without this, refreshing on /tasks/123 would show a 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80 by default
EXPOSE 80

# Nginx runs automatically when the container starts
# (it's the default CMD for the nginx:alpine image)
