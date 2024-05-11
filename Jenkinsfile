pipeline {
  agent any

  environment {
    // Add credentials for Docker
    DOCKER_CREDENTIALS_ID = 'docker'
  }

  stages {
    // 1. Build SQL Server container
    stage('Build SQL Server container') {
      steps {
        script {
          sh 'docker run -d -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Qwerty-1" -p 1433:1433 --name sql111 --hostname sql1 mcr.microsoft.com/mssql/server:2022-latest'
        }
      }
    }

    // 2. Build FrontEnd image
    stage('Build FrontEnd image') {
      steps {
        script {
          sh 'docker build -t flappimen/proj:frontend ./.github/workflows/FrontEnd/my-app/Dockerfile'  // Adjust path if necessary
        }
      }
    }

    // 3. Build BackEnd image
    stage('Build BackEnd image') {
      steps {
        script {
          sh 'docker build -t flappimen/proj:backend ./.github/workflows/BackEnd/Amazon-clone/Dockerfile'  // Adjust path if necessary
        }
      }
    }

    // 4. (Optional) Login to Docker Hub (if pushing images)
    stage('Login to Docker Hub (if needed)') {
      when {
        expression { return sh script: 'docker images flappimen/proj:version${BUILD_NUMBER} | grep -q .', returnType: 'boolean' }  // Check if image exists locally
      }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
            sh 'echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin'
          }
        }
      }
    }

    // 5. (Optional) Push images to Docker Hub
    stage('Push images to Docker Hub (if needed)') {
      when {
        expression { return sh script: 'docker images flappimen/proj:version${BUILD_NUMBER} | grep -q .', returnType: 'boolean' }  // Check if image exists locally
      }
      steps {
        script {
          sh 'docker push flappimen/proj:frontend'
          sh 'docker push flappimen/proj:backend'
          sh 'docker push flappimen/proj:version${BUILD_NUMBER}'  // Push tagged image (optional)
        }
      }
    }
  }

  // Post-build actions (can be added as additional stages)
  // ...
}
