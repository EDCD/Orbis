FROM node:8.10.0 as builder
# Set a working directory
WORKDIR /usr/src/app


COPY . .


# Install Node.js dependencies
RUN yarn install --no-progress
ENV NODE_ENV production
RUN yarn build


# Run the container under "node" user by default
USER node


# Set NODE_ENV env variable to "production" for faster expressjs
WORKDIR /usr/src/app/dist


FROM nginx:alpine as web
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
