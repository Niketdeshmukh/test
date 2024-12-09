pipeline {
    agent any
    // tools {
        // nodejs 'NodeJS' // Ensure you have configured NodeJS in Jenkins
    // }
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'node test.js'
            }
        }
    }
}
