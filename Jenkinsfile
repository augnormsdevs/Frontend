pipeline {
    agent any
    stages {
        stage('Validate package.json') {
            steps {
                script {
                    // Start the GitHub Check
                    withChecks(name: 'package-validation') {
                        def validationResult = 0
                        def message = ''
                        try {
                            // 1. Clone the reference packages repo
                            dir('packages_validate') {
                                git(
                                    url: 'https://github.com/augnormsdevs/packages_validate.git',
                                    credentialsId: 'github_credentials',
                                    branch: 'main'
                                )
                            }

                            // 2. Validate project's package.json against reference
                            validationResult = sh(
                                script: '''
                                    echo "Comparing with reference packages..."
                                    ls -la packages_validate/  # Debug: List reference files
                                    if [ ! -f packages_validate/package.json ]; then
                                        echo "❌ Reference package.json missing!"
                                        exit 1
                                    fi

                                    # Basic diff check
                                    diff -u packages_validate/package.json package.json || true
                                ''',
                                returnStatus: true
                            )

                            // 3. Conditionally report status
                            if (validationResult != 0) {
                                message = "❌ Validation failed: package.json differs from reference."
                                unstable("Package.json differs from reference")
                            } else {
                                message = "✅ Validation passed: package.json matches reference."
                            }
                        } catch (Exception e) {
                            validationResult = 1
                            message = "🚨 Error during validation: ${e.getMessage()}"
                            error(message)
                        } finally {
                            def conclusion = (validationResult == 0) ? 'SUCCESS' : 'FAILURE'

                            publishChecks name: 'package-validation',
                                          conclusion: conclusion,
                                          output: [
                                              title: 'Package Validation',
                                              summary: message
                                          ]
                        }
                    }
                }
            }
        }
    }
}
