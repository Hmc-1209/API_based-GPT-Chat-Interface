FROM node:18-slim

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app

RUN npm run build --no-cache

RUN npm install -g serve

EXPOSE 3000

# CMD ["serve", "-s", "build", "-l", "3000"]
