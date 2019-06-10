FROM node

ADD api dictionary-api

WORKDIR dictionary-api/

RUN npm install && npm audit fix

ENTRYPOINT npm start
