pipeline {
    agent any

    environment {
        // Add credentials for Docker
        DOCKER_CREDENTIALS_ID = 'docker'
        CONTAINER_NAME = 'flappimen/proj'
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

             //1. Build SQL Server container (requires login
        stage('Build SQL Server container') {
        steps {
            script {
            withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                sh '''
                echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin
                docker run -d -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Qwerty-1" -p 1433:1433 --name sql111 --hostname sql mcr.microsoft.com/mssql/server:2022-latest
                '''
            }
            }
        }
        }

        stage('Tag docker image') {
            steps {
                script {
                    sh 'docker tag flappimen/proj:version${BUILD_NUMBER} flappimen/proj:latest'
                }
            }
        }

        stage('Push in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/proj:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/proj:latest'
                }
            }
        }

        stage('Stop and delete old container') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME}\$) ]; then
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    else
                        echo "Container ${CONTAINER_NAME} not found. Couninue..."
                    fi
                    """
                }
            }
        }

        stage('Delete old images') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }


        // 2. Build FrontEnd image
        stage('Build FrontEnd image') {
            steps {
                script {
                    sh 'cd FrontEnd/my-app && docker build -t flappimen/proj:version${BUILD_NUMBER} .'
                }
            }
        }

        stage('Tag docker image') {
            steps {
                script {
                    sh 'docker tag flappimen/proj:version${BUILD_NUMBER} flappimen/proj:latest'
                }
            }
        }

        stage('Push in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/proj:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/proj:latest'
                }
            }
        }

        stage('Stop and delete old container') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME}\$) ]; then
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    else
                        echo "Container ${CONTAINER_NAME} not found. Couninue..."
                    fi
                    """
                }
            }
        }

        stage('Delete old images') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }

        stage('Start docker container') {
            steps {
                script {
                    sh 'docker run -d -p 81:80 --name ${CONTAINER_NAME} --health-cmd="curl --fail http://localhost:80 || exit 1" flappimen/proj:version${BUILD_NUMBER}'
                }
            }
        }

        // 3. Build BackEnd image
        stage('Build BackEnd image') {
        steps {
            script {
            sh 'cd BackEnd/Amazon-clone && docker build -t flappimen/proj:backend .'
            }
        }
        }

        stage('Tag docker image') {
            steps {
                script {
                    sh 'docker tag flappimen/proj:version${BUILD_NUMBER} flappimen/proj:latest'
                }
            }
        }

        stage('Push in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/proj:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/proj:latest'
                }
            }
        }

        stage('Stop and delete old container') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME}\$) ]; then
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    else
                        echo "Container ${CONTAINER_NAME} not found. Couninue..."
                    fi
                    """
                }
            }
        }

        stage('Delete old images') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }

        stage('Start docker container') {
            steps {
                script {
                    sh 'cd BackEnd/Amazon-clone && docker run -d -p 5034:5034 flappimen/proj:version${BUILD_NUMBER}'
                }
            }
        }



    }
}
