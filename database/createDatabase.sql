DROP PROCEDURE IF EXISTS ready_player;
DROP PROCEDURE IF EXISTS get_unit_states;

DROP FUNCTION IF EXISTS create_game;
DROP FUNCTION IF EXISTS join_game;
DROP FUNCTION IF EXISTS is_game_ready;

DROP VIEW IF EXISTS games_view;
DROP VIEW IF EXISTS player_list_view;
DROP VIEW IF EXISTS game_info_view;

DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS game_states;
DROP TABLE IF EXISTS maps;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS factions;
DROP TABLE IF EXISTS game_modes;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS unit_default_setup;



CREATE TABLE users(id INT UNIQUE AUTO_INCREMENT, name VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, PRIMARY KEY (id));
INSERT INTO users(name, password) VALUES('erik', '$2b$10$fLH61NVTfQu6Scuz6J4JNe8PIVGkhScvqWIlgfL18GsEJA3yJwLOa');
INSERT INTO users(name, password) VALUES('erik2', '$2b$10$5RO8UOMU5l9F5yfccafX7ulynQ0cH5QDqiTqzjZYjoYbN2seZXNpy');
INSERT INTO users(name, password) VALUES('erik3', '$2b$10$evaolD0oXGXV/96.SfG3f.jDin6fDa5NMwgS/tpH2btnjRH96QJyu');

CREATE TABLE games(id INT UNIQUE AUTO_INCREMENT, name VARCHAR(255) NOT NULL, state INT NOT NULL, map_id INT NOT NULL, max_players INT NOT NULL, mode_id INT NOT NULL, PRIMARY KEY (id));
INSERT INTO games(name, state, map_id, max_players, mode_id) VALUES('erik room', 1, 1, 2, 1);
INSERT INTO games(name, state, map_id, max_players, mode_id) VALUES('doom mode', 1, 1, 2, 1);

CREATE TABLE maps(id INT UNIQUE NOT NULL, name VARCHAR(255) UNIQUE NOT NULL, file_name VARCHAR(255) NOT NULL);
INSERT INTO maps(id, name, file_name) VALUES(1, 'Grasslands', 'grasslands.jpg');

CREATE TABLE game_modes(id INT UNIQUE, name VARCHAR(255) NOT NULL, size_x INT NOT NULL, size_y INT NOT NULL, PRIMARY KEY(id));
INSERT INTO game_modes(id, name, size_x, size_y) VALUES(1, 'Standard 1vs1', 8, 8);

CREATE TABLE game_states(id INT UNIQUE NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY (id));
INSERT INTO game_states(id, name) VALUES(1, 'waiting for players');
INSERT INTO game_states(id, name) VALUES(2, 'In Progress');
INSERT INTO game_states(id, name) VALUES(3, 'Concluded');

CREATE TABLE participants(user_id INT NOT NULL, game_id INT NOT NULL, is_ready TINYINT NOT NULL DEFAULT 0, faction_id INT NOT NULL DEFAULT 1, UNIQUE KEY main_index(user_id, game_id));
INSERT INTO participants(user_id, game_id, faction_id) VALUES(1,1,1);
INSERT INTO participants(user_id, game_id, faction_id) VALUES(2,2,1);
INSERT INTO participants(user_id, game_id, faction_id) VALUES(3,2,2);

CREATE TABLE factions(id INT UNIQUE, name VARCHAR(255) NOT NULL, color VARCHAR(255) NOT NULL, PRIMARY KEY(id));
INSERT INTO factions(id, name, color) VALUES(1, 'Takeda', 'Red');
INSERT INTO factions(id, name, color) VALUES(2, 'Date', 'Blue');

CREATE TABLE units(id INT UNIQUE, name VARCHAR(255) NOT NULL, img_file_name VARCHAR(255) NOT NULL, attack INT NOT NULL, range_attack INT DEFAULT NULL, defence_skill INT NOT NULL, armor INT NOT NULL, PRIMARY KEY(id));
INSERT INTO units(id, name, img_file_name, attack, defence_skill, armor) VALUES(1, 'Katana Samurai', 'katanaSamurai.jpg', 15, 15, 15);
INSERT INTO units(id, name, img_file_name, attack, defence_skill, armor) VALUES(2, 'Naginata Samurai', 'naginataSamurai.jpg', 12, 18, 15);
INSERT INTO units(id, name, img_file_name, attack, defence_skill, armor, range_attack) VALUES(3, 'Yumi Samurai', 'yumiSamurai.jpg', 7, 11, 13, 14);
INSERT INTO units(id, name, img_file_name, attack, defence_skill, armor) VALUES(4, 'Yari Ashigaru', 'yariAshigaru.jpg', 9, 10, 10);

#x and y coords start from 0 and the start point is the upper left corner of the gameboard
CREATE TABLE unit_default_setup(game_mode_id INT NOT NULL, unit_id INT NOT NULL, grid_x INT NOT NULL, grid_y INT NOT NULL, faction_id INT NOT NULL);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 1, 3, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 1, 4, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 2, 2, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 2, 5, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 4, 1, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 4, 6, 1, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 3, 2, 0, 1);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 3, 5, 0, 1);

INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 1, 3, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 1, 4, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 2, 2, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 2, 5, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 4, 1, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 4, 6, 6, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 3, 2, 7, 2);
INSERT INTO unit_default_setup(game_mode_id, unit_id, grid_x, grid_y, faction_id) VALUES(1, 3, 5, 7, 2);

#Turn those into a procedure.
#CREATE TABLE game_nr_2(unique_id INT UNIQUE AUTO_INCREMENT,unit_id INT NOT NULL, grid_x INT NOT NULL, grid_y INT NOT NULL, faction_id INT NOT NULL, health INT NOT NULL DEFAULT 100);
#INSERT INTO game_nr_2(unit_id, grid_x, grid_y, faction_id) SELECT unit_id, grid_x, grid_y, faction_id FROM unit_default_setup WHERE game_mode_id = 1;

CREATE VIEW games_view AS SELECT g.id, g.name, count(p.user_id) AS current_players, g.max_players, gs.name AS state, m.name AS map_name, m.file_name AS map_file_name, gm.name AS mode_name, gm.size_x, gm.size_y FROM participants p LEFT JOIN games g ON p.game_id=g.id LEFT JOIN game_states gs ON g.state=gs.id LEFT JOIN maps m ON g.map_id=m.id LEFT JOIN game_modes gm ON g.mode_id=gm.id WHERE g.state IN (1,2) GROUP BY game_id;

CREATE VIEW player_list_view AS SELECT u.name AS player_name, p.game_id AS game_id FROM participants p LEFT JOIN users u ON p.user_id=u.id;

CREATE VIEW game_info_view AS SELECT g.id, gm.size_x, gm.size_y, m.name AS map_name, m.file_name AS map_file_name FROM games g LEFT JOIN game_modes gm ON g.mode_id=gm.id LEFT JOIN maps m ON g.map_id=m.id;

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
	DECLARE lock_test INT;
	SELECT p.game_id INTO test_id FROM participants p where p.user_id=user_id AND p.game_id=game_id;
	SELECT g.state, g.max_players INTO game_state, max_players FROM games g WHERE id=game_id;

	IF(game_state IS NULL) THEN
		RETURN NULL;
	END IF;

	IF(test_id IS NULL) THEN
		SELECT GET_LOCK('participants_lock', 10) INTO lock_test;
		IF(lock_test <> 1) THEN
			RETURN NULL;
		END IF;
		SELECT count(*) INTO user_count FROM participants p WHERE p.game_id=game_id;

		IF(user_count < max_players) THEN
			INSERT INTO participants(user_id, game_id) VALUES(user_id, game_id);
			SELECT RELEASE_LOCK('participants_lock') INTO lock_test;
		ELSE
			SELECT RELEASE_LOCK('participants_lock') INTO lock_test;
			RETURN NULL;
		END IF;
	END IF;
	
	RETURN game_state;
END$$

CREATE PROCEDURE ready_player(game_id INT, user_id INT, readiness TINYINT)
BEGIN
	UPDATE participants p SET p.is_ready=readiness WHERE p.game_id=game_id AND p.user_id=user_id;
END$$


#Game starts when we the maximum allowed players are ready.
#Yes, rooms need to be full.
#Might revise this rule if 4 player FFA comes out.
CREATE FUNCTION is_game_ready(game_id INT)
RETURNS INT
BEGIN
	DECLARE readiness_count INT;
	DECLARE max_players INT;
	SELECT count(is_ready), IFNULL(g.max_players, 10000) INTO readiness_count, max_players FROM participants p RIGHT JOIN games g ON p.game_id=g.id WHERE p.game_id=game_id AND p.is_ready=1 AND g.state <> 3;


	IF(readiness_count = max_players) THEN
		UPDATE games SET state=2 WHERE id=game_id;
		RETURN 1;
	END IF;


	RETURN 0;
END$$

CREATE PROCEDURE get_unit_states(game_id INT)
BEGIN
	DECLARE dynamic_query TEXT;
	SET dynamic_query = CONCAT('SELECT gn.unique_id, gn.unit_id, u.name, u.img_file_name, gn.grid_x, gn.grid_y, gn.faction_id, f.name AS faction_name, gn.health FROM game_nr_', game_id, ' gn LEFT JOIN units u ON gn.unit_id=u.id LEFT JOIN factions f ON gn.faction_id=f.id;');
	PREPARE stmt1 FROM dynamic_query; 
	EXECUTE stmt1; 
	DEALLOCATE PREPARE stmt1;
END$$

delimiter ;