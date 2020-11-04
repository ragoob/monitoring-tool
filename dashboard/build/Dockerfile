## Should be executed only once angular build dist
FROM node:12.13.0-alpine

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT 80
ENV LOG_REQUESTS true
ENV USE_GZIP true

RUN npm install -g superstatic

WORKDIR /app
EXPOSE $PORT

COPY ./ /app
COPY superstatic.json /app

ENTRYPOINT superstatic --host 0.0.0.0 --port $PORT --gzip $USE_GZIP --debug $LOG_REQUESTS
