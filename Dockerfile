# Stage 1: Build the Vue application
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source (includes .env.production)
COPY . .

# Vite inlines VITE_* variables at BUILD time, so they must be known here.
# Default: values come from .env.production.
# Optional override: --build-arg VITE_API_BASE_URL=https://api.example.com
ARG VITE_API_BASE_URL
ARG VITE_API_PATH

# Build production application
RUN npm run build


# Stage 2: Serve the application
FROM nginx:alpine

# Copy production build to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
