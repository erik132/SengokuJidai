var jwt = require('jsonwebtoken');
const url = require('url');
const connections = require('../database/connectionHolder.js');
const generalConst = require("../generalConstants.js");


const getServerList = ((req, res) => {
	console.log(req[generalConst.userIdField]);
	connections.query('SELECT id, name, state, map_name, map_file_name, current_players, max_players FROM games_view', async (err, rows, fields) => {
		if(err) {
            res.status(500).send('Internal server error');
            console.error(err);
            return;
        }
        res.render('serverList', { title: generalConst.appDisplayTitle, message: 'Login for war ', game_list: rows });
	});
	
});

const getGameBoard = ((req, res) => {
	console.log(req[generalConst.userIdField]);
	res.render('gameboard', { title: generalConst.appDisplayTitle });
});

const getCreateGame = ((req, res) => {
	const userId = req[generalConst.userIdField];
	const incomingId = req.query.id;
	if(incomingId){ //join existing
		const processedId = Number(incomingId);
		connections.execute('SELECT join_game(?, ?) AS id;', [processedId, userId], async (testErr, testRows, testFields) => {
			if(testErr){
				console.error(testErr);
				res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'database_error'} }));
				return;
			}
			console.log(testRows);
			if(testRows[0].id == null){
				res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'can_not_join_game'} }));
				return;
			}
			res.render('createGame', { title: generalConst.appDisplayTitle, msg: "Game joined successfully", game_id: processedId });
		});
	}else{ //create a game
		const incomingName = req.query.gamename;
		if(incomingName){
			const gameName = String(incomingName);
			console.log("the game name: " + gameName);
			connections.execute('SELECT create_game(?, ?) AS id;', [gameName, userId], async (gameErr, gameRows, gameFields) => {
				if(gameErr){
					console.log(gameErr);
					res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'database_rejected_game'} }));
	                return;
				}
				res.render('createGame', { title: generalConst.appDisplayTitle, msg: "Game created successfully", game_id: gameRows[0].id });
			});
			
		}else{
			res.redirect(url.format({pathname: generalConst.serverListPath, query: {reason: 'bad_game_name'} }));
		    return;
		}
		
	}
	
});

module.exports = {
	getServerList,
	getGameBoard,
	getCreateGame
}