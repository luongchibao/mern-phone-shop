pipeline {
    agent any

    environment {
        DOCKER_USER = 'chibao105497'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/luongchibao/mern-phone-shop.git'
            }
        }

        stage('Build API Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/phone-shop-api:latest ./server
                '''
            }
        }

        stage('Build Web Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/phone-shop-web:latest ./client
                '''
            }
        }

        stage('Push Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {

                    sh '''
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

                    docker push $DOCKER_USER/phone-shop-api:latest
                    docker push $DOCKER_USER/phone-shop-web:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker compose down || true
                docker compose up -d
                '''
            }
        }
    }
}