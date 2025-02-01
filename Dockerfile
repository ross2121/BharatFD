FROM node:20

WORKDIR /app

COPY package* .
COPY ./prisma .
RUN tsc
RUN npm install
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]