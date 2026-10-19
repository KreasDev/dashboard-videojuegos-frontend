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
# nginx 1.27.x is end-of-life (Nuclei nginx-eol); use the supported stable branch.
# Alpine's nginx package (1.30 stable) is used instead of the official nginx
# image because Alpine also ships the headers-more module, which is required to
# remove the Server header entirely (Nuclei tech-detect:nginx).
FROM alpine:3.24
RUN apk add --no-cache nginx nginx-mod-http-headers-more \
 # Send logs to the container output, as the official nginx image does.
 && ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log \
 && rm -f /etc/nginx/http.d/default.conf
# Serve the compiled static assets (no Vite dev server in the final image).
COPY --from=build /app/dist /usr/share/nginx/html
# SPA routing + access/error logs kept active (used later by Fail2Ban).
COPY default.conf /etc/nginx/http.d/default.conf
# Generic error page that does not reveal the server software.
COPY error.html /usr/share/nginx/error/error.html
# The CSP connect-src must allow the same API origins the bundle was built with.
ARG VITE_LDAP_API_URL=http://localhost:8000
ARG VITE_BACKEND_API_URL=http://localhost:3000
RUN sed -i "s#__CSP_CONNECT_SRC__#${VITE_LDAP_API_URL} ${VITE_BACKEND_API_URL}#" \
      /etc/nginx/http.d/default.conf
EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
