pipeline {
    agent any
    stages {
        stage('Verify Environment') {
            steps {
                sh '''
                echo "ANDROID_HOME=$ANDROID_HOME"
                echo "PATH=$PATH"
                '''
            }
        }
    }

    stages {
        stage('Verify Node Version') {
    steps {
        sh 'node -v'
        sh 'npm -v'
    }
}

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
