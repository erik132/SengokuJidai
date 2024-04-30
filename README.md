This project is designed to be an educational project. It can be used for educational purposes, it may not be used for commercial purposes. This may change in the future.

If you forgot how to create a user in mysql, here it is. You also need all of the permissions below.

CREATE USER 'myUser'@'localhost' IDENTIFIED BY 'MyPassword';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, EXECUTE on sengoku_jidai.* TO 'myUser'@'localhost' WITH GRANT OPTION;