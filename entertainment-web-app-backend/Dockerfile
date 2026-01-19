FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN chown -R node:node /app
USER node

CMD ["npm", "run", "dev"]