FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5001

COPY .env .env

CMD ["node", "index.js"] 
