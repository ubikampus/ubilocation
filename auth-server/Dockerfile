FROM node:12-alpine

RUN apk add --no-cache git curl bash

COPY package.json /auth-server/package.json
COPY package-lock.json /client/package-lock.json

WORKDIR /auth-server
RUN npm install

COPY . /auth-server

CMD ["npm", "start"]
