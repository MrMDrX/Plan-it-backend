FROM  node:20-alpine

WORKDIR /app

COPY . ./

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]