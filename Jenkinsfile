stage('Strict Package Validation') {
    steps {
        script {
            // 1. Clone the reference repo
            dir('reference-repo') {
                git(
                    url: 'https://github.com/augnormsdevs/packages_validate.git',
                    credentialsId: 'github_credentials',
                    branch: 'main'
                )
            }

            // 2. Compare package versions
            def diffResult = sh(
                script: '''
                    diff -u \
                        reference-repo/reference-files/package-lock.json \
                        ./package-lock.json || true
                ''',
                returnStatus: true
            )

            // 3. Check banned packages
            def banned = sh(
                script: '''
                    grep -Ff reference-repo/reference-files/banned-packages.txt \
                        package.json || echo "No banned packages"
                ''',
                returnStdout: true
            ).trim()

            // 4. Fail pipeline if issues found
            if (diffResult != 0) {
                error("Package versions don't match reference!")
            }
            if (banned != "No banned packages") {
                error("Banned packages detected: ${banned}")
            }
        }
    }
}