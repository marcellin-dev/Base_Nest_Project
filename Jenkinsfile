pipeline {
  agent any
  stages {
    stage('Git checkout') {
      steps {
        git(url: 'https://github.com/marcellin-dev/SSWAP.BACK.git', branch: 'main', credentialsId: 'global-github-credential')
      }
    }


    stage('Create env file') {
      steps {
        sh 'touch .env;'
      }
    }

     stage('Add env variables') {
      steps {
        withCredentials(bindings: [file(credentialsId: 'sswap_back_env', variable: 'FILE')]) {
          sh 'cp $FILE .env'
          sh 'cat .env'
        }
      }
    }

     stage('Build app') {
      parallel {
        stage('Build app') {
          steps {
            sh 'docker build -t marcellindev/sswap-back .'
            sh 'ls -la'
          }
        }

        stage('Log into Dockerhub') {
          steps {
            withCredentials(bindings: [usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
              sh 'docker login -u $DOCKER_USER -p $DOCKER_PASSWORD'
            }

          }
        }

      }
    }

    stage('Deploy App') {
      steps {
        sh 'docker push marcellindev/sswap-back:latest'
      }
    }

    stage('Start Apps') {
      steps {
        withCredentials(bindings: [file(credentialsId: 'sswap_back_env', variable: 'FILE')]) {
          sh 'cp $FILE .env'
          sh 'cat .env'
          sh 'ls -la'
          sh 'docker rm --force --volumes sswap-back-app'
          sh '''docker compose up --wait'''
        }
      }
    }

  }

  post {
    success {
        echo 'Déploiement de blood-group réussi !'
    }
    failure {
        echo 'Échec du déploiement de blood-group.'}
        }
}