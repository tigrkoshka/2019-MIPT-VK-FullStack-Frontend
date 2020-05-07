FROM node:alpine as build-stage

ARG NODE_ENV
ENV NODE_ENV "$NODE_ENV"

# System deps:

RUN npm --version && apk add --no-cache \
		python \
    autoconf \
    automake \
    bash \
    build-base \
    ca-certificates \
    curl \
    file \
    g++ \
    gcc \
    git \
    lcms2-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm \
    wget \
    zlib-dev


# Installing dependencies:
WORKDIR /code
COPY . /code

# We do not need to tweak this command, `$NODE_ENV` does it for us.
RUN npm i
RUN npm rebuild node-sass
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /code/build /usr/share/nginx/html/2019-2-Track-Frontend-T-Koshkelian
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Creating folders, and files for a project:
# COPY . /code

# Project initialization:
EXPOSE 3000
