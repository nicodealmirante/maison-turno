FROM node:20-bullseye-slim

WORKDIR /app

# Prisma suele necesitar openssl en Debian slim
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiamos package + prisma schema ANTES de instalar (para que postinstall encuentre schema)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

RUN npm install

# Ahora sí copiamos el resto
COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm","start"]
