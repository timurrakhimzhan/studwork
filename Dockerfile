FROM node:12-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g typescript
RUN npm install
COPY . ./
EXPOSE 5432 5432
CMD npm run mock-prod