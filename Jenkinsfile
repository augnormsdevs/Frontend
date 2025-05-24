pipeline {
    agent any
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
                    unstable("Package.json differs from reference")  // Or 'error()' for hard fail
                }
            }
        }
    }
}