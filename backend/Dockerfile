# Dockerfile for the Node.js API

# Use a Node.js image as the base
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy the API files
COPY package.json package-lock.json ./
COPY src ./src

# Install dependencies
RUN npm install

# Expose port 5000 (default port for Node.js APIs)
EXPOSE 5000

# Command to start the API
CMD ["npm", "start"]