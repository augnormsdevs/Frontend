


def updateGitHubStatus(String state, String description) {
    // Validate and normalize state
    def validState = ['success', 'failure', 'pending', 'error'].contains(state.toLowerCase()) ? 
        state.toLowerCase() : 'error'
    
    withCredentials([string(credentialsId: 'github_token', variable: 'GITHUB_TOKEN')]) {
        sh """
            curl -sS -X POST \
            -H "Authorization: token \$GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/augnormsdevs/Frontend/statuses/${env.GIT_COMMIT}" \
            -d '{
                "state": "${validState}",
                "target_url": "${env.BUILD_URL}",
                "description": "${description.take(140)}",
                "context": "${env.STATUS_CONTEXT}"
            }'
        """
    }
}

pipeline {
    agent any

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
    }
}
