ARG MOCK
FROM node:12-alpine
WORKDIR /app
COPY package.json ./
RUN npm install -g typescript
RUN npm install
COPY . ./
RUN echo
CMD if [[ -z "$MOCK" ]] ; then npm run start ; else npm run mock-prod ; fi