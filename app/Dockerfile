FROM node:18-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

RUN npm build

COPY . /app/

EXPOSE 30002

CMD ["npm", "start"]
