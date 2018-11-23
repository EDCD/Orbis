FROM node:10 as builder

WORKDIR /app

COPY . ./

RUN npm install --prod

FROM astefanutti/scratch-node:10

COPY --from=builder /app /

ENTRYPOINT ["./node", "./bin/www"]
