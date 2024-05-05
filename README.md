This project is designed to be an educational project. It can be used for educational purposes, it may not be used for commercial purposes. If you wish to run this game server for your friends or for a wider community then it's fine as long as you do not earn any money from doing so and the original author is clearly visible.

If you forgot how to create a user in mysql, here it is. You also need all of the permissions below.

CREATE USER 'myUser'@'localhost' IDENTIFIED BY 'MyPassword';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, EXECUTE on sengoku_jidai.* TO 'myUser'@'localhost' WITH GRANT OPTION;