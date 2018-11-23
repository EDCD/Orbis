FROM node:10

WORKDIR /app

COPY . ./

ENV NODE_ENV production

RUN npm install --prod

ENTRYPOINT ["node", "./bin/www"]
