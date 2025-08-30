# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app/frontend

COPY package*.json ./
RUN npm ci --only=production

# Отключаем telemetry
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
