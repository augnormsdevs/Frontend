pipeline {
    agent any
    stages {
        stage('Validate package.json') {
            steps {
                script {
                    dir('packages_validate') {
                        git(
                            url: 'https://github.com/augnormsdevs/packages_validate.git',
                            credentialsId: 'github_token', // Updated credential ID
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
                        unstable("Package.json differs from reference")
                    }
                }
            }
        }
    }
    post {
        always {
            withCredentials([string(credentialsId: 'github_token', variable: 'GITHUB_TOKEN')]) {
                sh """
                    curl -sS -X POST \
                    -H "Authorization: token \$GITHUB_TOKEN" \
                    -H "Accept: application/vnd.github.v3+json" \
                    "https://api.github.com/repos/augnormsdevs/Frontend/statuses/${env.GIT_COMMIT}" \
                    -d '{
                        "state": "${currentBuild.currentResult == 'SUCCESS' ? 'success' : 'failure'}",
                        "target_url": "${env.BUILD_URL}",
                        "description": "Validation ${currentBuild.currentResult}",
                        "context": "jenkins/package-validation"
                    }'
                """
            }
        }
    }
}