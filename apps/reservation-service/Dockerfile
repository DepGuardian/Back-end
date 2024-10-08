FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build reservation-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/reservation-service ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]