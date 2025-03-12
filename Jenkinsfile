pipeline {
    agent {
        docker { image 'node:22.12.0-bullseye-slim' }
    }
    environment {
        FAILED_STAGE=''
        JENKINS_PR_URL = sh(
            returnStdout: true,
            script: '''
                if [ "${CHANGE_URL}" ]; then
                    MATCH_URL="/projects"
                    API_URL="/rest/api/1.0"
                    ORIG_URL="${CHANGE_URL}"
                    BASE_URL="${ORIG_URL%%${MATCH_URL}*}"
                    PR_URL="${ORIG_URL##${BASE_URL}}"
                    PR_URL="${BASE_URL}${API_URL}${PR_URL%%/overview}"
                    echo "$PR_URL"
                else
                    echo ""
                fi
            '''
        ).trim()
    }
    stages {
        stage('Checkout'){
            steps {
                script {
                    FAILED_STAGE = 'Checkout'
                }
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                script {
                    FAILED_STAGE = 'Install dependencies'
                }
                script {
                    sh '''
                    apt-get update
                    apt-get install -y curl
                '''
                }
                sh 'npm install --no-save'
            }
        }
        stage('Build') {
            steps {
                script {
                    FAILED_STAGE = 'Build'
                }
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                script {
                    FAILED_STAGE = 'Test'
                }
                sh 'npm test'
            }
        }
        stage('Publish') {
            when {
                branch 'master'
            }
            steps {
                    script {
                        FAILED_STAGE = 'Publish'
                    }
                    sh 'npm run build'
                    sh 'npm pack'

                    script {
                    withCredentials([usernamePassword(credentialsId: 'nexus_admin', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        def packageJSON = readJSON file: 'package.json'
                        if (!packageJSON) {
                            error 'package.json not found or not readable'
                        }
                        def packageJSONVersion = packageJSON.version
                        if (!packageJSONVersion) {
                            error 'Version not found in package.json'
                        }
                        def ASSET = "trivir-ping-aic-lib-ts-${packageJSONVersion}.tgz"
                        if (!fileExists(ASSET)) {
                            error "Asset file ${ASSET} not found. Ensure 'npm pack' was successful."
                        }

                        echo 'Uploading to Nexus...'
                        sh """
            curl -u \$NEXUS_USER:\$NEXUS_PASS -X 'POST' \
            'https://nexus.trivir.com/service/rest/v1/components?repository=trivir-npm' \
            -H 'accept: application/json' \
            -H 'Content-Type: multipart/form-data' \
            -F 'npm.asset=@${ASSET};type=application/x-compressed'
        """
                    }
                    }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
        failure {
            echo "Failed pipeline at stage: ${FAILED_STAGE}. PR rejected. Please check logs for details."
            declinePR(FAILED_STAGE)
        }
    }
}

def declinePR(failure_stage) {
    if (!env.JENKINS_PR_URL) {
        echo 'PR URL not available. Skipping PR updates.'
        return
    }

    if (env.CHANGE_URL) {
        try {
            httpRequest(
                url: "${env.JENKINS_PR_URL}/participants/admin",
                contentType: 'APPLICATION_JSON',
                httpMode: 'PUT',
                authentication: 'bitbucket_admin',
                requestBody: '{ "user": { "name": "admin" }, "approved": false, "status": "NEEDS_WORK" }'
            )
        } catch (Exception e) {
            echo "Failed to update PR participant status: ${e.message}"
        }

        try {
            httpRequest(
                url: "${env.JENKINS_PR_URL}/comments",
                contentType: 'APPLICATION_JSON',
                httpMode: 'POST',
                authentication: 'bitbucket_admin',
                requestBody: "{ \"text\": \"Pipeline failed on: ${failure_stage}\" }"
            )
        } catch (Exception e) {
            echo "Failed to add comment to PR: ${e.message}"
        }
    }
}
