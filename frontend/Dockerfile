# Dockerfile for the React app

# Use a Node.js image as the base
FROM node:21-alpine

# Set the working directory
WORKDIR /frontend

# Copy the app files
COPY frontend/package.json .
COPY frontend/yarn.lock .

# Install dependencies
RUN yarn install

# Copy the rest of the app files
COPY /frontend .

# Build the React app
RUN yarn build

# Expose port 3000 (default port for React apps)
EXPOSE 3000

# Command to start the app
CMD ["yarn", "start"]