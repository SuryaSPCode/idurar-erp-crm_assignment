FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the dev server port (Vite/Next usually runs on 3000)
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
