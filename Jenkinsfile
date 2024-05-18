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

            // 1. Build SQL Server container (requires login
        //stage('Build SQL Server container') {
        //steps {
            //script {
            //withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                //sh '''
                //echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin
                //docker run -d -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Qwerty-1" -p 1433:1433 --name sql111 --hostname sql mcr.microsoft.com/mssql/server:2022-latest
                //'''
            //}
            //}
        //}
        //}


        // 2. Build FrontEnd image
        stage('Build FrontEnd image') {
          steps {
            script {
               sh 'docker build -t flappimen/proj:frontend FrontEnd/my-app/Dockerfile .' // file path (mb issue)
            }
          }
        }

        // 3. Build BackEnd image
        stage('Build BackEnd image') {
        steps {
            script {
            sh 'docker build -t flappimen/proj:backend /var/lib/jenkins/workspace/proj/BackEnd/Amazon-clone/Dockerfile' // Adjusted path based on your output
            }
        }
        }

            // 5. (Optional) Push images to Docker Hub
       //stage('Push images to Docker Hub (if needed)') {
       //   when {
       //     expression { return sh script: 'docker images flappimen/proj:version${BUILD_NUMBER} | grep -q .', returnType: 'boolean' } // Check if image exists locally
       //   }
       //   steps {
       //     script {
       //       sh 'docker push flappimen/proj:frontend'
       //       sh 'docker push flappimen/proj:backend'
       //       sh 'docker push flappimen/proj:version${BUILD_NUMBER}' // Push tagged image (optional)
       //     }
       //   }
       // }
    }
}
