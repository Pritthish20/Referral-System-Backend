# Use official Node.js image (lightweight but stable)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Run lint as a build step 
RUN npm run lint

# Expose port used by the app
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

