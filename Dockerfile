FROM node:20-alpine

WORKDIR /usr/app

RUN apk add curl

COPY package.json package-lock.json ./

RUN npm ci

ADD . .

HEALTHCHECK --interval=10m --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

CMD node ./dist/main.js