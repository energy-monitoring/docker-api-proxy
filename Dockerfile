# Verwende ein Node.js-Image als Basis
FROM node:14

# Erstelle ein Verzeichnis für die App
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Anwendungsquellcodes
COPY . .

# Der Port, auf dem die App läuft
EXPOSE 8000

# Startbefehl für die App
CMD ["node", "server.js"]

