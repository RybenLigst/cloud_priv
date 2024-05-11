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

        stage('Docker image build') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t flappimen/proj:version${BUILD_NUMBER} .'
                }
            }
        }

          stage('Docker image tagging') {
            steps {
                script {
                    // Add the 'latest' tag to the built image
                    sh 'docker tag flappimen/proj:version${BUILD_NUMBER} flappimen/proj:latest'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Push the image to Docker Hub
                    sh 'docker push flappimen/proj:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/proj:latest'
                }
            }
        }

        stage('Stopping and deleting the old container') {
            steps {
                script {
                    // Attempt to stop and delete the old container if it exists
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME}\$) ]; then
                        docker stop ${CONTAINER_NAME}
                        docker rm ${CONTAINER_NAME}
                    else
                        echo "Container ${CONTAINER_NAME} not found. We continue..."
                    fi
                    """
                }
            }
        }

             stage('Cleaning old images') {
            steps {
                script {
                    // Push the image to Docker Hub
                    sh 'docker image prune -a --filter "until=24h" --force'

                }
            }
        }
        
        
        stage('Launching a Docker container') {
            steps {
                script {
                    // Start the Docker container with the new image
                    sh 'docker run -d -p 8081:80 --name ${CONTAINER_NAME} --health-cmd="curl --fail http://localhost:80 || exit 1" flappimen/proj:version${BUILD_NUMBER}'

                }
            }
        }
    }
}
