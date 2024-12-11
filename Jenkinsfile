pipeline {
    agent any

    stages {
        stage('Pull source') {
            steps {
                sshagent(['SSH-dannyho']) {
                    sh '''
                    ssh -v -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                        cd /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface
                        git pull
                    "
                    '''
                }
            }
        }

        stage('Transfer config files') {
            steps {
                sshagent(['SSH-dannyho']) {
                    withCredentials([file(credentialsId: "API_Based_GPT_Chat_Interface_db_config", variable: 'dbConfig'),
                                     file(credentialsId: 'APIB_GPTCI_api_config', variable: 'apiSecretFile')]) {
                        sh '''
                        scp -v -o StrictHostKeyChecking=no $dbConfig dannyho@125.229.56.26:/volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/apib_gptci-db-config.sql
                        '''
                    }
                }
            }
        }

        stage('Build - DB') {
            steps {
                sshagent(['SSH-dannyho']) {
                    withCredentials([usernamePassword(credentialsId: 'MariaDB-root', usernameVariable: 'dbUser', passwordVariable: 'dbPassword'),
                                    file(credentialsId: "API_Based_GPT_Chat_Interface_db_config", variable: 'dbConfig')]) {
                        sh '''
                        ssh -v -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                            /usr/local/bin/mysql -u$dbUser -p$dbPassword -e 'SOURCE /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/apib_gptci-db-config.sql'
                            /usr/local/bin/mysql -u$dbUser -p$dbPassword -e 'SOURCE /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/create-table.sql'
                        "
                        '''
                    }
                }
            }
        }

        stage('Build - API') {
            steps {
                sshagent(['SSH-dannyho']) {
                        sh '''
                        ssh -v -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                            echo 'Pending api build action here...'
                        "
                        '''
                }
            }
        }

        stage('Build - APP') {
            steps {
                sshagent(['SSH-dannyho']) {
                    sh '''
                    ssh -v -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                        echo 'Pending app build action here...'
                    "
                    '''
                }
            }
        }
    }
}