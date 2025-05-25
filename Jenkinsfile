pipeline {
    agent any
    stages {
        stage('Validate package.json') {
            steps {
                script {
                    // 1. Clone the reference packages repo
                    dir('packages_validate') {
                        git(
                            url: 'https://github.com/augnormsdevs/packages_validate.git',
                            credentialsId: 'github_credentials',
                            branch: 'main'
                        )
                    }

                    // 2. Validate project's package.json against reference
                    def result = sh(
                        script: '''
                            echo "Comparing with reference packages..."
                            ls -la packages_validate/  # Debug: List reference files
                            if [ ! -f packages_validate/package.json ]; then
                                echo "❌ Reference package.json missing!"
                                exit 1
                            fi
                            
                            # Basic diff check (adjust as needed)
                            diff -u packages_validate/package.json package.json || true
                        ''',
                        returnStatus: true
                    )

                    // 3. Conditionally fail
                    if (result != 0) {
                        unstable("Package.json differs from reference")
                    }
                }
            }
        }
    }
    post {
        always {
            // Modern way to report status to GitHub
            withCredentials([string(credentialsId: 'github_credentials', variable: 'GITHUB_TOKEN')]) {
                sh """
                    curl -X POST \
                    -H "Authorization: token \$GITHUB_TOKEN" \
                    -H "Accept: application/vnd.github.v3+json" \
                    https://api.github.com/repos/augnormsdevs/Frontend/statuses/${env.GIT_COMMIT} \
                    -d '{
                        "state": "${currentBuild.currentResult == 'SUCCESS' ? 'success' : 'failure'}",
                        "target_url": "${env.BUILD_URL}",
                        "description": "Package validation ${currentBuild.currentResult}",
                        "context": "jenkins/package-validation"
                    }'
                """
            }
        }
    }
}