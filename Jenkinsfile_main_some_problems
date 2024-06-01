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

        stage('Delete old images (SQL)') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }

             //1. Build SQL Server container (requires login
        stage('Build sql') {
            steps {
                script {
                    sh 'cd sql && docker build -t flappimen/sql:version${BUILD_NUMBER} .'
                }
            }
        }

        stage('Tag docker image (SQL)') {
            steps {
                script {
                    sh 'docker tag flappimen/sql:version${BUILD_NUMBER} flappimen/sql:latest'
                }
            }
        }

        stage('Push in Docker Hub (SQL)') {
            steps {
                script {
                    sh 'docker push flappimen/sql:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/sql:latest'
                }
            }
        }

        stage('Stop and delete old container (SQL)') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME0}\$) ]; then
                        docker stop ${CONTAINER_NAME0}
                        docker rm ${CONTAINER_NAME0}
                    else
                        echo "Container ${CONTAINER_NAME0} not found. Couninue..."
                    fi
                    """
                }
            }
        }

        stage('Start docker container (SQL)') {
            steps {
                script {
                    sh 'cd sql/ && docker run -d -p 1433:1433 --name ${CONTAINER_NAME0} flappimen/sql:version${BUILD_NUMBER}'
                }
            }
        }

        // 2. Build FrontEnd image
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
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME1}\$) ]; then
                        docker stop ${CONTAINER_NAME1}
                        docker rm ${CONTAINER_NAME1}
                    else
                        echo "Container ${CONTAINER_NAME1} not found. Couninue..."
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
                    sh 'cd BackEnd/Amazon-clone && docker run -d -p 81:80 --name ${CONTAINER_NAME1} --health-cmd="curl --fail http://localhost:80 || exit 1" flappimen/front:version${BUILD_NUMBER}'
                }
            }
        }

        // 3. Build BackEnd image
        stage('Build BackEnd image (back)') {
        steps {
            script {
            sh 'cd BackEnd/Amazon-clone && docker build -t flappimen/back:backend .'
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
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME2}\$) ]; then
                        docker stop ${CONTAINER_NAME2}
                        docker rm ${CONTAINER_NAME2}
                    else
                        echo "Container ${CONTAINER_NAME2} not found. Couninue..."
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
                    sh 'cd BackEnd/Amazon-clone && docker run -d -p 5034:5034 --name ${CONTAINER_NAME1} flappimen/back:version${BUILD_NUMBER}'
                }
            }
        }



    }
}
