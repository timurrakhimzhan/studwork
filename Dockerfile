FROM node:12-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g typescript
RUN npm install
COPY . ./
CMD npm run mock-prod