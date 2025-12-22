# Base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose backend port
EXPOSE 4000

# Start server
CMD ["npm", "start"]
