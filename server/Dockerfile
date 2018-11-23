FROM node:8.10.0 as builder

WORKDIR /app

COPY . ./

RUN npm install --prod

FROM astefanutti/scratch-node

COPY --from=builder /app /

ENTRYPOINT ["./node", "./bin/www"]
