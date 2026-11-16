FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_DTS_BASE_URL
ARG VITE_APP_VERSION
ENV VITE_DTS_BASE_URL=$VITE_DTS_BASE_URL
ENV VITE_APP_VERSION=$VITE_APP_VERSION

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
