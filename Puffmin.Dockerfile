FROM node:18
WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 8081

CMD [ "npm", "run", "dev", "--workspace=Puffmin" ]