FROM node:14.20.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app
COPY . .
EXPOSE 4200
RUN npm install
#fixme this is dev server
CMD ng serve --host 0.0.0.0 --disable-host-check
