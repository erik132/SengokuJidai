DROP FUNCTION IF EXISTS create_game;
DROP FUNCTION IF EXISTS join_game;

DROP VIEW IF EXISTS games_view;
DROP VIEW IF EXISTS player_list_view;

DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS game_states;
DROP TABLE IF EXISTS maps;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS factions;



CREATE TABLE users(id INT UNIQUE AUTO_INCREMENT, name VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, PRIMARY KEY (id));
INSERT INTO users(name, password) VALUES('erik', '$2b$10$fLH61NVTfQu6Scuz6J4JNe8PIVGkhScvqWIlgfL18GsEJA3yJwLOa');
INSERT INTO users(name, password) VALUES('erik2', '$2b$10$5RO8UOMU5l9F5yfccafX7ulynQ0cH5QDqiTqzjZYjoYbN2seZXNpy');
INSERT INTO users(name, password) VALUES('erik3', '$2b$10$evaolD0oXGXV/96.SfG3f.jDin6fDa5NMwgS/tpH2btnjRH96QJyu');

CREATE TABLE games(id INT UNIQUE AUTO_INCREMENT, name VARCHAR(255) NOT NULL, state INT NOT NULL, map_id INT NOT NULL, max_players INT NOT NULL, PRIMARY KEY (id));
INSERT INTO games(name, state, map_id, max_players) VALUES('erik room', 1, 1, 2);
INSERT INTO games(name, state, map_id, max_players) VALUES('doom mode', 2, 1, 2);

CREATE TABLE maps(id INT UNIQUE NOT NULL, name VARCHAR(255) UNIQUE NOT NULL, file_name VARCHAR(255) NOT NULL);
INSERT INTO maps(id, name, file_name) VALUES(1, 'Grasslands', 'grasslands.jpg');

CREATE TABLE game_states(id INT UNIQUE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY (id));
INSERT INTO game_states(id, name) VALUES(1, 'waiting for players');
INSERT INTO game_states(id, name) VALUES(2, 'In Progress');
INSERT INTO game_states(id, name) VALUES(3, 'Concluded');

CREATE TABLE participants(user_id INT NOT NULL, game_id INT NOT NULL, UNIQUE KEY main_index(user_id, game_id));
INSERT INTO participants(user_id, game_id) VALUES(1,1);
INSERT INTO participants(user_id, game_id) VALUES(2,2);
INSERT INTO participants(user_id, game_id) VALUES(3,2);

CREATE TABLE factions(id INT UNIQUE, name VARCHAR(255) NOT NULL, color VARCHAR(255) NOT NULL);
INSERT INTO factions(id, name, color) VALUES(1, 'Takeda', 'Red');
INSERT INTO factions(id, name, color) VALUES(2, 'Date', 'Blue');

CREATE VIEW games_view AS SELECT g.id, g.name, count(p.user_id) AS current_players, g.max_players, gs.name AS state, m.name AS map_name, m.file_name AS map_file_name FROM participants p LEFT JOIN games g ON p.game_id=g.id LEFT JOIN game_states gs ON g.state=gs.id LEFT JOIN maps m ON g.map_id=m.id WHERE g.state IN (1,2) GROUP BY game_id;

CREATE VIEW player_list_view AS SELECT u.name AS player_name, p.game_id AS game_id FROM participants p LEFT JOIN users u ON p.user_id=u.id;

delimiter $$

CREATE FUNCTION create_game(game_name VARCHAR(255), user_id INT)
RETURNS INT
BEGIN
	DECLARE last_id INT;
	INSERT INTO games(name, state, map_id, current_players, max_players) VALUES(game_name, 1, 1, 1, 2);
	SELECT LAST_INSERT_ID() INTO last_id;
	INSERT INTO participants(user_id, game_id) VALUES(last_id, user_id);
	RETURN last_id;
END $$


#Player can join into a game that exists.
#Player can join into a game they are already part of and left at some point.
CREATE FUNCTION join_game(game_id INT, user_id INT)
RETURNS INT
BEGIN
	DECLARE game_state INT;
	DECLARE user_count INT;
	DECLARE max_players INT;
	DECLARE test_id INT;
	SELECT p.game_id INTO test_id FROM participants p where p.user_id=user_id AND p.game_id=game_id;
	SELECT g.state, g.max_players INTO game_state, max_players FROM games g WHERE id=game_id;

	IF(game_state IS NULL) THEN
		RETURN NULL;
	END IF;

	IF(test_id IS NULL) THEN
		SELECT count(*) INTO user_count FROM participants p WHERE p.game_id=game_id;

		IF(user_count < max_players) THEN
			INSERT INTO participants(user_id, game_id) VALUES(user_id, game_id);
		ELSE
			RETURN NULL;
		END IF;
	END IF;
	
	RETURN game_state;
END$$

delimiter ;