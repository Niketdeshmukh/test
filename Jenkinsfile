pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Generate Reports') {
            steps {
                sh 'node pdfgenerator.js'
                sh 'npm run generate-report'
            }
        }
    }
}
