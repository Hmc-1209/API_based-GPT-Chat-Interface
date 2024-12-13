FROM node:18-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install --legacy-peer-deps

COPY . /app/

RUN npm run build

RUN npm install -g serve

EXPOSE 30002

CMD ["serve", "-s", "build"]
