FROM node:12-alpine

RUN apk add --no-cache git curl bash

COPY . /client
COPY package.json /client/package.json
WORKDIR /client
RUN npm install


CMD ["npm", "start"]
