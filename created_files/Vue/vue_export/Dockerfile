# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present) to install dependencies
COPY package*.json ./

# Install dependencies (npm i)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the React app will run on (default is 5173 for Vite, or 3000 for Create React App)
EXPOSE 5173

# Command to start the development server (npm run dev)
# CMD ["npm", "run", "dev"]
CMD ["tail", "-f", "/dev/null"]