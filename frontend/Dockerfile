FROM node:latest

WORKDIR /app

COPY package* /app/

RUN npm install
RUN npm install -g serve

COPY . . 

RUN npm run build

CMD ["build && serve"]


