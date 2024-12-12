DROP DATABASE IF EXISTS API_Based_GPTCI;
DROP USER IF EXISTS 'APIB_GPTCI_root'@'localhost';
DROP USER IF EXISTS 'APIB_GPTCI_admin'@'%';


CREATE DATABASE API_Based_GPTCI;
Use API_Based_GPTCI;

SELECT @db_password;
-- Create root user
SET @sql = CONCAT('CREATE USER ''APIB_GPTCI_root''@''localhost'' IDENTIFIED BY ''', @db_password, ''';');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
GRANT ALL PRIVILEGES ON API_Based_GPTCI.* TO 'APIB_GPTCI_root'@'localhost';

-- Create admin user
SET @sql = CONCAT('CREATE USER ''APIB_GPTCI_admin''@''%'' IDENTIFIED BY ''', @db_password, ''';');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, EXECUTE, INDEX ON API_Based_GPTCI.* TO 'APIB_GPTCI_admin'@'%';

-- Create USER table
CREATE TABLE User
(
    user_id                         INT AUTO_INCREMENT PRIMARY KEY,
    name                            VARCHAR(50) NOT NULL UNIQUE,
    password                        VARCHAR(64) NOT NULL,
    api_key_encryption_key          VARCHAR(255)
);

-- Create ChatRecord table
CREATE TABLE ChatRecord
(
    record_id                        INT AUTO_INCREMENT PRIMARY KEY, 
    user_id                          INT NOT NULL, 
    chat_name                        VARCHAR(20) NOT NULL,
    created_at                       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at                       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);
