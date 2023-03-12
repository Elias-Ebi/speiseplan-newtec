FROM node:18.12.1
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD npm run build
CMD npm run start:prod
