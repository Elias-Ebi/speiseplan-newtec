FROM node:18.12.1 AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli@15.2.6
COPY . .
RUN ng build --configuration=production

FROM nginx:latest
EXPOSE 80
COPY default.conf /etc/nginx/conf.d
COPY --from=build /app/dist/frontend /usr/share/nginx/html
