# Multi-stage build: compile the Vite app with Node, serve it with nginx.

# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app
# Install dependencies from the lockfile (reproducible).
COPY package*.json ./
RUN npm ci
# Copy the source and produce the static build in /app/dist.
COPY . .
# Vite inlines VITE_* variables at BUILD time. The repo .env is excluded by
# .dockerignore, so provide these as build args (non-secret browser URLs that
# must be reachable from the host browser, not internal Docker names).
ARG VITE_LDAP_API_URL=http://localhost:8000
ARG VITE_BACKEND_API_URL=http://localhost:3000
RUN printf 'VITE_LDAP_API_URL=%s\nVITE_BACKEND_API_URL=%s\n' \
      "$VITE_LDAP_API_URL" "$VITE_BACKEND_API_URL" > .env.production
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine
# Serve the compiled static assets (no Vite dev server in the final image).
COPY --from=build /app/dist /usr/share/nginx/html
# SPA routing + access/error logs kept active (used later by Fail2Ban).
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# nginx:alpine already runs `nginx -g 'daemon off;'` as its default CMD.
