FROM node:14-alpine

# Settings working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app
COPY package.json .

# Installing dependencies
RUN npm install

COPY . .

# Running the app
CMD ["node", "./index.js"]
