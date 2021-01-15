FROM node:12-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g typescript
RUN npm install
COPY . ./
RUN npm run mock-prod