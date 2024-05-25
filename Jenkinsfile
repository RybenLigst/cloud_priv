pipeline {
    agent any

    environment {
        // Add credentials for Docker
        DOCKER_CREDENTIALS_ID = 'docker'
        CONTAINER_NAME0 = 'flappimen/sql'
        CONTAINER_NAME1 = 'flappimen/front'
        CONTAINER_NAME2 = 'flappimen/back'
    }

    stages {

        stage('Login to Docker') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login --username flappimen --password-stdin'
                }
            }
        }

        stage('Build SQL Server container') {
            steps {
                script {
                    sh '''
                    docker run -d -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=Qwerty-1 -p 1433:1433 --name sql111 --hostname sql mcr.microsoft.com/mssql/server:2022-latest
                    '''
                }
            }
        }

        stage('Build FrontEnd image') {
            steps {
                script {
                    sh '''
                    cd FrontEnd/my-app
                    docker build -t flappimen/front:version44 .
                    '''
                }
            }
        }

        stage('Tag docker image (Front)') {
            steps {
                script {
                    sh '''
                    docker tag flappimen/front:version44 flappimen/front:latest
                    '''
                }
            }
        }

        stage('Push in Docker Hub (Front)') {
            steps {
                script {
                    sh '''
                    docker push flappimen/front:version44
                    docker push flappimen/front:latest
                    '''
                }
            }
        }

        stage('Stop and delete old container (Front)') {
            steps {
                script {
                    sh '''
                    CONTAINER_ID=$(docker ps -aq -f name=flappimen_front)
                    if [ -n "$CONTAINER_ID" ]; then
                        docker stop $CONTAINER_ID
                        docker rm $CONTAINER_ID
                    else
                        echo "Container flappimen_front not found. Continue..."
                    fi
                    '''
                }
            }
        }

        stage('Delete old images (Front)') {
            steps {
                script {
                    sh '''
                    docker image prune -a --filter until=24h --force
                    '''
                }
            }
        }

        stage('Start docker container (Front)') {
            steps {
                script {
                    sh '''
                    docker run -d -p 81:80 --name flappimen_front --health-cmd="curl --fail http://localhost:80 || exit 1" flappimen/front:version44
                    '''
                }
            }
        }

        stage('Build BackEnd image') {
            steps {
                script {
                    sh '''
                    # Your backend build steps here
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
