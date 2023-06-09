FROM alpine

RUN apk add --update nodejs npm

WORKDIR /app

COPY package*.json server.js ./

RUN npm install

copy . .

ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]