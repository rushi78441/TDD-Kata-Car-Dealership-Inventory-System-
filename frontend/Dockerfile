FROM node:20-alpine

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install ALL dependencies (including devDependencies like @vitejs/plugin-react)
RUN npm install

# Copy application files
COPY . .

# Grant write permissions so Vite can create temporary build/config files
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]