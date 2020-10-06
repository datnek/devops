# I. Objectif du projet

Il est question de mettre en place une architecture DEVOPS constitué de :
- Un code source local
- Une plateforme de gestion du code source et déployement 
- Un registrer docker 
- Un serveur applicative 

![2020-07-12 10.45.47.jpg](/.attachments/2020-07-12%2010.45.47-6242dca9-0c40-4ade-9d2c-a1541be640f1.jpg)

# II. Mise en place de la structure 

Pour la réussite de ce projet, nous disposerons de éléments suivant:
- Azure devops: qui nous servira comme outil d'intégration continu, de test d'intégration et gestion du code 
- LWS: qui sera le serveur sur lequel sera déployé la nouvelle image docker gérée
- Docker hub: qui va permettre de stocker nos images 

##**a. Comment ça marche ?**

- Le code en local doit être envoyé en permanence à azuredevops après chaque changement
- Azuredevops se chargera d'exécuter toutes les intructions disponible dans Dockerfile (installation des dépendances, compilation du projet, création d'une nouvelle image docker basé sur le code, test unitaire)
- Docker image task du pupile Azuredevops enverra par la suite la nouvelle image générée sur le registre docker
- La tâche **publishcodecoverageresult** d'azure pipeline permettra de créer une couverture de test unitaire
- Un artifact sera crée en se basant sur le code source de l'api et le serveur
- Azuredevops se chargera par la suite de déployé l'artifact crée sur lws

Cette figure illsutre le mécanisme clair du fonctionnement sans toute fois entré en détail.

![Screen Shot 2020-07-08 at 13.45.21.png](/.attachments/Screen%20Shot%202020-07-08%20at%2013.45.21-cbe1ca36-8de0-4f1a-9c1a-fc48ab42109d.png)

## **b. Outils et technologies**

Nous avons choisi d'utiliser:
- Le framework javascript angular pour la réalisation du projet 
- L'api nodejs pour le backend
- visual studio code pour le développement
- Git pour le versionning de l'application 

## **c. Mise en place**

###**1. Création du projet**
- [installation de git](https://git-scm.com/downloads)
- [installation de vscode](https://code.visualstudio.com/download)
- [Installation de nodejs](https://nodejs.org/en/download/) 
- [Installation d'angular en gobal](https://cli.angular.io/) via la commande 
```npm
npm install -g @angular/cli
```
- Création du nouveau projet angular. j'utilise sass au lieu du css
```
ng new devopsfordanick --style=scss
```
- Ouvrir le projet dans vscode 
- Initialisation de git via la commande 
- [Installation de chromeless pour les tests unitaire en ligne de commande](https://www.npmjs.com/package/chromeless) 
```npm
npm i chromeless
```
- [Installation de coverage](https://www.npmjs.com/package/coverage)
```npm
npm i coverage
```
- [Installation de puppeteer](https://www.npmjs.com/package/puppeteer)
```npm
npm i puppeteer
```
- [Installation de karma-junit-reporter](https://www.npmjs.com/package/karma-junit-reporter)
```npm
npm i karma-junit-reporter
```

- Créer le fichier Dockefile pour le client
```docker
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
RUN npm run test --watch=false --codeCoverage=true

# Exécuter les tests end to end
RUN npm run e2e --port 4202

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

#Exécuter la commande npm start pour lancer l'application sur le port 4001
CMD [ "npm" , "start" ]

```

- Créer le fichier Dockefile pour le serveur
```docker
#Installation de nojs
FROM node:latest
#Changer le repertoire racine
WORKDIR /var/api
#Copier le code source vers le repertoire /var/api
COPY . .
#Installer npm 
RUN npm install
#Exposer l'application sur le port 3010
EXPOSE 3010
#Exécuté npm run dev pour demarrer le projet en local
CMD ["npm", "run", "dev"]

```


- Créer le fichier docker-compose.yml
```yaml
version: '3'
services:
  backend:
    restart: always
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3010:3010"
    container_name: stratege/backend-devops:##BUILD##
    volumes:
       - ./api:/var/api
       - /var/api/node_modules
  frontend:
    restart: always
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "4001:4001"
    container_name: stratege/frontend-devops:##BUILD##
    volumes:
       - ./client:/var/client
       - /var/client/node_modules


```

- Créer le fichier .dockerignore
```
node_modules
npm-debug.log
docker-compose*
.dockerignore
.git
.gitignore
README.md
LICENSE
.vscode
```

- Créer une image docker
```npm
docker build --pull --rm -f "Dockerfile" -t stratege/devopsfordanick:1 "."
```
- Exécuter le conteneur docker nouvellement crée
```npm
docker run --rm -d  -p 80:80/tcp stratege/devopsfordanick:1
```

- Tester l'application sur le navigateur 
```bash
http://localhost:80
```


- Se connecter à docker hub pour push l'image
```npm
docker login
```

- Envoyer l'image sur le hub
```npm
docker push stratege/devopsfordanick:1
```

### **2. Livraison du projet sur azure**

- le code est livré en utilisant la commande 
```npm
git push origin danick
```
- Pour démarrer la livraison sur le cloud, le code est mergé sur la branche master via l'onglet Repos/pull request

- Commit
![Screen Shot 2020-07-11 at 19.10.48.png](/.attachments/Screen%20Shot%202020-07-11%20at%2019.10.48-f568e0a3-72e0-43b5-be05-360413af6d91.png)

-  Code source
![Screen Shot 2020-07-11 at 19.10.16.png](/.attachments/Screen%20Shot%202020-07-11%20at%2019.10.16-ff51716c-fce1-42a3-a3ca-017b20185eab.png)



### **3.Livraison du projet sur le cloud et sur le docker hub**
- Fichier de configuration de mise à jour sur le registre et sur le cloud 
```yaml
# Docker
# Build a Docker image 
# https://docs.microsoft.com/azure/devops/pipelines/languages/docker
trigger:
- master

resources:
- repo: self

variables:
  tag: '$(Build.BuildId)'

stages:
  - stage: Build_docker_containers
    jobs:
    - job: Build
      pool:
        vmImage: 'ubuntu-latest'
      continueOnError: true
      steps:
      - task: Docker@2
        inputs:
          containerRegistry: 'devopsdanick'
          repository: 'stratege/devops-frontend'
          command: 'buildAndPush'
          Dockerfile:  '$(Build.SourcesDirectory)/client/Dockerfile'
        displayName: 'Build and publish frontend' 
      - task: Docker@2
        inputs:
          containerRegistry: 'devopsdanick'
          repository: 'stratege/devops-backend'
          command: 'buildAndPush'
          Dockerfile:  '$(Build.SourcesDirectory)/api/Dockerfile' 
        displayName: 'Build and publish backend' 
  - stage: 'Build_Artifact'
    jobs:
      - job: Build
        pool:
          vmImage: 'ubuntu-latest'
        continueOnError: true
        steps:
        - task: NodeTool@0
          inputs:
            versionSpec: '10.16.3'
          displayName: 'Install Node.js'

        - script: |
            npm install -g @angular/cli@10.0.1
          displayName: 'Install angular cli'

        - task: Npm@1
          displayName: 'Install dependancies'
          inputs:
            workingDir: '$(Build.SourcesDirectory)/client'
            command: 'install'
        # - script: |
        #     npm run test --watch=false --codeCoverage=true
        #   displayName: 'Unit test'
        #   workingDirectory: '$(Build.SourcesDirectory)/client'

        - script: |
            npm run lint
          displayName: 'Code Analysis'
          workingDirectory: '$(Build.SourcesDirectory)/client' 
              
        - script: |
            npm run build --prod --output-path=dist
          displayName: 'Build project' 
          workingDirectory: '$(Build.SourcesDirectory)/client'

        - task: PublishCodeCoverageResults@1
          condition: succeededOrFailed()
          inputs:
            pathToSources: '$(Build.SourcesDirectory)/client'
            codeCoverageTool: 'Cobertura'
            summaryFileLocation: '$(Build.SourcesDirectory)/client/coverage/cobertura-coverage.xml'
            reportDirectory: '$(Build.SourcesDirectory)/client/coverage'
          displayName: 'Publish Code Coverage Results' 

        - task: PublishPipelineArtifact@1
          inputs:
            targetPath: '$(Pipeline.Workspace)'
            artifact: 'docker-compose'
            publishLocation: 'pipeline'
          displayName: 'Publish Artifacts' 

  - stage: 'Deploy_to_production'
    jobs:
    - deployment: Production
      pool:
        vmImage: 'ubuntu-latest'
      environment: 'Production'
      strategy:
        runOnce:
          deploy:
            steps:
            - task: ArchiveFiles@2
              inputs:
                rootFolderOrFile: '$(Pipeline.Workspace)/docker-compose/s/api'
                includeRootFolder: true
                archiveType: 'zip'
                archiveFile: '$(Pipeline.Workspace)/docker-compose/s/apizip/api.zip'
                replaceExistingArchive: true
            - task: ArchiveFiles@2
              inputs:
                rootFolderOrFile: '$(Pipeline.Workspace)/docker-compose/s/client/dist'
                includeRootFolder: true
                archiveType: 'zip'
                archiveFile: '$(Pipeline.Workspace)/docker-compose/s/clientzip/client.zip'
                replaceExistingArchive: true
            - task: CopyFilesOverSSH@0
              inputs:
                sshEndpoint: 'devopsssh'
                sourceFolder: '$(Pipeline.Workspace)/docker-compose/s/apizip'
                contents: '**'
                #contents: |
                #  docker-compose.yml
                #  .env
                targetFolder: '/var/www/clients/client0/web37/upload'
                #cleanTargetFolder: true
                readyTimeout: '20000'
                overwrite: true
              displayName: 'Download server on server'

            - task: CopyFilesOverSSH@0
              inputs:
                sshEndpoint: 'devopsssh'
                sourceFolder: '$(Pipeline.Workspace)/docker-compose/s/clientzip'
                contents: '**'
                #contents: |
                #  docker-compose.yaml
                #  .env
                targetFolder: '/var/www/clients/client0/web36/upload'
                cleanTargetFolder: true
                #overwrite: true
                readyTimeout: '20000'
                 
              displayName: 'Download client on server'
            
            - task: SSH@0
              inputs:
                sshEndpoint: 'devopsssh'
                runOptions: 'inline'
                inline: |
                  rm -rf /var/www/clients/client0/web36/web/*
                  unzip /var/www/clients/client0/web36/upload/client.zip -d /var/www/clients/client0/web36/web/
                  mv -f /var/www/clients/client0/web36/web/dist/* /var/www/clients/client0/web36/web/
                  rm -rf /var/www/clients/client0/web36/web/dist/
              displayName: 'Config client'
            
            - task: SSH@0
              inputs:
                sshEndpoint: 'devopsssh'
                runOptions: 'inline'
                inline: |
                  pm2 stop danick-devops
                  rm -rf /var/www/clients/client0/web37/web/config /var/www/clients/client0/web37/web/app
                  unzip /var/www/clients/client0/web37/upload/api.zip -d /var/www/clients/client0/web37/web/
                  mv -u /var/www/clients/client0/web37/web/api/* /var/www/clients/client0/web37/web/
                  rm -rf /var/www/clients/client0/web37/web/api/
                  pm2 restart danick-devops
        
```

Fonctionnement:
- [x] La première étape consiste à build et déployer l'image sur docker hub ou  docker register
- [x] Le deuxième étape consiste à déployer angular et créer un artifact ou un livrable pour le déployement
- [x] La troisième étape consiste à charger les fichiers de l'artifact ensuite ensuite zipper l'api et le client
- [x] La quatrième étape consiste à copier les fichiers api.zip et client.zip sur le serveur de production lws en utilisant ssh
- [x] La cinquième étape consiste à dézipper les fichiers et déplacer dans les repertoires de déployements respectives frontend et backend 
- [x] La sixième étape consiste à redéployer le serveur ou le backend en utilisant pm2
- [x] Le serveur apache est ensuite configuré en temps que serveur proxy pour le serveur et le client 

> Docker register
>> ![Screen Shot 2020-07-12 at 09.25.23.png](/.attachments/Screen%20Shot%202020-07-12%20at%2009.25.23-3a366cbf-eef1-478f-85ab-546b2cca9571.png)

>> ![Screen Shot 2020-07-12 at 09.34.26.png](/.attachments/Screen%20Shot%202020-07-12%20at%2009.34.26-632c0c69-d257-4709-b08a-5d6d33fcd723.png)

>> ![Screen Shot 2020-07-12 at 09.25.23.png](/.attachments/Screen%20Shot%202020-07-12%20at%2009.25.23-873676f5-fdb2-4bb6-877a-414a1a0d7ca2.png)

> Artifact
>> ![Screen Shot 2020-07-12 at 01.10.21.png](/.attachments/Screen%20Shot%202020-07-12%20at%2001.10.21-136d3064-2772-4c02-8de4-9f120a767518.png)

> bilan du déployement 
>> ![Screen Shot 2020-07-12 at 02.07.42.png](/.attachments/Screen%20Shot%202020-07-12%20at%2002.07.42-bed8e4b3-a104-49a4-8391-0579bdfa712c.png)

>>![Screen Shot 2020-07-12 at 08.41.18.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.41.18-e8b1ac80-27fd-4dda-9a24-14d9de733741.png)

> Résultat du déployement
>> ![Screen Shot 2020-07-12 at 08.53.40.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.53.40-2bc768d8-bfb0-477e-b2aa-fbd4e4d432f0.png)

>> ![Screen Shot 2020-07-12 at 08.52.17.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.52.17-4f5a7fd0-b035-4fd1-8e59-392bef273116.png)

>> ![Screen Shot 2020-07-12 at 08.50.44.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.50.44-93a4800c-7e02-4532-9529-5ad4bdcf21aa.png)

> Tâches éffectuées (Agile)
>> ![Screen Shot 2020-07-12 at 08.55.06.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.55.06-537b08aa-96c4-4762-9947-20c786a3927e.png)

> Les branches
>> ![Screen Shot 2020-07-12 at 08.56.39.png](/.attachments/Screen%20Shot%202020-07-12%20at%2008.56.39-eb0717f3-3424-4c52-8587-870c751a126f.png)

### **4. Resultat local et sur le serveur de production**

> Client
>> ![Screen Shot 2020-07-12 at 09.19.35.png](/.attachments/Screen%20Shot%202020-07-12%20at%2009.19.35-5216f128-cfb0-452b-adfc-d4d28c80225a.png)

> Serveur
>> ![Screen Shot 2020-07-12 at 09.12.38.png](/.attachments/Screen%20Shot%202020-07-12%20at%2009.12.38-23eb47b5-64fa-4c08-908f-f7e3415553c5.png)


> Code serveur 
>> ![Screen Shot 2020-07-12 at 11.42.25.png](/.attachments/Screen%20Shot%202020-07-12%20at%2011.42.25-33e5909c-45a5-460a-8f44-a39beddc8d2c.png)

> Code client 
>> ![Screen Shot 2020-07-12 at 11.48.02.png](/.attachments/Screen%20Shot%202020-07-12%20at%2011.48.02-4ce07f4f-b982-4367-adc7-415d79187c5f.png)

> Docker up
>> ![Screen Shot 2020-07-12 at 12.32.05.png](/.attachments/Screen%20Shot%202020-07-12%20at%2012.32.05-f3b82d86-4c93-478e-ba83-d2f8718309d0.png)

> Base de données
>> ![Screen Shot 2020-07-12 at 19.04.54.png](/.attachments/Screen%20Shot%202020-07-12%20at%2019.04.54-150bfabd-01d1-4563-9adf-cb7ebd06c90f.png)

> Artifact
>> ![Screen Shot 2020-07-12 at 19.23.08.png](/.attachments/Screen%20Shot%202020-07-12%20at%2019.23.08-9bb8e5ae-6828-4798-b691-822aa2b881d2.png)

### **5. Test unitaires **

> Serveur
>> ![Screen Shot 2020-07-12 at 18.52.13.png](/.attachments/Screen%20Shot%202020-07-12%20at%2018.52.13-6fc2e405-0586-44f7-a77f-cd4c6cf10eb3.png)

> Client (e2e)
>> ![Screen Shot 2020-07-12 at 19.41.04.png](/.attachments/Screen%20Shot%202020-07-12%20at%2019.41.04-856a0f5b-c46a-499c-94ad-108ade48c82a.png)

>>![Screen Shot 2020-07-12 at 19.48.43.png](/.attachments/Screen%20Shot%202020-07-12%20at%2019.48.43-befdcd93-9423-4c15-97e8-b642fa7d4f33.png)

### **6. Vidéo de présentation du CI/CD**
Cette vidéo sera visible sur teams
- vidéo explication du code et publication des modifications sur le registre docker et sur le serveur de déployement lws
- Vidéo démo et visualisation des résultats

