FROM node:16.14-alpine
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY src src
COPY tsconfig.json .
EXPOSE 8000
ENTRYPOINT ["npm", "start"]