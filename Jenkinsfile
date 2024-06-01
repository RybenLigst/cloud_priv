pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS_ID = 'docker'
        CONTAINER_NAME_0 = 'flappimen/sql'
        CONTAINER_NAME_1 = 'flappimen/front'
        CONTAINER_NAME_2 = 'flappimen/back'
    }
// = = = = D O C K E R L O G I N = = = =
    stages {
        stage('Login to Docker') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin'
                    }
                }
            }
        }
// = = = = D E L E T E     O L D = = = =
        stage('Delete old images') {
            steps {
                script {
                    sh 'docker image prune -a --filter "until=24h" --force'
                }
            }
        }
// = = = = S      Q      L = = = =
        stage('Build _SQL_') {
            steps {
                script {
                    sh 'cd sql/ && docker build -t flappimen/sql:version${BUILD_NUMBER} .'
                }
            }
        }
        stage('Tag image _SQL_') {
            steps {
                script {
                    sh 'docker tag flappimen/sql:version${BUILD_NUMBER} flappimen/sql:latest'
                }
            }
        }
        stage('Push _SQL_ in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/sql:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/sql:latest'
                }
            }
        }
        stage('Stop AND delete _SQL_') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME_0}\$) ]; then
                        docker stop ${CONTAINER_NAME_0}
                        docker rm ${CONTAINER_NAME_0}
                    else
                        echo "Container ${CONTAINER_NAME_0} not found. Couninue..."
                    fi
                    """
                }
            }
        } 
        stage('Start _SQL_ docker container') {
            steps {
                script {
                    sh 'cd sql/ && docker run -d -p 1433:1433 flappimen/sql:version${BUILD_NUMBER}'
                }
            }
        }
// = = = = F R O N T E N D = = = =
        stage('Build image _FrontEnd_') {
            steps {
                script {
                    sh 'cd FrontEnd/my-app/ && docker build -t flappimen/front:version${BUILD_NUMBER} .'
                }
            }
        }
        stage('Tag image _FrontEnd_') {
            steps {
                script {
                    sh 'docker tag flappimen/front:version${BUILD_NUMBER} flappimen/front:latest'
                }
            }
        }
        stage('Push _FrontEnd_ in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/front:version${BUILD_NUMBER}'
                    sh 'docker push flappimen/front:latest'
                }
            }
        }
        stage('Stop AND delete _FrontEnd_') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME_1}\$) ]; then
                        docker stop ${CONTAINER_NAME_1}
                        docker rm ${CONTAINER_NAME_1}
                    else
                        echo "Container ${CONTAINER_NAME_1} not found. Couninue..."
                    fi
                    """
                }
            }
        }
        stage('Start _FrontEnd_ docker container') {
            steps {
                script {
                    sh 'cd FrontEnd/my-app/ && docker run -d -p 81:80 flappimen/front:version${BUILD_NUMBER}'
                }
            }
        }
// = = = = B A C K E N D = = = =
        stage('Build image _BackEnd_') {
            steps {
                script {
                    sh 'cd BackEnd/Amazon-clone/ && docker build -t flappimen/back
        :version${BUILD_NUMBER} .'
                }
            }
        }
        stage('Tag image _BackEnd_') {
            steps {
                script {
                    sh 'docker tag flappimen/back
        :version${BUILD_NUMBER} flappimen/back
        :latest'
                }
            }
        }
        stage('Push _BackEnd_ in Docker Hub') {
            steps {
                script {
                    sh 'docker push flappimen/back
        :version${BUILD_NUMBER}'
                    sh 'docker push flappimen/back
        :latest'
                }
            }
        }
        stage('Stop AND delete _BackEnd_') {
            steps {
                script {
                    sh """
                    if [ \$(docker ps -aq -f name=^${CONTAINER_NAME_2}\$) ]; then
                        docker stop ${CONTAINER_NAME_2}
                        docker rm ${CONTAINER_NAME_2}
                    else
                        echo "Container ${CONTAINER_NAME_2} not found. Couninue..."
                    fi
                    """
                }
            }
        }
        stage('Start _BackEnd_ docker container') {
            steps {
                script {
                    sh 'cd BackEnd/Amazon-clone/ && docker run -d -p 5034:5034 flappimen/back
        :version${BUILD_NUMBER}'
                }
            }
        }
    }
}
