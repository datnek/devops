#Installation de nojs
FROM node:latest
#Changer le repertoire racine
WORKDIR /var/api
#Copier le code source vers le repertoire /var/api
COPY . .
#Installer npm
RUN npm install

###
# Test unitaires
###
# Exécuter les tests en désactivant le mode d'écoute
#RUN npm test

#Exposer l'application sur le port 3010
EXPOSE 3010
#Exécuté npm run dev pour demarrer le projet en local
CMD ["npm", "run", "dev"]
