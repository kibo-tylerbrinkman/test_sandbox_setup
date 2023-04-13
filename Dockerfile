FROM node:alpine
RUN git clone --depth 1 
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "index.js"]
