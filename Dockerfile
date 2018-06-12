FROM node:10.4.0-alpine
COPY . /app
WORKDIR /app
RUN yarn
ENTRYPOINT ["yarn", "start"]
