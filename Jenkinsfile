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
                script {
                    // Use credentials from Jenkins to log in to Docker
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }

        stage('Build SQL Server container') {
            steps {
                script {
                    sh 'docker run -d -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Qwerty-1" -p 1433:1433 --name sql111 --hostname sql mcr.microsoft.com/mssql/server:2022-latest'
                }
            }
        }

        stage('Build FrontEnd image') {
            steps {
                script {
                    sh 'cd FrontEnd/my-app && docker build -t flappimen/front:version${BUILD_NUMBER} .'
                }
            }
        }

        stage('Tag docker image (Front)') {
            steps {
                script {
                    sh 'docker tag flappimen/front:version${BUILD_NUMBER} flappimen/front:latest'
                }
            }
        }

        stage('Push in Docker Hub (Front)') {
            steps {
                script {
                    sh 'docker push flappimen/front:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/front:latest'
                }
            }
        }

        stage('Stop and delete old container (Front)') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=${CONTAINER_NAME1}) ]; then
                        docker stop ${CONTAINER_NAME1}
                        docker rm ${CONTAINER_NAME1}
                    else
                        echo "Container ${CONTAINER_NAME1} not found. Continue..."
                    fi
                    """
                }
            }
        }

        stage('Delete old images (Front)') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }

        stage('Start docker container (Front)') {
            steps {
                script {
                    sh 'docker run -d -p 81:80 --name ${CONTAINER_NAME1} --health-cmd="curl --fail http://localhost:80 || exit 1" flappimen/front:version${BUILD_NUMBER}'
                }
            }
        }

        stage('Build BackEnd image') {
            steps {
                script {
                    sh 'cd BackEnd/Amazon-clone && docker build -t flappimen/back:version${BUILD_NUMBER} .'
                }
            }
        }

        stage('Tag docker image (Back)') {
            steps {
                script {
                    sh 'docker tag flappimen/back:version${BUILD_NUMBER} flappimen/back:latest'
                }
            }
        }

        stage('Push in Docker Hub (Back)') {
            steps {
                script {
                    sh 'docker push flappimen/back:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/back:latest'
                }
            }
        }

        stage('Stop and delete old container (Back)') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=${CONTAINER_NAME2}) ]; then
                        docker stop ${CONTAINER_NAME2}
                        docker rm ${CONTAINER_NAME2}
                    else
                        echo "Container ${CONTAINER_NAME2} not found. Continue..."
                    fi
                    """
                }
            }
        }

        stage('Delete old images (Back)') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }

        stage('Start docker container (Back)') {
            steps {
                script {
                    sh 'docker run -d -p 5034:5034 --name ${CONTAINER_NAME2} flappimen/back:version${BUILD_NUMBER}'
                }
            }
        }
    }
}
