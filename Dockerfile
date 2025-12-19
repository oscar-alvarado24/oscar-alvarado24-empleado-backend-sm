# ==================================
# Stage 1: Build TypeScript
# ==================================
FROM node:20.19.6-alpine3.23 AS builder

# Metadata
LABEL maintainer="devops@company.com"
LABEL description="Microservicio Empleados Node.js + TypeScript"

# Actualizar paquetes del sistema y parches de seguridad
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar TODAS las dependencias (incluidas devDependencies para compilar)
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copiar código fuente
COPY src ./src

# Compilar TypeScript a JavaScript
RUN npm run build

# Instalar solo dependencias de producción
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ==================================
# Stage 2: Production Image
# ==================================
FROM node:20.19.6-alpine3.23

# Instalar dumb-init y actualizar paquetes de seguridad
RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json para tener metadata
COPY --chown=nodejs:nodejs package*.json ./

# Copiar dependencias de producción desde builder
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules

# Copiar código compilado (dist) desde builder
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
# Usar dumb-init como entrypoint para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto - ejecutar el código compilado
CMD ["node", "dist/server.js"]