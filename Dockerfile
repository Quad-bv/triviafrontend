# Stage 1: Build the Vue application
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build production application
RUN npm run build


# Stage 2: Serve the application
FROM nginx:alpine

# Copy production build to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
