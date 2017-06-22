FROM alpine:latest
MAINTAINER wicac@yahoo.com

RUN apk update && apk add tar gzip
RUN apk add --update nodejs

RUN mkdir -p /apps
WORKDIR /apps


COPY package.json .

RUN npm install --save express
RUN npm install --save express-session
RUN npm install --save mongoose
RUN npm install --save body-parser
RUN npm install --save dontenv
RUN npm install --save ejs
RUN npm install --save twilio

ENTRYPOINT ["node"]
CMD ["server.js"]