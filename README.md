# API based GPT chat interface
The OpenAI has provided an api for people needed to use the GPT by code/command. This allowed us to "pay as you go". This project is made to build a chatting interface with GPT using the api key that can be obtained from the OpenAI official webpage, so we don't have to pay $20 each month. To setup the project, you need to first clone the project then follow the steps below.



### Create database
##### Create a config file
-   Create a script called *apib_gptci-db-config.sql* in `api` folder, put the line in it: 
    ```
    SET @db_password = 'YOUR_PASSWORD_HERE';
    ```
##### Create table and user
-   Source the script *apib_gptci-db-config.sql* and *create-table.sql* with MySQL root identity to create the table and user.
There should be two users that has been created, the first one is `APIB_GPTCI_root` which can only be connected within localhost, and another being `APIB_GPTCI_admin` that can be connected from anywhere.