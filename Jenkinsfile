def updateGitHubStatus(String state, String description) {
    withCredentials([usernamePassword(credentialsId: 'github_credentials', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
        sh """
            curl -sS -X POST \
            -u "$GITHUB_USER:$GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/augnormsdevs/Frontend/statuses/${env.GIT_COMMIT}" \
            -d '{
                "state": "${state}",
                "target_url": "${env.BUILD_URL}",
                "description": "${description}",
                "context": "${env.STATUS_CONTEXT}"
            }'
        """
    }
}


pipeline {
    agent any

    stages {
        stage('Checkout') {
            // This stage checks out the code from the repository.
            steps {
                checkout scm
            }
        }
        stage('Validate package.json') {
            // This stage validates the package.json file against a reference version stored in a GitHub repository.
            // It checks out the reference package.json and compares it with the current one.
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
                            echo "Comparing packages..."
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
            
            // Post actions to update GitHub status based on the result of the validation
            // This will run after the stage completes, regardless of success or failure
            post {
                success {
                    script {
                        updateGitHubStatus('success', 'Package validation passed')
                    }
                }
                unstable {
                    script {
                        updateGitHubStatus('failure', 'Package validation differs')
                    }
                }
                failure {
                    script {
                        updateGitHubStatus('error', 'Package validation failed')
                    }
                }
            }
        }

    }
}

