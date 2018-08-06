FROM node:8.10.0
# Set a working directory
WORKDIR /usr/src/app

COPY . .
RUN chown --recursive node:node /usr/src/app

# Install Node.js dependencies
RUN yarn install --no-progress
# Run the container under "node" user by default
USER node

# Set NODE_ENV env variable to "production" for faster expressjs
ENV NODE_ENV production
CMD [ "node", "./bin/www" ]
