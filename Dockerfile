FROM node:10.16-alpine as build-stage
MAINTAINER Nobuyuki Matsui <nobuyuki.matsui@gmail.com>

WORKDIR /opt/app
COPY package.json /opt/app/
COPY package-lock.json /opt/app/
COPY babel.config.js /opt/app/
COPY postcss.config.js /opt/app/
COPY vue.config.js /opt/app/
COPY .browserslistrc /opt/app/
COPY .eslintrc.js /opt/app/
COPY public/ /opt/app/public/
COPY src/ /opt/app/src/
RUN npm install && npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /opt/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
