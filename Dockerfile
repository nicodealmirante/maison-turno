# Opcional (Railway funciona perfecto con Nixpacks). Dejo Docker por si querés.
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]
