
def updateGitHubStatus(String state, String description) {
  // Validate and normalize state
 def validState = ['success', 'failure', 'pending', 'error'].contains(state.toLowerCase()) ? 
        state.toLowerCase() : 'error'  

  withCredentials([usernamePassword(credentialsId: 'cec555a4-7bcd-48e3-b491-3cdcff3d3ff1', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
    withEnv(["TOKEN=$GITHUB_TOKEN", "USER=$GITHUB_USER"]) {
      sh """#!/bin/bash
        curl -sS -X POST \\
            -u "$USER:$TOKEN" \\
            -H "Accept: application/vnd.github.v3+json" \\
            "https://api.github.com/repos/augnormsdevs/Frontend/statuses/${GIT_COMMIT}" \\
            -d '{
            "state": "${validState}",
            "target_url": "${BUILD_URL}",
            "description": "${description}",
            "context": "${STATUS_CONTEXT}"
            }'
        """
    }
  }
}

pipeline {
    agent any

    environment{
        VITE_CLOUDINARY_URL = credentials("VITE_CLOUDINARY_URL")
        VITE_ENDPOINT = credentials("VITE_ENDPOINT")
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Validate package.json') {
            environment {
                STATUS_CONTEXT = 'jenkins/package-validation'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Package validation in progress')
                    
                    dir('packages_validate') {
                        git(
                            url: 'https://github.com/augnormsdevs/packages_validate.git',
                            credentialsId: 'github_credentials',
                            branch: 'main'
                        )
                    }

                    def result = sh(
                        script: '''
                            [ ! -f packages_validate/package.json ] && exit 1
                            diff -u packages_validate/package.json package.json || true
                        ''',
                        returnStatus: true
                    )

                    if (result != 0) {
                        unstable("package.json differs from the reference")
                    }
                }
            }
            post {
                success { updateGitHubStatus('success', 'Validation passed') }
                unstable { updateGitHubStatus('failure', 'Validation differences found') }
                failure { updateGitHubStatus('error', 'Validation failed') }
            }
        }

        stage('Install Dependencies') {
            environment {
               STATUS_CONTEXT = 'jenkins/install-dependencies'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Installing dependencies')
                    sh 'npm install'
                }
            }
            post {
                success { updateGitHubStatus('success', 'Dependencies installed') }
                failure { updateGitHubStatus('error', 'Installation failed') }
            }
        }

        stage('Run Linting') {
            environment {
                STATUS_CONTEXT = 'jenkins/linting'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Linting in progress')
                    def lintResult = sh(script: 'npm run lint', returnStatus: true)
                    if (lintResult != 0) {
                        unstable("Linting issues found")
                    }
                }
            }
            post {
                success { updateGitHubStatus('success', 'Linting passed') }
                unstable { updateGitHubStatus('failure', 'Linting issues found') }
                failure { updateGitHubStatus('error', 'Linting failed') }
            }
        }

        stage('Prepare .env file') {
            steps {
                configFileProvider([configFile(fileId: '46c39496-c1b0-4b03-b2c5-2d2ec620fff0', variable: 'MY_CONFIG')]) {
                    sh 'cat $MY_CONFIG > .env'
                }
            }
        }

       stage('Run Build') {
            environment {
                STATUS_CONTEXT = 'jenkins/build'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Build in progress')
                    sh 'npm run build' 
                }
            }
            post {
                success { updateGitHubStatus('success', 'Build completed') }
                failure { updateGitHubStatus('error', 'Build failed') }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Push to Docker Hub (simulating ECR)') {
            environment {
                STATUS_CONTEXT = 'jenkins/docker-push'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Pushing Docker image to Docker Hub')

                    // Use your Docker Hub credential ID here
                   withCredentials([usernamePassword(credentialsId: 'dbfbbbf6-22d0-496b-a2ec-b943f6669e23', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker build -t augustine963/ekissi_frontend:latest .
                        docker push augustine963/ekissi_frontend:latest
                        '''
                   }

                }
            }
            post {
                success { updateGitHubStatus('success', 'Docker image pushed successfully') }
                failure { updateGitHubStatus('error', 'Docker image push failed') }
            }
        }
        
        stage('Prepare Deploy Script') {
            steps {
                writeFile file: 'deploy.sh', text: '''
                    #!/bin/bash
                    echo "🔄 Pulling latest image..."
                    docker pull augustine963/ekissi_frontend:latest

                    echo "🛑 Stopping existing container if running..."
                    docker stop ekissi_frontend || true
                    docker rm ekissi_frontend || true

                    echo "🚀 Starting new container..."
                    
                    docker run -d --name ekissi_frontend \
                    --network ekissi_network \
                    -e VITE_CLOUDINARY_URL="$VITE_CLOUDINARY_URL" \
                    -e VITE_ENDPOINT="$VITE_ENDPOINT" \
                    -p 8081:80 \
                    augustine963/ekissi_frontend:latest

                    echo "✅ Deployment complete. App should be running on http://localhost:8081"
                '''
                sh 'chmod +x deploy.sh'
            }
        }
 
        stage('Deploy simulated to ECR') {
            environment {
                STATUS_CONTEXT = 'jenkins/deploy'
            }
            steps {
                script {
                    updateGitHubStatus('pending', 'Deploying application')
                    sh './deploy.sh'
                }
            }
            post {
                success { 
                    updateGitHubStatus('success', 'Deployment completed Access at:http://localhost:8081') 
                }
                failure { 
                    updateGitHubStatus('error', 'Deployment failed') 
                }
            }
        }
    }
}


