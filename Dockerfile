FROM node:8.10.0
ARG db_url
ENV DATABASE_URL $db_url
ENV TRUST_PROXY 1
ENV GOOGLE_TRACKING_ID UA-55840909-20
# Set a working directory
WORKDIR /usr/src/app

COPY . .

# Install Node.js dependencies
RUN yarn install --no-progress

RUN yarn build --release

# Run the container under "node" user by default
USER node

# Set NODE_ENV env variable to "production" for faster expressjs
ENV NODE_ENV production
WORKDIR /usr/src/app/build
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

CMD [ "node", "server.js" ]
