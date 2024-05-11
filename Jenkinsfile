pipeline {
  agent any

  environment {
    // Add credentials for Docker (if needed)
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

    // 
