FROM node

ADD dicionario-api dicionario-api

WORKDIR dicionario-api

RUN npm install

ENTRYPOINT npm start
