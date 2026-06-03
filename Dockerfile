# ============================================================
# CityFix — Dockerfile
# Base: node:20-alpine (ligero y moderno)
# ============================================================

FROM node:20-alpine

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los manifiestos primero para aprovechar el cache de capas
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para poder correr Jest)
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Comando por defecto: ejecutar los tests E2E
CMD ["npm", "test"]
