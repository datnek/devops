#############
## Fchier docker file
#############

# Image de base
FROM node:latest as node

# Installer chrome pour les tests
#RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
#RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
#RUN apt-get update && apt-get install -yq google-chrome-stable

# Définir le repertoire de travail
WORKDIR /var/client

# copier les fichiers dans le dossier app
COPY . .

# Installer npm
RUN npm install

# Installer angular
RUN npm install -g @angular/cli@10.0.1

#Vérifier la syntaxe de l'application
#RUN npm run lint

###
# Test unitaires
###
# Exécuter les tests en désactivant le mode d'écoute
#RUN npm run test

# Exécuter les tests end to end
#RUN npm run e2e --port 4202

# Géner les fichiers de mise en production dans le repertoire dist
RUN npm run build --prod --output-path=dist

#Exposer l'application
EXPOSE 4001

####
# Déployer l'application sur un serveur apache en développement
####
# server
#FROM httpd:2.4
#Copier l'artifact vers de l'environement de bluid
#COPY --from=node /var/client/dist /usr/local/apache2/htdocs/

CMD [ "npm" , "start" ]
