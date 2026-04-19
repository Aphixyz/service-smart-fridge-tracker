# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copy เฉพาะไฟล์ที่จำเป็นมาจาก builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src

EXPOSE 3001

CMD ["node", "src/index.ts"]
