### Steps for create the database and it's tables

##### I. Create config file
Create the **apib_gptci_db-config.sql** file at the safe place, where normal user in your computer cannot get in touch with.

##### II. Fill in the config
The content in **apib_gptci-db-config.sql** should look like: 
```SET @db_password = "PASSWORD";```

##### III. Execute the command
Log into mysql CLI and execute the follow commands to create the table using root identity:
- SOURCE /PATH/TO/apib_gptci-db-config.sql;
- SOURCE /PATH/TO/create-table.sql;

If the output all shows `OK`, you're ready to go. If not, check the log and try to fix the issue. The version of mysql might also leads to the script to have outdated syntax, if that is the case, you'll probably need to find out the problem line and replace them.