FROM node:18.12.1
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY . .
EXPOSE 4200
RUN npm install
#fixme this is dev server
CMD ng serve --host 0.0.0.0 --disable-host-check
#CMD ng build --prod --base-href /angular-app/
