FROM node:12-alpine

COPY package.json /auth-server/package.json
WORKDIR /auth-server
RUN npm install

COPY . /auth-server

CMD ["npm", "start"]
