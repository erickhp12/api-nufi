FROM node:22-alpine3.19

# Settings working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app
COPY package.json .

# Installing dependencies
RUN npm install

COPY . .

# Running the app
CMD ["npm", "run", "start"]
