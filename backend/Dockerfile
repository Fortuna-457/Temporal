# Dockerfile for the Node.js API

# Use a Node.js image as the base
FROM node:21-alpine

# Set the working directory
WORKDIR /backend

# Copy the API files
COPY backend/package.json .
COPY backend/yarn.lock .

# Install dependencies
RUN yarn install

# Copy the rest of the API files
COPY backend .

# Expose port 5000 (default port for Node.js APIs)
EXPOSE 5000

# Command to start the API
CMD ["yarn", "start"]