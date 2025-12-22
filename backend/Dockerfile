FROM node:18-alpine

WORKDIR /app

# Install netcat (for waiting) and dos2unix (to fix windows line endings)
RUN apk add --no-cache netcat-openbsd curl dos2unix

COPY package*.json ./
RUN npm install

COPY . .

# FIX: Convert entrypoint script to Unix format and make executable
RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

# Expose API port
EXPOSE 5000

# Set entrypoint
ENTRYPOINT ["./entrypoint.sh"]
