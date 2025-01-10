FROM node:18-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 30002

CMD ["npm", "start"]
