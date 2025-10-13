# Use official Node.js 20 LTS (Debian-based)
FROM node:20-buster

# Set the working directory
WORKDIR /app

# Copy dependency files (leverage Docker cache)
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .

# Expose port (Render sets $PORT automatically)
EXPOSE 8000

# Use pm2-runtime to keep process alive inside container
CMD ["npm", "run", "pm2"]
