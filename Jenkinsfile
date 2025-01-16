pipeline {
    agent any

    stages {
        stage('Pull source') {
            steps {
                sshagent(['SSH-dannyho']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
                        cd /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface
                        git pull
                        rm /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/api/config.py || true
                        rm /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/api/Authentication/config.py || true
                        rm /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/apib_gptci-db-config.sql || true
                    "
                    '''
                }
            }
        }

        stage('Transfer config files') {
            steps {
                sshagent(['SSH-dannyho']) {
                    withCredentials([file(credentialsId: "API_Based_GPT_Chat_Interface_db_config", variable: 'dbConfig'),
                                     file(credentialsId: 'APIB_GPTCI_api_config', variable: 'apiSecretFile'),
                                     file(credentialsId: 'APIB_GPTCI_api_authentication_config', variable: 'apiAuthenticationSecretFile')]) {
                        sh '''
                        scp -o StrictHostKeyChecking=no -O $dbConfig dannyho@125.229.56.26:/volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/apib_gptci-db-config.sql
                        scp -o StrictHostKeyChecking=no -O $apiSecretFile dannyho@125.229.56.26:/volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/api/config.py
                        scp -o StrictHostKeyChecking=no -O $apiAuthenticationSecretFile dannyho@125.229.56.26:/volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/api/Authentication/config.py
                        '''
                    }
                }
            }
        }

        // stage('Build - DB') {
        //     steps {
        //         sshagent(['SSH-dannyho']) {
        //             withCredentials([usernamePassword(credentialsId: 'MariaDB-root', usernameVariable: 'dbUser', passwordVariable: 'dbPassword'),
        //                             file(credentialsId: "API_Based_GPT_Chat_Interface_db_config", variable: 'dbConfig')]) {
        //                 sh '''
        //                 ssh -o StrictHostKeyChecking=no dannyho@125.229.56.26 "
        //                     /usr/local/bin/mysql -u$dbUser -p$dbPassword -e 'SOURCE /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/db/create-table.sql'
        //                 "
        //                 '''
        //             }
        //         }
        //     }
        // }

        stage('Build - API & APP') {
            steps {
                sshagent(['SSH-root']) {
                        sh '''
                        ssh -o StrictHostKeyChecking=no root@125.229.56.26 "
                            cd /volume1/homes/dannyho/deployments/API_based-GPT-Chat-Interface/
                            /usr/local/bin/docker-compose down --rmi local || true
                            /usr/local/bin/docker-compose build
                            /usr/local/bin/docker-compose up -d --remove-orphans
                            /usr/local/bin/docker exec apib_gptci_app npm run build
                        "
                        '''
                }
            }
        }
    }
}
