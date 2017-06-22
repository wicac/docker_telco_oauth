FROM alpine:latest
MAINTAINER wicac@yahoo.com

RUN apk update && apk add tar gzip
RUN apk add --update nodejs

RUN mkdir -p /apps/docker-telco-auth/models
RUN mkdir -p /apps/docker-telco-auth/lib
RUN mkdir -p /apps/docker-telco-auth/views
RUN mkdir -p /apps/docker-telco-auth/public

WORKDIR /apps/docker-telco-auth

COPY models /apps/docker-telco-auth/models
COPY lib /apps/docker-telco-auth/lib
COPY views /apps/docker-telco-auth/views
COPY public /apps/docker-telco-auth/public

COPY package.json .
COPY app.js .

RUN npm install --save express
RUN npm install --save express-session
RUN npm install --save mongoose
RUN npm install --save body-parser
RUN npm install --save dotenv
RUN npm install --save ejs
RUN npm install --save twilio

ENTRYPOINT ["node"]
CMD ["app.js"]