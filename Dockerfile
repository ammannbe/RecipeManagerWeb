# Dockerfile
FROM node:16.6-alpine

# create destination directory
RUN mkdir -p /usr/src/recipe-manager
WORKDIR /usr/src/recipe-manager

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# Get init data
COPY docker/root /
RUN chmod a+x /usr/local/bin/entrypoint.sh

# copy the app, note .dockerignore
COPY . /usr/src/recipe-manager/
RUN npm install

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT /usr/local/bin/entrypoint.sh
