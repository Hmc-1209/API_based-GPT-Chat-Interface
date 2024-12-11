pipeline {
    agent any

    stages {
        stage('Build - API') {
            steps {
                withCredentials([file(credentialsId: 'APIB_GPTCI_api_config', variable: 'apiSecretFile'),
                                ]) {
                    sshagent(['SSH-dannyho']) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                            echo 'Testing Jenkins...'
                        "
                        '''
                    }
                }
            }
        }
    }
}