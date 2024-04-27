If you forgot how to create a user in mysql, here it is. You also need all of the permissions below.

CREATE USER 'myUser'@'localhost' IDENTIFIED BY 'MyPassword';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, EXECUTE on sengoku_jidai.* TO 'myUser'@'localhost' WITH GRANT OPTION;